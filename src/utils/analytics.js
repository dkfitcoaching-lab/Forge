import storage from "./storage";
import DAYS from "../data/workouts";

// ══════════════════════════════════════════════════════════════
// FORGE ANALYTICS ENGINE
// Computes real stats from all stored user data
// ══════════════════════════════════════════════════════════════

export function getAllCheckIns() {
  const checkIns = [];
  const keys = Object.keys(localStorage).filter(
    (k) => k.startsWith("f_ci_")
  );
  keys.forEach((k) => {
    try {
      const ts = Number(k.replace("f_ci_", ""));
      const data = JSON.parse(localStorage.getItem(k));
      if (data) checkIns.push({ ...data, timestamp: ts, date: new Date(ts) });
    } catch {}
  });
  return checkIns.sort((a, b) => a.timestamp - b.timestamp);
}

export function getWorkoutHistory() {
  const history = [];
  const keys = Object.keys(localStorage).filter(
    (k) => k.startsWith("f_wh_")
  );
  keys.forEach((k) => {
    try {
      const data = JSON.parse(localStorage.getItem(k));
      if (data) history.push(data);
    } catch {}
  });
  return history.sort((a, b) => a.timestamp - b.timestamp);
}

export function getWorkoutVolumeForDay(dayNum) {
  const tracked = storage.get(`wp_${dayNum}`, {});
  let totalVolume = 0;
  let totalSets = 0;
  const lifts = {};

  Object.entries(tracked).forEach(([key, val]) => {
    if (key.endsWith("_w")) {
      const repsKey = key.replace("_w", "_r");
      const reps = tracked[repsKey];
      if (val && reps) {
        const v = Number(val) * Number(reps);
        totalVolume += v;
        totalSets++;
        const exIdx = key.split("_")[0];
        if (!lifts[exIdx]) lifts[exIdx] = [];
        lifts[exIdx].push({ weight: Number(val), reps: Number(reps), volume: v });
      }
    }
  });

  return { totalVolume, totalSets, lifts };
}

export function getAllPersonalRecords() {
  const prs = {};
  const history = getWorkoutHistory();

  history.forEach((session) => {
    if (!session.exercises) return;
    session.exercises.forEach((ex) => {
      if (!ex.name || !ex.sets) return;
      ex.sets.forEach((set) => {
        if (!set.weight || !set.reps) return;
        const key = ex.name;
        const w = Number(set.weight);
        const r = Number(set.reps);
        const estimated1RM = w * (1 + r / 30); // Epley formula
        const volume = w * r;

        if (!prs[key]) {
          prs[key] = { maxWeight: 0, maxVolume: 0, max1RM: 0, lastDate: null };
        }
        if (w > prs[key].maxWeight) prs[key].maxWeight = w;
        if (volume > prs[key].maxVolume) prs[key].maxVolume = volume;
        if (estimated1RM > prs[key].max1RM) prs[key].max1RM = estimated1RM;
        prs[key].lastDate = session.timestamp;
      });
    });
  });

  // Convert to sorted array for display
  return Object.entries(prs)
    .map(([exercise, data]) => ({
      exercise,
      type: `Est 1RM: ${Math.round(data.max1RM)} lbs`,
      value: `${data.maxWeight} lbs`,
      max1RM: data.max1RM,
      maxVolume: data.maxVolume,
      lastDate: data.lastDate,
    }))
    .sort((a, b) => b.max1RM - a.max1RM);
}

export function computeStats() {
  const checkIns = getAllCheckIns();
  const history = getWorkoutHistory();

  // Workout count
  const workoutCount = history.length;

  // Streak calculation
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 86400000;

  if (history.length > 0) {
    const sortedDates = [...new Set(
      history.map((h) => {
        const d = new Date(h.timestamp);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    )].sort((a, b) => b - a);

    // Check if most recent workout was today or yesterday
    if (sortedDates[0] >= today.getTime() - dayMs) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = sortedDates[i - 1] - sortedDates[i];
        // Allow up to 2 days gap (for rest days in the program)
        if (diff <= dayMs * 2) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  // Check-in count
  const checkInCount = checkIns.length;

  // Average readiness from last 7 check-ins
  const recent = checkIns.slice(-7);
  let avgReadiness = 0;
  if (recent.length > 0) {
    avgReadiness = Math.round(
      recent.reduce((sum, ci) => {
        const avg = (ci.sl + ci.en + (11 - ci.st) + ci.dg + ci.ad) / 5;
        return sum + avg;
      }, 0) / recent.length
    );
  }

  // Total volume moved all-time
  const totalVolumeAllTime = history.reduce((sum, h) => sum + (h.totalVolume || 0), 0);

  // Weight trend from check-ins
  const weightEntries = checkIns.filter((ci) => ci.wt && Number(ci.wt) > 0);
  const weightTrend = weightEntries.map((ci) => ({
    date: ci.date,
    weight: Number(ci.wt),
  }));

  // Muscle group volume map (for heat map)
  const muscleVolume = computeMuscleVolume(history);

  // Cycles completed
  const cyclesCompleted = Math.floor(workoutCount / 12); // 12 training days per cycle

  return {
    workoutCount,
    streak,
    checkInCount,
    avgReadiness,
    totalVolumeAllTime,
    weightTrend,
    muscleVolume,
    cyclesCompleted,
    lastWorkout: history.length > 0 ? history[history.length - 1] : null,
  };
}

const MUSCLE_MAP = {
  "HAMSTRINGS + GLUTES": { hamstrings: 0.5, glutes: 0.5 },
  "CHEST + SIDE DELTS": { chest: 0.6, shoulders: 0.4 },
  "BACK + REAR DELTS": { back: 0.7, shoulders: 0.3 },
  "QUADS + CALVES": { quads: 0.6, calves: 0.4 },
  "ARMS": { biceps: 0.5, triceps: 0.5 },
  "SHOULDERS + TRAPS": { shoulders: 0.5, traps: 0.5 },
};

function computeMuscleVolume(history) {
  const volume = {
    chest: 0, back: 0, shoulders: 0, biceps: 0, triceps: 0,
    quads: 0, hamstrings: 0, glutes: 0, calves: 0, traps: 0,
  };

  history.forEach((session) => {
    const map = MUSCLE_MAP[session.dayTitle];
    if (!map) return;
    const v = session.totalVolume || 0;
    Object.entries(map).forEach(([muscle, ratio]) => {
      volume[muscle] += v * ratio;
    });
  });

  return volume;
}

export function computeReadinessScore() {
  const checkIns = getAllCheckIns();
  if (checkIns.length === 0) return null;

  const latest = checkIns[checkIns.length - 1];
  const sleep = latest.sl || 0;
  const stress = latest.st || 0;
  const energy = latest.en || 0;
  const digestion = latest.dg || 0;
  const adherence = latest.ad || 0;

  // Weighted readiness: sleep and energy matter most
  // Scale is 1-10 for each metric, stress is inverted (11-stress)
  const raw = (sleep * 0.3 + energy * 0.25 + (11 - stress) * 0.2 + digestion * 0.15 + adherence * 0.1);
  const score = Math.min(100, Math.max(0, Math.round(raw * 10)));

  const label =
    score >= 80 ? "OPTIMAL" :
    score >= 60 ? "GOOD" :
    score >= 40 ? "MODERATE" : "LOW";

  const color =
    score >= 80 ? "ok" :
    score >= 60 ? "accent" :
    score >= 40 ? "accentDark" : "warn";

  return { score, label, color, data: latest };
}

export function getProgressiveOverloadTargets(dayNum) {
  const dayData = DAYS[dayNum - 1];
  if (!dayData || dayData.rest) return null;

  const tracked = storage.get(`wp_${dayNum}`, {});
  const targets = [];

  dayData.x.forEach((exercise, exIdx) => {
    const sets = [];
    let hasData = false;
    for (let s = 0; s < exercise.ns; s++) {
      const w = tracked[`${exIdx}_${s}_w`];
      const r = tracked[`${exIdx}_${s}_r`];
      if (w && r) {
        hasData = true;
        sets.push({ weight: Number(w), reps: Number(r) });
      }
    }

    if (hasData) {
      // Parse target rep range
      const match = exercise.s.match(/(\d+)x(\d+)(?:-(\d+))?/);
      if (match) {
        const targetReps = match[3] ? Number(match[3]) : Number(match[2]);
        const allHitTop = sets.every((s) => s.reps >= targetReps);

        targets.push({
          name: exercise.n,
          currentSets: sets,
          recommendation: allHitTop
            ? `Increase weight by 5 lbs (hit ${targetReps} reps on all sets)`
            : `Stay at current weight (target: ${targetReps} reps per set)`,
          shouldIncrease: allHitTop,
        });
      }
    }
  });

  return targets;
}

export function computeFatigueScore() {
  const history = getWorkoutHistory();
  if (history.length < 3) return null;

  const recent = history.slice(-5);
  const now = Date.now();
  const dayMs = 86400000;

  // Compute training density (sessions per week recently)
  const span = (now - recent[0].timestamp) / dayMs;
  const density = recent.length / Math.max(span / 7, 1);

  // Compute volume trend (increasing = more fatigue)
  const volumes = recent.map((h) => h.totalVolume || 0);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const lastVolume = volumes[volumes.length - 1] || 0;
  const volumeTrend = lastVolume / Math.max(avgVolume, 1);

  // Fatigue model: density * volume trend * recency
  const daysSinceLastWorkout = (now - recent[recent.length - 1].timestamp) / dayMs;
  const recencyFactor = Math.max(0, 1 - daysSinceLastWorkout / 3);

  const rawFatigue = density * volumeTrend * recencyFactor * 25;
  const fatigue = Math.min(100, Math.max(0, Math.round(rawFatigue)));

  const label =
    fatigue >= 75 ? "HIGH — Consider deload" :
    fatigue >= 50 ? "MODERATE — Training well" :
    fatigue >= 25 ? "LOW — Room to push" : "FRESH — Ready to go";

  return { fatigue, label, density: Math.round(density * 10) / 10, volumeTrend: Math.round(volumeTrend * 100) };
}

export function detectNewPRs(sessionData) {
  const history = getWorkoutHistory();
  const newPRs = [];

  if (!sessionData.exercises) return newPRs;

  sessionData.exercises.forEach((ex) => {
    if (!ex.sets) return;

    // Find previous best for this exercise
    let prevMaxWeight = 0;
    let prevMaxVolume = 0;

    history.forEach((session) => {
      if (!session.exercises) return;
      session.exercises.forEach((prevEx) => {
        if (prevEx.name !== ex.name || !prevEx.sets) return;
        prevEx.sets.forEach((s) => {
          if (s.weight) prevMaxWeight = Math.max(prevMaxWeight, Number(s.weight));
          if (s.weight && s.reps) prevMaxVolume = Math.max(prevMaxVolume, Number(s.weight) * Number(s.reps));
        });
      });
    });

    ex.sets.forEach((set) => {
      if (!set.weight || !set.reps) return;
      const w = Number(set.weight);
      const v = w * Number(set.reps);
      if (w > prevMaxWeight && prevMaxWeight > 0) {
        newPRs.push({ exercise: ex.name, type: "WEIGHT", value: `${w} lbs`, prev: `${prevMaxWeight} lbs` });
      }
      if (v > prevMaxVolume && prevMaxVolume > 0) {
        newPRs.push({ exercise: ex.name, type: "VOLUME", value: `${v} lbs`, prev: `${prevMaxVolume} lbs` });
      }
    });
  });

  return newPRs;
}
