
import { useEffect, useRef } from 'react';

const useScrollAnimate = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after first intersection
        // observer.unobserve(entry.target);
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    });
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);
  
  return ref;
};

export default useScrollAnimate;
