import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const MyYogaFaq = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need any prior yoga experience?',
      a: 'Not at all! We offer classes for all levels. Whether you are a complete beginner or an advanced practitioner, our teachers will tailor the session to your exact needs.'
    },
    {
      q: 'What equipment do I need for a virtual class?',
      a: 'All you need is a yoga mat, comfortable clothing, and a device (laptop, tablet, or phone) with a working camera and internet connection. Props like blocks and straps are optional.'
    },
    {
      q: 'How does a 1-on-1 session work over Zoom?',
      a: 'Our instructors use multi-angle viewing techniques to clearly see your alignment. You will receive real-time verbal adjustments just as if you were in a physical studio.'
    },
    {
      q: 'Can I cancel or reschedule my class?',
      a: 'Yes, you can easily reschedule or cancel your session up to 12 hours before the scheduled time through our platform without any penalty.'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 text-black">
      <div className="w-full px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-orange-500">Questions</span></h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-lg text-slate-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyYogaFaq;
