import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// FORGE CELEBRATION SYSTEM
// Particle effects for workout completion and PRs
// GPU-accelerated with translate3d, consistent timing
// ══════════════════════════════════════════════════════════════

function Particle({ x, y, color, delay, size }) {
  const [phase, setPhase] = useState("init"); // init → in → out
  const angleRef = useState(() => Math.random() * Math.PI * 2)[0];
  const distRef = useState(() => 80 + Math.random() * 160)[0];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("in"), delay);
    const t2 = setTimeout(() => setPhase("out"), delay + 450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);

  const dx = Math.cos(angleRef) * distRef;
  const dy = Math.sin(angleRef) * distRef;

  const transforms = {
    init: "scale(0) translate3d(0, 0, 0)",
    in: `scale(1) translate3d(${dx}px, ${dy}px, 0)`,
    out: `scale(0) translate3d(${dx * 1.5}px, ${dy * 1.5}px, 0)`,
  };

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      opacity: phase === "in" ? 1 : 0,
      transform: transforms[phase],
      transition: `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      pointerEvents: "none",
      willChange: "transform, opacity",
    }} />
  );
}

export function CelebrationBurst({ C, count = 30 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: "50%",
    y: "40%",
    color: [C.accent, C.accentDark, C.accentVivid, C.secondary, C.text1][i % 5],
    delay: i * 25,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  );
}

export function PRBadge({ pr, C }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${C.accent020}, ${C.accent008})`,
        border: `1px solid ${C.accent040}`,
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 8,
        animation: "fadeIn 0.5s ease",
        boxShadow: `0 0 16px ${C.accent015}, 0 4px 16px rgba(0,0,0,0.2)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: C.gradient,
            backgroundSize: "300% 100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 12px ${C.accent020}`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.btnText} strokeWidth="2" strokeLinecap="round">
            <path d="M12 15l-3 5h6l-3-5z" /><circle cx="12" cy="8" r="6" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: ".12em", fontFamily: "var(--m)" }}>
            NEW {pr.type} PR
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, marginTop: 2 }}>
            {pr.exercise}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>
            {pr.value}
          </div>
          <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>
            prev: {pr.prev}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadinessGauge({ score, label, color, C }) {
  const segments = 20;
  const filled = Math.round((score / 100) * segments);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 8 }}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: i < filled ? 16 + (i / segments) * 8 : 8,
              borderRadius: 2,
              background: i < filled ? C[color] || C.accent : C.accent010,
              transition: `height 0.3s ease ${i * 20}ms, background 0.3s ease ${i * 20}ms`,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C[color] || C.accent, fontFamily: "var(--m)", textShadow: `0 0 20px ${C.accent030}` }}>
        {score}%
      </div>
      <div style={{ fontSize: 8, fontWeight: 700, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".16em", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

export function StreakFlame({ streak, C }) {
  if (streak <= 0) return null;

  const intensity = Math.min(streak / 10, 1);
  const flameSize = 20 + intensity * 20;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width={flameSize} height={flameSize} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.5 8 4 12 4 15a8 8 0 0016 0c0-3-2.5-7-8-13z"
          fill={C.accent030}
          stroke={C.accent}
          strokeWidth="1"
        />
        <path
          d="M12 9c-2 3-3 5-3 7a3 3 0 006 0c0-2-1-4-3-7z"
          fill={C.accentVivid}
          opacity={0.6 + intensity * 0.4}
        />
      </svg>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 16px ${C.accent030}` }}>
          {streak}
        </div>
        <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>STREAK</div>
      </div>
    </div>
  );
}
