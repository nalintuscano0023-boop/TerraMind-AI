import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Waves, Award, Building2,
  Flame, CloudLightning, ThermometerSun, Trash2, Fish, Droplet, CloudOff,
  Factory, Car, Recycle,
  Target, Trophy, Star, Lock, CheckCircle2, XCircle, Play, RotateCcw,
  Sparkles, AlertTriangle, ChevronRight, Rocket,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar, CircularProgress, Tooltip } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import { MISSIONS, ACHIEVEMENTS, CRISIS_EVENTS, CONTROLS, type Mission, type Achievement, type CrisisEvent, type ControlKey, type MetricKey } from '@/data/environment';
import { computeMetrics } from '@/lib/advisorEngine';

const iconMap: Record<string, typeof Trees> = {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Waves, Award, Building2,
  Flame, CloudLightning, ThermometerSun, Trash2, Fish, Droplet, CloudOff,
  Factory: Factory, Car: Car, Recycle: Recycle,
};

export default function Challenges() {
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const [controls, setControls] = useState(CONTROLS.map((c) => ({ ...c, value: 50 })));
  const [missionProgress, setMissionProgress] = useState(0);
  const [missionResult, setMissionResult] = useState<'success' | 'failure' | null>(null);

  const metrics = useMemo(() => computeMetrics(controls), [controls]);
  useEffect(() => {
    if (activeMission || activeCrisis) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const crisis = CRISIS_EVENTS[Math.floor(Math.random() * CRISIS_EVENTS.length)];
        setActiveCrisis(crisis);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [activeMission, activeCrisis]);

  const startMission = (mission: Mission) => {
    setActiveMission(mission);
    setControls(CONTROLS.map((c) => ({ ...c, value: 50 })));
    setMissionProgress(0);
    setMissionResult(null);
  };

  const updateControl = (key: ControlKey, value: number) => {
    setControls((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)));
  };
  useEffect(() => {
    if (!activeMission || missionResult) return;
    const targetMetric = activeMission.targetMetric;
    const current = metrics[targetMetric];
    const progress = Math.min(100, (current / activeMission.targetValue) * 100);
    setMissionProgress(progress);

    if (current >= activeMission.targetValue) {
      setMissionResult('success');
      setXp((p) => p + activeMission.reward);
      if (!completedMissions.includes(activeMission.id)) {
        setCompletedMissions((p) => [...p, activeMission.id]);
      }
      checkAchievements(metrics);
    } else if (current < 20) {
      setMissionResult('failure');
    }
  }, [metrics, activeMission, missionResult]);

  const checkAchievements = (metrics: Record<MetricKey, number>) => {
    ACHIEVEMENTS.forEach((a) => {
      if (unlockedAchievements.includes(a.id)) return;
      let qualifies = false;
      if (a.category === 'all') {
        qualifies = Object.values(metrics).every((v) => v >= a.threshold);
      } else if (a.category === 'carbon') {
        qualifies = metrics.carbon <= a.threshold;
      } else {
        qualifies = (metrics[a.category as MetricKey] ?? 0) >= a.threshold;
      }
      if (qualifies) {
        setUnlockedAchievements((p) => [...p, a.id]);
        setShowAchievement(a);
        setXp((p) => p + a.points);
        setTimeout(() => setShowAchievement(null), 4000);
      }
    });
  };

  const resolveCrisis = () => {
    setActiveCrisis(null);
    setXp((p) => p + 100);
  };

  const level = Math.floor(xp / 1000) + 1;
  const levelProgress = ((xp % 1000) / 1000) * 100;

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={20} />
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] glass-card px-6 py-4 flex items-center gap-4 shadow-soft-lg"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              {(() => { const Icon = iconMap[showAchievement.icon] ?? Award; return <Icon className="w-6 h-6 text-ink" />; })()}
            </div>
            <div>
              <div className="text-xs text-primary font-medium uppercase tracking-widest">Achievement Unlocked</div>
              <div className="font-bold font-display">{showAchievement.name}</div>
              <div className="text-xs text-[var(--text-muted)]">+{showAchievement.points} XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <SectionTitle
          eyebrow="Story Mode"
          title="Become Earth's Environmental Director"
          description="Restore the planet through story-driven missions. Earn XP, unlock achievements, and respond to crisis events."
          className="mb-8"
        />
        <GlassCard className="p-5 mb-8" glow="primary">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold font-display text-ink">
                {level}
              </div>
              <div>
                <div className="text-sm font-semibold">Director Level {level}</div>
                <div className="text-xs text-[var(--text-muted)]">{xp.toLocaleString()} XP Total</div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ProgressBar value={levelProgress} color="var(--primary)" height={10} showLabel label={`Next level: ${1000 - (xp % 1000)} XP to go`} />
            </div>
            <div className="flex gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-primary">{completedMissions.length}</div>
                <div className="text-xs text-[var(--text-muted)]">Missions</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-secondary">{unlockedAchievements.length}</div>
                <div className="text-xs text-[var(--text-muted)]">Badges</div>
              </div>
            </div>
          </div>
        </GlassCard>
        <AnimatePresence>
          {activeCrisis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card max-w-lg w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-danger/15 flex items-center justify-center">
                    {(() => { const Icon = iconMap[activeCrisis.icon] ?? AlertTriangle; return <Icon className="w-6 h-6 text-danger" />; })()}
                  </div>
                  <div>
                    <Badge variant="danger">{activeCrisis.severity.toUpperCase()}</Badge>
                    <h3 className="text-lg font-bold font-display mt-1">{activeCrisis.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div><span className="text-[var(--text-muted)] font-medium">Problem: </span>{activeCrisis.problem}</div>
                  <div><span className="text-[var(--text-muted)] font-medium">Cause: </span>{activeCrisis.cause}</div>
                  <div><span className="text-[var(--text-muted)] font-medium">Impact: </span>{activeCrisis.impact}</div>
                  <div>
                    <span className="text-primary font-medium">Solutions:</span>
                    <ul className="mt-1.5 space-y-1">
                      {activeCrisis.solutions.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-[var(--text-muted)]">
                          <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div><span className="text-secondary font-medium">Outcome: </span>{activeCrisis.outcome}</div>
                </div>
                <button
                  onClick={resolveCrisis}
                  className="mt-5 w-full py-3 rounded-full bg-primary text-ink font-medium hover:bg-primary-light transition-colors"
                >
                  Respond & Resolve (+100 XP)
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeMission && (
            <MissionOverlay
              mission={activeMission}
              controls={controls}
              metrics={metrics}
              progress={missionProgress}
              result={missionResult}
              onClose={() => setActiveMission(null)}
              onReset={() => startMission(activeMission)}
              onUpdate={updateControl}
            />
          )}
        </AnimatePresence>
        <div className="mb-12">
          <h3 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Campaign Missions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MISSIONS.map((m, i) => {
              const completed = completedMissions.includes(m.id);
              const locked = i > 0 && !completedMissions.includes(MISSIONS[i - 1].id);
              const Icon = iconMap[m.icon] ?? Target;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08 }}
                >
                  <GlassCard className={`p-5 h-full ${locked ? 'opacity-50' : 'hover:-translate-y-1'} transition-transform cursor-pointer`} onClick={() => !locked && startMission(m)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed ? 'bg-primary/20' : 'glass'}`}>
                        {completed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : locked ? <Lock className="w-5 h-5 text-[var(--text-muted)]" /> : <Icon className="w-5 h-5 text-primary" />}
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">Mission {m.id}</span>
                    </div>
                    <h4 className="font-semibold font-display text-sm mb-1">{m.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{m.objective}</p>
                    {completed ? (
                      <Badge variant="success" className="w-full justify-center"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>
                    ) : locked ? (
                      <Badge variant="default" className="w-full justify-center"><Lock className="w-3 h-3" /> Locked</Badge>
                    ) : (
                      <button className="w-full py-2 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors">
                        <Play className="w-3 h-3" /> Start Mission
                      </button>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = unlockedAchievements.includes(a.id);
              const Icon = iconMap[a.icon] ?? Award;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 5) * 0.06 }}
                >
                  <Tooltip content={a.description}>
                    <GlassCard className={`p-4 text-center ${unlocked ? 'glow-primary' : 'opacity-60'}`}>
                      <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2 ${unlocked ? 'bg-gradient-to-br from-primary to-secondary' : 'glass'}`}>
                        {unlocked ? <Icon className="w-7 h-7 text-ink" /> : <Lock className="w-6 h-6 text-[var(--text-muted)]" />}
                      </div>
                      <div className="text-xs font-semibold truncate">{a.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">+{a.points} XP</div>
                      {unlocked && <Badge variant="success" className="mt-2"><Sparkles className="w-2.5 h-2.5" /> Unlocked</Badge>}
                    </GlassCard>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            Earth Crisis Events
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRISIS_EVENTS.map((c, i) => {
              const Icon = iconMap[c.icon] ?? AlertTriangle;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                >
                  <GlassCard className="p-4 h-full" hover>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-danger" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{c.name}</div>
                        <Badge variant={c.severity === 'critical' ? 'danger' : c.severity === 'high' ? 'warning' : 'default'}>{c.severity}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{c.problem}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function MissionOverlay({
  mission, controls, metrics, progress, result, onClose, onReset, onUpdate,
}: {
  mission: Mission;
  controls: typeof CONTROLS;
  metrics: Record<MetricKey, number>;
  progress: number;
  result: 'success' | 'failure' | null;
  onClose: () => void;
  onReset: () => void;
  onUpdate: (key: ControlKey, value: number) => void;
}) {
  const targetMetric = mission.targetMetric;
  const current = Math.round(metrics[targetMetric]);
  const Icon = iconMap[mission.icon] ?? Target;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Badge variant="primary">Mission {mission.id}</Badge>
              <h3 className="text-xl font-bold font-display mt-1">{mission.title}</h3>
              <p className="text-xs text-[var(--text-muted)]">{mission.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="glass rounded-xl p-4 mb-4">
          <div className="text-xs text-primary font-medium uppercase tracking-widest mb-1">Mission Briefing</div>
          <p className="text-sm leading-relaxed">{mission.briefing}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> {mission.successCondition}</div>
            <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-danger" /> {mission.failureCondition}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <CircularProgress
            value={progress}
            size={100}
            strokeWidth={8}
            color={result === 'success' ? 'var(--primary)' : result === 'failure' ? 'var(--danger)' : 'var(--secondary)'}
            label={`${Math.round(progress)}%`}
            sublabel="Progress"
          />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Target: {mission.targetValue}%</span>
              <span className="font-semibold">Current: {current}%</span>
            </div>
            <ProgressBar value={progress} color="var(--primary)" height={8} />
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Star className="w-3.5 h-3.5 text-warning" />
              Reward: {mission.reward} XP
            </div>
          </div>
        </div>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${result === 'success' ? 'bg-primary/15' : 'bg-danger/15'}`}
            >
              {result === 'success' ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <XCircle className="w-6 h-6 text-danger" />}
              <div>
                <div className={`font-bold ${result === 'success' ? 'text-primary' : 'text-danger'}`}>
                  {result === 'success' ? 'Mission Complete!' : 'Mission Failed'}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {result === 'success' ? `+${mission.reward} XP earned` : 'Adjust your policies and try again'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!result && (
          <div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Adjust Policies</div>
            <div className="grid grid-cols-2 gap-3">
              {controls.map((c) => {
                const CIcon = iconMap[c.icon] ?? Trees;
                return (
                  <div key={c.key} className="glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        <CIcon className="w-3.5 h-3.5 text-primary" />
                        {c.label}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">{c.value}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={c.value}
                      onChange={(e) => onUpdate(c.key, Number(e.target.value))}
                      className="w-full accent-[var(--primary)] cursor-pointer"
                      aria-label={c.label}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-5 flex gap-3">
          {result ? (
            <button onClick={onClose} className="flex-1 py-3 rounded-full bg-primary text-ink font-medium hover:bg-primary-light transition-colors">
              Return to Missions
            </button>
          ) : (
            <button onClick={onReset} className="flex-1 py-3 rounded-full glass text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
