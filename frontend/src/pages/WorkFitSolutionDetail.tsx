import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../lib/env';

const BASE_URL = API_BASE_URL || 'http://localhost:5000';
const WORKFIT_CARD_IMAGES = [
  '/images/tc2.webp',
  '/images/postureback pain.webp',
  '/images/stress.webp',
  '/images/wp2.webp',
  '/images/tc3.webp',
  '/images/Hybridworkchallenges.webp',
  '/images/wp4.webp',
  '/images/Wc8.webp'
];

const getWorkFitImageSet = (startIndex: number) =>
  WORKFIT_CARD_IMAGES.map((_, idx) => WORKFIT_CARD_IMAGES[(startIndex + idx) % WORKFIT_CARD_IMAGES.length]);

import {
  Brain, HeartPulse, Wind, Flower2, Scale, Building, Activity,
  PlayCircle, Moon, Smile, Trophy, Users2, Users, Sparkles, Zap,
  Clock, Target, Monitor, Video, Globe2, Footprints, ShieldCheck,
  Apple, FileText, UserCircle2, ArrowLeft, ChevronRight, Headphones,
  Mail, Phone
} from 'lucide-react';

// Custom arm chair icon helper
function ArmchairIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </svg>
  );
}

// Custom dollar sign icon helper
function DollarSignIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

const solutionsData: Record<string, any> = {
  'employee-burnout': {
    id: "01",
    name: "Employee Burnout",
    title: "Employee Burnout",
    subtitle: "SOLUTION 01",
    desc: "Chronic stress, long hours, and constant pressure lead to burnout and mental fatigue.",
    descSecondary: "WorkFit's burnout recovery programs help employees recharge, restore balance, and perform at their best.",
    image: "/images/tc2.webp",
    fallbackImage: "/images/tc2.webp",
    stats: [
      { value: "55%", desc: "of employees report burnout in 2025*", icon: Brain, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "66%", desc: "say burnout is at record highs*", icon: Smile, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "$28.5K", desc: "costs employers per employee annually*", icon: DollarSignIcon, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "2.6X", desc: "more likely to take sick leave*", icon: Activity, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Burnout is a state of physical, emotional, and mental exhaustion caused by prolonged stress. It affects productivity, motivation, focus, and overall well-being.",
    whatIsImage: "/images/tc2.webp",
    howItHelps: [
      { title: "Reduces Stress & Anxiety", icon: Brain },
      { title: "Improves Focus & Clarity", icon: Sparkles },
      { title: "Boosts Energy Levels", icon: Zap },
      { title: "Improves Sleep & Recovery", icon: Moon },
      { title: "Enhances Emotional Well-being", icon: Smile },
      { title: "Increases Productivity & Performance", icon: Activity }
    ],
    whatWeDo: [
      { title: "Mindfulness & Meditation Sessions", desc: "Guided mindfulness practices to quiet the mind, reduce overwhelm, and improve emotional balance.", img: "/images/tc2.webp" },
      { title: "Stress Relief Workshops", desc: "Evidence-based techniques to manage stress, calm the nervous system, and build resilience.", img: "/images/tc2.webp" },
      { title: "Breathwork Sessions", desc: "Powerful breathing techniques to reduce stress, improve oxygen flow, and boost mental clarity.", img: "/images/tc2.webp" },
      { title: "Recovery Yoga & Relaxation", desc: "Gentle yoga and relaxation practices to release tension, reduce fatigue, and restore energy.", img: "/images/tc2.webp" },
      { title: "Mental Wellness Education", desc: "Expert-led sessions on burnout prevention, self-care, healthy habits, and mindset.", img: "/images/tc2.webp" },
      { title: "Lifestyle & Habit Coaching", desc: "Personalized guidance to build sustainable routines for long-term well-being and balance.", img: "/images/tc2.webp" }
    ],
    provenImpact: [
      { value: "48%", desc: "Reduction in stress levels*", icon: ShieldCheck },
      { value: "41%", desc: "Improvement in mental well-being*", icon: Smile },
      { value: "33%", desc: "Increase in productivity*", icon: Activity },
      { value: "26%", desc: "Decrease in sick days*", icon: HeartPulse },
      { value: "60%", desc: "Participants felt more energized daily*", icon: Zap }
    ],
    ctaTitle: "Ready To Help Your Team Beat Burnout?",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/tc2.webp",
    sources: "*Sources: Gallup 2024, WHO 2023, Harvard Business Review, McKinsey, Global Wellness Institute"
  },
  'posture-back-pain': {
    id: "02",
    name: "Posture & Back Pain",
    title: "Posture & Back Pain",
    subtitle: "SOLUTION 02",
    desc: "Sedentary work and poor posture cause chronic pain, stiffness, and discomfort.",
    descSecondary: "Posture & Back Pain programs focus on improving ergonomics, strengthening core muscles, and building better movement habits to prevent and relieve pain.",
    image: "/images/postureback pain.webp",
    fallbackImage: "/images/postureback pain.webp",
    stats: [
      { value: "80%+", desc: "of office workers experience back pain yearly*", icon: Activity, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "80%", desc: "of pain cases are preventable with better posture*", icon: ShieldCheck, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "58.6%", desc: "of workers suffer from neck or shoulder pain*", icon: Apple, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "$1B+", desc: "lost annually by companies due to back pain*", icon: DollarSignIcon, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Posture & Back Pain programs focus on improving ergonomics, strengthening core muscles, and building better movement habits to prevent and relieve pain in the back, neck, shoulders, and wrists.",
    whatIsImage: "/images/postureback pain.webp",
    howItHelps: [
      { title: "Reduces Pain & Muscle Tension", icon: HeartPulse },
      { title: "Improves Posture & Alignment", icon: Scale },
      { title: "Increases Mobility & Flexibility", icon: Activity },
      { title: "Prevents Injuries & Strain", icon: ShieldCheck },
      { title: "Improves Energy & Comfort", icon: Smile },
      { title: "Enhances Work Performance", icon: Trophy }
    ],
    whatWeDo: [
      { title: "Desk Yoga & Stretch Breaks", desc: "Simple stretches to release tension and improve mobility during the workday.", img: "/images/postureback pain.webp" },
      { title: "Posture Correction Programs", desc: "Techniques to improve posture and reduce strain on the spine and joints.", img: "/images/postureback pain.webp" },
      { title: "Ergonomic Workshops", desc: "Guidance on workstation setup, chair adjustment, and healthy sitting habits.", img: "/images/postureback pain.webp" },
      { title: "Mobility & Spine Health Programs", desc: "Improve flexibility and spine health with targeted mobility drills and routines.", img: "/images/postureback pain.webp" },
      { title: "Strength & Core Activation", desc: "Exercises to strengthen core muscles and support better posture.", img: "/images/postureback pain.webp" },
      { title: "Pain Relief & Recovery Sessions", desc: "Guided sessions to reduce muscle tension and promote faster recovery.", img: "/images/postureback pain.webp" }
    ],
    provenImpact: [
      { value: "74%", desc: "Reduction in back pain complaints*", icon: ShieldCheck },
      { value: "68%", desc: "Improvement in posture & movement*", icon: Scale },
      { value: "52%", desc: "Increase in daily productivity levels*", icon: Activity },
      { value: "35%", desc: "Reduction in sick leaves related to musculoskeletal issues*", icon: HeartPulse },
      { value: "86%", desc: "Participants felt more comfortable at work*", icon: Smile }
    ],
    ctaTitle: "Let's build a pain-free, productive workplace.",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/postureback pain.webp",
    sources: "*Sources: Spine Health, WHO, OSHA, Harvard Business Review, Ergonomics Journal"
  },
  'stress-mental-health': {
    id: "03",
    name: "Stress & Mental Health",
    title: "Stress & Mental Health",
    subtitle: "SOLUTION 03",
    desc: "Stress, anxiety & poor well-being impact focus, creativity, and overall performance.",
    descSecondary: "Our Stress & Mental Health programs provide employees with tools, practices, and support to manage stress, build resilience, and improve emotional well-being.",
    image: "/images/stress.webp",
    fallbackImage: "/images/stress.webp",
    stats: [
      { value: "72%", desc: "of employees report moderate to high stress*", icon: Brain, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "49%", desc: "of workers experience stress daily*", icon: Smile, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "80%", desc: "say stress negatively affects their performance*", icon: Activity, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "$300B+", desc: "lost annually by companies due to stress-related absenteeism & burnout*", icon: DollarSignIcon, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Our Stress & Mental Health programs provide employees with tools, practices, and support to manage stress, build resilience, and improve emotional well-being-creating a healthier, happier, and more engaged workforce.",
    whatIsImage: "/images/stress.webp",
    howItHelps: [
      { title: "Reduces Stress & Anxiety", icon: Brain },
      { title: "Improves Mood & Emotional Balance", icon: Smile },
      { title: "Enhances Focus & Concentration", icon: Sparkles },
      { title: "Builds Resilience & Coping Skills", icon: ShieldCheck },
      { title: "Increases Energy & Motivation", icon: Zap },
      { title: "Boosts Overall Well-being", icon: Activity }
    ],
    whatWeDo: [
      { title: "Mindfulness & Meditation Sessions", desc: "Guided practices to calm the mind, reduce stress, and improve emotional balance.", img: "/images/stress.webp" },
      { title: "Stress Relief Workshops", desc: "Evidence-based techniques to manage stress triggers and build everyday resilience.", img: "/images/stress.webp" },
      { title: "Breathwork Sessions", desc: "Powerful breathing methods to regulate the nervous system and reduce anxiety.", img: "/images/stress.webp" },
      { title: "Sleep & Recovery Programs", desc: "Strategies and routines to improve sleep quality and support recovery.", img: "/images/stress.webp" },
      { title: "Mental Wellness Education", desc: "Expert-led sessions to build awareness and reduce stigma around mental health.", img: "/images/stress.webp" },
      { title: "Lifestyle & Habit Coaching", desc: "Personalized coaching to build healthy habits for long-term mental well-being.", img: "/images/stress.webp" }
    ],
    provenImpact: [
      { value: "31%", desc: "Reduction in stress levels*", icon: ShieldCheck },
      { value: "30%", desc: "Improvement in mental well-being*", icon: Smile },
      { value: "34%", desc: "Increase in productivity*", icon: Activity },
      { value: "25%", desc: "Fewer sick days taken*", icon: HeartPulse },
      { value: "64%", desc: "Employees feel more engaged & supported*", icon: Users2 }
    ],
    ctaTitle: "Support your team's mental well-being.",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/stress.webp",
    sources: "*Sources: Gallup 2024, WHO 2023, Mind Share Partners, APA, Harvard Business Review"
  },
  'low-employee-engagement': {
    id: "04",
    name: "Low Employee Engagement",
    title: "Low Employee Engagement",
    subtitle: "SOLUTION 04",
    desc: "Low engagement happens when employees feel disconnected, tired, stressed, or uninspired at work.",
    descSecondary: "WorkFit uses wellness experiences and movement-based activities to improve morale, energy, participation, and workplace connection.",
    image: "/images/wp2.webp",
    fallbackImage: "/images/wp2.webp",
    stats: [],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Low engagement happens when employees feel disconnected, tired, stressed, or uninspired at work. WorkFit uses wellness experiences and movement-based activities to improve morale, energy, participation, and workplace connection.",
    whatIsImage: "/images/wp2.webp",
    howItHelps: [
      { title: "Boosts Team Connection", icon: Users2 },
      { title: "Improves Workplace Energy", icon: Zap },
      { title: "Increases Participation", icon: Activity },
      { title: "Reduces Stress & Fatigue", icon: Brain },
      { title: "Builds Positive Culture", icon: Smile },
      { title: "Enhances Productivity", icon: Trophy }
    ],
    whatWeDo: [
      { title: "Team Yoga Sessions", desc: "Interactive yoga experiences designed for team bonding, stress relief, and workplace wellness.", img: "/images/wp2.webp" },
      { title: "Group Fitness Workouts", desc: "Fun and energizing office-friendly workouts that improve energy and engagement.", img: "/images/wp2.webp" },
      { title: "Wellness Challenges", desc: "Step challenges, hydration challenges, mindfulness streaks, and activity competitions.", img: "/images/wp2.webp" },
      { title: "Mindfulness & Meditation Breaks", desc: "Short guided mindfulness sessions to refresh focus, reduce stress, and boost mental clarity.", img: "/images/wp2.webp" },
      { title: "Wellness Talks & Workshops", desc: "Expert-led talks on stress management, posture, healthy habits, and work-life balance.", img: "/images/wp2.webp" },
      { title: "Team Wellness Events", desc: "Monthly wellness days, yoga mornings, fitness campaigns, and wellness week activities.", img: "/images/wp2.webp" }
    ],
    provenImpact: [
      { value: "36%", desc: "Increase in employee engagement*", icon: Smile },
      { value: "41%", desc: "More energy and productivity*", icon: Zap },
      { value: "47%", desc: "Reduction in stress & fatigue*", icon: ShieldCheck },
      { value: "62%", desc: "Employees participate in wellness activities*", icon: Activity },
      { value: "2.4X", desc: "Stronger team connection and collaboration*", icon: Users2 },
      { value: "28%", desc: "Improvement overall work performance*", icon: Trophy }
    ],
    ctaTitle: "Healthy Teams Perform Better Together",
    ctaDesc: "Create a more connected, energized, and engaged workplace through wellness-driven experiences.",
    ctaImage: "/images/wp2.webp",
    sources: "*Sources: Gallup 2024, WHO 2023, Harvard Business Review, McKinsey Health Institute"
  },
  'low-productivity-energy': {
    id: "05",
    name: "Low Productivity & Energy",
    title: "Productivity & Energy",
    subtitle: "SOLUTION 05",
    desc: "Low energy and fatigue reduce focus, creativity, and overall productivity at work.",
    descSecondary: "WorkFit's energy-boosting wellness programs help employees move more, feel energized, and perform at their best-every single day.",
    image: "/images/tc3.webp",
    fallbackImage: "/images/tc3.webp",
    stats: [
      { value: "65%", desc: "of employees face low energy at work*", icon: Brain, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "3X", desc: "more productive with better energy**", icon: Zap, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "73%", desc: "feel more focused after movement breaks*", icon: Target, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "21%", desc: "increase in daily productivity***", icon: Activity, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Low energy throughout the day leads to mental fatigue, slow performance, and poor decision-making. Our programs use movement, breathwork, and mindful breaks to naturally boost energy, enhance focus, and keep your team at their best.",
    whatIsImage: "/images/tc3.webp",
    howItHelps: [
      { title: "Boosts Daily Energy Levels", icon: Zap },
      { title: "Improves Focus & Concentration", icon: Target },
      { title: "Improves Mood & Motivation", icon: Smile },
      { title: "Reduces Fatigue & Mental Exhaustion", icon: Brain },
      { title: "Enhances Productivity & Efficiency", icon: Activity },
      { title: "Supports Overall Well-being", icon: HeartPulse }
    ],
    whatWeDo: [
      { title: "Energy Yoga Sessions", desc: "Dynamic yoga flows to wake up the body, improve flexibility, and boost natural energy.", img: "/images/tc3.webp" },
      { title: "Office Workouts", desc: "Fun and effective workouts to build strength, stamina, and long-lasting energy.", img: "/images/tc3.webp" },
      { title: "Midday Recharge Sessions", desc: "Short energizing sessions to refresh the mind, release tension, and recharge your team.", img: "/images/tc3.webp" },
      { title: "Breathwork for Focus", desc: "Powerful breathing techniques to increase oxygen, calm the mind, and improve focus.", img: "/images/tc3.webp" },
      { title: "Stretch Breaks & Movement Snacks", desc: "Simple stretches and movement breaks to reduce strain and keep energy levels high.", img: "/images/tc3.webp" },
      { title: "Wellness Challenges & Step Goals", desc: "Fun challenges that encourage movement, healthy habits, and friendly competition.", img: "/images/tc3.webp" },
      { title: "Mindfulness Breaks", desc: "Short mindfulness practices to reduce stress, reset the mind, and restore clarity.", img: "/images/tc3.webp" }
    ],
    provenImpact: [
      { value: "68%", desc: "increase in energy levels*", icon: Smile },
      { value: "52%", desc: "better focus & concentration*", icon: Target },
      { value: "24%", desc: "improvement in productivity*", icon: Activity },
      { value: "46%", desc: "reduction in fatigue & exhaustion*", icon: ShieldCheck },
      { value: "69%", desc: "employees feel healthier & more active*", icon: HeartPulse },
      { value: "82%", desc: "participation & engagement rate*", icon: Users2 }
    ],
    ctaTitle: "More energy. Better focus. Stronger performance.",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/tc3.webp",
    sources: "*Sources: Gallup 2024, WHO 2023, Harvard Business Review, Mayo Clinic, Statista"
  },
  'hybrid-work-challenges': {
    id: "06",
    name: "Hybrid Work Challenges",
    title: "Hybrid Work Challenges",
    subtitle: "SOLUTION 06",
    desc: "Remote work brings flexibility, but also isolation, poor boundaries, and wellness gaps.",
    descSecondary: "WorkFit helps hybrid teams stay connected, active, and balanced-wherever they work.",
    image: "/images/Hybridworkchallenges.webp",
    fallbackImage: "/images/Hybridworkchallenges.webp",
    stats: [
      { value: "64%", desc: "of hybrid workers report feeling isolated*", icon: Users2, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "60%", desc: "struggle to maintain work-life balance*", icon: Scale, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "55%", desc: "experience lower physical activity levels*", icon: Activity, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "45%", desc: "say it's harder to stay motivated remotely*", icon: Sparkles, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Hybrid work can blur boundaries, reduce movement, and limit team connection. Our programs bring structure, movement, mindfulness, and social connection into the remote workday.",
    whatIsImage: "/images/Hybridworkchallenges.webp",
    howItHelps: [
      { title: "Improves Routine & Work-Life Balance", icon: Scale },
      { title: "Boosts Energy & Focus", icon: Zap },
      { title: "Reduces Stress & Mental Fatigue", icon: Brain },
      { title: "Increases Physical Activity", icon: Activity },
      { title: "Builds Team Connection Across Locations", icon: Users2 },
      { title: "Enhances Productivity & Well-being", icon: Trophy }
    ],
    whatWeDo: [
      { title: "Virtual Yoga Sessions", desc: "Live and on-demand yoga classes to improve flexibility, reduce stress, and boost energy.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Home Workouts", desc: "Equipment-free workouts designed for small spaces to build strength, stamina, and daily energy.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Desk Stretch Breaks", desc: "Quick stretch routines to release tension, improve posture, and prevent stiffness.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Mindfulness & Breathing Sessions", desc: "Guided sessions to calm the mind, improve clarity, and manage stress.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Wellness Challenges for Hybrid Teams", desc: "Step challenges, hydration goals, movement streaks, and healthy habit competitions.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Team Connection Activities", desc: "Fun virtual activities, wellness games, and interactive sessions to strengthen bonds.", img: "/images/Hybridworkchallenges.webp" },
      { title: "Evening Wind-Down Sessions", desc: "Relaxation and stretching sessions to help teams unwind and sleep better.", img: "/images/Hybridworkchallenges.webp" }
    ],
    provenImpact: [
      { value: "62%", desc: "reduction in stress & anxiety*", icon: Smile },
      { value: "57%", desc: "increase in daily energy levels*", icon: Zap },
      { value: "51%", desc: "improvement in work-life balance*", icon: Scale },
      { value: "48%", desc: "higher team connection & engagement*", icon: Users2 },
      { value: "43%", desc: "increase in overall productivity*", icon: Activity },
      { value: "41%", desc: "better sleep quality*", icon: Moon }
    ],
    ctaTitle: "Healthy habits. Stronger connections. Better results.",
    ctaDesc: "Empower your hybrid workforce with wellness that fits everywhere.",
    ctaImage: "/images/Hybridworkchallenges.webp",
    sources: "*Sources: Gallup 2024, Buffer 2023, Forbes 2023, Harvard Business Review, Stanford Research"
  },
  'high-healthcare-costs': {
    id: "07",
    name: "High Healthcare Costs",
    title: "High Healthcare Costs",
    subtitle: "SOLUTION 07",
    desc: "Rising healthcare costs impact your bottom line and employee well-being.",
    descSecondary: "WorkFit's preventive wellness programs reduce health risks, improve lifestyle habits, and lower long-term healthcare costs.",
    image: "/images/wp4.webp",
    fallbackImage: "/images/wp4.webp",
    stats: [
      { value: "70%", desc: "of chronic diseases are lifestyle-related*", icon: HeartPulse, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "$3.3K", desc: "average annual healthcare savings per employee*", icon: DollarSignIcon, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "66%", desc: "lower absenteeism with wellness programs*", icon: Users, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "25%", desc: "reduction in healthcare cost costs over time*", icon: Activity, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "High healthcare costs are driven by preventable conditions like stress, poor posture, inactivity, and unhealthy habits. Our programs focus on prevention, education, movement, and habit change to improve employee health and reduce future costs.",
    whatIsImage: "/images/wp4.webp",
    howItHelps: [
      { title: "Reduces Risk of Chronic Diseases", icon: ShieldCheck },
      { title: "Lowers Healthcare Costs", icon: DollarSignIcon },
      { title: "Improves Energy & Vitality", icon: Zap },
      { title: "Reduces Stress & Inflammation", icon: Wind },
      { title: "Improves Overall Employee Health", icon: Smile },
      { title: "Strengthens Long-term Cost Savings", icon: Trophy }
    ],
    whatWeDo: [
      { title: "Preventive Wellness Programs", desc: "Proactive programs that focus on early prevention and long-term health.", img: "/images/wp4.webp" },
      { title: "Fitness & Activity Initiatives", desc: "Structured workouts, step challenges, and movement programs to improve fitness and reduce risk.", img: "/images/wp4.webp" },
      { title: "Desk Mobility & Stretch Breaks", desc: "Simple daily mobility routines to reduce pain, improve posture, and prevent injuries.", img: "/images/wp4.webp" },
      { title: "Stress Management & Resilience", desc: "Mindfulness, breathwork, and stress management to reduce the impact of chronic stress.", img: "/images/wp4.webp" },
      { title: "Lifestyle & Nutrition Education", desc: "Expert-led sessions to build healthy eating habits and support better lifestyle choices.", img: "/images/wp4.webp" },
      { title: "Health Risk Reduction Programs", desc: "Assessments, education, and personalized guidance to reduce health risks and improve outcomes.", img: "/images/wp4.webp" },
      { title: "Wellness Challenges for Healthy Habits", desc: "Fun challenges that encourage healthy habits and create lasting behavior change.", img: "/images/wp4.webp" },
      { title: "Recovery & Well-being Sessions", desc: "Sessions to improve recovery, sleep, and overall well-being.", img: "/images/wp4.webp" }
    ],
    provenImpact: [
      { value: "$3.3K", desc: "average savings in healthcare costs per employee*", icon: DollarSignIcon },
      { value: "27%", desc: "reduction in health risk*", icon: HeartPulse },
      { value: "66%", desc: "lower absenteeism rates*", icon: Users },
      { value: "59%", desc: "increase in employee energy levels*", icon: Zap },
      { value: "25%", desc: "reduction in healthcare costs over time*", icon: Scale },
      { value: "3X", desc: "higher ROI on wellness programs*", icon: Trophy }
    ],
    ctaTitle: "Healthy employees today. Lower costs tomorrow. Stronger organization always.",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/wp4.webp",
    sources: "*Sources: Gallup 2024, Harvard Business Review, PwC, Wellness Council of America"
  },
  'boring-wellness-programs': {
    id: "08",
    name: "Boring Wellness Programs",
    title: "Boring Wellness Programs",
    subtitle: "SOLUTION 08",
    desc: "Generic programs don't inspire anyone or create lasting impact.",
    descSecondary: "WorkFit makes wellness engaging, interactive, and fun-so employees actually participate, stay motivated, and build healthier habits.",
    image: "/images/Wc8.webp",
    fallbackImage: "/images/Wc8.webp",
    stats: [
      { value: "78%", desc: "of employees get bored with wellness programs*", icon: Users, bg: "bg-orange-50", border: "border-orange-100", color: "text-orange-500" },
      { value: "61%", desc: "say wellness programs lack engagement & excitement*", icon: Smile, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-500" },
      { value: "90%", desc: "more likely to participate in fun & engaging wellness programs*", icon: Activity, bg: "bg-green-50", border: "border-green-100", color: "text-green-500" },
      { value: "2.6X", desc: "higher impact when wellness is engaging & personalized*", icon: Trophy, bg: "bg-purple-50", border: "border-purple-100", color: "text-purple-500" }
    ],
    whatIsTitle: "WHAT IS IT?",
    whatIsDesc: "Boring, one-size-fits-all programs lead to low participation and no real behavior change. We create exciting, relevant, and interactive wellness experiences that employees love and look forward to.",
    whatIsImage: "/images/Wc8.webp",
    howItHelps: [
      { title: "Increases Engagement & Participation", icon: Smile },
      { title: "Builds Healthy Habits", icon: Trophy },
      { title: "Boosts Motivation & Morale", icon: Sparkles },
      { title: "Creates a Positive Wellness Culture", icon: Users2 },
      { title: "Improves Productivity & Energy", icon: Activity },
      { title: "Supports Overall Well-being", icon: HeartPulse }
    ],
    whatWeDo: [
      { title: "Engaging Wellness Experiences", desc: "Fun and interactive programs that employees enjoy and remember.", img: "/images/Wc8.webp" },
      { title: "Fun Fitness & Activity Sessions", desc: "Variety of workouts and activities to keep things exciting and fresh.", img: "/images/Wc8.webp" },
      { title: "Interactive Challenges & Competitions", desc: "Team challenges, step contests, and friendly competitions that drive participation.", img: "/images/Wc8.webp" },
      { title: "Mindfulness & Mental Well-being", desc: "Mindfulness sessions and mental wellness activities to support a balanced mind.", img: "/images/Wc8.webp" },
      { title: "Personalized Wellness Journeys", desc: "Customized plans and resources that meet individual needs and goals.", img: "/images/Wc8.webp" },
      { title: "Creative Wellness Campaigns", desc: "Themed weeks, wellness events, and campaigns that create buzz and excitement.", img: "/images/Wc8.webp" }
    ],
    provenImpact: [
      { value: "78%", desc: "employees find wellness programs boring*", icon: Users },
      { value: "61%", desc: "low engagement in traditional programs*", icon: Brain },
      { value: "90%", desc: "higher participation in engaging programs*", icon: HeartPulse },
      { value: "2.6X", desc: "greater impact on well-being & habits*", icon: Trophy },
      { value: "83%", desc: "employees feel more motivated & happy*", icon: Smile },
      { value: "67%", desc: "improvement in overall wellness outcomes*", icon: Activity }
    ],
    ctaTitle: "Make wellness exciting. Make it stick. Make it WorkFit.",
    ctaDesc: "Let's build a customized wellness program that helps your employees recharge, reset, and thrive.",
    ctaImage: "/images/Wc8.webp",
    sources: "*Sources: Gallup 2024, Wellable 2023, Virgin Pulse 2023, Harvard Business Review"
  }
};

const WorkFitSolutionDetail = ({ solutionId }: { solutionId: string }) => {
  const navigate = useNavigate();
  const [dbSolutions, setDbSolutions] = useState<any>(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [solutionId]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/content/solutions`)
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setDbSolutions(data);
        }
      })
      .catch(err => console.error("Error loading solutions details:", err));
  }, []);

  const localSolution = solutionsData[solutionId] || solutionsData['employee-burnout'];
  const activeSolution = React.useMemo(() => {
    const imageStartMap: Record<string, number> = {
      'employee-burnout': 0,
      'posture-back-pain': 1,
      'stress-mental-health': 2,
      'low-employee-engagement': 3,
      'low-productivity-energy': 4,
      'hybrid-work-challenges': 5,
      'high-healthcare-costs': 6,
      'boring-wellness-programs': 7
    };

    const imageSet = getWorkFitImageSet(imageStartMap[solutionId] ?? 0);

    const rotatedWhatWeDo = (localSolution.whatWeDo || []).map((item: any, idx: number) => ({
      ...item,
      img: imageSet[(idx + 2) % imageSet.length]
    }));

    if (dbSolutions && dbSolutions[solutionId]) {
      const dbVal = dbSolutions[solutionId];
      return {
        ...localSolution,
        name: dbVal.title || localSolution.name,
        title: dbVal.title || localSolution.title,
        desc: dbVal.problem || localSolution.desc,
        image: imageSet[0],
        fallbackImage: imageSet[0],
        whatIsImage: imageSet[1],
        whatWeDo: rotatedWhatWeDo,
        ctaImage: imageSet[(rotatedWhatWeDo.length + 2) % imageSet.length],
      };
    }
    return {
      ...localSolution,
      image: imageSet[0],
      fallbackImage: imageSet[0],
      whatIsImage: imageSet[1],
      whatWeDo: rotatedWhatWeDo,
      ctaImage: imageSet[(rotatedWhatWeDo.length + 2) % imageSet.length],
    };
  }, [dbSolutions, solutionId, localSolution]);

  const solutionsList = [
    { id: "01", name: "Employee Burnout", path: "/solutions/employee-burnout", active: solutionId === "employee-burnout", icon: Brain },
    { id: "02", name: "Posture & Back Pain", path: "/solutions/posture-back-pain", active: solutionId === "posture-back-pain", icon: ArmchairIcon },
    { id: "03", name: "Stress & Mental Health", path: "/solutions/stress-mental-health", active: solutionId === "stress-mental-health", icon: HeartPulse },
    { id: "04", name: "Low Employee Engagement", path: "/solutions/low-employee-engagement", active: solutionId === "low-employee-engagement", icon: Users2 },
    { id: "05", name: "Low Productivity & Energy", path: "/solutions/low-productivity-energy", active: solutionId === "low-productivity-energy", icon: Clock },
    { id: "06", name: "Hybrid Work Challenges", path: "/solutions/hybrid-work-challenges", active: solutionId === "hybrid-work-challenges", icon: Globe2 },
    { id: "07", name: "High Healthcare Costs", path: "/solutions/high-healthcare-costs", active: solutionId === "high-healthcare-costs", icon: DollarSignIcon },
    { id: "08", name: "Boring Wellness Programs", path: "/solutions/boring-wellness-programs", active: solutionId === "boring-wellness-programs", icon: Sparkles }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-[#0a1128] font-sans pb-24">
      {/* Dark Breadcrumbs & Sub-nav Bar */}
      <section className="bg-[#0a1128] text-white pt-28 pb-10 border-b border-white/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-400">
            <Link to="/workfit" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/workfit" className="hover:text-white transition-colors">Solutions</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{activeSolution.name}</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sidebar Navigator */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <h3 className="text-sky-950 font-black text-lg tracking-tight mb-6 px-4">Our Solutions</h3>
              
              <div className="space-y-3">
                {solutionsList.map((sol) => {
                  const Icon = sol.icon;
                  return (
                    <button
                      key={sol.id}
                      onClick={() => navigate(sol.path)}
                      className={`w-full flex items-center justify-between py-4 px-5 rounded-[1.25rem] transition-all duration-300 ${
                        sol.active
                          ? 'bg-[#f97316] text-white shadow-xl shadow-orange-500/20 translate-x-1'
                          : 'bg-white hover:bg-slate-50 text-[#0a1128] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon Wrapper */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          sol.active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        
                        {/* Number and Text */}
                        <div className="flex items-center gap-2.5 text-left">
                          <span className={`text-[11px] font-black tracking-wide shrink-0 transition-colors ${
                            sol.active ? 'text-white/60' : 'text-slate-400'
                          }`}>
                            {sol.id}
                          </span>
                          <span className={`text-[13px] font-black tracking-tight transition-colors ${
                            sol.active ? 'text-white' : 'text-slate-700 hover:text-sky-950'
                          }`}>
                            {sol.name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${
                        sol.active ? 'text-white translate-x-0.5' : 'text-slate-300'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Need Help CTA Box */}
            <div className="bg-[#0a1128] text-white rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden shadow-xl">
              <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[60px]" />
              <Headphones className="w-10 h-10 text-[#f97316] mb-6 relative z-10" />
              <h4 className="text-xl font-black text-white mb-3 relative z-10 leading-tight">
                Need Help Choosing The Right Solution?
              </h4>
              <p className="text-slate-300/80 text-xs leading-relaxed font-semibold mb-8 relative z-10 max-w-xs">
                Talk to our wellness experts and build a customized wellness program that's perfectly fit for your team.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/workfitinquiry')}
                className="group relative pl-16 pr-8 py-5 bg-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center shrink-0 w-full z-10"
              >
                <div className="absolute left-2 top-2 bottom-2 aspect-square bg-white rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:left-[calc(100%-3rem)] z-10">
                  <ChevronRight className="w-5 h-5 text-orange-600" />
                </div>
                <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-x-6">
                  TALK TO EXPERT
                </span>
              </motion.button>
            </div>
          </div>

          {/* Right Column: Dynamic Solution Content Area */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Solution Main Hero Header */}
            <section className="bg-white border border-slate-100/80 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6 text-left">
                <div className="text-[#f97316] font-bold text-xs tracking-[0.2em] uppercase">{activeSolution.subtitle}</div>
                <h1 className="text-3xl md:text-5xl font-sans font-extrabold text-sky-950 leading-none tracking-tight">
                  {activeSolution.title}
                </h1>
                <p className="text-sky-900/60 text-sm md:text-base leading-relaxed font-semibold">
                  {activeSolution.desc}
                </p>
                <p className="text-sky-900/80 text-sm leading-relaxed font-medium">
                  {activeSolution.descSecondary}
                </p>

                {/* Main Stats strip (only rendered if stats exist) */}
                {activeSolution.stats && activeSolution.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    {activeSolution.stats.map((item: any, idx: number) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className={`w-10 h-10 rounded-full border ${item.border} ${item.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <div>
                            <div className="font-extrabold text-sky-950 text-xl leading-none mb-1">{item.value}</div>
                            <div className="text-[10px] text-sky-900/50 font-bold leading-snug">{item.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Solution hero image */}
              <div className="md:col-span-5 h-[340px] rounded-3xl overflow-hidden relative shadow-md">
                <img 
                  src={activeSolution.image} 
                  alt={activeSolution.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = activeSolution.fallbackImage;
                  }}
                />
              </div>
            </section>

            {/* WHAT IS IT? Block */}
            <section className="bg-white border border-slate-100/80 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-sky-950 tracking-tight mb-2 uppercase">{activeSolution.whatIsTitle}</h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto md:mx-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7">
                  <p className="text-sky-900/70 text-sm md:text-base leading-relaxed font-semibold text-left">
                    {activeSolution.whatIsDesc}
                  </p>
                </div>
                <div className="md:col-span-5 h-[200px] rounded-2xl overflow-hidden relative shadow-sm">
                  <img 
                    src={activeSolution.whatIsImage} 
                    alt={activeSolution.whatIsTitle} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = activeSolution.fallbackImage;
                    }}
                  />
                </div>
              </div>
            </section>

            {/* HOW IT WILL HELP? Section */}
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-sky-950 tracking-tight mb-2 uppercase">HOW IT WILL HELP?</h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto" />
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-0">
                  {activeSolution.howItHelps.map((benefit: any, idx: number) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center text-center px-4 ${
                          idx !== 5 ? 'md:border-r border-slate-100' : ''
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full border border-orange-100 bg-orange-50/50 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-[#f97316]" />
                        </div>
                        <span className="text-[10px] text-sky-950 font-black leading-tight max-w-[90px] mx-auto block">
                          {benefit.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* WHAT ALL WE DO IN IT? Section */}
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-sky-950 tracking-tight mb-2 uppercase">WHAT ALL WE DO IN IT?</h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeSolution.whatWeDo.map((item: any, idx: number) => (
                  <div 
                    key={idx}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-full group"
                  >
                    <div className="sm:w-2/5 relative min-h-[150px] overflow-hidden">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = activeSolution.fallbackImage;
                        }}
                      />
                    </div>
                    <div className="sm:w-3/5 p-6 flex flex-col justify-center text-left">
                      <h4 className="font-extrabold text-sky-950 text-sm mb-2 group-hover:text-orange-500 transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-sky-900/60 text-[11px] leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROVEN IMPACT Section */}
            <section className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-sky-950 tracking-tight mb-2 uppercase">PROVEN IMPACT</h2>
                <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto" />
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className={`grid gap-8 md:gap-0 ${
                  activeSolution.provenImpact.length === 6 
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' 
                    : activeSolution.provenImpact.length === 4
                    ? 'grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-2 md:grid-cols-5'
                }`}>
                  {activeSolution.provenImpact.map((stat: any, idx: number) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center text-center px-3 ${
                          idx !== activeSolution.provenImpact.length - 1 ? 'md:border-r border-slate-100' : ''
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full border border-orange-100 bg-orange-50/50 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-[#f97316]" />
                        </div>
                        <div className="font-extrabold text-sky-950 text-xl leading-none mb-1">{stat.value}</div>
                        <span className="text-[9px] text-sky-900/50 font-bold leading-tight max-w-[95px] mx-auto block">
                          {stat.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Bottom CTA Banner */}
            <div className="rounded-[2.5rem] bg-[#0a1128] overflow-hidden grid grid-cols-1 md:grid-cols-12 relative shadow-2xl min-h-[300px]">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
              
              {/* Left text */}
              <div className="md:col-span-7 p-10 md:p-14 flex flex-col justify-center text-left text-white relative z-10">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                  {activeSolution.ctaTitle}
                </h3>
                <p className="text-slate-300/80 text-xs leading-relaxed font-semibold mb-8 max-w-md">
                  {activeSolution.ctaDesc}
                </p>
                <div className="flex flex-wrap gap-4">
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
                      BOOK A DEMO
                    </span>
                  </motion.button>
                  <button 
                    onClick={() => navigate('/workfit')}
                    className="px-8 py-3.5 bg-transparent border border-white/20 hover:border-white text-white font-black text-xs uppercase tracking-widest rounded-full transition-all"
                  >
                    EXPLORE ALL SOLUTIONS
                  </button>
                </div>
              </div>

              {/* Right image */}
              <div className="md:col-span-5 relative min-h-[200px] md:min-h-full">
                <img 
                  src={activeSolution.ctaImage} 
                  alt="CTA Banner" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = activeSolution.fallbackImage;
                  }}
                />
              </div>
            </div>

            {/* Sources list */}
            <div className="text-center text-[10px] text-sky-900/40 font-bold">
              {activeSolution.sources}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkFitSolutionDetail;


