// ══════════════════════════════════════════════════════════════
// FORGE SVG CHART SYSTEM — Monochromatic, Theme-Respecting
// Pure SVG charts — no dependencies, infinite precision
// ══════════════════════════════════════════════════════════════

export function BarChart({ data, C, height = 140, label }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(28, (100 / data.length) * 0.7);
  const gap = (100 - barWidth * data.length) / (data.length + 1);

  return (
    <div>
      {label && (
        <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: ".16em", fontFamily: "var(--m)", marginBottom: 8 }}>
          {label}
        </div>
      )}
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="forgeBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accentVivid} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.accentDeep} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line key={pct} x1="0" y1={height - 14 - pct * (height - 24)} x2="100" y2={height - 14 - pct * (height - 24)} stroke={C.accent008} strokeWidth="0.3" />
        ))}
        {data.map((d, i) => {
          const barH = Math.max(4, (d.value / max) * (height - 24));
          const x = gap + i * (barWidth + gap);
          const y = height - 14 - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={4} fill="url(#forgeBarGrad)" style={{ filter: `drop-shadow(0 0 4px ${C.accent020})` }} />
              <text x={x + barWidth / 2} y={height - 3} textAnchor="middle" fontSize="5" fill={C.text4} fontFamily="var(--m)">
                {d.label}
              </text>
              {d.value > 0 && (
                <text x={x + barWidth / 2} y={y - 3} textAnchor="middle" fontSize="4.5" fill={C.text3} fontFamily="var(--m)" fontWeight="600">
                  {d.value >= 1000 ? `${Math.round(d.value / 1000)}k` : d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LineChart({ data, C, height = 120, label, unit = "" }) {
  if (!data || data.length < 2) return null;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padH = height - 20;
  const padW = 90;

  const points = data.map((d, i) => {
    const x = 8 + (i / (data.length - 1)) * padW;
    const y = 10 + padH - ((d.value - min) / range) * padH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaD = pathD + ` L${points[points.length - 1].x},${height - 10} L${points[0].x},${height - 10} Z`;

  return (
    <div>
      {label && (
        <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: ".16em", fontFamily: "var(--m)", marginBottom: 8 }}>
          {label}
        </div>
      )}
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="forgeAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = 10 + padH - pct * padH;
          const val = Math.round(min + pct * range);
          return (
            <g key={pct}>
              <line x1="8" y1={y} x2="98" y2={y} stroke={C.accent008} strokeWidth="0.3" />
              <text x="4" y={y + 1.5} fontSize="3.5" fill={C.text5} fontFamily="var(--m)" textAnchor="end">
                {val}
              </text>
            </g>
          );
        })}
        {/* Area fill */}
        <path d={areaD} fill="url(#forgeAreaGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${C.accent030})` }} />
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill={C.bg} stroke={C.accent} strokeWidth="0.8" />
            {(i === 0 || i === points.length - 1) && (
              <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize="4" fill={C.accent} fontFamily="var(--m)" fontWeight="600">
                {p.value}{unit}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function RadialProgress({ value, max, C, size = 80, label, sublabel }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke={C.accent010} strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r}
          fill="none" stroke={C.accent} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 0.8s ease", filter: `drop-shadow(0 0 6px ${C.accent030})` }}
        />
        <text x="40" y="37" textAnchor="middle" fontSize="16" fontWeight="700" fill={C.accent} fontFamily="var(--m)">
          {Math.round(pct * 100)}
        </text>
        <text x="40" y="47" textAnchor="middle" fontSize="5" fill={C.text4} fontFamily="var(--m)" letterSpacing="0.1em">
          {sublabel || "%"}
        </text>
      </svg>
      {label && (
        <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 4 }}>
          {label}
        </div>
      )}
    </div>
  );
}

export function MiniSparkline({ data, C, width = 60, height = 20 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MacroRing({ consumed, target, color, label, C, size = 56 }) {
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke={C.accent010} strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{ transition: "stroke-dashoffset 0.6s ease", filter: `drop-shadow(0 0 6px ${C.accent030})` }}
        />
        <text x="26" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={C.text1} fontFamily="var(--m)">
          {consumed}
        </text>
      </svg>
      <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
