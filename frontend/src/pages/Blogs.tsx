import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Calendar, User, Tag, Flower2 } from 'lucide-react';

const Blogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', 'Productivity', 'Mindfulness', 'Movement', 'Nutrition', 'Culture'];
  const [activeCategory, setActiveCategory] = useState('All');

  const blogs = [
    {
      title: 'The Science of Micro-Movements: Boosting Desk Productivity',
      excerpt: 'Learn how 2-minute movement breaks can significantly enhance cognitive function and reduce physical strain during the workday.',
      category: 'Movement',
      author: 'Dr. Elena Vance',
      date: 'May 10, 2024',
      image: '/images/remote-037-lite.webp'
    },
    {
      title: 'Mindful Leadership: Leading with Clarity in a High-Stress World',
      excerpt: 'Discover the core principles of mindfulness that help leaders stay grounded, empathetic, and effective in fast-paced corporate environments.',
      category: 'Mindfulness',
      author: 'Marcus Thorne',
      date: 'May 8, 2024',
      image: '/images/remote-020-sm.webp'
    },
    {
      title: 'Brain Food: Nutritional Strategies for Sustained Mental Energy',
      excerpt: 'What you eat affects how you think. We dive into the best foods for cognitive health and focus during long office hours.',
      category: 'Nutrition',
      author: 'Dr. Sarah Li',
      date: 'May 5, 2024',
      image: '/images/remote-028-sm.webp'
    },
    {
      title: 'Building a Culture of Calm: The LiveFit Approach to Work',
      excerpt: 'How integrating wellness into your company culture leads to higher retention, better morale, and long-term business success.',
      category: 'Culture',
      author: 'Julian Reed',
      date: 'May 2, 2024',
      image: '/images/remote-031-lite.webp'
    },
    {
      title: 'The Art of Disconnecting: Protecting Your Mental Shala',
      excerpt: 'Practical tips for setting digital boundaries and reclaiming your personal time in a hyper-connected world.',
      category: 'Mindfulness',
      author: 'Anya Petrov',
      date: 'April 28, 2024',
      image: '/images/remote-026-sm.webp'
    },
    {
      title: 'Ergonomics vs. Energy: Why Your Chair Isn\'t the Only Problem',
      excerpt: 'Understanding the relationship between posture, energy flow, and workplace vitality for a more balanced life.',
      category: 'Movement',
      author: 'Robert Hall',
      date: 'April 25, 2024',
      image: '/images/remote-011.webp'
    }
  ];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-16 bg-brand-white min-h-screen pt-10">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-sky-50/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full md:w-1/4 h-full opacity-5 pointer-events-none">
          <Flower2 className="w-full h-full text-sky-600" />
        </div>
        <div className="w-full px-4 md:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif italic text-sky-950 mb-6 text-center leading-tight"
          >
            The <span className="text-sky-500">LiveFit</span> Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-sky-700 max-w-xl mx-auto text-center mb-10 font-medium px-4"
          >
            Scientific insights, expert wisdom, and practical guides to elevate your work and life.
          </motion.p>
          
          {/* Search & Categories */}
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <div className="relative group px-4 md:px-0">
              <Search className="absolute left-10 md:left-6 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for wisdom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 md:pl-16 pr-8 py-4 rounded-2xl bg-white border border-sky-100 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition-all shadow-xl shadow-sky-100/30 text-sky-900 font-medium text-sm md:text-base"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' 
                    : 'bg-white text-sky-500 border border-sky-100 hover:bg-sky-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-24 w-full px-4 md:px-8 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredBlogs.map((blog, idx) => (
            <motion.article
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 shadow-xl">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] md:text-[9px] font-bold text-sky-600 uppercase tracking-widest shadow-lg">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="px-2 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-sky-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {blog.author}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-sky-950 group-hover:text-sky-600 transition-colors mb-3 leading-tight font-serif italic">
                  {blog.title}
                </h3>
                <p className="text-sm md:text-base text-sky-600 leading-relaxed font-medium mb-6 line-clamp-3 flex-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-sky-500 group-hover:text-sky-900 transition-colors uppercase tracking-widest pt-4 border-t border-sky-50">
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        {filteredBlogs.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-sky-200" />
            </div>
            <p className="text-sky-400 font-bold uppercase tracking-widest text-xs">No wisdom found in this path.</p>
            <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-sky-600 font-bold underline decoration-sky-200 underline-offset-4">Reset filters</button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-24 w-full px-4 md:px-8 md:px-6">
        <div className="bg-sky-600 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-8 h-full">
              {[...Array(12)].map((_, i) => (
                <Flower2 key={i} className="w-full h-full text-white" />
              ))}
            </div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Tag className="w-8 h-8 text-sky-100" />
            </div>
            <h2 className="text-3xl md:text-6xl font-serif italic text-white mb-6 leading-tight">Weekly <br className="hidden md:block" /> Wellness Digest</h2>
            <p className="text-base md:text-xl text-sky-50 mb-10 font-medium opacity-90 px-4">
              Join 100,000+ conscious professionals receiving our weekly guide to workplace harmony and personal growth.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 px-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your professional email" 
                className="flex-1 px-8 py-4 rounded-xl bg-white text-sky-900 focus:ring-4 focus:ring-white/20 outline-none font-bold text-sm md:text-base placeholder:text-sky-300 shadow-xl"
              />
              <button className="px-10 py-4 bg-sky-950 text-white rounded-xl font-bold hover:bg-sky-900 transition-all shadow-2xl text-sm md:text-base whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;


