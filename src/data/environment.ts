export type MetricKey =
  | 'forest'
  | 'water'
  | 'air'
  | 'carbon'
  | 'biodiversity'
  | 'renewable';

export interface Metric {
  key: MetricKey;
  label: string;
  value: number;
  unit: string;
  icon: string;
}

export type ControlKey =
  | 'trees'
  | 'factories'
  | 'transport'
  | 'solar'
  | 'wind'
  | 'plastic'
  | 'recycling'
  | 'waterUsage';

export interface Control {
  key: ControlKey;
  label: string;
  value: number;
  icon: string;
  description: string;
  impact: Partial<Record<MetricKey, number>>;
}

export interface CrisisEvent {
  id: string;
  name: string;
  icon: string;
  problem: string;
  cause: string;
  impact: string;
  solutions: string[];
  outcome: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  metricsAffected: Partial<Record<MetricKey, number>>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  threshold: number;
  category: string;
}

export interface Mission {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  briefing: string;
  targetMetric: MetricKey;
  targetValue: number;
  successCondition: string;
  failureCondition: string;
  reward: number;
  icon: string;
}

export interface AdvisorInsight {
  problem: string;
  cause: string;
  impact: string;
  solution: string;
  benefit: string;
  severity: 'low' | 'moderate' | 'high';
  metric: MetricKey;
}

export const METRIC_META: Record<MetricKey, { label: string; unit: string; icon: string }> = {
  forest: { label: 'Forest Cover', unit: '%', icon: 'Trees' },
  water: { label: 'Water Quality', unit: '%', icon: 'Droplets' },
  air: { label: 'Air Quality', unit: '%', icon: 'Wind' },
  carbon: { label: 'Carbon Level', unit: 'ppm', icon: 'Cloud' },
  biodiversity: { label: 'Biodiversity', unit: '%', icon: 'Bird' },
  renewable: { label: 'Renewable Energy', unit: '%', icon: 'Sun' },
};

export const INITIAL_METRICS: Record<MetricKey, number> = {
  forest: 52,
  water: 61,
  air: 48,
  carbon: 72,
  biodiversity: 44,
  renewable: 28,
};

export const CONTROLS: Control[] = [
  {
    key: 'trees',
    label: 'Trees Planted',
    value: 50,
    icon: 'Trees',
    description: 'Reforestation and afforestation efforts',
    impact: { forest: 0.4, biodiversity: 0.25, carbon: -0.2, air: 0.15 },
  },
  {
    key: 'factories',
    label: 'Factory Regulation',
    value: 50,
    icon: 'Factory',
    description: 'Industrial emission controls',
    impact: { air: 0.3, water: 0.2, carbon: -0.35 },
  },
  {
    key: 'transport',
    label: 'Clean Transport',
    value: 50,
    icon: 'Car',
    description: 'Electric vehicles and public transit',
    impact: { air: 0.25, carbon: -0.3 },
  },
  {
    key: 'solar',
    label: 'Solar Energy',
    value: 50,
    icon: 'Sun',
    description: 'Solar farm deployment',
    impact: { renewable: 0.4, carbon: -0.2, air: 0.1 },
  },
  {
    key: 'wind',
    label: 'Wind Energy',
    value: 50,
    icon: 'Wind',
    description: 'Wind turbine installation',
    impact: { renewable: 0.35, carbon: -0.18, air: 0.08 },
  },
  {
    key: 'plastic',
    label: 'Plastic Reduction',
    value: 50,
    icon: 'Trash2',
    description: 'Single-use plastic bans',
    impact: { water: 0.3, biodiversity: 0.2, carbon: -0.1 },
  },
  {
    key: 'recycling',
    label: 'Recycling Rate',
    value: 50,
    icon: 'Recycle',
    description: 'Waste recycling programs',
    impact: { water: 0.15, air: 0.1, carbon: -0.15, biodiversity: 0.1 },
  },
  {
    key: 'waterUsage',
    label: 'Water Conservation',
    value: 50,
    icon: 'Droplets',
    description: 'Efficient water management',
    impact: { water: 0.4, biodiversity: 0.15 },
  },
];

export const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: 'wildfire',
    name: 'Wildfire Outbreak',
    icon: 'Flame',
    problem: 'Massive wildfires consuming forested regions',
    cause: 'Rising temperatures, drought, and dry lightning',
    impact: 'Forest loss, carbon spike, habitat destruction, air pollution',
    solutions: ['Plant fire-resistant tree species', 'Create firebreaks', 'Deploy early warning drones', 'Reduce carbon emissions'],
    outcome: 'Forest recovery begins within 5 years; carbon levels stabilize',
    severity: 'high',
    metricsAffected: { forest: -15, air: -10, carbon: 12, biodiversity: -8 },
  },
  {
    id: 'flood',
    name: 'Coastal Flooding',
    icon: 'Waves',
    problem: 'Sea level rise inundating coastal cities',
    cause: 'Thermal expansion of oceans and ice melt',
    impact: 'Infrastructure damage, water contamination, displacement',
    solutions: ['Build seawalls', 'Restore mangroves', 'Relocate critical infrastructure', 'Reduce carbon emissions'],
    outcome: 'Coastal resilience improves; water quality recovers',
    severity: 'high',
    metricsAffected: { water: -12, biodiversity: -6, air: -4 },
  },
  {
    id: 'hurricane',
    name: 'Category 5 Hurricane',
    icon: 'CloudLightning',
    problem: 'Extreme storm devastating coastal ecosystems',
    cause: 'Warmer ocean temperatures intensifying storms',
    impact: 'Habitat destruction, flooding, power grid failure',
    solutions: ['Reinforce infrastructure', 'Restore coral reefs', 'Deploy emergency response', 'Invest in renewable microgrids'],
    outcome: 'Ecosystems rebuild stronger; energy resilience improves',
    severity: 'critical',
    metricsAffected: { forest: -8, water: -10, biodiversity: -10, air: -5 },
  },
  {
    id: 'heatwave',
    name: 'Extreme Heatwave',
    icon: 'ThermometerSun',
    problem: 'Prolonged extreme temperatures across continents',
    cause: 'Accelerated global warming',
    impact: 'Drought, crop failure, heat-related mortality, water stress',
    solutions: ['Deploy cool roofing', 'Expand urban green spaces', 'Solar-powered cooling centers', 'Reduce carbon emissions'],
    outcome: 'Urban temperatures drop; water stress eases',
    severity: 'high',
    metricsAffected: { air: -8, water: -10, forest: -6, carbon: 8 },
  },
  {
    id: 'drought',
    name: 'Severe Drought',
    icon: 'Sun',
    problem: 'Extended dry period depleting water reserves',
    cause: 'Altered precipitation patterns from climate change',
    impact: 'Crop failure, ecosystem stress, water scarcity',
    solutions: ['Drip irrigation', 'Desalination plants', 'Rainwater harvesting', 'Plant drought-resistant species'],
    outcome: 'Water reserves recover; agricultural resilience improves',
    severity: 'moderate',
    metricsAffected: { water: -15, forest: -8, biodiversity: -6 },
  },
  {
    id: 'oil-spill',
    name: 'Oil Spill',
    icon: 'Droplet',
    problem: 'Marine oil spill spreading across ocean',
    cause: 'Offshore drilling accident',
    impact: 'Marine life devastation, water contamination, coastal damage',
    solutions: ['Deploy containment booms', 'Bioremediation', 'Wildlife rescue operations', 'Transition to renewable energy'],
    outcome: 'Marine ecosystem stabilizes; water quality improves over 3 years',
    severity: 'high',
    metricsAffected: { water: -18, biodiversity: -15 },
  },
  {
    id: 'plastic-bloom',
    name: 'Plastic Bloom',
    icon: 'Trash2',
    problem: 'Massive plastic accumulation in ocean gyres',
    cause: 'Inadequate waste management globally',
    impact: 'Marine ingestion, microplastic spread, food chain contamination',
    solutions: ['Ocean cleanup vessels', 'Ban single-use plastics', 'Invest in biodegradable alternatives', 'Expand recycling'],
    outcome: 'Plastic concentration decreases; marine health improves',
    severity: 'moderate',
    metricsAffected: { water: -10, biodiversity: -8 },
  },
  {
    id: 'coral-bleaching',
    name: 'Coral Bleaching',
    icon: 'Fish',
    problem: 'Widespread coral reef bleaching event',
    cause: 'Ocean acidification and warming',
    impact: 'Reef ecosystem collapse, fish population crash',
    solutions: ['Coral nurseries', 'Reduce ocean temperatures', 'Marine protected areas', 'Cut carbon emissions'],
    outcome: 'Coral regrowth begins; fish populations recover',
    severity: 'high',
    metricsAffected: { biodiversity: -18, water: -8 },
  },
  {
    id: 'extinction',
    name: 'Species Extinction',
    icon: 'Bird',
    problem: 'Critical decline in endangered species populations',
    cause: 'Habitat loss, pollution, climate shift',
    impact: 'Ecosystem collapse, food web disruption',
    solutions: ['Protected habitats', 'Captive breeding', 'Wildlife corridors', 'Restore native ecosystems'],
    outcome: 'Species populations stabilize; biodiversity recovers',
    severity: 'critical',
    metricsAffected: { biodiversity: -20, forest: -5 },
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'forest-guardian', name: 'Forest Guardian', description: 'Restore forest cover above 80%', icon: 'Trees', points: 500, threshold: 80, category: 'forest' },
  { id: 'ocean-protector', name: 'Ocean Protector', description: 'Achieve water quality above 85%', icon: 'Waves', points: 500, threshold: 85, category: 'water' },
  { id: 'climate-leader', name: 'Climate Leader', description: 'Reduce carbon below 30 ppm', icon: 'Cloud', points: 750, threshold: 70, category: 'carbon' },
  { id: 'water-defender', name: 'Water Defender', description: 'Maintain water quality above 75%', icon: 'Droplets', points: 400, threshold: 75, category: 'water' },
  { id: 'carbon-hero', name: 'Carbon Hero', description: 'Cut carbon emissions by 50%', icon: 'CloudOff', points: 600, threshold: 50, category: 'carbon' },
  { id: 'wildlife-guardian', name: 'Wildlife Guardian', description: 'Restore biodiversity above 80%', icon: 'Bird', points: 550, threshold: 80, category: 'biodiversity' },
  { id: 'green-architect', name: 'Green Architect', description: 'Reach 90% renewable energy', icon: 'Building2', points: 700, threshold: 90, category: 'renewable' },
  { id: 'earth-restorer', name: 'Earth Restorer', description: 'All metrics above 70%', icon: 'Globe', points: 1000, threshold: 70, category: 'all' },
  { id: 'net-zero-champion', name: 'Net Zero Champion', description: 'Carbon neutral status achieved', icon: 'Award', points: 1200, threshold: 20, category: 'carbon' },
];

export const MISSIONS: Mission[] = [
  { id: 1, title: 'Restore Forests', subtitle: 'The Green Awakening', objective: 'Raise forest cover to 75%', briefing: 'Deforestation has reached critical levels. Your mission is to restore forest ecosystems through strategic reforestation.', targetMetric: 'forest', targetValue: 75, successCondition: 'Forest cover reaches 75%', failureCondition: 'Forest cover falls below 40%', reward: 500, icon: 'Trees' },
  { id: 2, title: 'Clean Rivers', subtitle: 'The Clear Current', objective: 'Raise water quality to 80%', briefing: 'Industrial pollution has contaminated major waterways. Implement water treatment and conservation measures.', targetMetric: 'water', targetValue: 80, successCondition: 'Water quality reaches 80%', failureCondition: 'Water quality falls below 45%', reward: 600, icon: 'Droplets' },
  { id: 3, title: 'Reduce Plastic Pollution', subtitle: 'The Tide Turner', objective: 'Reduce plastic impact by 60%', briefing: 'Plastic waste is choking our oceans. Deploy recycling and plastic reduction policies.', targetMetric: 'water', targetValue: 78, successCondition: 'Plastic reduction target met', failureCondition: 'Plastic levels remain above 50%', reward: 550, icon: 'Recycle' },
  { id: 4, title: 'Improve Air Quality', subtitle: 'The Breath of Change', objective: 'Raise air quality to 80%', briefing: 'Air pollution is causing health crises. Transition to clean transport and regulate factories.', targetMetric: 'air', targetValue: 80, successCondition: 'Air quality reaches 80%', failureCondition: 'Air quality falls below 40%', reward: 650, icon: 'Wind' },
  { id: 5, title: 'Protect Wildlife', subtitle: 'The Living Sanctuary', objective: 'Raise biodiversity to 75%', briefing: 'Species populations are collapsing. Protect habitats and restore ecosystems.', targetMetric: 'biodiversity', targetValue: 75, successCondition: 'Biodiversity reaches 75%', failureCondition: 'Biodiversity falls below 30%', reward: 700, icon: 'Bird' },
  { id: 6, title: 'Reach Net Zero', subtitle: 'The Carbon Horizon', objective: 'Reduce carbon to 25 ppm', briefing: 'Carbon emissions must peak and decline. Deploy renewables and electrify transport.', targetMetric: 'carbon', targetValue: 25, successCondition: 'Carbon level drops to 25', failureCondition: 'Carbon exceeds 90', reward: 900, icon: 'Cloud' },
  { id: 7, title: 'Build Sustainable Cities', subtitle: 'The Urban Renaissance', objective: 'Renewable energy above 85%', briefing: 'Cities must transition to sustainable energy. Deploy solar, wind, and smart grids.', targetMetric: 'renewable', targetValue: 85, successCondition: 'Renewable energy reaches 85%', failureCondition: 'Renewable stays below 30%', reward: 800, icon: 'Building2' },
  { id: 8, title: 'Restore Oceans', subtitle: 'The Deep Recovery', objective: 'Water + Biodiversity above 80%', briefing: 'Ocean ecosystems are dying. Restore coral, reduce pollution, and protect marine life.', targetMetric: 'biodiversity', targetValue: 80, successCondition: 'Ocean health restored', failureCondition: 'Ocean health below 40%', reward: 1000, icon: 'Waves' },
];

export const TIMELINE_YEARS = [2026, 2030, 2040, 2050, 2075, 2100];

export const TIMELINE_SCENARIOS = [
  {
    year: 2026,
    title: 'The Turning Point',
    description: 'Current trajectory. Decisions made now determine the next century.',
    metrics: { forest: 52, water: 61, air: 48, carbon: 72, biodiversity: 44, renewable: 28 },
  },
  {
    year: 2030,
    title: 'Critical Decade',
    description: 'Emissions peak. Renewable energy scales. Forest restoration begins.',
    metrics: { forest: 58, water: 65, air: 55, carbon: 65, biodiversity: 50, renewable: 45 },
  },
  {
    year: 2040,
    title: 'The Great Transition',
    description: 'Major economies reach 60% renewable. Electric transport dominates.',
    metrics: { forest: 65, water: 72, air: 68, carbon: 50, biodiversity: 58, renewable: 65 },
  },
  {
    year: 2050,
    title: 'Net Zero Milestone',
    description: 'Global net-zero target. Carbon capture at scale. Oceans recovering.',
    metrics: { forest: 72, water: 78, air: 78, carbon: 35, biodiversity: 65, renewable: 80 },
  },
  {
    year: 2075,
    title: 'The Restoration Era',
    description: 'Forests expanding. Coral reefs regenerating. Biodiversity surging.',
    metrics: { forest: 82, water: 85, air: 88, carbon: 22, biodiversity: 78, renewable: 92 },
  },
  {
    year: 2100,
    title: 'The Balanced Earth',
    description: 'Sustainable civilization. Ecosystems thriving. Climate stabilized.',
    metrics: { forest: 90, water: 92, air: 95, carbon: 15, biodiversity: 88, renewable: 98 },
  },
];
