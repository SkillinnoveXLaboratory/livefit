import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, Heart, Sparkles } from 'lucide-react';

const GlobalReach = () => {
  const network = [
    { top: '25%', left: '25%', label: 'San Francisco', image: '/images/remote-034.webp' },
    { top: '45%', left: '32%', label: 'New York', image: '/images/remote-021.webp' },
    { top: '30%', left: '48%', label: 'London', image: '/images/remote-033.webp' },
    { top: '55%', left: '60%', label: 'Dubai', image: '/images/remote-019.webp' },
    { top: '40%', left: '72%', label: 'Singapore', image: '/images/remote-016.webp' },
    { top: '65%', left: '88%', label: 'Sydney', image: '/images/remote-024.webp' },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#020617] text-white overflow-hidden relative">
      <div className="w-full px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT: Text Content */}
          <div className="w-full lg:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-orange-300 text-[10px] md:text-xs font-black mb-8 tracking-[0.4em] uppercase border border-white/20"
            >
              <Globe className="w-4 h-4 animate-spin-slow" />
              <span>The Global Network</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-medium mb-8 tracking-tight leading-tight">
              Struggling to maintain wellness routines for your remote teams?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-xl font-medium leading-relaxed mb-12">
              Our remote team wellness solutions are designed to bridge the gap, ensuring your employees stay healthy, no matter where they are.
            </p>
            
            {/* Global Statistics */}
            <div className="grid grid-cols-2 gap-8 max-w-lg border-t border-white/20 pt-12">
              { [
                { label: 'Active Cities', value: '142', icon: MapPin },
                { label: 'Daily Practitioners', value: '85k+', icon: Users },
                { label: 'Total Calm Minutes', value: '1.2M', icon: Heart },
                { label: 'Corporate Partners', value: '450+', icon: Sparkles },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                     <stat.icon className="w-5 h-5 text-orange-400" />
                     <div className="text-2xl font-serif italic font-bold">{stat.value}</div>
                  </div>
                  <div className="text-[10px] text-orange-300/40 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Map & Image */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center mt-12 lg:mt-0">
            {/* HIGH-VISIBILITY World Map Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
              <div 
                className="w-full aspect-[2/1] bg-white scale-110 lg:scale-125"
                style={{
                  maskImage: 'url("/images/remote-060.svg")',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url("/images/remote-060.svg")',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              />
            </div>

            {/* Network Map Pins */}
            {network.map((node, i) => (
              <motion.div
                key={i}
                className="absolute z-10"
                style={{ top: node.top, left: node.left }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
              >
                <div className="relative group cursor-pointer -translate-x-1/2 -translate-y-full hover:-translate-y-[120%] transition-transform duration-300">
                  
                  {/* Custom Avatar Map Pin - Fixed to point vertically DOWN */}
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-[50%_50%_50%_0] -rotate-45 p-[2px] shadow-2xl flex items-center justify-center relative z-10">
                    <img 
                      src={node.image} 
                      className="w-full h-full rounded-full rotate-45 object-cover" 
                      alt={node.label} 
                    />
                  </div>
                  
                  {/* Green Status Dot (placed below the pin) */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] z-0" />

                  {/* City Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 bg-white text-slate-900 text-[10px] md:text-xs font-bold rounded-lg whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {node.label}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Center Yoga Master Overlay */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative z-20 w-[70%] md:w-[60%] max-w-[320px] translate-y-24 md:translate-y-32"
            >
               {/* Displayed as a clean cutout or rounded frame, adapting to the user's uploaded image */}
               <img 
                  src="/images/globalnetwork.webp" 
                  alt="Yoga Master Teaching Online" 
                  className="w-full h-auto object-contain drop-shadow-2xl"
               />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-orange-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-orange-400/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
};

export default GlobalReach;


