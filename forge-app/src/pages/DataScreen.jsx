import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { storage } from '../utils/storage'
import GlassCard from '../components/GlassCard'
import CircularProgress from '../components/CircularProgress'
import ForgeButton from '../components/ForgeButton'
import {
  BarChart3, TrendingUp, Activity, Calendar, Flame,
  Dumbbell, Moon, Heart, Brain, ChevronRight, ArrowUp, ArrowDown
} from 'lucide-react'

function MiniChart({ data, color, height = 40 }) {
  const { theme } = useTheme()
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => {
        const h = ((v - min) / range) * 0.8 + 0.2
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ background: color || theme.accent, opacity: 0.3 + (h * 0.7) }}
            initial={{ height: 0 }}
            animate={{ height: `${h * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          />
        )
      })}
    </div>
  )
}

function WeeklyOverview({ theme }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const completed = [true, true, true, false, true, true, false] // Simulated
  return (
    <div className="flex gap-2 justify-center">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
            background: completed[i] ? `${theme.accent}15` : `${theme.card}`,
            border: `1px solid ${completed[i] ? theme.accent + '30' : theme.border}`,
            boxShadow: completed[i] ? `0 0 8px ${theme.accent}15` : 'none',
          }}>
            {completed[i] ? <Flame size={14} color={theme.accent} /> :
              <span style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>{d}</span>}
          </div>
          <span style={{ fontSize: 8, color: completed[i] ? theme.accent : theme.t5,
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{d}</span>
        </div>
      ))}
    </div>
  )
}

export default function DataScreen() {
  const { theme } = useTheme()
  const [period, setPeriod] = useState('week')

  const stats = [
    { label: 'Workouts', value: '5', change: '+2', up: true, Icon: Dumbbell, color: theme.accent },
    { label: 'Avg Sleep', value: '7.2h', change: '+0.4', up: true, Icon: Moon, color: '#8b5cf6' },
    { label: 'Volume', value: '42k', change: '+8%', up: true, Icon: TrendingUp, color: theme.warning },
    { label: 'Streak', value: '12d', change: 'Best!', up: true, Icon: Flame, color: '#ef4444' },
  ]

  const sampleData = {
    volume: [28000, 31000, 29500, 33000, 35000, 32000, 38000],
    weight: [180.5, 180.2, 180.8, 179.9, 180.1, 179.6, 179.4],
    sleep: [7.5, 6.8, 7.2, 8.0, 7.1, 7.5, 7.8],
    energy: [7, 6, 8, 8, 7, 9, 8],
  }

  return (
    <div className="pb-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>
          Data
        </h1>
        <p style={{ fontSize: 11, color: theme.t3, fontFamily: "'JetBrains Mono', monospace", marginBottom: 20 }}>
          Your performance intelligence
        </p>
      </motion.div>

      {/* Period selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6">
        {['week', 'month', 'all'].map(p => (
          <motion.button
            key={p}
            onClick={() => setPeriod(p)}
            className="flex-1 py-2 rounded-xl cursor-pointer"
            style={{
              background: period === p ? `${theme.accent}12` : 'transparent',
              border: `1px solid ${period === p ? theme.accent + '30' : theme.border}`,
              color: period === p ? theme.accent : theme.t4,
              fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {p}
          </motion.button>
        ))}
      </motion.div>

      {/* Weekly streak */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlassCard className="p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={14} color={theme.accent} />
            <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
              THIS WEEK
            </span>
          </div>
          <WeeklyOverview theme={theme} />
        </GlassCard>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-4">
        {stats.map(({ label, value, change, up, Icon, color }, i) => (
          <GlassCard key={label} className="p-4" delay={0.2 + i * 0.05}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: `${color}12`, border: `1px solid ${color}20`,
              }}>
                <Icon size={14} color={color} />
              </div>
              <div className="flex items-center gap-0.5" style={{
                fontSize: 9, color: up ? theme.success : theme.danger,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {change}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: theme.t1, fontFamily: "'JetBrains Mono', monospace" }}>
              {value}
            </div>
            <div style={{ fontSize: 9, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
              {label}
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts */}
      {[
        { label: 'TRAINING VOLUME', data: sampleData.volume, color: theme.accent, unit: 'lbs' },
        { label: 'BODY WEIGHT', data: sampleData.weight, color: '#ec4899', unit: 'lbs' },
        { label: 'SLEEP QUALITY', data: sampleData.sleep, color: '#8b5cf6', unit: 'hrs' },
        { label: 'ENERGY LEVEL', data: sampleData.energy, color: theme.warning, unit: '/10' },
      ].map(({ label, data, color, unit }, i) => (
        <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05 }}>
          <GlassCard className="p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 8, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                {label}
              </span>
              <span style={{ fontSize: 10, color: theme.t3, fontFamily: "'JetBrains Mono', monospace" }}>
                {data[data.length - 1]}{unit}
              </span>
            </div>
            <MiniChart data={data} color={color} />
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
