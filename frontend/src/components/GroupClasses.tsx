import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupClasses = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-50 text-black">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
            >
              <img 
                src="/images/remote-055.webp" 
                alt="Group Yoga Class" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Dynamic <span className="text-orange-500">Group Classes</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Feed off the energy of a shared practice. Our small-group online classes ensure you still receive personal attention while enjoying the community aspect of a live studio.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-2xl font-bold text-black mb-1">50+</h4>
                  <p className="text-slate-500 text-sm">Classes Weekly</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-2xl font-bold text-black mb-1">Interactive</h4>
                  <p className="text-slate-500 text-sm">Two-way video</p>
                </div>
              </div>
              
              <button
                className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                onClick={() => navigate('/livefitinquiry')}
              >
                Explore Group Schedule
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GroupClasses;
