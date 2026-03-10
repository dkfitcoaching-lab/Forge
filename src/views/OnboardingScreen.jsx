import { useState, useEffect, useRef } from "react";
import { Button, ForgeLogo } from "../components/Primitives";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// FORGE AI ONBOARDING — Conversion-Optimized Sales Funnel
// Conversational AI coach that discovers pain points, builds
// value, and presents tiered plans. Multi-select + text input.
// No free tier. Every step designed to convert.
// ══════════════════════════════════════════════════════════════

// ─── CONVERSATION FLOW ──────────────────────────────────────
// Each step: { ai | genAi, options?, multi?, key?, followUp?,
//   autoAdvance?, delay?, showThemePicker?, showTiers?, showInput? }
const FLOW = [
  // 0 — Welcome
  {
    ai: "Welcome to Forge — your AI-powered performance coach.\n\nI'm going to ask you a few questions so I can build a program that's completely tailored to you. This takes about 2 minutes.",
    autoAdvance: true,
    delay: 2200,
  },
  // 1 — Primary goal
  {
    ai: "First — what's your primary focus right now?",
    options: [
      { label: "Build Muscle", icon: "💪" },
      { label: "Lose Fat", icon: "🔥" },
      { label: "Get Stronger", icon: "🏋️" },
      { label: "Athletic Performance", icon: "⚡" },
    ],
    key: "goal",
  },
  // 2 — AI acknowledges + asks pain points (MULTI-SELECT)
  {
    genAi: (d) => {
      const r = {
        "Build Muscle": "Hypertrophy is what Forge was built for. The 14-day periodized split maximizes muscle stimulus and recovery — backed by progressive overload tracking that tells you exactly when to push harder.",
        "Lose Fat": "Smart fat loss without losing muscle — that's the real challenge. Forge tracks your nutrition, training volume, and recovery to keep you in an optimal deficit while protecting your hard-earned strength.",
        "Get Stronger": "Strength is the foundation of everything. Forge programs compound movements with built-in PR detection and progressive overload targets that scale with your capacity.",
        "Athletic Performance": "Peak performance demands precision across every variable — power output, recovery quality, nutrition timing, training density. Forge tracks all of it.",
      };
      return r[d.goal] || "Forge is built to push your limits.";
    },
    followUp: "What are your biggest struggles right now? Select all that apply.",
    options: [
      { label: "Inconsistent training" },
      { label: "No structured program" },
      { label: "Nutrition confusion" },
      { label: "Plateaued progress" },
      { label: "No accountability" },
      { label: "Information overload" },
      { label: "Recovery / injuries" },
      { label: "Time management" },
    ],
    multi: true,
    key: "struggles",
  },
  // 3 — AI validates struggles + asks experience
  {
    genAi: (d) => {
      const s = d.struggles || [];
      const parts = [];

      if (s.includes("Inconsistent training") || s.includes("No accountability"))
        parts.push("Consistency is where most people fail — not because they lack motivation, but because they lack a system. Forge gives you a clear daily plan with built-in accountability tracking that makes showing up automatic.");
      if (s.includes("No structured program"))
        parts.push("Training without a program is like driving without a map. You might move, but you won't arrive. Forge's 14-day periodized split handles exercise selection, volume, and progression — you just execute.");
      if (s.includes("Nutrition confusion"))
        parts.push("Nutrition misinformation is rampant. Everyone has an opinion, most are wrong. Forge cuts through the noise with precise macro tracking, meal timing, and a snap calculator that makes logging effortless.");
      if (s.includes("Plateaued progress"))
        parts.push("Plateaus happen when stimulus stays constant while adaptation advances. Forge's progressive overload engine detects exactly when you're ready to increase weight, volume, or intensity — and tells you.");
      if (s.includes("Information overload"))
        parts.push("The fitness industry profits from your confusion. More products, more plans, more contradictions. Forge consolidates everything into one system built on what the research actually shows works.");
      if (s.includes("Recovery / injuries"))
        parts.push("Training hard is only half the equation — recovering smart is the other half. Forge monitors your fatigue score, sleep quality, and stress levels to adjust your training intensity in real-time.");
      if (s.includes("Time management"))
        parts.push("You don't need more time — you need a system that respects your time. Every Forge session is structured down to the set and rep, with rest timers and guided cues so there's zero wasted minutes.");

      if (parts.length === 0)
        parts.push("Those are the exact problems Forge was designed to solve. Most people know what they should be doing — they just don't have the system to make it happen consistently.");

      // Pick top 2-3 responses to keep it concise
      const response = parts.slice(0, Math.min(parts.length, 2)).join("\n\n");
      return response;
    },
    followUp: "How long have you been training?",
    options: [
      { label: "Just starting out" },
      { label: "Under 1 year" },
      { label: "1-3 years" },
      { label: "3-5 years" },
      { label: "5+ years" },
    ],
    key: "experience",
  },
  // 4 — AI adapts to experience + asks what they've tried (MULTI-SELECT)
  {
    genAi: (d) => {
      const e = d.experience || "";
      if (e === "Just starting out" || e === "Under 1 year")
        return "Starting with a proper system from day one is the biggest advantage you can have. Most people waste their first 1-2 years following random workouts and fad diets. You won't.";
      if (e === "1-3 years")
        return "This is the make-or-break stage. Initial gains are slowing down, and what got you here won't get you further. This is exactly when intelligent programming and precision tracking separate those who plateau from those who transform.";
      if (e === "3-5 years")
        return "At your level, the margin between good and great comes down to data. You already know how to train — Forge gives you the analytics to train optimally. PR detection, fatigue modeling, volume periodization — the details that drive advanced progress.";
      return "With 5+ years of training, you know the fundamentals cold. What you need is a system that tracks the variables you can't track in your head — progressive overload curves, muscle volume distribution, readiness scoring, and fatigue accumulation patterns.";
    },
    followUp: "What have you tried before? Select all that apply.",
    options: [
      { label: "Gym on my own" },
      { label: "Personal trainer" },
      { label: "Online programs" },
      { label: "Fitness apps" },
      { label: "Group classes" },
      { label: "YouTube / social media" },
      { label: "Nothing yet" },
    ],
    multi: true,
    key: "triedBefore",
  },
  // 5 — AI addresses why those failed + asks what matters most (MULTI-SELECT)
  {
    genAi: (d) => {
      const t = d.triedBefore || [];
      const parts = [];

      if (t.includes("Personal trainer"))
        parts.push("Personal trainers can be great — but $60-150 per session adds up fast, and you're dependent on their schedule and availability. Forge gives you the same intelligent programming and real-time coaching feedback at a fraction of the cost, available 24/7.");
      if (t.includes("Online programs"))
        parts.push("Most online programs are one-size-fits-all PDFs dressed up as personalization. They don't adapt, don't track, and don't evolve with you. Forge is a living system that responds to your data in real-time.");
      if (t.includes("Fitness apps"))
        parts.push("Most fitness apps are glorified rep counters with a subscription attached. They track what you did, but they don't tell you what to do next. Forge's intelligence layer is the difference — it analyzes your patterns and drives decisions.");
      if (t.includes("YouTube / social media"))
        parts.push("Social media fitness is entertainment disguised as education. What works for an influencer on gear won't work for you. Forge is built on evidence-based programming, not content that exists to get clicks.");
      if (t.includes("Group classes"))
        parts.push("Group classes are great for general fitness, but they can't be optimized for your specific goals, recovery capacity, or progression needs. Forge programs around you — not a room of 30 people.");

      if (parts.length === 0)
        parts.push("Whatever you've tried before — the reason it didn't stick is usually the same: it wasn't built around YOUR data, YOUR recovery, YOUR progression curve. Forge changes that.");

      return parts.slice(0, 2).join("\n\n");
    },
    followUp: "What matters most to you in a coaching platform? Select your top priorities.",
    options: [
      { label: "Structured programming" },
      { label: "Nutrition guidance" },
      { label: "Progress tracking" },
      { label: "Accountability" },
      { label: "Expert coaching access" },
      { label: "Data & analytics" },
      { label: "Convenience / ease of use" },
    ],
    multi: true,
    key: "priorities",
  },
  // 6 — AI builds personalized value prop + asks schedule
  {
    genAi: (d) => {
      const p = d.priorities || [];
      const val = [];

      if (p.includes("Structured programming"))
        val.push("✓ 14-day periodized training split with exercise selection, volume targets, and form cues — adapts to your progression");
      if (p.includes("Nutrition guidance"))
        val.push("✓ Full meal plans with macro tracking, snap calculator for logging, and hydration monitoring");
      if (p.includes("Progress tracking"))
        val.push("✓ PR detection, volume trends, weight curves, body measurements, and progress photo timeline with side-by-side comparison");
      if (p.includes("Accountability"))
        val.push("✓ Daily check-ins, streak tracking, readiness scoring, and AI coaching that notices when you're slipping");
      if (p.includes("Expert coaching access"))
        val.push("✓ AI coach trained on exercise science and real coaching data — available 24/7, never takes a day off");
      if (p.includes("Data & analytics"))
        val.push("✓ Fatigue modeling, progressive overload targets, muscle volume heatmap, and trend analysis across every metric");
      if (p.includes("Convenience / ease of use"))
        val.push("✓ One-tap set logging, guided workout player with rest timers, and everything in one place — no switching between 5 apps");

      const intro = "Here's what Forge delivers for you:";
      const list = val.length > 0 ? val.join("\n") : "✓ Everything you need — structured training, nutrition, analytics, and coaching — in one system";
      return `${intro}\n\n${list}`;
    },
    followUp: "How many days per week can you commit to training?",
    options: [
      { label: "2-3 days" },
      { label: "4-5 days" },
      { label: "6-7 days" },
    ],
    key: "frequency",
  },
  // 7 — AI responds to frequency + asks about age range
  {
    genAi: (d) => {
      const f = d.frequency || "";
      if (f === "6-7 days") return "That dedication is exactly what separates people who get results from people who talk about it. Forge's 14-day cycle builds in strategic recovery days because growth happens during rest — the system ensures you're always pushing at the right intensity.";
      if (f === "4-5 days") return "The sweet spot. Forge's 14-day split maps perfectly to 4-5 training days with built-in recovery windows. Every session is purposeful — zero junk volume, zero wasted sets.";
      return "Quality over quantity. Forge adapts its programming to maximize stimulus within your schedule. Fewer days doesn't mean less progress — it means every session has to count, and the program ensures it does.";
    },
    followUp: "What's your age range?",
    options: [
      { label: "Under 20" },
      { label: "20-29" },
      { label: "30-39" },
      { label: "40-49" },
      { label: "50+" },
    ],
    key: "ageRange",
  },
  // 8 — AI adapts to age + asks for name (TEXT INPUT)
  {
    genAi: (d) => {
      const a = d.ageRange || "";
      if (a === "Under 20") return "Building the foundation early gives you decades of advantage. Forge focuses on proper movement patterns, progressive loading, and habit formation — the things that create lifelong results, not just short-term pumps.";
      if (a === "20-29") return "This is your prime building window. Recovery capacity is high, adaptation is fast, and the habits you build now compound over the next 30+ years. Forge makes sure you're not wasting a single one of these years.";
      if (a === "30-39") return "The thirties are where intelligent training separates from brute force. Recovery demands more attention, volume needs to be strategic, and nutrition can't be an afterthought. Forge's fatigue monitoring and readiness scoring become critical tools here.";
      if (a === "40-49") return "Training in your 40s is about precision — maximizing stimulus while respecting recovery. Forge's readiness scoring and fatigue model ensure you're training at the right intensity every session, reducing injury risk while still driving progress.";
      return "Experience is your advantage. Forge adapts training intensity based on your daily readiness, monitors fatigue accumulation, and ensures every session adds value. Smart programming means continued progress at any age.";
    },
    followUp: "Almost done. What should I call you?",
    showInput: true,
    inputKey: "name",
    inputPlaceholder: "Your first name",
  },
  // 9 — AI greets by name + theme picker
  {
    genAi: (d) => {
      const name = d.name || "Athlete";
      return `${name} — let's make this yours.\n\nChoose your signature accent color. This defines the entire visual identity of your Forge experience.`;
    },
    showThemePicker: true,
  },
  // 10 — AI confirms theme + surface picker
  {
    genAi: (d) => {
      const names = { forge: "Forge Teal", platinum: "Platinum", obsidian: "Obsidian Violet", ember: "Ember", arctic: "Arctic Blue", crimson: "Crimson", gold: "Gold", rose: "Rose" };
      return `${names[d.theme] || "Perfect"} — sharp choice.\n\nNow choose your background surface. This is the base tone of everything you'll see.`;
    },
    showSurfacePicker: true,
  },
  // 11 — Personalized summary + tiers
  {
    genAi: (d) => {
      const name = d.name || "Athlete";
      const goal = d.goal || "your goals";
      return `${name}, here's what I've built for you:\n\n→ Goal: ${goal}\n→ Schedule: ${d.frequency || "flexible"}\n→ Experience: ${d.experience || "any level"}\n→ Training: AI-periodized, adapts to your data\n→ Nutrition: Full macro tracking + meal guidance\n→ Analytics: Fatigue model, PR detection, volume trends\n→ Coach: 24/7 AI coaching — never takes a day off\n\nEvery feature is designed to solve the exact problems you described. Choose the plan that fits your commitment level:`;
    },
    showTiers: true,
  },
];

// ─── TIER DEFINITIONS (no free tier) ─────────────────────────
const TIERS = [
  {
    name: "FORGE",
    tagline: "Self-Guided Performance",
    price: "$14.99",
    period: "/mo",
    yearlyPrice: "$9.99",
    yearlyPeriod: "/mo billed yearly",
    features: [
      "14-day periodized training split",
      "Guided workout player with rest timers",
      "Full nutrition tracking + meal plans",
      "Hydration & supplement tracking",
      "Daily check-ins + readiness score",
      "Progress photos + measurements",
      "Volume logging + PR detection",
    ],
    accent: false,
    cta: "START 14-DAY TRIAL",
  },
  {
    name: "FORGE PRO",
    tagline: "AI-Powered Coaching",
    price: "$29.99",
    period: "/mo",
    yearlyPrice: "$19.99",
    yearlyPeriod: "/mo billed yearly",
    features: [
      "Everything in Forge, plus:",
      "24/7 AI Coach (unlimited)",
      "Advanced analytics dashboard",
      "Fatigue model + readiness AI",
      "Progressive overload engine",
      "Muscle volume heatmap",
      "Custom exercise substitutions",
      "Weekly performance reports",
    ],
    accent: true,
    cta: "START 14-DAY TRIAL",
    badge: "MOST POPULAR",
  },
  {
    name: "FORGE ELITE",
    tagline: "World-Class Coaching",
    price: "$49.99",
    period: "/mo",
    yearlyPrice: "$34.99",
    yearlyPeriod: "/mo billed yearly",
    features: [
      "Everything in Pro, plus:",
      "1-on-1 human coach access",
      "Custom program design",
      "Video form analysis",
      "Priority response (< 1 hour)",
      "Quarterly program reviews",
      "Early access to new features",
    ],
    accent: false,
    cta: "START 14-DAY TRIAL",
    badge: "PREMIUM",
  },
];

// ─── TYPING INDICATOR ────────────────────────────────────────
function TypingDots({ C }) {
  return (
    <div style={{ display: "flex", gap: 8, animation: "fadeIn 0.2s ease" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "14px 20px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: C.accent,
            animation: `pulse 1.4s ease-in-out infinite ${i * 0.2}s`,
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
        width: 30, height: 30, borderRadius: 10,
        background: C.gradient, backgroundSize: "300% 100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900, color: C.btnText, fontFamily: "var(--d)",
        flexShrink: 0, marginTop: 2,
      }}>F</div>
      <div style={{
        background: C.cardGradient,
        border: `1px solid ${C.structBorderHover}`,
        borderRadius: "4px 16px 16px 16px",
        padding: "14px 18px",
        maxWidth: "85%",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25), 0 4px 20px rgba(0,0,0,0.1)",
      }}>
        <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.75, whiteSpace: "pre-line" }}>{text}</div>
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
        border: `1px solid ${C.accent015}`,
        borderRadius: "16px 4px 16px 16px",
        padding: "12px 18px",
        maxWidth: "80%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

// ─── MULTI-SELECT OPTION BUTTON ──────────────────────────────
function OptionChip({ opt, selected, onToggle, C }) {
  const label = typeof opt === "string" ? opt : opt.label;
  const icon = typeof opt === "object" ? opt.icon : null;
  const active = selected;

  return (
    <button onClick={onToggle} style={{
      padding: icon ? "10px 16px" : "10px 18px",
      background: active ? C.accent015 : C.accent005,
      border: `1.5px solid ${active ? C.accent040 : C.accent020}`,
      borderRadius: 24,
      color: active ? C.accent : C.text1,
      fontSize: 12,
      fontFamily: "var(--m)",
      fontWeight: active ? 700 : 600,
      cursor: "pointer",
      transition: "all 0.2s",
      letterSpacing: ".04em",
      minHeight: 44,
      display: "flex", alignItems: "center", gap: 6,
      boxShadow: active ? `0 0 12px ${C.accent015}` : "none",
      transform: active ? "scale(1.02)" : "scale(1)",
    }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      {label}
      {active && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round">
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
      padding: 20,
      position: "relative",
      boxShadow: tier.accent
        ? `0 4px 24px ${C.accent015}, 0 0 48px ${C.accent008}`
        : "0 2px 12px rgba(0,0,0,0.2)",
      animation: tier.accent ? "accentBreathe 5s ease-in-out infinite" : "none",
    }}>
      {tier.badge && (
        <div style={{
          position: "absolute", top: -10, right: 16,
          background: tier.badge === "MOST POPULAR" ? C.gradientBtn : C.structGlass,
          backgroundSize: "300% 100%",
          padding: "4px 12px", borderRadius: 12,
          fontSize: 7, fontWeight: 700, fontFamily: "var(--m)",
          letterSpacing: ".14em",
          color: tier.badge === "MOST POPULAR" ? C.btnText : C.text3,
          border: tier.badge === "MOST POPULAR" ? "none" : `1px solid ${C.structBorderHover}`,
        }}>
          {tier.badge}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--m)", letterSpacing: ".2em", color: tier.accent ? C.accent : C.text4, marginBottom: 2 }}>
            {tier.name}
          </div>
          <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em", marginBottom: 10 }}>
            {tier.tagline}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 16 }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--d)", color: C.text1 }}>{price}</span>
        <span style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>{period}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={tier.accent ? C.accent : C.text4} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)" }}>{f}</span>
          </div>
        ))}
      </div>
      <Button C={C} variant={tier.accent ? "primary" : "ghost"} onClick={onSelect}>
        {tier.cta}
      </Button>
    </div>
  );
}

// ─── MAIN ONBOARDING COMPONENT ───────────────────────────────
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
  const [selectedTier, setSelectedTier] = useState(null);
  const scrollRef = useRef();
  const inputRef = useRef();
  const started = useRef(false);

  const scroll = () => {
    if (scrollRef.current) setTimeout(() => { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 60);
  };

  // Start conversation
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const s0 = FLOW[0];
    setTimeout(() => {
      setMessages([{ role: "ai", text: s0.ai }]);
      setTyping(false);
      // Auto-advance
      setTimeout(() => {
        setFlowIdx(1);
        setTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { role: "ai", text: FLOW[1].ai }]);
          setTyping(false);
          setShowOpts(true);
        }, 900);
      }, s0.delay || 1200);
    }, 800);
  }, []);

  useEffect(scroll, [messages, typing, showTiers, showOpts, showThemePicker, showSurfacePicker, showInput, showMultiConfirm]);

  // Focus text input when shown
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

  // Single-select pick
  const pick = (option) => {
    const step = FLOW[flowIdx];
    const label = typeof option === "string" ? option : option.label;
    const newData = { ...userData, [step.key]: label };
    setUserData(newData);
    clearInteractive();
    setMessages(prev => [...prev, { role: "user", text: label }]);
    advanceFlow(newData, flowIdx + 1);
  };

  // Multi-select toggle
  const toggleMulti = (option) => {
    const label = typeof option === "string" ? option : option.label;
    setMultiSelections(prev =>
      prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]
    );
  };

  // Multi-select confirm
  const confirmMulti = () => {
    const step = FLOW[flowIdx];
    const selected = multiSelections.length > 0 ? multiSelections : ["None selected"];
    const newData = { ...userData, [step.key]: selected };
    setUserData(newData);
    clearInteractive();
    setMessages(prev => [...prev, { role: "user", text: selected.join(", ") }]);
    advanceFlow(newData, flowIdx + 1);
  };

  // Text input submit
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

  // Theme picker
  const pickTheme = (id) => {
    const names = { forge: "Forge Teal", platinum: "Platinum", obsidian: "Obsidian Violet", ember: "Ember", arctic: "Arctic Blue", crimson: "Crimson", gold: "Gold", rose: "Rose" };
    const newData = { ...userData, theme: id };
    setUserData(newData);
    clearInteractive();
    changeAccent?.(id);
    setMessages(prev => [...prev, { role: "user", text: names[id] || id }]);
    advanceFlow(newData, flowIdx + 1);
  };

  // Surface picker
  const pickSurface = (id) => {
    const newData = { ...userData, surface: id };
    setUserData(newData);
    clearInteractive();
    changeSurface?.(id);
    const surf = SURFACES[id];
    setMessages(prev => [...prev, { role: "user", text: surf?.name || id }]);
    advanceFlow(newData, flowIdx + 1);
  };

  // Tier selection
  const selectTier = (tier) => {
    setSelectedTier(tier.name);
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

  // Progress indicator
  const totalSteps = FLOW.length;
  const progress = Math.min(flowIdx / (totalSteps - 1), 1);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1,
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      {/* Atmosphere */}
      <div className="forge-orb" style={{
        position: "fixed", top: "10%", left: "50%",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`,
        animation: "orbFloat 8s ease-in-out infinite", pointerEvents: "none",
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
          <div style={{ fontSize: 7, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em" }}>fitnessforge.ai</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.ok, animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>ACTIVE</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.structBorder }}>
        <div style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: C.gradient, backgroundSize: "300% 100%",
          transition: "width 0.5s ease",
          boxShadow: `0 0 8px ${C.accent020}`,
        }} />
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", padding: "20px 16px 40px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((m, i) => (
          m.role === "ai" ? <AiMsg key={i} text={m.text} C={C} /> : <UserMsg key={i} text={m.text} C={C} />
        ))}

        {typing && <TypingDots C={C} />}

        {/* Single-select option buttons */}
        {showOpts && !typing && !FLOW[flowIdx]?.multi && FLOW[flowIdx]?.options && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            padding: "4px 0 4px 38px",
            animation: "fi 0.4s ease",
          }}>
            {FLOW[flowIdx].options.map((opt) => {
              const label = typeof opt === "string" ? opt : opt.label;
              return (
                <OptionChip key={label} opt={opt} selected={false} onToggle={() => pick(opt)} C={C} />
              );
            })}
          </div>
        )}

        {/* Multi-select option buttons */}
        {showOpts && !typing && FLOW[flowIdx]?.multi && FLOW[flowIdx]?.options && (
          <div style={{
            padding: "4px 0 4px 38px",
            animation: "fi 0.4s ease",
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {FLOW[flowIdx].options.map((opt) => {
                const label = typeof opt === "string" ? opt : opt.label;
                return (
                  <OptionChip
                    key={label}
                    opt={opt}
                    selected={multiSelections.includes(label)}
                    onToggle={() => toggleMulti(opt)}
                    C={C}
                  />
                );
              })}
            </div>
            {showMultiConfirm && (
              <button onClick={confirmMulti} disabled={multiSelections.length === 0} style={{
                padding: "10px 24px",
                background: multiSelections.length > 0 ? C.gradientBtn : C.structGlass,
                backgroundSize: "300% 100%",
                border: `1.5px solid ${multiSelections.length > 0 ? C.accent030 : C.structBorderHover}`,
                borderRadius: 8,
                color: multiSelections.length > 0 ? C.btnText : C.text4,
                fontSize: 10,
                fontFamily: "var(--m)",
                fontWeight: 700,
                letterSpacing: ".12em",
                cursor: multiSelections.length > 0 ? "pointer" : "default",
                transition: "all 0.2s",
                opacity: multiSelections.length > 0 ? 1 : 0.5,
                minHeight: 40,
              }}>
                CONTINUE{multiSelections.length > 0 ? ` (${multiSelections.length})` : ""}
              </button>
            )}
          </div>
        )}

        {/* Text input */}
        {showInput && !typing && (
          <div style={{
            padding: "4px 0 4px 38px",
            animation: "fi 0.4s ease",
            display: "flex", gap: 8, maxWidth: 320,
          }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitInput(); }}
              placeholder={FLOW[flowIdx]?.inputPlaceholder || "Type here..."}
              style={{
                flex: 1, padding: "12px 16px",
                background: C.structGlass,
                border: `1.5px solid ${C.structBorderHover}`,
                borderRadius: 24,
                color: C.text1,
                fontSize: 13,
                fontFamily: "var(--m)",
                outline: "none",
              }}
            />
            <button onClick={submitInput} disabled={!inputValue.trim()} style={{
              width: 44, height: 44, borderRadius: 22,
              background: inputValue.trim() ? C.gradientBtn : C.structGlass,
              backgroundSize: "300% 100%",
              border: `1.5px solid ${inputValue.trim() ? C.accent030 : C.structBorderHover}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: inputValue.trim() ? "pointer" : "default",
              transition: "all 0.2s",
              opacity: inputValue.trim() ? 1 : 0.5,
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inputValue.trim() ? C.btnText : C.text4} strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        )}

        {/* Theme Picker */}
        {showThemePicker && !typing && (
          <div style={{
            padding: "8px 0 4px 38px",
            animation: "fi 0.5s ease",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
              maxWidth: 320,
            }}>
              {Object.values(ACCENTS).map((acc) => (
                <button key={acc.id} onClick={() => pickTheme(acc.id)} style={{
                  padding: "12px 6px",
                  background: C.cardGradient,
                  border: `1.5px solid ${C.structBorderHover}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 8,
                  transition: "all 0.2s",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
                    background: acc.gradient, backgroundSize: "300% 100%",
                    borderRadius: 1,
                  }} />
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: acc.gradient, backgroundSize: "300% 100%",
                    boxShadow: `0 0 14px ${acc.accent}40, 0 2px 8px rgba(0,0,0,0.3)`,
                    border: `2px solid ${acc.accent}60`,
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

        {/* Surface Picker */}
        {showSurfacePicker && !typing && (
          <div style={{
            padding: "8px 0 4px 38px",
            animation: "fi 0.5s ease",
          }}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8,
              maxWidth: 360,
            }}>
              {Object.values(SURFACES).map((surf) => (
                <button key={surf.id} onClick={() => pickSurface(surf.id)} style={{
                  padding: "14px 6px",
                  background: surf.bg,
                  border: `1.5px solid ${C.structBorderHover}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                  position: "relative",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: surf.card,
                    border: `1px solid rgba(180,195,210,0.15)`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
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

        {/* Tier Cards */}
        {showTiers && (
          <div style={{ padding: "12px 0", animation: "fi 0.6s ease" }}>
            {/* Billing toggle */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginBottom: 20,
            }}>
              <span style={{
                fontSize: 10, fontFamily: "var(--m)", fontWeight: 600,
                letterSpacing: ".08em",
                color: !yearlyBilling ? C.text1 : C.text4,
              }}>MONTHLY</span>
              <button onClick={() => setYearlyBilling(!yearlyBilling)} style={{
                width: 44, height: 24, borderRadius: 12,
                background: yearlyBilling ? C.accent : C.structBorderStrong,
                border: "none", cursor: "pointer",
                position: "relative", transition: "background 0.2s",
                padding: 0,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9,
                  background: C.text1,
                  position: "absolute", top: 3,
                  left: yearlyBilling ? 23 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </button>
              <span style={{
                fontSize: 10, fontFamily: "var(--m)", fontWeight: 600,
                letterSpacing: ".08em",
                color: yearlyBilling ? C.text1 : C.text4,
              }}>YEARLY</span>
              {yearlyBilling && (
                <span style={{
                  fontSize: 8, fontFamily: "var(--m)", fontWeight: 700,
                  color: C.ok, letterSpacing: ".06em",
                  padding: "2px 8px", borderRadius: 10,
                  background: `${C.ok}15`,
                  border: `1px solid ${C.ok}30`,
                }}>SAVE 33%</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TIERS.map((tier) => (
                <TierCard key={tier.name} tier={tier} C={C} onSelect={() => selectTier(tier)} yearly={yearlyBilling} />
              ))}
            </div>
            <div style={{
              fontSize: 7, color: C.text5, fontFamily: "var(--m)",
              letterSpacing: ".1em", textAlign: "center", marginTop: 16, lineHeight: 1.8,
            }}>
              ALL PLANS INCLUDE 14-DAY FREE TRIAL · CANCEL ANYTIME
              <br />NO CHARGE UNTIL TRIAL ENDS · MONEY-BACK GUARANTEE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
