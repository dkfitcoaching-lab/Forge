import { useState } from "react";
import { Button, Card } from "../components/Primitives";
import storage from "../utils/storage";

const STEPS = [
  {
    title: "14-Day Split",
    desc: "A scientifically designed rotating split that hits every muscle group twice per cycle. Compound and isolation work balanced for maximum hypertrophy.",
    icon: "💪",
  },
  {
    title: "Nutrition Engine",
    desc: "2,500 calories. 5 meals. Macro-optimized for lean muscle gain. Track every meal and hit your targets daily.",
    icon: "🍽️",
  },
  {
    title: "AI Coach",
    desc: "Your personal coach has full access to your training data. Ask questions, get form cues, and receive personalized recommendations.",
    icon: "⚡",
  },
  {
    title: "Track Everything",
    desc: "Daily check-ins, volume logs, supplement tracking, water intake. Data drives progress. The Forge system leaves nothing to chance.",
    icon: "📊",
  },
];

export default function OnboardingScreen({ C, onComplete }) {
  const [step, setStep] = useState(0);

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
      }}
    >
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= step ? C.accent : `${C.accent}15`,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Step Content */}
        <div key={step} style={{ animation: "fi 0.3s ease", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>{STEPS[step].icon}</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "var(--d)",
              marginBottom: 12,
              background: C.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {STEPS[step].title}
          </div>
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

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              flex: 1,
              padding: 14,
              background: "transparent",
              border: `1px solid ${C.border2}`,
              borderRadius: 12,
              color: C.text3,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--m)",
              letterSpacing: ".1em",
              cursor: "pointer",
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
          }}
        >
          SKIP
        </button>
      )}
    </div>
  );
}
