import { useState, useRef, useEffect } from "react";

export default function CoachPanel({ C, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome. I have full access to your training data. Ask me anything about your program, nutrition, or recovery.",
      time: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const COACH_RESPONSES = [
    "Your hamstring volume is on track. Focus on the eccentric phase — 3-second negatives on curls will create more hypertrophy stimulus.",
    "Based on your check-ins, sleep quality is your biggest limiter right now. Prioritize getting to bed 30 minutes earlier this week.",
    "Your squat numbers have plateaued. Try adding pause squats at 70% for 3x5 before your working sets to break through.",
    "Protein timing looks good. Make sure your post-workout meal is within 60 minutes. The anabolic window is real for natural lifters.",
    "Recovery markers show you're handling the volume well. We can add one additional set to your compound movements next cycle.",
    "Your lateral delt development needs attention. Add 2 extra sets of cable lateral raises on push days — FST-7 protocol.",
    "Creatine should be taken daily, including rest days. 5g is optimal. Don't cycle it, there's no benefit to cycling.",
    "Your caloric intake is slightly below target on training days. Add 200 calories from carbs around your workout window.",
  ];

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input, time: Date.now() }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = COACH_RESPONSES[Math.floor(Math.random() * COACH_RESPONSES.length)];
      setMessages((prev) => [...prev, { role: "assistant", text: response, time: Date.now() }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 640,
        height: "70vh",
        background: C.bg,
        border: `1px solid ${C.border2}`,
        borderBottom: "none",
        borderRadius: "20px 20px 0 0",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        fontFamily: "var(--b)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border1}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `${C.accent}12`,
              border: `1px solid ${C.border2}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            <span role="img" aria-label="coach">&#9889;</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
              Forge Coach
            </div>
            <div style={{ fontSize: 9, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
              AI ASSISTANT
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: C.text4,
            fontSize: 20,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              flexDirection: m.role === "assistant" ? "row" : "row-reverse",
            }}
          >
            {m.role === "assistant" && (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  background: `${C.accent}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <span role="img" aria-label="ai">&#9889;</span>
              </div>
            )}
            <div
              style={{
                background: m.role === "assistant" ? C.card : `${C.accent}0a`,
                border: `1px solid ${m.role === "assistant" ? C.border2 : C.border1}`,
                borderRadius: 14,
                padding: "10px 14px",
                maxWidth: "80%",
              }}
            >
              <div style={{ fontSize: 13, color: m.role === "assistant" ? C.text2 : C.text1, lineHeight: 1.7 }}>
                {m.text}
              </div>
              <div
                style={{
                  fontSize: 7,
                  color: C.text5,
                  fontFamily: "var(--m)",
                  marginTop: 4,
                  textAlign: m.role === "assistant" ? "left" : "right",
                }}
              >
                {formatTime(m.time)}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: `${C.accent}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                flexShrink: 0,
              }}
            >
              <span role="img" aria-label="ai">&#9889;</span>
            </div>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border2}`,
                borderRadius: 14,
                padding: "12px 18px",
                color: C.text4,
                fontSize: 12,
                animation: "pulse 1.2s ease infinite",
              }}
            >
              typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 16px max(16px, env(safe-area-inset-bottom))",
          borderTop: `1px solid ${C.border1}`,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask your coach..."
          style={{
            flex: 1,
            padding: "10px 14px",
            background: `${C.accent}06`,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            color: C.text1,
            fontSize: 13,
            fontFamily: "var(--b)",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            background: C.gradient,
            backgroundSize: "300% 100%",
            border: "none",
            borderRadius: 10,
            color: C.bg,
            fontSize: 16,
            fontWeight: 700,
            width: 44,
            cursor: "pointer",
            animation: "shimmer 4s linear infinite",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
