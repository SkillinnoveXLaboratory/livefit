import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Heart,
  Brain,
  Baby,
  Flame,
  UserRound,
  Smile,
  Users,
  User,
  Trophy,
  ArrowRight,
  X,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  fetchAccountOverview,
  getAuthToken,
  getStoredUser,
  hasStoredPaidAccess,
  redirectToWhatsApp,
} from '../lib/account';
import {
  fetchYogaPrograms,
  fetchYogaProgramsSection,
  resolveYogaImageUrl,
  type YogaProgram,
  type YogaProgramsSectionContent,
} from '../lib/yogaPrograms';

type ProgramCard = {
  id?: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  overview: string;
  details: string;
  benefits: string[];
};

const iconMap: Record<string, ProgramCard['icon']> = {
  dumbbell: Dumbbell,
  heart: Heart,
  brain: Brain,
  baby: Baby,
  flame: Flame,
  'user-round': UserRound,
  smile: Smile,
  users: Users,
  user: User,
  trophy: Trophy,
  sparkles: Sparkles,
};

const fallbackSectionContent: YogaProgramsSectionContent = {
  title: 'Wellness Programs for Every Lifestyle',
  description:
    'Personalized wellness experiences designed to help you move better, feel stronger, reduce stress, and live healthier.',
};

const mapYogaProgramToCard = (program: YogaProgram): ProgramCard => ({
  id: program.id,
  title: program.title,
  tagline: program.tagline,
  desc: program.desc,
  image: resolveYogaImageUrl(program.image),
  icon: iconMap[program.iconKey] || Sparkles,
  overview: program.overview,
  details: program.details,
  benefits: program.benefits,
});

const UniqueNeeds = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState<ProgramCard | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [programs, setPrograms] = useState<ProgramCard[]>([]);
  const [sectionContent, setSectionContent] = useState<YogaProgramsSectionContent>(fallbackSectionContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadPrograms = async () => {
      try {
        const [sectionResponse, programsResponse] = await Promise.all([
          fetchYogaProgramsSection(),
          fetchYogaPrograms(),
        ]);

        if (!isActive) {
          return;
        }

        setSectionContent(sectionResponse);
        setPrograms(programsResponse.map(mapYogaProgramToCard));
      } catch (error) {
        console.error('Unable to load yoga programs from backend:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadPrograms();

    return () => {
      isActive = false;
    };
  }, []);

  const visiblePrograms = useMemo(() => programs, [programs]);

  const handleStartToday = async () => {
    if (!selectedProgram || isCheckingAccess) {
      return;
    }

    const storedUser = getStoredUser();
    const token = getAuthToken();
    let hasPaidAccess = hasStoredPaidAccess(storedUser?.email);

    setIsCheckingAccess(true);

    if (token) {
      try {
        const overview = await fetchAccountOverview(token);
        hasPaidAccess = overview.hasPaidAccess;
      } catch (error) {
        console.error('Unable to refresh account overview before Start Today:', error);
      }
    }

    setIsCheckingAccess(false);

    if (!hasPaidAccess) {
      setSelectedProgram(null);
      navigate('/pricing');
      return;
    }

    const message = [
      'Hi LiveFit Team,',
      '',
      `User name: ${storedUser?.name || 'Paid LiveFit member'}`,
      'User is paid.',
      `Program title: ${selectedProgram.title}`,
      `Program subtitle: ${selectedProgram.tagline}`,
      '',
      'Request: Please help me start this yoga and wellness program and share the next available steps on WhatsApp.',
    ].join('\n');

    redirectToWhatsApp(message);
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 text-sky-950">
      <div className="w-full px-4 md:px-8 lg:px-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{sectionContent.title}</h2>
          <p className="mx-auto max-w-3xl text-lg font-medium text-slate-500">{sectionContent.description}</p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex animate-pulse flex-col">
                <div className="mb-6 aspect-[4/3] rounded-3xl border border-slate-100 bg-slate-100" />
                <div className="mb-3 h-6 rounded-xl bg-slate-100" />
                <div className="h-16 rounded-xl bg-slate-100" />
              </div>
            ))
          ) : visiblePrograms.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-orange-200 bg-white px-8 py-12 text-center">
              <h3 className="text-2xl font-bold text-sky-950">No yoga programs published yet</h3>
              <p className="mt-3 text-sm text-slate-500">
                Add your first program from the admin dashboard and it will appear here automatically.
              </p>
            </div>
          ) : (
            visiblePrograms.map((program, idx) => (
              <motion.div
                key={program.id || `${program.title}-${idx}`}
                onClick={() => setSelectedProgram(program)}
                className="group flex cursor-pointer flex-col"
              >
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-3xl border border-slate-100 shadow-md">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/10" />

                  <div className="absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    <program.icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="mb-2 text-lg leading-tight font-bold transition-colors group-hover:text-orange-500">
                    {program.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-500">{program.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-orange-500 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn More <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          className="flex flex-col items-center justify-between gap-8 rounded-[3rem] border border-orange-100 bg-white px-8 py-8 md:px-16 lg:flex-row"
        >
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-orange-50 bg-white text-orange-500 shadow-xl shadow-orange-100/50">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h4 className="mb-1 font-serif text-2xl font-bold text-sky-950 md:text-3xl">Start Your Wellness Journey Today</h4>
              <p className="font-medium text-slate-500">Move better. Breathe deeper. Live healthier.</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row lg:w-auto">
            <button
              onClick={() => navigate('/livefitinquiry')}
              className="w-full rounded-2xl bg-orange-500 px-10 py-4 text-sm font-bold text-white shadow-xl shadow-orange-200 transition-all duration-300 hover:bg-slate-900 sm:w-auto"
            >
              JOIN LIVE CLASSES
            </button>
            <button
              onClick={() => navigate('/livefitinquiry')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white px-10 py-4 text-sm font-bold text-orange-600 transition-all duration-300 hover:bg-orange-50 sm:w-auto"
            >
              BOOK FREE CONSULTATION <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProgram && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgram(null)}
              className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed left-1/2 top-1/2 z-[101] max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[3rem] bg-white shadow-2xl"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img src={selectedProgram.image} alt={selectedProgram.title} className="block w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute right-6 top-6 rounded-full bg-white/90 p-2.5 text-slate-400 shadow-lg transition-colors hover:text-orange-500"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-6 left-10 flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-orange-500 text-white shadow-2xl shadow-orange-500/40">
                    <selectedProgram.icon size={32} />
                  </div>
                  <div>
                    <h2 className="mb-2 font-serif text-3xl leading-none font-bold text-slate-900 md:text-4xl">
                      {selectedProgram.title}
                    </h2>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">{selectedProgram.tagline}</p>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-12">
                <div className="space-y-10">
                  <div className="rounded-[2rem] border border-orange-100/50 bg-white p-8">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Target className="h-5 w-5 text-orange-500" /> Overview
                    </h3>
                    <p className="font-serif text-lg leading-relaxed italic text-slate-600">{selectedProgram.overview}</p>
                  </div>

                  <div className="space-y-6">
                    <p className="leading-relaxed text-slate-600">{selectedProgram.details}</p>
                  </div>

                  <div>
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <Sparkles className="h-6 w-6 text-orange-500" /> Key Benefits
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {selectedProgram.benefits.map((benefit, index) => (
                        <div
                          key={`${benefit}-${index}`}
                          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-orange-200"
                        >
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                          <span className="font-medium text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={handleStartToday}
                    disabled={isCheckingAccess}
                    className="flex-1 rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white shadow-xl shadow-orange-100 transition-all duration-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isCheckingAccess ? 'Checking Access...' : 'Start Today'}
                  </button>
                  <button
                    onClick={() => navigate('/livefitinquiry')}
                    className="flex-1 rounded-2xl border border-orange-500 bg-white py-4 text-lg font-bold text-orange-500 transition-all duration-300 hover:bg-slate-50"
                  >
                    Free Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UniqueNeeds;
