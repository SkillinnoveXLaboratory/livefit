import React from 'react';
import { motion } from 'framer-motion';

const MyYogaGuides = () => {
  const guides = [
    { name: 'Priya Sharma', expertise: 'Vinyasa & Hatha Expert', image: '/images/remote-037-lite.webp' },
    { name: 'Sujith', expertise: 'Ashtanga Master', image: '/images/remote-012-sm.webp' },
    { name: 'Dr. Meera', expertise: 'Therapeutic Yoga', image: '/images/remote-053-sm.webp' },
  ];

  return (
    <section className="py-24 bg-white text-black">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Learn from India's <span className="text-orange-500">finest guides</span></h2>
            <p className="text-lg text-slate-600">
              Our teachers undergo rigorous vetting. You are guided by authentic practitioners rooted in true lineage.
            </p>
          </div>
          <button className="px-6 py-3 border-2 border-black font-bold rounded-full hover:bg-black hover:text-white transition-colors shrink-0">
            Meet All Teachers
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6">
                <img src={guide.image} alt={guide.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 group-hover:text-orange-500 transition-colors">{guide.name}</h3>
              <p className="text-slate-500 font-medium">{guide.expertise}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyYogaGuides;


