import { useState, useEffect, useRef } from "react";
import { Button } from "./Primitives";
import { CelebrationBurst, PRBadge } from "./Celebration";
import { formatTime } from "../utils/helpers";
import { detectNewPRs } from "../utils/analytics";
import storage from "../utils/storage";

export default function WorkoutPlayer({ day, onExit, C }) {
  const exercises = day.x || [];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [trackingData, setTrackingData] = useState(() => storage.get(`wp_${day.d}`, {}));
  const [done, setDone] = useState(false);
  const [resting, setResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [newPRs, setNewPRs] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const restRef = useRef();
  const startTimeRef = useRef(Date.now());

  const exercise = exercises[exerciseIndex] || {};
  const numSets = exercise.ns || 2;
  const trackKey = `${exerciseIndex}_${setIndex}`;

  useEffect(() => {
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resting && restSeconds > 0) {
      restRef.current = setTimeout(() => setRestSeconds((s) => s - 1), 1000);
    } else if (restSeconds === 0 && resting) {
      setResting(false);
    }
    return () => clearTimeout(restRef.current);
  }, [resting, restSeconds]);

  const saveValue = (field, value) => {
    const next = { ...trackingData, [`${trackKey}_${field}`]: value };
    setTrackingData(next);
    storage.set(`wp_${day.d}`, next);
  };

  const getRestTime = () => {
    if (exercise.tg === "FST-7") return 40;
    return exercise.p ? 90 : 60;
  };

  const completeSet = () => {
    if (setIndex < numSets - 1) {
      setSetIndex(setIndex + 1);
      setResting(true);
      setRestSeconds(getRestTime());
    } else if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
      setSetIndex(0);
      setResting(true);
      setRestSeconds(120);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    const sessionExercises = exercises.map((ex, exIdx) => {
      const sets = [];
      for (let s = 0; s < ex.ns; s++) {
        const w = trackingData[`${exIdx}_${s}_w`];
        const r = trackingData[`${exIdx}_${s}_r`];
        if (w || r) sets.push({ weight: w ? Number(w) : 0, reps: r ? Number(r) : 0 });
      }
      return { name: ex.n, sets };
    });

    const totalVolume = Object.entries(trackingData).reduce((acc, [key, val]) => {
      if (key.endsWith("_w")) {
        const repsKey = key.replace("_w", "_r");
        const reps = trackingData[repsKey];
        if (val && reps) acc += Number(val) * Number(reps);
      }
      return acc;
    }, 0);

    const sessionData = {
      timestamp: Date.now(),
      dayNum: day.d,
      dayTitle: day.t,
      exercises: sessionExercises,
      totalVolume,
      duration: elapsed,
    };

    const prs = detectNewPRs(sessionData);
    setNewPRs(prs);
    storage.set(`wh_${Date.now()}`, sessionData);
    if (prs.length > 0) setShowCelebration(true);
    setDone(true);
  };

  const completedSetsTotal = exercises.reduce((acc, ex, exIdx) => {
    if (exIdx < exerciseIndex) return acc + ex.ns;
    if (exIdx === exerciseIndex) return acc + setIndex;
    return acc;
  }, 0);
  const totalSetsAll = exercises.reduce((acc, ex) => acc + ex.ns, 0);
  const progressPct = totalSetsAll > 0 ? (completedSetsTotal / totalSetsAll) * 100 : 0;

  if (done) {
    const totalVolume = Object.entries(trackingData).reduce((acc, [key, val]) => {
      if (key.endsWith("_w")) {
        const repsKey = key.replace("_w", "_r");
        const reps = trackingData[repsKey];
        if (val && reps) acc += Number(val) * Number(reps);
      }
      return acc;
    }, 0);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", fontFamily: "var(--b)" }}>
        {showCelebration && <CelebrationBurst C={C} />}
        <div style={{ width: 80, height: 80, borderRadius: 20, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 24, animation: "glow 2s ease infinite" }}>&#128293;</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>WORKOUT COMPLETE</div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 32 }}>Day {day.d} — {day.t}</div>
        <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
          {[
            { v: formatTime(elapsed), l: "DURATION" },
            { v: exercises.length, l: "EXERCISES" },
            { v: totalVolume > 0 ? Math.round(totalVolume).toLocaleString() : "—", l: "LBS MOVED" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 20px ${C.accent}40` }}>{v}</div>
              <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        {newPRs.length > 0 && (
          <div style={{ width: "100%", maxWidth: 320, marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: ".16em", fontFamily: "var(--m)", marginBottom: 8, textAlign: "left" }}>PERSONAL RECORDS</div>
            {newPRs.map((pr, i) => <PRBadge key={i} pr={pr} C={C} />)}
          </div>
        )}
        <Button C={C} onClick={onExit} style={{ maxWidth: 280 }}>BACK TO HOME</Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "var(--b)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${C.border1}` }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em" }}>EXIT</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>Day {day.d}</div>
          <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>{day.t}</div>
        </div>
        <div style={{ fontSize: 10, color: C.accent, fontFamily: "var(--m)", fontWeight: 600 }}>{formatTime(elapsed)}</div>
      </div>

      <div style={{ height: 2, background: `${C.accent}10` }}>
        <div style={{ height: "100%", background: C.gradient, width: `${progressPct}%`, transition: "width 0.5s ease", backgroundSize: "300% 100%", animation: "shimmer 3s linear infinite" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 24px", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {exercise.tg && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".1em", padding: "3px 10px", background: `${C.accent}15`, border: `1px solid ${C.border2}`, borderRadius: 20, color: C.accent, fontFamily: "var(--m)" }}>{exercise.tg}</span>}
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginTop: 10 }}>{exercise.n}</div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginTop: 4 }}>{exercise.s}</div>
          {exercise.p && <div style={{ fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 6 }}>{exercise.p}</div>}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".16em" }}>SET</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 30px ${C.accent}30`, lineHeight: 1.1 }}>
              {setIndex + 1}<span style={{ fontSize: 16, color: C.text4 }}>/{numSets}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[{ f: "w", p: "lbs", l: "WEIGHT" }, { f: "r", p: "reps", l: "REPS" }].map(({ f, p, l }) => (
              <div key={f} style={{ flex: 1 }}>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 6 }}>{l}</div>
                <input
                  value={trackingData[`${trackKey}_${f}`] || ""}
                  onChange={(e) => saveValue(f, e.target.value)}
                  placeholder={p}
                  type="number"
                  inputMode="numeric"
                  style={{ width: "100%", padding: "12px 14px", background: `${C.accent}08`, border: `1px solid ${C.border2}`, borderRadius: 10, color: C.text1, fontSize: 18, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <Button C={C} onClick={completeSet}>COMPLETE SET ✓</Button>
        </div>

        {exercise.c && exercise.c.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {exercise.c.map((cue, i) => (
              <div key={i} style={{ fontSize: 11, color: C.text3, padding: "5px 0", borderBottom: `1px solid ${C.border1}`, fontFamily: "var(--m)", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, flexShrink: 0 }} />
                {cue}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8 }}>
          {exercises.map((_, i) => (
            <div key={i} style={{ width: i === exerciseIndex ? 18 : 6, height: 6, borderRadius: 3, background: i < exerciseIndex ? C.accent : i === exerciseIndex ? C.accentVivid : `${C.accent}20`, transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {resting && (
        <div style={{ position: "fixed", inset: 0, background: `${C.bg}f5`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".3em", color: C.accent2, fontFamily: "var(--m)", marginBottom: 16 }}>REST</div>
          <div style={{ fontSize: 72, fontWeight: 200, fontFamily: "var(--m)", color: restSeconds <= 5 ? C.warn : C.text1, textShadow: `0 0 40px ${restSeconds <= 5 ? C.warn : C.accent}30`, transition: "color 0.3s" }}>
            {formatTime(restSeconds)}
          </div>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginTop: 16 }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke={`${C.accent}10`} strokeWidth="3" />
            <circle cx="60" cy="60" r="52" fill="none" stroke={restSeconds <= 5 ? C.warn : C.accent} strokeWidth="3"
              strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - restSeconds / Math.max(getRestTime(), 1))}
              strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
          </svg>
          <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 16 }}>
            Next: {exerciseIndex < exercises.length ? exercises[Math.min(exerciseIndex + (setIndex >= numSets - 1 ? 1 : 0), exercises.length - 1)].n : "Done"}
          </div>
          <button onClick={() => { setResting(false); setRestSeconds(0); }} style={{ marginTop: 24, background: "none", border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text3, fontSize: 10, fontFamily: "var(--m)", letterSpacing: ".1em", padding: "8px 24px", cursor: "pointer" }}>
            SKIP REST
          </button>
        </div>
      )}
    </div>
  );
}
