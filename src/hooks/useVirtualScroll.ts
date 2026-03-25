import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

export function useVirtualScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  totalItems: number,
  itemHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // Initial viewport height
    setViewportHeight(el.clientHeight);

    const handleScroll = () => {
      // Use rAF for smooth scrolling performance
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
      });
    };
    
    const handleResize = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  const totalHeight = totalItems * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems,
    Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
  );
  
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, totalHeight, offsetY };
}
