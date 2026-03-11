import { useState, useEffect, useRef } from "react";
import { Button, Card, Label, Modal, ForgeLogo } from "./Primitives";
import { CelebrationBurst, PRBadge } from "./Celebration";
import { formatTime } from "../utils/helpers";
import { detectNewPRs, getWorkoutHistory } from "../utils/analytics";
import storage from "../utils/storage";

export default function WorkoutPlayer({ day, onExit, C, showToast, coachOpen }) {
  const exercises = day.x || [];
  const [phase, setPhase] = useState("overview");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [trackingData, setTrackingData] = useState(() => storage.get(`wp_${day.d}`, {}));
  const [resting, setResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [newPRs, setNewPRs] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const restRef = useRef();
  const startTimeRef = useRef(null);
  const elapsedAtPauseRef = useRef(0);

  const exercise = exercises[exerciseIndex] || {};
  const numSets = exercise.ns || 2;
  const trackKey = `${exerciseIndex}_${setIndex}`;

  // Persist active session state for crash recovery
  useEffect(() => {
    if (phase === "active" || phase === "paused") {
      storage.set("active_session", { dayNum: day.d, exerciseIndex, setIndex, elapsed: elapsedAtPauseRef.current || elapsed, timestamp: Date.now() });
    }
  }, [phase, exerciseIndex, setIndex]);

  const clearActiveSession = () => storage.remove("active_session");

  const history = getWorkoutHistory();
  const prevSession = history.filter(h => h.dayNum === day.d).slice(-1)[0];
  const getPrevData = (exIdx, sIdx) => {
    if (!prevSession?.exercises?.[exIdx]?.sets?.[sIdx]) return null;
    return prevSession.exercises[exIdx].sets[sIdx];
  };

  useEffect(() => {
    if (phase === "active") {
      if (!startTimeRef.current) startTimeRef.current = Date.now() - elapsedAtPauseRef.current * 1000;
      const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (resting && restSeconds > 0 && phase === "active") {
      restRef.current = setTimeout(() => setRestSeconds(s => s - 1), 1000);
    } else if (restSeconds === 0 && resting) {
      setResting(false);
      try { navigator.vibrate?.(100); } catch {}
    }
    return () => clearTimeout(restRef.current);
  }, [resting, restSeconds, phase]);

  const saveValue = (field, rawValue) => {
    // Validate: only allow positive numbers, strip non-numeric except decimal
    const cleaned = rawValue.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    const maxVal = field === 'r' ? 100 : 1500; // reps max 100, weight max 1500 lbs
    const value = cleaned === '' ? '' : (isNaN(num) || num < 0) ? '' : num > maxVal ? String(maxVal) : cleaned;
    const next = { ...trackingData, [`${trackKey}_${field}`]: value };
    setTrackingData(next);
    storage.set(`wp_${day.d}`, next);
  };

  const getRestTime = () => exercise.tg === "FST-7" ? 40 : exercise.p ? 90 : 60;

  const completeSet = () => {
    try { navigator.vibrate?.(10); } catch {}
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
        if (w && r) sets.push({ weight: Number(w), reps: Number(r) });
      }
      return { name: ex.n, sets };
    });
    const totalVolume = Object.entries(trackingData).reduce((acc, [key, val]) => {
      if (key.endsWith("_w")) {
        const r = trackingData[key.replace("_w", "_r")];
        if (val && r) acc += Number(val) * Number(r);
      }
      return acc;
    }, 0);
    const sessionData = { timestamp: Date.now(), dayNum: day.d, dayTitle: day.t, exercises: sessionExercises, totalVolume, duration: elapsed };
    const prs = detectNewPRs(sessionData);
    setNewPRs(prs);
    storage.set(`wh_${Date.now()}`, sessionData);
    clearActiveSession();
    if (prs.length > 0) setShowCelebration(true);
    setPhase("done");
    try { navigator.vibrate?.([50, 50, 100]); } catch {}
  };

  const handlePause = () => { elapsedAtPauseRef.current = elapsed; startTimeRef.current = null; setPhase("paused"); };
  const handleResume = () => { startTimeRef.current = Date.now() - elapsedAtPauseRef.current * 1000; setPhase("active"); };
  const handleExit = () => { if (phase === "active" || phase === "paused") setExitConfirm(true); else { clearActiveSession(); onExit(); } };

  const completedSetsTotal = exercises.reduce((acc, ex, exIdx) => {
    if (exIdx < exerciseIndex) return acc + ex.ns;
    if (exIdx === exerciseIndex) return acc + setIndex;
    return acc;
  }, 0);
  const totalSetsAll = exercises.reduce((acc, ex) => acc + ex.ns, 0);
  const progressPct = totalSetsAll > 0 ? (completedSetsTotal / totalSetsAll) * 100 : 0;

  // ─── OVERVIEW ──────────────────────────────────────────────
  if (phase === "overview") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "120%", height: "40%", background: C.atmosphereGrad }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.structBorderHover}`, background: C.headerBg, backdropFilter: "blur(20px)" }}>
            <button onClick={onExit} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600, cursor: "pointer", letterSpacing: ".06em", minHeight: 44, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              BACK
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Day {day.d}</div>
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>{day.t}</div>
            </div>
            <div style={{ width: 60 }} />
          </div>
          <div style={{ padding: "24px 20px 120px" }}>
            <Label C={C}>WORKOUT OVERVIEW</Label>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>{day.t}</div>
            <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginBottom: 24 }}>{exercises.length} exercises · {totalSetsAll} sets · ~{day.m} min</div>
            {day.w?.length > 0 && (
              <Card C={C} style={{ marginBottom: 16 }}>
                <Label C={C} style={{ marginBottom: 8 }}>WARMUP</Label>
                {day.w.map((w, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", padding: "4px 0", display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, flexShrink: 0 }} />{w}
                  </div>
                ))}
              </Card>
            )}
            {exercises.map((ex, i) => {
              const prev = prevSession?.exercises?.[i];
              return (
                <Card key={i} C={C} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accent010, border: `1px solid ${C.structBorderHover}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{ex.n}</div>
                    <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{ex.s}{ex.tg ? ` · ${ex.tg}` : ""}</div>
                    {prev?.sets?.length > 0 && (
                      <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2, opacity: 0.7 }}>
                        Last: {prev.sets.map((s, si) => `${s.weight}×${s.reps}`).join(" / ")}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
          <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 640, padding: "16px 20px max(16px, env(safe-area-inset-bottom))", background: C.navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.structBorderHover}`, zIndex: 10 }}>
            <Button C={C} onClick={() => { startTimeRef.current = Date.now(); setPhase("active"); }}>START WORKOUT</Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DONE ──────────────────────────────────────────────────
  if (phase === "done") {
    const totalVolume = Object.entries(trackingData).reduce((acc, [key, val]) => {
      if (key.endsWith("_w")) { const r = trackingData[key.replace("_w", "_r")]; if (val && r) acc += Number(val) * Number(r); }
      return acc;
    }, 0);
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", fontFamily: "var(--b)", position: "relative" }}>
        {showCelebration && <CelebrationBurst C={C} />}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent008} 0%, transparent 60%)`, animation: "orbFloat 6s ease-in-out infinite" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}><ForgeLogo C={C} size="lg" /></div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>WORKOUT COMPLETE</div>
          <div style={{ fontSize: 13, color: C.text3, marginBottom: 32, fontFamily: "var(--m)" }}>Day {day.d} — {day.t}</div>
          <div style={{ display: "flex", gap: 24, marginBottom: 32, justifyContent: "center" }}>
            {[{ v: formatTime(elapsed), l: "DURATION" }, { v: exercises.length, l: "EXERCISES" }, { v: totalVolume > 0 ? Math.round(totalVolume).toLocaleString() : "—", l: "LBS MOVED" }].map(({ v, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 20px ${C.accent030}` }}>{v}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          {newPRs.length > 0 && <div style={{ width: "100%", maxWidth: 320, marginBottom: 24 }}><Label C={C}>PERSONAL RECORDS</Label>{newPRs.map((pr, i) => <PRBadge key={i} pr={pr} C={C} />)}</div>}
          <Button C={C} onClick={onExit} style={{ maxWidth: 280 }}>BACK TO HOME</Button>
        </div>
      </div>
    );
  }

  // ─── ACTIVE ────────────────────────────────────────────────
  const prevSetData = getPrevData(exerciseIndex, setIndex);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "var(--b)", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "100%", height: "40%", background: C.atmosphereGrad }} />
      </div>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${C.structBorderHover}`, background: C.headerBg, backdropFilter: "blur(20px)", position: "relative", zIndex: 2 }}>
        <button onClick={handleExit} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", minHeight: 44, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
              EXIT
            </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>Day {day.d}</div>
          <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>{day.t}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={phase === "paused" ? handleResume : handlePause} style={{ background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.accent, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer", padding: "6px 10px", minWidth: 44, minHeight: 44, letterSpacing: ".08em", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {phase === "paused" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent} stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="4" x2="7" y2="20" /><line x1="17" y1="4" x2="17" y2="20" /></svg>
            )}
          </button>
          <div style={{ fontSize: 12, color: C.accent, fontFamily: "var(--m)", fontWeight: 600, minWidth: 44, textAlign: "right" }}>{formatTime(elapsed)}</div>
        </div>
      </div>
      {/* Progress */}
      <div style={{ height: 2, background: C.accent008, position: "relative", zIndex: 2 }}>
        <div style={{ height: "100%", background: C.gradient, backgroundSize: "300% 100%", width: `${progressPct}%`, transition: "width 0.5s ease", animation: "shimmerSlow 8s ease-in-out infinite" }} />
      </div>
      {/* Paused overlay */}
      {phase === "paused" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, animation: "fadeIn .2s ease" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".3em", color: C.accent, fontFamily: "var(--m)", marginBottom: 16 }}>PAUSED</div>
          <div style={{ fontSize: 48, fontWeight: 200, fontFamily: "var(--m)", color: C.text1, textShadow: `0 0 30px ${C.accent020}` }}>{formatTime(elapsed)}</div>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 8, marginBottom: 32 }}>{exerciseIndex + 1}/{exercises.length} exercises · {completedSetsTotal}/{totalSetsAll} sets</div>
          <div style={{ display: "flex", gap: 12, width: 280 }}>
            <Button C={C} onClick={handleResume} style={{ flex: 1 }}>RESUME</Button>
            <Button C={C} onClick={finishWorkout} variant="ghost" style={{ flex: 1 }}>END</Button>
          </div>
        </div>
      )}
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {exercise.tg && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".12em", padding: "4px 12px", background: C.accent010, border: `1px solid ${C.structBorderHover}`, borderRadius: 20, color: C.accent, fontFamily: "var(--m)" }}>{exercise.tg}</span>}
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginTop: exercise.tg ? 12 : 0, lineHeight: 1.1 }}>{exercise.n}</div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginTop: 6 }}>{exercise.s}</div>
          {exercise.p && <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 6 }}>{exercise.p}</div>}
        </div>
        <Card C={C} glow style={{ padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".18em" }}>SET</div>
            <div style={{ fontSize: 48, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 30px ${C.accent030}`, lineHeight: 1.1 }}>{setIndex + 1}<span style={{ fontSize: 18, color: C.text4 }}>/{numSets}</span></div>
          </div>
          {prevSetData && (
            <div style={{ textAlign: "center", marginBottom: 14, padding: "6px 12px", background: C.structGlass, borderRadius: 8, border: `1px solid ${C.structBorderHover}` }}>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>LAST: {prevSetData.weight} lbs × {prevSetData.reps} reps</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
            {[{ f: "w", p: "lbs", l: "WEIGHT" }, { f: "r", p: "reps", l: "REPS" }].map(({ f, p, l }) => (
              <div key={f} style={{ flex: 1 }}>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 6 }}>{l}</div>
                <input value={trackingData[`${trackKey}_${f}`] || ""} onChange={(e) => saveValue(f, e.target.value)} placeholder={p} type="number" inputMode="numeric"
                  style={{ width: "100%", padding: "14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 22, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
              </div>
            ))}
          </div>
          <Button C={C} onClick={completeSet}>COMPLETE SET</Button>
        </Card>
        {exercise.c?.length > 0 && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: C.structGlass, borderRadius: 10, border: `1px solid ${C.structBorderHover}` }}>
            <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 8 }}>COACHING CUES</div>
            {exercise.c.map((cue, i) => (
              <div key={i} style={{ fontSize: 12, color: C.text3, padding: "4px 0", fontFamily: "var(--m)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: C.accent, flexShrink: 0 }} />{cue}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20 }}>
          {exercises.map((_, i) => (
            <div key={i} style={{ width: i === exerciseIndex ? 20 : 6, height: 6, borderRadius: 3, background: i < exerciseIndex ? C.accent : i === exerciseIndex ? C.accentVivid : C.accent010, transition: "all 0.3s", boxShadow: i === exerciseIndex ? `0 0 8px ${C.accent040}` : "none" }} />
          ))}
        </div>
      </div>
      {/* Rest */}
      {resting && phase === "active" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, animation: "fadeIn .2s ease" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".3em", color: C.accentDark, fontFamily: "var(--m)", marginBottom: 20 }}>REST</div>
          <div style={{ position: "relative", width: 160, height: 160, marginBottom: 20 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke={C.accent008} strokeWidth="4" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={restSeconds <= 5 ? C.warn : C.accent} strokeWidth="4" strokeDasharray={2 * Math.PI * 68} strokeDashoffset={2 * Math.PI * 68 * (1 - restSeconds / Math.max(getRestTime(), 1))} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 56, fontWeight: 200, fontFamily: "var(--m)", color: restSeconds <= 5 ? C.warn : C.text1, textShadow: `0 0 40px ${restSeconds <= 5 ? C.warn : C.accent}20`, transition: "color 0.3s" }}>{restSeconds}</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginBottom: 24 }}>Next: {exercises[Math.min(exerciseIndex + (setIndex >= numSets - 1 ? 1 : 0), exercises.length - 1)]?.n || "Done"}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setRestSeconds(s => Math.max(0, s - 15))} style={{ background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text3, fontSize: 10, fontFamily: "var(--m)", padding: "8px 16px", cursor: "pointer", minHeight: 44, minWidth: 44 }}>-15s</button>
            <button onClick={() => { setResting(false); setRestSeconds(0); }} style={{ background: C.structGlass, border: `1px solid ${C.structBorderStrong}`, borderRadius: 8, color: C.accent, fontSize: 10, fontFamily: "var(--m)", letterSpacing: ".1em", padding: "10px 28px", cursor: "pointer", minHeight: 44 }}>SKIP</button>
            <button onClick={() => setRestSeconds(s => s + 15)} style={{ background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text3, fontSize: 10, fontFamily: "var(--m)", padding: "8px 16px", cursor: "pointer", minHeight: 44, minWidth: 44 }}>+15s</button>
          </div>
        </div>
      )}
      {exitConfirm && <Modal C={C} title="End Workout?" message="Your progress has been saved. You can resume later." onClose={() => setExitConfirm(false)} actions={[{ label: "KEEP GOING", onClick: () => setExitConfirm(false) }, { label: "END", onClick: () => { finishWorkout(); setExitConfirm(false); }, variant: "ghost" }]} />}
    </div>
  );
}
