import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import {
  Brain, Dumbbell, Apple, BarChart3, MessageCircle, Target,
  ChevronRight, ChevronLeft, Sparkles, Shield, Zap, Heart,
  Clock, TrendingUp, Check
} from 'lucide-react'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to FORGE',
    subtitle: 'Your AI coaching platform',
    description: 'FORGE is not just another fitness app. It\'s a complete AI-powered coaching system that adapts every element of your program to your body, goals, and lifestyle in real-time.',
    Icon: Sparkles,
  },
  {
    id: 'how-it-works',
    title: 'How FORGE Works',
    subtitle: 'The architecture of your success',
    features: [
      { Icon: Brain, label: 'AI Coach', desc: 'Your 24/7 intelligent coach that knows your data, adjusts your program, and answers any question' },
      { Icon: Dumbbell, label: 'Smart Training', desc: 'Periodized programs with auto-progression, rest timers, and volume tracking' },
      { Icon: Apple, label: 'Precision Nutrition', desc: 'Macro-optimized meal plans with barcode scanning and real-time tracking' },
      { Icon: BarChart3, label: 'Data Intelligence', desc: 'Every metric visualized — see your progress, trends, and AI insights' },
    ],
  },
  {
    id: 'ai-brain',
    title: 'The AI Brain',
    subtitle: 'This is what makes FORGE different',
    description: 'The AI Coach is the brain of FORGE. It doesn\'t just track — it thinks. It analyzes your sleep, stress, energy, training volume, nutrition adherence, and recovery to make real-time adjustments to your program.',
    highlights: [
      'Adjusts workout intensity based on sleep & recovery',
      'Modifies meal plans based on your preferences',
      'Provides rationale for every programming decision',
      'Available 24/7 — ask anything, anytime',
    ],
    Icon: MessageCircle,
  },
  {
    id: 'dynamic-ui',
    title: 'Your Personal Interface',
    subtitle: 'Only what you need, when you need it',
    description: 'FORGE shows you only the modules the AI prescribes for your specific goals. Your interface is uniquely yours — no clutter, no irrelevant features. As your program evolves, so does your dashboard.',
    highlights: [
      'Dynamic modules appear based on your protocol',
      'Clean, focused interface — zero noise',
      'Everything is one tap away',
      'Adapts as your goals change',
    ],
    Icon: Target,
  },
  {
    id: 'goals',
    title: 'Set Your Goal',
    subtitle: 'What are we building toward?',
    isInput: true,
  },
]

const GOALS = [
  { id: 'muscle', label: 'Build Muscle', desc: 'Maximize hypertrophy and strength', Icon: Dumbbell },
  { id: 'fat-loss', label: 'Fat Loss', desc: 'Lean out while preserving muscle', Icon: TrendingUp },
  { id: 'strength', label: 'Get Stronger', desc: 'Pure strength and power', Icon: Zap },
  { id: 'health', label: 'General Health', desc: 'Overall fitness and wellbeing', Icon: Heart },
  { id: 'performance', label: 'Performance', desc: 'Athletic performance optimization', Icon: Clock },
  { id: 'compete', label: 'Competition Prep', desc: 'Bodybuilding or physique show', Icon: Shield },
]

export default function OnboardingScreen() {
  const { theme } = useTheme()
  const { completeOnboarding } = useAuth()
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [experience, setExperience] = useState(null)
  const current = STEPS[step]

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else completeOnboarding({ goal: selectedGoal, experience })
  }

  const prev = () => { if (step > 0) setStep(step - 1) }

  const canProceed = current.id === 'goals' ? selectedGoal && experience : true

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col" style={{ background: theme.bg }}>
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent}06 0%, transparent 70%)` }} />

      {/* Progress bar */}
      <div className="relative z-10 px-6 pt-14 pb-4">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: `${theme.accent}15` }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: i <= step ? theme.accent : 'transparent', boxShadow: i <= step ? `0 0 6px ${theme.accent}40` : 'none' }}
                animate={{ width: i < step ? '100%' : i === step ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span style={{ fontSize: 9, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
            STEP {step + 1} OF {STEPS.length}
          </span>
          {step < STEPS.length - 1 && (
            <button onClick={() => completeOnboarding({})} className="cursor-pointer"
              style={{ fontSize: 9, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', background: 'none', border: 'none' }}>
              SKIP TOUR
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon */}
            {current.Icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mt-4"
                style={{ background: `${theme.accent}10`, border: `1px solid ${theme.accent}20` }}
              >
                <current.Icon size={28} color={theme.accent} />
              </motion.div>
            )}

            {/* Title */}
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 30, fontWeight: 800, color: theme.t1,
              letterSpacing: '0.04em', lineHeight: 1.1 }}>
              {current.title}
            </h1>
            <p style={{ fontSize: 11, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.12em', marginTop: 8 }}>
              {current.subtitle}
            </p>

            {/* Description */}
            {current.description && (
              <p style={{ fontSize: 14, color: theme.t3, lineHeight: 1.8, marginTop: 20 }}>
                {current.description}
              </p>
            )}

            {/* Features grid */}
            {current.features && (
              <div className="flex flex-col gap-3 mt-8">
                {current.features.map(({ Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: `${theme.card}80`, border: `1px solid ${theme.border}` }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
                    }}>
                      <Icon size={18} color={theme.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.t1 }}>{label}</div>
                      <div style={{ fontSize: 12, color: theme.t3, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Highlights */}
            {current.highlights && (
              <div className="flex flex-col gap-3 mt-8">
                {current.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{
                      background: `${theme.accent}15`, border: `1px solid ${theme.accent}20`,
                    }}>
                      <Check size={12} color={theme.accent} />
                    </div>
                    <span style={{ fontSize: 13, color: theme.t2, lineHeight: 1.5 }}>{h}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Goal selection */}
            {current.isInput && (
              <div className="mt-8">
                <p style={{ fontSize: 9, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.15em', marginBottom: 12 }}>PRIMARY GOAL</p>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map(({ id, label, desc, Icon }) => (
                    <motion.button
                      key={id}
                      onClick={() => setSelectedGoal(id)}
                      className="p-4 rounded-xl text-left cursor-pointer"
                      style={{
                        background: selectedGoal === id ? `${theme.accent}15` : `${theme.card}80`,
                        border: `1px solid ${selectedGoal === id ? theme.accent + '40' : theme.border}`,
                        boxShadow: selectedGoal === id ? theme.glow : 'none',
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon size={20} color={selectedGoal === id ? theme.accent : theme.t3} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: selectedGoal === id ? theme.t1 : theme.t2, marginTop: 8 }}>{label}</div>
                      <div style={{ fontSize: 10, color: theme.t4, marginTop: 2 }}>{desc}</div>
                    </motion.button>
                  ))}
                </div>

                <p style={{ fontSize: 9, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.15em', marginTop: 24, marginBottom: 12 }}>EXPERIENCE LEVEL</p>
                <div className="flex gap-3">
                  {['beginner', 'intermediate', 'advanced'].map(lvl => (
                    <motion.button
                      key={lvl}
                      onClick={() => setExperience(lvl)}
                      className="flex-1 py-3 rounded-xl cursor-pointer"
                      style={{
                        background: experience === lvl ? `${theme.accent}15` : `${theme.card}80`,
                        border: `1px solid ${experience === lvl ? theme.accent + '40' : theme.border}`,
                        color: experience === lvl ? theme.accent : theme.t3,
                        fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {lvl}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-8 pt-4"
        style={{ background: `linear-gradient(to top, ${theme.bg}, ${theme.bg}ee, transparent)` }}>
        <div className="flex gap-3 max-w-sm mx-auto">
          {step > 0 && (
            <motion.button
              onClick={prev}
              className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: `${theme.card}`, border: `1px solid ${theme.border}` }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} color={theme.t3} />
            </motion.button>
          )}
          <motion.button
            onClick={canProceed ? next : undefined}
            className="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
            style={{
              background: canProceed ? theme.gradient : theme.t5,
              color: canProceed ? theme.bg : theme.t4,
              fontWeight: 700, fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', border: 'none',
              opacity: canProceed ? 1 : 0.4,
            }}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            {step === STEPS.length - 1 ? 'LAUNCH FORGE' : 'CONTINUE'}
            <ChevronRight size={16} />
            {canProceed && (
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                backgroundSize: '200% 100%', animation: 'shimmer 2.5s linear infinite',
              }} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
