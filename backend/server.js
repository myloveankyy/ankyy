/* --- backend/server.js (Ankyy Brand Edition + Auth Fortress) --- */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http'); 
const { Server } = require('socket.io'); 
const mongoose = require('mongoose'); 
const multer = require('multer');
const bcrypt = require('bcryptjs'); // New: Encryption
const jwt = require('jsonwebtoken'); // New: Tokens

// --- CONFIGURATION ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/musicbox'; 
const JWT_SECRET = process.env.JWT_SECRET || 'ankyy_empire_secret_key_999'; // Change this in Production

const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';
const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN || 'http://localhost:3001';

// --- APP & SERVER SETUP ---
const app = express();
const server = http.createServer(app); 

const ALLOWED_ORIGINS = [
    FRONTEND_DOMAIN, ADMIN_DOMAIN,
    "http://localhost:3000", "http://localhost:3001",
    "https://ankyy.com", "https://www.ankyy.com"
];

const io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] }
});

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- STATIC PATHS ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// --- STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- MONGODB ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected (Brand DB)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS ---

// 1. USER SCHEMA (The Gatekeeper)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['founder', 'writer'], default: 'writer' },
    createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    excerpt: String, featuredImage: String, tags: [String],
    status: { type: String, default: 'draft' }, 
    views: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    author: { type: String, default: 'Ankyy' } // New: Track who wrote it
});

const UserModel = mongoose.model('User', UserSchema);
const BlogModel = mongoose.model('Blog', BlogSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- HELPER: CLEAN SLUG ---
const cleanSlug = (text) => text ? text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '') : '';

// --- SOCKET.IO ---
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
            totalFiles: 0, storageUsage: "0.0", blogViews: totalViews, recentActivity: [] 
        });
    } catch(e) {}
};

// ======================================================
// 🔐 AUTH ROUTES (IRON FORTRESS)
// ======================================================

// CHECK: Is the Throne Empty? (Returns true if no founder exists)
app.get('/api/auth/status', async (req, res) => {
    try {
        const founderCount = await UserModel.countDocuments({ role: 'founder' });
        res.json({ success: true, founderExists: founderCount > 0 });
    } catch (e) { res.status(500).json({ success: false }); }
});

// SETUP: Claim the Throne (Only works if founder count is 0)
app.post('/api/auth/setup-founder', async (req, res) => {
    try {
        const founderCount = await UserModel.countDocuments({ role: 'founder' });
        if (founderCount > 0) return res.status(403).json({ success: false, message: "Throne Occupied. Protocol Locked." });

        const { name, username, email, mobile, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newFounder = new UserModel({
            name, username, email, mobile,
            password: hashedPassword,
            role: 'founder'
        });
        await newFounder.save();
        res.json({ success: true, message: "Empire Initialized. Welcome, Founder." });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// LOGIN: Issue Access Token
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ success: true, token, user: { name: user.name, role: user.role } });
        } else {
            res.status(403).json({ success: false, message: "Invalid Credentials" });
        }
    } catch (e) { res.status(500).json({ success: false }); }
});

// CREATE WRITER: Founder Only Action
app.post('/api/auth/create-writer', authenticateToken, async (req, res) => {
    if (req.user.role !== 'founder') return res.sendStatus(403);
    try {
        const { name, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const writer = new UserModel({
            name, username, email: `${username}@ankyy.internal`, mobile: '0000000000',
            password: hashedPassword, role: 'writer'
        });
        await writer.save();
        res.json({ success: true, message: "Writer Recruited." });
    } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

// ======================================================
// 📝 BLOG API (Protected)
// ======================================================

app.post('/api/upload', upload.single('image'), (req, res) => {
    if(!req.file) return res.status(400).json({ success: false });
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

app.post('/api/blog', authenticateToken, async (req, res) => {
    try {
        const { _id, title, content, slug, tags, excerpt, status, featuredImage } = req.body;
        let finalSlug = cleanSlug(slug || title);
        if (!finalSlug) finalSlug = `post-${Date.now()}`;

        if (_id) {
            await BlogModel.findByIdAndUpdate(_id, {
                title, content, slug: finalSlug, tags, excerpt, status, featuredImage, date: new Date()
            });
        } else {
            const post = new BlogModel({ 
                title, content, slug: finalSlug, tags, excerpt, status, featuredImage,
                author: req.user.name 
            });
            await post.save();
        }
        io.to('admin_room').emit('log', { message: `Post Saved by ${req.user.name}`, type: 'success' });
        emitStats();
        res.json({ success: true });
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
        const post = await BlogModel.findOne({ slug: req.params.slug });
        if(post) { post.views += 1; await post.save(); res.json({ success: true, data: post }); }
        else { res.status(404).json({ success: false }); }
    } catch (e) { res.status(500).json({ success: false }); }
});

app.delete('/api/blog/:id', authenticateToken, async (req, res) => {
    try {
        await BlogModel.findByIdAndDelete(req.params.id);
        emitStats();
        res.json({ success: true });
    } catch(e) { res.status(500).json({ success: false }); }
});

app.get('/api/history', (req, res) => res.json({ success: true, data: [], storage: "0.0" }));

// 🗺️ SITEMAP ENGINE
app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = 'https://ankyy.com';
        const posts = await BlogModel.find({ status: 'published' }).select('slug date').sort({ date: -1 });
        let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url><url><loc>${baseUrl}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`;
        posts.forEach(post => {
            const safeDate = post.date ? new Date(post.date).toISOString() : new Date().toISOString();
            xml += `<url><loc>${baseUrl}/blog/${post.slug}</loc><lastmod>${safeDate}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        });
        xml += `</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (e) { res.status(500).end(); }
});

server.listen(PORT, () => console.log(`🚀 Ankyy Server & Fortress running on Port ${PORT}`));