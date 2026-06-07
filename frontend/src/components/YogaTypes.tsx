import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Armchair,
  Baby,
  Brain,
  CheckCircle2,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  Moon,
  Smile,
  Sparkles,
  Target,
  UserRound,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import {
  fetchAccountOverview,
  getAuthToken,
  getStoredUser,
  hasStoredPaidAccess,
  redirectToWhatsApp,
} from '../lib/account';
import {
  fetchYogaTypes,
  resolveYogaImageUrl,
  type YogaType,
} from '../lib/yogaPrograms';

type YogaTypeCard = YogaType & {
  imageUrl: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

const iconMap: Record<string, YogaTypeCard['icon']> = {
  armchair: Armchair,
  baby: Baby,
  brain: Brain,
  chair: Armchair,
  dumbbell: Dumbbell,
  flame: Flame,
  heart: Heart,
  leaf: Leaf,
  moon: Moon,
  smile: Smile,
  sparkles: Sparkles,
  target: Target,
  'user-round': UserRound,
  wind: Wind,
  zap: Zap,
};

const mapYogaTypeToCard = (type: YogaType): YogaTypeCard => ({
  ...type,
  imageUrl: resolveYogaImageUrl(type.image),
  icon: iconMap[type.iconKey] || Leaf,
});

const YogaTypes = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<YogaTypeCard[]>([]);
  const [selectedType, setSelectedType] = useState<YogaTypeCard | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadTypes = async () => {
      try {
        const response = await fetchYogaTypes();
        if (isActive) {
          setTypes(response.map(mapYogaTypeToCard));
        }
      } catch (error) {
        console.error('Unable to load yoga types from backend:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadTypes();

    return () => {
      isActive = false;
    };
  }, []);

  const visibleTypes = useMemo(() => types, [types]);

  const handleStartToday = async () => {
    if (!selectedType || isCheckingAccess) {
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
      setSelectedType(null);
      navigate('/pricing');
      return;
    }

    const message = [
      'Hi LiveFit Team,',
      '',
      `User name: ${storedUser?.name || 'Paid LiveFit member'}`,
      'User is paid.',
      `Yoga type: ${selectedType.title}`,
      `Yoga subtitle: ${selectedType.tagline}`,
      '',
      'Request: Please help me start this yoga type and share the next available steps on WhatsApp.',
    ].join('\n');

    redirectToWhatsApp(message);
  };

  return (
    <section id="yoga-types" className="relative overflow-hidden bg-white py-24 text-sky-950">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="relative w-full px-4 md:px-8 lg:px-20">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-orange-500">Yoga Types</p>
          <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">Our programs Powered by Different Yoga Styles</h2>
          <p className="text-lg font-medium leading-relaxed text-slate-500">
            Explore every yoga style, training format, and mindful practice available through LiveFit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[2rem] bg-white p-4 shadow-sm">
                <div className="mb-5 aspect-[4/3] rounded-[1.5rem] bg-orange-100/60" />
                <div className="mb-3 h-5 rounded-full bg-orange-100/60" />
                <div className="h-14 rounded-2xl bg-orange-100/40" />
              </div>
            ))
          ) : visibleTypes.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-orange-200 bg-white/70 px-8 py-12 text-center">
              <h3 className="text-2xl font-bold">No yoga types published yet</h3>
              <p className="mt-3 text-sm text-slate-500">Add yoga types from admin and they will appear here automatically.</p>
            </div>
          ) : (
            visibleTypes.map((type, index) => (
              <motion.button
                key={type.id || `${type.title}-${index}`}
                type="button"
                onClick={() => setSelectedType(type)}
                className="group flex h-full flex-col rounded-[2rem] bg-white p-4 text-left shadow-[0_14px_50px_rgba(15,23,42,0.06)] ring-1 ring-orange-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(249,115,22,0.13)]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.42, delay: Math.min(index * 0.025, 0.16), ease: 'easeOut' }}
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-orange-50">
                  <img
                    src={type.imageUrl}
                    alt={type.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/30">
                    <type.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-orange-500">{type.tagline}</p>
                <h3 className="mb-3 text-lg font-black leading-tight text-sky-950">{type.title}</h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-500">{type.desc}</p>
              </motion.button>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedType && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-slate-950/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedType(null)}
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white shadow-[0_30px_110px_rgba(15,23,42,0.35)]"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="relative h-64 overflow-hidden md:h-80">
                  <img src={selectedType.imageUrl} alt={selectedType.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="absolute right-5 top-5 rounded-full bg-white/90 p-2.5 text-slate-500 shadow-lg transition-colors hover:text-orange-500"
                    aria-label="Close yoga type details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-orange-500 text-white shadow-2xl shadow-orange-500/40">
                      <selectedType.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-orange-200">{selectedType.tagline}</p>
                      <h2 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">{selectedType.title}</h2>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
                  <div>
                    <h3 className="mb-3 text-2xl font-black text-sky-950">Overview</h3>
                    <p className="mb-6 leading-relaxed text-slate-600">{selectedType.overview}</p>
                    <h3 className="mb-3 text-2xl font-black text-sky-950">Practice Details</h3>
                    <p className="leading-relaxed text-slate-600">{selectedType.details}</p>
                  </div>
                  <div className="rounded-[2rem] bg-orange-50/70 p-6">
                    <h3 className="mb-4 text-lg font-black text-sky-950">Benefits</h3>
                    <div className="space-y-3">
                      {selectedType.benefits.map((benefit) => (
                        <div key={benefit} className="flex gap-3 text-sm font-semibold leading-relaxed text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {selectedType.perfectFor.length > 0 && (
                      <div className="mt-7">
                        <h3 className="mb-3 text-lg font-black text-sky-950">Perfect For</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedType.perfectFor.map((item) => (
                            <span key={item} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-orange-100/80 px-6 py-5 md:px-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-sky-950">Ready to begin?</h3>
                      <p className="text-sm text-slate-500">Start this yoga type with your paid access or request the next steps on WhatsApp.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartToday}
                      className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3.5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-200 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isCheckingAccess}
                    >
                      {isCheckingAccess ? 'Checking Access...' : 'Start Today'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default YogaTypes;
