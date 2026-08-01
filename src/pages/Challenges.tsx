import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Waves, Award, Building2,
  Flame, CloudLightning, ThermometerSun, Trash2, Fish, Droplet, CloudOff,
  Factory, Car, Recycle,
  Target, Trophy, Star, Lock, CheckCircle2, XCircle, Play, RotateCcw,
  Sparkles, AlertTriangle, ChevronRight, Rocket,
} from 'lucide-react';
import { GlassCard, SectionTitle, Badge, ProgressBar, CircularProgress, Tooltip, Slider } from '@/components/ui';
import { Particles, FloatingShapes } from '@/components/ui/Particles';
import { Footer } from '@/components/layout/Footer';
import {
  MISSIONS, ACHIEVEMENTS, CRISIS_EVENTS, CONTROLS,
  type Mission, type Achievement, type CrisisEvent, type ControlKey, type MetricKey,
} from '@/data/environment';
import { computeMetrics } from '@/lib/advisorEngine';

const iconMap: Record<string, typeof Trees> = {
  Trees, Droplets, Wind, Cloud, Bird, Sun, Waves, Award, Building2,
  Flame, CloudLightning, ThermometerSun, Trash2, Fish, Droplet, CloudOff,
  Factory, Car, Recycle,
};

const MISSION_COLORS: Record<number, { bg: string; accent: string; emoji: string; difficulty: string }> = {
  1: { bg: 'from-emerald-900/40 to-green-900/20',   accent: '#00E5A8', emoji: '🌳', difficulty: 'Easy' },
  2: { bg: 'from-sky-900/40 to-blue-900/20',         accent: '#38BDF8', emoji: '💧', difficulty: 'Easy' },
  3: { bg: 'from-teal-900/40 to-cyan-900/20',        accent: '#06B6D4', emoji: '♻️', difficulty: 'Medium' },
  4: { bg: 'from-yellow-900/40 to-amber-900/20',     accent: '#F59E0B', emoji: '🌬️', difficulty: 'Medium' },
  5: { bg: 'from-purple-900/40 to-violet-900/20',    accent: '#7C3AED', emoji: '🦋', difficulty: 'Medium' },
  6: { bg: 'from-gray-900/40 to-slate-900/20',       accent: '#94A3B8', emoji: '🌍', difficulty: 'Hard' },
  7: { bg: 'from-orange-900/40 to-amber-900/20',     accent: '#F97316', emoji: '⚡', difficulty: 'Hard' },
  8: { bg: 'from-blue-900/40 to-indigo-900/20',      accent: '#6366F1', emoji: '🌊', difficulty: 'Expert' },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#00E5A8', Medium: '#F59E0B', Hard: '#EF4444', Expert: '#7C3AED',
};

export default function Challenges() {
  const [activeMission, setActiveMission]       = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [xp, setXp]                             = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [activeCrisis, setActiveCrisis]         = useState<CrisisEvent | null>(null);
  const [showAchievement, setShowAchievement]   = useState<Achievement | null>(null);
  const [controls, setControls]                 = useState(CONTROLS.map((c) => ({ ...c, value: 50 })));
  const [missionProgress, setMissionProgress]   = useState(0);
  const [missionResult, setMissionResult]       = useState<'success' | 'failure' | null>(null);
  const [celebrationParticles, setCelebrationParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

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
    const current = metrics[activeMission.targetMetric];
    const progress = Math.min(100, (current / activeMission.targetValue) * 100);
    setMissionProgress(progress);

    if (current >= activeMission.targetValue) {
      setMissionResult('success');
      setXp((p) => p + activeMission.reward);
      if (!completedMissions.includes(activeMission.id)) {
        setCompletedMissions((p) => [...p, activeMission.id]);
      }
      // Celebration particles
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        color: ['#00E5A8', '#38BDF8', '#7C3AED', '#F59E0B'][Math.floor(Math.random() * 4)],
      }));
      setCelebrationParticles(particles);
      setTimeout(() => setCelebrationParticles([]), 3000);
      checkAchievements(metrics);
    } else if (current < 20) {
      setMissionResult('failure');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, activeMission, missionResult]);

  const checkAchievements = (m: Record<MetricKey, number>) => {
    ACHIEVEMENTS.forEach((a) => {
      if (unlockedAchievements.includes(a.id)) return;
      let qualifies = false;
      if (a.category === 'all')    qualifies = Object.values(m).every((v) => v >= a.threshold);
      else if (a.category === 'carbon') qualifies = m.carbon <= a.threshold;
      else qualifies = (m[a.category as MetricKey] ?? 0) >= a.threshold;
      if (qualifies) {
        setUnlockedAchievements((p) => [...p, a.id]);
        setShowAchievement(a);
        setXp((p) => p + a.points);
        setTimeout(() => setShowAchievement(null), 4500);
      }
    });
  };

  const resolveCrisis = () => { setActiveCrisis(null); setXp((p) => p + 100); };

  const level = Math.floor(xp / 1000) + 1;
  const levelProgress = ((xp % 1000) / 1000) * 100;

  return (
    <div className="relative">
      <FloatingShapes />
      <Particles count={15} />

      {/* Achievement toast */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] glass-card px-6 py-4 flex items-center gap-4 glow-primary border border-primary/30"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0"
            >
              {(() => { const Icon = iconMap[showAchievement.icon] ?? Award; return <Icon className="w-7 h-7 text-ink" />; })()}
            </motion.div>
            <div>
              <div className="text-[10px] text-primary font-semibold uppercase tracking-widest">🎉 Achievement Unlocked</div>
              <div className="font-bold font-display text-lg">{showAchievement.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{showAchievement.description}</div>
              <motion.div
                className="text-sm font-bold text-primary mt-1"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.4, repeat: 3 }}
              >
                +{showAchievement.points} XP
              </motion.div>
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

        {/* Player Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <GlassCard className="p-5 glow-primary" >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold font-display text-ink text-2xl flex-shrink-0"
                animate={{ boxShadow: ['0 0 20px rgba(0,229,168,0.3)', '0 0 40px rgba(0,229,168,0.5)', '0 0 20px rgba(0,229,168,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {level}
              </motion.div>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold font-display">Director Level {level}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-2">{xp.toLocaleString()} XP Total</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">{1000 - (xp % 1000)} XP to next level</span>
                </div>
                <ProgressBar value={levelProgress} color="var(--primary)" height={10} />
              </div>
              <div className="flex gap-6 text-center flex-shrink-0">
                <div>
                  <div className="text-2xl font-bold text-primary">{completedMissions.length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Missions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{unlockedAchievements.length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Badges</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{xp.toLocaleString()}</div>
                  <div className="text-xs text-[var(--text-muted)]">XP</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Crisis Modal */}
        <AnimatePresence>
          {activeCrisis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                className="glass-card max-w-lg w-full p-6 glow-danger border border-danger/20"
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl bg-danger/15 flex items-center justify-center border border-danger/30"
                  >
                    {(() => { const Icon = iconMap[activeCrisis.icon] ?? AlertTriangle; return <Icon className="w-7 h-7 text-danger" />; })()}
                  </motion.div>
                  <div>
                    <Badge variant="danger" className="mb-1">🚨 {activeCrisis.severity.toUpperCase()} ALERT</Badge>
                    <h3 className="text-xl font-bold font-display">{activeCrisis.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 text-sm mb-5">
                  <div className="glass rounded-xl p-3">
                    <span className="text-danger font-semibold">Problem: </span>{activeCrisis.problem}
                  </div>
                  <div className="glass rounded-xl p-3">
                    <span className="text-warning font-semibold">Cause: </span>{activeCrisis.cause}
                  </div>
                  <div className="glass rounded-xl p-3">
                    <span className="text-primary font-semibold">Solutions:</span>
                    <ul className="mt-1.5 space-y-1">
                      {activeCrisis.solutions.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-[var(--text-muted)]">
                          <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass rounded-xl p-3">
                    <span className="text-secondary font-semibold">Expected Outcome: </span>{activeCrisis.outcome}
                  </div>
                </div>
                <motion.button
                  onClick={resolveCrisis}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,168,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-full bg-primary text-ink font-bold text-base shadow-glow"
                >
                  🛡️ Respond & Resolve (+100 XP)
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission Overlay */}
        <AnimatePresence>
          {activeMission && (
            <MissionOverlay
              mission={activeMission}
              controls={controls}
              metrics={metrics}
              progress={missionProgress}
              result={missionResult}
              celebrationParticles={celebrationParticles}
              onClose={() => setActiveMission(null)}
              onReset={() => startMission(activeMission)}
              onUpdate={updateControl}
            />
          )}
        </AnimatePresence>

        {/* Campaign Missions */}
        <div className="mb-14">
          <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" /> Campaign Missions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MISSIONS.map((m, i) => {
              const completed = completedMissions.includes(m.id);
              const locked    = i > 0 && !completedMissions.includes(MISSIONS[i - 1].id);
              const config    = MISSION_COLORS[m.id] ?? MISSION_COLORS[1];
              const diff      = config.difficulty;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08 }}
                >
                  <motion.div
                    whileHover={!locked ? { scale: 1.03, y: -6 } : {}}
                    whileTap={!locked ? { scale: 0.98 } : {}}
                    onClick={() => !locked && startMission(m)}
                    className={`glass-card p-5 h-full relative overflow-hidden ${locked ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}
                    style={completed ? { borderColor: 'rgba(0,229,168,0.3)' } : {}}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-60`} />

                    {/* Completed glow */}
                    {completed && <div className="absolute inset-0 bg-primary/5" />}

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${completed ? 'bg-primary/20' : 'bg-white/5'}`}
                          animate={completed ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {completed ? '✅' : locked ? '🔒' : config.emoji}
                        </motion.div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-muted)] mb-1">Mission {m.id}</div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${DIFFICULTY_COLORS[diff]}20`, color: DIFFICULTY_COLORS[diff] }}
                          >
                            {diff}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold font-display text-base mb-1">{m.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mb-1 italic">{m.subtitle}</p>
                      <p className="text-xs text-[var(--text-muted)] mb-4 line-clamp-2">{m.objective}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-warning">
                          <Star className="w-3 h-3 fill-warning" />
                          <span className="font-bold">{m.reward} XP</span>
                        </div>
                        {completed ? (
                          <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Done</Badge>
                        ) : locked ? (
                          <Badge variant="default"><Lock className="w-3 h-3" /> Locked</Badge>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background: `${config.accent}20`, color: config.accent }}
                          >
                            <Play className="w-3 h-3" /> Start
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-14">
          <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" /> Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = unlockedAchievements.includes(a.id);
              const Icon = iconMap[a.icon] ?? Award;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 5) * 0.06 }}
                >
                  <Tooltip content={a.description}>
                    <motion.div
                      whileHover={{ scale: 1.06, y: -4 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`glass-card p-4 text-center relative overflow-hidden ${unlocked ? 'glow-primary border border-primary/25' : 'opacity-55'}`}
                    >
                      {/* Unlocked shimmer */}
                      {unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-secondary/5" />
                      )}
                      <motion.div
                        className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3 relative ${unlocked ? 'bg-gradient-to-br from-primary to-secondary' : 'glass'}`}
                        animate={unlocked ? { boxShadow: ['0 0 10px rgba(0,229,168,0.3)', '0 0 25px rgba(0,229,168,0.5)', '0 0 10px rgba(0,229,168,0.3)'] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {unlocked ? <Icon className="w-7 h-7 text-ink" /> : <Lock className="w-6 h-6 text-[var(--text-muted)]" />}
                      </motion.div>
                      <div className="text-xs font-bold truncate relative">{a.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 relative">+{a.points} XP</div>
                      {unlocked && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                          <Badge variant="success"><Sparkles className="w-2.5 h-2.5" /> Unlocked</Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Crisis Events */}
        <div>
          <h3 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" /> Earth Crisis Events
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRISIS_EVENTS.map((c, i) => {
              const Icon = iconMap[c.icon] ?? AlertTriangle;
              const sevColor = c.severity === 'critical' ? '#EF4444' : c.severity === 'high' ? '#F59E0B' : '#94A3B8';
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="glass-card p-4 h-full group cursor-default"
                    style={{ borderLeft: `3px solid ${sevColor}40` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${sevColor}18` }}
                        animate={c.severity === 'critical' ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="w-5 h-5" style={{ color: sevColor }} />
                      </motion.div>
                      <div>
                        <div className="text-sm font-bold">{c.name}</div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sevColor}20`, color: sevColor }}>
                          {c.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{c.problem}</p>
                  </motion.div>
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

/* =========================================================
   MISSION OVERLAY
   ========================================================= */
function MissionOverlay({
  mission, controls, metrics, progress, result, celebrationParticles, onClose, onReset, onUpdate,
}: {
  mission: Mission;
  controls: typeof CONTROLS;
  metrics: Record<MetricKey, number>;
  progress: number;
  result: 'success' | 'failure' | null;
  celebrationParticles: { id: number; x: number; y: number; color: string }[];
  onClose: () => void;
  onReset: () => void;
  onUpdate: (key: ControlKey, value: number) => void;
}) {
  const Icon   = iconMap[mission.icon] ?? Target;
  const config = MISSION_COLORS[mission.id] ?? MISSION_COLORS[1];
  const current = Math.round(metrics[mission.targetMetric]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      {/* Celebration particles */}
      <AnimatePresence>
        {celebrationParticles.map((p) => (
          <motion.div
            key={p.id}
            className="fixed w-3 h-3 rounded-full pointer-events-none z-[60]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.5, 0], y: [-20, -80], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 250, damping: 22 }}
        className="glass-card max-w-2xl w-full max-h-[92vh] overflow-y-auto no-scrollbar relative"
        style={result === 'success' ? { borderColor: 'rgba(0,229,168,0.3)' } : result === 'failure' ? { borderColor: 'rgba(239,68,68,0.3)' } : {}}
      >
        {/* Mission illustration header */}
        <div className={`relative h-36 bg-gradient-to-br ${config.bg} rounded-t-2xl overflow-hidden flex items-center justify-center`}>
          <div className="absolute inset-0 nasa-grid opacity-20" />
          <motion.div
            className="text-7xl"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {config.emoji}
          </motion.div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 glass rounded-full p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4">
            <Badge variant="primary" className="font-orbitron text-[10px]">MISSION {mission.id}</Badge>
          </div>
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${DIFFICULTY_COLORS[config.difficulty]}25`, color: DIFFICULTY_COLORS[config.difficulty] }}>
              {config.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`} style={{ background: `${config.accent}20` }}>
              <Icon className="w-6 h-6" style={{ color: config.accent }} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">{mission.title}</h3>
              <p className="text-xs text-[var(--text-muted)] italic">{mission.subtitle}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="flex items-center gap-1 text-warning">
                <Star className="w-4 h-4 fill-warning" />
                <span className="font-bold text-sm">{mission.reward} XP</span>
              </div>
            </div>
          </div>

          {/* Briefing */}
          <div className="glass rounded-xl p-4 mb-5 border border-primary/10">
            <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">📋 Mission Briefing</div>
            <p className="text-sm leading-relaxed">{mission.briefing}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 glass rounded-lg px-2 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[var(--text-muted)]">{mission.successCondition}</span>
              </div>
              <div className="flex items-center gap-2 glass rounded-lg px-2 py-1.5">
                <XCircle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                <span className="text-[var(--text-muted)]">{mission.failureCondition}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 mb-5">
            <motion.div
              animate={result === 'success' ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0 0 rgba(0,229,168,0)', '0 0 0 20px rgba(0,229,168,0)', '0 0 0 0 rgba(0,229,168,0)'] } : {}}
              transition={{ duration: 0.8, repeat: result === 'success' ? 3 : 0 }}
            >
              <CircularProgress
                value={progress}
                size={110}
                strokeWidth={9}
                color={result === 'success' ? '#00E5A8' : result === 'failure' ? '#EF4444' : config.accent}
                label={`${Math.round(progress)}%`}
                sublabel="Progress"
              />
            </motion.div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Target: <strong>{mission.targetValue}%</strong></span>
                <span className="font-bold" style={{ color: config.accent }}>Current: {current}%</span>
              </div>
              <ProgressBar value={progress} color={config.accent} height={10} />
              <div className="mt-2 text-xs text-[var(--text-muted)]">
                Metric: <span className="capitalize font-medium text-[var(--text)]">{mission.targetMetric}</span>
              </div>
            </div>
          </div>

          {/* Result banner */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`mb-5 p-4 rounded-2xl flex items-center gap-4 ${result === 'success' ? 'bg-primary/12 border border-primary/25' : 'bg-danger/12 border border-danger/25'}`}
              >
                <motion.div
                  animate={result === 'success' ? { rotate: [0, 20, -20, 0] } : { x: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {result === 'success'
                    ? <span className="text-4xl">🎉</span>
                    : <span className="text-4xl">💔</span>
                  }
                </motion.div>
                <div>
                  <div className={`font-bold text-lg ${result === 'success' ? 'text-primary' : 'text-danger'}`}>
                    {result === 'success' ? 'Mission Complete!' : 'Mission Failed'}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {result === 'success' ? `+${mission.reward} XP earned — outstanding work, Director!` : 'Adjust your environmental policies and try again.'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Policy controls (only during active mission) */}
          {!result && (
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-3 font-bold">🎛 Adjust Policies</div>
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
                      <Slider
                        min={0}
                        max={100}
                        value={c.value}
                        onChange={(val) => onUpdate(c.key, val)}
                        accentColor={config.accent}
                        aria-label={c.label}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            {result ? (
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,168,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3.5 rounded-full bg-primary text-ink font-bold text-base shadow-glow"
              >
                ← Return to Missions
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={onReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-full glass font-medium flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-full glass font-medium flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <XCircle className="w-4 h-4" /> Abandon
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
