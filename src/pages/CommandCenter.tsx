import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite, Radar, Trees, Droplets, Building2, ThermometerSun, Cloud,
  Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2,
  Activity, Target, Zap, Signal, Shield, Leaf, X,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import {
  CONTROLS, type MetricKey, type ControlKey,
  TIMELINE_YEARS, TIMELINE_SCENARIOS,
} from '@/data/environment';
import { computeMetrics, computeHealthScore, generateInsights } from '@/lib/advisorEngine';

/* ── Scan targets ── */
const SCAN_TARGETS = [
  {
    id: 'forest',    label: 'Forest Loss',   icon: Trees,          color: '#00E5A8',
    desc: 'Detecting deforestation patterns via spectral analysis',
    telemetry: ['NDVI anomaly: −0.32', 'Deforestation: 4.7M ha/yr', 'Canopy loss: 12.4%', 'Regrowth: 2.1%'],
    coords: '3.7°S 62.4°W', metric: 'Biomass Density',
  },
  {
    id: 'water',     label: 'Water Quality', icon: Droplets,       color: '#38BDF8',
    desc: 'Monitoring contamination levels in major waterways',
    telemetry: ['pH: 7.82 (acid stress)', 'Turbidity: HIGH 48 NTU', 'Dissolved O₂: 5.1 mg/L', 'Microplastics: 312/L'],
    coords: '12.1°N 48.6°E', metric: 'Water Quality Index',
  },
  {
    id: 'urban',     label: 'Urban Growth',  icon: Building2,      color: '#A78BFA',
    desc: 'Tracking city expansion and heat signatures',
    telemetry: ['Urban expansion: +2.8%/yr', 'Impervious cover: 74%', 'Green space: −5.2%', 'Population density: 12K/km²'],
    coords: '28.6°N 77.2°E', metric: 'Urban Heat Index',
  },
  {
    id: 'heat',      label: 'Heat Islands',  icon: ThermometerSun, color: '#FFB830',
    desc: 'Mapping thermal hotspots across metropolitan zones',
    telemetry: ['Surface temp: +4.2°C above rural', 'Heat island radius: 38km', 'Night urban ΔT: +2.8°C', 'Albedo: 0.11 (low)'],
    coords: '40.7°N 74.0°W', metric: 'Thermal Signature',
  },
  {
    id: 'pollution', label: 'Pollution',     icon: Cloud,          color: '#FF4D6D',
    desc: 'Measuring atmospheric emission density and drift',
    telemetry: ['PM2.5: 68 μg/m³ (CRITICAL)', 'NO₂: 48 ppb', 'SO₂: 12 ppb', 'AQI: 178 UNHEALTHY'],
    coords: '39.9°N 116.4°E', metric: 'Air Pollution Index',
  },
];

/* ── Policy Protocol effects ── */
const POLICY_EFFECTS = [
  { metric: 'Forest Coverage',   delta: '+8%',  icon: Trees,    color: '#00E5A8' },
  { metric: 'Water Quality',     delta: '+6%',  icon: Droplets, color: '#38BDF8' },
  { metric: 'Carbon Emissions',  delta: '−12%', icon: Cloud,    color: '#FF4D6D' },
  { metric: 'Biodiversity',      delta: '+5%',  icon: Leaf,     color: '#A78BFA' },
  { metric: 'Air Quality',       delta: '+9%',  icon: Shield,   color: '#FFB830' },
  { metric: 'Renewable Energy',  delta: '+15%', icon: Zap,      color: '#00C2FF' },
];

/* ── Telemetry stream ── */
const TELEMETRY_LINES = [
  'SYS_OK: Environmental sensors nominal',
  'SAT_ALT: 408.2 km ISS orbit confirmed',
  'TEMP_GLOB: +1.4°C above pre-industrial',
  'CO2_CONC: 421.4 ppm detected',
  'ICE_COVER: Arctic −13.1%/decade',
  'OCEAN_PH: 8.08 acidification +0.02',
  'DEFOR_RATE: 4.7M ha/yr Amazon basin',
  'RENEWABLE: 29.7% global share',
  'SEA_LEVEL: +3.6mm/yr rising trend',
  'SPECIES: 1M+ at extinction risk',
  'METHANE: 1923 ppb — record high',
  'GLACIER: 267 Gt/yr ice loss rate',
];

const SEVERITY_STYLES = {
  high:     { variant: 'danger'  as const, icon: AlertTriangle },
  moderate: { variant: 'warning' as const, icon: AlertTriangle },
  low:      { variant: 'success' as const, icon: CheckCircle2 },
};

export default function CommandCenter() {
  const [controls]      = useState(CONTROLS.map((c) => ({ ...c, value: 50 })));
  const [activeScan, setActiveScan]     = useState<string | null>(null);
  const [scanning, setScanning]         = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [telemetryLine, setTelemetryLine] = useState(0);

  /* Policy Protocol state */
  const [policyPhase, setPolicyPhase]       = useState<'idle' | 'confirm' | 'activating' | 'done'>('idle');
  const [policyProgress, setPolicyProgress] = useState(0);
  const [policyStep, setPolicyStep]         = useState(0);
  const [policyBoost, setPolicyBoost]       = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  /* Orbit angle for live satellite - used for animation */

  const metrics     = useMemo(() => {
    const base = computeMetrics(controls);
    if (policyBoost) {
      return {
        forest:      Math.min(100, base.forest + 8),
        water:       Math.min(100, base.water  + 6),
        air:         Math.min(100, base.air    + 9),
        carbon:      Math.max(0,   base.carbon - 12),
        biodiversity:Math.min(100, base.biodiversity + 5),
        renewable:   Math.min(100, base.renewable    + 15),
      };
    }
    return base;
  }, [controls, policyBoost]);

  const healthScore = useMemo(() => computeHealthScore(metrics), [metrics]);
  const insights    = useMemo(() => generateInsights({
    metrics,
    controls: Object.fromEntries(controls.map((c) => [c.key, c.value])) as Record<ControlKey, number>,
  }), [metrics, controls]);

  const scenario = TIMELINE_SCENARIOS[selectedYear];

  /* Scan runner */
  const runScan = useCallback((id: string) => {
    setActiveScan(id);
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => setScanProgress((p) => {
      if (p >= 100) { clearInterval(interval); setScanning(false); return 100; }
      return p + 2;
    }), 50);
  }, []);

  /* Telemetry rotate */
  useEffect(() => {
    const t = setInterval(() => setTelemetryLine((p) => (p + 1) % TELEMETRY_LINES.length), 2000);
    return () => clearInterval(t);
  }, []);

  /* Satellite orbit animation handled by framer-motion inline */

  /* Policy Protocol */
  const executePolicy = useCallback(() => {
    if (policyPhase === 'idle') { setPolicyPhase('confirm'); return; }
    if (policyPhase === 'confirm') {
      setPolicyPhase('activating');
      setPolicyProgress(0);
      setPolicyStep(0);
      const steps = [0, 33, 66, 100];
      let si = 0;
      const interval = setInterval(() => {
        si++;
        setPolicyStep(si);
        setPolicyProgress(steps[si] ?? 100);
        if (si >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            setPolicyBoost(true);
            setPolicyPhase('done');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 6000);
          }, 500);
        }
      }, 900);
    }
  }, [policyPhase]);

  /* Heat map cells */
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

  const activeScanTarget = SCAN_TARGETS.find((t) => t.id === activeScan);

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={15} />

      {/* Policy success notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0,   x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 glass-premium rounded-2xl px-6 py-4 border border-primary/30 shadow-2xl glow-primary"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Policy Protocol Activated</div>
                <div className="text-xs text-primary font-mono mt-0.5">All 6 environmental metrics updated</div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 w-6 h-6 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Command Center"
          title="Environmental Intelligence Hub"
          description="Monitor Earth from orbit. Run satellite scans. Consult the rule-based AI advisor. Execute planetary policy protocols."
          className="mb-10"
        />

        {/* Stat pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatPill icon={Activity}      label="Earth Health"   value={`${healthScore}%`}                color="#00E5A8" />
          <StatPill icon={Signal}        label="Active Scans"   value={activeScan ? '1' : '0'}           color="#38BDF8" />
          <StatPill icon={AlertTriangle} label="Alerts"         value={`${insights.filter((i) => i.severity === 'high').length}`} color="#FF4D6D" />
          <StatPill icon={Target}        label="Year Projected" value={scenario.year.toString()}          color="#A78BFA" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── SATELLITE SCANNER ── */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Satellite className="w-5 h-5 text-secondary animate-pulse" />
              <h3 className="text-lg font-semibold font-display font-orbitron tracking-wide">Satellite Scanner</h3>
              <Badge variant="secondary" className="ml-auto">
                <span className="status-dot-live mr-1.5" />
                LIVE
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-4">Select a target for orbital spectral analysis</p>

            {/* Scanner viewport */}
            <div className="relative h-[300px] rounded-2xl overflow-hidden glass mb-4 border border-[var(--glass-border)]">
              <div className="absolute inset-0 nasa-grid opacity-40" />
              <div className="scanner-overlay absolute inset-0" />

              {/* Active target telemetry banner */}
              {activeScanTarget && !scanning && (
                <div className="absolute top-3 left-3 right-3 z-20 glass rounded-xl px-3 py-2 border border-primary/20 flex items-center gap-2">
                  <activeScanTarget.icon className="w-4 h-4 flex-shrink-0" style={{ color: activeScanTarget.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-white font-bold truncate">{activeScanTarget.label} · {activeScanTarget.coords}</div>
                    <div className="text-[9px] text-[var(--text-muted)] font-mono truncate">{activeScanTarget.metric}: {Math.round(metrics[activeScanTarget.id as MetricKey] ?? 50)}%</div>
                  </div>
                  <div className="text-[9px] font-mono text-primary font-bold flex-shrink-0">SCAN COMPLETE</div>
                </div>
              )}

              {/* Earth globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-36 h-36">
                  {/* Globe */}
                  <div
                    className="w-36 h-36 rounded-full border border-primary/20"
                    style={{
                      background: activeScan
                        ? `radial-gradient(circle at 35% 35%, ${activeScanTarget?.color ?? '#00E5A8'}22 0%, rgba(10,77,140,0.45) 50%, rgba(4,13,26,0.85) 100%)`
                        : 'radial-gradient(circle at 35% 35%, rgba(0,229,168,0.22) 0%, rgba(10,77,140,0.40) 50%, rgba(4,13,26,0.85) 100%)',
                      transition: 'background 0.8s ease',
                    }}
                  />
                  {/* Grid lines on globe */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 144 144">
                    <ellipse cx="72" cy="72" rx="71" ry="30" stroke="rgba(0,229,168,0.4)" strokeWidth="0.5" fill="none" />
                    <ellipse cx="72" cy="72" rx="71" ry="55" stroke="rgba(0,229,168,0.3)" strokeWidth="0.5" fill="none" />
                    <line x1="72" y1="1" x2="72" y2="143" stroke="rgba(0,229,168,0.3)" strokeWidth="0.5" />
                    <line x1="1"  y1="72" x2="143" y2="72" stroke="rgba(0,229,168,0.3)" strokeWidth="0.5" />
                  </svg>
                  {/* Orbit paths */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 144" style={{ overflow: 'visible' }}>
                    <ellipse cx="72" cy="72" rx="82" ry="32" className="orbit-path" transform="rotate(-20, 72, 72)" />
                    <ellipse cx="72" cy="72" rx="62" ry="26" className="orbit-path" style={{ animationDelay: '-7s' }} transform="rotate(45, 72, 72)" />
                  </svg>
                  {/* Animated satellite 1 */}
                  <motion.div
                    className="absolute rounded-full bg-primary shadow-glow-sm"
                    style={{ width: 10, height: 10, top: '50%', left: '50%', marginTop: -5, marginLeft: -5 }}
                    animate={{
                      x: [82, 0, -82, 0, 82],
                      y: [0, -32, 0, 32, 0],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                  >
                    {/* Satellite body */}
                    <div className="absolute -top-0.5 -left-2 w-4 h-1 bg-primary/60 rounded-sm" />
                    <div className="absolute -top-0.5 left-1.5 w-4 h-1 bg-primary/60 rounded-sm" />
                  </motion.div>
                  {/* Satellite 2 */}
                  <motion.div
                    className="absolute rounded-full bg-secondary"
                    style={{ width: 7, height: 7, top: '50%', left: '50%', marginTop: -3.5, marginLeft: -3.5 }}
                    animate={{
                      x: [-62, 0, 62, 0, -62],
                      y: [0, 26, 0, -26, 0],
                    }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', delay: -2 }}
                  />
                  {/* Radar pulse from active target */}
                  {(scanning || activeScan) && (
                    <motion.div
                      className="absolute rounded-full border"
                      style={{
                        width: 140, height: 140, top: '50%', left: '50%',
                        marginTop: -70, marginLeft: -70,
                        borderColor: activeScanTarget?.color ?? 'var(--primary)',
                      }}
                      animate={{ scale: [0.5, 1.5], opacity: [0.7, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  {/* Data particles during scan */}
                  {scanning && Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`dp-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: 3, height: 3,
                        left: `${30 + i * 12}%`, top: `${40 + i * 6}%`,
                        background: activeScanTarget?.color ?? 'var(--primary)',
                      }}
                      animate={{ y: [-20, -50], opacity: [0.9, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>

              {/* Scan beam */}
              {scanning && (
                <>
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 z-10"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${activeScanTarget?.color ?? 'var(--primary)'}, transparent)`,
                      boxShadow: `0 0 12px ${activeScanTarget?.color ?? 'var(--primary)'}`,
                    }}
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2.5, ease: 'linear' }}
                  />
                  <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1.5 border border-primary/25 z-10 flex items-center gap-1.5 text-[10px] font-mono text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    SCANNING {scanProgress}%
                  </div>
                </>
              )}

              {/* Heat map (post-scan) */}
              {activeScan && !scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-4/5 aspect-square">
                      <div className="grid grid-cols-8 gap-0.5 h-full">
                        {heatCells.map((val, i) => {
                          const tColor = activeScanTarget?.color ?? '#00E5A8';
                          const hexOpacity = Math.round(val * 170).toString(16).padStart(2, '0');
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
                    </div>
                  </div>
                  {/* Scan result overlay */}
                  <div className="absolute bottom-12 inset-x-0 flex justify-center">
                    <ScanResult target={activeScanTarget!} metrics={metrics} />
                  </div>
                </motion.div>
              )}

              {/* Awaiting */}
              {!activeScan && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                      <Radar className="w-10 h-10 text-primary/40 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-xs text-[var(--text-muted)]">Select a target below to begin scanning</p>
                  </div>
                </div>
              )}

              {/* Telemetry stream */}
              <div className="absolute bottom-3 left-3 right-3 z-20">
                {/* Active target telemetry lines */}
                {activeScan && !scanning && activeScanTarget && (
                  <div className="glass rounded-xl px-3 py-2 border border-primary/15 mb-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`tel-${activeScan}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 gap-x-4 gap-y-0.5"
                      >
                        {activeScanTarget.telemetry.map((line, li) => (
                          <div key={li} className="text-[9px] font-mono text-primary/65 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                            {line}
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={telemetryLine}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[9px] font-mono text-primary/45 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/55 flex-shrink-0" />
                    {TELEMETRY_LINES[telemetryLine]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Scan target buttons — all functional */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCAN_TARGETS.map((t) => {
                const Icon = t.icon;
                const isActive   = activeScan === t.id && !scanning;
                const isScanning = activeScan === t.id && scanning;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => !scanning && runScan(t.id)}
                    disabled={scanning}
                    whileHover={!scanning ? { scale: 1.03 } : {}}
                    whileTap={!scanning ? { scale: 0.97 } : {}}
                    className={[
                      'inline-flex items-center gap-2 px-3 min-h-[36px] rounded-xl text-xs font-medium transition-all leading-none',
                      isActive
                        ? 'border border-primary/30 bg-primary/10 text-primary shadow-glow-sm'
                        : isScanning
                        ? 'border border-secondary/30 bg-secondary/10 text-secondary'
                        : 'glass text-[var(--text-muted)] hover:text-[var(--text)] border border-white/5 disabled:opacity-50',
                    ].join(' ')}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.color }} />
                    <span className="truncate">{t.label}</span>
                    {isScanning && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary animate-pulse flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          {/* ── AI ADVISOR ── */}
          <GlassCard className="p-6 glow-primary">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold font-display">AI Environmental Advisor</h3>
              <Badge variant="primary" className="ml-auto">Rule-Based</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">Explainable expert system — fully transparent, no black boxes</p>

            <div className="space-y-3 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence mode="wait">
                {insights.length === 0 ? (
                  <motion.div key="healthy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
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
                    const borderColor = insight.severity === 'high' ? '#FF4D6D' : insight.severity === 'moderate' ? '#FFB830' : '#00E5A8';
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

            {/* ── EXECUTE PLANETARY POLICY PROTOCOL ── */}
            <div className="mt-5 pt-4 border-t border-white/8">
              <AnimatePresence mode="wait">
                {policyPhase === 'idle' && (
                  <motion.button
                    key="idle-btn"
                    onClick={executePolicy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="policy-btn w-full bg-gradient-to-r from-primary/20 to-secondary/15 text-primary border border-primary/30 hover:border-primary/55 hover:bg-primary/25 shadow-glow-sm transition-all"
                  >
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    Execute Planetary Policy Protocol
                  </motion.button>
                )}

                {policyPhase === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-2xl p-4 border border-warning/30 bg-warning/5"
                  >
                    <p className="text-xs font-semibold text-warning mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      Confirm: Execute all 6 environmental protocols?
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={executePolicy}
                        className="flex-1 policy-btn bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirm Activation
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setPolicyPhase('idle')}
                        className="flex-1 policy-btn glass text-[var(--text-muted)] border border-white/10 hover:text-white"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {policyPhase === 'activating' && (
                  <motion.div
                    key="activating"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-4 border border-primary/25 bg-primary/5"
                  >
                    <div className="text-xs font-mono text-primary font-bold mb-3 flex items-center gap-2">
                      <span className="status-dot-live" />
                      POLICY PROTOCOL ACTIVATING…
                    </div>
                    {['Initializing Environmental Directives', 'Deploying Resource Allocation', 'Synchronizing Global Systems'].map((step, si) => (
                      <div key={si} className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                          policyStep > si ? 'bg-primary' : policyStep === si ? 'border border-primary animate-pulse' : 'border border-white/20'
                        }`}>
                          {policyStep > si && <CheckCircle2 className="w-3 h-3 text-ink" />}
                        </div>
                        <span className={`text-[10px] font-mono transition-colors ${
                          policyStep > si ? 'text-primary' : policyStep === si ? 'text-white' : 'text-[var(--text-muted)]'
                        }`}>{step}</span>
                      </div>
                    ))}
                    <div className="h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        animate={{ width: `${policyProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                )}

                {policyPhase === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-2xl p-4 border border-primary/30 bg-primary/8"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="text-sm font-bold text-white">Policy Protocol Activated</span>
                      <span className="text-[9px] font-mono text-primary ml-auto">ALL METRICS UPDATED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {POLICY_EFFECTS.map((effect) => {
                        const Icon = effect.icon;
                        return (
                          <motion.div
                            key={effect.metric}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-white/5"
                          >
                            <Icon className="w-3 h-3 flex-shrink-0" style={{ color: effect.color }} />
                            <span className="text-[9px] text-[var(--text-muted)] truncate flex-1">{effect.metric}</span>
                            <span className="text-[9px] font-bold font-mono" style={{ color: effect.color }}>{effect.delta}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => { setPolicyPhase('idle'); setPolicyBoost(false); setPolicyProgress(0); setPolicyStep(0); }}
                      className="mt-3 w-full text-[10px] text-[var(--text-muted)] hover:text-white transition-colors font-mono"
                    >
                      Reset Protocol
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

        {/* ── FUTURE TIMELINE ── */}
        <div className="mt-8">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold font-display">Future Timeline</h3>
              <Badge variant="default" className="ml-auto">2026 → 2100</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-6">Visual Earth evolution — how decisions shape our planet over decades</p>

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
                    className={[
                      'relative px-5 min-h-[60px] rounded-2xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                      'inline-flex flex-col items-center justify-center gap-1',
                      isSelected
                        ? 'bg-accent/20 text-accent border border-accent/30 shadow-glow'
                        : 'glass text-[var(--text-muted)] hover:text-[var(--text)] border border-white/5',
                    ].join(' ')}
                  >
                    <div className="font-bold font-orbitron text-sm leading-none">{year}</div>
                    <div className="h-1 rounded-full bg-[var(--glass-border)] overflow-hidden w-16 mt-1">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${avgHealth}%`,
                          background: avgHealth > 70 ? '#00E5A8' : avgHealth > 50 ? '#FFB830' : '#FF4D6D',
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
                <div>
                  <Badge variant="secondary" className="mb-3 font-orbitron">{scenario.year}</Badge>
                  <h4 className="text-2xl font-bold font-display mb-2">{scenario.title}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">{scenario.description}</p>

                  <div className="relative h-40 rounded-2xl overflow-hidden">
                    {(() => {
                      const avgHealth = Object.values(scenario.metrics).reduce((a, b) => a + b, 0) / 6;
                      const forestVal = scenario.metrics.forest / 100;
                      const landColor = avgHealth > 70 ? 'rgba(22,101,52,0.8)' : avgHealth > 50 ? 'rgba(133,77,14,0.7)' : 'rgba(87,83,78,0.8)';
                      const skyColor  = scenario.metrics.carbon < 50 ? 'rgba(14,165,233,0.4)' : scenario.metrics.carbon < 65 ? 'rgba(100,116,139,0.5)' : 'rgba(82,82,91,0.6)';
                      return (
                        <>
                          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${skyColor}, ${landColor})` }} />
                          {Array.from({ length: Math.max(1, Math.round(forestVal * 10)) }).map((_, ti) => (
                            <div key={ti} className="absolute bottom-6 flex flex-col items-center"
                              style={{ left: `${4 + ti * (88 / Math.max(1, Math.round(forestVal * 10)))}%` }}>
                              <div className="w-4 h-5 rounded-t-full" style={{ background: avgHealth > 60 ? '#22c55e' : '#78716c' }} />
                              <div className="w-0.5 h-3 bg-amber-900" />
                            </div>
                          ))}
                          {scenario.metrics.carbon < 40 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-2xl" />
                              <div className="absolute bottom-0 left-0 right-0 h-3 bg-white/15 rounded-b-2xl" />
                            </>
                          )}
                          <div className="absolute top-2 left-3 text-white/80 font-bold font-orbitron text-sm">{scenario.year}</div>
                          <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/60">
                            Health: {Math.round(avgHealth)}%
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-3">
                  {(Object.keys(scenario.metrics) as MetricKey[]).map((key) => {
                    const val   = scenario.metrics[key];
                    const color = key === 'carbon' ? '#FF4D6D' : key === 'renewable' || key === 'forest' ? '#00E5A8' : key === 'water' ? '#38BDF8' : key === 'biodiversity' ? '#A78BFA' : '#FFB830';
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (Object.keys(scenario.metrics).indexOf(key)) * 0.06 }}
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

/* ── StatPill ── */
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
        <div className="text-xs text-[var(--text-muted)] mt-1 leading-none">{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Scan Result card ── */
function ScanResult({ target, metrics }: { target: typeof SCAN_TARGETS[number]; metrics: Record<MetricKey, number> }) {
  const metricMap: Record<string, MetricKey> = {
    forest: 'forest', water: 'water', urban: 'renewable', heat: 'air', pollution: 'carbon',
  };
  const val        = Math.round(metrics[metricMap[target.id]] ?? 50);
  const status     = val > 65 ? 'NOMINAL' : val > 40 ? 'MODERATE' : 'CRITICAL';
  const statusColor = val > 65 ? '#00E5A8' : val > 40 ? '#FFB830' : '#FF4D6D';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/10 shadow-lg"
    >
      <target.icon className="w-5 h-5 flex-shrink-0" style={{ color: target.color }} />
      <div>
        <div className="text-xl font-bold font-orbitron leading-none" style={{ color: target.color }}>{val}%</div>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: statusColor }}>{status}</div>
      </div>
      <div className="w-px h-8 bg-white/10 mx-1" />
      <div className="text-[9px] font-mono text-[var(--text-muted)] max-w-[100px] leading-tight">
        {target.desc}
      </div>
    </motion.div>
  );
}
