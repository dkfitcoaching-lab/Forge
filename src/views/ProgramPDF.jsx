import { useState } from "react";
import { Button, Label, Card, ForgeLogo } from "../components/Primitives";
import DAYS from "../data/workouts";
import { MEALS, MACRO_CAPS, SUPPLEMENTS } from "../data/nutrition";
import DIVISIONS, { PRO_WISDOM } from "../data/posing";
import GUIDE_DATA from "../data/guide";
import storage from "../utils/storage";
import { computeStats, getAllPersonalRecords, getAllCheckIns, getWorkoutHistory, computeReadinessScore, computeFatigueScore } from "../utils/analytics";

// ══════════════════════════════════════════════════════════════
// FORGE PROGRAM PDF — Magazine-Grade Program Document
// Zero limitations. Every section. Every detail. Every edge case.
// Full 14-day split, posing step-by-step, guide content, analytics,
// table of contents, page headers/footers, print-perfect CSS.
// ══════════════════════════════════════════════════════════════

// ─── CARDIO PROTOCOLS ────────────────────────────────────────
const CARDIO_PROTOCOLS = {
  offseason: {
    title: "Off-Season Cardiovascular Protocol",
    sessions: [
      { day: "Training Days", type: "Post-Workout LISS", duration: "20 min", intensity: "Zone 2 (120-135 BPM)", notes: "Incline treadmill walk 3.0 mph / 10-12% grade" },
      { day: "Rest Days", type: "Fasted LISS (optional)", duration: "25-30 min", intensity: "Zone 2", notes: "Stairmaster or incline walk — keep heart rate steady" },
    ],
    weeklyTarget: "2-3 sessions",
    rationale: "Maintain cardiovascular health and nutrient partitioning without compromising recovery or hypertrophy. Zone 2 cardio improves mitochondrial density and fat oxidation capacity while preserving muscle glycogen for training.",
    guidelines: [
      "Never perform HIIT in off-season — it interferes with hypertrophy signaling",
      "Keep cardio AFTER weights, never before (preserves performance and glycogen)",
      "If body weight is trending up too fast (>0.5 lb/week), add one additional 20-min session",
      "Heart rate should stay conversational — if you can't hold a sentence, you're too high",
    ],
  },
  prep: {
    title: "Contest Prep Cardiovascular Protocol",
    sessions: [
      { day: "Training Days", type: "Post-Workout LISS", duration: "30-40 min", intensity: "Zone 2 (125-140 BPM)", notes: "Incline walk or stairmaster — non-negotiable on training days" },
      { day: "Rest Days", type: "AM Fasted LISS", duration: "35-45 min", intensity: "Zone 2", notes: "First thing in the morning before food — maximizes fat oxidation" },
      { day: "2x/week", type: "HIIT (strategic)", duration: "15-20 min", intensity: "Zone 4-5 intervals", notes: "30s sprint / 90s rest — bike or rower only (low joint impact)" },
    ],
    weeklyTarget: "5-7 sessions",
    rationale: "Accelerate fat oxidation while preserving muscle. LISS is the foundation — HIIT is added strategically to break plateaus, never as a primary tool. Total weekly energy expenditure matters more than any single session.",
    guidelines: [
      "LISS is the foundation — add HIIT only to break plateaus (never more than 2x/week)",
      "Monitor morning resting heart rate — if elevated >5 BPM from baseline, reduce cardio volume",
      "Fasted AM cardio: sip BCAAs or EAAs to reduce muscle catabolism risk",
      "In final 4 weeks, prioritize LISS over HIIT to minimize cortisol and preserve fullness",
      "Adjust cardio based on weekly weigh-in trends, not daily fluctuations",
    ],
  },
};

// ─── RECOVERY PROTOCOLS ──────────────────────────────────────
const RECOVERY_PROTOCOL = [
  { category: "Stretching", icon: "🧘", items: [
    { name: "Hip Flexor Stretch", duration: "60s each side", when: "Post-workout + before bed", notes: "Kneel, drive hips forward, squeeze glute of rear leg. Tight hip flexors inhibit glute activation and cause anterior pelvic tilt." },
    { name: "Hamstring Stretch", duration: "45s each side", when: "Post-workout", notes: "Straight leg on bench, hinge forward at hips. Never round the lower back — the stretch should come from the hamstring, not spinal flexion." },
    { name: "Chest/Shoulder Doorway Stretch", duration: "45s each side", when: "Post push days", notes: "Arm on doorframe at 90°, lean through gently. Prevents internal rotation and rounded shoulders from heavy pressing." },
    { name: "Lat Stretch", duration: "30s each side", when: "Post pull days", notes: "Grab overhead bar or doorframe, lean away. Opens thoracic spine and improves overhead mobility." },
    { name: "Quad Stretch", duration: "45s each side", when: "Post leg days", notes: "Standing or lying — pull heel to glute. Add hip extension for a deeper rectus femoris stretch." },
    { name: "Piriformis/Glute Stretch", duration: "45s each side", when: "Post lower body", notes: "Figure-4 stretch: ankle over knee, pull thigh toward chest. Relieves sciatic tension and hip tightness." },
  ]},
  { category: "Foam Rolling / Myofascial Release", icon: "🔄", items: [
    { name: "IT Band / TFL", duration: "60-90s each side", when: "Pre-workout or rest days", notes: "Roll from hip to above knee — pause on tender spots 15-20s. Never roll directly on the knee joint." },
    { name: "Thoracic Spine", duration: "60s", when: "Daily", notes: "Upper back on roller, arms crossed, extend over roller. Improves thoracic extension for squats, overhead press, and posture." },
    { name: "Glutes / Piriformis", duration: "60s each side", when: "Post lower body", notes: "Sit on roller, cross ankle over knee, roll through glute. Use a lacrosse ball for deeper trigger point work." },
    { name: "Quads", duration: "45s each side", when: "Post leg days", notes: "Face down, roller under one quad, roll slowly. Pause on the VMO (inner quad above knee) for extra attention." },
    { name: "Calves", duration: "30s each side", when: "Post leg days", notes: "Stack legs on roller, roll from ankle to below knee. Cross one leg over the other for increased pressure." },
    { name: "Lats / Teres Major", duration: "45s each side", when: "Post pull days", notes: "Lie on side with roller under armpit area. Roll from armpit to mid-rib. Opens up lat tightness from heavy pulling." },
  ]},
  { category: "Active Recovery", icon: "⚡", items: [
    { name: "Light Walking", duration: "20-30 min", when: "Rest days", notes: "Zone 1 — easy pace, promotes blood flow and nutrient delivery to recovering muscles without creating additional fatigue." },
    { name: "Contrast Showers", duration: "5-8 min", when: "Post-workout", notes: "Alternate 30s hot / 30s cold for 4-6 cycles, always end cold. Enhances circulation, reduces inflammation, improves recovery." },
    { name: "Sleep Optimization", duration: "7-9 hours", when: "Nightly", notes: "Cool room (65-68°F), no screens 30 min before, consistent bedtime ±30 min. Growth hormone peaks during deep sleep — this is when you actually grow." },
    { name: "Epsom Salt Bath", duration: "15-20 min", when: "Post-heavy leg days", notes: "2 cups Epsom salt in warm water. Magnesium absorbs transdermally, relaxes muscles, reduces DOMS severity." },
    { name: "Diaphragmatic Breathing", duration: "5 min", when: "Pre-sleep", notes: "4-count inhale, 7-count hold, 8-count exhale. Activates parasympathetic nervous system, reduces cortisol, improves sleep onset." },
  ]},
];

// ─── DELOAD PROTOCOL ─────────────────────────────────────────
const DELOAD_PROTOCOL = {
  frequency: "Every 5th cycle (every 70 training days)",
  duration: "1 full cycle (14 days)",
  adjustments: [
    { param: "Volume", change: "Reduce by 40%", detail: "Drop from 4 sets to 2-3 sets per exercise. Maintain exercise selection." },
    { param: "Intensity", change: "Reduce by 20%", detail: "Use ~80% of working weights. Focus on perfect form and mind-muscle connection." },
    { param: "RPE", change: "Cap at RPE 6-7", detail: "No sets within 3 reps of failure. The goal is RECOVERY, not stimulus." },
    { param: "FST-7 Sets", change: "Replace with 3x12", detail: "Drop the 7-set protocol entirely during deload. Replace with standard sets." },
    { param: "Cardio", change: "LISS only, reduce by 25%", detail: "No HIIT during deload. Reduce LISS duration by 25%. Focus on walks." },
  ],
  signs: [
    "Persistent joint soreness that doesn't resolve with rest days",
    "Decreased performance for 2+ consecutive sessions",
    "Morning resting heart rate elevated >5 BPM from baseline",
    "Poor sleep quality despite consistent sleep hygiene",
    "Loss of motivation or mental fatigue toward training",
    "Increased frequency of minor injuries or strains",
  ],
};

// ─── SUPPLEMENT TIMING ───────────────────────────────────────
const SUPPLEMENT_DETAILS = [
  { name: "Creatine Monohydrate", dose: "5g", timing: "Post-workout (with meal) or morning on rest days", purpose: "Increases intramuscular creatine phosphate stores — supports strength, power output, and cell volumization. Take daily without cycling. Loading phase optional (20g/day for 5 days).", evidence: "Most researched supplement in sports nutrition. Consistent 5-10% strength improvements across 200+ studies." },
  { name: "Whey Protein Isolate", dose: "1.5 scoops (~37g protein)", timing: "Within 60 min post-workout", purpose: "Fast-digesting complete protein — optimal for post-workout muscle protein synthesis. Contains all essential amino acids with high leucine content to trigger mTOR pathway.", evidence: "Post-workout protein timing maximizes MPS when combined with resistance training." },
  { name: "Daily Multivitamin", dose: "1 serving", timing: "With breakfast (fat-soluble vitamins need dietary fat)", purpose: "Micronutrient insurance — fills gaps from diet, supports immune function, enzymatic processes, and recovery. Even well-planned diets can miss micronutrient targets.", evidence: "Insurance policy, not a performance enhancer. Most value for athletes in caloric deficit." },
  { name: "Fish Oil (EPA/DHA)", dose: "2g combined EPA+DHA", timing: "With any meal containing fat", purpose: "Omega-3 fatty acids — anti-inflammatory, joint health, cardiovascular support, may improve insulin sensitivity. Look for triglyceride form (superior absorption).", evidence: "Reduces exercise-induced inflammation and DOMS. Supports joint health in heavy lifters." },
  { name: "Magnesium Glycinate", dose: "400mg elemental", timing: "Before bed (30-60 min)", purpose: "Supports sleep quality, muscle relaxation, nervous system function. Glycinate form is best absorbed and least likely to cause GI distress. Most trainees are deficient due to sweat losses.", evidence: "Improves sleep quality metrics. Reduces muscle cramps. Supports 300+ enzymatic reactions." },
];

// ─── TRAINING METHODOLOGY ────────────────────────────────────
const METHODOLOGY = [
  { title: "Progressive Overload Protocol", content: "When you complete all prescribed reps at a given weight for 2 consecutive sessions, increase the load by 5 lbs (upper body) or 10 lbs (lower body compounds). For isolation exercises, increase by the smallest available increment. Log every set — progressive overload only works when tracked." },
  { title: "Tempo Prescription", content: "Standard tempo: 2-0-2 (2s eccentric, no pause, 2s concentric). Isolation work: 3-1-2 (3s eccentric, 1s squeeze, 2s concentric). Eccentric control is non-negotiable — it drives hypertrophy and protects joints. Never use momentum to move weight." },
  { title: "Rest Periods", content: "Compound lifts (squat, bench, deadlift, row): 90-120 seconds. Isolation exercises: 60-90 seconds. FST-7 finisher sets: 30-45 seconds strictly timed. Rest periods are part of the prescription — don't cut them short or extend them." },
  { title: "RPE Guidelines", content: "Working sets should be RPE 8-9 (1-2 reps in reserve). Warm-up sets: RPE 5-6. FST-7 sets: RPE 7-8 (focus on pump, not max load). If you can do 3+ more reps, the weight is too light. If you fail before the target rep range, reduce by 5-10%." },
  { title: "FST-7 Protocol", content: "Fascia Stretch Training: 7 sets of 12 reps with 30-45 seconds rest between sets. Used as a finisher on the last exercise of a muscle group. Purpose: maximize pump, stretch fascia, increase nutrient delivery. Use 60-70% of your normal working weight. Squeeze every rep — this is about blood volume, not ego." },
  { title: "Mind-Muscle Connection", content: "Visualize the target muscle contracting before each set. On isolation movements, slow the tempo to feel the muscle working through the entire range of motion. Research shows that internal focus of attention increases muscle activation by 20-30% on isolation exercises." },
];

export default function ProgramPDF({ C, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [sections, setSections] = useState({
    training: true,
    methodology: true,
    nutrition: true,
    supplements: true,
    cardio: false,
    recovery: true,
    deload: true,
    guide: true,
    posing: false,
    analytics: true,
  });

  const profile = storage.get("ob_data", {});
  const userName = storage.get("user_name", "Athlete");
  const tier = storage.get("user_tier", "FORGE");
  const divisionId = storage.get("posing_div", null);
  const division = DIVISIONS.find(d => d.id === divisionId);
  const stats = computeStats();
  const prs = getAllPersonalRecords();
  const checkIns = getAllCheckIns();
  const history = getWorkoutHistory();
  const readiness = computeReadinessScore();
  const fatigue = computeFatigueScore();
  const isCompetitor = !!divisionId;

  // Full 14-day split — BOTH weeks (they have different exercises)
  const week1Days = DAYS.filter(d => d.d <= 7 && !d.rest);
  const week2Days = DAYS.filter(d => d.d > 7 && !d.rest);
  const allTrainingDays = DAYS.filter(d => !d.rest);

  // Weight trend from check-ins
  const weightEntries = checkIns.filter(ci => ci.wt && Number(ci.wt) > 0);

  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const generatePDF = () => {
    setGenerating(true);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setGenerating(false);
      alert("Pop-up blocked. Please allow pop-ups for this site to generate your program PDF.");
      return;
    }

    const ac = C.accent;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // ─── ESCAPE HELPER ──────────────────────────────
    const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // ─── BUILD HTML ─────────────────────────────────
    let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FORGE Program — ${esc(userName)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      @page { margin: 0.75in 0.6in; size: letter; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; background: #fff; max-width: 760px; margin: 0 auto; font-size: 12px; line-height: 1.6; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

      /* ─── TYPOGRAPHY HIERARCHY ─── */
      h1 { font-family: 'Cinzel', serif; font-size: 36px; font-weight: 900; letter-spacing: 0.18em; margin-bottom: 2px; color: #0a0a1a; line-height: 1.2; }
      h2 { font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; letter-spacing: 0.14em; color: ${ac}; margin: 36px 0 14px; padding-bottom: 8px; border-bottom: 2px solid ${ac}18; position: relative; page-break-after: avoid; }
      h2::before { content: ''; position: absolute; bottom: -2px; left: 0; width: 40px; height: 2px; background: ${ac}; }
      h3 { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.18em; color: ${ac}; margin: 22px 0 8px; text-transform: uppercase; }
      h4 { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #1a1a2e; margin: 14px 0 6px; }

      /* ─── LAYOUT ─── */
      .subtitle { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; color: ${ac}; margin-bottom: 2px; text-transform: uppercase; }
      .meta { font-size: 10.5px; color: #666; margin-bottom: 3px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }
      .meta-label { color: #999; }
      .meta-value { color: #333; font-weight: 600; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, ${ac}35, ${ac}, ${ac}35, transparent); margin: 28px 0; }
      .divider-light { height: 1px; background: linear-gradient(90deg, transparent, #ddd, transparent); margin: 18px 0; }
      .section { page-break-inside: avoid; margin-bottom: 18px; }

      /* ─── TABLES ─── */
      table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 11px; }
      th { background: ${ac}0a; color: ${ac}; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 8px 10px; text-align: left; border-bottom: 1.5px solid ${ac}25; }
      td { padding: 7px 10px; border-bottom: 1px solid #eee; vertical-align: top; line-height: 1.55; }
      tr:last-child td { border-bottom: none; }
      .exercise-name { font-weight: 600; color: #1a1a2e; }
      .cue { font-size: 9.5px; color: #888; font-style: italic; margin-top: 2px; line-height: 1.5; }
      .tag { display: inline-block; font-size: 8px; font-weight: 700; color: ${ac}; background: ${ac}0a; border: 1px solid ${ac}20; border-radius: 3px; padding: 1px 5px; letter-spacing: 0.06em; font-family: 'JetBrains Mono', monospace; margin-left: 6px; vertical-align: middle; }

      /* ─── GRIDS ─── */
      .macro-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0 16px; }
      .macro-box { background: #f8f8fc; border: 1.5px solid #e4e4ee; border-radius: 8px; padding: 14px 8px; text-align: center; }
      .macro-val { font-size: 24px; font-weight: 800; color: ${ac}; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.02em; }
      .macro-label { font-size: 7.5px; color: #888; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.14em; margin-top: 4px; text-transform: uppercase; }
      .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0; }
      .stat-box { background: #fafafe; border: 1px solid #eee; border-radius: 8px; padding: 12px 8px; text-align: center; }
      .stat-val { font-size: 20px; font-weight: 700; color: ${ac}; font-family: 'JetBrains Mono', monospace; }
      .stat-label { font-size: 7px; color: #999; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.12em; margin-top: 3px; text-transform: uppercase; }

      /* ─── CALLOUTS ─── */
      .note { background: ${ac}06; border-left: 3px solid ${ac}; padding: 12px 16px; margin: 12px 0; font-size: 11.5px; line-height: 1.7; border-radius: 0 6px 6px 0; color: #444; }
      .note-warn { background: #fff3e0; border-left: 3px solid #ff9800; padding: 12px 16px; margin: 12px 0; font-size: 11.5px; line-height: 1.7; border-radius: 0 6px 6px 0; color: #444; }
      .note-title { font-weight: 700; font-size: 10px; letter-spacing: 0.08em; margin-bottom: 4px; color: ${ac}; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }

      /* ─── SPECIAL ELEMENTS ─── */
      .footer { margin-top: 48px; padding-top: 16px; border-top: 1.5px solid #ddd; font-size: 9px; color: #aaa; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-align: center; line-height: 2; }
      .toc { margin: 16px 0 8px; }
      .toc-item { display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; border-bottom: 1px dotted #ddd; font-size: 12px; }
      .toc-title { font-weight: 600; color: #1a1a2e; }
      .toc-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${ac}; font-weight: 600; }
      .step-num { display: inline-flex; width: 18px; height: 18px; border-radius: 4px; background: ${ac}0c; border: 1px solid ${ac}18; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: ${ac}; font-family: 'JetBrains Mono', monospace; margin-right: 8px; flex-shrink: 0; vertical-align: top; }
      .step-row { display: flex; align-items: flex-start; margin-bottom: 6px; }
      .step-text { font-size: 10.5px; color: #444; line-height: 1.55; }
      .mistake-row { display: flex; align-items: flex-start; margin-bottom: 5px; }
      .mistake-x { color: #e53935; font-weight: 700; font-size: 10px; margin-right: 8px; flex-shrink: 0; margin-top: 1px; }
      .tip-row { display: flex; align-items: flex-start; margin-bottom: 5px; }
      .tip-diamond { color: ${ac}; font-size: 8px; margin-right: 8px; flex-shrink: 0; margin-top: 3px; }
      .tip-text { font-size: 10.5px; color: #444; line-height: 1.55; font-style: italic; }
      .pose-muscles { font-size: 9px; color: ${ac}; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em; margin: 4px 0 10px; }
      .guideline-list { margin: 8px 0 4px; padding-left: 0; list-style: none; }
      .guideline-list li { font-size: 11px; color: #444; line-height: 1.6; padding: 3px 0; padding-left: 16px; position: relative; }
      .guideline-list li::before { content: '▸'; position: absolute; left: 0; color: ${ac}; font-size: 10px; }
      .week-header { background: ${ac}08; border: 1px solid ${ac}15; border-radius: 6px; padding: 10px 14px; margin: 18px 0 12px; }
      .week-title { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; color: ${ac}; letter-spacing: 0.1em; }
      .week-sub { font-size: 9px; color: #888; font-family: 'JetBrains Mono', monospace; margin-top: 2px; letter-spacing: 0.06em; }
      .cycle-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin: 12px 0 16px; }
      .cycle-day { text-align: center; padding: 8px 2px; border: 1px solid #e8e8ee; border-radius: 6px; background: #fafafe; }
      .cycle-day.rest { background: #f0f0f4; border-style: dashed; }
      .cycle-num { font-size: 14px; font-weight: 700; color: ${ac}; font-family: 'JetBrains Mono', monospace; }
      .cycle-label { font-size: 6px; color: #999; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em; margin-top: 2px; text-transform: uppercase; }

      /* ─── PRINT ─── */
      @media print {
        body { padding: 0; }
        h2 { page-break-after: avoid; }
        .section { page-break-inside: avoid; }
        .no-break { page-break-inside: avoid; }
        .page-break { page-break-before: always; }
      }
    </style></head><body>`;

    // ═══════════════════════════════════════════════════
    // COVER / HEADER
    // ═══════════════════════════════════════════════════
    html += `<div style="text-align:center;margin-bottom:8px;">
      <div style="font-size:9px;color:${ac};font-family:'JetBrains Mono',monospace;letter-spacing:0.3em;margin-bottom:12px;">fitnessforge.ai</div>
      <h1>FORGE</h1>
      <div class="subtitle">Personalized Training & Nutrition Program</div>
    </div>`;
    html += `<div class="divider"></div>`;

    // Client info block
    html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;margin-bottom:4px;">`;
    html += `<div class="meta"><span class="meta-label">Prepared for: </span><span class="meta-value">${esc(userName)}</span></div>`;
    html += `<div class="meta"><span class="meta-label">Generated: </span><span class="meta-value">${dateStr}</span></div>`;
    if (profile.goal) html += `<div class="meta"><span class="meta-label">Goal: </span><span class="meta-value">${esc(profile.goal)}</span></div>`;
    html += `<div class="meta"><span class="meta-label">Plan: </span><span class="meta-value">${esc(tier)}</span></div>`;
    if (profile.frequency) html += `<div class="meta"><span class="meta-label">Frequency: </span><span class="meta-value">${esc(profile.frequency)}</span></div>`;
    if (isCompetitor && division) html += `<div class="meta"><span class="meta-label">Division: </span><span class="meta-value">${esc(division.name)} (${esc(division.org)})</span></div>`;
    html += `</div>`;

    // ═══════════════════════════════════════════════════
    // TABLE OF CONTENTS
    // ═══════════════════════════════════════════════════
    html += `<div class="divider-light"></div>`;
    html += `<h3 style="margin-top:14px;">TABLE OF CONTENTS</h3>`;
    html += `<div class="toc">`;
    let tocNum = 1;
    const tocItems = [];
    if (sections.training) tocItems.push("Training Program — Full 14-Day Split");
    if (sections.methodology) tocItems.push("Training Methodology & Protocols");
    if (sections.nutrition) tocItems.push("Nutrition Plan");
    if (sections.supplements) tocItems.push("Supplement Protocol & Timing");
    if (sections.cardio) tocItems.push(`Cardio Protocol — ${isCompetitor ? "Contest Prep" : "Off-Season"}`);
    if (sections.recovery) tocItems.push("Recovery & Mobility Protocol");
    if (sections.deload) tocItems.push("Deload Protocol");
    if (sections.guide) tocItems.push("Program Guide — Fundamentals & Mindset");
    if (sections.posing && division) tocItems.push(`Posing Guide — ${division.name}`);
    if (sections.analytics && (stats.workoutCount > 0 || prs.length > 0)) tocItems.push("Progress & Personal Records");
    tocItems.forEach(item => {
      html += `<div class="toc-item"><span class="toc-title">${item}</span><span class="toc-num">${String(tocNum).padStart(2, "0")}</span></div>`;
      tocNum++;
    });
    html += `</div>`;

    // ═══════════════════════════════════════════════════
    // PROGRAM OVERVIEW — 14-Day Cycle Calendar
    // ═══════════════════════════════════════════════════
    if (sections.training) {
      html += `<div class="divider"></div>`;
      html += `<h3>14-DAY TRAINING CYCLE</h3>`;
      html += `<div class="cycle-grid">`;
      DAYS.forEach(day => {
        html += `<div class="cycle-day ${day.rest ? "rest" : ""}">
          <div class="cycle-num">${day.d}</div>
          <div class="cycle-label">${day.rest ? "REST" : day.t.split(" + ")[0]}</div>
        </div>`;
      });
      html += `</div>`;
      html += `<div class="note"><div class="note-title">How This Split Works</div>6-day push/pull/legs rotation with strategic rest on days 7 and 14. Each muscle group is hit from different angles across the two weeks — Week 1 and Week 2 use different exercise selections for the same muscle groups, ensuring complete development and preventing adaptation. Complete 5 full cycles (70 training days) before making program modifications.</div>`;
    }

    // ═══════════════════════════════════════════════════
    // TRAINING PROGRAM — FULL 14-DAY SPLIT
    // ═══════════════════════════════════════════════════
    if (sections.training) {
      html += `<h2>TRAINING PROGRAM</h2>`;

      // Week 1
      html += `<div class="week-header"><div class="week-title">WEEK 1 — Days 1-6</div><div class="week-sub">Primary exercise selection · Foundation movements</div></div>`;
      week1Days.forEach(day => {
        html += `<div class="section">`;
        html += `<h3>Day ${day.d} — ${esc(day.t)}</h3>`;
        html += `<div class="meta" style="margin-bottom:6px;">Duration: ~${day.m} min · ${day.x.length} exercises</div>`;
        if (day.w?.length > 0) {
          html += `<div style="font-size:10px;color:#666;margin-bottom:8px;padding:6px 10px;background:#fafafe;border-radius:4px;border:1px solid #eee;"><strong style="color:${ac};font-size:8px;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;">WARMUP</strong> &nbsp;${day.w.map(w => esc(w)).join(" → ")}</div>`;
        }
        html += `<table><tr><th style="width:30%">Exercise</th><th style="width:14%">Sets × Reps</th><th>Coaching Cues</th></tr>`;
        day.x.forEach(ex => {
          html += `<tr><td class="exercise-name">${esc(ex.n)}${ex.tg ? `<span class="tag">${esc(ex.tg)}</span>` : ""}${ex.p ? `<div class="cue">${esc(ex.p)}</div>` : ""}</td><td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${esc(ex.s)}</td><td style="font-size:10.5px;color:#555;">${(ex.c || []).map(c => esc(c)).join(". ")}.</td></tr>`;
        });
        html += `</table></div>`;
      });

      // Week 2
      html += `<div class="week-header"><div class="week-title">WEEK 2 — Days 8-13</div><div class="week-sub">Variation exercises · Different angles and stimulus</div></div>`;
      week2Days.forEach(day => {
        html += `<div class="section">`;
        html += `<h3>Day ${day.d} — ${esc(day.t)}</h3>`;
        html += `<div class="meta" style="margin-bottom:6px;">Duration: ~${day.m} min · ${day.x.length} exercises</div>`;
        if (day.w?.length > 0) {
          html += `<div style="font-size:10px;color:#666;margin-bottom:8px;padding:6px 10px;background:#fafafe;border-radius:4px;border:1px solid #eee;"><strong style="color:${ac};font-size:8px;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;">WARMUP</strong> &nbsp;${day.w.map(w => esc(w)).join(" → ")}</div>`;
        }
        html += `<table><tr><th style="width:30%">Exercise</th><th style="width:14%">Sets × Reps</th><th>Coaching Cues</th></tr>`;
        day.x.forEach(ex => {
          html += `<tr><td class="exercise-name">${esc(ex.n)}${ex.tg ? `<span class="tag">${esc(ex.tg)}</span>` : ""}${ex.p ? `<div class="cue">${esc(ex.p)}</div>` : ""}</td><td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${esc(ex.s)}</td><td style="font-size:10.5px;color:#555;">${(ex.c || []).map(c => esc(c)).join(". ")}.</td></tr>`;
        });
        html += `</table></div>`;
      });

      // PR summary if available
      if (prs.length > 0 && sections.analytics) {
        html += `<h3>Personal Records — Top Lifts</h3>`;
        html += `<table><tr><th>Exercise</th><th>Best Weight</th><th>Est. 1RM (Epley)</th><th>Max Volume</th></tr>`;
        prs.slice(0, 15).forEach(pr => {
          html += `<tr><td class="exercise-name">${esc(pr.exercise)}</td><td>${pr.value}</td><td>${pr.type.replace("Est 1RM: ", "")}</td><td>${pr.maxVolume ? `${pr.maxVolume.toLocaleString()} lbs` : "—"}</td></tr>`;
        });
        html += `</table>`;
      }
    }

    // ═══════════════════════════════════════════════════
    // TRAINING METHODOLOGY
    // ═══════════════════════════════════════════════════
    if (sections.methodology) {
      html += `<h2>TRAINING METHODOLOGY</h2>`;
      html += `<div class="note"><div class="note-title">Training Philosophy</div>This program is built on evidence-based hypertrophy principles. Every prescription — from tempo to rest periods to RPE — serves a specific physiological purpose. Understand the WHY behind each protocol and you'll execute with intent, not just effort.</div>`;
      METHODOLOGY.forEach(m => {
        html += `<div class="section"><h4>${esc(m.title)}</h4>`;
        html += `<p style="font-size:11.5px;color:#444;line-height:1.7;margin-bottom:8px;">${esc(m.content)}</p></div>`;
      });
    }

    // ═══════════════════════════════════════════════════
    // NUTRITION PLAN
    // ═══════════════════════════════════════════════════
    if (sections.nutrition) {
      html += `<h2>NUTRITION PLAN</h2>`;
      html += `<div class="macro-grid">
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.cal}</div><div class="macro-label">CALORIES</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.p}g</div><div class="macro-label">PROTEIN</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.c}g</div><div class="macro-label">CARBS</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.f}g</div><div class="macro-label">FAT</div></div>
      </div>`;

      html += `<div class="note"><div class="note-title">Macro Priority Order</div>1. <strong>Protein first</strong> — hit 212g every day, no exceptions. Distribute across all meals (35-50g each).<br>2. <strong>Carbs around training</strong> — largest carb meals are pre-workout (Meal 2) and post-workout (Meal 3).<br>3. <strong>Fats consistent</strong> — never drop below 50g/day. Fats support hormone production.<br>4. <strong>Total calories</strong> — this determines whether you gain, maintain, or lose. Adjust by ±200 cal based on weekly weight trend.</div>`;

      html += `<h3>Daily Meal Schedule</h3>`;
      html += `<table><tr><th>Meal</th><th>Time</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>`;
      MEALS.forEach(m => {
        html += `<tr><td class="exercise-name">${esc(m.n)}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;">${m.t}</td><td>${m.cal}</td><td>${m.p}g</td><td>${m.c}g</td><td>${m.f}g</td></tr>`;
      });
      html += `<tr style="background:${ac}06;font-weight:700;"><td>DAILY TOTAL</td><td></td><td>${MACRO_CAPS.cal}</td><td>${MACRO_CAPS.p}g</td><td>${MACRO_CAPS.c}g</td><td>${MACRO_CAPS.f}g</td></tr>`;
      html += `</table>`;

      html += `<h3>Hydration Protocol</h3>`;
      html += `<div class="note">Minimum <strong>1 gallon (3.8L) daily</strong>. Add electrolytes during training (sodium, potassium, magnesium). Sip water consistently throughout the day — do not chug large amounts infrequently. Increase by 16-24oz on heavy training days. Dehydration of just 2% bodyweight reduces performance by 10-20%.</div>`;

      html += `<h3>Adjustment Guidelines</h3>`;
      html += `<ul class="guideline-list">
        <li>If losing weight too fast (&gt;1 lb/week in offseason): add 200 calories from carbs</li>
        <li>If gaining weight too fast (&gt;0.5 lb/week in offseason): reduce carbs by 25g</li>
        <li>If hitting a fat loss plateau (&gt;2 weeks no change): reduce carbs by 20g OR add one cardio session</li>
        <li>If energy is consistently low: check sleep first, then consider adding 15g carbs to pre-workout meal</li>
        <li>Never cut protein below 1g/lb bodyweight regardless of caloric adjustments</li>
      </ul>`;
    }

    // ═══════════════════════════════════════════════════
    // SUPPLEMENT PROTOCOL
    // ═══════════════════════════════════════════════════
    if (sections.supplements) {
      html += `<h2>SUPPLEMENT PROTOCOL</h2>`;
      html += `<div class="note"><div class="note-title">Supplementation Philosophy</div>Supplements are the 5% that support the 95%. Nutrition, training, and sleep are non-negotiable foundations. These fill specific, evidence-based gaps that diet alone cannot efficiently address.</div>`;

      SUPPLEMENT_DETAILS.forEach(s => {
        html += `<div class="section" style="margin-bottom:14px;">`;
        html += `<h4 style="margin-bottom:2px;">${esc(s.name)} — <span style="color:${ac};font-family:'JetBrains Mono',monospace;font-size:11px;">${esc(s.dose)}</span></h4>`;
        html += `<div style="font-size:9.5px;color:#888;font-family:'JetBrains Mono',monospace;margin-bottom:6px;letter-spacing:0.04em;">TIMING: ${esc(s.timing)}</div>`;
        html += `<p style="font-size:11px;color:#444;line-height:1.6;margin-bottom:4px;">${esc(s.purpose)}</p>`;
        html += `<p style="font-size:10px;color:#888;font-style:italic;line-height:1.5;">${esc(s.evidence)}</p>`;
        html += `</div>`;
      });
    }

    // ═══════════════════════════════════════════════════
    // CARDIO PROTOCOL
    // ═══════════════════════════════════════════════════
    if (sections.cardio) {
      const protocol = isCompetitor ? CARDIO_PROTOCOLS.prep : CARDIO_PROTOCOLS.offseason;
      html += `<h2>CARDIO PROTOCOL</h2>`;
      html += `<h3>${esc(protocol.title)}</h3>`;
      html += `<div class="note">${esc(protocol.rationale)}</div>`;
      html += `<div class="meta" style="margin:8px 0;"><span class="meta-label">Weekly Target: </span><span class="meta-value">${esc(protocol.weeklyTarget)}</span></div>`;
      html += `<table><tr><th>Schedule</th><th>Type</th><th>Duration</th><th>Intensity</th><th>Notes</th></tr>`;
      protocol.sessions.forEach(s => {
        html += `<tr><td class="exercise-name">${esc(s.day)}</td><td>${esc(s.type)}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;">${esc(s.duration)}</td><td style="font-size:10px;">${esc(s.intensity)}</td><td style="font-size:10px;color:#555;">${esc(s.notes)}</td></tr>`;
      });
      html += `</table>`;

      html += `<h3>Cardio Guidelines</h3>`;
      html += `<ul class="guideline-list">`;
      protocol.guidelines.forEach(g => { html += `<li>${esc(g)}</li>`; });
      html += `</ul>`;
    }

    // ═══════════════════════════════════════════════════
    // RECOVERY PROTOCOL
    // ═══════════════════════════════════════════════════
    if (sections.recovery) {
      html += `<h2>RECOVERY & MOBILITY PROTOCOL</h2>`;
      html += `<div class="note"><div class="note-title">Recovery Is Where You Grow</div>Training creates the stimulus. Sleep, nutrition, and active recovery create the adaptation. Cutting corners on recovery is cutting corners on results. A 30-minute daily investment in mobility and recovery will compound into injury prevention, better performance, and faster progress over months and years.</div>`;

      RECOVERY_PROTOCOL.forEach(cat => {
        html += `<h3>${esc(cat.category)}</h3>`;
        html += `<table><tr><th style="width:22%">Exercise</th><th style="width:14%">Duration</th><th style="width:16%">When</th><th>Notes</th></tr>`;
        cat.items.forEach(item => {
          html += `<tr><td class="exercise-name">${esc(item.name)}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;">${esc(item.duration)}</td><td style="font-size:10px;">${esc(item.when)}</td><td style="font-size:10px;color:#555;">${esc(item.notes)}</td></tr>`;
        });
        html += `</table>`;
      });
    }

    // ═══════════════════════════════════════════════════
    // DELOAD PROTOCOL
    // ═══════════════════════════════════════════════════
    if (sections.deload) {
      html += `<h2>DELOAD PROTOCOL</h2>`;
      html += `<div class="meta" style="margin-bottom:8px;"><span class="meta-label">Frequency: </span><span class="meta-value">${esc(DELOAD_PROTOCOL.frequency)}</span></div>`;
      html += `<div class="meta" style="margin-bottom:12px;"><span class="meta-label">Duration: </span><span class="meta-value">${esc(DELOAD_PROTOCOL.duration)}</span></div>`;

      html += `<div class="note"><div class="note-title">Why Deload?</div>Deloading is not taking a break — it's strategic recovery that allows connective tissue, nervous system, and joints to catch up with muscle adaptation. Skipping deloads leads to overtraining, injury, and stalled progress. The strongest athletes deload religiously.</div>`;

      html += `<h3>Deload Adjustments</h3>`;
      html += `<table><tr><th>Parameter</th><th>Adjustment</th><th>Detail</th></tr>`;
      DELOAD_PROTOCOL.adjustments.forEach(a => {
        html += `<tr><td class="exercise-name">${esc(a.param)}</td><td style="font-weight:600;color:${ac};">${esc(a.change)}</td><td style="font-size:10.5px;color:#555;">${esc(a.detail)}</td></tr>`;
      });
      html += `</table>`;

      html += `<h3>Signs You Need to Deload</h3>`;
      html += `<ul class="guideline-list">`;
      DELOAD_PROTOCOL.signs.forEach(s => { html += `<li>${esc(s)}</li>`; });
      html += `</ul>`;
    }

    // ═══════════════════════════════════════════════════
    // PROGRAM GUIDE — Fundamentals & Mindset
    // ═══════════════════════════════════════════════════
    if (sections.guide) {
      html += `<h2>PROGRAM GUIDE</h2>`;
      html += `<div class="note">These are the principles that underpin every element of this program. Read them, internalize them, and refer back when you need a reset. The program works if you work it — understanding the WHY makes the HOW automatic.</div>`;

      GUIDE_DATA.forEach(cat => {
        html += `<h3>${esc(cat.category)}</h3>`;
        cat.items.forEach(item => {
          html += `<div class="section" style="margin-bottom:10px;">`;
          html += `<h4 style="margin-bottom:2px;">${esc(item.title)}</h4>`;
          html += `<p style="font-size:11px;color:#444;line-height:1.7;">${esc(item.desc)}</p>`;
          html += `</div>`;
        });
      });
    }

    // ═══════════════════════════════════════════════════
    // POSING GUIDE — Full step-by-step instructions
    // ═══════════════════════════════════════════════════
    if (sections.posing && division) {
      html += `<h2>POSING GUIDE — ${esc(division.name).toUpperCase()}</h2>`;
      html += `<div class="meta" style="margin-bottom:8px;"><span class="meta-label">Organization: </span><span class="meta-value">${esc(division.org)}</span> &nbsp;·&nbsp; <span class="meta-label">Mandatory Poses: </span><span class="meta-value">${division.poses.length}</span></div>`;
      html += `<div class="note"><div class="note-title">Posing Practice Protocol</div>${esc(division.desc)}. Practice every mandatory pose for 10-15 seconds each, minimum 3x/week. A 30-minute posing session should be as exhausting as a gym workout — if it's not, you're not flexing hard enough. Film yourself weekly to track improvement. Start posing practice ideally a year before competition.</div>`;

      division.poses.forEach((pose, i) => {
        html += `<div class="section" style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #eee;">`;
        html += `<h4 style="margin-bottom:2px;"><span style="color:${ac};font-family:'JetBrains Mono',monospace;font-weight:700;margin-right:8px;">${String(i + 1).padStart(2, "0")}</span>${esc(pose.name)}</h4>`;
        if (pose.muscles) html += `<div class="pose-muscles">${esc(pose.muscles)}</div>`;

        // Quick cue
        html += `<div style="font-size:11px;color:#555;line-height:1.6;margin-bottom:10px;padding:8px 12px;background:${ac}05;border-radius:4px;border:1px solid ${ac}10;">${esc(pose.cues)}</div>`;

        // Step-by-step
        if (pose.steps && pose.steps.length > 0) {
          html += `<div style="margin-bottom:10px;">`;
          html += `<div style="font-size:8.5px;color:${ac};font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;font-weight:700;margin-bottom:6px;">STEP-BY-STEP EXECUTION</div>`;
          pose.steps.forEach((step, si) => {
            html += `<div class="step-row"><span class="step-num">${si + 1}</span><span class="step-text">${esc(step)}</span></div>`;
          });
          html += `</div>`;
        }

        // Common mistakes
        if (pose.mistakes && pose.mistakes.length > 0) {
          html += `<div style="margin-bottom:10px;">`;
          html += `<div style="font-size:8.5px;color:#e53935;font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;font-weight:700;margin-bottom:6px;">COMMON MISTAKES</div>`;
          pose.mistakes.forEach(m => {
            html += `<div class="mistake-row"><span class="mistake-x">✕</span><span class="step-text">${esc(m)}</span></div>`;
          });
          html += `</div>`;
        }

        // Pro tips
        if (pose.proTips && pose.proTips.length > 0) {
          html += `<div>`;
          html += `<div style="font-size:8.5px;color:${ac};font-family:'JetBrains Mono',monospace;letter-spacing:0.12em;font-weight:700;margin-bottom:6px;">PRO TIPS</div>`;
          pose.proTips.forEach(tip => {
            html += `<div class="tip-row"><span class="tip-diamond">◆</span><span class="tip-text">${esc(tip)}</span></div>`;
          });
          html += `</div>`;
        }

        html += `</div>`; // end pose section
      });

      // Pro Wisdom quotes
      if (PRO_WISDOM && PRO_WISDOM.length > 0) {
        html += `<h3>Pro Wisdom</h3>`;
        PRO_WISDOM.forEach(w => {
          html += `<div style="margin-bottom:10px;padding:10px 14px;background:#fafafe;border-left:3px solid ${ac}30;border-radius:0 4px 4px 0;">`;
          html += `<div style="font-size:11px;color:#444;font-style:italic;line-height:1.6;">"${esc(w.quote)}"</div>`;
          html += `<div style="font-size:9px;color:${ac};font-family:'JetBrains Mono',monospace;margin-top:4px;letter-spacing:0.06em;font-weight:600;">— ${esc(w.source).toUpperCase()}</div>`;
          html += `</div>`;
        });
      }
    }

    // ═══════════════════════════════════════════════════
    // ANALYTICS & PROGRESS
    // ═══════════════════════════════════════════════════
    if (sections.analytics && (stats.workoutCount > 0 || prs.length > 0 || checkIns.length > 0)) {
      html += `<h2>PROGRESS & ANALYTICS</h2>`;

      // Stats grid
      if (stats.workoutCount > 0) {
        html += `<div class="stat-grid">`;
        html += `<div class="stat-box"><div class="stat-val">${stats.workoutCount}</div><div class="stat-label">WORKOUTS</div></div>`;
        html += `<div class="stat-box"><div class="stat-val">${stats.streak}</div><div class="stat-label">STREAK</div></div>`;
        html += `<div class="stat-box"><div class="stat-val">${stats.cyclesCompleted}</div><div class="stat-label">CYCLES</div></div>`;
        html += `<div class="stat-box"><div class="stat-val">${stats.checkInCount}</div><div class="stat-label">CHECK-INS</div></div>`;
        html += `</div>`;

        // Volume + readiness
        if (stats.totalVolumeAllTime > 0) {
          html += `<div class="meta"><span class="meta-label">Total Volume Moved: </span><span class="meta-value">${stats.totalVolumeAllTime.toLocaleString()} lbs</span></div>`;
        }
        if (readiness) {
          html += `<div class="meta"><span class="meta-label">Current Readiness: </span><span class="meta-value">${readiness.score}/100 (${readiness.label})</span></div>`;
        }
        if (fatigue) {
          html += `<div class="meta"><span class="meta-label">Fatigue Level: </span><span class="meta-value">${fatigue.fatigue}/100 — ${fatigue.label}</span></div>`;
        }
      }

      // Weight trend
      if (weightEntries.length >= 2) {
        const firstWeight = weightEntries[0].wt;
        const lastWeight = weightEntries[weightEntries.length - 1].wt;
        const change = (Number(lastWeight) - Number(firstWeight)).toFixed(1);
        const direction = Number(change) > 0 ? "+" : "";
        html += `<h3>Body Weight Trend</h3>`;
        html += `<div class="meta"><span class="meta-label">Starting: </span><span class="meta-value">${firstWeight} lbs</span> &nbsp;→&nbsp; <span class="meta-label">Current: </span><span class="meta-value">${lastWeight} lbs</span> &nbsp;·&nbsp; <span class="meta-value">${direction}${change} lbs</span></div>`;
      }

      // Muscle volume distribution
      if (stats.muscleVolume && stats.totalVolumeAllTime > 0) {
        const mv = stats.muscleVolume;
        const total = Object.values(mv).reduce((a, b) => a + b, 0);
        if (total > 0) {
          html += `<h3>Volume Distribution by Muscle</h3>`;
          html += `<table><tr><th>Muscle Group</th><th>Total Volume</th><th>% of Total</th></tr>`;
          Object.entries(mv)
            .filter(([, v]) => v > 0)
            .sort(([, a], [, b]) => b - a)
            .forEach(([muscle, vol]) => {
              html += `<tr><td class="exercise-name" style="text-transform:capitalize;">${muscle}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;">${Math.round(vol).toLocaleString()} lbs</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;">${((vol / total) * 100).toFixed(1)}%</td></tr>`;
            });
          html += `</table>`;
        }
      }
    }

    // ═══════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════
    html += `<div class="footer">
      Generated by FORGE — fitnessforge.ai<br>
      ${dateStr} · ${esc(tier)} Plan · Program v5.0<br>
      <span style="color:#ccc;">This document is personalized for ${esc(userName)}. Do not redistribute.</span>
    </div>`;

    html += `</body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      setGenerating(false);
    }, 1500);
  };

  const sectionOptions = [
    { key: "training", label: "Training Program", desc: "Full 14-day split — both weeks with all exercises, warmups, and coaching cues", icon: "💪" },
    { key: "methodology", label: "Training Methodology", desc: "Progressive overload, tempo, rest periods, RPE, FST-7, mind-muscle connection", icon: "📐" },
    { key: "nutrition", label: "Nutrition Plan", desc: "Macros, meal schedule, hydration protocol, and adjustment guidelines", icon: "🍽" },
    { key: "supplements", label: "Supplement Protocol", desc: "Dosing, timing, purpose, and evidence for each supplement", icon: "💊" },
    { key: "cardio", label: "Cardio Protocol", desc: isCompetitor ? "Contest prep — LISS + HIIT with periodization guidelines" : "Off-season cardiovascular health and fat oxidation", icon: "❤️" },
    { key: "recovery", label: "Recovery & Mobility", desc: "Stretching, foam rolling, active recovery, sleep optimization", icon: "🧘" },
    { key: "deload", label: "Deload Protocol", desc: "Scheduled deload timing, adjustments, and warning signs", icon: "📉" },
    { key: "guide", label: "Program Guide", desc: "Fundamentals, nutrition principles, recovery pillars, mindset", icon: "📖" },
    ...(division ? [{ key: "posing", label: `Posing Guide — ${division.name}`, desc: `${division.poses.length} mandatory poses with step-by-step instructions, mistakes, and pro tips`, icon: "🏆" }] : []),
    ...(stats.workoutCount > 0 || prs.length > 0 ? [{ key: "analytics", label: "Progress & Analytics", desc: `${stats.workoutCount} workouts, ${prs.length} PRs, volume distribution, weight trend`, icon: "📊" }] : []),
  ];

  const enabledCount = Object.values(sections).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", padding: "20px 16px 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600, cursor: "pointer", letterSpacing: ".06em", minHeight: 44, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          BACK
        </button>
      </div>

      <Label C={C}>GENERATE PROGRAM</Label>
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--d)", color: C.text1, marginBottom: 6 }}>Your Complete Program</div>
      <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", lineHeight: 1.6, marginBottom: 24 }}>
        Select sections to include. A print-ready document opens — save as PDF from the print dialog.
      </div>

      {/* Section toggles */}
      {sectionOptions.map(({ key, label, desc, icon }) => (
        <Card key={key} C={C} onClick={() => toggleSection(key)} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            border: `1.5px solid ${sections[key] ? C.accent : C.structBorderHover}`,
            background: sections[key] ? C.accent015 : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}>
            {sections[key] && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{label}</div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{desc}</div>
          </div>
        </Card>
      ))}

      {/* Stats summary */}
      {stats.workoutCount > 0 && (
        <Card C={C} style={{ marginTop: 16, textAlign: "center" }}>
          <Label C={C} style={{ justifyContent: "center" }}>YOUR PROGRESS</Label>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
            {[
              { v: stats.workoutCount, l: "WORKOUTS" },
              { v: stats.streak, l: "STREAK" },
              { v: prs.length, l: "PRs" },
              { v: stats.cyclesCompleted, l: "CYCLES" },
            ].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{v}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Generate button */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 640, padding: "16px 20px max(16px, env(safe-area-inset-bottom))", background: C.navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.structBorderHover}`, zIndex: 10 }}>
        <Button C={C} onClick={generatePDF} disabled={generating || enabledCount === 0}>
          {generating ? "GENERATING..." : `GENERATE PROGRAM PDF — ${enabledCount} SECTIONS`}
        </Button>
      </div>
    </div>
  );
}
