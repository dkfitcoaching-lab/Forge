import { useState } from "react";
import { StaggerItem, Card, Button, Label } from "../components/Primitives";
import { useStaggeredReveal } from "../utils/hooks";
import { MEALS, SUPPLEMENTS } from "../data/nutrition";
import DAYS from "../data/workouts";
import storage from "../utils/storage";

export default function TodayView({ C, onWork, onNav }) {
  const visible = useStaggeredReveal(10, 55);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const now = new Date();
  const currentDay = storage.get("cd", 1);
  const dayData = DAYS[currentDay - 1] || DAYS[0];
  const isRest = dayData.t === "REST + RECOVERY";

  const [mealsChecked, setMealsChecked] = useState(() =>
    storage.get("mc_" + now.toDateString(), {})
  );
  const mealsCompleted = Object.values(mealsChecked).filter(Boolean).length;
  const toggleMeal = (i) => {
    const next = { ...mealsChecked, [i]: !mealsChecked[i] };
    setMealsChecked(next);
    storage.set("mc_" + now.toDateString(), next);
  };

  const [waterCount, setWaterCount] = useState(() =>
    storage.get("wt_" + now.toDateString(), 0)
  );

  const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

  return (
    <div>
      {/* Hero Section */}
      <StaggerItem index={0} visible={visible}>
        <div
          style={{
            margin: "-18px -16px 0",
            padding: "44px 24px 40px",
            background: `linear-gradient(180deg, ${C.accent}08 0%, transparent 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -140,
              right: -120,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accent}06 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.accent}04 0%, transparent 70%)`,
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".16em" }}>
              {dayNames[now.getDay()]} — DAY {currentDay} OF 14
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: C.text1,
                lineHeight: 1.05,
                fontFamily: "var(--d)",
                marginTop: 8,
              }}
            >
              {greeting}.
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                lineHeight: 1.15,
                fontFamily: "var(--d)",
                marginTop: 4,
                background: C.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Time to forge.
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Day Selector */}
      <StaggerItem index={1} visible={visible}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "20px 0 16px" }}>
          <button
            onClick={() => {
              const next = currentDay > 1 ? currentDay - 1 : 14;
              storage.set("cd", next);
              window.location.reload();
            }}
            style={{
              background: "none",
              border: `1px solid ${C.border2}`,
              borderRadius: 8,
              color: C.text3,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ‹
          </button>
          <div style={{ textAlign: "center", minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
              Day {currentDay}
            </div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>
              {dayData.t}
            </div>
          </div>
          <button
            onClick={() => {
              const next = currentDay < 14 ? currentDay + 1 : 1;
              storage.set("cd", next);
              window.location.reload();
            }}
            style={{
              background: "none",
              border: `1px solid ${C.border2}`,
              borderRadius: 8,
              color: C.text3,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ›
          </button>
        </div>
      </StaggerItem>

      {/* Workout Card */}
      <StaggerItem index={2} visible={visible}>
        {isRest ? (
          <Card C={C} style={{ borderLeft: `3px solid ${C.text4}`, padding: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>
              Rest Day
            </div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>
              Recovery is where growth happens. Light walking or stretching only.
            </div>
          </Card>
        ) : (
          <Card C={C} style={{ borderLeft: `3px solid ${C.accent}`, padding: 20 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".16em" }}>
              TODAY&apos;S WORKOUT
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
              {dayData.t}
            </div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>
              {dayData.x?.length || 0} exercises · {dayData.m} min
            </div>
            <Button C={C} onClick={() => onWork(dayData)} style={{ marginTop: 16 }}>
              START WORKOUT
            </Button>
          </Card>
        )}
      </StaggerItem>

      {/* Meals */}
      <StaggerItem index={3} visible={visible}>
        <Card C={C}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <Label C={C} style={{ marginBottom: 0 }}>Nutrition</Label>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>
              {mealsCompleted}/{MEALS.length}
            </div>
          </div>
          <div
            style={{
              height: 3,
              background: `${C.accent}15`,
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                height: "100%",
                background: C.accent,
                borderRadius: 2,
                width: `${(mealsCompleted / MEALS.length) * 100}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
          {MEALS.map((meal, i) => (
            <div
              key={i}
              onClick={() => toggleMeal(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: i < MEALS.length - 1 ? `1px solid ${C.border1}` : "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: `1.5px solid ${mealsChecked[i] ? C.ok : `${C.accent}30`}`,
                  background: mealsChecked[i] ? `${C.ok}20` : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.ok,
                  fontSize: 11,
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {mealsChecked[i] && "✓"}
              </div>
              <div
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: mealsChecked[i] ? C.text3 : C.text1,
                  textDecoration: mealsChecked[i] ? "line-through" : "none",
                  transition: "color 0.2s",
                }}
              >
                {meal.n}
              </div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)" }}>
                {meal.t}
              </div>
            </div>
          ))}
        </Card>
      </StaggerItem>

      {/* Water Intake */}
      <StaggerItem index={4} visible={visible}>
        <Card C={C}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Label C={C} style={{ marginBottom: 0 }}>Water</Label>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>
              {waterCount}/16 cups
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                onClick={() => {
                  const next = i + 1 === waterCount ? i : i + 1;
                  setWaterCount(next);
                  storage.set("wt_" + now.toDateString(), next);
                }}
                style={{
                  flex: 1,
                  height: 28,
                  background: i < waterCount ? `${C.accent}30` : `${C.accent}08`,
                  border: `1px solid ${i < waterCount ? C.accent : C.border1}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        </Card>
      </StaggerItem>

      {/* Supplements */}
      <StaggerItem index={5} visible={visible}>
        <Label C={C}>Supplements</Label>
        <Card C={C}>
          {SUPPLEMENTS.map((supp, i) => {
            const suppChecked = storage.get("sp_" + now.toDateString(), {});
            return (
              <div
                key={i}
                onClick={() => {
                  const next = { ...suppChecked, [i]: !suppChecked[i] };
                  storage.set("sp_" + now.toDateString(), next);
                  window.dispatchEvent(new Event("storage"));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: i < SUPPLEMENTS.length - 1 ? `1px solid ${C.border1}` : "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1px solid ${suppChecked[i] ? C.accent : `${C.accent}20`}`,
                    background: suppChecked[i] ? `${C.accent}15` : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.accent,
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {suppChecked[i] && "✓"}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: suppChecked[i] ? C.text3 : C.text2,
                    textDecoration: suppChecked[i] ? "line-through" : "none",
                  }}
                >
                  {supp}
                </div>
              </div>
            );
          })}
        </Card>
      </StaggerItem>

      {/* Quick Actions */}
      <StaggerItem index={6} visible={visible}>
        <Label C={C} style={{ marginTop: 8 }}>Quick Actions</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { l: "Check-In", v: "ci", icon: "📋" },
            { l: "Volume Log", v: "vl", icon: "📊" },
            { l: "Program Guide", v: "gd", icon: "📖" },
            { l: "Progress Photos", v: "pp", icon: "📸" },
          ].map(({ l, v, icon }) => (
            <Card
              key={v}
              C={C}
              onClick={() => onNav(v)}
              style={{ textAlign: "center", padding: 16, cursor: "pointer", marginBottom: 8 }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text2, fontFamily: "var(--m)" }}>
                {l}
              </div>
            </Card>
          ))}
        </div>
      </StaggerItem>
    </div>
  );
}
