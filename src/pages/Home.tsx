import { Suspense, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Trees, Droplets, Wind, Sun, Cloud, Bird,
  Satellite, Target, BarChart3, Sparkles, Activity, Globe2, Zap,
  ChevronDown, TrendingUp, Shield, Leaf,
} from 'lucide-react';
import { GlassCard, SectionTitle, StatCounter, Badge } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { Earth3D, type TimeOfDay, type Season } from '@/components/three/Earth3D';

const STATS = [
  { label: 'Forest Cover', value: 52, suffix: '%', icon: Trees, color: 'text-primary', trend: '-2.1% this year', trendDown: true },
  { label: 'Ocean Health', value: 61, suffix: '%', icon: Droplets, color: 'text-secondary', trend: '+0.3% this year', trendDown: false },
  { label: 'Air Quality', value: 48, suffix: '%', icon: Wind, color: 'text-warning', trend: '-1.4% this year', trendDown: true },
  { label: 'Renewable Energy', value: 28, suffix: '%', icon: Sun, color: 'text-primary', trend: '+4.8% this year', trendDown: false },
];

const FEATURES = [
  { icon: Globe2, title: 'Interactive 3D Earth', desc: 'Explore a living planet with real-time day/night cycles, weather systems, aurora borealis, and atmospheric scattering.', color: 'from-primary/20 to-secondary/10', tag: 'Live 3D' },
  { icon: Activity, title: 'Living Ecosystems', desc: 'Watch ecosystems respond to your decisions — forests grow, oceans heal, or pollution spreads across the planet.', color: 'from-secondary/20 to-primary/10', tag: 'Real-time' },
  { icon: Satellite, title: 'Satellite Intelligence', desc: 'Scan Earth from orbit to detect forest loss, water quality, urban growth, and heat islands — NASA-style.', color: 'from-accent/20 to-secondary/10', tag: 'Orbital' },
  { icon: Sparkles, title: 'Rule-Based AI Advisor', desc: 'An explainable expert system analyzes your decisions and recommends environmental actions with full transparency.', color: 'from-primary/20 to-accent/10', tag: 'Explainable AI' },
  { icon: Target, title: 'Mission Challenges', desc: 'Restore Earth through story-driven missions — from reforestation to net-zero emissions. Earn XP and achievements.', color: 'from-warning/20 to-primary/10', tag: 'Story Mode' },
  { icon: BarChart3, title: 'Future Timeline', desc: 'Project Earth from 2026 to 2100 and see how today\'s decisions visually transform the planet across decades.', color: 'from-secondary/20 to-accent/10', tag: '2026–2100' },
];

const TIME_CYCLE: { key: TimeOfDay; label: string; emoji: string }[] = [
  { key: 'sunrise', label: 'Sunrise', emoji: '🌅' },
  { key: 'day',     label: 'Day',     emoji: '☀️' },
  { key: 'sunset',  label: 'Sunset',  emoji: '🌇' },
  { key: 'night',   label: 'Night',   emoji: '🌙' },
];

const SEASON_CYCLE: { key: Season; label: string }[] = [
  { key: 'spring', label: 'Spring' },
  { key: 'summer', label: 'Summer' },
  { key: 'autumn', label: 'Autumn' },
  { key: 'winter', label: 'Winter' },
];

const SKY_CONFIGS: Record<TimeOfDay, { bg: string; stars: boolean; description: string }> = {
  sunrise: {
    bg: 'from-orange-900/50 via-rose-900/30 via-purple-900/20 to-transparent',
    stars: false,
    description: 'Golden Hour — Earth waking up',
  },
  day: {
    bg: 'from-sky-900/30 via-blue-900/20 to-transparent',
    stars: false,
    description: 'Daytime — Full planetary visibility',
  },
  sunset: {
    bg: 'from-orange-800/50 via-purple-900/35 via-indigo-900/20 to-transparent',
    stars: false,
    description: 'Golden Hour — Twilight atmosphere',
  },
  night: {
    bg: 'from-indigo-950/70 via-slate-900/50 via-blue-950/30 to-transparent',
    stars: true,
    description: 'Night — City lights & aurora visible',
  },
};

export default function Home() {
  const [timeIndex, setTimeIndex]   = useState(1);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [health] = useState(0.62);

  const heroRef    = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY        = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const currentTime   = TIME_CYCLE[timeIndex];
  const currentSeason = SEASON_CYCLE[seasonIndex];
  const sky = SKY_CONFIGS[currentTime.key];

  // Auto-cycle time of day
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeIndex((p) => (p + 1) % TIME_CYCLE.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle seasons (slower)
  useEffect(() => {
    const interval = setInterval(() => {
      setSeasonIndex((p) => (p + 1) % SEASON_CYCLE.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={25} />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">

        {/* Dynamic sky gradient */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentTime.key}
            className={`absolute inset-0 bg-gradient-to-b ${sky.bg}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
          />
        </AnimatePresence>

        {/* Star field (night only) */}
        <AnimatePresence>
          {sky.stars && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    top: `${Math.random() * 60}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `pulseDot ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nasa grid */}
        <div className="absolute inset-0 nasa-grid opacity-30" />

        {/* Hero horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: currentTime.key === 'night'
              ? 'linear-gradient(to top, rgba(0, 229, 168, 0.04), transparent)'
              : currentTime.key === 'sunrise'
              ? 'linear-gradient(to top, rgba(255, 140, 60, 0.08), transparent)'
              : currentTime.key === 'sunset'
              ? 'linear-gradient(to top, rgba(255, 80, 40, 0.08), transparent)'
              : 'linear-gradient(to top, rgba(56, 189, 248, 0.05), transparent)',
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative mx-auto max-w-7xl px-6 w-full grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center py-16"
        >
          {/* Left — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="primary" className="mb-5 gap-2">
              <span className="status-dot-live" />
              AI-for-Earth Hackathon 2026
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05] text-balance">
              The planet's{' '}
              <span className="gradient-text">decision intelligence</span>{' '}
              platform
            </h1>

            <p className="mt-6 text-base md:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed">
              Explore Earth's environmental health in immersive 3D. Simulate sustainability decisions.
              Understand their long-term impact through seasons, weather, and time across centuries.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/simulation">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,229,168,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-ink font-semibold shadow-glow hover:bg-primary-light transition-all"
                >
                  Launch Simulation <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/command-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass font-medium hover:text-primary transition-colors border border-primary/20"
                >
                  <Satellite className="w-4 h-4 text-primary" />
                  Command Center
                </motion.button>
              </Link>
            </div>

            {/* Time-of-day selector */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-medium">Time of Day</span>
                <div className="flex gap-1">
                  {TIME_CYCLE.map((t, i) => (
                    <motion.button
                      key={t.key}
                      onClick={() => setTimeIndex(i)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        i === timeIndex
                          ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow'
                          : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {t.emoji} {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-medium">Season</span>
                <div className="flex gap-1">
                  {SEASON_CYCLE.map((s, i) => (
                    <motion.button
                      key={s.key}
                      onClick={() => setSeasonIndex(i)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        i === seasonIndex
                          ? 'bg-secondary/20 text-secondary border border-secondary/30'
                          : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status bar */}
            <motion.div
              className="mt-6 flex items-center gap-3 glass rounded-xl px-4 py-3 w-fit"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="status-dot-live" />
              <span className="text-xs text-[var(--text-muted)] font-mono">{sky.description}</span>
            </motion.div>
          </motion.div>

          {/* Right — 3D Earth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[420px] md:h-[540px] lg:h-[640px]"
          >
            {/* Orbital ring decorations */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[90%] h-[90%] rounded-full border border-primary/8 animate-spin-slow" />
              <div className="absolute w-[75%] h-[75%] rounded-full border border-secondary/6 animate-spin-reverse" />
            </div>

            {/* Earth glow halo */}
            <div className="absolute inset-8 rounded-full pointer-events-none"
              style={{
                background: currentTime.key === 'night'
                  ? 'radial-gradient(circle, rgba(0,229,168,0.06) 0%, transparent 70%)'
                  : currentTime.key === 'sunrise' || currentTime.key === 'sunset'
                  ? 'radial-gradient(circle, rgba(255,140,60,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
              }}
            />

            <Suspense fallback={
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/15 to-secondary/10 animate-pulse" />
            }>
              <Earth3D
                health={health}
                timeOfDay={currentTime.key}
                season={currentSeason.key}
                weather="clear"
                className="w-full h-full"
                enableControls
              />
            </Suspense>

            {/* Earth info floating label */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-5 py-2.5 text-xs text-[var(--text-muted)] flex items-center gap-2 border border-primary/15"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Drag to rotate · Scroll to zoom
            </motion.div>

            {/* Telemetry readouts */}
            <motion.div
              className="absolute top-6 right-4 glass rounded-xl p-3 text-[10px] font-mono text-primary/70 space-y-1 border border-primary/10"
              initial={{ opacity: 0, x: 20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2 }}
            >
              <div className="flex gap-2"><span className="text-[var(--text-muted)]">LAT</span><span>23.4°N</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-muted)]">ALT</span><span>408 km</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-muted)]">HEALTH</span><span className="text-primary">{Math.round(health * 100)}%</span></div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="glass-card p-6 h-full relative overflow-hidden group"
                  >
                    {/* Gradient top accent */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <span className={`text-[10px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-full ${s.trendDown ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                        {s.trendDown ? '↓' : '↑'} {s.trend.split(' ')[0]}
                      </span>
                    </div>

                    <div className="text-3xl md:text-4xl font-bold font-display">
                      <StatCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>

                    {/* Mini bar */}
                    <div className="mt-3 h-1 rounded-full bg-[var(--glass-border)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `var(--primary)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== LIVE EARTH TICKER ===== */}
      <section className="py-4 overflow-hidden border-y border-[var(--glass-border)]">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex gap-12">
              {[
                { label: 'CO₂ Level', value: '421.4 ppm', status: 'critical' },
                { label: 'Sea Level Rise', value: '+3.6 mm/yr', status: 'warning' },
                { label: 'Arctic Ice', value: '-13.1%/decade', status: 'critical' },
                { label: 'Deforestation', value: '4.7M ha/yr', status: 'warning' },
                { label: 'Ocean Temp', value: '+0.9°C', status: 'warning' },
                { label: 'Renewables', value: '30% global', status: 'good' },
                { label: 'Species Loss', value: '1000x natural rate', status: 'critical' },
                { label: 'Clean Water', value: '2B lacking access', status: 'warning' },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-xs font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.status === 'critical' ? 'bg-danger animate-pulse' : item.status === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                  <span className="text-[var(--text-muted)]">{item.label}:</span>
                  <span className={item.status === 'critical' ? 'text-danger' : item.status === 'warning' ? 'text-warning' : 'text-primary'}>{item.value}</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative py-20">
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                  style={{ perspective: 800 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: 2, rotateX: -1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="glass-card p-6 h-full group cursor-default"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] font-medium px-2 py-1 rounded-full glass text-[var(--text-muted)] border border-[var(--glass-border)]">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold font-display mb-2">{f.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== IMPACT SECTION ===== */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <GlassCard className="p-8 md:p-12 overflow-hidden relative glow-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    <TrendingUp className="w-3 h-3" /> Environmental Impact
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-balance leading-tight">
                    Every decision{' '}
                    <span className="gradient-text">shapes the planet</span>
                  </h2>
                  <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
                    TerraMind models six interconnected environmental systems. Adjust one and watch
                    the ripple effects across forests, oceans, air, carbon, biodiversity, and
                    renewable energy — all powered by an explainable rule-based engine.
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      { icon: Trees,    label: 'Forest ecosystems absorb 31% of global CO₂', color: 'text-primary' },
                      { icon: Droplets, label: 'Oceans produce 50% of Earth\'s oxygen',        color: 'text-secondary' },
                      { icon: Zap,      label: 'Renewable energy could cut emissions 75% by 2050', color: 'text-warning' },
                      { icon: Shield,   label: 'Biodiversity is Earth\'s immune system',        color: 'text-accent' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          className="flex items-center gap-3 group"
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[var(--glass-border)] flex items-center justify-center flex-shrink-0">
                            <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          </div>
                          <span className="text-sm">{item.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <Link to="/challenges" className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group">
                    Take on a mission <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Forest',      value: 52, icon: Trees,    color: 'var(--primary)' },
                    { label: 'Water',       value: 61, icon: Droplets, color: 'var(--secondary)' },
                    { label: 'Air',         value: 48, icon: Wind,     color: 'var(--warning)' },
                    { label: 'Carbon',      value: 72, icon: Cloud,    color: 'var(--danger)' },
                    { label: 'Biodiversity',value: 44, icon: Bird,     color: 'var(--accent)' },
                    { label: 'Renewable',   value: 28, icon: Leaf,     color: 'var(--primary)' },
                  ].map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <motion.div
                        key={m.label}
                        className="glass rounded-2xl p-4 group hover:scale-105 transition-transform cursor-default"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <Icon className="w-5 h-5 mb-2" style={{ color: m.color }} />
                        <div className="text-2xl font-bold font-display">
                          <StatCounter value={m.value} suffix="%" />
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mb-2">{m.label}</div>
                        <div className="h-1 rounded-full bg-[var(--glass-border)] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: m.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${m.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT TERRAMIND AI SECTION ===== */}
      <section className="relative py-20 bg-gradient-to-b from-transparent via-[#0a1628]/60 to-transparent">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            center
            eyebrow="About TerraMind AI"
            title="Architecting Planetary Resilience Through Decision Intelligence"
            description="Created for the AI-for-Earth Hackathon 2026. Designed to democratize Earth observation, simulate policy interventions, and protect planetary boundaries."
          />

          {/* Mission & Vision Cards */}
          <div className="mt-12 grid md:grid-cols-2 gap-6 mb-12">
            <GlassCard className="p-8 border-primary/20 relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                  🎯
                </div>
                <h3 className="text-xl font-bold font-display text-white">Our Mission</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Empower climate decision-makers, researchers, and global citizens with real-time, interactive 3D digital twin simulations of Earth's critical ecosystems to reverse environmental degradation.
              </p>
            </GlassCard>

            <GlassCard className="p-8 border-secondary/20 relative overflow-hidden bg-gradient-to-br from-secondary/5 via-transparent to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                  🚀
                </div>
                <h3 className="text-xl font-bold font-display text-white">Our Vision</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Build the world's most accessible planetary digital twin platform — combining orbital telemetry, rule-based ecological engines, and immersive 3D WebGL visuals for immediate impact.
              </p>
            </GlassCard>
          </div>

          {/* Core Problem & Story Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <GlassCard className="p-6 border-white/10">
              <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2 font-semibold">The Problem We Solve</div>
              <h4 className="text-base font-bold font-display text-white mb-2">Fragmented Climate Data</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Traditional environmental data is locked in dense academic reports. TerraMind AI translates complex orbital metrics into intuitive, interactive 3D simulations.
              </p>
            </GlassCard>

            <GlassCard className="p-6 border-white/10">
              <div className="text-xs font-mono text-secondary uppercase tracking-widest mb-2 font-semibold">Why This Matters</div>
              <h4 className="text-base font-bold font-display text-white mb-2">Tipping Points Are Near</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                With atmospheric CO₂ over 421 ppm and 1M species endangered, instant feedback loops on policy decisions are mandatory for global resilience.
              </p>
            </GlassCard>

            <GlassCard className="p-6 border-white/10">
              <div className="text-xs font-mono text-warning uppercase tracking-widest mb-2 font-semibold">Development Team</div>
              <h4 className="text-base font-bold font-display text-white mb-2">Built by Nalin & Tanishq</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Architected by <strong>Nalin Tuscano</strong> (3D WebGL & Full-Stack Engine) and <strong>Tanishq</strong> (AI Systems & Environmental Telemetry).
              </p>
            </GlassCard>
          </div>

          {/* Project Statistics - Animated Counters */}
          <GlassCard className="p-8 border-primary/20 bg-gradient-to-r from-[#0a1628] via-[#0f2442] to-[#0a1628] mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold font-display text-primary">
                  <StatCounter value={10} suffix=" Domains" />
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase">Climate Monitoring</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-display text-secondary">
                  <StatCounter value={142} suffix=" Nodes" />
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase">Orbital Satellites</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-display text-warning">
                  <StatCounter value={100} suffix="%" />
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase">Deterministic Engine</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold font-display text-accent">
                  <StatCounter value={1.2} decimals={1} suffix="s" />
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase">Telemetry Speed</div>
              </div>
            </div>
          </GlassCard>

          {/* Interactive Roadmap / Timeline */}
          <div className="glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-lg font-bold font-display text-white mb-6 text-center">Project Development Timeline</h3>
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="glass rounded-xl p-5 border-l-4 border-l-primary border-white/5">
                <div className="text-xs font-mono text-primary font-bold">2026 — HACKATHON PROTOTYPE</div>
                <h4 className="font-bold text-sm text-white mt-1">TerraMind AI v1.0</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  Interactive 3D Earth Digital Twin, Policy Simulation, Climate Action Hub, and Ocean Cleanup Simulator.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border-l-4 border-l-secondary border-white/5">
                <div className="text-xs font-mono text-secondary font-bold">2027 — LIVE IOT INTEGRATION</div>
                <h4 className="font-bold text-sm text-white mt-1">Ground & Ocean Sensor Mesh</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  Direct API streaming from NASA Sentinel, NOAA buoys, and autonomous oceanic monitoring drones.
                </p>
              </div>

              <div className="glass rounded-xl p-5 border-l-4 border-l-accent border-white/5">
                <div className="text-xs font-mono text-accent font-bold">2030 — GLOBAL DEPLOYMENT</div>
                <h4 className="font-bold text-sm text-white mt-1">Autonomous Policy Grid</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  AI-driven policy execution and automated carbon offset verification across international jurisdictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="primary" className="mb-6">
              <Globe2 className="w-3 h-3" /> Open Environmental Intelligence
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-balance leading-tight">
              Ready to save the{' '}
              <span className="text-aurora">planet</span>?
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
              Join TerraMind and explore what Earth could become with the right decisions. Every
              simulation matters. Every choice counts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link to="/simulation">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,229,168,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-ink font-bold shadow-glow text-base"
                >
                  Start Simulation <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/insights">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass font-semibold border border-primary/20 text-base"
                >
                  <Activity className="w-4 h-4 text-primary" /> View Insights
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
