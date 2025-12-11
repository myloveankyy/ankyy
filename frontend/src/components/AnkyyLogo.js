import React from 'react';

const AnkyyLogo = ({ className }) => {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
            <stop offset="100%" stopColor="#6366f1" /> {/* Indigo */}
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="38" stroke="url(#logoGradient)" strokeWidth="4" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" 
              fontFamily="sans-serif" fontSize="32" fontWeight="bold" fill="url(#logoGradient)">
          A
        </text>
      </svg>
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800 tracking-tighter">
        nkyy
      </h1>
    </div>
  );
};

export default AnkyyLogo;