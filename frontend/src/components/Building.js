import React from 'react';
import { motion } from 'framer-motion';

const Building = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-black text-white border-t border-gray-800">
      
      {/* === HEADER === */}
      <div className="flex items-center justify-between mb-16 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
                Live Workshop / Active Build
            </span>
        </div>
        <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-gray-600">
            System Status: Compiling...
        </span>
      </div>

      {/* === PROJECT CARD: TEERBOOK === */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative border border-gray-800 bg-gray-900/30 p-8 md:p-16 overflow-hidden group"
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* LEFT: IDENTITY */}
                <div>
                    <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 mb-6 rounded-full">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-500 font-bold">
                            Private Beta Soon
                        </span>
                    </div>

                    <h3 className="text-[15vw] lg:text-[8rem] leading-[0.8] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 select-none">
                        Teer<br/>Book
                    </h3>
                </div>

                {/* RIGHT: CURIOSITY & SPECS */}
                <div className="lg:pl-12 lg:border-l border-gray-800">
                    <h4 className="text-2xl font-bold uppercase mb-6 tracking-tight">
                        Digitizing the <span className="text-gray-400">Invisible Economy.</span>
                    </h4>
                    
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Local gaming communities have run on paper chaos for too long. 
                        We are building the first hyper-scale digital ledger for this ecosystem.
                    </p>

                    <div className="space-y-4 font-mono text-xs uppercase tracking-widest text-gray-500 mb-12">
                        <div className="flex items-center gap-3">
                            <IconDatabase />
                            <span>Real-Time Analytics Engine</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <IconShield />
                            <span>Zero-Data Loss Architecture</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <IconMobile />
                            <span>Offline-First Mobile Client</span>
                        </div>
                    </div>

                    {/* Progress Bar Interaction */}
                    <div className="bg-gray-800 h-1 w-full rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-white"
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono uppercase text-gray-400">
                        <span>Development Progress</span>
                        <span>85% Complete</span>
                    </div>

                </div>
            </div>

            {/* Decor: "Launching Soon" Stamp */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 opacity-10 transform -rotate-12 pointer-events-none">
                <span className="text-9xl font-black border-4 border-white p-4 uppercase">
                    Soon
                </span>
            </div>

        </motion.div>
      </div>

    </section>
  );
};

// --- ICONS ---
const IconDatabase = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
);
const IconShield = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const IconMobile = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

export default Building;