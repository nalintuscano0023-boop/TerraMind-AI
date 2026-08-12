import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Cloud, Bird,
  Droplets, Trees, Wind, TrendingUp,
  BarChart3, Activity, Waves, ThermometerSun, Globe2, Leaf, Sun,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar, Slider, OceanHealthCanvas } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const RISK_METRICS = [
  { label: 'Forest Risk',    value: 72, icon: Trees,          color: '#00E5A8', desc: 'Deforestation at 4.7M ha/yr',   trend: 'up'   },
  { label: 'Ocean Risk',     value: 65, icon: Waves,          color: '#38BDF8', desc: 'Acidification pH 8.08',         trend: 'up'   },
  { label: 'Air Quality',    value: 58, icon: Wind,           color: '#FFB830', desc: 'PM2.5 above WHO limits',        trend: 'up'   },
  { label: 'Climate Risk',   value: 79, icon: ThermometerSun, color: '#FF4D6D', desc: '+1.4°C above baseline',        trend: 'up'   },
  { label: 'Biodiversity',   value: 61, icon: Bird,           color: '#A78BFA', desc: '1M species at extinction risk', trend: 'up'   },
  { label: 'Water Security', value: 43, icon: Droplets,       color: '#06B6D4', desc: '2B people lack clean access',  trend: 'same' },
];

/* ── Earth Recovery Timeline ── */
const RECOVERY_YEARS = [2026, 2035, 2050, 2075, 2100] as const;
type RecoveryYear = typeof RECOVERY_YEARS[number];

interface RecoveryScenario {
  year:            RecoveryYear;
  title:           string;
  subtitle:        string;
  earthHealth:     number;
  forestRecovery:  number;
  oceanRecovery:   number;
  airQuality:      number;
  biodiversity:    number;
  renewableEnergy: number;
  carbonReduction: number;
  statusColor:     string;
  statusLabel:     string;
}

const RECOVERY_DATA: Record<RecoveryYear, RecoveryScenario> = {
  2026: {
    year: 2026, title: 'The Turning Point', subtitle: 'Now or never — decisions made today define the century',
    earthHealth: 45, forestRecovery: 30, oceanRecovery: 35, airQuality: 40,
    biodiversity: 32, renewableEnergy: 28, carbonReduction: 12,
    statusColor: '#FF4D6D', statusLabel: 'CRITICAL',
  },
  2035: {
    year: 2035, title: 'The Decade of Action', subtitle: 'Emissions peak. Global reforestation treaties enacted.',
    earthHealth: 56, forestRecovery: 48, oceanRecovery: 50, airQuality: 55,
    biodiversity: 44, renewableEnergy: 52, carbonReduction: 28,
    statusColor: '#FFB830', statusLabel: 'WARNING',
  },
  2050: {
    year: 2050, title: 'Net Zero Milestone', subtitle: 'Carbon neutral globally. Oceans slowly recovering.',
    earthHealth: 68, forestRecovery: 64, oceanRecovery: 65, airQuality: 72,
    biodiversity: 58, renewableEnergy: 78, carbonReduction: 52,
    statusColor: '#FFB830', statusLabel: 'MODERATE',
  },
  2075: {
    year: 2075, title: 'The Restoration Era', subtitle: 'Forests expanding. Coral reefs regenerating. Wildlife surging.',
    earthHealth: 80, forestRecovery: 78, oceanRecovery: 80, airQuality: 85,
    biodiversity: 75, renewableEnergy: 92, carbonReduction: 74,
    statusColor: '#00E5A8', statusLabel: 'RECOVERING',
  },
  2100: {
    year: 2100, title: 'The Balanced Earth', subtitle: 'Sustainable civilization. Ecosystems thriving. Climate stabilized.',
    earthHealth: 92, forestRecovery: 91, oceanRecovery: 90, airQuality: 95,
    biodiversity: 88, renewableEnergy: 98, carbonReduction: 91,
    statusColor: '#00E5A8', statusLabel: 'THRIVING',
  },
};

const RECOVERY_METRICS = [
  { key: 'earthHealth'     as const, label: 'Earth Health',       icon: Globe2,   color: '#00E5A8' },
  { key: 'forestRecovery'  as const, label: 'Forest Recovery',    icon: Trees,    color: '#22c55e' },
  { key: 'oceanRecovery'   as const, label: 'Ocean Recovery',     icon: Waves,    color: '#38BDF8' },
  { key: 'airQuality'      as const, label: 'Air Quality',        icon: Wind,     color: '#FFB830' },
  { key: 'biodiversity'    as const, label: 'Biodiversity',       icon: Bird,     color: '#A78BFA' },
  { key: 'renewableEnergy' as const, label: 'Renewable Energy',   icon: Sun,      color: '#FFB830' },
  { key: 'carbonReduction' as const, label: 'Carbon Reduction',   icon: Leaf,     color: '#00C2FF' },
];

/* ── Climate Timeline (for graph) ── */
const TIMELINE_YEARS = [2026, 2030, 2040, 2050, 2075, 2100] as const;
type TimelineYear = typeof TIMELINE_YEARS[number];

interface YearProjection {
  year: TimelineYear;
  carbonPpm: number; tempAnomaly: number; seaLevelCm: number;
  forestCoverage: number; waterQuality: number; airQuality: number;
  renewablePct: number; biodiversityPct: number;
}

const TIMELINE_DATA: Record<TimelineYear, YearProjection> = {
  2026: { year: 2026, carbonPpm: 421, tempAnomaly: 1.3, seaLevelCm: 12,  forestCoverage: 52, waterQuality: 61, airQuality: 48, renewablePct: 28, biodiversityPct: 44 },
  2030: { year: 2030, carbonPpm: 432, tempAnomaly: 1.5, seaLevelCm: 18,  forestCoverage: 48, waterQuality: 56, airQuality: 42, renewablePct: 38, biodiversityPct: 39 },
  2040: { year: 2040, carbonPpm: 450, tempAnomaly: 1.9, seaLevelCm: 32,  forestCoverage: 41, waterQuality: 48, airQuality: 35, renewablePct: 52, biodiversityPct: 31 },
  2050: { year: 2050, carbonPpm: 468, tempAnomaly: 2.4, seaLevelCm: 48,  forestCoverage: 35, waterQuality: 40, airQuality: 28, renewablePct: 68, biodiversityPct: 24 },
  2075: { year: 2075, carbonPpm: 505, tempAnomaly: 3.1, seaLevelCm: 85,  forestCoverage: 26, waterQuality: 31, airQuality: 22, renewablePct: 82, biodiversityPct: 16 },
  2100: { year: 2100, carbonPpm: 540, tempAnomaly: 3.8, seaLevelCm: 124, forestCoverage: 18, waterQuality: 22, airQuality: 15, renewablePct: 95, biodiversityPct: 9  },
};

/* Graph points (SVG 500×180 viewBox) */
const GRAPH_POINTS: Record<TimelineYear, { x: number; y: number }> = {
  2026: { x: 0,   y: 150 },
  2030: { x: 100, y: 135 },
  2040: { x: 200, y: 110 },
  2050: { x: 300, y: 85  },
  2075: { x: 400, y: 40  },
  2100: { x: 500, y: 10  },
};

const PLASTIC_DATA = [
  { region: 'Pacific Ocean', level: 88, color: '#FF4D6D' },
  { region: 'Atlantic',      level: 62, color: '#FFB830' },
  { region: 'Indian Ocean',  level: 55, color: '#FFB830' },
  { region: 'Arctic',        level: 38, color: '#38BDF8' },
  { region: 'Mediterranean', level: 74, color: '#FF4D6D' },
];

const DEFORESTATION_HOTSPOTS = [
  { name: 'Amazon Basin',  loss: 4700000, pct: 92, color: '#FF4D6D' },
  { name: 'Congo Basin',   loss: 1200000, pct: 67, color: '#FFB830' },
  { name: 'SE Asia',       loss: 980000,  pct: 58, color: '#FFB830' },
  { name: 'Boreal Forest', loss: 450000,  pct: 38, color: '#38BDF8' },
  { name: 'Australia',     loss: 310000,  pct: 28, color: '#94A3B8' },
];

const FLOOD_ZONES = [
  { city: 'Miami',    risk: 'Critical', pct: 89, color: '#FF4D6D' },
  { city: 'Jakarta',  risk: 'Critical', pct: 94, color: '#FF4D6D' },
  { city: 'Mumbai',   risk: 'High',     pct: 73, color: '#FFB830' },
  { city: 'Shanghai', risk: 'High',     pct: 68, color: '#FFB830' },
  { city: 'London',   risk: 'Medium',   pct: 41, color: '#38BDF8' },
  { city: 'Tokyo',    risk: 'Medium',   pct: 45, color: '#38BDF8' },
];

const ENERGY_PLAN = [
  { source: 'Solar',   current: 15, potential: 55, emoji: '☀️', color: '#FFB830' },
  { source: 'Wind',    current: 12, potential: 38, emoji: '💨', color: '#38BDF8' },
  { source: 'Hydro',   current: 16, potential: 22, emoji: '💧', color: '#06B6D4' },
  { source: 'Nuclear', current:  4, potential: 15, emoji: '⚡', color: '#A78BFA' },
  { source: 'Fossil',  current: 53, potential:  0, emoji: '🏭', color: '#FF4D6D' },
];

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
export default function Insights() {
  const [plasticReduction, setPlasticReduction] = useState(25);
  const [activeYear, setActiveYear]             = useState<TimelineYear>(2026);
  const [renewablePlan, setRenewablePlan]       = useState(50);
  const [activeDroneCount, setActiveDroneCount] = useState(4);
  const [recoveryYear, setRecoveryYear]         = useState<RecoveryYear>(2026);

  const currentProjection = useMemo(() => TIMELINE_DATA[activeYear], [activeYear]);
  const recoveryScenario  = useMemo(() => RECOVERY_DATA[recoveryYear], [recoveryYear]);

  /* Graph path */
  const graphLinePath = useMemo(() => {
    const pts = TIMELINE_YEARS.map((y) => GRAPH_POINTS[y]);
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, []);

  const graphAreaPath = useMemo(() => {
    const pts = TIMELINE_YEARS.map((y) => GRAPH_POINTS[y]);
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${line} L 500 180 L 0 180 Z`;
  }, []);

  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* ── PROBLEM STATEMENT ── */}
        <section>
          <SectionTitle
            eyebrow="Global Environmental Crisis"
            title="Earth's systems are failing — and decisions are blind"
            description="Climate change, ocean degradation, and biodiversity loss are accelerating. TerraMind translates complex environmental science into real-time decision intelligence."
          />
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: AlertTriangle, title: '75% of ecosystems degraded',     desc: 'UN reports find terrestrial ecosystems in rapid decline. Urgent intervention required.', color: '#FF4D6D' },
              { icon: Cloud,         title: 'CO₂ at 421+ ppm',                desc: 'Highest atmospheric concentration in human history, rising annually. Dangerous tipping points.', color: '#FFB830' },
              { icon: Bird,          title: '1M+ species at extinction risk', desc: 'IPBES warns of unprecedented extinction rates — 6th mass extinction currently underway.',        color: '#A78BFA' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-5 sm:p-6 h-full card-hover" style={{ borderLeft: `3px solid ${item.color}55` }}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-2.5 sm:mb-3" style={{ color: item.color }} />
                    <h3 className="font-bold font-display mb-1.5 text-sm sm:text-base text-white">{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── GLOBAL RISK DASHBOARD ── */}
        <section>
          <SectionTitle
            eyebrow="Risk Dashboard"
            title="Global Environmental Risk Monitor"
            description="Real-time risk indices across six planetary systems — continuously updated from satellite telemetry."
          />
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {RISK_METRICS.map((m, i) => {
              const Icon = m.icon;
              const riskLabel = m.value > 70 ? 'CRITICAL' : m.value > 50 ? 'HIGH' : 'MODERATE';
              const riskBadge = m.value > 70 ? 'danger' as const : m.value > 50 ? 'warning' as const : 'default' as const;
              return (
                <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-4 sm:p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />
                    <div className="flex items-start justify-between mb-2.5 sm:mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}18` }}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: m.color }} />
                      </div>
                      <Badge variant={riskBadge} className="text-[10px] sm:text-xs">
                        {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                        {riskLabel}
                      </Badge>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-orbitron mb-1" style={{ color: m.color }}>{m.value}%</div>
                    <div className="font-semibold font-display text-xs sm:text-sm mb-1 text-white">{m.label}</div>
                    <div className="text-[11px] sm:text-xs text-[var(--text-muted)] mb-2.5 sm:mb-3">{m.desc}</div>
                    <div className="h-1.5 sm:h-2 rounded-full bg-[var(--glass-border)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${m.color}, ${m.color}99)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.08 }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ── EARTH RECOVERY TIMELINE ──
        ══════════════════════════════════════════════════ */}
        <section>
          <SectionTitle
            eyebrow="Digital-Twin Projection"
            title="Earth Recovery Timeline"
            description="Select a year to see how sustained environmental action transforms planetary health across seven key dimensions."
          />

          <div className="mt-6 sm:mt-8">
            <GlassCard className="p-4 sm:p-6 md:p-8 relative overflow-hidden border-primary/20" style={{ background: 'linear-gradient(135deg, rgba(6,15,30,0.92) 0%, rgba(9,24,38,0.80) 100%)' }}>
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,229,168,0.08) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.06) 0%, transparent 70%)' }} />

              {/* Timeline selector */}
              <div className="relative flex items-center gap-0 mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-2">
                {/* Connector line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none -translate-y-1/2 z-0 hidden sm:block" />
                <div className="flex items-center gap-2 sm:gap-3 w-full justify-start sm:justify-between relative z-10">
                  {RECOVERY_YEARS.map((year) => {
                    const scenario = RECOVERY_DATA[year];
                    const isActive = recoveryYear === year;
                    return (
                      <motion.button
                        key={year}
                        onClick={() => setRecoveryYear(year)}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={[
                          'relative flex flex-col items-center gap-1.5 px-3 sm:px-4 min-h-[60px] sm:min-h-[68px] rounded-2xl flex-shrink-0 sm:flex-1 min-w-[76px] sm:min-w-0',
                          'inline-flex justify-center transition-all duration-300',
                          'text-xs font-semibold leading-none whitespace-nowrap',
                          isActive
                            ? 'border shadow-glow'
                            : 'glass border border-white/5 hover:border-white/15',
                        ].join(' ')}
                        style={isActive ? {
                          background: `${scenario.statusColor}18`,
                          borderColor: `${scenario.statusColor}50`,
                          boxShadow: `0 0 20px ${scenario.statusColor}30`,
                        } : {}}
                      >
                        <span className="font-orbitron font-bold text-sm sm:text-base leading-none" style={{ color: isActive ? scenario.statusColor : undefined }}>
                          {year}
                        </span>
                        <span
                          className="text-[8px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: `${scenario.statusColor}22`,
                            color: scenario.statusColor,
                          }}
                        >
                          {scenario.statusLabel}
                        </span>
                        {/* Mini health bar */}
                        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: scenario.statusColor }}
                            animate={{ width: `${scenario.earthHealth}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Content — animated on year change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={recoveryYear}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-display text-white">{recoveryScenario.title}</div>
                      <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">{recoveryScenario.subtitle}</div>
                    </div>
                    <div className="sm:ml-auto self-start sm:self-auto">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono"
                        style={{
                          background: `${recoveryScenario.statusColor}20`,
                          color: recoveryScenario.statusColor,
                          border: `1px solid ${recoveryScenario.statusColor}40`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: recoveryScenario.statusColor }} />
                        {recoveryScenario.year} · {recoveryScenario.statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Metric cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
                    {RECOVERY_METRICS.map((rm, mi) => {
                      const value = recoveryScenario[rm.key];
                      const Icon = rm.icon;
                      return (
                        <motion.div
                          key={rm.key}
                          initial={{ opacity: 0, scale: 0.88, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: mi * 0.05, duration: 0.4, ease: 'easeOut' }}
                          className="glass rounded-2xl p-2.5 sm:p-3 border border-white/6 flex flex-col items-center text-center relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${rm.color}, transparent)` }} />
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mb-1.5 sm:mb-2" style={{ background: `${rm.color}18` }}>
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: rm.color }} />
                          </div>
                          <motion.div
                            className="text-lg sm:text-xl font-bold font-orbitron leading-none mb-1"
                            style={{ color: rm.color }}
                            key={`${rm.key}-${recoveryYear}`}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: mi * 0.05 + 0.1, duration: 0.3 }}
                          >
                            {value}%
                          </motion.div>
                          <div className="text-[9px] text-[var(--text-muted)] font-mono leading-tight">{rm.label}</div>
                          {/* Mini progress bar */}
                          <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden mt-1.5 sm:mt-2">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: rm.color }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.8, delay: mi * 0.04 }}
                            />
                          </div>
                          {/* Recovery indicator arrow */}
                          <div className="mt-1 sm:mt-1.5 text-[8px] font-mono" style={{ color: rm.color }}>
                            {value >= 80 ? '▲ THRIVING' : value >= 60 ? '▲ RECOVERING' : value >= 40 ? '→ MODERATE' : '▼ CRITICAL'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </div>
        </section>

        {/* ── OCEAN CLEANUP SIMULATOR ── */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div>
              <Badge variant="secondary" className="mb-2 sm:mb-3 text-xs"><Waves className="w-3 h-3" /> Marine Ecosystem</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-balance mb-3 sm:mb-4 text-white">
                Ocean Plastic &amp; <span className="gradient-text">Ecosystem Health</span>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-5 sm:mb-6 text-xs sm:text-sm">
                Over 11 million tonnes of waste enter ocean gyres annually. Adjust cleanup deployment vectors to watch marine life recover and plastic density drop in real time.
              </p>
              <div className="space-y-2.5 sm:space-y-3">
                {PLASTIC_DATA.map((p, i) => {
                  const currentLevel = Math.max(0, p.level - Math.round(plasticReduction * 0.65));
                  return (
                    <motion.div key={p.region} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="font-medium text-white">{p.region}</span>
                        <span className="font-mono font-bold" style={{ color: currentLevel > 60 ? '#FF4D6D' : currentLevel > 30 ? '#FFB830' : '#00E5A8' }}>
                          {currentLevel}% Density
                        </span>
                      </div>
                      <div className="h-2 sm:h-2.5 rounded-full bg-[var(--glass-border)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: currentLevel > 60 ? '#FF4D6D' : currentLevel > 30 ? '#FFB830' : '#00E5A8' }}
                          animate={{ width: `${currentLevel}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <GlassCard className="p-4 sm:p-6 glow-secondary border-primary/20 relative overflow-hidden" style={{ background: 'linear-gradient(to b, rgba(10,22,40,1), rgba(4,13,26,1))' }}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-secondary animate-pulse flex-shrink-0" />
                  <h3 className="font-bold font-display text-sm sm:text-base text-white">Ocean Cleanup Simulator</h3>
                </div>
                <Badge variant={plasticReduction > 60 ? 'success' : plasticReduction > 30 ? 'warning' : 'danger'} className="text-[10px] sm:text-xs">
                  {plasticReduction > 60 ? 'RECOVERING' : plasticReduction > 30 ? 'MODERATE' : 'CRITICAL'}
                </Badge>
              </div>
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 border border-sky-500/20 shadow-inner bg-slate-950">
                <OceanHealthCanvas plasticReduction={plasticReduction} activeDroneCount={activeDroneCount} />
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 bg-black/75 backdrop-blur-md rounded-xl px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono text-white/90 border border-white/10 z-10 max-w-[95%] truncate">
                  Plastic: <strong className="text-secondary">{Math.round(88 - plasticReduction * 0.75)} items/km²</strong> | Recovery: <strong className="text-primary">{Math.round(20 + plasticReduction * 0.75)}%</strong>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-[var(--text-muted)]">Cleanup Deployment Vector</span>
                  <span className="font-bold text-secondary">{plasticReduction}% Active</span>
                </div>
                <Slider min={0} max={100} value={plasticReduction} onChange={(v) => setPlasticReduction(v)} accentColor="#38BDF8" aria-label="Ocean Cleanup Intensity" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {[
                  { label: 'Baseline', val: 0,   drones: 1 },
                  { label: '+Drones',  val: 35,  drones: 3 },
                  { label: '+Skimmers',val: 70,  drones: 5 },
                  { label: 'Maximum',  val: 100, drones: 6 },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={() => { setPlasticReduction(b.val); setActiveDroneCount(b.drones); }}
                    className={[
                      'inline-flex items-center justify-center min-h-[32px] rounded-xl text-[11px] font-semibold transition-all border leading-none',
                      plasticReduction === b.val
                        ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-glow-sm'
                        : 'glass text-[var(--text-muted)] border-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="glass rounded-xl p-2 sm:p-2.5 border border-white/5">
                  <div className="font-bold text-secondary font-mono text-xs sm:text-sm">{(11 - (plasticReduction * 0.085)).toFixed(1)}M</div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5">tonnes/yr</div>
                </div>
                <div className="glass rounded-xl p-2 sm:p-2.5 border border-white/5">
                  <div className="font-bold text-primary font-mono text-xs sm:text-sm">{Math.round(25 + plasticReduction * 0.68)}%</div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5">Recovery</div>
                </div>
                <div className="glass rounded-xl p-2 sm:p-2.5 border border-white/5">
                  <div className="font-bold text-accent font-mono text-xs sm:text-sm">{(plasticReduction * 18.5).toFixed(0)}k</div>
                  <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5">Saved</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ── ANIMATED CLIMATE PROJECTION GRAPH ── */}
        <section>
          <GlassCard className="p-4 sm:p-6 md:p-8 relative overflow-hidden border-primary/20" style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.95) 0%, rgba(15,36,66,0.85) 50%, rgba(10,22,40,0.95) 100%)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-white/8">
              <div>
                <Badge variant="primary" className="mb-2 text-xs"><BarChart3 className="w-3 h-3" /> Predictive Modeling</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-white">Centennial Climate Projection (2026 – 2100)</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Select any year to animate environmental feedback metrics and project atmospheric carbon pathways.
                </p>
              </div>
              {/* Year selector tabs */}
              <div className="flex items-center gap-1.5 glass rounded-2xl p-1.5 border border-white/8 overflow-x-auto max-w-full flex-shrink-0 no-scrollbar">
                {TIMELINE_YEARS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setActiveYear(yr)}
                    className={[
                      'inline-flex items-center justify-center min-h-[30px] px-2.5 sm:px-3 rounded-xl text-xs font-mono font-bold transition-all leading-none whitespace-nowrap',
                      activeYear === yr
                        ? 'bg-gradient-to-r from-primary to-secondary text-ink shadow-glow-sm scale-105'
                        : 'text-[var(--text-muted)] hover:text-white',
                    ].join(' ')}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
              {/* Graph */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-danger flex-shrink-0" />
                    <span className="truncate">Atmospheric CO₂ Concentration</span>
                  </span>
                  <motion.span
                    key={`co2-${activeYear}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-danger font-bold flex-shrink-0"
                  >
                    {currentProjection.carbonPpm} PPM ({activeYear})
                  </motion.span>
                </div>

                <div className="relative h-56 sm:h-64 w-full rounded-2xl glass p-3 sm:p-5 border border-white/8">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[30, 75, 120].map((y) => (
                      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    ))}
                    {TIMELINE_YEARS.map((_, i) => (
                      <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="180" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                    ))}

                    <defs>
                      <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#FF4D6D" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#FF4D6D" stopOpacity="0.0"  />
                      </linearGradient>
                      <filter id="glow-dot">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Animated area fill */}
                    <motion.path
                      key={`area-${activeYear}`}
                      d={graphAreaPath}
                      fill="url(#carbonGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7 }}
                    />

                    {/* Animated line — draws left to right */}
                    <motion.path
                      key={`line-${activeYear}`}
                      d={graphLinePath}
                      fill="none"
                      stroke="#FF4D6D"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0.5 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />

                    {/* Data point nodes */}
                    {TIMELINE_YEARS.map((yr) => {
                      const pt = GRAPH_POINTS[yr];
                      const isCurrent = yr === activeYear;
                      const proj = TIMELINE_DATA[yr];
                      return (
                        <g key={yr} onClick={() => setActiveYear(yr)} className="cursor-pointer group">
                          {/* Pulse ring on active */}
                          {isCurrent && (
                            <motion.circle
                              cx={pt.x} cy={pt.y} r={16}
                              fill="none" stroke="#00E5A8" strokeWidth="1.5"
                              animate={{ scale: [0.7, 1.7, 0.7], opacity: [0.8, 0.05, 0.8] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                          {/* Glow on active */}
                          {isCurrent && (
                            <circle cx={pt.x} cy={pt.y} r={10} fill="#00E5A8" opacity={0.15} filter="url(#glow-dot)" />
                          )}
                          {/* Node */}
                          <motion.circle
                            cx={pt.x} cy={pt.y}
                            r={isCurrent ? 7 : 4.5}
                            fill={isCurrent ? '#00E5A8' : '#FF4D6D'}
                            stroke="#040d1a"
                            strokeWidth="2.5"
                            key={`dot-${yr}-${activeYear}`}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: TIMELINE_YEARS.indexOf(yr) * 0.06 }}
                          />
                          {/* Year label */}
                          <text
                            x={pt.x} y={175}
                            fill={isCurrent ? '#00E5A8' : '#7A9CC4'}
                            fontSize="10" textAnchor="middle"
                            fontFamily="monospace"
                            fontWeight={isCurrent ? 'bold' : 'normal'}
                          >
                            {yr}
                          </text>
                          {/* Hover tooltip */}
                          <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                            <rect
                              x={Math.max(0, Math.min(380, pt.x - 55))}
                              y={Math.max(5, pt.y - 52)}
                              width="110" height="40" rx="8"
                              fill="rgba(4,13,26,0.92)"
                              stroke="rgba(56,189,248,0.35)"
                              strokeWidth="1"
                            />
                            <text
                              x={Math.max(0, Math.min(380, pt.x - 55)) + 55}
                              y={Math.max(5, pt.y - 52) + 15}
                              fill="#38BDF8" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace"
                            >
                              {yr}: {proj.carbonPpm} PPM
                            </text>
                            <text
                              x={Math.max(0, Math.min(380, pt.x - 55)) + 55}
                              y={Math.max(5, pt.y - 52) + 30}
                              fill="#F0F6FF" fontSize="8.5" textAnchor="middle" fontFamily="monospace"
                            >
                              +{proj.tempAnomaly}°C | Sea +{proj.seaLevelCm}cm
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right panel — animated metrics */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-primary font-bold flex items-center justify-between">
                  <span>{activeYear} Indicators</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">LIVE</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    { label: 'Temp Anomaly',  val: `+${currentProjection.tempAnomaly}°C`, color: '#FFB830' },
                    { label: 'Sea Level',     val: `+${currentProjection.seaLevelCm}cm`,   color: '#38BDF8' },
                    { label: 'Forest Cover',  val: `${currentProjection.forestCoverage}%`, color: '#00E5A8' },
                    { label: 'Biodiversity',  val: `${currentProjection.biodiversityPct}%`,color: '#A78BFA' },
                  ].map((item, ii) => (
                    <motion.div
                      key={`${item.label}-${activeYear}`}
                      initial={{ opacity: 0, scale: 0.90 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: ii * 0.07 }}
                      className="glass rounded-xl p-2.5 sm:p-3 border border-white/5"
                    >
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-mono leading-none truncate">{item.label}</div>
                      <div className="text-base sm:text-lg font-bold font-mono mt-1 leading-none" style={{ color: item.color }}>{item.val}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  key={`status-${activeYear}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-3 border border-danger/18 bg-danger/5 text-xs"
                >
                  <span className="font-bold text-danger font-mono">STATUS {activeYear}: </span>
                  <span className="text-white">
                    {currentProjection.tempAnomaly > 2.5
                      ? 'Severe catastrophic tipping points breached.'
                      : currentProjection.tempAnomaly > 1.5
                      ? 'Critical warming threshold exceeded.'
                      : 'Moderate baseline climate stress.'}
                  </span>
                </motion.div>

                {/* Renewable & Water quick metrics */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">Renewable Energy</span>
                    <span className="font-mono font-bold text-primary">{currentProjection.renewablePct}%</span>
                  </div>
                  <ProgressBar value={currentProjection.renewablePct} color="#00E5A8" height={5} />
                  <div className="flex justify-between text-xs mb-1 mt-2">
                    <span className="text-[var(--text-muted)]">Water Quality</span>
                    <span className="font-mono font-bold text-secondary">{currentProjection.waterQuality}%</span>
                  </div>
                  <ProgressBar value={currentProjection.waterQuality} color="#38BDF8" height={5} />
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── DEFORESTATION MONITOR ── */}
        <section>
          <GlassCard className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-transparent pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-2 sm:mb-3 text-xs"><Trees className="w-3 h-3" /> Deforestation Monitor</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-2 sm:mb-3 text-white">Global Forest Loss Tracker</h2>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4 sm:mb-6">
                  Real-time deforestation monitoring across five critical forest ecosystems.
                </p>
                <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden shadow-inner">
                  <div style={{ background: 'linear-gradient(to right, #166534, #14532d, #78350f, #92400e)' }} className="absolute inset-0" />
                  <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div key={i} className="flex flex-col items-center gap-0.5"
                        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                        style={{ originY: 1 }} transition={{ delay: i * 0.05 }}>
                        <div className="w-2 rounded-t-sm" style={{ height: `${30 + Math.sin(i) * 20}px`, background: i > 8 ? '#78350f' : '#166534' }} />
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-white/60">Forest coverage — historical</div>
                </div>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {DEFORESTATION_HOTSPOTS.map((h, i) => (
                  <motion.div key={h.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: h.color }} />
                    <span className="text-xs font-medium text-white flex-1 truncate">{h.name}</span>
                    <span className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] flex-shrink-0">{(h.loss / 1000000).toFixed(1)}M ha/yr</span>
                    <div className="w-20 sm:w-28 flex-shrink-0"><ProgressBar value={h.pct} color={h.color} height={6} /></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── FLOOD RISK & HEATWAVE ── */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Waves className="w-5 h-5 text-danger flex-shrink-0" />
                <h3 className="font-bold font-display text-base sm:text-lg text-white">Flood Risk Prediction</h3>
                <Badge variant="danger" className="ml-auto text-[10px] sm:text-xs font-mono">High Alert</Badge>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {FLOOD_ZONES.map((z, i) => (
                  <motion.div key={z.city} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-2 sm:gap-3">
                    <span className="font-medium text-xs w-16 sm:w-20 text-white truncate">{z.city}</span>
                    <div className="flex-1 min-w-[60px]"><ProgressBar value={z.pct} color={z.color} height={8} /></div>
                    <span className="text-xs font-mono w-7 sm:w-8 text-right flex-shrink-0" style={{ color: z.color }}>{z.pct}%</span>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full w-14 sm:w-16 text-center flex-shrink-0 truncate"
                      style={{ background: `${z.color}20`, color: z.color }}>{z.risk}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ThermometerSun className="w-5 h-5 text-warning flex-shrink-0" />
                <h3 className="font-bold font-display text-base sm:text-lg text-white">Heatwave Analysis</h3>
                <Badge variant="warning" className="ml-auto text-[10px] sm:text-xs font-mono">2026 Data</Badge>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-3 sm:mb-4">
                {Array.from({ length: 35 }, (_, i) => {
                  const temp = 28 + Math.sin(i * 0.8) * 12 + Math.cos(i * 1.2) * 8;
                  const intensity = (temp - 20) / 30;
                  return (
                    <motion.div key={i} className="h-7 sm:h-8 rounded"
                      style={{ background: `rgba(${Math.round(239 * intensity)}, ${Math.round(68 + 100 * (1 - intensity))}, ${Math.round(68 * (1 - intensity))}, ${0.4 + intensity * 0.6})` }}
                      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.015 }}
                      title={`${Math.round(temp)}°C`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-3 sm:mb-4 font-mono text-[10px] sm:text-xs">
                <span>Cool (20°C)</span><span>Extreme (50°C+)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Days >40°C', value: '47',  color: '#FF4D6D' },
                  { label: 'Heat Deaths',value: '~18K', color: '#FFB830' },
                  { label: 'Crop Loss',  value: '23%', color: '#F97316' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-2 sm:p-3">
                    <div className="font-bold text-base sm:text-lg" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5 font-mono truncate">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ── CARBON REDUCTION PLANNER ── */}
        <section>
          <GlassCard className="p-4 sm:p-6 md:p-8 glow-primary">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-2 sm:mb-3 text-xs"><BarChart3 className="w-3 h-3" /> Carbon Planner</Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display mb-3 sm:mb-4 text-white">Carbon Reduction Planner</h2>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4 sm:mb-5">
                  Simulate renewable energy expansion and see projected CO₂ pathways. Each percentage of clean energy deployed reduces atmospheric carbon.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-[var(--text-muted)]">Renewable Deployment</span>
                    <span className="font-bold text-primary">{renewablePlan}%</span>
                  </div>
                  <Slider min={10} max={100} value={renewablePlan} onChange={(v) => setRenewablePlan(v)} accentColor="#00E5A8" aria-label="Renewable Deployment" />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  {[
                    { label: 'CO₂ in 2030', value: `${Math.round(421 - renewablePlan * 1.8)} ppm`, color: renewablePlan > 50 ? '#00E5A8' : '#FFB830' },
                    { label: 'CO₂ in 2050', value: `${Math.round(421 - renewablePlan * 3.2)} ppm`, color: renewablePlan > 70 ? '#00E5A8' : '#FF4D6D' },
                    { label: 'Temp Change', value: `+${(2.1 - renewablePlan * 0.015).toFixed(1)}°C`, color: renewablePlan > 60 ? '#FFB830' : '#FF4D6D' },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-2.5 sm:p-3">
                      <div className="font-bold text-sm sm:text-base font-orbitron" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5 font-mono truncate">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono">Energy Source Comparison</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {ENERGY_PLAN.map((e, i) => {
                    const projected = e.source === 'Fossil'
                      ? Math.max(0, e.current - renewablePlan * 0.5)
                      : Math.min(e.potential, e.current + (e.potential - e.current) * (renewablePlan / 100));
                    return (
                      <motion.div key={e.source} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="text-sm sm:text-base">{e.emoji}</span>
                          <span className="font-medium text-white flex-1 truncate">{e.source}</span>
                          <span className="font-mono font-bold" style={{ color: e.color }}>{Math.round(projected)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--glass-border)] overflow-hidden">
                          <motion.div className="h-full rounded-full" style={{ background: e.color }}
                            animate={{ width: `${projected}%` }} transition={{ duration: 0.8 }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

      </div>

      <Footer />
    </div>
  );
}
