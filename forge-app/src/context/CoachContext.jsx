import { createContext, useContext, useState, useCallback } from 'react'
import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

const CoachContext = createContext()

const SYSTEM_WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome to FORGE. I'm your AI coach — think of me as having your trainer's brain, available 24/7.

I have full access to your training data, nutrition plan, check-ins, and progress history. I can adjust your program in real-time based on how you're feeling, performing, and recovering.

Ask me anything — from "why am I doing FST-7 today?" to "swap my meal 3" to "I only slept 4 hours, adjust my workout." I'm here to make every decision for you so you can focus on executing.

What would you like to work on?`,
  timestamp: Date.now(),
}

export function CoachProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    const saved = storage.get('coach_messages', null)
    return saved || [SYSTEM_WELCOME]
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [prescribedModules, setPrescribedModules] = useState(() =>
    storage.get('prescribed_modules', {
      workout: true,
      meals: true,
      supplements: true,
      water: true,
      checkin: true,
      goals: true,
    })
  )

  const sendMessage = useCallback((content) => {
    const userMsg = { id: generateId(), role: 'user', content, timestamp: Date.now() }
    setMessages(prev => {
      const updated = [...prev, userMsg]
      storage.set('coach_messages', updated)
      return updated
    })

    setIsTyping(true)

    // Simulate AI response with contextual awareness
    setTimeout(() => {
      const lower = content.toLowerCase()
      let response = ''

      if (lower.includes('workout') || lower.includes('training') || lower.includes('exercise')) {
        response = `Based on your current training block, here's what I'm seeing:

Your volume has been progressively increasing as planned. Today's session targets the muscle groups that have had optimal recovery time.

I've structured your sets with specific rest periods — FST-7 finishers get 45 seconds to maximize the pump and fascial stretching, while your heavy compound movements get 90 seconds for neural recovery.

Remember: every rep with intention. Control the eccentric, pause at the stretch, and explode through the concentric. Want me to adjust anything about today's session?`
      } else if (lower.includes('meal') || lower.includes('food') || lower.includes('eat') || lower.includes('nutrition') || lower.includes('diet')) {
        response = `Your current nutrition protocol is dialed for your goals:

• **2,500 kcal** — slight surplus for lean tissue accrual
• **212g protein** — 1g/lb to maximize MPS
• **277g carbs** — strategically placed around training
• **59g fat** — minimum for hormonal optimization

Meal timing is structured so your highest carb meals are pre and post-workout. If you need a swap for any meal, just tell me what you have available and I'll recalculate the macros to keep you on track.`
      } else if (lower.includes('sleep') || lower.includes('tired') || lower.includes('recovery') || lower.includes('rest')) {
        response = `Recovery is where the magic happens. Here's my analysis:

Sleep is your #1 recovery tool. If you're under 7 hours, I'll automatically reduce your training volume by 15-20% and prioritize compound movements over isolation work.

For today, make sure you're hitting:
• **Magnesium 400mg** — 30 min before bed
• **Room temp 65-68°F**
• **No screens 30 min before sleep**
• **Consistent sleep/wake times**

Log your sleep in your check-in and I'll adjust your program accordingly. How many hours did you get last night?`
      } else if (lower.includes('progress') || lower.includes('result') || lower.includes('how am i')) {
        response = `Let me pull up your progress data:

You're trending in the right direction. Consistency is the most powerful variable, and you've been showing up. Here's what the data tells me:

• Training volume is progressively overloading ✓
• Meal adherence is building the foundation ✓
• Check-in data helps me fine-tune everything ✓

Keep executing the plan. The compound effect of daily 1% improvements is extraordinary. Trust the process — I'm monitoring everything and will adjust when needed.`
      } else if (lower.includes('hello') || lower.includes('hey') || lower.includes('hi') || lower.includes('sup')) {
        response = `Hey! Ready to dominate today? I've got your full program loaded and optimized.

Here's your quick status:
• **Training** — Your workout is programmed and ready
• **Nutrition** — Meals are set for the day
• **Recovery** — I'm tracking all your variables

What do you want to tackle first?`
      } else {
        response = `I hear you. Let me factor that into your program.

As your AI coach, I'm constantly analyzing every variable — your training data, nutrition adherence, recovery metrics, and how you're feeling day to day. My job is to make the optimal decision at every turn so you get the absolute best results possible.

Is there anything specific you'd like me to adjust or explain about your current protocol? I can break down the rationale behind every single element of your program.`
      }

      const aiMsg = { id: generateId(), role: 'assistant', content: response, timestamp: Date.now() }
      setMessages(prev => {
        const updated = [...prev, aiMsg]
        storage.set('coach_messages', updated)
        return updated
      })
      setIsTyping(false)
    }, 1200 + Math.random() * 800)
  }, [])

  const toggleModule = (key, value) => {
    setPrescribedModules(prev => {
      const updated = { ...prev, [key]: value }
      storage.set('prescribed_modules', updated)
      return updated
    })
  }

  return (
    <CoachContext.Provider value={{
      messages, sendMessage, isTyping,
      isOpen, setIsOpen,
      prescribedModules, toggleModule
    }}>
      {children}
    </CoachContext.Provider>
  )
}

export const useCoach = () => useContext(CoachContext)
