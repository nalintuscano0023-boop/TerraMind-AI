import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Cloud, Bird,
  Droplets, Trees, Wind, TrendingUp,
  BarChart3, Activity, Waves, ThermometerSun, Globe2
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar, Slider, OceanHealthCanvas } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';

/* =========================================================
   DATA & TIMELINE PROJECTIONS
   ========================================================= */
const RISK_METRICS = [
  { label: 'Forest Risk',    value: 72, icon: Trees,          color: '#00E5A8', desc: 'Deforestation at 4.7M ha/yr',   trend: 'up'   },
  { label: 'Ocean Risk',     value: 65, icon: Waves,          color: '#38BDF8', desc: 'Acidification pH 8.08',         trend: 'up'   },
  { label: 'Air Quality',    value: 58, icon: Wind,           color: '#F59E0B', desc: 'PM2.5 above WHO limits',        trend: 'up'   },
  { label: 'Climate Risk',   value: 79, icon: ThermometerSun, color: '#EF4444', desc: '+1.4°C above baseline',        trend: 'up'   },
  { label: 'Biodiversity',   value: 61, icon: Bird,           color: '#7C3AED', desc: '1M species at extinction risk', trend: 'up'   },
  { label: 'Water Security', value: 43, icon: Droplets,       color: '#06B6D4', desc: '2B people lack clean access',  trend: 'same' },
];

const TIMELINE_YEARS = [2026, 2030, 2040, 2050, 2075, 2100] as const;
type TimelineYear = typeof TIMELINE_YEARS[number];

interface YearProjection {
  year: TimelineYear;
  carbonPpm: number;
  tempAnomaly: number;
  seaLevelCm: number;
  forestCoverage: number;
  waterQuality: number;
  airQuality: number;
  renewablePct: number;
  biodiversityPct: number;
}

const TIMELINE_DATA: Record<TimelineYear, YearProjection> = {
  2026: { year: 2026, carbonPpm: 421, tempAnomaly: 1.3, seaLevelCm: 12, forestCoverage: 52, waterQuality: 61, airQuality: 48, renewablePct: 28, biodiversityPct: 44 },
  2030: { year: 2030, carbonPpm: 432, tempAnomaly: 1.5, seaLevelCm: 18, forestCoverage: 48, waterQuality: 56, airQuality: 42, renewablePct: 38, biodiversityPct: 39 },
  2040: { year: 2040, carbonPpm: 450, tempAnomaly: 1.9, seaLevelCm: 32, forestCoverage: 41, waterQuality: 48, airQuality: 35, renewablePct: 52, biodiversityPct: 31 },
  2050: { year: 2050, carbonPpm: 468, tempAnomaly: 2.4, seaLevelCm: 48, forestCoverage: 35, waterQuality: 40, airQuality: 28, renewablePct: 68, biodiversityPct: 24 },
  2075: { year: 2075, carbonPpm: 505, tempAnomaly: 3.1, seaLevelCm: 85, forestCoverage: 26, waterQuality: 31, airQuality: 22, renewablePct: 82, biodiversityPct: 16 },
  2100: { year: 2100, carbonPpm: 540, tempAnomaly: 3.8, seaLevelCm: 124, forestCoverage: 18, waterQuality: 22, airQuality: 15, renewablePct: 95, biodiversityPct: 9 },
};

const PLASTIC_DATA = [
  { region: 'Pacific Ocean', level: 88, color: '#EF4444' },
  { region: 'Atlantic',      level: 62, color: '#F59E0B' },
  { region: 'Indian Ocean',  level: 55, color: '#F59E0B' },
  { region: 'Arctic',        level: 38, color: '#38BDF8' },
  { region: 'Mediterranean', level: 74, color: '#EF4444' },
];

const DEFORESTATION_HOTSPOTS = [
  { name: 'Amazon Basin',   loss: 4700000, pct: 92, color: '#EF4444' },
  { name: 'Congo Basin',    loss: 1200000, pct: 67, color: '#F59E0B' },
  { name: 'SE Asia',        loss: 980000,  pct: 58, color: '#F59E0B' },
  { name: 'Boreal Forest',  loss: 450000,  pct: 38, color: '#38BDF8' },
  { name: 'Australia',      loss: 310000,  pct: 28, color: '#94A3B8' },
];

const BEFORE_AFTER = [
  { label: 'Forest', icon: Trees,    before: 40, after: 82, color: '#00E5A8' },
  { label: 'Ocean',  icon: Droplets, before: 45, after: 88, color: '#38BDF8' },
  { label: 'Air',    icon: Wind,     before: 35, after: 78, color: '#F59E0B' },
  { label: 'Wildlife',icon: Bird,    before: 30, after: 75, color: '#7C3AED' },
  { label: 'Cities', icon: Globe2,   before: 25, after: 85, color: '#00E5A8' },
  { label: 'Carbon', icon: Cloud,    before: 80, after: 20, color: '#EF4444' },
];

const FLOOD_ZONES = [
  { city: 'Miami',    risk: 'Critical', pct: 89, color: '#EF4444' },
  { city: 'Jakarta',  risk: 'Critical', pct: 94, color: '#EF4444' },
  { city: 'Mumbai',   risk: 'High',     pct: 73, color: '#F59E0B' },
  { city: 'Shanghai', risk: 'High',     pct: 68, color: '#F59E0B' },
  { city: 'London',   risk: 'Medium',   pct: 41, color: '#38BDF8' },
  { city: 'Tokyo',    risk: 'Medium',   pct: 45, color: '#38BDF8' },
];

const ENERGY_PLAN = [
  { source: 'Solar',   current: 15, potential: 55, emoji: '☀️', color: '#F59E0B' },
  { source: 'Wind',    current: 12, potential: 38, emoji: '💨', color: '#38BDF8' },
  { source: 'Hydro',   current: 16, potential: 22, emoji: '💧', color: '#06B6D4' },
  { source: 'Nuclear', current:  4, potential: 15, emoji: '⚡', color: '#7C3AED' },
  { source: 'Fossil',  current: 53, potential:  0, emoji: '🏭', color: '#EF4444' },
];

export default function Insights() {
  const [sliderPos, setSliderPos]               = useState(50);
  const [plasticReduction, setPlasticReduction] = useState(25);
  const [activeYear, setActiveYear]             = useState<TimelineYear>(2026);
  const [renewablePlan, setRenewablePlan]       = useState(50);
  const [activeDroneCount, setActiveDroneCount] = useState(4);
  const compareRef = useRef<HTMLDivElement>(null);

  const currentProjection = useMemo(() => TIMELINE_DATA[activeYear], [activeYear]);

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">

        {/* ===== PROBLEM STATEMENT ===== */}
        <section>
          <SectionTitle
            eyebrow="Global Environmental Crisis"
            title="Earth's systems are failing — and decisions are blind"
            description="Climate change, ocean degradation, and biodiversity loss are accelerating. TerraMind translates complex environmental science into real-time decision intelligence."
          />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, title: '75% of ecosystems degraded',     desc: 'UN reports find terrestrial ecosystems in rapid decline. Urgent intervention required.', color: '#EF4444' },
              { icon: Cloud,         title: 'CO₂ at 421+ ppm',                desc: 'Highest atmospheric concentration in human history, rising annually. Dangerous tipping points.', color: '#F59E0B' },
              { icon: Bird,          title: '1M+ species at extinction risk', desc: 'IPBES warns of unprecedented extinction rates — 6th mass extinction currently underway.',        color: '#7C3AED' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-6 h-full" style={{ borderLeft: `3px solid ${item.color}50` }}>
                    <Icon className="w-8 h-8 mb-3" style={{ color: item.color }} />
                    <h3 className="font-bold font-display mb-1.5 text-base text-white">{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== GLOBAL ENVIRONMENTAL RISK DASHBOARD ===== */}
        <section>
          <SectionTitle
            eyebrow="Risk Dashboard"
            title="Global Environmental Risk Monitor"
            description="Real-time risk indices across six planetary systems — continuously updated from satellite telemetry."
          />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RISK_METRICS.map((m, i) => {
              const Icon = m.icon;
              const riskLabel = m.value > 70 ? 'CRITICAL' : m.value > 50 ? 'HIGH' : 'MODERATE';
              const riskBadge = m.value > 70 ? 'danger' as const : m.value > 50 ? 'warning' as const : 'default' as const;
              return (
                <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}18` }}>
                        <Icon className="w-5 h-5" style={{ color: m.color }} />
                      </div>
                      <Badge variant={riskBadge}>
                        {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                        {riskLabel}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold font-orbitron mb-1" style={{ color: m.color }}>{m.value}%</div>
                    <div className="font-semibold font-display text-sm mb-1 text-white">{m.label}</div>
                    <div className="text-xs text-[var(--text-muted)] mb-3">{m.desc}</div>
                    <div className="h-2 rounded-full bg-[var(--glass-border)] overflow-hidden">
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

        {/* ===== REQUIREMENT 10 & 6: INTERACTIVE OCEAN CLEANUP SIMULATOR & ECOSYSTEM ===== */}
        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Plastic Tracker */}
            <div>
              <Badge variant="secondary" className="mb-3"><Waves className="w-3 h-3" /> Marine Ecosystem</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-balance mb-4 text-white">
                Ocean Plastic & <span className="gradient-text">Ecosystem Health</span>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6 text-sm">
                Over 11 million tonnes of waste enter ocean gyres annually. Adjust cleanup deployment vectors to watch marine life recover and plastic density drop in real time.
              </p>
              <div className="space-y-3">
                {PLASTIC_DATA.map((p, i) => {
                  const currentLevel = Math.max(0, p.level - Math.round(plasticReduction * 0.65));
                  return (
                    <motion.div key={p.region} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-white">{p.region}</span>
                        <span className="font-mono font-bold" style={{ color: currentLevel > 60 ? '#EF4444' : currentLevel > 30 ? '#F59E0B' : '#00E5A8' }}>
                          {currentLevel}% Density
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[var(--glass-border)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: currentLevel > 60 ? '#EF4444' : currentLevel > 30 ? '#F59E0B' : '#00E5A8' }}
                          animate={{ width: `${currentLevel}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Interactive Ocean Cleanup Simulator Canvas Viewport */}
            <GlassCard className="p-6 glow-secondary border-primary/20 relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#040d1a]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-secondary animate-pulse" />
                  <h3 className="font-bold font-display text-base text-white">Interactive Ocean Cleanup Simulator</h3>
                </div>
                <Badge variant={plasticReduction > 60 ? 'success' : plasticReduction > 30 ? 'warning' : 'danger'}>
                  {plasticReduction > 60 ? 'THRIFTY ECOSYSTEM' : plasticReduction > 30 ? 'MODERATE DEBRIS' : 'CRITICAL POLLUTION'}
                </Badge>
              </div>

              {/* Ocean Animated Canvas Container */}
              <div className="relative h-56 rounded-2xl overflow-hidden mb-5 border border-sky-500/20 shadow-inner bg-slate-950">
                <OceanHealthCanvas plasticReduction={plasticReduction} activeDroneCount={activeDroneCount} />

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md rounded-xl px-3 py-1 text-[11px] font-mono text-white/90 border border-white/10 z-10">
                  Plastic: <strong className="text-secondary">{Math.round(88 - plasticReduction * 0.75)} items/km²</strong> | Recovery: <strong className="text-primary">{Math.round(20 + plasticReduction * 0.75)}%</strong>
                </div>
              </div>

              {/* Slider Control */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-[var(--text-muted)]">Cleanup Deployment Vector</span>
                  <span className="font-bold text-secondary">{plasticReduction}% Active</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={plasticReduction}
                  onChange={(val) => setPlasticReduction(val)}
                  accentColor="#38BDF8"
                  aria-label="Ocean Cleanup Intensity"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Baseline', val: 0, drones: 1 },
                  { label: '+Drones', val: 35, drones: 3 },
                  { label: '+Skimmers', val: 70, drones: 5 },
                  { label: 'Maximum', val: 100, drones: 6 },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={() => {
                      setPlasticReduction(b.val);
                      setActiveDroneCount(b.drones);
                    }}
                    className={`py-1.5 rounded-xl text-[11px] font-semibold transition-all border ${
                      plasticReduction === b.val
                        ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-glow'
                        : 'glass text-[var(--text-muted)] border-white/5 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Live Statistics Grid — Computed Dynamically */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="glass rounded-xl p-2.5 border border-white/5">
                  <div className="font-bold text-secondary font-mono text-sm">{(11 - (plasticReduction * 0.085)).toFixed(1)}M</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">tonnes/yr waste</div>
                </div>
                <div className="glass rounded-xl p-2.5 border border-white/5">
                  <div className="font-bold text-primary font-mono text-sm">{Math.round(25 + plasticReduction * 0.68)}%</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Marine Recovery</div>
                </div>
                <div className="glass rounded-xl p-2.5 border border-white/5">
                  <div className="font-bold text-accent font-mono text-sm">{(plasticReduction * 18.5).toFixed(0)}k</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Species Saved</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ===== REQUIREMENT 7: FUTURE TIMELINE & ANIMATED CARBON GRAPH ===== */}
        <section>
          <GlassCard className="p-8 relative overflow-hidden border-primary/20 bg-gradient-to-br from-[#0a1628] via-[#0f2442] to-[#0a1628]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <Badge variant="primary" className="mb-2"><BarChart3 className="w-3 h-3" /> Predictive Modeling</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Centennial Climate Projection (2026 – 2100)</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Select any year to animate environmental feedback metrics and project atmospheric carbon pathways.
                </p>
              </div>

              {/* Year Selector Tabs */}
              <div className="flex items-center gap-1.5 glass rounded-2xl p-1.5 border border-white/10 overflow-x-auto max-w-full">
                {TIMELINE_YEARS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setActiveYear(yr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      activeYear === yr
                        ? 'bg-gradient-to-r from-primary to-secondary text-ink shadow-glow scale-105'
                        : 'text-[var(--text-muted)] hover:text-white'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left 2 Cols: Animated SVG Carbon Graph */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-danger" /> Atmospheric CO₂ Concentration Pathway
                  </span>
                  <span className="text-danger font-bold">{currentProjection.carbonPpm} PPM ({activeYear})</span>
                </div>

                {/* Animated Line Chart Container */}
                <div className="relative h-52 w-full rounded-2xl glass p-4 border border-white/10 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                    {/* Dynamic Path for CO2 */}
                    <defs>
                      <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <path
                      d="M 0 150 L 100 135 L 200 110 L 300 85 L 400 40 L 500 10 L 500 180 L 0 180 Z"
                      fill="url(#carbonGrad)"
                    />

                    {/* Trend Line */}
                    <motion.path
                      d="M 0 150 L 100 135 L 200 110 L 300 85 L 400 40 L 500 10"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Active Year Highlight Node */}
                    {TIMELINE_YEARS.map((yr, idx) => {
                      const xPos = idx * 100;
                      const yPos = 150 - (idx * 28);
                      const isCurrent = yr === activeYear;

                      return (
                        <g key={yr} onClick={() => setActiveYear(yr)} className="cursor-pointer">
                          <motion.circle
                            cx={xPos}
                            cy={yPos}
                            r={isCurrent ? 8 : 4}
                            fill={isCurrent ? "#00E5A8" : "#EF4444"}
                            stroke="#040d1a"
                            strokeWidth="2"
                            animate={{ scale: isCurrent ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                          />
                          <text x={xPos} y={175} fill={isCurrent ? "#00E5A8" : "#7A9CC4"} fontSize="10" textAnchor="middle" fontFamily="monospace">
                            {yr}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right Col: Dynamic Year Indicator Metrics */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  {activeYear} Environmental Indicators
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Global Temp Anomaly</div>
                    <div className="text-lg font-bold font-mono text-warning mt-0.5">+{currentProjection.tempAnomaly}°C</div>
                  </div>

                  <div className="glass rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Sea Level Rise</div>
                    <div className="text-lg font-bold font-mono text-secondary mt-0.5">+{currentProjection.seaLevelCm} cm</div>
                  </div>

                  <div className="glass rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Forest Coverage</div>
                    <div className="text-lg font-bold font-mono text-primary mt-0.5">{currentProjection.forestCoverage}%</div>
                  </div>

                  <div className="glass rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Biodiversity Index</div>
                    <div className="text-lg font-bold font-mono text-accent mt-0.5">{currentProjection.biodiversityPct}%</div>
                  </div>
                </div>

                <div className="glass rounded-xl p-3 border border-danger/20 bg-danger/5 text-xs">
                  <span className="font-bold text-danger font-mono">STATUS ({activeYear}): </span>
                  <span className="text-white">
                    {currentProjection.tempAnomaly > 2.5
                      ? 'Severe catastrophic tipping points breached.'
                      : currentProjection.tempAnomaly > 1.5
                      ? 'Critical warming threshold exceeded. Accelerated ice sheet loss.'
                      : 'Moderate baseline climate stress.'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ===== DEFORESTATION MONITOR ===== */}
        <section>
          <GlassCard className="p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-3"><Trees className="w-3 h-3" /> Deforestation Monitor</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-3 text-white">Global Forest Loss Tracker</h2>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-6">
                  Real-time deforestation monitoring across five critical forest ecosystems. Each pixel lost represents irreversible biomass loss.
                </p>
                <div className="relative h-32 rounded-xl overflow-hidden shadow-inner">
                  <div style={{ background: 'linear-gradient(to right, #166534, #14532D, #78350F, #92400E)' }} className="absolute inset-0" />
                  <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div key={i} className="flex flex-col items-center gap-0.5"
                        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                        style={{ originY: 1 }} transition={{ delay: i * 0.05 }}>
                        <div className="w-2 rounded-t-sm"
                          style={{ height: `${30 + Math.sin(i) * 20}px`, background: i > 8 ? '#78350F' : '#166534' }} />
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-white/70">
                    Forest coverage — historical trend
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {DEFORESTATION_HOTSPOTS.map((h, i) => (
                  <motion.div key={h.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: h.color }} />
                    <span className="text-xs font-medium text-white flex-1">{h.name}</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {(h.loss / 1000000).toFixed(1)}M ha/yr
                    </span>
                    <div className="w-28">
                      <ProgressBar value={h.pct} color={h.color} height={6} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ===== IMPACT COMPARISON ===== */}
        <section>
          <SectionTitle
            center
            eyebrow="Impact Comparison"
            title="Before vs After: The power of decisions"
            description="Drag the slider to see how sustainable policies transform Earth's systems."
          />
          <div ref={compareRef} className="mt-10 max-w-3xl mx-auto">
            <GlassCard className="p-6 mb-6">
              <div className="relative h-3 rounded-full bg-[var(--glass-border)] cursor-pointer" onClick={handleSlider}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${sliderPos}%`, background: 'linear-gradient(90deg, #EF4444, #F59E0B, #00E5A8)' }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary shadow-glow border-2 border-[var(--bg)] cursor-grab active:cursor-grabbing"
                  style={{ left: `calc(${sliderPos}% - 14px)` }}
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium font-mono">
                <span className="text-danger">🌑 Degraded Earth</span>
                <span className="text-primary">🌍 Restored Earth</span>
              </div>
            </GlassCard>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BEFORE_AFTER.map((item, i) => {
                const Icon = item.icon;
                const interpolated = item.label === 'Carbon'
                  ? item.before - (item.before - item.after) * (sliderPos / 100)
                  : item.before + (item.after - item.before) * (sliderPos / 100);
                return (
                  <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <motion.div whileHover={{ scale: 1.04, y: -3 }} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                        <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                      </div>
                      <motion.div className="text-2xl font-bold font-orbitron mb-2" style={{ color: item.color }}
                        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}>
                        {Math.round(interpolated)}{item.label === 'Carbon' ? ' ppm' : '%'}
                      </motion.div>
                      <ProgressBar value={interpolated} color={item.color} height={7} />
                      <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)] font-mono">
                        <span>Was: {item.before}</span><span>Goal: {item.after}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== FLOOD RISK & HEATWAVE ANALYSIS ===== */}
        <section>
          <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Waves className="w-5 h-5 text-danger" />
                <h3 className="font-bold font-display text-lg text-white">Flood Risk Prediction</h3>
                <Badge variant="danger" className="ml-auto">High Alert</Badge>
              </div>
              <div className="space-y-3">
                {FLOOD_ZONES.map((z, i) => (
                  <motion.div key={z.city} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3">
                    <span className="font-medium text-xs w-20 text-white">{z.city}</span>
                    <div className="flex-1">
                      <ProgressBar value={z.pct} color={z.color} height={8} />
                    </div>
                    <span className="text-xs font-mono w-8 text-right" style={{ color: z.color }}>{z.pct}%</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-16 text-center"
                      style={{ background: `${z.color}20`, color: z.color }}>
                      {z.risk}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThermometerSun className="w-5 h-5 text-warning" />
                <h3 className="font-bold font-display text-lg text-white">Heatwave Analysis</h3>
                <Badge variant="warning" className="ml-auto">2026 Data</Badge>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {Array.from({ length: 35 }, (_, i) => {
                  const temp = 28 + Math.sin(i * 0.8) * 12 + Math.cos(i * 1.2) * 8;
                  const intensity = (temp - 20) / 30;
                  return (
                    <motion.div key={i}
                      className="h-8 rounded"
                      style={{ background: `rgba(${Math.round(239 * intensity)}, ${Math.round(68 + 100 * (1 - intensity))}, ${Math.round(68 * (1 - intensity))}, ${0.4 + intensity * 0.6})` }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      title={`${Math.round(temp)}°C`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-4 font-mono">
                <span>Cool (20°C)</span><span>Extreme (50°C+)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Days >40°C', value: '47', color: '#EF4444' },
                  { label: 'Heat Deaths', value: '~18K', color: '#F59E0B' },
                  { label: 'Crop Loss', value: '23%', color: '#F97316' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-3">
                    <div className="font-bold text-lg" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ===== RENEWABLE ENERGY EXPANSION PLANNER ===== */}
        <section>
          <GlassCard className="p-8 glow-primary">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-3"><BarChart3 className="w-3 h-3" /> Carbon Planner</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4 text-white">Carbon Reduction Planner</h2>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-5">
                  Simulate renewable energy expansion and see projected CO₂ pathways.
                  Each percentage of clean energy deployed reduces atmospheric carbon.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-[var(--text-muted)]">Renewable Deployment</span>
                    <span className="font-bold text-primary">{renewablePlan}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    value={renewablePlan}
                    onChange={(val) => setRenewablePlan(val)}
                    accentColor="#00E5A8"
                    aria-label="Renewable Deployment"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'CO₂ in 2030', value: `${Math.round(421 - renewablePlan * 1.8)} ppm`, color: renewablePlan > 50 ? '#00E5A8' : '#F59E0B' },
                    { label: 'CO₂ in 2050', value: `${Math.round(421 - renewablePlan * 3.2)} ppm`, color: renewablePlan > 70 ? '#00E5A8' : '#EF4444' },
                    { label: 'Temp Change', value: `+${(2.1 - renewablePlan * 0.015).toFixed(1)}°C`,  color: renewablePlan > 60 ? '#F59E0B' : '#EF4444' },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-3">
                      <div className="font-bold text-base font-orbitron" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renewable Energy Mix */}
              <div>
                <h3 className="font-semibold mb-4 text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono">Energy Source Comparison</h3>
                <div className="space-y-3">
                  {ENERGY_PLAN.map((e, i) => {
                    const projected = e.source === 'Fossil'
                      ? Math.max(0, e.current - renewablePlan * 0.5)
                      : Math.min(e.potential, e.current + (e.potential - e.current) * (renewablePlan / 100));
                    return (
                      <motion.div key={e.source} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="text-base">{e.emoji}</span>
                          <span className="font-medium text-white flex-1">{e.source}</span>
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
