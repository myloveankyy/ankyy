/* --- frontend/src/App.js --- */
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// === LAZY LOAD (Code Splitting) ===
// This prevents the Blog from waiting for the 3D Homepage to download.
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BlogFeed = React.lazy(() => import('./pages/BlogFeed'));
const Article = React.lazy(() => import('./pages/Article'));

// A minimal loading spinner
const PageLoader = () => (
  <div className="min-h-screen w-full bg-brand-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const helmetContext = {};

  return (
    <HelmetProvider context={helmetContext}>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Landing */}
            <Route path="/" element={<HomePage />} />
            
            {/* Editorial / Blog */}
            <Route path="/blog" element={<BlogFeed />} />
            <Route path="/blog/:slug" element={<Article />} />
            
            {/* 404 Fallback - Redirects to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;