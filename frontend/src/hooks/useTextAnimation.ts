import { useState, useEffect, useRef } from 'react';

export const useTextAnimation = (text: string, trigger: boolean = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!trigger) {
      indexRef.current = 0;
      return;
    }

    if (indexRef.current === 0 && displayedText !== '') {
      const resetTimer = setTimeout(() => {
        setDisplayedText('');
      }, 0);

      return () => clearTimeout(resetTimer);
    }

    if (indexRef.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[indexRef.current]);
        indexRef.current += 1;
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [displayedText, text, trigger]);

  return trigger ? displayedText : '';
};

// Word-by-word reveal animation
export const wordVariants = (index: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: 'easeOut',
    },
  },
});

// Letter-by-letter reveal
export const letterVariants = (index: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.02,
      ease: 'easeOut',
    },
  },
});
