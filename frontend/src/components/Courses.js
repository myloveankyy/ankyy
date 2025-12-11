import React from 'react';
import { motion } from 'framer-motion';

const Courses = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-white text-black border-t border-black">
      
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20">
        <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest bg-black text-white px-3 py-1 mb-6 inline-block">
                TheBMIM Digital University
            </span>
            <h2 className="text-[10vw] md:text-[7vw] leading-[0.85] font-black uppercase tracking-tighter">
                Knowledge<br/>
                <span className="text-gray-300">Transfer.</span>
            </h2>
        </div>
        
        <div className="md:w-1/3 mt-8 md:mt-0">
            <p className="text-lg font-medium leading-relaxed">
                I don't just teach syntax; I teach <span className="underline decoration-2 underline-offset-4">momentum</span>.
                These are the distilled blueprints of my workflow—from psychology to shipping code.
            </p>
        </div>
      </div>

      {/* === FEATURED COURSE CARD === */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: The Philosophy (Updated Text) */}
        <div className="lg:col-span-5 flex flex-col justify-between py-4">
            <div>
                <h3 className="text-2xl font-bold uppercase mb-6">The Methodology</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                    I've spent years refining a development style I call "Vibe Coding." 
                    It's not about memorizing documentation. It's about architecture, speed, and maintaining the flow state.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                    I will share my own invented new method of development and prototyping.
                </p>
                
                {/* Note about TheBMIM University */}
                <div className="border-l-2 border-black pl-4 py-2 bg-gray-50">
                    <p className="text-sm font-medium leading-relaxed">
                        <strong>Note:</strong> <span className="italic">NeverCodeBack</span> is the flagship course of 
                        TheBMIM Digital University. This ecosystem is currently under active construction.
                        More modules (Psychology, DAW, Lifestyle) are coming soon.
                    </p>
                </div>
            </div>
            
            <div className="mt-12">
                <div className="flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-gray-400">
                    <span>University Roadmap:</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {['Vibe Coding', 'System Architecture', 'Production', 'Mindset'].map(tag => (
                        <span key={tag} className="border border-gray-300 px-3 py-1 text-xs font-bold text-gray-500">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: The "NeverCodeBack" Card (The Star) */}
        <div className="lg:col-span-7">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5 }}
                className="group relative bg-black text-white p-8 md:p-12 min-h-[500px] flex flex-col justify-between overflow-hidden cursor-pointer"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                {/* Top Tags */}
                <div className="flex justify-between items-start relative z-10">
                    <span className="font-mono text-xs uppercase tracking-widest text-green-400 border border-green-400/30 px-2 py-1 bg-green-900/20">
                        First Course
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                        Status: Upcoming
                    </span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 mt-12">
                    <h3 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter mb-4 group-hover:text-gray-200 transition-colors">
                        Never<br/>Code<br/>Back.
                    </h3>
                    <p className="text-xl md:text-2xl font-light text-gray-400 max-w-md">
                        Fundamentals & Architectures of <span className="text-white font-bold italic">Vibe Coding</span>.
                    </p>
                </div>

                {/* Bottom Specs & Button */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                            <span className="font-mono text-sm uppercase tracking-widest text-gray-400">12 Chapters</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                            <span className="font-mono text-sm uppercase tracking-widest text-gray-400">Proprietary Method</span>
                        </div>
                    </div>

                    <button className="w-full md:w-auto bg-white text-black px-8 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <span>Notify Me</span>
                        <span className="text-xs bg-black text-white px-1 ml-1">SOON</span>
                    </button>
                </div>

            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Courses;