import { useState } from "react";
import { Card, Label } from "../components/Primitives";
import THEMES from "../data/themes";
import storage from "../utils/storage";

export default function ProfileView({ C, themeId, setThemeId }) {
  const [notifications, setNotifications] = useState(() =>
    storage.get("nf", { a: true, b: true, c: true, d: true, e: true })
  );

  const toggleNotif = (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    storage.set("nf", next);
  };

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Profile Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: C.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: C.bg,
            fontWeight: 800,
            fontFamily: "var(--d)",
          }}
        >
          F
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
            Forge Athlete
          </div>
          <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
            PREMIUM MEMBER
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <Label C={C}>Theme</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
        {Object.values(THEMES).map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              setThemeId(theme.id);
              storage.set("th", theme.id);
            }}
            style={{
              padding: "14px 8px",
              background: themeId === theme.id ? `${theme.accent}15` : C.card,
              border: `1px solid ${themeId === theme.id ? theme.accent : C.border2}`,
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                background: theme.gradient,
                margin: "0 auto 8px",
              }}
            />
            <div style={{ fontSize: 10, fontWeight: 600, color: themeId === theme.id ? theme.accent : C.text3, fontFamily: "var(--m)" }}>
              {theme.name}
            </div>
          </button>
        ))}
      </div>

      {/* Performance Stats */}
      <Label C={C}>Performance</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { v: "—", l: "WORKOUTS" },
          { v: "—", l: "STREAK" },
          { v: "—", l: "CHECK-INS" },
        ].map(({ v, l }) => (
          <Card key={l} C={C} style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>
              {v}
            </div>
            <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginTop: 4 }}>
              {l}
            </div>
          </Card>
        ))}
      </div>

      {/* Notifications */}
      <Label C={C}>Notifications</Label>
      <Card C={C} style={{ padding: "4px 16px", marginBottom: 24 }}>
        {[
          { k: "a", l: "Workouts" },
          { k: "b", l: "Weight Reminders" },
          { k: "c", l: "Meal Tracking" },
          { k: "d", l: "Supplements" },
          { k: "e", l: "Check-Ins" },
        ].map(({ k, l }) => (
          <div
            key={k}
            onClick={() => toggleNotif(k)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: k !== "e" ? `1px solid ${C.border1}` : "none",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 13, color: C.text2 }}>{l}</div>
            <div
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                background: notifications[k] ? C.accent : `${C.accent}15`,
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: C.text1,
                  position: "absolute",
                  top: 2,
                  left: notifications[k] ? 18 : 2,
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Reset */}
      <button
        style={{
          width: "100%",
          padding: 14,
          background: `${C.badge}08`,
          border: `1px solid ${C.badge}20`,
          borderRadius: 12,
          color: C.badge,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--m)",
          cursor: "pointer",
          letterSpacing: ".1em",
        }}
        onClick={() => {
          if (window.confirm("Reset all Forge data? This cannot be undone.")) {
            const keys = Object.keys(localStorage).filter((k) => k.startsWith("f_"));
            keys.forEach((k) => localStorage.removeItem(k));
            window.location.reload();
          }
        }}
      >
        RESET ALL DATA
      </button>

      <div style={{ textAlign: "center", marginTop: 32, fontSize: 9, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".16em", paddingBottom: 20 }}>
        FORGE V5 CINEMA — BUILT FOR PERFORMANCE
      </div>
    </div>
  );
}
