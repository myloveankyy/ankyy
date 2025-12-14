/* --- frontend/src/pages/BlogFeed.js --- */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowRight, Clock, Calendar, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API_URL = 'https://ankyy.com';

const BlogFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blog`);
                const data = await res.json();
                setPosts(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Filter Logic
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Split: Hero Post vs The Rest
    const heroPost = filteredPosts[0];
    const gridPosts = filteredPosts.slice(1);

    // --- ANIMATIONS ---
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white pb-32">
            <Helmet>
                <title>Intel Archives | Ankyy</title>
                <meta name="description" content="Explore the latest insights on technology, systems, and design." />
            </Helmet>

            {/* --- HEADER --- */}
            <header className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto relative">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Archives</span>.
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Decoding complexity. Building systems. A collection of thoughts on architecture, design, and digital empire building.
                    </p>
                </motion.div>
                
                {/* Search Bar */}
                <div className="mt-10 relative max-w-md group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                    <div className="relative bg-white border border-slate-200 rounded-full flex items-center px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                        <Search className="text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search intel..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full ml-4 outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent"
                        />
                    </div>
                </div>
            </header>

            {/* --- CONTENT AREA --- */}
            <main className="px-6 md:px-12 max-w-7xl mx-auto">
                
                {/* 1. HERO POST (Cinematic) */}
                {!searchTerm && heroPost && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="mb-20"
                    >
                        <Link to={`/blog/${heroPost.slug}`} className="group relative block rounded-[40px] overflow-hidden aspect-[16/10] md:aspect-[21/9] shadow-2xl shadow-indigo-900/10">
                            {/* Image */}
                            <div className="absolute inset-0">
                                {heroPost.featuredImage ? (
                                    <img 
                                        src={`${API_URL}${heroPost.featuredImage}`} 
                                        alt={heroPost.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        fetchpriority="high"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center"><Sparkles className="text-white/20" size={64}/></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-4xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles size={10} /> Featured Intel
                                    </span>
                                    {heroPost.tags?.[0] && (
                                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                            {heroPost.tags[0]}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg group-hover:text-indigo-200 transition-colors">
                                    {heroPost.title}
                                </h2>
                                <div className="flex items-center gap-6 text-white/80 text-xs md:text-sm font-bold">
                                    <span className="flex items-center gap-2"><Calendar size={14}/> {format(new Date(heroPost.date), 'MMM d, yyyy')}</span>
                                    <span className="flex items-center gap-2"><Clock size={14}/> {Math.ceil(heroPost.content.split(' ').length / 200)} min read</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* 2. THE GRID (Masonry Vibe) */}
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    {gridPosts.map((post) => (
                        <motion.article 
                            key={post._id} 
                            variants={item}
                            className="group flex flex-col h-full"
                        >
                            <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-[32px] mb-6 relative aspect-[4/3] shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                                {post.featuredImage ? (
                                    <img 
                                        src={`${API_URL}${post.featuredImage}`} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300"><TrendingUp size={32}/></div>
                                )}
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg">
                                    <ArrowRight size={16} className="text-indigo-600" />
                                </div>
                            </Link>

                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    {post.tags?.[0] && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                                            {post.tags[0]}
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        — {format(new Date(post.date), 'MMM d')}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-slate-50 mb-4 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No intel found.</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search query.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BlogFeed;