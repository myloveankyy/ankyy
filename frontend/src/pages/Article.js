/* --- frontend/src/pages/Article.js --- */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, Share2, Calendar, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Article = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    
    // --- PARALLAX ANIMATIONS ---
    const { scrollY } = useScroll();
    const yRange = useTransform(scrollY, [0, 500], [0, 250]); // Image moves slower than scroll
    const opacityRange = useTransform(scrollY, [0, 400], [1, 0]); // Image fades out
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`http://localhost:5000/api/blog/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setPost(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );
    
    if (!post) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl">404: Signal Lost</div>;

    const readTime = Math.ceil(post.content.split(/\s+/).length / 200);

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
            
            {/* --- READING PROGRESS --- */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600 origin-left z-[60]" style={{ scaleX }} />

            {/* --- NAVIGATION (Glass) --- */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
                <Link to="/blog" className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg hover:scale-105 transition-transform group">
                    <ArrowLeft size={16} className="text-black group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-black uppercase tracking-wider">Back</span>
                </Link>
                <button className="bg-white/80 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-lg hover:scale-110 transition-transform text-black">
                    <Share2 size={18} />
                </button>
            </nav>

            {/* --- IMMERSIVE HERO SECTION --- */}
            <header className="relative w-full h-[75vh] overflow-hidden flex items-end justify-center pb-20">
                
                {/* Parallax Image Background */}
                <motion.div 
                    style={{ y: yRange, opacity: opacityRange }}
                    className="absolute inset-0 z-0"
                >
                    {post.featuredImage ? (
                        <img 
                            src={post.featuredImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <span className="text-white font-black text-9xl opacity-10">ANKYY</span>
                        </div>
                    )}
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </motion.div>

                {/* Floating Title Card (The "Sexy" Part) */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-6 w-full"
                >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[32px] shadow-2xl overflow-hidden relative">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                        {/* Tags */}
                        <div className="flex gap-2 mb-6">
                            {post.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/20 text-white border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* H1 Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
                            {post.title}
                        </h1>

                        {/* Metadata */}
                        <div className="flex items-center gap-6 text-white/80 text-xs md:text-sm font-bold tracking-wide">
                            <span className="flex items-center gap-2"><Calendar size={14} /> {format(new Date(post.createdAt || post.date), 'MMM d, yyyy')}</span>
                            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                            <span className="flex items-center gap-2"><Clock size={14} /> {readTime} min read</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* --- CONTENT SECTION (Slides Up) --- */}
            <main className="relative z-20 bg-white -mt-10 rounded-t-[40px] pt-16 px-6 md:px-12 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
                
                {/* Breadcrumbs */}
                <div className="max-w-3xl mx-auto mb-12 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/blog" className="hover:text-black transition-colors">Blog</Link>
                    <ChevronRight size={12} />
                    <span className="text-indigo-600">Reading</span>
                </div>

                {/* Article Body */}
                <article className="max-w-3xl mx-auto pb-32">
                    <div 
                        className="prose prose-lg md:prose-xl max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-normal
                        prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-500 hover:prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12 prose-img:w-full
                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-gray-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                        prose-strong:text-gray-900 prose-strong:font-black
                        prose-li:text-gray-600"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                    />

                    {/* Footer / Share */}
                    <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-400 text-sm font-medium">
                            Published by <span className="text-black font-bold">Ankyy Media</span>
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
                                <Share2 size={16} /> Share Article
                            </button>
                        </div>
                    </div>
                </article>

            </main>
        </div>
    );
};

export default Article;