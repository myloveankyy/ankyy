/* --- frontend/src/App.js --- */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// REMOVED: MusicBoxPage import (It now lives on musicbox.life)
import BlogFeed from './pages/BlogFeed';
import Article from './pages/Article';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing */}
        <Route path="/" element={<HomePage />} />
        
        {/* Editorial / Blog */}
        <Route path="/blog" element={<BlogFeed />} />
        <Route path="/blog/:slug" element={<Article />} />
        
        {/* Note: Tools now redirect externally via ToolsGrid.js */}
      </Routes>
    </Router>
  );
}

export default App;