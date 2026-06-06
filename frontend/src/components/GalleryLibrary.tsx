import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flower2, MoveRight, Play, Image as ImageIcon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sectionReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const cardReveal = (delay = 0, x = 0) => ({
  hidden: { opacity: 0, y: 18, x, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: 'easeOut',
    },
  },
});

interface CardProps {
  image: string;
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  onClick: () => void;
}

const ResourceCard: React.FC<CardProps> = ({ image, icon: Icon, iconBg, title, description, buttonText, buttonColor, onClick }) => (
  <motion.div
    className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
    variants={cardReveal(0, 0)}
    whileHover={{ y: -8, transition: { duration: 0.22 } }}
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />

      <div className={`absolute -bottom-1 left-2 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white ${iconBg} text-white shadow-xl`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
    </div>

    <div className="flex flex-grow flex-col p-8 pt-12">
      <h3 className="mb-4 text-2xl font-bold text-sky-950 transition-colors group-hover:text-brand-primary">{title}</h3>
      <p className="mb-8 flex-grow leading-relaxed text-sky-900/60">{description}</p>

      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold tracking-widest transition-all duration-300 hover:shadow-lg ${buttonColor}`}
      >
        {buttonText}
        <MoveRight size={18} className="transition-transform group-hover:translate-x-1.5" />
      </button>
    </div>
  </motion.div>
);

const GalleryLibrary: React.FC = () => {
  const navigate = useNavigate();
  const resources = [
    {
      image: '/images/Gal1.webp',
      icon: BookOpen,
      iconBg: 'bg-[#f97316]',
      title: 'Meditation Library',
      description:
        'Guided meditations, breathwork sessions, sleep stories, soothing music, and mindful practices to calm your mind and uplift your spirit.',
      buttonText: 'EXPLORE LIBRARY',
      buttonColor: 'border-[#f97316] text-[#c2410c] hover:bg-[#f97316]/5',
      onClick: () => navigate('/gallery?category=Meditation%20Library'),
    },
    {
      image: '/images/Gal2.webp',
      icon: Flower2,
      iconBg: 'bg-[#a855f7]',
      title: 'Practice Library',
      description:
        'Step-by-step pose guides with photos, alignment tips, benefits, and modifications for all levels - from beginners to advanced practitioners.',
      buttonText: 'EXPLORE PRACTICE',
      buttonColor: 'border-[#a855f7] text-[#7e22ce] hover:bg-[#a855f7]/5',
      onClick: () => navigate('/gallery?category=Practice%20Library'),
    },
    {
      image: '/images/Gal3.webp',
      icon: Play,
      iconBg: 'bg-[#4ade80]',
      title: 'Quick Videos for Quick Solutions',
      description:
        'Short, effective videos to address common issues like back pain, neck stiffness, bloating, poor posture, stress relief, and more - with simple, practical solutions.',
      buttonText: 'SEE VIDEOS',
      buttonColor: 'border-[#4ade80] text-[#166534] hover:bg-[#4ade80]/5',
      onClick: () => navigate('/playlists'),
    },
    {
      image: '/images/Gal4.webp',
      icon: ImageIcon,
      iconBg: 'bg-[#3b82f6]',
      title: 'Picture Gallery',
      description:
        'Beautiful moments, inspiring postures, nature, wellness lifestyle, and behind-the-scenes from our community and sessions.',
      buttonText: 'VIEW GALLERY',
      buttonColor: 'border-[#3b82f6] text-[#1d4ed8] hover:bg-[#3b82f6]/5',
      onClick: () => navigate('/gallery?category=Picture%20Gallery'),
    },
  ];

  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="w-full px-4 md:px-10 lg:px-16">
        <motion.div
          className="mb-20 text-center"
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2 className="mb-8 text-5xl font-bold tracking-tight text-sky-950 md:text-7xl" variants={sectionReveal}>
            Gallery & <span className="text-brand-primary">Library</span>
          </motion.h2>
          <motion.p className="mx-auto max-w-2xl text-xl leading-relaxed text-sky-900/60" variants={sectionReveal}>
            Explore a rich collection of resources designed to inspire, educate, and support your wellness journey anytime, anywhere.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mb-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {resources.map((res, idx) => (
            <motion.div key={res.title} variants={cardReveal(0.04 * idx, idx % 2 === 0 ? -18 : 18)}>
              <ResourceCard {...res} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border border-orange-100 bg-[#fff9f5] px-8 py-5 shadow-sm md:px-12 lg:flex-row"
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-orange-50 bg-white text-[#ff7f00] shadow-lg shadow-orange-100/50">
              <FileText size={32} />
            </div>
            <div>
              <h4 className="mb-1 font-serif text-xl font-bold tracking-tight text-sky-950">Your Wellness. Your Pace. Your Space.</h4>
              <p className="max-w-xl text-base text-sky-900/60">Dive into our playlist library and gallery to learn, relax, and stay inspired every day.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/playlists')}
            className="group/main-btn relative flex-shrink-0 overflow-hidden rounded-full bg-[#ff7f00] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:bg-sky-900 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              EXPLORE VIDEOS
              <MoveRight className="transition-transform group-hover/main-btn:translate-x-1" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryLibrary;
