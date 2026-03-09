# FORGE V5 CINEMA — Development Handoff

## What This Is
A premium fitness coaching app built in React + Vite. Dark-themed, mobile-first, with a 14-day rotating workout split, nutrition tracking, AI coach, and analytics.

## Tech Stack
- **React 19** + **Vite** (no routing library — custom view state management in App.jsx)
- **Pure CSS-in-JS** via template literals in `src/utils/css.js`
- **Zero dependencies** beyond React (charts are pure SVG, animations are CSS)
- **localStorage** for all persistence (prefix: `f_`)

## Architecture

```
src/
├── App.jsx                          # Root: screen/tab/view state, navigation
├── components/
│   ├── Primitives.jsx               # Card, Button, Label, RatingInput, NavIcons, StaggerItem
│   ├── WorkoutPlayer.jsx            # Full-screen workout tracking + PR detection
│   ├── CoachPanel.jsx               # Intelligent coach panel (reads real user data)
│   ├── Charts.jsx                   # Pure SVG: BarChart, LineChart, RadialProgress, MiniSparkline, MacroRing
│   ├── BodyHeatMap.jsx              # Muscle volume distribution visualization
│   ├── Celebration.jsx              # Particle burst, PR badges, ReadinessGauge, StreakFlame
│   └── ProgressPhotos.jsx           # Camera capture, timeline, side-by-side comparison
├── views/
│   ├── TodayView.jsx                # Dashboard: readiness, workout card, meals, water, supplements, stats
│   ├── DataView.jsx                 # Analytics: fatigue model, volume charts, weight trend, muscle heat map
│   ├── GuideView.jsx                # Program guide with expandable sections
│   ├── VolumeLog.jsx                # Per-session volume tracking
│   ├── CheckIn.jsx                  # Daily check-in with history + trend sparklines
│   ├── ProfileView.jsx              # Themes, stats, notifications, data export, reset
│   ├── LoginScreen.jsx              # Entry screen
│   └── OnboardingScreen.jsx         # 4-step onboarding
├── data/
│   ├── themes.js                    # 6 themes: forge, obsidian, ember, arctic, crimson, gold
│   ├── workouts.js                  # Full 14-day split with exercises, sets, cues
│   ├── nutrition.js                 # 5 meals, macro caps, supplements
│   └── guide.js                     # Program guide content
└── utils/
    ├── storage.js                   # localStorage wrapper (prefix: f_)
    ├── css.js                       # Dynamic CSS with font imports + animations
    ├── hooks.js                     # useStaggeredReveal
    ├── helpers.js                   # formatTime, formatDate
    ├── analytics.js                 # CORE: stats, PRs, fatigue model, readiness, muscle volume, overload
    └── coach-engine.js              # Intelligent coach: analyzes user state, generates contextual responses
```

## Key Systems Built

### Analytics Engine (`analytics.js`)
- `computeStats()` — workout count, streak, check-in count, total volume, weight trend, muscle volume, cycles
- `computeReadinessScore()` — weighted score from sleep/energy/stress/digestion/adherence
- `computeFatigueScore()` — training density × volume trend × recency factor
- `getProgressiveOverloadTargets()` — detects when exercises are ready for weight increase
- `detectNewPRs()` — compares current session to all history, finds weight/volume PRs
- `getAllPersonalRecords()` — Epley formula estimated 1RM, max weight, max volume per exercise

### Coach Engine (`coach-engine.js`)
- Reads ALL user data: workouts, check-ins, meals, supplements, volume
- Generates contextual responses for: weight, sleep, fatigue, nutrition, progress, supplements
- Proactive insights based on data anomalies
- Quick prompt buttons for common queries

### Storage Keys
- `f_cd` — current cycle day (1-14)
- `f_wp_{dayNum}` — workout tracking data per day
- `f_wh_{timestamp}` — workout history entries
- `f_ci_{timestamp}` — check-in entries
- `f_mc_{dateString}` — meal completion per day
- `f_wt_{dateString}` — water count per day
- `f_sp_{dateString}` — supplement checks per day
- `f_th` — theme ID
- `f_lg` — logged in
- `f_ob` — onboarding complete
- `f_nf` — notification settings
- `f_photos` — progress photo data (base64)

## What's Next (Priority Order)

### HIGH PRIORITY
1. **Backend / Cloud Sync** — localStorage is fragile. Add Supabase or Firebase for data persistence and cross-device sync
2. **PWA Support** — Add service worker, manifest.json, offline support. This should be installable on phones
3. **Real Authentication** — Replace the placeholder login with actual auth (Google/Apple sign-in)
4. **Workout Timer** — Add a visible running clock overlay during active workout

### MEDIUM PRIORITY
5. **Historical Comparison** — Show previous session's weight/reps next to current input fields in WorkoutPlayer
6. **Custom Exercises** — Allow users to modify the workout program
7. **Rest Day Activities** — Guided stretching/mobility routines for rest days
8. **Weekly Summary Report** — Auto-generated weekly progress report
9. **Notification System** — Push notifications for meal timing, workout reminders

### POLISH
10. **Haptic Feedback** — Add navigator.vibrate() on set completion, PR detection
11. **Sound Effects** — Completion sounds, rest timer countdown beeps
12. **Gesture Navigation** — Swipe between exercises in WorkoutPlayer
13. **Animated Page Transitions** — Spring-physics transitions between views
14. **Dark/Light Mode** — All 6 themes currently dark; add light variants
15. **Accessibility** — ARIA labels, keyboard navigation, screen reader support

## Build Commands
```bash
npm install        # Install dependencies
npm run dev        # Dev server at localhost:5173
npm run build      # Production build to dist/
```

## Known Issues
- Progress photos stored as base64 in localStorage can hit quota limits (~5MB)
- No data validation on weight/reps inputs (can enter negative or text via paste)
- Coach engine is rule-based, not AI — responses are deterministic based on data patterns
