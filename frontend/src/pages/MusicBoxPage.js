import React from 'react';
import { Link } from 'react-router-dom';
import MusicBox from '../components/MusicBox';

const MusicBoxPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] flex items-center justify-center p-4 md:p-8 font-sans">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-2 bg-black z-50"></div>

      {/* Main Container */}
      <div className="w-full max-w-6xl h-[85vh] flex flex-col">
        
        {/* Minimal Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
             <Link to="/" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform text-black">
                ←
             </Link>
             <span className="font-bold text-lg tracking-tight">MusicBox OS</span>
          </div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
             v1.0.0 / Local
          </div>
        </div>

        {/* The App Window */}
        <MusicBox />

      </div>
    </div>
  );
};

export default MusicBoxPage;