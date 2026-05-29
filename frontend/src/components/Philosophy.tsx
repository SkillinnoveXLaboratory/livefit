import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sun, Heart, Sparkles } from 'lucide-react';

const Philosophy = () => {
  const pillars = [
    {
      title: 'Mindful Intent',
      desc: 'Moving from reactive stress to conscious action through daily practice.',
      icon: Leaf
    },
    {
      title: 'Radical Flow',
      desc: 'Finding the intersection between professional focus and inner peace.',
      icon: Sparkles
    },
    {
      title: 'Collective Care',
      desc: 'Building teams that support each other as a unified wellness ecosystem.',
      icon: Heart
    },
    {
      title: 'Luminous Spirit',
      desc: 'Connecting individual purpose with the organizations highest mission.',
      icon: Sun
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-[#fffaf5] relative overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="max-w-4xl mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6"
          >
            The Four Pillars of LiveFit
          </motion.div>
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif italic text-sky-950 tracking-tight leading-tight">
            Rooted in <span className="text-orange-500">Ancient Wisdom</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-sky-100 shadow-sm">
                <pillar.icon className="w-8 h-8 md:w-10 md:h-10 text-sky-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 font-serif italic leading-none">{pillar.title}</h3>
              <p className="text-sm md:text-base text-sky-600 leading-relaxed font-medium px-4">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative center piece - smaller/hidden on small mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-sky-50 rounded-full opacity-20 pointer-events-none hidden md:block" />
    </section>
  );
};

export default Philosophy;
