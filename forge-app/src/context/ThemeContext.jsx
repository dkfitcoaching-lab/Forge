import { createContext, useContext, useState, useMemo } from 'react'
import { storage } from '../utils/storage'

const ThemeContext = createContext()

export const themes = {
  forge: {
    id: 'forge', name: 'Forge', emoji: '',
    bg: '#010102', card: '#08080c', cardHover: '#0c0c12',
    accent: '#5ce0d0', accent2: '#40b8a8', accent3: '#1a7868',
    gradient: 'linear-gradient(135deg, #5ce0d0, #40b8a8, #1a7868)',
    glow: '0 0 30px rgba(92, 224, 208, 0.15)',
    glowStrong: '0 0 60px rgba(92, 224, 208, 0.25)',
    t1: '#f0f0f2', t2: '#b8b8c0', t3: '#787880', t4: '#484850', t5: '#282830',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(240, 240, 242, 0.06)',
    borderAccent: 'rgba(92, 224, 208, 0.15)',
    overlay: 'rgba(1, 1, 2, 0.85)',
    particle: '#5ce0d0',
  },
  ember: {
    id: 'ember', name: 'Ember', emoji: '',
    bg: '#0a0204', card: '#120408', cardHover: '#180610',
    accent: '#ff6b4a', accent2: '#e8523a', accent3: '#8b2510',
    gradient: 'linear-gradient(135deg, #ff6b4a, #e8523a, #8b2510)',
    glow: '0 0 30px rgba(255, 107, 74, 0.15)',
    glowStrong: '0 0 60px rgba(255, 107, 74, 0.25)',
    t1: '#f5f0ee', t2: '#c0b8b5', t3: '#807878', t4: '#504848', t5: '#302828',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(245, 240, 238, 0.06)',
    borderAccent: 'rgba(255, 107, 74, 0.15)',
    overlay: 'rgba(10, 2, 4, 0.85)',
    particle: '#ff6b4a',
  },
  royal: {
    id: 'royal', name: 'Royal', emoji: '',
    bg: '#020108', card: '#06040e', cardHover: '#0a0814',
    accent: '#8b5cf6', accent2: '#7c3aed', accent3: '#4c1d95',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #4c1d95)',
    glow: '0 0 30px rgba(139, 92, 246, 0.15)',
    glowStrong: '0 0 60px rgba(139, 92, 246, 0.25)',
    t1: '#f0eef5', t2: '#b8b5c0', t3: '#787080', t4: '#484050', t5: '#282030',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(240, 238, 245, 0.06)',
    borderAccent: 'rgba(139, 92, 246, 0.15)',
    overlay: 'rgba(2, 1, 8, 0.85)',
    particle: '#8b5cf6',
  },
  titan: {
    id: 'titan', name: 'Titan', emoji: '',
    bg: '#040402', card: '#0a0a06', cardHover: '#10100a',
    accent: '#eab308', accent2: '#ca8a04', accent3: '#713f12',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04, #713f12)',
    glow: '0 0 30px rgba(234, 179, 8, 0.15)',
    glowStrong: '0 0 60px rgba(234, 179, 8, 0.25)',
    t1: '#f5f5ee', t2: '#c0c0b5', t3: '#808078', t4: '#505048', t5: '#303028',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(245, 245, 238, 0.06)',
    borderAccent: 'rgba(234, 179, 8, 0.15)',
    overlay: 'rgba(4, 4, 2, 0.85)',
    particle: '#eab308',
  },
  arctic: {
    id: 'arctic', name: 'Arctic', emoji: '',
    bg: '#020206', card: '#060610', cardHover: '#0a0a16',
    accent: '#38bdf8', accent2: '#0ea5e9', accent3: '#0369a1',
    gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9, #0369a1)',
    glow: '0 0 30px rgba(56, 189, 248, 0.15)',
    glowStrong: '0 0 60px rgba(56, 189, 248, 0.25)',
    t1: '#eef0f5', t2: '#b5b8c0', t3: '#787880', t4: '#484850', t5: '#282830',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(238, 240, 245, 0.06)',
    borderAccent: 'rgba(56, 189, 248, 0.15)',
    overlay: 'rgba(2, 2, 6, 0.85)',
    particle: '#38bdf8',
  },
  phantom: {
    id: 'phantom', name: 'Phantom', emoji: '',
    bg: '#060606', card: '#0e0e0e', cardHover: '#141414',
    accent: '#e0e0e0', accent2: '#a3a3a3', accent3: '#525252',
    gradient: 'linear-gradient(135deg, #e0e0e0, #a3a3a3, #525252)',
    glow: '0 0 30px rgba(224, 224, 224, 0.1)',
    glowStrong: '0 0 60px rgba(224, 224, 224, 0.15)',
    t1: '#f5f5f5', t2: '#c0c0c0', t3: '#808080', t4: '#505050', t5: '#303030',
    success: '#4ade80', warning: '#f59e0b', danger: '#ef4444',
    border: 'rgba(245, 245, 245, 0.06)',
    borderAccent: 'rgba(224, 224, 224, 0.1)',
    overlay: 'rgba(6, 6, 6, 0.85)',
    particle: '#e0e0e0',
  },
}

export const backgrounds = [
  { id: 'none', name: 'Clean', desc: 'Pure dark' },
  { id: 'grid', name: 'Grid', desc: 'Subtle grid pattern' },
  { id: 'particles', name: 'Particles', desc: 'Floating particles' },
  { id: 'aurora', name: 'Aurora', desc: 'Northern lights' },
  { id: 'chrome', name: 'Chrome', desc: 'Metallic shimmer' },
]

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => storage.get('theme', 'forge'))
  const [bgId, setBgId] = useState(() => storage.get('bg', 'none'))

  const theme = useMemo(() => themes[themeId] || themes.forge, [themeId])

  const changeTheme = (id) => {
    setThemeId(id)
    storage.set('theme', id)
  }

  const changeBg = (id) => {
    setBgId(id)
    storage.set('bg', id)
  }

  return (
    <ThemeContext.Provider value={{ theme, themeId, changeTheme, bgId, changeBg, themes, backgrounds }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
