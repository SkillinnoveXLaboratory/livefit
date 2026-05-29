export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.23, 1, 0.320, 1] }, // Custom cubic bezier
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.23, 1, 0.320, 1] },
};

export const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.23, 1, 0.320, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.320, 1] },
};

// Premium easing curves
const cubicBezier = {
  easeInOutQuart: [0.77, 0, 0.175, 1],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
};

// Text reveal animations
export const textRevealUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: cubicBezier.easeOutExpo },
};

export const textRevealFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, ease: 'easeOut' },
};

// Image animations
export const imageZoomIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: cubicBezier.easeOutQuart },
};

export const imageFloat = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Hover animations
export const buttonHover = {
  whileHover: {
    scale: 1.08,
    transition: { duration: 0.3 },
  },
  whileTap: {
    scale: 0.92,
  },
};

export const cardHover = {
  whileHover: {
    y: -12,
    transition: { duration: 0.4 },
  },
};

// Parallax effect on scroll
export const parallaxMotion = (distance: number) => ({
  y: distance * 0.5,
  transition: { type: 'spring', stiffness: 100, damping: 30 },
});

// Continuous floating animation
export const floatingAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Glow effect on hover
export const glowEffect = {
  whileHover: {
    boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)',
    transition: { duration: 0.3 },
  },
};
