import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Trees, Waves, Wind, Sun,
  ShieldAlert, Satellite, Eye, RefreshCw, Layers, CheckCircle2,
  Radio, Compass, ThermometerSun
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, CircularProgress } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';

interface ClimateModule {
  id: string;
  name: string;
  category: 'disaster' | 'ecosystem' | 'atmospheric' | 'resource';
  icon: typeof Flame;
  color: string;
  status: 'critical' | 'warning' | 'stable';
  location: string;
  severity: number; // 0 - 100
  metricLabel: string;
  metricValue: string;
  trend: string;
  description: string;
  telemetry: { label: string; val: string }[];
  recommendedAction: string;
}

const CLIMATE_MODULES: ClimateModule[] = [
  {
    id: 'wildfire',
    name: 'Wildfire Monitoring',
    category: 'disaster',
    icon: Flame,
    color: '#EF4444',
    status: 'critical',
    location: 'Amazon & Boreal Belt',
    severity: 88,
    metricLabel: 'Active Thermal Anomalies',
    metricValue: '4,210 Hotspots',
    trend: '+14% vs 24h avg',
    description: 'Real-time satellite infrared thermal mapping detecting rapid wildfire proliferation across dense canopy zones.',
    telemetry: [
      { label: 'Thermal Index', val: '840 °C peak' },
      { label: 'Smoke Plume Spread', val: '1,420 km²' },
      { label: 'CO₂ Emission Rate', val: '18.4 kt/hr' },
    ],
    recommendedAction: 'Deploy autonomous aerial fire-retardant drones & enact emergency zone evacuation.',
  },
  {
    id: 'flood',
    name: 'Flood Monitoring',
    category: 'disaster',
    icon: Droplets,
    color: '#38BDF8',
    status: 'warning',
    location: 'South Asian River Basins',
    severity: 74,
    metricLabel: 'River Inundation Risk',
    metricValue: '+3.4m Surge',
    trend: '+8% vs normal',
    description: 'SAR radar satellite monitoring of river basin overflow, coastal storm surges, and urban flash flooding risk.',
    telemetry: [
      { label: 'Water Discharge', val: '42,000 m³/s' },
      { label: 'Precipitation', val: '124 mm/24h' },
      { label: 'Pop. Impacted', val: '2.8M People' },
    ],
    recommendedAction: 'Activate floodgate automated barriers and mobilize amphibious relief units.',
  },
  {
    id: 'forest',
    name: 'Forest Loss Detection',
    category: 'ecosystem',
    icon: Trees,
    color: '#00E5A8',
    status: 'warning',
    location: 'Congo Basin & SE Asia',
    severity: 65,
    metricLabel: 'Canopy Cover Loss Rate',
    metricValue: '12.4 ha/hr',
    trend: '-3.2% vs last month',
    description: 'High-resolution multispectral optical satellite imagery monitoring illegal logging and deforestation vectors.',
    telemetry: [
      { label: 'Biomass Reduction', val: '450 kt CO₂e' },
      { label: 'Canopy Density', val: '68% Remaining' },
      { label: 'Protected Boundary', val: 'Violation detected' },
    ],
    recommendedAction: 'Dispatch eco-rangers to GPS vector boundaries and enforce satellite-backed logging bans.',
  },
  {
    id: 'ocean-pollution',
    name: 'Ocean Pollution',
    category: 'ecosystem',
    icon: Waves,
    color: '#38BDF8',
    status: 'critical',
    location: 'North Pacific & Mediterranean',
    severity: 82,
    metricLabel: 'Plastic Gyre Density',
    metricValue: '1.8M items/km²',
    trend: '+19% year-on-year',
    description: 'Orbital spectroradiometer scanning of marine microplastic accumulations, chemical spills, and coastal runoff.',
    telemetry: [
      { label: 'Great Pacific Patch Size', val: '1.6M km²' },
      { label: 'pH Degradation', val: '8.05 pH' },
      { label: 'Marine Life Impact', val: 'Severe Threat' },
    ],
    recommendedAction: 'Deploy autonomous ocean barrier skimmers and restrict single-use plastic exports.',
  },
  {
    id: 'air-quality',
    name: 'Air Quality',
    category: 'atmospheric',
    icon: Wind,
    color: '#F59E0B',
    status: 'warning',
    location: 'Indo-Gangetic Plain',
    severity: 78,
    metricLabel: 'PM2.5 Atmospheric Conc.',
    metricValue: '184 µg/m³',
    trend: 'Unhealthy (AQI 245)',
    description: 'Sentinel-5P satellite mapping of NO₂, SO₂, tropospheric ozone, and particulate matter smog envelopes.',
    telemetry: [
      { label: 'NO₂ Column Density', val: '280 µmol/m²' },
      { label: 'Surface Visibility', val: '1.2 km' },
      { label: 'Health Advisory', val: 'Code Purple' },
    ],
    recommendedAction: 'Restrict heavy industrial stack emissions and transition regional transit to zero-emission fleet.',
  },
  {
    id: 'heatwave',
    name: 'Heatwave Detection',
    category: 'atmospheric',
    icon: ThermometerSun,
    color: '#EA580C',
    status: 'critical',
    location: 'Southern Europe & SW US',
    severity: 91,
    metricLabel: 'Land Surface Temp Anomaly',
    metricValue: '+4.8 °C',
    trend: 'Record High',
    description: 'Thermal radiometer telemetry tracking extreme atmospheric heat domes and urban heat island intensity.',
    telemetry: [
      { label: 'Peak Surface Temp', val: '49.2 °C' },
      { label: 'Cooling Energy Demand', val: '+42% Surge' },
      { label: 'Grid Strain Level', val: 'Critical' },
    ],
    recommendedAction: 'Initiate public cooling centers, urban misting networks, and smart grid load balancing.',
  },
  {
    id: 'drought',
    name: 'Drought Monitoring',
    category: 'resource',
    icon: Sun,
    color: '#F59E0B',
    status: 'warning',
    location: 'Horn of Africa & Colorado Basin',
    severity: 79,
    metricLabel: 'Soil Moisture Deficit',
    metricValue: '-64% Moisture',
    trend: 'Severe Stress',
    description: 'SMAP microwave radar telemetry measuring root-zone soil dryness and reservoir storage depletion.',
    telemetry: [
      { label: 'Reservoir Capacity', val: '28% Capacity' },
      { label: 'Crop Yield Loss', val: '38% Projected' },
      { label: 'Groundwater Table', val: '-14.2m Drop' },
    ],
    recommendedAction: 'Implement drip irrigation mandates, wastewater recycling, and emergency water rationing.',
  },
  {
    id: 'water-crisis',
    name: 'Water Crisis',
    category: 'resource',
    icon: Droplets,
    color: '#7C3AED',
    status: 'critical',
    location: 'Central Andes & SW Asia',
    severity: 85,
    metricLabel: 'Aquifer Depletion Index',
    metricValue: 'Critical Low',
    trend: 'Accelerating',
    description: 'GRACE satellite gravity anomalies tracking deep underground aquifer volume loss and glacial melt runoff.',
    telemetry: [
      { label: 'Glacial Volume Mass', val: '-140 Gt/yr' },
      { label: 'Per Capita Supply', val: '420 L/day' },
      { label: 'Stress Index', val: 'Extreme (4.8/5.0)' },
    ],
    recommendedAction: 'Fund solar desalination plants and enforce aquifer replenishment sanctuaries.',
  },
  {
    id: 'climate-risk',
    name: 'Climate Risk Index',
    category: 'resource',
    icon: ShieldAlert,
    color: '#EF4444',
    status: 'critical',
    location: 'Global Vulnerability Grid',
    severity: 86,
    metricLabel: 'Global Eco-Stress Rating',
    metricValue: '8.6 / 10',
    trend: 'High Vulnerability',
    description: 'Integrated AI synthesis of multi-hazard risk models combining exposure, adaptive capacity, and biodiversity loss.',
    telemetry: [
      { label: 'Economic Loss Risk', val: '$2.4 Trillion/yr' },
      { label: 'Species Extinction Risk', val: '18% Species' },
      { label: 'Resilience Score', val: '42 / 100' },
    ],
    recommendedAction: 'Accelerate global decarbonization policies and scale community adaptation funds.',
  },
  {
    id: 'satellite-overview',
    name: 'Satellite Overview Grid',
    category: 'atmospheric',
    icon: Satellite,
    color: '#00E5A8',
    status: 'stable',
    location: 'Global Constellation 360°',
    severity: 35,
    metricLabel: 'Active Orbital Sensors',
    metricValue: '142 Satellites',
    trend: '100% Operational',
    description: 'Real-time telemetry stream from Terra, Aqua, Sentinel, and Landsat earth observation constellations.',
    telemetry: [
      { label: 'Global Re-visit Time', val: '90 Minutes' },
      { label: 'Data Ingestion Rate', val: '4.8 TB/hr' },
      { label: 'AI Detection Speed', val: '< 1.2 seconds' },
    ],
    recommendedAction: 'Calibrate neural optical shaders and expand synthetic aperture radar coverage.',
  },
];

export default function Challenges() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModule, setActiveModule] = useState<ClimateModule | null>(CLIMATE_MODULES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = useMemo(() => {
    return CLIMATE_MODULES.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const avgSeverity = useMemo(() => {
    return Math.round(CLIMATE_MODULES.reduce((acc, m) => acc + m.severity, 0) / CLIMATE_MODULES.length);
  }, []);

  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Global Climate Action Hub"
          title="Real-Time Planetary Telemetry & Risk Intelligence"
          description="Live satellite monitoring across 10 critical climate crisis domains. AI-driven risk modeling, early detection, and automated policy recommendations."
          className="mb-8"
        />

        {/* Global Risk Overview Banner */}
        <GlassCard className="p-6 mb-8 border-primary/20 bg-gradient-to-r from-[#0a1628]/90 via-[#0f2442]/70 to-[#0a1628]/90">
          <div className="grid md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <CircularProgress value={avgSeverity} size={90} strokeWidth={8} color="#EF4444" label={`${avgSeverity}%`} sublabel="Risk" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="danger">
                    <Radio className="w-3 h-3 animate-ping text-danger" />
                    LIVE SATELLITE FEED
                  </Badge>
                  <span className="text-xs font-mono text-[var(--text-muted)]">142 Orbital Nodes Active</span>
                </div>
                <h2 className="text-xl font-bold font-display text-white">Global Climate Emergency Grid</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Synthetic Aperture Radar (SAR) and multispectral optical imaging scanning 10 planetary crisis indicators in real time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="glass rounded-xl p-3 border border-white/5">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Critical Zones</div>
                <div className="text-lg font-bold font-display text-danger mt-0.5">5 Domains</div>
                <div className="text-[10px] text-danger/80">Immediate Action</div>
              </div>
              <div className="glass rounded-xl p-3 border border-white/5">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Warning Status</div>
                <div className="text-lg font-bold font-display text-warning mt-0.5">4 Domains</div>
                <div className="text-[10px] text-warning/80">High Risk</div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-end">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs font-semibold text-primary hover:bg-primary/10 transition-all border border-primary/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Grid Filter
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All 10 Domains', icon: Layers },
              { id: 'disaster', label: 'Extreme Events', icon: Flame },
              { id: 'ecosystem', label: 'Ecosystems', icon: Trees },
              { id: 'atmospheric', label: 'Atmosphere', icon: Wind },
              { id: 'resource', label: 'Water & Soil', icon: Droplets },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'glass border border-primary/30 text-primary shadow-glow bg-primary/10'
                      : 'glass text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Search region or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-xl px-4 py-2 text-xs text-white placeholder-[var(--text-muted)] border border-white/10 focus:border-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid of 10 Domain Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            const isSelected = activeModule?.id === mod.id;

            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveModule(mod)}
                className="cursor-pointer"
              >
                <GlassCard
                  className={`p-6 relative overflow-hidden transition-all duration-300 ${
                    isSelected ? 'border-primary ring-1 ring-primary/40 shadow-glow' : 'hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shadow-inner"
                        style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold font-display text-sm text-white">{mod.name}</h3>
                        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                          <Compass className="w-3 h-3 text-primary" />
                          {mod.location}
                        </span>
                      </div>
                    </div>

                    <Badge variant={mod.status === 'critical' ? 'danger' : mod.status === 'warning' ? 'warning' : 'success'}>
                      {mod.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Telemetry Metric Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[var(--text-muted)]">{mod.metricLabel}</span>
                      <span className="font-bold text-white" style={{ color: mod.color }}>{mod.metricValue}</span>
                    </div>

                    {/* Progress fill */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: mod.color, width: `${mod.severity}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.severity}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-white/5">
                    <span>Trend: <strong className="text-white">{mod.trend}</strong></span>
                    <span className="text-primary hover:underline flex items-center gap-1 font-semibold">
                      Telemetry <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Module Detail Modal / Banner */}
        <AnimatePresence mode="wait">
          {activeModule && (
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6 md:p-8 border-primary/30 relative overflow-hidden bg-gradient-to-br from-[#0a1628]/95 to-[#0f2442]/90">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/15 shadow-glow"
                      style={{ backgroundColor: `${activeModule.color}25`, color: activeModule.color }}
                    >
                      <activeModule.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                          Domain Telemetry Protocol
                        </span>
                        <Badge variant={activeModule.status === 'critical' ? 'danger' : 'warning'}>
                          {activeModule.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold font-display text-white mt-0.5">{activeModule.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--text-muted)]">Region: <strong className="text-white">{activeModule.location}</strong></span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-white font-display">AI Orbital Analysis Summary</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {activeModule.description} Automated deep learning models synthesize thermal infrared, SAR phase displacement, and optical spectral signatures every 90 minutes.
                    </p>

                    {/* Telemetry Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {activeModule.telemetry.map((t, idx) => (
                        <div key={idx} className="glass rounded-xl p-3 border border-white/5">
                          <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">{t.label}</div>
                          <div className="text-sm font-bold font-mono text-white mt-1">{t.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action Card */}
                  <div className="glass rounded-2xl p-5 border border-primary/20 flex flex-col justify-between bg-primary/5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        AI Action Plan
                      </div>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {activeModule.recommendedAction}
                      </p>
                    </div>

                    <button className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-ink font-bold text-xs shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <Radio className="w-3.5 h-3.5" />
                      Execute Planetary Policy Protocol
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
