/* --- admin/src/pages/Articles.jsx --- */
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Plus, ArrowLeft, Search, Settings, Image as ImageIcon, 
    Globe, Hash, X, BarChart3, AlertCircle, CheckCircle2, 
    Sparkles, Copy, Share2, Twitter, Linkedin, Check, ChevronRight
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

    // --- VIEW 2: EDITOR (FIXED LAYOUT) ---
    return (
        <div className="flex h-full bg-white relative overflow-hidden">
            
            {/* SUCCESS MODAL (Improved Z-Index & Design) */}
            <AnimatePresence>
                {showSuccessModal && lastSavedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Darker Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setShowSuccessModal(false)}
                        />
                        
                        {/* Modal Card */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/10"
                        >
                            {/* Cinematic Header Image */}
                            <div className="h-40 bg-slate-100 relative group">
                                {lastSavedPost.featuredImage ? (
                                    <img src={`${API_URL}${lastSavedPost.featuredImage}`} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{lastSavedPost.title}</h2>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 pt-5">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="bg-emerald-500 text-white p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
                                    <span className="text-sm font-bold text-emerald-600">Successfully Published</span>
                                </div>
                                
                                {/* URL Box */}
                                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg mb-6 shadow-inner">
                                    <div className="p-2 bg-white rounded border border-slate-200 text-slate-400">
                                        <Globe size={14} />
                                    </div>
                                    <input 
                                        readOnly 
                                        value={`https://ankyy.com/blog/${lastSavedPost.slug}`} 
                                        className="flex-1 bg-transparent text-xs font-medium text-slate-600 outline-none font-mono"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>

                                {/* Social Actions */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(lastSavedPost.title)}&url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black text-white hover:bg-slate-800 transition-all text-xs font-bold"
                                    >
                                        <Twitter size={14} /> Post to X
                                    </a>
                                    <a 
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ankyy.com/blog/${lastSavedPost.slug}`)}`}
                                        target="_blank" rel="noreferrer"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-all text-xs font-bold"
                                    >
                                        <Linkedin size={14} /> LinkedIn
                                    </a>
                                </div>
                                
                                <button 
                                    onClick={() => { setShowSuccessModal(false); setView('list'); }}
                                    className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-800 transition-colors"
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
                
                {/* 1. SOLID HEADER (No Blur, No Transparency) */}
                <div className="h-16 border-b border-slate-200 bg-white z-40 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                             {formData.status === 'published' ? <span className="text-emerald-500">● Live</span> : <span className="text-amber-500">● Draft</span>}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* SEO Badge */}
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${seoStats.score > 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <BarChart3 size={14} />
                            <span className="text-[10px] font-bold">SEO {seoStats.score}</span>
                         </div>

                        <button onClick={() => setShowSidebar(!showSidebar)} className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors ${showSidebar ? 'bg-slate-100 text-slate-900' : ''}`}>
                            <Settings size={18} />
                        </button>
                        
                        <button 
                            onClick={handleSave} 
                            className={`px-6 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:shadow-lg ${
                                !activeId 
                                ? 'bg-indigo-600 hover:bg-indigo-700' 
                                : 'bg-black hover:bg-slate-800'
                            }`}
                        >
                            {!activeId ? "Publish" : "Update"}
                        </button>
                    </div>
                </div>

                {/* 2. EDITOR BODY (Aligned Padding) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    {/* Aligned container: px-8 matches header px-8 */}
                    <div className="w-full max-w-5xl mx-auto px-8 py-10">
                        <textarea 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Post Title"
                            rows={1}
                            className="w-full text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 outline-none resize-none bg-transparent mb-6 leading-tight overflow-hidden block"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        
                        <div className="ghost-editor min-h-[60vh]">
                            <ReactQuill 
                                theme="snow"
                                value={formData.content} 
                                onChange={c => setFormData({...formData, content:c})}
                                placeholder="Start writing..."
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
                    animate={{ width: 320, opacity: 1 }} 
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-y-auto custom-scrollbar h-full z-10"
                >
                    {/* Sidebar Content (Same as before, just cleaner wrapper) */}
                    <div className="p-6 space-y-6">
                        {/* SEO Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Settings</h3>
                            <button onClick={() => setShowSidebar(false)}><X size={14} className="text-slate-400 hover:text-slate-600"/></button>
                        </div>

                        {/* SEO Score Visual */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <div className="flex justify-between text-[10px] font-bold mb-2">
                                <span className="text-slate-400">SEO Health</span>
                                <span className={seoStats.score > 80 ? 'text-emerald-600' : 'text-amber-600'}>{seoStats.score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div className={`h-full rounded-full ${seoStats.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${seoStats.score}%`}}></div>
                            </div>
                            <div className="space-y-1">
                                {seoStats.issues.slice(0, 3).map((issue, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10px] text-slate-500 leading-tight">
                                        <AlertCircle size={10} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span>{issue}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            {/* Image */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Cover Image</label>
                                {formData.featuredImage ? (
                                    <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                                        <img src={`${API_URL}${formData.featuredImage}`} className="w-full h-32 object-cover" alt="cover" />
                                        <button onClick={() => setFormData({...formData, featuredImage: ''})} className="absolute top-2 right-2 bg-white/90 p-1 rounded shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                        <input 
                                            value={formData.featuredImageAlt} 
                                            onChange={e => setFormData({...formData, featuredImageAlt: e.target.value})}
                                            placeholder="Alt Text..."
                                            className="w-full p-2 text-xs border-t border-slate-200 outline-none"
                                        />
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-white transition-all cursor-pointer">
                                        <ImageIcon size={16} className="text-slate-300"/>
                                        <span className="text-[10px] font-bold text-slate-400 mt-1">Upload</span>
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
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Slug</label>
                                <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-indigo-500" />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Meta Description</label>
                                <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={3} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 resize-none" />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Visibility</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
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