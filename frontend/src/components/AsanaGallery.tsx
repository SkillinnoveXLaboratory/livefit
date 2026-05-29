import React from 'react';
import { motion } from 'framer-motion';

const AsanaGallery = () => {
  const poses = [
    { name: 'Vrikshasana', translation: 'Tree Pose', img: '/images/remote-020-sm.webp' },
    { name: 'Adho Mukha', translation: 'Down Dog', img: '/images/remote-037-lite.webp' },
    { name: 'Trikonasana', translation: 'Triangle Pose', img: '/images/remote-026-sm.webp' },
    { name: 'Virabhadrasana', translation: 'Warrior II', img: '/images/remote-029-sm.webp' },
  ];

  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="text-center mb-12 md:mb-20">
          <div className="text-sky-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-4">Visual Wisdom</div>
          <h2 className="text-4xl md:text-6xl font-serif italic text-sky-950 leading-tight">Mastering the <span className="text-sky-500">Asana</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {poses.map((pose, idx) => (
            <motion.div
              key={pose.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group rounded-[2rem] md:rounded-[2.5rem] overflow-hidden aspect-[3/4] sm:aspect-[4/5] shadow-lg"
            >
              <img src={pose.img} alt={pose.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <h4 className="text-xl md:text-2xl font-serif italic mb-1 leading-none">{pose.name}</h4>
                <p className="text-sky-200 text-[10px] font-bold uppercase tracking-widest">{pose.translation}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AsanaGallery;


