import storage from "./storage";
import {
  computeStats,
  computeReadinessScore,
  computeFatigueScore,
  getProgressiveOverloadTargets,
  getAllCheckIns,
} from "./analytics";
import DAYS from "../data/workouts";

// ══════════════════════════════════════════════════════════════
// FORGE NOTIFICATION & LOCATION ENGINE
// Personality-aware notifications, geo-fence gym detection,
// and proactive coaching intelligence
// ══════════════════════════════════════════════════════════════

// ─── NOTIFICATION PERMISSION ─────────────────────────────────

export function getNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission; // "default", "granted", "denied"
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  const result = await Notification.requestPermission();
  storage.set("notif_perm", result);
  return result;
}

export function sendNotification(title, body, options = {}) {
  if (getNotificationPermission() !== "granted") return null;
  try {
    return new Notification(title, {
      body,
      icon: "/forge-icon.png",
      badge: "/forge-badge.png",
      silent: false,
      tag: options.tag || "forge-coach",
      ...options,
    });
  } catch {
    return null;
  }
}

// ─── GYM LOCATION SERVICES ──────────────────────────────────

export function isGeolocationSupported() {
  return "geolocation" in navigator;
}

export function getGymLocation() {
  return storage.get("gym_loc", null);
}

export function setGymLocation(lat, lng, name) {
  storage.set("gym_loc", { lat, lng, name, savedAt: Date.now() });
}

export function clearGymLocation() {
  storage.remove("gym_loc");
}

export function getLocationSettings() {
  return storage.get("loc_settings", {
    enabled: false,
    gymDetection: false,
    homeGym: false, // if true, skip geo-fence (they train at home)
    autoLaunchWorkout: true,
  });
}

export function setLocationSettings(settings) {
  storage.set("loc_settings", settings);
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Returns promise that resolves to current position
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// Save current location as gym
export async function saveCurrentAsGym(name = "My Gym") {
  const pos = await getCurrentPosition();
  setGymLocation(pos.lat, pos.lng, name);
  return pos;
}

// Check if user is near their saved gym (within ~200m)
export async function isNearGym() {
  const gym = getGymLocation();
  if (!gym) return false;
  try {
    const pos = await getCurrentPosition();
    const dist = getDistanceKm(pos.lat, pos.lng, gym.lat, gym.lng);
    return dist < 0.2; // 200 meters
  } catch {
    return false;
  }
}

// ─── GYM ARRIVAL DETECTION (foreground polling) ──────────────

let watchId = null;
let lastArrivalNotif = 0;

export function startGymWatch(onArrival) {
  const settings = getLocationSettings();
  if (!settings.enabled || !settings.gymDetection || settings.homeGym) return;
  const gym = getGymLocation();
  if (!gym || !isGeolocationSupported()) return;

  stopGymWatch();
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const dist = getDistanceKm(pos.coords.latitude, pos.coords.longitude, gym.lat, gym.lng);
      const now = Date.now();
      // Trigger once per 2 hours max
      if (dist < 0.2 && now - lastArrivalNotif > 7200000) {
        lastArrivalNotif = now;
        storage.set("gym_arrival", now);
        if (onArrival) onArrival();
      }
    },
    () => {},
    { enableHighAccuracy: false, distanceFilter: 50 }
  );
}

export function stopGymWatch() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// ─── PROACTIVE INTELLIGENCE LINE ─────────────────────────────
// Generates a single, real, data-driven insight for the home screen hero.
// Not theater — this is what proves the system was thinking while you slept.

export function getProactiveIntelligence() {
  const stats = computeStats();
  const readiness = computeReadinessScore();
  const fatigue = computeFatigueScore();
  const currentDay = storage.get("cd", 1);
  const dayData = DAYS[currentDay - 1];
  const checkIns = getAllCheckIns();
  const overloadTargets = getProgressiveOverloadTargets(currentDay);
  const recentCheckIns = checkIns.slice(-7);

  // Priority 1: Gym arrival — they just got here
  const gymArrival = storage.get("gym_arrival", 0);
  if (Date.now() - gymArrival < 300000) { // within 5 min of arrival
    if (dayData && !dayData.rest) {
      return { text: `${dayData.t} is loaded. Tap start.`, type: "gym_arrival", priority: 100 };
    }
  }

  // Priority 2: Overload detected — exercises ready for progression
  if (overloadTargets) {
    const ready = overloadTargets.filter((t) => t.shouldIncrease);
    if (ready.length > 0) {
      const names = ready.map((t) => t.name.split(" ")[0]).slice(0, 2).join(" and ");
      return {
        text: `${names} ${ready.length === 1 ? "is" : "are"} ready for a weight increase. Your body adapted.`,
        type: "overload",
        priority: 90,
      };
    }
  }

  // Priority 3: Sleep declining — catch it early
  if (recentCheckIns.length >= 3) {
    const sleeps = recentCheckIns.slice(-3).map((c) => c.sl || 0);
    if (sleeps[2] < sleeps[1] && sleeps[1] < sleeps[0] && sleeps[2] < 3) {
      return {
        text: `Sleep has dropped 3 days running. Recovery is compromised — adjusting expectations.`,
        type: "sleep_decline",
        priority: 85,
      };
    }
  }

  // Priority 4: High fatigue
  if (fatigue && fatigue.fatigue >= 75) {
    return {
      text: `Fatigue index: ${fatigue.fatigue}%. A strategic deload this week protects long-term gains.`,
      type: "fatigue_high",
      priority: 80,
    };
  }

  // Priority 5: Streak milestones
  if (stats.streak > 0 && (stats.streak === 7 || stats.streak === 14 || stats.streak === 30 || stats.streak === 60 || stats.streak === 90)) {
    return {
      text: `${stats.streak}-session streak. This consistency is building something most people never reach.`,
      type: "streak_milestone",
      priority: 75,
    };
  }

  // Priority 6: Strong streak
  if (stats.streak >= 5) {
    return {
      text: `${stats.streak} sessions without a miss. The system is compounding. Keep executing.`,
      type: "streak",
      priority: 60,
    };
  }

  // Priority 7: Readiness-based message
  if (readiness) {
    if (readiness.score >= 80) {
      return {
        text: `Readiness: ${readiness.score}%. Optimal state. Push hard today — your body can handle it.`,
        type: "readiness_high",
        priority: 55,
      };
    }
    if (readiness.score < 40) {
      return {
        text: `Readiness is low at ${readiness.score}%. Listening to your body today is the smart play.`,
        type: "readiness_low",
        priority: 55,
      };
    }
  }

  // Priority 8: Volume milestone
  if (stats.totalVolumeAllTime > 0) {
    const k = Math.round(stats.totalVolumeAllTime / 1000);
    if (k >= 100) {
      return {
        text: `${k.toLocaleString()}k lbs moved lifetime. Every rep is in the system.`,
        type: "volume_milestone",
        priority: 40,
      };
    }
  }

  // Priority 9: No check-ins nudge
  if (stats.checkInCount === 0 && stats.workoutCount > 0) {
    return {
      text: `Submit a check-in. The more data I have, the sharper I get.`,
      type: "nudge_checkin",
      priority: 30,
    };
  }

  // Priority 10: Fresh start / first workout
  if (stats.workoutCount === 0) {
    return {
      text: `Your system is initialized. First workout activates everything.`,
      type: "fresh",
      priority: 10,
    };
  }

  // Default: today's workout context
  if (dayData) {
    return {
      text: dayData.rest
        ? `Recovery day. Your muscles are rebuilding from the last session.`
        : `Day ${currentDay}: ${dayData.t}. ${dayData.x?.length || 0} exercises programmed.`,
      type: "today",
      priority: 5,
    };
  }

  return { text: "System active. All variables monitored.", type: "default", priority: 0 };
}

// ─── PERSONALITY-AWARE NOTIFICATION MESSAGES ─────────────────
// Context-sensitive, never generic. Reads real user data.

export function getGymArrivalMessage() {
  const stats = computeStats();
  const currentDay = storage.get("cd", 1);
  const dayData = DAYS[currentDay - 1];
  const readiness = computeReadinessScore();
  const fatigue = computeFatigueScore();

  if (!dayData || dayData.rest) {
    return { title: "Forge", body: "Rest day — recovery is part of the process. Light work only." };
  }

  // Contextual gym arrival messages based on real data
  if (stats.streak >= 7) {
    return { title: dayData.t, body: `${stats.streak}-session streak. ${dayData.x?.length || 0} exercises loaded. Let's keep it going.` };
  }

  if (readiness && readiness.score >= 80) {
    return { title: dayData.t, body: `Readiness at ${readiness.score}%. You're primed. Start when ready.` };
  }

  if (fatigue && fatigue.fatigue >= 70) {
    return { title: dayData.t, body: `Fatigue is elevated. Smart session today — focus on form, not ego.` };
  }

  const overload = getProgressiveOverloadTargets(currentDay);
  if (overload) {
    const ready = overload.filter((t) => t.shouldIncrease);
    if (ready.length > 0) {
      return { title: dayData.t, body: `${ready[0].name} is ready for more weight. Time to grow.` };
    }
  }

  // Defaults based on data profile
  const messages = [
    { title: dayData.t, body: `${dayData.x?.length || 0} exercises. ~${dayData.m} minutes. Your program is ready.` },
    { title: dayData.t, body: `Walk in. Press start. The system handles the rest.` },
    { title: "Forge", body: `Day ${currentDay} is programmed. Every set, every rep, every rest period. Go.` },
  ];

  return messages[stats.workoutCount % messages.length];
}

// ─── PERIODIC COACHING NUDGES ────────────────────────────────

export function getScheduledNudge() {
  const stats = computeStats();
  const checkIns = getAllCheckIns();
  const hour = new Date().getHours();

  // Morning nudge (8-10 AM)
  if (hour >= 8 && hour <= 10) {
    if (stats.streak > 0) {
      return { title: "Forge", body: `Day ${stats.streak + 1} of your streak. Don't break the chain.` };
    }
    if (stats.workoutCount > 0 && stats.streak === 0) {
      return { title: "Forge", body: "Your streak reset. Today is day one again. Show up." };
    }
  }

  // Evening nudge (7-9 PM) — check-in reminder
  if (hour >= 19 && hour <= 21) {
    const todayKey = new Date().toISOString().split("T")[0];
    const todayCheckIn = checkIns.find(
      (c) => new Date(c.timestamp).toISOString().split("T")[0] === todayKey
    );
    if (!todayCheckIn) {
      return { title: "Forge", body: "End-of-day check-in. Sleep, stress, energy — your data shapes tomorrow's plan." };
    }
  }

  // Meal timing nudges
  if (hour >= 12 && hour <= 13) {
    const todayKey = new Date().toISOString().split("T")[0];
    const meals = storage.get("mc_" + todayKey, {});
    const done = Object.values(meals).filter(Boolean).length;
    if (done < 2) {
      return { title: "Forge", body: `${done}/5 meals logged. Protein doesn't eat itself. Stay on plan.` };
    }
  }

  return null;
}
