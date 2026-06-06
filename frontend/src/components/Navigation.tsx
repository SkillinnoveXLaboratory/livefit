import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ChevronRight,
  User,
  LogOut,
  Target,
  BookOpen,
  HeartPulse,
  Clock,
  Users,
  Image as ImageIcon,
  Settings2,
  Brain,
  Leaf,
  Globe2,
  Monitor,
  Check,
} from 'lucide-react';
import Logo from './Logo';
import { AUTH_FALLBACK_PATH, clearStoredSession } from '../config/auth';
import {
  fetchAccountOverview,
  getAuthToken,
  getStoredUser,
  hasStoredPaidAccess,
} from '../lib/account';

const liveFitSections = [
  { name: 'Home Section', id: 'hero', desc: 'Welcome & dynamic introduction', icon: Sparkles },
  { name: 'Wellness Programs', id: 'unique-needs', desc: 'Personalized wellness offerings', icon: Target },
  { name: 'Our Story', id: 'our-story', desc: 'Our background and philosophy', icon: BookOpen },
  { name: 'One-on-One Coaching', id: 'one-on-one-coaching', desc: 'Private personal training sessions', icon: User },
  { name: 'Live Group Zoom Sessions', id: 'live-group-zoom', desc: 'Interactive remote video classes', icon: Monitor },
  { name: 'Transform Habits', id: 'wellness-programs', desc: 'Holistic courses and capsules', icon: HeartPulse },
  { name: 'Global Schedule', id: 'schedule', desc: 'Class times and easy booking calendar', icon: Clock },
  { name: 'Yoga Gallery', id: 'gallery', desc: 'Visual showcase of styles and poses', icon: ImageIcon },
  { name: 'Testimonials', id: 'testimonials', desc: 'Reviews from our global community', icon: Users },
];

const workfitSections = [
  {
    name: 'Wellness Challenges',
    id: 'wellness-challenges',
    desc: 'Step challenges, virtual marathons, team challenges, and custom wellness goals',
    icon: Target,
  },
  {
    name: '1-on-1 Coaching',
    id: 'wellness-solutions',
    desc: 'Personalized wellness coaching for individual needs',
    icon: User,
  },
  {
    name: 'Diverse Holistic Wellness programs',
    id: 'wellness-solutions',
    desc: 'Movement, nutrition, mindfulness, and recovery',
    icon: Leaf,
  },
  {
    name: 'Mental Health & wellbeing',
    id: 'wellness-solutions',
    desc: 'Mindfulness, stress relief, and emotional balance',
    icon: Brain,
  },
  {
    name: 'On-site & Remote Wellness',
    id: 'wellness-solutions',
    desc: 'Wellness that works for in-office and remote teams',
    icon: Monitor,
  },
  {
    name: 'make breaks Effective',
    id: 'wellness-solutions',
    desc: 'Quick resets for energy, posture, and recovery',
    icon: Clock,
  },
  {
    name: 'Global Employee Engagement',
    id: 'global-employee-engagement',
    desc: 'Testimonials and outcomes from teams worldwide',
    icon: Globe2,
  },
  {
    name: 'Wellness Library',
    id: 'wellness-library',
    desc: 'On-demand videos, audio, and practical resources',
    icon: BookOpen,
  },
];

const scrollToElement = (id: string) => {
  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  const offset = 96;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  return true;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const token = getAuthToken();
  const settingsPath = user ? '/settings' : AUTH_FALLBACK_PATH;
  const isWorkFitContext = location.pathname.startsWith('/workfit') || location.pathname.startsWith('/solutions');
  const [hasVerifiedAccess, setHasVerifiedAccess] = useState(() => hasStoredPaidAccess(user?.email));

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      scrollToElement(targetId);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let cancelled = false;

    if (!user?.email) {
      setHasVerifiedAccess(false);
      return undefined;
    }

    setHasVerifiedAccess(hasStoredPaidAccess(user.email));

    if (!token) {
      return undefined;
    }

    fetchAccountOverview(token)
      .then((overview) => {
        if (!cancelled) {
          setHasVerifiedAccess(overview.hasPaidAccess);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasVerifiedAccess(hasStoredPaidAccess(user.email));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, user?.email]);

  const handleLogout = () => {
    clearStoredSession();
    setHasVerifiedAccess(false);
    navigate(AUTH_FALLBACK_PATH);
  };

  const goToHomeSection = (id: string) => {
    setActiveDropdown(null);
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    scrollToElement(id);
  };

  const goToWorkFitSection = (id: string) => {
    setActiveDropdown(null);
    setIsOpen(false);

    if (location.pathname !== '/workfit') {
      navigate(`/workfit#${id}`);
      return;
    }

    scrollToElement(id);
  };

  const goToConsultation = () => {
    setIsOpen(false);
    navigate(isWorkFitContext ? '/workfitinquiry' : '/livefitinquiry', {
      state: { from: `${location.pathname}${location.search}${location.hash}` },
    });
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-orange-100/50 bg-white py-0.5 md:py-1">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <Link
              to="/"
              className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
            >
              {isWorkFitContext ? 'LiveFit Home' : 'Home'}
            </Link>

            <Link
              to="/workfit"
              className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
            >
              WorkFit
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => {
                  if (isWorkFitContext) {
                    navigate('/solutions');
                  } else {
                    goToHomeSection('unique-needs');
                  }
                }}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-[88px] z-[90] w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-[26px] border border-slate-700/60 shadow-2xl"
                  >
                    {isWorkFitContext ? (
                      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="bg-[#10161d] p-6 lg:p-8">
                          <p className="mb-5 text-[11px] font-black uppercase tracking-[0.32em] text-orange-400">Challenges</p>
                          <button
                            type="button"
                            onClick={() => goToWorkFitSection('wellness-challenges')}
                            className="block w-full rounded-[22px] border border-orange-500/20 bg-orange-500/10 p-5 text-left transition-colors hover:bg-orange-500/15"
                          >
                            <div className="mb-2 text-lg font-black text-white">Wellness Challenges</div>
                            <p className="text-sm leading-relaxed text-slate-400">Step challenges, virtual marathons, team challenges, and custom wellness goals</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDropdown(null);
                              navigate('/solutions/employee-burnout');
                            }}
                            className="mt-5 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.22em] text-sky-950"
                          >
                            View All Solutions
                            <ChevronRight className="h-4 w-4 text-orange-500" />
                          </button>
                        </div>

                        <div className="border-t border-white/5 bg-[#171f29] p-6 lg:border-l lg:border-t-0 lg:p-8">
                          <p className="mb-5 text-[11px] font-black uppercase tracking-[0.32em] text-orange-400">Other Solutions</p>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {workfitSections.slice(1).map((item) => (
                              <button
                                key={`${item.name}-${item.id}`}
                                type="button"
                                onClick={() => goToWorkFitSection(item.id)}
                                className="flex items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-white/5"
                              >
                                <div className="mt-0.5 rounded-xl bg-white/5 p-2 text-slate-300">
                                  <item.icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="mb-1 text-[14px] font-semibold text-white break-words">{item.name}</div>
                                  <div className="text-[12px] leading-relaxed text-slate-400 break-words">{item.desc}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#10161d] p-8">
                        <p className="mb-5 text-[11px] font-black uppercase tracking-[0.32em] text-orange-400">Core Sections</p>
                        <div className="grid grid-cols-2 gap-3">
                          {liveFitSections.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => goToHomeSection(item.id)}
                              className="flex items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-white/5"
                            >
                              <div className="mt-0.5 rounded-xl bg-white/5 p-2 text-slate-300">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="mb-1 text-[14px] font-semibold text-white">{item.name}</div>
                                <div className="text-[12px] leading-relaxed text-slate-400">{item.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isWorkFitContext && (
              <>
                <Link
                  to="/pricing"
                  className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
                >
                  Plans
                </Link>

                <Link
                  to="/playlists"
                  className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
                >
                  Playlist
                </Link>

                <Link
                  to={settingsPath}
                  className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
                >
                  Settings
                </Link>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(249, 115, 22, 0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={goToConsultation}
              className="group relative flex items-center rounded-full bg-orange-600 pl-16 pr-8 py-5 text-xs font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-orange-100 transition-all"
            >
              <div className="absolute left-2 top-2 bottom-2 aspect-square rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)]">
                <div className="flex h-full w-full items-center justify-center">
                  <ChevronRight className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                Book a Demo
              </span>
            </motion.button>

            {!user && (
              <Link
                to="/login"
                className="text-sm font-black uppercase tracking-[0.25em] text-sky-950 transition-colors hover:text-orange-600"
              >
                Login
              </Link>
            )}

            {user && (
              <div
                className="relative ml-2"
                onMouseEnter={() => setActiveDropdown('user')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-orange-500/20 bg-white p-0.5 shadow-md transition-all hover:border-orange-500"
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-inner">
                      <span className="text-sm font-black tracking-tighter text-white">{user.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  </motion.div>

                  {hasVerifiedAccess && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 14, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full z-[100] mt-4 w-72 overflow-hidden rounded-[24px] border border-orange-100/50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                    >
                      <div className="border-b border-orange-100/30 bg-gradient-to-br from-orange-50/60 to-white p-6">
                        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Profile</p>
                        <h4 className="text-lg font-black leading-tight text-sky-950">Hi, {user.name}</h4>
                        <p className="mt-1 truncate text-[11px] font-bold lowercase tracking-widest text-sky-900/40">
                          {user.email || 'Welcome back'}
                        </p>
                        {hasVerifiedAccess && (
                          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                            Paid Verified
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(null);
                            navigate('/pricing');
                          }}
                          className="w-full rounded-2xl px-4 py-4 text-left transition-all hover:bg-white hover:text-orange-600"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                              <Sparkles className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-black uppercase tracking-widest text-sky-950">Plans</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Membership options</span>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(null);
                            navigate('/playlists');
                          }}
                          className="w-full rounded-2xl px-4 py-4 text-left transition-all hover:bg-white hover:text-orange-600"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                              <BookOpen className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-black uppercase tracking-widest text-sky-950">Playlist</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Videos & lessons</span>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveDropdown(null);
                            navigate('/settings');
                          }}
                          className="w-full rounded-2xl px-4 py-4 text-left transition-all hover:bg-white hover:text-orange-600"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                              <Settings2 className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-black uppercase tracking-widest text-sky-950">Settings</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Billing & password</span>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full rounded-2xl px-4 py-4 text-left transition-all hover:bg-white hover:text-orange-600"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                              <LogOut className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-black uppercase tracking-widest text-sky-950">Logout</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Sign out of session</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <button className="p-2 text-sky-950 lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden"
          >
            <div className="flex h-full w-full flex-col px-4 py-8 md:px-8">
              <div className="mb-12 flex items-center justify-between gap-4">
                <Logo />
                <button onClick={() => setIsOpen(false)} className="shrink-0 rounded-full bg-sky-50 p-2">
                  <X className="h-8 w-8 text-sky-600" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                >
                  {isWorkFitContext ? 'LiveFit Home' : 'Home'}
                </Link>

                <Link
                  to="/workfit"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                >
                  WorkFit
                </Link>

                <Link
                  to={isWorkFitContext ? '/solutions' : '/#unique-needs'}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                >
                  Solutions
                </Link>

                {!isWorkFitContext && (
                  <>
                    <Link
                      to="/pricing"
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                    >
                      Plans
                    </Link>

                    <Link
                      to="/playlists"
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                    >
                      Playlist
                    </Link>

                    <Link
                      to={settingsPath}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-serif font-bold italic text-sky-950 md:text-3xl"
                    >
                      Settings
                    </Link>
                  </>
                )}

                <div className="mt-8">
                  <span className="mb-6 block text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">{isWorkFitContext ? 'WorkFit Solutions' : 'Core Sections'}</span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {(isWorkFitContext ? workfitSections : liveFitSections).map((item) => (
                      <button
                        key={`${item.name}-${item.id}`}
                        type="button"
                        onClick={() => isWorkFitContext ? goToWorkFitSection(item.id) : goToHomeSection(item.id)}
                        className="flex w-full items-center gap-4 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 md:h-12 md:w-12">
                          <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-1 text-lg font-serif font-bold italic leading-none text-sky-950 md:text-xl">{item.name}</span>
                          <span className="text-[10px] font-bold leading-tight text-sky-400 md:text-xs">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {isWorkFitContext && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/solutions/employee-burnout');
                      }}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-[1.4rem] bg-sky-950 px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white"
                    >
                      View All Solutions
                      <ChevronRight className="h-4 w-4 text-orange-300" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-12">
                {user ? (
                  <div className="mb-6 rounded-[2rem] border border-orange-100/50 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
                            <span className="text-sm font-black text-white">{user.name.slice(0, 2).toUpperCase()}</span>
                          </div>
                          {hasVerifiedAccess && (
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-orange-400">Signed in</p>
                          <p className="text-lg font-black leading-none text-sky-950">Hi, {user.name}</p>
                          {hasVerifiedAccess && (
                            <span className="mt-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                              Paid Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm transition-all hover:bg-orange-600 hover:text-white"
                      >
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>

                    {!isWorkFitContext && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <Link
                          to="/pricing"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-[1.4rem] bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-sky-950"
                        >
                          Plans
                          <Sparkles className="h-4 w-4 text-orange-500" />
                        </Link>
                        <Link
                          to="/playlists"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-[1.4rem] bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-sky-950"
                        >
                          Playlist
                          <BookOpen className="h-4 w-4 text-orange-500" />
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-[1.4rem] bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-sky-950"
                        >
                          Settings
                          <Settings2 className="h-4 w-4 text-orange-500" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="mb-6 flex w-full items-center justify-center rounded-[2rem] border-2 border-sky-100 py-5 text-sm font-black uppercase tracking-[0.3em] text-sky-950"
                  >
                    Login to Account
                  </Link>
                )}

                <button
                  onClick={goToConsultation}
                  className="w-full rounded-[2rem] bg-orange-600 py-6 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-orange-100"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
