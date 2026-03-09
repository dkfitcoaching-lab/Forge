import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme, themes, backgrounds } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/GlassCard'
import ForgeButton from '../components/ForgeButton'
import {
  User, Palette, Image, Bell, Shield, Award, LogOut, ChevronRight,
  Check, Moon, Zap, Dumbbell, Scale, Flame, Settings
} from 'lucide-react'

export default function ProfileScreen() {
  const { theme, themeId, changeTheme, bgId, changeBg } = useTheme()
  const { user, logout, updateUser } = useAuth()
  const [notifications, setNotifications] = useState({
    workouts: true, meals: true, water: true, sleep: true, checkin: true,
  })

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="pb-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif", marginBottom: 20 }}>
          Profile
        </h1>
      </motion.div>

      {/* User card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard className="p-5 mb-4" accent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
              background: `${theme.accent}12`, border: `1px solid ${theme.accent}20`,
            }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: theme.accent, fontFamily: "'Cinzel', serif" }}>
                {(user?.name || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif" }}>
                {user?.name || 'Athlete'}
              </div>
              <div style={{ fontSize: 11, color: theme.t3, marginTop: 2 }}>{user?.email || ''}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <Award size={10} color={theme.accent} />
                <span style={{ fontSize: 9, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
                  {user?.experience?.toUpperCase() || 'INTERMEDIATE'} — {user?.goal?.replace('-', ' ').toUpperCase() || 'BUILD MUSCLE'}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Theme selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-3 mt-6">
          <Palette size={14} color={theme.accent} />
          <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            THEME
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {Object.entries(themes).map(([id, t]) => (
            <motion.button
              key={id}
              onClick={() => changeTheme(id)}
              className="p-3 rounded-xl text-center cursor-pointer relative overflow-hidden"
              style={{
                background: themeId === id ? `${t.accent}15` : `${theme.card}`,
                border: `1px solid ${themeId === id ? t.accent + '40' : theme.border}`,
                boxShadow: themeId === id ? `0 0 12px ${t.accent}20` : 'none',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 rounded-full mx-auto mb-2" style={{
                background: t.gradient,
                boxShadow: `0 0 10px ${t.accent}40`,
              }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: themeId === id ? t.accent : theme.t3, fontFamily: "'JetBrains Mono', monospace" }}>
                {t.name}
              </div>
              {themeId === id && (
                <div className="absolute top-2 right-2">
                  <Check size={10} color={t.accent} />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Background selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-3">
          <Image size={14} color={theme.accent} />
          <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            BACKGROUND
          </span>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {backgrounds.map(bg => (
            <motion.button
              key={bg.id}
              onClick={() => changeBg(bg.id)}
              className="shrink-0 px-4 py-2.5 rounded-xl cursor-pointer"
              style={{
                background: bgId === bg.id ? `${theme.accent}12` : `${theme.card}`,
                border: `1px solid ${bgId === bg.id ? theme.accent + '30' : theme.border}`,
                color: bgId === bg.id ? theme.accent : theme.t3,
                fontSize: 10, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {bg.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Performance stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} color={theme.accent} />
          <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            PERFORMANCE
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: '12', label: 'Day Streak', color: theme.accent },
            { value: '87%', label: 'Adherence', color: theme.success },
            { value: '4.2', label: 'Avg Rating', color: theme.warning },
          ].map(({ value, label, color }) => (
            <GlassCard key={label} className="p-3 text-center">
              <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>
                {value}
              </div>
              <div style={{ fontSize: 8, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginTop: 2 }}>
                {label}
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} color={theme.accent} />
          <span style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}>
            NOTIFICATIONS
          </span>
        </div>
        <GlassCard className="mb-6">
          {[
            { key: 'workouts', label: 'Workouts', Icon: Dumbbell },
            { key: 'meals', label: 'Meal Reminders', Icon: Flame },
            { key: 'water', label: 'Hydration', Icon: Scale },
            { key: 'sleep', label: 'Sleep Reminder', Icon: Moon },
            { key: 'checkin', label: 'Daily Check-In', Icon: Zap },
          ].map(({ key, label, Icon }, i, arr) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${theme.border}` : 'none' }}
            >
              <div className="flex items-center gap-3">
                <Icon size={14} color={theme.t3} />
                <span style={{ fontSize: 13, color: theme.t2 }}>{label}</span>
              </div>
              <motion.button
                onClick={() => toggleNotif(key)}
                className="w-10 h-6 rounded-full relative cursor-pointer"
                style={{
                  background: notifications[key] ? `${theme.accent}30` : theme.t5,
                  border: `1px solid ${notifications[key] ? theme.accent + '40' : theme.border}`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-0.5 w-4.5 h-4.5 rounded-full"
                  style={{
                    width: 18, height: 18,
                    background: notifications[key] ? theme.accent : theme.t4,
                    boxShadow: notifications[key] ? `0 0 8px ${theme.accent}40` : 'none',
                  }}
                  animate={{ left: notifications[key] ? 18 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          ))}
        </GlassCard>
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ForgeButton onClick={logout} variant="danger" fullWidth icon={<LogOut size={14} />}>
          SIGN OUT
        </ForgeButton>
        <p className="text-center mt-6" style={{ fontSize: 9, color: theme.t5, fontFamily: "'JetBrains Mono', monospace" }}>
          FORGE v6.0 — Built with obsession
        </p>
      </motion.div>
    </div>
  )
}
