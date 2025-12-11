import React from 'react';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-20 p-4 md:p-6">
      <nav className="flex justify-between items-center text-white font-mono text-sm">
        <a href="/" className="font-sans font-bold text-lg">Ankyy</a>
        <div>
          <a href="#" className="mx-2">[ menu ]</a>
          <a href="#" className="hidden sm:inline-block">[ contact ]</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;