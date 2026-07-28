import { forwardRef, type HTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type GlassCardProps = HTMLMotionProps<'div'> & {
  hover?: boolean;
  glow?: 'primary' | 'secondary' | 'accent' | 'none';
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', hover = false, glow = 'none', ...props }, ref) => {
    const glowClass =
      glow === 'primary' ? 'glow-primary' : glow === 'secondary' ? 'glow-secondary' : '';

    return (
      <motion.div
        ref={ref}
        className={`glass-card ${glowClass} ${hover ? 'transition-transform duration-300 hover:-translate-y-1' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
GlassCard.displayName = 'GlassCard';

type SectionTitleProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionTitle({ eyebrow, title, description, center = false, className = '' }: SectionTitleProps) {
  return (
    <div className={`${center ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      {eyebrow && (
        <div className={`text-sm font-medium tracking-widest uppercase text-primary mb-3 ${center ? '' : ''}`}>
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">{title}</h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-[var(--text-muted)] max-w-2xl text-balance leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
