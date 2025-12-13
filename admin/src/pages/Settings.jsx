import React from 'react';
import { Save, Lock, User, Bell } from 'lucide-react';

const Settings = ({ user }) => (
    <div className="p-8 lg:p-12 h-full overflow-y-auto custom-scrollbar">
        <h2 className="text-3xl font-black text-slate-900 mb-8">System Settings</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <User className="text-indigo-600" size={24} />
                    <h3 className="font-bold text-lg">Profile Information</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Display Name</label>
                        <input defaultValue={user?.name} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                        <input defaultValue={user?.email || "admin@ankyy.com"} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none" disabled />
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                    <Lock className="text-rose-500" size={24} />
                    <h3 className="font-bold text-lg">Security</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm mt-4 hover:scale-[1.02] transition-transform">Update Security</button>
                </div>
            </div>
        </div>
    </div>
);
export default Settings;