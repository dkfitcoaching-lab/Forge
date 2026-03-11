import { useState } from "react";
import { Card, Button, Label, SectionDivider } from "../components/Primitives";
import { BarChart } from "../components/Charts";
import storage from "../utils/storage";

const CARDIO_TYPES = [
  { id: "walk", label: "Walk", icon: "🚶", unit: "min" },
  { id: "run", label: "Run", icon: "🏃", unit: "min" },
  { id: "cycle", label: "Cycle", icon: "🚴", unit: "min" },
  { id: "swim", label: "Swim", icon: "🏊", unit: "min" },
  { id: "hiit", label: "HIIT", icon: "⚡", unit: "min" },
  { id: "stairs", label: "Stairs", icon: "🪜", unit: "min" },
  { id: "row", label: "Row", icon: "🚣", unit: "min" },
  { id: "sport", label: "Sport", icon: "⚽", unit: "min" },
];

const INTENSITY = ["Low", "Moderate", "High", "Max"];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getCardioHistory() {
  const entries = [];
  const keys = Object.keys(localStorage).filter(k => k.startsWith("f_cardio_"));
  keys.forEach(k => {
    try {
      const data = JSON.parse(localStorage.getItem(k));
      if (data) entries.push(data);
    } catch {}
  });
  return entries.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

export default function CardioLog({ C, onBack }) {
  const todayKey = getTodayKey();
  const [todayLog, setTodayLog] = useState(() => storage.get("cardio_" + todayKey, { sessions: [], steps: 0 }));
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("walk");
  const [newDuration, setNewDuration] = useState("");
  const [newIntensity, setNewIntensity] = useState(1);
  const [newCalories, setNewCalories] = useState("");
  const [newHeartRate, setNewHeartRate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [stepsInput, setStepsInput] = useState(String(todayLog.steps || ""));

  const history = getCardioHistory();

  const saveTodayLog = (updated) => {
    setTodayLog(updated);
    storage.set("cardio_" + todayKey, { ...updated, date: todayKey });
  };

  const addSession = () => {
    if (!newDuration || Number(newDuration) <= 0) return;
    const session = {
      type: newType,
      duration: Number(newDuration),
      intensity: INTENSITY[newIntensity],
      calories: newCalories ? Number(newCalories) : null,
      heartRate: newHeartRate ? Number(newHeartRate) : null,
      notes: newNotes || null,
      timestamp: Date.now(),
    };
    const updated = { ...todayLog, sessions: [...todayLog.sessions, session] };
    saveTodayLog(updated);
    setAdding(false);
    setNewDuration("");
    setNewCalories("");
    setNewHeartRate("");
    setNewNotes("");
  };

  const saveSteps = () => {
    saveTodayLog({ ...todayLog, steps: Number(stepsInput) || 0 });
  };

  const todayMins = todayLog.sessions.reduce((a, s) => a + (s.duration || 0), 0);
  const todayCals = todayLog.sessions.reduce((a, s) => a + (s.calories || 0), 0);

  // Weekly chart
  const dayMs = 86400000;
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * dayMs);
    const dk = d.toISOString().split("T")[0];
    const dayLog = history.find(h => h.date === dk) || (dk === todayKey ? todayLog : null);
    const mins = dayLog ? (dayLog.sessions || []).reduce((a, s) => a + (s.duration || 0), 0) : 0;
    weekData.push({ value: mins, label: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()] });
  }

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

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Cardio & Conditioning</div>
        <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>Track all cardiovascular activity, steps, and active recovery</div>
      </div>

      {/* Today Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { v: todayMins, l: "MINUTES" },
          { v: todayCals || "—", l: "CALORIES" },
          { v: todayLog.steps || "—", l: "STEPS" },
        ].map(({ v, l }) => (
          <Card key={l} C={C} style={{ textAlign: "center", padding: "16px 8px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 16px ${C.accent}40` }}>{v}</div>
            <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginTop: 4 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Steps Input */}
      <Card C={C} style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 6 }}>DAILY STEPS</div>
            <input value={stepsInput} onChange={(e) => setStepsInput(e.target.value.replace(/\D/g, ""))} onBlur={saveSteps} placeholder="0" type="number" inputMode="numeric"
              style={{ width: "100%", padding: "10px 12px", background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 16, fontWeight: 600, fontFamily: "var(--m)", outline: "none" }} />
          </div>
          <div style={{ textAlign: "center", paddingTop: 16 }}>
            <div style={{ fontSize: 9, color: todayLog.steps >= 10000 ? C.secondary : C.text4, fontFamily: "var(--m)" }}>
              {todayLog.steps >= 10000 ? "Goal hit" : `${Math.max(0, 10000 - (todayLog.steps || 0)).toLocaleString()} to go`}
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Sessions */}
      <Label C={C}>Today's Sessions</Label>
      {todayLog.sessions.length === 0 && !adding && (
        <Card C={C} style={{ padding: 20, textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: C.text4, fontFamily: "var(--m)" }}>No cardio logged today</div>
        </Card>
      )}
      {todayLog.sessions.map((s, i) => {
        const typeObj = CARDIO_TYPES.find(t => t.id === s.type) || CARDIO_TYPES[0];
        return (
          <Card key={i} C={C} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14 }}>
            <div style={{ fontSize: 22 }}>{typeObj.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{typeObj.label}</div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                {s.duration} min · {s.intensity}{s.calories ? ` · ${s.calories} cal` : ""}{s.heartRate ? ` · ${s.heartRate} bpm` : ""}
              </div>
              {s.notes && <div style={{ fontSize: 9, color: C.text3, fontFamily: "var(--m)", marginTop: 3, fontStyle: "italic" }}>{s.notes}</div>}
            </div>
          </Card>
        );
      })}

      {/* Add Session Form */}
      {adding ? (
        <Card C={C} style={{ padding: 18, marginBottom: 8 }}>
          <Label C={C}>LOG CARDIO SESSION</Label>
          {/* Type selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 }}>
            {CARDIO_TYPES.map(t => (
              <button key={t.id} onClick={() => setNewType(t.id)} style={{
                padding: "10px 4px", background: newType === t.id ? C.accent010 : C.structGlass,
                border: `1.5px solid ${newType === t.id ? C.accent : C.structBorderHover}`,
                borderRadius: 8, cursor: "pointer", textAlign: "center", transition: "all .15s",
              }}>
                <div style={{ fontSize: 16 }}>{t.icon}</div>
                <div style={{ fontSize: 8, color: newType === t.id ? C.accent : C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{t.label}</div>
              </button>
            ))}
          </div>
          {/* Duration + Intensity */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 4 }}>DURATION (MIN)</div>
              <input value={newDuration} onChange={(e) => setNewDuration(e.target.value.replace(/\D/g, ""))} placeholder="30" type="number" inputMode="numeric"
                style={{ width: "100%", padding: "10px", background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 16, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 4 }}>INTENSITY</div>
              <div style={{ display: "flex", gap: 3 }}>
                {INTENSITY.map((label, i) => (
                  <button key={i} onClick={() => setNewIntensity(i)} style={{
                    flex: 1, padding: "10px 2px", background: newIntensity === i ? C.accent010 : C.structGlass,
                    border: `1px solid ${newIntensity === i ? C.accent : C.structBorderHover}`,
                    borderRadius: 6, color: newIntensity === i ? C.accent : C.text4, fontSize: 8, fontFamily: "var(--m)", cursor: "pointer",
                  }}>{label.slice(0, 3)}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Optional: Calories + HR */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 4 }}>CALORIES (OPT)</div>
              <input value={newCalories} onChange={(e) => setNewCalories(e.target.value.replace(/\D/g, ""))} placeholder="—" type="number" inputMode="numeric"
                style={{ width: "100%", padding: "10px", background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 14, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 4 }}>AVG HR (OPT)</div>
              <input value={newHeartRate} onChange={(e) => setNewHeartRate(e.target.value.replace(/\D/g, ""))} placeholder="—" type="number" inputMode="numeric"
                style={{ width: "100%", padding: "10px", background: C.structGlass, border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 14, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
            </div>
          </div>
          {/* Notes */}
          <input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Notes (optional)" style={{
            width: "100%", padding: "10px 12px", background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
            borderRadius: 8, color: C.text3, fontSize: 11, fontFamily: "var(--m)", outline: "none", marginBottom: 14,
          }} />
          <div style={{ display: "flex", gap: 10 }}>
            <Button C={C} onClick={addSession} style={{ flex: 1 }}>LOG SESSION</Button>
            <Button C={C} onClick={() => setAdding(false)} variant="ghost" style={{ flex: 1 }}>CANCEL</Button>
          </div>
        </Card>
      ) : (
        <Button C={C} onClick={() => setAdding(true)} variant="ghost" style={{ marginBottom: 8 }}>+ LOG CARDIO SESSION</Button>
      )}

      <SectionDivider C={C} />

      {/* Weekly Chart */}
      <Label C={C}>This Week (Minutes)</Label>
      <Card C={C} style={{ padding: 20, marginBottom: 8 }}>
        <BarChart data={weekData} C={C} height={120} />
        <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 10, textAlign: "center" }}>
          {weekData.reduce((a, d) => a + d.value, 0)} total minutes this week
        </div>
      </Card>

      {/* History */}
      {history.length > 1 && (
        <>
          <SectionDivider C={C} />
          <Label C={C}>Recent History</Label>
          {history.slice(-7).reverse().map((entry, i) => {
            const totalMin = (entry.sessions || []).reduce((a, s) => a + (s.duration || 0), 0);
            const totalCal = (entry.sessions || []).reduce((a, s) => a + (s.calories || 0), 0);
            return (
              <Card key={i} C={C} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>{entry.date}</div>
                  <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                    {(entry.sessions || []).length} session{(entry.sessions || []).length !== 1 ? "s" : ""} · {totalMin} min{totalCal ? ` · ${totalCal} cal` : ""}{entry.steps ? ` · ${entry.steps.toLocaleString()} steps` : ""}
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}
