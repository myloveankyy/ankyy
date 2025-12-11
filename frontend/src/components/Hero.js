import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Animation Variants
  const reveal = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: "0%", 
      opacity: 1, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-12 bg-white text-black overflow-hidden">
      
      {/* === 1. TOP HEADER (Meta Data) === */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex justify-between items-start font-mono text-xs uppercase tracking-widest border-b border-black pb-6"
      >
        <div className="flex gap-8">
          <span>( Ankyy © 2024 )</span>
          <span className="hidden md:inline-block">System: Online</span>
        </div>
        <div className="flex gap-8 text-right">
          <span className="hidden md:inline-block">Loc: India</span>
          <span className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Open for Work
          </span>
        </div>
      </motion.header>

      {/* === 2. MAIN IDENTITY (The "Big" Text) === */}
      <div className="flex-grow flex flex-col justify-center py-12 md:py-24">
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
            {/* The Name */}
            <div className="overflow-hidden">
                <motion.h1 
                    variants={reveal}
                    className="text-[19vw] leading-[0.75] font-black tracking-tighter uppercase select-none mix-blend-difference"
                >
                    ANKYY
                </motion.h1>
            </div>
            
            {/* The Sub-headline aligned to the end of the name */}
            <div className="flex justify-end mt-4 md:mt-8 pr-2 md:pr-12">
                <div className="overflow-hidden max-w-4xl">
                    <motion.p 
                        variants={reveal} 
                        className="text-2xl md:text-4xl font-medium leading-tight text-right tracking-tight"
                    >
                        Turning Complexity Into <span className="font-serif italic font-light">Controlled Power.</span>
                    </motion.p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* === 3. BOTTOM SPECS (The Philosophy) === */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-black pt-6">
        
        {/* Label */}
        <div className="md:col-span-3">
            <span className="font-mono text-xs uppercase tracking-widest bg-black text-white px-2 py-1">
                // METHODOLOGY
            </span>
        </div>

        {/* The Text Block */}
        <div className="md:col-span-6">
            <p className="text-lg md:text-xl font-medium leading-relaxed">
                I am a full-stack, cross-platform developer. 
                <span className="text-gray-400"> I use AI to speed up development, but I understand the fundamentals and architecture myself.</span>
            </p>
        </div>

        {/* CTA */}
        <div className="md:col-span-3 flex justify-end items-end">
            <button 
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest"
            >
                <span className="group-hover:mr-2 transition-all duration-300">Scroll Down</span>
                <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    ↓
                </div>
            </button>
        </div>
      </div>

    </section>
  );
};

export default Hero;