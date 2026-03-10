// ══════════════════════════════════════════════════════════════
// FORGE PRIMITIVES — Princess-Grade Components
// Every component: luxury borders, breathing glows, proper touch
// ══════════════════════════════════════════════════════════════

export function StaggerItem({ children, index, visible }) {
  const shown = visible.includes(index);
  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(18px)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, C, style, onClick, glow, ...props }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.cardGradient,
        border: `1.5px solid ${C.border2}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .25s, box-shadow .25s, transform .15s",
        boxShadow: C.cardShadow,
        ...(glow ? { animation: "neonBreathe 4s ease-in-out infinite" } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, C, style, variant = "primary", disabled }) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const isGhost = variant === "ghost";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "14px 18px",
        background: isDanger
          ? `${C.danger}08`
          : isGhost
            ? C.glass
            : C.gradientBtn,
        backgroundSize: isPrimary ? "300% 100%" : undefined,
        border: isDanger
          ? `1.5px solid ${C.danger}30`
          : isGhost
            ? `1.5px solid ${C.border2}`
            : "none",
        borderRadius: 8,
        color: isDanger ? C.danger : isGhost ? C.accent : C.btnText,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--m)",
        letterSpacing: ".12em",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
        animation: isPrimary && !disabled ? "shimmer 3s ease-in-out infinite" : "none",
        boxShadow: isPrimary ? `0 4px 24px ${C.accent030}` : "none",
        textTransform: "uppercase",
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
        minHeight: 44,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Label({ children, C, style }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: C.accent,
        letterSpacing: ".18em",
        fontFamily: "var(--m)",
        marginBottom: 12,
        textTransform: "uppercase",
        lineHeight: 1.4,
        textShadow: `0 0 20px ${C.accent020}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionDivider({ C, style }) {
  return (
    <div
      style={{
        height: 1,
        background: C.dividerGrad,
        margin: "28px 0",
        ...style,
      }}
    />
  );
}

export function SliderInput({ label, value, onChange, min = 1, max = 10, C, icon }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span style={{ fontSize: 14, filter: `drop-shadow(0 0 4px ${C.accent030})` }}>{icon}</span>}
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em" }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text1, fontFamily: "var(--m)" }}>
          {value}
        </span>
      </div>
      <div
        style={{ position: "relative", height: 44, display: "flex", alignItems: "center", touchAction: "none" }}
        onPointerDown={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          const update = (clientX) => {
            const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newVal = Math.round(min + x * (max - min));
            if (newVal !== value) onChange(newVal);
          };
          update(e.clientX);
          const onMove = (ev) => update(ev.clientX);
          const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        }}
      >
        {/* Track */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2,
          background: C.accent010,
        }} />
        {/* Fill */}
        <div style={{
          position: "absolute", left: 0, height: 4, borderRadius: 2,
          width: `${pct}%`,
          background: C.gradient,
          backgroundSize: "300% 100%",
          transition: "width 0.1s ease",
        }} />
        {/* Thumb */}
        <div style={{
          position: "absolute",
          left: `${pct}%`,
          transform: "translateX(-50%)",
          width: 22, height: 22, borderRadius: 11,
          background: C.accent,
          boxShadow: `0 0 12px ${C.accent040}, 0 2px 8px rgba(0,0,0,0.3)`,
          transition: "left 0.1s ease",
          border: `2px solid ${C.text1}`,
        }} />
      </div>
    </div>
  );
}

// Legacy compatibility
export function RatingInput({ label, value, onChange, C }) {
  return <SliderInput label={label} value={value || 3} onChange={onChange} min={1} max={5} C={C} />;
}

// ─── SVG NAV ICONS ───────────────────────────────────────────
export function NavIcons() {
  return {
    today: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    program: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a3.5 3.5 0 1 1 0 7h11a3.5 3.5 0 1 1 0-7" />
        <line x1="6.5" y1="10" x2="17.5" y2="10" />
        <line x1="4" y1="4" x2="4" y2="16" /><line x1="20" y1="4" x2="20" y2="16" />
        <line x1="2" y1="4" x2="6" y2="4" /><line x1="2" y1="16" x2="6" y2="16" />
        <line x1="18" y1="4" x2="22" y2="4" /><line x1="18" y1="16" x2="22" y2="16" />
      </svg>
    ),
    coach: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6l-.8.6V18h-6v-2.4l-.8-.6A7 7 0 0 1 12 2z" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="21" x2="14" y2="21" />
      </svg>
    ),
    data: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    settings: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  };
}

// ─── TOAST ───────────────────────────────────────────────────
export function Toast({ message, C }) {
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      background: C.cardGradient,
      color: C.accentBright,
      border: `1px solid ${C.border3}`,
      fontFamily: "var(--m)", fontSize: 11, fontWeight: 700,
      padding: "11px 28px", borderRadius: 10, zIndex: 1000,
      animation: "toastIn .3s ease",
      boxShadow: `0 8px 32px rgba(0,0,0,.5), 0 0 20px ${C.accent010}`,
      letterSpacing: ".08em", pointerEvents: "none", whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────
export function Modal({ title, message, actions, C, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "backdropIn .2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.cardGradient,
        border: `1.5px solid ${C.border3}`,
        borderRadius: 16, padding: 28, maxWidth: 340, width: "100%",
        animation: "modalIn .25s ease",
        boxShadow: `0 20px 60px rgba(0,0,0,.5), 0 0 30px ${C.accent008}`,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.text3, fontFamily: "var(--b)", lineHeight: 1.6, marginBottom: 24 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          {actions.map((action, i) => (
            <Button key={i} C={C} onClick={action.onClick} variant={action.variant || "primary"} style={{ flex: 1 }}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
