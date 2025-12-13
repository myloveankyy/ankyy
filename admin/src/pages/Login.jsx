import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Hardcoded API URL - Ensure this matches your backend location
        const API_URL = 'https://ankyy.com'; 

        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            if (res.data.success) {
                login(res.data.user, res.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] p-10 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 mx-auto mb-5">
                        A.
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Access</h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Identify yourself to proceed.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold">
                        <ShieldAlert size={16} /> {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            required 
                            placeholder="Username" 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            required 
                            type="password" 
                            placeholder="Passcode" 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Initialize Session <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secured by Iron Fortress</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;