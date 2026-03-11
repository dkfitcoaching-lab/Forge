import { useState } from "react";
import { StaggerItem, Card, Button, Label, SectionDivider } from "../components/Primitives";
import { useStaggeredReveal } from "../utils/hooks";
import { getWorkoutHistory, computeStats } from "../utils/analytics";
import DAYS from "../data/workouts";
import storage from "../utils/storage";

export default function ProgramView({ C, onWork, onNav }) {
  const visible = useStaggeredReveal(20, 40);
  const [currentDay] = useState(() => storage.get("cd", 1));
  const [expandedDay, setExpandedDay] = useState(null);
  const history = getWorkoutHistory();
  const stats = computeStats();
  const isCompetitor = !!storage.get("posing_div", null);

  // Cycle progress
  const completedDays = new Set(history.map(h => h.dayNum));
  const trainingDays = DAYS.filter(d => !d.rest);
  const cycleProgress = trainingDays.filter(d => completedDays.has(d.d)).length;

  return (
    <div>
      {/* ─── CYCLE PROGRESS ─── */}
      <StaggerItem index={0} visible={visible}>
        <Label C={C}>CYCLE PROGRESS</Label>
        <Card C={C} style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em" }}>CYCLE {stats.cyclesCompleted + 1}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginTop: 4 }}>{cycleProgress}/{trainingDays.length} Workouts</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{Math.round((cycleProgress / trainingDays.length) * 100)}%</div>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>COMPLETE</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 3, background: C.structBorderHover, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: `${(cycleProgress / trainingDays.length) * 100}%`,
              background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent})`,
              transition: "width 0.4s ease",
              boxShadow: cycleProgress > 0 ? `0 0 8px ${C.accent020}` : "none",
            }} />
          </div>
          {stats.cyclesCompleted > 0 && (
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 10, letterSpacing: ".04em" }}>
              {stats.cyclesCompleted} cycle{stats.cyclesCompleted !== 1 ? "s" : ""} completed · {5 - Math.min(stats.cyclesCompleted, 5) > 0 ? `${5 - stats.cyclesCompleted} until program modifications` : "Eligible for modifications"}
            </div>
          )}
        </Card>
      </StaggerItem>

      {/* ─── 14-DAY CYCLE CALENDAR ─── */}
      <StaggerItem index={1} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>14-DAY CYCLE</Label>
        {/* Week labels */}
        {[{ label: "WEEK 1", days: DAYS.slice(0, 7) }, { label: "WEEK 2", days: DAYS.slice(7) }].map(({ label, days }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 6 }}>{label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {days.map((day) => {
                const completed = completedDays.has(day.d);
                const isCurrent = day.d === currentDay;
                const isClickable = !day.rest;
                return (
                  <div key={day.d}
                    onClick={() => isClickable && onWork(day)}
                    style={{
                      textAlign: "center", padding: "10px 2px",
                      background: isCurrent ? C.accent010 : C.cardGradient,
                      border: `1.5px solid ${isCurrent ? C.accent030 : completed ? `${C.secondary}30` : C.structBorderHover}`,
                      borderRadius: 8,
                      boxShadow: isCurrent ? `0 0 12px ${C.accent008}` : C.cardShadow,
                      transition: "all 0.2s",
                      cursor: isClickable ? "pointer" : "default",
                      opacity: day.rest ? 0.6 : 1,
                    }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.secondary : isCurrent ? C.accent : C.text3, fontFamily: "var(--m)" }}>{day.d}</div>
                    <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".04em", marginTop: 2, lineHeight: 1.2 }}>
                      {day.rest ? "REST" : day.t.split(" + ")[0]}
                    </div>
                    {completed && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.secondary, margin: "3px auto 0" }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </StaggerItem>

      {/* ─── WORKOUT DETAILS — tap to preview exercises ─── */}
      <StaggerItem index={2} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>WORKOUTS</Label>
        {trainingDays.map((day) => {
          const completed = completedDays.has(day.d);
          const isExpanded = expandedDay === day.d;
          return (
            <Card key={day.d} C={C} style={{ marginBottom: 6 }}>
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.d)}
                style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: completed ? C.secondary010 : C.structGlass,
                  border: `1px solid ${completed ? C.secondary : C.structBorderHover}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: completed ? C.secondary : C.accent, fontFamily: "var(--m)", flexShrink: 0,
                }}>
                  {completed ? "✓" : day.d}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>Day {day.d}: {day.t}</div>
                  <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{day.x?.length} exercises · ~{day.m} min</div>
                </div>
                <div style={{ color: C.text4, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>

              {/* Expanded exercise preview */}
              {isExpanded && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.structBorder}` }}>
                  {/* Warmup */}
                  {day.w?.length > 0 && (
                    <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginBottom: 10, padding: "6px 10px", background: C.structGlass, borderRadius: 6, border: `1px solid ${C.structBorder}` }}>
                      <span style={{ color: C.accent, fontWeight: 700, letterSpacing: ".1em" }}>WARMUP</span>
                      <span style={{ marginLeft: 8 }}>{day.w.join(" → ")}</span>
                    </div>
                  )}
                  {/* Exercises */}
                  {day.x.map((ex, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                      borderBottom: i < day.x.length - 1 ? `1px solid ${C.structBorder}` : "none",
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 600, color: C.text4, fontFamily: "var(--m)", flexShrink: 0,
                      }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: C.text1 }}>
                          {ex.n}
                          {ex.tg && <span style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", marginLeft: 6, fontWeight: 700 }}>{ex.tg}</span>}
                        </div>
                        {ex.c?.length > 0 && (
                          <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2, fontStyle: "italic" }}>{ex.c.join(" · ")}</div>
                        )}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, fontFamily: "var(--m)", flexShrink: 0 }}>{ex.s}</div>
                    </div>
                  ))}
                  {/* Start workout button */}
                  <Button C={C} onClick={() => onWork(day)} style={{ marginTop: 14 }}>START DAY {day.d}</Button>
                </div>
              )}
            </Card>
          );
        })}
      </StaggerItem>

      {/* ─── TOOLS ─── */}
      <StaggerItem index={3} visible={visible}>
        <SectionDivider C={C} />
        <Label C={C}>TOOLS</Label>
        {/* Generate Program PDF */}
        <Card C={C} onClick={() => onNav("pdf")} accentGlow style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: C.structGlass, border: `1.5px solid ${C.accent030}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${C.accent010}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Generate Program PDF</div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Training, nutrition, supplements, recovery</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </Card>

        {/* Program Guide */}
        <Card C={C} onClick={() => onNav("gd")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Program Guide</div>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Fundamentals, nutrition, recovery, mindset</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </Card>

        {/* Posing Practice — competitor only */}
        {isCompetitor && (
          <Card C={C} onClick={() => onNav("posing")} accentGlow style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: C.structGlass, border: `1.5px solid ${C.accent030}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 12px ${C.accent010}`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" />
                <path d="M12 8v4" />
                <path d="M9 12l-2 8h2l3-4 3 4h2l-2-8" />
                <path d="M8 14h8" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Posing Practice</div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>NPC/IFBB mandatory poses by division</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </Card>
        )}
      </StaggerItem>
    </div>
  );
}
