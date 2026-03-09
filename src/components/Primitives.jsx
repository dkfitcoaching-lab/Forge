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

export function Card({ children, C, style, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(145deg, ${C.card}, ${C.bg})`,
        border: `1px solid ${C.border2}`,
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.2s",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, C, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 14,
        background: C.gradient,
        backgroundSize: "300% 100%",
        border: "none",
        borderRadius: 12,
        color: C.bg,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "var(--m)",
        letterSpacing: ".14em",
        cursor: "pointer",
        transition: "all 0.3s",
        animation: "shimmer 4s linear infinite",
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
        marginBottom: 10,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function RatingInput({ label, value, onChange, C }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: C.text4,
          fontFamily: "var(--m)",
          letterSpacing: ".12em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              flex: 1,
              padding: "8px 0",
              background: value >= n ? `${C.accent}20` : `${C.accent}08`,
              border: `1px solid ${value >= n ? C.accent : C.border2}`,
              borderRadius: 8,
              color: value >= n ? C.accent : C.text4,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NavIcons() {
  return {
    today: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    data: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    profile: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };
}
