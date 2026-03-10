// ══════════════════════════════════════════════════════════════
// FORGE THEME SYSTEM — 8 ACCENTS × 5 SURFACES = 40 COMBINATIONS
// Princess-grade luxury color engineering
// Structural colors (borders, glass) are FIXED cool-neutral
// Accent colors are ONLY for highlights, glows, interactive states
// ══════════════════════════════════════════════════════════════

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── 8 ACCENT PALETTES ──────────────────────────────────────
const ACCENTS = {
  platinum: {
    id: 'platinum', name: 'Platinum',
    accent: '#90A4AE', accentDark: '#546E7A', accentDeep: '#455A64',
    accentVivid: '#CFD8DC', accentBright: '#ECEFF1',
    secondary: '#4ecdc4',
    ok: '#78c878', warn: '#C06070', danger: '#C06070',
    gradient: 'linear-gradient(135deg, #455A64, #90A4AE, #ECEFF1, #90A4AE, #455A64)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  forge: {
    id: 'forge', name: 'Forge',
    accent: '#5ce0d0', accentDark: '#40b8a8', accentDeep: '#1a7868',
    accentVivid: '#7EFFF0', accentBright: '#B0FFF5',
    secondary: '#7eb8ff',
    ok: '#5ce0d0', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #1a7868, #40b8a8, #7EFFF0, #40b8a8, #1a7868)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.12), rgba(220,230,240,0.18), rgba(200,215,225,0.12))',
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian',
    accent: '#a78bfa', accentDark: '#8b6ff0', accentDeep: '#5b3fc4',
    accentVivid: '#c4b5fd', accentBright: '#e0d4ff',
    secondary: '#4ecdc4',
    ok: '#a78bfa', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #5b3fc4, #8b6ff0, #c4b5fd, #8b6ff0, #5b3fc4)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  ember: {
    id: 'ember', name: 'Ember',
    accent: '#ff8c42', accentDark: '#e0762e', accentDeep: '#a04e10',
    accentVivid: '#ffb366', accentBright: '#ffd4a8',
    secondary: '#4ecdc4',
    ok: '#78c878', warn: '#ff4444', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #a04e10, #e0762e, #ffb366, #e0762e, #a04e10)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  arctic: {
    id: 'arctic', name: 'Arctic',
    accent: '#64b5f6', accentDark: '#42a5f5', accentDeep: '#1565c0',
    accentVivid: '#90caf9', accentBright: '#bbdefb',
    secondary: '#48d9a4',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #1565c0, #42a5f5, #90caf9, #42a5f5, #1565c0)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  crimson: {
    id: 'crimson', name: 'Crimson',
    accent: '#ef5350', accentDark: '#e53935', accentDeep: '#b71c1c',
    accentVivid: '#ff8a80', accentBright: '#ffcdd2',
    secondary: '#4ecdc4',
    ok: '#78c878', warn: '#ffab40', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #b71c1c, #e53935, #ff8a80, #e53935, #b71c1c)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  gold: {
    id: 'gold', name: 'Gold',
    accent: '#ffd54f', accentDark: '#ffca28', accentDeep: '#f9a825',
    accentVivid: '#ffe082', accentBright: '#fff8e1',
    secondary: '#4ecdc4',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #f9a825, #ffca28, #ffe082, #ffca28, #f9a825)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
  rose: {
    id: 'rose', name: 'Rose',
    accent: '#f48fb1', accentDark: '#ec407a', accentDeep: '#c2185b',
    accentVivid: '#f8bbd0', accentBright: '#fce4ec',
    secondary: '#4ecdc4',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #c2185b, #ec407a, #f8bbd0, #ec407a, #c2185b)',
    gradientBtn: 'linear-gradient(135deg, rgba(200,215,225,0.10), rgba(220,230,240,0.16), rgba(200,215,225,0.10))',
  },
};

// ─── 5 BACKGROUND SURFACES ──────────────────────────────────
const SURFACES = {
  void: {
    id: 'void', name: 'Void',
    bg: '#020202', bg2: '#050506', card: '#0a0a0c', cardHover: '#111114',
    text1: '#E8ECF0', text2: '#C8CDD2', text3: '#788090', text4: '#4A5568', text5: '#2D3748',
    isLight: false,
  },
  carbon: {
    id: 'carbon', name: 'Carbon',
    bg: '#060610', bg2: '#0a0a18', card: '#0e0e1a', cardHover: '#141422',
    text1: '#E8ECF4', text2: '#B8C0D0', text3: '#707890', text4: '#445068', text5: '#2A3448',
    isLight: false,
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian',
    bg: '#0a0a0e', bg2: '#0e0e14', card: '#121218', cardHover: '#18181f',
    text1: '#F0F0F5', text2: '#C0C0CC', text3: '#808098', text4: '#50506a', text5: '#30304a',
    isLight: false,
  },
  slate: {
    id: 'slate', name: 'Slate',
    bg: '#14141c', bg2: '#1a1a24', card: '#1e1e28', cardHover: '#252530',
    text1: '#ECEEF2', text2: '#B8BCC8', text3: '#7A7E90', text4: '#505468', text5: '#363A4E',
    isLight: false,
  },
  ivory: {
    id: 'ivory', name: 'Ivory',
    bg: '#F2F2F6', bg2: '#E8E8EE', card: '#FFFFFF', cardHover: '#F8F8FC',
    text1: '#1a1a2e', text2: '#2d2d44', text3: '#5a5a78', text4: '#8888a0', text5: '#b0b0c4',
    isLight: true,
  },
};

export function getThemeColors(accentId, surfaceId) {
  const a = ACCENTS[accentId] || ACCENTS.platinum;
  const s = SURFACES[surfaceId] || SURFACES.void;

  // ─── STRUCTURAL COLORS (Princess-style: FIXED cool neutral, not accent-tinted) ───
  // These NEVER change with accent — they provide consistent cool sophistication
  const struct = s.isLight ? {
    structBorder: 'rgba(40,50,70,0.10)',
    structBorderHover: 'rgba(40,50,70,0.18)',
    structBorderStrong: 'rgba(40,50,70,0.28)',
    structGlass: 'rgba(40,50,70,0.04)',
    structGlassHover: 'rgba(40,50,70,0.07)',
    structInset: 'rgba(255,255,255,0.5)',
    structShadowTint: 'rgba(40,50,70,0.02)',
  } : {
    structBorder: 'rgba(180,195,210,0.08)',
    structBorderHover: 'rgba(180,195,210,0.14)',
    structBorderStrong: 'rgba(180,195,210,0.28)',
    structGlass: 'rgba(170,185,200,0.04)',
    structGlassHover: 'rgba(170,185,200,0.08)',
    structInset: 'rgba(170,185,200,0.03)',
    structShadowTint: 'rgba(170,185,200,0.02)',
  };

  // Card gradient: lift card visibly above background
  const cR = hexToRgb(s.card);
  const bR = hexToRgb(s.bg);
  const cardGradient = s.isLight
    ? `linear-gradient(160deg, ${s.card}, ${s.bg2})`
    : `linear-gradient(160deg, rgba(${cR.r + 4},${cR.g + 4},${cR.b + 6},0.99), rgba(${bR.r + 4},${bR.g + 4},${bR.b + 6},0.99))`;

  // Multi-layer shadow system (Princess-grade depth)
  const cardShadow = s.isLight
    ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)'
    : `0 2px 8px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 ${struct.structInset}`;

  const cardShadowHover = s.isLight
    ? '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)'
    : `0 2px 12px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.2), 0 0 20px ${rgba(a.accent, 0.06)}, inset 0 1px 0 ${struct.structInset}`;

  // Neon breathing shadow (Princess multi-layer)
  const neonShadow = `0 0 10px rgba(180,195,210,0.25), 0 0 28px rgba(170,185,200,0.12), 0 0 55px rgba(160,175,190,0.06), inset 0 0 15px rgba(170,185,200,0.02)`;
  const neonShadowStrong = `0 0 18px rgba(180,195,210,0.35), 0 0 40px rgba(170,185,200,0.2), 0 0 70px rgba(160,175,190,0.08), inset 0 0 25px rgba(170,185,200,0.04)`;

  return {
    // Accent colors
    ...a,
    // Surface colors
    ...s,
    accentId: a.id,
    surfaceId: s.id,

    // ─── STRUCTURAL (fixed cool neutral) ───
    ...struct,

    // ─── ACCENT-TINTED (for interactive/glow only) ───
    border1: rgba(a.accent, 0.08),
    border2: rgba(a.accent, 0.14),
    border3: rgba(a.accent, 0.25),
    borderHover: rgba(a.accent, 0.35),
    glow: rgba(a.accent, 0.20),
    glowStrong: rgba(a.accent, 0.35),
    glowSubtle: rgba(a.accent, 0.08),
    glass: rgba(a.accent, 0.03),
    glassHover: rgba(a.accent, 0.06),
    glassBorder: rgba(a.accent, 0.12),
    accent005: rgba(a.accent, 0.05),
    accent008: rgba(a.accent, 0.08),
    accent010: rgba(a.accent, 0.10),
    accent015: rgba(a.accent, 0.15),
    accent020: rgba(a.accent, 0.20),
    accent030: rgba(a.accent, 0.30),
    accent040: rgba(a.accent, 0.40),
    accent060: rgba(a.accent, 0.60),

    // ─── SECONDARY ACCENT (teal vitality tone) ───
    secondary005: rgba(a.secondary, 0.05),
    secondary008: rgba(a.secondary, 0.08),
    secondary010: rgba(a.secondary, 0.10),
    secondary015: rgba(a.secondary, 0.15),
    secondary020: rgba(a.secondary, 0.20),
    secondary030: rgba(a.secondary, 0.30),

    // ─── CARD SYSTEM (lifted, multi-layer depth) ───
    cardGradient,
    cardShadow,
    cardShadowHover,
    neonShadow,
    neonShadowStrong,

    // ─── ATMOSPHERE (stronger than before) ───
    atmosphereGrad: `radial-gradient(ellipse 120% 60% at 50% -15%, ${rgba(a.accent, 0.10)} 0%, transparent 50%)`,
    atmosphereOrb: rgba(a.accent, 0.06),

    // ─── DIVIDER ───
    dividerGrad: `linear-gradient(90deg, transparent, ${a.accentDeep}, ${a.accent}, ${a.accentDeep}, transparent)`,

    // ─── NAV / HEADER ───
    navBg: s.isLight
      ? 'rgba(242,242,246,0.97)'
      : `rgba(${bR.r},${bR.g},${bR.b},0.97)`,
    headerBg: s.isLight
      ? 'rgba(242,242,246,0.96)'
      : `rgba(${hexToRgb(s.bg2).r},${hexToRgb(s.bg2).g},${hexToRgb(s.bg2).b},0.96)`,

    // Button text (silver buttons use light text)
    btnText: s.isLight ? '#1a1a2e' : '#E8ECF0',
  };
}

export { ACCENTS, SURFACES };
export default ACCENTS;
