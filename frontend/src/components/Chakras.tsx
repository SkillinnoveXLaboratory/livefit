import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Activity, Zap, Shield, Sun, Wind, Flower2 } from 'lucide-react';

const ChakraDetail = ({ chakra, index, onInView }: { chakra: any, index: number, onInView: (id: number) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      onInView(index);
    }
  }, [isInView, index, onInView]);

  const Icon = chakra.icon;

  return (
    <div 
      ref={ref}
      id={`chakra-section-${index}`}
      className="min-h-[60vh] flex flex-col justify-center py-20 md:py-32 first:pt-0 last:pb-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-orange-50/30 rounded-[2.5rem] p-8 md:p-16 border border-orange-100/50 relative overflow-hidden backdrop-blur-sm shadow-sm"
      >
        {/* Decorative Background Icon */}
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none">
          <Icon className="w-32 md:w-64 h-32 md:h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 lg:mb-12">
            <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${chakra.color} shadow-lg shrink-0`}>
              <Icon className="w-6 md:w-10 h-6 md:h-10" />
            </div>
            <div>
              <h3 className="text-2xl md:text-5xl font-serif italic text-orange-950 mb-1 leading-none">{chakra.name}</h3>
              <p className="text-orange-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.2em]">{chakra.translation}</p>
            </div>
          </div>
          
          <div className="space-y-6 md:space-y-10">
            <div>
              <h4 className="text-[9px] md:text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Organizational Focus</h4>
              <p className="text-xl md:text-3xl font-bold text-orange-900 leading-tight">
                {chakra.focus}
              </p>
            </div>
            
            <div>
              <h4 className="text-[9px] md:text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2">Evolutionary Path</h4>
              <p className="text-sm md:text-lg text-orange-800 leading-relaxed font-medium">
                {chakra.desc}
              </p>
            </div>
            
            <div className="pt-4">
              <button className="px-8 py-3 md:py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all shadow-xl shadow-orange-100/50 text-xs md:text-sm uppercase tracking-widest">
                Activate Center
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Chakras = () => {
  const [activeChakra, setActiveChakra] = useState(0);

  const chakras = [
    {
      name: 'Muladhara',
      translation: 'Root Center',
      focus: 'Stability & Security',
      desc: 'Foundation for corporate resilience. Building a secure environment where teams feel grounded and supported.',
      icon: Shield,
      color: 'text-orange-950 bg-orange-100',
    },
    {
      name: 'Svadhisthana',
      translation: 'Sacral Center',
      focus: 'Creativity & Flow',
      desc: 'Igniting creative potential and emotional intelligence to foster innovative problem-solving and adaptable team dynamics.',
      icon: Sparkles,
      color: 'text-orange-800 bg-orange-100',
    },
    {
      name: 'Manipura',
      translation: 'Solar Plexus',
      focus: 'Power & Vitality',
      desc: 'Harnessing the collective willpower and digestive fire (Agni) of the organization to drive purposeful action.',
      icon: Zap,
      color: 'text-orange-700 bg-orange-100',
    },
    {
      name: 'Anahata',
      translation: 'Heart Center',
      focus: 'Compassion & Unity',
      desc: 'Opening the channels of empathy and horizontal leadership. Cultivating a culture of radical inclusion and kindness.',
      icon: Activity,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      name: 'Vishuddha',
      translation: 'Throat Center',
      focus: 'Truthful Expression',
      desc: 'Mastering the art of conscious communication. Ensuring every voice is heard with clarity and authentic integrity.',
      icon: Wind,
      color: 'text-orange-500 bg-orange-100',
    },
    {
      name: 'Ajna',
      translation: 'Third Eye',
      focus: 'Insight & Strategy',
      desc: 'Developing corporate intuition and visionary leadership. Aligning tactical decisions with long-term spiritual purpose.',
      icon: Sun,
      color: 'text-orange-400 bg-orange-100',
    },
    {
      name: 'Sahasrara',
      translation: 'Crown Center',
      focus: 'Infinite Connection',
      desc: 'Total integration of corporate consciousness. Connecting the organization to its highest contribution to the world.',
      icon: Flower2,
      color: 'text-orange-300 bg-orange-100',
    }
  ];

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`chakra-section-${index}`);
    if (element) {
      const offset = 100; // Adjust for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 md:py-48 bg-white relative">
      <div className="w-full px-4 md:px-8 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column - Sticky */}
          <div className="lg:w-[350px] shrink-0">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-5xl md:text-8xl font-serif italic text-orange-950 mb-4 tracking-tighter"
                >
                  Energy
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-orange-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-12"
                >
                  Corporate Consciousness
                </motion.div>
              </div>

              {/* Sidebar Navigation */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 hide-scrollbar scroll-smooth">
                {chakras.map((chakra, idx) => (
                  <button
                    key={chakra.name}
                    onClick={() => scrollToSection(idx)}
                    className={`flex-none w-[200px] lg:w-full p-4 lg:p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-500 text-left group border ${
                      activeChakra === idx 
                      ? 'bg-orange-600 text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] border-orange-500' 
                      : 'bg-white hover:bg-orange-50/50 text-orange-900 border-orange-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 ${
                      activeChakra === idx ? 'bg-white/20 rotate-12' : 'bg-orange-50 group-hover:bg-white'
                    }`}>
                      <chakra.icon className={`w-5 h-5 ${activeChakra === idx ? 'text-white' : 'text-orange-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm lg:text-base tracking-tight truncate mb-0.5">{chakra.name}</h4>
                      <p className={`text-[10px] lg:text-xs font-medium opacity-60 truncate ${activeChakra === idx ? 'text-orange-50' : 'text-orange-400'}`}>
                        {chakra.focus}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Scrollable Content */}
          <div className="flex-1">
            <div className="space-y-0">
              {chakras.map((chakra, idx) => (
                <ChakraDetail 
                  key={chakra.name} 
                  chakra={chakra} 
                  index={idx} 
                  onInView={setActiveChakra} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Chakras;
