import { useState, useRef, useEffect } from "react";
import { getCoachResponse, getProactiveInsight } from "../utils/coach-engine";

// ══════════════════════════════════════════════════════════════
// FORGE COACH — INTELLIGENT, DATA-DRIVEN
// Reads actual user training data, check-ins, and trends
// ══════════════════════════════════════════════════════════════

export default function CoachPanel({ C, onClose }) {
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

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 640,
        height: "75vh",
        background: C.bg,
        border: `1px solid ${C.border2}`,
        borderBottom: "none",
        borderRadius: "20px 20px 0 0",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        fontFamily: "var(--b)",
        boxShadow: `0 -20px 60px ${C.accent}08`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${C.border1}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.bg, fontFamily: "var(--d)" }}>
            F
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Forge Coach</div>
            <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em" }}>DATA-DRIVEN INTELLIGENCE</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.text4, fontSize: 22, cursor: "pointer", padding: 4 }}>×</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "assistant" ? "row" : "row-reverse", animation: i === messages.length - 1 ? "fi 0.3s ease" : "none" }}>
            {m.role === "assistant" && (
              <div style={{ width: 24, height: 24, borderRadius: 7, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.bg, fontFamily: "var(--d)", flexShrink: 0, marginTop: 2 }}>
                F
              </div>
            )}
            <div style={{ background: m.role === "assistant" ? C.card : `${C.accent}08`, border: `1px solid ${m.role === "assistant" ? C.border2 : C.border1}`, borderRadius: 14, padding: "10px 14px", maxWidth: "82%" }}>
              <div style={{ fontSize: 12.5, color: m.role === "assistant" ? C.text2 : C.text1, lineHeight: 1.75, whiteSpace: "pre-line" }}>{m.text}</div>
              <div style={{ fontSize: 7, color: C.text5, fontFamily: "var(--m)", marginTop: 4, textAlign: m.role === "assistant" ? "left" : "right" }}>{formatTime(m.time)}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 8, animation: "fi 0.2s ease" }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.bg, fontFamily: "var(--d)", flexShrink: 0 }}>F</div>
            <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 14, padding: "12px 18px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, animation: `pulse 1s ease infinite ${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div style={{ padding: "0 16px 8px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
          {quickPrompts.map((prompt) => (
            <button key={prompt} onClick={() => sendQuick(prompt)} style={{ padding: "6px 12px", background: `${C.accent}08`, border: `1px solid ${C.border2}`, borderRadius: 20, color: C.text3, fontSize: 10, fontFamily: "var(--m)", cursor: "pointer", whiteSpace: "nowrap" }}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 16px max(12px, env(safe-area-inset-bottom))", borderTop: `1px solid ${C.border1}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your training data..."
          style={{ flex: 1, padding: "10px 14px", background: `${C.accent}06`, border: `1px solid ${C.border2}`, borderRadius: 10, color: C.text1, fontSize: 13, fontFamily: "var(--b)", outline: "none" }}
        />
        <button
          onClick={send}
          disabled={typing || !input.trim()}
          style={{ background: typing || !input.trim() ? `${C.accent}20` : C.gradient, backgroundSize: "300% 100%", border: "none", borderRadius: 10, color: C.bg, fontSize: 16, fontWeight: 700, width: 44, cursor: typing ? "default" : "pointer", animation: typing ? "none" : "shimmer 4s linear infinite" }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
