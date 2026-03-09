export function makeStyles(C) {
  return `
:root {
  --d: 'Cinzel', Georgia, 'Times New Roman', serif;
  --m: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  --b: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; background: ${C.bg}; overscroll-behavior: none; }
input, textarea, button { font-family: inherit; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${C.accent}20; border-radius: 2px; }
::selection { background: ${C.accent}30; color: ${C.text1}; }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
@keyframes fi { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
@keyframes glow {
  0%,100% { box-shadow: 0 0 20px ${C.accent}20, 0 0 40px ${C.accent}10; }
  50% { box-shadow: 0 0 30px ${C.accent}35, 0 0 60px ${C.accent}18; }
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;
}
