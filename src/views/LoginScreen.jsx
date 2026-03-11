import { useState, useEffect } from "react";
import { Button, ForgeLogo, ForgeTitle } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    // Cinematic timing — each beat lands with purpose
    const t = [
      setTimeout(() => setStage(1), 50),    // bg atmosphere (instant, subtle)
      setTimeout(() => setStage(2), 300),    // logo materializes
      setTimeout(() => setStage(3), 1100),   // title + divider (logo has settled)
      setTimeout(() => setStage(4), 1800),   // subtitle + pillars
      setTimeout(() => setStage(5), 2400),   // description
      setTimeout(() => setStage(6), 3000),   // CTA
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const features = [
    { label: "YOUR DATA", desc: "Adapts to you" },
    { label: "24 / 7", desc: "Always available" },
    { label: "FROM $15", desc: "Per month" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* ─── BACKGROUND — layered depth ─── */}

      {/* Deep base glow — emerges from center like a furnace */}
      <div style={{
        position: "absolute", top: "40%", left: "50%", width: 1000, height: 1000, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent010} 0%, ${C.accent005} 20%, transparent 50%)`,
        transform: "translate(-50%, -50%)",
        opacity: stage >= 1 ? 1 : 0,
        transition: "opacity 3s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
      }} />

      {/* Secondary atmosphere — offset warm glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, transparent 60%)`,
        transform: "translate(-50%, -50%)",
        opacity: stage >= 2 ? 0.8 : 0,
        transition: "opacity 2.5s cubic-bezier(0.16,1,0.3,1)",
        animation: stage >= 2 ? "loginOrbBreathe 8s ease-in-out infinite" : "none",
        pointerEvents: "none",
      }} />

      {/* Noise/grain texture overlay for depth */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      {/* Vertical light beam — centered behind logo */}
      <div style={{
        position: "absolute", top: 0, left: "50%", width: 1, height: "100%",
        background: `linear-gradient(180deg, transparent 10%, ${C.accent008} 35%, ${C.accent015} 50%, ${C.accent008} 65%, transparent 90%)`,
        transform: "translateX(-50%)",
        opacity: stage >= 2 ? 1 : 0,
        transition: "opacity 2s cubic-bezier(0.16,1,0.3,1) 0.3s",
        pointerEvents: "none",
      }} />

      {/* Horizontal accent line — appears with logo */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 15%, ${C.accent005} 40%, ${C.accent008} 50%, ${C.accent005} 60%, transparent 85%)`,
        opacity: stage >= 3 ? 1 : 0,
        transition: "opacity 2s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
      }} />

      {/* ─── CONTENT ─── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 360, width: "100%" }}>

        {/* Version badge */}
        <div style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
          marginBottom: 28,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 20,
            border: `1px solid ${C.structBorder}`,
            background: C.structGlass,
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
            <span style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".18em", fontWeight: 600 }}>V5 CINEMA</span>
          </div>
        </div>

        {/* Periodic Table Logo — materializes with glow bloom */}
        <div style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "scale(1)" : "scale(0.85)",
          filter: stage >= 2 ? "blur(0px)" : "blur(12px)",
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1), filter 1.4s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", justifyContent: "center", marginBottom: 36,
          position: "relative",
        }}>
          {/* Glow bloom behind logo */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", width: 140, height: 140,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent020} 0%, ${C.accent008} 40%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            opacity: stage >= 2 ? 1 : 0,
            transition: "opacity 1.5s ease 0.3s",
            animation: stage >= 3 ? "loginGlowPulse 4s ease-in-out infinite" : "none",
            pointerEvents: "none",
          }} />
          <ForgeLogo C={C} size="lg" />
        </div>

        {/* Title — ForgeTitle with Fe highlight */}
        <div style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(8px)",
          filter: stage >= 3 ? "blur(0px)" : "blur(4px)",
          transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), filter 1s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: 8, lineHeight: 1.1,
          letterSpacing: ".16em",
        }}>
          <ForgeTitle C={C} size={42} />
        </div>

        {/* Accent divider — grows from center with energy */}
        <div style={{
          height: 2, margin: "0 auto 18px",
          background: C.dividerGrad,
          boxShadow: `0 0 16px ${C.accent030}, 0 0 40px ${C.accent015}`,
          width: stage >= 3 ? 120 : 0,
          opacity: stage >= 3 ? 1 : 0,
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s, opacity 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }} />

        {/* Subtitle — FITNESSFORGE.AI with neon glow */}
        <div style={{
          fontSize: 10, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".4em",
          fontWeight: 700, textTransform: "uppercase",
          textShadow: `0 0 20px ${C.accent040}, 0 0 60px ${C.accent020}`,
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: 40,
          animation: stage >= 4 ? "loginTextGlow 4s ease-in-out infinite 1s" : "none",
        }}>
          fitnessforge.ai
        </div>

        {/* Feature pillars — 3 columns, stagger in */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
          marginBottom: 40,
        }}>
          {features.map(({ label, desc }, i) => (
            <div key={label} style={{
              padding: "16px 8px",
              background: C.structGlass,
              border: `1px solid ${C.structBorder}`,
              borderRadius: 12,
              position: "relative", overflow: "hidden",
              backdropFilter: "blur(8px)",
              opacity: stage >= 4 ? 1 : 0,
              transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 * i}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 * i}s`,
            }}>
              {/* Top edge accent */}
              <div style={{
                position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                background: i === 1 ? C.dividerGrad : `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
                boxShadow: i === 1 ? `0 0 8px ${C.accent020}` : "none",
              }} />
              <div style={{
                fontSize: 10, fontWeight: 700, color: i === 1 ? C.accent : C.text2,
                fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 4,
                textShadow: i === 1 ? `0 0 16px ${C.accent040}` : "none",
              }}>{label}</div>
              <div style={{
                fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em",
              }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 13, color: C.text3, lineHeight: 2, fontFamily: "var(--b)",
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          maxWidth: 300, margin: "0 auto 40px",
        }}>
          The same coaching intelligence that drives elite results — adapted to your body, your goals, and your response to training. Available 24/7.
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: stage >= 6 ? 1 : 0,
          transform: stage >= 6 ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <Button C={C} onClick={() => { storage.set("lg", true); onLogin(); }}>
            ENTER FORGE
          </Button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 56,
          opacity: stage >= 6 ? 1 : 0, transition: "opacity 1.5s ease 0.4s",
        }}>
          <div style={{
            height: 1, width: 30, background: C.dividerGrad,
            margin: "0 auto 14px", opacity: 0.4,
            boxShadow: `0 0 8px ${C.accent015}`,
          }} />
          <div style={{
            fontSize: 7, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".25em",
          }}>
            fitnessforge.ai
          </div>
        </div>
      </div>

      {/* Inline keyframes for login-specific animations */}
      <style>{`
        @keyframes loginOrbBreathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
        }
        @keyframes loginGlowPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes loginTextGlow {
          0%, 100% { text-shadow: 0 0 20px ${C.accent040}, 0 0 60px ${C.accent020}; }
          50% { text-shadow: 0 0 30px ${C.accent060}, 0 0 80px ${C.accent030}, 0 0 120px ${C.accent015}; }
        }
      `}</style>
    </div>
  );
}
