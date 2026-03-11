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
        padding: 20,
        marginBottom: 14,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .25s ease, box-shadow .25s ease, transform .15s ease",
        boxShadow: C.cardShadow,
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
        opacity: 0.8,
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
        borderRadius: 10,
        color: isDanger ? C.danger : isGhost ? C.text2 : C.btnText,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--m)",
        letterSpacing: ".12em",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.2s",
        animation: "none",
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
        fontSize: 10,
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

export function SliderInput({ label, value, onChange, min = 1, max = 10, C, icon, lowLabel, highLabel, desc }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: desc ? 2 : 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon && <span style={{ fontSize: 14, filter: `drop-shadow(0 0 4px ${C.accent030})` }}>{icon}</span>}
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em" }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--m)" }}>
          {value}
        </span>
      </div>
      {desc && <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginBottom: 8 }}>{desc}</div>}
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
      {/* Scale labels */}
      {(lowLabel || highLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, padding: "0 2px" }}>
          <span style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".04em" }}>{lowLabel || ""}</span>
          <span style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".04em" }}>{highLabel || ""}</span>
        </div>
      )}
    </div>
  );
}

// Legacy compatibility
export function RatingInput({ label, value, onChange, C }) {
  return <SliderInput label={label} value={value || 3} onChange={onChange} min={1} max={5} C={C} />;
}

// ─── SVG NAV ICONS ───────────────────────────────────────────
// Minimal, geometric, premium. 1.5px stroke, 22px canvas.
// No clutter. Instant recognition at small size.
export function NavIcons() {
  return {
    // Today — compass/crosshair: your daily focus
    today: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    // Coach — AI chat bubble with sparkle: intelligent coaching
    coach: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M12 7v0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 11h6" />
        <path d="M10 14h4" />
      </svg>
    ),
    // Program — dumbbell: your training program
    program: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a2 2 0 013 0v11a2 2 0 01-3 0z" />
        <path d="M14.5 6.5a2 2 0 013 0v11a2 2 0 01-3 0z" />
        <line x1="9.5" y1="12" x2="14.5" y2="12" strokeWidth="2" />
        <line x1="4" y1="9" x2="6.5" y2="9" />
        <line x1="4" y1="15" x2="6.5" y2="15" />
        <line x1="17.5" y1="9" x2="20" y2="9" />
        <line x1="17.5" y1="15" x2="20" y2="15" />
      </svg>
    ),
    // Data — ascending trend with arrow
    data: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,18 9,13 13,15 20,6" />
        <polyline points="16,6 20,6 20,10" />
      </svg>
    ),
    // Profile — user silhouette
    profile: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    // Settings — three horizontal sliders
    settings: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <circle cx="8" cy="7" r="2" fill="currentColor" />
        <circle cx="16" cy="12" r="2" fill="currentColor" />
        <circle cx="11" cy="17" r="2" fill="currentColor" />
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
      border: `1.5px solid ${size === "sm" ? C.accent040 : C.accent030}`,
      borderRadius: s.radius,
      background: `linear-gradient(145deg, ${C.structGlass}, rgba(180,195,210,0.06))`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
      boxShadow: size === "sm"
        ? `0 0 6px ${C.accent020}, 0 0 14px ${C.accent008}, inset 0 1px 0 rgba(255,255,255,0.08)`
        : `0 0 14px ${C.accent020}, 0 0 32px ${C.accent008}, ${C.cardShadow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
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
        filter: size === "sm"
          ? `drop-shadow(0 0 4px ${C.accent030}) drop-shadow(0 0 10px ${C.accent015})`
          : `drop-shadow(0 0 12px ${C.accent030}) drop-shadow(0 0 28px ${C.accent015})`,
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
    filter: `drop-shadow(0 0 16px ${C.accent030}) drop-shadow(0 0 40px ${C.accent015})`,
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
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.text2, fontFamily: "var(--b)", lineHeight: 1.6, marginBottom: 24 }}>{message}</div>
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
