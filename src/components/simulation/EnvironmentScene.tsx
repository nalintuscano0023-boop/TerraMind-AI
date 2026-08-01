import React from 'react';
import { motion } from 'framer-motion';

export type DayCycle = 'sunrise' | 'day' | 'sunset' | 'night';
export type Season   = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather  = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';

interface EnvironmentSceneProps {
  dayCycle: DayCycle;
  season: Season;
  weather: Weather;
  treeDensity?: number;
  factoryLevel?: number;
  solarLevel?: number;
  windLevel?: number;
  plasticLevel?: number;
  droneMode?: boolean;
  droneAltitude?: number;
  health?: number;
}

export const EnvironmentScene: React.FC<EnvironmentSceneProps> = ({
  dayCycle,
  season,
  weather,
  treeDensity = 50,
  factoryLevel = 50,
  solarLevel = 50,
  windLevel = 50,
  plasticLevel = 50,
  droneMode = false,
  droneAltitude = 120,
  health = 75,
}) => {
  const isHealthy = health > 50;
  const numTrees = Math.max(2, Math.round((treeDensity / 100) * 14));

  // Sky Gradients per Time of Day
  const skyGradients: Record<DayCycle, string> = {
    sunrise: 'from-amber-700/80 via-orange-500/50 to-slate-900',
    day:     'from-sky-400 via-blue-300/40 to-slate-900',
    sunset:  'from-rose-800/80 via-purple-700/50 to-slate-950',
    night:   'from-indigo-950/95 via-slate-950 to-[#040d1a]',
  };

  // Terrain colors per Season
  const groundColors: Record<Season, string> = {
    spring: isHealthy ? 'linear-gradient(to bottom, #166534, #14532D)' : 'linear-gradient(to bottom, #44403C, #292524)',
    summer: isHealthy ? 'linear-gradient(to bottom, #15803D, #052E16)' : 'linear-gradient(to bottom, #57534E, #1C1917)',
    autumn: isHealthy ? 'linear-gradient(to bottom, #92400E, #78350F)' : 'linear-gradient(to bottom, #44403C, #292524)',
    winter: 'linear-gradient(to bottom, #94A3B8, #64748B)',
  };

  // Turbine duration
  const turbineDuration =
    weather === 'storm'
      ? Math.max(0.4, 0.7 - (windLevel / 200))
      : weather === 'rain'
      ? Math.max(1.0, 1.8 - (windLevel / 100))
      : Math.max(1.8, 3.5 - (windLevel / 80));

  const treeSwayAngle = weather === 'storm' ? 12 : weather === 'rain' ? 4 : 1.5;
  const treeSwayDuration = weather === 'storm' ? 0.7 : weather === 'rain' ? 1.8 : 3.5;

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b ${skyGradients[dayCycle]} transition-all duration-700 overflow-hidden rounded-2xl`}
      style={{
        transform: droneMode ? `scale(${1 + (500 - droneAltitude) / 1000})` : 'scale(1)',
      }}
    >
      {/* 1. Stars & Moon in Night Cycle */}
      {dayCycle === 'night' && (
        <div className="absolute inset-0 opacity-90 pointer-events-none z-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white animate-pulse"
              style={{
                top: `${(i * 17) % 65}%`,
                left: `${(i * 23) % 95}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
          {/* Fireflies in Night */}
          {season !== 'winter' && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`firefly-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-glow opacity-80"
              style={{
                left: `${(i * 19) % 90}%`,
                top: `${40 + ((i * 13) % 45)}%`,
              }}
              animate={{
                x: [-10, 10, -10],
                y: [-8, 8, -8],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{ duration: 2.5 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* 2. Sun / Moon Celestial Body */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-1"
        style={{
          width: dayCycle === 'night' ? 36 : 48,
          height: dayCycle === 'night' ? 36 : 48,
          top: dayCycle === 'sunrise' || dayCycle === 'sunset' ? '45%' : '12%',
          right: '15%',
          background: dayCycle === 'night'
            ? 'radial-gradient(circle, #F0F6FF, #94A3B8)'
            : dayCycle === 'sunset'
            ? 'radial-gradient(circle, #F97316, #DC2626)'
            : 'radial-gradient(circle, #FBBF24, #F59E0B)',
          boxShadow: dayCycle === 'night' ? '0 0 25px rgba(240,246,255,0.5)' : '0 0 45px rgba(251,191,36,0.7)',
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3. Clouds Overlay (Day, Sunrise, Sunset, Rain, Storm) */}
      {weather !== 'fog' && (
        <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute rounded-full bg-white/20 blur-sm"
              style={{
                top: `${10 + i * 12}px`,
                left: `${i * 25}%`,
                width: `${90 + i * 20}px`,
                height: `${35 + i * 8}px`,
              }}
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* 4. Renewable Energy Infrastructure */}
      {solarLevel > 30 && Array.from({ length: Math.round((solarLevel / 100) * 4) }).map((_, i) => (
        <div key={`solar-${i}`} className="absolute bottom-[34%] z-3" style={{ left: `${12 + i * 16}%` }}>
          <div className="w-8 h-4 bg-sky-600 border border-sky-300 rounded-sm transform -skew-x-12 shadow-md" />
        </div>
      ))}

      {windLevel > 30 && Array.from({ length: Math.round((windLevel / 100) * 3) }).map((_, i) => (
        <div key={`turbine-${i}`} className="absolute bottom-[33%] z-3" style={{ left: `${22 + i * 24}%` }}>
          <div className="w-1 h-12 bg-gray-200 mx-auto shadow-sm" />
          <motion.div
            className="w-8 h-8 rounded-full border-t-2 border-r-2 border-white -mt-14 -ml-3.5 shadow-sm"
            animate={{ rotate: 360 }}
            transition={{ duration: turbineDuration, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ))}

      {/* 5. Terrain Ground Layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 transition-all duration-700 z-4"
        style={{ background: groundColors[season] }}
      />

      {/* Autumn Falling Leaves */}
      {season === 'autumn' && (
        <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute w-2.5 h-2.5 rounded-br-full bg-amber-600 opacity-80"
              style={{ left: `${(i * 7) % 95}%`, top: '-5%' }}
              animate={{
                y: ['0%', '110%'],
                x: ['0%', `${i % 2 === 0 ? 30 : -30}%`],
                rotate: [0, 360],
              }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      )}

      {/* Winter Snow Ground Layer */}
      {season === 'winter' && (
        <div className="absolute bottom-[33%] left-0 right-0 h-3.5 bg-slate-100/90 shadow-sm z-4" />
      )}

      {/* 6. Forest Trees with Sway */}
      {Array.from({ length: numTrees }).map((_, i) => (
        <motion.div
          key={`tree-${i}`}
          className="absolute bottom-[20%] z-5 origin-bottom"
          style={{ left: `${4 + i * (90 / numTrees)}%` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1, rotate: [-treeSwayAngle, treeSwayAngle, -treeSwayAngle] }}
          transition={{
            scaleY: { delay: i * 0.04, duration: 0.4 },
            rotate: { duration: treeSwayDuration + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <TreeGraphic healthy={isHealthy} season={season} weather={weather} />
        </motion.div>
      ))}

      {/* 7. River Water Strip */}
      <div
        className="absolute bottom-[16%] left-0 right-0 h-4 overflow-hidden shadow-inner z-6 border-y border-white/10"
        style={{
          background: plasticLevel > 60
            ? 'linear-gradient(90deg, #475569, #334155)'
            : 'linear-gradient(90deg, #38BDF8, #0284C7)',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: weather === 'storm' ? 1.2 : weather === 'rain' ? 2.2 : 3.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* 8. SINGLE WEATHER PARTICLES (NO STACKING) */}
      {weather === 'rain' && (
        <div className="absolute inset-0 pointer-events-none z-7 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute w-0.5 h-4 bg-sky-200/80 rounded-full"
              style={{ left: `${(i * 4) % 100}%`, top: '-10%', transform: 'rotate(-15deg)' }}
              animate={{ y: ['0%', '120%'] }}
              transition={{ duration: 0.8 + (i % 3) * 0.1, repeat: Infinity, ease: 'linear', delay: (i * 0.04) % 0.5 }}
            />
          ))}
        </div>
      )}

      {weather === 'storm' && (
        <div className="absolute inset-0 pointer-events-none z-7 overflow-hidden">
          {/* Heavy Diagonal Rain */}
          {Array.from({ length: 45 }).map((_, i) => (
            <motion.div
              key={`storm-rain-${i}`}
              className="absolute w-0.5 h-6 bg-sky-100/90 rounded-full"
              style={{ left: `${(i * 2.2) % 100}%`, top: '-10%', transform: 'rotate(-25deg)' }}
              animate={{ y: ['0%', '120%'], x: ['0%', '-30%'] }}
              transition={{ duration: 0.45 + (i % 3) * 0.05, repeat: Infinity, ease: 'linear', delay: (i * 0.02) % 0.4 }}
            />
          ))}
          {/* Lightning Flash */}
          <motion.div
            className="absolute inset-0 bg-white/35 pointer-events-none z-8"
            animate={{ opacity: [0, 0.9, 0, 0.6, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>
      )}

      {weather === 'snow' && (
        <div className="absolute inset-0 pointer-events-none z-7 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              className="absolute rounded-full bg-white/90 shadow-sm"
              style={{ left: `${(i * 3.3) % 100}%`, top: '-5%', width: 3 + (i % 3), height: 3 + (i % 3) }}
              animate={{ y: ['0%', '110%'], x: ['0%', `${i % 2 === 0 ? 15 : -15}%`] }}
              transition={{ duration: 2.5 + (i % 4) * 0.5, repeat: Infinity, ease: 'linear', delay: (i * 0.1) % 1.5 }}
            />
          ))}
        </div>
      )}

      {weather === 'fog' && (
        <div className="absolute inset-0 bg-slate-400/35 backdrop-blur-[2px] z-7 pointer-events-none" />
      )}

      {/* Industrial Smoke Plumes */}
      {factoryLevel > 40 && (
        <div className="absolute bottom-[34%] right-[10%] z-3 flex items-end gap-1 opacity-70">
          <div className="w-4 h-10 bg-slate-700 border border-slate-500 rounded-t-sm" />
          <div className="w-5 h-14 bg-slate-800 border border-slate-600 rounded-t-sm relative">
            <motion.div
              className="absolute -top-4 left-1 w-3 h-3 rounded-full bg-slate-400/50 blur-xs"
              animate={{ y: [-5, -20], scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

function TreeGraphic({ healthy, season, weather }: { healthy: boolean; season: Season; weather?: Weather }) {
  const foliageColor = season === 'autumn' ? '#EA580C' : season === 'winter' ? '#94A3B8' : healthy ? '#166534' : '#78350F';
  return (
    <div className="flex flex-col items-center" style={{ opacity: weather === 'storm' ? 0.95 : 1 }}>
      <div
        className="w-6 h-8 rounded-t-full shadow-md transition-colors duration-500"
        style={{ backgroundColor: foliageColor }}
      />
      <div className="w-1.5 h-4 bg-amber-900 shadow-inner" />
    </div>
  );
}

export default EnvironmentScene;
