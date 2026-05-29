import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Link as LinkIcon } from 'lucide-react';

const Instructors = () => {
  const masters = [
    { name: 'Acharya Vayu', role: 'Pranayama Expert', image: '/images/remote-022-sm.webp' },
    { name: 'Dr. Ishvari', role: 'Ayurvedic Consultant', image: '/images/remote-014-sm.webp' },
    { name: 'Deva Das', role: 'Vinyasa Master', image: '/images/remote-012-sm.webp' },
  ];

  return (
    <section className="py-24 md:py-40 bg-sky-50/10 overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="text-center mb-12 md:mb-20">
          <div className="text-sky-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-4">The Masters</div>
          <h2 className="text-4xl md:text-6xl font-serif italic text-sky-950 leading-tight">Guided by <span className="text-sky-500">True Lineage</span></h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {masters.map((master, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl max-w-sm mx-auto sm:max-w-none ${idx === 2 ? 'sm:col-span-2 lg:col-span-1 sm:max-w-sm' : ''}`}
            >
              <div className="aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
                <img src={master.image} alt={master.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/20 to-transparent flex flex-col justify-end p-8 md:p-10 text-white">
                <h4 className="text-2xl md:text-3xl font-serif italic mb-1 leading-none">{master.name}</h4>
                <p className="text-sky-200 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">{master.role}</p>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
                  <Globe className="w-5 h-5 cursor-pointer hover:text-sky-200" />
                  <LinkIcon className="w-5 h-5 cursor-pointer hover:text-sky-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;

