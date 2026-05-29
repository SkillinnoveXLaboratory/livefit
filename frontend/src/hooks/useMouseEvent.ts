import { useEffect } from 'react';

export const useMouseEvent = (callback: (e: MouseEvent) => void) => {
  useEffect(() => {
    window.addEventListener('mousemove', callback);
    return () => window.removeEventListener('mousemove', callback);
  }, [callback]);
};
