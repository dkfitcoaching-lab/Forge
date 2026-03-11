import { useState, useCallback, useRef } from "react";
import { StaggerItem, Card, Button, Label, SectionDivider } from "../components/Primitives";
import { ReadinessGauge, StreakFlame } from "../components/Celebration";
import { RadialProgress, MacroRing } from "../components/Charts";
import { useStaggeredReveal } from "../utils/hooks";
import { MEALS, MACRO_CAPS, SUPPLEMENTS } from "../data/nutrition";
import { computeStats, computeReadinessScore, getProgressiveOverloadTargets } from "../utils/analytics";
import { getProactiveIntelligence } from "../utils/notifications";
import DAYS from "../data/workouts";
import storage from "../utils/storage";
import { tapLight, tapMedium, tapDouble } from "../utils/haptics";

export default function TodayView({ C, onWork, onNav, showToast }) {
  const activeSessionCheck = storage.get("active_session", null);
  const hasRecovery = activeSessionCheck && activeSessionCheck.dayNum && Date.now() - activeSessionCheck.timestamp < 86400000;
  const visible = useStaggeredReveal(hasRecovery ? 13 : 12, 55);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const now = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const dateStr = `${dayNames[now.getDay()]} — ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const todayKey = now.toISOString().split("T")[0]; // YYYY-MM-DD, locale-safe

  const [currentDay, setCurrentDay] = useState(() => storage.get("cd", 1));
  const dayData = DAYS[currentDay - 1] || DAYS[0];
  const isRest = dayData.t === "REST + RECOVERY";

  const [mealsChecked, setMealsChecked] = useState(() => storage.get("mc_" + todayKey, {}));
  const mealsCompleted = Object.values(mealsChecked).filter(Boolean).length;
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [foodLogs, setFoodLogs] = useState(() => storage.get("fl_" + todayKey, {}));
  const [editingFood, setEditingFood] = useState(null);
  const [mealPhotos, setMealPhotos] = useState(() => storage.get("mp_" + todayKey, {}));
  const mealFileRefs = useRef({});
  const toggleMeal = (i) => {
    tapLight();
    const next = { ...mealsChecked, [i]: !mealsChecked[i] };
    setMealsChecked(next);
    storage.set("mc_" + todayKey, next);
  };

  const handleMealPhoto = (mealIdx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const next = { ...mealPhotos, [mealIdx]: { photo: ev.target.result, time: Date.now() } };
      setMealPhotos(next);
      storage.set("mp_" + todayKey, next);
      showToast?.("Meal photo logged");
    };
    reader.readAsDataURL(file);
  };

  const [waterCount, setWaterCount] = useState(() => storage.get("wt_" + todayKey, 0));
  const waterGoal = 16;

  const [suppChecked, setSuppChecked] = useState(() => storage.get("sp_" + todayKey, {}));
  const toggleSupp = (i) => {
    tapLight();
    const next = { ...suppChecked, [i]: !suppChecked[i] };
    setSuppChecked(next);
    storage.set("sp_" + todayKey, next);
  };

  const changeDay = useCallback((dir) => {
    tapDouble();
    const next = dir === "prev"
      ? (currentDay > 1 ? currentDay - 1 : 14)
      : (currentDay < 14 ? currentDay + 1 : 1);
    setCurrentDay(next);
    storage.set("cd", next);
  }, [currentDay]);

  const [activeSession] = useState(() => {
    const s = storage.get("active_session", null);
    if (s && s.dayNum && Date.now() - s.timestamp < 86400000) return s;
    if (s) storage.remove("active_session");
    return null;
  });

  const stats = computeStats();
  const readiness = computeReadinessScore();
  const overloadTargets = getProgressiveOverloadTargets(currentDay);
  const overloadReady = overloadTargets ? overloadTargets.filter((t) => t.shouldIncrease) : [];
  const intel = getProactiveIntelligence();

  // Sum actual macros from completed meals (not ratio-based)
  const completedMeals = MEALS.filter((_, i) => mealsChecked[i]);
  const macroP = completedMeals.reduce((sum, m) => sum + m.p, 0);
  const macroC = completedMeals.reduce((sum, m) => sum + m.c, 0);
  const macroF = completedMeals.reduce((sum, m) => sum + m.f, 0);
  const consumedCal = completedMeals.reduce((sum, m) => sum + m.cal, 0);
  const totalCal = MACRO_CAPS.cal;

  const suppTotal = SUPPLEMENTS.length;
  const suppDone = Object.values(suppChecked).filter(Boolean).length;
  const so = activeSession ? 1 : 0; // stagger offset for recovery card

  return (
    <div>
      {/* ─── HERO ─── */}
      <StaggerItem index={0} visible={visible}>
        <div style={{
          margin: "-18px -16px 0", padding: "40px 24px 36px",
          background: `linear-gradient(180deg, ${C.accent008} 0%, transparent 100%)`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -140, right: -120, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent010} 0%, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: -80, left: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${C.secondary008} 0%, transparent 70%)` }} />
          {/* Bottom edge line */}
          <div style={{ position: "absolute", bottom: 0, left: "5%", right: "5%", height: 1, background: C.dividerGrad, opacity: 0.3 }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".22em", marginBottom: 16, opacity: 0.7 }}>
                  {dateStr}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.text1, lineHeight: 1.1, fontFamily: "var(--d)" }}>
                  {greeting},
                </div>
                <div style={{
                  fontSize: 34, fontWeight: 800, lineHeight: 1.15, fontFamily: "var(--d)", marginTop: 4,
                  background: C.gradient, backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "goldShimmer 12s ease-in-out infinite",
                }}>
                  Athlete.
                </div>
              </div>
              {stats.streak > 0 && <StreakFlame streak={stats.streak} C={C} />}
            </div>
            {/* ─── PROACTIVE INTELLIGENCE LINE ─── */}
            {intel && (
              <div style={{
                marginTop: 18,
                padding: "10px 14px",
                background: C.structGlass,
                border: `1px solid ${C.accent015}`,
                borderRadius: 10,
                display: "flex", alignItems: "center", gap: 10,
                animation: "fadeIn 0.6s ease 0.4s both",
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: 3, flexShrink: 0,
                  background: intel.type === "gym_arrival" || intel.type === "overload" ? C.secondary : C.accent,
                  boxShadow: `0 0 8px ${intel.type === "gym_arrival" ? C.secondary030 : C.accent020}`,
                  animation: "pulse 3s ease-in-out infinite",
                }} />
                <div style={{
                  fontSize: 10, color: C.text3, fontFamily: "var(--m)",
                  letterSpacing: ".03em", lineHeight: 1.5,
                }}>
                  {intel.text}
                </div>
              </div>
            )}
          </div>
        </div>
      </StaggerItem>

      {/* ─── DAILY SNAPSHOT ─── */}
      <StaggerItem index={1} visible={visible}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 6, margin: "16px 0",
        }}>
          {[
            { v: `${mealsCompleted}/${MEALS.length}`, l: "MEALS", pct: mealsCompleted / MEALS.length, color: C.accent, glow: C.accent020 },
            { v: `${waterCount}/${waterGoal}`, l: "WATER", pct: waterCount / waterGoal, color: C.secondary, glow: C.secondary020 },
            { v: `${suppDone}/${suppTotal}`, l: "SUPPS", pct: suppDone / suppTotal, color: C.secondary, glow: C.secondary020 },
            { v: readiness ? readiness.score : "—", l: "READY", pct: readiness ? readiness.score / 100 : 0, color: readiness?.color || C.text4, glow: C.accent020 },
          ].map(({ v, l, pct, color, glow }) => (
            <div key={l} style={{
              padding: "16px 6px 14px", textAlign: "center",
              background: C.cardGradient, borderRadius: 12,
              border: `1px solid ${C.structBorder}`,
              boxShadow: C.cardShadow,
              position: "relative", overflow: "hidden",
            }}>
              {/* Top edge highlight */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${C.structBorderHover}, transparent)`,
                opacity: 0.5,
              }} />
              {/* Bottom progress bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0,
                width: `${Math.min(pct * 100, 100)}%`, height: 2,
                background: `linear-gradient(90deg, ${color}80, ${color})`,
                borderRadius: 1,
                transition: "width 0.4s ease",
                boxShadow: pct > 0 ? `0 0 8px ${glow}` : "none",
              }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: pct >= 1 ? color : C.text1, fontFamily: "var(--m)", transition: "color 0.3s", textShadow: pct >= 1 ? `0 0 12px ${glow}` : "none" }}>{v}</div>
              <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </StaggerItem>

      {/* ─── DAY SELECTOR ─── */}
      <StaggerItem index={2} visible={visible}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "8px 0 14px" }}>
          <button onClick={() => changeDay("prev")} style={{
            background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8,
            color: C.text3, width: 44, height: 44, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ textAlign: "center", minWidth: 200 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Day {currentDay}</div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>{dayData.t}</div>
          </div>
          <button onClick={() => changeDay("next")} style={{
            background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8,
            color: C.text3, width: 44, height: 44, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </StaggerItem>

      {/* ─── SESSION RECOVERY ─── */}
      {activeSession && (
        <StaggerItem index={3} visible={visible}>
          <Card C={C} style={{ borderLeft: `3px solid ${C.warn}`, padding: "16px 20px", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.warn} strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>Interrupted Workout</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                  Day {activeSession.dayNum} · Exercise {activeSession.exerciseIndex + 1}, Set {activeSession.setIndex + 1}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button C={C} onClick={() => {
                const resumeDay = DAYS[activeSession.dayNum - 1];
                if (resumeDay) onWork(resumeDay);
              }} style={{ flex: 1, fontSize: 10 }}>RESUME WORKOUT</Button>
              <button onClick={() => {
                storage.remove("active_session");
                window.location.reload();
              }} style={{
                padding: "10px 16px", background: "transparent",
                border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10,
                color: C.text4, fontSize: 10, fontWeight: 600, fontFamily: "var(--m)",
                cursor: "pointer", letterSpacing: ".06em",
              }}>DISMISS</button>
            </div>
          </Card>
        </StaggerItem>
      )}

      {/* ─── WORKOUT CARD ─── */}
      <StaggerItem index={3 + so} visible={visible}>
        {isRest ? (
          <Card C={C} style={{ borderLeft: `3px solid ${C.text4}`, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
              </svg>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>Rest Day</div>
            </div>
            <div style={{ fontSize: 12, color: C.text4, fontFamily: "var(--m)", marginTop: 2, lineHeight: 1.7 }}>
              Growth happens during recovery, not in the gym. Light walking or stretching only. Your body is building right now.
            </div>
          </Card>
        ) : (
          <Card C={C} style={{ borderLeft: `3px solid ${C.accent}`, padding: 24 }} accentGlow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".16em", marginBottom: 6 }}>TODAY&apos;S WORKOUT</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", lineHeight: 1.1 }}>{dayData.t}</div>
                <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginTop: 6 }}>{dayData.x?.length || 0} exercises · {dayData.m} min</div>
              </div>
              {readiness && (
                <ReadinessGauge score={readiness.score} label={readiness.label} color={readiness.color} C={C} />
              )}
            </div>
            {overloadReady.length > 0 && (
              <div style={{ marginTop: 12, padding: "8px 12px", background: C.accent005, border: `1px solid ${C.accent015}`, borderRadius: 8 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: C.accentVivid, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
                  OVERLOAD READY: {overloadReady.map((t) => t.name).join(", ")}
                </div>
              </div>
            )}
            <Button C={C} onClick={() => onWork(dayData)} style={{ marginTop: 18 }}>START WORKOUT</Button>
          </Card>
        )}
      </StaggerItem>

      {/* ─── QUICK ACTIONS (above nutrition — immediately accessible) ─── */}
      <StaggerItem index={4 + so} visible={visible}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, margin: "14px 0" }}>
          {[
            { l: "Check-In", d: "Body tracking", v: "ci", tone: C.secondary, icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            )},
            { l: "Volume Log", d: "Session tonnage", v: "vl", tone: C.accent, icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            )},
            { l: "Posing", d: "Mandatory poses", v: "posing", tone: C.accent, icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" /><path d="M12 8v4" /><path d="M9 12l-2 8h2l3-4 3 4h2l-2-8" /><path d="M8 14h8" />
              </svg>
            )},
            { l: "Guide", d: "Training info", v: "gd", tone: C.accent, icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            )},
          ].map(({ l, d, v, icon, tone }) => (
            <Card key={v} C={C} onClick={() => onNav(v)} style={{
              padding: "14px 10px", cursor: "pointer", marginBottom: 0,
              display: "flex", flexDirection: "column", alignItems: "center",
              textAlign: "center", gap: 6,
              borderTop: `2px solid ${tone}20`,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: `${tone}08`, border: `1px solid ${tone}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 12px ${tone}10`,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text1 }}>{l}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{d}</div>
              </div>
            </Card>
          ))}
        </div>
      </StaggerItem>

      <SectionDivider C={C} />

      {/* ─── NUTRITION ─── */}
      <StaggerItem index={5 + so} visible={visible}>
        <Label C={C}>Nutrition</Label>
        <Card C={C} style={{ padding: 20 }}>
          {/* Calorie Ring + Macros */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <RadialProgress value={consumedCal} max={totalCal} C={C} size={72} label="KCAL" sublabel={`${consumedCal}/${totalCal}`} />
            <div style={{ display: "flex", gap: 12 }}>
              <MacroRing consumed={macroP} target={MACRO_CAPS.p} color={C.accent} label="PROTEIN" C={C} size={52} />
              <MacroRing consumed={macroC} target={MACRO_CAPS.c} color={C.secondary} label="CARBS" C={C} size={52} />
              <MacroRing consumed={macroF} target={MACRO_CAPS.f} color={C.accentDeep} label="FAT" C={C} size={52} />
            </div>
          </div>

          {/* Meal Snap & Estimate */}
          <div style={{ marginBottom: 16 }}>
            <input ref={el => { if (el) mealFileRefs.current.snap = el; }} type="file" accept="image/*" capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  // Store the snap for estimation (Claude Vision API placeholder)
                  const snap = { photo: ev.target.result, time: Date.now(), status: "pending" };
                  const snaps = storage.get("meal_snaps_" + todayKey, []);
                  snaps.push(snap);
                  storage.set("meal_snaps_" + todayKey, snaps);
                  showToast?.("Photo captured — macro estimation ready when AI connects");
                };
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
              style={{ display: "none" }}
            />
            <button onClick={() => mealFileRefs.current.snap?.click()} style={{
              width: "100%", padding: "12px 16px",
              background: `linear-gradient(135deg, ${C.accent005}, ${C.secondary005})`,
              border: `1.5px solid ${C.accent020}`,
              borderRadius: 10, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: C.accent010, border: `1px solid ${C.accent020}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text1, fontFamily: "var(--m)", letterSpacing: ".04em" }}>SNAP &amp; ESTIMATE</div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>Photo your meal for instant macro analysis</div>
              </div>
              <div style={{ marginLeft: "auto", padding: "3px 8px", borderRadius: 4, background: C.accent010, border: `1px solid ${C.accent015}` }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".06em" }}>PRO</div>
              </div>
            </button>
          </div>

          {/* Meals List */}
          {MEALS.map((meal, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < MEALS.length - 1 ? `1px solid ${C.structBorder}` : "none", cursor: "pointer" }}>
                <div
                  onClick={(e) => { e.stopPropagation(); toggleMeal(i); }}
                  style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${mealsChecked[i] ? C.ok : C.structBorderHover}`, background: mealsChecked[i] ? `${C.ok}20` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {mealsChecked[i] && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  )}
                </div>
                <div onClick={() => setExpandedMeal(expandedMeal === i ? null : i)} style={{ flex: 1, cursor: "pointer" }}>
                  <div style={{ fontSize: 13, color: mealsChecked[i] ? C.text3 : C.text1, textDecoration: mealsChecked[i] ? "line-through" : "none", transition: "color 0.2s" }}>{meal.n}</div>
                </div>
                {mealPhotos[i] && (
                  <div style={{ width: 20, height: 20, borderRadius: 4, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.secondary}` }}>
                    <img src={mealPhotos[i].photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)" }}>{meal.p}g P · {meal.cal} cal</div>
                <div onClick={() => setExpandedMeal(expandedMeal === i ? null : i)} style={{ color: C.text4, fontSize: 12, transform: expandedMeal === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", cursor: "pointer", padding: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Expanded Meal Detail */}
              {expandedMeal === i && (
                <div style={{ padding: "10px 0 10px 34px", borderBottom: i < MEALS.length - 1 ? `1px solid ${C.structBorder}` : "none" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {[
                      { l: "CAL", v: meal.cal, color: C.text1 },
                      { l: "PROTEIN", v: `${meal.p}g`, color: C.accent },
                      { l: "CARBS", v: `${meal.c}g`, color: C.secondary },
                      { l: "FAT", v: `${meal.f}g`, color: C.text1 },
                    ].map(({ l, v, color }) => (
                      <div key={l} style={{ flex: 1, textAlign: "center", padding: "6px 4px", background: C.structGlass, borderRadius: 6, border: `1px solid ${C.structBorder}` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "var(--m)" }}>{v}</div>
                        <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <input
                    ref={el => mealFileRefs.current[i] = el}
                    type="file" accept="image/*" capture="environment"
                    onChange={e => handleMealPhoto(i, e)}
                    style={{ display: "none" }}
                  />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => mealFileRefs.current[i]?.click()} style={{
                      flex: 1, padding: "8px 10px", background: mealPhotos[i] ? C.secondary010 : C.structGlass,
                      border: `1px solid ${mealPhotos[i] ? C.secondary : C.structBorderHover}`, borderRadius: 6,
                      color: mealPhotos[i] ? C.secondary : C.text3, fontSize: 9, fontFamily: "var(--m)",
                      cursor: "pointer", letterSpacing: ".08em", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 6, minHeight: 36, transition: "all 0.2s",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                      {mealPhotos[i] ? "PHOTO LOGGED" : "SNAP & LOG"}
                    </button>
                  </div>
                  {mealPhotos[i] && (
                    <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden" }}>
                      <img src={mealPhotos[i].photo} alt="meal" style={{ width: "100%", borderRadius: 8, display: "block", maxHeight: 160, objectFit: "cover" }} />
                    </div>
                  )}

                  {/* Food Log — what client actually ate */}
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.structBorder}` }}>
                    {foodLogs[i] ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 10, color: C.text3, fontFamily: "var(--m)" }}>
                            {foodLogs[i].desc || "Followed plan"}
                            {foodLogs[i].adherence === false && <span style={{ color: C.warn, marginLeft: 6, fontSize: 8, letterSpacing: ".06em" }}>OFF PLAN</span>}
                          </div>
                          {foodLogs[i].p && (
                            <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                              {foodLogs[i].p}p · {foodLogs[i].c}c · {foodLogs[i].f}f · {foodLogs[i].cal}cal
                            </div>
                          )}
                        </div>
                        <button onClick={() => setEditingFood(i)} style={{
                          background: "none", border: "none", color: C.text4, cursor: "pointer", padding: 4,
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingFood(i)} style={{
                        width: "100%", padding: "8px 10px", background: C.structGlass,
                        border: `1px dashed ${C.structBorderHover}`, borderRadius: 6,
                        color: C.text4, fontSize: 9, fontFamily: "var(--m)",
                        cursor: "pointer", letterSpacing: ".06em",
                      }}>LOG WHAT I ATE</button>
                    )}
                    {editingFood === i && (
                      <div style={{ marginTop: 8, padding: 10, background: C.structGlass, borderRadius: 8, border: `1px solid ${C.structBorderHover}` }}>
                        <input
                          placeholder="What did you eat?"
                          defaultValue={foodLogs[i]?.desc || ""}
                          id={`food-desc-${i}`}
                          style={{ width: "100%", padding: "8px 10px", background: "transparent", border: `1px solid ${C.structBorderHover}`, borderRadius: 6, color: C.text1, fontSize: 12, fontFamily: "var(--b)", outline: "none", marginBottom: 8 }}
                        />
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          {["p", "c", "f", "cal"].map(k => (
                            <input key={k} placeholder={k === "cal" ? "cal" : k.toUpperCase()} defaultValue={foodLogs[i]?.[k] || ""}
                              id={`food-${k}-${i}`} type="number" inputMode="decimal"
                              style={{ flex: 1, padding: "6px 4px", background: "transparent", border: `1px solid ${C.structBorderHover}`, borderRadius: 4, color: C.text1, fontSize: 11, fontFamily: "var(--m)", textAlign: "center", outline: "none" }}
                            />
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => {
                            const desc = document.getElementById(`food-desc-${i}`)?.value || "";
                            const p = document.getElementById(`food-p-${i}`)?.value || "";
                            const c = document.getElementById(`food-c-${i}`)?.value || "";
                            const f = document.getElementById(`food-f-${i}`)?.value || "";
                            const cal = document.getElementById(`food-cal-${i}`)?.value || "";
                            const entry = { desc: desc || "Followed plan", adherence: true, p, c, f, cal, time: Date.now() };
                            const next = { ...foodLogs, [i]: entry };
                            setFoodLogs(next);
                            storage.set("fl_" + todayKey, next);
                            setEditingFood(null);
                            if (!mealsChecked[i]) toggleMeal(i);
                          }} style={{
                            flex: 1, padding: "8px 10px", background: C.gradientBtn, backgroundSize: "300% 100%",
                            border: "none", borderRadius: 6, color: C.btnText, fontSize: 9, fontWeight: 700,
                            fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".06em",
                          }}>SAVE</button>
                          <button onClick={() => setEditingFood(null)} style={{
                            padding: "8px 12px", background: "transparent",
                            border: `1px solid ${C.structBorderHover}`, borderRadius: 6,
                            color: C.text4, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer",
                          }}>CANCEL</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
      </StaggerItem>

      {/* ─── HYDRATION ─── */}
      <StaggerItem index={6 + so} visible={visible}>
        <Card C={C} style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Label C={C} style={{ marginBottom: 0 }}>Hydration</Label>
            <div style={{ fontSize: 13, fontWeight: 700, color: waterCount >= waterGoal ? C.secondary : C.text1, fontFamily: "var(--m)", display: "flex", alignItems: "center", gap: 6 }}>
              {waterCount}/{waterGoal}
              <span style={{ fontSize: 9, color: C.text4, fontWeight: 400 }}>cups</span>
              {waterCount >= waterGoal && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: C.structBorderHover, marginBottom: 14, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${Math.min((waterCount / waterGoal) * 100, 100)}%`,
              background: `linear-gradient(90deg, ${C.secondary}, ${C.secondary}cc)`,
              transition: "width 0.3s ease",
              boxShadow: waterCount > 0 ? `0 0 8px ${C.secondary020}` : "none",
            }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { tapMedium(); const next = Math.min(waterCount + 1, 20); setWaterCount(next); storage.set("wt_" + todayKey, next); }}
              style={{
                flex: 1, padding: "10px 16px", background: C.structGlass,
                border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                color: C.secondary, fontSize: 10, fontWeight: 700, fontFamily: "var(--m)",
                letterSpacing: ".1em", cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              ADD GLASS
            </button>
            {waterCount > 0 && (
              <button onClick={() => { const next = Math.max(waterCount - 1, 0); setWaterCount(next); storage.set("wt_" + todayKey, next); }}
                style={{
                  padding: "10px 14px", background: C.structGlass,
                  border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                  color: C.text4, fontSize: 10, fontWeight: 700, fontFamily: "var(--m)",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            )}
          </div>
        </Card>
      </StaggerItem>

      {/* ─── SUPPLEMENTS ─── */}
      <StaggerItem index={7 + so} visible={visible}>
        <Label C={C}>Supplements</Label>
        <Card C={C} style={{ padding: "2px 16px" }}>
          {SUPPLEMENTS.map((supp, i) => (
            <div key={i} onClick={() => toggleSupp(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < SUPPLEMENTS.length - 1 ? `1px solid ${C.structBorder}` : "none", cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${suppChecked[i] ? C.secondary : C.structBorderHover}`, background: suppChecked[i] ? C.secondary010 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                {suppChecked[i] && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                )}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: suppChecked[i] ? C.text3 : C.text2, textDecoration: suppChecked[i] ? "line-through" : "none", transition: "all 0.2s" }}>{supp}</div>
            </div>
          ))}
        </Card>
      </StaggerItem>

      <SectionDivider C={C} />

      {/* ─── LIFETIME STATS or WELCOME ─── */}
      <StaggerItem index={8 + so} visible={visible}>
        {stats.workoutCount > 0 ? (
          <Card C={C} style={{ padding: "18px 20px", borderTop: `2px solid ${C.accent020}` }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[
                { v: stats.workoutCount, l: "WORKOUTS", color: C.accent },
                { v: stats.streak, l: "STREAK", color: C.secondary },
                { v: stats.checkInCount, l: "CHECK-INS", color: C.accent },
                { v: stats.totalVolumeAllTime > 0 ? `${Math.round(stats.totalVolumeAllTime / 1000)}k` : "—", l: "TOTAL VOL", color: C.secondary },
              ].map(({ v, l, color }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "var(--m)", textShadow: `0 0 16px ${color}40` }}>{v}</div>
                  <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card C={C} style={{ padding: 24, textAlign: "center", borderTop: `2px solid ${C.secondary020}` }} glow>
            <div style={{
              width: 48, height: 48, borderRadius: 14, margin: "0 auto 14px",
              background: C.secondary010, border: `1.5px solid ${C.secondary}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${C.secondary015}`,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 6 }}>Your System Is Ready</div>
            <div style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)", lineHeight: 1.7, maxWidth: 260, margin: "0 auto" }}>
              Complete your first workout. Every session from here compounds — stats, streaks, PR detection, and coaching intelligence all activate the moment you start.
            </div>
          </Card>
        )}
      </StaggerItem>

    </div>
  );
}
