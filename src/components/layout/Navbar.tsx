import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Sun, Moon, Sprout, Satellite, Target, BarChart3 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Globe, emoji: '🌍' },
  { to: '/simulation', label: 'Simulation', icon: Sprout, emoji: '🌱' },
  { to: '/command-center', label: 'Command Center', icon: Satellite, emoji: '🛰' },
  { to: '/challenges', label: 'Challenges', icon: Target, emoji: '🎯' },
  { to: '/insights', label: 'Insights', icon: BarChart3, emoji: '📊' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className={`glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-500 ${
              scrolled ? 'shadow-soft-lg' : ''
            }`}
          >
            <NavLink to="/" className="flex items-center gap-2.5 group" aria-label="EcoSphere Genesis home">
              <motion.div
                className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.8 }}
              >
                <Globe className="w-5 h-5 text-ink" strokeWidth={2.5} />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary opacity-30 blur-md"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-base leading-none">EcoSphere</div>
                <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">Genesis</div>
              </div>
            </NavLink>
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                        isActive ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden w-9 h-9 rounded-full glass flex items-center justify-center"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[var(--bg)]/95 backdrop-blur-xl" />
            <motion.nav
              className="relative h-full flex flex-col items-center justify-center gap-4 px-6"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                closed: {},
              }}
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.to}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 30 },
                    }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 text-2xl font-display font-semibold transition-colors ${
                          isActive ? 'text-primary' : 'text-[var(--text-muted)]'
                        }`
                      }
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </NavLink>
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
