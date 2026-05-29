import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Brain, ChevronRight, Globe2, HeartPulse, Monitor, Sparkles, Users2, Zap } from 'lucide-react';

const solutions = [
  {
    id: 'employee-burnout',
    title: 'Employee Burnout',
    subtitle: 'Restore Energy & Resilience',
    desc: 'Support teams dealing with high stress, long hours, and emotional fatigue through recovery-led wellness practices.',
    icon: Brain,
    color: 'text-orange-600 bg-orange-50',
    image: '/images/tc2.webp',
    tags: ['Stress', 'Recovery', 'Focus']
  },
  {
    id: 'posture-back-pain',
    title: 'Posture & Back Pain',
    subtitle: 'Move Better at Work',
    desc: 'Reduce workplace pain and stiffness with desk yoga, mobility, ergonomics, and posture correction support.',
    icon: Monitor,
    color: 'text-purple-600 bg-purple-50',
    image: '/images/postureback pain.webp',
    tags: ['Mobility', 'Posture', 'Pain Relief']
  },
  {
    id: 'stress-mental-health',
    title: 'Stress & Mental Health',
    subtitle: 'Calmer Minds',
    desc: 'Improve emotional wellness, clarity, and calm through mindfulness, breathwork, and guided stress relief.',
    icon: HeartPulse,
    color: 'text-green-600 bg-green-50',
    image: '/images/stress.webp',
    tags: ['Mindfulness', 'Breathwork', 'Balance']
  },
  {
    id: 'low-employee-engagement',
    title: 'Low Employee Engagement',
    subtitle: 'Stronger Team Culture',
    desc: 'Use wellness challenges and group experiences to build participation, morale, and connection.',
    icon: Users2,
    color: 'text-blue-600 bg-blue-50',
    image: '/images/wp2.webp',
    tags: ['Engagement', 'Teams', 'Culture']
  },
  {
    id: 'low-productivity-energy',
    title: 'Low Productivity & Energy',
    subtitle: 'Recharge Focus',
    desc: 'Help employees restore daily energy with quick movement breaks, focus sessions, and healthier routines.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50',
    image: '/images/tc3.webp',
    tags: ['Energy', 'Focus', 'Habits']
  },
  {
    id: 'hybrid-work-challenges',
    title: 'Hybrid Work Challenges',
    subtitle: 'Wellness Anywhere',
    desc: 'Keep remote, hybrid, and global teams connected through flexible live and on-demand wellness.',
    icon: Globe2,
    color: 'text-cyan-600 bg-cyan-50',
    image: '/images/Hybridworkchallenges.webp',
    tags: ['Hybrid', 'Remote', 'Global']
  },
  {
    id: 'high-healthcare-costs',
    title: 'High Healthcare Costs',
    subtitle: 'Preventive Wellness',
    desc: 'Promote healthier lifestyles and reduce risk factors with sustainable preventive wellness programs.',
    icon: Activity,
    color: 'text-rose-600 bg-rose-50',
    image: '/images/wp4.webp',
    tags: ['Prevention', 'Health', 'Lifestyle']
  },
  {
    id: 'boring-wellness-programs',
    title: 'Boring Wellness Programs',
    subtitle: 'Make Wellness Enjoyable',
    desc: 'Replace generic programs with engaging experiences employees genuinely want to join.',
    icon: Sparkles,
    color: 'text-indigo-600 bg-indigo-50',
    image: '/images/Wc8.webp',
    tags: ['Fun', 'Interactive', 'Impact']
  },
];

const Solutions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-[#0a1128] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-orange-500 font-bold text-sm tracking-[0.3em] uppercase mb-6">Our Ecosystem</div>
            <h1 className="text-5xl md:text-7xl font-sans font-bold mb-8 leading-tight">
              Transformative <span className="text-orange-500">Wellness Solutions</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed mb-12">
              We combine ancient wisdom with modern technology to create high-impact wellness programs that resonate with the modern workforce. Explore our diverse range of solutions designed to elevate your team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/solutions/${item.id}`)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-sky-950 leading-tight">{item.title}</h3>
                    <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-sky-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-orange-50 flex items-center justify-center text-[8px] font-bold text-orange-500">
                      +
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-sky-50/50">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-sky-950/40 font-bold text-[10px] uppercase tracking-[0.4em] mb-8">Powering Wellness for Global Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
            {/* Logo placeholders would go here */}
            <div className="text-2xl font-bold font-serif italic text-sky-950">TechNova</div>
            <div className="text-2xl font-bold font-serif italic text-sky-950">VisionCore</div>
            <div className="text-2xl font-bold font-serif italic text-sky-950">ApexSol</div>
            <div className="text-2xl font-bold font-serif italic text-sky-950">EcoFlow</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-sky-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-8">
              Ready to <span className="text-orange-500">Elevate</span> Your Team?
            </h2>
            <p className="text-sky-200/70 text-lg mb-12 max-w-2xl mx-auto">
              Our experts are ready to help you design the perfect wellness program for your unique workforce needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/workfitinquiry')}
                className="group relative pl-16 pr-8 py-5 bg-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center shrink-0"
              >
                <div className="absolute left-2 top-2 bottom-2 aspect-square bg-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                  <ChevronRight className="w-5 h-5 text-orange-600" />
                </div>
                <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                  Book a Demo
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;

