import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Trees, Droplets, Wind, Cloud, Sun, Factory, Car, Recycle, Trash2,
  CloudRain, CloudSnow, CloudFog, Zap, AlertTriangle, CheckCircle2,
  Plane, Moon, Sunset, Leaf
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, Tooltip, Slider } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { CONTROLS, type ControlKey } from '@/data/environment';
import { computeMetrics } from '@/lib/advisorEngine';
import { EnvironmentScene, WildlifeScene, type DayCycle, type Season, type Weather } from '@/components/simulation';

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

export default function Simulation() {
  const [controls, setControls]     = useState(CONTROLS.map((c) => ({ ...c })));
  const [dayCycle, setDayCycle]     = useState<DayCycle>('day');
  const [season, setSeason]         = useState<Season>('spring');
  const [weather, setWeather]       = useState<Weather>('clear');
  const [droneMode, setDroneMode]   = useState(false);
  const [droneAltitude, setDroneAltitude] = useState(120);
  const sectionRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => computeMetrics(controls), [controls]);

  const updateControl = (key: ControlKey, value: number) => {
    setControls((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };
  const resetControls = () => setControls(CONTROLS.map((c) => ({ ...c, value: 50 })));

  const ecosystemHealth = (metrics.forest + metrics.water + metrics.biodiversity) / 3;
  const isPolluted = ecosystemHealth < 45;

  const treeDensity  = controls.find((c) => c.key === 'trees')?.value ?? 50;
  const factoryLevel = controls.find((c) => c.key === 'factories')?.value ?? 50;
  const solarLevel   = controls.find((c) => c.key === 'solar')?.value ?? 50;
  const windLevel    = controls.find((c) => c.key === 'wind')?.value ?? 50;
  const plasticLevel = 100 - (controls.find((c) => c.key === 'plastic')?.value ?? 50);

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        <SectionTitle
          eyebrow="Environmental Simulation Engine"
          title="Simulate Earth's Ecological Future"
          description="Interactive dual-engine digital twin platform: Environment & Climate Simulator and Species Habitat Simulator."
          className="mb-6 sm:mb-8"
        />

        {/* =========================================================
           SCREEN 1 — ENVIRONMENT SIMULATOR
           ========================================================= */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <span>Screen 1 — Planetary Environment Simulator</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl">
                Controls planetary lighting, seasonal transitions, and atmospheric weather protocols in real time.
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <Badge variant={isPolluted ? 'danger' : 'success'} className="text-xs font-mono">
                {isPolluted ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {Math.round(ecosystemHealth)}% Planetary Health
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Environment Canvas Box */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-4 sm:p-6 relative overflow-hidden min-h-[380px] sm:min-h-[440px] border-primary/20" ref={sectionRef}>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mb-3 sm:mb-4 relative z-10">
                  <h3 className="text-sm sm:text-base font-bold font-display text-white">Planetary Climate Viewport</h3>
                  <div className="text-[11px] sm:text-xs font-mono text-primary">
                    {dayCycle.toUpperCase()} | {season.toUpperCase()} | {weather.toUpperCase()}
                  </div>
                </div>

                {/* Environment Canvas Viewport */}
                <div className="relative h-[260px] xs:h-[300px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <EnvironmentScene
                    dayCycle={dayCycle}
                    season={season}
                    weather={weather}
                    treeDensity={treeDensity}
                    factoryLevel={factoryLevel}
                    solarLevel={solarLevel}
                    windLevel={windLevel}
                    plasticLevel={plasticLevel}
                    droneMode={droneMode}
                    droneAltitude={droneAltitude}
                    health={ecosystemHealth}
                  />

                  {/* Active Environment Telemetry Status Badge */}
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-30 bg-black/75 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/15 text-[10px] sm:text-[11px] font-mono font-bold text-white flex items-center gap-1.5 sm:gap-2 shadow-xl max-w-[90%] sm:max-w-none overflow-hidden">
                    <span className="truncate">{dayCycle === 'night' ? '🌙' : dayCycle === 'sunset' ? '🌇' : dayCycle === 'sunrise' ? '🌅' : '☀️'} {DAY_CYCLES.find((d) => d.key === dayCycle)?.label}</span>
                    <span className="text-white/30">|</span>
                    <span className="truncate">{season === 'winter' ? '❄️' : season === 'autumn' ? '🍂' : season === 'summer' ? '☀️' : '🌸'} {SEASONS.find((s) => s.key === season)?.label}</span>
                    <span className="text-white/30">|</span>
                    <span className="truncate">{weather === 'storm' ? '⚡' : weather === 'rain' ? '🌧️' : weather === 'snow' ? '❄️' : weather === 'fog' ? '🌫️' : '☀️'} {WEATHERS.find((w) => w.key === weather)?.label}</span>
                  </div>

                  {/* Drone Telemetry Overlay */}
                  {droneMode && (
                    <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-30 bg-black/75 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-secondary/40 text-[10px] sm:text-[11px] font-mono text-secondary flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 animate-pulse" />
                      <span>ALT: <strong>{droneAltitude}m</strong></span>
                    </div>
                  )}
                </div>

                {/* Day / Season / Weather Controls */}
                <div className="mt-4 sm:mt-5 space-y-3 relative z-10">
                  {/* Day Cycle Selector */}
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 font-mono font-semibold">
                      1. Time of Day Lighting
                    </div>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {DAY_CYCLES.map((d) => {
                        const Icon = d.icon;
                        const isActive = dayCycle === d.key;
                        return (
                          <button
                            key={d.key}
                            onClick={() => setDayCycle(d.key)}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-semibold transition-all border ${
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

                  {/* Seasons + Weather Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5 font-mono font-semibold">
                        2. Season Phase
                      </div>
                      <div className="flex gap-1 sm:gap-1.5 flex-wrap">
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
                      <div className="flex gap-1 sm:gap-1.5 flex-wrap">
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
                    {droneMode ? '🎥 Drone Flight Active (WASD/Arrows)' : '🚁 Engage Drone Camera Flight'}
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Policy Controls Panel */}
            <div>
              <GlassCard className="p-4 sm:p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold font-display text-white">Policy Controls</h3>
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
        </section>

        {/* =========================================================
           SCREEN 2 — WILDLIFE SIMULATOR
           ========================================================= */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <WildlifeScene />
        </section>
      </div>

      <Footer />
    </div>
  );
}

const iconMap: Record<string, typeof Trees> = {
  Trees, Droplets, Wind, Sun, Factory, Car, Recycle, Trash2, Cloud,
};
