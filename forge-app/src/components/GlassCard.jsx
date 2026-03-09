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
        background: `linear-gradient(135deg, ${theme.card}ee, ${theme.card}cc)`,
        border: `1px solid ${accent ? theme.borderAccent : theme.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: glow ? theme.glow : 'none',
        ...style,
      }}
      {...animProps}
      {...hoverProps}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${theme.accent}40, transparent)`,
        }} />
      )}
      {children}
    </Wrapper>
  )
}
