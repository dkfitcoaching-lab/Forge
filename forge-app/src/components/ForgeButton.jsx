import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ForgeButton({
  children, onClick, variant = 'primary', size = 'md', disabled = false,
  icon, className = '', style = {}, fullWidth = false,
}) {
  const { theme } = useTheme()

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants = {
    primary: {
      background: theme.gradient,
      color: theme.bg,
      border: 'none',
      fontWeight: 700,
    },
    secondary: {
      background: `${theme.accent}10`,
      color: theme.accent,
      border: `1px solid ${theme.borderAccent}`,
      fontWeight: 600,
    },
    ghost: {
      background: 'transparent',
      color: theme.t2,
      border: `1px solid ${theme.border}`,
      fontWeight: 500,
    },
    danger: {
      background: `${theme.danger}15`,
      color: theme.danger,
      border: `1px solid ${theme.danger}30`,
      fontWeight: 600,
    },
  }

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02, boxShadow: theme.glow }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-xl font-mono tracking-wider uppercase
        transition-all duration-200 flex items-center justify-center gap-2
        ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.08em',
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
        }} />
      )}
    </motion.button>
  )
}
