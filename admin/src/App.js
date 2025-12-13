import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Team from './pages/Team';
import Settings from './pages/Settings';
import { Search, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const contentPadding = isSidebarCollapsed ? 'pl-[120px]' : 'pl-[320px]';

    return (
        <div className="flex h-screen bg-[#F1F5F9] font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            
            {/* AMBIENT BACKGROUND */}
            <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[80px] pointer-events-none z-0" />

            {/* FIXED SIDEBAR */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={logout} 
                role={user?.role} 
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            
            {/* SCROLLABLE MAIN CONTENT AREA */}
            <main 
                className={`flex-1 h-screen overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] relative z-10 flex flex-col ${contentPadding}`}
            >
                {/* STICKY HEADER */}
                <header className="h-24 pr-8 flex items-center justify-between z-40 sticky top-0">
                    <div className="flex items-center gap-3 text-slate-400 bg-white/70 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/60 shadow-sm transition-all hover:bg-white/90 hover:scale-[1.01] focus-within:ring-2 focus-within:ring-indigo-100">
                        <Search size={18} />
                        <input placeholder="Type to search..." className="bg-transparent outline-none text-xs font-bold text-slate-600 w-56 placeholder:text-slate-400" />
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="relative p-3 bg-white/70 backdrop-blur-xl rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm border border-white/60 transition-all hover:scale-110">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-200/50">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-slate-800 leading-none tracking-tight">{user?.name || 'Commander'}</p>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1.5">{user?.role || 'Admin'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[2px] shadow-lg shadow-indigo-500/30">
                                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-sm text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-violet-600">
                                    {user?.name?.[0] || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE PAGE CONTENT */}
                <div className="flex-1 pr-4 pb-8 relative min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab} 
                            initial={{ opacity: 0, scale: 0.98, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.98, y: -10 }} 
                            transition={{ duration: 0.3, ease: "easeOut" }} 
                            // Removed overflow-hidden here to let content grow and trigger the main scrollbar
                            className="min-h-full rounded-[32px] bg-white/50 backdrop-blur-md border border-white/60 shadow-sm"
                        >
                            {activeTab === 'dashboard' && <Dashboard user={user} />}
                            {activeTab === 'blog' && <Articles />}
                            {activeTab === 'team' && <Team />}
                            {activeTab === 'settings' && <Settings user={user} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AuthWrapper />
        </AuthProvider>
    );
};

const AuthWrapper = () => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#F1F5F9]">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    return user ? <MainLayout /> : <AuthScreen />;
};

export default App;