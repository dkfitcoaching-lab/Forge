import { useEffect, useRef, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

function ParticleCanvas() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const particlesRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const count = 60
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const particles = particlesRef.current

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${theme.particle}${Math.round(p.a * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x
          const dy = p.y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `${theme.particle}${Math.round((1 - dist / 120) * 0.08 * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [theme.particle])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

function GridBackground() {
  const { theme } = useTheme()
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(${theme.accent}06 1px, transparent 1px),
          linear-gradient(90deg, ${theme.accent}06 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 0%, ${theme.accent}08 0%, transparent 60%)`,
      }} />
    </div>
  )
}

function AuroraBackground() {
  const { theme } = useTheme()
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute" style={{
        top: '-40%', left: '-20%', width: '140%', height: '80%',
        background: `radial-gradient(ellipse, ${theme.accent}12 0%, transparent 60%)`,
        animation: 'float 8s ease-in-out infinite',
        filter: 'blur(60px)',
      }} />
      <div className="absolute" style={{
        top: '-30%', right: '-20%', width: '100%', height: '70%',
        background: `radial-gradient(ellipse, ${theme.accent2}10 0%, transparent 60%)`,
        animation: 'float 12s ease-in-out infinite reverse',
        filter: 'blur(80px)',
      }} />
      <div className="absolute" style={{
        bottom: '-20%', left: '20%', width: '80%', height: '50%',
        background: `radial-gradient(ellipse, ${theme.accent3}08 0%, transparent 60%)`,
        animation: 'float 10s ease-in-out infinite',
        filter: 'blur(70px)',
      }} />
    </div>
  )
}

function ChromeBackground() {
  const { theme } = useTheme()
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(135deg, transparent 0%, ${theme.accent}04 25%, transparent 50%, ${theme.accent2}04 75%, transparent 100%)
        `,
        backgroundSize: '400% 400%',
        animation: 'shimmer 8s linear infinite',
      }} />
      <div className="absolute" style={{
        top: '-50%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}06 0%, transparent 70%)`,
        animation: 'rotate-slow 30s linear infinite',
      }} />
    </div>
  )
}

export default function AnimatedBackground({ variant }) {
  if (variant === 'particles') return <ParticleCanvas />
  if (variant === 'grid') return <GridBackground />
  if (variant === 'aurora') return <AuroraBackground />
  if (variant === 'chrome') return <ChromeBackground />
  return null
}
