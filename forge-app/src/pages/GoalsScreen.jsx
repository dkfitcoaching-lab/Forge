import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import CircularProgress from '../components/CircularProgress'
import { ChevronLeft, Target, Brain, TrendingUp, Dumbbell, Scale, Flame, Clock } from 'lucide-react'

export default function GoalsScreen({ onBack }) {
  const { theme } = useTheme()
  const { user } = useAuth()

  const goals = [
    {
      label: 'Primary Goal',
      value: user?.goal?.replace('-', ' ') || 'Build Muscle',
      Icon: Target,
      rationale: 'Based on your onboarding data, your training protocol emphasizes progressive overload with hypertrophy-focused rep ranges (8-12) and FST-7 finishers for maximum fascial stretching.',
    },
    {
      label: 'Training Frequency',
      value: '5-6 days/week',
      Icon: Dumbbell,
      rationale: 'Your 14-day split provides optimal frequency for each muscle group: 2x per 14 days with strategic rest days for CNS recovery.',
    },
    {
      label: 'Caloric Target',
      value: '2,500 kcal',
      Icon: Flame,
      rationale: 'Set at a slight caloric surplus (+200-300 above maintenance) to maximize muscle protein synthesis while minimizing fat accumulation. Adjusted based on your activity level and body composition.',
    },
    {
      label: 'Protein Target',
      value: '212g daily',
      Icon: Scale,
      rationale: 'Calculated at 1g per pound of body weight — the research-supported threshold for maximizing muscle protein synthesis in trained individuals.',
    },
    {
      label: 'Program Duration',
      value: '10 weeks (5 cycles)',
      Icon: Clock,
      rationale: 'Minimum 5 complete 14-day cycles before any program modifications. This ensures sufficient time for adaptation and meaningful progress data collection.',
    },
  ]

  const milestones = [
    { label: 'Week 1-2', desc: 'Neural adaptation phase — focus on form and mind-muscle connection', progress: 100 },
    { label: 'Week 3-4', desc: 'Volume accumulation — progressive overload begins', progress: 80 },
    { label: 'Week 5-6', desc: 'Intensity phase — pushing working sets closer to failure', progress: 40 },
    { label: 'Week 7-8', desc: 'Peak overreach — highest volume before deload', progress: 10 },
    { label: 'Week 9-10', desc: 'Deload & assessment — reduced volume, measure progress', progress: 0 },
  ]

  return (
    <div>
      <motion.button onClick={onBack} whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 mb-6 cursor-pointer"
        style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace" }}>
        <ChevronLeft size={16} /> BACK
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Target size={22} color={theme.accent} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
            Goals & Rationale
          </h1>
        </div>
        <p style={{ fontSize: 11, color: theme.t3, marginBottom: 24 }}>
          Every decision explained — the AI's reasoning for your protocol
        </p>
      </motion.div>

      {/* Goals with AI rationale */}
      {goals.map((goal, i) => (
        <motion.div key={goal.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.05 }}>
          <GlassCard className="p-5 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
              }}>
                <goal.Icon size={16} color={theme.accent} />
              </div>
              <div>
                <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  {goal.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: theme.t1, marginTop: 2, textTransform: 'capitalize' }}>
                  {goal.value}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{
              background: `${theme.accent}06`, border: `1px solid ${theme.accent}10`,
            }}>
              <Brain size={14} color={theme.accent} className="shrink-0 mt-0.5" />
              <p style={{ fontSize: 12, color: theme.t3, lineHeight: 1.6 }}>
                {goal.rationale}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ))}

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-3 mt-6">
          <TrendingUp size={14} color={theme.accent} />
          <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            PROGRAM MILESTONES
          </span>
        </div>
        {milestones.map((m, i) => (
          <GlassCard key={i} className="p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 12, fontWeight: 700, color: m.progress > 0 ? theme.t1 : theme.t4 }}>
                {m.label}
              </span>
              {m.progress === 100 && (
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.success, fontFamily: "'JetBrains Mono', monospace" }}>
                  COMPLETE
                </span>
              )}
              {m.progress > 0 && m.progress < 100 && (
                <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                  IN PROGRESS
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: theme.t3, marginBottom: 8 }}>{m.desc}</p>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: `${theme.accent}10` }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: m.progress === 100 ? theme.success : theme.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${m.progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </div>
  )
}
