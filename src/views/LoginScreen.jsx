import { useState, useEffect } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 400),
      setTimeout(() => setStage(3), 900),
      setTimeout(() => setStage(4), 1300),
      setTimeout(() => setStage(5), 1700),
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
        position: "absolute", top: "15%", left: "50%", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
        animation: "orbFloat 6s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 1 : 0, transition: "opacity 1s",
      }} />
      <div style={{
        position: "absolute", top: "55%", left: "30%", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
        animation: "orbFloat2 8s ease-in-out infinite", pointerEvents: "none",
        opacity: stage >= 1 ? 1 : 0, transition: "opacity 1.5s",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 320, width: "100%" }}>
        {/* Periodic Table Logo */}
        <div style={{
          opacity: stage >= 2 ? 1 : 0,
          transform: stage >= 2 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", justifyContent: "center", marginBottom: 24,
        }}>
          <ForgeLogo C={C} size="lg" />
        </div>

        {/* Title */}
        <div style={{
          fontSize: 36, fontWeight: 800, fontFamily: "var(--d)", color: C.text1,
          letterSpacing: ".12em",
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.6s ease", marginBottom: 4,
        }}>
          FORGE
        </div>

        {/* Divider */}
        <div style={{
          height: 1.5, background: C.dividerGrad, margin: "16px auto",
          width: stage >= 3 ? 60 : 0, opacity: stage >= 3 ? 1 : 0,
          transition: "all 0.6s ease",
          boxShadow: `0 0 8px ${C.accent010}`,
        }} />

        {/* Subtitle */}
        <div style={{
          fontSize: 9, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".3em",
          fontWeight: 700, textTransform: "uppercase",
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.5s ease", marginBottom: 48,
        }}>
          PERFORMANCE SYSTEM
        </div>

        {/* Description */}
        <div style={{
          fontSize: 14, color: C.text3, lineHeight: 1.8, fontFamily: "var(--b)",
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.5s ease 0.1s", marginBottom: 40,
        }}>
          AI-powered coaching, precision tracking, and intelligent programming — engineered for elite performance.
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s ease",
        }}>
          <Button C={C} onClick={() => { storage.set("lg", true); onLogin(); }}>
            ENTER FORGE
          </Button>
        </div>

        {/* Footer */}
        <div style={{
          fontSize: 8, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".16em",
          marginTop: 56,
          opacity: stage >= 5 ? 1 : 0, transition: "opacity 0.5s ease 0.2s",
        }}>
          BUILT FOR PERFORMANCE
        </div>
      </div>
    </div>
  );
}
