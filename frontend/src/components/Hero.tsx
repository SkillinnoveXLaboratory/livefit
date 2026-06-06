import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flower2, ArrowRight, CheckCircle2, Users, Video, Clock, Play, Pause, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const heroContentVariants = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    x: 28,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
};

const heroImageVariants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
  },
};

const heroFeatureVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.18,
    },
  },
};

const slides = [
  {
    image: '/images/globall-lite.webp',
    badge: 'LIVE ONLINE CLASSES 24X7',
    title: ['Wellness From', 'the Comfort of', 'Your Home'],
    orangeTitleIndex: 2,
    description: 'Experience live online yoga, meditation, pranayama and fitness sessions with expert instructors - anytime, anywhere.',
    features: [
      { icon: Users, text: 'Expert Instructors' },
      { icon: Video, text: 'Live on Zoom' },
      { icon: Clock, text: 'Classes 24x7' }
    ],
    primaryButtonText: 'Claim Free Trial Class',
    link: '/livefitinquiry'
  },
  {
    image: '/images/hero-lite.webp',
    title: ['Healthier Teams.', 'Happier Workplaces.'],
    subtitle: 'WorkFit brings wellness to your office and remote teams.',
    bullets: [
      'Reduce stress & burnout',
      'Improve posture & focus',
      'Increase productivity & morale'
    ],
    primaryButtonText: 'Explore WorkFit',
    buttonStyle: 'outline',
    link: '/workfit'
  },
  {
    image: '/images/yoga_children-lite.webp',
    title: ['Wellness For', 'All Ages'],
    subtitle: 'For Kids. For Adults. For seniors. For everyone.',
    description: 'Fun, engaging sessions that build confidence, flexibility, focus and healthy habits.',
    primaryButtonText: 'Explore Classes'
  },
  {
    image: '/images/breathing_woman-lite.webp',
    title: ['Breathe Better.', 'Think Better', 'Live Better.'],
    subtitle: 'Guided meditation and mindful breathing for everyday wellness',
    bullets: [
      'Guided meditation sessions',
      'Mindful Breathing Exercises',
      'Stress & Anxiety Relief Programs',
      'Sleep Meditation and Relaxation',
      'Focus and Concentration Training',
      'Daily Wellness Routines',
    ],
    primaryButtonText: 'Explore the Calmness',
    buttonStyle: 'outline'
  }
];

const SLIDE_DURATION_MS = 7500;
const PROGRESS_TICK_MS = 120;

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dynamicContent, setDynamicContent] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/content/home')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setDynamicContent(data);
        }
      })
      .catch(err => console.error("Error loading dynamic content:", err));
  }, []);

  useEffect(() => {
    slides.forEach((slide) => {
      const image = new Image();
      image.src = slide.image;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  // Timer logic for progress bar
  useEffect(() => {
    if (isPaused) return;

    let lastTick = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastTick;
      lastTick = now;
      setProgress((p) => p + (elapsed / SLIDE_DURATION_MS) * 100);
    }, PROGRESS_TICK_MS);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle slide change when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress, handleNext]);

  return (
    <section className="relative h-[68rem] md:h-[62rem] lg:h-[58rem] flex items-center overflow-hidden bg-white group/hero pt-24 md:pt-28">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div
          aria-hidden="true"
          className="absolute top-[-8%] left-[-6%] w-[28rem] h-[28rem] rounded-full bg-orange-200/25 blur-[130px] pointer-events-none"
          animate={{ y: [0, 18, 0], x: [0, -12, 0], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-12%] right-[-8%] w-[24rem] h-[24rem] rounded-full bg-sky-200/25 blur-[130px] pointer-events-none"
          animate={{ y: [0, -16, 0], x: [0, 14, 0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentSlide}
            className="absolute inset-y-0 right-0 w-full lg:w-[60%] h-full"
            variants={heroImageVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <img
              src={slides[currentSlide].image}
              className="w-full h-full object-cover object-[center_top] md:object-center"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%)'
              }}
              alt="Yoga Background"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-y-0 left-0 w-full lg:w-[50%] bg-white hidden lg:block z-10" />
        <div className="absolute inset-y-0 left-[50%] w-32 bg-gradient-to-r from-[#F5F5F3] to-transparent hidden lg:block z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F3] via-[#F5F5F3]/60 to-transparent lg:hidden z-10" />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-24 relative z-20 pt-32 pb-20 lg:pt-10 lg:pb-10">
        <div className="max-w-2xl min-h-[38rem] md:min-h-[36rem] lg:min-h-[34rem] text-left flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={heroContentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {slides[currentSlide].badge && (
                <motion.div variants={heroItemVariants} className="inline-block px-5 py-2 border border-orange-200 rounded-full bg-orange-50 text-orange-600 font-black text-[10px] md:text-xs tracking-[0.2em] mb-8 shadow-sm">
                  {slides[currentSlide].badge}
                </motion.div>
              )}

              <motion.h1 variants={heroItemVariants} className="text-5xl sm:text-6xl md:text-7xl font-serif text-sky-950 mb-6 leading-[1.1] font-bold tracking-tight">
                {currentSlide === 0 && dynamicContent?.heroTitle ? (
                  <>
                    <span className="block">{dynamicContent.heroTitle.split(' ').slice(0, Math.ceil(dynamicContent.heroTitle.split(' ').length / 2)).join(' ')}</span>
                    <span className="block text-orange-500">{dynamicContent.heroTitle.split(' ').slice(Math.ceil(dynamicContent.heroTitle.split(' ').length / 2)).join(' ')}</span>
                  </>
                ) : (
                  slides[currentSlide].title.map((line, idx) => (
                    <span key={idx} className={`block ${slides[currentSlide].orangeTitleIndex === idx ? 'text-orange-500' : ''}`}>
                      {line}
                    </span>
                  ))
                )}
              </motion.h1>

              {currentSlide === 0 && dynamicContent?.heroSubtitle ? (
                <motion.p variants={heroItemVariants} className="text-xl md:text-2xl font-serif italic text-orange-500 mb-8 leading-relaxed font-bold">
                  {dynamicContent.heroSubtitle}
                </motion.p>
              ) : (
                slides[currentSlide].subtitle && (
                  <motion.p variants={heroItemVariants} className="text-xl md:text-2xl font-serif italic text-orange-500 mb-8 leading-relaxed font-bold">
                    {slides[currentSlide].subtitle}
                  </motion.p>
                )
              )}

              {slides[currentSlide].features && (
                <motion.div variants={heroFeatureVariants} className="flex flex-wrap gap-x-10 gap-y-6 mb-12 max-w-lg">
                  {slides[currentSlide].features.map((feature, idx) => (
                    <motion.div key={idx} variants={heroItemVariants} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                        <feature.icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className="text-sm md:text-base font-black text-sky-950 tracking-wide uppercase">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentSlide === 0 && dynamicContent?.heroDescription ? (
                <motion.p variants={heroItemVariants} className="text-base md:text-lg text-sky-900/80 mb-8 max-w-xl leading-relaxed">
                  {dynamicContent.heroDescription}
                </motion.p>
              ) : (
                slides[currentSlide].description && (
                  <motion.p variants={heroItemVariants} className="text-base md:text-lg text-sky-900/80 mb-8 max-w-xl leading-relaxed">
                    {slides[currentSlide].description}
                  </motion.p>
                )
              )}

              {slides[currentSlide].bullets && (
                <motion.div variants={heroFeatureVariants} className="space-y-4 mb-12">
                  {slides[currentSlide].bullets.map((bullet, idx) => (
                    <motion.div key={idx} variants={heroItemVariants} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-50">
                        <Check className="w-3.5 h-3.5 text-orange-500" strokeWidth={4} />
                      </div>
                      <span className="text-sky-950/90 font-bold md:text-xl tracking-tight">{bullet}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div variants={heroItemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate((slides[currentSlide] as any).link || '/livefitinquiry')}
                  className="group relative overflow-hidden px-10 py-5 bg-orange-500 text-white rounded-full font-black transition-all flex items-center gap-3 text-sm md:text-base uppercase tracking-widest shadow-2xl shadow-orange-200"
                >
                  {slides[currentSlide].primaryButtonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[150px] -z-10" />
    </section>
  );
};

export default Hero;




