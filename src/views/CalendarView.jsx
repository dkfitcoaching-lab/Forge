import { useState } from "react";
import { Card, Label, Button, SectionDivider } from "../components/Primitives";
import DAYS from "../data/workouts";
import CONFIG from "../data/config";
import { getWorkoutHistory } from "../utils/analytics";
import storage from "../utils/storage";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function getCycleDayForDate(date, startDay, startDate) {
  const cycleLen = CONFIG.program.cycleLength;
  const diffDays = Math.floor((date - startDate) / 86400000);
  const cycleDayOffset = ((diffDays % cycleLen) + cycleLen) % cycleLen;
  return ((startDay - 1 + cycleDayOffset) % cycleLen) + 1;
}

function generateICS(events) {
  const pad = (n) => String(n).padStart(2, "0");
  const toICSDate = (d) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Forge//EN\nCALSCALE:GREGORIAN\n";
  events.forEach(e => {
    ics += "BEGIN:VEVENT\n";
    ics += `DTSTART;VALUE=DATE:${toICSDate(e.date)}\n`;
    ics += `DTEND;VALUE=DATE:${toICSDate(new Date(e.date.getTime() + 86400000))}\n`;
    ics += `SUMMARY:${e.title}\n`;
    ics += `DESCRIPTION:${e.description || ""}\n`;
    ics += "END:VEVENT\n";
  });
  ics += "END:VCALENDAR";
  return ics;
}

export default function CalendarView({ C, onBack, onWork }) {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const currentDay = storage.get("cd", 1);
  const today = new Date();
  today.setHours(0,0,0,0);

  const history = getWorkoutHistory();
  const completedDates = new Set(history.map(h => {
    const d = new Date(h.timestamp);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }));

  const calDays = getCalendarDays(viewYear, viewMonth);

  const getDateInfo = (dayNum) => {
    if (!dayNum) return null;
    const date = new Date(viewYear, viewMonth, dayNum);
    const dateKey = `${viewYear}-${viewMonth}-${dayNum}`;
    const completed = completedDates.has(dateKey);
    const cycleDay = getCycleDayForDate(date, currentDay, today);
    const dayData = DAYS[cycleDay - 1] || {};
    const isRest = !!dayData.rest;
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;
    return { date, completed, cycleDay, dayData, isRest, isToday, isPast };
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDate(null);
  };

  const selectedInfo = selectedDate ? getDateInfo(selectedDate) : null;

  const exportToCalendar = () => {
    const events = [];
    // Generate next 4 weeks of scheduled workouts
    for (let i = 0; i < 28; i++) {
      const date = new Date(today.getTime() + i * 86400000);
      const cycleDay = getCycleDayForDate(date, currentDay, today);
      const dayData = DAYS[cycleDay - 1] || {};
      if (!dayData.rest) {
        events.push({
          date,
          title: `Forge: Day ${cycleDay} — ${dayData.t}`,
          description: `${(dayData.x || []).length} exercises · ~${dayData.m || 60} min`,
        });
      }
    }
    const ics = generateICS(events);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forge-schedule.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

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

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Training Calendar</div>
        <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
          Your {CONFIG.program.cycleLength}-day cycle mapped to real dates
        </div>
      </div>

      {/* Month Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text3, padding: "8px 12px", cursor: "pointer", minHeight: 40, minWidth: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button onClick={nextMonth} style={{ background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text3, padding: "8px 12px", cursor: "pointer", minHeight: 40, minWidth: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Day Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 20 }}>
        {calDays.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const info = getDateInfo(day);
          const isSelected = selectedDate === day;
          return (
            <button key={day} onClick={() => setSelectedDate(isSelected ? null : day)} style={{
              padding: "8px 2px", textAlign: "center", cursor: "pointer",
              background: isSelected ? C.accent010 : info.isToday ? C.structGlassHover : "transparent",
              border: isSelected ? `1.5px solid ${C.accent}` : info.isToday ? `1.5px solid ${C.accent}40` : `1px solid ${C.structBorder}`,
              borderRadius: 8, position: "relative", transition: "all .15s",
            }}>
              <div style={{ fontSize: 13, fontWeight: info.isToday ? 800 : 500, color: info.completed ? C.secondary : info.isRest ? C.text4 : info.isPast ? C.text3 : C.text1, fontFamily: "var(--m)" }}>
                {day}
              </div>
              <div style={{ fontSize: 6, color: info.isRest ? C.text4 : C.accent, fontFamily: "var(--m)", letterSpacing: ".06em", marginTop: 1 }}>
                {info.isRest ? "REST" : `D${info.cycleDay}`}
              </div>
              {info.completed && (
                <div style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: C.secondary }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      {selectedInfo && (
        <Card C={C} style={{ padding: 18, marginBottom: 16, borderLeft: `3px solid ${selectedInfo.isRest ? C.text4 : C.accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
                {selectedInfo.isRest ? "Rest & Recovery" : selectedInfo.dayData.t}
              </div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                Cycle Day {selectedInfo.cycleDay} · {selectedInfo.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </div>
            {selectedInfo.completed && (
              <div style={{ fontSize: 8, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", letterSpacing: ".1em", padding: "4px 8px", background: C.secondary010, borderRadius: 4, border: `1px solid ${C.secondary}30` }}>DONE</div>
            )}
          </div>
          {!selectedInfo.isRest && (
            <>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)", marginBottom: 8 }}>
                {(selectedInfo.dayData.x || []).length} exercises · ~{selectedInfo.dayData.m || 60} min
              </div>
              {(selectedInfo.dayData.x || []).map((ex, i) => (
                <div key={i} style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)", padding: "3px 0", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, flexShrink: 0 }} />
                  {ex.n} — {ex.s}
                </div>
              ))}
            </>
          )}
          {selectedInfo.isRest && (
            <div style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)", lineHeight: 1.6 }}>
              Growth happens during recovery. Light walking or stretching only. Do not train.
            </div>
          )}
        </Card>
      )}

      <SectionDivider C={C} />

      {/* Export */}
      <Label C={C}>Export Schedule</Label>
      <Card C={C} style={{ padding: 18 }}>
        <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginBottom: 14, lineHeight: 1.6 }}>
          Export the next 4 weeks of scheduled workouts to your phone's calendar. Includes workout type, exercise count, and estimated duration.
        </div>
        <Button C={C} onClick={exportToCalendar} variant="ghost">
          <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            EXPORT TO CALENDAR (.ICS)
          </span>
        </Button>
      </Card>

      {/* Upcoming Week Preview */}
      <SectionDivider C={C} />
      <Label C={C}>Next 7 Days</Label>
      {Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today.getTime() + i * 86400000);
        const cycleDay = getCycleDayForDate(date, currentDay, today);
        const dayData = DAYS[cycleDay - 1] || {};
        const isRest = !!dayData.rest;
        const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        return (
          <Card key={i} C={C} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
            opacity: isRest ? 0.6 : 1,
            borderLeft: isRest ? `2px solid ${C.text4}` : i === 0 ? `2px solid ${C.secondary}` : `2px solid ${C.accent}`,
          }}>
            <div style={{ width: 32, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: isRest ? C.text4 : C.accent, fontFamily: "var(--m)" }}>D{cycleDay}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>{isRest ? "Rest Day" : dayData.t}</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>
                {dateStr}{!isRest ? ` · ${(dayData.x || []).length} exercises · ~${dayData.m || 60} min` : " · Recovery"}
              </div>
            </div>
            {i === 0 && !isRest && (
              <div style={{ fontSize: 8, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", letterSpacing: ".1em" }}>TODAY</div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
