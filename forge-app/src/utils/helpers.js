export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

export const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 5) return 'Good evening'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const getDayLabel = () => {
  return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()]
}

export const formatDate = (date = new Date()) => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export const clamp = (val, min, max) => Math.max(min, Math.min(max, val))

export const lerp = (a, b, t) => a + (b - a) * t

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const generateId = () => Math.random().toString(36).slice(2, 10)

export const debounce = (fn, ms = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export const calcMacroPercent = (current, target) => {
  if (!target) return 0
  return Math.min(100, Math.round((current / target) * 100))
}
