import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Brain,
  Flame,
  Sun,
  Clock,
  BedDouble,
  Zap,
  Leaf,
  Calendar,
  BarChart3,
  Target,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchYogaChallenges,
  fetchYogaChallengesSection,
  resolveYogaImageUrl,
  type YogaChallenge,
  type YogaChallengesSectionContent,
} from '../lib/yogaPrograms';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  dumbbell: Dumbbell,
  brain: Brain,
  flame: Flame,
  sun: Sun,
  clock: Clock,
  bed: BedDouble,
  zap: Zap,
  leaf: Leaf,
  sparkles: Sparkles,
  target: Target,
};

const fallbackSection: YogaChallengesSectionContent = {
  eyebrow: 'Programs & Challenges',
  title: 'Programs That Transform Habits',
  description:
    'Join expert-designed 30-day programs and challenges that help you build discipline, stay motivated, and create lasting change one day at a time.',
  quote: 'One Commitment. 30 Days. A healthier, stronger, calmer you.',
};

const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLu2ojSmcKZTcXjLu7hsSC12A9nyv-y7EE';

const openLiveFitResource = () => {
  const membership = JSON.parse(localStorage.getItem('livefitMembership') || 'null');

  if (!membership?.email) {
    const shouldViewPlans = window.confirm('This LiveFit video library is for members. Would you like to view the membership plans first?');
    if (shouldViewPlans) {
      window.location.href = '/pricing';
    }
    return;
  }

  window.open(YOUTUBE_PLAYLIST_URL, '_blank', 'noopener,noreferrer');
};

const Programs = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Programs');
  const [selectedProgram, setSelectedProgram] = useState<YogaChallenge | null>(null);
  const [programs, setPrograms] = useState<YogaChallenge[]>([]);
  const [sectionContent, setSectionContent] = useState<YogaChallengesSectionContent>(fallbackSection);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([fetchYogaChallengesSection(), fetchYogaChallenges()])
      .then(([sectionResponse, programsResponse]) => {
        if (!active) return;
        setSectionContent({ ...fallbackSection, ...sectionResponse });
        setPrograms(programsResponse);
      })
      .catch((error) => {
        console.error('Unable to load yoga challenges:', error);
        if (active) setLoadError('Unable to load programs right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(programs.map((program) => program.category).filter(Boolean)));
    return ['All Programs', ...uniqueCategories];
  }, [programs]);

  const filteredPrograms = useMemo(
    () => activeCategory === 'All Programs'
      ? programs
      : programs.filter((program) => program.category === activeCategory),
    [activeCategory, programs]
  );

  return (
    <section className="bg-sky-50 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.span
            className="mb-4 block text-sm font-semibold uppercase tracking-wider text-brand-primary"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {sectionContent.eyebrow}
          </motion.span>
          <motion.h2
            className="mb-6 font-serif text-5xl text-brand-dark md:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          >
            {sectionContent.title}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-600"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            {sectionContent.description}
          </motion.p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'scale-105 bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'border border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-[2rem] border border-red-100 bg-white px-8 py-12 text-center text-red-600">{loadError}</div>
        ) : filteredPrograms.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white px-8 py-12 text-center">
            <h3 className="text-2xl font-bold text-brand-dark">No programs published yet</h3>
            <p className="mt-3 text-sm text-gray-500">Add Yoga Challenges from the admin dashboard and they will appear here.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredPrograms.map((program, index) => {
                const Icon = iconMap[program.iconKey] || Sparkles;
                return (
                  <motion.div
                    layout
                    key={program.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: index * 0.04 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedProgram(program)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={resolveYogaImageUrl(program.image)}
                        alt={program.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="translate-y-4 rounded-full bg-white/90 px-6 py-2 text-sm font-bold text-brand-primary transition-all duration-500 group-hover:translate-y-0">
                          View Details
                        </span>
                      </div>
                      <div className={`absolute bottom-4 left-4 rounded-xl p-2.5 text-white shadow-lg ${program.color} transition-transform group-hover:scale-110`}>
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col p-6">
                      <h3 className="mb-3 text-xl font-bold leading-tight text-brand-dark transition-colors group-hover:text-brand-primary">
                        {program.title}
                      </h3>
                      <p className="mb-6 line-clamp-3 flex-grow text-sm text-gray-500">{program.desc}</p>

                      <div className="flex items-center justify-between border-t border-gray-50 pt-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-primary" />
                          {program.days}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BarChart3 size={14} className="text-brand-primary" />
                          {program.level}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="mt-16 flex flex-col items-center justify-between gap-6 rounded-full border border-orange-100/50 bg-white/50 px-8 py-4 md:flex-row"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
              <Target size={20} />
            </div>
            <p className="font-medium italic text-gray-700">
              "{sectionContent.quote}"
            </p>
          </div>
          <button
            className="rounded-full bg-brand-primary px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:bg-brand-dark hover:shadow-brand-dark/20"
            onClick={openLiveFitResource}
          >
            Explore All Programs
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProgram && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgram(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            />
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[101] flex max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="relative h-80 shrink-0 md:h-[400px]">
                <img
                  src={resolveYogaImageUrl(selectedProgram.image)}
                  alt={selectedProgram.title}
                  className="h-full w-full object-cover object-[center_top]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute right-6 top-6 rounded-full bg-white/80 p-2 text-gray-500 shadow-lg backdrop-blur-md transition-colors hover:text-brand-primary"
                >
                  <X size={20} />
                </button>
                <div className={`absolute bottom-6 left-8 rounded-2xl p-3 text-white shadow-xl ${selectedProgram.color}`}>
                  {React.createElement(iconMap[selectedProgram.iconKey] || Sparkles, { size: 28 })}
                </div>
              </div>

              <div className="custom-scrollbar overflow-y-auto p-8 md:p-10">
                <h2 className="mb-2 text-3xl font-bold text-brand-dark">{selectedProgram.title}</h2>
                <div className="mb-8 flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest text-brand-primary">
                  <span className="rounded-full bg-orange-50 px-3 py-1">{selectedProgram.days}</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1">{selectedProgram.level}</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1">{selectedProgram.category}</span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-brand-dark">
                      <Target size={18} className="text-brand-primary" /> Overview
                    </h3>
                    <p className="leading-relaxed text-gray-600">{selectedProgram.overview}</p>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-bold text-brand-dark">What You'll Follow</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {selectedProgram.follow.map((item, index) => (
                        <div key={`${item}-${index}`} className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-sky-50 p-6">
                    <h3 className="mb-4 text-lg font-bold text-brand-dark">Best For</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.bestFor.map((item, index) => (
                        <span key={`${item}-${index}`} className="rounded-full border border-orange-100 bg-white px-4 py-1.5 text-xs font-medium text-gray-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="mt-10 w-full rounded-2xl bg-brand-primary py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-dark hover:shadow-brand-dark/20"
                  onClick={() => navigate('/livefitinquiry')}
                >
                  Start This Challenge
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Programs;
