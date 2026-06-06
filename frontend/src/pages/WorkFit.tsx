import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Sparkles, ChevronRight, ArrowRight, Flower2, Activity, Apple,
  Play, Users, Headphones, FileText, Monitor, Smartphone, Wifi, Users2, Clock,
  Video, UserCircle2, BookOpen, Star, PlayCircle, Brain, HeartPulse, TrendingDown,
  Armchair, TrendingUp, ShieldCheck, CheckCircle2, CalendarDays, Zap, Scale, DollarSign,
  Wind, Shield, Droplets, Check, Quote, Building, Globe2, PlusCircle, MinusCircle,
  ChevronDown, ChevronUp, Mail, Phone, Footprints, Smile, Target, Trophy, Leaf, Moon, Film,
  Dumbbell, UserPlus, ClipboardList, BarChart3, Building2, Sliders, Heart
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, buildMediaUrl } from '../lib/env';

const BASE_URL = API_BASE_URL || 'http://localhost:5000';

const resolveWorkfitImageUrl = (value: string) => {
  return buildMediaUrl(value) || value;
};

type WorkfitChallenge = {
  id: string;
  slug: string;
  title: string;
  desc: string;
  image: string;
  stat: string;
  statDesc: string;
  displayOrder: number;
  isActive: boolean;
};

type Playlist = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
};

const challengeRevealContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const challengeRevealUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const challengeRevealLeft = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const challengeRevealRight = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const challengeCardReveal = (delay = 0) => ({
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, delay, ease: 'easeOut' },
  },
});

const CountUpValue = ({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1200;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

const TypingText = ({
  text,
  speed = 60,
  caretClassName = 'bg-white',
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

const workfitWorksReveal = {
  hidden: { opacity: 0, y: 70 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: 'easeOut' },
  },
};

const workfitWorksContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const workfitWorksCard = (delay = 0) => ({
  hidden: { opacity: 0, y: 80, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.05, delay, ease: [0.23, 1, 0.32, 1] },
  },
});

const stackCards = [
  {
    number: '01',
    title: '1-on-1 Coaching',
    subtitle: 'Personalized wellness coaching designed around individual goals, lifestyles, and workplace challenges.',
    accent: 'orange',
    image: '/images/ws1.webp',
    badge: null,
    checklist: ['Fitness & workout guidance', 'Healthy habit coaching', 'Weight management support', 'Stress & energy management', 'Lifestyle optimization', 'Personalized wellness journeys'],
    detailBlocks: [],
    visualTags: [],
    footerTitle: 'Personalized Wellness',
    footerText: 'That Creates Lasting Change',
    visual: 'dashboard',
  },
  {
    number: '02',
    title: 'Diverse Wellness Programs',
    subtitle: 'Engaging wellness programs and challenges that inspire consistency and healthy habits across teams.',
    accent: 'blue',
    image: '/images/ws2.webp',
    badge: 'BUILT FOR ALL FITNESS LEVELS',
    checklist: ['Step competitions', 'Yoga & fitness challenges', 'Meditation journeys', 'Sleep better programs', 'Healthy eating challenges', 'Fat burn & movement programs', 'Running & jogging initiatives'],
    detailBlocks: [],
    visualTags: ['Yoga', 'Running'],
    footerTitle: 'Turn Healthy Habits',
    footerText: 'Into Team Culture',
    visual: 'leaderboard',
  },
  {
    number: '03',
    title: 'Calm & Mindfulness',
    subtitle: 'Support employee mental well-being through guided mindfulness, meditation, stress reduction, and wellness resources.',
    accent: 'green',
    image: '/images/hw1.webp',
    badge: null,
    checklist: [],
    detailBlocks: [
      { title: 'Guided Mindfulness Sessions', text: 'Structured mindfulness and meditation that reduce stress, improve focus, and build emotional balance.' },
      { title: 'Mental Wellness Resources', text: 'Expert webinars, recovery guidance, sleep audio, and dynamic wellness libraries at your fingertips.' },
    ],
    visualTags: ['Mindfulness'],
    footerTitle: 'Calmer Minds.',
    footerText: 'Stronger Performance.',
    visual: 'breathing',
  },
  {
    number: '04',
    title: 'On-Site & Remote',
    subtitle: 'Flexible wellness experiences designed for both in-office and remote teams across all schedules.',
    accent: 'green',
    image: '/images/hw2.webp',
    badge: 'TEAM WELLNESS',
    checklist: [],
    detailBlocks: [
      { title: 'Flexible Scheduling', text: 'Wellness that fits every schedule, time zone and work style without disrupting core company productivity.' },
      { title: 'Virtual Group Activities', text: 'Live yoga, movement breaks, fitness sessions, breathwork workshops and interactive hybrid events.' },
    ],
    visualTags: ['Team Wellness'],
    footerTitle: 'Wellness Anywhere',
    footerText: 'Your Team Works.',
    visual: 'schedule',
  },
  {
    number: '05',
    title: 'Make Breaks Effective',
    subtitle: 'Transform short workplace breaks into powerful moments of recovery and mental reset.',
    accent: 'orange',
    image: '/images/hw3.webp',
    badge: '5 MIN RESET',
    checklist: ['Mobility breaks', 'Desk yoga', 'Deep breathing', 'Shoulder relief', 'Lower back recovery', 'Midday energy'],
    detailBlocks: [],
    visualTags: ['Neck Stretch'],
    footerTitle: 'Small Breaks.',
    footerText: 'Big Impact.',
    visual: 'reset',
  },
];

const WorkfitStackSolutions = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const totalCards = stackCards.length;

  const getCardState = (index: number) => {
    const relativeIndex = (index - activeIndex + totalCards) % totalCards;
    if (relativeIndex === 0) return 'state-center';
    if (relativeIndex === totalCards - 1) return 'state-left-1';
    if (relativeIndex === 1) return 'state-right-1';
    if (relativeIndex === 2) return 'state-right-2';
    return 'state-hidden';
  };

  return (
    <section id="wellness-solutions" className="relative overflow-hidden bg-[#0b1120] py-24 text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Wellness Solutions Designed for Modern Teams
          </div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Holistic wellness for every part of your team
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Empower your people with personalized support, interactive challenges, and effective daily practices designed for healthy habits and high productivity.
          </p>
        </div>

        <div className="wellness-cards-container" data-active-index={activeIndex}>
          {stackCards.map((card, index) => (
            <article
              key={card.number}
              className={`wellness-card card-${index + 1} accent-${card.accent} ${getCardState(index)}`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="number-title">
                <span className="card-number">{card.number}</span>
                <span>{card.title}</span>
              </div>
              {card.badge && <div className="stack-badge">{card.badge}</div>}
              <p className="subtitle">{card.subtitle}</p>

              <div className="visual-container">
                <img src={card.image} alt={card.title} loading="lazy" />
                {card.visual === 'dashboard' && (
                  <div className="wellness-dashboard overlaid-component">
                    <div className="title">Wellness Dashboard</div>
                    <div className="wellness-score-dial">87</div>
                    <ul className="metrics">
                      {['Activity', 'Nutrition', 'Sleep', 'Stress'].map((label, metricIndex) => (
                        <li className="metric-item" key={label}>
                          {label}
                          <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: `${80 - metricIndex * 8}%` }} /></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {card.visual === 'leaderboard' && (
                  <div className="step-leaderboard overlaid-component">
                    <div className="title">Step Challenge Leaderboard</div>
                    <ol>
                      {['Team Alpha', 'Team Power', 'Team Elevate', 'Team Vitality'].map((team, teamIndex) => (
                        <li key={team}><span className="leaderboard-rank">{teamIndex + 1}</span><span className="leaderboard-team">{team}</span><span className="leaderboard-steps">{['842,421', '735,290', '607,612', '512,309'][teamIndex]}</span></li>
                      ))}
                    </ol>
                  </div>
                )}
                {card.visual === 'breathing' && (
                  <div className="breathing-session overlaid-component">
                    <div className="breathing-text"><div className="breathing-title">Breathing Session</div><div className="breathing-status">Active</div></div>
                    <div className="breathing-icons"><div className="breathing-wave" /><div className="play-icon">||</div></div>
                  </div>
                )}
                {card.visual === 'schedule' && (
                  <div className="team-schedule overlaid-component">
                    <strong>Flexible Scheduling</strong>
                    <span>Office + Remote</span>
                    <span>Every time zone</span>
                  </div>
                )}
                {card.visual === 'reset' && (
                  <div className="reset-routine overlaid-component">
                    <strong>Neck Stretch</strong>
                    {['Neck Stretch', 'Shoulder Roll', 'Deep Breathing', 'Back Release'].map((step, stepIndex) => (
                      <span key={step}><b>{stepIndex + 1}</b>{step}</span>
                    ))}
                  </div>
                )}
                {card.visualTags.length > 0 && (
                  <div className="stack-visual-tags">
                    {card.visualTags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                )}
              </div>

              {card.checklist.length > 0 && (
                <ul className="check-list">
                  {card.checklist.map((item) => (
                    <li key={item}><CheckCircle2 className="check-icon" size={16} /> {item}</li>
                  ))}
                </ul>
              )}

              {card.detailBlocks.length > 0 && (
                <div className="stack-detail-blocks">
                  {card.detailBlocks.map((detail) => (
                    <div key={detail.title}>
                      <strong>{detail.title}</strong>
                      <p>{detail.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="card-footer">
                <ShieldCheck className="footer-shield" size={18} />
                <span>{card.footerTitle} <span className="footer-green-text">{card.footerText}</span></span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkFit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, 150]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.1]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);
  const [workfitChallenges, setWorkfitChallenges] = useState<WorkfitChallenge[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/content/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDbTestimonials(data);
      })
      .catch(err => console.error("Error loading testimonials:", err));

    fetch(`${BASE_URL}/api/workfit-challenges`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setWorkfitChallenges(data);
      })
      .catch(err => console.error("Error loading WorkFit challenges:", err));

    fetch(`${BASE_URL}/api/playlists`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPlaylists(data);
      })
      .catch(err => console.error("Error loading playlists:", err));
  }, []);

  const getDynamicTestimonial = (index: number, defaultTestimonial: any) => {
    if (dbTestimonials && dbTestimonials[index]) {
      const dbT = dbTestimonials[index];
      return {
        ...defaultTestimonial,
        quote: `"${dbT.text}"`,
        body: `Employee wellness index grew, and general workplace participation reached an all-time high of ${dbT.rating * 20}%!`,
        name: dbT.author,
        role: dbT.role,
        company: ""
      };
    }
    return {
      ...defaultTestimonial,
      company: ""
    };
  };

  const workfitTestimonials = [
    { name: "Mahesh", title: "Founder & CEO", company: "", country: "USA", text: "WorkFit has transformed the way our team feels and performs. The sessions are practical, engaging, and easy to integrate into our busy workday.", tags: ["Energy", "Focus", "Team Wellness"] },
    { name: "Shrikant", title: "Founder & CTO", company: "", country: "USA", text: "The blend of yoga, mobility, and mindfulness is exceptional. We've seen more energy, better concentration, and stronger teamwork.", tags: ["Performance", "Mindfulness", "Teamwork"] },
    { name: "Amita", title: "Project Coordinator", company: "", country: "UK", text: "We just had one class with WorkFit and the experience was outstanding! Our team loved it and felt an immediate sense of relaxation and positivity. We're excited to continue this journey.", tags: ["First Class Experience", "Relaxation", "Excited"] },
    { name: "Prasad", title: "Founder & MD", company: "", country: "India", text: "WorkFit's approach is holistic and very impactful. Our employees are more consistent, less stressed, and more productive.", tags: ["Holistic Wellness", "Stress Relief", "Productivity"] },
    { name: "Madhu", title: "Co-founder", company: "", country: "USA", text: "The flexibility and variety of programs make it easy for everyone to participate. Our team looks forward to every session!", tags: ["Engagement", "Flexibility", "Well-being"] },
    { name: "Emma", title: "Professor", company: "", country: "UK", text: "Just one session with WorkFit and I felt refreshed and re-energized. Practical, well-guided, and perfect for busy professional life!", tags: ["Refreshment", "Energy", "Wellness"] },
    { name: "Bekir Orahan", title: "Professor", company: "", country: "Turkey", text: "The session was practical, refreshing, and eye-opening. It gave us simple tools for better health, focus, and mental clarity.", tags: ["Mental Clarity", "Focus", "Practical Tools"] },
    { name: "Michael Johnson", title: "Director - People & Culture", company: "", country: "USA", text: "WorkFit is a game-changer for our workplace. We've noticed less stress, better focus, and a happier team.", tags: ["Stress Reduction", "Focus", "Happiness"] }
  ];

  const slides = [
    {
      image: '/images/wh1.webp',
      badge: 'CORPORATE WELLNESS PLATFORM',
      badgeStyle: 'text',
      titleChunks: [
        { orange: 'Move', dark: ' Better.' },
        { orange: 'Feel', dark: ' Better.' },
        { orange: 'Work', dark: ' Better.' }
      ],
      description: 'Yoga, mindfulness, fitness, nutrition and healthy habit programs designed to energize your teams-wherever they work, wherever they are.',
      primaryButtonText: 'Book a Demo',
      secondaryButtonText: 'Explore Solutions',
      buttonStyle: 'screenshot'
    },
    {
      image: '/images/wh2.webp',
      theme: 'dark',
      iconBadge: true,
      iconColor: 'bg-[#f97316]',
      badgeColor: 'text-[#f97316]',
      IconComponent: Flower2,
      titleChunks: [
        { text: 'Move Together.' },
        { text: 'Work ', orange: 'Better.' }
      ],
      description: 'Yoga, Stretch at Desk & Workouts\nfor a Stronger You.',
      listAccent: '#f97316',
      listFeatures: [
        { icon: Flower2, title: 'Yoga for Balance', desc: 'Relieve stress, improve flexibility\nand focus.' },
        { icon: Armchair, title: 'Stretch at Desk', desc: 'Quick stretches to ease tension\nand improve posture.' },
        { icon: Dumbbell, title: 'Workouts for Strength', desc: 'Build strength, boost energy\nand stay healthy.' },
      ],
      tagline: 'Small moves. Big impact. Every day.'
    },
    {
      image: '/images/wh3.webp',
      theme: 'dark',
      iconBadge: true,
      iconColor: 'bg-[#3b82f6]',
      badgeColor: 'text-[#3b82f6]',
      IconComponent: Flower2,
      title: ['Mind. Calm. Focused.'],
      subtitle: 'Mental & Emotional Wellbeing for Your Team',
      description: 'Support your team\'s mental and emotional wellbeing with expert-led sessions and resources that truly make a difference.',
      listFeatures: [
        { icon: UserCircle2, title: 'Live 1-on-1 Sessions', desc: 'Personalized support for stress, anxiety, burnout and more.' },
        { icon: Users2, title: 'Group Sessions', desc: 'Interactive sessions to build resilience, emotional balance and connection.' },
        { icon: BookOpen, title: 'Resource Library', desc: 'Yoga, meditation, mindfulness, blogs and podcasts - learn, anytime.' },
      ],
      tagline: 'Stronger minds. Happier teams. Better workplaces.'
    },
    {
      image: '/images/wh4.webp',
      theme: 'dark',
      iconBadge: true,
      iconColor: 'bg-[#22c55e]',
      badgeColor: 'text-[#22c55e]',
      IconComponent: Activity,
      title: ['Stronger Together'],
      subtitle: 'Challenges & Team Programs',
      description: 'Fun, engaging and purpose-driven challenges that bring teams closer while building healthier habits.',
      multiSection: [
        {
          title: 'Physical Challenges',
          color: '#22c55e',
          fullWidth: true,
          items: [
            { icon: Footprints, title: 'Step Challenges', desc: 'Move more together. Track steps, climb leaderboards, win together.' },
            { icon: Activity, title: 'Virtual Runs', desc: 'Run anytime, anywhere. One goal, one team.' },
            { icon: Flower2, title: 'Sun Salutations', desc: 'Build strength, flexibility and mindfulness together.' },
          ]
        },
        {
          title: 'Mental Wellbeing Challenges',
          color: '#22c55e',
          items: [
            { icon: Flower2, title: 'Mindfulness Challenge', desc: 'Pause, breathe and stay present together.' },
            { icon: Smile, title: 'Gratitude Challenge', desc: 'Spread positivity. Build a culture of appreciation.' },
            { icon: Target, title: 'Focus Challenge', desc: 'Stay focused, reduce stress and achieve more.' },
          ]
        },
        {
          title: 'Team Programs',
          color: '#22c55e',
          items: [
            { icon: Users2, title: 'Team Wellness Program', desc: 'Holistic wellbeing plans tailored for your team.' },
            { icon: UserCircle2, title: 'Wellness Workshops', desc: 'Interactive sessions on fitness, nutrition, stress management & more.' },
            { icon: Trophy, title: 'Rewards & Recognition', desc: 'Celebrate progress. Inspire lasting change.' },
          ]
        }
      ],
      tagline: 'Better habits. Stronger teams. Healthier workplaces.'
    },
    {
      image: '/images/wh5.webp',
      theme: 'dark',
      iconBadge: true,
      iconColor: 'bg-[#3b82f6]', // Clear blue as requested
      badgeColor: 'text-[#3b82f6]',
      IconComponent: Apple,
      title: ['Healthy Habits'],
      subtitle: 'Lifestyle & Wellness Programs',
      description: 'Build healthier routines through nutrition coaching, mindful living and sustainable wellbeing practices designed for modern teams.',
      simpleListFeatures: [
        { icon: Leaf, text: 'Personalized nutrition &\nhealthy eating guidance' },
        { icon: Brain, text: 'Positive mindset &\nstress-management programs' },
        { icon: Scale, text: 'Work-life balance &\nburnout prevention' },
        { icon: Moon, text: 'Sleep, recovery &\nenergy optimization' },
        { icon: Clock, text: 'Intermittent fasting &\nhabit-building challenges' },
        { icon: BookOpen, text: 'Wellness resources including\nblogs, podcasts & guided sessions' }
      ],
      tagline: 'Healthy people. Positive culture. Better performance.'
    }
  ];
  const heroSlides = slides.slice(0, 5).map((slide) => ({
    ...slides[0],
    image: slide.image,
  }));
  const heroContent = heroSlides[0] ?? heroSlides[currentSlide];
  const activeHeroSlide = heroSlides[currentSlide] ?? heroContent;
    const countryFlagMap: Record<string, string> = {
    USA: '\uD83C\uDDFA\uD83C\uDDF8',
    UK: '\uD83C\uDDEC\uD83C\uDDE7',
    India: '\uD83C\uDDEE\uD83C\uDDF3',
    Turkey: '\uD83C\uDDF9\uD83C\uDDF7',
    Germany: '\uD83C\uDDE9\uD83C\uDDEA',
    France: '\uD83C\uDDEB\uD83C\uDDF7',
    Canada: '\uD83C\uDDE8\uD83C\uDDE6',
    Australia: '\uD83C\uDDE6\uD83C\uDDFA',
    Japan: '\uD83C\uDDEF\uD83C\uDDF5',
    Singapore: '\uD83C\uDDF8\uD83C\uDDEC',
  };
  const formatCountryBadge = (country?: string) => {
    const cleaned = (country || '').replace(/^\?+\s*/, '').trim();
    if (!cleaned) return '';
    const [name] = cleaned.split(/\s+/);
    const flag = countryFlagMap[name] || countryFlagMap[cleaned] || '';
    return flag ? `${flag} ${cleaned}` : cleaned;
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  const challengeIconStyles = [
    { icon: Brain, iconColor: "text-orange-500", iconBg: "bg-orange-50/70 border-orange-100" },
    { icon: Armchair, iconColor: "text-blue-500", iconBg: "bg-blue-50/70 border-blue-100" },
    { icon: HeartPulse, iconColor: "text-purple-500", iconBg: "bg-purple-50/70 border-purple-100" },
    { icon: Users2, iconColor: "text-emerald-500", iconBg: "bg-emerald-50/70 border-emerald-100" },
    { icon: Clock, iconColor: "text-amber-500", iconBg: "bg-amber-50/70 border-amber-100" },
    { icon: Globe2, iconColor: "text-cyan-500", iconBg: "bg-cyan-50/70 border-cyan-100" },
    { icon: DollarSign, iconColor: "text-rose-500", iconBg: "bg-rose-50/70 border-rose-100" },
    { icon: Sparkles, iconColor: "text-indigo-500", iconBg: "bg-indigo-50/70 border-indigo-100" },
  ];

  const fallbackChallengeCards = [
    { slug: 'employee-burnout', title: 'Employee Burnout', desc: 'High stress, long hours, and constant pressure lead to mental & physical exhaustion.', image: '/images/tc2.webp', stat: '55%', statDesc: 'of employees experience burnout in 2023*', displayOrder: 1 },
    { slug: 'posture-back-pain', title: 'Posture & Back Pain', desc: 'Sedentary work and poor posture cause chronic pain and discomfort.', image: '/images/postureback pain.webp', stat: '80%+', statDesc: 'of jobs are predominantly sedentary*', displayOrder: 2 },
    { slug: 'stress-mental-health', title: 'Stress & Mental Health', desc: 'Stress, anxiety & poor well-being impact focus, creativity, and overall performance.', image: '/images/stress.webp', stat: '72%', statDesc: 'of employees report high workplace stress*', displayOrder: 3 },
    { slug: 'low-employee-engagement', title: 'Low Employee Engagement', desc: 'Disconnected teams lead to low morale, low participation, and weak culture.', image: '/images/wp2.webp', stat: '23%', statDesc: 'actively engaged at work globally*', displayOrder: 4 },
    { slug: 'low-productivity-energy', title: 'Low Productivity & Energy', desc: 'Fatigue, low energy and distractions reduce productivity and increase errors.', image: '/images/tc3.webp', stat: '2.5 hrs', statDesc: 'lost productivity per employee each day due to stress*', displayOrder: 5 },
    { slug: 'hybrid-work-challenges', title: 'Hybrid Work Challenges', desc: 'Remote & hybrid teams struggle with wellness, connection and healthy routines.', image: '/images/Hybridworkchallenges.webp', stat: '63%', statDesc: 'of companies struggle to support hybrid employee wellness*', displayOrder: 6 },
    { slug: 'high-healthcare-costs', title: 'High Healthcare Costs', desc: 'Lifestyle issues lead to rising healthcare costs and more sick leaves.', image: '/images/wp4.webp', stat: '$2,000', statDesc: 'higher annual healthcare cost per unhealthy employee*', displayOrder: 7 },
    { slug: 'boring-wellness-programs', title: 'Boring Wellness Programs', desc: "Generic programs have low participation and don't create real impact.", image: '/images/Wc8.webp', stat: '70%', statDesc: 'wellness programs fail due to low engagement*', displayOrder: 8 },
  ];

  const workfitChallengeCards = (workfitChallenges.length > 0 ? workfitChallenges : fallbackChallengeCards).map((challenge, idx) => ({
    ...challenge,
    id: String(challenge.displayOrder || idx + 1).padStart(2, '0'),
    image: resolveWorkfitImageUrl(challenge.image),
    path: `/solutions/${challenge.slug}`,
    ...challengeIconStyles[idx % challengeIconStyles.length],
  }));

  return (
    <div ref={containerRef} className="pb-0 overflow-hidden bg-[#0a1128] pt-24 md:pt-27">
      {/* Hero */}
      <section id="workfit-hero" className="relative min-h-[900px] md:min-h-[860px] lg:h-[calc(100vh-5rem)] lg:min-h-[760px] flex items-center overflow-hidden bg-[#07101d]">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentSlide}
              src={activeHeroSlide.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover object-[center_top] opacity-25 blur-[1px]"
              alt="WorkFit Background"
            />
          </AnimatePresence>

          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.28),transparent_28%),radial-gradient(circle_at_82%_26%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(115deg,#07101d_0%,rgba(7,16,29,0.96)_42%,rgba(7,16,29,0.68)_100%)]" />
          <div className="absolute left-[-12rem] top-[-12rem] z-10 h-[32rem] w-[32rem] rounded-full border border-white/10" />
          <div className="absolute right-[-10rem] bottom-[-12rem] z-10 h-[34rem] w-[34rem] rounded-full bg-orange-500/10 blur-[80px]" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#07101d] to-transparent" />
        </div>

        <div className="w-full h-full max-w-[1480px] mx-auto px-5 md:px-10 lg:px-16 relative z-20 pt-10 pb-24 lg:pt-0 lg:pb-0">
          <div className="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative max-w-2xl text-left rounded-[2.5rem] border border-white/10 bg-white/[0.07] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-9 lg:h-[650px] lg:overflow-y-auto lg:p-10">
            <div className="absolute -left-3 top-10 hidden h-24 w-1 rounded-full bg-gradient-to-b from-orange-400 to-amber-300 lg:block" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              {heroContent.iconBadge && (
                <div className={`w-16 h-16 rounded-full ${heroContent.iconColor || 'bg-[#f97316]'} flex items-center justify-center mb-6 shadow-lg`}>
                  {heroContent.IconComponent ? (
                    React.createElement(heroContent.IconComponent, { className: "w-8 h-8 text-white" })
                  ) : (
                    <Flower2 className="w-8 h-8 text-white" />
                  )}
                </div>
              )}

              {heroContent.badge && (
                heroContent.badgeStyle === 'text' ? (
                  <div className="mb-5 inline-flex rounded-full border border-orange-300/25 bg-orange-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-orange-200 md:text-xs">
                    {heroContent.badge}
                  </div>
                ) : heroContent.badgeStyle === 'number' ? (
                  <div className={`${heroContent.badgeColor || 'text-[#f97316]'} font-bold text-2xl md:text-3xl mb-2`}>
                    {heroContent.badge}
                  </div>
                ) : (
                  <div className="inline-block px-4 py-1.5 border border-orange-200 rounded-full bg-orange-50 text-orange-600 font-bold text-[10px] md:text-xs tracking-[0.1em] mb-6 shadow-sm">
                    {heroContent.badge}
                  </div>
                )
              )}

              {heroContent.titleChunks ? (
                <h1 className="mb-6 text-5xl font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl">
                  {heroContent.titleChunks.map((chunk: any, idx: number) => (
                    <span key={idx} className="block">
                      {chunk.text && <span>{chunk.text}</span>}
                      {chunk.orange && <span className="text-[#f97316]">{chunk.orange}</span>}
                      {chunk.dark && <span>{chunk.dark}</span>}
                    </span>
                  ))}
                </h1>
              ) : (
                <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
                  {heroContent.title?.map((line: string, idx: number) => (
                    <span key={idx} className={`block ${heroContent.orangeTitleIndex === idx ? 'text-[#f97316]' : ''}`}>
                      {line}
                    </span>
                  ))}
                </h1>
              )}

              {heroContent.subtitle && (
                <p className="mb-6 text-xl font-semibold leading-relaxed text-orange-200 md:text-2xl">
                  {heroContent.subtitle}
                </p>
              )}

              {heroContent.description && (
                <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-slate-200/80 md:text-lg">
                  {heroContent.description}
                </p>
              )}

              {heroContent.bullets && (
                <div className="space-y-3 mb-10">
                  {heroContent.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border border-orange-300/40 flex items-center justify-center bg-orange-400/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <span className="text-white/90 font-medium md:text-lg">{bullet}</span>
                    </div>
                  ))}
                </div>
              )}

              {heroContent.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                  {heroContent.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-sm">
                        <feature.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-white/90 whitespace-nowrap">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {(heroContent as any).listFeatures && (() => {
                const accent = (heroContent as any).listAccent || '#3b82f6';
                return (
                  <div className="space-y-4 mb-6">
                    {(heroContent as any).listFeatures.map((f: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'transparent', border: `1px solid ${accent}` }}>
                          <f.icon className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm md:text-base">{f.title}</div>
                          <div className="text-sm text-gray-400 leading-snug whitespace-pre-line">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {(heroContent as any).multiSection && (() => {
                const sections = (heroContent as any).multiSection;
                const fullSections = sections.filter((s: any) => s.fullWidth);
                const halfSections = sections.filter((s: any) => !s.fullWidth);
                const accentColor = (heroContent as any).badgeColor?.match(/\[(.*?)\]/)?.[1] || (heroContent as any).badgeColor?.replace('text-', '') || '#22c55e';
                const renderItem = (item: any, iIdx: number, small = false) => (
                  <div key={iIdx} className="flex items-start gap-2.5">
                    <div className={`${small ? 'w-7 h-7' : 'w-8 h-8'} rounded-full flex items-center justify-center shrink-0 mt-0.5`} style={{ background: 'transparent', border: `1px solid ${accentColor}` }}>
                      <item.icon style={{ color: accentColor }} className={small ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{item.title}</div>
                      <div className="text-xs text-gray-400 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                );
                return (
                  <div className="mb-3 space-y-3">
                    {fullSections.map((section: any, sIdx: number) => (
                      <div key={sIdx}>
                        <h4 className="text-white font-bold text-sm mb-2">{section.title}</h4>
                        <div className="space-y-1.5">
                          {section.items.map((item: any, iIdx: number) => renderItem(item, iIdx))}
                        </div>
                      </div>
                    ))}
                    {halfSections.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {halfSections.map((section: any, sIdx: number) => (
                          <div key={sIdx}>
                            <h4 className="text-white font-bold text-xs mb-2">{section.title}</h4>
                            <div className="space-y-1.5">
                              {section.items.map((item: any, iIdx: number) => renderItem(item, iIdx, true))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {(heroContent as any).simpleListFeatures && (() => {
                const accentColor = (heroContent as any).badgeColor?.match(/\[(.*?)\]/)?.[1] || (heroContent as any).badgeColor?.replace('text-', '') || '#6366f1';
                return (
                  <div className="mb-8 flex flex-col">
                    {(heroContent as any).simpleListFeatures.map((f: any, idx: number, arr: any[]) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ border: `1px solid ${accentColor}` }}>
                          <f.icon className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                        <div className={`flex-1 py-3 ${idx !== arr.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
                          <div className="text-white text-sm font-medium whitespace-pre-line leading-snug">
                            {f.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {(heroContent as any).tagline && (
                <p className="text-sm font-semibold mb-6" style={{ color: (heroContent as any).badgeColor?.match(/\[(.*?)\]/)?.[1] || (heroContent as any).badgeColor?.replace('text-', '') || '#3b82f6' }}>
                  {(heroContent as any).tagline}
                </p>
              )}

              {(heroContent.primaryButtonText || heroContent.secondaryButtonText) && (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {heroContent.primaryButtonText === 'Book a Demo' ? (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.25)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/workfitinquiry')}
                      className="group relative flex w-full shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-amber-300 py-5 pl-16 pr-8 text-xs font-black uppercase tracking-[0.3em] text-slate-950 shadow-[0_22px_55px_rgba(249,115,22,0.28)] transition-all sm:w-auto"
                    >
                      <div className="absolute left-2 top-2 bottom-2 aspect-square bg-slate-950 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                        <ChevronRight className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                        {heroContent.primaryButtonText}
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/workfitinquiry')}
                      className={`group relative overflow-hidden font-bold transition-all flex items-center justify-center gap-2 ${heroContent.buttonStyle === 'screenshot'
                          ? 'bg-gradient-to-r from-orange-400 to-amber-300 text-slate-950 rounded-full px-8 py-4 shadow-[0_18px_45px_rgba(249,115,22,0.25)] w-full sm:w-auto text-[15px]'
                          : heroContent.buttonStyle === 'outline'
                            ? 'border border-white/15 text-white bg-white/10 hover:bg-white/15 rounded-full px-8 py-4'
                            : 'bg-gradient-to-r from-orange-400 to-amber-300 text-slate-950 shadow-xl shadow-orange-950/20 rounded-full px-8 py-4'
                        }`}
                    >
                      {heroContent.primaryButtonText}
                      {heroContent.buttonStyle !== 'screenshot' && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                  )}

                  {heroContent.secondaryButtonText && (
                    <motion.button
                      onClick={() => {
                        if (heroContent.secondaryButtonText === 'Explore Solutions') {
                          navigate('/solutions/employee-burnout');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`font-bold transition-all flex items-center justify-center gap-2 ${heroContent.buttonStyle === 'screenshot'
                          ? 'bg-white/10 text-white border border-white/15 rounded-full px-8 py-4 hover:bg-white/15 w-full sm:w-auto text-[15px] backdrop-blur-md'
                          : 'bg-white/10 text-white border border-white/15 rounded-full px-8 py-4 backdrop-blur-md hover:bg-white/15'
                        }`}
                    >
                      {heroContent.secondaryButtonText}
                      {heroContent.buttonStyle === 'screenshot' && <ArrowRight className="w-4 h-4" />}
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
          <motion.div
            className="relative hidden h-[650px] lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="absolute left-10 top-8 h-32 w-32 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute right-2 top-12 h-[34rem] w-[82%] rotate-2 overflow-hidden rounded-[3.5rem] border border-white/12 bg-white/10 p-3 shadow-[0_45px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div className="relative h-full overflow-hidden rounded-[2.8rem]">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={`hero-frame-${currentSlide}`}
                    src={activeHeroSlide.image}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                    alt="WorkFit wellness preview"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101d]/76 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/15 bg-white/12 p-5 text-white backdrop-blur-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-200">Corporate Wellness</p>
                  <p className="mt-2 text-2xl font-black leading-tight">Designed for teams that need energy, calm, and momentum.</p>
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-24 rounded-[2rem] border border-white/12 bg-white/12 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="text-4xl font-black text-orange-300">87</div>
              <div className="mt-1 text-[10px] font-black uppercase tracking-[0.26em] text-white/60">Wellness Score</div>
            </div>
            <div className="absolute bottom-20 left-8 rounded-[2rem] border border-white/12 bg-[#07101d]/72 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="text-sm font-black">Live + On-demand</div>
              <div className="mt-1 text-xs text-white/55">Built for every time zone</div>
            </div>
            <div className="absolute bottom-7 right-0 rounded-[2rem] border border-orange-300/20 bg-orange-400/15 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="text-sm font-black">Smooth adoption</div>
              <div className="mt-1 text-xs text-white/60">Programs people actually join</div>
            </div>
          </motion.div>
          </div>
        </div>

        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-100/10 rounded-full blur-[120px] -z-10" />
      </section>

      {/* The Challenge Section */}
      <section id="one-on-one-coaching" className="py-24 bg-[#0a1128] text-white overflow-hidden relative">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-[#0a1128] to-[#0a1128] pointer-events-none"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-[-8%] right-[-6%] w-[28rem] h-[28rem] rounded-full bg-orange-500/6 blur-[110px] pointer-events-none"
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-12%] left-[-8%] w-[26rem] h-[26rem] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none"
          animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & Icons */}
            <motion.div
              className="lg:col-span-4 pr-0 lg:pr-8"
              variants={challengeRevealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={challengeRevealUp} className="text-orange-500 font-bold text-sm tracking-[0.2em] uppercase mb-4">
                The Challenge
              </motion.div>
              <motion.h2 variants={challengeRevealUp} className="text-4xl md:text-5xl font-sans font-bold mb-6 leading-tight">
                Today's Workplace<br />Is Under <span className="text-orange-500">Pressure</span>
              </motion.h2>
              <motion.p variants={challengeRevealUp} className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Rising stress, unhealthy habits, and disengagement are impacting employee well-being and business performance.
              </motion.p>

              <motion.div className="grid grid-cols-4 gap-4" variants={challengeRevealLeft}>
                {[
                  { label: 'High Stress &\nBurnout', icon: Brain, color: 'text-orange-500' },
                  { label: 'Sedentary\nLifestyles', icon: Armchair, color: 'text-blue-400' },
                  { label: 'Chronic\nHealth Risks', icon: HeartPulse, color: 'text-red-400' },
                  { label: 'Low Engagement\n& Productivity', icon: TrendingDown, color: 'text-green-400' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    variants={challengeCardReveal(0.08 * idx)}
                    whileHover={{ y: -4, transition: { duration: 0.22 } }}
                    className="text-center group"
                  >
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/10 transition-colors">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                    <div className="text-[10px] md:text-xs font-semibold text-gray-300 leading-tight whitespace-pre-line">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column: Stat Cards */}
            <motion.div
              className="lg:col-span-8"
              variants={challengeRevealRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { stat: '77%', desc: 'of employees experience work-related stress', source: 'Gallup', img: '/images/tc1.webp' },
                  { stat: '60%', desc: 'of employees feel exhausted at work', source: 'McKinsey', img: '/images/tc2.webp' },
                  { stat: '40%', desc: 'drop in productivity due to poor well-being', source: 'WHO', img: '/images/tc3.webp' },
                  { stat: '$1.8T', desc: 'lost annually by businesses due to poor employee health', source: 'Harvard Business Review', img: '/images/tc4.webp' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={challengeCardReveal(0.09 * idx)}
                    whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.25 } }}
                    className="rounded-2xl overflow-hidden bg-[#0d1530] border border-white/5 flex flex-col group cursor-pointer hover:border-white/10 transition-colors h-full"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img src={item.img} alt="Stat Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                      <div className="absolute inset-0 bg-[#0a1128]/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-3">{item.stat}</div>
                        <p className="text-gray-300 text-xs leading-relaxed mb-6">{item.desc}</p>
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">Source: {item.source}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How WorkFit Helps Section */}
      <section className="py-24 bg-[#0a1128] text-white border-y border-white/5 relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/8 via-[#0a1128] to-[#0a1128] pointer-events-none"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-[-8%] right-[-8%] w-[26rem] h-[26rem] rounded-full bg-orange-500/6 blur-[120px] pointer-events-none"
          animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-12%] left-[-8%] w-[28rem] h-[28rem] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none"
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            className="text-center mb-16"
            variants={challengeRevealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.div variants={challengeRevealUp} className="text-orange-500 font-bold text-lg tracking-[0.2em] uppercase mb-4">
              How WorkFit Helps
            </motion.div>
            <motion.h2 variants={challengeRevealUp} className="text-4xl md:text-5xl font-sans font-bold mb-6 leading-tight">
              Wellness programs that drive real impact
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={challengeRevealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { title: 'Improve Well-being', desc: 'Reduce stress, boost energy, and support physical & mental health.', icon: Flower2, iconBg: 'bg-orange-500', img: '/images/wp1.webp' },
              { title: 'Increase Engagement', desc: 'Foster connection, motivation, and a positive workplace culture.', icon: Users2, iconBg: 'bg-green-500', img: '/images/wp2.webp' },
              { title: 'Boost Productivity', desc: 'Healthy employees are more focused, productive, and present.', icon: TrendingUp, iconBg: 'bg-purple-500', img: '/images/wp3.webp' },
              { title: 'Lower Healthcare Costs', desc: 'Prevent illnesses and reduce medical claims & absenteeism.', icon: ShieldCheck, iconBg: 'bg-blue-500', img: '/images/wp4.webp' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={challengeCardReveal(0.08 * idx)}
                whileHover={{ y: -10, scale: 1.015, transition: { duration: 0.25 } }}
                className="rounded-2xl overflow-visible bg-[#0d1530] border border-white/5 flex flex-col group cursor-pointer hover:border-white/10 transition-colors relative mt-6 lg:mt-0"
              >
                <div className="h-48 overflow-hidden rounded-t-2xl relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                  <div className="absolute inset-0 bg-[#0a1128]/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Floating Icon */}
                <div className={`absolute top-[168px] left-6 w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center border-4 border-[#0d1530] shadow-lg z-10 group-hover:-translate-y-1 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>

                <div className="p-6 pt-10 flex-1 flex flex-col justify-between relative z-0">
                  <div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlights Bar at the Bottom of Section */}
          <motion.div
            className="pt-10 border-t border-white/10 mt-16"
            variants={challengeRevealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0">
              {[
                {
                  title: "Holistic Approach",
                  desc: "Mind, body & workplace wellness in one place.",
                  icon: Leaf
                },
                {
                  title: "Expert Guidance",
                  desc: "Certified coaches & wellness experts.",
                  icon: Users2
                },
                {
                  title: "Measurable Impact",
                  desc: "Track progress and see real results.",
                  icon: TrendingUp
                },
                {
                  title: "Trusted by Companies",
                  desc: "Corporate wellness partners you can rely on.",
                  icon: ShieldCheck
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={challengeCardReveal(0.07 * idx)}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className={`flex gap-4 items-start px-6 ${idx !== 3 ? 'md:border-r border-white/10' : ''
                    }`}
                >
                  <item.icon className="w-8 h-8 text-[#f97316] shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-white text-sm mb-1 tracking-wide">{item.title}</h4>
                    <p className="text-slate-300/80 text-[11px] leading-relaxed max-w-[190px] font-semibold">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Workplace Challenges Grid Section */}
      <section id="wellness-challenges" className="py-24 bg-white text-[#0a1128] overflow-hidden relative">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-500/5 via-white to-white pointer-events-none"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-[-10%] right-[-8%] w-[28rem] h-[28rem] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none"
          animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-12%] left-[-8%] w-[26rem] h-[26rem] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none"
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-20">
            <div className="text-[#f97316] font-bold text-sm tracking-[0.25em] uppercase mb-4">
              THE PROBLEMS WE SOLVE
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold mb-6 leading-tight text-[#0a1128] tracking-tight">
              Workplace Challenges. Real Solutions.
            </h2>
            <div className="w-20 h-1 bg-[#f97316] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workfitChallengeCards.map((card, idx) => (
              <article
                key={idx}
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-500 flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/remote-030.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#0a1128]/5" />
                </div>

                {/* Floating Round Number Badge */}
                <div className="absolute top-[204px] left-6 w-10 h-10 rounded-full bg-[#f97316] text-white flex items-center justify-center font-black text-sm z-10 border-2 border-white shadow-md">
                  {card.id}
                </div>

                {/* Card Body */}
                <div className="p-6 pt-9 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-sky-950 mb-3 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-sky-900/60 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                      {card.desc}
                    </p>
                  </div>

                  {/* Stat Area */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col justify-end">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${card.iconBg} border flex items-center justify-center shrink-0`}>
                        <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline flex-wrap">
                          <span className={`font-black text-lg md:text-xl ${card.iconColor} mr-1`}>{card.stat}</span>
                          <span className="text-[10px] text-sky-900/50 font-bold leading-tight block truncate md:whitespace-normal">
                            {card.statDesc}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.path);
                      }}
                      className="flex items-center text-[#f97316] font-extrabold text-xs tracking-wider uppercase mt-4 hover:text-orange-600 transition-colors self-start group/link"
                    >
                      Learn more
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/link:translate-x-1 transition-transform stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div
            className="text-left text-[10px] md:text-xs text-sky-900/40 font-bold mt-10 pt-4 border-t border-slate-100"
          >
            *Sources: Gallup 2024, WHO 2023, Harvard Business Review, McKinsey, Global Wellness Institute
          </div>
        </div>
      </section>

      <WorkfitStackSolutions />

      {/* Resource & Library Section */}
      <section id="wellness-library" className="py-12 md:py-16 bg-[#0a1128] text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
              <span className="text-orange-500 font-bold text-sm tracking-[0.2em] uppercase">Your Wellness Library</span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">
              Your Wellness Library <br className="hidden md:block" />
              for <span className="text-orange-500">Everyday Work Life</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
              Expert-led wellness resources from the admin playlist library, ready for employees anytime and anywhere.
            </p>
          </motion.div>

          {playlists.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                <Film className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black">No wellness videos published yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Add playlists from the admin dashboard and they will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.a
                  href={playlists[0].videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="lg:col-span-1 rounded-2xl bg-[#111836] border border-white/5 overflow-hidden flex flex-col group hover:border-orange-400/35 transition-colors"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-64 lg:h-72 w-full overflow-hidden">
                    <img src={resolveWorkfitImageUrl(playlists[0].thumbnail)} alt={playlists[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md flex items-center gap-1.5">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/90 transition-all">
                        <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-orange-400">{playlists[0].category}</p>
                      <h3 className="text-2xl font-bold mb-3 leading-tight">{playlists[0].title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">{playlists[0].description}</p>
                    </div>
                    <div className="flex items-center justify-end text-orange-500 font-bold text-sm group-hover:text-orange-400 transition-colors">
                      Watch Session <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {playlists.slice(1, 5).map((playlist, idx) => {
                    const accents = [
                      { icon: Play, color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
                      { icon: Users2, color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/30' },
                      { icon: Headphones, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
                      { icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
                    ];
                    const accent = accents[idx % accents.length];
                    const AccentIcon = accent.icon;
                    const tags = playlist.category.split(/[,&]/).map((item) => item.trim()).filter(Boolean).slice(0, 3);

                    return (
                      <motion.a
                        key={playlist.id}
                        href={playlist.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.08 }}
                        className="rounded-2xl bg-[#111836] border border-white/5 overflow-hidden flex flex-col group hover:border-white/15 transition-colors relative"
                      >
                        <div className="absolute inset-0 right-0 w-[65%] ml-auto overflow-hidden">
                          <img src={resolveWorkfitImageUrl(playlist.thumbnail)} alt={playlist.title} className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700 opacity-60" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#111836] via-[#111836]/80 to-transparent" />
                        </div>
                        <div className="relative p-6 flex flex-col h-full min-h-[260px] z-10">
                          <div className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center mb-4 ${accent.color}`}>
                            <AccentIcon className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-bold mb-2 leading-tight">{playlist.title}</h3>
                          <p className="text-gray-400 text-xs leading-relaxed mb-6 max-w-[240px] line-clamp-4">{playlist.description}</p>
                          <div className="mt-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(tags.length ? tags : [playlist.category]).map((tag) => (
                                <span key={tag} className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-gray-300 backdrop-blur-sm">{tag}</span>
                              ))}
                            </div>
                            <div className="flex justify-end">
                              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {playlists.length > 5 && (
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {playlists.slice(5).map((playlist) => (
                    <a key={playlist.id} href={playlist.videoUrl} target="_blank" rel="noreferrer" className="group flex gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-colors hover:border-orange-400/30">
                      <img src={resolveWorkfitImageUrl(playlist.thumbnail)} alt={playlist.title} className="h-20 w-24 shrink-0 rounded-xl object-cover" loading="lazy" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-400">{playlist.category}</p>
                        <h3 className="mt-1 text-sm font-black leading-snug text-white group-hover:text-orange-100">{playlist.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{playlist.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="rounded-2xl bg-[#111836] border border-white/5 p-4 lg:py-5 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 mt-6 relative overflow-hidden"
              >
                <div className="flex-1 w-full lg:pr-8 lg:border-r border-white/10 z-10">
                  <h3 className="text-lg font-bold mb-3">Accessible Across <span className="text-orange-500">Every Workplace</span></h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                    {[
                      { icon: Monitor, label: 'Desktop\nAccess' },
                      { icon: Smartphone, label: 'Mobile\nFriendly' },
                      { icon: Wifi, label: 'Remote\nTeams' },
                      { icon: Users2, label: 'Hybrid\nWorkplaces' },
                      { icon: PlayCircle, label: 'On-Demand\nAccess' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <item.icon className="w-5 h-5 text-orange-500 shrink-0" />
                        <span className="text-[10px] text-gray-300 font-medium leading-tight whitespace-pre-line">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-5 w-full lg:w-auto z-10">
                  <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.15)] relative">
                    <div className="absolute inset-0 rounded-full border border-orange-500/50 scale-[1.15]" />
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 lg:max-w-[260px]">
                    <h4 className="text-base font-bold mb-1">Explore the Wellness Hub</h4>
                    <p className="text-gray-400 text-[10px] leading-tight mb-2.5">
                      Empower employees with wellness support that continues beyond the session.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 px-5 rounded-full text-xs transition-colors flex items-center gap-2"
                      onClick={() => navigate('/playlists')}>
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
      {/* Testimonials Section - Light Theme */}
      <section id="global-employee-engagement" className="py-24 bg-white text-[#0B1530]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={challengeRevealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={challengeRevealUp} className="text-[#f97316] font-bold text-xs tracking-[0.25em] uppercase mb-4">TESTIMONIALS</motion.div>
            <motion.h2 variants={challengeRevealUp} className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-[#0B1530] mb-5 tracking-tight leading-[1.1]">
              What Teams say about Workfit
            </motion.h2>
            <motion.p variants={challengeRevealUp} className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            Helping organizations create healthier, happier, and more engaged workplaces through movement, mindfulness, and modern wellness experiences.
            </motion.p>
          </motion.div>

          {/* Featured Testimonial */}
          {(() => {
            const fT = getDynamicTestimonial(4, {
              img: '/images/Test1.webp',
              quote: '"WorkFit completely changed employee participation in wellness."',
              body: 'Employees actually looked forward to the sessions. The energy, engagement, and participation levels improved dramatically after introducing weekly wellness programs.',
              name: 'Jessica L.',
              avatar: '/images/remote-048.webp',
              role: 'HR Manager',
              company: 'Tech Company'
            });
            return (
              <motion.div
                className="rounded-[2.5rem] border border-gray-100 overflow-hidden mb-16 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.025)]"
                variants={challengeRevealContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                  {/* Left: Photo */}
                  <motion.div className="lg:col-span-5 min-h-[320px] lg:min-h-full relative overflow-hidden" variants={challengeRevealLeft}>
                    <img
                      src={fT.img}
                      alt="WorkFit Team Session"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Right: Quote Card */}
                  <motion.div className="lg:col-span-7 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center relative" variants={challengeRevealRight}>
                    {/* Elegant Quote Icon */}
                    <div className="text-[#f97316] text-[5rem] font-serif leading-none absolute top-4 left-6 md:top-6 md:left-10 select-none opacity-15">"</div>
                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B1530] mb-6 leading-snug tracking-tight">
                        {fT.quote}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 font-medium">
                        {fT.body}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-5 h-5 text-[#f97316]" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#f97316]">+41%</div>
                            <div className="text-[11px] font-bold text-gray-400 leading-tight">Participation Increase</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center shrink-0">
                            <Smile className="w-5 h-5 text-[#f97316]" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0B1530]">Higher</div>
                            <div className="text-[11px] font-bold text-gray-400 leading-tight">Employee Morale</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50/50 flex items-center justify-center shrink-0">
                            <Users2 className="w-5 h-5 text-[#f97316]" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-[#0B1530]">Better</div>
                            <div className="text-[11px] font-bold text-gray-400 leading-tight">Team Connection</div>
                          </div>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center justify-between w-full pt-6 border-t border-gray-100">
                        <div>
                          <div className="font-extrabold text-base text-[#0B1530] leading-tight">{fT.name}</div>
                          <div className="text-xs font-semibold text-gray-400 mt-0.5">{fT.role}</div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1">
                          {formatCountryBadge('USA')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })()}

          {/* Scrolling Testimonials Marquee (Floating) */}
          {(() => {
            const allWorkfitTestimonials = [
              getDynamicTestimonial(0, {
                img: '/images/Test2.webp',
                quote: '"The stretch breaks became our team\'s favorite part of the week."',
                body: 'Employees felt more energized, relaxed, and productive after the sessions.',
                name: 'Mary D.',
                role: 'People Operations',
                country: 'USA',
                tags: ['Stretch Breaks', 'Energy', 'Productivity']
              }),
              getDynamicTestimonial(1, {
                img: '/images/Test3.webp',
                quote: '"WorkFit made wellness engaging instead of another HR activity."',
                body: 'The wellness challenges created excitement across teams and improved participation naturally.',
                name: 'Priya S.',
                role: 'Wellness Lead',
                country: 'India',
                tags: ['Wellness Challenges', 'Engagement', 'Teamwork']
              }),
              getDynamicTestimonial(2, {
                img: '/images/Test4.webp',
                quote: '"Our hybrid employees finally felt connected again."',
                body: 'The virtual wellness activities improved communication, engagement, and team morale.',
                name: 'Kevin R.',
                role: 'HR Director',
                country: 'USA',
                tags: ['Hybrid Wellness', 'Communication', 'Morale']
              }),
              getDynamicTestimonial(3, {
                img: '/images/Test5.webp',
                quote: '"The sessions helped reduce stress during high-pressure work periods."',
                body: 'Employees appreciated having practical wellness tools during demanding project cycles.',
                name: 'Sarah M.',
                role: 'Program Manager',
                country: 'UK',
                tags: ['Stress Reduction', 'Mindfulness', 'Well-being']
              }),
              // Mahesh
              getDynamicTestimonial(5, {
                img: '/images/office1.webp',
                quote: '"WorkFit has transformed the way our team feels and performs."',
                body: 'The sessions are practical, engaging, and easy to integrate into our busy workday.',
                name: 'Mahesh',
                role: 'Founder & CEO',
                country: 'USA',
                tags: ['Energy', 'Focus', 'Team Wellness']
              }),
              // Shrikant
              getDynamicTestimonial(6, {
                img: '/images/2.webp',
                quote: '"The blend of yoga, mobility, and mindfulness is exceptional."',
                body: 'We\'ve seen more energy, better concentration, and stronger teamwork.',
                name: 'Shrikant',
                role: 'Founder & CTO',
                country: 'USA',
                tags: ['Performance', 'Mindfulness', 'Teamwork']
              }),
              // Amita
              getDynamicTestimonial(7, {
                img: '/images/3.webp',
                quote: '"We just had one class with WorkFit and the experience was outstanding!"',
                body: 'I loved it and felt an immediate sense of relaxation and positivity. I\'m excited to continue this journey with more sessions ahead.',
                name: 'Amita',
                role: 'Project Coordinator',
                country: 'UK',
                tags: ['First Class Experience', 'Relaxation', 'Excited']
              }),
              // Prasad
              getDynamicTestimonial(8, {
                img: '/images/4.webp',
                quote: '"WorkFit\'s approach is holistic and very impactful."',
                body: 'Our employees are more consistent, less stressed, and more productive.',
                name: 'Prasad',
                role: 'Founder & MD',
                country: 'India',
                tags: ['Holistic Wellness', 'Stress Relief', 'Productivity']
              }),
              // Madhu
              getDynamicTestimonial(9, {
                img: '/images/5.webp',
                quote: '"The flexibility and variety of programs make it easy for everyone to participate."',
                body: 'Our team looks forward to every session!',
                name: 'Madhu',
                role: 'Co-founder',
                country: 'USA',
                tags: ['Engagement', 'Flexibility', 'Well-being']
              }),
              // Emma
              getDynamicTestimonial(10, {
                img: '/images/office2.webp',
                quote: '"Just one session with WorkFit and I felt refreshed and re-energized."',
                body: 'Practical, well-guided, and perfect for busy professional life!',
                name: 'Emma',
                role: 'Professor',
                country: 'UK',
                tags: ['Refreshment', 'Energy', 'Wellness']
              }),
              // Bekir Orahan
              getDynamicTestimonial(11, {
                img: '/images/office3.webp',
                quote: '"The session was practical, refreshing, and eye-opening."',
                body: 'It gave us simple tools for better health, focus, and mental clarity.',
                name: 'Bekir Orahan',
                role: 'Professor',
                country: 'Turkey',
                tags: ['Mental Clarity', 'Focus', 'Practical Tools']
              }),
              // Michael Johnson
              getDynamicTestimonial(12, {
                img: '/images/8.webp',
                quote: '"WorkFit is a game-changer for our workplace."',
                body: 'We\'ve noticed less stress, better focus, and a happier team.',
                name: 'Michael Johnson',
                role: 'Director - People & Culture',
                country: 'USA',
                tags: ['Stress Reduction', 'Focus', 'Happiness']
              })
            ];

            return (
              <motion.div className="relative flex overflow-hidden py-10 select-none group -mx-4 sm:-mx-6 lg:-mx-8 mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
                <motion.div 
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ 
                    duration: 95,
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                  className="flex gap-6 whitespace-nowrap min-w-max will-change-transform"
                  style={{ transform: 'translate3d(0,0,0)' }}
                >
                  {[...allWorkfitTestimonials, ...allWorkfitTestimonials].map((t, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={challengeCardReveal(0.04 * (idx % 6))}
                      onClick={() => setSelectedTestimonial(t)}
                      className="w-[360px] cursor-pointer flex-shrink-0 rounded-[2rem] border border-gray-100 overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col transition-[border-color,box-shadow,transform] duration-300 group/card relative whitespace-normal will-change-transform"
                    >
                      {/* Photo */}
                      <div className="h-44 overflow-hidden relative">
                        <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1 relative h-full justify-between">
                        <div>
                          {/* Star Rating */}
                          <div className="flex gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                            ))}
                          </div>
                          
                          <p className="text-sm font-extrabold text-[#0B1530] leading-snug mb-3 line-clamp-2">{t.quote}</p>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4 line-clamp-3">{t.body}</p>
                        </div>
                        
                        <div>
                          {/* Tag Badges */}
                          {t.tags && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {t.tags.map((tag: string) => (
                                <span key={tag} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-orange-50 text-[#f97316] rounded-md border border-orange-100/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Author Details without Profile Avatar and without Company */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <div className="text-xs font-extrabold text-[#0B1530] leading-tight">{t.name}</div>
                              <div className="text-[10px] font-semibold text-gray-400 mt-0.5 leading-tight">{t.role}</div>
                            </div>
                            {t.country && (
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1">
                                {formatCountryBadge(t.country)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Side Fades */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
              </motion.div>
            );
          })()}

          {/* Stats Row */}
          <motion.div className="rounded-[2.5rem] bg-gray-50/50 border border-gray-100 p-8 md:py-12 md:px-8 mb-16" variants={challengeRevealContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4">
              {[
                { icon: UserCircle2, value: 90, prefix: '', suffix: '%', label: 'employees prefer engaging wellness programs' },
                { icon: TrendingUp, value: 41, prefix: '+', suffix: '%', label: 'increase in wellness program participation' },
                { icon: HeartPulse, value: 27, prefix: '+', suffix: '%', label: 'improvement in employee engagement' },
                { icon: Brain, value: 32, prefix: '-', suffix: '%', label: 'reduction in stress levels' },
                { icon: Zap, value: 24, prefix: '+', suffix: '%', label: 'increase in overall productivity' },
                { icon: CalendarDays, value: 18, prefix: '-', suffix: '%', label: 'reduction in absenteeism' },
              ].map((stat, idx) => (
                <motion.div key={idx} variants={challengeCardReveal(0.05 * idx)} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="flex flex-col items-center text-center px-2 lg:border-r lg:border-gray-200/60 last:border-r-0">
                  <div className="w-10 h-10 flex items-center justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-[#f97316]" />
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0B1530] mb-2">
                    <CountUpValue value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-400 font-semibold leading-relaxed max-w-[140px] mx-auto">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* CTA Banner */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="rounded-[2.5rem] bg-[#091535] relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px]">
              {/* Left: Text */}
              <div className="lg:col-span-7 flex flex-col justify-center p-8 md:p-12 lg:p-16 z-10 relative">
                <div className="w-12 h-1 bg-[#f97316] mb-6 rounded-full" />
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  Ready To Bring WorkFit To Your Team?
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium">
                  Create a healthier, more energized, and more connected workplace with wellness experiences employees genuinely enjoy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/workfitinquiry')}
                    className="group relative pl-16 pr-8 py-5 bg-[#f97316] text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center shrink-0 w-full sm:w-auto"
                  >
                    <div className="absolute left-2 top-2 bottom-2 aspect-square bg-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                      <ChevronRight className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                      BOOK A DEMO
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/workfitinquiry')}
                    className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    PLAN A WELLNESS WEEK <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              {/* Right: Image */}
              <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full overflow-hidden">
                <img
                  src="/images/wt_cta.webp"
                  alt="WorkFit Team"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Smooth Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#091535] via-[#091535]/40 to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091535] via-[#091535]/40 to-transparent z-10 lg:hidden" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* How WorkFit Works Section */}
      <section className="py-20 bg-white text-[#0a1128] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-24"
            variants={workfitWorksReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.h2 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold mb-6 text-[#ff5722] tracking-tight relative inline-block" variants={workfitWorksReveal}>
              How Workfit Works
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#ff5722] rounded-full"></div>
            </motion.h2>
            <motion.p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-10 font-medium" variants={workfitWorksReveal}>
              Our proven 4-step process makes workplace wellness easy to implement<br className="hidden md:block"/> and delivers results your teams and business can feel.
            </motion.p>
          </motion.div>

          {/* 4-Step Process Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 xl:gap-8 mb-16"
            variants={workfitWorksContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                id: '01',
                title: 'Discover & Onboard',
                desc: 'We learn about your goals, culture, and team needs to build the perfect wellness foundation.',
                icon: UserPlus,
                img: '/images/Test3.webp'
              },
              {
                id: '02',
                title: 'Assess & Customize',
                desc: 'We assess baseline well-being and customize a program that fits your people and priorities.',
                icon: ClipboardList,
                img: '/images/wt_cta.webp'
              },
              {
                id: '03',
                title: 'Engage & Execute',
                desc: 'We deliver engaging wellness sessions, challenges, and resources your teams will love.',
                icon: Activity,
                img: '/images/Wc1.webp'
              },
              {
                id: '04',
                title: 'Measure & Maximize',
                desc: 'We track results, share insights, and continuously optimize for greater impact.',
                icon: BarChart3,
                img: '/images/Test5.webp'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={workfitWorksCard(0.08 * idx)}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="relative flex flex-col bg-white rounded-[2rem] p-6 pt-14 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Connecting Arrow for lg screens */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-5 lg:-right-4 xl:-right-6 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center">
                    <ArrowRight className="text-[#ff5722] w-6 h-6" strokeWidth={2.5} />
                  </div>
                )}

                {/* Floating Icon */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#ff5722] rounded-full flex items-center justify-center shadow-lg">
                  <step.icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                <div className="text-center mb-3">
                  <span className="text-[#ff5722] font-bold text-xl mr-2">{step.id}</span>
                  <span className="font-extrabold text-[#091535] text-lg tracking-tight">{step.title}</span>
                </div>
                <p className="text-sm text-gray-600 text-center mb-6 flex-grow leading-relaxed font-medium px-2">
                  {step.desc}
                </p>
                <div className="rounded-2xl overflow-hidden h-40 w-full mt-auto bg-gray-100">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Banner */}
          <motion.div
            className="rounded-2xl bg-[#091535] overflow-hidden flex flex-col lg:flex-row items-stretch shadow-2xl mt-12 mb-6"
            variants={workfitWorksReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex-1 p-8 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-center justify-between">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8 flex-1">
                {/* Target Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ff5722] flex items-center justify-center shrink-0 border-[3px] border-[#091535] shadow-[0_0_0_4px_rgba(255,87,34,0.3)] mt-1">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                </div>
                
                {/* Text Block */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                    Wellness that works. Results that matter.
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    We make workplace wellness simple to start and easy to sustain-<br className="hidden md:block"/>
                    so you can focus on what matters most:<br className="hidden md:block"/>
                    <span className="text-[#ff5722] font-semibold mt-1 inline-block">your people and your business.</span>
                  </p>
                </div>
              </div>
              
              {/* Button Block */}
              <div className="flex flex-col items-center lg:items-center shrink-0 lg:pl-4">
                <button 
                  onClick={() => navigate('/workfitinquiry')}
                  className="bg-[#ff5722] text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg w-full sm:w-auto mb-3"
                >
                  BOOK A DEMO
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5722]" />
                  No obligation. Just better outcomes.
                </div>
              </div>
            </div>

            {/* Right side Image */}
            <div className="w-full lg:w-[35%] min-h-[250px] lg:min-h-auto relative shrink-0">
              <img src="/images/team_discussion.webp" className="absolute inset-0 w-full h-full object-cover object-center" />
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-6 text-gray-500 font-medium text-sm md:text-base tracking-wide word-spacing-large"
            variants={workfitWorksReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            A proven process. &nbsp;&nbsp;A healthier workforce. &nbsp;&nbsp;A stronger organization.
          </motion.div>
        </div>
      </section>

      {/* Our Program Formats Section */}
      <section className="py-20 bg-white text-[#0a1128] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Header & Right Image Card layout */}
          <motion.div
            className="flex flex-col lg:flex-row gap-8 mb-16 items-center"
            variants={workfitWorksContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Left text */}
            <motion.div className="flex-1 w-full lg:max-w-xl" variants={workfitWorksCard(0)}>
              <motion.div className="text-[#ff5722] font-bold text-2xl lg:text-3xl tracking-wide uppercase mb-3" variants={workfitWorksReveal}>
                OUR PROGRAM FORMATS
              </motion.div>
              <motion.h2 className="text-5xl md:text-6xl lg:text-[5rem] font-sans font-black text-[#091535] leading-[1] tracking-tight mb-8 uppercase" variants={workfitWorksReveal}>
                WELLNESS THAT FITS<br/>YOUR WORKPLACE
              </motion.h2>
              <motion.p className="text-gray-800 text-xl leading-relaxed font-medium" variants={workfitWorksReveal}>
                Flexible delivery options designed to engage your teams-<br className="hidden md:block"/>
                whether in the office, remote, or everywhere in between.
              </motion.p>
            </motion.div>

            {/* Right Image + Overlapping floating card */}
            <motion.div className="flex-1 w-full relative" variants={workfitWorksCard(0.1)}>
              <div className="w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <img src="/images/office3.webp" alt="Office Stretching" className="w-full h-full object-cover" />
              </div>
              
            </motion.div>
          </motion.div>

          {/* 4 Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={workfitWorksContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
          >
            {[
              {
                title: 'On-site Programs',
                desc: 'In-person sessions that bring energy, movement, and mindfulness right to your workplace.',
                icon: Building2,
                points: ['Group Fitness & Yoga', 'Wellness Talks & Workshops', 'Posture & Ergonomics Training'],
                img: '/images/office1.webp'
              },
              {
                title: 'Virtual Programs',
                desc: 'Live, interactive sessions that keep remote and hybrid teams connected and motivated.',
                icon: Monitor,
                points: ['Live Online Classes', 'Virtual Wellness Challenges', 'Expert Webinars'],
                img: '/images/zoom.webp'
              },
              {
                title: 'Hybrid Programs',
                desc: 'A blend of on-site and virtual experiences for a seamless wellness journey.',
                icon: Users2,
                points: ['On-site + Live Online', 'Hybrid Challenges', 'Flexible Participation'],
                img: '/images/hybrid_yoga.webp'
              },
              {
                title: 'Special Programs',
                desc: 'High-impact initiatives that create excitement, engagement, and lasting wellness habits.',
                icon: CalendarDays,
                points: ['Wellness Weeks', 'Challenges & Competitions', 'Wellness Retreats'],
                img: '/images/Wc1.webp'
              }
            ].map((card, idx) => (
              <motion.div key={idx} variants={workfitWorksCard(0.08 * idx)} whileHover={{ y: -6, transition: { duration: 0.25 } }} className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-orange-50/50 flex items-center justify-center text-[#ff5722] border border-orange-100 shrink-0">
                    <card.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#091535] leading-tight">{card.title}</h3>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-grow font-medium">{card.desc}</p>
                
                <ul className="space-y-3 mb-8">
                  {card.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-800 font-semibold">
                      <Check className="w-5 h-5 text-[#ff5722] shrink-0" strokeWidth={3} />
                      <span className="pt-0.5">{pt}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl overflow-hidden h-40 mt-auto bg-gray-100">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Banner */}
          <motion.div
            className="rounded-[2rem] bg-[#091535] overflow-hidden flex flex-col xl:flex-row items-stretch shadow-2xl border border-white/5"
            variants={workfitWorksReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="p-8 lg:p-10 flex flex-col xl:flex-row gap-10 lg:gap-12 items-center justify-between w-full">
              
              {/* Left text with Target Icon */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start flex-1 w-full">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg mt-1">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-[#ff5722]" strokeWidth={2} />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Customizable. Measurable. Meaningful.</h3>
                  <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                    Every organization is unique. We design programs that<br className="hidden lg:block"/> align with your goals and deliver measurable impact.
                  </p>
                </div>
              </div>

              {/* Center Button */}
              <div className="flex flex-col items-center shrink-0 xl:border-r border-white/10 xl:pr-12 w-full xl:w-auto">
                <button 
                  onClick={() => navigate('/workfitinquiry')}
                  className="bg-[#ff5722] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg w-full sm:w-auto mb-3"
                >
                  BOOK A DEMO
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5722]" />
                  No obligation. Just better outcomes.
                </div>
              </div>

              {/* Right Stats */}
              <div className="grid grid-cols-4 gap-6 lg:gap-12 justify-center shrink-0 w-full xl:w-auto">
                {[
                  { icon: Sliders, label: 'Tailored To You' },
                  { icon: UserCircle2, label: 'Expert Led' },
                  { icon: TrendingUp, label: 'Proven Results' },
                  { icon: Heart, label: 'Lasting Impact' },
                ].map((stat, i) => (
                  <motion.div key={i} variants={workfitWorksCard(0.06 * i)} className="flex flex-col items-center gap-4 text-center">
                    <stat.icon className="w-8 h-8 text-[#ff5722]" strokeWidth={1.5} />
                    <span className="text-gray-300 font-medium text-xs lg:text-sm max-w-[70px] leading-tight">
                      {stat.label.split(' ').map((word, j) => <React.Fragment key={j}>{word}<br/></React.Fragment>)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Companies Choose WorkFit Section */}
      <section className="py-10 bg-slate-50/50 text-[#0B1530] border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Dark Blue Hero Banner */}
          <div className="rounded-[2rem] bg-[#091535] relative overflow-hidden border border-white/5 shadow-xl mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">

              {/* Left Column: Text & Stats */}
              <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-10 z-10 relative">
                <div className="text-[#f97316] font-bold text-[10px] tracking-[0.25em] uppercase mb-3">WHY COMPANIES CHOOSE WORKFIT</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold text-white mb-4 leading-tight tracking-tight">
                  More than just wellness programs.<br />
                  <span className="text-[#f97316]">A partner in your teams....</span>
                </h2>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 max-w-xl font-medium">
                  WorkFit delivers modern, engaging, and results-driven wellness experiences that fit the way your team works today.
                </p>

                {/* Floating Stats Block */}
                <div className="bg-black/35 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-lg">
                  <div className="grid grid-cols-3 gap-2 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                    <div className="flex flex-col sm:flex-row items-center gap-2 pb-2 sm:pb-0">
                      <Users2 className="w-6 h-6 text-[#f97316] shrink-0" />
                      <div className="text-left">
                        <div className="text-base font-black text-white leading-tight">500+</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Organizations<br />Trust WorkFit</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 sm:pt-0 sm:pl-3">
                      <Building className="w-6 h-6 text-[#f97316] shrink-0" />
                      <div className="text-left">
                        <div className="text-base font-black text-white leading-tight">250K+</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Employees<br />Impacted</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 sm:pt-0 sm:pl-3">
                      <Star className="w-6 h-6 text-[#f97316] shrink-0" />
                      <div className="text-left">
                        <div className="text-base font-black text-white leading-tight">4.9/5</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Average Client<br />Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden">
                <img
                  src="/images/Wc1.webp"
                  alt="Team High Fiving"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Smooth Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#091535] via-[#091535]/40 to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091535] via-[#091535]/40 to-transparent z-10 lg:hidden" />
              </div>

            </div>
          </div>

          {/* 6-Card Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-14"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.12,
                },
              },
            }}
          >
            {[
              {
                icon: UserCircle2,
                title: 'Employee-Centric Approach',
                desc: 'Programs designed around employee needs, preferences, and workplace culture.',
                img: '/images/Wc2.webp'
              },
              {
                icon: Target,
                title: 'Engaging & Interactive Experiences',
                desc: 'Fun, dynamic sessions that employees love to attend and look forward to.',
                img: '/images/Wc3.webp'
              },
              {
                icon: Zap,
                title: 'Customized For Your Organization',
                desc: 'Tailored programs that align with your goals, challenges, and team dynamics.',
                img: '/images/Wc4.webp'
              },
              {
                icon: Monitor,
                title: 'Hybrid-Ready By Design',
                desc: 'Seamless experiences for in-office, remote, and hybrid teams.',
                img: '/images/Wc5.webp'
              },
              {
                icon: TrendingUp,
                title: 'Results That Matter',
                desc: 'Data-driven insights that show real improvements in wellbeing and productivity.',
                img: '/images/Wc6.webp'
              },
              {
                icon: Users,
                title: 'More Than a Vendor, A True Partner',
                desc: 'Dedicated support, continuous innovation, and a partnership that grows with you.',
                img: '/images/Wc7.webp'
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -80 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 1,
                      ease: [0.23, 1, 0.32, 1],
                      delay: idx * 0.05,
                    },
                  },
                }}
                whileHover={{ x: 4, y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-orange-50/50 flex items-center justify-center mb-3 shrink-0">
                    <card.icon className="w-4 h-4 text-[#f97316]" />
                  </div>
                  <h3 className="font-extrabold text-xs text-[#0B1530] mb-1.5 leading-snug">{card.title}</h3>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-3">{card.desc}</p>
                </div>
                <div className="h-32 rounded-xl overflow-hidden relative shadow-sm shrink-0">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* The WorkFit Impact Section */}
      <section className="py-24 bg-[#0a1128] text-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="text-orange-500 font-bold text-sm tracking-[0.25em] uppercase mb-4">THE WORKFIT IMPACT</div>
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold mb-6 leading-tight text-white tracking-tight">
              <TypingText text="Healthier Employees. Stronger Organisations." speed={55} caretClassName="bg-white/90" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 py-6">
            {[
              { value: '+21%', label: 'Increase in Productivity', icon: HeartPulse },
              { value: '+31%', label: 'Improvement in Employee Well-being', icon: Smile },
              { value: '+27%', label: 'Increase in Engagement', icon: Users2 },
              { value: '-32%', label: 'Reduction in Sick Leave', icon: ShieldCheck },
              { value: '-18%', label: 'Lower Healthcare Costs', icon: DollarSign }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 px-6 justify-center lg:justify-start ${idx !== 4 ? 'lg:border-r border-white/10' : ''}`}>
                <div className="w-14 h-14 rounded-full border-2 border-[#f97316] flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-[#f97316]" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-2xl md:text-3xl tracking-tight mb-1">
                    <CountUpValue
                      value={parseInt(item.value.replace(/[^0-9]/g, ''), 10)}
                      prefix={item.value.startsWith('-') ? '-' : item.value.startsWith('+') ? '+' : ''}
                      suffix="%"
                    />
                  </div>
                  <div className="text-slate-300/80 text-[11px] leading-snug font-semibold max-w-[130px]">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-[1200px] mx-auto rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl mt-20 bg-gradient-to-r from-[#f97316] to-[#ea580c] grid grid-cols-1 md:grid-cols-12 min-h-[320px]">
            <div className="md:col-span-5 relative min-h-[240px] md:min-h-full">
              <img
                src="/images/ws1.webp"
                alt="Let's Build a Healthier, Happier & More Productive Team"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/remote-045.webp';
                }}
              />
            </div>
            <div className="md:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left">
              <div className="text-white/80 font-extrabold text-[10px] md:text-xs tracking-[0.25em] uppercase mb-3">
                READY TO TRANSFORM YOUR WORKPLACE?
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-8 tracking-tight max-w-xl">
                Let's Build a Healthier, Happier & More Productive Team.
              </h3>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(10, 17, 40, 0.25)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/workfitinquiry')}
                className="group relative pl-16 pr-8 py-5 bg-[#0a1128] text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all flex items-center w-fit shrink-0"
              >
                <div className="absolute left-2 top-2 bottom-2 aspect-square bg-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                  <ChevronRight className="w-5 h-5 text-[#0a1128]" />
                </div>
                <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                  BOOK A DEMO
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a1128] text-white border-t border-white/5 relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-500/6 via-[#0a1128] to-[#0a1128] pointer-events-none"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-[-10%] left-[-8%] w-[26rem] h-[26rem] rounded-full bg-orange-500/6 blur-[120px] pointer-events-none"
          animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-14%] right-[-6%] w-[28rem] h-[28rem] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none"
          animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">

            {/* Left Column: Info & Contact */}
            <motion.div
              className="lg:w-1/3 flex flex-col"
              variants={challengeRevealContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.28 }}
            >
              <motion.div variants={challengeRevealUp} className="text-orange-500 font-bold text-sm tracking-[0.2em] uppercase mb-4">
                Do You Have Any Questions?
              </motion.div>
              <motion.h2 variants={challengeRevealUp} className="text-4xl md:text-5xl font-sans font-bold mb-6 leading-tight">
                Everything You Need to Know About <span className="text-orange-500">WorkFit</span>
              </motion.h2>
              <motion.p variants={challengeRevealUp} className="text-gray-400 text-sm leading-relaxed mb-12">
                Find answers to common questions about our wellness programs, services, and how we drive real impact in workplaces.
              </motion.p>

              <motion.div className="space-y-8 flex-1" variants={challengeRevealContainer}>
                {[
                  { title: 'Expert-Led Programs', desc: 'Certified experts delivering holistic wellness solutions.', icon: UserCircle2, color: 'text-orange-500', border: 'border-orange-500/30' },
                  { title: 'Tailored for Workplaces', desc: "Programs customized to fit your organization's needs.", icon: Building, color: 'text-green-500', border: 'border-green-500/30' },
                  { title: 'Accessible Anywhere', desc: 'Onsite, online, and on-demand - wellness anytime, anywhere.', icon: Users2, color: 'text-teal-500', border: 'border-teal-500/30' },
                  { title: 'Results That Matter', desc: 'Measurable improvements in health, engagement, and productivity.', icon: ShieldCheck, color: 'text-purple-500', border: 'border-purple-500/30' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={challengeCardReveal(0.08 * idx)}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="flex gap-5"
                  >
                    <div className={`w-12 h-12 rounded-full border ${item.border} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Contact Box */}
              <motion.div
                variants={challengeRevealUp}
                className="mt-12 rounded-2xl bg-[#0d1530] border border-white/5 p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-xl"
              >
                <div className="flex gap-4 items-center">
                  <Headphones className="w-8 h-8 text-orange-500 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-white mb-1">Still have questions?</div>
                    <div className="text-xs text-gray-400">We're here to help you build a healthier workplace.</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-medium text-orange-400">
                    <Mail className="w-3.5 h-3.5" /> Workfitbylivefit@gmail.com
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-orange-400">
                    <Phone className="w-3.5 h-3.5" /> +91 9890008742
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Accordion */}
            <motion.div
              className="lg:w-2/3"
              variants={challengeRevealRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div
                className="rounded-2xl border border-white/10 bg-[#0d1530]/50 overflow-hidden divide-y divide-white/5 shadow-2xl backdrop-blur-sm"
                variants={challengeRevealContainer}
              >
                {[
                  { q: "What is WorkFit?", a: "WorkFit is a comprehensive corporate wellness solution by LiveFit, designed to improve employee well-being, boost engagement, and enhance productivity. Our programs combine expert-led sessions, on-demand resources, and personalized support to help organizations build healthier, happier, and high-performing teams." },
                  { q: "Who can benefit from your wellness programs?", a: "All employees can benefit from our programs, whether they aim to reduce stress, improve fitness, build healthier habits, or enhance overall well-being." },
                  { q: "What wellness services do you offer?", a: "We offer a wide range of services including fitness sessions, yoga & mindfulness, nutrition guidance, stress management, chronic care support, wellness challenges, and more." },
                  { q: "How are your programs delivered?", a: "Our programs are delivered through a blend of live sessions, on-demand content, expert coaching, wellness challenges, and onsite or virtual engagement activities." },
                  { q: "How do you measure the impact of your programs?", a: "We use advanced analytics and feedback tools to track key metrics like participation, engagement, well-being scores, habit improvement, absenteeism, and productivity." },
                  { q: "How do you cater to different time zones?", a: "We cater to different time zones by offering live fitness sessions and challenges accessible at various times, providing on-demand sessions, and allowing users to set their own challenge start times. This ensures flexibility and inclusivity for global teams." },
                  { q: "Do you offer virtual and remote wellness programs?", a: "Yes, our programs are designed to engage and support both in-office and remote teams with equal effectiveness." },
                  { q: "How do employees access the WorkFit platform?", a: "Employees can access the platform through web and mobile apps, where they can join live sessions, explore resources, track progress, and participate in challenges." },
                  { q: "Can programs be customized for our organization?", a: "Absolutely! We tailor our wellness programs to match your organization's unique goals, culture, and employee needs." },
                  { q: "How do we get started with WorkFit?", a: "Simply reach out to us via email or phone. Our team will understand your requirements and create a customized wellness plan for your organization." }
                ].map((faq, idx) => (
                  <motion.div
                    key={idx}
                    variants={challengeCardReveal(0.05 * idx)}
                    className="group"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-white/5 transition-colors"
                    >
                      <motion.div
                        className="mt-0.5 shrink-0"
                        animate={openFaq === idx ? { rotate: 180, scale: 1.06 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {openFaq === idx ?
                          <MinusCircle className="w-5 h-5 text-orange-500 fill-orange-500/20" /> :
                          <PlusCircle className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                        }
                      </motion.div>
                      <div className="flex-1 font-bold text-[15px] pr-4">{faq.q}</div>
                      <motion.div
                        className="mt-0.5 shrink-0"
                        animate={openFaq === idx ? { y: -1 } : { y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {openFaq === idx ?
                          <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" /> :
                          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        }
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, y: -6 }}
                          animate={{ height: 'auto', opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -6 }}
                          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-1 pl-14 text-sm text-gray-400 leading-relaxed pr-10">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

          </div>

          {/* Bottom Banner */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1530] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center shrink-0 bg-[#0a1128]">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl text-white mb-1">
                  Your Employees' <span className="text-green-500">Well-being</span>. Your Organization's <span className="text-orange-500">Success</span>.
                </h3>
                <p className="text-xs text-gray-400">WorkFit empowers your teams with the tools, support, and motivation to thrive.</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.25)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative pl-16 pr-8 py-5 bg-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center"
              onClick={() => navigate("/workfitinquiry")}
            >
              <div className="absolute left-2 top-2 bottom-2 aspect-square bg-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                <ChevronRight className="w-5 h-5 text-orange-600" />
              </div>
              <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                Request a Demo
              </span>
            </motion.button>
          </div>

        </div>
      </section>

      {/* Testimonials Popup Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            {/* Blurred Backdrop overlay */}
            <div 
              className="absolute inset-0 bg-[#0a1128]/70 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedTestimonial(null)}
            />
            
            {/* Modal Body Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white text-[#0a1128] rounded-[2.5rem] overflow-hidden border border-slate-100/50 shadow-2xl max-w-2xl w-full relative z-10 flex flex-col md:flex-row min-h-[380px]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#0a1128]/5 hover:bg-[#0a1128]/10 flex items-center justify-center text-[#0a1128]/60 hover:text-[#0a1128] transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Image */}
              <div className="md:w-2/5 relative min-h-[200px] md:min-h-full">
                <img 
                  src={selectedTestimonial.img} 
                  alt={selectedTestimonial.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Content */}
              <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-between relative">
                <div>
                  {/* Star Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>

                  {/* Quote & Body */}
                  <h3 className="text-lg md:text-xl font-extrabold text-[#0B1530] leading-snug mb-4 tracking-tight">
                    {selectedTestimonial.quote}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                    {selectedTestimonial.body}
                  </p>
                </div>

                <div>
                  {/* Tag Badges */}
                  {selectedTestimonial.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {selectedTestimonial.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-orange-50 text-[#f97316] rounded-md border border-orange-100/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 w-full">
                    <div>
                      <div className="text-sm font-extrabold text-[#0B1530] leading-tight">{selectedTestimonial.name}</div>
                      <div className="text-xs font-semibold text-gray-400 mt-0.5 leading-tight">{selectedTestimonial.role}</div>
                    </div>
                    {selectedTestimonial.country && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1">
                        {formatCountryBadge(selectedTestimonial.country)}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default WorkFit;

