import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import { useCoach } from './context/CoachContext'
import AnimatedBackground from './components/AnimatedBackground'
import Navigation from './components/Navigation'
import CoachPanel from './components/CoachPanel'
import LoginScreen from './pages/LoginScreen'
import OnboardingScreen from './pages/OnboardingScreen'
import TodayScreen from './pages/TodayScreen'
import DataScreen from './pages/DataScreen'
import ProfileScreen from './pages/ProfileScreen'
import WorkoutPlayer from './pages/WorkoutPlayer'
import CheckInScreen from './pages/CheckInScreen'
import GuideScreen from './pages/GuideScreen'
import GoalsScreen from './pages/GoalsScreen'
import BarcodeScannerScreen from './pages/BarcodeScannerScreen'
import IntegrationsScreen from './pages/IntegrationsScreen'
import { Dumbbell } from 'lucide-react'

export default function App() {
  const { theme, bgId } = useTheme()
  const { isLoggedIn, hasOnboarded } = useAuth()
  const { isOpen, setIsOpen } = useCoach()
  const [tab, setTab] = useState('today')
  const [view, setView] = useState('main') // main, workout, checkin, guide, goals, scanner, progress, integrations
  const [workoutDay, setWorkoutDay] = useState(null)

  // Not logged in
  if (!isLoggedIn) return <LoginScreen />

  // Not onboarded
  if (!hasOnboarded) return <OnboardingScreen />

  // Workout player (full screen)
  if (view === 'workout' && workoutDay) {
    return (
      <WorkoutPlayer
        day={workoutDay}
        onExit={() => { setWorkoutDay(null); setView('main'); setTab('today') }}
      />
    )
  }

  const startWorkout = (day) => { setWorkoutDay(day); setView('workout') }
  const goBack = () => setView('main')

  const renderContent = () => {
    // Sub-views from Today screen
    if (view === 'checkin') return <CheckInScreen onBack={goBack} />
    if (view === 'guide') return <GuideScreen onBack={goBack} />
    if (view === 'goals') return <GoalsScreen onBack={goBack} />
    if (view === 'scanner') return <BarcodeScannerScreen onBack={goBack} />
    if (view === 'integrations') return <IntegrationsScreen onBack={goBack} />
    if (view === 'progress') return <DataScreen />

    // Tab views
    if (tab === 'today') return <TodayScreen onStartWorkout={startWorkout} onNavigate={setView} />
    if (tab === 'data') return <DataScreen />
    if (tab === 'profile') return <ProfileScreen onNavigate={setView} />
    return <TodayScreen onStartWorkout={startWorkout} onNavigate={setView} />
  }

  return (
    <div className="h-full flex flex-col" style={{ background: theme.bg, color: theme.t1 }}>
      {/* Background effects */}
      <AnimatedBackground variant={bgId} />

      {/* Ambient top glow */}
      <div className="fixed top-[-150px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${theme.accent}05, transparent 70%)`, zIndex: 0 }} />

      <div className="relative z-10 max-w-lg mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{
          borderBottom: `1px solid ${theme.border}`,
          background: `${theme.bg}e0`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: `0 1px 0 ${theme.accent}06`,
        }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
              boxShadow: `0 0 12px ${theme.accent}10`,
            }}>
              <Dumbbell size={16} color={theme.accent} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif", letterSpacing: '0.08em' }}>
              FORGE
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.success, boxShadow: `0 0 6px ${theme.success}80` }} />
            <span style={{ fontSize: 8, color: theme.t5, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
              v6.0
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{
          padding: '18px 16px 120px',
          scrollBehavior: 'smooth',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        activeTab={tab}
        onTabChange={(t) => { setTab(t); setView('main') }}
        onCoachOpen={() => setIsOpen(true)}
      />

      {/* Coach panel */}
      <CoachPanel />
    </div>
  )
}
