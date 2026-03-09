import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useCoach } from '../context/CoachContext'
import { X, Send, Brain, Sparkles, Mic, Paperclip } from 'lucide-react'

function TypingIndicator({ theme }) {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
        background: `${theme.accent}12`, border: `1px solid ${theme.accent}20`,
      }}>
        <Brain size={14} color={theme.accent} />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-md" style={{
        background: theme.card, border: `1px solid ${theme.border}`,
      }}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: theme.accent }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, theme }) {
  const isAI = message.role === 'assistant'
  const time = new Date(message.timestamp)
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-2 mb-4 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      {isAI && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{
          background: `${theme.accent}12`, border: `1px solid ${theme.accent}20`,
        }}>
          <Brain size={14} color={theme.accent} />
        </div>
      )}
      <div className="max-w-[85%]">
        <div
          className={`px-4 py-3 ${isAI ? 'rounded-2xl rounded-tl-md' : 'rounded-2xl rounded-tr-md'}`}
          style={{
            background: isAI ? theme.card : `${theme.accent}12`,
            border: `1px solid ${isAI ? theme.border : theme.borderAccent}`,
          }}
        >
          <div
            style={{
              fontSize: 13, color: isAI ? theme.t2 : theme.t1,
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${theme.t1};font-weight:700">$1</strong>`)
                .replace(/•/g, `<span style="color:${theme.accent}">•</span>`)
            }}
          />
        </div>
        <div className={`mt-1 ${isAI ? '' : 'text-right'}`} style={{
          fontSize: 8, color: theme.t5, fontFamily: "'JetBrains Mono', monospace",
        }}>
          {timeStr}
        </div>
      </div>
    </motion.div>
  )
}

export default function CoachPanel() {
  const { theme } = useTheme()
  const { messages, sendMessage, isTyping, isOpen, setIsOpen } = useCoach()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  const hour = new Date().getHours()
  const quickActions = hour < 10
    ? ['What\'s my workout today?', 'Pre-workout nutrition?', 'I slept poorly', 'Morning check-in']
    : hour < 15
    ? ['Adjust my workout', 'Post-workout meal?', 'Form check tips', 'Show my progress']
    : hour < 20
    ? ['Evening meal advice', 'Recovery protocol?', 'How am I trending?', 'Tomorrow\'s preview']
    : ['Optimize my sleep', 'Bedtime supplements?', 'Weekly summary', 'Adjust tomorrow']

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          style={{ background: theme.overlay }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-0 flex flex-col"
            style={{ background: theme.bg, paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: `${theme.accent}10`, border: `1px solid ${theme.accent}20`,
                  }}>
                    <Brain size={20} color={theme.accent} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{
                    background: theme.success, border: `2px solid ${theme.bg}`,
                    boxShadow: `0 0 6px ${theme.success}60`,
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: theme.t1, fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}>
                    FORGE COACH
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={9} color={theme.accent} />
                    <span style={{ fontSize: 9, color: theme.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
                      AI-POWERED — ALWAYS ON
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: `${theme.card}`, border: `1px solid ${theme.border}` }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} color={theme.t3} />
              </motion.button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4" style={{
              scrollBehavior: 'smooth',
            }}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} theme={theme} />
              ))}
              {isTyping && <TypingIndicator theme={theme} />}
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {quickActions.map(q => (
                    <motion.button
                      key={q}
                      onClick={() => { setInput(q); sendMessage(q) }}
                      className="shrink-0 px-3 py-2 rounded-lg cursor-pointer"
                      style={{
                        background: `${theme.accent}08`, border: `1px solid ${theme.borderAccent}`,
                        color: theme.accent, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        whiteSpace: 'nowrap',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <div className="flex items-end gap-2 p-2 rounded-2xl" style={{
                background: theme.card, border: `1px solid ${theme.border}`,
              }}>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
                  style={{ background: 'none', border: 'none', color: theme.t4 }}>
                  <Paperclip size={18} />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Ask your coach anything..."
                  rows={1}
                  className="flex-1 resize-none outline-none bg-transparent py-2"
                  style={{
                    color: theme.t1, fontSize: 14,
                    maxHeight: 100, lineHeight: 1.5,
                  }}
                />
                <button className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
                  style={{ background: 'none', border: 'none', color: theme.t4 }}>
                  <Mic size={18} />
                </button>
                <motion.button
                  onClick={handleSend}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
                  style={{
                    background: input.trim() ? theme.gradient : `${theme.accent}10`,
                    border: 'none',
                  }}
                  whileTap={input.trim() ? { scale: 0.9 } : {}}
                >
                  <Send size={16} color={input.trim() ? theme.bg : theme.t4} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
