import React from 'react';
import { motion } from 'framer-motion';

const Journey = () => {
  const steps = [
    { num: '01', title: 'Consultation', desc: 'We map your organizations specific energy centers and stressors.' },
    { num: '02', title: 'Integration', desc: 'Seamlessly weaving mindfulness into your digital communication tools.' },
    { num: '03', title: 'Practice', desc: 'Daily micro-moments and collective flows guided by world experts.' },
    { num: '04', title: 'Transformation', desc: 'Measurable growth in collective resilience and professional vitality.' },
  ];

  return (
    <section className="py-16 md:py-32 bg-sky-50/20 overflow-hidden">
      <div className="w-full px-4 md:px-8 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <div className="text-sky-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-4">The Implementation</div>
          <h2 className="text-4xl md:text-7xl font-serif italic text-sky-950 leading-tight">The Path to <span className="text-sky-500">LiveFit</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
          {/* Connecting line - hidden on mobile/tablet stack */}
          <div className="absolute top-20 left-0 w-full h-px bg-sky-100 hidden lg:block" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border border-sky-100 flex items-center justify-center text-3xl md:text-4xl font-serif italic text-sky-200 mb-6 md:mb-8 mx-auto lg:mx-0 shadow-sm">
                {step.num}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-sky-950 mb-3 md:mb-4 font-serif italic leading-none">{step.title}</h3>
              <p className="text-sm md:text-base text-sky-600 leading-relaxed font-medium px-4 lg:px-0">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
