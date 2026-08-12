import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type DayCycle = 'sunrise' | 'day' | 'sunset' | 'night';
export type Season   = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather  = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';

export interface EnvironmentSceneProps {
  dayCycle:          DayCycle;
  season:            Season;
  weather:           Weather;
  treeDensity?:      number; // 0 - 100 (Trees Planted)
  factoryLevel?:     number; // 0 - 100 (Factory Regulation)
  cleanTransport?:   number; // 0 - 100 (Clean Transport)
  solarLevel?:       number; // 0 - 100 (Solar Energy)
  windLevel?:        number; // 0 - 100 (Wind Energy)
  plasticLevel?:     number; // 0 - 100 (Plastic Reduction)
  recyclingRate?:    number; // 0 - 100 (Recycling Rate)
  waterConservation?: number; // 0 - 100 (Water Conservation)
  droneMode?:        boolean;
  droneAltitude?:    number;
  health?:           number;
}

/* ── Sky configs ── */
const SKY_CONFIGS: Record<DayCycle, { gradient: string; ambient: string; horizonGlow?: string }> = {
  sunrise: {
    gradient: 'linear-gradient(to bottom, #1a0a2e 0%, #4a1942 20%, #c25a2a 45%, #f59e0b 65%, #fed7aa 80%, #92400e 100%)',
    ambient:  'rgba(251,146,60,0.18)',
    horizonGlow: 'rgba(251,146,60,0.55)',
  },
  day: {
    gradient: 'linear-gradient(to bottom, #0c2463 0%, #1e3a8a 20%, #1d4ed8 40%, #3b82f6 60%, #7dd3fc 80%, #0f4c81 100%)',
    ambient:  'rgba(56,189,248,0.08)',
  },
  sunset: {
    gradient: 'linear-gradient(to bottom, #0f0620 0%, #4c0519 25%, #9a3412 45%, #ea580c 60%, #f97316 75%, #fbbf24 88%, #7c2d12 100%)',
    ambient:  'rgba(234,88,12,0.22)',
    horizonGlow: 'rgba(251,146,60,0.60)',
  },
  night: {
    gradient: 'linear-gradient(to bottom, #000814 0%, #0a0f2e 30%, #0f172a 60%, #1e293b 80%, #0f2545 100%)',
    ambient:  'rgba(79,70,229,0.08)',
  },
};

/* ── Ground configs ── */
const GROUND_CONFIGS: Record<Season, { healthy: string; degraded: string }> = {
  spring: {
    healthy:  'linear-gradient(to bottom, #16a34a 0%, #166534 40%, #14532d 100%)',
    degraded: 'linear-gradient(to bottom, #57534e 0%, #44403c 100%)',
  },
  summer: {
    healthy:  'linear-gradient(to bottom, #15803d 0%, #14532d 50%, #052e16 100%)',
    degraded: 'linear-gradient(to bottom, #78716c 0%, #57534e 100%)',
  },
  autumn: {
    healthy:  'linear-gradient(to bottom, #a16207 0%, #92400e 40%, #78350f 100%)',
    degraded: 'linear-gradient(to bottom, #44403c 0%, #292524 100%)',
  },
  winter: {
    healthy:  'linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 40%, #64748b 100%)',
    degraded: 'linear-gradient(to bottom, #94a3b8 0%, #64748b 100%)',
  },
};

/* ── Wind turbine rotation speed calculation (0 to 100 slider mapping) ── */
function calculateTurbineSpeed(windLevel: number, weather: Weather): number {
  if (windLevel <= 2) return 0; // stopped
  // Map windLevel 1..100 to rotation duration (seconds per 360deg rotation)
  // 100 -> 0.35s (fast), 50 -> 1.5s (medium), 10 -> 4.5s (slow)
  const baseDuration = 5.0 - (windLevel / 100) * 4.65;
  const weatherMult = weather === 'storm' ? 0.7 : weather === 'rain' ? 0.9 : 1.0;
  return Math.max(0.25, baseDuration * weatherMult);
}

/* ── Tree sway by weather ── */
function treeSway(weather: Weather): { angle: number; duration: number } {
  if (weather === 'storm') return { angle: 14, duration: 0.6 };
  if (weather === 'rain')  return { angle: 5,  duration: 1.6 };
  return { angle: 2, duration: 3.5 };
}

/* ── Deterministic PRNG for star generation ── */
function createPRNG(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let imul = Math.imul(s ^ (s >>> 15), s | 1);
    imul = (imul + Math.imul(imul ^ (imul >>> 7), imul | 61)) ^ imul;
    return ((imul ^ (imul >>> 14)) >>> 0) / 4294967296;
  };
}

interface StarSpec {
  top: string;
  left: string;
  size: number;
  baseOpacity: number;
  minOpacity: number;
  duration: string;
  delay: string;
  boxShadow?: string;
}

function generateNightStars(): StarSpec[] {
  const rng = createPRNG(9876543);
  const stars: StarSpec[] = [];
  const targetCount = 170;

  let attempts = 0;
  while (stars.length < targetCount && attempts < 2500) {
    attempts++;
    const left = 1 + rng() * 97.5;
    const top = 2 + rng() * 52;

    if (top >= 6 && top <= 18 && left >= 81 && left <= 93) continue;

    const r = rng();
    let size: number;
    let baseOpacity: number;
    let minOpacity: number;
    let boxShadow: string | undefined;

    if (r < 0.76) {
      size = 0.8 + rng() * 0.5;
      baseOpacity = 0.22 + rng() * 0.32;
      minOpacity = 0.05 + rng() * 0.12;
      boxShadow = 'none';
    } else if (r < 0.96) {
      size = 1.4 + rng() * 0.6;
      baseOpacity = 0.55 + rng() * 0.22;
      minOpacity = 0.18 + rng() * 0.18;
      boxShadow = '0 0 2px rgba(255,255,255,0.45)';
    } else {
      size = 2.2 + rng() * 0.7;
      baseOpacity = 0.78 + rng() * 0.20;
      minOpacity = 0.30 + rng() * 0.20;
      boxShadow = '0 0 3px rgba(255,255,255,0.7), 0 0 6px rgba(255,255,255,0.25)';
    }

    const duration = `${(2.2 + rng() * 4.3).toFixed(2)}s`;
    const delay = `${(rng() * 4.5).toFixed(2)}s`;

    stars.push({
      top: `${top.toFixed(2)}%`,
      left: `${left.toFixed(2)}%`,
      size,
      baseOpacity,
      minOpacity,
      duration,
      delay,
      boxShadow,
    });
  }

  return stars;
}

function seededVal(seed: number, offset = 0): number {
  return ((Math.sin(seed * 9.721 + offset * 3.14) + 1) / 2);
}

export const EnvironmentScene: React.FC<EnvironmentSceneProps> = ({
  dayCycle,
  season,
  weather,
  treeDensity        = 50,
  factoryLevel       = 50, // Factory Regulation: 100 = Clean, 0 = High Pollution
  cleanTransport     = 50, // Clean Transport
  solarLevel         = 50, // Solar Energy
  windLevel          = 50, // Wind Energy
  plasticLevel       = 50, // Plastic Reduction
  recyclingRate      = 50, // Recycling Rate
  waterConservation  = 50, // Water Conservation
  droneMode          = false,
  droneAltitude      = 120,
  health             = 75,
}) => {
  const isHealthy      = health > 45;
  const sky            = SKY_CONFIGS[dayCycle];
  const ground         = GROUND_CONFIGS[season];
  const sway           = treeSway(weather);
  const turbSpeedSec   = calculateTurbineSpeed(windLevel, weather);

  /* ── Derived Policy Metrics ── */
  const pollutionLevel  = Math.max(0, 100 - factoryLevel); // 0 = Clean, 100 = Max Smog
  const numTrees        = Math.max(2, Math.round((treeDensity / 100) * 26));
  const numTurbines     = windLevel > 8 ? Math.max(1, Math.round((windLevel / 100) * 4)) : 0;
  const numSolar        = solarLevel > 8 ? Math.max(1, Math.round((solarLevel / 100) * 6)) : 0;
  const solarMW         = Math.round((solarLevel / 100) * 140);
  const windMW          = Math.round((windLevel / 100) * 180 * (weather === 'storm' ? 1.2 : weather === 'rain' ? 0.9 : 1.0));
  const riverHeight     = Math.round(5 + (waterConservation / 100) * 11); // 5px (shallow) -> 16px (full capacity)

  /* Stars for night */
  const stars = useMemo(() => generateNightStars(), []);

  /* Trees array (deterministic placement) */
  const trees = useMemo(() => Array.from({ length: numTrees }, (_, i) => {
    const xPos    = 2 + i * (95 / numTrees) + seededVal(i, 10) * (85 / numTrees * 0.35);
    const isFg    = i % 3 === 0;  // foreground
    const isBg    = i % 5 === 4;  // deep background
    const height  = isFg ? 1 + seededVal(i, 11) * 0.4 : isBg ? 0.55 + seededVal(i, 11) * 0.2 : 0.75 + seededVal(i, 11) * 0.35;
    const layer   = isBg ? 'bg' : isFg ? 'fg' : 'mid';
    return { xPos, height, layer, seed: i };
  }), [numTrees]);

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl select-none"
      style={{
        background: sky.gradient,
        transition: 'background 1.5s ease',
        transform: droneMode ? `scale(${1 + (500 - droneAltitude) / 1000})` : 'scale(1)',
        transition2: 'transform 0.6s ease',
      } as React.CSSProperties}
    >
      {/* ── Industrial Smog Haze Overlay (Driven by Factory Regulation) ── */}
      {pollutionLevel > 15 && (
        <div
          className="absolute inset-0 pointer-events-none z-[16] transition-opacity duration-700"
          style={{
            background: `linear-gradient(to bottom, rgba(120, 113, 108, ${(pollutionLevel / 100) * 0.38}), rgba(245, 158, 11, ${(pollutionLevel / 100) * 0.22}))`,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* ── Ambient glow overlay (time of day) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: sky.ambient,
          transition: 'background 1.5s ease',
        }}
      />

      {/* ── Horizon glow (sunrise / sunset) ── */}
      {sky.horizonGlow && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-[2]"
          style={{
            bottom: '28%',
            height: '120px',
            background: `radial-gradient(ellipse at 50% 100%, ${sky.horizonGlow} 0%, transparent 70%)`,
            transition: 'background 1.5s ease',
          }}
        />
      )}

      {/* ── Stars (night) ── */}
      <AnimatePresence>
        {dayCycle === 'night' && (
          <motion.div
            key="stars"
            className="absolute inset-0 pointer-events-none z-[3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {stars.map((star, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: star.boxShadow,
                  animationName: 'starTwinkle',
                  animationDuration: star.duration,
                  animationDelay: star.delay,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                  '--star-base-opacity': star.baseOpacity,
                  '--star-min-opacity': star.minOpacity,
                } as React.CSSProperties & Record<string, string | number | undefined>}
              />
            ))}
            {/* Moon */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 38, height: 38,
                top: '10%', right: '12%',
                background: 'radial-gradient(circle at 35% 35%, #F0F6FF 0%, #94A3B8 60%, #64748B 100%)',
                boxShadow: '0 0 30px rgba(148,163,184,0.6), 0 0 60px rgba(148,163,184,0.2)',
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Fireflies (spring / summer) */}
            {season !== 'winter' && Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={`ff-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 3, height: 3,
                  left: `${(i * 19 + 5) % 88}%`,
                  top:  `${50 + (i * 13) % 35}%`,
                  background: '#FDE68A',
                  boxShadow: '0 0 6px #FDE68A',
                }}
                animate={{ x: [-8, 8, -8], y: [-6, 6, -6], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 2.5 + (i % 3) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sun (day / sunrise / sunset) ── */}
      <AnimatePresence>
        {dayCycle !== 'night' && (
          <motion.div
            key={`sun-${dayCycle}`}
            className="absolute pointer-events-none z-[3] rounded-full"
            style={{
              width:  dayCycle === 'day' ? 52 : 44,
              height: dayCycle === 'day' ? 52 : 44,
              top:    dayCycle === 'day' ? '10%' : '42%',
              right:  '14%',
              background:
                dayCycle === 'sunset'
                  ? 'radial-gradient(circle, #FED7AA 0%, #F97316 40%, #DC2626 100%)'
                  : dayCycle === 'sunrise'
                  ? 'radial-gradient(circle, #FEF08A 0%, #F59E0B 50%, #EA580C 100%)'
                  : 'radial-gradient(circle, #FFFBEB 0%, #FDE68A 40%, #F59E0B 100%)',
              boxShadow:
                dayCycle === 'day'
                  ? '0 0 60px rgba(253,230,138,0.8), 0 0 120px rgba(245,158,11,0.4)'
                  : '0 0 40px rgba(249,115,22,0.75), 0 0 80px rgba(220,38,38,0.3)',
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: 1.0 },
              y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Atmospheric clouds ── */}
      {weather !== 'fog' && (
        <div
          className="absolute top-0 inset-x-0 pointer-events-none z-[4]"
          style={{ height: '35%' }}
        >
          {Array.from({ length: weather === 'storm' ? 6 : weather === 'rain' ? 5 : 3 }).map((_, i) => {
            const isDark = weather === 'storm' || weather === 'rain';
            return (
              <motion.div
                key={`cloud-${i}`}
                className="absolute rounded-full"
                style={{
                  top:    `${8 + i * 14}px`,
                  left:   `${i * 22}%`,
                  width:  `${110 + i * 30}px`,
                  height: `${38 + i * 10}px`,
                  background: isDark
                    ? `rgba(${30 + i * 5}, ${40 + i * 3}, ${60 + i * 3}, ${0.6 + i * 0.06})`
                    : `rgba(255,255,255,${0.12 + i * 0.04})`,
                  filter: 'blur(4px)',
                }}
                animate={{ x: [-18, 18, -18] }}
                transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
              />
            );
          })}
        </div>
      )}

      {/* ── Far background trees ── */}
      {trees.filter(t => t.layer === 'bg').map((tree) => (
        <motion.div
          key={`tree-bg-${tree.seed}`}
          className="absolute origin-bottom z-[6]"
          style={{ left: `${tree.xPos}%`, bottom: '30%' }}
          animate={{ rotate: [-sway.angle * 0.4, sway.angle * 0.4, -sway.angle * 0.4] }}
          transition={{ duration: sway.duration * 1.4 + seededVal(tree.seed, 20) * 0.8, repeat: Infinity, ease: 'easeInOut', delay: seededVal(tree.seed, 21) * 0.5 }}
        >
          <TreeGraphic
            season={season}
            healthy={isHealthy}
            weather={weather}
            scale={tree.height * 0.62}
            layer="bg"
          />
        </motion.div>
      ))}

      {/* ── Solar panels Array (Driven by Solar Energy Slider) ── */}
      {numSolar > 0 && (
        <div className="absolute z-[7] flex items-center gap-1.5" style={{ left: '4%', bottom: '33%' }}>
          {Array.from({ length: numSolar }).map((_, i) => (
            <div key={`solar-${i}`} className="relative">
              <div
                className="rounded-sm border border-sky-400/50 shadow-md transition-all duration-300"
                style={{
                  width: 24, height: 13,
                  background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 40%, #38bdf8 100%)',
                  transform: 'skewX(-12deg)',
                  boxShadow: dayCycle === 'day' || dayCycle === 'sunrise'
                    ? '0 0 10px rgba(56,189,248,0.6)'
                    : 'none',
                }}
              />
            </div>
          ))}
          {/* Solar Capacity Label */}
          <div className="bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-cyan-300 border border-cyan-500/30 whitespace-nowrap ml-1">
            ⚡ {solarMW} MW Solar Array
          </div>
        </div>
      )}

      {/* ── Wind Turbines (Driven by Wind Energy Slider) ── */}
      {numTurbines > 0 && Array.from({ length: numTurbines }).map((_, i) => (
        <div key={`turbine-${i}`} className="absolute z-[7]" style={{ left: `${26 + i * 18}%`, bottom: '33%' }}>
          <WindTurbineGraphic
            speedSec={turbSpeedSec}
            nightGlow={dayCycle === 'night'}
            showLabel={i === 0}
            powerMW={windMW}
          />
        </div>
      ))}

      {/* ── Ground layer ── */}
      <div
        className="absolute left-0 right-0 z-[8]"
        style={{
          bottom: 0, height: '33%',
          background: isHealthy ? ground.healthy : ground.degraded,
          transition: 'background 1.0s ease',
        }}
      />

      {/* ── Winter snow ground ── */}
      {season === 'winter' && (
        <div
          className="absolute left-0 right-0 z-[9]"
          style={{
            bottom: '33%', height: 10,
            background: 'linear-gradient(to bottom, rgba(241,245,249,0.95), rgba(226,232,240,0.8))',
            boxShadow: '0 -2px 8px rgba(148,163,184,0.3)',
          }}
        />
      )}

      {/* ── River (Driven by Water Conservation & Plastic Reduction) ── */}
      <div
        className="absolute left-0 right-0 z-[10] overflow-hidden transition-all duration-700"
        style={{
          bottom: '16%',
          height: `${riverHeight}px`,
          background: plasticLevel < 40
            ? 'linear-gradient(90deg, #475569, #334155, #475569)'
            : 'linear-gradient(90deg, #0284c7, #38bdf8, #0ea5e9)',
          boxShadow: plasticLevel < 40 ? 'none' : '0 0 10px rgba(56,189,248,0.5)',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-70"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: weather === 'storm' ? 1.0 : weather === 'rain' ? 1.8 : 3.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating plastic debris when Plastic Reduction is LOW (<40%) */}
        {plasticLevel < 40 && Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`trash-${i}`}
            className="absolute rounded-sm bg-yellow-100/70 border border-amber-900/40 text-[7px]"
            style={{ width: 8, height: 4, top: 2, left: `${i * 20}%` }}
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Ocean Skimmer Cleanup Vessel when Plastic Reduction is HIGH (>=60%) */}
        {plasticLevel >= 60 && (
          <motion.div
            className="absolute z-[12] flex items-center gap-1 bg-black/80 text-emerald-400 font-mono text-[7px] px-1 rounded border border-emerald-500/40 shadow-lg"
            style={{ top: 1, left: '38%' }}
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🚢 Ocean Skimmer Active
          </motion.div>
        )}
      </div>

      {/* ── Clean Transport Highway / EV Pods (Driven by Clean Transport Slider) ── */}
      <div className="absolute z-[11] left-0 right-0 flex items-center justify-between px-4 pointer-events-none" style={{ bottom: '29%' }}>
        {cleanTransport >= 50 ? (
          <div className="w-full flex items-center justify-between text-[8px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="flex items-center gap-1">⚡ EV Transit Grid Active</span>
            <motion.div
              className="w-3.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10B981]"
              animate={{ x: [-50, 250] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-[8px] font-mono text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
            <span className="flex items-center gap-1">🚗 Fossil Transport Line</span>
            <motion.div
              className="w-3.5 h-1.5 bg-amber-500 rounded-full"
              animate={{ x: [-50, 250] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </div>

      {/* ── Mid trees ── */}
      {trees.filter(t => t.layer === 'mid').map((tree) => (
        <motion.div
          key={`tree-mid-${tree.seed}`}
          className="absolute origin-bottom z-[11]"
          style={{ left: `${tree.xPos}%`, bottom: '19%' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1, rotate: [-sway.angle * 0.7, sway.angle * 0.7, -sway.angle * 0.7] }}
          transition={{
            scaleY: { delay: tree.seed * 0.03, duration: 0.4 },
            rotate: { duration: sway.duration + seededVal(tree.seed, 30) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: seededVal(tree.seed, 31) },
          }}
        >
          <TreeGraphic
            season={season}
            healthy={isHealthy}
            weather={weather}
            scale={tree.height}
            layer="mid"
          />
        </motion.div>
      ))}

      {/* ── Eco Recycling Bins on Shore (Driven by Recycling Rate Slider) ── */}
      {recyclingRate >= 50 && (
        <div className="absolute z-[12] flex items-center gap-1" style={{ left: '78%', bottom: '18%' }}>
          <div className="bg-emerald-600/80 text-white p-0.5 rounded text-[8px] font-bold border border-emerald-400 shadow-md">
            ♻️ Recycling 100%
          </div>
        </div>
      )}

      {/* ── Foreground trees ── */}
      {trees.filter(t => t.layer === 'fg').map((tree) => (
        <motion.div
          key={`tree-fg-${tree.seed}`}
          className="absolute origin-bottom z-[13]"
          style={{ left: `${tree.xPos}%`, bottom: '17%' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1, rotate: [-sway.angle, sway.angle, -sway.angle] }}
          transition={{
            scaleY: { delay: tree.seed * 0.03, duration: 0.4 },
            rotate: { duration: sway.duration * 0.8 + seededVal(tree.seed, 32) * 0.3, repeat: Infinity, ease: 'easeInOut', delay: seededVal(tree.seed, 33) * 0.5 },
          }}
        >
          <TreeGraphic
            season={season}
            healthy={isHealthy}
            weather={weather}
            scale={tree.height * 1.15}
            layer="fg"
          />
        </motion.div>
      ))}

      {/* ── Autumn falling leaves ── */}
      {season === 'autumn' && (
        <div className="absolute inset-0 pointer-events-none z-[14] overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => {
            const leafColor = i % 3 === 0 ? '#ea580c' : i % 3 === 1 ? '#d97706' : '#b45309';
            return (
              <motion.div
                key={`leaf-${i}`}
                className="absolute rounded-br-full"
                style={{
                  width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2,
                  left: `${(i * 5.5) % 94}%`,
                  top: '-5%',
                  background: leafColor,
                }}
                animate={{ y: ['0%', '115%'], x: ['0%', `${i % 2 === 0 ? 25 : -25}%`], rotate: [0, 720] }}
                transition={{ duration: 3.5 + (i % 4) * 0.8, repeat: Infinity, delay: i * 0.28, ease: 'linear' }}
              />
            );
          })}
        </div>
      )}

      {/* ── Spring flowers / butterflies ── */}
      {season === 'spring' && (
        <div className="absolute inset-0 pointer-events-none z-[14] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute"
              style={{
                left: `${(i * 12 + 5) % 90}%`,
                top: `${40 + (i * 7) % 30}%`,
                fontSize: 10,
              }}
              animate={{ x: [-12, 12, -12], y: [-8, 4, -8] }}
              transition={{ duration: 2.5 + (i % 3) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            >
              🦋
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════════ WEATHER ENGINE ════════════════════ */}

      {/* ── RAIN ── */}
      <AnimatePresence>
        {weather === 'rain' && (
          <motion.div
            key="rain"
            className="absolute inset-0 pointer-events-none z-[15] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-slate-900/30" />
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.div
                key={`rb-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1,
                  height: 10 + (i % 3) * 4,
                  left: `${(i * 3.6 + 0.5) % 100}%`,
                  top: '-3%',
                  background: 'rgba(147,197,253,0.45)',
                  transform: 'rotate(-14deg)',
                }}
                animate={{ y: [0, 460], x: [0, -22] }}
                transition={{ duration: 0.9 + (i % 4) * 0.12, repeat: Infinity, ease: 'linear', delay: (i * 0.035) % 0.8 }}
              />
            ))}
            {Array.from({ length: 34 }).map((_, i) => (
              <motion.div
                key={`rf-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 1.5,
                  height: 14 + (i % 3) * 5,
                  left: `${(i * 2.9 + 1) % 100}%`,
                  top: '-5%',
                  background: 'rgba(186,230,253,0.80)',
                  transform: 'rotate(-14deg)',
                  filter: 'blur(0.3px)',
                }}
                animate={{ y: [0, 480], x: [0, -28] }}
                transition={{ duration: 0.48 + (i % 4) * 0.06, repeat: Infinity, ease: 'linear', delay: (i * 0.022) % 0.45 }}
              />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={`rs-${i}`}
                className="absolute rounded-full border border-sky-300/60"
                style={{ left: `${9 + i * 10}%`, bottom: '16%', width: 12, height: 5 }}
                animate={{ scale: [0.2, 2.2], opacity: [0.85, 0] }}
                transition={{ duration: 0.75, repeat: Infinity, delay: (i * 0.1) % 0.75, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STORM ── */}
      <AnimatePresence>
        {weather === 'storm' && (
          <motion.div
            key="storm"
            className="absolute inset-0 pointer-events-none z-[15] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-slate-950/55" />
            {Array.from({ length: 42 }).map((_, i) => (
              <motion.div
                key={`sr1-${i}`}
                style={{
                  position: 'absolute',
                  width: 1.5,
                  height: 18 + (i % 3) * 6,
                  left: `${(i * 2.4) % 100}%`,
                  top: '-8%',
                  background: 'rgba(186,230,253,0.85)',
                  borderRadius: 9999,
                  transform: 'rotate(-26deg)',
                }}
                animate={{ y: [0, 500], x: [0, -65] }}
                transition={{ duration: 0.32 + (i % 3) * 0.04, repeat: Infinity, ease: 'linear', delay: (i * 0.014) % 0.32 }}
              />
            ))}
            {/* Lightning bolt SVG */}
            <motion.svg
              className="absolute inset-0 w-full h-full z-[18] pointer-events-none"
              viewBox="0 0 400 340"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.1, 0.9, 0, 0, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <path
                d="M 240 0 L 208 95 L 238 108 L 182 230 L 214 242 L 165 340"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 14px #38BDF8) drop-shadow(0 0 6px #fff)' }}
              />
            </motion.svg>
            <motion.div
              className="absolute inset-0 pointer-events-none z-[17]"
              style={{ background: 'rgba(255,255,255,0.38)' }}
              animate={{ opacity: [0, 0.85, 0, 0.55, 0, 0, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SNOW ── */}
      <AnimatePresence>
        {weather === 'snow' && (
          <motion.div
            key="snow"
            className="absolute inset-0 pointer-events-none z-[15] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="absolute inset-0 bg-sky-950/20" />
            {Array.from({ length: 45 }).map((_, i) => {
              const sz = 1.5 + (i % 5) * 1.1;
              const opacity = (i % 3) === 0 ? 0.5 : (i % 3) === 1 ? 0.75 : 1.0;
              return (
                <motion.div
                  key={`snow-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: sz, height: sz,
                    left: `${(i * 2.22) % 100}%`,
                    top: '-6%',
                    opacity,
                  }}
                  animate={{
                    y: [0, 440],
                    x: [0, Math.sin(i * 1.1) * 18 + (i % 2 === 0 ? 8 : -8), 0],
                  }}
                  transition={{
                    duration: 3.5 + (i % 6) * 0.55,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: (i * 0.09) % 1.8,
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOG ── */}
      <AnimatePresence>
        {weather === 'fog' && (
          <motion.div
            key="fog"
            className="absolute inset-0 pointer-events-none z-[15] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
          >
            <div className="absolute inset-0 bg-slate-400/18" />
            <motion.div
              className="absolute left-0 right-0"
              style={{
                bottom: '10%', height: '30%',
                background: 'linear-gradient(to top, rgba(148,163,184,0.55) 0%, rgba(148,163,184,0.25) 50%, transparent 100%)',
                filter: 'blur(6px)',
              }}
              animate={{ x: ['-8%', '8%', '-8%'] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Factory & Industrial Smokestacks (Driven by Factory Regulation Slider) ── */}
      <div className="absolute z-[12]" style={{ bottom: '34%', right: '6%' }}>
        <div className="flex items-end gap-1.5">
          <div className="relative w-6 h-14 bg-slate-800 border border-slate-600/60 rounded-t-sm">
            {/* Active Smoke Plumes (when pollutionLevel > 15) */}
            {pollutionLevel > 15 && (
              <>
                <motion.div
                  className="absolute -top-4 left-1 rounded-full"
                  style={{
                    width: 12 + (pollutionLevel / 10),
                    height: 12 + (pollutionLevel / 10),
                    background: 'rgba(100,116,139,0.75)',
                    filter: 'blur(4px)',
                  }}
                  animate={{ y: [-4, -30], scale: [0.8, 2.5], opacity: [0.8, 0] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute -top-3 left-2 rounded-full"
                  style={{
                    width: 9 + (pollutionLevel / 12),
                    height: 9 + (pollutionLevel / 12),
                    background: 'rgba(71,85,105,0.65)',
                    filter: 'blur(3px)',
                  }}
                  animate={{ y: [-3, -22], scale: [0.8, 2.0], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                />
              </>
            )}
            {/* Green Eco Filtration Status Badge (when factoryLevel >= 85) */}
            {factoryLevel >= 85 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[7px] font-mono font-bold px-1 rounded whitespace-nowrap shadow-md">
                🌱 Clean Filter Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Wind Turbine Graphic Component ── */
interface WindTurbineProps {
  speedSec:   number;  // 0 = stopped, >0 = seconds per 360deg rotation
  nightGlow:  boolean;
  showLabel:  boolean;
  powerMW:    number;
}

function WindTurbineGraphic({ speedSec, nightGlow, showLabel, powerMW }: WindTurbineProps) {
  const isStopped = speedSec <= 0;

  return (
    <div className="relative flex flex-col items-center">
      {/* Tapered Vertical Tower (Fixed) */}
      <div
        className="relative"
        style={{
          width: 4,
          height: 54,
          background: 'linear-gradient(to bottom, #f1f5f9, #94a3b8, #64748b)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
          boxShadow: nightGlow ? '0 0 8px rgba(56,189,248,0.4)' : 'none',
        }}
      />
      {/* Base Foundation */}
      <div className="w-3 h-1 bg-slate-700 rounded-sm -mt-0.5" />

      {/* Nacelle & Rotor Hub Assembly at Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
        {/* Nacelle Generator Box (Fixed at top of tower) */}
        <div
          className="absolute z-[1] rounded-full bg-slate-300 border border-slate-400"
          style={{
            width: 7,
            height: 7,
            top: -3.5,
            boxShadow: nightGlow ? '0 0 6px rgba(56,189,248,0.8)' : 'none',
          }}
        />

        {/* Rotatable 3-Blade SVG Rotor Fan Assembly */}
        {isStopped ? (
          <svg
            width="46" height="46"
            viewBox="0 0 46 46"
            className="absolute z-[2]"
            style={{ top: -23, left: -23 }}
          >
            {/* 3 Aerodynamic Tapered Blades */}
            <path d="M 23 23 L 21 4 C 21 2, 25 2, 25 4 Z" fill="rgba(241,245,249,0.95)" stroke="#cbd5e1" strokeWidth="0.5" />
            <path d="M 23 23 L 39.4 32.5 C 41.1 33.5, 39.1 37, 37.4 36 Z" fill="rgba(203,213,225,0.95)" stroke="#94a3b8" strokeWidth="0.5" />
            <path d="M 23 23 L 6.6 32.5 C 4.9 33.5, 6.9 37, 8.6 36 Z" fill="rgba(241,245,249,0.95)" stroke="#cbd5e1" strokeWidth="0.5" />
            <circle cx="23" cy="23" r="3" fill="#64748b" stroke="#e2e8f0" strokeWidth="0.8" />
          </svg>
        ) : (
          <motion.svg
            width="46" height="46"
            viewBox="0 0 46 46"
            className="absolute z-[2]"
            style={{ top: -23, left: -23 }}
            animate={{ rotate: 360 }}
            transition={{ duration: speedSec, repeat: Infinity, ease: 'linear' }}
          >
            {/* 3 Aerodynamic Tapered Blades */}
            <path d="M 23 23 L 21 4 C 21 2, 25 2, 25 4 Z" fill="rgba(241,245,249,0.95)" stroke="#cbd5e1" strokeWidth="0.5" />
            <path d="M 23 23 L 39.4 32.5 C 41.1 33.5, 39.1 37, 37.4 36 Z" fill="rgba(203,213,225,0.95)" stroke="#94a3b8" strokeWidth="0.5" />
            <path d="M 23 23 L 6.6 32.5 C 4.9 33.5, 6.9 37, 8.6 36 Z" fill="rgba(241,245,249,0.95)" stroke="#cbd5e1" strokeWidth="0.5" />
            <circle cx="23" cy="23" r="3" fill="#64748b" stroke="#e2e8f0" strokeWidth="0.8" />
          </motion.svg>
        )}
      </div>

      {/* Telemetry Output Badge */}
      {showLabel && (
        <div
          className="absolute font-mono text-white/90 bg-black/75 px-1 py-0.2 rounded border border-white/15 whitespace-nowrap shadow-md"
          style={{ fontSize: 7, bottom: -14, left: '50%', transform: 'translateX(-50%)' }}
        >
          💨 {powerMW} MW Wind Grid
        </div>
      )}
    </div>
  );
}

/* ── Tree component — layered realistic foliage ── */
interface TreeProps {
  season:  Season;
  healthy: boolean;
  weather?: Weather;
  scale:   number;
  layer:   'bg' | 'mid' | 'fg';
}

function TreeGraphic({ season, healthy, weather, scale, layer }: TreeProps) {
  const baseH   = Math.round(28 * scale);
  const baseW   = Math.round(20 * scale);
  const trunkH  = Math.round(14 * scale);
  const trunkW  = Math.round(4 * scale);

  let topColor: string;
  let midColor: string;
  if (season === 'autumn') {
    topColor = '#ea580c'; midColor = '#d97706';
  } else if (season === 'winter') {
    topColor = healthy ? '#64748b' : '#475569';
    midColor = healthy ? '#94a3b8' : '#64748b';
  } else if (season === 'summer') {
    topColor = healthy ? '#15803d' : '#78716c';
    midColor = healthy ? '#166534' : '#57534e';
  } else {
    topColor = healthy ? '#22c55e' : '#86efac';
    midColor = healthy ? '#16a34a' : '#4ade80';
  }

  const hasSnow = (weather === 'snow' || season === 'winter') && layer !== 'bg';
  const opacity = layer === 'bg' ? 0.65 : layer === 'mid' ? 0.85 : 1;

  return (
    <div className="flex flex-col items-center" style={{ opacity }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: Math.round(baseW * 0.7),
            height: Math.round(baseH * 0.45),
            borderRadius: '50% 50% 45% 45%',
            background: `linear-gradient(to bottom, ${topColor}, ${midColor})`,
            boxShadow: `0 2px 6px rgba(0,0,0,0.25)`,
            marginBottom: -4,
            position: 'relative',
            zIndex: 3,
          }}
        >
          {hasSnow && (
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
                borderRadius: '50% 50% 0 0',
                background: 'rgba(241,245,249,0.9)',
              }}
            />
          )}
        </div>
        <div
          style={{
            width: Math.round(baseW * 0.92),
            height: Math.round(baseH * 0.42),
            borderRadius: '50% 50% 42% 42%',
            background: `linear-gradient(to bottom, ${topColor}dd, ${midColor})`,
            boxShadow: `0 3px 8px rgba(0,0,0,0.3)`,
            marginBottom: -6,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {hasSnow && (
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
                borderRadius: '50% 50% 0 0',
                background: 'rgba(248,250,252,0.8)',
              }}
            />
          )}
        </div>
        <div
          style={{
            width: baseW,
            height: Math.round(baseH * 0.38),
            borderRadius: '48% 48% 38% 38%',
            background: `linear-gradient(to bottom, ${midColor}, ${midColor}99)`,
            boxShadow: `0 4px 10px rgba(0,0,0,0.35)`,
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>
      <div
        style={{
          width: trunkW, height: trunkH,
          background: 'linear-gradient(to bottom, #92400e, #78350f)',
          boxShadow: `inset -1px 0 2px rgba(0,0,0,0.3)`,
        }}
      />
    </div>
  );
}

export default EnvironmentScene;
