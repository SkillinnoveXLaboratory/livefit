import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Users, Target, Zap, Flower2, Heart, Award } from 'lucide-react';

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [0, -5]);

  const stats = [
    { label: 'Corporate Clients', value: '500+', icon: Shield },
    { label: 'Active Practitioners', value: '100k+', icon: Users },
    { label: 'Wellness Mentors', value: '250+', icon: Heart },
    { label: 'Countries Reached', value: '45+', icon: Award },
  ];

  const values = [
    {
      title: 'Scientific Lineage',
      desc: 'We bridge ancient yogic wisdom with modern neuroscience to create measurable wellbeing.',
      icon: Target
    },
    {
      title: 'Digital Shala',
      desc: 'Our platform is designed to be a sacred digital space that fosters genuine human connection.',
      icon: Flower2
    },
    {
      title: 'Unstoppable Flow',
      desc: 'We believe wellness should integrate seamlessly into the high-performance corporate day.',
      icon: Zap
    }
  ];

  return (
    <div className="pb-16 bg-brand-white pt-10 overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 md:py-48 bg-sky-50/50 relative overflow-hidden">
        <div className="w-full px-4 md:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sky-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-8"
          >
            The LiveFit Mission
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-9xl font-serif italic text-sky-950 mb-10 tracking-tight leading-[0.85]"
          >
            Cultivating <br className="hidden md:block" /> <span className="text-sky-500">Corporate Vitality</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-3xl text-sky-800 max-w-4xl mx-auto font-medium leading-relaxed px-4 opacity-70"
          >
            At LiveFit, we believe the workplace is the most powerful place for transformation. We've built an ecosystem where ancient mindfulness meets the speed of modern business.
          </motion.p>
        </div>
        
        {/* Decorative center piece */}
        <motion.div 
          style={{ scale, rotate }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none"
        >
          <Flower2 className="w-full h-full text-sky-600 scale-150" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 w-full px-4 md:px-8 -mt-16 md:-mt-32 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(12, 74, 110, 0.1)" }}
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-sky-50 text-center group transition-all"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-sky-500 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-500">
                <stat.icon className="w-6 md:w-8 h-6 md:h-8" />
              </div>
              <div className="text-3xl md:text-5xl font-serif italic font-bold text-sky-950 mb-2 leading-none">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-bold text-sky-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-48 w-full px-4 md:px-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-8xl font-serif italic text-sky-950 mb-10 md:mb-16 leading-[0.9] tracking-tight">Beyond <br /> <span className="text-sky-500">Wellness</span></h2>
            <div className="space-y-12 md:space-y-20">
              {values.map((value, idx) => (
                <motion.div 
                  key={value.title} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col md:flex-row items-center lg:items-start gap-6 md:gap-10 group"
                >
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-sky-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-sky-500 shrink-0 shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-all duration-700 group-hover:rotate-6">
                    <value.icon className="w-8 md:w-10 h-8 md:h-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-4xl font-bold text-sky-900 mb-3 md:mb-4 font-serif italic leading-none">{value.title}</h4>
                    <p className="text-base md:text-xl text-sky-600 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0 opacity-70 group-hover:opacity-100 transition-opacity">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3.5rem] md:rounded-[5rem] overflow-hidden shadow-2xl relative z-10 max-w-lg mx-auto lg:mx-0 lg:ml-auto">
              <motion.img 
                src="/images/remote-037-lite.webp" 
                alt="Our Culture" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 2 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 to-transparent" />
            </div>
            {/* Ambient glows */}
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-sky-200 rounded-full blur-[100px] -z-10" 
            />
            <motion.div 
              animate={{ 
                scale: [1.3, 1, 1.3],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 5 }}
              className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-100 rounded-full blur-[120px] -z-10" 
            />
          </motion.div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-24 md:py-48 w-full px-4 md:px-8 md:px-6">
        <motion.div 
          whileHover={{ scale: 0.99 }}
          className="bg-sky-600 rounded-[3.5rem] md:rounded-[6rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(2,132,199,0.3)]"
        >
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-9xl font-serif italic text-white mb-10 leading-[0.85] tracking-tight"
            >
              Our purpose is to <br className="hidden md:block" /> <span className="text-sky-200">Enlighten</span> the Workplace
            </motion.h2>
            <p className="text-lg md:text-3xl text-sky-50 mb-16 font-medium opacity-90 px-4 leading-relaxed max-w-3xl mx-auto">
              We aren't just a platform; we are a global movement towards a more conscious, empathetic, and vibrant professional world.
            </p>
            <motion.button 
              whileHover={{ scale: 1.1, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 md:px-12 py-4 md:py-5 bg-white text-sky-600 rounded-full font-bold transition-all text-base md:text-lg"
            >
              Join the Movement
            </motion.button>
          </div>
          
          {/* Animated background flower */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
          >
            <Flower2 className="w-full h-full text-white scale-150" />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;


