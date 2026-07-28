import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Factory, Car, Recycle, Trash2,
  Waves, Fish, Rabbit, Turtle, Leaf,
  CloudRain, CloudSnow, CloudFog, Zap, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { GlassCard, SectionTitle, CircularProgress, Badge, Tooltip } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { CONTROLS, METRIC_META, type ControlKey, type MetricKey } from '@/data/environment';
import { computeMetrics, computeHealthScore } from '@/lib/advisorEngine';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Weather = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';

const SEASONS: { key: Season; label: string; icon: typeof Trees; color: string }[] = [
  { key: 'spring', label: 'Spring', icon: Leaf, color: '#10B981' },
  { key: 'summer', label: 'Summer', icon: Sun, color: '#F59E0B' },
  { key: 'autumn', label: 'Autumn', icon: Trees, color: '#EA580C' },
  { key: 'winter', label: 'Winter', icon: CloudSnow, color: '#38BDF8' },
];

const WEATHERS: { key: Weather; label: string; icon: typeof Cloud }[] = [
  { key: 'clear', label: 'Clear', icon: Sun },
  { key: 'rain', label: 'Rain', icon: CloudRain },
  { key: 'storm', label: 'Storm', icon: Zap },
  { key: 'snow', label: 'Snow', icon: CloudSnow },
  { key: 'fog', label: 'Fog', icon: CloudFog },
];

const WILDLIFE = [
  { name: 'Birds', icon: Bird, factor: 'biodiversity' },
  { name: 'Fish', icon: Fish, factor: 'water' },
  { name: 'Butterflies', icon: Leaf, factor: 'forest' },
  { name: 'Bees', icon: Zap, factor: 'biodiversity' },
  { name: 'Deer', icon: Rabbit, factor: 'forest' },
  { name: 'Turtles', icon: Turtle, factor: 'water' },
];

const METRIC_COLORS: Record<MetricKey, string> = {
  forest: 'var(--primary)',
  water: 'var(--secondary)',
  air: 'var(--warning)',
  carbon: 'var(--danger)',
  biodiversity: 'var(--accent)',
  renewable: 'var(--primary)',
};

export default function Simulation() {
  const [controls, setControls] = useState(CONTROLS.map((c) => ({ ...c })));
  const [season, setSeason] = useState<Season>('spring');
  const [weather, setWeather] = useState<Weather>('clear');
  const [droneMode, setDroneMode] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo(() => computeMetrics(controls), [controls]);
  const healthScore = useMemo(() => computeHealthScore(metrics), [metrics]);

  const updateControl = (key: ControlKey, value: number) => {
    setControls((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };

  const resetControls = () => setControls(CONTROLS.map((c) => ({ ...c, value: 50 })));

  const ecosystemHealth = (metrics.forest + metrics.water + metrics.biodiversity) / 3;
  const isPolluted = ecosystemHealth < 45;

  const seasonColors: Record<Season, string> = {
    spring: 'from-green-500/10 to-primary/5',
    summer: 'from-yellow-500/10 to-orange-500/5',
    autumn: 'from-orange-600/10 to-red-500/5',
    winter: 'from-blue-500/10 to-cyan-500/5',
  };

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={20} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Environmental Simulation"
          title="Simulate Earth's Future"
          description="Adjust environmental policies and watch ecosystems respond in real time. Every control updates the planet instantly."
          className="mb-10"
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 relative overflow-hidden min-h-[400px]" ref={sectionRef}>
              <div className={`absolute inset-0 bg-gradient-to-br ${seasonColors[season]} transition-all duration-1000`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold font-display">Living Ecosystem</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {isPolluted ? 'Ecosystem under stress' : 'Healthy ecosystem thriving'}
                    </p>
                  </div>
                  <Badge variant={isPolluted ? 'danger' : 'success'}>
                    {isPolluted ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {Math.round(ecosystemHealth)}% Health
                  </Badge>
                </div>
                <div className="relative h-[280px] rounded-2xl overflow-hidden glass">
                  <EcosystemScene health={ecosystemHealth} season={season} weather={weather} droneMode={droneMode} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Season</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {SEASONS.map((s) => {
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.key}
                            onClick={() => setSeason(s.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                              season === s.key ? 'glass text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Weather</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {WEATHERS.map((w) => {
                        const Icon = w.icon;
                        return (
                          <button
                            key={w.key}
                            onClick={() => setWeather(w.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                              weather === w.key ? 'glass text-secondary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDroneMode((d) => !d)}
                  className={`mt-4 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    droneMode ? 'bg-secondary/20 text-secondary' : 'glass text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Waves className="w-4 h-4" />
                  {droneMode ? 'Drone Mode Active — Aerial View' : 'Enable Drone Mode'}
                </button>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold font-display mb-4">Wildlife Population</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WILDLIFE.map((w) => {
                  const Icon = w.icon;
                  const factor = w.factor as MetricKey;
                  const pop = Math.round(metrics[factor]);
                  return (
                    <div key={w.name} className="glass rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{w.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{pop}% population</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold font-display mb-4">Ocean Health</h3>
              <OceanVisualization water={metrics.water} biodiversity={metrics.biodiversity} />
            </GlassCard>
          </div>
          <div className="space-y-6">
            <GlassCard className="p-6 text-center" glow="primary">
              <h3 className="text-lg font-semibold font-display mb-1">Earth Health</h3>
              <p className="text-xs text-[var(--text-muted)] mb-5">Live planetary dashboard</p>
              <CircularProgress
                value={healthScore}
                size={140}
                strokeWidth={10}
                color={healthScore > 60 ? 'var(--primary)' : healthScore > 40 ? 'var(--warning)' : 'var(--danger)'}
                label={`${healthScore}`}
                sublabel="Overall Score"
              />
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                {(Object.keys(metrics) as MetricKey[]).map((key) => {
                  const meta = METRIC_META[key];
                  const val = Math.round(metrics[key]);
                  return (
                    <div key={key} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                      <span className="text-xs text-[var(--text-muted)]">{meta.label}</span>
                      <span className="text-xs font-semibold" style={{ color: METRIC_COLORS[key] }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-display">Policy Controls</h3>
                <button onClick={resetControls} className="text-xs text-[var(--text-muted)] hover:text-primary transition-colors">
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                {controls.map((c) => {
                  const Icon = iconMap[c.icon] ?? Trees;
                  return (
                    <div key={c.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Tooltip content={c.description}>
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="w-4 h-4 text-primary" />
                            {c.label}
                          </span>
                        </Tooltip>
                        <span className="text-xs font-mono text-[var(--text-muted)]">{c.value}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={c.value}
                        onChange={(e) => updateControl(c.key, Number(e.target.value))}
                        className="w-full accent-[var(--primary)] cursor-pointer"
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

function EcosystemScene({ health, season, weather, droneMode }: { health: number; season: Season; weather: Weather; droneMode: boolean }) {
  const healthy = health > 55;
  const trees = healthy ? 8 : 4;
  const skyColor = healthy
    ? season === 'autumn' ? 'from-orange-400/30 to-amber-200/20' : 'from-sky-400/20 to-primary/10'
    : 'from-gray-700/30 to-gray-900/20';

  return (
    <div className={`relative w-full h-full bg-gradient-to-b ${skyColor} transition-all duration-1000 ${droneMode ? 'scale-150' : ''}`}>
      <WeatherOverlay weather={weather} />

      <motion.div
        className="absolute top-6 right-8 w-12 h-12 rounded-full"
        style={{ background: healthy ? 'radial-gradient(circle, #FBBF24, #F59E0B)' : 'radial-gradient(circle, #6B7280, #4B5563)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-1000"
        style={{
          background: healthy
            ? 'linear-gradient(to bottom, #166534, #14532D)'
            : 'linear-gradient(to bottom, #57534E, #292524)',
        }}
      />
      {Array.from({ length: trees }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[20%]"
          style={{ left: `${8 + i * 11}%` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Tree healthy={healthy} season={season} />
        </motion.div>
      ))}
      {!healthy &&
        Array.from({ length: 3 }).map((_, i) => (
          <div key={`dead-${i}`} className="absolute bottom-[18%]" style={{ left: `${30 + i * 20}%` }}>
            <DeadTree />
          </div>
        ))}
      <div
        className="absolute bottom-[15%] left-0 right-0 h-2 rounded-full transition-all duration-1000"
        style={{ background: healthy ? 'linear-gradient(to right, #38BDF8, #0EA5E9)' : '#52525B' }}
      />
      {healthy && (
        <>
          <motion.div
            className="absolute top-10 left-1/4"
            animate={{ x: [0, 100, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <Bird className="w-5 h-5 text-primary/60" />
          </motion.div>
          <motion.div
            className="absolute top-16 left-1/2"
            animate={{ x: [0, -80, 0], y: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Bird className="w-4 h-4 text-primary/40" />
          </motion.div>
        </>
      )}
      {!healthy && (
        <div className="absolute inset-0 bg-gray-600/20 backdrop-blur-[2px]" />
      )}
      {droneMode && (
        <motion.div
          className="absolute top-2 left-2 glass rounded-full px-2 py-1 text-[10px] text-secondary flex items-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Waves className="w-3 h-3" /> DRONE
        </motion.div>
      )}
    </div>
  );
}

function Tree({ healthy, season }: { healthy: boolean; season: Season }) {
  const leafColor = !healthy ? '#57534E' : season === 'autumn' ? '#EA580C' : season === 'winter' ? '#94A3B8' : '#16A34A';
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-8 h-8 rounded-full"
        style={{ background: leafColor }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
      />
      <div className="w-1.5 h-6 bg-amber-900 rounded-full" />
    </div>
  );
}

function DeadTree() {
  return (
    <div className="flex flex-col items-center opacity-60">
      <div className="w-6 h-6 rounded-full bg-gray-600" />
      <div className="w-1 h-6 bg-gray-700" />
    </div>
  );
}

function WeatherOverlay({ weather }: { weather: Weather }) {
  if (weather === 'clear') return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {weather === 'rain' &&
        Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-4 bg-secondary/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: '-10px' }}
            animate={{ y: ['0vh', '100vh'] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: Math.random() * 1 }}
          />
        ))}
      {weather === 'snow' &&
        Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/60 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: '-10px' }}
            animate={{ y: ['0vh', '100vh'], x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      {weather === 'fog' && <div className="absolute inset-0 bg-gray-400/20 backdrop-blur-sm" />}
      {weather === 'storm' && (
        <>
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-5 bg-secondary/50 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: '-10px' }}
              animate={{ y: ['0vh', '100vh'] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: Math.random() * 0.5 }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          />
        </>
      )}
    </div>
  );
}

function OceanVisualization({ water, biodiversity }: { water: number; biodiversity: number }) {
  const healthy = water > 55;
  return (
    <div className="relative h-[200px] rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: healthy
            ? 'linear-gradient(to bottom, #0EA5E9/30, #0369A1/40, #082F49)'
            : 'linear-gradient(to bottom, #52525B/30, #3F3F46/40, #18181B)',
        }}
      />      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{ top: `${30 + i * 20}%`, background: healthy ? 'rgba(255,255,255,0.2)' : 'rgba(100,100,100,0.2)' }}
          animate={{ x: ['-50%', '50%', '-50%'] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}      {healthy &&
        Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: `${50 + i * 8}%` }}
            animate={{ x: ['-10vw', '110vw'] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i }}
          >
            <Fish className="w-4 h-4 text-primary/50" />
          </motion.div>
        ))}      {!healthy &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gray-300/40 rounded-sm"
            style={{ top: `${40 + Math.random() * 40}%`, left: `${Math.random() * 90}%` }}
          />
        ))}
      <div className="absolute bottom-2 left-3 flex gap-3 text-xs">
        <span className="text-white/80">Water: {Math.round(water)}%</span>
        <span className="text-white/80">Marine Life: {Math.round(biodiversity)}%</span>
      </div>
    </div>
  );
}
