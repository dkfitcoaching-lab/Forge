import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function CircularProgress({
  value = 0, max = 100, size = 80, strokeWidth = 6,
  label, sublabel, color, showPercent = false,
}) {
  const { theme } = useTheme()
  const c = color || theme.accent
  const percent = Math.min(100, Math.round((value / max) * 100))
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={`${c}15`} strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={c} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${c}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercent ? (
            <span style={{ color: c, fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.2, fontWeight: 700 }}>
              {percent}%
            </span>
          ) : (
            <span style={{ color: theme.t1, fontFamily: "'JetBrains Mono', monospace", fontSize: size * 0.22, fontWeight: 700 }}>
              {value}
            </span>
          )}
        </div>
      </div>
      {label && <div style={{ fontSize: 10, fontWeight: 600, color: theme.t3, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 8, color: theme.t4, fontFamily: "'JetBrains Mono', monospace" }}>{sublabel}</div>}
    </div>
  )
}
