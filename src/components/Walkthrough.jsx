import { useState, useEffect } from "react";
import { Button } from "./Primitives";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// FORGE WALKTHROUGH — Interactive first-use guided tour
// Highlights UI elements with a spotlight + tooltip system
// ══════════════════════════════════════════════════════════════

const STEPS = [
  {
    title: "YOUR DASHBOARD",
    desc: "This is your command center. Daily snapshot, workout status, nutrition tracking — everything at a glance.",
    target: "today",
    position: "bottom",
  },
  {
    title: "PROGRAM",
    desc: "Your personalized training split. Tap any day in the calendar to jump straight into that workout.",
    target: "program",
    position: "bottom",
  },
  {
    title: "AI COACH",
    desc: "Your data-driven intelligence engine. Ask about progress, fatigue, nutrition — it reads all your real data.",
    target: "coach",
    position: "bottom",
  },
  {
    title: "ANALYTICS",
    desc: "Deep performance analytics. Volume trends, fatigue model, muscle heat maps, PR tracking, and more.",
    target: "data",
    position: "bottom",
  },
  {
    title: "QUICK ACTIONS",
    desc: "Daily check-ins, volume logs, and your training guide — all one tap away. Check in daily for best results.",
    target: "actions",
    position: "top",
  },
  {
    title: "COACH ANYWHERE",
    desc: "See that floating button? Tap it anytime — even mid-workout — to pull up your AI coach instantly.",
    target: "fab",
    position: "left",
  },
];

export default function Walkthrough({ C, onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const finish = () => {
    storage.set("wt_done", true);
    onComplete();
  };

  const next = () => {
    if (isLast) finish();
    else setStep(step + 1);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      animation: "fadeIn 0.4s ease",
    }}>
      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }} />

      {/* Progress bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 1,
      }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: C.gradient, backgroundSize: "300% 100%",
          transition: "width 0.4s ease",
          boxShadow: `0 0 10px ${C.accent030}`,
        }} />
      </div>

      {/* Step counter */}
      <div style={{
        position: "absolute", top: 16, right: 20, zIndex: 1,
        fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em",
      }}>
        {step + 1} / {STEPS.length}
      </div>

      {/* Skip button */}
      <button onClick={finish} style={{
        position: "absolute", top: 12, left: 20, zIndex: 1,
        background: "none", border: `1px solid ${C.structBorderHover}`,
        borderRadius: 6, color: C.text4, fontSize: 9, fontFamily: "var(--m)",
        letterSpacing: ".1em", padding: "6px 14px", cursor: "pointer",
        minHeight: 32,
      }}>
        SKIP
      </button>

      {/* Tooltip card */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "calc(100% - 48px)", maxWidth: 340,
        zIndex: 2,
        animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          background: C.cardGradient,
          border: `1.5px solid ${C.accent030}`,
          borderRadius: 16, padding: 28,
          boxShadow: `0 0 40px ${C.accent015}, 0 20px 60px rgba(0,0,0,0.4)`,
          position: "relative", overflow: "hidden",
        }}>
          {/* Top accent glow line */}
          <div style={{
            position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
            background: C.dividerGrad,
            boxShadow: `0 0 12px ${C.accent020}`,
          }} />

          {/* Step indicator dots */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, justifyContent: "center" }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? C.accent : i < step ? C.accent040 : C.structBorderHover,
                transition: "all 0.3s",
                boxShadow: i === step ? `0 0 8px ${C.accent040}` : "none",
              }} />
            ))}
          </div>

          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 16px",
            background: C.structGlass,
            border: `1.5px solid ${C.accent020}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 20px ${C.accent010}`,
          }}>
            {current.target === "coach" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
                <path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" />
                <path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10" />
                <path d="M2 12h20" />
                <circle cx="12" cy="12" r="2" fill={C.accent} stroke="none" />
              </svg>
            ) : current.target === "fab" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="10" r="1.5" fill={C.accent} stroke="none" />
                <circle cx="8" cy="10" r="1.5" fill={C.accent} stroke="none" />
                <circle cx="16" cy="10" r="1.5" fill={C.accent} stroke="none" />
              </svg>
            ) : current.target === "program" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5a3.5 3.5 0 1 1 0 7h11a3.5 3.5 0 1 1 0-7" />
                <line x1="6.5" y1="10" x2="17.5" y2="10" />
                <line x1="4" y1="4" x2="4" y2="16" /><line x1="20" y1="4" x2="20" y2="16" />
              </svg>
            ) : current.target === "data" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            ) : current.target === "actions" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            )}
          </div>

          <div style={{
            fontSize: 10, fontWeight: 700, color: C.accent, fontFamily: "var(--m)",
            letterSpacing: ".2em", textAlign: "center", marginBottom: 8,
            textShadow: `0 0 16px ${C.accent030}`,
          }}>
            {current.title}
          </div>

          <div style={{
            fontSize: 13, color: C.text2, lineHeight: 1.8, textAlign: "center",
            fontFamily: "var(--b)", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px",
          }}>
            {current.desc}
          </div>

          <Button C={C} onClick={next}>
            {isLast ? "GET STARTED" : "NEXT"}
          </Button>
        </div>
      </div>
    </div>
  );
}
