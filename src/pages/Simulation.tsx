import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Factory, Car, Recycle, Trash2,
  Rabbit, Turtle, Leaf,
  CloudRain, CloudSnow, CloudFog, Zap, AlertTriangle, CheckCircle2,
  Plane, Moon, Sunset
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, Tooltip, Slider, WildlifeCanvas } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { CONTROLS, type ControlKey, type MetricKey } from '@/data/environment';
import { computeMetrics } from '@/lib/advisorEngine';

type DayCycle = 'sunrise' | 'day' | 'sunset' | 'night';
type Season   = 'spring' | 'summer' | 'autumn' | 'winter';
type Weather  = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';
type WildlifeMode = 'none' | 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle';

const DAY_CYCLES: { key: DayCycle; label: string; icon: typeof Sun; color: string }[] = [
  { key: 'sunrise', label: 'Sunrise', icon: Sunset, color: '#F59E0B' },
  { key: 'day',     label: 'Day',     icon: Sun,    color: '#38BDF8' },
  { key: 'sunset',  label: 'Sunset',  icon: Sunset, color: '#EA580C' },
  { key: 'night',   label: 'Night',   icon: Moon,   color: '#7C3AED' },
];

const SEASONS: { key: Season; label: string; icon: typeof Trees; color: string }[] = [
  { key: 'spring', label: 'Spring', icon: Leaf,      color: '#10B981' },
  { key: 'summer', label: 'Summer', icon: Sun,       color: '#F59E0B' },
  { key: 'autumn', label: 'Autumn', icon: Trees,     color: '#EA580C' },
  { key: 'winter', label: 'Winter', icon: CloudSnow, color: '#38BDF8' },
];

const WEATHERS: { key: Weather; label: string; icon: typeof Cloud; color: string }[] = [
  { key: 'clear', label: 'Clear',  icon: Sun,       color: '#F59E0B' },
  { key: 'rain',  label: 'Rain',   icon: CloudRain, color: '#38BDF8' },
  { key: 'storm', label: 'Storm',  icon: Zap,       color: '#EF4444' },
  { key: 'snow',  label: 'Snow',   icon: CloudSnow, color: '#BAE6FD' },
  { key: 'fog',   label: 'Fog',    icon: CloudFog,  color: '#94A3B8' },
];

const WILDLIFE: { key: WildlifeMode; name: string; icon: typeof Bird; factor: MetricKey; description: string }[] = [
  { key: 'bird',      name: 'Birds',       icon: Bird,   factor: 'biodiversity', description: 'Soaring migratory flocks' },
  { key: 'fish',      name: 'Fish',        icon: Fish,   factor: 'water',        description: 'Darting marine schools' },
  { key: 'butterfly', name: 'Butterflies', icon: Leaf,   factor: 'forest',       description: 'Fluttering over flora' },
  { key: 'bee',       name: 'Bees',        icon: Zap,    factor: 'biodiversity', description: 'Pollinating ecosystems' },
  { key: 'deer',      name: 'Deer',        icon: Rabbit, factor: 'forest',       description: 'Forest glade herbivores' },
  { key: 'turtle',    name: 'Turtles',     icon: Turtle, factor: 'water',        description: 'Oceanic coral divers' },
];

export default function Simulation() {
  const [controls, setControls]     = useState(CONTROLS.map((c) => ({ ...c })));
  const [dayCycle, setDayCycle]     = useState<DayCycle>('day');
  const [season, setSeason]         = useState<Season>('spring');
  const [weather, setWeather]       = useState<Weather>('clear');
  const [droneMode, setDroneMode]   = useState(false);
  const [droneAltitude, setDroneAltitude] = useState(120);
  const [wildlifeMode, setWildlifeMode]   = useState<WildlifeMode>('none');
  const sectionRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => computeMetrics(controls), [controls]);

  const updateControl = (key: ControlKey, value: number) => {
    setControls((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };
  const resetControls = () => setControls(CONTROLS.map((c) => ({ ...c, value: 50 })));

  const ecosystemHealth = (metrics.forest + metrics.water + metrics.biodiversity) / 3;
  const isPolluted = ecosystemHealth < 45;

  const treeDensity   = controls.find((c) => c.key === 'trees')?.value ?? 50;
  const factoryLevel  = controls.find((c) => c.key === 'factories')?.value ?? 50;
  const solarLevel    = controls.find((c) => c.key === 'solar')?.value ?? 50;
  const windLevel     = controls.find((c) => c.key === 'wind')?.value ?? 50;
  const plasticLevel  = 100 - (controls.find((c) => c.key === 'plastic')?.value ?? 50);

  // Keyboard navigation listener for Drone Mode WASD
  useEffect(() => {
    if (!droneMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'ArrowUp') setDroneAltitude((a) => Math.min(500, a + 15));
      if (e.key === 's' || e.key === 'ArrowDown') setDroneAltitude((a) => Math.max(20, a - 15));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [droneMode]);

  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Environmental Simulation Engine"
          title="Simulate Earth's Ecological Future"
          description="Adjust environmental policies, time cycles, seasons, and weather to observe planetary ecosystem responses in real time."
          className="mb-8"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Ecosystem Viewport Card */}
            <GlassCard className="p-6 relative overflow-hidden min-h-[440px] border-primary/20" ref={sectionRef}>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Living Ecosystem Digital Twin</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {isPolluted ? '⚠ Ecosystem under critical stress — adjust policy sliders' : '✓ Ecosystem operating within safe planetary boundaries'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isPolluted ? 'danger' : 'success'}>
                    {isPolluted ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {Math.round(ecosystemHealth)}% Health
                  </Badge>
                </div>
              </div>

              {/* Viewport Box */}
              <div className="relative h-[340px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* 2D/3D Procedural Ecosystem Viewport */}
                <EcosystemViewport
                  dayCycle={dayCycle}
                  season={season}
                  weather={weather}
                  droneMode={droneMode}
                  droneAltitude={droneAltitude}
                  treeDensity={treeDensity}
                  factoryLevel={factoryLevel}
                  solarLevel={solarLevel}
                  windLevel={windLevel}
                  plasticLevel={plasticLevel}
                  health={ecosystemHealth}
                />

                {/* Procedural Canvas Wildlife Viewport Overlay */}
                <WildlifeCanvas type={wildlifeMode} />

                {/* Drone Telemetry Overlay */}
                {droneMode && (
                  <div className="absolute top-3 right-3 z-30 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-secondary/40 text-[11px] font-mono text-secondary flex items-center gap-2">
                    <Plane className="w-3.5 h-3.5 animate-pulse" />
                    DRONE ALTITUDE: <strong>{droneAltitude}m</strong> (Use WASD / Arrow Keys)
                  </div>
                )}
              </div>

              {/* Day Cycle + Season + Weather Selectors */}
              <div className="mt-5 space-y-3 relative z-10">
                {/* Day Cycle Selector */}
                <div>
                  <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 font-mono font-semibold">
                    1. Day Cycle Lighting
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {DAY_CYCLES.map((d) => {
                      const Icon = d.icon;
                      const isActive = dayCycle === d.key;
                      return (
                        <button
                          key={d.key}
                          onClick={() => setDayCycle(d.key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isActive
                              ? 'bg-primary/20 text-primary border-primary/40 shadow-glow'
                              : 'glass text-[var(--text-muted)] hover:text-white border-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seasons + Weather Selectors Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 font-mono font-semibold">
                      2. Environmental Season
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {SEASONS.map((s) => {
                        const Icon = s.icon;
                        const isActive = season === s.key;
                        return (
                          <button
                            key={s.key}
                            onClick={() => setSeason(s.key)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                              isActive
                                ? 'bg-secondary/20 text-secondary border-secondary/40'
                                : 'glass text-[var(--text-muted)] hover:text-white border-white/5'
                            }`}
                          >
                            <Icon className="w-3 h-3" style={{ color: s.color }} />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 font-mono font-semibold">
                      3. Weather Protocol
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {WEATHERS.map((w) => {
                        const Icon = w.icon;
                        const isActive = weather === w.key;
                        return (
                          <button
                            key={w.key}
                            onClick={() => setWeather(w.key)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                              isActive
                                ? 'bg-warning/20 text-warning border-warning/40'
                                : 'glass text-[var(--text-muted)] hover:text-white border-white/5'
                            }`}
                          >
                            <Icon className="w-3 h-3" style={{ color: w.color }} />
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drone Mode Control Bar */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setDroneMode((d) => !d)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    droneMode
                      ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-glow'
                      : 'glass text-[var(--text-muted)] hover:text-white border-white/10'
                  }`}
                >
                  <Plane className="w-4 h-4" />
                  {droneMode ? '🎥 Cinematic Drone Mode Active (WASD Controls)' : '🚁 Engage Cinematic Drone Mode'}
                </button>
              </div>
            </GlassCard>

            {/* Wildlife Mode Panel (No Emojis) */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bird className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold font-display text-white">Realistic Wildlife Mode</h3>
                </div>
                <Badge variant="secondary">Canvas Telemetry</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {WILDLIFE.map((w) => {
                  const isActive = wildlifeMode === w.key;
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.key}
                      onClick={() => setWildlifeMode(isActive ? 'none' : w.key)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        isActive
                          ? 'bg-primary/20 text-primary border-primary/40 shadow-glow scale-105'
                          : 'glass border-white/5 text-[var(--text-muted)] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-mono font-bold text-white">{Math.round(metrics[w.factor])}%</span>
                      </div>
                      <div className="font-bold text-xs text-white">{w.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-1">{w.description}</div>
                    </button>
                  );
                })}
              </div>

              {wildlifeMode !== 'none' && (
                <div className="flex items-center justify-between text-xs text-primary font-mono glass p-2.5 rounded-xl border border-primary/20">
                  <span>Active Species Tracking: <strong>{wildlifeMode.toUpperCase()}</strong></span>
                  <button onClick={() => setWildlifeMode('none')} className="hover:underline text-[var(--text-muted)]">Clear Camera</button>
                </div>
              )}
            </GlassCard>
          </div>

          {/* ===== RIGHT COLUMN: POLICY CONTROLS ===== */}
          <div>
            <GlassCard className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold font-display text-white">Policy Controls</h3>
                <button
                  onClick={resetControls}
                  className="text-xs text-[var(--text-muted)] hover:text-primary transition-colors px-3 py-1 rounded-xl glass border border-white/10 font-semibold"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-4">
                {controls.map((c) => {
                  const Icon = iconMap[c.icon] ?? Trees;
                  const impactColor = Object.values(c.impact).some((v) => (v ?? 0) > 0) ? '#00E5A8' : '#EF4444';
                  return (
                    <div key={c.key} className="glass rounded-xl p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <Tooltip content={c.description}>
                          <span className="flex items-center gap-2 text-xs font-semibold text-white cursor-help">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                            {c.label}
                          </span>
                        </Tooltip>
                        <span className="text-xs font-mono tabular-nums font-bold" style={{ color: impactColor }}>{c.value}</span>
                      </div>
                      <Slider
                        value={c.value}
                        min={0}
                        max={100}
                        onChange={(val) => updateControl(c.key, val)}
                        aria-label={c.label}
                      />
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
   PROCEDURAL ECOSYSTEM VIEWPORT COMPONENT
   ========================================================= */
function EcosystemViewport({
  dayCycle,
  season,
  weather,
  droneMode,
  droneAltitude,
  treeDensity,
  factoryLevel,
  solarLevel,
  windLevel,
  plasticLevel,
  health,
}: {
  dayCycle: DayCycle;
  season: Season;
  weather: Weather;
  droneMode: boolean;
  droneAltitude: number;
  treeDensity: number;
  factoryLevel: number;
  solarLevel: number;
  windLevel: number;
  plasticLevel: number;
  health: number;
}) {
  const isHealthy = health > 50;
  const numTrees = Math.max(2, Math.round((treeDensity / 100) * 14));

  // Day Cycle Background Sky Gradients
  const skyGradients: Record<DayCycle, string> = {
    sunrise: 'from-amber-700/60 via-orange-500/40 to-slate-900',
    day:     'from-sky-500/40 via-blue-400/20 to-slate-900',
    sunset:  'from-rose-800/60 via-purple-700/40 to-slate-900',
    night:   'from-indigo-950/90 via-slate-950 to-[#040d1a]',
  };

  const groundColors: Record<Season, string> = {
    spring: isHealthy ? 'linear-gradient(to bottom, #166534, #14532D)' : 'linear-gradient(to bottom, #44403C, #292524)',
    summer: isHealthy ? 'linear-gradient(to bottom, #15803D, #052E16)' : 'linear-gradient(to bottom, #57534E, #1C1917)',
    autumn: isHealthy ? 'linear-gradient(to bottom, #92400E, #78350F)' : 'linear-gradient(to bottom, #44403C, #292524)',
    winter: 'linear-gradient(to bottom, #94A3B8, #64748B)',
  };

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b ${skyGradients[dayCycle]} transition-all duration-1000 overflow-hidden`}
      style={{
        transform: droneMode ? `scale(${1 + (500 - droneAltitude) / 1000})` : 'scale(1)',
      }}
    >
      {/* Stars in Night Cycle */}
      {dayCycle === 'night' && (
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white animate-pulse"
              style={{
                top: `${(i * 17) % 60}%`,
                left: `${(i * 23) % 95}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun / Moon Orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: dayCycle === 'night' ? 36 : 48,
          height: dayCycle === 'night' ? 36 : 48,
          top: dayCycle === 'sunrise' || dayCycle === 'sunset' ? '45%' : '15%',
          right: '15%',
          background: dayCycle === 'night'
            ? 'radial-gradient(circle, #F0F6FF, #94A3B8)'
            : dayCycle === 'sunset'
            ? 'radial-gradient(circle, #F97316, #DC2626)'
            : 'radial-gradient(circle, #FBBF24, #F59E0B)',
          boxShadow: dayCycle === 'night' ? '0 0 20px rgba(240,246,255,0.4)' : '0 0 40px rgba(251,191,36,0.6)',
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Storm Lightning Flash Effect */}
      {weather === 'storm' && (
        <motion.div
          className="absolute inset-0 bg-white/20 pointer-events-none z-20"
          animate={{ opacity: [0, 0.8, 0, 0.6, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Volumetric Fog Layer */}
      {weather === 'fog' && (
        <div className="absolute inset-0 bg-slate-400/30 backdrop-blur-sm z-10 pointer-events-none" />
      )}

      {/* Ground Terrain Layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-1000"
        style={{ background: groundColors[season] }}
      />

      {/* Snow Layer in Winter */}
      {season === 'winter' && (
        <div className="absolute bottom-[33%] left-0 right-0 h-3 bg-slate-100/90 shadow-sm" />
      )}

      {/* Water River Strip */}
      <div
        className="absolute bottom-[16%] left-0 right-0 h-3 overflow-hidden shadow-inner"
        style={{
          background: plasticLevel > 60
            ? 'linear-gradient(90deg, #475569, #334155)'
            : 'linear-gradient(90deg, #38BDF8, #0284C7)',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Industrial Factory Smoke */}
      {factoryLevel > 30 && (
        <div className="absolute bottom-[33%] right-[10%] flex flex-col items-center">
          <div className="w-8 h-10 bg-slate-700 border border-slate-600 rounded-t-sm shadow-lg flex items-center justify-center text-[10px] font-mono text-slate-400">🏭</div>
          {Array.from({ length: Math.round((factoryLevel / 100) * 3) }).map((_, i) => (
            <motion.div
              key={`smoke-${i}`}
              className="absolute -top-6 w-5 h-5 rounded-full bg-slate-400/40 blur-sm"
              animate={{ y: [-10, -40], opacity: [0.6, 0], scale: [0.8, 1.8] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}
        </div>
      )}
      {Array.from({ length: numTrees }).map((_, i) => (
        <motion.div
          key={`tree-${i}`}
          className="absolute bottom-[20%]"
          style={{ left: `${4 + i * (90 / numTrees)}%` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <TreeGraphic healthy={isHealthy} season={season} />
        </motion.div>
      ))}

      {/* Renewable Solar Panels */}
      {solarLevel > 30 && Array.from({ length: Math.round((solarLevel / 100) * 4) }).map((_, i) => (
        <div key={`solar-${i}`} className="absolute bottom-[34%]" style={{ left: `${12 + i * 16}%` }}>
          <div className="w-8 h-4 bg-sky-600 border border-sky-300 rounded-sm transform -skew-x-12 shadow-md" />
        </div>
      ))}

      {/* Wind Turbines */}
      {windLevel > 30 && Array.from({ length: Math.round((windLevel / 100) * 3) }).map((_, i) => (
        <div key={`turbine-${i}`} className="absolute bottom-[33%]" style={{ left: `${22 + i * 24}%` }}>
          <div className="w-1 h-12 bg-gray-200 mx-auto" />
          <motion.div
            className="w-8 h-8 rounded-full border-t-2 border-r-2 border-white -mt-14 -ml-3.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5 - (windLevel / 100), repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ))}
    </div>
  );
}

function TreeGraphic({ healthy, season }: { healthy: boolean; season: Season }) {
  const foliageColor = season === 'autumn' ? '#EA580C' : season === 'winter' ? '#94A3B8' : healthy ? '#166534' : '#78350F';
  return (
    <div className="flex flex-col items-center">
      <div className="w-6 h-8 rounded-t-full shadow-md" style={{ backgroundColor: foliageColor }} />
      <div className="w-1.5 h-4 bg-amber-900" />
    </div>
  );
}
