import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Quote, Globe2, Users2, Building, Activity, X } from 'lucide-react';

const TypingText = ({
  text,
  speed = 60,
  caretClassName = 'bg-sky-950',
}: {
  text: string;
  speed?: number;
  caretClassName?: string;
}) => {
  const [typedText, setTypedText] = useState('');
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      setTypedText('');
      return;
    }

    let index = 0;
    setTypedText('');

    const timer = window.setInterval(() => {
      index += 1;
      setTypedText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [isInView, speed, text]);

  const isTyping = typedText.length < text.length;

  return (
    <span ref={ref} className="inline-block whitespace-pre-wrap">
      {typedText}
      {isTyping ? (
        <span className={`inline-block w-[2px] h-[0.95em] translate-y-[0.1em] ml-1 align-middle animate-pulse ${caretClassName}`} />
      ) : null}
    </span>
  );
};

const testimonialsData = [
  {
    name: 'Remya',
    date: '18 Apr 2026',
    location: 'New York, USA',
    text: 'Sujit at LiveFit is very considerate of students who recently joined his class. Being a beginner, I cannot get to the fullest of some poses. He will make sure to give the starting poses instructions given to me so that I can still do. He is very accommodating, having a lot of patience. And give instructions slowly so that beginners can also understand.',
    image: '/images/remote-014-sm.webp'
  },
  {
    name: 'Katy',
    date: '16 Mar 2025',
    location: 'California, USA',
    text: 'I had a wonderful experience in this class! The combination of Ashtanga and Kundalini. The flow was beautifully structured, allowing for strength, breathwork, and inner connection. The instructor was knowledgeable and supportive. Highly recommend for anyone looking for a transformative and balanced practice!',
    image: '/images/remote-009.webp'
  },
  {
    name: 'Dani',
    date: '06 Jun 2022',
    location: 'Texas, USA',
    text: "I had to hold my membership due to family. It is so good to be back. I love Sujit at LiveFit's class! It is my favorite and it has helped me make so many positive changes in my body, mind and lifestyle.",
    image: '/images/remote-036.webp'
  },
  {
    name: 'Alex',
    date: '04 Mar 2022',
    location: 'Florida, USA',
    text: "I was quite happy to realise through today's practice that I have obtained considerably more flexibility in my arms and shoulders through the work I have been doing with SUJIT at LiveFit in that area.",
    image: '/images/remote-023.webp'
  },
  {
    name: 'Sri',
    date: '06 Jun 2022',
    location: 'Illinois, USA',
    text: "Thanks Sujit at LiveFit, for another lovely practice. I want to say that you are helping me a lot to connect with my inner self and wanting to do more. Can't express my gratitude enough.",
    image: '/images/remote-018.webp'
  },
  {
    name: 'Vimi',
    date: '04 Mar 2022',
    location: 'Washington, USA',
    text: "I am so glad that I connected with Sujit at LiveFit. He is a young man who can give you immense knowledge throughout your class. He keeps it fun and peaceful at the same time. Looking forward to many classes with him.",
    image: '/images/remote-049.webp'
  },
  {
    name: 'Sheetal',
    date: '21 Mar 2022',
    location: 'New Jersey, USA',
    text: "Sujit at LiveFit's classes are a complete stress buster for me. My PCOD symptoms have improved, I feel more energetic, sleep better and my mind feels calm and positive.",
    image: '/images/remote-047.webp'
  },
  {
    name: 'Priya',
    date: '20 Mar 2022',
    location: 'Massachusetts, USA',
    text: "He is the best, my daughter loves doing yoga with him. Sujit at LiveFit makes the sessions so much fun and engaging for kids.",
    image: '/images/remote-057.webp'
  },
  {
    name: 'Sonia',
    date: '23 Mar 2023',
    location: 'Arizona, USA',
    text: "I really like Sujit at LiveFit as a teacher, deep learning, I feel I go deeper in yoga in every class.",
    image: '/images/remote-040.webp'
  },
  {
    name: 'Amelia',
    date: '01 May 2023',
    location: 'Ohio, USA',
    text: "Great workout session. The teacher loves to sing during poses which is great. Plus he has a nice singing voice. Love his way of teaching which is fun and relaxed.",
    image: '/images/remote-058.webp'
  },
  {
    name: 'Carol',
    date: '30 Apr 2023',
    location: 'Georgia, USA',
    text: "Sujit Sunday Kundalini class was wonderful. I love it when he introduces new breathing and movement techniques. My stress and anxiety have reduced significantly.",
    image: '/images/remote-044.webp'
  },
  {
    name: 'Taina',
    date: '05 May 2023',
    location: 'Helsinki, Finland',
    text: "Thank you so much for innovating a special chair yoga session today, as I did not have my yoga mat with me at the hotel. Very much appreciated!",
    image: '/images/remote-025.webp'
  },
  {
    name: 'Ava',
    date: '31 Mar 2023',
    location: 'Toronto, Canada',
    text: "Sujit at LiveFit makes me work hard with my yoga practice-and teaches in a fun, relaxed way. I appreciate his work ethic!",
    image: '/images/remote-056.webp'
  },
  {
    name: 'Freya',
    date: '18 Mar 2023',
    location: 'London, UK',
    text: "Sujit is highly perceptive and skilled about knowing where the body is in any given pose, and gives great pointers on when and how to make corrections. It helps me improve. He's a great conversationalist too!",
    image: '/images/remote-050.webp'
  },
  {
    name: 'James',
    date: '02 May 2023',
    location: 'Seattle, USA',
    text: "As someone with a desk job and constant neck pain, Sujit at LiveFit's sessions changed my life. Pain reduced, focus improved, and energy levels are much higher now.",
    image: '/images/remote-013.webp'
  }
];

const LiveFitTestimonials = () => {
  const navigate = useNavigate();
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  return (
    <section className="py-24 bg-[#FAFAFA] text-sky-950 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        {/* Header */}
        <div className="text-center">
          <div className="text-orange-500 font-bold text-sm tracking-[0.2em] uppercase mb-4">Testimonials</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">
            <TypingText text="Real Stories. Real Transformation." speed={55} caretClassName="bg-sky-950" />
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            See how LiveFit and WorkFit have helped individuals, families, and teams feel healthier, calmer, stronger, and more energized.
          </p>
        </div>
      </div>

      {/* Scrolling Marquee Container */}
      <div className="relative flex overflow-hidden py-10 select-none group">
        <motion.div 
          animate={{ x: [0, -5250] }}
          transition={{ 
            duration: 80, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="flex gap-6 whitespace-nowrap min-w-full"
        >
          {[...testimonialsData, ...testimonialsData].map((t, idx) => (
            <div 
              key={idx}
              onPointerDown={() => {
                (window as any).pressTimer = setTimeout(() => setSelectedTestimonial(t), 400);
              }}
              onPointerUp={() => clearTimeout((window as any).pressTimer)}
              onPointerLeave={() => clearTimeout((window as any).pressTimer)}
              onClick={() => setSelectedTestimonial(t)}
              className="w-[350px] cursor-pointer flex-shrink-0 rounded-[2rem] bg-white border border-gray-100 p-8 flex flex-col hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group/card relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-gray-50 group-hover/card:text-orange-500/10 transition-colors" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 group-hover/card:border-orange-500/30 transition-colors">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="whitespace-normal">
                  <h4 className="font-bold text-sky-950 text-lg leading-tight">{t.name}</h4>
                  <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-1 uppercase tracking-wider font-semibold">
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />)}
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed mb-8 whitespace-normal flex-1 font-medium line-clamp-3">
                {t.text}
              </p>
              
              {/* <div className="flex items-center gap-2 text-xs text-orange-500 font-bold uppercase tracking-widest mt-auto border-t border-gray-50 pt-6">
                 <Globe2 className="w-3 h-3" /> {t.location}
              </div> */}
            </div>
          ))}
        </motion.div>

        {/* Side Fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Modal for reading full testimonial */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-orange-100 shadow-[0_0_40px_rgba(249,115,22,0.15)] p-8 md:p-10 rounded-3xl max-w-lg w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedTestimonial(null)} className="absolute top-6 right-6 text-gray-400 hover:text-sky-950 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <Quote className="w-8 h-8 text-orange-500 mb-6 fill-orange-500 opacity-20" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-100">
                  <img src={selectedTestimonial.image} alt={selectedTestimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sky-950 text-2xl mb-1">{selectedTestimonial.name}</h4>
                  <div className="text-xs text-orange-500 uppercase tracking-wider font-bold">
                    {selectedTestimonial.date} 
                  </div>
                </div>
              </div>
              <p className="text-lg text-sky-900 leading-relaxed font-medium italic">
                "{selectedTestimonial.text}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-100">
          <div className="text-center md:text-left flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <Users2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-sky-950">10,000+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Sessions Conducted</div>
            </div>
          </div>
          <div className="text-center md:text-left flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Globe2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-sky-950">25+ Countries</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Wellness Community</div>
            </div>
          </div>
          <div className="text-center md:text-left flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Building className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-sky-950">500+</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Corporate Wellness Sessions</div>
            </div>
          </div>
          <div className="text-center md:text-left flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-sky-950">7+ Years</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teaching Experience</div>
            </div>
          </div>
        </div>

        {/* Final CTA from Image - Sleek & Full Width */}
        <div className="mt-12 bg-white rounded-[2rem] py-4 md:py-6 px-8 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-gray-100 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <Activity className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-sky-950 mb-1">Start Your Wellness Journey Today</h3>
              <p className="text-gray-500 font-bold text-xs md:text-sm">Move better. Breathe deeper. Live healthier.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full lg:w-auto">
            <button 
              onClick={() => navigate('/livefitinquiry')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-1 w-full sm:w-auto text-[12px] uppercase tracking-wider whitespace-nowrap"
            >
              Join Live Classes
            </button>
            <button 
              onClick={() => navigate('/livefitinquiry')}
              className="bg-white border-2 border-sky-950 text-sky-950 hover:bg-gray-50 font-bold py-3.5 px-8 rounded-xl transition-all w-full sm:w-auto text-[12px] uppercase tracking-wider whitespace-nowrap"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveFitTestimonials;


