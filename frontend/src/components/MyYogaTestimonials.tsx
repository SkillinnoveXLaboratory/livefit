import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const MyYogaTestimonials = () => {
  const testimonials = [
    {
      name: 'Jessica M.',
      role: 'Practicing for 6 months',
      text: 'LiveFit has completely transformed my mornings. The 1-on-1 sessions are exactly what I needed to perfect my alignment.',
      image: '/images/remote-008.webp'
    },
    {
      name: 'David R.',
      role: 'Practicing for 1 year',
      text: 'I used to get injured trying advanced poses on YouTube. The guided corrections from my LiveFit teacher have been invaluable.',
      image: '/images/remote-017-lite-sm.webp'
    },
    {
      name: 'Sarah K.',
      role: 'Practicing for 3 months',
      text: 'The group classes feel surprisingly intimate. I love the community vibe and the energy the instructors bring.',
      image: '/images/remote-014-sm.webp'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 text-black">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Real stories from <span className="text-orange-500">real students</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-lg text-slate-700 italic mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-black">{t.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyYogaTestimonials;


