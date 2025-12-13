import React, { useState } from 'react';
import { UserPlus, Shield, Trash2, Mail } from 'lucide-react';

const Team = () => {
    // Mock Data
    const [team] = useState([
        { id: 1, name: "Founder", role: "founder", email: "admin@ankyy.com" },
        { id: 2, name: "Sarah Editor", role: "writer", email: "sarah@ankyy.com" },
    ]);

    return (
        <div className="p-12 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Team Access</h2>
                <button className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 flex items-center gap-2">
                    <UserPlus size={16} /> Invite Member
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {team.map((member) => (
                            <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{member.name[0]}</div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                                            <p className="text-xs text-slate-400">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === 'founder' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{member.role}</span>
                                </td>
                                <td className="p-6"><div className="flex items-center gap-2 text-emerald-500 text-xs font-bold"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Active</div></td>
                                <td className="p-6 text-right">
                                    <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Team;