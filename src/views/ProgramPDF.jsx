import { useState } from "react";
import { Button, Label, Card, ForgeLogo } from "../components/Primitives";
import DAYS from "../data/workouts";
import { MEALS, MACRO_CAPS, SUPPLEMENTS } from "../data/nutrition";
import DIVISIONS from "../data/posing";
import storage from "../utils/storage";
import { computeStats, getAllPersonalRecords } from "../utils/analytics";

// ══════════════════════════════════════════════════════════════
// FORGE PROGRAM PDF — Print-optimized full program document
// Generates a complete, branded program document from user data.
// Uses window.print() which allows Save as PDF on all devices.
// Content is CONTEXTUAL to the user's profile and tier.
// ══════════════════════════════════════════════════════════════

// ─── CARDIO PROTOCOLS ────────────────────────────────────────
const CARDIO_PROTOCOLS = {
  offseason: {
    title: "Off-Season Cardio",
    sessions: [
      { day: "Training Days", type: "Post-Workout LISS", duration: "20 min", intensity: "Zone 2 (120-135 BPM)", notes: "Incline treadmill walk 3.0 mph / 10-12% grade" },
      { day: "Rest Days", type: "Fasted LISS (optional)", duration: "25-30 min", intensity: "Zone 2", notes: "Stairmaster or incline walk — keep heart rate steady" },
    ],
    weeklyTarget: "2-3 sessions",
    rationale: "Maintain cardiovascular health and nutrient partitioning without compromising recovery or hypertrophy.",
  },
  prep: {
    title: "Contest Prep Cardio",
    sessions: [
      { day: "Training Days", type: "Post-Workout LISS", duration: "30-40 min", intensity: "Zone 2 (125-140 BPM)", notes: "Incline walk or stairmaster — non-negotiable on training days" },
      { day: "Rest Days", type: "AM Fasted LISS", duration: "35-45 min", intensity: "Zone 2", notes: "First thing in the morning before food" },
      { day: "2x/week", type: "HIIT (optional)", duration: "15-20 min", intensity: "Zone 4-5 intervals", notes: "30s sprint / 90s rest — bike or rower only (low joint impact)" },
    ],
    weeklyTarget: "5-7 sessions",
    rationale: "Accelerate fat oxidation while preserving muscle. LISS is the foundation — HIIT is added strategically to break plateaus.",
  },
};

// ─── RECOVERY PROTOCOLS ──────────────────────────────────────
const RECOVERY_PROTOCOL = [
  { category: "Stretching", items: [
    { name: "Hip Flexor Stretch", duration: "60s each side", when: "Post-workout + before bed", notes: "Kneel, drive hips forward, squeeze glute of rear leg" },
    { name: "Hamstring Stretch", duration: "45s each side", when: "Post-workout", notes: "Straight leg on bench, hinge forward at hips" },
    { name: "Chest/Shoulder Doorway Stretch", duration: "45s each side", when: "Post push days", notes: "Arm on doorframe at 90°, lean through gently" },
    { name: "Lat Stretch", duration: "30s each side", when: "Post pull days", notes: "Grab overhead bar or doorframe, lean away" },
    { name: "Quad Stretch", duration: "45s each side", when: "Post leg days", notes: "Standing or lying — pull heel to glute" },
  ]},
  { category: "Foam Rolling", items: [
    { name: "IT Band / TFL", duration: "60-90s each side", when: "Pre-workout or rest days", notes: "Roll from hip to above knee — pause on tender spots" },
    { name: "Thoracic Spine", duration: "60s", when: "Daily", notes: "Upper back on roller, arms crossed, extend over roller" },
    { name: "Glutes / Piriformis", duration: "60s each side", when: "Post lower body", notes: "Sit on roller, cross ankle over knee, roll through glute" },
    { name: "Quads", duration: "45s each side", when: "Post leg days", notes: "Face down, roller under one quad, roll slowly" },
    { name: "Calves", duration: "30s each side", when: "Post leg days", notes: "Stack legs on roller, roll from ankle to below knee" },
  ]},
  { category: "Active Recovery", items: [
    { name: "Light Walking", duration: "20-30 min", when: "Rest days", notes: "Zone 1 — easy pace, promotes blood flow and recovery" },
    { name: "Contrast Showers", duration: "5-8 min", when: "Post-workout", notes: "Alternate 30s hot / 30s cold for 4-6 cycles, end cold" },
    { name: "Sleep Optimization", duration: "7-9 hours", when: "Nightly", notes: "Cool room, no screens 30 min before, consistent bedtime" },
  ]},
];

export default function ProgramPDF({ C, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [sections, setSections] = useState({
    training: true,
    nutrition: true,
    supplements: true,
    cardio: false,
    recovery: true,
    posing: false,
  });

  const profile = storage.get("ob_data", {});
  const userName = storage.get("user_name", "Athlete");
  const tier = storage.get("user_tier", "FORGE");
  const divisionId = storage.get("posing_div", null);
  const division = DIVISIONS.find(d => d.id === divisionId);
  const stats = computeStats();
  const prs = getAllPersonalRecords();
  const isCompetitor = !!divisionId;

  // Training days only (no rest days)
  const trainingDays = DAYS.filter(d => !d.rest);
  // Unique days (first 7 of the 14-day split = one rotation)
  const uniqueDays = trainingDays.slice(0, 6);

  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const generatePDF = () => {
    setGenerating(true);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setGenerating(false);
      return;
    }

    const accentColor = C.accent;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FORGE Program — ${userName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
      h1 { font-family: 'Cinzel', serif; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; margin-bottom: 4px; }
      h2 { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; letter-spacing: 0.12em; color: ${accentColor}; margin: 32px 0 12px; border-bottom: 2px solid ${accentColor}20; padding-bottom: 8px; }
      h3 { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: ${accentColor}; margin: 20px 0 8px; text-transform: uppercase; }
      .subtitle { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: ${accentColor}; margin-bottom: 24px; }
      .meta { font-size: 11px; color: #666; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}40, transparent); margin: 24px 0; }
      table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 12px; }
      th { background: ${accentColor}10; color: ${accentColor}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 8px 10px; text-align: left; border-bottom: 1.5px solid ${accentColor}30; }
      td { padding: 7px 10px; border-bottom: 1px solid #eee; vertical-align: top; line-height: 1.5; }
      .exercise-name { font-weight: 600; color: #1a1a2e; }
      .cue { font-size: 10px; color: #888; font-style: italic; margin-top: 2px; }
      .section { page-break-inside: avoid; margin-bottom: 24px; }
      .macro-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 12px 0; }
      .macro-box { background: #f8f8fc; border: 1px solid #e8e8f0; border-radius: 8px; padding: 12px; text-align: center; }
      .macro-val { font-size: 22px; font-weight: 700; color: ${accentColor}; font-family: 'JetBrains Mono', monospace; }
      .macro-label { font-size: 8px; color: #888; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.14em; margin-top: 4px; }
      .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 9px; color: #aaa; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-align: center; }
      .note { background: ${accentColor}08; border-left: 3px solid ${accentColor}; padding: 10px 14px; margin: 12px 0; font-size: 12px; line-height: 1.6; border-radius: 0 6px 6px 0; }
      @media print {
        body { padding: 20px; }
        h2 { page-break-after: avoid; }
        .section { page-break-inside: avoid; }
      }
    </style></head><body>`;

    // ─── HEADER ─────────────────────────────────────
    html += `<h1>FORGE</h1>`;
    html += `<div class="subtitle">fitnessforge.ai</div>`;
    html += `<div class="meta">Prepared for: ${userName}</div>`;
    html += `<div class="meta">Date: ${dateStr}</div>`;
    if (profile.goal) html += `<div class="meta">Goal: ${profile.goal}</div>`;
    if (profile.frequency) html += `<div class="meta">Training Frequency: ${profile.frequency}</div>`;
    if (isCompetitor && division) html += `<div class="meta">Division: ${division.name} (${division.org})</div>`;
    html += `<div class="divider"></div>`;

    // ─── TRAINING PROGRAM ───────────────────────────
    if (sections.training) {
      html += `<h2>TRAINING PROGRAM</h2>`;
      html += `<div class="note">6-day rotation with 1 rest day. Each muscle group is trained with progressive overload — track your weights and reps every session. When you complete all prescribed reps at a given weight for 2 consecutive sessions, increase the load.</div>`;

      uniqueDays.forEach(day => {
        html += `<div class="section">`;
        html += `<h3>Day ${day.d} — ${day.t}</h3>`;
        if (day.w?.length > 0) {
          html += `<div style="font-size:11px;color:#666;margin-bottom:8px;">Warmup: ${day.w.join(" → ")}</div>`;
        }
        html += `<table><tr><th>Exercise</th><th>Sets × Reps</th><th>Coaching Cues</th></tr>`;
        day.x.forEach(ex => {
          html += `<tr><td class="exercise-name">${ex.n}${ex.tg ? ` <span style="color:${accentColor};font-size:9px;">[${ex.tg}]</span>` : ""}${ex.p ? `<div class="cue">${ex.p}</div>` : ""}</td><td>${ex.s}</td><td style="font-size:11px;color:#555;">${(ex.c || []).join(". ")}</td></tr>`;
        });
        html += `</table></div>`;
      });

      // PR summary if available
      if (prs.length > 0) {
        html += `<h3>Personal Records</h3>`;
        html += `<table><tr><th>Exercise</th><th>Best Weight</th><th>Est. 1RM</th></tr>`;
        prs.slice(0, 10).forEach(pr => {
          html += `<tr><td class="exercise-name">${pr.exercise}</td><td>${pr.maxWeight} lbs</td><td>${pr.estimated1RM} lbs</td></tr>`;
        });
        html += `</table>`;
      }
    }

    // ─── NUTRITION ──────────────────────────────────
    if (sections.nutrition) {
      html += `<h2>NUTRITION PLAN</h2>`;
      html += `<div class="macro-grid">
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.cal}</div><div class="macro-label">CALORIES</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.p}g</div><div class="macro-label">PROTEIN</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.c}g</div><div class="macro-label">CARBS</div></div>
        <div class="macro-box"><div class="macro-val">${MACRO_CAPS.f}g</div><div class="macro-label">FAT</div></div>
      </div>`;
      html += `<div class="note">Hit protein first. Distribute carbs around training (pre/post). Keep fats moderate and consistent. Total calories determine the trajectory — macros determine the composition.</div>`;
      html += `<table><tr><th>Meal</th><th>Time</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>`;
      MEALS.forEach(m => {
        html += `<tr><td class="exercise-name">${m.n}</td><td>${m.t}</td><td>${m.cal}</td><td>${m.p}g</td><td>${m.c}g</td><td>${m.f}g</td></tr>`;
      });
      html += `</table>`;
    }

    // ─── SUPPLEMENTS ────────────────────────────────
    if (sections.supplements) {
      html += `<h2>SUPPLEMENT PROTOCOL</h2>`;
      html += `<div class="note">Supplements are the 5% that support the 95%. Nutrition, training, and sleep are non-negotiable foundations. These fill specific gaps.</div>`;
      html += `<table><tr><th>Supplement</th><th>Purpose</th></tr>`;
      const suppPurposes = {
        "Creatine 5g": "Increases intramuscular creatine phosphate stores — supports strength, power, and cell volumization",
        "Whey 1.5 scoops": "Fast-digesting protein — optimal for post-workout muscle protein synthesis window",
        "Multivitamin": "Micronutrient insurance — fills gaps from diet, supports immune function and recovery",
        "Fish Oil 2g": "Omega-3 EPA/DHA — anti-inflammatory, joint health, cardiovascular support",
        "Magnesium 400mg": "Supports sleep quality, muscle relaxation, nervous system function — most trainees are deficient",
      };
      SUPPLEMENTS.forEach(s => {
        html += `<tr><td class="exercise-name">${s}</td><td style="font-size:11px;color:#555;">${suppPurposes[s] || ""}</td></tr>`;
      });
      html += `</table>`;
    }

    // ─── CARDIO (competitor only) ────────────────────
    if (sections.cardio) {
      const protocol = isCompetitor ? CARDIO_PROTOCOLS.prep : CARDIO_PROTOCOLS.offseason;
      html += `<h2>CARDIO PROTOCOL — ${protocol.title.toUpperCase()}</h2>`;
      html += `<div class="note">${protocol.rationale}</div>`;
      html += `<div class="meta" style="margin:8px 0;">Weekly Target: ${protocol.weeklyTarget}</div>`;
      html += `<table><tr><th>Day</th><th>Type</th><th>Duration</th><th>Intensity</th><th>Notes</th></tr>`;
      protocol.sessions.forEach(s => {
        html += `<tr><td class="exercise-name">${s.day}</td><td>${s.type}</td><td>${s.duration}</td><td>${s.intensity}</td><td style="font-size:11px;color:#555;">${s.notes}</td></tr>`;
      });
      html += `</table>`;
    }

    // ─── RECOVERY ───────────────────────────────────
    if (sections.recovery) {
      html += `<h2>RECOVERY PROTOCOL</h2>`;
      html += `<div class="note">Recovery is where adaptation happens. Training creates the stimulus — sleep, nutrition, and active recovery create the result. This protocol is non-negotiable.</div>`;
      RECOVERY_PROTOCOL.forEach(cat => {
        html += `<h3>${cat.category}</h3>`;
        html += `<table><tr><th>Exercise</th><th>Duration</th><th>When</th><th>Notes</th></tr>`;
        cat.items.forEach(item => {
          html += `<tr><td class="exercise-name">${item.name}</td><td>${item.duration}</td><td>${item.when}</td><td style="font-size:11px;color:#555;">${item.notes}</td></tr>`;
        });
        html += `</table>`;
      });
    }

    // ─── POSING (competitor only) ────────────────────
    if (sections.posing && division) {
      html += `<h2>POSING GUIDE — ${division.name.toUpperCase()}</h2>`;
      html += `<div class="note">${division.desc}. Practice every mandatory pose for 10-15 seconds each, minimum 3x/week. Film yourself weekly to track improvement.</div>`;
      html += `<table><tr><th>#</th><th>Pose</th><th>Coaching Cues</th></tr>`;
      division.poses.forEach((pose, i) => {
        html += `<tr><td style="font-weight:700;color:${accentColor};">${i + 1}</td><td class="exercise-name">${pose.name}</td><td style="font-size:11px;color:#555;line-height:1.6;">${pose.cues}</td></tr>`;
      });
      html += `</table>`;
    }

    // ─── FOOTER ─────────────────────────────────────
    html += `<div class="footer">
      Generated by FORGE — fitnessforge.ai<br>
      ${dateStr} · ${tier} Plan · Program Version 5.0
    </div>`;

    html += `</body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts to load, then trigger print
    setTimeout(() => {
      printWindow.print();
      setGenerating(false);
    }, 1200);
  };

  const sectionOptions = [
    { key: "training", label: "Training Program", desc: "6-day split with exercises, sets, cues, and warmups", always: true },
    { key: "nutrition", label: "Nutrition Plan", desc: "Meal timing, macros, and calorie targets", always: true },
    { key: "supplements", label: "Supplement Protocol", desc: "Dosing, timing, and purpose for each supplement", always: true },
    { key: "cardio", label: "Cardio Protocol", desc: isCompetitor ? "Contest prep cardio programming" : "Off-season cardiovascular protocol", always: false },
    { key: "recovery", label: "Recovery Protocol", desc: "Stretching, foam rolling, and active recovery", always: true },
    ...(division ? [{ key: "posing", label: `Posing Guide — ${division.name}`, desc: `${division.poses.length} mandatory poses with coaching cues`, always: false }] : []),
  ];

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
        Select what to include. A print-ready document will open that you can save as PDF.
      </div>

      {/* Section toggles */}
      {sectionOptions.map(({ key, label, desc }) => (
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
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
            {[
              { v: stats.workoutCount, l: "WORKOUTS" },
              { v: stats.streak, l: "STREAK" },
              { v: prs.length, l: "PRs" },
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
        <Button C={C} onClick={generatePDF} disabled={generating || !Object.values(sections).some(Boolean)}>
          {generating ? "GENERATING..." : "GENERATE PROGRAM PDF"}
        </Button>
      </div>
    </div>
  );
}
