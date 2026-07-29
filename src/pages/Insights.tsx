import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Cloud, Bird,
  Brain, Zap, Globe2,
  Droplets, Trees, Wind, TrendingDown, TrendingUp,
  BarChart3, Activity, Waves,
  ThermometerSun, Mail, MapPin,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';

/* =========================================================
   DATA
   ========================================================= */
const RISK_METRICS = [
  { label: 'Forest Risk',   value: 72, icon: Trees,          color: '#00E5A8', desc: 'Deforestation at 4.7M ha/yr',   trend: 'up'   },
  { label: 'Ocean Risk',    value: 65, icon: Waves,          color: '#38BDF8', desc: 'Acidification pH 8.08',         trend: 'up'   },
  { label: 'Air Quality',   value: 58, icon: Wind,           color: '#F59E0B', desc: 'PM2.5 above WHO limits',        trend: 'up'   },
  { label: 'Climate Risk',  value: 79, icon: ThermometerSun, color: '#EF4444', desc: '+1.4°C above baseline',        trend: 'up'   },
  { label: 'Biodiversity',  value: 61, icon: Bird,           color: '#7C3AED', desc: '1M species at extinction risk', trend: 'up'   },
  { label: 'Water Security',value: 43, icon: Droplets,       color: '#06B6D4', desc: '2B people lack clean access',  trend: 'same' },
];

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

const WILDLIFE_RECOVERY = [
  { name: 'Blue Whale',     status: 68,  trend: +12, emoji: '🐋', color: '#38BDF8' },
  { name: 'Snow Leopard',   status: 42,  trend: -3,  emoji: '🐆', color: '#F59E0B' },
  { name: 'Mountain Gorilla',status: 55, trend: +8,  emoji: '🦍', color: '#00E5A8' },
  { name: 'Sea Turtle',     status: 61,  trend: +5,  emoji: '🐢', color: '#06B6D4' },
  { name: 'Tiger',          status: 38,  trend: +2,  emoji: '🐯', color: '#F97316' },
  { name: 'African Elephant',status: 47, trend: -1,  emoji: '🐘', color: '#94A3B8' },
];

const ENERGY_PLAN = [
  { source: 'Solar',   current: 15, potential: 55, emoji: '☀️', color: '#F59E0B' },
  { source: 'Wind',    current: 12, potential: 38, emoji: '💨', color: '#38BDF8' },
  { source: 'Hydro',   current: 16, potential: 22, emoji: '💧', color: '#06B6D4' },
  { source: 'Nuclear', current:  4, potential: 15, emoji: '⚡', color: '#7C3AED' },
  { source: 'Fossil',  current: 53, potential:  0, emoji: '🏭', color: '#EF4444' },
];

const FLOOD_ZONES = [
  { city: 'Miami',    risk: 'Critical', pct: 89, color: '#EF4444' },
  { city: 'Jakarta',  risk: 'Critical', pct: 94, color: '#EF4444' },
  { city: 'Mumbai',   risk: 'High',     pct: 73, color: '#F59E0B' },
  { city: 'Shanghai', risk: 'High',     pct: 68, color: '#F59E0B' },
  { city: 'London',   risk: 'Medium',   pct: 41, color: '#38BDF8' },
  { city: 'Tokyo',    risk: 'Medium',   pct: 45, color: '#38BDF8' },
];

export default function Insights() {
  const [sliderPos, setSliderPos]     = useState(50);
  const [plasticReduction, setPlasticReduction] = useState(0);
  const [renewablePlan, setRenewablePlan]       = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">

        {/* ===== PROBLEM STATEMENT ===== */}
        <section>
          <SectionTitle
            eyebrow="Global Environmental Crisis"
            title="Earth's systems are failing — and decisions are blind"
            description="Climate change, biodiversity loss, and pollution are accelerating. TerraMind makes these crises visible, interactive, and solvable."
          />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, title: '75% of ecosystems degraded',    desc: 'UN reports find terrestrial ecosystems in rapid decline. Urgent action required by 2030.', color: '#EF4444' },
              { icon: Cloud,         title: 'CO₂ at 421+ ppm',               desc: 'Highest levels in human history, rising 2–3 ppm annually. Tipping points approaching.',   color: '#F59E0B' },
              { icon: Bird,          title: '1M+ species at extinction risk', desc: 'IPBES warns of unprecedented extinction rates — 6th mass extinction underway.',           color: '#7C3AED' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <motion.div whileHover={{ scale: 1.03, y: -4 }} className="glass-card p-6 h-full" style={{ borderLeft: `3px solid ${item.color}50` }}>
                    <Icon className="w-8 h-8 mb-3" style={{ color: item.color }} />
                    <h3 className="font-bold font-display mb-1.5 text-base">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
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
            description="Real-time risk indices across six planetary systems — updated from environmental research data."
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
                    <div className="font-semibold font-display text-sm mb-1">{m.label}</div>
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

        {/* ===== OCEAN PLASTIC TRACKER ===== */}
        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <Badge variant="secondary" className="mb-3"><Waves className="w-3 h-3" /> Ocean Tracker</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-balance mb-4">
                Ocean Plastic{' '}
                <span className="gradient-text">Tracker</span>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                Over 11 million tonnes of plastic enter the ocean annually. Interactive tracker shows
                concentration levels by region and projects cleanup scenarios.
              </p>
              <div className="space-y-3">
                {PLASTIC_DATA.map((p, i) => (
                  <motion.div key={p.region} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{p.region}</span>
                      <span className="font-mono font-bold" style={{ color: p.color }}>
                        {Math.round(Math.max(0, p.level - (plasticReduction * 0.4)))}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[var(--glass-border)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                        animate={{ width: `${Math.max(0, p.level - (plasticReduction * 0.4))}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <GlassCard className="p-6 glow-secondary">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-secondary" />
                <h3 className="font-bold font-display">Reduction Simulator</h3>
              </div>
              {/* Animated ocean */}
              <div className="relative h-40 rounded-2xl overflow-hidden mb-5">
                <motion.div
                  className="absolute inset-0"
                  animate={{ background: plasticReduction > 60
                    ? 'linear-gradient(to bottom, rgba(14,165,233,0.5), rgba(3,105,161,0.7))'
                    : plasticReduction > 30
                    ? 'linear-gradient(to bottom, rgba(82,82,91,0.4), rgba(39,39,42,0.6))'
                    : 'linear-gradient(to bottom, rgba(82,82,91,0.6), rgba(24,24,27,0.8))',
                  }}
                  transition={{ duration: 1.5 }}
                />
                {/* Plastic debris (reduce as slider moves) */}
                {Array.from({ length: Math.round((1 - plasticReduction / 100) * 12) }).map((_, i) => (
                  <motion.div key={i} className="absolute w-2.5 h-2.5 rounded-sm bg-gray-300/50"
                    style={{ top: `${20 + Math.random() * 60}%`, left: `${Math.random() * 90}%` }}
                    animate={{ x: [0, 10, -5, 0] }} transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                {/* Fish return when clean */}
                {plasticReduction > 50 && Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={`fish-${i}`} className="absolute text-sm" style={{ top: `${30 + i * 15}%` }}
                    animate={{ x: ['-10%', '110%'] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}>
                    🐟
                  </motion.div>
                ))}
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/70">
                  Plastic: {Math.round(75 - plasticReduction * 0.6)}% | Marine Recovery: {Math.round(25 + plasticReduction * 0.65)}%
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Intervention Level</span>
                <span className="font-bold text-secondary">{plasticReduction}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={plasticReduction}
                onChange={(e) => setPlasticReduction(Number(e.target.value))}
                className="w-full cursor-pointer" style={{ accentColor: '#38BDF8' }}
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="glass rounded-lg p-2">
                  <div className="font-bold text-secondary">{Math.round(11 - plasticReduction * 0.09)}M</div>
                  <div className="text-[var(--text-muted)]">tonnes/yr</div>
                </div>
                <div className="glass rounded-lg p-2">
                  <div className="font-bold text-primary">{Math.round(25 + plasticReduction * 0.65)}%</div>
                  <div className="text-[var(--text-muted)]">Recovery</div>
                </div>
                <div className="glass rounded-lg p-2">
                  <div className="font-bold text-accent">{Math.round(plasticReduction * 18)}k</div>
                  <div className="text-[var(--text-muted)]">Species saved</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ===== DEFORESTATION MONITOR ===== */}
        <section>
          <GlassCard className="p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-3"><Trees className="w-3 h-3" /> Deforestation Monitor</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Global Forest Loss Tracker</h2>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                  Real-time deforestation monitoring across five critical forest ecosystems. Each pixel lost
                  represents irreversible biodiversity damage.
                </p>
                {/* Animated deforestation visualization */}
                <div className="relative h-32 rounded-xl overflow-hidden">
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
                    <span className="text-sm font-medium flex-1">{h.name}</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {(h.loss / 1000000).toFixed(1)}M ha/yr
                    </span>
                    <div className="w-28">
                      <ProgressBar value={h.pct} color={h.color} height={6} />
                    </div>
                  </motion.div>
                ))}
                <div className="glass rounded-xl p-3 mt-2 border border-danger/20">
                  <div className="text-xs text-danger font-bold mb-1">⚠ Critical Threshold</div>
                  <div className="text-xs text-[var(--text-muted)]">Amazon tipping point at &lt;75% coverage. Currently at 78%.</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ===== IMPACT COMPARISON (keep existing slider) ===== */}
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
              <div className="flex justify-between mt-2 text-xs font-medium">
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
                      <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)]">
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
                <h3 className="font-bold font-display text-lg">Flood Risk Prediction</h3>
                <Badge variant="danger" className="ml-auto">High Alert</Badge>
              </div>
              <div className="space-y-3">
                {FLOOD_ZONES.map((z, i) => (
                  <motion.div key={z.city} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3">
                    <span className="font-medium text-sm w-20">{z.city}</span>
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
              <div className="mt-4 glass rounded-xl p-3 text-xs text-[var(--text-muted)]">
                <span className="text-danger font-semibold">Model basis:</span> IPCC AR6 sea level projections + urban drainage capacity analysis.
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThermometerSun className="w-5 h-5 text-warning" />
                <h3 className="font-bold font-display text-lg">Heatwave Analysis</h3>
                <Badge variant="warning" className="ml-auto">2026 Data</Badge>
              </div>
              {/* Animated temperature grid */}
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
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-4">
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
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ===== CARBON REDUCTION PLANNER ===== */}
        <section>
          <GlassCard className="p-8 glow-primary">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="primary" className="mb-3"><BarChart3 className="w-3 h-3" /> Carbon Planner</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Carbon Reduction Planner</h2>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                  Simulate renewable energy expansion and see the projected CO₂ pathway to 2050.
                  Each percentage of clean energy deployed reduces atmospheric carbon.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-muted)]">Renewable Deployment</span>
                    <span className="font-bold text-primary">{renewablePlan}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={renewablePlan}
                    onChange={(e) => setRenewablePlan(Number(e.target.value))}
                    className="w-full cursor-pointer" style={{ accentColor: '#00E5A8' }} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'CO₂ in 2030', value: `${Math.round(421 - renewablePlan * 1.8)} ppm`, color: renewablePlan > 50 ? '#00E5A8' : '#F59E0B' },
                    { label: 'CO₂ in 2050', value: `${Math.round(421 - renewablePlan * 3.2)} ppm`, color: renewablePlan > 70 ? '#00E5A8' : '#EF4444' },
                    { label: 'Temp Change', value: `+${(2.1 - renewablePlan * 0.015).toFixed(1)}°C`,  color: renewablePlan > 60 ? '#F59E0B' : '#EF4444' },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-3">
                      <div className="font-bold text-base font-orbitron" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renewable Energy Mix */}
              <div>
                <h3 className="font-semibold mb-4 text-sm text-[var(--text-muted)] uppercase tracking-widest">Energy Source Comparison</h3>
                <div className="space-y-3">
                  {ENERGY_PLAN.map((e, i) => {
                    const projected = e.source === 'Fossil'
                      ? Math.max(0, e.current - renewablePlan * 0.5)
                      : Math.min(e.potential, e.current + (e.potential - e.current) * (renewablePlan / 100));
                    return (
                      <motion.div key={e.source} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{e.emoji}</span>
                          <span className="text-sm font-medium flex-1">{e.source}</span>
                          <span className="text-xs font-mono" style={{ color: e.color }}>{Math.round(projected)}%</span>
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

        {/* ===== WILDLIFE RECOVERY DASHBOARD ===== */}
        <section>
          <SectionTitle
            center
            eyebrow="Biodiversity Monitor"
            title="Wildlife Recovery Dashboard"
            description="Population recovery status for key indicator species across global ecosystems."
          />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WILDLIFE_RECOVERY.map((w, i) => (
              <motion.div key={w.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <motion.div whileHover={{ scale: 1.04, y: -4 }} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <motion.span className="text-4xl" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                      {w.emoji}
                    </motion.span>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${w.trend > 0 ? 'bg-primary/15 text-primary' : 'bg-danger/15 text-danger'}`}>
                      {w.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {w.trend > 0 ? '+' : ''}{w.trend}%
                    </span>
                  </div>
                  <div className="font-bold font-display mb-1">{w.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mb-3">
                    Population index: <span className="font-mono font-bold" style={{ color: w.color }}>{w.status}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--glass-border)] overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${w.color}, ${w.color}88)` }}
                      initial={{ width: 0 }} whileInView={{ width: `${w.status}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1 }} />
                  </div>
                  <div className="mt-2 text-[10px] text-[var(--text-muted)]">
                    {w.status > 60 ? '✅ Recovering' : w.status > 40 ? '⚠ Vulnerable' : '🚨 Endangered'}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== RULE-BASED AI (keep) ===== */}
        <section>
          <GlassCard className="p-8 md:p-10 glow-primary">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Badge variant="primary" className="mb-3"><Brain className="w-3 h-3" /> Rule-Based AI</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Explainable — not a black box</h2>
                <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                  Unlike LLM-based systems, our advisor uses explicit if-then rules grounded in
                  environmental science. Every recommendation shows exactly why it was made —
                  transparent, deterministic, and auditable.
                </p>
                <div className="space-y-2.5">
                  {[
                    'No external AI APIs — runs entirely client-side',
                    'Threshold-based rules from climate research (IPCC, NASA)',
                    'Every insight is auditable and fully explainable',
                    'Deterministic — same inputs always produce same outputs',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 font-mono text-xs leading-relaxed overflow-x-auto border border-primary/10">
                <div className="text-[var(--text-muted)] mb-2">// Rule-based insight example</div>
                <div><span className="text-secondary">if</span> (metrics.forest &lt; 60) {'{'}</div>
                <div className="pl-4"><span className="text-secondary">if</span> (controls.trees &lt; 50)</div>
                <div className="pl-8">insight.cause = <span className="text-primary">"Insufficient reforestation"</span>;</div>
                <div className="pl-4"><span className="text-secondary">else</span></div>
                <div className="pl-8">insight.cause = <span className="text-primary">"Wildfires outpace restoration"</span>;</div>
                <div className="pl-4">insight.solution = <span className="text-primary">"Increase trees slider"</span>;</div>
                <div>{'}'}</div>
                <div className="mt-3 text-[var(--text-muted)]">// Severity thresholds</div>
                <div>severity = value &lt; 40 ? <span className="text-danger">"high"</span> : value &lt; 60 ? <span className="text-warning">"moderate"</span> : <span className="text-primary">"low"</span>;</div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ===== CTA ===== */}
        <section>
          <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden glow-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="relative">
              <Badge variant="primary" className="mb-4"><Mail className="w-3 h-3" /> Contact</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-balance mb-4">
                Let's build a sustainable future together
              </h2>
              <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-8 leading-relaxed">
                TerraMind is an open environmental intelligence platform. Reach out for
                collaborations, education programs, or policy decision tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:team@terramind.ai"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-ink font-bold shadow-glow hover:bg-primary-light transition-colors">
                  <Mail className="w-4 h-4" /> team@terramind.ai
                </a>
                <div className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass text-[var(--text-muted)]">
                  <MapPin className="w-4 h-4" /> AI-for-Earth Hackathon 2026
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="text-center pb-8">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Data Sources</div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            Environmental data references: NASA Earth Observatory, IPCC AR6 Reports, UN Environment Programme,
            IPBES Global Assessment, WWF Living Planet Index. 3D Earth rendered procedurally via WebGL shaders.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
