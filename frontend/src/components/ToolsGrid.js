import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const tools = [
  {
    id: 1,
    name: "MusicBox",
    description: "The ultimate YouTube conversion engine. Library, Shop, and Offline modes included.",
    link: "https://musicbox.life", // <--- EXTERNAL DOMAIN
    status: "active",
    tag: "MEDIA",
    isExternal: true // New flag
  },
  {
    id: 2,
    name: "TeerBook",
    description: "Digital ledger for community gaming results and financial tracking.",
    link: "#",
    status: "coming-soon",
    tag: "FINANCE",
    isExternal: false
  },
  {
    id: 3,
    name: "DocuFlow",
    description: "Automated document processing workflow for high-volume needs.",
    link: "#",
    status: "coming-soon",
    tag: "OFFICE",
    isExternal: false
  }
];

const ToolsGrid = () => {
  return (
    <section id="tools-section" className="w-full py-24 px-6 md:px-12 bg-white text-black">
      
      {/* Header */}
      <div className="mb-20">
        <h2 className="text-[10vw] md:text-[6vw] font-black leading-none tracking-tighter uppercase border-b-2 border-black pb-8">
          The Toolbox
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index + 1} />
        ))}
      </div>
    </section>
  );
};

const ToolCard = ({ tool, index }) => {
  const isComingSoon = tool.status === 'coming-soon';
  const displayNum = index < 10 ? `0${index}` : index;

  // Render Logic: <a> for external, <Link> for internal
  const CardContent = () => (
    <motion.div 
      className="relative h-96 border-2 border-black p-8 flex flex-col justify-between transition-colors duration-300 bg-white hover:bg-black group"
    >
      {/* Top Row: Tag & Status */}
      <div className="flex justify-between items-start z-10">
        <span className="font-mono text-xs font-bold uppercase tracking-widest border border-black px-2 py-1 group-hover:border-white group-hover:text-white transition-colors">
          {tool.tag}
        </span>
        {isComingSoon && (
          <span className="text-[10px] font-bold uppercase bg-gray-200 px-2 py-1 text-black">
            Soon
          </span>
        )}
      </div>

      {/* Huge Background Number */}
      <div className="absolute top-4 right-6 text-9xl font-black text-gray-100 group-hover:text-gray-800 transition-colors select-none z-0">
        {displayNum}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 group-hover:text-white transition-colors">
        <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter leading-none">
          {tool.name}
        </h3>
        <p className="text-sm md:text-base font-medium leading-relaxed opacity-70 group-hover:opacity-90 max-w-xs">
          {tool.description}
        </p>
        
        {!isComingSoon && (
          <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span>Launch</span>
            <span className="group-hover:translate-x-2 transition-transform">
              {tool.isExternal ? '↗' : '→'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {tool.isExternal && !isComingSoon ? (
        <a href={tool.link} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
          <CardContent />
        </a>
      ) : (
        <Link to={isComingSoon ? '#' : tool.link} className={`block h-full ${isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <CardContent />
        </Link>
      )}
    </motion.div>
  );
};

export default ToolsGrid;