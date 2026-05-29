import React from 'react';
import { motion } from 'framer-motion';

const WorkoutStats = () => {
  const stats = [
    { value: "24", label: "ACROSS 24 TIMEZONES" },
    { value: "1.2m hrs", label: "1.2 MILLION HOURS OF YOGA CLASSES" },
    { value: "40", label: "STUDENT ACROSS 40 COUNTRIES" }
  ];

  return (
    <section className="relative bg-slate-900 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <motion.h2 data-aos="fade-up" className="text-3xl md:text-5xl font-extrabold text-white font-serif mb-4"
          >
            Carry your workout Anywhere. Anytime!
          </motion.h2>
        </div>

        {/* 1. The Map & Global Network Visual - Small & Centered */}
        <div className="relative mb-16 max-w-3xl mx-auto overflow-hidden rounded-[1.5rem]">
          {/* Main Map Image */}
          <img 
            src="/images/remote-001-sm.webp" 
            alt="Timezones Map"
            className="w-full h-auto object-cover opacity-80"
          />
          
          {/* Global Network Overlay Image */}
          <motion.div data-aos="fade-up" className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <img 
              src="/images/globalnetwork.webp" 
              alt="Global Network Overlay"
              className="w-full h-full object-contain mix-blend-screen"
            />
          </motion.div>
        </div>

        {/* 2. Stats Section - Single Row & Smaller Font */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-white/10">
          {stats.map((stat, index) => (
            <motion.div data-aos="fade-up"  
              key={index} className="text-center px-4"
            >
              <div className="text-5xl md:text-6xl font-black text-white mb-3">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-widest leading-relaxed">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkoutStats;


