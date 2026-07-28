import { useEffect, useRef, useState } from 'react';
export function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth - 0.5) * strength,
          y: (e.clientY / window.innerHeight - 0.5) * strength,
        });
      });
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [strength]);

  return pos;
}
export function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
    }
  }, [key, state]);

  return [state, setState] as const;
}
