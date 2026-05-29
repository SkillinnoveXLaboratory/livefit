import { useEffect, useRef, useState } from 'react';

export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;

        // Only calculate parallax when element is in view
        if (elementTop < window.innerHeight && elementTop + elementHeight > 0) {
          const distanceFromCenter = window.innerHeight / 2 - elementTop;
          setOffset(distanceFromCenter * speed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset] as const;
};
