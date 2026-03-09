import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { GUIDE } from '../data/workouts'
import GlassCard from '../components/GlassCard'
import { ChevronLeft, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

export default function GuideScreen({ onBack }) {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState({})

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

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
          <BookOpen size={22} color={theme.accent} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
            Program Guide
          </h1>
        </div>
        <p style={{ fontSize: 11, color: theme.t3, marginBottom: 24 }}>
          Understand the science behind every element of your program
        </p>
      </motion.div>

      {GUIDE.map((section, si) => (
        <motion.div
          key={section.category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.05 }}
          className="mb-6"
        >
          <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.15em', marginBottom: 8 }}>
            {section.category}
          </div>
          {section.items.map((item, ii) => {
            const key = `${si}-${ii}`
            const open = expanded[key]
            return (
              <GlassCard key={key} className="mb-2 overflow-hidden" onClick={() => toggle(key)}>
                <div className="flex items-center justify-between p-4">
                  <span style={{ fontSize: 14, fontWeight: 600, color: theme.t1 }}>{item.title}</span>
                  {open ? <ChevronUp size={16} color={theme.t4} /> : <ChevronDown size={16} color={theme.t4} />}
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
                        <p style={{ fontSize: 13, color: theme.t3, lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            )
          })}
        </motion.div>
      ))}
    </div>
  )
}
