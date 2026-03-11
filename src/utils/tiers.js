// ══════════════════════════════════════════════════════════════
// FORGE TIER SYSTEM — Subscription-based feature gating
// ══════════════════════════════════════════════════════════════

import storage from "./storage";

export const TIERS = {
  FREE: "free",
  PRO: "pro",
  ELITE: "elite",
};

export const TIER_INFO = {
  [TIERS.FREE]: {
    name: "FORGE",
    badge: "FREE",
    color: "#90A4AE",
    order: 0,
  },
  [TIERS.PRO]: {
    name: "FORGE PRO",
    badge: "PRO",
    color: "#00E0A0",
    order: 1,
  },
  [TIERS.ELITE]: {
    name: "FORGE ELITE",
    badge: "ELITE",
    color: "#ffd54f",
    order: 2,
  },
};

// Feature flags and their minimum required tier
const FEATURES = {
  // Free tier features
  workouts: TIERS.FREE,
  nutrition_tracking: TIERS.FREE,
  water_tracking: TIERS.FREE,
  supplement_tracking: TIERS.FREE,
  basic_analytics: TIERS.FREE,
  check_in: TIERS.FREE,
  program_guide: TIERS.FREE,
  posing_guide: TIERS.FREE,

  // Pro tier features
  coach_chat: TIERS.PRO,
  fatigue_model: TIERS.PRO,
  progressive_overload: TIERS.PRO,
  volume_log: TIERS.PRO,
  weight_trend: TIERS.PRO,
  body_heat_map: TIERS.PRO,
  personal_records: TIERS.PRO,
  workout_history: TIERS.PRO,

  // Elite tier features
  coach_media_upload: TIERS.ELITE,
  coach_voice: TIERS.ELITE,
  progress_photos: TIERS.ELITE,
  posing_timer: TIERS.ELITE,
  posing_history: TIERS.ELITE,
  data_export: TIERS.ELITE,
  advanced_analytics: TIERS.ELITE,
  custom_themes: TIERS.ELITE,
};

const TIER_ORDER = { [TIERS.FREE]: 0, [TIERS.PRO]: 1, [TIERS.ELITE]: 2 };

export function getUserTier() {
  return storage.get("tier", TIERS.FREE);
}

export function setUserTier(tier) {
  storage.set("tier", tier);
}

export function hasFeature(featureKey) {
  const userTier = getUserTier();
  const requiredTier = FEATURES[featureKey];
  if (!requiredTier) return true; // Unknown features default to allowed
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
}

export function getRequiredTier(featureKey) {
  return FEATURES[featureKey] || TIERS.FREE;
}

export function isUpgradeNeeded(featureKey) {
  return !hasFeature(featureKey);
}

export function getTierBadge(tier) {
  return TIER_INFO[tier] || TIER_INFO[TIERS.FREE];
}

export default { TIERS, getUserTier, setUserTier, hasFeature, isUpgradeNeeded, getRequiredTier, getTierBadge, TIER_INFO };
