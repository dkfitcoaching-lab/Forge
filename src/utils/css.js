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
  background: ${C.bg};
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
  box-shadow: 0 0 0 3px ${C.accent008};
}

input::placeholder, textarea::placeholder { color: ${C.text4}; }
select option { background: ${C.card}; color: ${C.text1}; }
button { font-family: var(--b); cursor: pointer; border: none; outline: none; transition: all .18s ease; }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,.02); }
::-webkit-scrollbar-thumb { background: ${C.structBorderStrong}; border-radius: 2px; }
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
  from { transform: scale(0.85); opacity: 0; }
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
    box-shadow: 0 4px 30px rgba(0,0,0,.5), 0 0 40px rgba(180,195,210,.08);
  }
  50% {
    box-shadow: 0 4px 30px rgba(0,0,0,.5), 0 0 60px rgba(180,195,210,.15);
  }
}

/* Princess-exact multi-layer structural neon glow */
@keyframes neonBreathe {
  0%, 100% {
    box-shadow: 0 0 10px rgba(180,195,210,.25), 0 0 28px rgba(170,185,200,.12), 0 0 55px rgba(160,175,190,.06), inset 0 0 15px rgba(170,185,200,.02);
    border-color: ${C.structBorderStrong};
  }
  50% {
    box-shadow: 0 0 18px rgba(180,195,210,.35), 0 0 40px rgba(170,185,200,.2), 0 0 70px rgba(160,175,190,.08), inset 0 0 25px rgba(170,185,200,.04);
    border-color: rgba(180,195,210,.35);
  }
}

@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 14px ${C.accent030}; }
  50% { text-shadow: 0 0 36px ${C.accent060}; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(180,195,210,.08), 0 0 40px rgba(170,185,200,.04); }
  50% { box-shadow: 0 0 30px rgba(180,195,210,.15), 0 0 60px rgba(170,185,200,.08); }
}

@keyframes goldShimmer {
  0% { background-position: 200% center; }
  50% { background-position: 0% center; }
  100% { background-position: -200% center; }
}

@keyframes orbFloat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: .08; }
  50% { transform: translate(-50%, -50%) scale(1.15); opacity: .14; }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(-50%, -50%) scale(1.1); opacity: .04; }
  50% { transform: translate(-50%, -50%) scale(.9); opacity: .10; }
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
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes backdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive desktop layout */
@media (min-width: 900px) {
  .forge-nav {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    width: 260px !important;
    max-width: 260px !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    padding: 0 !important;
    border-top: none !important;
    border-right: 1px solid ${C.structBorder} !important;
    transform: none !important;
  }
  .forge-content {
    margin-left: 260px !important;
    padding: 44px 60px 60px !important;
    max-width: 1100px !important;
  }
  .forge-header {
    margin-left: 260px !important;
  }
}
`;
}
