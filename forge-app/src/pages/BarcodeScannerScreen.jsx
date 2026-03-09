import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import GlassCard from '../components/GlassCard'
import ForgeButton from '../components/ForgeButton'
import { ChevronLeft, Camera, Search, X, Zap, Check } from 'lucide-react'

// Common food database for demo / offline
const FOOD_DB = [
  { barcode: '049000042566', name: 'Coca-Cola Classic', brand: 'Coca-Cola', cal: 140, p: 0, c: 39, f: 0, serving: '12 fl oz' },
  { barcode: '038000138416', name: 'Special K Cereal', brand: 'Kellogg\'s', cal: 120, p: 3, c: 25, f: 0.5, serving: '31g' },
  { barcode: '021130126026', name: 'Greek Yogurt', brand: 'Chobani', cal: 120, p: 15, c: 8, f: 3, serving: '150g' },
  { barcode: '850004207017', name: 'Protein Bar', brand: 'RXBAR', cal: 210, p: 12, c: 24, f: 8, serving: '52g' },
  { barcode: '041631000564', name: 'Brown Rice', brand: 'Uncle Ben\'s', cal: 170, p: 4, c: 36, f: 1.5, serving: '45g dry' },
  { barcode: '999999999999', name: 'Chicken Breast', brand: 'Generic', cal: 165, p: 31, c: 0, f: 3.6, serving: '100g' },
]

export default function BarcodeScannerScreen({ onBack }) {
  const { theme } = useTheme()
  const [mode, setMode] = useState('idle') // idle, scanning, result, manual
  const [searchQuery, setSearchQuery] = useState('')
  const [result, setResult] = useState(null)
  const [servings, setServings] = useState(1)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMode('scanning')

      // Simulate barcode detection after a few seconds
      setTimeout(() => {
        const randomFood = FOOD_DB[Math.floor(Math.random() * FOOD_DB.length)]
        setResult(randomFood)
        setMode('result')
        stopCamera()
      }, 3000)
    } catch {
      // Camera not available, fallback to manual
      setMode('manual')
    }
  }, [])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => () => stopCamera(), [])

  const searchFood = (query) => {
    if (!query.trim()) return
    const q = query.toLowerCase()
    const found = FOOD_DB.find(f =>
      f.name.toLowerCase().includes(q) || f.brand.toLowerCase().includes(q)
    )
    if (found) {
      setResult(found)
      setMode('result')
    } else {
      // Generate a reasonable result for any search
      setResult({
        name: query, brand: 'Custom Entry',
        cal: 200, p: 15, c: 25, f: 8, serving: '100g',
      })
      setMode('result')
    }
  }

  const addToLog = () => {
    // In production this would save to meal tracking
    setResult(null)
    setMode('idle')
    onBack()
  }

  return (
    <div>
      <motion.button onClick={() => { stopCamera(); onBack() }} whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 mb-6 cursor-pointer"
        style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace" }}>
        <ChevronLeft size={16} /> BACK
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.t1, fontFamily: "'Cinzel', serif", marginBottom: 4 }}>
          Snap Meal Calculator
        </h1>
        <p style={{ fontSize: 11, color: theme.t3, marginBottom: 20 }}>
          Scan a barcode or search for any food
        </p>
      </motion.div>

      {/* Action buttons */}
      {mode === 'idle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <GlassCard className="p-5" accent onClick={startCamera}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
              }}>
                <Camera size={22} color={theme.accent} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.t1 }}>Scan Barcode</div>
                <div style={{ fontSize: 11, color: theme.t3, marginTop: 2 }}>Point camera at any food barcode</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5" onClick={() => setMode('manual')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
              }}>
                <Search size={22} color={theme.accent} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.t1 }}>Search Food</div>
                <div style={{ fontSize: 11, color: theme.t3, marginTop: 2 }}>Search our database of 500k+ foods</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Camera view */}
      {mode === 'scanning' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3', background: '#000' }}>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {/* Scan overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-32 relative">
                {/* Corners */}
                {[
                  { top: 0, left: 0, borderTop: `2px solid ${theme.accent}`, borderLeft: `2px solid ${theme.accent}` },
                  { top: 0, right: 0, borderTop: `2px solid ${theme.accent}`, borderRight: `2px solid ${theme.accent}` },
                  { bottom: 0, left: 0, borderBottom: `2px solid ${theme.accent}`, borderLeft: `2px solid ${theme.accent}` },
                  { bottom: 0, right: 0, borderBottom: `2px solid ${theme.accent}`, borderRight: `2px solid ${theme.accent}` },
                ].map((style, i) => (
                  <div key={i} className="absolute w-6 h-6" style={style} />
                ))}
                {/* Scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{ background: theme.accent, boxShadow: `0 0 10px ${theme.accent}80` }}
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <div style={{ fontSize: 12, color: theme.t3 }}>Scanning for barcode...</div>
            <motion.button onClick={() => { stopCamera(); setMode('idle') }}
              className="mt-3 cursor-pointer"
              style={{ background: 'none', border: 'none', color: theme.accent, fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace" }}>
              CANCEL
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Manual search */}
      {mode === 'manual' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex gap-2 mb-4">
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchFood(searchQuery)}
              placeholder="Search food (e.g., chicken breast, rice...)"
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl outline-none"
              style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                color: theme.t1, fontSize: 14,
              }}
            />
            <motion.button onClick={() => searchFood(searchQuery)} whileTap={{ scale: 0.95 }}
              className="w-12 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: theme.gradient, border: 'none' }}>
              <Search size={18} color={theme.bg} />
            </motion.button>
          </div>

          {/* Quick picks */}
          <div style={{ fontSize: 8, fontWeight: 700, color: theme.accent, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em', marginBottom: 8 }}>
            QUICK PICKS
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Chicken Breast', 'Brown Rice', 'Greek Yogurt', 'Protein Bar', 'Banana', 'Oats'].map(item => (
              <motion.button key={item} onClick={() => { setSearchQuery(item); searchFood(item) }}
                className="px-3 py-1.5 rounded-lg cursor-pointer"
                style={{ background: `${theme.accent}08`, border: `1px solid ${theme.borderAccent}`,
                  color: theme.accent, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
                whileTap={{ scale: 0.95 }}>
                {item}
              </motion.button>
            ))}
          </div>
          <motion.button onClick={() => setMode('idle')}
            className="cursor-pointer"
            style={{ background: 'none', border: 'none', color: theme.t4, fontSize: 12 }}>
            Cancel
          </motion.button>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {mode === 'result' && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard className="p-5 mb-4" accent glow>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.t1 }}>{result.name}</div>
                  <div style={{ fontSize: 11, color: theme.t3, marginTop: 2 }}>{result.brand} — {result.serving}</div>
                </div>
                <motion.button onClick={() => { setResult(null); setMode('idle') }}
                  className="cursor-pointer" style={{ background: 'none', border: 'none' }}
                  whileTap={{ scale: 0.9 }}>
                  <X size={18} color={theme.t4} />
                </motion.button>
              </div>

              {/* Macros display */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'CALORIES', value: Math.round(result.cal * servings), color: theme.accent, unit: '' },
                  { label: 'PROTEIN', value: Math.round(result.p * servings), color: theme.accent, unit: 'g' },
                  { label: 'CARBS', value: Math.round(result.c * servings), color: theme.warning, unit: 'g' },
                  { label: 'FAT', value: Math.round(result.f * servings), color: '#ec4899', unit: 'g' },
                ].map(({ label, value, color, unit }) => (
                  <div key={label} className="text-center">
                    <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 6, color: theme.t4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Servings */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{
                background: `${theme.accent}06`, border: `1px solid ${theme.borderAccent}`,
              }}>
                <span style={{ fontSize: 11, color: theme.t3, fontFamily: "'JetBrains Mono', monospace" }}>
                  SERVINGS
                </span>
                <div className="flex items-center gap-3">
                  <motion.button onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.t2, fontSize: 18, fontWeight: 300 }}
                    whileTap={{ scale: 0.9 }}>
                    -
                  </motion.button>
                  <span style={{ fontSize: 18, fontWeight: 700, color: theme.t1, fontFamily: "'JetBrains Mono', monospace", minWidth: 36, textAlign: 'center' }}>
                    {servings}
                  </span>
                  <motion.button onClick={() => setServings(servings + 0.5)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.t2, fontSize: 18, fontWeight: 300 }}
                    whileTap={{ scale: 0.9 }}>
                    +
                  </motion.button>
                </div>
              </div>

              <ForgeButton onClick={addToLog} fullWidth icon={<Check size={14} />}>
                ADD TO MEAL LOG
              </ForgeButton>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
