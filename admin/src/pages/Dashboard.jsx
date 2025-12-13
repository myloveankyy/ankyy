import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';
import { Users, FileText, Globe, Cpu, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, gradient }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden group">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white shadow-md`}>
            <Icon size={20} />
        </div>
        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{label}</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-full">
            <TrendingUp size={10} /> {trend}
        </div>
    </motion.div>
);

const Dashboard = ({ user }) => {
    // Mock Data
    const data = [{name:'M',v:400},{name:'T',v:300},{name:'W',v:550},{name:'T',v:450},{name:'F',v:700},{name:'S',v:800},{name:'S',v:950}];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 lg:p-12 h-full overflow-y-auto custom-scrollbar">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
                <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name || 'Commander'}. Systems are nominal.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Users} label="Total Readers" value="12.5k" trend="+12%" gradient="from-violet-500 to-fuchsia-500" />
                <StatCard icon={FileText} label="Articles" value="142" trend="+3 New" gradient="from-blue-500 to-cyan-500" />
                <StatCard icon={Globe} label="Traffic" value="840k" trend="+8%" gradient="from-emerald-500 to-teal-500" />
                <StatCard icon={Cpu} label="Server Load" value="14%" trend="Stable" gradient="from-orange-500 to-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Traffic Pulse</h3>
                        <div className="flex gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span></div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} dy={10} />
                                <Tooltip contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 40px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fill="url(#colorV)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Aesthetic Sidebar Card */}
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6"><Sparkles size={24} /></div>
                        <h3 className="font-bold text-2xl mb-2">Pro Tip</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Optimize your "Slug" structure for 30% better SEO indexing on Google.</p>
                    </div>
                    <button className="relative z-10 w-full py-3 bg-white text-black rounded-xl font-bold text-sm mt-6 hover:scale-105 transition-transform">Read Docs</button>
                    <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                </div>
            </div>
        </motion.div>
    );
};
export default Dashboard;