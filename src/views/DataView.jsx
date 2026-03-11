import { Card, Label, SectionDivider } from "../components/Primitives";
import { BarChart, LineChart, RadialProgress } from "../components/Charts";
import BodyHeatMap from "../components/BodyHeatMap";
import { computeStats, computeFatigueScore, getWorkoutHistory, getAllPersonalRecords } from "../utils/analytics";
import DAYS from "../data/workouts";
import CONFIG from "../data/config";

export default function DataView({ C, onNav, onBack }) {
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

  // Sets per week (last 8 weeks)
  const dayMs = 86400000;
  const setsPerWeekData = [];
  if (history.length > 0) {
    for (let w = 7; w >= 0; w--) {
      const weekStart = Date.now() - (w + 1) * 7 * dayMs;
      const weekEnd = Date.now() - w * 7 * dayMs;
      const weekSessions = history.filter(h => h.timestamp >= weekStart && h.timestamp < weekEnd);
      const totalSets = weekSessions.reduce((acc, s) => acc + (s.exercises || []).reduce((a, ex) => a + (ex.sets?.length || 0), 0), 0);
      setsPerWeekData.push({ value: totalSets, label: w === 0 ? "This" : w === 1 ? "Last" : `${w}w` });
    }
  }

  // Average RPE from recent sessions (if tracked)
  const recentRPEs = [];
  history.slice(-10).forEach(s => {
    (s.exercises || []).forEach(ex => {
      (ex.sets || []).forEach(set => { if (set.rpe) recentRPEs.push(set.rpe); });
    });
  });
  const avgRPE = recentRPEs.length > 0 ? (recentRPEs.reduce((a, b) => a + b, 0) / recentRPEs.length).toFixed(1) : null;

  return (
    <div>
      {onBack && (
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
          letterSpacing: ".06em", cursor: "pointer", padding: "0 0 16px", marginTop: -4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          BACK
        </button>
      )}
      {/* ─── HEADER ─── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Performance Intelligence</div>
        <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
          {stats.workoutCount > 0 ? `${stats.workoutCount} workouts analyzed · ${stats.cyclesCompleted || 0} cycles completed` : "Your analytics engine activates after your first session"}
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
            <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 6 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* ─── CYCLE TRACKER ─── */}
      <Label C={C}>{CONFIG.program.cycleLength}-Day Cycle</Label>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(7, CONFIG.program.cycleLength)}, 1fr)`, gap: 5, marginBottom: 8 }}>
        {DAYS.map((day) => {
          const completed = history.some((h) => h.dayNum === day.d);
          return (
            <Card key={day.d} C={C} style={{
              textAlign: "center", padding: "10px 4px", marginBottom: 0,
              borderLeft: day.rest ? `2px solid ${C.text4}` : completed ? `2px solid ${C.secondary}` : `2px solid ${C.accent}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.secondary : C.accent, fontFamily: "var(--m)" }}>{day.d}</div>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em", marginTop: 2 }}>
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

      {/* ─── EMPTY STATE ─── */}
      {history.length === 0 && (
        <Card C={C} style={{ padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <polyline points="4,18 9,13 13,15 20,6" /><polyline points="16,6 20,6 20,10" />
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text2, marginBottom: 6 }}>Your Data Engine Is Waiting</div>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", lineHeight: 1.6 }}>
            Complete your first workout and this entire dashboard comes alive — fatigue modeling, progressive overload detection, volume distribution, PR tracking. The intelligence builds with every session.
          </div>
        </Card>
      )}

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
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 4 }}>SESS / WEEK</div>
              </div>
              <div style={{ flex: 1, padding: "12px 10px", background: C.structGlass, borderRadius: 10, textAlign: "center", border: `1px solid ${C.structBorder}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", textShadow: `0 0 12px ${C.secondary030}` }}>{fatigue.volumeTrend}%</div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 4 }}>VOL TREND</div>
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

      {/* ─── SETS PER WEEK ─── */}
      {setsPerWeekData.some(d => d.value > 0) && (
        <>
          <Label C={C} style={{ marginTop: 16 }}>Sets Per Week</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <BarChart data={setsPerWeekData} C={C} height={120} />
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 10, textAlign: "center" }}>
              Total working sets completed each week — the primary driver of muscle growth
            </div>
          </Card>
        </>
      )}

      {/* ─── RPE TRACKING ─── */}
      {avgRPE && (
        <>
          <Label C={C} style={{ marginTop: 16 }}>Effort Tracking</Label>
          <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Average RPE</div>
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 4 }}>
                  {Number(avgRPE) >= 9 ? "Very high intensity — monitor recovery" : Number(avgRPE) >= 7.5 ? "Productive range — good stimulus" : Number(avgRPE) >= 6 ? "Moderate effort — room to push harder" : "Low effort — increase intensity"}
                </div>
              </div>
              <RadialProgress value={Number(avgRPE) * 10} max={100} C={C} size={68} label="RPE" />
            </div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 12, textAlign: "center" }}>
              Based on {recentRPEs.length} sets across your last {Math.min(10, history.length)} sessions
            </div>
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

      {/* ─── TOOLS ─── */}
      <Label C={C}>Tools</Label>
      {[
        { l: "Progress Comparison", d: "Side-by-side before & after with branded export", v: "compare", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="8" height="18" rx="1" /><rect x="14" y="3" width="8" height="18" rx="1" /><path d="M12 6v12" strokeDasharray="2 2" />
          </svg>
        )},
        { l: "Program Guide", d: "The methodology behind your results", v: "gd", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
        )},
        { l: "Volume Log", d: "Training tonnage and progression curves", v: "vl", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )},
        { l: "Cardio Log", d: "Track conditioning, steps, and active recovery", v: "cardio", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0L12 5.34l-.77-.76a5.4 5.4 0 00-7.65 7.65l.77.76L12 20.66l7.65-7.67.77-.76a5.4 5.4 0 000-7.65z" />
          </svg>
        )},
        { l: "Training Calendar", d: "Schedule mapped to dates + phone calendar export", v: "calendar", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )},
        { l: "Daily Check-In", d: "The data your coach reads every morning", v: "ci", icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
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
