import { Suspense, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Trees, Droplets, Wind, Sun, Cloud, Bird,
  Satellite, Target, BarChart3, Sparkles, Activity, Globe2, Zap,
} from 'lucide-react';
import { GlassCard, SectionTitle, StatCounter, Badge } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { Earth3D } from '@/components/three/Earth3D';

const STATS = [
  { label: 'Forest Cover', value: 52, suffix: '%', icon: Trees, color: 'text-primary' },
  { label: 'Ocean Health', value: 61, suffix: '%', icon: Droplets, color: 'text-secondary' },
  { label: 'Air Quality', value: 48, suffix: '%', icon: Wind, color: 'text-warning' },
  { label: 'Renewable Energy', value: 28, suffix: '%', icon: Sun, color: 'text-primary' },
];

const FEATURES = [
  { icon: Globe2, title: 'Interactive 3D Earth', desc: 'Explore a living planet with real-time day/night cycles, weather systems, and atmospheric glow.', color: 'from-primary/20 to-secondary/10' },
  { icon: Activity, title: 'Living Ecosystems', desc: 'Watch ecosystems respond to your decisions — forests grow, oceans heal, or pollution spreads.', color: 'from-secondary/20 to-primary/10' },
  { icon: Satellite, title: 'Satellite Intelligence', desc: 'Scan Earth from orbit to detect forest loss, water quality, urban growth, and heat islands.', color: 'from-accent/20 to-secondary/10' },
  { icon: Sparkles, title: 'Rule-Based AI Advisor', desc: 'An explainable expert system analyzes your decisions and recommends environmental actions.', color: 'from-primary/20 to-accent/10' },
  { icon: Target, title: 'Mission Challenges', desc: 'Restore Earth through story-driven missions — from reforestation to net-zero emissions.', color: 'from-warning/20 to-primary/10' },
  { icon: BarChart3, title: 'Future Timeline', desc: 'Project Earth from 2026 to 2100 and see how today\'s decisions shape tomorrow.', color: 'from-secondary/20 to-accent/10' },
];

const TIME_OF_DAY = ['Sunrise', 'Day', 'Sunset', 'Night'];

export default function Home() {
  const [timeIndex, setTimeIndex] = useState(1);
  const [health] = useState(0.5);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeIndex((p) => (p + 1) % TIME_OF_DAY.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const timeColors: Record<string, string> = {
    Sunrise: 'from-orange-500/20 via-pink-500/10 to-primary/5',
    Day: 'from-secondary/20 via-primary/10 to-transparent',
    Sunset: 'from-orange-600/20 via-purple-500/10 to-secondary/5',
    Night: 'from-indigo-900/40 via-blue-900/20 to-transparent',
  };

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={30} />
      <section ref={heroRef} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${timeColors[TIME_OF_DAY[timeIndex]]} transition-all duration-[3000ms]`} />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="relative mx-auto max-w-7xl px-6 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="primary" className="mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-for-Earth Hackathon
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05] text-balance">
              The planet's <span className="gradient-text">decision intelligence</span> platform
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--text-muted)] max-w-xl leading-relaxed text-balance">
              Explore Earth's environmental health in immersive 3D. Simulate sustainability
              decisions. Understand their long-term impact. Built with explainable, rule-based AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/simulation">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-ink font-medium shadow-glow hover:bg-primary-light transition-colors"
                >
                  Launch Simulation <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/command-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass font-medium hover:text-primary transition-colors"
                >
                  Enter Command Center
                </motion.button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Cycle</span>
              <div className="flex gap-1.5">
                {TIME_OF_DAY.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setTimeIndex(i)}
                    className={`px-3 py-1 rounded-full text-xs transition-all ${
                      i === timeIndex ? 'bg-primary/20 text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px]"
          >
            <Suspense fallback={<div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-2xl" />}>
              <Earth3D health={health} className="w-full h-full" />
            </Suspense>
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2 text-xs text-[var(--text-muted)] flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Drag to rotate · Scroll to zoom
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6" hover>
                    <Icon className={`w-6 h-6 ${s.color} mb-3`} />
                    <div className="text-3xl md:text-4xl font-bold font-display">
                      <StatCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            center
            eyebrow="Platform Capabilities"
            title="Everything you need to understand Earth"
            description="A complete environmental intelligence platform — from immersive 3D exploration to rule-based AI advisory and mission-driven challenges."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                >
                  <GlassCard className="p-6 h-full group" hover>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold font-display mb-2">{f.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <GlassCard className="p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">Environmental Impact</Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-balance">
                  Every decision shapes the planet
                </h2>
                <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                  EcoSphere Genesis models six interconnected environmental systems. Adjust one
                  and watch the ripple effects across forests, oceans, air, carbon, biodiversity,
                  and renewable energy — all computed by an explainable rule-based engine.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { icon: Trees, label: 'Forest ecosystems absorb 31% of global CO₂', color: 'text-primary' },
                    { icon: Droplets, label: 'Oceans produce 50% of Earth\'s oxygen', color: 'text-secondary' },
                    { icon: Zap, label: 'Renewable energy could cut emissions 75% by 2050', color: 'text-warning' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                <Link to="/challenges" className="mt-8 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  Take on a mission <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Forest', value: 52, icon: Trees, color: 'var(--primary)' },
                  { label: 'Water', value: 61, icon: Droplets, color: 'var(--secondary)' },
                  { label: 'Air', value: 48, icon: Wind, color: 'var(--warning)' },
                  { label: 'Carbon', value: 72, icon: Cloud, color: 'var(--danger)' },
                  { label: 'Biodiversity', value: 44, icon: Bird, color: 'var(--accent)' },
                  { label: 'Renewable', value: 28, icon: Sun, color: 'var(--primary)' },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="glass rounded-2xl p-4">
                      <Icon className="w-5 h-5 mb-2" style={{ color: m.color }} />
                      <div className="text-2xl font-bold font-display">
                        <StatCounter value={m.value} suffix="%" />
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
