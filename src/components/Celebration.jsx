import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// FORGE CELEBRATION SYSTEM
// Particle effects for workout completion and PRs
// ══════════════════════════════════════════════════════════════

function Particle({ x, y, color, delay, size }) {
  const [style, setStyle] = useState({
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    opacity: 0,
    transform: "scale(0)",
    transition: `all ${0.6 + Math.random() * 0.4}s cubic-bezier(0.16, 1, 0.3, 1)`,
    pointerEvents: "none",
  });

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 160;
    const timer = setTimeout(() => {
      setStyle((s) => ({
        ...s,
        opacity: 1,
        transform: `scale(1) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
      }));
      setTimeout(() => {
        setStyle((s) => ({ ...s, opacity: 0, transform: `scale(0) translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px)` }));
      }, 400);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return <div style={style} />;
}

export function CelebrationBurst({ C, count = 40 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: "50%",
    y: "40%",
    color: [C.accent, C.accent2, C.accentVivid, C.ok, C.text1][i % 5],
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
        background: `linear-gradient(135deg, ${C.accent}20, ${C.accentVivid}10)`,
        border: `1px solid ${C.accent}40`,
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 8,
        animation: "fi 0.5s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: C.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          &#127942;
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: C.accent, letterSpacing: ".12em", fontFamily: "var(--m)" }}>
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
              background: i < filled ? C[color] || C.accent : `${C.accent}10`,
              transition: `all 0.3s ease ${i * 20}ms`,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C[color] || C.accent, fontFamily: "var(--m)" }}>
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
          fill={`${C.accent}${Math.round(30 + intensity * 40).toString(16)}`}
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
        <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>
          {streak}
        </div>
        <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>STREAK</div>
      </div>
    </div>
  );
}
