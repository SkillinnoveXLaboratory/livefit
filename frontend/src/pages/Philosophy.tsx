import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Wind, Brain, Users2, Flower2, Heart, Shield, Zap } from 'lucide-react';

const PhilosophyPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const deepPillars = [
    {
      title: 'Neuro-Somatic Alignment',
      desc: 'We synchronize the nervous system with physical movement to create a state of high-performance calm.',
      icon: Brain,
      color: 'bg-sky-50 text-sky-600'
    },
    {
      title: 'Sustainable Vitality',
      desc: 'Wellness is not a destination but a renewable resource that powers long-term professional success.',
      icon: Zap,
      color: 'bg-sky-50 text-sky-600'
    },
    {
      title: 'Ethical Resonance',
      desc: 'Every practice is rooted in integrity, ensuring that individual growth benefits the collective whole.',
      icon: Shield,
      color: 'bg-sky-50 text-sky-600'
    },
    {
      title: 'Radical Inclusivity',
      desc: 'Our methodology is designed for every body, every mind, and every level of experience.',
      icon: Users2,
      color: 'bg-sky-50 text-sky-600'
    }
  ];

  const philosophyValues = [
    {
      title: "The Breath-Work Balance",
      text: "In the modern corporate world, we often hold our breath. Our philosophy centers on restoring the natural rhythm of breath to regulate the stress response and enhance cognitive clarity. We believe that a company that breathes together, succeeds together.",
      img: "/images/remote-020-sm.webp"
    },
    {
      title: "Mindfulness as Infrastructure",
      text: "We don't view mindfulness as an 'add-on' perk. We view it as critical infrastructure for the 21st-century workplace. By embedding meditative practices into the daily workflow, we create resilient environments that thrive under pressure.",
      img: "/images/remote-039-sm.webp"
    }
  ];

  return (
    <div className="bg-brand-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="w-full px-4 md:px-8 text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sky-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-8"
          >
            The LiveFit Ethos
          </motion.div>
          <h1 className="text-6xl md:text-9xl font-serif italic text-sky-950 mb-10 tracking-tight leading-none">
            Where Ancient <br /> <span className="text-sky-500">Meets Absolute</span>
          </h1>
          <p className="text-lg md:text-3xl text-sky-800 max-w-4xl mx-auto font-medium leading-relaxed opacity-70">
            Our philosophy is built on the belief that peak professional performance is a natural byproduct of profound inner peace.
          </p>
        </motion.div>

        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] opacity-5 text-sky-600"
          >
            <Flower2 className="w-full h-full" />
          </motion.div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-white to-transparent" />
        </div>
      </section>

      {/* Deep Dive Pillars */}
      <section className="py-24 md:py-48 w-full px-4 md:px-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {deepPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[3rem] bg-white border border-sky-50 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${pillar.color} group-hover:scale-110 transition-transform`}>
                <pillar.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif italic font-bold text-sky-950 mb-4">{pillar.title}</h3>
              <p className="text-sky-700 leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Content Sections */}
      {philosophyValues.map((val, idx) => (
        <section key={idx} className={`py-24 md:py-48 ${idx % 2 === 0 ? 'bg-sky-50/30' : 'bg-white'}`}>
          <div className="w-full px-4 md:px-8 px-4">
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 md:gap-32`}>
              <div className="flex-1">
                <h2 className="text-4xl md:text-7xl font-serif italic text-sky-950 mb-10 leading-none tracking-tight">
                  {val.title}
                </h2>
                <p className="text-lg md:text-2xl text-sky-800 leading-relaxed font-medium opacity-70">
                  {val.text}
                </p>
              </div>
              <div className="flex-1 w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <img src={val.img} alt={val.title} className="w-full h-full object-cover" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Quote Section */}
      <section className="py-24 md:py-48 text-center w-full px-4 md:px-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-sky-500 mb-8 flex justify-center">
            <Sparkles className="w-12 h-12" />
          </div>
          <blockquote className="text-3xl md:text-6xl font-serif italic text-sky-950 leading-tight mb-12">
            "The goal is not to be better than anyone else, but to be better than you were yesterday, in a body that feels like a sanctuary."
          </blockquote>
          <cite className="text-sky-600 font-bold uppercase tracking-[0.4em] text-xs not-italic">
            - The LiveFit Manifesto
          </cite>
        </motion.div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 md:py-48 w-full px-4 md:px-8 px-4">
        <div className="bg-sky-950 rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden">
          <h2 className="text-4xl md:text-8xl font-serif italic mb-10 leading-none">Embrace the <span className="text-sky-400">Shift</span></h2>
          <p className="text-lg md:text-2xl text-sky-100/60 max-w-2xl mx-auto mb-16 font-medium">
            Join thousands of professionals who have redefined their relationship with work and wellness.
          </p>

          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/10 rounded-full scale-150 pointer-events-none" 
          />
        </div>
      </section>
    </div>
  );
};

export default PhilosophyPage;


