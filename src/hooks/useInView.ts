import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Hook que detecta cuándo un elemento entra en el viewport usando IntersectionObserver.
 * Útil para disparar animaciones de aparición una sola vez.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.15,
): {
  ref: RefObject<T | null>;
  isInView: boolean;
} {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}
