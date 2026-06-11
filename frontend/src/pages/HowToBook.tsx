import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MonitorPlay, ArrowRight, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowToBook = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 border border-orange-200 rounded-full bg-orange-50 text-orange-600 font-black text-[10px] tracking-[0.2em] mb-6 uppercase"
          >
            Step-by-Step Guide
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-sky-950 font-bold mb-8"
          >
            How to <span className="text-orange-500 italic">Book a Session</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-sky-900/60 max-w-2xl mx-auto font-medium"
          >
            Experience premium wellness from anywhere. Follow these simple steps to join our live interactive sessions.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative mb-32">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-32 left-0 w-full h-px bg-orange-100 -z-10" />

          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-orange-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-500 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl shadow-orange-200 mb-10 group-hover:rotate-6 transition-transform">
                1
              </div>
              <div className="mb-8">
                <Calendar className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold text-sky-950 mb-4">Choose Your Program</h3>
                <p className="text-sky-900/60 leading-relaxed font-medium">
                  Explore our curated wellness library and select the program that aligns with your body's needs and goals.
                </p>
              </div>
              <ul className="space-y-3">
                {['Yoga & Fitness', 'Meditation', 'Recovery'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-sky-950/40 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-orange-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-sky-950 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl shadow-slate-200 mb-10 group-hover:rotate-6 transition-transform">
                2
              </div>
              <div className="mb-8">
                <MessageCircle className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold text-sky-950 mb-4">Get Your Live Link</h3>
                <p className="text-sky-900/60 leading-relaxed font-medium">
                  Once confirmed, you'll receive a personalized Zoom link via WhatsApp or Email along with session prep details.
                </p>
              </div>
              <ul className="space-y-3">
                {['WhatsApp Update', 'Email Confirmation', 'Prep Guide'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-sky-950/40 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-orange-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-500 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl shadow-orange-200 mb-10 group-hover:rotate-6 transition-transform">
                3
              </div>
              <div className="mb-8">
                <MonitorPlay className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold text-sky-950 mb-4">Join & Transform</h3>
                <p className="text-sky-900/60 leading-relaxed font-medium">
                  Simply click the link at your scheduled time to connect with your expert coach and start your session.
                </p>
              </div>
              <ul className="space-y-3">
                {['Interactive Live', 'Real-time Corrections', 'Expert Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-sky-950/40 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-sky-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
          
          <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-8">Ready to begin your journey?</h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
            Book your personalized 1-on-1 session today and experience the future of wellness.
          </p>
          <button 
            onClick={() => navigate('/livefitinquiry')}
            className="px-12 py-6 bg-orange-500 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-orange-600 transition-all flex items-center gap-3 mx-auto group shadow-2xl shadow-orange-500/20"
          >
            Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToBook;
