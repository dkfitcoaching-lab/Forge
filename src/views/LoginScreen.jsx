import { useState, useEffect } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setStage(1), 150),
      setTimeout(() => setStage(2), 500),
      setTimeout(() => setStage(3), 1000),
      setTimeout(() => setStage(4), 1600),
      setTimeout(() => setStage(5), 2200),
      setTimeout(() => setStage(6), 2800),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const features = [
    { label: "TRACK", desc: "Precision logging" },
    { label: "COACH", desc: "AI intelligence" },
    { label: "PERFORM", desc: "Elite results" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* ─── BACKGROUND LAYERS ─── */}

      {/* Primary atmosphere orb — large, slow */}
      <div className="forge-orb" style={{
        position: "absolute", top: "5%", left: "50%", width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, ${C.accent005} 30%, transparent 60%)`,
        animation: "orbFloat 10s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 0.9 : 0, transition: "opacity 2s ease",
        transform: "translateX(-50%)",
      }} />

      {/* Secondary orb — offset, secondary color */}
      <div className="forge-orb" style={{
        position: "absolute", top: "50%", left: "20%", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.secondary005} 0%, transparent 60%)`,
        animation: "orbFloat2 12s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 0.5 : 0, transition: "opacity 2.5s ease",
      }} />

      {/* Subtle vertical lines — architectural grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: stage >= 1 ? 0.03 : 0, transition: "opacity 3s ease",
        backgroundImage: `repeating-linear-gradient(90deg, ${C.text4} 0px, ${C.text4} 1px, transparent 1px, transparent 80px)`,
        backgroundPosition: "center",
      }} />

      {/* Horizontal accent line — architectural */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 5%, ${C.structBorder} 30%, ${C.structBorder} 70%, transparent 95%)`,
        opacity: stage >= 2 ? 0.15 : 0, transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />

      {/* ─── CONTENT ─── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 360, width: "100%" }}>

        {/* Version badge */}
        <div style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: 28,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 20,
            border: `1px solid ${C.structBorder}`,
            background: C.structGlass,
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, boxShadow: `0 0 6px ${C.accent040}` }} />
            <span style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".18em", fontWeight: 600 }}>V5 CINEMA</span>
          </div>
        </div>

        {/* Periodic Table Logo */}
        <div style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", justifyContent: "center", marginBottom: 36,
        }}>
          <ForgeLogo C={C} size="lg" />
        </div>

        {/* Title — gradient shimmer */}
        <div style={{
          fontSize: 42, fontWeight: 900, fontFamily: "var(--d)",
          letterSpacing: ".16em",
          background: C.gradient, backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          animation: stage >= 3 ? "goldShimmer 10s ease-in-out infinite" : "none",
          filter: `drop-shadow(0 0 30px ${C.accent015})`,
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: 8, lineHeight: 1.1,
        }}>
          FORGE
        </div>

        {/* Accent divider */}
        <div style={{
          height: 1.5, margin: "0 auto 18px",
          background: C.dividerGrad,
          boxShadow: `0 0 12px ${C.accent020}, 0 0 28px ${C.accent008}`,
          width: stage >= 3 ? 100 : 0,
          opacity: stage >= 3 ? 1 : 0,
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }} />

        {/* Subtitle */}
        <div style={{
          fontSize: 10, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".4em",
          fontWeight: 700, textTransform: "uppercase",
          textShadow: `0 0 20px ${C.accent030}`,
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", marginBottom: 40,
        }}>
          fitnessforge.ai
        </div>

        {/* Feature pillars — 3 columns */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
          marginBottom: 44,
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          {features.map(({ label, desc }, i) => (
            <div key={label} style={{
              padding: "16px 8px",
              background: C.structGlass,
              border: `1px solid ${C.structBorder}`,
              borderRadius: 12,
              position: "relative", overflow: "hidden",
              backdropFilter: "blur(8px)",
              opacity: stage >= 5 ? 1 : 0,
              transform: stage >= 5 ? "translateY(0)" : "translateY(8px)",
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 * i}s`,
            }}>
              {/* Top edge accent */}
              <div style={{
                position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
                background: i === 1 ? C.dividerGrad : `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
              }} />
              <div style={{
                fontSize: 10, fontWeight: 700, color: i === 1 ? C.accent : C.text2,
                fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 4,
                textShadow: i === 1 ? `0 0 12px ${C.accent030}` : "none",
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
          transform: stage >= 5 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s", marginBottom: 40,
          maxWidth: 300, margin: "0 auto 40px",
        }}>
          Intelligent coaching, precision tracking, and data-driven programming — engineered for those who train with purpose.
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: stage >= 6 ? 1 : 0,
          transform: stage >= 6 ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <Button C={C} onClick={() => { storage.set("lg", true); onLogin(); }}>
            ENTER FORGE
          </Button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 56,
          opacity: stage >= 6 ? 1 : 0, transition: "opacity 1s ease 0.3s",
        }}>
          <div style={{
            height: 1, width: 30, background: C.dividerGrad,
            margin: "0 auto 14px", opacity: 0.4,
          }} />
          <div style={{
            fontSize: 7, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".25em",
          }}>
            fitnessforge.ai
          </div>
        </div>
      </div>
    </div>
  );
}
