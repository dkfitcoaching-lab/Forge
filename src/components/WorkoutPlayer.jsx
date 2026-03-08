import { useState, useEffect, useRef } from "react";
import { Button } from "./Primitives";
import { formatTime } from "../utils/helpers";
import storage from "../utils/storage";

export default function WorkoutPlayer({ day, onExit, C }) {
  const exercises = day.x || [];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [trackingData, setTrackingData] = useState(() => storage.get(`wp_${day.d}`, {}));
  const [done, setDone] = useState(false);
  const [resting, setResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const restRef = useRef();

  const exercise = exercises[exerciseIndex] || {};
  const numSets = exercise.ns || 2;
  const trackKey = `${exerciseIndex}_${setIndex}`;

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

  const completeSet = () => {
    if (setIndex < numSets - 1) {
      setSetIndex(setIndex + 1);
      setResting(true);
      setRestSeconds(exercise.tg === "FST-7" ? 45 : exercise.p ? 90 : 60);
    } else if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
      setSetIndex(0);
      setResting(true);
      setRestSeconds(90);
    } else {
      setDone(true);
    }
  };

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
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
          fontFamily: "var(--b)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `${C.accent}15`,
            border: `1px solid ${C.border2}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 24,
          }}
        >
          <span role="img" aria-label="fire">&#128293;</span>
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>
          WORKOUT COMPLETE
        </div>
        <div style={{ fontSize: 13, color: C.text3, marginBottom: 32 }}>
          Day {day.d} — {day.t}
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {[
            { v: day.m || "--", l: "MIN" },
            { v: exercises.length, l: "EXERCISES" },
            { v: Math.round(totalVolume).toLocaleString(), l: "LBS MOVED" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", textShadow: `0 0 20px ${C.accent}40` }}>
                {v}
              </div>
              <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".14em", marginTop: 4 }}>
                {l}
              </div>
            </div>
          ))}
        </div>

        <Button C={C} onClick={onExit} style={{ maxWidth: 280 }}>
          BACK TO HOME
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--b)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border1}`,
        }}
      >
        <button
          onClick={onExit}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            fontSize: 12,
            fontFamily: "var(--m)",
            cursor: "pointer",
            letterSpacing: ".1em",
          }}
        >
          EXIT
        </button>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: "var(--d)" }}>
          Day {day.d}
        </div>
        <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>
          {exerciseIndex + 1}/{exercises.length}
        </div>
      </div>

      {/* Exercise Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {exercise.tg && (
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: ".1em",
                padding: "3px 10px",
                background: `${C.accent}15`,
                border: `1px solid ${C.border2}`,
                borderRadius: 20,
                color: C.accent,
                fontFamily: "var(--m)",
              }}
            >
              {exercise.tg}
            </span>
          )}
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text1, fontFamily: "var(--d)", marginTop: 10 }}>
            {exercise.n}
          </div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginTop: 4 }}>
            {exercise.s}
          </div>
          {exercise.p && (
            <div style={{ fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 8 }}>
              {exercise.p}
            </div>
          )}
        </div>

        {/* Set Tracking Card */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border2}`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".16em" }}>
              SET
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: C.accent,
                fontFamily: "var(--m)",
                textShadow: `0 0 30px ${C.accent}30`,
              }}
            >
              {setIndex + 1}/{numSets}
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[
              { f: "w", p: "lbs", l: "WEIGHT" },
              { f: "r", p: "reps", l: "REPS" },
            ].map(({ f, p, l }) => (
              <div key={f} style={{ flex: 1 }}>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 6 }}>
                  {l}
                </div>
                <input
                  value={trackingData[`${trackKey}_${f}`] || ""}
                  onChange={(e) => saveValue(f, e.target.value)}
                  placeholder={p}
                  type="number"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: `${C.accent}08`,
                    border: `1px solid ${C.border2}`,
                    borderRadius: 10,
                    color: C.text1,
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: "var(--m)",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>

          <Button C={C} onClick={completeSet}>
            COMPLETE SET ✓
          </Button>
        </div>

        {/* Coaching Cues */}
        {exercise.c && exercise.c.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {exercise.c.map((cue, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  color: C.text3,
                  padding: "6px 0",
                  borderBottom: `1px solid ${C.border1}`,
                  fontFamily: "var(--m)",
                }}
              >
                {cue}
              </div>
            ))}
          </div>
        )}

        {/* Exercise Progress Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
          {exercises.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === exerciseIndex ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i <= exerciseIndex ? C.accent : `${C.accent}20`,
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {resting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `${C.bg}ee`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".3em", color: C.accent2, fontFamily: "var(--m)", marginBottom: 16 }}>
            REST
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 200,
              fontFamily: "var(--m)",
              color: restSeconds <= 5 ? C.warn : C.text1,
              textShadow: `0 0 40px ${restSeconds <= 5 ? C.warn : C.accent}30`,
              transition: "color 0.3s",
            }}
          >
            {formatTime(restSeconds)}
          </div>
          <div
            style={{
              width: 180,
              height: 3,
              background: `${C.accent}15`,
              borderRadius: 2,
              marginTop: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: C.accent,
                borderRadius: 2,
                width: `${(restSeconds / (exercise.tg === "FST-7" ? 45 : 60)) * 100}%`,
                transition: "width 1s linear",
              }}
            />
          </div>
          <button
            onClick={() => {
              setResting(false);
              setRestSeconds(0);
            }}
            style={{
              marginTop: 32,
              background: "none",
              border: `1px solid ${C.border2}`,
              borderRadius: 8,
              color: C.text3,
              fontSize: 10,
              fontFamily: "var(--m)",
              letterSpacing: ".1em",
              padding: "8px 24px",
              cursor: "pointer",
            }}
          >
            SKIP REST
          </button>
        </div>
      )}
    </div>
  );
}
