// ══════════════════════════════════════════════════════════════
// FORGE HAPTICS — Tactile feedback for key actions
// Uses navigator.vibrate() — supported on Android + some browsers.
// Silently no-ops on unsupported devices (iOS Safari, desktop).
// ══════════════════════════════════════════════════════════════

const canVibrate = typeof navigator !== "undefined" && "vibrate" in navigator;

function vibrate(pattern) {
  if (!canVibrate) return;
  try { navigator.vibrate(pattern); } catch {}
}

// Light tap — checkbox, toggle, button press
export function tapLight() { vibrate(10); }

// Medium tap — set completion, meal logged, water added
export function tapMedium() { vibrate(25); }

// Heavy tap — workout complete, check-in submitted
export function tapHeavy() { vibrate(50); }

// Success pattern — PR detected, streak milestone
export function tapSuccess() { vibrate([30, 50, 30, 50, 60]); }

// Double tap — day change, navigation
export function tapDouble() { vibrate([15, 40, 15]); }

// Warning — high fatigue, streak broken
export function tapWarning() { vibrate([80, 40, 80]); }

// Celebration — workout complete with PRs
export function tapCelebration() { vibrate([20, 30, 20, 30, 20, 30, 60, 40, 100]); }
