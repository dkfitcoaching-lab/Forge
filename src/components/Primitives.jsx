// ══════════════════════════════════════════════════════════════
// FORGE PRIMITIVES — Princess-Grade Components
// Structural cool-neutral borders/glass for depth
// Accent colors ONLY for interactive highlights + glows
// ══════════════════════════════════════════════════════════════

export function StaggerItem({ children, index, visible }) {
  const shown = visible.includes(index);
  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0) translateZ(0)" : "translateY(18px) translateZ(0)",
        transition: "opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        willChange: shown ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, C, style, onClick, glow, accentGlow, edgeAccent, ...props }) {
  return (
    <div
      className={onClick ? "forge-card-interactive" : undefined}
      onClick={onClick}
      style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorder}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .25s ease, box-shadow .25s ease, transform .15s ease",
        boxShadow: C.cardShadow,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        ...(accentGlow ? { animation: "accentBreathe 5s ease-in-out infinite" } : {}),
        ...(glow && !accentGlow ? { animation: "neonBreathe 4s ease-in-out infinite" } : {}),
        ...style,
      }}
      {...props}
    >
      {/* Top edge accent line — luxury glass edge lighting effect */}
      {edgeAccent && (
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: C.dividerGrad,
          opacity: 0.6,
        }} />
      )}
      {/* Inner top highlight — simulates light hitting glass */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
        opacity: 0.5,
      }} />
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
            ? C.structGlass
            : C.gradientBtn,
        backgroundSize: isPrimary ? "300% 100%" : undefined,
        border: isDanger
          ? `1.5px solid ${C.danger}30`
          : isGhost
            ? `1.5px solid ${C.structBorderHover}`
            : `1.5px solid ${C.accent030}`,
        borderRadius: 8,
        color: isDanger ? C.danger : isGhost ? C.text2 : C.btnText,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--m)",
        letterSpacing: ".12em",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
        animation: isPrimary && !disabled ? "shimmerSlow 8s ease-in-out infinite" : "none",
        boxShadow: isPrimary
          ? `0 0 16px ${C.accent020}, 0 0 40px ${C.accent008}, inset 0 1px 0 rgba(255,255,255,0.06)`
          : "none",
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
        fontSize: 9,
        fontWeight: 700,
        color: C.accent,
        letterSpacing: ".2em",
        fontFamily: "var(--m)",
        marginBottom: 12,
        textTransform: "uppercase",
        lineHeight: 1.4,
        display: "flex",
        alignItems: "center",
        gap: 8,
        textShadow: `0 0 24px ${C.accent040}, 0 0 48px ${C.accent015}`,
        ...style,
      }}
    >
      <div style={{
        width: 12, height: 1.5,
        background: C.gradient, backgroundSize: "300% 100%",
        animation: "shimmerSlow 8s ease-in-out infinite",
        borderRadius: 1,
        flexShrink: 0,
        boxShadow: `0 0 6px ${C.accent030}`,
      }} />
      {children}
    </div>
  );
}

export function SectionDivider({ C, style }) {
  return (
    <div style={{ margin: "28px 0", position: "relative", ...style }}>
      <div style={{
        height: 1,
        background: C.dividerGrad,
        boxShadow: `0 0 12px ${C.accent015}, 0 0 24px ${C.accent005}`,
      }} />
      {/* Center diamond accent */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%) rotate(45deg)",
        width: 5, height: 5,
        background: C.accent,
        boxShadow: `0 0 8px ${C.accent040}`,
        opacity: 0.5,
      }} />
    </div>
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
          background: C.structBorderHover,
        }} />
        {/* Fill */}
        <div style={{
          position: "absolute", left: 0, height: 4, borderRadius: 2,
          width: `${pct}%`,
          background: C.gradient,
          backgroundSize: "300% 100%",
          transition: "width 0.1s ease",
          boxShadow: `0 0 8px ${C.accent020}`,
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
        {/* Neural/AI brain icon — matches CoachFAB */}
        <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6l-.8.6V18h-6v-2.4l-.8-.6A7 7 0 0 1 12 2z" />
        <line x1="9" y1="18" x2="15" y2="18" />
        <line x1="10" y1="21" x2="14" y2="21" />
        <circle cx="10" cy="9" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="9" r="0.8" fill="currentColor" stroke="none" />
        <path d="M10 9l2 2 2-2" strokeWidth="1" />
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

// ─── PERIODIC TABLE LOGO ─────────────────────────────────────
// Supports dynamic client initials via `clientInitial` prop
// Default shows "Fe" (Iron = Forge). Pass clientInitial="D" for a client named "Derek", etc.
export function ForgeLogo({ C, size = "md", clientInitial, clientName }) {
  const s = size === "lg" ? { box: 72, fe: 28, num: 8, name: 6, pad: "6px 10px", radius: 14 }
    : size === "sm" ? { box: 36, fe: 14, num: 5, name: 4, pad: "2px 5px", radius: 6 }
    : { box: 48, fe: 18, num: 6, name: 5, pad: "3px 7px", radius: 10 };

  const symbol = clientInitial || "Fe";
  const label = clientName || "FORGE";
  const atomicNum = clientInitial ? "" : "26";

  return (
    <div style={{
      width: s.box, height: s.box,
      border: `1.5px solid ${C.structBorderStrong}`,
      borderRadius: s.radius,
      background: `linear-gradient(145deg, ${C.structGlass}, rgba(180,195,210,0.06))`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
      boxShadow: `0 0 24px ${C.accent020}, 0 0 48px ${C.accent008}, ${C.cardShadow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
      padding: s.pad,
      overflow: "hidden",
    }}>
      {/* Inner glass highlight */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
        borderRadius: `${s.radius}px ${s.radius}px 0 0`,
        pointerEvents: "none",
      }} />
      {atomicNum && <div style={{
        position: "absolute", top: 3, left: 5,
        fontSize: s.num, color: C.text3,
        fontFamily: "var(--m)", fontWeight: 500, lineHeight: 1,
      }}>{atomicNum}</div>}
      <div style={{
        fontSize: s.fe, fontWeight: 800, fontFamily: "var(--d)",
        background: C.gradient, backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        animation: "goldShimmer 10s ease-in-out infinite",
        filter: `drop-shadow(0 0 16px ${C.accent030})`,
        lineHeight: 1.1, marginTop: size === "lg" ? 4 : 2,
      }}>{symbol}</div>
      <div style={{
        fontSize: s.name, color: C.text3,
        fontFamily: "var(--m)", fontWeight: 600,
        letterSpacing: ".12em", lineHeight: 1,
        marginTop: 1,
      }}>{label}</div>
    </div>
  );
}

// ─── FORGE WORDMARK ─────────────────────────────────────────
// "FORGE" with the F and E subtly highlighted in accent gradient
// Fe = Iron (atomic number 26) — the periodic table connection made visible
export function ForgeTitle({ C, size = 18 }) {
  const accentLetter = {
    background: C.gradient, backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    animation: "goldShimmer 10s ease-in-out infinite",
    filter: `drop-shadow(0 0 12px ${C.accent020})`,
  };
  return (
    <span style={{ fontSize: size, fontWeight: 800, fontFamily: "var(--d)", letterSpacing: ".1em", lineHeight: 1 }}>
      <span style={accentLetter}>F</span>
      <span style={{ color: C.text1, textShadow: `0 0 20px ${C.accent008}` }}>OR</span>
      <span style={{ color: C.text2, textShadow: `0 0 20px ${C.accent008}` }}>G</span>
      <span style={accentLetter}>E</span>
    </span>
  );
}

// ─── TOAST ───────────────────────────────────────────────────
export function Toast({ message, C }) {
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      background: C.cardGradient,
      color: C.accentBright,
      border: `1px solid ${C.structBorderStrong}`,
      fontFamily: "var(--m)", fontSize: 11, fontWeight: 700,
      padding: "11px 28px", borderRadius: 10, zIndex: 1000,
      animation: "toastIn .3s ease",
      boxShadow: `0 8px 32px rgba(0,0,0,.5), 0 0 20px ${C.accent010}`,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
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
        border: `1.5px solid ${C.structBorderStrong}`,
        borderRadius: 16, padding: 28, maxWidth: 340, width: "100%",
        animation: "modalIn .25s ease",
        boxShadow: `0 20px 60px rgba(0,0,0,.5), ${C.neonShadow}`,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
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
