// ══════════════════════════════════════════════════════════════
// FORGE THEME SYSTEM — 8 ACCENTS × 5 SURFACES = 40 COMBINATIONS
// Princess-grade luxury color engineering
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
    ok: '#78c878', warn: '#C06070', danger: '#C06070',
    gradient: 'linear-gradient(135deg, #455A64, #90A4AE, #ECEFF1, #90A4AE, #455A64)',
    gradientBtn: 'linear-gradient(135deg, #546E7A, #90A4AE, #CFD8DC, #90A4AE, #546E7A)',
  },
  forge: {
    id: 'forge', name: 'Forge',
    accent: '#5ce0d0', accentDark: '#40b8a8', accentDeep: '#1a7868',
    accentVivid: '#7EFFF0', accentBright: '#B0FFF5',
    ok: '#5ce0d0', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #1a7868, #40b8a8, #7EFFF0, #40b8a8, #1a7868)',
    gradientBtn: 'linear-gradient(135deg, #1a7868, #5ce0d0, #7EFFF0, #5ce0d0, #1a7868)',
  },
  obsidian: {
    id: 'obsidian', name: 'Obsidian',
    accent: '#a78bfa', accentDark: '#8b6ff0', accentDeep: '#5b3fc4',
    accentVivid: '#c4b5fd', accentBright: '#e0d4ff',
    ok: '#a78bfa', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #5b3fc4, #8b6ff0, #c4b5fd, #8b6ff0, #5b3fc4)',
    gradientBtn: 'linear-gradient(135deg, #5b3fc4, #a78bfa, #c4b5fd, #a78bfa, #5b3fc4)',
  },
  ember: {
    id: 'ember', name: 'Ember',
    accent: '#ff8c42', accentDark: '#e0762e', accentDeep: '#a04e10',
    accentVivid: '#ffb366', accentBright: '#ffd4a8',
    ok: '#78c878', warn: '#ff4444', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #a04e10, #e0762e, #ffb366, #e0762e, #a04e10)',
    gradientBtn: 'linear-gradient(135deg, #a04e10, #ff8c42, #ffb366, #ff8c42, #a04e10)',
  },
  arctic: {
    id: 'arctic', name: 'Arctic',
    accent: '#64b5f6', accentDark: '#42a5f5', accentDeep: '#1565c0',
    accentVivid: '#90caf9', accentBright: '#bbdefb',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #1565c0, #42a5f5, #90caf9, #42a5f5, #1565c0)',
    gradientBtn: 'linear-gradient(135deg, #1565c0, #64b5f6, #90caf9, #64b5f6, #1565c0)',
  },
  crimson: {
    id: 'crimson', name: 'Crimson',
    accent: '#ef5350', accentDark: '#e53935', accentDeep: '#b71c1c',
    accentVivid: '#ff8a80', accentBright: '#ffcdd2',
    ok: '#78c878', warn: '#ffab40', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #b71c1c, #e53935, #ff8a80, #e53935, #b71c1c)',
    gradientBtn: 'linear-gradient(135deg, #b71c1c, #ef5350, #ff8a80, #ef5350, #b71c1c)',
  },
  gold: {
    id: 'gold', name: 'Gold',
    accent: '#ffd54f', accentDark: '#ffca28', accentDeep: '#f9a825',
    accentVivid: '#ffe082', accentBright: '#fff8e1',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #f9a825, #ffca28, #ffe082, #ffca28, #f9a825)',
    gradientBtn: 'linear-gradient(135deg, #f9a825, #ffd54f, #ffe082, #ffd54f, #f9a825)',
  },
  rose: {
    id: 'rose', name: 'Rose',
    accent: '#f48fb1', accentDark: '#ec407a', accentDeep: '#c2185b',
    accentVivid: '#f8bbd0', accentBright: '#fce4ec',
    ok: '#78c878', warn: '#ff6b6b', danger: '#ff4444',
    gradient: 'linear-gradient(135deg, #c2185b, #ec407a, #f8bbd0, #ec407a, #c2185b)',
    gradientBtn: 'linear-gradient(135deg, #c2185b, #f48fb1, #f8bbd0, #f48fb1, #c2185b)',
  },
};

// ─── 5 BACKGROUND SURFACES ──────────────────────────────────
const SURFACES = {
  void: {
    id: 'void', name: 'Void',
    bg: '#010102', bg2: '#050508', card: '#08080c', cardHover: '#0e0e14',
    text1: '#EDF0F4', text2: '#C8CDD2', text3: '#788090', text4: '#4A5568', text5: '#2D3748',
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

  return {
    // Accent colors
    ...a,
    // Surface colors
    ...s,
    accentId: a.id,
    surfaceId: s.id,
    // Computed border system (proper rgba, not broken hex append)
    border1: rgba(a.accent, 0.08),
    border2: rgba(a.accent, 0.14),
    border3: rgba(a.accent, 0.25),
    borderHover: rgba(a.accent, 0.35),
    // Glow system
    glow: rgba(a.accent, 0.20),
    glowStrong: rgba(a.accent, 0.35),
    glowSubtle: rgba(a.accent, 0.08),
    // Glass system
    glass: rgba(a.accent, 0.03),
    glassHover: rgba(a.accent, 0.06),
    glassBorder: rgba(a.accent, 0.12),
    // Accent opacity variants
    accent005: rgba(a.accent, 0.05),
    accent008: rgba(a.accent, 0.08),
    accent010: rgba(a.accent, 0.10),
    accent015: rgba(a.accent, 0.15),
    accent020: rgba(a.accent, 0.20),
    accent030: rgba(a.accent, 0.30),
    accent040: rgba(a.accent, 0.40),
    accent060: rgba(a.accent, 0.60),
    // Card system
    cardGradient: s.isLight
      ? `linear-gradient(160deg, ${s.card}, ${s.bg2})`
      : `linear-gradient(160deg, rgba(${hexToRgb(s.card).r},${hexToRgb(s.card).g},${hexToRgb(s.card).b},0.99), rgba(${hexToRgb(s.bg).r},${hexToRgb(s.bg).g},${hexToRgb(s.bg).b},0.99))`,
    cardShadow: s.isLight
      ? '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
      : `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 ${rgba(a.accent, 0.02)}`,
    // Background atmosphere
    atmosphereGrad: `radial-gradient(ellipse 80% 50% at 50% -20%, ${rgba(a.accent, 0.06)} 0%, transparent 70%)`,
    atmosphereOrb: rgba(a.accent, 0.04),
    // Divider gradient (Princess-style)
    dividerGrad: `linear-gradient(90deg, transparent, ${a.accentDeep}, ${a.accent}, ${a.accentDeep}, transparent)`,
    // Nav
    navBg: s.isLight
      ? 'rgba(242,242,246,0.97)'
      : `rgba(${hexToRgb(s.bg).r},${hexToRgb(s.bg).g},${hexToRgb(s.bg).b},0.97)`,
    headerBg: s.isLight
      ? 'rgba(242,242,246,0.96)'
      : `rgba(${hexToRgb(s.bg2).r},${hexToRgb(s.bg2).g},${hexToRgb(s.bg2).b},0.96)`,
    // Button text color based on surface
    btnText: s.isLight ? '#1a1a2e' : s.bg,
  };
}

export { ACCENTS, SURFACES };
export default ACCENTS;
