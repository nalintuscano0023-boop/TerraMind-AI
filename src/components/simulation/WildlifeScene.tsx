import React, { useState } from 'react';
import { Bird, Fish, Rabbit, Turtle, Leaf, Zap, Activity, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { GlassCard, Badge } from '@/components/ui';
import { WildlifeCanvas } from '@/components/ui/WildlifeCanvas';

export type WildlifeType = 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle';

interface WildlifeMeta {
  key: WildlifeType;
  name: string;
  habitat: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  population: string;
  health: number;
  migration: string;
  description: string;
  color: string;
}

const WILDLIFE_SPECIES: WildlifeMeta[] = [
  {
    key: 'bird',
    name: 'Birds',
    habitat: 'High Sky Altitude Atmosphere',
    icon: Bird,
    population: '4,280 Flocks Tracked',
    health: 84,
    migration: 'Northbound Vernal Route',
    description: 'Soaring migratory flocks traveling across intercontinental wind corridors.',
    color: '#38BDF8',
  },
  {
    key: 'fish',
    name: 'Fish',
    habitat: 'Sub-surface Pelagic Reef Ocean',
    icon: Fish,
    population: '12,450 Schools Tracked',
    health: 76,
    migration: 'Coral Atoll Nursery Range',
    description: 'Marine schools darting around vibrant coral reefs and sea kelp beds.',
    color: '#00E5A8',
  },
  {
    key: 'butterfly',
    name: 'Butterflies',
    habitat: 'Sunlit Wildflower Meadow',
    icon: Leaf,
    population: '8,900 Swarms Tracked',
    health: 88,
    migration: 'Floral Nectar Corridor',
    description: 'Fluttering lepidoptera pollinating blooming wildflower meadows.',
    color: '#F59E0B',
  },
  {
    key: 'bee',
    name: 'Bees',
    habitat: 'Woodland Canopy & Hive Colony',
    icon: Zap,
    population: '65,000 Hive Workers',
    health: 92,
    migration: 'Canopy Nectar Route',
    description: 'Essential pollinators maintaining forest ecological biodiversity.',
    color: '#EAB308',
  },
  {
    key: 'deer',
    name: 'Deer',
    habitat: 'Temperate Woodland Forest Floor',
    icon: Rabbit,
    population: '1,420 Herds Tracked',
    health: 79,
    migration: 'Woodland Grazing Circuit',
    description: 'Herbivorous cervids foraging along sun-dappled forest clearings.',
    color: '#D97706',
  },
  {
    key: 'turtle',
    name: 'Turtles',
    habitat: 'Deep Benthic Coral Reef Seabed',
    icon: Turtle,
    population: '890 Divers Tracked',
    health: 81,
    migration: 'Oceanic Gyre Transit',
    description: 'Ancient sea turtles diving through coral reefs and sea anemone gardens.',
    color: '#10B981',
  },
];

export interface WildlifeSceneProps {
  className?: string;
  initialSpecies?: WildlifeType;
}

export const WildlifeScene: React.FC<WildlifeSceneProps> = ({ className = '', initialSpecies = 'fish' }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<WildlifeType>(initialSpecies);
  const [animSpeed, setAnimSpeed]               = useState<number>(1);

  const activeMeta = WILDLIFE_SPECIES.find((s) => s.key === selectedSpecies) ?? WILDLIFE_SPECIES[1];
  const Icon = activeMeta.icon;

  return (
    <GlassCard className={`p-4 sm:p-6 relative overflow-hidden border-primary/20 bg-gradient-to-b from-[#0a1628] to-[#040d1a] ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bird className="w-5 h-5 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">Wildlife Habitat Simulator</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Dedicated species telemetry viewport. Selecting an animal rebuilds its exclusive natural environment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            REALTIME HABITAT TELEMETRY
          </Badge>
        </div>
      </div>

      {/* Wildlife Selector Tabs with Pixel-Perfect Spacing & Uniform Card Heights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {WILDLIFE_SPECIES.map((w) => {
          const SpeciesIcon = w.icon;
          const isActive = selectedSpecies === w.key;
          return (
            <button
              key={w.key}
              onClick={() => setSelectedSpecies(w.key)}
              className={`p-2.5 sm:p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between h-18 sm:h-20 shadow-sm ${
                isActive
                  ? 'bg-primary/20 text-white border-primary/50 shadow-glow scale-[1.02] sm:scale-[1.03] z-10'
                  : 'glass border-white/5 text-[var(--text-muted)] hover:text-white hover:border-white/15 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1 w-full">
                <SpeciesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: w.color }} />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tabular-nums" style={{ color: w.color }}>
                  {w.health}%
                </span>
              </div>
              <div className="font-bold text-xs text-white tracking-wide truncate">{w.name}</div>
            </button>
          );
        })}
      </div>

      {/* Large Interactive Wildlife Canvas Viewport */}
      <div className="relative h-[260px] xs:h-[300px] sm:h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-5 sm:mb-6 bg-slate-950">
        {/* Canvas Engine */}
        <WildlifeCanvas type={selectedSpecies} speedMultiplier={animSpeed} />

        {/* Top Active Telemetry Badge Overlay */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-30 bg-black/75 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-white/15 text-[10px] sm:text-xs font-mono font-bold text-white flex items-center gap-1.5 sm:gap-2 shadow-xl max-w-[65%] sm:max-w-none">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: activeMeta.color }} />
          <span className="hidden xs:inline text-[var(--text-muted)]">HABITAT:</span>
          <span className="text-primary truncate">{activeMeta.habitat.toUpperCase()}</span>
        </div>

        {/* Top Right Animation Speed Selector */}
        <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-30 bg-black/75 backdrop-blur-md px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-white/15 text-[10px] sm:text-xs font-mono text-white flex items-center gap-1 sm:gap-1.5">
          <span className="hidden xs:inline text-[9px] sm:text-[10px] text-[var(--text-muted)] font-semibold">SPEED:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setAnimSpeed(s)}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-all ${
                animSpeed === s ? 'bg-primary text-ink' : 'hover:text-primary text-[var(--text-muted)]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Wildlife Habitat Telemetry Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider truncate">Population Count</div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">{activeMeta.population}</div>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider truncate">Health Index</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono truncate">{activeMeta.health}% Optimal</div>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider truncate">Migration Status</div>
            <div className="text-xs font-semibold text-white truncate">{activeMeta.migration}</div>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 sm:p-4 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono tracking-wider truncate">Species Description</div>
            <div className="text-xs text-[var(--text-muted)] line-clamp-1 truncate">{activeMeta.description}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default WildlifeScene;
