import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Trees, Waves, Wind, Sun,
  ShieldAlert, Satellite, Eye, CheckCircle2,
  Radio, ThermometerSun, Loader2, AlertCircle, X,
  Activity, Cpu, Terminal, Check, RotateCcw
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

type ProtocolPhase = 'idle' | 'executing' | 'completed' | 'error';

interface ProtocolStage {
  id: string;
  title: string;
  description: string;
  progressTarget: number;
  duration: number;
  logMessage: string;
  subsystemUpdate?: Partial<SubsystemHealth>;
}

interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  stageId: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SubsystemHealth {
  telemetry: 'STANDBY' | 'ONLINE' | 'SYNCHRONIZED';
  aiAnalysis: 'STANDBY' | 'COMPUTING' | 'OPTIMAL';
  emergency: 'STANDBY' | 'ALERT LEVEL 1' | 'COORDINATED';
  aerialResponse: 'STANDBY' | 'DISPATCHED' | 'ACTIVE';
  evacuation: 'STANDBY' | 'ENFORCING' | 'ACTIVE';
}

const PROTOCOL_STAGES: ProtocolStage[] = [
  {
    id: 'init',
    title: 'Initializing planetary response system',
    description: 'Establishing encrypted orbital link with Terra & Aqua constellations.',
    progressTarget: 12,
    duration: 800,
    logMessage: 'Encrypted downlink established with satellite const. 142-Beta',
    subsystemUpdate: { telemetry: 'ONLINE', aiAnalysis: 'STANDBY' },
  },
  {
    id: 'verify',
    title: 'Verifying wildfire telemetry',
    description: 'Validating IR thermal hotspots and SAR ground displacement telemetry.',
    progressTarget: 25,
    duration: 900,
    logMessage: 'Satellite thermal anomaly confirmed. Hotspot perimeter verified.',
    subsystemUpdate: { telemetry: 'SYNCHRONIZED', aiAnalysis: 'COMPUTING' },
  },
  {
    id: 'analyze',
    title: 'Analyzing satellite thermal data',
    description: 'Synthesizing neural wind vector & smoke plume spread prediction models.',
    progressTarget: 40,
    duration: 1000,
    logMessage: 'Neural AI propagation vector calculated.',
    subsystemUpdate: { aiAnalysis: 'OPTIMAL', emergency: 'ALERT LEVEL 1' },
  },
  {
    id: 'calculate',
    title: 'Calculating wildfire containment strategy',
    description: 'Computing optimal retardant drop vectors & barrier boundaries.',
    progressTarget: 55,
    duration: 950,
    logMessage: 'Firebreak corridor locked: Vector 48° N / 14° W.',
    subsystemUpdate: { emergency: 'COORDINATED' },
  },
  {
    id: 'coordinate',
    title: 'Coordinating emergency response',
    description: 'Dispatching ground tactical fire response & regional emergency command.',
    progressTarget: 70,
    duration: 900,
    logMessage: 'Tactical ground units & amphibious strike teams mobilized.',
    subsystemUpdate: { aerialResponse: 'DISPATCHED' },
  },
  {
    id: 'deploy',
    title: 'Deploying aerial fire-retardant response',
    description: 'Launching 12 autonomous fire-retardant drone swarms to canopy boundary.',
    progressTarget: 85,
    duration: 1100,
    logMessage: 'Autonomous aerial retardant drone swarm deployed over target zone.',
    subsystemUpdate: { aerialResponse: 'ACTIVE', evacuation: 'ENFORCING' },
  },
  {
    id: 'evacuate',
    title: 'Activating emergency evacuation zones',
    description: 'Broadcasting automated emergency alerts & locking perimeter roadways.',
    progressTarget: 98,
    duration: 850,
    logMessage: 'Evacuation Zone Alpha & Bravo perimeter lockdown activated.',
    subsystemUpdate: { evacuation: 'ACTIVE' },
  },
  {
    id: 'completed',
    title: 'Protocol execution completed',
    description: 'All 8 planetary policy directives active. Live orbital telemetry monitoring engaged.',
    progressTarget: 100,
    duration: 600,
    logMessage: 'Planetary Policy Protocol Executed Successfully. Telemetry monitoring live.',
  },
];

const INITIAL_CLIMATE_MODULES: ClimateModule[] = [
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
  const [modulesData, setModulesData] = useState<ClimateModule[]>(INITIAL_CLIMATE_MODULES);
  const [activeModuleId, setActiveModuleId] = useState<string>(INITIAL_CLIMATE_MODULES[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  // Protocol Execution State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [executionPhase, setExecutionPhase] = useState<ProtocolPhase>('idle');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [subsystemHealth, setSubsystemHealth] = useState<SubsystemHealth>({
    telemetry: 'STANDBY',
    aiAnalysis: 'STANDBY',
    emergency: 'STANDBY',
    aerialResponse: 'STANDBY',
    evacuation: 'STANDBY',
  });
  const [executedProtocols, setExecutedProtocols] = useState<Record<string, { time: string }>>({});
  const [protocolError, setProtocolError] = useState<string | null>(null);

  const activeModule = useMemo(() => {
    return modulesData.find((m) => m.id === activeModuleId) || modulesData[0];
  }, [modulesData, activeModuleId]);

  const filteredModules = useMemo(() => {
    return modulesData.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [modulesData, selectedCategory, searchTerm]);

  const avgSeverity = useMemo(() => {
    return Math.round(modulesData.reduce((acc, m) => acc + m.severity, 0) / modulesData.length);
  }, [modulesData]);

  const runProtocolExecution = async (moduleToExecute: ClimateModule) => {
    setIsModalOpen(true);
    setExecutionPhase('executing');
    setCurrentStageIndex(0);
    setProgress(0);
    setProtocolError(null);
    setLogs([]);
    setSubsystemHealth({
      telemetry: 'STANDBY',
      aiAnalysis: 'STANDBY',
      emergency: 'STANDBY',
      aerialResponse: 'STANDBY',
      evacuation: 'STANDBY',
    });

    const startTimeStr = new Date().toLocaleTimeString();

    const initialLog: ExecutionLogEntry = {
      id: Date.now().toString(),
      timestamp: startTimeStr,
      stageId: 'start',
      text: `[SYSTEM INITIATION] Protocol execution requested for ${moduleToExecute.name} (${moduleToExecute.location})`,
      type: 'info',
    };
    setLogs([initialLog]);

    try {
      for (let i = 0; i < PROTOCOL_STAGES.length; i++) {
        const stage = PROTOCOL_STAGES[i];
        setCurrentStageIndex(i);
        setProgress(stage.progressTarget);

        if (stage.subsystemUpdate) {
          setSubsystemHealth((prev) => ({
            ...prev,
            ...stage.subsystemUpdate,
          }));
        }

        const logTime = new Date().toLocaleTimeString();
        const newLog: ExecutionLogEntry = {
          id: `${Date.now()}-${i}`,
          timestamp: logTime,
          stageId: stage.id,
          text: stage.logMessage,
          type: i === PROTOCOL_STAGES.length - 1 ? 'success' : 'info',
        };
        setLogs((prev) => [...prev, newLog]);

        await new Promise((resolve) => setTimeout(resolve, stage.duration));
      }

      setExecutionPhase('completed');
      setExecutedProtocols((prev) => ({
        ...prev,
        [moduleToExecute.id]: { time: new Date().toLocaleTimeString() },
      }));

      // Dynamically mutate hazard telemetry & dashboard risk state
      setModulesData((prev) =>
        prev.map((m) => {
          if (m.id === moduleToExecute.id) {
            return {
              ...m,
              severity: Math.max(15, Math.round(m.severity * 0.45)),
              status: 'stable',
              trend: 'Action Deployed (-55% Risk)',
              metricValue: 'CONTAINMENT ACTIVE',
              telemetry: [
                { label: 'Protocol Status', val: 'DEPLOYS ACTIVE' },
                { label: 'Response Units', val: '12 Drones Dispatched' },
                { label: 'Protection Perimeter', val: 'EVAC ZONE ENFORCED' },
              ],
              recommendedAction: `PROTOCOL ENFORCED — Autonomous response active across ${m.location}. Telemetry synchronized.`,
            };
          }
          return m;
        })
      );
    } catch (err: unknown) {
      setExecutionPhase('error');
      const errorMsg = err instanceof Error ? err.message : 'Telemetry link failed during protocol transmission.';
      setProtocolError(errorMsg);
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          stageId: 'error',
          text: `[EXECUTION CRITICAL FAILURE] ${errorMsg}`,
          type: 'error',
        },
      ]);
    }
  };

  const isExecuted = !!executedProtocols[activeModule.id];

  return (
    <div className="relative min-h-screen">
      <FloatingShapes />
      <Particles count={15} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <Badge variant="primary" className="mb-2 sm:mb-3 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              GLOBAL CLIMATE CHALLENGES
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Climate Action <span className="text-gradient font-black">Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mt-1.5 sm:mt-2 font-normal leading-relaxed">
              Real-time planetary hazards telemetry, neural satellite analysis, and automated action plan deployment.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 glass px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <div className="text-right">
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono">Global Risk Index</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-warning">{avgSeverity} / 100</div>
            </div>
            <CircularProgress value={avgSeverity} size={44} strokeWidth={4.5} color="var(--warning)" />
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
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
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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
              placeholder="Search hazard or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs text-white placeholder-[var(--text-muted)] border border-white/10 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
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
                onClick={() => setActiveModuleId(module.id)}
                className={`p-4 sm:p-5 cursor-pointer transition-all duration-300 relative group overflow-hidden border border-white/10 ${
                  isSelected ? 'border-primary/60 bg-primary/5 shadow-glow-sm' : 'hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: `${module.color}15`, color: module.color }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white group-hover:text-primary transition-colors truncate">
                        {module.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block truncate">{module.location}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full border flex-shrink-0 whitespace-nowrap ${statusColor}`}>
                    {module.status}
                  </span>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 min-w-0">
                  <div className="flex justify-between items-center text-xs gap-2 min-w-0">
                    <span className="text-[var(--text-muted)] font-mono text-[11px] sm:text-xs truncate min-w-0 flex-1">{module.metricLabel}</span>
                    <span className="font-bold font-mono text-white text-xs flex-shrink-0">{module.metricValue}</span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 max-w-full"
                      style={{ width: `${module.severity}%`, backgroundColor: module.color }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--text-muted)] font-mono pt-2.5 sm:pt-3 border-t border-white/5 gap-2 min-w-0">
                  <span className="text-[11px] sm:text-xs truncate min-w-0 flex-1">{module.trend}</span>
                  <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 whitespace-nowrap">
                    Inspect Telemetry <Eye className="w-3 h-3 flex-shrink-0" />
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
              <GlassCard className="p-4 sm:p-6 md:p-8 border-primary/30 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border border-white/15 shadow-glow flex-shrink-0"
                      style={{ backgroundColor: `${activeModule.color}25`, color: activeModule.color }}
                    >
                      <activeModule.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                          Domain Telemetry Protocol
                        </span>
                        <Badge variant={activeModule.status === 'critical' ? 'danger' : 'warning'} className="text-[10px] sm:text-xs">
                          {activeModule.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">{activeModule.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[var(--text-muted)]">Region: <strong className="text-white">{activeModule.location}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    <h3 className="text-sm font-semibold text-white font-display">AI Orbital Analysis Summary</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {activeModule.description} Automated deep learning models synthesize thermal infrared, SAR phase displacement, and optical spectral signatures every 90 minutes.
                    </p>

                    {/* Telemetry Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                      {activeModule.telemetry.map((t, idx) => (
                        <div key={idx} className="glass rounded-xl p-2.5 sm:p-3 border border-white/5">
                          <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] uppercase font-mono">{t.label}</div>
                          <div className="text-xs sm:text-sm font-bold font-mono text-white mt-0.5 sm:mt-1 truncate">{t.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action Card */}
                  <div className="glass rounded-2xl p-4 sm:p-5 border border-primary/20 flex flex-col justify-between bg-primary/5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          AI Action Plan
                        </div>
                        {isExecuted && (
                          <Badge variant="success" className="text-[9px] py-0.5 px-2 font-mono">
                            PROTOCOL LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-white font-medium leading-relaxed">
                        {activeModule.recommendedAction}
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => runProtocolExecution(activeModule)}
                        disabled={executionPhase === 'executing'}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          executionPhase === 'executing'
                            ? 'bg-gradient-to-r from-primary/80 to-secondary/80 text-ink shadow-glow opacity-90 cursor-not-allowed'
                            : isExecuted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-ink shadow-glow hover:opacity-95'
                            : 'bg-gradient-to-r from-primary to-secondary text-ink shadow-glow hover:opacity-90'
                        }`}
                      >
                        {executionPhase === 'executing' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                            <span>Executing Planetary Policy Protocol...</span>
                          </>
                        ) : isExecuted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Planetary Policy Protocol Executed</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Execute Planetary Policy Protocol</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Protocol Execution Overlay Modal */}
      <AnimatePresence>
        {isModalOpen && activeModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass rounded-3xl border border-primary/40 max-w-4xl w-full p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto shadow-2xl relative bg-slate-950/95 text-white"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-white/10 mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center border border-white/15 shadow-glow flex-shrink-0"
                    style={{ backgroundColor: `${activeModule.color}25`, color: activeModule.color }}
                  >
                    <activeModule.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                        EMERGENCY PROTOCOL COMMAND CENTER
                      </span>
                      <Badge
                        variant={
                          executionPhase === 'completed'
                            ? 'success'
                            : executionPhase === 'error'
                            ? 'danger'
                            : 'primary'
                        }
                        className="text-[9px] sm:text-[10px]"
                      >
                        {executionPhase === 'executing'
                          ? 'EXECUTING PROTOCOL'
                          : executionPhase === 'completed'
                          ? 'PROTOCOL ACTIVATED'
                          : executionPhase === 'error'
                          ? 'FAILED'
                          : 'STANDBY'}
                      </Badge>
                    </div>
                    <h2 className="text-base sm:text-xl font-bold font-display text-white mt-0.5 truncate">
                      Planetary Policy Protocol — {activeModule.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-xl glass flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors border border-white/10 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress & Current Operation Box */}
              <div className="glass rounded-2xl p-4 sm:p-5 border border-primary/30 bg-primary/5 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className="text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                    {executionPhase === 'executing' && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary flex-shrink-0" />}
                    {executionPhase === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    {executionPhase === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    Current Operation:
                  </span>
                  <span className="font-bold text-primary font-mono text-xs sm:text-sm">{progress}%</span>
                </div>

                <div className="text-xs sm:text-sm font-bold text-white mb-2 sm:mb-3 font-display">
                  {PROTOCOL_STAGES[currentStageIndex]?.title || 'Protocol Execution Completed'}
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 sm:h-2.5 overflow-hidden border border-white/10 p-0.5">
                  <motion.div
                    className={`h-full rounded-full ${
                      executionPhase === 'completed'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-glow'
                        : executionPhase === 'error'
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-primary via-teal-400 to-emerald-400 shadow-glow'
                    }`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Dual Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Left Column: Stage Checklist & Subsystems */}
                <div className="space-y-6">
                  {/* Checklist */}
                  <div className="glass rounded-2xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold font-mono uppercase text-primary mb-3 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      Multi-Stage Directive Checklist
                    </h3>

                    <div className="space-y-2">
                      {PROTOCOL_STAGES.map((stage, idx) => {
                        const isDone = idx < currentStageIndex || executionPhase === 'completed';
                        const isCurrent = idx === currentStageIndex && executionPhase === 'executing';

                        return (
                          <div
                            key={stage.id}
                            className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all ${
                              isCurrent
                                ? 'bg-primary/15 border border-primary/40 text-white'
                                : isDone
                                ? 'text-emerald-300'
                                : 'text-[var(--text-muted)] opacity-60'
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {isDone ? (
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              ) : isCurrent ? (
                                <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center text-primary animate-pulse">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                                  <span className="text-[8px] font-mono">{idx + 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{stage.title}</div>
                              {isCurrent && (
                                <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                                  {stage.description}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subsystem Health Grid */}
                  <div className="glass rounded-2xl p-4 border border-white/10">
                    <h3 className="text-xs font-bold font-mono uppercase text-primary mb-3 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5" />
                      Subsystem Response Grid
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      {Object.entries(subsystemHealth).map(([key, val]) => (
                        <div key={key} className="glass p-2 rounded-xl border border-white/5 flex justify-between items-center">
                          <span className="capitalize text-[var(--text-muted)]">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span
                            className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                              val.includes('ACTIVE') || val.includes('ONLINE') || val.includes('OPTIMAL') || val.includes('SYNCHRONIZED')
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : val.includes('DISPATCHED') || val.includes('ALERT') || val.includes('COMPUTING')
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-white/5 text-[var(--text-muted)]'
                            }`}
                          >
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Terminal Event Log */}
                <div className="glass rounded-2xl p-4 border border-white/10 flex flex-col h-full min-h-[320px] bg-black/40 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-xs">
                    <span className="text-primary font-bold flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      LIVE SYSTEM EXECUTION LOG
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">LOG STREAM ACTIVE</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 text-[11px] pr-1 scrollbar-thin max-h-[340px]">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-2 rounded-lg leading-relaxed ${
                          log.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : log.type === 'error'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                            : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-primary/80 mr-2">[{log.timestamp}]</span>
                        <span>{log.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[var(--text-muted)] font-mono">
                  {executionPhase === 'executing' && 'Executing automated protocol directives... Please standby.'}
                  {executionPhase === 'completed' && 'Protocol executed successfully. Hazards mitigated.'}
                  {executionPhase === 'error' && (protocolError || 'Execution halted due to telemetry error.')}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {executionPhase === 'completed' && (
                    <>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-ink font-bold text-xs shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Inspect Updated Telemetry
                      </button>
                      <button
                        onClick={() => runProtocolExecution(activeModule)}
                        className="px-4 py-2.5 rounded-xl glass text-xs font-semibold text-white hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Re-Run
                      </button>
                    </>
                  )}

                  {executionPhase === 'error' && (
                    <button
                      onClick={() => runProtocolExecution(activeModule)}
                      className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retry Protocol
                    </button>
                  )}

                  {executionPhase === 'executing' && (
                    <button
                      disabled
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 font-bold text-xs cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Protocol Execution In Progress...
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
