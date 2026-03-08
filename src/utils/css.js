export function makeStyles(C) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=JetBrains+Mono:wght@200;300;400;500;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
:root {
  --d: 'Cinzel', serif;
  --m: 'JetBrains Mono', monospace;
  --b: 'Inter', sans-serif;
}
@keyframes fi { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes glow {
  0%,100% { box-shadow: 0 0 20px ${C.accent}20, 0 0 40px ${C.accent}10; }
  50% { box-shadow: 0 0 30px ${C.accent}30, 0 0 60px ${C.accent}15; }
}
::selection { background: ${C.accent}30; color: ${C.text1}; }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
`;
}
