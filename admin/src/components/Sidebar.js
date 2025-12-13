import React from 'react';
import { LayoutDashboard, FileText, Users, Radio, Settings, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onLogout, role, isCollapsed, toggleSidebar }) => {
    const menu = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'blog', label: 'Articles', icon: FileText },
        { id: 'team', label: 'Team', icon: Users, role: 'founder' },
        { id: 'live', label: 'Terminal', icon: Radio, role: 'founder' },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <motion.aside 
            initial={false}
            animate={{ width: isCollapsed ? 84 : 280 }} 
            className="fixed left-4 top-4 bottom-4 z-50 flex flex-col justify-between rounded-[32px] border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-2xl bg-white/70 overflow-visible transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        >
            {/* AMBIENT GLOW BACKDROP */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            
            {/* TOGGLE BUTTON (Floating Jewel) */}
            <button 
                onClick={toggleSidebar}
                className="absolute -right-4 top-14 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-lg border border-white/50 z-50 hover:scale-110 transition-transform cursor-pointer"
            >
                {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
            </button>

            {/* === HEADER: BRANDING === */}
            <div className="relative pt-10 px-6 mb-8 flex items-center z-10">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white shadow-xl shadow-indigo-500/20 shrink-0 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
                    <Zap size={20} fill="currentColor" className="text-yellow-300" />
                    {/* Glowing dot */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                </div>

                {!isCollapsed && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.1 }}
                        className="ml-4"
                    >
                        <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">ANKYY<span className="text-indigo-600">.OS</span></h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Command Node</p>
                    </motion.div>
                )}
            </div>

            {/* === NAVIGATION: LIQUID MENU === */}
            <div className="relative flex-1 px-4 space-y-2 z-10 overflow-hidden hover:overflow-y-auto custom-scrollbar-hide">
                {menu.filter(i => !i.role || i.role === role).map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)} 
                            className={`relative w-full flex items-center py-4 rounded-2xl transition-all duration-300 group ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                        >
                            {/* THE LIQUID BACKGROUND (Framer Motion Magic) */}
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white rounded-2xl z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* ICON */}
                            <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110 transition-transform' : ''} />
                            </div>

                            {/* TEXT LABEL */}
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className={`relative z-10 ml-4 text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {/* ACTIVE INDICATOR (Right Side Glow) */}
                            {isActive && !isCollapsed && (
                                <motion.div 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1 }} 
                                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_10px_#4F46E5] z-10" 
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* === FOOTER: LOGOUT === */}
            <div className="relative p-4 z-10">
                <button 
                    onClick={onLogout} 
                    className={`w-full flex items-center py-4 rounded-2xl transition-all group hover:bg-red-50/50 hover:border hover:border-red-100 ${isCollapsed ? 'justify-center' : 'px-4'}`}
                >
                    <div className="text-slate-300 group-hover:text-red-500 transition-colors">
                        <LogOut size={20} strokeWidth={2.5} />
                    </div>
                    {!isCollapsed && (
                        <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-red-500 transition-colors">
                            Disconnect
                        </span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;