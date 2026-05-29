import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Shield, Sparkles } from 'lucide-react';

const Breathwork = () => {
  const techniques = [
    {
      title: 'Box Breathing',
      desc: 'The Navy SEAL technique for instant calm and nervous system regulation.',
      duration: '4-4-4-4',
      icon: Wind
    },
    {
      title: 'Kapalabhati',
      desc: 'The "Skull Shining" breath for instant mental clarity and energy.',
      duration: '2 min',
      icon: Zap
    },
    {
      title: 'Nadi Shodhana',
      desc: 'Alternate nostril breathing to balance brain hemispheres for focus.',
      duration: '5 min',
      icon: Shield
    }
  ];

  return (
    <section className="py-24 md:py-40 bg-white overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ff7f00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          <div className="lg:w-5/12 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                The Science of Breath
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-sky-950 tracking-tight mb-10 leading-[1.1]">
                Master Your <br /> <span className="text-orange-500">Prana Flow</span>
              </h2>
              <p className="text-lg md:text-xl text-sky-900/60 leading-relaxed font-medium mb-12">
                Breath is the bridge between the body and mind. Our guided pranayama sessions empower you to master your internal state in seconds.
              </p>
              
              <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
                {techniques.map((tech, idx) => (
                  <motion.div
                    key={tech.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 md:p-6 rounded-2xl bg-white border border-sky-100 flex items-start gap-4 hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform shrink-0">
                      <tech.icon className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                        <h4 className="text-base md:text-lg font-bold text-sky-900">{tech.title}</h4>
                        <span className="text-[8px] md:text-[9px] font-bold text-sky-400 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full">{tech.duration}</span>
                      </div>
                      <p className="text-sky-600 text-xs md:text-sm leading-relaxed font-medium">
                        {tech.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-w-lg mx-auto"
            >
              <img 
                src="/images/remote-020-sm.webp" 
                alt="Breathwork" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent" />
              
              {/* Floating Element - More compact on mobile */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 bg-white/20 backdrop-blur-md border border-white/30 p-4 md:p-8 rounded-2xl md:rounded-3xl text-white shadow-2xl"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-sky-300" />
                  <span className="font-bold text-[9px] md:text-[11px] uppercase tracking-[0.2em]">Collective Resonance</span>
                </div>
                <p className="text-[10px] md:text-[13px] font-medium text-sky-50 leading-relaxed">
                  92% of practitioners report instant focus improvement after a 5-minute session.
                </p>
              </motion.div>
            </motion.div>
            
            {/* Decorative Blobs - Smaller on mobile */}
            <div className="absolute -top-10 -right-10 w-32 md:w-48 h-32 md:h-48 bg-sky-400/20 rounded-full blur-[60px] md:blur-[80px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 md:w-64 h-40 md:h-64 bg-sky-200/30 rounded-full blur-[80px] md:blur-[100px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breathwork;

