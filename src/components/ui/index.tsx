import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCountUp } from '@/hooks/useUi';
export { GlassCard, SectionTitle } from '@/components/ui/GlassCard';

interface StatCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function StatCounter({ value, decimals = 0, suffix = '', prefix = '', duration = 2000, className = '' }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const current = useCountUp(value, duration, inView);
  const display = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  className?: string;
  color?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  className = '',
  color = 'var(--primary)',
  height = 8,
  animated = true,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="text-[var(--text-muted)]">{label}</span>
          <span className="font-medium">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-[var(--glass-border)]"
        style={{ height }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'var(--primary)',
  trackColor = 'var(--glass-border)',
  label,
  sublabel,
}: CircularProgressProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <span className="text-2xl font-bold font-display">{label}</span>}
        {sublabel && <span className="text-xs text-[var(--text-muted)] mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const styles: Record<string, string> = {
    default: 'bg-[var(--glass-border)] text-[var(--text-muted)]',
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
    success: 'bg-success/15 text-success',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg glass text-xs whitespace-nowrap z-50 pointer-events-none"
        >
          {content}
        </motion.span>
      )}
    </span>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-[var(--glass-border)] via-[var(--glass)] to-[var(--glass-border)] bg-[length:1000px_100%] animate-shimmer ${className}`}
    />
  );
}
export function RippleButton({ children, onClick, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </button>
  );
}

