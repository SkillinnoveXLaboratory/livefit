import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar, User, MonitorPlay, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupClasses = () => {
  const navigate = useNavigate();

  return (
    <div id="zoom-sessions">
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
            <div className="lg:w-5/12">
              <motion.div
                initial={{ opacity: 0, x: -70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h2 className="text-5xl md:text-5xl font-bold mb-6 text-slate-900 leading-[1.1]">
                  <span className="block whitespace-pre-line">Your Wellness,</span>
                  <span className="block text-orange-500">Anywhere</span>
                </h2>
                <p className="text-[17px] text-slate-600 mb-12 leading-relaxed max-w-md">
                  Live small-group wellness sessions designed for modern living - accessible from home, office, travel, or anywhere your day begins.
                </p>

                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-1">Small Groups</h3>
                      <p className="text-[14px] text-slate-600">Personal attention. Real connection.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-1">Join From Anywhere</h3>
                      <p className="text-[14px] text-slate-600">Home, office, travel, or outdoors.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-1">Flexible &amp; Consistent</h3>
                      <p className="text-[14px] text-slate-600">Sessions throughout the day<br />to fit your routine.</p>
                    </div>
                  </div>
                </div>

                <button
                  className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 uppercase tracking-wide text-sm hover:-translate-y-0.5"
                  onClick={() => navigate('/livefitinquiry')}
                >
                  Join a Live Session
                </button>
              </motion.div>
            </div>

            <div className="lg:w-7/12 w-full relative">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full drop-shadow-2xl rounded-[2rem] overflow-hidden"
              >
                <img
                  alt="Live Wellness Session"
                  className="w-full h-full object-contain"
                  src="/images/live-wellness-session.webp"
                />
              </motion.div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 relative z-10">
            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0">
                <User className="w-9 h-9 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">Expert Instructors</h4>
                <p className="text-[13px] text-slate-600 leading-tight">Learn from certified<br />wellness professionals.</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-orange-100 shrink-0" />

            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0">
                <MonitorPlay className="w-9 h-9 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">Live &amp; Interactive</h4>
                <p className="text-[13px] text-slate-600 leading-tight">Real-time guidance.<br />Real-time support.</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-orange-100 shrink-0" />

            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0">
                <Users className="w-9 h-9 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">Supportive Community</h4>
                <p className="text-[13px] text-slate-600 leading-tight">Stay motivated with like-minded<br />people on the same journey.</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-orange-100 shrink-0" />

            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0">
                <Sparkles className="w-9 h-9 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">Holistic Approach</h4>
                <p className="text-[13px] text-slate-600 leading-tight">Yoga, fitness, breathwork,<br />meditation &amp; more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupClasses;
