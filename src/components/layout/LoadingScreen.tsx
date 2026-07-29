import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Satellite } from 'lucide-react';

const LOADING_STEPS = [
  'Initializing Orbital Telemetry...',
  'Loading 3D Atmosphere Shaders...',
  'Connecting Satellite Scanner Grid...',
  'Calibrating Rule-Based AI Engine...',
  'Preparing Environmental Digital Twin...',
];

export function LoadingScreen({ show }: { show: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setStepIndex((p) => (p + 1) % LOADING_STEPS.length);
    }, 400);
    return () => clearInterval(interval);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#040d1a] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* NASA grid background */}
          <div className="absolute inset-0 nasa-grid opacity-30" />
          <div className="scanner-overlay absolute inset-0 pointer-events-none" />

          {/* Central Globe + Radar Spinner */}
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            {/* Outer radar ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-secondary/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
            {/* Sweep ray */}
            <div className="radar-sweep" />

            {/* Glowing Globe */}
            <motion.div
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 flex items-center justify-center border border-primary/40 shadow-glow"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Globe className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <div className="font-display font-bold text-2xl tracking-tight">
              TerraMind <span className="gradient-text font-mono">AI</span>
            </div>
            <div className="text-[10px] text-primary tracking-[0.25em] uppercase font-mono mt-1 flex items-center justify-center gap-2">
              <span className="status-dot-live" />
              Environmental Operating System
            </div>
          </motion.div>

          {/* Animated Status Step */}
          <div className="mt-6 h-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2"
              >
                <Satellite className="w-3.5 h-3.5 text-secondary animate-pulse" />
                {LOADING_STEPS[stepIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <motion.div className="mt-6 h-1 w-56 rounded-full bg-[var(--glass-border)] overflow-hidden relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
