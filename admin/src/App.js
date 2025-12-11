/* --- admin/src/App.js --- */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis 
} from 'recharts';
import { 
  LayoutGrid, FolderOpen, Radio, Settings, Search, Bell, 
  Trash2, ArrowUpRight, Database, Eye, PenTool, Save, Image as ImageIcon,
  HardDrive, CheckCircle2, Globe, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION (UPDATED FOR LIVE SERVER) ---
// If we are on localhost, look for port 5000. 
// If we are on ankyy.com, use the relative path '/' which Nginx handles.
const isLocal = window.location.hostname === 'localhost';
const SOCKET_URL = isLocal ? 'http://localhost:5000' : '/';
const socket = io(SOCKET_URL);

// --- COMPONENT: GLASS CARD ---
const GlassCard = ({ children, className = "", delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay }}
        className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] ${className}`}
    >
        {children}
    </motion.div>
);

// --- COMPONENT: IMAGE UPLOADER ---
const ImageUploader = ({ currentImage, onUpload }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            // Updated to use the dynamic SOCKET_URL base for API calls too if needed, 
            // but standard fetch needs explicit path or proxy. 
            // Since Nginx proxies /api, we can just use '/api/upload' on live, 
            // but on localhost we need full URL.
            const apiBase = isLocal ? 'http://localhost:5000' : '';
            const res = await fetch(`${apiBase}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) onUpload(data.url);
        } catch (error) { console.error("Upload failed", error); } 
        finally { setUploading(false); }
    };

    return (
        <div onClick={() => fileInputRef.current.click()} className="group relative w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-gray-50">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            {uploading ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Uploading...</span>
                </div>
            ) : currentImage ? (
                <>
                    <img src={currentImage} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">Replace Image</span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-all">
                        <ImageIcon size={18} />
                    </div>
                    <span className="text-xs font-medium">Upload Cover Art</span>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: CMS EDITOR ---
const CMSEditor = ({ onLog }) => {
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [tags, setTags] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [status, setStatus] = useState('draft');
    const [featuredImage, setFeaturedImage] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const apiBase = isLocal ? 'http://localhost:5000' : '';

    useEffect(() => { loadPosts(); }, []);
    
    // --- UPDATED: AUTO-SLUG GENERATOR ---
    useEffect(() => {
        // Only auto-generate if we are editing a NEW post (no ID yet) 
        // AND we have a title AND the slug is currently empty.
        if ((!activePost?._id) && title && !slug) {
            const clean = title.toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, '-') // Replace spaces and special chars with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            setSlug(clean);
        }
    }, [title, slug, activePost]);

    const loadPosts = () => fetch(`${apiBase}/api/blog`).then(res => res.json()).then(d => d.success && setPosts(d.data));
    
    const handleEdit = (post) => {
        setActivePost(post); setTitle(post.title); setContent(post.content); setSlug(post.slug);
        setTags(post.tags ? post.tags.join(', ') : ''); 
        setExcerpt(post.excerpt || ''); setStatus(post.status); setFeaturedImage(post.featuredImage || '');
    };
    
    const handleNew = () => {
        setActivePost({ _id: null }); setTitle(''); setContent(''); setSlug(''); setTags(''); setExcerpt(''); setStatus('draft'); setFeaturedImage('');
    };

    const handleSave = async () => {
        if(!title) return alert("Title is required");
        try {
            const payload = {
                _id: activePost._id, title, content, slug, excerpt, status, featuredImage,
                tags: tags.split(',').map(t => t.trim()).filter(t => t)
            };
            const res = await fetch(`${apiBase}/api/blog`, {
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
            });
            if((await res.json()).success) {
                onLog(`Saved: ${title}`, 'success');
                setActivePost(null); loadPosts();
            }
        } catch(e) { onLog('Save Failed', 'error'); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if(!window.confirm("Permanently delete this post?")) return;
        await fetch(`${apiBase}/api/blog/${id}`, { method: 'DELETE' });
        loadPosts();
    };

    // --- LIST VIEW ---
    if (!activePost) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Editorial</h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">Manage SEO content and blog posts.</p>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNew} className="px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-gray-200 flex items-center gap-2 hover:bg-gray-900 transition-colors">
                        <PenTool size={16} /> New Story
                    </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 custom-scrollbar pr-2 overflow-y-auto">
                    {posts.map((post, i) => (
                        <GlassCard key={post._id} delay={i * 0.05} className="group cursor-pointer hover:border-indigo-400 transition-colors overflow-hidden flex flex-col h-[340px]">
                            <div onClick={() => handleEdit(post)} className="flex-1 flex flex-col h-full">
                                <div className="h-44 bg-gray-100 relative overflow-hidden">
                                    {post.featuredImage ? (
                                        <img src={post.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-white/20 shadow-sm ${post.status === 'published' ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-gray-600'}`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{post.excerpt || "No description provided."}</p>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Eye size={12} /> <span className="text-[10px] font-bold tabular-nums">{post.views || 0}</span>
                                        </div>
                                        <button onClick={(e) => handleDelete(post._id, e)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        );
    }

    // --- EDITOR VIEW ---
    return (
        <div className="h-full flex flex-col relative">
            {/* Toolbar */}
            <header className="flex items-center justify-between py-4 border-b border-gray-200 mb-6 sticky top-0 bg-[#F3F4F6]/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActivePost(null)} className="p-2 hover:bg-white rounded-xl text-gray-500 hover:text-gray-900 transition-all"><ArrowUpRight size={18} className="rotate-[-135deg]" /></button>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activePost._id ? 'Editing Post' : 'New Draft'}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl transition-colors ${isSidebarOpen ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Settings size={18} /></button>
                    <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-black/10">
                        <Save size={14} /> Save
                    </button>
                </div>
            </header>

            <div className="flex flex-1 gap-8 overflow-hidden">
                {/* Main Editor */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
                    <input 
                        className="text-4xl md:text-5xl font-black text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 w-full mb-8 leading-tight tracking-tight" 
                        placeholder="Untitled Story" 
                        value={title} onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />
                    <div className="prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:font-bold prose-headings:tracking-tight prose-img:rounded-2xl">
                        <ReactQuill 
                            theme="snow" 
                            value={content} 
                            onChange={setContent} 
                            modules={{ 
                                toolbar: [
                                    [{ 'header': [2, 3, false] }], 
                                    ['bold', 'italic', 'blockquote'], 
                                    [{'list': 'ordered'}, {'list': 'bullet'}], 
                                    ['link', 'image', 'clean']
                                ]
                            }} 
                        />
                    </div>
                </div>

                {/* Sidebar (Inspector) */}
                <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }} 
                    className="flex-shrink-0 overflow-y-auto custom-scrollbar pb-10"
                >
                    <div className="space-y-6 w-80">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Publishing Status</h4>
                            <div className="flex p-1 bg-gray-100 rounded-xl">
                                {['draft', 'published'].map(s => (
                                    <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${status === s ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>{s}</button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Cover Image</h4>
                            <ImageUploader currentImage={featuredImage} onUpload={setFeaturedImage} />
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Slug (URL)</h4>
                                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-3 py-2 bg-gray-50 rounded-lg text-xs font-mono text-indigo-600 border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Keywords (Comma separated)</h4>
                                <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tech, tutorial, update" className="w-full px-3 py-2 bg-gray-50 rounded-lg text-xs border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none transition-all" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Meta Description</h4>
                                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={4} className="w-full px-3 py-2 bg-gray-50 rounded-lg text-xs border border-transparent focus:bg-white focus:border-indigo-100 focus:outline-none resize-none transition-all" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- COMPONENT: SIDEBAR ---
const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
      { id: 'dashboard', label: 'Command Ctr', icon: LayoutGrid },
      { id: 'files', label: 'File System', icon: FolderOpen },
      { id: 'blog', label: 'Editorial', icon: PenTool },
      { id: 'live', label: 'Terminal', icon: Radio },
    ];
  
    return (
      <motion.nav initial={{x: -50, opacity: 0}} animate={{x: 0, opacity: 1}} className="fixed left-6 top-6 bottom-6 w-20 lg:w-64 bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[32px] flex flex-col justify-between z-50 overflow-hidden">
        <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-black/20">A.</div>
                <div className="hidden lg:block">
                    <h1 className="font-bold text-lg text-gray-900 tracking-tight leading-none">Ankyy<span className="text-gray-400">.OS</span></h1>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">v2.0 Empire</p>
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`relative group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'text-gray-900 bg-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                        <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
                        <span className="hidden lg:block font-semibold text-sm tracking-wide">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="p-6">
            <div className="p-4 bg-[#111] rounded-2xl text-white shadow-xl shadow-gray-900/20 relative overflow-hidden group cursor-pointer">
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold border border-white/10">AD</div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="text-xs font-bold truncate">Admin</p>
                        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Connected</p>
                    </div>
                </div>
            </div>
        </div>
      </motion.nav>
    );
};

// --- MAIN APP ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalFiles: 0, blogViews: 0, recentActivity: [], storageUsage: '0.0' });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('stats_update', setStats);
    socket.on('log', (data) => setLogs(prev => [{ msg: data.message, type: data.type, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 50)]));
    return () => { socket.off('stats_update'); socket.off('log'); };
  }, []);

  const addLog = (msg, type) => setLogs(p => [{msg, type, time: new Date().toLocaleTimeString()}, ...p]);

  const chartData = useMemo(() => {
    return stats.recentActivity.slice().reverse().map((f, i) => ({ 
      name: i, 
      size: parseFloat(f.size) || 0,
    }));
  }, [stats]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-200/50 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pl-24 lg:pl-80 pr-6 py-6 h-screen overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
        
        {/* === DASHBOARD === */}
        {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">Good Afternoon.</h2>
                        <p className="text-gray-500 font-medium">System status and performance metrics.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[500px] mb-8">
                    <GlassCard delay={0.1} className="md:col-span-3 md:row-span-2 p-8 flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6 z-10">
                            <div>
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Live Throughput</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-gray-900">{stats.storageUsage}</span>
                                    <span className="text-sm font-medium text-gray-400">MB Total</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full -ml-4 z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{backgroundColor:'#111', border:'none', borderRadius:'12px', color:'#fff', fontSize:'12px'}} />
                                    <Area type="monotone" dataKey="size" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorSize)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard delay={0.2} className="p-6 flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4"><Database size={20} /></div>
                        <div>
                            <span className="text-3xl font-black text-gray-900 block">{stats.totalFiles}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Converted</span>
                        </div>
                    </GlassCard>

                    <GlassCard delay={0.3} className="p-6 flex flex-col justify-between group hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><Eye size={20} /></div>
                        <div>
                            <span className="text-3xl font-black text-gray-900 block">{stats.blogViews}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Page Views</span>
                        </div>
                    </GlassCard>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Global Activity</h3>
                </div>
                
                <div className="space-y-3">
                    {stats.recentActivity.map((file, i) => (
                        <GlassCard key={file.id} delay={0.4 + (i*0.05)} className="p-4 flex items-center justify-between group hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${file.type === 'mp3' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {file.type.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm truncate w-40 md:w-96 group-hover:text-indigo-600 transition-colors">{file.title}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{new Date(file.date).toLocaleString()} • {file.size} MB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 flex items-center gap-1">
                                    <CheckCircle2 size={10} /> DONE
                                </span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </motion.div>
        )}

        {/* === FILES === */}
        {activeTab === 'files' && (
             <motion.div key="files" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="h-full bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-xl p-8 overflow-hidden flex flex-col">
                 <div className="flex justify-between items-center mb-8">
                     <h2 className="text-2xl font-bold text-gray-900">File System</h2>
                     <div className="flex gap-2">
                         <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-gray-500 border border-gray-200 shadow-sm">{stats.totalFiles} Items</span>
                     </div>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-50/90 backdrop-blur-md z-10">
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                                <th className="pb-3 pl-4">File Name</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Size</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3 text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentActivity.map(f => (
                                <tr key={f.id} className="group hover:bg-white/80 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400"><HardDrive size={14} /></div>
                                            <span className="font-bold text-gray-700 text-xs truncate max-w-[200px] group-hover:text-indigo-600">{f.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-4"><span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{f.type}</span></td>
                                    <td className="py-4 text-xs font-bold text-gray-500">{f.size} MB</td>
                                    <td className="py-4 text-[10px] text-gray-400">{new Date(f.date).toLocaleDateString()}</td>
                                    <td className="py-4 text-right pr-4">
                                        <button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             </motion.div>
        )}

        {/* === CMS === */}
        {activeTab === 'blog' && (
            <motion.div key="blog" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0}} className="h-full">
                <CMSEditor onLog={addLog} />
            </motion.div>
        )}

        {/* === TERMINAL === */}
        {activeTab === 'live' && (
            <motion.div key="live" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#0f1115] text-gray-300 p-8 rounded-[32px] font-mono text-xs h-full flex flex-col shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                    <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div><div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div><div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div></div>
                    <span className="text-gray-600 flex items-center gap-2"><Cpu size={12}/> root@ankyy-server:~</span>
                </div>
                <div className="flex-1 overflow-y-auto dark-scrollbar pr-2 space-y-2">
                    {logs.map((l, i) => (
                        <div key={i} className="flex gap-4 hover:bg-white/5 p-1 rounded px-2">
                            <span className="text-gray-600 shrink-0 w-20">{l.time}</span>
                            <span className={`${l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-blue-300'}`}>
                                {l.type === 'success' && '➜ '}
                                {l.msg}
                            </span>
                        </div>
                    ))}
                    <div className="animate-pulse text-gray-500 mt-2">_</div>
                </div>
            </motion.div>
        )}
        
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;