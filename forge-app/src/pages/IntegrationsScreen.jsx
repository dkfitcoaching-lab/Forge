import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { storage } from '../utils/storage'
import GlassCard from '../components/GlassCard'
import {
  ChevronLeft, ChevronRight, Heart, Watch, Scale, Activity,
  Smartphone, Wifi, Check, Link2, Unlink
} from 'lucide-react'

const INTEGRATIONS = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    desc: 'Sync workouts, heart rate, sleep, steps, and body metrics automatically.',
    category: 'HEALTH PLATFORMS',
    color: '#ff2d55',
    Icon: Heart,
    dataPoints: ['Heart Rate', 'Steps', 'Sleep', 'Active Calories', 'Workouts'],
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    desc: 'Connect your Google Fit data for seamless Android health tracking.',
    category: 'HEALTH PLATFORMS',
    color: '#4285f4',
    Icon: Activity,
    dataPoints: ['Steps', 'Heart Rate', 'Sleep', 'Workouts', 'Weight'],
  },
  {
    id: 'strava',
    name: 'Strava',
    desc: 'Import runs, rides, and cardio sessions. Track outdoor training volume.',
    category: 'FITNESS APPS',
    color: '#fc4c02',
    Icon: Activity,
    dataPoints: ['Running', 'Cycling', 'Swimming', 'Heart Rate Zones', 'Distance'],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    desc: 'Sync sleep quality, heart rate variability, steps, and recovery data.',
    category: 'WEARABLES',
    color: '#00b0b9',
    Icon: Watch,
    dataPoints: ['Sleep Score', 'HRV', 'Resting HR', 'Steps', 'Active Minutes'],
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    desc: 'Advanced training metrics — VO2 max, training load, body battery.',
    category: 'WEARABLES',
    color: '#007cc3',
    Icon: Watch,
    dataPoints: ['VO2 Max', 'Training Load', 'Body Battery', 'Stress', 'Sleep'],
  },
  {
    id: 'whoop',
    name: 'WHOOP',
    desc: 'Recovery score, strain, HRV, and sleep performance data.',
    category: 'WEARABLES',
    color: '#02dc82',
    Icon: Activity,
    dataPoints: ['Recovery Score', 'Strain', 'HRV', 'Sleep Performance', 'Respiratory Rate'],
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    desc: 'Sleep staging, readiness score, temperature trends, and HRV.',
    category: 'WEARABLES',
    color: '#c8a951',
    Icon: Activity,
    dataPoints: ['Readiness Score', 'Sleep Score', 'HRV', 'Temperature', 'Activity'],
  },
  {
    id: 'smart-scale',
    name: 'Smart Scales',
    desc: 'Auto-import body weight, body fat %, muscle mass, and hydration.',
    category: 'BODY COMPOSITION',
    color: '#8b5cf6',
    Icon: Scale,
    dataPoints: ['Weight', 'Body Fat %', 'Muscle Mass', 'BMI', 'Hydration'],
    supported: ['Withings', 'Renpho', 'Eufy', 'Garmin Index'],
  },
  {
    id: 'myfitnesspal',
    name: 'MyFitnessPal',
    desc: 'Import food diary data and macro breakdowns into FORGE.',
    category: 'NUTRITION',
    color: '#0070e0',
    Icon: Smartphone,
    dataPoints: ['Calories', 'Macros', 'Meal Log', 'Food Database', 'Recipes'],
  },
  {
    id: 'cronometer',
    name: 'Cronometer',
    desc: 'Detailed micronutrient tracking and nutrition data sync.',
    category: 'NUTRITION',
    color: '#ff6600',
    Icon: Smartphone,
    dataPoints: ['Calories', 'Macros', 'Micronutrients', 'Biometrics', 'Supplements'],
  },
]

export default function IntegrationsScreen({ onBack }) {
  const { theme } = useTheme()
  const [connected, setConnected] = useState(() => storage.get('integrations', {}))
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => {
    const next = { ...connected, [id]: !connected[id] }
    setConnected(next)
    storage.set('integrations', next)
  }

  const categories = [...new Set(INTEGRATIONS.map(i => i.category))]

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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
          }}>
            <Link2 size={20} color={theme.accent} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
              Integrations
            </h1>
            <p style={{ fontSize: 10, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.1em' }}>
              CONNECT YOUR ECOSYSTEM
            </p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: theme.t3, marginTop: 8, marginBottom: 24, lineHeight: 1.6 }}>
          Connect your devices and apps to give your AI coach complete visibility into your health data. The more data FORGE has, the smarter your programming becomes.
        </p>
      </motion.div>

      {/* Connected count */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-4 mb-6" accent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: `${theme.success}12`, border: `1px solid ${theme.success}20`,
              }}>
                <Wifi size={18} color={theme.success} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.t1 }}>
                  {Object.values(connected).filter(Boolean).length} Connected
                </div>
                <div style={{ fontSize: 10, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>
                  {INTEGRATIONS.length} available integrations
                </div>
              </div>
            </div>
            <div className="flex -space-x-2">
              {INTEGRATIONS.filter(i => connected[i.id]).slice(0, 4).map(i => (
                <div key={i.id} className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: `${i.color}20`, border: `2px solid ${theme.bg}` }}>
                  <i.Icon size={12} color={i.color} />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Integration categories */}
      {categories.map((cat, ci) => (
        <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + ci * 0.05 }} className="mb-6">
          <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.15em', marginBottom: 10 }}>
            {cat}
          </div>
          {INTEGRATIONS.filter(i => i.category === cat).map((integration) => {
            const isConnected = connected[integration.id]
            const isExpanded = expandedId === integration.id
            return (
              <GlassCard key={integration.id} className="mb-3 overflow-hidden">
                <div className="p-4" onClick={() => setExpandedId(isExpanded ? null : integration.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{
                      background: `${integration.color}12`,
                      border: `1px solid ${integration.color}25`,
                    }}>
                      <integration.Icon size={20} color={integration.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 14, fontWeight: 700, color: theme.t1 }}>
                          {integration.name}
                        </span>
                        {isConnected && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{
                            background: `${theme.success}12`, border: `1px solid ${theme.success}25`,
                          }}>
                            <Check size={8} color={theme.success} strokeWidth={3} />
                            <span style={{ fontSize: 7, fontWeight: 700, color: theme.success,
                              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                              LINKED
                            </span>
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: theme.t3, marginTop: 2, lineHeight: 1.4 }}>
                        {integration.desc}
                      </p>
                    </div>
                    <ChevronRight size={16} color={theme.t4}
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
                      {/* Data points */}
                      <div style={{ fontSize: 7, fontWeight: 700, color: theme.accent,
                        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', marginBottom: 8 }}>
                        DATA POINTS
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {integration.dataPoints.map(dp => (
                          <span key={dp} className="px-2.5 py-1 rounded-lg" style={{
                            fontSize: 9, color: theme.t3, background: `${theme.accent}06`,
                            border: `1px solid ${theme.border}`,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>
                            {dp}
                          </span>
                        ))}
                      </div>

                      {/* Supported devices */}
                      {integration.supported && (
                        <>
                          <div style={{ fontSize: 7, fontWeight: 700, color: theme.t4,
                            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', marginBottom: 6 }}>
                            SUPPORTED DEVICES
                          </div>
                          <p style={{ fontSize: 11, color: theme.t3, marginBottom: 12 }}>
                            {integration.supported.join(' • ')}
                          </p>
                        </>
                      )}

                      {/* Connect/Disconnect button */}
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); toggle(integration.id) }}
                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                        style={{
                          background: isConnected ? `${theme.danger}10` : integration.color + '15',
                          border: `1px solid ${isConnected ? theme.danger + '30' : integration.color + '30'}`,
                          color: isConnected ? theme.danger : integration.color,
                          fontSize: 11, fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isConnected ? <><Unlink size={14} /> DISCONNECT</> : <><Link2 size={14} /> CONNECT</>}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            )
          })}
        </motion.div>
      ))}

      {/* Privacy note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="text-center py-4">
          <p style={{ fontSize: 10, color: theme.t4, lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
            Your data is encrypted end-to-end and never shared with third parties. FORGE only reads the data needed to optimize your program.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
