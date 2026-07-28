import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Eye, Brain, GitBranch, Layers, Cpu,
  Mail, MapPin, Trees, Droplets, Wind, Bird,
  Building2, Cloud, CheckCircle2, AlertTriangle, Sparkles, Zap,
  Workflow, Globe2,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar, StatCounter } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';

const BEFORE_AFTER = [
  { label: 'Forest', icon: Trees, before: 40, after: 82, color: 'var(--primary)' },
  { label: 'Ocean', icon: Droplets, before: 45, after: 88, color: 'var(--secondary)' },
  { label: 'Air', icon: Wind, before: 35, after: 78, color: 'var(--warning)' },
  { label: 'Wildlife', icon: Bird, before: 30, after: 75, color: 'var(--accent)' },
  { label: 'Cities', icon: Building2, before: 25, after: 85, color: 'var(--primary)' },
  { label: 'Carbon', icon: Cloud, before: 80, after: 20, color: 'var(--danger)' },
];

const TECH_STACK = [
  { name: 'React + TypeScript', desc: 'Type-safe component architecture', icon: Cpu },
  { name: 'React Three Fiber', desc: 'Declarative 3D Earth rendering', icon: Globe2 },
  { name: 'Three.js + Drei', desc: 'WebGL shaders and scene management', icon: Layers },
  { name: 'Framer Motion', desc: 'Cinematic animations and transitions', icon: Sparkles },
  { name: 'React Router', desc: 'Multi-page application navigation', icon: GitBranch },
  { name: 'Tailwind CSS', desc: 'Design system and responsive layout', icon: Layers },
];

const ROADMAP = [
  { phase: 'Phase 1', title: 'Core Platform', status: 'Complete', items: ['3D Earth visualization', 'Simulation engine', 'Command center', 'Mission system'] },
  { phase: 'Phase 2', title: 'Intelligence Layer', status: 'Complete', items: ['Rule-based AI advisor', 'Crisis events', 'Achievements', 'Future timeline'] },
  { phase: 'Phase 3', title: 'Real-World Data', status: 'Planned', items: ['Live satellite feeds', 'NASA/ESA API integration', 'Real climate datasets', 'Community challenges'] },
  { phase: 'Phase 4', title: 'Global Impact', status: 'Vision', items: ['Multiplayer missions', 'School programs', 'Policy maker tools', 'Open data platform'] },
];

const TEAM = [
  { name: 'Lead Architect', role: 'System Design & 3D Engine', icon: Cpu },
  { name: 'Environmental Scientist', role: 'Climate Modeling & Data', icon: Globe2 },
  { name: 'UI/UX Designer', role: 'Design System & Interactions', icon: Sparkles },
  { name: 'AI Engineer', role: 'Rule-Based Expert System', icon: Brain },
];

export default function Insights() {
  const [sliderPos, setSliderPos] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);

  const handleSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={20} />

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
        <section>
          <SectionTitle
            eyebrow="Problem Statement"
            title="Earth's systems are failing — and decisions are blind"
            description="Climate change, biodiversity loss, and pollution are accelerating. Yet environmental decisions are made without intuitive tools to understand their long-term consequences."
          />
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, title: '75% of ecosystems degraded', desc: 'UN reports find terrestrial ecosystems in rapid decline.', color: 'var(--danger)' },
              { icon: Cloud, title: 'CO₂ at 420+ ppm', desc: 'Highest levels in human history, rising 2-3 ppm annually.', color: 'var(--warning)' },
              { icon: Bird, title: '1M species at risk', desc: 'IPBES warns of unprecedented extinction rates.', color: 'var(--accent)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-6 h-full" hover>
                    <Icon className="w-8 h-8 mb-3" style={{ color: item.color }} />
                    <h3 className="font-semibold font-display mb-1">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="primary" className="mb-3"><Eye className="w-3 h-3" /> Vision</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-balance mb-4">
                Make environmental decisions <span className="gradient-text">visible, interactive, and explainable</span>
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                EcoSphere Genesis transforms abstract climate data into an immersive 3D experience.
                Users see the planet, adjust policies, and immediately understand the consequences —
                powered by a transparent rule-based engine, not a black-box AI.
              </p>
              <div className="space-y-3">
                {[
                  'Immersive 3D Earth with real-time ecosystem feedback',
                  'Explainable rule-based AI — every recommendation shows its reasoning',
                  'Story-driven missions that make sustainability engaging',
                  'Future timeline projecting decisions to 2100',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <GlassCard className="p-8" glow="primary">
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: 5, suffix: '', label: 'Interactive Pages' },
                  { value: 8, suffix: '', label: 'Story Missions' },
                  { value: 9, suffix: '', label: 'Achievements' },
                  { value: 9, suffix: '', label: 'Crisis Events' },
                  { value: 6, suffix: '', label: 'Earth Metrics' },
                  { value: 8, suffix: '', label: 'Policy Controls' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4">
                    <div className="text-3xl font-bold font-display gradient-text">
                      <StatCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>
        <section>
          <SectionTitle
            center
            eyebrow="Solution Architecture"
            title="How the Environmental Decision Engine works"
            description="A transparent rule-based system computes how policy changes ripple through six interconnected Earth systems."
          />
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            {[
              { icon: Target, step: '01', title: 'User adjusts policy', desc: 'Sliders control trees, factories, transport, solar, wind, plastic, recycling, water.' },
              { icon: Workflow, step: '02', title: 'Impact model computes', desc: 'Each control applies weighted deltas to six metrics: forest, water, air, carbon, biodiversity, renewable.' },
              { icon: Brain, step: '03', title: 'Rule-based AI evaluates', desc: 'Threshold rules generate explainable insights: problem, cause, impact, solution, benefit.' },
              { icon: Globe2, step: '04', title: 'World updates live', desc: '3D Earth, ecosystems, health meter, and future timeline respond instantly.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-6 h-full relative" hover>
                    <div className="absolute top-4 right-4 text-3xl font-bold font-display text-[var(--glass-border)]">{item.step}</div>
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold font-display mb-1.5">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
        <section>
          <GlassCard className="p-8 md:p-10" glow="primary">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Badge variant="primary" className="mb-3"><Brain className="w-3 h-3" /> Rule-Based AI</Badge>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Explainable, not a black box</h2>
                <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                  Unlike LLM-based systems, our advisor uses explicit if-then rules grounded in
                  environmental science. Every recommendation shows exactly why it was made —
                  the problem, its cause, the impact, the solution, and the expected benefit.
                </p>
                <div className="space-y-2.5">
                  {[
                    'No external AI APIs — runs entirely client-side',
                    'Threshold-based rules from climate research',
                    'Every insight is auditable and explainable',
                    'Deterministic — same inputs always produce same outputs',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <div className="text-[var(--text-muted)] mb-2">// Rule example</div>
                <div><span className="text-secondary">if</span> (metrics.forest &lt; 60) {'{'}</div>
                <div className="pl-4"><span className="text-secondary">if</span> (controls.trees &lt; 50)</div>
                <div className="pl-8">insight.cause = <span className="text-primary">"Insufficient reforestation"</span>;</div>
                <div className="pl-4"><span className="text-secondary">else</span></div>
                <div className="pl-8">insight.cause = <span className="text-primary">"Wildfires outpace restoration"</span>;</div>
                <div className="pl-4">insight.solution = ...;</div>
                <div className="pl-4">insight.benefit = ...;</div>
                <div>{'}'}</div>
                <div className="mt-3 text-[var(--text-muted)]">// Severity by threshold</div>
                <div>severity = value &lt; 40 ? <span className="text-danger">"high"</span> : value &lt; 60 ? <span className="text-warning">"moderate"</span> : <span className="text-primary">"low"</span>;</div>
              </div>
            </div>
          </GlassCard>
        </section>
        <section>
          <SectionTitle
            center
            eyebrow="Impact Comparison"
            title="Before vs After: The power of decisions"
            description="Drag the slider to see how sustainable policies transform Earth's systems."
          />
          <div ref={compareRef} className="mt-10 max-w-3xl mx-auto">
            <GlassCard className="p-6 mb-6">
              <div className="relative h-2 rounded-full bg-[var(--glass-border)] cursor-pointer" onClick={handleSlider}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-danger to-primary" style={{ width: `${sliderPos}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary shadow-glow border-2 border-[var(--bg)]" style={{ left: `calc(${sliderPos}% - 12px)` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-danger font-medium">Degraded Earth</span>
                <span className="text-primary font-medium">Restored Earth</span>
              </div>
            </GlassCard>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BEFORE_AFTER.map((item, i) => {
                const Icon = item.icon;
                const interpolated = item.label === 'Carbon'
                  ? item.before - (item.before - item.after) * (sliderPos / 100)
                  : item.before + (item.after - item.before) * (sliderPos / 100);
                return (
                  <motion.div key={item.label} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <GlassCard className="p-5" hover>
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                        <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                      </div>
                      <div className="text-2xl font-bold font-display" style={{ color: item.color }}>
                        {Math.round(interpolated)}{item.label === 'Carbon' ? ' ppm' : '%'}
                      </div>
                      <ProgressBar value={interpolated} color={item.color} height={6} />
                      <div className="flex justify-between mt-2 text-[10px] text-[var(--text-muted)]">
                        <span>Was: {item.before}</span>
                        <span>Goal: {item.after}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
        <section>
          <SectionTitle center eyebrow="Technology" title="Built with a modern stack" />
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }}>
                  <GlassCard className="p-5 flex items-center gap-4" hover>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold font-display text-sm">{t.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{t.desc}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
        <section>
          <SectionTitle center eyebrow="Roadmap" title="Project development timeline" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP.map((r, i) => (
              <motion.div key={r.phase} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{r.phase}</span>
                    <Badge variant={r.status === 'Complete' ? 'success' : r.status === 'Planned' ? 'secondary' : 'default'}>{r.status}</Badge>
                  </div>
                  <h3 className="font-semibold font-display mb-3">{r.title}</h3>
                  <ul className="space-y-1.5">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle center eyebrow="Team" title="Built by a mission-driven team" />
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map((member, i) => {
              const Icon = member.icon;
              return (
                <motion.div key={member.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="p-6 text-center" hover>
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mb-3">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="font-semibold font-display text-sm">{member.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{member.role}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>
        <section>
          <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden" glow="primary">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative">
              <Badge variant="primary" className="mb-4"><Mail className="w-3 h-3" /> Contact</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-balance mb-4">
                Let's build a sustainable future together
              </h2>
              <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-8">
                EcoSphere Genesis is an open environmental intelligence platform. Reach out for
                collaborations, education programs, or policy tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:team@ecosphere.genesis" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-ink font-medium shadow-glow hover:bg-primary-light transition-colors">
                  <Mail className="w-4 h-4" /> team@ecosphere.genesis
                </a>
                <div className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass text-[var(--text-muted)]">
                  <MapPin className="w-4 h-4" /> Built for AI-for-Earth Hackathon
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
        <section className="text-center pb-8">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">Credits</div>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            Environmental data references: NASA Earth Observatory, IPCC Reports, UN Environment Programme,
            IPBES Global Assessment. 3D Earth rendered procedurally via WebGL shaders — no external textures.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
