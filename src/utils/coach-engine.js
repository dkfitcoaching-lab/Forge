import {
  computeStats,
  computeReadinessScore,
  computeFatigueScore,
  getProgressiveOverloadTargets,
  getAllCheckIns,
  getWorkoutHistory,
} from "./analytics";
import DAYS from "../data/workouts";
import storage from "./storage";

// ══════════════════════════════════════════════════════════════
// FORGE COACH ENGINE
// Intelligent response system that reads actual user data
// ══════════════════════════════════════════════════════════════

function analyzeUserState() {
  const stats = computeStats();
  const readiness = computeReadinessScore();
  const fatigue = computeFatigueScore();
  const currentDay = storage.get("cd", 1);
  const dayData = DAYS[currentDay - 1];
  const checkIns = getAllCheckIns();
  const history = getWorkoutHistory();
  const overloadTargets = getProgressiveOverloadTargets(currentDay);

  const lastCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1] : null;
  const recentCheckIns = checkIns.slice(-7);

  // Compute specific insights
  const insights = [];

  // Sleep analysis
  if (recentCheckIns.length >= 3) {
    const avgSleep = recentCheckIns.reduce((s, c) => s + (c.sl || 0), 0) / recentCheckIns.length;
    if (avgSleep < 3) insights.push({ type: "sleep_low", avgSleep: Math.round(avgSleep * 10) / 10 });
    else if (avgSleep >= 4) insights.push({ type: "sleep_good", avgSleep: Math.round(avgSleep * 10) / 10 });
  }

  // Stress analysis
  if (recentCheckIns.length >= 3) {
    const avgStress = recentCheckIns.reduce((s, c) => s + (c.st || 0), 0) / recentCheckIns.length;
    if (avgStress > 3.5) insights.push({ type: "stress_high", avgStress: Math.round(avgStress * 10) / 10 });
  }

  // Volume trends
  if (history.length >= 3) {
    const recentVolumes = history.slice(-3).map((h) => h.totalVolume || 0);
    const trend = recentVolumes[2] - recentVolumes[0];
    if (trend > 0) insights.push({ type: "volume_up", delta: trend });
    else if (trend < -1000) insights.push({ type: "volume_down", delta: Math.abs(trend) });
  }

  // Streak
  if (stats.streak >= 5) insights.push({ type: "streak_strong", streak: stats.streak });
  if (stats.streak === 0 && stats.workoutCount > 0) insights.push({ type: "streak_broken" });

  // Overload opportunities
  if (overloadTargets) {
    const increases = overloadTargets.filter((t) => t.shouldIncrease);
    if (increases.length > 0) insights.push({ type: "overload_ready", exercises: increases });
  }

  // Fatigue
  if (fatigue && fatigue.fatigue >= 75) insights.push({ type: "fatigue_high", fatigue });
  if (fatigue && fatigue.fatigue < 25) insights.push({ type: "fatigue_low", fatigue });

  // Check-in consistency
  if (stats.checkInCount === 0) insights.push({ type: "no_checkins" });

  // Cycle progress
  if (stats.cyclesCompleted > 0) insights.push({ type: "cycles", count: stats.cyclesCompleted });

  return {
    stats,
    readiness,
    fatigue,
    currentDay,
    dayData,
    lastCheckIn,
    insights,
    overloadTargets,
    history,
  };
}

function generateResponse(userMessage, state) {
  const msg = userMessage.toLowerCase();

  // PDF / program document request
  if (msg.includes("pdf") || msg.includes("program document") || msg.includes("generate my program") || msg.includes("print my program") || msg.includes("download my program") || msg.includes("full program")) {
    return "You can generate your complete program document from the **Program** tab. Tap **Generate Program PDF** — you'll be able to select which sections to include (training, nutrition, supplements, cardio, recovery, posing) and save it as a PDF. It's customized to your profile and includes your personal records.";
  }

  // Weight / body composition questions
  if (msg.includes("weight") || msg.includes("body") || msg.includes("scale")) {
    if (state.stats.weightTrend.length >= 2) {
      const first = state.stats.weightTrend[0].weight;
      const last = state.stats.weightTrend[state.stats.weightTrend.length - 1].weight;
      const delta = Math.round((last - first) * 10) / 10;
      const dir = delta > 0 ? "up" : delta < 0 ? "down" : "stable";
      return `Your weight has trended ${dir} ${Math.abs(delta)} lbs over ${state.stats.weightTrend.length} check-ins (${first} → ${last} lbs). ${
        dir === "up"
          ? "If gaining was the goal, you're on track. If not, consider reducing daily calories by 200 and reassessing in 7 days."
          : dir === "down"
          ? "You're losing weight. Make sure protein stays at 212g+ to preserve muscle. If the cut is too aggressive, add 150 calories from carbs."
          : "Weight is stable. If you want to progress, either add 200 calories or increase training volume by 10%."
      }`;
    }
    return "I don't have enough weight data yet. Submit daily check-ins with your weight so I can track your trend and give you real recommendations.";
  }

  // Sleep questions
  if (msg.includes("sleep") || msg.includes("tired") || msg.includes("rest")) {
    const sleepInsight = state.insights.find((i) => i.type === "sleep_low" || i.type === "sleep_good");
    if (sleepInsight) {
      return sleepInsight.type === "sleep_low"
        ? `Your sleep quality has been averaging ${sleepInsight.avgSleep}/5 over the last week. This is limiting your recovery. Prioritize: 1) No screens 30 min before bed, 2) Consistent sleep/wake times, 3) Room temp 65-68°F. Sleep is where gains happen — this is your #1 bottleneck right now.`
        : `Sleep quality looks solid at ${sleepInsight.avgSleep}/5. Keep doing what you're doing. This is fueling your recovery well.`;
    }
    return "Sleep is critical — aim for 7-9 hours with consistent timing. I need check-in data to analyze your sleep patterns. Submit daily check-ins and I'll give you specific feedback.";
  }

  // Workout / training questions
  if (msg.includes("workout") || msg.includes("train") || msg.includes("session") || msg.includes("exercise")) {
    const parts = [];
    if (state.dayData) {
      parts.push(`Today is Day ${state.currentDay}: ${state.dayData.t}.`);
      if (state.dayData.rest) {
        parts.push("It's a rest day. Recovery is non-negotiable — light walking or stretching only.");
      } else {
        parts.push(`${state.dayData.x.length} exercises, ~${state.dayData.m} min.`);
      }
    }
    if (state.stats.workoutCount > 0) {
      parts.push(`You've completed ${state.stats.workoutCount} workouts total.`);
    }
    if (state.overloadTargets && state.overloadTargets.length > 0) {
      const increases = state.overloadTargets.filter((t) => t.shouldIncrease);
      if (increases.length > 0) {
        parts.push(`Progressive overload: ${increases.map((t) => t.name).join(", ")} are ready for a weight increase.`);
      }
    }
    return parts.join(" ") || "Your training data will build over time. Complete workouts and I'll track your progression automatically.";
  }

  // Fatigue questions
  if (msg.includes("fatigue") || msg.includes("overtraining") || msg.includes("deload") || msg.includes("recovery")) {
    if (state.fatigue) {
      return `Current fatigue level: ${state.fatigue.fatigue}% — ${state.fatigue.label}. Training density: ${state.fatigue.density} sessions/week. Volume trend: ${state.fatigue.volumeTrend}% of average. ${
        state.fatigue.fatigue >= 75
          ? "I'd recommend a deload week: same exercises, 60% of your working weights, cut sets by 40%."
          : state.fatigue.fatigue < 25
          ? "You're well-recovered. Consider adding an extra working set on your compound movements this week."
          : "You're in a good training zone. Keep pushing but monitor your check-in scores."
      }`;
    }
    return "I need at least 3 logged workouts to compute your fatigue model. Keep training and logging, and I'll track your recovery status.";
  }

  // Nutrition questions
  if (msg.includes("nutrition") || msg.includes("meal") || msg.includes("eat") || msg.includes("diet") || msg.includes("calori") || msg.includes("protein") || msg.includes("macro")) {
    const mealKey = "mc_" + new Date().toISOString().split("T")[0];
    const mealsChecked = storage.get(mealKey, {});
    const completed = Object.values(mealsChecked).filter(Boolean).length;
    return `Today's meal completion: ${completed}/5. Target: 2,500 cal (P: 212g, C: 277g, F: 59g). ${
      completed < 3
        ? "You're behind on meals. Prioritize hitting your protein target — this is the most critical macro for muscle retention and growth. Consider prepping meals the night before."
        : completed >= 5
        ? "All meals completed today. Excellent adherence. This consistency is what separates those who transform from those who don't."
        : "Good progress on meals today. Make sure the remaining meals are prepped and ready to go."
    }`;
  }

  // Progress questions
  if (msg.includes("progress") || msg.includes("how am i") || msg.includes("stats") || msg.includes("results")) {
    const parts = [`Here's your current state:`];
    parts.push(`Workouts: ${state.stats.workoutCount} | Streak: ${state.stats.streak} | Check-ins: ${state.stats.checkInCount}`);
    if (state.stats.totalVolumeAllTime > 0) {
      parts.push(`Total volume moved: ${state.stats.totalVolumeAllTime.toLocaleString()} lbs`);
    }
    if (state.readiness) {
      parts.push(`Readiness: ${state.readiness.score}% (${state.readiness.label})`);
    }
    if (state.stats.cyclesCompleted > 0) {
      parts.push(`Cycles completed: ${state.stats.cyclesCompleted}`);
    }
    parts.push(state.stats.workoutCount < 5
      ? "You're early in the process. Trust the system and focus on consistency over the next 4 weeks."
      : state.stats.streak >= 5
      ? "Your consistency is outstanding. Keep this momentum and the results will compound."
      : "Focus on building a streak. Consistent training is more important than perfect training.");
    return parts.join("\n");
  }

  // Supplement questions
  if (msg.includes("supplement") || msg.includes("creatine") || msg.includes("whey") || msg.includes("vitamin")) {
    return "Your supplement stack: Creatine 5g (daily, never skip — the most researched supplement in existence), Whey 1.5 scoops (for protein convenience), Multivitamin (insurance policy), Fish Oil 2g (anti-inflammatory), Magnesium 400mg (sleep and recovery). Take creatine every day including rest days. Whey is best post-workout or with meals where you need a protein boost.";
  }

  // General / catch-all with intelligence
  const topInsight = state.insights[0];
  if (topInsight) {
    switch (topInsight.type) {
      case "sleep_low":
        return `Based on your recent data, sleep quality is your main limiter right now (averaging ${topInsight.avgSleep}/5). Everything else — training, nutrition, recovery — depends on this. Make sleep your #1 priority this week.`;
      case "stress_high":
        return `Your stress levels have been elevated (averaging ${topInsight.avgStress}/5). High cortisol impairs recovery and muscle growth. Consider: reducing training volume by 20% this week, adding 10 min daily meditation, and ensuring you're not in a caloric deficit.`;
      case "overload_ready":
        return `Progressive overload opportunity detected. These exercises are ready for a weight increase: ${topInsight.exercises.map((e) => e.name).join(", ")}. Increase by 5 lbs and aim for the bottom of your rep range.`;
      case "fatigue_high":
        return `Your fatigue model shows ${topInsight.fatigue.fatigue}% accumulation. Consider a deload: same exercises, 60% working weight, 40% fewer sets. This isn't weakness — it's smart programming.`;
      case "streak_strong":
        return `${topInsight.streak}-session streak. This level of consistency is rare. Your body is adapting and the results are compounding. Don't change anything — keep executing.`;
      case "streak_broken":
        return "Your streak was broken. Don't spiral — one missed session is noise, two missed sessions is a pattern. Get back on track today. The best workout is the one you actually do.";
      case "no_checkins":
        return "You haven't submitted any daily check-ins yet. These are critical — I use sleep, stress, energy, and weight data to personalize your recommendations. Go to Check-In and log today's data.";
      default:
        break;
    }
  }

  return `I have ${state.stats.workoutCount} workouts and ${state.stats.checkInCount} check-ins in your training log. ${
    state.stats.workoutCount === 0
      ? "Start your first workout and I'll begin tracking everything automatically. Ask me about nutrition, recovery, or your training program."
      : "Ask me about your progress, nutrition, fatigue, sleep, or specific exercises and I'll give you data-driven recommendations."
  }`;
}

export function getCoachResponse(userMessage) {
  const state = analyzeUserState();
  return generateResponse(userMessage, state);
}

export function getProactiveInsight() {
  const state = analyzeUserState();
  if (state.insights.length === 0) {
    return "Welcome. Complete workouts and check-ins to unlock personalized coaching insights.";
  }

  const insight = state.insights[0];
  switch (insight.type) {
    case "sleep_low":
      return `Sleep quality low (${insight.avgSleep}/5). This is limiting recovery.`;
    case "stress_high":
      return `Stress elevated (${insight.avgStress}/5). Consider adjusting volume.`;
    case "overload_ready":
      return `${insight.exercises.length} exercise(s) ready for progressive overload.`;
    case "fatigue_high":
      return `Fatigue at ${insight.fatigue.fatigue}%. Deload may be beneficial.`;
    case "streak_strong":
      return `${insight.streak}-session streak. Outstanding consistency.`;
    case "no_checkins":
      return "Submit your first check-in to unlock personalized insights.";
    default:
      return `${state.stats.workoutCount} workouts logged. Keep building.`;
  }
}
