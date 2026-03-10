import { useState, useEffect } from "react";
import { Button } from "../components/Primitives";
import storage from "../utils/storage";

const STEPS = [
  {
    title: "14-Day Split",
    desc: "A scientifically designed rotating split that hits every muscle group twice per cycle. Compound and isolation work balanced for maximum hypertrophy.",
    icon: (C) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a3.5 3.5 0 1 1 0 7h11a3.5 3.5 0 1 1 0-7" />
        <line x1="6.5" y1="10" x2="17.5" y2="10" />
        <line x1="4" y1="4" x2="4" y2="16" /><line x1="20" y1="4" x2="20" y2="16" />
        <line x1="2" y1="4" x2="6" y2="4" /><line x1="2" y1="16" x2="6" y2="16" />
        <line x1="18" y1="4" x2="22" y2="4" /><line x1="18" y1="16" x2="22" y2="16" />
      </svg>
    ),
  },
  {
    title: "Nutrition Engine",
    desc: "2,500 calories. 5 meals. Macro-optimized for lean muscle gain. Track every meal and hit your targets daily.",
    icon: (C) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    title: "AI Coach",
    desc: "Your personal coach has full access to your training data. Ask questions, get form cues, and receive personalized recommendations.",
    icon: (C) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6l-.8.6V18h-6v-2.4l-.8-.6A7 7 0 0 1 12 2z" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="21" x2="14" y2="21" />
      </svg>
    ),
  },
  {
    title: "Track Everything",
    desc: "Daily check-ins, volume logs, supplement tracking, water intake. Data drives progress. The Forge system leaves nothing to chance.",
    icon: (C) => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export default function OnboardingScreen({ C, onComplete }) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "var(--b)",
        color: C.text1,
        display: "flex",
        flexDirection: "column",
        padding: 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`,
        animation: "orbFloat 6s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 40, position: "relative", zIndex: 1 }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= step ? C.accent : C.accent010,
              transition: "background 0.4s",
              boxShadow: i <= step ? `0 0 8px ${C.accent030}` : "none",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
        {/* Step Content */}
        <div style={{
          textAlign: "center",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            marginBottom: 28, display: "flex", justifyContent: "center",
            filter: `drop-shadow(0 0 16px ${C.accent030})`,
          }}>
            {STEPS[step].icon(C)}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "var(--d)",
              marginBottom: 12,
              background: C.gradient,
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {STEPS[step].title}
          </div>
          <div style={{ height: 1, background: C.dividerGrad, width: 60, margin: "0 auto 16px" }} />
          <div
            style={{
              fontSize: 13,
              color: C.text3,
              lineHeight: 1.8,
              fontFamily: "var(--m)",
              maxWidth: 320,
              margin: "0 auto",
            }}
          >
            {STEPS[step].desc}
          </div>
        </div>
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, position: "relative", zIndex: 1 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === step ? C.accent : C.accent020,
            transition: "all 0.3s",
            boxShadow: i === step ? `0 0 8px ${C.accent030}` : "none",
          }} />
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 1 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              flex: 1,
              padding: 14,
              background: "transparent",
              border: `1.5px solid ${C.border2}`,
              borderRadius: 8,
              color: C.text3,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "var(--m)",
              letterSpacing: ".12em",
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            BACK
          </button>
        )}
        <Button
          C={C}
          onClick={() => {
            if (step < STEPS.length - 1) {
              setStep(step + 1);
            } else {
              storage.set("ob", true);
              onComplete();
            }
          }}
          style={{ flex: 1 }}
        >
          {step < STEPS.length - 1 ? "NEXT" : "START FORGING"}
        </Button>
      </div>

      {/* Skip */}
      {step < STEPS.length - 1 && (
        <button
          onClick={() => {
            storage.set("ob", true);
            onComplete();
          }}
          style={{
            background: "none",
            border: "none",
            color: C.text5,
            fontSize: 10,
            fontFamily: "var(--m)",
            letterSpacing: ".16em",
            cursor: "pointer",
            marginTop: 16,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
