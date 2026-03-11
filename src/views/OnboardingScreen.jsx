import { useState, useEffect, useRef } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// FORGE AI ONBOARDING — World-Class Conversion Funnel
// Every word chosen for maximum impact. Every step earns trust.
// Pain point discovery → Value demonstration → Tier presentation
// Multi-select + text input. No free tier. No wasted breath.
// ══════════════════════════════════════════════════════════════

const FLOW = [
  // 0 — Opening hook: establish the value gap immediately
  {
    ai: "Welcome to Forge.\n\nWhat you're about to use was built from the same methodology that produces elite-level transformations. The kind of coaching intelligence that lives in your pocket, learns your patterns, reads your data, and adapts every single day. No waiting for appointments. No one-size-fits-all templates.\n\nLet's build your profile.",
    autoAdvance: true,
    delay: 3200,
  },
  // 1 — Primary goal: multi-select, custom SVG icons (no emojis)
  {
    ai: "What's driving you right now? Select all that apply.",
    options: [
      { label: "Build Muscle", icon: "muscle" },
      { label: "Lose Fat", icon: "flame" },
      { label: "Get Stronger", icon: "barbell" },
      { label: "Body Recomposition", icon: "recomp" },
      { label: "Athletic Performance", icon: "athletic" },
      { label: "Improve Mobility", icon: "mobility" },
      { label: "General Health", icon: "health" },
      { label: "Compete / Stage Prep", icon: "compete" },
    ],
    multi: true,
    key: "goal",
  },
  // 2 — Validate goal + open the pain (MULTI-SELECT)
  {
    genAi: (d) => {
      const r = {
        "Build Muscle": "An elite coach programs hypertrophy through periodized volume, progressive overload, and recovery timing — not random sets and reps. Forge runs that same system. It tracks your volume, detects when you're ready to push harder, and pulls back when your body needs it.",
        "Lose Fat": "A good coach keeps you in a deficit without sacrificing muscle. That means managing training load, nutrition, and recovery as one system — not three separate apps. Forge does exactly that. Your macros, your meals, your training — one place, adapted to your data.",
        "Get Stronger": "Strength coaches don't guess when to add weight. They track every lift, analyze progression curves, and time increases to your readiness. Forge does that automatically — PR detection, overload targets, fatigue modeling — the same analytical layer elite coaches use.",
        "Improve Mobility": "Smart coaches monitor recovery, stress, and readiness daily so you train at the edge of your capacity without crossing into injury. Forge tracks those same signals and adjusts your training intensity before your joints have to tell you.",
        "Body Recomposition": "Recomp is the hardest goal to execute alone because you're chasing two competing objectives simultaneously. Elite coaches manage this by precisely balancing training stimulus, caloric intake, and recovery windows. Forge runs that same balancing act — tracking your macros, volume, and body composition signals in one integrated system.",
        "Athletic Performance": "Performance coaching isn't about getting tired in the gym — it's about targeted adaptation. Power, speed, endurance, and strength all require different programming variables managed in concert. Forge tracks your training load, recovery, and progression across every movement pattern so you peak when it matters.",
        "General Health": "The best coaches know that sustainable health isn't built on extreme protocols. It's built on consistency — showing up, tracking the basics, and making small improvements over time. Forge gives you that structure: training, nutrition, hydration, sleep, and recovery — all in one system that adapts to your life.",
        "Compete / Stage Prep": "Contest prep is the most demanding phase of training — every variable matters and the margin for error shrinks by the week. Elite coaches manage nutrition periodization, training volume, recovery, and body composition with surgical precision. Forge gives you that same level of systematic tracking and intelligent load management.",
      };
      const goals = Array.isArray(d.goal) ? d.goal : [d.goal];
      const parts = goals.map(g => r[g]).filter(Boolean);
      return parts.length > 0 ? parts.join("\n\n") : "Forge delivers coaching-grade programming intelligence that adapts to your data — the same methodology that drives elite results.";
    },
    followUp: "Now tell me honestly — what's actually been standing in your way? Select everything that applies.",
    options: [
      { label: "Can't stay consistent" },
      { label: "No real program" },
      { label: "Nutrition is a mess" },
      { label: "Progress has stalled" },
      { label: "No one holding me accountable" },
      { label: "Too much conflicting info" },
      { label: "Recovery or injury concerns" },
      { label: "Can't find the time" },
    ],
    multi: true,
    key: "struggles",
  },
  // 3 — Mirror their pain back with authority + ask experience
  {
    genAi: (d) => {
      const s = d.struggles || [];
      const parts = [];

      if (s.includes("Can't stay consistent") || s.includes("No one holding me accountable"))
        parts.push("A real coach solves consistency by removing decisions — you show up, they tell you exactly what to do. But a real coach can't be there at 6 AM when your alarm goes off. Forge can. It lives in your pocket. Open the app, see today's workout, meals, and check-in. No planning. No decision fatigue. You just execute.");
      if (s.includes("No real program"))
        parts.push("Most people walk into the gym and improvise. That's not training — that's hoping. Forge gives you a complete 14-day periodized split with intelligent progression. The same caliber of programming that other apps charge you for and still deliver as a static PDF. This one reads your data and evolves.");
      if (s.includes("Nutrition is a mess"))
        parts.push("Other apps make you log every gram manually and leave you staring at numbers with no context. A good coach simplifies it: here's what to eat, here's when, here are your macros. Forge does exactly that — your meals, your macros, your hydration, tracked in seconds. Not hours of tedious data entry.");
      if (s.includes("Progress has stalled"))
        parts.push("When a client plateaus, an elite coach digs into the data — volume trends, overload curves, recovery patterns — and finds exactly what needs to change. Most apps can't do this. Forge runs that same analysis automatically and tells you precisely which exercises are ready for an increase. The intelligence is always working, even when you're not.");
      if (s.includes("Too much conflicting info"))
        parts.push("The internet gives you a thousand opinions. A coach gives you one answer — the right one for your situation right now. Forge operates the same way. One system, built on proven methodology, personalized to your data. Not a content feed. Not a recommendation engine. A coaching intelligence that knows your body.");
      if (s.includes("Recovery or injury concerns"))
        parts.push("A human coach can check in once a week. Forge checks in every single day. Sleep, stress, energy, fatigue — it monitors the signals that predict injury before your body has to tell you. The intelligence that protects your longevity runs 24/7, not just during your scheduled appointment.");
      if (s.includes("Can't find the time"))
        parts.push("A good coach makes sessions efficient — no wandering, no wasted sets. Forge does the same, but it's available the moment you walk into the gym. Every set is programmed, every rest period is timed. You train with purpose and leave. Most people waste 30-40% of their gym time figuring out what to do next.");

      if (parts.length === 0)
        parts.push("Every one of these problems traces back to the same root cause: no system. Motivation fades. Willpower runs out. But a system built on real data and intelligent programming? That compounds. That's what Forge is — and it never takes a day off.");

      return parts.slice(0, 2).join("\n\n");
    },
    followUp: "How long have you been training?",
    options: [
      { label: "Brand new to this" },
      { label: "Under 1 year" },
      { label: "1–3 years" },
      { label: "3–5 years" },
      { label: "5+ years" },
    ],
    key: "experience",
  },
  // 4 — Speak to their level + ask what they've tried (MULTI-SELECT)
  {
    genAi: (d) => {
      const e = d.experience || "";
      if (e === "Brand new to this" || e === "Under 1 year")
        return "Starting with the right system is the single biggest advantage you can give yourself. Most people spend their first two years bouncing between random workouts and fad diets — spinning their wheels while building nothing. With Forge, every session from day one compounds toward a real result.";
      if (e === "1–3 years")
        return "You're past the beginner phase where everything works. From here, progress becomes a precision game. The margin between spinning your wheels and real transformation comes down to programming quality, load management, and tracking what matters. This is exactly where Forge was designed to take over.";
      if (e === "3–5 years")
        return "You've put in the work. You know the movements. What you need now isn't more effort — it's more intelligence. Forge gives you the analytical layer that separates good training from optimal training: overload detection, fatigue modeling, volume distribution analysis. The details that drive advanced progress.";
      return "At your level, you don't need someone telling you how to do a squat. You need a system tracking the variables that matter at scale — progressive overload curves across every exercise, muscle volume distribution, accumulated fatigue patterns, readiness trends. Forge handles the data so you can focus on execution.";
    },
    followUp: "What have you tried before? Select all that apply.",
    options: [
      { label: "Training on my own" },
      { label: "Hired a personal trainer" },
      { label: "Bought an online program" },
      { label: "Used a fitness app" },
      { label: "Followed YouTube / social media" },
      { label: "Group fitness classes" },
      { label: "This is my first step" },
    ],
    multi: true,
    key: "triedBefore",
  },
  // 5 — Reframe past failures as systemic, not personal + ask priorities (MULTI-SELECT)
  {
    genAi: (d) => {
      const t = d.triedBefore || [];
      const parts = [];

      if (t.includes("Hired a personal trainer"))
        parts.push("Great trainers change lives — but even the best ones can only be in one place at a time. The coaching stops when the session ends. No system running between appointments. No data accumulating. Forge delivers that same caliber of intelligence around the clock — and it remembers every rep you've ever logged. Your coach sleeps. This doesn't.");
      if (t.includes("Bought an online program"))
        parts.push("Online programs are a starting point — but they're frozen in time. They can't see your data, adapt to your progress, or tell you when to push harder. Forge is a living system. It reads your actual training data and evolves with you, session to session. The program gets smarter the longer you use it.");
      if (t.includes("Used a fitness app"))
        parts.push("Most fitness apps are glorified spreadsheets. They record what you did — they don't know what you should do next. Forge analyzes your data, detects patterns, identifies when you're ready to progress, and monitors fatigue in real time. It's not a log book. It's the intelligence layer that was always missing.");
      if (t.includes("Followed YouTube / social media"))
        parts.push("Content creators are great for inspiration — but inspiration without structure is just entertainment. Forge is built on methodology that produces real results. Not what looks good on camera. What actually works when you show up consistently and train with purpose.");
      if (t.includes("Group fitness classes"))
        parts.push("Group classes build habits and community — that matters. But they can't individualize. They can't track your specific progression or adapt to your recovery state. Forge gives you that layer of intelligence on top of whatever else you're doing — programming that's actually built around your body.");

      if (parts.length === 0 && t.includes("This is my first step"))
        parts.push("Smart first move. Starting with the right system means every session compounds from day one. Forge gives you coaching-grade intelligence and structure from the start — the same methodology that produces results at the highest level.");
      else if (parts.length === 0)
        parts.push("What most approaches are missing is continuity — no intelligence working between sessions, no data accumulating, no system adapting to your progress. That's the gap Forge fills.");

      return parts.slice(0, 2).join("\n\n");
    },
    followUp: "What matters most to you? Select your priorities.",
    options: [
      { label: "A real training program" },
      { label: "Nutrition that makes sense" },
      { label: "Tracking my progress" },
      { label: "Accountability system" },
      { label: "Access to coaching intelligence" },
      { label: "Analytics and data" },
      { label: "Simple and fast to use" },
    ],
    multi: true,
    key: "priorities",
  },
  // 6 — Deliver their personalized value stack + ask schedule
  {
    genAi: (d) => {
      const p = d.priorities || [];
      const val = [];

      if (p.includes("A real training program"))
        val.push("→ 14-day periodized split with targeted exercise selection, volume progression, and form cues built into every session");
      if (p.includes("Nutrition that makes sense"))
        val.push("→ Complete meal framework with macro targets, snap logging, hydration tracking, and supplement management");
      if (p.includes("Tracking my progress"))
        val.push("→ Automatic PR detection, volume trends, weight curves, body measurements, and progress photo timeline with side-by-side comparison");
      if (p.includes("Accountability system"))
        val.push("→ Daily check-ins, training streaks, readiness scoring, and a coach that notices when patterns shift");
      if (p.includes("Access to coaching intelligence"))
        val.push("→ AI coach available 24/7 that reads your actual data — sleep, training, nutrition, fatigue — and coaches from what it sees");
      if (p.includes("Analytics and data"))
        val.push("→ Fatigue modeling, progressive overload targets, muscle volume heatmap, and trend analysis across every metric you track");
      if (p.includes("Simple and fast to use"))
        val.push("→ One-tap set logging, guided workout player with built-in rest timers, and everything in one place — training, nutrition, analytics, coaching");

      const list = val.length > 0 ? val.join("\n") : "→ Everything you need — structured training, precision nutrition, real-time analytics, and intelligent coaching — in one system that gets smarter the more you use it";
      return `Based on what you've told me, here's exactly what Forge gives you:\n\n${list}`;
    },
    followUp: "How many days per week can you realistically train?",
    options: [
      { label: "2–3 days" },
      { label: "4–5 days" },
      { label: "6–7 days" },
    ],
    key: "frequency",
  },
  // 7 — Frequency response + gender (for programming context)
  {
    genAi: (d) => {
      const f = d.frequency || "";
      if (f === "6–7 days") return "That level of commitment is rare — and it's exactly what produces uncommon results. Forge's 14-day cycle programs strategic recovery days because growth happens during rest. The system ensures maximum stimulus on training days and maximum recovery on off days. Nothing is left to chance.";
      if (f === "4–5 days") return "Four to five days is the optimal window for most serious trainees. The Forge 14-day split was designed around this exact frequency — enough stimulus to drive adaptation, enough recovery to sustain it. Every session has a clear purpose. Zero filler.";
      return "Fewer days means every session carries more weight — and the program accounts for that. Forge maximizes stimulus efficiency so you get more out of less. Strategic exercise selection, precise volume targets, and intelligent sequencing ensure nothing is wasted.";
    },
    followUp: "What's your age range?",
    options: [
      { label: "Under 20" },
      { label: "20–29" },
      { label: "30–39" },
      { label: "40–49" },
      { label: "50+" },
    ],
    key: "ageRange",
  },
  // 8 — Age-specific value + name input (FIRST TEXT FIELD)
  {
    genAi: (d) => {
      const a = d.ageRange || "";
      if (a === "Under 20") return "You're building the foundation that everything else gets built on. The habits, the movement quality, the training discipline — what you establish now compounds for decades. Forge ensures that foundation is world-class from day one.";
      if (a === "20–29") return "This is the highest-leverage decade of your training life. Recovery capacity is at its peak, adaptation speed is high, and the habits you lock in now define your trajectory for the next thirty years. Forge makes sure you don't waste a single one of them.";
      if (a === "30–39") return "The thirties are where intelligent training separates from brute force. Your body rewards precision and punishes recklessness. Forge's fatigue monitoring and readiness scoring give you the intelligence to train at the edge of your capacity — without crossing into injury.";
      if (a === "40–49") return "At this stage, the athletes who continue making progress are the ones training smart, not just hard. Forge's readiness scoring adjusts your training intensity daily based on sleep, stress, and accumulated fatigue. Every session is calibrated to your current capacity.";
      return "Training longevity is built on data, not ego. Forge adapts session intensity to your daily readiness, tracks fatigue patterns over time, and ensures every workout delivers value. Smart programming means continued progress — at any age, at any stage.";
    },
    followUp: "One more thing — what should I call you?",
    showInput: true,
    inputKey: "name",
    inputPlaceholder: "Your first name",
  },
  // 9 — Name personalization + accent picker
  {
    genAi: (d) => {
      const name = d.name || "Athlete";
      return `${name} — let's make Forge yours.\n\nPick your signature color. This becomes the accent across your entire experience — every glow, every highlight, every interaction.`;
    },
    showThemePicker: true,
  },
  // 10 — Accent confirmed + surface picker
  {
    genAi: (d) => {
      const names = { forge: "Forge Teal", platinum: "Platinum", obsidian: "Obsidian Violet", ember: "Ember", arctic: "Arctic Blue", crimson: "Crimson", gold: "Gold", rose: "Rose" };
      return `${names[d.theme] || "Done"} — locked in.\n\nNow choose your surface. This is the base atmosphere behind everything.`;
    },
    showSurfacePicker: true,
  },
  // 11 — Personalized recap + tier selection
  {
    genAi: (d) => {
      const name = d.name || "Athlete";
      const goals = Array.isArray(d.goal) ? d.goal.join(", ") : (d.goal || "your goals");
      const freq = d.frequency || "your schedule";
      const exp = d.experience || "your level";
      return `${name}, your Forge profile is built.\n\n` +
        `Goal — ${goals}\n` +
        `Training — ${freq} per week\n` +
        `Experience — ${exp}\n` +
        `Program — Periodized, adaptive, built from your data\n` +
        `Nutrition — Precision macros, structured meals, hydration\n` +
        `Analytics — Fatigue modeling, PR detection, overload intelligence\n` +
        `Coach — Lives in your pocket. Learns your patterns. Never takes a day off.\n\n` +
        `This is the coaching system that used to require thousands per month and a waiting list. It's yours now. Choose your plan:`;
    },
    showTiers: true,
  },
];

// ─── TIER DEFINITIONS ────────────────────────────────────────
const TIERS = [
  {
    name: "FORGE",
    tagline: "Structured Training System",
    price: "$14.99",
    period: "/mo",
    yearlyPrice: "$9.99",
    yearlyPeriod: "/mo billed annually",
    features: [
      "14-day periodized program that adapts to you",
      "Guided workout player with intelligent rest timers",
      "Precision nutrition — macros, meals, hydration",
      "Supplement protocol with daily tracking",
      "Readiness scoring from real biometric data",
      "Progress photos with side-by-side timeline",
      "PR detection engine — never miss a record",
    ],
    accent: false,
    cta: "START FREE TRIAL",
  },
  {
    name: "FORGE PRO",
    tagline: "AI Coaching Intelligence — 24/7 in Your Pocket",
    price: "$29.99",
    period: "/mo",
    yearlyPrice: "$19.99",
    yearlyPeriod: "/mo billed annually",
    features: [
      "Everything in Forge, plus:",
      "Unlimited AI Coach — always on, always learning",
      "Voice input and text-to-speech coaching",
      "Fatigue model that knows when to push or pull back",
      "Progressive overload engine — auto-detects readiness",
      "Muscle volume heatmap and training balance analysis",
      "Weekly performance reports delivered automatically",
      "Photo uploads in coach chat for form feedback",
    ],
    accent: true,
    cta: "START FREE TRIAL",
    badge: "MOST POPULAR",
  },
  {
    name: "FORGE ELITE",
    tagline: "Human + AI — The Full Coaching Experience",
    price: "$49.99",
    period: "/mo",
    yearlyPrice: "$34.99",
    yearlyPeriod: "/mo billed annually",
    features: [
      "Everything in Pro, plus:",
      "Direct access to a certified human coach",
      "Fully custom program architecture",
      "Video analysis — form review, pose detection",
      "Multi-photo and video uploads for check-ins",
      "Priority response — under 1 hour guaranteed",
      "Quarterly program redesigns based on your data",
      "Global leaderboard access with verified badge",
    ],
    accent: false,
    cta: "START FREE TRIAL",
    badge: "PREMIUM",
  },
];

// ─── TYPING INDICATOR ────────────────────────────────────────
function TypingDots({ C }) {
  return (
    <div style={{ display: "flex", gap: 8, animation: "fadeIn 0.2s ease" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0,
        boxShadow: `0 0 12px ${C.accent015}, 0 2px 8px rgba(0,0,0,0.2)`,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "14px 20px",
        display: "flex", gap: 6, alignItems: "center",
        boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: C.accent,
            animation: `pulse 1.4s ease-in-out infinite ${i * 0.2}s`,
            boxShadow: `0 0 6px ${C.accent030}`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── AI MESSAGE BUBBLE ───────────────────────────────────────
function AiMsg({ text, C }) {
  return (
    <div style={{ display: "flex", gap: 8, animation: "fi 0.4s ease" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0, marginTop: 2,
        boxShadow: `0 0 12px ${C.accent015}, 0 2px 8px rgba(0,0,0,0.2)`,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "16px 18px",
        maxWidth: "85%",
        boxShadow: `0 4px 16px rgba(0,0,0,0.2), 0 0 1px ${C.structBorderStrong}`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        position: "relative",
      }}>
        {/* Top edge highlight */}
        <div style={{
          position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
          background: `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
          opacity: 0.6,
        }} />
        <div style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "var(--b)" }}>{text}</div>
      </div>
    </div>
  );
}

// ─── USER MESSAGE BUBBLE ─────────────────────────────────────
function UserMsg({ text, C }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", animation: "fi 0.3s ease" }}>
      <div style={{
        background: C.accent008,
        border: `1px solid ${C.accent020}`,
        borderRadius: "16px 4px 16px 16px",
        padding: "12px 18px",
        maxWidth: "80%",
        boxShadow: `0 2px 12px rgba(0,0,0,0.15), 0 0 20px ${C.accent005}`,
      }}>
        <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

// ─── CUSTOM SVG ICONS (no emojis) ────────────────────────────
function GoalIcon({ name, color, size = 15 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "muscle") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M5 18c0-2 1-3 3-4l2-1c1-.5 1.5-1.5 1-3-.3-1-1.5-2.5-.5-5 .8-2 3-3 5-2s3 3 3 5c0 1.5-.5 2.5-1.5 3.5L15 13.5c-1 1-1 2-.5 3.5.3 1 .5 2-.5 3" />
      <path d="M8 14c-2 .5-4 2-4 4" strokeOpacity="0.5" />
    </svg>
  );
  if (name === "flame") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M12 22c-4.4 0-7-3.2-7-7 0-3 1.5-5.2 3-7 .8-1 1.5-2.2 1.8-3.5.1-.5.8-.6 1-.1C12 7 14 9 14.5 10.5c.1.3.5.3.6 0 .2-.8.4-1.8.4-2.5 0-.4.5-.6.8-.3C18 9.5 19 12 19 15c0 3.8-2.6 7-7 7z" />
      <path d="M12 22c-1.7 0-3-1.5-3-3.5 0-1.5.8-2.8 1.5-3.5.3-.3.8-.1.8.3 0 .5.3 1 .7 1 .4 0 .7-.5.7-1 0-.3.4-.5.6-.3.8.8 1.7 2 1.7 3.5 0 2-1.3 3.5-3 3.5z" />
    </svg>
  );
  if (name === "barbell") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <line x1="2" y1="12" x2="22" y2="12" />
      <rect x="4" y="8" width="3" height="8" rx="1" />
      <rect x="17" y="8" width="3" height="8" rx="1" />
      <rect x="1" y="10" width="2" height="4" rx="0.5" />
      <rect x="21" y="10" width="2" height="4" rx="0.5" />
    </svg>
  );
  if (name === "mobility") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <circle cx="12" cy="4" r="2" />
      <path d="M9 8h6l-1 5-2 1-2-1-1-5z" />
      <path d="M8 13l-3 5" />
      <path d="M16 13l3 5" />
      <path d="M10 18l-1 4" />
      <path d="M14 18l1 4" />
    </svg>
  );
  if (name === "recomp") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M8 20V10" /><path d="M12 20V4" /><path d="M16 20V14" />
      <path d="M4 16l4-6 4 4 4-10 4 6" strokeOpacity="0.5" />
    </svg>
  );
  if (name === "athletic") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <circle cx="12" cy="4" r="2" />
      <path d="M7 11l5-3 5 3" />
      <path d="M12 8v6" />
      <path d="M8 20l4-6 4 6" />
      <path d="M5 16h14" strokeOpacity="0.4" strokeDasharray="2 2" />
    </svg>
  );
  if (name === "health") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
  if (name === "compete") return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      <path d="M6 9a6 6 0 0 1 12 0c0 3-2 5-6 8-4-3-6-5-6-8z" />
      <circle cx="12" cy="9" r="2" />
      <path d="M9 19h6" /><path d="M10 22h4" />
    </svg>
  );
  return null;
}

// ─── OPTION CHIP ─────────────────────────────────────────────
function OptionChip({ opt, selected, onToggle, C }) {
  const label = typeof opt === "string" ? opt : opt.label;
  const icon = typeof opt === "object" ? opt.icon : null;
  const active = selected;

  return (
    <button onClick={onToggle} style={{
      padding: icon ? "11px 16px" : "11px 18px",
      background: active ? C.accent015 : C.structGlass,
      border: `1.5px solid ${active ? C.accent040 : C.structBorderHover}`,
      borderRadius: 24,
      color: active ? C.accent : C.text2,
      fontSize: 12,
      fontFamily: "var(--m)",
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
      letterSpacing: ".04em",
      minHeight: 44,
      display: "flex", alignItems: "center", gap: 7,
      boxShadow: active ? `0 0 14px ${C.accent015}, 0 2px 8px rgba(0,0,0,0.15)` : `0 1px 4px rgba(0,0,0,0.1)`,
      transform: active ? "scale(1.03)" : "scale(1)",
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
    }}>
      {icon && <GoalIcon name={icon} color={active ? C.accent : C.text3} size={15} />}
      {label}
      {active && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
    </button>
  );
}

// ─── TIER CARD ───────────────────────────────────────────────
function TierCard({ tier, C, onSelect, yearly }) {
  const price = yearly ? tier.yearlyPrice : tier.price;
  const period = yearly ? tier.yearlyPeriod : tier.period;

  return (
    <div style={{
      background: tier.accent ? C.accent005 : C.cardGradient,
      border: `1.5px solid ${tier.accent ? C.accent : C.structBorderHover}`,
      borderRadius: 16,
      padding: 22,
      position: "relative",
      boxShadow: tier.accent
        ? `0 4px 24px ${C.accent015}, 0 0 48px ${C.accent008}, 0 0 1px ${C.accent040}`
        : `0 4px 16px rgba(0,0,0,0.2), 0 0 1px ${C.structBorderStrong}`,
      animation: tier.accent ? "accentBreathe 5s ease-in-out infinite" : "none",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      overflow: "hidden",
    }}>
      {/* Top edge highlight */}
      <div style={{
        position: "absolute", top: 0, left: "8%", right: "8%", height: 1,
        background: tier.accent ? C.dividerGrad : `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
        opacity: tier.accent ? 0.8 : 0.5,
      }} />
      {tier.badge && (
        <div style={{
          position: "absolute", top: -10, right: 16,
          background: tier.badge === "MOST POPULAR" ? C.gradientBtn : C.structGlass,
          backgroundSize: "300% 100%",
          padding: "4px 14px", borderRadius: 12,
          fontSize: 7, fontWeight: 700, fontFamily: "var(--m)",
          letterSpacing: ".14em",
          color: tier.badge === "MOST POPULAR" ? C.btnText : C.text3,
          border: tier.badge === "MOST POPULAR" ? "none" : `1px solid ${C.structBorderHover}`,
          boxShadow: tier.badge === "MOST POPULAR" ? `0 2px 12px ${C.accent020}` : "none",
        }}>
          {tier.badge}
        </div>
      )}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--m)", letterSpacing: ".2em", color: tier.accent ? C.accent : C.text4, marginBottom: 2, textShadow: tier.accent ? `0 0 16px ${C.accent030}` : "none" }}>
          {tier.name}
        </div>
        <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em", marginBottom: 12 }}>
          {tier.tagline}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 18 }}>
        <span style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--d)", color: C.text1 }}>{price}</span>
        <span style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>{period}</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={tier.accent ? C.accent : C.text4} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)", lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
      </div>
      <Button C={C} variant={tier.accent ? "primary" : "ghost"} onClick={onSelect}>
        {tier.cta}
      </Button>
    </div>
  );
}

// ─── MAIN ONBOARDING ─────────────────────────────────────────
export default function OnboardingScreen({ C, onComplete, changeAccent, changeSurface }) {
  const [messages, setMessages] = useState([]);
  const [flowIdx, setFlowIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [showOpts, setShowOpts] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showSurfacePicker, setShowSurfacePicker] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showMultiConfirm, setShowMultiConfirm] = useState(false);
  const [multiSelections, setMultiSelections] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState({});
  const [yearlyBilling, setYearlyBilling] = useState(true);
  const scrollRef = useRef();
  const inputRef = useRef();
  const started = useRef(false);

  const scroll = () => {
    if (scrollRef.current) setTimeout(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const s0 = FLOW[0];
    setTimeout(() => {
      setMessages([{ role: "ai", text: s0.ai }]);
      setTyping(false);
      setTimeout(() => {
        setFlowIdx(1);
        setTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "ai", text: FLOW[1].ai }]);
          setTyping(false);
          setShowOpts(true);
          setShowMultiConfirm(true);
        }, 900);
      }, s0.delay || 1200);
    }, 800);
  }, []);

  useEffect(scroll, [messages, typing, showTiers, showOpts, showThemePicker, showSurfacePicker, showInput, showMultiConfirm]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [showInput]);

  const clearInteractive = () => {
    setShowOpts(false);
    setShowThemePicker(false);
    setShowSurfacePicker(false);
    setShowInput(false);
    setShowMultiConfirm(false);
    setShowTiers(false);
    setMultiSelections([]);
    setInputValue("");
  };

  const advanceFlow = (newData, ni) => {
    if (ni >= FLOW.length) return;
    const next = FLOW[ni];
    setFlowIdx(ni);
    setTyping(true);

    const aiText = next.genAi ? next.genAi(newData) : next.ai;
    const full = next.followUp ? `${aiText}\n\n${next.followUp}` : aiText;

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: full }]);
      setTyping(false);
      if (next.showTiers) {
        setTimeout(() => setShowTiers(true), 700);
      } else if (next.showThemePicker) {
        setTimeout(() => setShowThemePicker(true), 500);
      } else if (next.showSurfacePicker) {
        setTimeout(() => setShowSurfacePicker(true), 500);
      } else if (next.showInput) {
        setTimeout(() => setShowInput(true), 350);
      } else if (next.options && next.multi) {
        setTimeout(() => { setShowOpts(true); setShowMultiConfirm(true); }, 350);
      } else if (next.options) {
        setTimeout(() => setShowOpts(true), 350);
      }
    }, 700 + Math.random() * 400);
  };

  const pick = (option) => {
    const step = FLOW[flowIdx];
    const label = typeof option === "string" ? option : option.label;
    const newData = { ...userData, [step.key]: label };
    setUserData(newData);
    clearInteractive();
    setMessages(prev => [...prev, { role: "user", text: label }]);
    advanceFlow(newData, flowIdx + 1);
  };

  const toggleMulti = (option) => {
    const label = typeof option === "string" ? option : option.label;
    setMultiSelections(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
  };

  const confirmMulti = () => {
    const step = FLOW[flowIdx];
    const selected = multiSelections.length > 0 ? multiSelections : ["None selected"];
    const newData = { ...userData, [step.key]: selected };
    setUserData(newData);
    clearInteractive();
    setMessages(prev => [...prev, { role: "user", text: selected.join(", ") }]);
    advanceFlow(newData, flowIdx + 1);
  };

  const submitInput = () => {
    const step = FLOW[flowIdx];
    const val = inputValue.trim();
    if (!val) return;
    const newData = { ...userData, [step.inputKey]: val };
    setUserData(newData);
    clearInteractive();
    setMessages(prev => [...prev, { role: "user", text: val }]);
    advanceFlow(newData, flowIdx + 1);
  };

  const pickTheme = (id) => {
    const names = { forge: "Forge Teal", platinum: "Platinum", obsidian: "Obsidian Violet", ember: "Ember", arctic: "Arctic Blue", crimson: "Crimson", gold: "Gold", rose: "Rose" };
    const newData = { ...userData, theme: id };
    setUserData(newData);
    clearInteractive();
    changeAccent?.(id);
    setMessages(prev => [...prev, { role: "user", text: names[id] || id }]);
    advanceFlow(newData, flowIdx + 1);
  };

  const pickSurface = (id) => {
    const newData = { ...userData, surface: id };
    setUserData(newData);
    clearInteractive();
    changeSurface?.(id);
    const surf = SURFACES[id];
    setMessages(prev => [...prev, { role: "user", text: surf?.name || id }]);
    advanceFlow(newData, flowIdx + 1);
  };

  const selectTier = (tier) => {
    const newData = {
      ...userData,
      tier: tier.name,
      tierPrice: yearlyBilling ? tier.yearlyPrice : tier.price,
      billing: yearlyBilling ? "yearly" : "monthly",
    };
    storage.set("ob", true);
    storage.set("ob_data", newData);
    storage.set("user_name", newData.name || "");
    storage.set("user_tier", tier.name);
    onComplete();
  };

  const totalSteps = FLOW.length;
  const progress = Math.min(flowIdx / (totalSteps - 1), 1);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      {/* Atmosphere orbs */}
      <div className="forge-orb" style={{
        position: "fixed", top: "8%", left: "50%",
        width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, ${C.accent005} 30%, transparent 60%)`,
        animation: "orbFloat 10s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div className="forge-orb" style={{
        position: "fixed", bottom: "10%", left: "25%",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
        animation: "orbFloat2 14s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 20px",
        borderBottom: `1px solid ${C.structBorder}`,
        background: C.headerBg,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <ForgeLogo C={C} size="sm" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", letterSpacing: ".06em" }}>FORGE</div>
          <div style={{ fontSize: 7, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em", textShadow: `0 0 12px ${C.accent030}` }}>fitnessforge.ai</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.ok, boxShadow: `0 0 8px ${C.ok}40`, animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>ONLINE</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.structBorder }}>
        <div style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: C.gradient, backgroundSize: "300% 100%",
          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 10px ${C.accent020}, 0 0 20px ${C.accent008}`,
        }} />
      </div>

      {/* Chat area */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "20px 16px 40px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((m, i) => (
          m.role === "ai" ? <AiMsg key={i} text={m.text} C={C} /> : <UserMsg key={i} text={m.text} C={C} />
        ))}

        {typing && <TypingDots C={C} />}

        {/* Single-select */}
        {showOpts && !typing && !FLOW[flowIdx]?.multi && FLOW[flowIdx]?.options && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            padding: "4px 0 4px 40px",
            animation: "fi 0.4s ease",
          }}>
            {FLOW[flowIdx].options.map((opt) => {
              const label = typeof opt === "string" ? opt : opt.label;
              return <OptionChip key={label} opt={opt} selected={false} onToggle={() => pick(opt)} C={C} />;
            })}
          </div>
        )}

        {/* Multi-select */}
        {showOpts && !typing && FLOW[flowIdx]?.multi && FLOW[flowIdx]?.options && (
          <div style={{ padding: "4px 0 4px 40px", animation: "fi 0.4s ease" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {FLOW[flowIdx].options.map((opt) => {
                const label = typeof opt === "string" ? opt : opt.label;
                return (
                  <OptionChip key={label} opt={opt} selected={multiSelections.includes(label)} onToggle={() => toggleMulti(opt)} C={C} />
                );
              })}
            </div>
            {showMultiConfirm && (
              <button onClick={confirmMulti} disabled={multiSelections.length === 0} style={{
                padding: "11px 28px",
                background: multiSelections.length > 0 ? C.gradientBtn : C.structGlass,
                backgroundSize: "300% 100%",
                border: `1.5px solid ${multiSelections.length > 0 ? C.accent030 : C.structBorderHover}`,
                borderRadius: 8,
                color: multiSelections.length > 0 ? C.btnText : C.text4,
                fontSize: 10,
                fontFamily: "var(--m)",
                fontWeight: 700,
                letterSpacing: ".14em",
                cursor: multiSelections.length > 0 ? "pointer" : "default",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                opacity: multiSelections.length > 0 ? 1 : 0.4,
                minHeight: 42,
                boxShadow: multiSelections.length > 0 ? `0 0 16px ${C.accent015}` : "none",
              }}>
                CONTINUE{multiSelections.length > 0 ? ` (${multiSelections.length})` : ""}
              </button>
            )}
          </div>
        )}

        {/* Text input */}
        {showInput && !typing && (
          <div style={{
            padding: "4px 0 4px 40px",
            animation: "fi 0.4s ease",
            display: "flex", gap: 8, maxWidth: 340,
          }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitInput(); }}
              placeholder={FLOW[flowIdx]?.inputPlaceholder || "Type here..."}
              style={{
                flex: 1, padding: "12px 18px",
                background: C.structGlass,
                border: `1.5px solid ${C.structBorderHover}`,
                borderRadius: 24,
                color: C.text1,
                fontSize: 14,
                fontFamily: "var(--b)",
                fontWeight: 500,
                outline: "none",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.2s",
              }}
            />
            <button onClick={submitInput} disabled={!inputValue.trim()} style={{
              width: 44, height: 44, borderRadius: 22,
              background: inputValue.trim() ? C.gradientBtn : C.structGlass,
              backgroundSize: "300% 100%",
              border: `1.5px solid ${inputValue.trim() ? C.accent030 : C.structBorderHover}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: inputValue.trim() ? "pointer" : "default",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              opacity: inputValue.trim() ? 1 : 0.4,
              flexShrink: 0,
              boxShadow: inputValue.trim() ? `0 0 12px ${C.accent015}` : "none",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inputValue.trim() ? C.btnText : C.text4} strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        )}

        {/* Theme picker */}
        {showThemePicker && !typing && (
          <div style={{ padding: "8px 0 4px 40px", animation: "fi 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxWidth: 320 }}>
              {Object.values(ACCENTS).map((acc) => (
                <button key={acc.id} onClick={() => pickTheme(acc.id)} style={{
                  padding: "14px 6px",
                  background: C.cardGradient,
                  border: `1.5px solid ${C.structBorderHover}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 8,
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  position: "relative", overflow: "hidden",
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
                    background: acc.gradient, backgroundSize: "300% 100%",
                    borderRadius: 1,
                    boxShadow: `0 0 8px ${acc.accent}30`,
                  }} />
                  <div style={{
                    width: 30, height: 30, borderRadius: 15,
                    background: acc.gradient, backgroundSize: "300% 100%",
                    boxShadow: `0 0 16px ${acc.accent}40, 0 2px 8px rgba(0,0,0,0.3)`,
                    border: `2px solid ${acc.accent}50`,
                  }} />
                  <div style={{
                    fontSize: 7, color: C.text3, fontFamily: "var(--m)",
                    letterSpacing: ".08em", fontWeight: 600,
                  }}>{acc.name.toUpperCase()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Surface picker */}
        {showSurfacePicker && !typing && (
          <div style={{ padding: "8px 0 4px 40px", animation: "fi 0.5s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 380 }}>
              {Object.values(SURFACES).map((surf) => (
                <button key={surf.id} onClick={() => pickSurface(surf.id)} style={{
                  padding: "14px 6px",
                  background: surf.bg,
                  border: `1.5px solid ${C.structBorderHover}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6,
                  transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: surf.card,
                    border: "1px solid rgba(180,195,210,0.15)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }} />
                  <div style={{
                    fontSize: 7, color: surf.isLight ? "#1a1a2e" : "#C8CDD2", fontFamily: "var(--m)",
                    letterSpacing: ".06em", fontWeight: 600,
                  }}>{surf.name.toUpperCase()}</div>
                  <div style={{
                    fontSize: 5, color: surf.isLight ? "#5a5a78" : "#788090", fontFamily: "var(--m)",
                    letterSpacing: ".04em",
                  }}>{surf.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tier cards */}
        {showTiers && (
          <div style={{ padding: "12px 0", animation: "fi 0.6s ease" }}>
            {/* Billing toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginBottom: 22,
            }}>
              <span style={{
                fontSize: 10, fontFamily: "var(--m)", fontWeight: 600,
                letterSpacing: ".08em",
                color: !yearlyBilling ? C.text1 : C.text4,
                transition: "color 0.2s",
              }}>MONTHLY</span>
              <button onClick={() => setYearlyBilling(!yearlyBilling)} style={{
                width: 46, height: 26, borderRadius: 13,
                background: yearlyBilling ? C.accent : C.structBorderStrong,
                border: `1px solid ${yearlyBilling ? C.accent040 : C.structBorderHover}`,
                cursor: "pointer",
                position: "relative", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                padding: 0,
                boxShadow: yearlyBilling ? `0 0 12px ${C.accent020}` : "none",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10,
                  background: C.text1,
                  position: "absolute", top: 2,
                  left: yearlyBilling ? 23 : 3,
                  transition: "left 0.25s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </button>
              <span style={{
                fontSize: 10, fontFamily: "var(--m)", fontWeight: 600,
                letterSpacing: ".08em",
                color: yearlyBilling ? C.text1 : C.text4,
                transition: "color 0.2s",
              }}>YEARLY</span>
              {yearlyBilling && (
                <span style={{
                  fontSize: 8, fontFamily: "var(--m)", fontWeight: 700,
                  color: C.ok, letterSpacing: ".06em",
                  padding: "3px 10px", borderRadius: 10,
                  background: `${C.ok}12`,
                  border: `1px solid ${C.ok}25`,
                  animation: "fi 0.3s ease",
                }}>SAVE 33%</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TIERS.map((tier) => (
                <TierCard key={tier.name} tier={tier} C={C} onSelect={() => selectTier(tier)} yearly={yearlyBilling} />
              ))}
            </div>
            <div style={{
              fontSize: 7, color: C.text5, fontFamily: "var(--m)",
              letterSpacing: ".1em", textAlign: "center", marginTop: 20, lineHeight: 2,
            }}>
              14-DAY FREE TRIAL ON ALL PLANS · CANCEL ANYTIME
              <br />NO CHARGE UNTIL YOUR TRIAL ENDS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
