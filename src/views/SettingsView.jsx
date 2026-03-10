import { useState } from "react";
import { Card, Label, Button, SectionDivider, Modal } from "../components/Primitives";
import { computeStats } from "../utils/analytics";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ru", label: "Russian", native: "Русский" },
];

function detectLanguage() {
  const stored = storage.get("lang", null);
  if (stored) return stored;
  const browserLang = (navigator.language || navigator.userLanguage || "en").split("-")[0].toLowerCase();
  const match = LANGUAGES.find(l => l.code === browserLang);
  return match ? match.code : "en";
}

export default function SettingsView({ C, accentId, surfaceId, changeAccent, changeSurface, showToast, onBack }) {
  const [notifications, setNotifications] = useState(() => storage.get("nf", { a: true, b: true, c: true, d: true, e: true }));
  const [showResetModal, setShowResetModal] = useState(false);
  const [profile, setProfile] = useState(() => storage.get("profile", { phone: "", email: "" }));
  const [editingField, setEditingField] = useState(null);
  const [language, setLanguage] = useState(detectLanguage);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const stats = computeStats();
  const toggleNotif = (key) => { const next = { ...notifications, [key]: !notifications[key] }; setNotifications(next); storage.set("nf", next); };

  const saveProfile = (key, value) => {
    const next = { ...profile, [key]: value };
    setProfile(next);
    storage.set("profile", next);
    setEditingField(null);
    showToast?.("Updated");
  };

  const changeLang = (code) => {
    setLanguage(code);
    storage.set("lang", code);
    setShowLangPicker(false);
    showToast?.(`Language set to ${LANGUAGES.find(l => l.code === code)?.label}`);
  };

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

      {/* ─── ACCOUNT ─── */}
      <Label C={C}>ACCOUNT</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {[
          { k: "email", l: "Email", ph: "your@email.com", type: "email", icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          )},
          { k: "phone", l: "Phone", ph: "+1 (555) 000-0000", type: "tel", icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
          )},
        ].map(({ k, l, ph, type, icon }, i, arr) => (
          <div key={k} style={{ padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.structBorder}` : "none" }}>
            {editingField === k ? (
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 6 }}>{l.toUpperCase()}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    autoFocus
                    type={type}
                    defaultValue={profile[k]}
                    id={`profile-${k}`}
                    placeholder={ph}
                    onKeyDown={e => { if (e.key === "Enter") saveProfile(k, e.target.value); if (e.key === "Escape") setEditingField(null); }}
                    style={{
                      flex: 1, padding: "10px 12px", background: C.structGlass,
                      border: `1.5px solid ${C.accent030}`, borderRadius: 8,
                      color: C.text1, fontSize: 14, fontFamily: "var(--m)",
                      outline: "none",
                    }}
                  />
                  <button onClick={() => saveProfile(k, document.getElementById(`profile-${k}`)?.value || "")} style={{
                    padding: "8px 14px", background: C.gradientBtn, backgroundSize: "300% 100%",
                    border: "none", borderRadius: 8, color: C.btnText, fontSize: 9, fontWeight: 700,
                    fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".06em",
                  }}>SAVE</button>
                  <button onClick={() => setEditingField(null)} style={{
                    padding: "8px 10px", background: "transparent",
                    border: `1px solid ${C.structBorderHover}`, borderRadius: 8,
                    color: C.text4, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditingField(k)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                {icon}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text2 }}>{l}</div>
                  <div style={{ fontSize: 11, color: profile[k] ? C.text3 : C.text5, fontFamily: "var(--m)", marginTop: 1 }}>
                    {profile[k] || `Add ${l.toLowerCase()}`}
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            )}
          </div>
        ))}
      </Card>

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

      {/* ─── BACKGROUND SURFACE — Premium Swatches ─── */}
      <Label C={C}>BACKGROUND SURFACE</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
        {Object.values(SURFACES).map(surface => {
          const isActive = surfaceId === surface.id;
          const accent = ACCENTS[accentId] || ACCENTS.forge;
          return (
            <button key={surface.id} onClick={() => changeSurface(surface.id)}
              style={{
                padding: "10px 4px 8px", background: isActive ? C.accent008 : "transparent",
                border: `1.5px solid ${isActive ? C.accent : C.structBorderHover}`,
                borderRadius: 10, cursor: "pointer", transition: "all 0.25s",
                boxShadow: isActive ? `0 0 16px ${C.accent015}` : "none",
              }}>
              {/* Multi-layer surface preview */}
              <div style={{
                width: "100%", height: 40, borderRadius: 6,
                background: surface.bg,
                position: "relative", overflow: "hidden",
                border: `1px solid ${isActive ? accent.accent + '30' : surface.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isActive ? `inset 0 0 12px ${accent.accent}15` : "none",
              }}>
                {/* Card layer preview */}
                <div style={{
                  position: "absolute", bottom: 3, left: 3, right: 3, height: 14,
                  background: surface.card,
                  borderRadius: 3,
                  border: `1px solid ${surface.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'}`,
                }} />
                {/* Accent glow dot — shows how accent looks on this surface */}
                <div style={{
                  position: "absolute", top: 5, right: 5,
                  width: 6, height: 6, borderRadius: 3,
                  background: accent.accent,
                  boxShadow: `0 0 6px ${accent.accent}60`,
                }} />
                {/* Text preview line */}
                <div style={{
                  position: "absolute", top: 6, left: 5,
                  width: 14, height: 2, borderRadius: 1,
                  background: surface.text1,
                  opacity: 0.7,
                }} />
                <div style={{
                  position: "absolute", top: 11, left: 5,
                  width: 10, height: 1.5, borderRadius: 1,
                  background: surface.text3,
                  opacity: 0.5,
                }} />
              </div>
              <div style={{ fontSize: 8, fontWeight: 600, color: isActive ? C.accent : C.text3, fontFamily: "var(--m)", marginTop: 6 }}>{surface.name}</div>
              <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", marginTop: 1, letterSpacing: ".04em" }}>{surface.desc}</div>
            </button>
          );
        })}
      </div>

      <SectionDivider C={C} />

      {/* ─── PREFERENCES ─── */}
      <Label C={C}>PREFERENCES</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {/* Units */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
          <div>
            <div style={{ fontSize: 13, color: C.text2 }}>Units</div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>Weight &amp; measurements</div>
          </div>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>Imperial (lbs)</div>
        </div>

        {/* Language */}
        <div style={{ padding: "14px 0" }}>
          <div onClick={() => setShowLangPicker(!showLangPicker)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>Language</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>App interface language</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: C.text3, fontFamily: "var(--m)" }}>
                {LANGUAGES.find(l => l.code === language)?.native || "English"}
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showLangPicker ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {showLangPicker && (
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {LANGUAGES.map(lang => {
                const active = language === lang.code;
                return (
                  <button key={lang.code} onClick={() => changeLang(lang.code)} style={{
                    padding: "10px 12px", textAlign: "left",
                    background: active ? C.accent008 : "transparent",
                    border: `1px solid ${active ? C.accent030 : C.structBorder}`,
                    borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 12, color: active ? C.accent : C.text2, fontWeight: active ? 600 : 400 }}>{lang.native}</div>
                    <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>{lang.label}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* ─── NOTIFICATIONS ─── */}
      <Label C={C}>NOTIFICATIONS</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 24 }}>
        {[
          { k: "a", l: "Workouts", desc: "Daily training reminders" },
          { k: "b", l: "Weight Reminders", desc: "Morning weigh-in" },
          { k: "c", l: "Meal Tracking", desc: "Meal timing alerts" },
          { k: "d", l: "Supplements", desc: "Daily supplement check" },
          { k: "e", l: "Check-Ins", desc: "Weekly body check-in" },
        ].map(({ k, l, desc }, i, arr) => (
          <div key={k} onClick={() => toggleNotif(k)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.structBorder}` : "none", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>{l}</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{desc}</div>
            </div>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: notifications[k] ? C.accent : C.accent010, position: "relative", transition: "background 0.2s", boxShadow: notifications[k] ? `0 0 8px ${C.accent020}` : "none", flexShrink: 0, marginLeft: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: notifications[k] ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        ))}
      </Card>

      <SectionDivider C={C} />

      {/* ─── DATA ─── */}
      <Label C={C}>DATA</Label>

      {/* Backup reminder */}
      {(() => {
        const lastBackup = storage.get("last_backup", null);
        const daysSince = lastBackup ? Math.floor((Date.now() - lastBackup) / 86400000) : null;
        const needsBackup = !lastBackup || daysSince >= 7;
        if (!needsBackup) return null;
        return (
          <Card C={C} style={{ padding: "12px 16px", marginBottom: 12, borderColor: C.warn + "30" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.warn} strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>
                  {lastBackup ? `Last backup: ${daysSince} days ago` : "No backup on file"}
                </div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                  Export your data to protect your progress
                </div>
              </div>
            </div>
          </Card>
        );
      })()}

      <button onClick={() => {
        const exportData = {};
        Object.keys(localStorage).filter(k => k.startsWith("f_")).forEach(k => {
          try { exportData[k] = JSON.parse(localStorage.getItem(k)); } catch { exportData[k] = localStorage.getItem(k); }
        });
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `forge-export-${new Date().toISOString().split("T")[0]}.json`; a.click();
        URL.revokeObjectURL(url);
        storage.set("last_backup", Date.now());
        showToast?.("Data exported");
      }}
        style={{ width: "100%", padding: 14, background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.accent, fontSize: 11, fontWeight: 700, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", marginBottom: 10, minHeight: 44 }}>
        EXPORT ALL DATA
      </button>

      <button
        style={{ width: "100%", padding: 14, background: `${C.danger}06`, border: `1.5px solid ${C.danger}25`, borderRadius: 10, color: C.danger, fontSize: 11, fontWeight: 700, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", minHeight: 44 }}
        onClick={() => setShowResetModal(true)}>
        RESET ALL DATA
      </button>

      {showResetModal && (
        <Modal
          C={C}
          title="Reset All Data?"
          message="This will permanently delete all your workouts, check-ins, meals, and progress data. This action cannot be undone."
          onClose={() => setShowResetModal(false)}
          actions={[
            { label: "CANCEL", onClick: () => setShowResetModal(false), variant: "ghost" },
            { label: "RESET", onClick: () => {
              Object.keys(localStorage).filter(k => k.startsWith("f_")).forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }, variant: "danger" },
          ]}
        />
      )}

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
