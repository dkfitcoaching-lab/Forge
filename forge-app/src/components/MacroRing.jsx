import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function MacroRing({ calories, protein, carbs, fat, targets }) {
  const { theme } = useTheme()
  const macros = [
    { label: 'PROTEIN', current: protein, target: targets.p, color: theme.accent, unit: 'g' },
    { label: 'CARBS', current: carbs, target: targets.c, color: theme.warning, unit: 'g' },
    { label: 'FAT', current: fat, target: targets.f, color: '#ec4899', unit: 'g' },
  ]

  const calPercent = Math.min(100, Math.round((calories / targets.cal) * 100))

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Central calorie ring */}
      <div className="relative" style={{ width: 120, height: 120 }}>
        <svg width={120} height={120} className="-rotate-90">
          <circle cx={60} cy={60} r={52} fill="none" stroke={`${theme.accent}12`} strokeWidth={8} />
          <motion.circle
            cx={60} cy={60} r={52} fill="none" stroke={theme.accent} strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - calPercent / 100) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${theme.accent}50)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: 22, fontWeight: 800, color: theme.t1, fontFamily: "'JetBrains Mono', monospace" }}>
            {calories}
          </span>
          <span style={{ fontSize: 7, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            / {targets.cal} KCAL
          </span>
        </div>
      </div>

      {/* Macro bars */}
      <div className="w-full flex gap-3">
        {macros.map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.target) * 100))
          return (
            <div key={m.label} className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span style={{ fontSize: 7, fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em' }}>
                  {m.label}
                </span>
                <span style={{ fontSize: 9, color: theme.t3, fontFamily: "'JetBrains Mono', monospace" }}>
                  {m.current}/{m.target}{m.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${m.color}15` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 8px ${m.color}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
