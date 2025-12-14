/* --- admin/src/pages/Articles.jsx --- */
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Plus, ArrowLeft, Search, Settings, Image as ImageIcon, 
    Globe, Hash, X, BarChart3, AlertCircle, CheckCircle2, 
    Sparkles, Copy, Share2, Twitter, Linkedin, Check, ChevronRight, Layout
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
            
            const res = await axios.post(`${API_URL}/api/blog`, payload);
            loadPosts();

            setLastSavedPost({
                ...payload,
                slug: res.data.slug || payload.slug
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
            <div className="h-20 px-8 flex items-center justify-between shrink-0 bg-white border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Content Engine</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="pl-10 pr-4 py-2 text-sm font-medium bg-slate-100 border-transparent rounded-lg w-64 outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400" placeholder="Search..." />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setActiveId(null); setManualSlug(false); setFormData({title:'', content:'', status:'draft', tags:'', slug:'', featuredImage:'', featuredImageAlt:'', featuredImageCaption:'', excerpt:''}); setView('editor'); }} 
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2"
                    >
                        <Plus size={16} /> New Post
                    </motion.button>
                </div>
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
                {posts.map((post) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={post._id} 
                        onClick={() => { setActiveId(post._id); setManualSlug(true); setFormData(post); setView('editor'); }}
                        className="group flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4 w-1/2">
                            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                {post.featuredImage ? (
                                    <img src={`${API_URL}${post.featuredImage}`} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={16}/></div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-800 truncate">{post.title}</h3>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">/{post.slug}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                                post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {post.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium w-20 text-right">{new Date(post.date).toLocaleDateString()}</span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    // --- VIEW 2: EDITOR (FULL SCREEN MODE) ---
    // Note: 'fixed inset-0 z-50' forces this over the Sidebar/Header
    return (
        <div className="fixed inset-0 z-50 flex h-full bg-white overflow-hidden">
            
            {/* SUCCESS MODAL (SEXIER VERSION) */}
            <AnimatePresence>
                {showSuccessModal && lastSavedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Deep Blur Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                            onClick={() => setShowSuccessModal(false)}
                        />
                        
                        {/* Modal Card with Glow */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/20"
                        >
                            {/* Ambient Glow behind card */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/20 blur-[60px] pointer-events-none"></div>

                            {/* Cinematic Header Image */}
                            <div className="h-44 bg-slate-100 relative group">
                                {lastSavedPost.featuredImage ? (
                                    <img src={`${API_URL}${lastSavedPost.featuredImage}`} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <div className="relative">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                                            <Sparkles size={10} className="fill-current" /> Published Live
                                        </span>
                                        <h2 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-md">{lastSavedPost.title}</h2>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 relative bg-white">
                                {/* URL Box */}
                                <div className="flex items-center gap-3 p-1.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 shadow-sm">
                                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-indigo-500 shadow-sm">
                                        <Globe size={16} />
                                    </div>
                                    <input 
                                        readOnly 
                                        value={`https://ankyy.com/blog/${lastSavedPost.slug}`} 
                                        className="flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none font-mono"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>

                                {/* Social Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(lastSavedPost.title)}&url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white hover:bg-slate-800 transition-all text-xs font-bold shadow-lg shadow-black/10"
                                    >
                                        <Twitter size={16} /> Share on X
                                    </a>
                                    <a 
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0077b5] text-white hover:bg-[#006097] transition-all text-xs font-bold shadow-lg shadow-[#0077b5]/20"
                                    >
                                        <Linkedin size={16} /> LinkedIn
                                    </a>
                                </div>
                                
                                <button 
                                    onClick={() => { setShowSuccessModal(false); setView('list'); }}
                                    className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors"
                                >
                                    Close & Return to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MAIN EDITOR AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* 1. SOLID HEADER */}
                <div className="h-16 border-b border-slate-200 bg-white z-40 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                             {formData.status === 'published' ? <span className="text-emerald-500 flex items-center gap-1">● Live</span> : <span className="text-amber-500 flex items-center gap-1">● Draft</span>}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* SEO Badge */}
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${seoStats.score > 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <BarChart3 size={14} />
                            <span className="text-[10px] font-bold">SEO {seoStats.score}</span>
                         </div>

                        <button onClick={() => setShowSidebar(!showSidebar)} className={`w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors ${showSidebar ? 'bg-slate-100 text-slate-900' : ''}`}>
                            <Settings size={18} />
                        </button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave} 
                            className={`px-6 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:shadow-lg ${
                                !activeId 
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/20' 
                                : 'bg-black hover:bg-slate-800'
                            }`}
                        >
                            {!activeId ? "Publish Article" : "Update Changes"}
                        </motion.button>
                    </div>
                </div>

                {/* 2. EDITOR BODY (Full Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div className="w-full max-w-5xl mx-auto px-8 py-12 pb-32">
                        <textarea 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Title..."
                            rows={1}
                            className="w-full text-5xl font-extrabold text-slate-900 placeholder:text-slate-200 outline-none resize-none bg-transparent mb-8 leading-tight overflow-hidden block tracking-tight font-display"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        
                        <div className="ghost-editor min-h-[60vh]">
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

            {/* RIGHT: SETTINGS SIDEBAR */}
            <AnimatePresence>
            {showSidebar && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: 340, opacity: 1 }} 
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-slate-200 bg-slate-50/50 backdrop-blur-md flex flex-col shrink-0 overflow-y-auto custom-scrollbar h-full z-10 shadow-2xl"
                >
                    <div className="p-6 space-y-8">
                        {/* SEO Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-500" /> Intelligence
                            </h3>
                            <button onClick={() => setShowSidebar(false)}><X size={14} className="text-slate-400 hover:text-slate-600"/></button>
                        </div>

                        {/* SEO Score Visual */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                             <div className="flex justify-between text-[10px] font-bold mb-3">
                                <span className="text-slate-400">Optimization Score</span>
                                <span className={seoStats.score > 80 ? 'text-emerald-600' : 'text-amber-600'}>{seoStats.score}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${seoStats.score}%` }}
                                    className={`h-full rounded-full ${seoStats.score > 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-amber-400 to-amber-600'}`} 
                                ></motion.div>
                            </div>
                            <div className="space-y-2">
                                {seoStats.issues.length === 0 ? (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                        <CheckCircle2 size={14} /> Perfect Optimization
                                    </div>
                                ) : (
                                    seoStats.issues.slice(0, 3).map((issue, i) => (
                                        <div key={i} className="flex items-start gap-2 text-[10px] text-slate-500 leading-tight">
                                            <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                            <span>{issue}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            {/* Image */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Cover Asset</label>
                                {formData.featuredImage ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={`${API_URL}${formData.featuredImage}`} className="w-full h-36 object-cover" alt="cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <button onClick={() => setFormData({...formData, featuredImage: ''})} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-2 border-t border-slate-100">
                                             <input 
                                                value={formData.featuredImageAlt} 
                                                onChange={e => setFormData({...formData, featuredImageAlt: e.target.value})}
                                                placeholder="Alt Text (SEO)..."
                                                className="w-full bg-transparent text-[10px] font-medium text-slate-700 outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-white hover:shadow-md transition-all cursor-pointer bg-white/50 group">
                                        <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            <ImageIcon size={18} className="text-indigo-500"/>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500">Upload Image</span>
                                        <input type="file" className="hidden" onChange={async (e) => {
                                            const f = e.target.files[0]; if(!f) return;
                                            const fd = new FormData(); fd.append('image', f);
                                            try { const r = await axios.post(`${API_URL}/api/upload`, fd); setFormData({...formData, featuredImage: r.data.url}); } catch {}
                                        }}/>
                                    </label>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Permalink</label>
                                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
                                    <div className="pl-3 pr-2 py-2.5 bg-slate-50 border-r border-slate-100 text-slate-400"><Globe size={14}/></div>
                                    <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full py-2.5 px-3 text-xs font-mono text-slate-600 outline-none" />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Meta Description</label>
                                <textarea 
                                    value={formData.excerpt} 
                                    onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                                    rows={4} 
                                    placeholder="Summarize for Google..."
                                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 resize-none transition-shadow" 
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Visibility</label>
                                <div className="relative">
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 pl-3 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none appearance-none">
                                        <option value="draft">Draft (Private)</option>
                                        <option value="published">Published (Public)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <ChevronRight size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default Articles;