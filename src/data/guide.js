import CONFIG from "./config";

const P = CONFIG.program;
const restDayStr = P.restDays.map(d => `Day ${d}`).join(" and ");
const totalOverloadDays = P.minCyclesBeforeChange * P.cycleLength;

const GUIDE_DATA = [
  {
    category: "RATIONALE",
    items: [
      { title: "Why This Split?", desc: `A ${P.cycleLength}-day rotating split hits every muscle group ${P.cycleLength <= 7 ? "once" : "twice"} per cycle with dedicated sessions. Research shows that training each muscle 2× per week with 10-20 sets/week is optimal for hypertrophy (Schoenfeld et al., 2016). This split distributes volume across sessions to prevent junk volume accumulation while keeping frequency high enough to maximize muscle protein synthesis windows.` },
      { title: "Why These Exercises?", desc: "Every exercise was selected for a specific biomechanical reason. Compounds (squat, bench, row, RDL) drive systemic strength and CNS adaptation. Isolation work targets lagging muscle groups through full ROM. FST-7 sets (7×12 with 30-45s rest) create extreme cell swelling and fascia stretch — a proven hypertrophy trigger from Hany Rambod's methodology used with 20+ Olympia titles." },
      { title: "Why Progressive Overload?", desc: "Progressive overload is the ONLY guaranteed driver of long-term adaptation. Without it, the body habituates and progress stalls. Forge tracks three overload vectors: weight increase (mechanical tension), volume increase (metabolic stress), and RPE management (effort quality). When you hit the top of the rep range at RPE 7-8, the system flags the exercise for a weight increase." },
      { title: "Why RPE Tracking?", desc: "Rate of Perceived Exertion (RPE) captures what weight and reps can't: how hard the set actually was for YOU on that day. A 200lb bench at RPE 6 after great sleep is a different stimulus than 200lb at RPE 9 after bad sleep. RPE data lets the system detect readiness shifts, prevent overtraining, and time deloads before injury — not after." },
      { title: "Why Rest Day Placement?", desc: `${restDayStr} ${P.restDays.length === 1 ? "is" : "are"} strategically placed to divide the cycle into training blocks. This allows 48-72 hours of recovery for each muscle group before it's trained again. Growth happens during recovery, not during training. Skipping rest days doesn't make you harder — it makes you weaker.` },
      { title: "Why Track Everything?", desc: "Every data point — weight, reps, RPE, sleep, stress, nutrition, body weight, photos — feeds the intelligence engine. More data = better pattern recognition = smarter coaching decisions. Elite coaches don't guess. They measure, analyze, and adjust. Forge does the same thing, but it never forgets and never gets tired." },
    ],
  },
  {
    category: "FUNDAMENTALS",
    items: [
      { title: "Structure", desc: `${P.cycleLength}-day rotating split. ${P.minCyclesBeforeChange} full cycles minimum before making changes. This creates ${totalOverloadDays} days of consistent progressive overload.` },
      { title: "Progression", desc: "Increase weight when you hit the top of the rep range for all sets. Track everything — weights, reps, RPE, rest times, and tempo." },
      { title: "Rest Times", desc: "60-90s for compound lifts, 45-60s for isolation. FST-7 sets use 30-45s rest strictly." },
      { title: "Tempo", desc: "2-0-2 standard tempo. 3-1-2 for isolation work. Eccentric control is non-negotiable." },
    ],
  },
  {
    category: "NUTRITION",
    items: [
      { title: "Calories", desc: "2500 kcal daily target. 212g protein, 277g carbs, 59g fat. Adjust based on weekly weight trends." },
      { title: "Meal Timing", desc: "5 meals spread across the day. Pre-workout meal 90 min before training. Post-workout within 60 min." },
      { title: "Hydration", desc: "Minimum 1 gallon daily. Add electrolytes during training. Track water intake." },
      { title: "Supplements", desc: "Creatine 5g daily (never skip). Whey for convenience. Fish oil and magnesium for recovery." },
    ],
  },
  {
    category: "RECOVERY",
    items: [
      { title: "Sleep", desc: "7-9 hours minimum. Consistent sleep/wake schedule. No screens 30 min before bed." },
      { title: "Rest Days", desc: `${restDayStr} ${P.restDays.length === 1 ? "is" : "are"} full rest. Light walking or stretching only. Do not train.` },
      { title: "Deload", desc: `Every ${P.deloadEveryNCycles}${((n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return s[(v-20)%10] || s[v] || s[0]; })(P.deloadEveryNCycles)} cycle, reduce volume by ${Math.round(P.deloadVolumeReduction * 100)}%. Same exercises, lighter weights, fewer sets.` },
      { title: "Mobility", desc: "10 min daily mobility work. Focus on hips, shoulders, and thoracic spine." },
    ],
  },
  {
    category: "MINDSET",
    items: [
      { title: "Consistency", desc: "Show up every day. The program works if you work it. No excuses, no shortcuts." },
      { title: "Tracking", desc: "Log every workout, every meal, every check-in. Data drives progress." },
      { title: "Patience", desc: "Visible results take 8-12 weeks. Trust the process. Small daily improvements compound." },
      { title: "Intensity", desc: "Every set should be within 1-2 reps of failure. If you can do more, the weight is too light." },
    ],
  },
];

export default GUIDE_DATA;
