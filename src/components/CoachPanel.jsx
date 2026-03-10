import { useState, useRef, useEffect } from "react";
import { getCoachResponse, getProactiveInsight } from "../utils/coach-engine";
import { ForgeLogo } from "./Primitives";

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
      cursor: "pointer", zIndex: 55,
      boxShadow: `0 0 20px ${C.accent015}, 0 4px 16px rgba(0,0,0,0.3), 0 0 40px ${C.accent005}`,
      animation: "accentBreathe 5s ease-in-out infinite",
      transition: "all 0.2s",
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6l-.8.6V18h-6v-2.4l-.8-.6A7 7 0 0 1 12 2z" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="21" x2="14" y2="21" />
        <circle cx="10" cy="9" r="0.8" fill={C.accent} stroke="none" />
        <circle cx="14" cy="9" r="0.8" fill={C.accent} stroke="none" />
        <path d="M10 9l2 2 2-2" strokeWidth="1" />
      </svg>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// FORGE COACH — FULL TAB VIEW
// Intelligent, data-driven coaching as a dedicated tab
// isWorkout: when true, shows as overlay during workout without blocking rest timer
// ══════════════════════════════════════════════════════════════

export default function CoachPanel({ C, isOverlay, onClose, isWorkout }) {
  const [messages, setMessages] = useState(() => {
    const insight = getProactiveInsight();
    return [{ role: "assistant", text: insight, time: Date.now() }];
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const scrollRef = useRef();
  const photoRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingPhoto(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const send = () => {
    if ((!input.trim() && !pendingPhoto) || typing) return;
    const userMsg = input.trim();
    const photo = pendingPhoto;
    setMessages((prev) => [...prev, { role: "user", text: userMsg || (photo ? "📷 Photo attached" : ""), time: Date.now(), photo }]);
    setInput("");
    setPendingPhoto(null);
    setTyping(true);

    const thinkTime = 600 + Math.min((userMsg || "").length * 8, 800);
    setTimeout(() => {
      const response = photo && !userMsg
        ? getCoachResponse("Analyze this photo")
        : getCoachResponse(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: response, time: Date.now() }]);
      setTyping(false);
    }, thinkTime);
  };

  const quickPrompts = isWorkout
    ? ["Form check tips", "Adjust my rest time", "How's my volume today?", "Motivation boost"]
    : ["How am I progressing?", "Analyze my fatigue", "Nutrition check", "Sleep quality"];

  const sendQuick = (prompt) => {
    setShowPrompts(false);
    setMessages((prev) => [...prev, { role: "user", text: prompt, time: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: getCoachResponse(prompt), time: Date.now() }]);
      setTyping(false);
    }, 800);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // During workout: slide up from bottom as a half-screen panel, NOT full takeover
  const wrapStyle = isOverlay ? (isWorkout ? {
    position: "fixed", left: 0, right: 0, bottom: 0, top: "25%",
    zIndex: 90,
    background: C.bg,
    display: "flex", flexDirection: "column",
    animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
    borderTop: `1px solid ${C.structBorderStrong}`,
    borderRadius: "20px 20px 0 0",
    boxShadow: `0 -8px 40px rgba(0,0,0,0.5), 0 0 20px ${C.accent010}`,
  } : {
    position: "fixed", inset: 0, zIndex: 100,
    background: C.bg,
    display: "flex", flexDirection: "column",
    animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
  }) : {
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
        <ForgeLogo C={C} size="sm" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Forge Coach</div>
          <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
            {isWorkout ? "WORKOUT MODE" : "fitnessforge.ai"}
          </div>
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
              {m.photo && (
                <div style={{ marginBottom: 8, borderRadius: 10, overflow: "hidden" }}>
                  <img src={m.photo} alt="" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block", borderRadius: 10 }} />
                </div>
              )}
              {m.text && <div style={{ fontSize: 12.5, color: m.role === "assistant" ? C.text2 : C.text1, lineHeight: 1.75, whiteSpace: "pre-line" }}>{m.text}</div>}
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

      {/* Quick Prompts — togglable, always accessible */}
      {showPrompts && (
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
      {!showPrompts && messages.length > 2 && (
        <div style={{ padding: isOverlay ? "4px 20px" : "4px 0", flexShrink: 0 }}>
          <button onClick={() => setShowPrompts(true)} style={{
            padding: "6px 12px", background: "none", border: `1px solid ${C.structBorderHover}`,
            borderRadius: 16, color: C.text4, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer",
            letterSpacing: ".06em",
          }}>
            SUGGESTIONS
          </button>
        </div>
      )}

      {/* Photo Preview */}
      {pendingPhoto && (
        <div style={{ padding: isOverlay ? "8px 20px 0" : "8px 0 0", flexShrink: 0 }}>
          <div style={{ position: "relative", display: "inline-block", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.accent030}` }}>
            <img src={pendingPhoto} alt="" style={{ height: 64, borderRadius: 10, display: "block", objectFit: "cover" }} />
            <button onClick={() => setPendingPhoto(null)} style={{
              position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: 9,
              background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 10,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <input ref={photoRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} style={{ display: "none" }} />
      <div style={{ padding: isOverlay ? "12px 20px max(12px, env(safe-area-inset-bottom))" : "12px 0 4px", borderTop: `1px solid ${C.structBorderHover}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => photoRef.current?.click()} style={{
          background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`,
          borderRadius: 12, width: 48, height: 48, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: pendingPhoto ? C.accent : C.text4, transition: "color 0.2s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={isWorkout ? "Ask about your current workout..." : "Ask about your training data..."}
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
          disabled={typing || (!input.trim() && !pendingPhoto)}
          style={{
            background: typing || (!input.trim() && !pendingPhoto) ? C.accent020 : C.gradientBtn,
            backgroundSize: "300% 100%",
            border: "none",
            borderRadius: 12,
            color: C.btnText,
            fontSize: 16,
            fontWeight: 700,
            width: 48,
            height: 48,
            cursor: typing ? "default" : "pointer",
            animation: !typing && (input.trim() || pendingPhoto) ? "shimmerSlow 8s ease-in-out infinite" : "none",
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
