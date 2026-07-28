import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

export function LoadingScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-[var(--bg)] flex flex-col items-center justify-center"
        >
          <motion.div
            className="relative w-20 h-20 mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="font-display font-bold text-lg gradient-text">EcoSphere Genesis</div>
            <div className="text-xs text-[var(--text-muted)] tracking-widest uppercase mt-1">
              Initializing Earth Systems
            </div>
          </motion.div>
          <motion.div
            className="mt-6 h-1 w-40 rounded-full bg-[var(--glass-border)] overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
