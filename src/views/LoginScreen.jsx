import { useState, useEffect } from "react";
import { Button } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setStage(1), 100), setTimeout(() => setStage(2), 500), setTimeout(() => setStage(3), 1000), setTimeout(() => setStage(4), 1400), setTimeout(() => setStage(5), 1800)];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`, animation: "orbFloat 6s ease-in-out infinite", pointerEvents: "none", opacity: stage >= 1 ? 1 : 0, transition: "opacity 1s" }} />
      <div style={{ position: "absolute", top: "55%", left: "35%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 70%)`, animation: "orbFloat2 8s ease-in-out infinite", pointerEvents: "none", opacity: stage >= 1 ? 1 : 0, transition: "opacity 1.5s" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 80, fontWeight: 900, fontFamily: "var(--d)", background: C.gradient, backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: `drop-shadow(0 0 40px ${C.accent030})`, opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", animation: stage >= 2 ? "goldShimmer 4s ease-in-out infinite" : "none", marginBottom: 12 }}>F</div>
        <div style={{ fontSize: 38, fontWeight: 800, fontFamily: "var(--d)", color: C.text1, letterSpacing: ".12em", opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s ease", marginBottom: 4 }}>FORGE</div>
        <div style={{ height: 1, background: C.dividerGrad, margin: "16px auto", width: stage >= 3 ? 60 : 0, opacity: stage >= 3 ? 1 : 0, transition: "all 0.6s ease" }} />
        <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".3em", opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? "translateY(0)" : "translateY(8px)", transition: "all 0.5s ease", marginBottom: 40 }}>PERFORMANCE SYSTEM</div>
        <div style={{ fontSize: 13, color: C.text3, lineHeight: 1.8, maxWidth: 280, margin: "0 auto 36px", fontFamily: "var(--m)", opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? "translateY(0)" : "translateY(8px)", transition: "all 0.5s ease 0.1s" }}>Your complete AI-powered fitness command center.</div>
        <div style={{ opacity: stage >= 5 ? 1 : 0, transform: stage >= 5 ? "translateY(0)" : "translateY(12px)", transition: "all 0.5s ease" }}>
          <Button C={C} onClick={() => { storage.set("lg", true); onLogin(); }} style={{ maxWidth: 280, margin: "0 auto" }}>ENTER FORGE</Button>
        </div>
        <div style={{ fontSize: 8, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".16em", marginTop: 48, opacity: stage >= 5 ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>BUILT FOR PERFORMANCE</div>
      </div>
    </div>
  );
}
