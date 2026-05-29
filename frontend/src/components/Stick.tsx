import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Flower2, Zap, Heart, Wind } from 'lucide-react';

const Stick = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const sections = [
    {
      title: "Mindful Workspace",
      subtitle: "The Sanctuary of Focus",
      desc: "Transform your physical and digital environment into a shala of productivity. Align your surroundings with your inner state.",
      icon: Wind,
      color: "bg-sky-50 text-sky-600",
      image: "/images/remote-037-lite.webp"
    },
    {
      title: "Collective Flow",
      subtitle: "The Harmony of Teams",
      desc: "Experience synchronized sessions where the boundaries between self and team dissolve. Cultivate collective intelligence through shared movement.",
      icon: Heart,
      color: "bg-sky-50 text-sky-600",
      image: "/images/remote-020-sm.webp"
    },
    {
      title: "Zen Rewards",
      subtitle: "The Path of Appreciation",
      desc: "Consistency is sacred. Earn Zen Coins for every mindful minute and unlock rewards that nourish your personal and professional path.",
      icon: Zap,
      color: "bg-sky-50 text-sky-600",
      image: "/images/remote-042-lite.webp"
    }
  ];

  return (
    <section ref={containerRef} className="relative py-12 md:py-32 bg-white">
      <div className="w-full px-4 md:px-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content - Sticky only on Desktop */}
          <div className="lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center py-10 lg:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-sky-500 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-4 text-center lg:text-left"
            >
              The Experience
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-serif italic text-sky-950 mb-6 md:mb-8 leading-tight tracking-tight text-center lg:text-left">
              A New Way to <br className="hidden lg:block" /> <span className="text-sky-500">Practice</span>
            </h2>
            <p className="text-base md:text-lg text-sky-800 leading-relaxed font-medium mb-10 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              LiveFit is more than a platform; it's a living ecosystem designed to support your highest potential at every stage of your workday.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 md:gap-6">
              {sections.map((section, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row items-center lg:items-center gap-3 md:gap-4 group cursor-pointer">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${section.color} group-hover:scale-110 shadow-sm shrink-0`}>
                    <section.icon className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-sky-900 group-hover:text-sky-600 transition-colors uppercase tracking-widest text-center lg:text-left">{section.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Scrolling Visuals */}
          <div className="space-y-12 md:space-y-24 lg:py-20">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-20%" }}
                className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl aspect-[4/5] group max-w-lg mx-auto lg:mx-0"
              >
                <img src={section.image} alt={section.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/20 to-transparent p-8 md:p-16 flex flex-col justify-end">
                  <div className="text-sky-200 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-2">{section.subtitle}</div>
                  <h3 className="text-2xl md:text-4xl font-serif italic text-white mb-4 leading-none">{section.title}</h3>
                  <p className="text-sky-50/80 text-xs md:text-sm leading-relaxed font-medium max-w-sm">
                    {section.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stick;


