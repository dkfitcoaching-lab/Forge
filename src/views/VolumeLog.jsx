import { Card, Label } from "../components/Primitives";
import { useStaggeredReveal } from "../utils/hooks";
import { StaggerItem } from "../components/Primitives";
import DAYS from "../data/workouts";
import storage from "../utils/storage";

export default function VolumeLog({ C, onBack }) {
  const visible = useStaggeredReveal(7, 60);

  const volumeData = DAYS.filter((d) => !d.rest).map((day) => {
    const tracked = storage.get(`wp_${day.d}`, {});
    let totalVolume = 0;
    Object.entries(tracked).forEach(([key, val]) => {
      if (key.endsWith("_w")) {
        const repsKey = key.replace("_w", "_r");
        const reps = tracked[repsKey];
        if (val && reps) totalVolume += Number(val) * Number(reps);
      }
    });
    return { day: day.d, name: day.t, volume: totalVolume, exercises: day.x?.length || 0 };
  });

  const maxVolume = Math.max(...volumeData.map((d) => d.volume), 1);

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none",
          color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
          letterSpacing: ".06em", cursor: "pointer",
          padding: "0 0 16px", marginTop: -4,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        BACK
      </button>

      <StaggerItem index={0} visible={visible}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>
          Volume Log
        </div>
        <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 24 }}>
          Training volume per session (lbs moved)
        </div>
      </StaggerItem>

      {/* Volume Chart */}
      <StaggerItem index={1} visible={visible}>
        <Card C={C} style={{ padding: 20 }}>
          <Label C={C}>Volume by Day</Label>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 120, marginTop: 8 }}>
            {volumeData.map((d) => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    fontSize: 7,
                    color: C.text4,
                    fontFamily: "var(--m)",
                  }}
                >
                  {d.volume > 0 ? `${Math.round(d.volume / 1000)}k` : "—"}
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 28,
                    height: `${d.volume > 0 ? Math.max((d.volume / maxVolume) * 100, 8) : 8}%`,
                    background: d.volume > 0 ? C.gradient : `${C.accent}10`,
                    borderRadius: 4,
                    transition: "height 0.5s ease",
                  }}
                />
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)" }}>
                  D{d.day}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </StaggerItem>

      {/* Session Details */}
      {volumeData.map((d, i) => (
        <StaggerItem key={d.day} index={i + 2} visible={visible}>
          <Card C={C} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `${C.accent}12`,
                border: `1px solid ${C.structBorderHover}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: C.accent,
                fontFamily: "var(--m)",
                flexShrink: 0,
              }}
            >
              {d.day}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>{d.name}</div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                {d.exercises} exercises
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: d.volume > 0 ? C.accent : C.text4, fontFamily: "var(--m)" }}>
                {d.volume > 0 ? `${d.volume.toLocaleString()} lbs` : "No data"}
              </div>
            </div>
          </Card>
        </StaggerItem>
      ))}
    </div>
  );
}
