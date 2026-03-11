// ══════════════════════════════════════════════════════════════
// FORGE THEME SYSTEM — 8 ACCENTS × 5 SURFACES = 40 COMBINATIONS
// Premium depth engineering: rich surfaces, real glass, accent atmosphere
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
    secondary: '#B0BEC5',
    ok: '#78c878', warn: '#C06070', danger: '#C06070',
    gradient: 'linear-gradient(135deg, #455A64, #90A4AE, #ECEFF1, #90A4AE, #455A64)',
    gradientBtn: 'linear-gradient(135deg, rgba(144,164,174,0.08), rgba(176,190,197,0.16), rgba(144,164,174,0.08))',
  },
  forge: {
    id: 'forge', name: 'Forge',
    accent: '#00E0A0', accentDark: '#00C48C', accentDeep: '#008060',
    accentVivid: '#40FFD0', accentBright: '#A0FFE8',
    secondary: '#5CE0C0',
    ok: '#00E0A0', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #008060, #00C48C, #40FFD0, #00C48C, #008060)',
    gradientBtn: 'linear-gradient(135deg, rgba(0,224,160,0.08), rgba(64,255,208,0.16), rgba(0,224,160,0.08))',
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian',
    accent: '#a78bfa', accentDark: '#8b6ff0', accentDeep: '#5b3fc4',
    accentVivid: '#c4b5fd', accentBright: '#e0d4ff',
    secondary: '#818CF8',
    ok: '#a78bfa', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #5b3fc4, #8b6ff0, #c4b5fd, #8b6ff0, #5b3fc4)',
    gradientBtn: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(196,181,253,0.16), rgba(167,139,250,0.08))',
  },
  ember: {
    id: 'ember', name: 'Ember',
    accent: '#ff8c42', accentDark: '#e0762e', accentDeep: '#a04e10',
    accentVivid: '#ffb366', accentBright: '#ffd4a8',
    secondary: '#F0B060',
    ok: '#78c878', warn: '#ff4444', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #a04e10, #e0762e, #ffb366, #e0762e, #a04e10)',
    gradientBtn: 'linear-gradient(135deg, rgba(255,140,66,0.08), rgba(255,179,102,0.16), rgba(255,140,66,0.08))',
  },
  arctic: {
    id: 'arctic', name: 'Arctic',
    accent: '#64b5f6', accentDark: '#42a5f5', accentDeep: '#1565c0',
    accentVivid: '#90caf9', accentBright: '#bbdefb',
    secondary: '#80DEEA',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #1565c0, #42a5f5, #90caf9, #42a5f5, #1565c0)',
    gradientBtn: 'linear-gradient(135deg, rgba(100,181,246,0.08), rgba(144,202,249,0.16), rgba(100,181,246,0.08))',
  },
  crimson: {
    id: 'crimson', name: 'Crimson',
    accent: '#ef5350', accentDark: '#e53935', accentDeep: '#b71c1c',
    accentVivid: '#ff8a80', accentBright: '#ffcdd2',
    secondary: '#FF8A80',
    ok: '#78c878', warn: '#ffab40', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #b71c1c, #e53935, #ff8a80, #e53935, #b71c1c)',
    gradientBtn: 'linear-gradient(135deg, rgba(239,83,80,0.08), rgba(255,138,128,0.16), rgba(239,83,80,0.08))',
  },
  gold: {
    id: 'gold', name: 'Gold',
    accent: '#ffd54f', accentDark: '#ffca28', accentDeep: '#f9a825',
    accentVivid: '#ffe082', accentBright: '#fff8e1',
    secondary: '#FFE082',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #f9a825, #ffca28, #ffe082, #ffca28, #f9a825)',
    gradientBtn: 'linear-gradient(135deg, rgba(255,213,79,0.06), rgba(255,224,130,0.12), rgba(255,213,79,0.06))',
  },
  rose: {
    id: 'rose', name: 'Rose',
    accent: '#f48fb1', accentDark: '#ec407a', accentDeep: '#c2185b',
    accentVivid: '#f8bbd0', accentBright: '#fce4ec',
    secondary: '#CE93D8',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #c2185b, #ec407a, #f8bbd0, #ec407a, #c2185b)',
    gradientBtn: 'linear-gradient(135deg, rgba(244,143,177,0.08), rgba(248,187,208,0.16), rgba(244,143,177,0.08))',
  },
};

// ─── 5 BACKGROUND SURFACES ──────────────────────────────────
// Each surface has real CHARACTER — not just brightness variations
const SURFACES = {
  void: {
    id: 'void', name: 'Void', desc: 'Deep space abyss',
    bg: '#030308', bg2: '#08081a', card: '#10101c', cardHover: '#16162a',
    // Deep blue-black undertone — like looking into deep space
    bgGradient: 'linear-gradient(180deg, #030308 0%, #06061a 40%, #0a0a1e 100%)',
    text1: '#E8ECF4', text2: '#C0C8D8', text3: '#6878A0', text4: '#404E6E', text5: '#283050',
    isLight: false,
  },
  carbon: {
    id: 'carbon', name: 'Carbon', desc: 'Woven fiber weave',
    bg: '#080a0f', bg2: '#0e1118', card: '#161a24', cardHover: '#1e222e',
    // Industrial steel-blue undertone with texture feel
    bgGradient: 'linear-gradient(180deg, #080a0f 0%, #0c0f18 50%, #101420 100%)',
    text1: '#E4E8F0', text2: '#B0B8C8', text3: '#687080', text4: '#404858', text5: '#283038',
    isLight: false,
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian', desc: 'Volcanic glass',
    bg: '#06040e', bg2: '#0c0a1a', card: '#161426', cardHover: '#1e1c30',
    // Deep purple-black volcanic glass feel
    bgGradient: 'linear-gradient(180deg, #06040e 0%, #0a0818 40%, #0e0c20 100%)',
    text1: '#F0F0FA', text2: '#C0C0D4', text3: '#7878A0', text4: '#4A4A6E', text5: '#30304E',
    isLight: false,
  },
  titanium: {
    id: 'titanium', name: 'Titanium', desc: 'Brushed metal alloy',
    bg: '#0e1014', bg2: '#14161c', card: '#1c1e26', cardHover: '#24262e',
    // Warm steel — slightly warmer than carbon
    bgGradient: 'linear-gradient(180deg, #0e1014 0%, #12141c 50%, #161820 100%)',
    text1: '#EAECF4', text2: '#B4BAC8', text3: '#7C8498', text4: '#525A6C', text5: '#3A4054',
    isLight: false,
  },
  ivory: {
    id: 'ivory', name: 'Ivory', desc: 'Warm pearl cream',
    bg: '#F2F0F5', bg2: '#E8E6EE', card: '#FDFCFF', cardHover: '#F6F5FA',
    // Warm cream — not sterile white
    bgGradient: 'linear-gradient(180deg, #F2F0F5 0%, #ECE8F0 50%, #E8E4EE 100%)',
    text1: '#14142A', text2: '#282842', text3: '#50506E', text4: '#7878A0', text5: '#A0A0B8',
    isLight: true,
  },
};

export function getThemeColors(accentId, surfaceId) {
  const a = ACCENTS[accentId] || ACCENTS.platinum;
  const s = SURFACES[surfaceId] || SURFACES.void;

  // ─── STRUCTURAL COLORS ───
  // Slightly accent-warmed structural tones (not pure gray, not fully tinted)
  const aRgb = hexToRgb(a.accent);
  const struct = s.isLight ? {
    structBorder: `rgba(${30 + aRgb.r * 0.04},${30 + aRgb.g * 0.04},${50 + aRgb.b * 0.04},0.14)`,
    structBorderHover: `rgba(${30 + aRgb.r * 0.06},${30 + aRgb.g * 0.06},${50 + aRgb.b * 0.06},0.22)`,
    structBorderStrong: `rgba(${30 + aRgb.r * 0.08},${30 + aRgb.g * 0.08},${50 + aRgb.b * 0.08},0.32)`,
    structGlass: `rgba(${30 + aRgb.r * 0.03},${30 + aRgb.g * 0.03},${50 + aRgb.b * 0.03},0.08)`,
    structGlassHover: `rgba(${30 + aRgb.r * 0.04},${30 + aRgb.g * 0.04},${50 + aRgb.b * 0.04},0.14)`,
    structInset: 'rgba(255,255,255,0.7)',
    structShadowTint: `rgba(${aRgb.r * 0.2},${aRgb.g * 0.2},${aRgb.b * 0.2},0.06)`,
  } : {
    structBorder: `rgba(${140 + aRgb.r * 0.15},${150 + aRgb.g * 0.15},${170 + aRgb.b * 0.15},0.10)`,
    structBorderHover: `rgba(${140 + aRgb.r * 0.18},${150 + aRgb.g * 0.18},${170 + aRgb.b * 0.18},0.18)`,
    structBorderStrong: `rgba(${140 + aRgb.r * 0.22},${150 + aRgb.g * 0.22},${170 + aRgb.b * 0.22},0.30)`,
    structGlass: `rgba(${140 + aRgb.r * 0.12},${150 + aRgb.g * 0.12},${170 + aRgb.b * 0.12},0.08)`,
    structGlassHover: `rgba(${140 + aRgb.r * 0.15},${150 + aRgb.g * 0.15},${170 + aRgb.b * 0.15},0.13)`,
    structInset: `rgba(${160 + aRgb.r * 0.2},${170 + aRgb.g * 0.2},${190 + aRgb.b * 0.2},0.09)`,
    structShadowTint: `rgba(${aRgb.r * 0.1},${aRgb.g * 0.1},${aRgb.b * 0.1},0.06)`,
  };

  // Card gradient: rich lift from background with accent warmth
  const cR = hexToRgb(s.card);
  const cardGradient = s.isLight
    ? `linear-gradient(160deg, ${s.card}, ${s.cardHover})`
    : `linear-gradient(160deg, rgba(${cR.r + 6},${cR.g + 6},${cR.b + 10},0.97), rgba(${cR.r},${cR.g},${cR.b},0.95))`;

  // Multi-layer shadow system with accent-tinted glow
  const cardShadow = s.isLight
    ? '0 1px 3px rgba(20,20,40,0.06), 0 4px 16px rgba(20,20,40,0.04), 0 12px 32px rgba(20,20,40,0.02), inset 0 1px 0 rgba(255,255,255,0.8)'
    : `0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.20), 0 0 1px ${rgba(a.accent, 0.08)}, inset 0 1px 0 ${struct.structInset}`;

  const cardShadowHover = s.isLight
    ? '0 2px 8px rgba(20,20,40,0.08), 0 8px 28px rgba(20,20,40,0.06), 0 16px 40px rgba(20,20,40,0.03), inset 0 1px 0 rgba(255,255,255,0.8)'
    : `0 2px 12px rgba(0,0,0,0.4), 0 12px 40px rgba(0,0,0,0.18), 0 0 24px ${rgba(a.accent, 0.10)}, inset 0 1px 0 ${struct.structInset}`;

  // Accent-infused neon glow (uses accent color, not just neutral)
  const neonShadow = `0 0 10px ${rgba(a.accent, 0.15)}, 0 0 28px ${rgba(a.accent, 0.08)}, 0 0 55px ${rgba(a.accent, 0.04)}, inset 0 0 15px ${rgba(a.accent, 0.02)}`;
  const neonShadowStrong = `0 0 18px ${rgba(a.accent, 0.25)}, 0 0 40px ${rgba(a.accent, 0.14)}, 0 0 70px ${rgba(a.accent, 0.06)}, inset 0 0 25px ${rgba(a.accent, 0.03)}`;

  const bR = hexToRgb(s.bg);

  return {
    // Accent colors
    ...a,
    // Surface colors
    ...s,
    accentId: a.id,
    surfaceId: s.id,

    // ─── STRUCTURAL (accent-warmed neutral) ───
    ...struct,

    // ─── ACCENT-TINTED (for interactive/glow) ───
    border1: rgba(a.accent, 0.10),
    border2: rgba(a.accent, 0.16),
    border3: rgba(a.accent, 0.28),
    borderHover: rgba(a.accent, 0.38),
    glow: rgba(a.accent, 0.24),
    glowStrong: rgba(a.accent, 0.40),
    glowSubtle: rgba(a.accent, 0.10),
    glass: rgba(a.accent, 0.05),
    glassHover: rgba(a.accent, 0.08),
    glassBorder: rgba(a.accent, 0.14),
    accent005: rgba(a.accent, 0.05),
    accent008: rgba(a.accent, 0.08),
    accent010: rgba(a.accent, 0.10),
    accent015: rgba(a.accent, 0.15),
    accent020: rgba(a.accent, 0.20),
    accent030: rgba(a.accent, 0.30),
    accent040: rgba(a.accent, 0.40),
    accent060: rgba(a.accent, 0.60),

    // ─── SECONDARY ACCENT (theme-harmonious) ───
    secondary005: rgba(a.secondary, 0.05),
    secondary008: rgba(a.secondary, 0.08),
    secondary010: rgba(a.secondary, 0.10),
    secondary015: rgba(a.secondary, 0.15),
    secondary020: rgba(a.secondary, 0.20),
    secondary030: rgba(a.secondary, 0.30),

    // ─── CARD SYSTEM ───
    cardGradient,
    cardShadow,
    cardShadowHover,
    neonShadow,
    neonShadowStrong,

    // ─── ATMOSPHERE (STRONG — these must be VISIBLE) ───
    atmosphereGrad: `radial-gradient(ellipse 130% 70% at 50% -20%, ${rgba(a.accent, 0.18)} 0%, ${rgba(a.accent, 0.06)} 30%, transparent 55%)`,
    atmosphereOrb: rgba(a.accent, 0.10),
    // Secondary atmosphere layer for depth
    atmosphereGrad2: `radial-gradient(ellipse 100% 50% at 50% 110%, ${rgba(a.accentDeep, 0.08)} 0%, transparent 50%)`,

    // ─── DIVIDER ───
    dividerGrad: `linear-gradient(90deg, transparent, ${a.accentDeep}, ${a.accent}, ${a.accentDeep}, transparent)`,

    // ─── NAV / HEADER ───
    navBg: s.isLight
      ? 'rgba(242,240,246,0.96)'
      : `rgba(${bR.r + 2},${bR.g + 2},${bR.b + 4},0.96)`,
    headerBg: s.isLight
      ? 'rgba(242,240,246,0.95)'
      : `rgba(${hexToRgb(s.bg2).r},${hexToRgb(s.bg2).g},${hexToRgb(s.bg2).b},0.95)`,

    // Button text
    btnText: s.isLight ? '#1a1a2e' : '#E8ECF0',
  };
}

export { ACCENTS, SURFACES };
export default ACCENTS;
