/* --- frontend/src/pages/Article.js --- */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { 
    ArrowLeft, Share2, Calendar, Clock, ChevronRight, 
    User, Home, Copy, Check, TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const API_URL = 'https://ankyy.com'; 

// --- SCHEMA GENERATOR (CRITICAL FOR SEO) ---
const generateSchema = (post) => {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featuredImage ? [`${API_URL}${post.featuredImage}`] : [],
        "datePublished": post.date,
        "dateModified": post.date,
        "author": [{
            "@type": "Person",
            "name": "Aniket Pradhan",
            "url": "https://ankyy.com/about"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Ankyy Empire",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ankyy.com/logo.png"
            }
        },
        "description": post.excerpt || post.title
    });
};

const Article = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const containerRef = useRef(null);
    
    // --- ANIMATION PHYSICS ---
    const { scrollY } = useScroll();
    const yRange = useTransform(scrollY, [0, 800], [0, 300]); 
    const opacityRange = useTransform(scrollY, [0, 600], [1, 0]);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blog/${slug}`);
                const data = await res.json();
                const articleData = data.data || data; 
                setPost(articleData);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing...</span>
            </div>
        </div>
    );
    
    if (!post) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-2xl text-slate-900">404: Signal Lost</div>;

    const content = post.content || "";
    const readTime = Math.ceil(content.split(/\s+/).length / 200);
    const imageUrl = post.featuredImage ? `${API_URL}${post.featuredImage}` : null;

    return (
        <div ref={containerRef} className="min-h-screen bg-white font-sans selection:bg-indigo-500 selection:text-white pb-32">
            
            {/* --- SEO BRAIN --- */}
            <Helmet>
                <title>{post.title} | Ankyy Insights</title>
                <meta name="description" content={post.excerpt || `Read ${post.title} on Ankyy.com`} />
                
                {/* Preload Hero Image (LCP Boost) */}
                {imageUrl && <link rel="preload" as="image" href={imageUrl} fetchpriority="high" />}
                
                {/* Open Graph */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                
                {/* JSON-LD Schema */}
                <script type="application/ld+json">{generateSchema(post)}</script>
            </Helmet>

            {/* --- READING PROGRESS BAR --- */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left z-[60]" style={{ scaleX }} />

            {/* --- HERO SECTION --- */}
            <header className="relative w-full h-[80vh] overflow-hidden flex items-end justify-center pb-10 md:pb-24 group">
                
                {/* Parallax Background */}
                <motion.div 
                    style={{ y: yRange, opacity: opacityRange }}
                    className="absolute inset-0 z-0"
                >
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover scale-105"
                            loading="eager"
                            fetchpriority="high"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <span className="text-white/10 font-black text-9xl">ANKYY</span>
                        </div>
                    )}
                    {/* Cinematic Grain Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                </motion.div>

                {/* Title Card */}
                <motion.div 
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.8, type: "spring" }}
                    className="relative z-10 max-w-4xl w-full px-6"
                >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 text-white/90 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* H1 */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight drop-shadow-2xl">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-white/80 text-xs md:text-sm font-bold tracking-wide">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                             <Calendar size={14} className="text-indigo-400" /> 
                             {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'Recently'}
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                            <Clock size={14} className="text-indigo-400" /> {readTime} min read
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* --- CONTENT CONTAINER --- */}
            <main className="relative z-20 bg-white -mt-10 rounded-t-[40px] md:rounded-t-[60px] pt-16 px-6 md:px-12 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
                
                {/* Breadcrumbs */}
                <div className="max-w-3xl mx-auto mb-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <ChevronRight size={10} />
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Insights</Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-800 line-clamp-1">{post.title}</span>
                </div>

                <article className="max-w-3xl mx-auto">
                    
                    {/* The Content Engine */}
                    <div 
                        className="prose prose-lg md:prose-xl max-w-none 
                        
                        // Text Styles
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-normal prose-p:text-[18px] md:prose-p:text-[20px]
                        prose-li:text-slate-600 prose-li:marker:text-indigo-500
                        
                        // Links
                        prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-indigo-500 hover:prose-a:underline
                        
                        // Images
                        prose-img:rounded-2xl prose-img:shadow-xl prose-img:shadow-indigo-500/10 prose-img:my-10 prose-img:w-full
                        
                        // Blockquotes
                        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/30 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-700
                        
                        // Code Blocks
                        prose-pre:bg-slate-900 prose-pre:shadow-2xl prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-800
                        
                        // Strong
                        prose-strong:text-slate-900 prose-strong:font-black"
                        
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                    />

                    {/* --- AUTHOR & TRUST CARD --- */}
                    <div className="mt-24 p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30 shrink-0">
                            A
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Written by Aniket Pradhan</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                Founder of Ankyy Empire. Building digital systems that scale. obsessed with high-performance web architecture and aesthetic design.
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    <TrendingUp size={12} /> High Impact
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    <Check size={12} /> Verified Source
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            {/* --- FLOATING ACTION DOCK (Apple Style) --- */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-2 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-900/40">
                    
                    <Link to="/" className="p-3 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all tooltip" title="Home">
                        <Home size={20} />
                    </Link>
                    
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                    
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    
                    <Link to="/blog" className="p-3 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all" title="More Articles">
                        <ArrowLeft size={20} />
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Article;