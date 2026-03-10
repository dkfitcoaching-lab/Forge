import { useState, useRef, useEffect } from "react";
import { getCoachResponse, getProactiveInsight } from "../utils/coach-engine";

// Floating coach button for use in WorkoutPlayer and other views
export function CoachFAB({ C, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "fixed", bottom: 100, right: 20,
      width: 48, height: 48, borderRadius: 14,
      background: C.structGlass,
      border: `1.5px solid ${C.accent030}`,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", zIndex: 40,
      boxShadow: `0 0 20px ${C.accent015}, 0 4px 16px rgba(0,0,0,0.3), 0 0 40px ${C.accent005}`,
      animation: "accentBreathe 5s ease-in-out infinite",
      transition: "all 0.2s",
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6l-.8.6V18h-6v-2.4l-.8-.6A7 7 0 0 1 12 2z" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="21" x2="14" y2="21" />
      </svg>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// FORGE COACH — FULL TAB VIEW
// Intelligent, data-driven coaching as a dedicated tab
// ══════════════════════════════════════════════════════════════

export default function CoachPanel({ C, isOverlay, onClose }) {
  const [messages, setMessages] = useState(() => {
    const insight = getProactiveInsight();
    return [{ role: "assistant", text: insight, time: Date.now() }];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg, time: Date.now() }]);
    setInput("");
    setTyping(true);

    const thinkTime = 600 + Math.min(userMsg.length * 8, 800);
    setTimeout(() => {
      const response = getCoachResponse(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: response, time: Date.now() }]);
      setTyping(false);
    }, thinkTime);
  };

  const quickPrompts = ["How am I progressing?", "Analyze my fatigue", "Nutrition check", "Sleep quality"];

  const sendQuick = (prompt) => {
    setMessages((prev) => [...prev, { role: "user", text: prompt, time: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: getCoachResponse(prompt), time: Date.now() }]);
      setTyping(false);
    }, 800);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const wrapStyle = isOverlay ? {
    position: "fixed", inset: 0, zIndex: 100,
    background: C.bg,
    display: "flex", flexDirection: "column",
    animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
  } : {
    display: "flex", flexDirection: "column",
    height: "calc(100vh - 180px)", marginTop: -4,
  };

  return (
    <div style={wrapStyle}>
      {/* Coach Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: isOverlay ? "14px 20px" : "0 0 16px",
        borderBottom: `1px solid ${C.structBorder}`,
        background: isOverlay ? C.headerBg : "transparent",
        backdropFilter: isOverlay ? "blur(20px)" : "none",
        flexShrink: 0,
      }}>
        {isOverlay && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", padding: 4, display: "flex", alignItems: "center", minWidth: 36, minHeight: 44 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: C.structGlass,
          border: `1px solid ${C.accent030}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 900, color: C.accent, fontFamily: "var(--d)",
          boxShadow: `0 0 16px ${C.accent015}, 0 0 32px ${C.accent005}`,
        }}>
          F
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Forge Coach</div>
          <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".14em" }}>DATA-DRIVEN INTELLIGENCE</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: C.secondary, boxShadow: `0 0 8px ${C.secondary030}`, animation: "pulse 3s ease-in-out infinite" }} />
          <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>ONLINE</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: isOverlay ? "16px 20px 8px" : "16px 0 8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "assistant" ? "row" : "row-reverse", animation: i === messages.length - 1 ? "fadeIn 0.3s ease" : "none" }}>
            {m.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: C.gradient, backgroundSize: "300% 100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
                flexShrink: 0, marginTop: 2,
              }}>
                F
              </div>
            )}
            <div style={{
              background: m.role === "assistant"
                ? C.cardGradient
                : C.accent008,
              border: `1px solid ${m.role === "assistant" ? C.structBorderHover : C.accent015}`,
              borderRadius: m.role === "assistant" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
              padding: "12px 16px",
              maxWidth: "82%",
              boxShadow: m.role === "assistant" ? C.cardShadow : "none",
            }}>
              <div style={{ fontSize: 12.5, color: m.role === "assistant" ? C.text2 : C.text1, lineHeight: 1.75, whiteSpace: "pre-line" }}>{m.text}</div>
              <div style={{ fontSize: 7, color: C.text5, fontFamily: "var(--m)", marginTop: 6, textAlign: m.role === "assistant" ? "left" : "right" }}>{formatTime(m.time)}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 8, animation: "fadeIn 0.2s ease" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: C.gradient, backgroundSize: "300% 100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
              flexShrink: 0,
            }}>F</div>
            <div style={{
              background: C.cardGradient,
              border: `1px solid ${C.structBorderHover}`,
              borderRadius: "4px 16px 16px 16px",
              padding: "14px 20px",
              display: "flex", gap: 5, alignItems: "center",
              boxShadow: C.cardShadow,
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: C.accent,
                  animation: `breathe 1.2s ease-in-out infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div style={{ padding: isOverlay ? "8px 20px" : "8px 0", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
          {quickPrompts.map((prompt) => (
            <button key={prompt} onClick={() => sendQuick(prompt)} style={{
              padding: "8px 14px",
              background: C.structGlass,
              border: `1px solid ${C.structBorderHover}`,
              borderRadius: 20,
              color: C.text3,
              fontSize: 10,
              fontFamily: "var(--m)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              letterSpacing: ".04em",
            }}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: isOverlay ? "12px 20px max(12px, env(safe-area-inset-bottom))" : "12px 0 4px", borderTop: `1px solid ${C.structBorderHover}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your training data..."
          style={{
            flex: 1, padding: "12px 16px",
            background: C.structGlass,
            border: `1.5px solid ${C.structBorderHover}`,
            borderRadius: 12,
            color: C.text1,
            fontSize: 13,
            fontFamily: "var(--b)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          style={{
            background: typing || !input.trim() ? C.accent020 : C.gradientBtn,
            backgroundSize: "300% 100%",
            border: "none",
            borderRadius: 12,
            color: C.btnText,
            fontSize: 16,
            fontWeight: 700,
            width: 48,
            height: 48,
            cursor: typing ? "default" : "pointer",
            animation: !typing && input.trim() ? "shimmerSlow 8s ease-in-out infinite" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
