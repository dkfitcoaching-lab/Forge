// ══════════════════════════════════════════════════════════════
// FORGE CONFIG — Dynamic Strings & Feature Flags
// All client-facing text, labels, and feature toggles live here.
// When Michael integrates the backend, these values get replaced
// by database lookups or API responses. Everything in the app
// reads from this config — change it here, it changes everywhere.
// ══════════════════════════════════════════════════════════════

const CONFIG = {
  // ─── BRAND ─────────────────────────────────────────────────
  brand: {
    name: "Forge",
    tagline: "Performance System",
    domain: "fitnessforge.ai",
    logoText: "Fe",                    // Periodic table logo text
    logoSub: "26",                     // Periodic table number
  },

  // ─── CLIENT PROFILE DEFAULTS ───────────────────────────────
  // These are overwritten when a real user signs in via backend auth
  profile: {
    defaultName: "Athlete",            // Shown in hero greeting
    defaultTitle: "PREMIUM MEMBER",    // Shown under profile name
    defaultAvatar: "F",                // Fallback avatar letter
  },

  // ─── TIER DEFINITIONS ─────────────────────────────────────
  // Structure: { id, name, monthlyPrice, yearlyPrice, features[], limits }
  // Backend replaces this with Stripe product IDs and real pricing
  tiers: {
    forge: {
      id: "forge",
      name: "FORGE",
      monthlyPrice: 14.99,
      yearlyPrice: 9.99,
      coachMessagesPerDay: 20,
      photoUploadsPerDay: 5,
      features: ["workouts", "nutrition", "checkins", "photos", "prs"],
    },
    pro: {
      id: "pro",
      name: "FORGE PRO",
      monthlyPrice: 29.99,
      yearlyPrice: 19.99,
      coachMessagesPerDay: -1,         // unlimited
      photoUploadsPerDay: -1,
      features: ["workouts", "nutrition", "checkins", "photos", "prs", "coach", "tts", "voice", "fatigue", "overload", "heatmap", "weekly_report"],
    },
    elite: {
      id: "elite",
      name: "FORGE ELITE",
      monthlyPrice: 49.99,
      yearlyPrice: 34.99,
      coachMessagesPerDay: -1,
      photoUploadsPerDay: -1,
      features: ["workouts", "nutrition", "checkins", "photos", "prs", "coach", "tts", "voice", "fatigue", "overload", "heatmap", "weekly_report", "human_coach", "custom_program", "video_analysis", "leaderboard"],
    },
  },

  // ─── API TOKEN COST MODEL ──────────────────────────────────
  // Used for usage metering and profit margin calculations.
  // Based on Claude API pricing (Sonnet 4.6 for coach, Haiku for quick).
  // Backend will meter actual usage — this is for estimation & UI display.
  apiCosts: {
    coachModel: "claude-sonnet-4-6",
    quickModel: "claude-haiku-4-5-20251001",
    inputTokenCostPer1M: 3.00,         // $/1M input tokens (Sonnet)
    outputTokenCostPer1M: 15.00,       // $/1M output tokens (Sonnet)
    avgInputTokensPerMessage: 2000,    // user context + history
    avgOutputTokensPerMessage: 500,    // coach response
    // Estimated cost per coach message:
    // Input: 2000/1M * $3 = $0.006
    // Output: 500/1M * $15 = $0.0075
    // Total per message: ~$0.0135
    // At 20 msgs/day for Forge tier: ~$0.27/day = ~$8.10/month
    // At unlimited (avg 40/day) for Pro: ~$0.54/day = ~$16.20/month
    // Pro at $29.99 - $16.20 API = ~$13.79 margin/user/month (46%)
    // Forge at $14.99 - $8.10 API = ~$6.89 margin/user/month (46%)
    // Elite at $49.99 - $16.20 API - ~$5 human coach time = ~$28.79 margin (58%)
    visionCostPerImage: 0.005,         // Claude Vision per image
  },

  // ─── PROGRAM ARCHITECTURE ──────────────────────────────────
  // Defines the training split structure. When backend is live,
  // this gets replaced per-client based on their coach's programming.
  // The UI derives ALL cycle logic from these values — nothing hardcoded.
  program: {
    cycleLength: 14,                   // total days in one cycle
    restDays: [7, 14],                 // which day numbers are rest days
    get trainingDaysPerCycle() {
      return this.cycleLength - this.restDays.length;
    },
    deloadEveryNCycles: 5,             // deload frequency
    deloadVolumeReduction: 0.4,        // 40% volume reduction on deload
    minCyclesBeforeChange: 5,          // minimum cycles before program changes
  },

  // ─── FEATURE FLAGS ─────────────────────────────────────────
  // Toggle features on/off globally. Backend can override per-user.
  features: {
    tts: true,                         // Text-to-speech on coach messages
    voiceInput: true,                  // Mic button for voice input
    locationServices: true,            // Geo-fence gym detection
    gymArrivalNotifications: true,     // Notify on gym arrival
    autoLaunchWorkout: true,           // Auto-open workout on arrival
    proactiveIntelligence: true,       // Intelligence line on home screen
    coachPhotoUpload: true,            // Photo upload in coach chat
    hapticFeedback: true,              // navigator.vibrate() on actions
    leaderboard: false,                // Not yet built — needs backend
    weeklyReport: false,               // Not yet built
    communityProfiles: false,          // Not yet built
    videoAnalysis: false,              // Needs Claude Vision API
  },

  // ─── NOTIFICATION COPY ─────────────────────────────────────
  // Personality-aware notification templates. Backend can A/B test these.
  notifications: {
    gymArrival: [
      "Walk in. Press start. The system handles the rest.",
      "Your workout is loaded and waiting. Go.",
      "The gym is where theory becomes reality. Let's work.",
    ],
    streakReminder: [
      "Don't break the chain.",
      "Your streak is your proof. Protect it.",
      "Consistency compounds. Show up.",
    ],
    mealReminder: [
      "Protein doesn't eat itself. Stay on plan.",
      "Your macros are waiting. Fuel the machine.",
      "Nutrition is recovery. Don't skip it.",
    ],
    checkInReminder: [
      "End-of-day check-in. Your data shapes tomorrow's plan.",
      "Sleep, stress, energy — log it. Your coach needs this.",
      "The more signals I have, the sharper I get.",
    ],
    restDay: [
      "Rest day. Growth happens now, not in the gym.",
      "Recovery is non-negotiable. Light work only.",
      "Your muscles are rebuilding. Trust the process.",
    ],
  },

  // ─── COACH PERSONALITY ─────────────────────────────────────
  // Tone and style parameters for AI coach responses.
  // Backend can adjust per-client based on their personality profile.
  coachPersonality: {
    tone: "direct",                    // "direct", "supportive", "drill-sergeant", "analytical"
    formality: "low",                  // "low" = conversational, "high" = clinical
    motivationStyle: "data-driven",    // "data-driven", "emotional", "competitive"
    useFirstPerson: true,              // "I've been tracking..." vs "The system has tracked..."
    maxResponseLength: 300,            // words — keep it tight
  },
};

export default CONFIG;
