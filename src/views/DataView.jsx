import { Card, Label, SectionDivider } from "../components/Primitives";
import { BarChart, LineChart, RadialProgress } from "../components/Charts";
import BodyHeatMap from "../components/BodyHeatMap";
import { computeStats, computeFatigueScore, getWorkoutHistory, getAllPersonalRecords } from "../utils/analytics";
import DAYS from "../data/workouts";

export default function DataView({ C, onNav }) {
  const stats = computeStats();
  const fatigue = computeFatigueScore();
  const history = getWorkoutHistory();
  const prs = getAllPersonalRecords();

  // Volume chart data
  const volumeChartData = DAYS.filter((d) => !d.rest).map((day) => {
    const session = history.find((h) => h.dayNum === day.d);
    return { value: session ? session.totalVolume || 0 : 0, label: `D${day.d}` };
  });

  // Weight trend data
  const weightChartData = stats.weightTrend.map((w) => ({
    value: w.weight,
    label: w.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div>
      {/* ─── HEADER ─── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Performance</div>
        <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
          {stats.workoutCount > 0 ? `${stats.workoutCount} workouts · ${stats.cyclesCompleted || 0} cycles completed` : "Start training to see your data"}
        </div>
      </div>

      {/* ─── OVERVIEW STATS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { v: stats.workoutCount || "0", l: "WORKOUTS", color: C.accent },
          { v: stats.streak || "0", l: "STREAK", color: C.secondary },
          { v: stats.cyclesCompleted || "0", l: "CYCLES", color: C.accent },
        ].map(({ v, l, color }) => (
          <Card key={l} C={C} style={{ textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "var(--m)", textShadow: `0 0 16px ${color}40` }}>{v}</div>
            <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 6 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* ─── 14-DAY CYCLE ─── */}
      <Label C={C}>14-Day Cycle</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 8 }}>
        {DAYS.map((day) => {
          const completed = history.some((h) => h.dayNum === day.d);
          return (
            <Card key={day.d} C={C} style={{
              textAlign: "center", padding: "10px 4px", marginBottom: 0,
              borderLeft: day.rest ? `2px solid ${C.text4}` : completed ? `2px solid ${C.secondary}` : `2px solid ${C.accent}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.secondary : C.accent, fontFamily: "var(--m)" }}>{day.d}</div>
              <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em", marginTop: 2 }}>
                {day.rest ? "REST" : day.t.split(" ")[0]}
              </div>
              {completed && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="3" strokeLinecap="round" style={{ marginTop: 2 }}><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </Card>
          );
        })}
      </div>

      <SectionDivider C={C} />

      {/* ─── FATIGUE MODEL ─── */}
      {fatigue && (
        <>
          <Label C={C}>Fatigue Model</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Training Load</div>
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>{fatigue.label}</div>
              </div>
              <RadialProgress value={fatigue.fatigue} max={100} C={C} size={68} label="FATIGUE" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "12px 10px", background: C.structGlass, borderRadius: 10, textAlign: "center", border: `1px solid ${C.structBorder}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 12px ${C.accent030}` }}>{fatigue.density}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 4 }}>SESS / WEEK</div>
              </div>
              <div style={{ flex: 1, padding: "12px 10px", background: C.structGlass, borderRadius: 10, textAlign: "center", border: `1px solid ${C.structBorder}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", textShadow: `0 0 12px ${C.secondary030}` }}>{fatigue.volumeTrend}%</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 4 }}>VOL TREND</div>
              </div>
            </div>
          </Card>
          <SectionDivider C={C} />
        </>
      )}

      {/* ─── VOLUME CHART ─── */}
      {history.length > 0 && (
        <>
          <Label C={C}>Volume by Session</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <BarChart data={volumeChartData} C={C} height={150} />
          </Card>
        </>
      )}

      {/* ─── WEIGHT TREND ─── */}
      {weightChartData.length >= 2 && (
        <>
          <Label C={C} style={{ marginTop: 16 }}>Weight Trend</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <LineChart data={weightChartData} C={C} height={130} unit=" lbs" />
          </Card>
        </>
      )}

      {/* ─── MUSCLE VOLUME ─── */}
      {stats.totalVolumeAllTime > 0 && (
        <>
          <Label C={C} style={{ marginTop: 16 }}>Muscle Volume Distribution</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <BodyHeatMap muscleVolume={stats.muscleVolume} C={C} />
          </Card>
        </>
      )}

      {/* ─── PERSONAL RECORDS ─── */}
      {prs && prs.length > 0 && (
        <>
          <SectionDivider C={C} />
          <Label C={C}>Personal Records</Label>
          {prs.slice(0, 10).map((pr, i) => (
            <Card key={i} C={C} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: C.gradient, backgroundSize: "300% 100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 12px ${C.accent015}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.btnText} strokeWidth="2" strokeLinecap="round">
                  <path d="M12 15l-3 5h6l-3-5z" /><circle cx="12" cy="8" r="6" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{pr.exercise}</div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 3, letterSpacing: ".06em" }}>{pr.type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 12px ${C.accent030}` }}>{pr.value}</div>
              </div>
            </Card>
          ))}
        </>
      )}

      <SectionDivider C={C} />

      {/* ─── TOOLS (navigation — at bottom where it belongs) ─── */}
      <Label C={C}>Tools</Label>
      {[
        { l: "Program Guide", d: "Full breakdown of the Forge system", v: "gd", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
        )},
        { l: "Volume Log", d: "Track training volume over time", v: "vl", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )},
        { l: "Daily Check-In", d: "Log sleep, stress, energy, and weight", v: "ci", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        )},
        { l: "Progress Photos", d: "Visual progress tracking", v: "pp", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
          </svg>
        )},
      ].map(({ l, d, v, icon }) => (
        <Card key={v} C={C} onClick={() => onNav(v)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: `0 0 8px ${C.accent005}`,
          }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{l}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{d}</div>
          </div>
          <div style={{ color: C.text4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </Card>
      ))}
    </div>
  );
}
