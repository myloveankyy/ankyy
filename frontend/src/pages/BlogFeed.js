/* --- frontend/src/pages/BlogFeed.js --- */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Calendar, Search, Tag } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000/api/blog';

const BlogFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Sort by date desc
                    const published = data.data
                        .filter(p => p.status === 'published')
                        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
                    setPosts(published);
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    // Filter Logic
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(filter.toLowerCase()) || 
        post.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Content...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-black selection:text-white pb-24">
            
            {/* --- HERO SECTION --- */}
            <header className="relative pt-32 pb-20 px-6 border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h5 className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">Ankyy Editorial</h5>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 leading-[0.9]">
                            Digital <span className="text-gray-400">Insights.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
                            Deep dives into engineering, system design, and the future of digital media. 
                            Curated for builders and creators.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="mt-12 relative max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search articles..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all font-medium text-sm"
                        />
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>
            </header>

            {/* --- CONTENT GRID --- */}
            <main className="max-w-7xl mx-auto px-6 mt-16">
                
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {filteredPosts.map((post, i) => (
                            <motion.article 
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className="group flex flex-col h-full cursor-pointer"
                            >
                                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                                    
                                    {/* Image Card */}
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 mb-6 shadow-sm group-hover:shadow-md transition-all duration-300">
                                        {post.featuredImage ? (
                                            <img 
                                                src={post.featuredImage} 
                                                alt={post.title} 
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-300 font-black text-4xl uppercase tracking-tighter opacity-50">Ankyy</span>
                                            </div>
                                        )}
                                        
                                        {/* Tag Overlay */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {post.tags?.slice(0, 1).map(tag => (
                                                <span key={tag} className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-900 border border-black/5 shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(post.createdAt || post.date), 'MMM d, yyyy')}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 leading-[1.2] mb-3 group-hover:text-indigo-600 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                                            {post.excerpt || "Click to read the full story and explore the details..."}
                                        </p>

                                        {/* Link Footer */}
                                        <div className="mt-auto flex items-center text-xs font-bold text-black border-t border-gray-100 pt-4 group-hover:border-indigo-100 transition-colors">
                                            Read Article <ArrowUpRight size={14} className="ml-1 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-24 py-12 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-400">© 2025 Ankyy Media Empire. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BlogFeed;