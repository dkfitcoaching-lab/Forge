import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { storage } from '../utils/storage'
import GlassCard from '../components/GlassCard'
import ForgeButton from '../components/ForgeButton'
import { ChevronLeft, Check, Moon, Zap, Heart, Brain, Scale, Smile } from 'lucide-react'

function SliderInput({ label, value, onChange, icon: Icon, color, theme, min = 0, max = 10 }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} color={color} />
          <span style={{ fontSize: 9, fontWeight: 700, color: color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: theme.t1, fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </span>
      </div>
      <div className="relative h-8 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full" style={{ background: `${color}15` }} />
        <motion.div
          className="absolute h-1.5 rounded-full"
          style={{ background: color, width: `${pct}%`, boxShadow: `0 0 10px ${color}40` }}
          animate={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={1} value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          className="absolute w-full h-8 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
        />
        <motion.div
          className="absolute w-5 h-5 rounded-full border-2"
          style={{
            background: theme.bg, borderColor: color, left: `calc(${pct}% - 10px)`,
            boxShadow: `0 0 10px ${color}40`,
          }}
          animate={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
    </div>
  )
}

export default function CheckInScreen({ onBack }) {
  const { theme } = useTheme()
  const [data, setData] = useState({ sleep: 7, stress: 3, energy: 7, mood: 7, weight: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }))

  const submit = () => {
    storage.set('checkin_' + Date.now(), data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{
            background: `${theme.success}15`, border: `1px solid ${theme.success}25`,
          }}>
            <Check size={28} color={theme.success} />
          </div>
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
          Check-In Logged
        </h2>
        <p style={{ fontSize: 13, color: theme.t3, marginTop: 8, marginBottom: 24 }}>
          Your AI coach will factor this into today's programming.
        </p>
        <ForgeButton onClick={onBack} variant="secondary">BACK TO HOME</ForgeButton>
      </div>
    )
  }

  return (
    <div>
      <motion.button onClick={onBack} whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 mb-6 cursor-pointer"
        style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace" }}>
        <ChevronLeft size={16} /> BACK
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>
          Daily Check-In
        </h1>
        <p style={{ fontSize: 11, color: theme.t3, marginBottom: 20 }}>
          Help your AI coach optimize your program
        </p>
      </motion.div>

      <GlassCard className="p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={14} color={theme.accent} />
          <span style={{ fontSize: 9, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
            BODY WEIGHT
          </span>
        </div>
        <input
          type="number" inputMode="decimal" value={data.weight}
          onChange={e => update('weight', e.target.value)}
          placeholder="Enter weight (lbs)"
          className="w-full px-4 py-3 rounded-xl outline-none"
          style={{
            background: `${theme.accent}06`, border: `1px solid ${theme.borderAccent}`,
            color: theme.t1, fontSize: 18, fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace", textAlign: 'center',
          }}
        />
      </GlassCard>

      <GlassCard className="p-5 mb-4">
        <SliderInput label="SLEEP (HOURS)" value={data.sleep} onChange={v => update('sleep', v)} icon={Moon} color="#8b5cf6" theme={theme} />
        <SliderInput label="STRESS LEVEL" value={data.stress} onChange={v => update('stress', v)} icon={Brain} color="#ef4444" theme={theme} />
        <SliderInput label="ENERGY LEVEL" value={data.energy} onChange={v => update('energy', v)} icon={Zap} color={theme.warning} theme={theme} />
        <SliderInput label="MOOD" value={data.mood} onChange={v => update('mood', v)} icon={Smile} color={theme.success} theme={theme} />
      </GlassCard>

      <GlassCard className="p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={14} color={theme.accent} />
          <span style={{ fontSize: 9, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
            NOTES
          </span>
        </div>
        <textarea
          value={data.notes}
          onChange={e => update('notes', e.target.value)}
          placeholder="How are you feeling? Any aches, wins, or adjustments needed?"
          rows={3}
          className="w-full px-4 py-3 rounded-xl outline-none resize-none"
          style={{
            background: `${theme.accent}06`, border: `1px solid ${theme.borderAccent}`,
            color: theme.t1, fontSize: 13, lineHeight: 1.6,
          }}
        />
      </GlassCard>

      <ForgeButton onClick={submit} fullWidth>SUBMIT CHECK-IN</ForgeButton>
    </div>
  )
}
