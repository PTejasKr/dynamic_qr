'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'The Future of Dynamic QR Codes',
    excerpt: 'How redirection logic is changing physical marketing forever.',
    date: 'April 12, 2026',
    author: 'Alex River',
    color: 'bg-primary'
  },
  {
    id: 2,
    title: 'Minimalist 3D Design Trends',
    excerpt: 'Why bold borders and shadows are making a comeback in UI.',
    date: 'April 10, 2026',
    author: 'Maya Sky',
    color: 'bg-secondary'
  },
  {
    id: 3,
    title: 'Security in Static vs Dynamic Codes',
    excerpt: 'A deep dive into how we protect your destination data.',
    date: 'April 05, 2026',
    author: 'Liam Tech',
    color: 'bg-accent'
  }
];

export default function Blog() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen pt-32 pb-24 px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <header className="mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-foreground underline decoration-primary decoration-8 underline-offset-8">
            The Journal
          </h1>
          <p className="text-xl text-foreground/70 font-medium">Stories, insights, and technical updates from the qr.org team.</p>
        </header>

        <div className="space-y-12">
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-minimal group cursor-pointer hover:-translate-y-2 transition-transform"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className={`w-full md:w-32 h-32 rounded-2xl ${post.color} border-[3px] border-black shadow-[4px_4px_0px_#000000] flex-shrink-0 animate-float`} style={{ animationDelay: `${idx * 0.5}s` }}></div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-foreground/50">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="font-medium text-foreground/70 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 font-black text-foreground/80 group-hover:gap-4 transition-all">
                      Read Full Article <ArrowRight size={18} className="text-primary" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="btn-3d px-12">
            Load More Posts
          </button>
        </div>
      </motion.div>
    </div>
  );
}
