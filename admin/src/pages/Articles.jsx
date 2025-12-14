/* --- admin/src/pages/Articles.jsx --- */
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion'; // Smooth Animations
import { 
    Plus, ArrowLeft, Search, Settings, Image as ImageIcon, 
    Globe, Hash, X, BarChart3, AlertCircle, CheckCircle2, 
    Sparkles, Copy, ExternalLink, Share2, Twitter, Linkedin, Check
} from 'lucide-react';

const API_URL = 'https://ankyy.com';

// --- HELPER: SEO ALGORITHM ---
const analyzeSEO = (data) => {
    let score = 0;
    const issues = [];
    const text = data.content.replace(/<[^>]*>/g, '');
    const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;

    // 1. Content Depth
    if (wordCount > 300) score += 10;
    if (wordCount > 800) score += 15;
    if (wordCount > 1500) score += 5;
    if (wordCount < 300) issues.push("Content is too short (Thin Content)");

    // 2. Title Optimization
    if (data.title.length >= 40 && data.title.length <= 60) score += 15;
    else if (data.title.length > 60) issues.push("Title > 60 chars (Google truncates)");
    else issues.push("Title is too short");

    // 3. Structure
    if (data.content.includes('<h2>')) score += 10;
    else issues.push("Add H2 subheadings");
    
    // 4. Metadata
    if (data.excerpt.length >= 120 && data.excerpt.length <= 160) score += 15;
    else issues.push("Meta description should be 120-160 chars");

    if (data.slug.length > 0 && !data.slug.includes(' ')) score += 10;

    // 5. Assets
    if (data.featuredImage) {
        score += 10;
        if (data.featuredImageAlt) score += 10;
    } else {
        issues.push("No featured image");
    }

    return { score: Math.min(score, 100), issues, wordCount };
};

const Articles = () => {
    const [view, setView] = useState('list');
    const [posts, setPosts] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({ 
        title: '', content: '', slug: '', tags: '', 
        status: 'draft', featuredImage: '', featuredImageAlt: '', featuredImageCaption: '', excerpt: '' 
    });
    
    const [activeId, setActiveId] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [seoStats, setSeoStats] = useState({ score: 0, issues: [], wordCount: 0 });
    const [manualSlug, setManualSlug] = useState(false);
    
    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastSavedPost, setLastSavedPost] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => { loadPosts(); }, []);

    // Real-time SEO
    useEffect(() => { setSeoStats(analyzeSEO(formData)); }, [formData]);

    // Auto-Slug
    useEffect(() => {
        if (!manualSlug && !activeId && formData.title) {
            const slug = formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, manualSlug, activeId]);

    const loadPosts = () => axios.get(`${API_URL}/api/blog`).then(res => setPosts(res.data.data)).catch(console.error);

    const handleSave = async () => {
        if(!formData.title) return alert("Title required");
        try {
            const tagsArray = typeof formData.tags === 'string' 
                ? formData.tags.split(',').map(t => t.trim()).filter(t => t) 
                : formData.tags;

            const payload = { ...formData, tags: tagsArray, _id: activeId };
            
            // If it's a new post (no activeId) force status to published if user selected it
            // Logic: Save to DB
            const res = await axios.post(`${API_URL}/api/blog`, payload);
            
            // Refresh List
            loadPosts();

            // Set Data for Modal
            setLastSavedPost({
                ...payload,
                slug: res.data.slug || payload.slug // Ensure we get the final slug from server if it changed
            });
            setShowSuccessModal(true);

        } catch(e) { alert("Save failed"); }
    };

    const copyToClipboard = () => {
        const url = `https://ankyy.com/blog/${lastSavedPost.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- VIEW 1: DATA GRID (List) ---
    if (view === 'list') return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="h-20 px-8 flex items-center justify-between shrink-0 bg-white border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content</h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">Manage your empire's knowledge base.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input className="pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg w-72 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" placeholder="Search articles..." />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setActiveId(null); setManualSlug(false); setFormData({title:'', content:'', status:'draft', tags:'', slug:'', featuredImage:'', featuredImageAlt:'', featuredImageCaption:'', excerpt:''}); setView('editor'); }} 
                        className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2"
                    >
                        <Plus size={16} /> Create New
                    </motion.button>
                </div>
            </div>

            {/* Table Header */}
            <div className="flex items-center px-8 py-3 bg-white border-b border-slate-100">
                <div className="w-1/2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Article Info</div>
                <div className="w-1/6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
                <div className="w-1/6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published</div>
                <div className="w-1/6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Traffic</div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
                {posts.map((post) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={post._id} 
                        onClick={() => { setActiveId(post._id); setManualSlug(true); setFormData(post); setView('editor'); }}
                        className="group flex items-center px-6 py-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="w-1/2 pr-4 flex items-center gap-4">
                            {post.featuredImage && (
                                <img src={`${API_URL}${post.featuredImage}`} className="w-10 h-10 rounded-md object-cover border border-slate-100" alt="" />
                            )}
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">/{post.slug}</p>
                            </div>
                        </div>
                        <div className="w-1/6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                                {post.status}
                            </span>
                        </div>
                        <div className="w-1/6 text-xs text-slate-500 font-medium">{new Date(post.date).toLocaleDateString()}</div>
                        <div className="w-1/6 text-right text-xs text-slate-500 font-medium">{post.views || 0}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    // --- VIEW 2: SEO STUDIO EDITOR ---
    return (
        <div className="flex h-full bg-white relative">
            
            {/* SUCCESS MODAL (Global Overlay) */}
            <AnimatePresence>
                {showSuccessModal && lastSavedPost && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
                        >
                            {/* Modal Header Image */}
                            <div className="h-32 bg-slate-100 relative">
                                {lastSavedPost.featuredImage ? (
                                    <img src={`${API_URL}${lastSavedPost.featuredImage}`} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white/50">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <button onClick={() => setShowSuccessModal(false)} className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Successfully Published
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight mb-4">{lastSavedPost.title}</h2>
                                
                                {/* Link Copy Box */}
                                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                                    <Globe size={16} className="text-slate-400 ml-1" />
                                    <input 
                                        readOnly 
                                        value={`https://ankyy.com/blog/${lastSavedPost.slug}`} 
                                        className="flex-1 bg-transparent text-xs text-slate-600 outline-none font-mono"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`p-2 rounded-md transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'}`}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(lastSavedPost.title)}&url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all text-xs font-bold"
                                    >
                                        <Twitter size={16} /> Share on X
                                    </a>
                                    <a 
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all text-xs font-bold"
                                    >
                                        <Linkedin size={16} /> LinkedIn
                                    </a>
                                </div>
                                
                                <button 
                                    onClick={() => { setShowSuccessModal(false); setView('list'); }}
                                    className="w-full mt-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT: MAIN WRITING AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Navigation Bar */}
                <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/80 backdrop-blur-xl z-20 sticky top-0 transition-all">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200"></div>
                        <span className="text-xs font-medium flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-600">
                             <div className={`w-1.5 h-1.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                             {formData.status === 'draft' ? 'Draft Mode' : 'Live'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* Mini SEO Score displayed in header */}
                         <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${seoStats.score > 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <BarChart3 size={14} />
                            <span className="text-[10px] font-bold">SEO {seoStats.score}/100</span>
                         </div>

                        <button onClick={() => setShowSidebar(!showSidebar)} className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors ${showSidebar ? 'bg-slate-100 text-slate-900' : ''}`}>
                            <Settings size={18} />
                        </button>
                        
                        {/* THE SMART ACTION BUTTON */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave} 
                            className={`px-5 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-lg ${
                                !activeId 
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30' 
                                : 'bg-slate-900 hover:bg-black hover:shadow-slate-500/30'
                            }`}
                        >
                            {!activeId ? "Publish Article" : "Update Changes"}
                        </motion.button>
                    </div>
                </div>

                {/* Editor Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div className="w-full max-w-4xl mx-auto px-10 py-12">
                        {/* Title Input */}
                        <textarea 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Post Title"
                            rows={1}
                            className="w-full text-5xl font-extrabold text-slate-900 placeholder:text-slate-200 outline-none resize-none bg-transparent mb-8 leading-tight overflow-hidden block font-display tracking-tight"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        
                        {/* Editor */}
                        <div className="ghost-editor min-h-[50vh]">
                            <ReactQuill 
                                theme="snow"
                                value={formData.content} 
                                onChange={c => setFormData({...formData, content:c})}
                                placeholder="Tell your story..."
                                modules={{
                                    toolbar: [
                                        [{ 'header': [2, 3, false] }],
                                        ['bold', 'italic', 'blockquote', 'code-block', 'link'],
                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                        ['image', 'clean']
                                    ]
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: SEO & METADATA SIDEBAR */}
            <AnimatePresence>
            {showSidebar && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: 320, opacity: 1 }} 
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col shrink-0 overflow-y-auto custom-scrollbar h-full shadow-xl shadow-slate-200/50 z-10"
                >
                    
                    {/* SEO SCORECARD */}
                    <div className="p-6 border-b border-slate-100 bg-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                <Sparkles size={14} className="text-indigo-500" /> SEO Intelligence
                            </h3>
                            <button onClick={() => setShowSidebar(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                        </div>
                        
                        {/* Score Bar */}
                        <div className="mb-5">
                            <div className="flex justify-between text-[10px] font-bold mb-2">
                                <span className="text-slate-400">Optimization Level</span>
                                <span className={seoStats.score > 80 ? 'text-emerald-600' : 'text-amber-600'}>{seoStats.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${seoStats.score}%` }}
                                    className={`h-full rounded-full transition-all duration-500 ${seoStats.score > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : seoStats.score > 50 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-red-500'}`} 
                                ></motion.div>
                            </div>
                        </div>

                        {/* Issue List */}
                        <div className="space-y-2.5">
                            {seoStats.issues.length === 0 ? (
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                    <CheckCircle2 size={14} /> Ready to Rank!
                                </div>
                            ) : (
                                seoStats.issues.slice(0, 4).map((issue, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-100 shadow-sm">
                                        <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span>{issue}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* ASSET MANAGEMENT */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Cover Asset</label>
                            {formData.featuredImage ? (
                                <div className="space-y-3">
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={`${API_URL}${formData.featuredImage}`} className="w-full h-36 object-cover" alt="cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        <button onClick={() => setFormData({...formData, featuredImage: '', featuredImageAlt: '', featuredImageCaption: ''})} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                            <X size={14} />
                                        </button>
                                    </div>
                                    {/* Advanced Image SEO Fields */}
                                    <div className="space-y-3 bg-white p-3 rounded-lg border border-slate-100">
                                        <div>
                                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Alt Text (Critical for SEO)</label>
                                            <input 
                                                value={formData.featuredImageAlt} 
                                                onChange={e => setFormData({...formData, featuredImageAlt: e.target.value})}
                                                placeholder="Describe image..."
                                                className="w-full bg-slate-50 text-xs text-slate-700 outline-none border border-slate-200 rounded px-2 py-1.5 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 group">
                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <ImageIcon size={18} className="text-indigo-500"/>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500">Click to Upload</span>
                                    <input type="file" className="hidden" onChange={async (e) => {
                                        const f = e.target.files[0]; if(!f) return;
                                        const fd = new FormData(); fd.append('image', f);
                                        try { const r = await axios.post(`${API_URL}/api/upload`, fd); setFormData({...formData, featuredImage: r.data.url}); } catch {}
                                    }}/>
                                </label>
                            )}
                        </div>

                        {/* URL */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Permalink</label>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-sm">
                                <div className="pl-3 pr-2 text-slate-400 bg-slate-50 h-full py-2.5 border-r border-slate-100"><Globe size={14}/></div>
                                <input 
                                    value={formData.slug} 
                                    onChange={e => { setFormData({...formData, slug: e.target.value}); setManualSlug(true); }} 
                                    className="w-full py-2.5 px-3 text-xs text-slate-600 outline-none font-mono"
                                />
                            </div>
                        </div>

                        {/* META EXCERPT */}
                        <div>
                            <div className="flex justify-between mb-2.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meta Description</label>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${formData.excerpt.length > 160 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>{formData.excerpt.length}/160</span>
                            </div>
                            <textarea 
                                value={formData.excerpt}
                                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                rows={3}
                                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none transition-all shadow-sm"
                                placeholder="A powerful hook for search results..."
                            />
                        </div>

                        {/* TAGS */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Keywords</label>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-sm">
                                <div className="pl-3 pr-2 text-slate-400"><Hash size={14}/></div>
                                <input 
                                    value={formData.tags} 
                                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                                    placeholder="Comma separated..."
                                    className="w-full py-2.5 text-xs text-slate-600 outline-none"
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Status</label>
                             <select 
                                value={formData.status} 
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-300 shadow-sm"
                             >
                                <option value="draft">Draft (Private)</option>
                                <option value="published">Published (Public)</option>
                             </select>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default Articles;