import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const IndividualClasses = () => {
  return (
    <section className="py-24 bg-white text-black">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 mb-6">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">Self-Paced</span> Individual Practice
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Not ready for live sessions? Access our premium library of on-demand individual classes. Practice at your own pace, anytime, anywhere, with guided videos tailored for every skill level.
              </p>
              
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4 translate-y-8">
                <img src="/images/remote-052-lite.webp" alt="Yoga" className="w-full h-48 object-cover rounded-2xl" />
                <img src="/images/remote-020-sm.webp" alt="Yoga" className="w-full h-64 object-cover rounded-2xl" />
              </div>
              <div className="space-y-4">
                <img src="/images/remote-028-sm.webp" alt="Yoga" className="w-full h-64 object-cover rounded-2xl" />
                <img src="/images/remote-053-sm.webp" alt="Yoga" className="w-full h-48 object-cover rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndividualClasses;


