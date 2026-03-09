import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Shield, Zap, Brain, ChevronRight, Eye, EyeOff } from 'lucide-react'

function ParticleField({ theme }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5, a: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const time = Date.now() * 0.001

      // Ambient glow
      const grd = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, w * 0.6)
      grd.addColorStop(0, `${theme.accent}08`)
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        const alpha = p.a * (0.5 + Math.sin(p.pulse) * 0.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${theme.particle}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x, dy = p.y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            const la = (1 - dist / 100) * 0.06
            ctx.strokeStyle = `${theme.particle}${Math.round(la * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      // Central energy ring
      const ringR = 140 + Math.sin(time * 0.5) * 10
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.32, ringR, 0, Math.PI * 2)
      ctx.strokeStyle = `${theme.accent}08`
      ctx.lineWidth = 1
      ctx.stroke()

      const ringR2 = 160 + Math.cos(time * 0.3) * 15
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.32, ringR2, 0, Math.PI * 2)
      ctx.strokeStyle = `${theme.accent}05`
      ctx.lineWidth = 0.5
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current) }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0" style={{ zIndex: 0 }} />
}

export default function LoginScreen() {
  const { theme } = useTheme()
  const { login } = useAuth()
  const [mode, setMode] = useState('welcome') // welcome, login, signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const features = [
    { Icon: Brain, label: 'AI COACH', desc: '24/7 intelligent coaching that adapts to you' },
    { Icon: Zap, label: 'PRECISION', desc: 'Every variable optimized for your goals' },
    { Icon: Shield, label: 'SCIENCE', desc: 'Evidence-based protocols, zero guesswork' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login({ name: name || 'Athlete', email })
      setLoading(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: theme.bg }}>
      <ParticleField theme={theme} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {mode === 'welcome' ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center max-w-sm w-full"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{
                    background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}05)`,
                    border: `1px solid ${theme.borderAccent}`,
                    boxShadow: theme.glowStrong,
                  }}>
                    <span style={{ fontSize: 40, fontFamily: "'Cinzel', serif", fontWeight: 800, color: theme.accent,
                      textShadow: `0 0 30px ${theme.accent}60` }}>F</span>
                  </div>
                  <div className="absolute -inset-4 rounded-[28px]" style={{
                    border: `1px solid ${theme.accent}08`,
                    animation: 'pulse-glow 3s ease-in-out infinite',
                  }} />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 800, color: theme.t1,
                  letterSpacing: '0.12em', lineHeight: 1.1 }}
              >
                FORGE
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ fontSize: 10, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.3em', marginTop: 8 }}
              >
                AI-POWERED COACHING
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ fontSize: 14, color: theme.t3, marginTop: 16, lineHeight: 1.7, maxWidth: 300 }}
              >
                World-class coaching intelligence that adapts to your body, your goals, your life.
              </motion.p>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col gap-3 w-full mt-10 mb-10"
              >
                {features.map(({ Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{
                      background: `${theme.card}80`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{
                      background: `${theme.accent}10`,
                      border: `1px solid ${theme.accent}20`,
                    }}>
                      <Icon size={18} color={theme.accent} />
                    </div>
                    <div className="text-left">
                      <div style={{ fontSize: 10, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{label}</div>
                      <div style={{ fontSize: 12, color: theme.t3, marginTop: 2 }}>{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="w-full flex flex-col gap-3"
              >
                <motion.button
                  onClick={() => setMode('signup')}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: theme.gradient,
                    color: theme.bg, fontWeight: 700, fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
                    border: 'none', position: 'relative', overflow: 'hidden',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: theme.glowStrong }}
                  whileTap={{ scale: 0.98 }}
                >
                  BEGIN YOUR TRANSFORMATION
                  <ChevronRight size={16} />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    backgroundSize: '200% 100%', animation: 'shimmer 2.5s linear infinite',
                  }} />
                </motion.button>
                <motion.button
                  onClick={() => setMode('login')}
                  className="w-full py-3.5 rounded-xl cursor-pointer"
                  style={{
                    background: `${theme.accent}08`,
                    border: `1px solid ${theme.borderAccent}`,
                    color: theme.accent, fontWeight: 600, fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  SIGN IN
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                style={{ fontSize: 9, color: theme.t5, marginTop: 24, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}
              >
                FORGE v6.0 — Built with obsession
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center max-w-sm w-full"
            >
              {/* Back button */}
              <motion.button
                onClick={() => setMode('welcome')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="self-start mb-8 flex items-center gap-2 cursor-pointer"
                style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace" }}
              >
                <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> BACK
              </motion.button>

              {/* Logo small */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{
                background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
              }}>
                <span style={{ fontSize: 28, fontFamily: "'Cinzel', serif", fontWeight: 800, color: theme.accent }}>F</span>
              </div>

              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: theme.t1, letterSpacing: '0.08em' }}>
                {mode === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
              </h2>
              <p style={{ fontSize: 12, color: theme.t3, marginTop: 8, marginBottom: 32 }}>
                {mode === 'signup' ? 'Your transformation starts now' : 'Continue your journey'}
              </p>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {mode === 'signup' && (
                  <div className="text-left">
                    <label style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.15em', marginBottom: 6, display: 'block' }}>NAME</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3.5 rounded-xl outline-none"
                      style={{
                        background: `${theme.card}cc`, border: `1px solid ${theme.border}`,
                        color: theme.t1, fontSize: 14, fontFamily: "'Inter', sans-serif",
                      }}
                    />
                  </div>
                )}
                <div className="text-left">
                  <label style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.15em', marginBottom: 6, display: 'block' }}>EMAIL</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl outline-none"
                    style={{
                      background: `${theme.card}cc`, border: `1px solid ${theme.border}`,
                      color: theme.t1, fontSize: 14,
                    }}
                  />
                </div>
                <div className="text-left">
                  <label style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.15em', marginBottom: 6, display: 'block' }}>PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3.5 rounded-xl outline-none pr-12"
                      style={{
                        background: `${theme.card}cc`, border: `1px solid ${theme.border}`,
                        color: theme.t1, fontSize: 14,
                      }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ background: 'none', border: 'none', color: theme.t4 }}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl mt-2 cursor-pointer relative overflow-hidden"
                  style={{
                    background: loading ? theme.t5 : theme.gradient,
                    color: theme.bg, fontWeight: 700, fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', border: 'none',
                  }}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 rounded-full border-2 mx-auto"
                      style={{ borderColor: `${theme.bg}40`, borderTopColor: theme.bg }}
                    />
                  ) : (
                    <>
                      {mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        backgroundSize: '200% 100%', animation: 'shimmer 2.5s linear infinite',
                      }} />
                    </>
                  )}
                </motion.button>
              </form>

              <p style={{ fontSize: 12, color: theme.t4, marginTop: 24 }}>
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="cursor-pointer" style={{ background: 'none', border: 'none', color: theme.accent, fontWeight: 600 }}>
                  {mode === 'signup' ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
