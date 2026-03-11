// ══════════════════════════════════════════════════════════════
// FORGE CSS ENGINE — Princess-Grade Typography + Animations
// Cinzel / Rajdhani / IBM Plex Mono — luxury font stack
// Structural cool-neutral glows, NOT accent-tinted
// ══════════════════════════════════════════════════════════════

export function makeStyles(C) {
  return `
@font-face{font-family:'Cinzel';font-style:normal;font-display:swap;font-weight:400;src:url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'Cinzel';font-style:normal;font-display:swap;font-weight:600;src:url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-600-normal.woff2) format('woff2')}
@font-face{font-family:'Cinzel';font-style:normal;font-display:swap;font-weight:700;src:url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-700-normal.woff2) format('woff2')}
@font-face{font-family:'Cinzel';font-style:normal;font-display:swap;font-weight:800;src:url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-800-normal.woff2) format('woff2')}
@font-face{font-family:'Cinzel';font-style:normal;font-display:swap;font-weight:900;src:url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel@latest/latin-900-normal.woff2) format('woff2')}
@font-face{font-family:'Rajdhani';font-style:normal;font-display:swap;font-weight:300;src:url(https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-300-normal.woff2) format('woff2')}
@font-face{font-family:'Rajdhani';font-style:normal;font-display:swap;font-weight:400;src:url(https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'Rajdhani';font-style:normal;font-display:swap;font-weight:500;src:url(https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'Rajdhani';font-style:normal;font-display:swap;font-weight:600;src:url(https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-600-normal.woff2) format('woff2')}
@font-face{font-family:'Rajdhani';font-style:normal;font-display:swap;font-weight:700;src:url(https://cdn.jsdelivr.net/fontsource/fonts/rajdhani@latest/latin-700-normal.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-style:normal;font-display:swap;font-weight:300;src:url(https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-300-normal.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-style:normal;font-display:swap;font-weight:400;src:url(https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-style:normal;font-display:swap;font-weight:500;src:url(https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-500-normal.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-style:normal;font-display:swap;font-weight:600;src:url(https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-600-normal.woff2) format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-style:normal;font-display:swap;font-weight:700;src:url(https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-700-normal.woff2) format('woff2')}

:root {
  --d: 'Cinzel', serif;
  --b: 'Rajdhani', sans-serif;
  --m: 'IBM Plex Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; }
body {
  background: ${C.bgGradient || C.bg};
  color: ${C.text1};
  font-family: var(--b);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior: none;
}

input, textarea, select {
  font-family: var(--b);
  color: ${C.text1};
  background: ${C.structGlass};
  border: 1.5px solid ${C.structBorderHover};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 15px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color .2s, box-shadow .2s;
}

input:focus, textarea:focus, select:focus {
  border-color: ${C.accent};
  box-shadow: 0 0 0 3px ${C.accent015}, 0 0 16px ${C.accent008};
}

/* Card hover/active feedback */
.forge-card-interactive {
  will-change: transform, box-shadow;
}
.forge-card-interactive:hover {
  border-color: ${C.structBorderHover} !important;
  box-shadow: ${C.cardShadowHover} !important;
}
.forge-card-interactive:active {
  transform: scale(0.985) translateZ(0);
  border-color: ${C.accent020} !important;
  box-shadow: ${C.cardShadow}, 0 0 12px ${C.accent008} !important;
}

input::placeholder, textarea::placeholder { color: ${C.text4}; }
select option { background: ${C.card}; color: ${C.text1}; }
button { font-family: var(--b); cursor: pointer; border: none; outline: none; transition: color .18s ease, transform .18s ease, background .18s ease, box-shadow .18s ease, border-color .18s ease, opacity .18s ease, filter .18s ease; }
button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,.02); }
::-webkit-scrollbar-thumb { background: ${C.structBorderStrong}; border-radius: 4px; }
::selection { background: ${C.accent030}; color: ${C.text1}; }

/* ─── ANIMATIONS ─── */
@keyframes fi {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

@keyframes shimmerSlow {
  0% { background-position: 200% center; }
  50% { background-position: 0% center; }
  100% { background-position: -200% center; }
}

@keyframes breathe {
  0%, 100% {
    box-shadow: 0 4px 30px rgba(0,0,0,.5), 0 0 40px ${C.accent010};
  }
  50% {
    box-shadow: 0 4px 30px rgba(0,0,0,.5), 0 0 60px ${C.accent020};
  }
}

/* Accent-infused neon glow */
@keyframes neonBreathe {
  0%, 100% {
    box-shadow: 0 0 10px ${C.accent015}, 0 0 28px ${C.accent008}, 0 0 55px ${C.accent005}, inset 0 0 15px ${C.accent005};
    border-color: ${C.accent020};
  }
  50% {
    box-shadow: 0 0 18px ${C.accent030}, 0 0 40px ${C.accent015}, 0 0 70px ${C.accent008}, inset 0 0 25px ${C.accent008};
    border-color: ${C.accent030};
  }
}

/* Accent-tinted breathing glow for primary CTA cards — subtle border glow */
@keyframes accentBreathe {
  0%, 100% {
    box-shadow: 0 0 8px ${C.accent010}, 0 0 24px ${C.accent005}, 0 4px 20px rgba(0,0,0,.3);
    border-color: ${C.accent020};
  }
  50% {
    box-shadow: 0 0 16px ${C.accent020}, 0 0 40px ${C.accent010}, 0 4px 20px rgba(0,0,0,.3);
    border-color: ${C.accent030};
  }
}

@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 14px ${C.accent030}; }
  50% { text-shadow: 0 0 36px ${C.accent060}; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px ${C.accent010}, 0 0 40px ${C.accent005}; }
  50% { box-shadow: 0 0 30px ${C.accent020}, 0 0 60px ${C.accent010}; }
}

@keyframes goldShimmer {
  0% { background-position: 200% center; }
  50% { background-position: 0% center; }
  100% { background-position: -200% center; }
}

@keyframes orbFloat {
  0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: .08; }
  50% { transform: translate3d(-50%, -50%, 0) scale(1.15); opacity: .14; }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1.1); opacity: .04; }
  50% { transform: translate3d(-50%, -50%, 0) scale(.9); opacity: .10; }
}

@keyframes logoGlowRise {
  0% { opacity: 0; transform: translateY(20px) scale(.9); filter: blur(8px); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.02); filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes textReveal {
  0% { opacity: 0; letter-spacing: .4em; filter: blur(6px); }
  100% { opacity: 1; letter-spacing: .12em; filter: blur(0); }
}

@keyframes badgeFade {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes lineGrow {
  0% { width: 0; opacity: 0; }
  100% { width: 60px; opacity: 1; }
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}

@keyframes iconGlow {
  0%, 100% {
    filter: drop-shadow(0 0 6px ${C.accent040});
  }
  50% {
    filter: drop-shadow(0 0 12px ${C.accent060});
  }
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes countDown {
  from { transform: scale(1.1); opacity: 0.7; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes splashFadeOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.02); filter: blur(4px); }
}

@keyframes coachFabIn {
  from { opacity: 0; transform: scale(0.8) translateZ(0); }
  to { opacity: 1; transform: scale(1) translateZ(0); }
}

/* GPU promotion for animated elements */
.forge-orb { will-change: transform, opacity; }
.forge-header-blur { will-change: backdrop-filter; }
.forge-nav-blur { will-change: backdrop-filter; }

/* ═══ DESKTOP LAYOUT ═══ */
@media (min-width: 900px) {
  /* Side navigation — vertical sidebar */
  .forge-nav {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 240px !important;
    max-width: 240px !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    padding: 32px 16px 24px !important;
    gap: 4px !important;
    border-top: none !important;
    border-right: 1px solid ${C.structBorder} !important;
    transform: none !important;
    z-index: 40 !important;
  }
  .forge-nav > div:first-child {
    display: none !important;
  }
  /* Nav items — horizontal icon + label layout */
  .forge-nav > div:not(:first-child) {
    flex-direction: row !important;
    justify-content: flex-start !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    min-width: unset !important;
    width: 100% !important;
    gap: 12px !important;
    font-size: 12px !important;
    letter-spacing: 0.06em !important;
    transition: background 0.2s, color 0.2s !important;
    border-left: 2px solid transparent !important;
  }
  .forge-nav > div:not(:first-child):hover {
    background: ${C.structGlassHover} !important;
  }
  /* Active nav item on desktop — left accent bar + tinted bg */
  .forge-nav .forge-nav-active {
    background: ${C.accent008} !important;
    border-left: 2px solid ${C.accent} !important;
    border-radius: 0 10px 10px 0 !important;
  }
  /* Hide mobile top-bar active indicator on desktop */
  .forge-nav > div:not(:first-child) > div:first-child {
    display: none !important;
  }

  /* Header — shift right of sidebar */
  .forge-header {
    margin-left: 240px !important;
    max-width: calc(100% - 240px) !important;
  }

  /* Content — centered with comfortable reading width */
  .forge-content {
    margin-left: 240px !important;
    padding: 32px 48px 60px !important;
    max-width: 860px !important;
  }
}

/* ═══ WIDE DESKTOP (1200px+) ═══ */
@media (min-width: 1200px) {
  .forge-content {
    padding: 36px 64px 60px !important;
    max-width: 920px !important;
  }
}

/* ═══ ULTRAWIDE (1600px+) ═══ */
@media (min-width: 1600px) {
  .forge-nav {
    width: 280px !important;
    max-width: 280px !important;
    padding: 40px 20px 32px !important;
  }
  .forge-nav > div:not(:first-child) {
    padding: 14px 20px !important;
    font-size: 13px !important;
  }
  .forge-header {
    margin-left: 280px !important;
    max-width: calc(100% - 280px) !important;
  }
  .forge-content {
    margin-left: 280px !important;
    padding: 40px 80px 60px !important;
    max-width: 1000px !important;
  }
}

/* ═══ DESKTOP HOVER ENHANCEMENTS ═══ */
@media (hover: hover) {
  .forge-card-interactive:hover {
    transform: translateY(-1px) translateZ(0);
    border-color: ${C.structBorderHover} !important;
    box-shadow: ${C.cardShadowHover} !important;
  }
  .forge-card-interactive:active {
    transform: scale(0.99) translateZ(0);
  }
  button:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
}
`;
}
