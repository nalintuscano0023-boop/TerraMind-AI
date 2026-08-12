import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Trees, Waves, Wind, Sun,
  ShieldAlert, Satellite, Eye, CheckCircle2,
  Radio, ThermometerSun, Loader2, AlertCircle
} from 'lucide-react';
import { GlassCard, Badge, CircularProgress } from '@/components/ui';
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

type ProtocolStatus = 'idle' | 'executing' | 'success' | 'error';

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
  const [moduleProtocolStatus, setModuleProtocolStatus] = useState<Record<string, ProtocolStatus>>({});
  const [protocolError, setProtocolError] = useState<string | null>(null);

  const handleExecuteProtocol = async () => {
    if (!activeModule) return;
    const moduleId = activeModule.id;
    const currentStatus = moduleProtocolStatus[moduleId] || 'idle';

    if (currentStatus === 'executing') return;

    setModuleProtocolStatus((prev) => ({ ...prev, [moduleId]: 'executing' }));
    setProtocolError(null);

    try {
      // Simulate protocol execution delay
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1600);
      });

      setModuleProtocolStatus((prev) => ({ ...prev, [moduleId]: 'success' }));

      // Automatically reset status after 3.5 seconds
      setTimeout(() => {
        setModuleProtocolStatus((prev) => ({ ...prev, [moduleId]: 'idle' }));
      }, 3500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Protocol execution failed. Please try again.';
      setProtocolError(message);
      setModuleProtocolStatus((prev) => ({ ...prev, [moduleId]: 'error' }));

      setTimeout(() => {
        setModuleProtocolStatus((prev) => ({ ...prev, [moduleId]: 'idle' }));
        setProtocolError(null);
      }, 4000);
    }
  };

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Badge variant="primary" className="mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              GLOBAL CLIMATE CHALLENGES
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white">
              Climate Action <span className="text-gradient font-black">Hub</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl mt-2 font-normal">
              Real-time planetary hazards telemetry, neural satellite analysis, and automated action plan deployment.
            </p>
          </div>

          <div className="flex items-center gap-4 glass px-5 py-3 rounded-2xl border border-white/10">
            <div className="text-right">
              <div className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Global Risk Index</div>
              <div className="text-xl font-bold font-mono text-warning">{avgSeverity} / 100</div>
            </div>
            <CircularProgress value={avgSeverity} size={48} strokeWidth={5} color="var(--warning)" />
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'disaster', label: 'Disasters' },
              { id: 'ecosystem', label: 'Ecosystems' },
              { id: 'atmospheric', label: 'Atmospheric' },
              { id: 'resource', label: 'Resources' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-ink shadow-glow'
                    : 'glass text-[var(--text-muted)] hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by hazard or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass px-4 py-2.5 rounded-xl text-xs text-white placeholder-[var(--text-muted)] border border-white/10 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            const isSelected = activeModule?.id === module.id;
            const statusColor =
              module.status === 'critical'
                ? 'text-danger border-danger/30 bg-danger/10'
                : module.status === 'warning'
                ? 'text-warning border-warning/30 bg-warning/10'
                : 'text-success border-success/30 bg-success/10';

            return (
              <GlassCard
                key={module.id}
                onClick={() => setActiveModule(module)}
                className={`cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  isSelected ? 'border-primary/60 bg-primary/5 shadow-glow-sm' : 'hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10"
                      style={{ backgroundColor: `${module.color}15`, color: module.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white group-hover:text-primary transition-colors">
                        {module.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{module.location}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${statusColor}`}>
                    {module.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--text-muted)] font-mono">{module.metricLabel}</span>
                    <span className="font-bold font-mono text-white">{module.metricValue}</span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${module.severity}%`, backgroundColor: module.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono pt-3 border-t border-white/5">
                  <span className="text-xs">{module.trend}</span>
                  <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                    Inspect Telemetry <Eye className="w-3 h-3" />
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Selected Module Detail Panel */}
        <AnimatePresence mode="wait">
          {activeModule && (
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <GlassCard className="p-6 md:p-8 border-primary/30 relative overflow-hidden">
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

                    <div>
                      {(() => {
                        const status = moduleProtocolStatus[activeModule.id] || 'idle';
                        const isExecuting = status === 'executing';
                        const isSuccess = status === 'success';
                        const isError = status === 'error';

                        return (
                          <>
                            <button
                              onClick={handleExecuteProtocol}
                              disabled={isExecuting}
                              className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                isExecuting
                                  ? 'bg-gradient-to-r from-primary/80 to-secondary/80 text-ink shadow-glow opacity-90 cursor-not-allowed'
                                  : isSuccess
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-ink shadow-glow'
                                  : isError
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-glow'
                                  : 'bg-gradient-to-r from-primary to-secondary text-ink shadow-glow hover:opacity-90'
                              }`}
                            >
                              {isExecuting ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Executing Planetary Policy Protocol...
                                </>
                              ) : isSuccess ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Planetary Policy Protocol Executed
                                </>
                              ) : isError ? (
                                <>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Execution Failed — Click to Retry
                                </>
                              ) : (
                                <>
                                  <Radio className="w-3.5 h-3.5" />
                                  Execute Planetary Policy Protocol
                                </>
                              )}
                            </button>

                            <AnimatePresence>
                              {isSuccess && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 justify-center"
                                >
                                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                  <span>Protocol active for {activeModule.name}</span>
                                </motion.div>
                              )}
                              {isError && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  className="mt-2 text-[11px] font-mono text-red-400 flex items-center gap-1.5 justify-center"
                                >
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{protocolError || 'Execution failed'}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        );
                      })()}
                    </div>
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
