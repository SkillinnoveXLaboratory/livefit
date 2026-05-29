import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Flower2 } from 'lucide-react';

const TestimonialsPage = () => {
  const testimonials = [
    {
      name: 'Rachel',
      role: 'Director of Wellness',
      company: 'Zenith Global',
      text: 'LiveFit has transformed our office culture. The daily asana streaks and guided meditations have become a sacred part of our team\'s routine.',
      image: '/images/remote-014-sm.webp'
    },
    {
      name: 'Shyam',
      role: 'Head of People',
      company: 'Nova Interactive',
      text: "The collective flow sessions have brought a level of harmony to our distributed teams that we never thought possible through a digital platform.",
      image: '/images/remote-022-sm.webp'
    },
    {
      name: 'Matt',
      role: 'Operations Director',
      company: 'Flow Systems',
      text: 'In just a few months, we\'ve seen a measurable decrease in stress levels and a significant increase in team focus. The ROI on inner peace is undeniable.',
      image: '/images/remote-012-sm.webp'
    },
    {
      name: 'Elsa',
      role: 'Chief Culture Officer',
      company: 'Aura Logistics',
      text: 'The most elegant and effective mindfulness tool we\'ve ever implemented. It\'s not just a platform; it\'s a path to a more conscious workplace.',
      image: '/images/remote-008.webp'
    }
  ];

  return (
    <div className="pb-16 bg-brand-white overflow-hidden pt-10">
      {/* Header */}
      <section className="py-12 md:py-24 bg-sky-50/50 relative">
        <div className="absolute top-0 right-0 w-full md:w-1/4 h-full opacity-5 pointer-events-none">
          <Flower2 className="w-full h-full text-sky-600" />
        </div>
        <div className="w-full px-4 md:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif italic text-sky-950 mb-6 tracking-tight leading-tight"
          >
            Voices of <br /> <span className="text-sky-500">The Sangha</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-sky-700 max-w-xl mx-auto font-medium px-4"
          >
            Discover how leading organizations are cultivating resilience and clarity through LiveFit.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-20 w-full px-4 md:px-8 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-sky-100 shadow-xl shadow-sky-100/20 flex flex-col group hover:-translate-y-1 transition-all duration-500"
            >
              <div className="mb-6 md:mb-8 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 md:w-3.5 h-3 md:h-3.5 fill-sky-500 text-sky-500" />
                ))}
              </div>
              <Quote className="w-10 h-10 md:w-12 md:h-12 text-sky-50/50 mb-4 group-hover:text-sky-100 transition-colors" />
              <p className="text-lg md:text-xl text-sky-800 leading-relaxed italic mb-8 flex-1 font-serif">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 md:gap-5 pt-6 md:pt-8 border-t border-sky-50">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-md border-2 border-white shrink-0">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sky-900 text-sm md:text-base">{t.name}</h4>
                  <p className="text-[9px] md:text-[10px] text-sky-400 font-bold uppercase tracking-widest leading-none mt-1">{t.role} @ {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 md:py-20 bg-white overflow-hidden border-y border-sky-50">
        <div className="w-full px-4 md:px-8 md:px-6">
          <p className="text-center text-[9px] md:text-[10px] font-bold text-sky-400 uppercase tracking-[0.3em] mb-10 md:mb-16">
            Trusted by conscious leaders
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
            {['SAMSUNG', 'ADOBE', 'GOOGLE', 'NIKE', 'WORKDAY'].map((brand) => (
              <span key={brand} className="text-xl md:text-3xl font-serif italic font-bold text-sky-900">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;

