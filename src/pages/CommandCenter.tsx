import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite, Radar, Trees, Droplets, Building2, ThermometerSun, Cloud,
  Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2,
  Activity, Target, Zap, Signal,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import {
  CONTROLS, type MetricKey, type ControlKey,
  TIMELINE_YEARS, TIMELINE_SCENARIOS,
} from '@/data/environment';
import { computeMetrics, computeHealthScore, generateInsights } from '@/lib/advisorEngine';

const SCAN_TARGETS = [
  { id: 'forest',    label: 'Forest Loss',   icon: Trees,          color: '#00E5A8', desc: 'Detecting deforestation patterns via spectral analysis' },
  { id: 'water',     label: 'Water Quality', icon: Droplets,       color: '#38BDF8', desc: 'Monitoring contamination levels in major waterways' },
  { id: 'urban',     label: 'Urban Growth',  icon: Building2,      color: '#7C3AED', desc: 'Tracking city expansion and heat signatures' },
  { id: 'heat',      label: 'Heat Islands',  icon: ThermometerSun, color: '#F59E0B', desc: 'Mapping thermal hotspots across metropolitan zones' },
  { id: 'pollution', label: 'Pollution',     icon: Cloud,          color: '#EF4444', desc: 'Measuring atmospheric emission density and drift' },
];

const SEVERITY_STYLES = {
  high:     { variant: 'danger'  as const, icon: AlertTriangle },
  moderate: { variant: 'warning' as const, icon: AlertTriangle },
  low:      { variant: 'success' as const, icon: CheckCircle2 },
};

// Simulated telemetry stream data
const TELEMETRY_LINES = [
  'SYS_OK: Environmental sensors nominal',
  'SAT_ALT: 408.2 km ISS orbit confirmed',
  'TEMP_GLOB: +1.4°C above baseline',
  'CO2_CONC: 421.4 ppm detected',
  'ICE_COVER: Arctic -13.1%/decade',
  'OCEAN_PH: 8.08 acidification +0.02',
  'DEFOR_RATE: 4.7M ha/yr Amazon',
  'RENEWABLE: 29.7% global share',
  'SEA_LEVEL: +3.6mm/yr rising',
  'SPECIES: 1M+ at extinction risk',
];

export default function CommandCenter() {
  const [controls]     = useState(CONTROLS.map((c) => ({ ...c, value: 50 })));
  const [activeScan, setActiveScan]   = useState<string | null>(null);
  const [scanning, setScanning]       = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [telemetryLine, setTelemetryLine] = useState(0);

  const metrics     = useMemo(() => computeMetrics(controls), [controls]);
  const healthScore = useMemo(() => computeHealthScore(metrics), [metrics]);
  const insights    = useMemo(() => generateInsights({
    metrics,
    controls: Object.fromEntries(controls.map((c) => [c.key, c.value])) as Record<ControlKey, number>,
  }), [metrics, controls]);

  const runScan = (id: string) => {
    setActiveScan(id);
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => setScanProgress((p) => {
      if (p >= 100) { clearInterval(interval); setScanning(false); return 100; }
      return p + 2;
    }), 50);
  };

  // Rotate telemetry
  useEffect(() => {
    const interval = setInterval(() => setTelemetryLine((p) => (p + 1) % TELEMETRY_LINES.length), 2000);
    return () => clearInterval(interval);
  }, []);

  const scenario = TIMELINE_SCENARIOS[selectedYear];

  // Heat map grid data based on metrics
  const heatCells = useMemo(() => {
    const target = SCAN_TARGETS.find((t) => t.id === activeScan);
    return Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const base = target ? (metrics[target.id as MetricKey] ?? 50) / 100 : 0.5;
      const noise = Math.sin(row * 1.3 + col * 0.7) * 0.25 + Math.cos(row * 0.8 + col * 1.5) * 0.2;
      return Math.max(0, Math.min(1, base + noise));
    });
  }, [activeScan, metrics]);

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Command Center"
          title="Environmental Intelligence Hub"
          description="Monitor Earth from orbit. Run satellite scans. Consult the rule-based AI advisor. Project Earth's future."
          className="mb-10"
        />

        {/* Top stat pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatPill icon={Activity}       label="Earth Health"   value={`${healthScore}%`}  color="#00E5A8" />
          <StatPill icon={Signal}         label="Active Scans"   value={activeScan ? '1' : '0'} color="#38BDF8" />
          <StatPill icon={AlertTriangle}  label="Alerts"         value={`${insights.filter((i) => i.severity === 'high').length}`} color="#EF4444" />
          <StatPill icon={Target}         label="Year Projected" value={scenario.year.toString()} color="#7C3AED" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ===== SATELLITE SCANNER ===== */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Satellite className="w-5 h-5 text-secondary animate-pulse" />
              <h3 className="text-lg font-semibold font-display font-orbitron tracking-wide">Satellite Scanner</h3>
              <Badge variant="secondary" className="ml-auto">
                <span className="status-dot-live mr-1" style={{ width: 6, height: 6, background: '#38BDF8' }} />
                LIVE
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">Select a target for orbital spectral analysis</p>

            {/* Scanner viewport */}
            <div className="relative h-[280px] rounded-2xl overflow-hidden glass mb-4 border border-[var(--glass-border)]">
              {/* NASA grid bg */}
              <div className="absolute inset-0 nasa-grid opacity-40" />
              <div className="scanner-overlay absolute inset-0" />

              {/* Earth globe SVG representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  {/* Earth circle */}
                  <div className="w-32 h-32 rounded-full border-2 border-primary/20"
                    style={{ background: 'radial-gradient(circle at 35% 35%, rgba(0,229,168,0.3), rgba(10,77,140,0.4), rgba(4,13,26,0.8))' }}
                  />
                  {/* Orbit path SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128" style={{ overflow: 'visible' }}>
                    <ellipse cx="64" cy="64" rx="75" ry="28" className="orbit-path" transform="rotate(-20, 64, 64)" />
                    <ellipse cx="64" cy="64" rx="55" ry="22" className="orbit-path" style={{ animationDelay: '-5s' }} transform="rotate(40, 64, 64)" />
                  </svg>
                  {/* Orbiting satellite dot */}
                  <motion.div
                    className="absolute w-3 h-3 rounded-full bg-primary shadow-glow"
                    animate={{
                      x: [75, 0, -75, 0, 75],
                      y: [0, -28, 0, 28, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    style={{ top: '50%', left: '50%', marginTop: -6, marginLeft: -6 }}
                  />
                  {/* Second satellite */}
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-secondary"
                    animate={{
                      x: [-55, 0, 55, 0, -55],
                      y: [0, 22, 0, -22, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: -2 }}
                    style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }}
                  />
                </div>
              </div>

              {/* Scan line animation */}
              {scanning && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 z-10"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', boxShadow: '0 0 12px var(--primary)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                />
              )}

              {/* Scanning ripple */}
              {scanning && (
                <motion.div
                  className="absolute top-1/2 left-1/2 rounded-full border border-primary/40"
                  style={{ marginTop: -40, marginLeft: -40 }}
                  animate={{ width: [80, 160], height: [80, 160], opacity: [0.8, 0], marginTop: [-40, -80], marginLeft: [-40, -80] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Scanning indicator */}
              {scanning && (
                <div className="absolute top-3 left-3 glass rounded-lg px-2 py-1 flex items-center gap-1.5 text-[10px] font-mono text-primary border border-primary/20 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  SCANNING {SCAN_TARGETS.find((t) => t.id === activeScan)?.label?.toUpperCase()}
                  <span className="ml-1">{scanProgress}%</span>
                </div>
              )}

              {/* Heat map results */}
              {activeScan && !scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-4 z-10"
                >
                  <div className="grid grid-cols-8 gap-0.5 h-full">
                    {heatCells.map((val, i) => {
                      const tColor = SCAN_TARGETS.find((t) => t.id === activeScan)?.color ?? '#00E5A8';
                      const hexOpacity = Math.round(val * 180).toString(16).padStart(2, '0');
                      return (
                        <motion.div
                          key={i}
                          className="heat-cell rounded-sm"
                          style={{ background: `${tColor}${hexOpacity}` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.008 }}
                        />
                      );
                    })}
                  </div>
                  {/* Overlay scan result */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ScanResult target={SCAN_TARGETS.find((t) => t.id === activeScan)!} metrics={metrics} />
                  </div>
                </motion.div>
              )}

              {/* Awaiting state */}
              {!activeScan && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <Radar className="w-10 h-10 text-primary/40 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-xs text-[var(--text-muted)]">Awaiting scan target</p>
                  </div>
                </div>
              )}

              {/* Telemetry stream */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={telemetryLine}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[9px] font-mono text-primary/50 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                    {TELEMETRY_LINES[telemetryLine]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Scan target buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCAN_TARGETS.map((t) => {
                const Icon = t.icon;
                const isActive = activeScan === t.id && !scanning;
                const isScanning = activeScan === t.id && scanning;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => !scanning && runScan(t.id)}
                    disabled={scanning}
                    whileHover={!scanning ? { scale: 1.04 } : {}}
                    whileTap={!scanning ? { scale: 0.97 } : {}}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive    ? 'border border-primary/30 bg-primary/10 text-primary shadow-glow'
                      : isScanning? 'border border-secondary/30 bg-secondary/10 text-secondary'
                      : 'glass text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.color }} />
                    <span className="truncate">{t.label}</span>
                    {isScanning && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary animate-pulse flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          {/* ===== AI ADVISOR ===== */}
          <GlassCard className="p-6 glow-primary">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold font-display">AI Environmental Advisor</h3>
              <Badge variant="primary" className="ml-auto">Rule-Based</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">Explainable expert system — fully transparent</p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence mode="wait">
                {insights.length === 0 ? (
                  <motion.div key="healthy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                    </motion.div>
                    <p className="text-sm font-semibold">All systems nominal</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">No critical environmental alerts detected</p>
                  </motion.div>
                ) : (
                  insights.map((insight, i) => {
                    const sev = SEVERITY_STYLES[insight.severity];
                    const SevIcon = sev.icon;
                    const borderColor = insight.severity === 'high' ? '#EF4444' : insight.severity === 'moderate' ? '#F59E0B' : '#10B981';
                    return (
                      <motion.div
                        key={`${insight.metric}-${i}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass rounded-xl p-4 relative overflow-hidden"
                        style={{ borderLeft: `3px solid ${borderColor}` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={sev.variant}>
                            <SevIcon className="w-3 h-3" />
                            {insight.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-[var(--text-muted)] capitalize font-mono">{insight.metric}</span>
                        </div>
                        <p className="text-sm font-semibold mb-2 leading-snug">{insight.problem}</p>
                        <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                          <p><span className="text-[var(--text)] font-medium">Cause: </span>{insight.cause}</p>
                          <p><span className="text-[var(--text)] font-medium">Impact: </span>{insight.impact}</p>
                          <p className="flex items-start gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span><span className="text-primary font-medium">Fix: </span>{insight.solution}</span>
                          </p>
                          <p className="flex items-start gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                            <span><span className="text-secondary font-medium">Benefit: </span>{insight.benefit}</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* ===== FUTURE TIMELINE ===== */}
        <div className="mt-8">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold font-display">Future Timeline</h3>
              <Badge variant="default" className="ml-auto">2026 → 2100</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-6">Visual Earth evolution — how decisions shape our planet over decades</p>

            {/* Year selector */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
              {TIMELINE_YEARS.map((year, i) => {
                const yearScenario = TIMELINE_SCENARIOS[i];
                const avgHealth = Object.values(yearScenario.metrics).reduce((a, b) => a + b, 0) / 6;
                const isSelected = selectedYear === i;
                return (
                  <motion.button
                    key={year}
                    onClick={() => setSelectedYear(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative px-5 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      isSelected ? 'bg-accent/20 text-accent border border-accent/30 shadow-glow' : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <div className="font-bold font-orbitron">{year}</div>
                    {/* Mini health bar */}
                    <div className="mt-1 h-1 rounded-full bg-[var(--glass-border)] overflow-hidden w-16">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${avgHealth}%`,
                          background: avgHealth > 70 ? '#00E5A8' : avgHealth > 50 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid md:grid-cols-[1fr_1.5fr] gap-8 items-start"
              >
                {/* Left: title + Earth visualization */}
                <div>
                  <Badge variant="secondary" className="mb-3 font-orbitron">{scenario.year}</Badge>
                  <h4 className="text-2xl font-bold font-display mb-2">{scenario.title}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">{scenario.description}</p>

                  {/* Visual Earth thumbnail */}
                  <div className="relative h-40 rounded-2xl overflow-hidden">
                    {(() => {
                      const avgHealth = Object.values(scenario.metrics).reduce((a, b) => a + b, 0) / 6;
                      const forestVal = scenario.metrics.forest / 100;
                      const carbonVal = 1 - scenario.metrics.carbon / 100;
                      const landColor = avgHealth > 70 ? `rgba(22,101,52,0.8)` : avgHealth > 50 ? `rgba(133,77,14,0.7)` : `rgba(87,83,78,0.8)`;
                      return (
                        <>
                          <div className="absolute inset-0" style={{
                            background: `linear-gradient(to bottom, ${
                              carbonVal > 0.7 ? 'rgba(14,165,233,0.4)' : carbonVal > 0.5 ? 'rgba(100,116,139,0.5)' : 'rgba(82,82,91,0.6)'
                            }, ${landColor})`,
                          }} />
                          {/* Simple trees */}
                          {Array.from({ length: Math.round(forestVal * 10) }).map((_, i) => (
                            <div key={i} className="absolute bottom-6 flex flex-col items-center"
                              style={{ left: `${5 + i * (90 / Math.round(forestVal * 10))}%` }}>
                              <div className="w-4 h-4 rounded-full" style={{ background: avgHealth > 60 ? '#22C55E' : '#78716C' }} />
                              <div className="w-0.5 h-3 bg-amber-900" />
                            </div>
                          ))}
                          {/* Ice caps if carbon low */}
                          {scenario.metrics.carbon < 40 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-2xl" />
                              <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/15 rounded-b-2xl" />
                            </>
                          )}
                          {/* Year overlay */}
                          <div className="absolute top-2 left-3 text-white/80 font-bold font-orbitron text-sm">{scenario.year}</div>
                          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/60">
                            Health: {Math.round(Object.values(scenario.metrics).reduce((a, b) => a + b, 0) / 6)}%
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Right: metrics */}
                <div className="space-y-3">
                  {(Object.keys(scenario.metrics) as MetricKey[]).map((key) => {
                    const val   = scenario.metrics[key];
                    const color = key === 'carbon' ? '#EF4444' : key === 'renewable' || key === 'forest' ? '#00E5A8' : key === 'water' ? '#38BDF8' : key === 'biodiversity' ? '#7C3AED' : '#F59E0B';
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Object.keys(scenario.metrics).indexOf(key) * 0.06 }}
                      >
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-[var(--text-muted)] capitalize font-medium">{key}</span>
                          <span className="font-bold font-mono" style={{ color }}>{val}{key === 'carbon' ? ' ppm' : '%'}</span>
                        </div>
                        <ProgressBar value={val} color={color} height={7} />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass-card p-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-bold font-display font-orbitron leading-none">{value}</div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

function ScanResult({ target, metrics }: { target: typeof SCAN_TARGETS[number]; metrics: Record<MetricKey, number> }) {
  const metricMap: Record<string, MetricKey> = {
    forest: 'forest', water: 'water', urban: 'renewable', heat: 'air', pollution: 'carbon',
  };
  const val    = Math.round(metrics[metricMap[target.id]] ?? 50);
  const status = val > 65 ? 'NOMINAL' : val > 40 ? 'MODERATE' : 'CRITICAL';
  const statusColor = val > 65 ? '#00E5A8' : val > 40 ? '#F59E0B' : '#EF4444';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center glass rounded-xl p-4"
    >
      <target.icon className="w-8 h-8 mb-2" style={{ color: target.color }} />
      <div className="text-3xl font-bold font-orbitron" style={{ color: target.color }}>{val}%</div>
      <div className="text-xs font-medium mt-1 font-mono" style={{ color: statusColor }}>{status}</div>
      <p className="text-[10px] text-[var(--text-muted)] mt-1.5 max-w-[160px] leading-snug">{target.desc}</p>
      <div className="mt-2 w-full max-w-[140px]">
        <ProgressBar value={val} color={target.color} height={5} />
      </div>
    </motion.div>
  );
}
