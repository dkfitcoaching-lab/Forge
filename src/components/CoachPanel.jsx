import { useState, useRef, useEffect } from "react";
import { getCoachResponse, getProactiveInsight } from "../utils/coach-engine";
import { ForgeLogo } from "./Primitives";
import storage from "../utils/storage";

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
        <path d="M12 2l2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1Z" />
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
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const scrollRef = useRef();
  const photoRef = useRef();
  const galleryRef = useRef();
  const recognitionRef = useRef(null);

  // TTS — speak a coach message
  const speak = (text, msgIndex) => {
    if (typeof speechSynthesis === "undefined") return;
    const ttsEnabled = storage.get("tts_enabled", false);
    if (!ttsEnabled && msgIndex !== undefined) return; // auto-play only if enabled
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voiceId = storage.get("coach_voice", "default");
    if (voiceId !== "default") {
      const found = speechSynthesis.getVoices().find((v) => v.name === voiceId);
      if (found) u.voice = found;
    }
    u.rate = 0.95;
    u.pitch = 1.0;
    setSpeakingId(msgIndex ?? -1);
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    setSpeakingId(null);
  };

  // Voice input — speech recognition
  const hasSpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = () => {
    if (!hasSpeechRecognition || listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

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
      // Auto-speak if TTS enabled
      if (storage.get("tts_enabled", false)) speak(response);
    }, thinkTime);
  };

  const quickPrompts = isWorkout
    ? ["Form check tips", "Adjust my rest time", "How's my volume today?", "Push me harder"]
    : ["What should I focus on today?", "Break down my nutrition", "How's my recovery looking?", "What needs work this week?"];

  const sendQuick = (prompt) => {
    setShowPrompts(false);
    setMessages((prev) => [...prev, { role: "user", text: prompt, time: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      const response = getCoachResponse(prompt);
      setMessages((prev) => [...prev, { role: "assistant", text: response, time: Date.now() }]);
      setTyping(false);
      if (storage.get("tts_enabled", false)) speak(response);
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
            {isWorkout ? "LIVE SESSION INTEL" : "ALWAYS ON · ALWAYS LEARNING"}
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
              <div style={{ fontSize: 7, color: C.text5, fontFamily: "var(--m)", marginTop: 6, display: "flex", alignItems: "center", justifyContent: m.role === "assistant" ? "space-between" : "flex-end" }}>
                <span>{formatTime(m.time)}</span>
                {m.role === "assistant" && typeof speechSynthesis !== "undefined" && (
                  <button onClick={(e) => { e.stopPropagation(); speakingId === i ? stopSpeaking() : speak(m.text, i); }} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 2,
                    color: speakingId === i ? C.accent : C.text5, transition: "color 0.2s",
                    display: "flex", alignItems: "center",
                  }}>
                    {speakingId === i ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
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
      <input ref={galleryRef} type="file" accept="image/*,video/*" multiple onChange={handlePhotoSelect} style={{ display: "none" }} />
      <div style={{ padding: isOverlay ? "12px 20px max(12px, env(safe-area-inset-bottom))" : "12px 0 4px", borderTop: `1px solid ${C.structBorderHover}`, display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={() => photoRef.current?.click()} title="Take photo" style={{
          background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`,
          borderRadius: 12, width: 40, height: 48, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: pendingPhoto ? C.accent : C.text4, transition: "color 0.2s", flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
          </svg>
        </button>
        <button onClick={() => galleryRef.current?.click()} title="Upload from gallery" style={{
          background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`,
          borderRadius: 12, width: 40, height: 48, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.text4, transition: "color 0.2s", flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        {hasSpeechRecognition && (
          <button onClick={listening ? stopListening : startListening} style={{
            background: listening ? C.accent015 : C.structGlass,
            border: `1.5px solid ${listening ? C.accent : C.structBorderHover}`,
            borderRadius: 12, width: 44, height: 48, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: listening ? C.accent : C.text4, transition: "all 0.2s", flexShrink: 0,
            animation: listening ? "pulse 1.5s ease-in-out infinite" : "none",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={isWorkout ? "Ask your coach anything..." : "Talk to your coach..."}
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
