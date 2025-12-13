/* --- admin/src/App.js (Fortress Edition + Image Fix) --- */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutGrid, FolderOpen, Radio, Settings, Search, Bell, 
  Trash2, ArrowUpRight, Database, Eye, PenTool, Save, Image as ImageIcon,
  HardDrive, CheckCircle2, Globe, Cpu, LogOut, Lock, UserPlus, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; 

// === PRODUCTION CONFIGURATION ===
// We hardcode this to ensure it always hits the live server
const API_URL = 'https://ankyy.com';
const SOCKET_URL = 'https://ankyy.com';
const socket = io(SOCKET_URL);

// --- AUTH UTILS ---
const setAuthToken = (token) => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
};

// --- HELPER: IMAGE URL FIXER ---
// This ensures images load on localhost by pulling them from the live server
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL
    return `https://ankyy.com${path}`; // Prepend domain for relative paths
};

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
            const res = await axios.post(`${API_URL}/api/upload`, formData);
            if (res.data.success) onUpload(res.data.url);
        } catch (error) { console.error("Upload failed", error); } 
        finally { setUploading(false); }
    };

    return (
        <div onClick={() => fileInputRef.current.click()} className="group relative w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-white">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            {uploading ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            ) : currentImage ? (
                <>
                    <img src={getImageUrl(currentImage)} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-black transition-colors">
                    <ImageIcon size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Upload Cover</span>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 🔐 AUTH SCREEN (LOGIN / FOUNDER SETUP)
// ==========================================
const AuthScreen = ({ onLogin }) => {
    const [mode, setMode] = useState('login'); 
    const [founderExists, setFounderExists] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', mobile: '+91 ' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/auth/status`).then(res => {
            setFounderExists(res.data.founderExists);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (mode === 'login') {
                const res = await axios.post(`${API_URL}/api/auth/login`, { username: formData.username, password: formData.password });
                if (res.data.success) {
                    setAuthToken(res.data.token);
                    localStorage.setItem('ankyy_token', res.data.token);
                    localStorage.setItem('ankyy_user', JSON.stringify(res.data.user));
                    onLogin(res.data.user);
                }
            } else {
                const res = await axios.post(`${API_URL}/api/auth/setup-founder`, formData);
                if (res.data.success) {
                    alert("Empire Initialized. Please Login.");
                    setMode('login');
                    setFounderExists(true);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Access Denied");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-black tracking-tighter mb-2">ANKYY</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Command Center v2.0</p>
                </div>
                <div className="bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-indigo-500 to-gray-200"></div>
                    {error && <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold"><ShieldAlert size={14} /> {error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'setup' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Full Name" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                                    <input required placeholder="Mobile (+91)" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all" value={formData.mobile} onChange={e=>setFormData({...formData, mobile: e.target.value})} />
                                </div>
                                <input required type="email" placeholder="Official Email" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                            </>
                        )}
                        <input required placeholder="Username" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} />
                        <input required type="password" placeholder="Passcode" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-black focus:outline-none transition-all" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                        <button disabled={loading} className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-transform active:scale-95 disabled:opacity-50">
                            {loading ? "Authenticating..." : mode === 'login' ? "Access Dashboard" : "Initialize Empire"}
                        </button>
                    </form>
                    {!founderExists && mode === 'login' && (
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <button onClick={() => setMode('setup')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto"><Lock size={12} /> Setup Founder Account (1/1)</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ==========================================
// 📄 DASHBOARD COMPONENTS
// ==========================================

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
    const menuItems = [
      { id: 'dashboard', label: 'Command Ctr', icon: LayoutGrid, role: 'founder' },
      { id: 'blog', label: 'Editorial', icon: PenTool, role: 'all' },
      { id: 'writers', label: 'Recruitment', icon: UserPlus, role: 'founder' },
      { id: 'live', label: 'Terminal', icon: Radio, role: 'founder' },
    ];
  
    return (
      <motion.nav initial={{x: -50}} animate={{x: 0}} className="fixed left-6 top-6 bottom-6 w-20 lg:w-64 bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[32px] flex flex-col justify-between z-50 overflow-hidden">
        <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold shadow-lg">A.</div>
                <div className="hidden lg:block">
                    <h1 className="font-bold text-lg text-gray-900 tracking-tight">Ankyy<span className="text-gray-400">.OS</span></h1>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{user.role === 'founder' ? 'Founder Access' : 'Writer Access'}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {menuItems.filter(i => i.role === 'all' || i.role === user.role).map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === item.id ? 'text-black bg-gray-100 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <item.icon size={20} /> <span className="hidden lg:block text-sm">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="p-6">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                <LogOut size={18} /> <span className="hidden lg:block text-sm font-bold">Disconnect</span>
            </button>
        </div>
      </motion.nav>
    );
};

// --- COMPONENT: WRITER MANAGER (Founder Only) ---
const WriterManager = () => {
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/create-writer`, formData);
            if(res.data.success) { alert("Writer ID Created!"); setFormData({name:'', username:'', password:''}); }
        } catch(e) { alert("Failed to create writer"); }
    };

    return (
        <div className="max-w-xl mx-auto pt-20">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Recruit Writer</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <input placeholder="Writer Name" className="w-full p-3 bg-gray-50 rounded-xl text-sm" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                    <input placeholder="Username (for login)" className="w-full p-3 bg-gray-50 rounded-xl text-sm" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} />
                    <input type="password" placeholder="Assign Password" className="w-full p-3 bg-gray-50 rounded-xl text-sm" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} />
                    <button className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm">Generate ID</button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENT: CMS EDITOR V2 (THE STUDIO) ---
const CMSEditor = ({ onLog }) => {
    const [posts, setPosts] = useState([]);
    const [activePost, setActivePost] = useState(null);
    
    // Editor State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [tags, setTags] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [status, setStatus] = useState('draft'); // 'draft' | 'published'
    const [featuredImage, setFeaturedImage] = useState('');

    useEffect(() => { loadPosts(); }, []);
    
    // Auto-generate slug from title (only for new posts)
    useEffect(() => {
        if (!activePost?._id && title && !slug) {
            setSlug(title.toLowerCase().trim().replace(/[\s\W-]+/g, '-'));
        }
    }, [title, slug, activePost]);

    const loadPosts = () => axios.get(`${API_URL}/api/blog`).then(res => setPosts(res.data.data));

    const handleEdit = (post) => {
        setActivePost(post); setTitle(post.title); setContent(post.content); 
        setSlug(post.slug); setTags(post.tags?.join(', ') || ''); 
        setExcerpt(post.excerpt || ''); setStatus(post.status); setFeaturedImage(post.featuredImage || '');
    };

    const handleNew = () => {
        setActivePost({ _id: null }); setTitle(''); setContent(''); 
        setSlug(''); setTags(''); setExcerpt(''); setStatus('draft'); setFeaturedImage('');
    };

    const handleSave = async () => {
        if(!title) return alert("Title is required");
        try {
            const payload = {
                _id: activePost._id, title, content, slug, excerpt, status, featuredImage,
                tags: tags.split(',').map(t => t.trim()).filter(t => t)
            };
            await axios.post(`${API_URL}/api/blog`, payload);
            onLog(`Saved: ${title}`, 'success');
            if(!activePost._id) setActivePost(null); // Return to list if new
            loadPosts();
        } catch(e) { onLog('Save Failed', 'error'); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if(!window.confirm("Delete this story?")) return;
        await axios.delete(`${API_URL}/api/blog/${id}`);
        loadPosts();
    };

    // --- VIEW 1: THE LIST (Grid of Stories) ---
    if (!activePost) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-end mb-8 px-2">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">The Studio</h2>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">Manage Empire Content</p>
                    </div>
                    <button onClick={handleNew} className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold shadow-xl shadow-gray-200 hover:scale-105 transition-transform flex items-center gap-2">
                        <PenTool size={14} /> New Story
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 custom-scrollbar overflow-y-auto pr-2">
                    {posts.map((post) => (
                        <div key={post._id} onClick={() => handleEdit(post)} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden flex flex-col h-[320px]">
                            {/* Image Area */}
                            <div className="h-40 bg-gray-50 relative overflow-hidden">
                                {post.featuredImage ? (
                                    <img src={getImageUrl(post.featuredImage)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-200 font-black text-4xl uppercase opacity-20">Ankyy</div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${post.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-500'}`}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                            {/* Content Area */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt || "No description provided."}</p>
                                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(post.date).toLocaleDateString()}</span>
                                    <button onClick={(e) => handleDelete(post._id, e)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- VIEW 2: THE EDITOR (Split Screen) ---
    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <header className="flex items-center justify-between py-3 mb-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 px-4 shadow-sm sticky top-0 z-30">
                <button onClick={() => setActivePost(null)} className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-2">
                    <ArrowUpRight size={16} className="rotate-[-135deg]" /> Back
                </button>
                <div className="flex items-center gap-4">
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        {status === 'published' ? 'Live on Site' : 'Draft Mode'}
                     </div>
                    <button onClick={handleSave} className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                        <Save size={14} /> Save Changes
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* LEFT: Writing Canvas */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 pb-0">
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Type your title here..." 
                            className="w-full text-4xl font-black text-gray-900 placeholder-gray-200 outline-none bg-transparent"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ReactQuill 
                            theme="snow" 
                            value={content} 
                            onChange={setContent} 
                            className="h-full"
                            modules={{
                                toolbar: [
                                    [{ 'header': [2, 3, false] }],
                                    ['bold', 'italic', 'blockquote', 'code-block'],
                                    [{'list': 'ordered'}, {'list': 'bullet'}],
                                    ['link', 'image', 'clean']
                                ]
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT: Inspector Panel */}
                <div className="w-80 flex-shrink-0 overflow-y-auto custom-scrollbar pb-10 space-y-5">
                    
                    {/* 1. Publishing Control */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Visibility</h4>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button onClick={()=>setStatus('draft')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status==='draft' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Draft</button>
                            <button onClick={()=>setStatus('published')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status==='published' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}>Public</button>
                        </div>
                    </div>

                    {/* 2. Cover Image */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cover Art</h4>
                        <ImageUploader currentImage={featuredImage} onUpload={setFeaturedImage} />
                    </div>

                    {/* 3. Metadata */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">URL Slug</label>
                            <div className="flex items-center bg-gray-50 rounded-xl px-3 border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">
                                <span className="text-gray-400 text-xs select-none">/</span>
                                <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full py-2.5 bg-transparent text-xs font-mono font-bold text-indigo-600 outline-none ml-1" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tags (Comma)</label>
                            <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tech, news" className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-50 border border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Excerpt</label>
                            <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="Short summary..." className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-medium text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-50 border border-transparent transition-all resize-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalFiles: 0, blogViews: 0, recentActivity: [], storageUsage: '0.0' });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('ankyy_token');
    const savedUser = localStorage.getItem('ankyy_user');
    if (token && savedUser) {
        setAuthToken(token);
        setUser(JSON.parse(savedUser));
    }

    socket.on('stats_update', setStats);
    socket.on('log', (data) => setLogs(prev => [{ msg: data.message, type: data.type, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 50)]));
    return () => { socket.off('stats_update'); socket.off('log'); };
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('ankyy_token');
      localStorage.removeItem('ankyy_user');
      setUser(null);
      setAuthToken(null);
  };

  if (!user) return <AuthScreen onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] font-sans selection:bg-black selection:text-white overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />
      <main className="pl-24 lg:pl-80 pr-6 py-6 h-screen overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && user.role === 'founder' && (
                <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} className="h-full">
                    <h1 className="text-4xl font-black mb-8">System Status</h1>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm"><h3 className="text-gray-400 font-bold uppercase text-xs">Total Views</h3><p className="text-5xl font-black mt-2">{stats.blogViews}</p></div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm"><h3 className="text-gray-400 font-bold uppercase text-xs">Storage</h3><p className="text-5xl font-black mt-2">{stats.storageUsage}MB</p></div>
                    </div>
                </motion.div>
            )}
            {activeTab === 'blog' && (
                <motion.div key="blog" initial={{opacity:0}} animate={{opacity:1}} className="h-full">
                    <CMSEditor onLog={(msg, type) => setLogs(p => [{msg, type, time: new Date().toLocaleTimeString()}, ...p])} />
                </motion.div>
            )}
            {activeTab === 'writers' && user.role === 'founder' && (
                <motion.div key="writers" initial={{opacity:0}} animate={{opacity:1}} className="h-full">
                    <WriterManager />
                </motion.div>
            )}
            {activeTab === 'live' && user.role === 'founder' && (
                 <motion.div key="live" initial={{opacity:0}} animate={{opacity:1}} className="bg-[#0f1115] text-gray-300 p-8 rounded-[32px] font-mono text-xs h-full flex flex-col shadow-2xl border border-gray-800">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
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