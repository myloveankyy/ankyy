/* --- admin/src/pages/Articles.jsx --- */
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import axios from 'axios';
import { 
    Plus, ArrowLeft, Search, Settings, Image as ImageIcon, 
    Globe, Hash, X, BarChart3, AlertCircle, CheckCircle2, 
    Sparkles, LayoutTemplate, Type, FileText
} from 'lucide-react';

const API_URL = 'https://ankyy.com';

// --- HELPER: SEO ALGORITHM ---
const analyzeSEO = (data) => {
    let score = 0;
    const issues = [];
    const text = data.content.replace(/<[^>]*>/g, '');
    const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
    const keyword = data.title.split(' ').slice(0, 3).join(' ').toLowerCase(); // Crude main keyword detection

    // 1. Content Depth (Authority)
    if (wordCount > 300) score += 10;
    if (wordCount > 800) score += 15;
    if (wordCount > 1500) score += 5;
    if (wordCount < 300) issues.push("Content is too short (Thin Content)");

    // 2. Title Optimization
    if (data.title.length >= 40 && data.title.length <= 60) score += 15;
    else if (data.title.length > 60) issues.push("Title is too long (Google truncates >60 chars)");
    else issues.push("Title is too short");

    // 3. Structure (Google Spiders)
    if (data.content.includes('<h2>')) score += 10;
    else issues.push("Add H2 subheadings for structure");
    
    // 4. Metadata
    if (data.excerpt.length >= 120 && data.excerpt.length <= 160) score += 15;
    else issues.push("Meta description should be 120-160 chars");

    if (data.slug.length > 0 && !data.slug.includes(' ')) score += 10;
    else issues.push("Slug is invalid or empty");

    // 5. Asset Optimization
    if (data.featuredImage) {
        score += 10;
        if (data.featuredImageAlt) score += 10;
        else issues.push("Missing Alt Text for cover image");
    } else {
        issues.push("No featured image set");
    }

    return { score: Math.min(score, 100), issues, wordCount };
};

const Articles = () => {
    const [view, setView] = useState('list');
    const [posts, setPosts] = useState([]);
    
    // Extended Form Data for SEO
    const [formData, setFormData] = useState({ 
        title: '', content: '', slug: '', tags: '', 
        status: 'draft', featuredImage: '', featuredImageAlt: '', featuredImageCaption: '', excerpt: '' 
    });
    
    const [activeId, setActiveId] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [seoStats, setSeoStats] = useState({ score: 0, issues: [], wordCount: 0 });
    const [manualSlug, setManualSlug] = useState(false); // Track if user manually edited slug

    useEffect(() => { loadPosts(); }, []);

    // Real-time SEO Analysis
    useEffect(() => {
        setSeoStats(analyzeSEO(formData));
    }, [formData]);

    // Auto-Slug Logic
    useEffect(() => {
        if (!manualSlug && !activeId && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, manualSlug, activeId]);

    const loadPosts = () => axios.get(`${API_URL}/api/blog`).then(res => setPosts(res.data.data)).catch(console.error);

    const handleSave = async () => {
        if(!formData.title) return alert("Title required");
        try {
            // Split tags string into array
            const tagsArray = typeof formData.tags === 'string' 
                ? formData.tags.split(',').map(t => t.trim()).filter(t => t) 
                : formData.tags;

            const payload = { ...formData, tags: tagsArray, _id: activeId };
            
            await axios.post(`${API_URL}/api/blog`, payload);
            loadPosts();
            // In a real app, use a Toast notification here instead of alert
        } catch(e) { alert("Save failed"); }
    };

    // --- VIEW 1: DATA GRID (List) ---
    if (view === 'list') return (
        <div className="flex flex-col h-full bg-white">
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Posts</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input className="pl-9 pr-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md w-64 outline-none focus:border-indigo-500 transition-all" placeholder="Search articles..." />
                    </div>
                    <button 
                        onClick={() => { setActiveId(null); setManualSlug(false); setFormData({title:'', content:'', status:'draft', tags:'', slug:'', featuredImage:'', featuredImageAlt:'', featuredImageCaption:'', excerpt:''}); setView('editor'); }} 
                        className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-2"
                    >
                        <Plus size={14} /> New Post
                    </button>
                </div>
            </div>

            <div className="flex items-center px-6 py-2 bg-slate-50 border-b border-slate-200">
                <div className="w-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</div>
                <div className="w-1/6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</div>
                <div className="w-1/6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</div>
                <div className="w-1/6 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Views</div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {posts.map((post) => (
                    <div 
                        key={post._id} 
                        onClick={() => { setActiveId(post._id); setManualSlug(true); setFormData(post); setView('editor'); }}
                        className="group flex items-center px-6 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <div className="w-1/2 pr-4">
                            <h3 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 truncate transition-colors">{post.title}</h3>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{post.slug}</p>
                        </div>
                        <div className="w-1/6">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                                {post.status}
                            </span>
                        </div>
                        <div className="w-1/6 text-xs text-slate-500 font-medium">{new Date(post.date).toLocaleDateString()}</div>
                        <div className="w-1/6 text-right text-xs text-slate-500 font-medium">{post.views || 0}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- VIEW 2: SEO STUDIO EDITOR ---
    return (
        <div className="flex h-full bg-white overflow-hidden">
            {/* LEFT: MAIN WRITING AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Navigation Bar */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 bg-white/95 backdrop-blur-sm z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200"></div>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                             {formData.status === 'draft' ? 'Draft Mode' : 'Live'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                         {/* Mini SEO Score displayed in header */}
                         <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 border ${seoStats.score > 80 ? 'border-emerald-200 text-emerald-600' : 'border-slate-200 text-slate-500'}`}>
                            <BarChart3 size={12} />
                            <span className="text-[10px] font-bold">SEO {seoStats.score}/100</span>
                         </div>

                        <button onClick={() => setShowSidebar(!showSidebar)} className={`p-2 rounded hover:bg-slate-100 text-slate-500 ${showSidebar ? 'bg-slate-100 text-slate-900' : ''}`}>
                            <Settings size={18} />
                        </button>
                        <button onClick={handleSave} className="bg-black hover:bg-slate-800 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors">
                            Update
                        </button>
                    </div>
                </div>

                {/* Editor Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    <div className="w-full max-w-5xl px-10 py-10">
                        {/* Title Input */}
                        <textarea 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Post Title"
                            rows={1}
                            className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 outline-none resize-none bg-transparent mb-6 leading-tight overflow-hidden block"
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        
                        {/* Editor */}
                        <div className="ghost-editor">
                            <ReactQuill 
                                theme="snow"
                                value={formData.content} 
                                onChange={c => setFormData({...formData, content:c})}
                                placeholder="Write something amazing..."
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
            {showSidebar && (
                <div className="w-80 border-l border-slate-200 bg-slate-50/50 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                    
                    {/* SEO SCORECARD (Top of Sidebar) */}
                    <div className="p-5 border-b border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-500" /> SEO Audit
                            </h3>
                            <button onClick={() => setShowSidebar(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                        </div>
                        
                        {/* Score Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className="text-slate-500">Optimization</span>
                                <span className={seoStats.score > 80 ? 'text-emerald-600' : 'text-amber-600'}>{seoStats.score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${seoStats.score > 80 ? 'bg-emerald-500' : seoStats.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${seoStats.score}%`}}></div>
                            </div>
                        </div>

                        {/* Issue List */}
                        <div className="space-y-2">
                            {seoStats.issues.length === 0 ? (
                                <div className="flex items-center gap-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 p-2 rounded">
                                    <CheckCircle2 size={12} /> Content looks great!
                                </div>
                            ) : (
                                seoStats.issues.slice(0, 3).map((issue, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10px] text-slate-500">
                                        <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                        <span>{issue}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-5 space-y-8">
                        {/* ASSET MANAGEMENT (SEO Optimized) */}
                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-2 block">Cover Asset</label>
                            {formData.featuredImage ? (
                                <div className="space-y-3">
                                    <div className="relative group rounded-md overflow-hidden border border-slate-200 shadow-sm">
                                        <img src={`${API_URL}${formData.featuredImage}`} className="w-full h-32 object-cover" alt="cover" />
                                        <button onClick={() => setFormData({...formData, featuredImage: '', featuredImageAlt: '', featuredImageCaption: ''})} className="absolute top-1 right-1 bg-white p-1 rounded shadow-sm text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                    </div>
                                    {/* Advanced Image SEO Fields */}
                                    <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</label>
                                            <input 
                                                value={formData.featuredImageAlt} 
                                                onChange={e => setFormData({...formData, featuredImageAlt: e.target.value})}
                                                placeholder="Describe image for SEO..."
                                                className="w-full bg-transparent text-xs text-slate-700 outline-none border-b border-transparent focus:border-indigo-300 placeholder:text-slate-300 py-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Caption</label>
                                            <input 
                                                value={formData.featuredImageCaption} 
                                                onChange={e => setFormData({...formData, featuredImageCaption: e.target.value})}
                                                placeholder="Visible caption..."
                                                className="w-full bg-transparent text-xs text-slate-700 outline-none border-b border-transparent focus:border-indigo-300 placeholder:text-slate-300 py-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-slate-300 rounded-md hover:bg-white hover:border-indigo-400 transition-all cursor-pointer">
                                    <ImageIcon size={20} className="text-slate-300 mb-2"/>
                                    <span className="text-[10px] font-medium text-slate-500">Upload Image</span>
                                    <input type="file" className="hidden" onChange={async (e) => {
                                        const f = e.target.files[0]; if(!f) return;
                                        const fd = new FormData(); fd.append('image', f);
                                        try { const r = await axios.post(`${API_URL}/api/upload`, fd); setFormData({...formData, featuredImage: r.data.url}); } catch {}
                                    }}/>
                                </label>
                            )}
                        </div>

                        {/* URL (Auto-Generated) */}
                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-2 block">Slug</label>
                            <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500">
                                <div className="pl-3 pr-2 text-slate-400"><Globe size={12}/></div>
                                <input 
                                    value={formData.slug} 
                                    onChange={e => { setFormData({...formData, slug: e.target.value}); setManualSlug(true); }} 
                                    className="w-full py-2 text-xs text-slate-600 outline-none font-mono"
                                />
                            </div>
                        </div>

                        {/* META EXCERPT (Hook) */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-semibold text-slate-700 block">Meta Hook</label>
                                <span className={`text-[10px] font-bold ${formData.excerpt.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{formData.excerpt.length}/160</span>
                            </div>
                            <textarea 
                                value={formData.excerpt}
                                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                                rows={3}
                                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-md outline-none focus:border-indigo-500 resize-none"
                                placeholder="Write a click-worthy summary for Google..."
                            />
                        </div>

                        {/* TAGS */}
                        <div>
                            <label className="text-xs font-semibold text-slate-700 mb-2 block">Keywords (Tags)</label>
                            <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500">
                                <div className="pl-3 pr-2 text-slate-400"><Hash size={12}/></div>
                                <input 
                                    value={formData.tags} 
                                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                                    placeholder="News, Tech..."
                                    className="w-full py-2 text-xs text-slate-600 outline-none"
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                             <label className="text-xs font-semibold text-slate-700 mb-2 block">Visibility</label>
                             <select 
                                value={formData.status} 
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-indigo-500"
                             >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                             </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Articles;