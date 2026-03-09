import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function GlassCard({
  children, onClick, className = '', accent = false, glow = false, style = {},
  animate = true, delay = 0, hover = true,
}) {
  const { theme } = useTheme()

  const Wrapper = animate ? motion.div : 'div'
  const animProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  } : {}

  const hoverProps = hover && onClick ? {
    whileHover: { scale: 1.01, y: -1 },
    whileTap: { scale: 0.99 },
  } : {}

  return (
    <Wrapper
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${theme.card}f0, ${theme.card}d0)`,
        border: `1px solid ${accent ? theme.borderAccent : theme.border}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: glow
          ? `${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`
          : `0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)`,
        ...style,
      }}
      {...animProps}
      {...hoverProps}
    >
      {/* Top accent line */}
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)`,
        }} />
      )}
      {/* Subtle inner glow from top */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{
        background: `linear-gradient(to bottom, ${accent ? theme.accent : '#ffffff'}03, transparent)`,
      }} />
      {children}
    </Wrapper>
  )
}
