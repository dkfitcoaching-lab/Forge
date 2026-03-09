import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useCoach } from '../context/CoachContext'
import { storage } from '../utils/storage'
import { getGreeting, getDayLabel, formatDate } from '../utils/helpers'
import { DAYS, MEALS, MACROS, SUPPLEMENTS } from '../data/workouts'
import GlassCard from '../components/GlassCard'
import MacroRing from '../components/MacroRing'
import CircularProgress from '../components/CircularProgress'
import ForgeButton from '../components/ForgeButton'
import {
  ChevronLeft, ChevronRight, Play, Droplets, Check, Pill,
  ClipboardCheck, BookOpen, BarChart3, TrendingUp, Target,
  Flame, Dumbbell, Moon, Zap, Link2, Camera, ScanLine
} from 'lucide-react'

const dateKey = () => new Date().toDateString()

export default function TodayScreen({ onStartWorkout, onNavigate }) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { prescribedModules } = useCoach()
  const [currentDay, setCurrentDay] = useState(() => storage.get('current_day', 1))
  const day = DAYS[currentDay - 1] || DAYS[0]

  // Meal tracking
  const [mealChecks, setMealChecks] = useState(() => storage.get('meals_' + dateKey(), {}))
  const completedMeals = Object.values(mealChecks).filter(Boolean).length
  const mealCalories = MEALS.reduce((sum, m, i) => sum + (mealChecks[i] ? m.cal : 0), 0)
  const mealProtein = MEALS.reduce((sum, m, i) => sum + (mealChecks[i] ? m.p : 0), 0)
  const mealCarbs = MEALS.reduce((sum, m, i) => sum + (mealChecks[i] ? m.c : 0), 0)
  const mealFat = MEALS.reduce((sum, m, i) => sum + (mealChecks[i] ? m.f : 0), 0)

  const toggleMeal = (i) => {
    const next = { ...mealChecks, [i]: !mealChecks[i] }
    setMealChecks(next)
    storage.set('meals_' + dateKey(), next)
  }

  // Water tracking
  const [water, setWater] = useState(() => storage.get('water_' + dateKey(), 0))
  const addWater = () => {
    const next = Math.min(16, water + 1)
    setWater(next)
    storage.set('water_' + dateKey(), next)
  }

  // Supplement tracking
  const [suppChecks, setSuppChecks] = useState(() => storage.get('supps_' + dateKey(), {}))
  const toggleSupp = (i) => {
    const next = { ...suppChecks, [i]: !suppChecks[i] }
    setSuppChecks(next)
    storage.set('supps_' + dateKey(), next)
  }

  const changeDay = (dir) => {
    const next = dir === 'next' ? (currentDay >= 14 ? 1 : currentDay + 1) : (currentDay <= 1 ? 14 : currentDay - 1)
    setCurrentDay(next)
    storage.set('current_day', next)
  }

  const stagger = (i) => ({ delay: 0.05 * i })
  const greeting = getGreeting()
  const firstName = user?.name?.split(' ')[0] || 'Athlete'

  return (
    <div className="pb-4">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative -mx-4 -mt-4 mb-6 overflow-hidden rounded-b-3xl"
        style={{ padding: '48px 24px 36px' }}
      >
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${theme.accent}08, ${theme.card}60, ${theme.accent}04)`,
        }} />
        <div className="absolute top-[-120px] right-[-80px] w-[280px] h-[280px] rounded-full"
          style={{ background: `radial-gradient(circle, ${theme.accent}08, transparent 70%)` }} />
        <div className="absolute bottom-[-80px] left-[-60px] w-[200px] h-[200px] rounded-full"
          style={{ background: `radial-gradient(circle, ${theme.accent2}06, transparent 70%)` }} />

        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(0)}>
            <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em' }}>
              {getDayLabel()} — {formatDate()}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.t1, lineHeight: 1.1, fontFamily: "'Cinzel', serif", marginTop: 8 }}>
              {greeting},
            </h1>
            <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, fontFamily: "'Cinzel', serif", marginTop: 4,
              background: theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {firstName}.
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Day selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(1)}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button onClick={() => changeDay('prev')} whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: `${theme.card}`, border: `1px solid ${theme.border}` }}>
            <ChevronLeft size={16} color={theme.t3} />
          </motion.button>
          <div className="text-center" style={{ minWidth: 180 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
              Day {currentDay}
            </div>
            <div style={{ fontSize: 10, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginTop: 2 }}>
              {day.t}
            </div>
          </div>
          <motion.button onClick={() => changeDay('next')} whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: `${theme.card}`, border: `1px solid ${theme.border}` }}>
            <ChevronRight size={16} color={theme.t3} />
          </motion.button>
        </div>
      </motion.div>

      {/* Workout card */}
      {prescribedModules.workout && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(2)}>
          {day.isRest ? (
            <GlassCard className="mb-4 p-5" style={{ borderLeft: `3px solid ${theme.t4}` }}>
              <div className="flex items-center gap-3 mb-3">
                <Moon size={18} color={theme.t3} />
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.t3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  REST DAY
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.t2, fontFamily: "'Cinzel', serif" }}>
                Recovery Day
              </div>
              <div style={{ fontSize: 12, color: theme.t4, marginTop: 4 }}>
                Your body grows outside the gym. Focus on recovery protocols.
              </div>
              {day.recovery && (
                <div className="mt-4 flex flex-col gap-2">
                  {day.recovery.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
                      <span style={{ fontSize: 11, color: theme.t3 }}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="mb-4 p-5" accent style={{ borderLeft: `3px solid ${theme.accent}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell size={14} color={theme.accent} />
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  TODAY'S TRAINING
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
                {day.t}
              </div>
              <div className="flex items-center gap-4 mt-2 mb-4">
                <span style={{ fontSize: 11, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                  {day.exercises?.length || 0} exercises
                </span>
                <span style={{ fontSize: 11, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                  ~{day.m} min
                </span>
              </div>
              <ForgeButton onClick={() => onStartWorkout(day)} fullWidth icon={<Play size={16} />}>
                START WORKOUT
              </ForgeButton>
            </GlassCard>
          )}
        </motion.div>
      )}

      {/* Macros overview */}
      {prescribedModules.meals && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(3)}>
          <GlassCard className="mb-4 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={14} color={theme.accent} />
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  NUTRITION
                </span>
              </div>
              <span style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                {completedMeals}/{MEALS.length} meals
              </span>
            </div>
            <MacroRing
              calories={mealCalories}
              protein={mealProtein}
              carbs={mealCarbs}
              fat={mealFat}
              targets={MACROS}
            />

            {/* Meal checklist */}
            <div className="mt-5">
              <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: `${theme.accent}10` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: theme.accent }}
                  animate={{ width: `${(completedMeals / MEALS.length) * 100}%` }}
                />
              </div>
              {MEALS.map((meal, i) => (
                <motion.div
                  key={i}
                  onClick={() => toggleMeal(i)}
                  className="flex items-center gap-3 py-3 cursor-pointer"
                  style={{ borderBottom: i < MEALS.length - 1 ? `1px solid ${theme.border}` : 'none' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{
                    background: mealChecks[i] ? `${theme.success}20` : 'transparent',
                    border: `1.5px solid ${mealChecks[i] ? theme.success : theme.t5}`,
                    transition: 'all 0.2s',
                  }}>
                    {mealChecks[i] && <Check size={12} color={theme.success} strokeWidth={3} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{
                      fontSize: 13, fontWeight: 500,
                      color: mealChecks[i] ? theme.t3 : theme.t1,
                      textDecoration: mealChecks[i] ? 'line-through' : 'none',
                      transition: 'all 0.2s',
                    }}>
                      {meal.name}
                    </div>
                    <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                      {meal.cal} kcal — {meal.p}p / {meal.c}c / {meal.f}f
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                    {meal.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Water tracking */}
      {prescribedModules.water && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(4)}>
          <GlassCard className="mb-4 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets size={14} color={theme.accent} />
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  HYDRATION
                </span>
              </div>
              <span style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                {water}/16 glasses
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 16 }, (_, i) => (
                <motion.div
                  key={i}
                  onClick={i === water ? addWater : undefined}
                  className="rounded-lg cursor-pointer"
                  style={{
                    width: 'calc(12.5% - 5px)', aspectRatio: '1',
                    background: i < water ? `${theme.accent}25` : `${theme.accent}08`,
                    border: `1px solid ${i < water ? theme.accent + '40' : theme.border}`,
                    boxShadow: i < water ? `0 0 8px ${theme.accent}15` : 'none',
                    transition: 'all 0.3s',
                  }}
                  whileTap={i === water ? { scale: 0.9 } : {}}
                />
              ))}
            </div>
            <motion.button
              onClick={addWater}
              className="w-full mt-3 py-2 rounded-xl cursor-pointer"
              style={{
                background: `${theme.accent}08`, border: `1px solid ${theme.borderAccent}`,
                color: theme.accent, fontSize: 11, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              whileTap={{ scale: 0.98 }}
            >
              + ADD GLASS
            </motion.button>
          </GlassCard>
        </motion.div>
      )}

      {/* Supplements */}
      {prescribedModules.supplements && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(5)}>
          <GlassCard className="mb-4 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Pill size={14} color={theme.accent} />
              <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                SUPPLEMENTS
              </span>
            </div>
            {SUPPLEMENTS.map((supp, i) => (
              <motion.div
                key={i}
                onClick={() => toggleSupp(i)}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
                style={{ borderBottom: i < SUPPLEMENTS.length - 1 ? `1px solid ${theme.border}` : 'none' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{
                  background: suppChecks[i] ? `${theme.accent}20` : 'transparent',
                  border: `1px solid ${suppChecks[i] ? theme.accent : theme.t5}`,
                }}>
                  {suppChecks[i] && <Check size={10} color={theme.accent} strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <span style={{
                    fontSize: 12, color: suppChecks[i] ? theme.t3 : theme.t2,
                    textDecoration: suppChecks[i] ? 'line-through' : 'none',
                  }}>
                    {supp.name} — {supp.dose}
                  </span>
                </div>
                <span style={{ fontSize: 9, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                  {supp.timing}
                </span>
              </motion.div>
            ))}
          </GlassCard>
        </motion.div>
      )}

      {/* Streak card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(6)}>
        <GlassCard className="mb-4 p-4" accent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                  background: `${theme.warning}12`, border: `1px solid ${theme.warning}25`,
                  boxShadow: `0 0 20px ${theme.warning}10`,
                }}>
                  <Flame size={22} color={theme.warning} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: theme.warning, boxShadow: `0 0 10px ${theme.warning}60` }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#000', fontFamily: "'JetBrains Mono', monospace" }}>
                    12
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.t1, fontFamily: "'JetBrains Mono', monospace",
                  animation: 'streak-pulse 3s ease-in-out infinite' }}>
                  12 Day Streak
                </div>
                <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                  Personal best! Keep pushing.
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={stagger(7)}>
        <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.15em', marginBottom: 8, marginTop: 4 }}>
          QUICK ACTIONS
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Check-In', Icon: ClipboardCheck, view: 'checkin' },
            { label: 'Snap Meal', Icon: Camera, view: 'scanner' },
            { label: 'Progress', Icon: TrendingUp, view: 'progress' },
            { label: 'Goals', Icon: Target, view: 'goals' },
            { label: 'Guide', Icon: BookOpen, view: 'guide' },
            { label: 'Integrations', Icon: Link2, view: 'integrations' },
          ].map(({ label, Icon, view }) => (
            <GlassCard key={view} onClick={() => onNavigate(view)} className="p-4 flex items-center gap-3" hover>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                background: `${theme.accent}10`, border: `1px solid ${theme.accent}15`,
              }}>
                <Icon size={16} color={theme.accent} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: theme.t2 }}>{label}</span>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
