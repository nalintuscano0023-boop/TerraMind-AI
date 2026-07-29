import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Factory, Car, Recycle, Trash2,
  Waves, Fish, Rabbit, Turtle, Leaf,
  CloudRain, CloudSnow, CloudFog, Zap, AlertTriangle, CheckCircle2,
  Plane, Camera, Eye,
} from 'lucide-react';
import { GlassCard, SectionTitle, CircularProgress, Badge, Tooltip } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { CONTROLS, METRIC_META, type ControlKey, type MetricKey } from '@/data/environment';
import { computeMetrics, computeHealthScore } from '@/lib/advisorEngine';

type Season  = 'spring' | 'summer' | 'autumn' | 'winter';
type Weather = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';
type WildlifeMode = 'none' | 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle';

const SEASONS: { key: Season; label: string; icon: typeof Trees; color: string; emoji: string }[] = [
  { key: 'spring', label: 'Spring', icon: Leaf,      color: '#10B981', emoji: '🌱' },
  { key: 'summer', label: 'Summer', icon: Sun,       color: '#F59E0B', emoji: '☀️' },
  { key: 'autumn', label: 'Autumn', icon: Trees,     color: '#EA580C', emoji: '🍂' },
  { key: 'winter', label: 'Winter', icon: CloudSnow, color: '#38BDF8', emoji: '❄️' },
];

const WEATHERS: { key: Weather; label: string; icon: typeof Cloud; color: string }[] = [
  { key: 'clear', label: 'Clear',  icon: Sun,      color: '#F59E0B' },
  { key: 'rain',  label: 'Rain',   icon: CloudRain, color: '#38BDF8' },
  { key: 'storm', label: 'Storm',  icon: Zap,       color: '#EF4444' },
  { key: 'snow',  label: 'Snow',   icon: CloudSnow, color: '#BAE6FD' },
  { key: 'fog',   label: 'Fog',    icon: CloudFog,  color: '#94A3B8' },
];

const WILDLIFE: { key: WildlifeMode; name: string; icon: typeof Bird; factor: MetricKey; description: string; emoji: string }[] = [
  { key: 'bird',      name: 'Birds',       icon: Bird,   factor: 'biodiversity', description: 'Migratory flocks soar over forests', emoji: '🦅' },
  { key: 'fish',      name: 'Fish',        icon: Fish,   factor: 'water',        description: 'Schools dart through coral reefs',   emoji: '🐟' },
  { key: 'butterfly', name: 'Butterflies', icon: Leaf,   factor: 'forest',       description: 'Gliding over spring flower fields',   emoji: '🦋' },
  { key: 'bee',       name: 'Bees',        icon: Zap,    factor: 'biodiversity', description: 'Pollinating forest ecosystems',       emoji: '🐝' },
  { key: 'deer',      name: 'Deer',        icon: Rabbit, factor: 'forest',       description: 'Roaming through ancient forests',     emoji: '🦌' },
  { key: 'turtle',    name: 'Turtles',     icon: Turtle, factor: 'water',        description: 'Deep ocean exploration mode',         emoji: '🐢' },
];

const METRIC_COLORS: Record<MetricKey, string> = {
  forest: '#00E5A8', water: '#38BDF8', air: '#F59E0B',
  carbon: '#EF4444', biodiversity: '#7C3AED', renewable: '#00E5A8',
};

export default function Simulation() {
  const [controls, setControls] = useState(CONTROLS.map((c) => ({ ...c })));
  const [season, setSeason]     = useState<Season>('spring');
  const [weather, setWeather]   = useState<Weather>('clear');
  const [droneMode, setDroneMode] = useState(false);
  const [wildlifeMode, setWildlifeMode] = useState<WildlifeMode>('none');
  const sectionRef = useRef<HTMLDivElement>(null);

  const metrics     = useMemo(() => computeMetrics(controls), [controls]);
  const healthScore = useMemo(() => computeHealthScore(metrics), [metrics]);

  const updateControl = (key: ControlKey, value: number) => {
    setControls((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };
  const resetControls = () => setControls(CONTROLS.map((c) => ({ ...c, value: 50 })));

  const ecosystemHealth = (metrics.forest + metrics.water + metrics.biodiversity) / 3;
  const isPolluted = ecosystemHealth < 45;

  // Derived visual params from controls
  const treeDensity   = controls.find((c) => c.key === 'trees')?.value ?? 50;
  const factoryLevel  = controls.find((c) => c.key === 'factories')?.value ?? 50;
  const solarLevel    = controls.find((c) => c.key === 'solar')?.value ?? 50;
  const windLevel     = controls.find((c) => c.key === 'wind')?.value ?? 50;
  const plasticLevel  = 100 - (controls.find((c) => c.key === 'plastic')?.value ?? 50);

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={15} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Environmental Simulation"
          title="Simulate Earth's Future"
          description="Adjust environmental policies and watch ecosystems respond in real time. Every slider transforms the planet."
          className="mb-10"
        />
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Ecosystem Viewport */}
            <GlassCard className="p-6 relative overflow-hidden min-h-[420px]" ref={sectionRef}>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-semibold font-display">Living Ecosystem</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {isPolluted ? '⚠ Ecosystem under stress — adjust policies' : '✓ Ecosystem thriving'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isPolluted ? 'danger' : 'success'}>
                    {isPolluted ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {Math.round(ecosystemHealth)}% Health
                  </Badge>
                </div>
              </div>

              {/* Ecosystem Viewport */}
              <div className="relative h-[320px] rounded-2xl overflow-hidden">
                <EcosystemScene
                  health={ecosystemHealth}
                  season={season}
                  weather={weather}
                  droneMode={droneMode}
                  wildlifeMode={wildlifeMode}
                  treeDensity={treeDensity}
                  factoryLevel={factoryLevel}
                  solarLevel={solarLevel}
                  windLevel={windLevel}
                  plasticLevel={plasticLevel}
                />
              </div>

              {/* Season + Weather + Drone Controls */}
              <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2 font-medium">Season</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {SEASONS.map((s) => {
                      return (
                        <motion.button
                          key={s.key}
                          onClick={() => setSeason(s.key)}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            season === s.key
                              ? 'glass border border-primary/30 text-primary shadow-glow'
                              : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                          }`}
                        >
                          <span>{s.emoji}</span>
                          {s.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2 font-medium">Weather</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {WEATHERS.map((w) => {
                      const Icon = w.icon;
                      return (
                        <motion.button
                          key={w.key}
                          onClick={() => setWeather(w.key)}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            weather === w.key
                              ? 'glass border border-secondary/30 text-secondary'
                              : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: w.color }} />
                          {w.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setDroneMode((d) => !d)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-4 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  droneMode
                    ? 'bg-secondary/15 text-secondary border border-secondary/30'
                    : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {droneMode ? <Camera className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                {droneMode ? '🎥 Drone Mode Active — Cinematic View' : '🚁 Enable Drone Mode'}
              </motion.button>
            </GlassCard>

            {/* Wildlife Panel */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bird className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold font-display">Wildlife Mode</h3>
                <Badge variant="secondary" className="ml-auto">Interactive</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {WILDLIFE.map((w) => {
                  const pop  = Math.round(metrics[w.factor]);
                  const isActive = wildlifeMode === w.key;
                  return (
                    <motion.button
                      key={w.key}
                      onClick={() => setWildlifeMode(isActive ? 'none' : w.key)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`glass rounded-xl p-3 text-left transition-all ${
                        isActive ? 'border border-primary/40 bg-primary/5 shadow-glow' : 'hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{w.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{w.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{pop}% habitat</div>
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-[var(--glass-border)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          animate={{ width: `${pop}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {wildlifeMode !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass rounded-xl p-3 flex items-center gap-3 border border-primary/20"
                  >
                    <span className="text-2xl">{WILDLIFE.find((w) => w.key === wildlifeMode)?.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-primary">{WILDLIFE.find((w) => w.key === wildlifeMode)?.name} Mode Active</div>
                      <div className="text-xs text-[var(--text-muted)]">{WILDLIFE.find((w) => w.key === wildlifeMode)?.description}</div>
                    </div>
                    <Eye className="w-4 h-4 text-primary ml-auto flex-shrink-0 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Ocean Visualization */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5 text-secondary" /> Ocean Health
              </h3>
              <OceanVisualization water={metrics.water} biodiversity={metrics.biodiversity} plasticLevel={plasticLevel} />
            </GlassCard>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* Earth Health Score */}
            <GlassCard className="p-6 text-center glow-primary">
              <h3 className="text-lg font-semibold font-display mb-1">Earth Health</h3>
              <p className="text-xs text-[var(--text-muted)] mb-5">Live planetary dashboard</p>
              <CircularProgress
                value={healthScore}
                size={150}
                strokeWidth={10}
                color={healthScore > 60 ? '#00E5A8' : healthScore > 40 ? '#F59E0B' : '#EF4444'}
                label={`${healthScore}`}
                sublabel="Overall Score"
              />
              <div className="mt-5 space-y-2 text-left">
                {(Object.keys(metrics) as MetricKey[]).map((key) => {
                  const meta = METRIC_META[key];
                  const val  = Math.round(metrics[key]);
                  const color = METRIC_COLORS[key];
                  return (
                    <div key={key} className="glass rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--text-muted)]">{meta.label}</span>
                        <span className="text-xs font-semibold font-mono" style={{ color }}>{val}</span>
                      </div>
                      <div className="h-1 rounded-full bg-[var(--glass-border)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          animate={{ width: `${Math.min(val, 100)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Policy Controls */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-display">Policy Controls</h3>
                <button
                  onClick={resetControls}
                  className="text-xs text-[var(--text-muted)] hover:text-primary transition-colors px-2 py-1 rounded glass"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-5">
                {controls.map((c) => {
                  const Icon = iconMap[c.icon] ?? Trees;
                  const impactColor = Object.values(c.impact).some((v) => (v ?? 0) > 0) ? '#00E5A8' : '#EF4444';
                  return (
                    <div key={c.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Tooltip content={c.description}>
                          <span className="flex items-center gap-2 text-sm font-medium cursor-help">
                            <Icon className="w-4 h-4 text-primary" />
                            {c.label}
                          </span>
                        </Tooltip>
                        <span className="text-xs font-mono tabular-nums" style={{ color: impactColor }}>{c.value}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={c.value}
                          onChange={(e) => updateControl(c.key, Number(e.target.value))}
                          className="w-full cursor-pointer h-2 rounded-full appearance-none"
                          style={{ accentColor: 'var(--primary)' }}
                          aria-label={c.label}
                        />
                        {/* Visual fill overlay */}
                        <div
                          className="absolute top-0 left-0 h-2 rounded-full pointer-events-none"
                          style={{
                            width: `${c.value}%`,
                            background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
                            opacity: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const iconMap: Record<string, typeof Trees> = {
  Trees, Droplets, Wind, Sun, Factory, Car, Recycle, Trash2, Cloud,
};

/* =========================================================
   ECOSYSTEM SCENE
   ========================================================= */
function EcosystemScene({
  health, season, weather, droneMode, wildlifeMode,
  treeDensity, factoryLevel, solarLevel, windLevel, plasticLevel,
}: {
  health: number;
  season: Season;
  weather: Weather;
  droneMode: boolean;
  wildlifeMode: WildlifeMode;
  treeDensity: number;
  factoryLevel: number;
  solarLevel: number;
  windLevel: number;
  plasticLevel: number;
}) {
  const healthy = health > 50;
  const numTrees = Math.max(2, Math.round((treeDensity / 100) * 12));

  const skyColors: Record<Season, Record<Weather, string>> = {
    spring: { clear: 'from-sky-400/30 via-emerald-300/10 to-transparent', rain: 'from-slate-600/40 via-slate-700/30 to-transparent', storm: 'from-slate-800/60 via-gray-900/40 to-transparent', snow: 'from-blue-300/30 via-slate-400/20 to-transparent', fog: 'from-gray-400/40 via-gray-500/30 to-transparent' },
    summer: { clear: 'from-sky-300/35 via-blue-200/15 to-transparent',    rain: 'from-slate-500/40 via-slate-600/30 to-transparent', storm: 'from-slate-900/70 via-gray-800/50 to-transparent', snow: 'from-blue-200/30 via-slate-300/20 to-transparent', fog: 'from-gray-300/50 via-gray-400/35 to-transparent' },
    autumn: { clear: 'from-orange-400/30 via-amber-300/15 to-transparent', rain: 'from-orange-800/40 via-gray-700/30 to-transparent', storm: 'from-gray-900/70 via-orange-900/40 to-transparent', snow: 'from-blue-400/30 via-slate-500/20 to-transparent', fog: 'from-orange-200/40 via-gray-400/30 to-transparent' },
    winter: { clear: 'from-blue-200/25 via-slate-300/15 to-transparent',  rain: 'from-slate-600/40 via-slate-700/30 to-transparent', storm: 'from-slate-900/65 via-blue-900/45 to-transparent', snow: 'from-blue-100/35 via-slate-200/20 to-transparent', fog: 'from-white/20 via-gray-300/30 to-transparent' },
  };

  const groundColors: Record<Season, string> = {
    spring: healthy ? 'linear-gradient(to bottom, #166534, #14532D)' : 'linear-gradient(to bottom, #44403C, #292524)',
    summer: healthy ? 'linear-gradient(to bottom, #14532D, #052e16)' : 'linear-gradient(to bottom, #44403C, #1C1917)',
    autumn: healthy ? 'linear-gradient(to bottom, #92400E, #78350F)' : 'linear-gradient(to bottom, #57534E, #44403C)',
    winter: 'linear-gradient(to bottom, #CBD5E1, #94A3B8)',
  };

  const isUnderwater = wildlifeMode === 'fish' || wildlifeMode === 'turtle';

  return (
    <motion.div
      className={`relative w-full h-full bg-gradient-to-b ${skyColors[season][weather]} transition-all duration-1500`}
      animate={{ scale: droneMode ? 1.18 : 1, y: droneMode ? '-5%' : '0%' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Underwater overlay */}
      <AnimatePresence>
        {isUnderwater && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-20"
            style={{ background: 'linear-gradient(to bottom, rgba(7,89,133,0.85), rgba(2,44,73,0.95))' }}
          >
            <UnderwaterScene biodiversity={80} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather overlay */}
      <WeatherOverlay weather={weather} />

      {/* Sun / Moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: weather === 'storm' ? 0 : 48,
          height: weather === 'storm' ? 0 : 48,
          top: 20,
          right: 40,
          background: season === 'winter'
            ? 'radial-gradient(circle, #E8F4FF, #BAE6FD)'
            : 'radial-gradient(circle, #FBBF24, #F59E0B)',
          boxShadow: weather === 'clear' ? '0 0 30px rgba(251,191,36,0.5)' : 'none',
        }}
        animate={{ opacity: weather === 'storm' ? 0 : [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-1000"
        style={{ background: groundColors[season] }}
      />

      {/* Snow cover on ground (winter) */}
      {season === 'winter' && (
        <div
          className="absolute bottom-[33%] left-0 right-0 h-4 transition-all duration-1000"
          style={{ background: 'linear-gradient(to bottom, rgba(240,249,255,0.95), rgba(186,230,255,0.7))' }}
        />
      )}

      {/* Water / River strip */}
      <motion.div
        className="absolute bottom-[17%] left-0 right-0 h-2 rounded-full overflow-hidden"
        style={{
          background: plasticLevel > 60
            ? 'linear-gradient(90deg, #52525B, #3F3F46)'
            : season === 'winter'
            ? 'linear-gradient(90deg, #93C5FD, #60A5FA)'
            : 'linear-gradient(90deg, #38BDF8, #0EA5E9)',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Trees */}
      {Array.from({ length: numTrees }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[22%]"
          style={{ left: `${5 + i * (85 / numTrees)}%` }}
          initial={{ opacity: 0, scaleY: 0, originY: 1 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 150 }}
        >
          <Tree healthy={healthy} season={season} size={i % 3 === 0 ? 'lg' : i % 2 === 0 ? 'md' : 'sm'} />
        </motion.div>
      ))}

      {/* Factory smoke */}
      {factoryLevel > 40 && Array.from({ length: Math.round((factoryLevel / 100) * 3) }).map((_, i) => (
        <motion.div key={`factory-${i}`} className="absolute bottom-[32%]" style={{ left: `${60 + i * 12}%` }}>
          <FactorySmoke intensity={factoryLevel} />
        </motion.div>
      ))}

      {/* Solar panels */}
      {solarLevel > 30 && Array.from({ length: Math.round((solarLevel / 100) * 4) }).map((_, i) => (
        <motion.div
          key={`solar-${i}`}
          className="absolute bottom-[34%]"
          style={{ left: `${10 + i * 18}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <SolarPanel />
        </motion.div>
      ))}

      {/* Wind turbines */}
      {windLevel > 30 && Array.from({ length: Math.round((windLevel / 100) * 3) }).map((_, i) => (
        <motion.div
          key={`wind-${i}`}
          className="absolute bottom-[32%]"
          style={{ left: `${20 + i * 25}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}
        >
          <WindTurbine />
        </motion.div>
      ))}

      {/* Plastic debris in river */}
      {plasticLevel > 50 && Array.from({ length: Math.round((plasticLevel / 100) * 6) }).map((_, i) => (
        <motion.div
          key={`plastic-${i}`}
          className="absolute w-2.5 h-2.5 rounded-sm opacity-70"
          style={{
            bottom: `${16 + Math.random() * 3}%`,
            left: `${Math.random() * 90}%`,
            background: ['#94A3B8', '#CBD5E1', '#64748B'][i % 3],
          }}
          animate={{ x: [0, 20, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Wildlife: Birds */}
      {(wildlifeMode === 'bird' || (healthy && wildlifeMode === 'none')) && (
        <>
          {Array.from({ length: wildlifeMode === 'bird' ? 6 : 2 }).map((_, i) => (
            <motion.div
              key={`bird-${i}`}
              className="absolute text-sm"
              style={{ top: `${10 + i * 8}%` }}
              animate={{ x: ['-10%', '110%'] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
            >
              🦅
            </motion.div>
          ))}
        </>
      )}

      {/* Wildlife: Butterflies */}
      {wildlifeMode === 'butterfly' && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`butterfly-${i}`}
          className="absolute text-sm"
          style={{ top: `${20 + (i % 4) * 15}%`, left: `${10 + (i % 5) * 18}%` }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        >
          🦋
        </motion.div>
      ))}

      {/* Wildlife: Deer */}
      {wildlifeMode === 'deer' && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`deer-${i}`}
          className="absolute text-2xl bottom-[24%]"
          style={{ left: `${20 + i * 25}%` }}
          animate={{ x: [0, 15, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 1.2 }}
        >
          🦌
        </motion.div>
      ))}

      {/* Wildlife: Bees */}
      {wildlifeMode === 'bee' && Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`bee-${i}`}
          className="absolute text-xs"
          style={{ top: `${25 + (i % 5) * 12}%`, left: `${8 + (i % 6) * 15}%` }}
          animate={{
            x: [0, 20, -10, 5, 0],
            y: [0, -15, 5, -8, 0],
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.3 }}
        >
          🐝
        </motion.div>
      ))}

      {/* Heat haze (summer, clear) */}
      {season === 'summer' && weather === 'clear' && (
        <div className="absolute bottom-[30%] left-0 right-0 h-8 animate-haze pointer-events-none opacity-30"
          style={{ background: 'linear-gradient(to top, rgba(251,191,36,0.2), transparent)' }}
        />
      )}

      {/* Drone mode UI */}
      {droneMode && (
        <>
          <motion.div
            className="absolute top-2 left-2 glass rounded-lg px-2 py-1.5 text-[9px] font-mono text-secondary border border-secondary/30 z-30"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              DRONE CAM
            </div>
            <div>ALT 250m · ZOOM 2.4x</div>
          </motion.div>
          <div className="absolute top-2 right-2 glass rounded-lg px-2 py-1.5 text-[9px] font-mono text-primary border border-primary/30 z-30">
            <div>LAT 23.4°N</div>
            <div>LON 72.8°E</div>
          </div>
          {/* Cinematic letterbox bars */}
          <div className="cinematic-bar-top" />
          <div className="cinematic-bar-bottom" />
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-1/2 w-px h-4 bg-secondary/50 -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-px h-4 bg-secondary/50 -translate-x-1/2" />
              <div className="absolute left-0 top-1/2 w-4 h-px bg-secondary/50 -translate-y-1/2" />
              <div className="absolute right-0 top-1/2 w-4 h-px bg-secondary/50 -translate-y-1/2" />
              <div className="absolute inset-3 rounded-full border border-secondary/40" />
            </div>
          </div>
        </>
      )}

      {/* Polluted overlay */}
      {!healthy && !isUnderwater && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: 'rgba(120, 80, 40, 0.18)', backdropFilter: 'blur(1px)' }}
        />
      )}
    </motion.div>
  );
}

/* ---- Sub-components ---- */
function Tree({ healthy, season, size = 'md' }: { healthy: boolean; season: Season; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: { top: 'w-5 h-5', trunk: 'w-1 h-4' }, md: { top: 'w-7 h-7', trunk: 'w-1.5 h-5' }, lg: { top: 'w-10 h-10', trunk: 'w-2 h-7' } };
  const { top, trunk } = sizes[size];
  const leafColor = !healthy
    ? '#57534E'
    : season === 'autumn'
    ? ['#EA580C', '#DC2626', '#D97706'][Math.floor(Math.random() * 3)]
    : season === 'winter'
    ? '#E2E8F0'
    : season === 'summer'
    ? '#166534'
    : '#22C55E';
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`${top} rounded-full`}
        style={{ background: leafColor }}
        animate={{ scale: [1, 1.04, 1], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4 + Math.random() * 2, repeat: Infinity }}
      />
      {season === 'winter' && (
        <motion.div className={`w-0.5 ${size === 'lg' ? 'h-6' : 'h-4'} bg-blue-100/60 rounded-full mt-0.5`} />
      )}
      <div className={`${trunk} bg-amber-900 rounded-full`} />
    </div>
  );
}

function FactorySmoke({ intensity }: { intensity: number }) {
  const numPuffs = Math.ceil(intensity / 35);
  return (
    <div className="relative w-4">
      <div className="w-4 h-8 bg-gray-600/60 rounded-sm" />
      {Array.from({ length: numPuffs }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: 10 + i * 4, height: 10 + i * 4, bottom: '100%', left: '50%', x: '-50%', background: `rgba(100,100,100,${0.6 - i * 0.15})` }}
          animate={{ y: [0, -(30 + i * 20)], opacity: [0.7, 0], scale: [0.8, 1.4] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function SolarPanel() {
  return (
    <motion.div
      className="w-6 h-4 rounded-sm"
      style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', border: '1px solid rgba(59,130,246,0.5)' }}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

function WindTurbine() {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative w-6 h-6 mb-0.5"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={deg}
            className="absolute w-1 h-3 rounded-full bg-slate-300/80"
            style={{ transformOrigin: '50% 100%', transform: `rotate(${deg}deg) translateX(-50%)`, left: '50%', bottom: '50%' }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
      <div className="w-0.5 h-8 bg-slate-400/60" />
    </div>
  );
}

function WeatherOverlay({ weather }: { weather: Weather }) {
  if (weather === 'clear') return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Storm clouds */}
      {(weather === 'storm' || weather === 'rain') && (
        <div className="absolute top-0 left-0 right-0 h-20"
          style={{ background: weather === 'storm' ? 'linear-gradient(to bottom, rgba(30,30,40,0.85), transparent)' : 'linear-gradient(to bottom, rgba(60,70,90,0.7), transparent)' }}
        />
      )}
      {/* Rain */}
      {(weather === 'rain' || weather === 'storm') &&
        Array.from({ length: weather === 'storm' ? 40 : 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1.5,
              height: weather === 'storm' ? 18 : 12,
              left: `${Math.random() * 100}%`,
              top: -20,
              background: 'rgba(147,197,253,0.5)',
            }}
            animate={{ y: '110vh', opacity: [0.7, 0.4] }}
            transition={{ duration: weather === 'storm' ? 0.35 : 0.55, repeat: Infinity, delay: Math.random() * 1.5, ease: 'linear' }}
          />
        ))}
      {/* Lightning */}
      {weather === 'storm' && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{ opacity: [0, 0, 0.4, 0, 0.2, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 + Math.random() * 4 }}
        />
      )}
      {/* Snow */}
      {weather === 'snow' &&
        Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/80"
            style={{ width: 3 + Math.random() * 3, height: 3 + Math.random() * 3, left: `${Math.random() * 100}%`, top: -10 }}
            animate={{ y: '105vh', x: [0, 15, -10, 0] }}
            transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4, ease: 'easeIn' }}
          />
        ))}
      {/* Fog */}
      {weather === 'fog' && (
        <>
          <div className="absolute inset-0 bg-gray-400/25 backdrop-blur-[2px]" />
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(200,210,220,0.15), transparent 60%)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </>
      )}
    </div>
  );
}

function UnderwaterScene({ biodiversity }: { biodiversity: number }) {
  const numFish = Math.max(3, Math.round((biodiversity / 100) * 10));
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Caustics */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,229,168,0.3) 0%, transparent 40%)' }}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {/* Fish schools */}
      {Array.from({ length: numFish }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          style={{ top: `${20 + i * 9}%` }}
          animate={{ x: ['-15vw', '115vw'] }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, delay: i * 1, ease: 'linear' }}
        >
          🐟
        </motion.div>
      ))}
      {/* Coral */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-around">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} className="text-2xl" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }}>
            {['🪸','🌿','🌊','🐠','🪸','🌿','🐡','🦀'][i % 8]}
          </motion.div>
        ))}
      </div>
      {/* Turtle */}
      <motion.div
        className="absolute text-3xl"
        style={{ top: '40%' }}
        animate={{ x: ['-5vw', '110vw'], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 15, repeat: Infinity, delay: 3, ease: 'linear' }}
      >
        🐢
      </motion.div>
    </div>
  );
}

function OceanVisualization({ water, biodiversity, plasticLevel }: { water: number; biodiversity: number; plasticLevel: number }) {
  const healthy = water > 55;
  const polluted = plasticLevel > 60;
  return (
    <div className="relative h-[200px] rounded-2xl overflow-hidden">
      <motion.div
        className="absolute inset-0 transition-all duration-1000"
        animate={{
          background: polluted
            ? 'linear-gradient(to bottom, rgba(82,82,91,0.5), rgba(39,39,42,0.7), #18181B)'
            : healthy
            ? 'linear-gradient(to bottom, rgba(14,165,233,0.4), rgba(3,105,161,0.6), #082F49)'
            : 'linear-gradient(to bottom, rgba(82,82,91,0.3), rgba(63,63,70,0.5), #18181B)',
        }}
        transition={{ duration: 1.5 }}
      />
      {/* Wave lines */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{ top: `${20 + i * 18}%`, background: healthy && !polluted ? 'rgba(255,255,255,0.2)' : 'rgba(100,100,100,0.15)' }}
          animate={{ x: ['-60%', '60%', '-60%'] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Fish */}
      {healthy && !polluted && Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} className="absolute text-sm" style={{ top: `${45 + i * 7}%` }}
          animate={{ x: ['-10vw', '120vw'] }}
          transition={{ duration: 7 + i * 1.5, repeat: Infinity, delay: i * 1.2, ease: 'linear' }}>
          🐟
        </motion.div>
      ))}
      {/* Plastic debris */}
      {polluted && Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute w-3 h-3 bg-gray-300/50 rounded-sm"
          style={{ top: `${35 + Math.random() * 50}%`, left: `${Math.random() * 90}%` }} />
      ))}
      {/* Coral if healthy */}
      {!polluted && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-around px-4">
          {['🪸', '🌿', '🐠', '🪸', '🌊', '🦈'].map((em, i) => (
            <motion.span key={i} className="text-base" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity }}>
              {em}
            </motion.span>
          ))}
        </div>
      )}
      {/* Labels */}
      <div className="absolute bottom-2 right-3 flex flex-col items-end gap-1 text-[10px] font-mono">
        <span className={`${healthy ? 'text-sky-300' : 'text-gray-400'}`}>Water: {Math.round(water)}%</span>
        <span className={`${biodiversity > 50 ? 'text-emerald-300' : 'text-gray-500'}`}>Marine: {Math.round(biodiversity)}%</span>
      </div>
    </div>
  );
}
