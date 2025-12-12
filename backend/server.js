/* --- backend/server.js (Ankyy Brand Edition + Sitemap Engine) --- */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http'); 
const { Server } = require('socket.io'); 
const mongoose = require('mongoose'); 
const multer = require('multer');

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musicbox'; 
const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN || 'http://localhost:3001';
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';

// --- APP & SERVER SETUP ---
const app = express();
const server = http.createServer(app); 

// Allow connections from Brand Sites
const ALLOWED_ORIGINS = [
    FRONTEND_DOMAIN, 
    ADMIN_DOMAIN,
    "http://localhost:3000", 
    "http://localhost:3001",
    "https://ankyy.com",
    "https://www.ankyy.com"
];

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- STATIC PATHS ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// --- IMAGE UPLOAD STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- MONGODB CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected (Brand DB)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS ---
const FileSchema = new mongoose.Schema({
    id: Number, title: String, filename: String, type: String, 
    date: { type: Date, default: Date.now }, size: String
});

const BlogSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    excerpt: String, 
    featuredImage: String,
    tags: [String],
    status: { type: String, default: 'draft' }, 
    views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const FileModel = mongoose.model('File', FileSchema);
const BlogModel = mongoose.model('Blog', BlogSchema);

// --- HELPER: CLEAN SLUG ---
const cleanSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') 
        .replace(/^-+|-+$/g, ''); 
};

// --- SOCKET.IO (For Admin Connectivity) ---
io.on('connection', (socket) => {
    const origin = socket.handshake.headers.origin;
    if(origin && (origin.includes('3001') || origin.includes('admin') || origin.includes('ankyy.com'))) {
        socket.join('admin_room'); 
    }
    emitStats();
});

const emitStats = async () => {
    try {
        const totalViewsAgg = await BlogModel.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);
        const totalViews = totalViewsAgg[0]?.total || 0;
        
        io.to('admin_room').emit('stats_update', {
            totalFiles: 0, 
            storageUsage: "0.0",
            blogViews: totalViews,
            recentActivity: [] 
        });
    } catch(e) {}
};

// ======================================================
// API ROUTES
// ======================================================

app.post('/api/upload', upload.single('image'), (req, res) => {
    if(!req.file) return res.status(400).json({ success: false });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});

app.post('/api/blog', async (req, res) => {
    try {
        const { _id, title, content, slug, tags, excerpt, status, featuredImage } = req.body;
        let finalSlug = cleanSlug(slug || title);
        if (!finalSlug) finalSlug = `post-${Date.now()}`;

        let post;
        if (_id) {
            post = await BlogModel.findByIdAndUpdate(_id, {
                title, content, slug: finalSlug, tags, excerpt, status, featuredImage, date: new Date()
            }, { new: true });
        } else {
            post = new BlogModel({ title, content, slug: finalSlug, tags, excerpt, status, featuredImage });
            await post.save();
        }
        io.to('admin_room').emit('log', { message: `Post Saved: ${title}`, type: 'success' });
        emitStats();
        res.json({ success: true, data: post });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/blog', async (req, res) => {
    try {
        const posts = await BlogModel.find().sort({ date: -1 });
        res.json({ success: true, data: posts });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.get('/api/blog/:slug', async (req, res) => {
    try {
        let post = await BlogModel.findOne({ slug: req.params.slug });
        if (!post) {
            const cleaned = cleanSlug(req.params.slug);
            post = await BlogModel.findOne({ slug: cleaned });
        }
        if(post) {
            post.views += 1;
            await post.save();
            res.json({ success: true, data: post });
        } else {
            res.status(404).json({ success: false });
        }
    } catch (e) { res.status(500).json({ success: false }); }
});

app.delete('/api/blog/:id', async (req, res) => {
    try {
        await BlogModel.findByIdAndDelete(req.params.id);
        emitStats();
        res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false }); }
});

app.get('/api/history', (req, res) => res.json({ success: true, data: [], storage: "0.0" }));

// ======================================================
// 🗺️ AUTOMATED SITEMAP ENGINE (NEW)
// ======================================================
app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = 'https://ankyy.com';
        // 1. Get all PUBLISHED posts
        const posts = await BlogModel.find({ status: 'published' }).select('slug date').sort({ date: -1 });

        // 2. Start XML Structure
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
`;

        // 3. Loop through Blogs
        posts.forEach(post => {
            const safeDate = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
            xml += `    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${safeDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
`;
        });

        // 4. Close XML & Send
        xml += `</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (e) {
        console.error("Sitemap Error:", e);
        res.status(500).end();
    }
});

server.listen(PORT, () => console.log(`🚀 Ankyy Brand Server running on Port ${PORT}`));