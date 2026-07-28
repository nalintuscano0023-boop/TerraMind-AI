import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Satellite, Radar, Trees, Droplets, Building2, ThermometerSun, Cloud,
  Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2,
  Activity, Target, Zap,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { CONTROLS, type MetricKey, type ControlKey, TIMELINE_YEARS, TIMELINE_SCENARIOS } from '@/data/environment';
import { computeMetrics, computeHealthScore, generateInsights } from '@/lib/advisorEngine';

const SCAN_TARGETS = [
  { id: 'forest', label: 'Forest Loss', icon: Trees, color: 'var(--primary)', desc: 'Detecting deforestation patterns' },
  { id: 'water', label: 'Water Quality', icon: Droplets, color: 'var(--secondary)', desc: 'Monitoring contamination levels' },
  { id: 'urban', label: 'Urban Growth', icon: Building2, color: 'var(--accent)', desc: 'Tracking city expansion' },
  { id: 'heat', label: 'Heat Islands', icon: ThermometerSun, color: 'var(--warning)', desc: 'Mapping thermal hotspots' },
  { id: 'pollution', label: 'Pollution', icon: Cloud, color: 'var(--danger)', desc: 'Measuring emission density' },
];

const SEVERITY_STYLES = {
  high: { variant: 'danger' as const, icon: AlertTriangle },
  moderate: { variant: 'warning' as const, icon: AlertTriangle },
  low: { variant: 'success' as const, icon: CheckCircle2 },
};

export default function CommandCenter() {
  const [controls] = useState(CONTROLS.map((c) => ({ ...c, value: 50 })));
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [selectedYear, setSelectedYear] = useState(0);

  const metrics = useMemo(() => computeMetrics(controls), [controls]);
  const healthScore = useMemo(() => computeHealthScore(metrics), [metrics]);
  const insights = useMemo(() => generateInsights({ metrics, controls: Object.fromEntries(controls.map((c) => [c.key, c.value])) as Record<ControlKey, number> }), [metrics, controls]);

  const runScan = (id: string) => {
    setActiveScan(id);
    setScanning(true);
    setTimeout(() => setScanning(false), 2500);
  };

  const scenario = TIMELINE_SCENARIOS[selectedYear];

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={20} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Command Center"
          title="Environmental Intelligence Hub"
          description="Monitor Earth from orbit. Run satellite scans. Consult the rule-based AI advisor. Project Earth's future across decades."
          className="mb-10"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatPill icon={Activity} label="Earth Health" value={`${healthScore}%`} color="var(--primary)" />
          <StatPill icon={TrendingUp} label="Active Scans" value={activeScan ? '1' : '0'} color="var(--secondary)" />
          <StatPill icon={AlertTriangle} label="Critical Alerts" value={`${insights.filter((i) => i.severity === 'high').length}`} color="var(--danger)" />
          <StatPill icon={Target} label="Year" value={scenario.year.toString()} color="var(--accent)" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Satellite className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold font-display">Satellite Scanner</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">Select a target to run an orbital scan</p>
            <div className="relative h-[240px] rounded-2xl overflow-hidden glass mb-4">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                {!activeScan && (
                  <div className="text-center text-[var(--text-muted)]">
                    <Radar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Awaiting scan target</p>
                  </div>
                )}
                {activeScan && scanning && (
                  <motion.div
                    className="absolute inset-0"
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-primary shadow-glow"
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2.5, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30"
                      animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="glass rounded-full px-4 py-2 text-xs text-primary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Scanning {SCAN_TARGETS.find((t) => t.id === activeScan)?.label}...
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeScan && !scanning && (
                  <ScanResult target={SCAN_TARGETS.find((t) => t.id === activeScan)!} metrics={metrics} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCAN_TARGETS.map((t) => {
                const Icon = t.icon;
                const isActive = activeScan === t.id && !scanning;
                return (
                  <button
                    key={t.id}
                    onClick={() => runScan(t.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive ? 'glass text-primary' : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: t.color }} />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
          <GlassCard className="p-6" glow="primary">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold font-display">AI Environmental Advisor</h3>
              <Badge variant="primary" className="ml-auto">Rule-Based</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-5">Explainable expert system — no external AI APIs</p>

            <div className="space-y-3 max-h-[340px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence mode="wait">
                {insights.length === 0 ? (
                  <motion.div
                    key="healthy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium">All systems nominal</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">No critical environmental alerts</p>
                  </motion.div>
                ) : (
                  insights.map((insight, i) => {
                    const sev = SEVERITY_STYLES[insight.severity];
                    const SevIcon = sev.icon;
                    return (
                      <motion.div
                        key={`${insight.metric}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={sev.variant}>
                            <SevIcon className="w-3 h-3" />
                            {insight.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-[var(--text-muted)] capitalize">{insight.metric}</span>
                        </div>
                        <p className="text-sm font-medium mb-2">{insight.problem}</p>
                        <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                          <p><span className="text-[var(--text)] font-medium">Cause:</span> {insight.cause}</p>
                          <p><span className="text-[var(--text)] font-medium">Impact:</span> {insight.impact}</p>
                          <p className="flex items-start gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span><span className="text-primary font-medium">Solution:</span> {insight.solution}</span>
                          </p>
                          <p className="flex items-start gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                            <span><span className="text-secondary font-medium">Benefit:</span> {insight.benefit}</span>
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
        <div className="mt-8">
          <GlassCard className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold font-display">Future Timeline</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-6">Projected environmental changes from 2026 to 2100</p>
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
              {TIMELINE_YEARS.map((year, i) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedYear === i ? 'bg-accent/20 text-accent' : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div>
                  <Badge variant="secondary" className="mb-3">{scenario.year}</Badge>
                  <h4 className="text-2xl font-bold font-display mb-2">{scenario.title}</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{scenario.description}</p>
                </div>
                <div className="space-y-3">
                  {(Object.keys(scenario.metrics) as MetricKey[]).map((key) => {
                    const val = scenario.metrics[key];
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-muted)] capitalize">{key}</span>
                          <span className="font-medium">{val}%</span>
                        </div>
                        <ProgressBar
                          value={val}
                          color={key === 'carbon' ? 'var(--danger)' : 'var(--primary)'}
                          height={6}
                        />
                      </div>
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
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-4.5 h-4.5" style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-bold font-display leading-none">{value}</div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
      </div>
    </div>
  );
}

function ScanResult({ target, metrics }: { target: typeof SCAN_TARGETS[number]; metrics: Record<MetricKey, number> }) {
  const metricMap: Record<string, MetricKey> = {
    forest: 'forest',
    water: 'water',
    urban: 'renewable',
    heat: 'air',
    pollution: 'carbon',
  };
  const val = Math.round(metrics[metricMap[target.id]] ?? 50);
  const status = val > 60 ? 'Healthy' : val > 40 ? 'Moderate' : 'Critical';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4"
    >
      <target.icon className="w-12 h-12 mb-3" style={{ color: target.color }} />
      <div className="text-3xl font-bold font-display" style={{ color: target.color }}>{val}%</div>
      <div className="text-sm font-medium mt-1">{status}</div>
      <p className="text-xs text-[var(--text-muted)] mt-2 text-center max-w-xs">{target.desc}</p>
      <div className="mt-3 w-full max-w-xs">
        <ProgressBar value={val} color={target.color} height={6} />
      </div>
    </motion.div>
  );
}
