import type { MetricKey, AdvisorInsight, Control, ControlKey } from '@/data/environment';
import { METRIC_META } from '@/data/environment';
interface RuleContext {
  metrics: Record<MetricKey, number>;
  controls: Record<ControlKey, number>;
}

type Severity = 'low' | 'moderate' | 'high';

function severityFor(value: number, good: number, moderate: number): Severity {
  if (value < moderate) return 'high';
  if (value < good) return 'moderate';
  return 'low';
}
export function generateInsights(ctx: RuleContext): AdvisorInsight[] {
  const { metrics, controls } = ctx;
  const insights: AdvisorInsight[] = [];
  if (metrics.forest < 60) {
    insights.push({
      problem: `Forest cover is at ${metrics.forest.toFixed(0)}% — below the safe threshold of 60%.`,
      cause: controls.trees < 50 ? 'Insufficient reforestation investment.' : 'Wildfires and illegal logging outpace restoration.',
      impact: 'Carbon sequestration drops, soil erodes, and biodiversity shrinks.',
      solution: controls.trees < 50 ? 'Increase tree planting programs and protect existing forests.' : 'Deploy firebreaks and satellite monitoring to prevent forest loss.',
      benefit: 'Each 10% forest increase absorbs ~1.2 billion tonnes of CO₂ annually.',
      severity: severityFor(metrics.forest, 60, 40),
      metric: 'forest',
    });
  }
  if (metrics.water < 65) {
    insights.push({
      problem: `Water quality is at ${metrics.water.toFixed(0)}% — industrial and plastic contamination detected.`,
      cause: controls.plastic < 50 ? 'High plastic waste entering waterways.' : controls.waterUsage < 50 ? 'Excessive water consumption without conservation.' : 'Industrial discharge exceeding treatment capacity.',
      impact: 'Marine ecosystems degrade; drinking water scarcity increases.',
      solution: controls.plastic < 50 ? 'Ban single-use plastics and deploy ocean cleanup.' : controls.waterUsage < 50 ? 'Implement drip irrigation and water recycling.' : 'Upgrade wastewater treatment and regulate factory discharge.',
      benefit: 'Clean water reduces disease and restores marine biodiversity.',
      severity: severityFor(metrics.water, 65, 45),
      metric: 'water',
    });
  }
  if (metrics.air < 60) {
    insights.push({
      problem: `Air quality is at ${metrics.air.toFixed(0)}% — PM2.5 and NO₂ above WHO limits.`,
      cause: controls.transport < 50 ? 'Fossil-fuel transport dominates.' : controls.factories < 50 ? 'Unregulated factory emissions.' : 'Combined industrial and vehicular pollution.',
      impact: 'Respiratory disease increases; smog reduces agricultural yields.',
      solution: controls.transport < 50 ? 'Electrify transport and expand public transit.' : 'Enforce factory emission scrubbers and carbon capture.',
      benefit: 'Clean air prevents 7 million premature deaths globally each year.',
      severity: severityFor(metrics.air, 60, 40),
      metric: 'air',
    });
  }
  if (metrics.carbon > 40) {
    insights.push({
      problem: `Carbon level is at ${metrics.carbon.toFixed(0)} ppm — above the 40 ppm safe zone.`,
      cause: controls.solar < 50 && controls.wind < 50 ? 'Renewable energy deployment too slow.' : 'Fossil fuel dependence in industry and transport.',
      impact: 'Global temperatures rise; extreme weather events intensify.',
      solution: controls.solar < 50 ? 'Scale solar farms and rooftop solar programs.' : 'Accelerate wind energy and electrify heavy industry.',
      benefit: 'Halving carbon by 2050 limits warming to 1.5°C.',
      severity: metrics.carbon > 70 ? 'high' : metrics.carbon > 55 ? 'moderate' : 'low',
      metric: 'carbon',
    });
  }
  if (metrics.biodiversity < 55) {
    insights.push({
      problem: `Biodiversity index is at ${metrics.biodiversity.toFixed(0)}% — species decline accelerating.`,
      cause: metrics.forest < 55 ? 'Habitat loss from deforestation.' : 'Pollution and climate shift disrupting ecosystems.',
      impact: 'Food webs destabilize; pollinator loss threatens agriculture.',
      solution: 'Create protected wildlife corridors and restore native habitats.',
      benefit: 'Biodiverse ecosystems are 3× more resilient to climate shocks.',
      severity: severityFor(metrics.biodiversity, 55, 35),
      metric: 'biodiversity',
    });
  }
  if (metrics.renewable < 50) {
    insights.push({
      problem: `Renewable energy is at ${metrics.renewable.toFixed(0)}% — fossil fuels still dominant.`,
      cause: controls.solar < 50 ? 'Solar infrastructure underdeveloped.' : controls.wind < 50 ? 'Wind capacity insufficient.' : 'Grid storage limiting renewable integration.',
      impact: 'Carbon emissions remain high; energy security at risk.',
      solution: 'Invest in solar, wind, and battery storage at scale.',
      benefit: '100% renewable cuts energy emissions by 75%.',
      severity: severityFor(metrics.renewable, 50, 30),
      metric: 'renewable',
    });
  }
  const order: Record<Severity, number> = { high: 0, moderate: 1, low: 2 };
  return insights.sort((a, b) => order[a.severity] - order[b.severity]);
}
export function computeMetrics(controls: Control[]): Record<MetricKey, number> {
  const metrics: Record<MetricKey, number> = {
    forest: 40,
    water: 40,
    air: 40,
    carbon: 60,
    biodiversity: 35,
    renewable: 20,
  };

  for (const c of controls) {
    for (const [metric, delta] of Object.entries(c.impact)) {
      const key = metric as MetricKey;
      const d = delta as number;
      metrics[key] += d * ((c.value - 50) / 50);
    }
  }
  for (const k of Object.keys(metrics) as MetricKey[]) {
    metrics[k] = Math.max(0, Math.min(100, metrics[k]));
  }

  return metrics;
}
export function computeHealthScore(metrics: Record<MetricKey, number>): number {
  const weights: Record<MetricKey, number> = {
    forest: 0.2,
    water: 0.2,
    air: 0.15,
    carbon: 0.2,
    biodiversity: 0.15,
    renewable: 0.1,
  };
  let score = 0;
  for (const [k, w] of Object.entries(weights)) {
    score += metrics[k as MetricKey] * w;
  }
  return Math.round(score);
}

export function getMetricLabel(key: MetricKey): string {
  return METRIC_META[key].label;
}
