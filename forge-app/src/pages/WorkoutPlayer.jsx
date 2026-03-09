import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { storage } from '../utils/storage'
import { formatTime } from '../utils/helpers'
import ForgeButton from '../components/ForgeButton'
import GlassCard from '../components/GlassCard'
import {
  ChevronLeft, Check, Timer, Flame, TrendingUp, Award,
  ChevronRight, SkipForward, Pause, Play, RotateCcw
} from 'lucide-react'

export default function WorkoutPlayer({ day, onExit }) {
  const { theme } = useTheme()
  const exercises = day.exercises || []
  const [exIdx, setExIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [trackData, setTrackData] = useState(() => storage.get(`wp_${day.d}`, {}))
  const [resting, setResting] = useState(false)
  const [restSecs, setRestSecs] = useState(0)
  const [done, setDone] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const startTime = useRef(Date.now())

  const exercise = exercises[exIdx] || {}
  const totalSets = exercise.sets || 3
  const trackKey = `${exIdx}_${setIdx}`

  // Elapsed timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  // Rest timer
  useEffect(() => {
    if (resting && restSecs > 0) {
      timerRef.current = setTimeout(() => setRestSecs(s => s - 1), 1000)
    } else if (restSecs === 0 && resting) {
      setResting(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [resting, restSecs])

  const saveField = (field, value) => {
    const next = { ...trackData, [`${trackKey}_${field}`]: value }
    setTrackData(next)
    storage.set(`wp_${day.d}`, next)
  }

  const completeSet = () => {
    if (setIdx < totalSets - 1) {
      setSetIdx(setIdx + 1)
      setResting(true)
      const restTime = exercise.tag === 'FST-7' ? 45 : exercise.protocol?.includes('5x') ? 120 : 90
      setRestSecs(restTime)
    } else if (exIdx < exercises.length - 1) {
      setExIdx(exIdx + 1)
      setSetIdx(0)
      setResting(true)
      setRestSecs(120)
    } else {
      setDone(true)
    }
  }

  const skipRest = () => { setResting(false); setRestSecs(0) }

  // Calculate total volume
  const totalVolume = Object.entries(trackData).reduce((acc, [key, val]) => {
    if (key.endsWith('_w')) {
      const repsKey = key.replace('_w', '_r')
      const w = parseFloat(val) || 0
      const r = parseFloat(trackData[repsKey]) || 0
      return acc + w * r
    }
    return acc
  }, 0)

  // Completion screen
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: theme.bg }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{
            background: `${theme.accent}15`, border: `1px solid ${theme.accent}25`,
            boxShadow: theme.glowStrong,
          }}>
            <Award size={36} color={theme.accent} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
            WORKOUT COMPLETE
          </h1>
          <p style={{ fontSize: 13, color: theme.t3, marginTop: 8 }}>Day {day.d} — {day.t}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex gap-6 mt-8 mb-10">
          {[
            { value: formatTime(elapsed), label: 'DURATION' },
            { value: exercises.length, label: 'EXERCISES' },
            { value: Math.round(totalVolume).toLocaleString(), label: 'VOLUME (LBS)' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div style={{ fontSize: 24, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                textShadow: `0 0 20px ${theme.accent}40` }}>
                {value}
              </div>
              <div style={{ fontSize: 7, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="w-full max-w-xs">
          <ForgeButton onClick={onExit} fullWidth>BACK TO HOME</ForgeButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <motion.button onClick={onExit} whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 cursor-pointer"
          style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace" }}>
          <ChevronLeft size={16} /> EXIT
        </motion.button>
        <div className="text-center">
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.t2, fontFamily: "'Cinzel', serif" }}>
            Day {day.d}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Timer size={12} color={theme.t4} />
          <span style={{ fontSize: 11, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Exercise progress dots */}
      <div className="flex justify-center gap-1.5 py-3 px-4">
        {exercises.map((_, i) => (
          <div key={i} className="h-1 rounded-full transition-all duration-300" style={{
            width: i === exIdx ? 24 : 8,
            background: i < exIdx ? theme.accent : i === exIdx ? theme.accent : `${theme.accent}20`,
            boxShadow: i === exIdx ? `0 0 8px ${theme.accent}40` : 'none',
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-5 pt-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${exIdx}-${setIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Exercise info */}
            <div className="text-center mb-6">
              {exercise.tag && (
                <span className="inline-block px-3 py-1 rounded-full mb-3" style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
                  background: exercise.tag === 'FST-7' ? `${theme.warning}15` : `${theme.accent}10`,
                  color: exercise.tag === 'FST-7' ? theme.warning : theme.accent,
                  border: `1px solid ${exercise.tag === 'FST-7' ? theme.warning + '30' : theme.accent + '20'}`,
                }}>
                  {exercise.tag}
                </span>
              )}
              <h2 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
                {exercise.name}
              </h2>
              <p style={{ fontSize: 12, color: theme.t3, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                {exercise.subtitle}
              </p>
              {exercise.protocol && (
                <div style={{ fontSize: 9, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.12em', marginTop: 6 }}>
                  {exercise.protocol}
                </div>
              )}
            </div>

            {/* Set tracker */}
            <GlassCard className="p-6 mb-4" accent>
              <div className="text-center mb-5">
                <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em' }}>
                  SET
                </div>
                <div style={{ fontSize: 48, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  textShadow: `0 0 30px ${theme.accent}40`, lineHeight: 1 }}>
                  {setIdx + 1}
                  <span style={{ fontSize: 18, color: theme.t4 }}>/{totalSets}</span>
                </div>
              </div>

              <div className="flex gap-4 mb-5">
                {[
                  { field: 'w', placeholder: 'lbs', label: 'WEIGHT' },
                  { field: 'r', placeholder: 'reps', label: 'REPS' },
                ].map(({ field, placeholder, label }) => (
                  <div key={field} className="flex-1">
                    <div style={{ fontSize: 8, color: theme.t4, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.12em', marginBottom: 6 }}>
                      {label}
                    </div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={trackData[`${trackKey}_${field}`] || ''}
                      onChange={e => saveField(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-xl text-center outline-none"
                      style={{
                        background: `${theme.accent}08`, border: `1px solid ${theme.borderAccent}`,
                        color: theme.t1, fontSize: 20, fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                  </div>
                ))}
              </div>

              <ForgeButton onClick={completeSet} fullWidth icon={<Check size={16} />}>
                COMPLETE SET
              </ForgeButton>
            </GlassCard>

            {/* Cues */}
            {exercise.cues && exercise.cues.length > 0 && (
              <div className="mb-4">
                <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.12em', marginBottom: 8 }}>
                  COACHING CUES
                </div>
                {exercise.cues.map((cue, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ background: theme.accent }} />
                    <span style={{ fontSize: 12, color: theme.t3 }}>{cue}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rest timer overlay */}
      <AnimatePresence>
        {resting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: `${theme.bg}ee` }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: theme.accent2,
                fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>
                REST PERIOD
              </div>
              <div style={{
                fontSize: 80, fontWeight: 200, fontFamily: "'JetBrains Mono', monospace",
                color: restSecs <= 5 ? theme.warning : theme.t1,
                textShadow: `0 0 40px ${restSecs <= 5 ? theme.warning : theme.accent}30`,
                lineHeight: 1,
              }}>
                {formatTime(restSecs)}
              </div>

              {/* Progress ring */}
              <div className="relative mx-auto mt-6" style={{ width: 200, height: 4 }}>
                <div className="absolute inset-0 rounded-full" style={{ background: `${theme.accent}15` }} />
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.accent}40` }}
                  animate={{ width: `${(restSecs / (exercise.tag === 'FST-7' ? 45 : 90)) * 100}%` }}
                />
              </div>

              <motion.button
                onClick={skipRest}
                className="mt-8 flex items-center gap-2 mx-auto cursor-pointer"
                style={{ background: 'none', border: `1px solid ${theme.border}`, borderRadius: 12,
                  padding: '10px 24px', color: theme.t3, fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace" }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipForward size={14} /> SKIP REST
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
