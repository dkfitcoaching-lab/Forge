import { useState } from "react";
import { Card, Label, Button, SectionDivider } from "../components/Primitives";
import { computeStats } from "../utils/analytics";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";

export default function SettingsView({ C, accentId, surfaceId, changeAccent, changeSurface, showToast, onBack }) {
  const [notifications, setNotifications] = useState(() => storage.get("nf", { a: true, b: true, c: true, d: true, e: true }));
  const stats = computeStats();
  const toggleNotif = (key) => { const next = { ...notifications, [key]: !notifications[key] }; setNotifications(next); storage.set("nf", next); };

  return (
    <div>
      {/* Back nav */}
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
      {/* Profile Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: C.gradient, backgroundSize: "300% 100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 900, fontFamily: "var(--d)",
          color: C.btnText, animation: "shimmerSlow 10s ease-in-out infinite",
          boxShadow: `0 4px 20px ${C.accent030}`,
        }}>F</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>Forge Athlete</div>
          <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
            {stats.cyclesCompleted > 0 ? `CYCLE ${stats.cyclesCompleted + 1}` : "PREMIUM MEMBER"}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { v: stats.workoutCount, l: "WORKOUTS", color: C.accent },
          { v: stats.streak, l: "STREAK", color: C.secondary },
          { v: stats.checkInCount, l: "CHECK-INS", color: C.accent },
        ].map(({ v, l, color }) => (
          <div key={l} style={{
            padding: "16px 10px", textAlign: "center",
            background: C.cardGradient, borderRadius: 12,
            border: `1.5px solid ${C.structBorderHover}`, boxShadow: C.cardShadow,
          }}>
            <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--m)", color, textShadow: `0 0 16px ${color}40` }}>{v}</div>
            <div style={{ fontSize: 8, color: C.text4, letterSpacing: ".14em", fontFamily: "var(--m)", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {stats.totalVolumeAllTime > 0 && (
        <Card C={C} style={{ padding: 14, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", textShadow: `0 0 20px ${C.secondary030}` }}>{Math.round(stats.totalVolumeAllTime).toLocaleString()}</div>
          <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 4 }}>TOTAL LBS MOVED</div>
        </Card>
      )}

      <SectionDivider C={C} />

      {/* ─── ACCENT THEME ─── */}
      <Label C={C}>ACCENT THEME</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        {Object.values(ACCENTS).map(theme => (
          <button key={theme.id} onClick={() => changeAccent(theme.id)}
            style={{
              padding: "14px 6px", background: accentId === theme.id ? `${theme.accent}12` : C.card,
              border: `1.5px solid ${accentId === theme.id ? theme.accent : C.structBorderHover}`,
              borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
              boxShadow: accentId === theme.id ? `0 0 12px ${theme.accent}15` : "none",
            }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, background: theme.gradient, backgroundSize: "300% 100%", margin: "0 auto 6px", animation: accentId === theme.id ? "shimmerSlow 8s ease-in-out infinite" : "none" }} />
            <div style={{ fontSize: 9, fontWeight: 600, color: accentId === theme.id ? theme.accent : C.text4, fontFamily: "var(--m)" }}>{theme.name}</div>
          </button>
        ))}
      </div>

      {/* ─── BACKGROUND SURFACE ─── */}
      <Label C={C}>BACKGROUND SURFACE</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 24 }}>
        {Object.values(SURFACES).map(surface => (
          <button key={surface.id} onClick={() => changeSurface(surface.id)}
            style={{
              padding: "12px 4px", background: surfaceId === surface.id ? C.accent010 : surface.bg,
              border: `1.5px solid ${surfaceId === surface.id ? C.accent : C.structBorderHover}`,
              borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{
              width: "100%", height: 24, borderRadius: 4,
              background: `linear-gradient(180deg, ${surface.bg} 0%, ${surface.card} 100%)`,
              border: `1px solid ${surfaceId === surface.id ? C.accent : 'rgba(255,255,255,0.05)'}`,
              marginBottom: 4,
            }} />
            <div style={{ fontSize: 8, fontWeight: 600, color: surfaceId === surface.id ? C.accent : C.text4, fontFamily: "var(--m)" }}>{surface.name}</div>
          </button>
        ))}
      </div>

      <SectionDivider C={C} />

      {/* ─── PREFERENCES ─── */}
      <Label C={C}>PREFERENCES</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {[
          { k: "units", l: "Units", v: "Imperial (lbs)" },
          { k: "lang", l: "Language", v: "English" },
        ].map(({ k, l, v }) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
            <div style={{ fontSize: 13, color: C.text2 }}>{l}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>{v}</div>
          </div>
        ))}
      </Card>

      {/* ─── NOTIFICATIONS ─── */}
      <Label C={C}>NOTIFICATIONS</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 24 }}>
        {[{ k: "a", l: "Workouts" }, { k: "b", l: "Weight Reminders" }, { k: "c", l: "Meal Tracking" }, { k: "d", l: "Supplements" }, { k: "e", l: "Check-Ins" }].map(({ k, l }, i, arr) => (
          <div key={k} onClick={() => toggleNotif(k)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.structBorder}` : "none", cursor: "pointer" }}>
            <div style={{ fontSize: 13, color: C.text2 }}>{l}</div>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: notifications[k] ? C.accent : C.accent010, position: "relative", transition: "background 0.2s", boxShadow: notifications[k] ? `0 0 8px ${C.accent020}` : "none" }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: notifications[k] ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        ))}
      </Card>

      <SectionDivider C={C} />

      {/* ─── DATA ─── */}
      <Label C={C}>DATA</Label>
      <button onClick={() => {
        const exportData = {};
        Object.keys(localStorage).filter(k => k.startsWith("f_")).forEach(k => {
          try { exportData[k] = JSON.parse(localStorage.getItem(k)); } catch { exportData[k] = localStorage.getItem(k); }
        });
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `forge-export-${new Date().toISOString().split("T")[0]}.json`; a.click();
        URL.revokeObjectURL(url);
        showToast?.("Data exported");
      }}
        style={{ width: "100%", padding: 14, background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.accent, fontSize: 11, fontWeight: 700, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", marginBottom: 10, minHeight: 44 }}>
        EXPORT ALL DATA
      </button>

      <button
        style={{ width: "100%", padding: 14, background: `${C.danger}06`, border: `1.5px solid ${C.danger}25`, borderRadius: 10, color: C.danger, fontSize: 11, fontWeight: 700, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", minHeight: 44 }}
        onClick={() => {
          if (window.confirm("Reset all Forge data? This cannot be undone.")) {
            Object.keys(localStorage).filter(k => k.startsWith("f_")).forEach(k => localStorage.removeItem(k));
            window.location.reload();
          }
        }}>
        RESET ALL DATA
      </button>

      {/* ─── ABOUT ─── */}
      <SectionDivider C={C} />
      <div style={{ textAlign: "center", paddingBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--d)", color: C.text2, marginBottom: 4 }}>FORGE</div>
        <div style={{ fontSize: 8, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".14em", marginBottom: 8 }}>PERFORMANCE SYSTEM</div>
        <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>fitnessforge.ai</div>
      </div>
    </div>
  );
}
