import { useState, useCallback } from "react";
import { StaggerItem, Card, Button, Label, SectionDivider } from "../components/Primitives";
import { ReadinessGauge, StreakFlame } from "../components/Celebration";
import { RadialProgress, MacroRing } from "../components/Charts";
import { useStaggeredReveal } from "../utils/hooks";
import { MEALS, MACRO_CAPS, SUPPLEMENTS } from "../data/nutrition";
import { computeStats, computeReadinessScore, getProgressiveOverloadTargets } from "../utils/analytics";
import DAYS from "../data/workouts";
import storage from "../utils/storage";

export default function TodayView({ C, onWork, onNav, showToast }) {
  const visible = useStaggeredReveal(10, 55);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const now = new Date();
  const [currentDay, setCurrentDay] = useState(() => storage.get("cd", 1));
  const dayData = DAYS[currentDay - 1] || DAYS[0];
  const isRest = dayData.t === "REST + RECOVERY";

  const [mealsChecked, setMealsChecked] = useState(() => storage.get("mc_" + now.toDateString(), {}));
  const mealsCompleted = Object.values(mealsChecked).filter(Boolean).length;
  const [expandedMeal, setExpandedMeal] = useState(null);
  const toggleMeal = (i) => {
    const next = { ...mealsChecked, [i]: !mealsChecked[i] };
    setMealsChecked(next);
    storage.set("mc_" + now.toDateString(), next);
  };

  const [waterCount, setWaterCount] = useState(() => storage.get("wt_" + now.toDateString(), 0));

  const [suppChecked, setSuppChecked] = useState(() => storage.get("sp_" + now.toDateString(), {}));
  const toggleSupp = (i) => {
    const next = { ...suppChecked, [i]: !suppChecked[i] };
    setSuppChecked(next);
    storage.set("sp_" + now.toDateString(), next);
  };

  const changeDay = useCallback((dir) => {
    const next = dir === "prev"
      ? (currentDay > 1 ? currentDay - 1 : 14)
      : (currentDay < 14 ? currentDay + 1 : 1);
    setCurrentDay(next);
    storage.set("cd", next);
  }, [currentDay]);

  const stats = computeStats();
  const readiness = computeReadinessScore();
  const overloadTargets = getProgressiveOverloadTargets(currentDay);
  const overloadReady = overloadTargets ? overloadTargets.filter((t) => t.shouldIncrease) : [];

  const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  const macroP = Math.round((mealsCompleted / MEALS.length) * MACRO_CAPS.p);
  const macroC = Math.round((mealsCompleted / MEALS.length) * MACRO_CAPS.c);
  const macroF = Math.round((mealsCompleted / MEALS.length) * MACRO_CAPS.f);

  return (
    <div>
      {/* Hero Section */}
      <StaggerItem index={0} visible={visible}>
        <div style={{ margin: "-18px -16px 0", padding: "36px 24px 32px", background: `linear-gradient(180deg, ${C.accent005} 0%, transparent 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -140, right: -120, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)` }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".16em" }}>
                  {dayNames[now.getDay()]} — DAY {currentDay} OF 14
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.text1, lineHeight: 1.05, fontFamily: "var(--d)", marginTop: 8 }}>
                  {greeting}.
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, fontFamily: "var(--d)", marginTop: 4, background: C.gradient, backgroundSize: "300% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Time to forge.
                </div>
              </div>
              {stats.streak > 0 && <StreakFlame streak={stats.streak} C={C} />}
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Readiness Score */}
      {readiness && (
        <StaggerItem index={1} visible={visible}>
          <Card C={C} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Label C={C} style={{ marginBottom: 4 }}>Readiness</Label>
                <div style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)" }}>
                  Based on your latest check-in data
                </div>
              </div>
              <ReadinessGauge score={readiness.score} label={readiness.label} color={readiness.color} C={C} />
            </div>
          </Card>
        </StaggerItem>
      )}

      {/* Day Selector */}
      <StaggerItem index={2} visible={visible}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "16px 0 12px" }}>
          <button onClick={() => changeDay("prev")} style={{ background: C.glass, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text3, width: 44, height: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ textAlign: "center", minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Day {currentDay}</div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>{dayData.t}</div>
          </div>
          <button onClick={() => changeDay("next")} style={{ background: C.glass, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text3, width: 44, height: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </StaggerItem>

      {/* Workout Card */}
      <StaggerItem index={3} visible={visible}>
        {isRest ? (
          <Card C={C} style={{ borderLeft: `3px solid ${C.text4}`, padding: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>Rest Day</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>Recovery is where growth happens. Light walking or stretching only.</div>
          </Card>
        ) : (
          <Card C={C} style={{ borderLeft: `3px solid ${C.accent}`, padding: 20 }} glow>
            <div style={{ fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".16em" }}>TODAY&apos;S WORKOUT</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>{dayData.t}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>{dayData.x?.length || 0} exercises · {dayData.m} min</div>
            {overloadReady.length > 0 && (
              <div style={{ marginTop: 8, padding: "6px 10px", background: C.accent005, border: `1px solid ${C.accent015}`, borderRadius: 8 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: C.accentVivid, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
                  PROGRESSIVE OVERLOAD: {overloadReady.map((t) => t.name).join(", ")}
                </div>
              </div>
            )}
            <Button C={C} onClick={() => onWork(dayData)} style={{ marginTop: 16 }}>START WORKOUT</Button>
          </Card>
        )}
      </StaggerItem>

      <SectionDivider C={C} />

      {/* Nutrition */}
      <StaggerItem index={4} visible={visible}>
        <Label C={C}>Nutrition</Label>
        <Card C={C} style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <RadialProgress value={mealsCompleted} max={MEALS.length} C={C} size={58} label="MEALS" sublabel={`${mealsCompleted}/${MEALS.length}`} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <MacroRing consumed={macroP} target={MACRO_CAPS.p} color={C.accent} label="PROTEIN" C={C} size={52} />
              <MacroRing consumed={macroC} target={MACRO_CAPS.c} color={C.accentDark} label="CARBS" C={C} size={52} />
              <MacroRing consumed={macroF} target={MACRO_CAPS.f} color={C.accentDeep} label="FAT" C={C} size={52} />
            </div>
          </div>

          {MEALS.map((meal, i) => (
            <div key={i}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < MEALS.length - 1 ? `1px solid ${C.border1}` : "none", cursor: "pointer" }}
              >
                <div
                  onClick={(e) => { e.stopPropagation(); toggleMeal(i); }}
                  style={{ width: 24, height: 24, borderRadius: 7, border: `1.5px solid ${mealsChecked[i] ? C.ok : C.border2}`, background: mealsChecked[i] ? `${C.ok}20` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {mealsChecked[i] && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  )}
                </div>
                <div onClick={() => setExpandedMeal(expandedMeal === i ? null : i)} style={{ flex: 1, cursor: "pointer" }}>
                  <div style={{ fontSize: 12, color: mealsChecked[i] ? C.text3 : C.text1, textDecoration: mealsChecked[i] ? "line-through" : "none", transition: "color 0.2s" }}>{meal.n}</div>
                </div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>{meal.p}g P · {meal.cal} cal</div>
                <div onClick={() => setExpandedMeal(expandedMeal === i ? null : i)} style={{ color: C.text4, fontSize: 12, transform: expandedMeal === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", cursor: "pointer", padding: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Expanded Meal Detail */}
              {expandedMeal === i && (
                <div style={{ padding: "10px 0 10px 34px", borderBottom: i < MEALS.length - 1 ? `1px solid ${C.border1}` : "none" }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    {[
                      { l: "CAL", v: meal.cal },
                      { l: "PROTEIN", v: `${meal.p}g` },
                      { l: "CARBS", v: `${meal.c}g` },
                      { l: "FAT", v: `${meal.f}g` },
                    ].map(({ l, v }) => (
                      <div key={l} style={{ flex: 1, textAlign: "center", padding: "6px 4px", background: C.glass, borderRadius: 6, border: `1px solid ${C.border1}` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text1, fontFamily: "var(--m)" }}>{v}</div>
                        <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => showToast?.("Photo logging coming soon")} style={{ flex: 1, padding: "8px 10px", background: C.glass, border: `1px solid ${C.border2}`, borderRadius: 6, color: C.text3, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".08em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 36 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                      SNAP & LOG
                    </button>
                    <button onClick={() => showToast?.("Barcode scanning coming soon")} style={{ flex: 1, padding: "8px 10px", background: C.glass, border: `1px solid ${C.border2}`, borderRadius: 6, color: C.text3, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".08em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 36 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h2v16H2zM6 4h1v16H6zM9 4h2v16H9zM13 4h1v16h-1zM16 4h2v16h-2zM20 4h2v16h-2z" /></svg>
                      SCAN BARCODE
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
      </StaggerItem>

      {/* Water Intake */}
      <StaggerItem index={5} visible={visible}>
        <Card C={C}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Label C={C} style={{ marginBottom: 0 }}>Water</Label>
            <div style={{ fontSize: 10, color: waterCount >= 16 ? C.ok : C.text4, fontFamily: "var(--m)", fontWeight: waterCount >= 16 ? 700 : 400, display: "flex", alignItems: "center", gap: 4 }}>
              {waterCount}/16 cups
              {waterCount >= 16 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.ok} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} onClick={() => { const next = i + 1 === waterCount ? i : i + 1; setWaterCount(next); storage.set("wt_" + now.toDateString(), next); }}
                style={{ flex: 1, height: 32, background: i < waterCount ? C.accent030 : C.accent005, border: `1px solid ${i < waterCount ? C.accent : C.border1}`, borderRadius: 4, cursor: "pointer", transition: "all 0.15s" }} />
            ))}
          </div>
        </Card>
      </StaggerItem>

      {/* Supplements */}
      <StaggerItem index={6} visible={visible}>
        <Label C={C}>Supplements</Label>
        <Card C={C} style={{ padding: "2px 16px" }}>
          {SUPPLEMENTS.map((supp, i) => (
            <div key={i} onClick={() => toggleSupp(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < SUPPLEMENTS.length - 1 ? `1px solid ${C.border1}` : "none", cursor: "pointer" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${suppChecked[i] ? C.accent : C.border2}`, background: suppChecked[i] ? C.accent010 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                {suppChecked[i] && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                )}
              </div>
              <div style={{ flex: 1, fontSize: 12, color: suppChecked[i] ? C.text3 : C.text2, textDecoration: suppChecked[i] ? "line-through" : "none", transition: "all 0.2s" }}>{supp}</div>
            </div>
          ))}
        </Card>
      </StaggerItem>

      <SectionDivider C={C} />

      {/* Quick Actions */}
      <StaggerItem index={7} visible={visible}>
        <Label C={C}>Quick Actions</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { l: "Check-In", v: "ci", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            )},
            { l: "Volume Log", v: "vl", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            )},
            { l: "Program Guide", v: "gd", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            )},
            { l: "Progress Photos", v: "pp", icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
            )},
          ].map(({ l, v, icon }) => (
            <Card key={v} C={C} onClick={() => onNav(v)} style={{ textAlign: "center", padding: 18, cursor: "pointer", marginBottom: 0 }}>
              <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, fontFamily: "var(--m)" }}>{l}</div>
            </Card>
          ))}
        </div>
      </StaggerItem>

      {/* Stats Bar */}
      {stats.workoutCount > 0 && (
        <StaggerItem index={8} visible={visible}>
          <Card C={C} style={{ padding: "14px 16px", marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[
                { v: stats.workoutCount, l: "WORKOUTS" },
                { v: stats.streak, l: "STREAK" },
                { v: stats.checkInCount, l: "CHECK-INS" },
                { v: stats.totalVolumeAllTime > 0 ? `${Math.round(stats.totalVolumeAllTime / 1000)}k` : "—", l: "TOTAL VOL" },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{v}</div>
                  <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </StaggerItem>
      )}
    </div>
  );
}
