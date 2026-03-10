import { useState, useEffect } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 1800),
      setTimeout(() => setStage(5), 2400),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Atmospheric orbs */}
      <div style={{
        position: "absolute", top: "10%", left: "50%", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
        animation: "orbFloat 8s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 0.8 : 0, transition: "opacity 1.5s ease",
      }} />
      <div style={{
        position: "absolute", top: "55%", left: "25%", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
        animation: "orbFloat2 10s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 0.6 : 0, transition: "opacity 2s ease",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 340, width: "100%" }}>
        {/* Periodic Table Logo — generous spacing */}
        <div style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", justifyContent: "center", marginBottom: 40,
        }}>
          <ForgeLogo C={C} size="lg" />
        </div>

        {/* Title */}
        <div style={{
          fontSize: 38, fontWeight: 800, fontFamily: "var(--d)", color: C.text1,
          letterSpacing: ".14em",
          textShadow: `0 0 40px ${C.accent020}, 0 0 80px ${C.accent008}`,
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", marginBottom: 6,
        }}>
          FORGE
        </div>

        {/* Divider */}
        <div style={{
          height: 1, background: C.dividerGrad, margin: "20px auto 20px",
          width: stage >= 3 ? 80 : 0, opacity: stage >= 3 ? 1 : 0,
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 12px ${C.accent015}, 0 0 24px ${C.accent008}`,
        }} />

        {/* Subtitle */}
        <div style={{
          fontSize: 11, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".35em",
          fontWeight: 700, textTransform: "uppercase",
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", marginBottom: 52,
        }}>
          PERFORMANCE SYSTEM
        </div>

        {/* Description */}
        <div style={{
          fontSize: 14, color: C.text3, lineHeight: 1.9, fontFamily: "var(--b)",
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s", marginBottom: 48,
          maxWidth: 280, margin: "0 auto 48px",
        }}>
          AI-powered coaching, precision tracking, and intelligent programming — engineered for elite performance.
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <Button C={C} onClick={() => { storage.set("lg", true); onLogin(); }}>
            ENTER FORGE
          </Button>
        </div>

        {/* Footer */}
        <div style={{
          fontSize: 7, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".2em",
          marginTop: 64,
          opacity: stage >= 5 ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
        }}>
          BUILT FOR PERFORMANCE
        </div>
      </div>
    </div>
  );
}
