// ══════════════════════════════════════════════════════════════
// FORGE BODY HEAT MAP
// Muscle group visualization with volume-based coloring
// ══════════════════════════════════════════════════════════════

function getRecoveryColors(muscleVolume, C) {
  const max = Math.max(...Object.values(muscleVolume), 1);
  const colors = {};

  Object.entries(muscleVolume).forEach(([muscle, vol]) => {
    const intensity = vol / max;
    if (intensity > 0.7) {
      colors[muscle] = { fill: C.warn, opacity: 0.7, label: "HIGH" };
    } else if (intensity > 0.3) {
      colors[muscle] = { fill: C.accent, opacity: 0.5, label: "MOD" };
    } else if (intensity > 0) {
      colors[muscle] = { fill: C.accentDark, opacity: 0.3, label: "LOW" };
    } else {
      colors[muscle] = { fill: C.text5, opacity: 0.15, label: "NONE" };
    }
  });

  return colors;
}

export default function BodyHeatMap({ muscleVolume, C }) {
  const colors = getRecoveryColors(muscleVolume, C);

  const muscleGroups = [
    { id: "chest", label: "Chest" },
    { id: "back", label: "Back" },
    { id: "shoulders", label: "Shoulders" },
    { id: "biceps", label: "Biceps" },
    { id: "triceps", label: "Triceps" },
    { id: "quads", label: "Quads" },
    { id: "hamstrings", label: "Hams" },
    { id: "glutes", label: "Glutes" },
    { id: "calves", label: "Calves" },
    { id: "traps", label: "Traps" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { label: "High Vol", color: C.warn },
          { label: "Moderate", color: C.accent },
          { label: "Low", color: C.accentDark },
          { label: "None", color: C.text5 },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, opacity: 0.7 }} />
            <span style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".06em" }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
        {muscleGroups.map((muscle) => {
          const mc = colors[muscle.id] || { fill: C.text5, opacity: 0.15, label: "—" };
          const vol = muscleVolume[muscle.id] || 0;
          return (
            <div
              key={muscle.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: C.structGlass,
                border: `1px solid ${C.structBorder}`,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 28,
                  borderRadius: 3,
                  background: mc.fill,
                  opacity: mc.opacity + 0.2,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>{muscle.label}</div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                  {vol > 0 ? `${Math.round(vol).toLocaleString()} lbs` : "No data"}
                </div>
              </div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  color: mc.fill,
                  fontFamily: "var(--m)",
                  letterSpacing: ".08em",
                  opacity: mc.opacity + 0.3,
                }}
              >
                {mc.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
