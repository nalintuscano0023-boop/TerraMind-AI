import React, { forwardRef, useState, type HTMLAttributes, type MouseEvent } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  hover?: boolean;
  glow?: 'primary' | 'secondary' | 'accent' | 'none';
  tilt?: boolean;
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className = '',
      hover = true,
      glow = 'none',
      tilt = true,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (tilt) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rX = ((y - centerY) / centerY) * -5;
        const rY = ((x - centerX) / centerX) * 5;

        setRotateX(rX);
        setRotateY(rY);
        setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
      setRotateX(0);
      setRotateY(0);
      onMouseLeave?.(e);
    };

    const glowClass =
      glow === 'primary'
        ? 'glow-primary'
        : glow === 'secondary'
        ? 'glow-secondary'
        : glow === 'accent'
        ? 'shadow-[0_0_30px_rgba(124,58,237,0.25)] border-purple-500/30'
        : '';

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        className={`glass-card relative overflow-hidden transition-all duration-300 ${
          hover ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/30' : ''
        } ${glowClass} ${className}`}
        {...props}
      >
        {/* Ambient Mouse Tracking Light Glow Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 229, 168, 0.12), transparent 80%)`,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
  className = '',
  ...props
}: SectionTitleProps) {
  return (
    <div className={`${center ? 'text-center mx-auto max-w-3xl' : ''} ${className}`} {...props}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-primary mb-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/20 bg-primary/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-balance leading-[1.12]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[var(--text-muted)] max-w-2xl text-balance leading-relaxed font-normal"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
