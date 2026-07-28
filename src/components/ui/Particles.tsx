import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticlesProps {
  count?: number;
  className?: string;
  color?: string;
}

export function Particles({ count = 40, className = '', color }: ParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [count],
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color ?? 'var(--primary)',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { x: '5%', y: '15%', size: 300, color: 'rgba(0, 229, 168, 0.08)', duration: 18 },
      { x: '85%', y: '60%', size: 400, color: 'rgba(56, 189, 248, 0.07)', duration: 22 },
      { x: '60%', y: '20%', size: 250, color: 'rgba(124, 58, 237, 0.06)', duration: 16 },
    ],
    [],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: s.color }}
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
