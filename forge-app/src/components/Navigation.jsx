import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { Home, BarChart3, User, MessageCircle } from 'lucide-react'

const tabs = [
  { key: 'today', label: 'Today', Icon: Home },
  { key: 'data', label: 'Data', Icon: BarChart3 },
  { key: 'profile', label: 'Profile', Icon: User },
]

export default function Navigation({ activeTab, onTabChange, onCoachOpen, hasUnread }) {
  const { theme } = useTheme()

  return (
    <>
      {/* Coach FAB */}
      <motion.button
        onClick={onCoachOpen}
        className="fixed z-40 flex items-center justify-center rounded-2xl cursor-pointer"
        style={{
          bottom: 92, right: 16, width: 54, height: 54,
          background: theme.gradient,
          boxShadow: `${theme.glowStrong}, 0 8px 24px rgba(0,0,0,0.3)`,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        <MessageCircle size={22} color={theme.bg} strokeWidth={2.5} />
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full" style={{
            background: theme.danger,
            boxShadow: `0 0 10px ${theme.danger}80`,
            border: `2px solid ${theme.bg}`,
          }} />
        )}
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-2xl" style={{
          border: `1px solid ${theme.accent}30`,
          animation: 'pulse-glow 3s ease-in-out infinite',
        }} />
      </motion.button>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-30" style={{
        background: `linear-gradient(to top, ${theme.bg} 60%, ${theme.bg}e0 80%, transparent)`,
        paddingTop: 20,
      }}>
        <div className="mx-3 mb-2 rounded-2xl overflow-hidden" style={{
          background: `${theme.card}e8`,
          border: `1px solid ${theme.border}`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: `0 -4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}>
          <div className="flex items-center justify-around py-2.5" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
            {tabs.map(({ key, label, Icon }) => {
              const active = activeTab === key
              return (
                <motion.button
                  key={key}
                  onClick={() => onTabChange(key)}
                  className="flex flex-col items-center gap-1 px-6 py-1.5 relative cursor-pointer"
                  style={{ background: 'none', border: 'none' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                        style={{ background: theme.accent, width: 28, boxShadow: `0 0 12px ${theme.accent}60` }}
                        layoutId="nav-indicator"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon
                    size={20}
                    color={active ? theme.accent : theme.t4}
                    strokeWidth={active ? 2.5 : 1.5}
                    style={{ transition: 'color 0.2s, stroke-width 0.2s' }}
                  />
                  <span style={{
                    fontSize: 9,
                    fontWeight: active ? 700 : 500,
                    color: active ? theme.accent : theme.t4,
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.06em',
                    transition: 'color 0.2s, font-weight 0.2s',
                  }}>
                    {label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
