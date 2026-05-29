import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Sparkles, Wind, Brain, Target } from 'lucide-react';

const Capsules = () => {
  const [activeTab, setActiveTab] = useState('focus');

  const capsules = {
    focus: [
      { title: 'Morning Clarity', duration: '5 min', icon: Wind },
      { title: 'Deep Work Prep', duration: '10 min', icon: Brain },
      { title: 'Meeting Reset', duration: '3 min', icon: Target },
    ],
    rest: [
      { title: 'Screen Relief', duration: '5 min', icon: Sparkles },
      { title: 'Afternoon Slump', duration: '8 min', icon: Wind },
      { title: 'Sleep Hygiene', duration: '15 min', icon: Brain },
    ]
  };

  return (
    <section className="py-16 md:py-32 bg-sky-50/20 overflow-hidden">
      <div className="w-full px-4 md:px-8 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="text-sky-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-4">Zen Capsules</div>
            <h2 className="text-4xl md:text-7xl font-serif italic text-sky-950 mb-6 md:mb-8 leading-tight tracking-tight">Micro-doses of <br /> <span className="text-sky-500">Mindfulness</span></h2>
            <p className="text-base md:text-lg text-sky-800 font-medium mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Perfect for the busy professional. High-impact yogic tools designed to be integrated into your existing workflow in 15 minutes or less.
            </p>
            
            <div className="flex justify-center lg:justify-start gap-3 md:gap-4 mb-8">
              <button 
                onClick={() => setActiveTab('focus')}
                className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'focus' ? 'bg-sky-600 text-white shadow-xl shadow-sky-200' : 'bg-white text-sky-500 border border-sky-100 hover:bg-sky-50'
                }`}
              >
                Focus Paths
              </button>
              <button 
                onClick={() => setActiveTab('rest')}
                className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'rest' ? 'bg-sky-600 text-white shadow-xl shadow-sky-200' : 'bg-white text-sky-500 border border-sky-100 hover:bg-sky-50'
                }`}
              >
                Rest Cycles
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full max-w-xl mx-auto lg:mx-0">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 md:space-y-6"
                >
                  {capsules[activeTab as keyof typeof capsules].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-sky-50 flex items-center justify-between group hover:shadow-2xl hover:shadow-sky-100/50 transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform shadow-sm">
                          <item.icon className="w-6 md:w-8 h-6 md:h-8" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-sky-900 text-base md:text-xl font-serif italic mb-1">{item.title}</h4>
                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-sky-400 font-bold uppercase tracking-widest">
                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" /> {item.duration}
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-sky-600 flex items-center justify-center text-white opacity-0 md:opacity-10 md:group-hover:opacity-100 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 shadow-lg">
                        <Play className="w-4 md:w-6 h-4 md:h-6 fill-current ml-1" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capsules;
