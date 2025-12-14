/* --- admin/src/pages/Dashboard.jsx --- */
import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Users, FileText, Globe, Cpu, TrendingUp, Sparkles, Activity, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// --- SUB-COMPONENTS ---
const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div 
        whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
        className="bg-white p-6 rounded-[24px] border border-slate-100 relative overflow-hidden group transition-all"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50`}></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                <Icon size={22} strokeWidth={2.5} />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100">
                    <TrendingUp size={10} /> {trend}
                </span>
            )}
        </div>
        
        <div className="relative z-10">
            <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1">{label}</h3>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </motion.div>
);

const ActionButton = ({ icon: Icon, label, color }) => (
    <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group w-full text-left"
    >
        <div className={`w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
            <Icon size={18} />
        </div>
        <div>
            <span className="block text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{label}</span>
            <span className="block text-[10px] text-slate-400 font-medium">Quick Access</span>
        </div>
        <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </motion.button>
);

// --- MAIN DASHBOARD ---
const Dashboard = ({ user }) => {
    // Mock Data (Simulating Real Traffic)
    const data = [
        {name:'Mon', v:4000}, {name:'Tue', v:3000}, {name:'Wed', v:5000}, 
        {name:'Thu', v:2780}, {name:'Fri', v:1890}, {name:'Sat', v:2390}, {name:'Sun', v:3490}
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/10">
                    <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
                    <p className="text-lg font-bold flex items-center gap-2">
                        {payload[0].value.toLocaleString()} <span className="text-[10px] bg-indigo-500 px-1.5 py-0.5 rounded text-white">Views</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-6 lg:p-10 h-full overflow-y-auto custom-scrollbar bg-slate-50/50"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Command Center <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">v2.4</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">System Status: <span className="text-emerald-500 font-bold">● Operational</span></p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                        <Globe size={14} className="text-indigo-500" /> Ankyy.com
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Users} label="Active Users" value="14,203" trend="+12%" color="indigo" />
                <StatCard icon={FileText} label="Articles" value="142" trend="+3 New" color="blue" />
                <StatCard icon={Zap} label="API Requests" value="1.2M" trend="+8%" color="amber" />
                <StatCard icon={ShieldCheck} label="System Health" value="98%" trend="Stable" color="emerald" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* 1. Traffic Chart (Wide) */}
                <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Traffic Pulse</h3>
                            <p className="text-xs text-slate-400 font-medium">Real-time visitor analytics</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11, fontWeight:600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11}} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fill="url(#colorV)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Side Panel (Quick Actions & Pro Tip) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Quick Actions</h3>
                        <ActionButton icon={FileText} label="Draft New Article" color="indigo" />
                        <ActionButton icon={Users} label="Manage Team" color="emerald" />
                        <ActionButton icon={Activity} label="System Logs" color="slate" />
                    </div>

                    {/* Pro Tip Card */}
                    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex-1 min-h-[200px] flex flex-col justify-center">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-indigo-300">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="font-bold text-xl mb-2">SEO Tip</h3>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                Articles with "How-to" schema rank 40% higher on Google Discover. Use the new Schema Builder in the editor.
                            </p>
                        </div>
                        {/* Decorative Blur */}
                        <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-[-50%] left-[-20%] w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]"></div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;