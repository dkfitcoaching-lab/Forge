import { useState, useEffect, useRef } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// FORGE AI ONBOARDING — Conversational entry with tier gate
// The AI guides new users through setup then presents tier options
// ══════════════════════════════════════════════════════════════

const CONVERSATION_FLOW = [
  {
    ai: "Welcome to Forge. I'm your AI performance coach. Before we begin, I'd like to learn about you so I can personalize your experience.",
    autoAdvance: true,
    delay: 1500,
  },
  {
    ai: "What's your primary fitness goal right now?",
    options: ["Build Muscle", "Lose Fat", "Get Stronger", "Athletic Performance"],
    key: "goal",
  },
  {
    genAi: (data) => {
      const r = {
        "Build Muscle": "Hypertrophy-focused programming — Forge's 14-day split is built exactly for that. High volume, progressive overload, precision nutrition.",
        "Lose Fat": "Fat loss with muscle retention. Forge tracks nutrition, hydration, and training volume to keep you in an optimal deficit without sacrificing strength.",
        "Get Stronger": "Strength is the foundation. Forge programs compound movements with progressive overload tracking and PR detection built in.",
        "Athletic Performance": "Performance demands everything — power, endurance, recovery. Forge tracks all metrics to keep you at peak output.",
      };
      return r[data.goal] || "Great choice. Forge is built to push your limits.";
    },
    followUp: "How many days per week can you commit to training?",
    options: ["3-4 days", "5-6 days", "Every day"],
    key: "frequency",
  },
  {
    genAi: (data) => {
      if (data.frequency === "Every day") return "Serious dedication. Forge builds in strategic rest days — recovery is where growth happens. The 14-day cycle optimizes this.";
      if (data.frequency === "5-6 days") return "Ideal frequency. The Forge 14-day split maps perfectly to your schedule with built-in recovery windows.";
      return "Smart approach. Forge's flexible programming adapts to your schedule while maintaining progressive stimulus.";
    },
    followUp: "What's your experience level?",
    options: ["Beginner (< 1 year)", "Intermediate (1-3 years)", "Advanced (3+ years)"],
    key: "experience",
  },
  {
    genAi: (data) => {
      const n = data.experience?.includes("Beginner") ? "Even starting out" : data.experience?.includes("Intermediate") ? "At your level" : "With your background";
      return `${n}, Forge adapts in real-time. Form cues, progressive overload targets, fatigue monitoring — everything calibrated to where you are now.\n\nI've built your personalized profile. Here are the plans available:`;
    },
    showTiers: true,
  },
];

const TIERS = [
  {
    name: "FORGE",
    price: "Free",
    period: "",
    features: ["14-day training split", "Nutrition tracking", "Daily check-ins", "Volume logging", "Progress photos"],
    accent: false,
    cta: "START FREE",
  },
  {
    name: "FORGE PRO",
    price: "$9.99",
    period: "/mo",
    features: ["Everything in Free", "AI Coach (unlimited)", "Advanced analytics", "Progressive overload AI", "Fatigue model", "Custom exercise swaps"],
    accent: true,
    cta: "START PRO TRIAL",
    badge: "RECOMMENDED",
  },
  {
    name: "FORGE ELITE",
    price: "$19.99",
    period: "/mo",
    features: ["Everything in Pro", "1-on-1 coach messaging", "Custom program builder", "Video form analysis", "Priority support", "Early access features"],
    accent: false,
    cta: "GO ELITE",
    badge: "COMING SOON",
  },
];

function TypingDots({ C }) {
  return (
    <div style={{ display: "flex", gap: 8, animation: "fadeIn 0.2s ease" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "14px 20px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: C.accent,
            animation: `pulse 1.4s ease-in-out infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

function AiMsg({ text, C }) {
  return (
    <div style={{ display: "flex", gap: 8, animation: "fi 0.4s ease" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0, marginTop: 2,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "14px 18px",
        maxWidth: "85%",
        boxShadow: `0 2px 12px rgba(0,0,0,0.2)`,
      }}>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.75, whiteSpace: "pre-line" }}>{text}</div>
      </div>
    </div>
  );
}

function UserMsg({ text, C }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", animation: "fi 0.3s ease" }}>
      <div style={{
        background: C.accent008,
        border: `1px solid ${C.accent015}`,
        borderRadius: "16px 4px 16px 16px",
        padding: "12px 18px",
        maxWidth: "80%",
      }}>
        <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

function TierCard({ tier, C, onSelect }) {
  return (
    <div style={{
      background: tier.accent ? C.accent005 : C.cardGradient,
      border: `1.5px solid ${tier.accent ? C.accent : C.structBorderHover}`,
      borderRadius: 16,
      padding: 20,
      position: "relative",
      boxShadow: tier.accent
        ? `0 4px 24px ${C.accent015}, 0 0 48px ${C.accent008}`
        : `0 2px 12px rgba(0,0,0,0.2)`,
      animation: tier.accent ? "accentBreathe 5s ease-in-out infinite" : "none",
    }}>
      {tier.badge && (
        <div style={{
          position: "absolute", top: -10, right: 16,
          background: tier.badge === "RECOMMENDED" ? C.gradientBtn : C.structGlass,
          backgroundSize: "300% 100%",
          padding: "4px 12px", borderRadius: 12,
          fontSize: 7, fontWeight: 700, fontFamily: "var(--m)",
          letterSpacing: ".14em",
          color: tier.badge === "RECOMMENDED" ? C.btnText : C.text4,
          border: tier.badge === "RECOMMENDED" ? "none" : `1px solid ${C.structBorderHover}`,
        }}>
          {tier.badge}
        </div>
      )}
      <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--m)", letterSpacing: ".2em", color: tier.accent ? C.accent : C.text4, marginBottom: 8 }}>
        {tier.name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--d)", color: C.text1 }}>{tier.price}</span>
        {tier.period && <span style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>{tier.period}</span>}
      </div>
      <div style={{ marginBottom: 16 }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={tier.accent ? C.accent : C.text4} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)" }}>{f}</span>
          </div>
        ))}
      </div>
      <Button C={C} variant={tier.accent ? "primary" : "ghost"} onClick={onSelect}>
        {tier.cta}
      </Button>
    </div>
  );
}

export default function OnboardingScreen({ C, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [flowIdx, setFlowIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [showOpts, setShowOpts] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
  const [userData, setUserData] = useState({});
  const scrollRef = useRef();
  const started = useRef(false);

  const scroll = () => {
    if (scrollRef.current) setTimeout(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
  };

  // Start conversation
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const s0 = CONVERSATION_FLOW[0];
    setTimeout(() => {
      setMessages([{ role: "ai", text: s0.ai }]);
      setTyping(false);
      // Auto-advance
      setTimeout(() => {
        setFlowIdx(1);
        setTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "ai", text: CONVERSATION_FLOW[1].ai }]);
          setTyping(false);
          setShowOpts(true);
        }, 1000);
      }, s0.delay || 1200);
    }, 1000);
  }, []);

  useEffect(scroll, [messages, typing, showTiers, showOpts]);

  const pick = (option) => {
    const step = CONVERSATION_FLOW[flowIdx];
    const newData = { ...userData, [step.key]: option };
    setUserData(newData);
    setShowOpts(false);
    setMessages(prev => [...prev, { role: "user", text: option }]);

    const ni = flowIdx + 1;
    if (ni >= CONVERSATION_FLOW.length) return;

    const next = CONVERSATION_FLOW[ni];
    setFlowIdx(ni);
    setTyping(true);

    const aiText = next.genAi ? next.genAi(newData) : next.ai;
    const full = next.followUp ? `${aiText}\n\n${next.followUp}` : aiText;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: full }]);
      setTyping(false);
      if (next.showTiers) {
        setTimeout(() => setShowTiers(true), 700);
      } else if (next.options) {
        setTimeout(() => setShowOpts(true), 350);
      }
    }, 800 + Math.random() * 500);
  };

  const finish = () => {
    storage.set("ob", true);
    storage.set("ob_data", userData);
    onComplete();
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      {/* Atmosphere */}
      <div style={{
        position: "fixed", top: "10%", left: "50%",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`,
        animation: "orbFloat 8s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 20px",
        borderBottom: `1px solid ${C.structBorder}`,
        background: C.headerBg,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <ForgeLogo C={C} size="sm" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", letterSpacing: ".06em" }}>FORGE</div>
          <div style={{ fontSize: 7, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".16em" }}>AI ONBOARDING</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.ok, animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>ACTIVE</span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "20px 16px 40px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((m, i) => (
          m.role === "ai" ? <AiMsg key={i} text={m.text} C={C} /> : <UserMsg key={i} text={m.text} C={C} />
        ))}

        {typing && <TypingDots C={C} />}

        {/* Option Buttons */}
        {showOpts && !typing && CONVERSATION_FLOW[flowIdx]?.options && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            padding: "4px 0 4px 38px",
            animation: "fi 0.4s ease",
          }}>
            {CONVERSATION_FLOW[flowIdx].options.map((opt) => (
              <button key={opt} onClick={() => pick(opt)} style={{
                padding: "10px 18px",
                background: C.accent005,
                border: `1.5px solid ${C.accent020}`,
                borderRadius: 24,
                color: C.text1,
                fontSize: 12,
                fontFamily: "var(--m)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: ".04em",
              }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Tier Cards */}
        {showTiers && (
          <div style={{ padding: "12px 0", animation: "fi 0.6s ease" }}>
            <div style={{
              fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)",
              letterSpacing: ".2em", textAlign: "center", marginBottom: 16,
            }}>
              CHOOSE YOUR PATH
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TIERS.map((tier) => (
                <TierCard key={tier.name} tier={tier} C={C} onSelect={finish} />
              ))}
            </div>
            <div style={{
              fontSize: 7, color: C.text5, fontFamily: "var(--m)",
              letterSpacing: ".1em", textAlign: "center", marginTop: 16, lineHeight: 1.6,
            }}>
              ALL PLANS INCLUDE 14-DAY FREE TRIAL · CANCEL ANYTIME
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
