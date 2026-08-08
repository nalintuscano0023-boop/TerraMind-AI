import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Globe, Menu, X, Sun, Moon, Sprout, Satellite, BarChart3, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV_ITEMS = [
  { to: '/',               label: 'Home',           icon: Globe     },
  { to: '/simulation',     label: 'Simulation',     icon: Sprout    },
  { to: '/command-center', label: 'Command Center', icon: Satellite },
  { to: '/challenges',     label: 'Climate Hub',    icon: Activity  },
  { to: '/insights',       label: 'Insights',       icon: BarChart3 },
];

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

/**
 * NavItem — stable height, no layout shift on active state.
 * Uses h-9 + flex items-center + leading-none consistently.
 * Active state is purely visual (bg/shadow/color) — no padding or size change.
 */
function NavItem({ to, label, icon: Icon, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      style={{ textDecoration: 'none' }}
      className={({ isActive }) =>
        [
          // Fixed geometry — never changes regardless of state
          'relative inline-flex items-center justify-center gap-1.5',
          'h-9 px-3.5 rounded-full',
          'text-xs font-semibold leading-none',
          'border border-transparent',
          'transition-colors duration-200',
          'whitespace-nowrap select-none',
          // State-dependent color only
          isActive
            ? 'text-primary'
            : 'text-[var(--text-muted)] hover:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="leading-none">{label}</span>
          {isActive && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-primary/12 border border-primary/25 -z-10 shadow-glow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent z-50 origin-left"
        style={{ scaleX }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className={`glass-deep rounded-2xl px-4 md:px-6 flex items-center justify-between transition-all duration-500 ${
              scrolled
                ? 'py-2 shadow-2xl border-primary/25 bg-[#020811]/92 backdrop-blur-3xl'
                : 'py-3 border-white/08'
            }`}
          >
            {/* Branding */}
            <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="TerraMind AI home">
              <motion.div
                className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-glow"
                whileHover={{ rotate: 360, scale: 1.08 }}
                transition={{ duration: 0.8 }}
              >
                <Globe className="w-5 h-5 text-ink" strokeWidth={2.5} />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary opacity-35 blur-md pointer-events-none"
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-base leading-none tracking-tight text-white flex items-center gap-1.5">
                  TerraMind{' '}
                  <span className="text-primary font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 leading-none">
                    AI
                  </span>
                </div>
                <div className="text-[9px] text-[var(--text-muted)] tracking-[0.2em] uppercase font-mono mt-0.5 leading-none">
                  Digital Twin Platform
                </div>
              </div>
            </NavLink>

            {/* Desktop Navigation — stable flex row */}
            <div className="hidden lg:flex items-center gap-0.5 glass rounded-full px-2 py-1.5 border border-primary/12 bg-black/45 shadow-inner">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  end={item.to === '/'}
                />
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Earth health pill */}
              <div className="hidden sm:flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs border border-primary/18 shadow-glow-sm">
                <span className="status-dot-live" />
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono font-bold text-primary text-[11px] leading-none">EARTH 62%</span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors border border-primary/18 shadow-sm flex-shrink-0"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Moon className="w-4 h-4 text-secondary" />
                    </motion.div>
                  ) : (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="w-4 h-4 text-warning" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden w-9 h-9 rounded-full glass flex items-center justify-center border border-primary/18 flex-shrink-0"
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#020811]/96 backdrop-blur-2xl" />
            <motion.nav
              className="relative h-full flex flex-col items-center justify-center gap-6 px-6"
              initial="closed"
              animate="open"
              variants={{
                open:   { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                closed: {},
              }}
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.to}
                    variants={{
                      open:   { opacity: 1, y: 0 },
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
                      <Icon className="w-6 h-6 text-primary" />
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
