/* --- admin/src/App.js (Fortress Edition) --- */

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import ReactQuill from 'react-quill-new'; 
import 'react-quill-new/dist/quill.snow.css'; 
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { 
  LayoutGrid, FolderOpen, Radio, Settings, Search, Bell, 
  Trash2, ArrowUpRight, Database, Eye, PenTool, Save, Image as ImageIcon,
  HardDrive, CheckCircle2, Globe, Cpu, LogOut, Lock, UserPlus, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // For secure API calls

// --- CONFIGURATION ---
const isLocal = window.location.hostname === 'localhost';
const API_URL = isLocal ? 'http://localhost:5000' : '';
const SOCKET_URL = isLocal ? 'http://localhost:5000' : '/';
const socket = io(SOCKET_URL);

// --- AUTH UTILS ---
const setAuthToken = (token) => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
};

// ==========================================
// 🔐 AUTH SCREEN (LOGIN / FOUNDER SETUP)
// ==========================================
const AuthScreen = ({ onLogin }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'setup'
    const [founderExists, setFounderExists] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', mobile: '+91 ' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if the Throne is occupied
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
                // Founder Setup
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
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-md w-full"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-black tracking-tighter mb-2">ANKYY</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Command Center v2.0</p>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    
                    {/* Security Badge */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-indigo-500 to-gray-200"></div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                            <ShieldAlert size={14} /> {error}
                        </div>
                    )}

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

                    {/* Founder Switcher */}
                    {!founderExists && mode === 'login' && (
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400 mb-3">System Not Initialized.</p>
                            <button onClick={() => setMode('setup')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto">
                                <Lock size={12} /> Setup Founder Account (1/1)
                            </button>
                        </div>
                    )}
                </div>
                
                <p className="text-center text-[10px] text-gray-300 font-bold mt-8 uppercase tracking-widest">Secured by Ankyy Protocol</p>
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

// --- CMS EDITOR (Reused from previous, just updated API calls to use axios) ---
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

    useEffect(() => { loadPosts(); }, []);
    const loadPosts = () => axios.get(`${API_URL}/api/blog`).then(res => setPosts(res.data.data));

    const handleSave = async () => {
        if(!title) return;
        try {
            await axios.post(`${API_URL}/api/blog`, {
                _id: activePost?._id, title, content, slug, excerpt, status, featuredImage,
                tags: tags.split(',').map(t => t.trim()).filter(t => t)
            });
            onLog(`Saved: ${title}`, 'success'); setActivePost(null); loadPosts();
        } catch(e) { onLog('Save Failed', 'error'); }
    };
    
    // ... (Use same UI structure as previous, just compacted for brevity in this snippet. 
    // The key is it now uses `axios` which carries the Auth Token automatically)

    return (
        <div className="h-full flex flex-col">
            {!activePost ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => setActivePost({})} className="h-64 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors">
                        <PenTool size={32} className="mb-2" /> <span className="font-bold">New Story</span>
                    </button>
                    {posts.map(post => (
                        <div key={post._id} onClick={()=>{setActivePost(post); setTitle(post.title); setContent(post.content); setSlug(post.slug)}} className="h-64 bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer">
                            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${post.status==='published'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{post.status}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex justify-between mb-4">
                        <button onClick={()=>setActivePost(null)} className="font-bold text-sm text-gray-500">← Back</button>
                        <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm">Save</button>
                    </div>
                    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="text-4xl font-black mb-4 outline-none bg-transparent" />
                    <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-gray-200">
                        <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" />
                    </div>
                </div>
            )}
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
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;