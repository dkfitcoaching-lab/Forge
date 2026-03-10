import { useState } from "react";
import { StaggerItem, Card, Button, Label, SectionDivider } from "../components/Primitives";
import { useStaggeredReveal } from "../utils/hooks";
import { getWorkoutHistory } from "../utils/analytics";
import DAYS from "../data/workouts";
import GUIDE_DATA from "../data/guide";
import storage from "../utils/storage";

export default function ProgramView({ C, onWork, onNav }) {
  const visible = useStaggeredReveal(20, 40);
  const [currentDay] = useState(() => storage.get("cd", 1));
  const [openGuide, setOpenGuide] = useState(null);
  const [guideCategory, setGuideCategory] = useState(0);
  const history = getWorkoutHistory();
  const dayData = DAYS[currentDay - 1] || DAYS[0];
  const isRest = dayData.t === "REST + RECOVERY";

  return (
    <div>
      {/* Today's Workout */}
      <StaggerItem index={0} visible={visible}>
        <Label C={C}>TODAY — DAY {currentDay}</Label>
        {isRest ? (
          <Card C={C} style={{ padding: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>Rest Day</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>Recovery is where growth happens.</div>
          </Card>
        ) : (
          <Card C={C} glow style={{ padding: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>{dayData.t}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>{dayData.x?.length || 0} exercises · ~{dayData.m} min</div>
            <Button C={C} onClick={() => onWork(dayData)} style={{ marginTop: 16 }}>START WORKOUT</Button>
          </Card>
        )}
      </StaggerItem>

      {/* 14-Day Cycle Calendar */}
      <StaggerItem index={1} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>14-DAY CYCLE</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
          {DAYS.map((day) => {
            const completed = history.some(h => h.dayNum === day.d);
            const isCurrent = day.d === currentDay;
            return (
              <div key={day.d} style={{
                textAlign: "center", padding: "10px 4px",
                background: isCurrent ? C.accent010 : C.cardGradient,
                border: `1.5px solid ${isCurrent ? C.accent : C.structBorderHover}`,
                borderRadius: 8,
                boxShadow: isCurrent ? `0 0 12px ${C.accent008}` : C.cardShadow,
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.ok : isCurrent ? C.accent : C.text3, fontFamily: "var(--m)" }}>{day.d}</div>
                <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em", marginTop: 2 }}>
                  {day.rest ? "REST" : day.t.split(" ")[0]}
                </div>
                {completed && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.ok, margin: "3px auto 0" }} />}
              </div>
            );
          })}
        </div>
      </StaggerItem>

      {/* All Workouts */}
      <StaggerItem index={2} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>ALL WORKOUTS</Label>
        {DAYS.filter(d => !d.rest).map((day, i) => {
          const completed = history.some(h => h.dayNum === day.d);
          return (
            <Card key={day.d} C={C} onClick={() => onWork(day)} style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: completed ? C.accent010 : C.structGlass,
                border: `1px solid ${completed ? C.accent : C.structBorderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: completed ? C.ok : C.accent, fontFamily: "var(--m)", flexShrink: 0,
              }}>
                {completed ? "✓" : day.d}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>Day {day.d}: {day.t}</div>
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{day.x?.length} exercises · ~{day.m} min</div>
              </div>
              <div style={{ color: C.text4, fontSize: 16 }}>›</div>
            </Card>
          );
        })}
      </StaggerItem>

      {/* Program Guide */}
      <StaggerItem index={3} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>PROGRAM GUIDE</Label>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
          {GUIDE_DATA.map((cat, i) => (
            <button key={i} onClick={() => { setGuideCategory(i); setOpenGuide(null); }}
              style={{
                padding: "6px 14px", background: i === guideCategory ? C.accent015 : "transparent",
                border: `1px solid ${i === guideCategory ? C.accent : C.structBorderHover}`,
                borderRadius: 20, color: i === guideCategory ? C.accent : C.text4,
                fontSize: 9, fontWeight: 700, fontFamily: "var(--m)", letterSpacing: ".1em",
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              }}>
              {cat.category}
            </button>
          ))}
        </div>
        {GUIDE_DATA[guideCategory].items.map((item, i) => (
          <Card key={i} C={C} onClick={() => setOpenGuide(openGuide === i ? null : i)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{item.title}</div>
              <div style={{ color: C.text4, fontSize: 14, transform: openGuide === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</div>
            </div>
            {openGuide === i && (
              <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.structBorder}`, fontFamily: "var(--m)" }}>{item.desc}</div>
            )}
          </Card>
        ))}
      </StaggerItem>
    </div>
  );
}
