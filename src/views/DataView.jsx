import { Card, Label } from "../components/Primitives";
import { BarChart, LineChart, RadialProgress } from "../components/Charts";
import BodyHeatMap from "../components/BodyHeatMap";
import { computeStats, computeFatigueScore, getWorkoutHistory } from "../utils/analytics";
import DAYS from "../data/workouts";

export default function DataView({ C, onNav }) {
  const stats = computeStats();
  const fatigue = computeFatigueScore();
  const history = getWorkoutHistory();

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
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Data</div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 24 }}>
        {stats.workoutCount > 0 ? `${stats.workoutCount} workouts tracked` : "Start training to see your data"}
      </div>

      {/* Live Stats */}
      <Label C={C}>Overview</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[
          { v: stats.workoutCount || "0", l: "WORKOUTS" },
          { v: stats.streak || "0", l: "STREAK" },
          { v: stats.cyclesCompleted || "0", l: "CYCLES" },
        ].map(({ v, l }) => (
          <Card key={l} C={C} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{v}</div>
            <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 4 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Fatigue Model */}
      {fatigue && (
        <>
          <Label C={C}>Fatigue Model</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>Training Load</div>
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{fatigue.label}</div>
              </div>
              <RadialProgress value={fatigue.fatigue} max={100} C={C} size={64} label="FATIGUE" />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, padding: 10, background: `${C.accent}06`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{fatigue.density}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>SESS/WEEK</div>
              </div>
              <div style={{ flex: 1, padding: 10, background: `${C.accent}06`, borderRadius: 8, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{fatigue.volumeTrend}%</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>VOL TREND</div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Volume Chart */}
      {history.length > 0 && (
        <>
          <Label C={C}>Volume by Session</Label>
          <Card C={C} style={{ padding: 16, marginBottom: 20 }}>
            <BarChart data={volumeChartData} C={C} height={120} />
          </Card>
        </>
      )}

      {/* Weight Trend */}
      {weightChartData.length >= 2 && (
        <>
          <Label C={C}>Weight Trend</Label>
          <Card C={C} style={{ padding: 16, marginBottom: 20 }}>
            <LineChart data={weightChartData} C={C} height={100} unit=" lbs" />
          </Card>
        </>
      )}

      {/* Muscle Volume Heat Map */}
      {stats.totalVolumeAllTime > 0 && (
        <>
          <Label C={C}>Muscle Volume Distribution</Label>
          <Card C={C} style={{ padding: 16, marginBottom: 20 }}>
            <BodyHeatMap muscleVolume={stats.muscleVolume} C={C} />
          </Card>
        </>
      )}

      {/* Tools */}
      <Label C={C}>Tools</Label>
      {[
        { l: "Program Guide", d: "Full breakdown of the Forge system", v: "gd", icon: "📖" },
        { l: "Volume Log", d: "Track training volume over time", v: "vl", icon: "📊" },
        { l: "Daily Check-In", d: "Log sleep, stress, energy, and weight", v: "ci", icon: "📋" },
        { l: "Progress Photos", d: "Visual progress tracking", v: "pp", icon: "📸" },
      ].map(({ l, d, v, icon }) => (
        <Card key={v} C={C} onClick={() => onNav(v)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.accent}10`, border: `1px solid ${C.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{l}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{d}</div>
          </div>
          <div style={{ marginLeft: "auto", color: C.text4, fontSize: 16 }}>›</div>
        </Card>
      ))}

      {/* Cycle Calendar */}
      <Label C={C} style={{ marginTop: 8 }}>14-Day Cycle</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 16 }}>
        {DAYS.map((day) => {
          const completed = history.some((h) => h.dayNum === day.d);
          return (
            <Card key={day.d} C={C} style={{ textAlign: "center", padding: "10px 4px", borderLeft: day.rest ? `2px solid ${C.text4}` : completed ? `2px solid ${C.ok}` : `2px solid ${C.accent}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.ok : C.accent, fontFamily: "var(--m)" }}>{day.d}</div>
              <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 2 }}>
                {day.rest ? "REST" : day.t.split(" ")[0]}
              </div>
              {completed && <div style={{ fontSize: 8, color: C.ok, marginTop: 2 }}>✓</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
