import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Video,
  Trophy,
  Target,
  Globe,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Heart,
} from 'lucide-react';

const leftColumnVariants = {
  hidden: { opacity: 0, x: -90 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.5,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.16,
      delayChildren: 0.22,
    },
  },
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 90 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.5,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.18,
      delayChildren: 0.28,
    },
  },
};

const revealItemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const slowCardReveal = (delay: number) => ({
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.35,
      delay,
      ease: [0.23, 1, 0.32, 1],
    },
  },
});

const AboutUsSection = () => {
  const gridItems = [
    {
      title: 'Corporate Wellness',
      desc: 'Empowering teams to reduce stress, improve focus and build a healthier workplace.',
      image: '/images/office1.webp',
      icon: Building2,
    },
    {
      title: 'Individual Wellness',
      desc: 'Personalized sessions that nurture your body, mind, energy and emotions.',
      image: '/images/office2.webp',
      icon: Users,
    },
    {
      title: 'Live Classes',
      desc: 'Join interactive live sessions from expert instructors - anytime, anywhere via Zoom.',
      image: '/images/office3.webp',
      icon: Video,
    },
    {
      title: 'Programs & Challenges',
      desc: 'Structured programs and exciting challenges to help you stay consistent and achieve your goals.',
      image: '/images/office4.webp',
      icon: Trophy,
    },
  ];

  const features = [
    {
      title: 'Holistic Approach',
      desc: 'Mind, Body, Energy, Emotions',
      icon: Target,
    },
    {
      title: 'For Everyone',
      desc: 'Individuals, Kids, Seniors & Workplaces',
      icon: Globe,
    },
    {
      title: 'Live & Interactive',
      desc: 'Real-time sessions with expert instructors',
      icon: Sparkles,
    },
    {
      title: 'Authentic & Effective',
      desc: 'Rooted in traditional wisdom, designed for modern life',
      icon: ShieldCheck,
    },
    {
      title: 'Transforming Lives',
      desc: 'Building healthier habits, better well-being and happier lives',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-24 bg-[#FDFCFB] text-sky-950 overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24 items-center">
          {/* Left Column: Our Story Content */}
          <motion.div
            className="lg:w-[45%]"
            variants={leftColumnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
          >
            <motion.div variants={revealItemVariants}>
              <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-4 uppercase">OUR STORY</div>
            </motion.div>

            <motion.h2
              variants={revealItemVariants}
              className="text-2xl md:text-2xl lg:text-5xl font-bold mb-8 font-serif leading-tight"
            >
              Wellness Rooted in <br />
              <span className="text-orange-500">Balance & Growth</span>
            </motion.h2>

            <motion.div variants={revealItemVariants} className="space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
              <p>
                LiveFit was created with a simple vision - to make authentic wellness accessible for everyone. In today&apos;s fast-moving world, people often struggle with stress, poor health, lack of balance, and disconnection from themselves. We wanted to create a space where wellness becomes part of everyday life for individuals, families, children, seniors, and modern workplaces.
              </p>
              <p>
                <strong>Through yoga, mindful movement, breathwork, meditation, fitness, and personalized wellness programs,</strong> LiveFit focuses on nurturing not just the body, but also the mind, energy, and emotional well-being. Our goal is to help people feel stronger, calmer, healthier, and more connected in their daily lives.
              </p>
              <p>
                WorkFit, our corporate wellness initiative, extends this mission into workplaces by helping teams reduce stress, improve focus, build healthier habits, and create happier work environments - both online and onsite.
              </p>
            </motion.div>

            {/* Branding Highlight */}
            <motion.div
              variants={revealItemVariants}
              className="mt-12 p-6 rounded-2xl bg-white border border-orange-100 flex items-start gap-6 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-100 p-1">
                <img src="/images/flowerlogo2.webp" alt="Lotus" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm md:text-base text-slate-600 font-medium italic">
                "Our lotus-inspired logo represents growth, resilience, balance, and transformation. Just as the lotus rises and blooms beautifully through every condition, LiveFit encourages people to grow, thrive, and live with greater purpose and well-being."
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Mosaic */}
          <motion.div
            className="lg:w-[55%] flex gap-0 relative z-10 self-center"
            variants={rightColumnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="flex-1 flex flex-col gap-0">
              <motion.div variants={slowCardReveal(0.08)} className="bg-white rounded-tl-[2.5rem] shadow-xl flex flex-col group cursor-pointer border border-slate-50 overflow-hidden relative h-[240px] md:h-[300px]">
                <img src={gridItems[0].image} alt={gridItems[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/40 to-transparent z-10" />
                <div className="relative z-20 p-6 md:p-8 flex flex-col items-start text-left">
                  <div className="flex gap-4">
                    <div className="w-1 h-8 bg-orange-500 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-2 text-sky-950 group-hover:text-orange-500 transition-colors leading-tight">{gridItems[0].title}</h3>
                      <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-semibold max-w-[180px]">{gridItems[0].desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slowCardReveal(0.18)} className="bg-white rounded-bl-[2.5rem] shadow-xl flex flex-col group cursor-pointer border border-slate-50 overflow-hidden relative h-[320px] md:h-[400px]">
                <img src={gridItems[2].image} alt={gridItems[2].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/40 to-transparent z-10" />
                <div className="relative z-20 p-6 md:p-8 flex flex-col items-start text-left">
                  <div className="flex gap-4">
                    <div className="w-1 h-8 bg-orange-500 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-2 text-sky-950 group-hover:text-orange-500 transition-colors leading-tight">{gridItems[2].title}</h3>
                      <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-semibold max-w-[180px]">{gridItems[2].desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 flex flex-col gap-0">
              <motion.div variants={slowCardReveal(0.12)} className="bg-white rounded-tr-[2.5rem] shadow-xl flex flex-col group cursor-pointer border border-slate-50 overflow-hidden relative h-[320px] md:h-[400px]">
                <img src={gridItems[1].image} alt={gridItems[1].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/40 to-transparent z-10" />
                <div className="relative z-20 p-6 md:p-8 flex flex-col items-start text-left">
                  <div className="flex gap-4">
                    <div className="w-1 h-8 bg-orange-500 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-2 text-sky-950 group-hover:text-orange-500 transition-colors leading-tight">{gridItems[1].title}</h3>
                      <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-semibold max-w-[180px]">{gridItems[1].desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slowCardReveal(0.24)} className="bg-white rounded-br-[2.5rem] shadow-xl flex flex-col group cursor-pointer border border-slate-50 overflow-hidden relative h-[240px] md:h-[300px]">
                <img src={gridItems[3].image} alt={gridItems[3].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/40 to-transparent z-10" />
                <div className="relative z-20 p-6 md:p-10 flex flex-col items-start text-left">
                  <div className="flex gap-4">
                    <div className="w-1 h-8 bg-orange-500 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-base md:text-lg font-bold mb-2 text-sky-950 group-hover:text-orange-500 transition-colors leading-tight">{gridItems[3].title}</h3>
                      <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-semibold max-w-[180px]">{gridItems[3].desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Feature Bar */}
        <div className="pt-16 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="lg:w-[25%] flex items-center gap-4">
              <h3 className="text-2xl font-bold font-serif text-sky-950 whitespace-nowrap">The Art of Living Well.</h3>
              <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center p-1.5">
                <Heart className="w-full h-full text-orange-500 fill-orange-500" />
              </div>
            </div>

            <div className="lg:w-[75%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-3 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <feature.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <h4 className="font-bold text-[11px] text-sky-950 uppercase tracking-widest">{feature.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;

