import { useState, useRef } from "react";
import { Card, Label, Button, SectionDivider, Modal } from "../components/Primitives";
import { computeStats } from "../utils/analytics";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";
import { getNotificationPermission, requestNotificationPermission } from "../utils/notifications";

const TIME_ZONES = Intl.supportedValuesOf?.("timeZone") || [];

function detectTimezone() {
  const stored = storage.get("tz", null);
  if (stored) return stored;
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; }
}

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

export default function SettingsView({ C, accentId, surfaceId, changeAccent, changeSurface, showToast, onBack, onNav }) {
  const [notifications, setNotifications] = useState(() => storage.get("nf", { a: true, b: true, c: true, d: true, e: true }));
  const [showResetModal, setShowResetModal] = useState(false);
  const [profile, setProfile] = useState(() => storage.get("profile", {
    phone: "", email: "", name: "", photo: null, dob: "",
    gymName: "", gymType: "commercial", trainingTime: "",
    emergencyName: "", emergencyPhone: "",
  }));
  const [editingField, setEditingField] = useState(null);
  const [language, setLanguage] = useState(detectLanguage);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [units, setUnits] = useState(() => storage.get("units", "imperial"));
  const [timezone, setTimezone] = useState(detectTimezone);
  const [showTzPicker, setShowTzPicker] = useState(false);
  const [tzSearch, setTzSearch] = useState("");
  const [showTraining, setShowTraining] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showCoachVoice, setShowCoachVoice] = useState(false);
  const [coachVoice, setCoachVoice] = useState(() => storage.get("coach_voice", "default"));
  const [ttsEnabled, setTtsEnabled] = useState(() => storage.get("tts_enabled", false));
  const photoInputRef = useRef();
  const stats = computeStats();

  const saveProfile = (key, value, silent) => {
    const next = { ...profile, [key]: value };
    setProfile(next);
    storage.set("profile", next);
    setEditingField(null);
    if (!silent) showToast?.("Updated");
  };

  const [photoCrop, setPhotoCrop] = useState(null); // { src, scale, offsetY }

  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoCrop({ src: ev.target.result, scale: 1, offsetY: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeProfilePhoto = () => {
    saveProfile("photo", null, true);
    showToast?.("Photo removed");
  };

  const applyCrop = () => {
    if (!photoCrop) return;
    const canvas = document.createElement("canvas");
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      // Match CSS objectFit:"cover" + scale + translateY exactly
      const scale = photoCrop.scale;
      const aspect = img.width / img.height;
      let dw, dh;
      // "cover" fills the square — short side matches, long side overflows
      if (aspect >= 1) {
        dh = size;
        dw = size * aspect;
      } else {
        dw = size;
        dh = size / aspect;
      }
      // Apply zoom
      dw *= scale;
      dh *= scale;
      // Center, then apply vertical offset (matches CSS translateY(offsetY * 20px) scaled to 256px canvas)
      const dx = (size - dw) / 2;
      const dy = (size - dh) / 2 + photoCrop.offsetY * 20 * (size / 160);
      ctx.drawImage(img, dx, dy, dw, dh);
      const result = canvas.toDataURL("image/jpeg", 0.85);
      saveProfile("photo", result, true);
      setPhotoCrop(null);
      showToast?.("Photo updated");
    };
    img.src = photoCrop.src;
  };

  const changeLang = (code) => {
    setLanguage(code);
    storage.set("lang", code);
    setShowLangPicker(false);
    showToast?.(`Language set to ${LANGUAGES.find(l => l.code === code)?.label}`);
  };

  const changeUnits = (u) => {
    setUnits(u);
    storage.set("units", u);
    showToast?.(`Units set to ${u === "imperial" ? "Imperial (lbs)" : "Metric (kg)"}`);
  };

  const changeTz = (tz) => {
    setTimezone(tz);
    storage.set("tz", tz);
    setShowTzPicker(false);
    setTzSearch("");
    showToast?.("Timezone updated");
  };

  const filteredTz = tzSearch
    ? TIME_ZONES.filter(tz => tz.toLowerCase().includes(tzSearch.toLowerCase())).slice(0, 8)
    : TIME_ZONES.filter(tz => tz === timezone || tz.startsWith(timezone.split("/")[0])).slice(0, 6);

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
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handleProfilePhoto} style={{ display: "none" }} />
      <Card C={C} style={{
        padding: 24, marginBottom: 20, position: "relative", overflow: "hidden",
        borderTop: `2px solid ${C.accent030}`,
      }}>
        {/* Background atmosphere */}
        <div style={{
          position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent010} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          {/* Avatar with glow ring */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -3, borderRadius: 19, border: `1.5px solid ${C.accent030}`,
              boxShadow: `0 0 16px ${C.accent020}, inset 0 0 8px ${C.accent010}`,
            }} />
            <div onClick={() => photoInputRef.current?.click()} style={{
              width: 64, height: 64, borderRadius: 16,
              background: profile.photo ? "none" : C.gradient,
              backgroundSize: "300% 100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, fontFamily: "var(--d)",
              color: C.btnText, animation: profile.photo ? "none" : "shimmerSlow 10s ease-in-out infinite",
              boxShadow: `0 4px 24px ${C.accent030}, 0 0 40px ${C.accent010}`,
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              {profile.photo ? (
                <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
              ) : (
                profile.name ? profile.name.charAt(0).toUpperCase() : "F"
              )}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 20,
                background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 3,
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            {/* Remove photo button */}
            {profile.photo && (
              <button onClick={(e) => { e.stopPropagation(); removeProfilePhoto(); }} style={{
                position: "absolute", top: -6, right: -6,
                width: 20, height: 20, borderRadius: 10,
                background: C.danger || "#ff4444", border: `2px solid ${C.card}`,
                color: "#fff", fontSize: 10, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                zIndex: 2,
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {editingField === "name" ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  autoFocus
                  defaultValue={profile.name}
                  id="profile-name"
                  placeholder="Your name"
                  onKeyDown={e => { if (e.key === "Enter") saveProfile("name", e.target.value); if (e.key === "Escape") setEditingField(null); }}
                  style={{
                    flex: 1, padding: "8px 10px", background: C.structGlass,
                    border: `1.5px solid ${C.accent030}`, borderRadius: 8,
                    color: C.text1, fontSize: 16, fontWeight: 700, fontFamily: "var(--d)",
                    outline: "none",
                  }}
                />
                <button onClick={() => saveProfile("name", document.getElementById("profile-name")?.value || "")} style={{
                  padding: "6px 12px", background: C.gradientBtn, backgroundSize: "300% 100%",
                  border: "none", borderRadius: 8, color: C.btnText, fontSize: 9, fontWeight: 700,
                  fontFamily: "var(--m)", cursor: "pointer",
                }}>SAVE</button>
              </div>
            ) : (
              <div onClick={() => setEditingField("name")} style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", textShadow: `0 0 20px ${C.accent010}` }}>
                  {profile.name || "Forge Athlete"}
                </div>
                <div style={{ fontSize: 10, color: C.text3, fontFamily: "var(--m)", letterSpacing: ".1em", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  {stats.cyclesCompleted > 0 ? `CYCLE ${stats.cyclesCompleted + 1}` : "PREMIUM MEMBER"}
                  {!profile.name && (
                    <span style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)" }}>tap to edit</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { v: stats.workoutCount, l: "WORKOUTS" },
          { v: stats.streak, l: "STREAK" },
          { v: stats.consistency ? `${stats.consistency}%` : "—", l: "CONSISTENCY" },
          { v: stats.avgReadiness || "—", l: "READINESS", sub: stats.avgReadiness ? "/10" : null },
          { v: stats.top1RM ? `${stats.top1RM}` : "—", l: `EST 1RM ${units === "metric" ? "KG" : "LBS"}`, sub: stats.top1RMExercise ? stats.top1RMExercise.split(" ").slice(0, 2).join(" ") : null },
          { v: stats.cyclesCompleted, l: "CYCLES DONE" },
        ].map(({ v, l, sub }) => (
          <div key={l} style={{
            padding: "18px 8px 14px", textAlign: "center",
            background: C.cardGradient, borderRadius: 14,
            border: `1.5px solid ${C.accent015}`, boxShadow: `${C.cardShadow}, 0 0 20px ${C.accent008}`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
              background: C.dividerGrad, opacity: 0.5,
            }} />
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--m)", color: C.accent, textShadow: `0 0 20px ${C.accent}50` }}>{v}</div>
            {sub && <div style={{ fontSize: 7, color: C.text3, fontFamily: "var(--m)", marginTop: 1 }}>{sub}</div>}
            <div style={{ fontSize: 7, color: C.text4, letterSpacing: ".14em", fontFamily: "var(--m)", marginTop: sub ? 2 : 5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Quick Links to other views */}
      {onNav && (
        <Card C={C} onClick={() => onNav("data")} style={{
          cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
          padding: "16px 18px", marginBottom: 10,
          borderLeft: `2px solid ${C.accent030}`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: C.accent008, border: `1px solid ${C.accent020}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${C.accent010}`,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round"><polyline points="4,18 9,13 13,15 20,6" /><polyline points="16,6 20,6 20,10" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>Analytics & Data</div>
            <div style={{ fontSize: 10, color: C.text3, fontFamily: "var(--m)", marginTop: 2 }}>Fatigue model, volume trends, body composition</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
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
          { k: "dob", l: "Date of Birth", ph: "", type: "date", icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ), formatVal: (v) => v ? new Date(v + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null },
        ].map(({ k, l, ph, type, icon, formatVal }, i, arr) => (
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
                    {(formatVal ? formatVal(profile[k]) : profile[k]) || `Add ${l.toLowerCase()}`}
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
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1, letterSpacing: ".04em" }}>{surface.desc}</div>
            </button>
          );
        })}
      </div>

      <SectionDivider C={C} />

      {/* ─── PREFERENCES ─── */}
      <Label C={C}>PREFERENCES</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {/* Units Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
          <div>
            <div style={{ fontSize: 13, color: C.text2 }}>Units</div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>Weight &amp; measurements</div>
          </div>
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.structBorderHover}` }}>
            {[
              { k: "imperial", l: "LBS" },
              { k: "metric", l: "KG" },
            ].map(({ k, l }) => (
              <button key={k} onClick={() => changeUnits(k)} style={{
                padding: "6px 14px", fontSize: 9, fontWeight: 600, fontFamily: "var(--m)",
                letterSpacing: ".06em", cursor: "pointer", border: "none",
                background: units === k ? C.accent : "transparent",
                color: units === k ? C.btnText : C.text4,
                transition: "all 0.2s",
              }}>{l}</button>
            ))}
          </div>
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

        {/* Timezone */}
        <div style={{ padding: "14px 0" }}>
          <div onClick={() => { setShowTzPicker(!showTzPicker); setTzSearch(""); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>Timezone</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>Notifications &amp; scheduling</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.text3, fontFamily: "var(--m)" }}>
                {timezone.replace(/_/g, " ").split("/").pop()}
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showTzPicker ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
          {showTzPicker && (
            <div style={{ marginTop: 10 }}>
              <input
                autoFocus
                value={tzSearch}
                onChange={e => setTzSearch(e.target.value)}
                placeholder="Search timezone..."
                style={{
                  width: "100%", padding: "10px 12px", background: C.structGlass,
                  border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                  color: C.text1, fontSize: 12, fontFamily: "var(--m)", outline: "none",
                  marginBottom: 6,
                }}
              />
              {filteredTz.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredTz.map(tz => (
                    <button key={tz} onClick={() => changeTz(tz)} style={{
                      padding: "8px 12px", textAlign: "left",
                      background: timezone === tz ? C.accent008 : "transparent",
                      border: `1px solid ${timezone === tz ? C.accent030 : C.structBorder}`,
                      borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                    }}>
                      <div style={{ fontSize: 11, color: timezone === tz ? C.accent : C.text2, fontFamily: "var(--m)" }}>{tz.replace(/_/g, " ")}</div>
                    </button>
                  ))}
                </div>
              )}
              {tzSearch && filteredTz.length === 0 && (
                <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", padding: "8px 4px" }}>No timezones match &quot;{tzSearch}&quot;</div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ─── TRAINING ─── */}
      <Label C={C}>TRAINING</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {/* Training Location */}
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
          <div onClick={() => setShowTraining(!showTraining)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text2 }}>Training Location</div>
              <div style={{ fontSize: 11, color: profile.gymName ? C.text3 : C.text5, fontFamily: "var(--m)", marginTop: 1 }}>
                {profile.gymName || "Add your gym"}
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showTraining ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {showTraining && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.structBorder}`, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>GYM NAME</div>
                <input
                  value={profile.gymName}
                  onChange={e => saveProfile("gymName", e.target.value, true)}
                  placeholder="e.g. Gold's Gym, Home Gym"
                  style={{
                    width: "100%", padding: "10px 12px", background: C.structGlass,
                    border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                    color: C.text1, fontSize: 13, fontFamily: "var(--m)", outline: "none",
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 6 }}>GYM TYPE</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { k: "commercial", l: "Commercial", desc: "Full facility" },
                    { k: "home", l: "Home Gym", desc: "Personal setup" },
                    { k: "hybrid", l: "Both", desc: "Mixed access" },
                  ].map(({ k, l, desc }) => (
                    <button key={k} onClick={() => saveProfile("gymType", k, true)} style={{
                      flex: 1, padding: "10px 6px", textAlign: "center",
                      background: profile.gymType === k ? C.accent008 : "transparent",
                      border: `1px solid ${profile.gymType === k ? C.accent030 : C.structBorderHover}`,
                      borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <div style={{ fontSize: 11, color: profile.gymType === k ? C.accent : C.text2, fontWeight: profile.gymType === k ? 600 : 400 }}>{l}</div>
                      <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Training Time Preference */}
        <div style={{ padding: "14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text2 }}>Training Time</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>When you typically train</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {[
              { k: "morning", l: "Morning", t: "5-10am" },
              { k: "midday", l: "Midday", t: "10am-2pm" },
              { k: "afternoon", l: "Afternoon", t: "2-6pm" },
              { k: "evening", l: "Evening", t: "6-10pm" },
            ].map(({ k, l, t }) => (
              <button key={k} onClick={() => saveProfile("trainingTime", profile.trainingTime === k ? "" : k, true)} style={{
                flex: 1, padding: "8px 4px", textAlign: "center",
                background: profile.trainingTime === k ? C.accent008 : "transparent",
                border: `1px solid ${profile.trainingTime === k ? C.accent030 : C.structBorderHover}`,
                borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 10, color: profile.trainingTime === k ? C.accent : C.text2, fontWeight: profile.trainingTime === k ? 600 : 400 }}>{l}</div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>{t}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ─── EMERGENCY CONTACT (inside TRAINING section) ─── */}
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        <div style={{ padding: "14px 0" }}>
          <div onClick={() => setShowEmergency(!showEmergency)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.05 5A5 5 0 0119 8.95M15.05 1A9 9 0 0123 8.94M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.8.36 1.58.7 2.31a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.73.34 1.51.57 2.31.7A2 2 0 0122 16.92z" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text2 }}>Emergency Contact</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>
                {profile.emergencyName ? `${profile.emergencyName}` : "Recommended for safety"}
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showEmergency ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {showEmergency && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.structBorder}`, display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>CONTACT NAME</div>
                <input
                  value={profile.emergencyName}
                  onChange={e => saveProfile("emergencyName", e.target.value, true)}
                  placeholder="Full name"
                  style={{
                    width: "100%", padding: "10px 12px", background: C.structGlass,
                    border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                    color: C.text1, fontSize: 13, fontFamily: "var(--m)", outline: "none",
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>CONTACT PHONE</div>
                <input
                  value={profile.emergencyPhone}
                  onChange={e => saveProfile("emergencyPhone", e.target.value, true)}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  style={{
                    width: "100%", padding: "10px 12px", background: C.structGlass,
                    border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8,
                    color: C.text1, fontSize: 13, fontFamily: "var(--m)", outline: "none",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <SectionDivider C={C} />

      {/* ─── COACH INTELLIGENCE ─── */}
      <Label C={C}>COACH INTELLIGENCE</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {/* Text-to-Speech */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
          <div>
            <div style={{ fontSize: 13, color: C.text2 }}>Voice Responses</div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Coach reads messages aloud</div>
          </div>
          <div onClick={() => { const next = !ttsEnabled; setTtsEnabled(next); storage.set("tts_enabled", next); }} style={{
            width: 40, height: 22, borderRadius: 11, cursor: "pointer",
            background: ttsEnabled ? C.accent : C.accent010,
            position: "relative", transition: "background 0.2s",
            boxShadow: ttsEnabled ? `0 0 8px ${C.accent020}` : "none", flexShrink: 0, marginLeft: 12,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: ttsEnabled ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Voice Selection — ElevenLabs Premium */}
        <div style={{ padding: "14px 0" }}>
          <div onClick={() => setShowCoachVoice(!showCoachVoice)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>Coach Voice</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                {(() => {
                  const voiceMap = { default: "Atlas — Authoritative", rachel: "Rachel — Warm & Clear", adam: "Adam — Deep & Calm", bella: "Bella — Energetic", marcus: "Marcus — Commanding" };
                  return voiceMap[coachVoice] || "Atlas — Authoritative";
                })()}
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showCoachVoice ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {showCoachVoice && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { id: "default", name: "Atlas", detail: "Authoritative & direct — default coach tone", tier: "Premium" },
                { id: "rachel", name: "Rachel", detail: "Warm, clear & motivating — female", tier: "Premium" },
                { id: "adam", name: "Adam", detail: "Deep, calm & reassuring — male", tier: "Premium" },
                { id: "bella", name: "Bella", detail: "High energy & enthusiastic — female", tier: "Elite" },
                { id: "marcus", name: "Marcus", detail: "Commanding & intense — male", tier: "Elite" },
              ].map(v => (
                <button key={v.id} onClick={() => {
                  setCoachVoice(v.id);
                  storage.set("coach_voice", v.id);
                  showToast?.(`Voice: ${v.name}`);
                  setShowCoachVoice(false);
                }} style={{
                  padding: "12px 14px", textAlign: "left",
                  background: coachVoice === v.id ? C.accent008 : "transparent",
                  border: `1px solid ${coachVoice === v.id ? C.accent030 : C.structBorder}`,
                  borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: coachVoice === v.id ? C.accent010 : C.structGlass,
                    border: `1px solid ${coachVoice === v.id ? C.accent020 : C.structBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={coachVoice === v.id ? C.accent : C.text3} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: coachVoice === v.id ? C.accent : C.text1, fontWeight: 600 }}>{v.name}</span>
                      <span style={{ fontSize: 7, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".08em", background: C.accent008, padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>{v.tier}</span>
                    </div>
                    <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{v.detail}</div>
                  </div>
                  {coachVoice === v.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  )}
                </button>
              ))}
              <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", textAlign: "center", marginTop: 6, letterSpacing: ".06em" }}>
                Powered by ElevenLabs · Neural voice synthesis
              </div>
            </div>
          )}
        </div>
      </Card>

      <SectionDivider C={C} />

      {/* ─── NOTIFICATIONS ─── */}
      <Label C={C}>NOTIFICATIONS</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>Push Notifications</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Workouts, meals, check-in reminders</div>
            </div>
          </div>
          <div onClick={() => {
            const allOn = Object.values(notifications).every(Boolean);
            const next = { a: !allOn, b: !allOn, c: !allOn, d: !allOn, e: !allOn };
            setNotifications(next); storage.set("nf", next);
            if (!allOn && getNotificationPermission() !== "granted") {
              requestNotificationPermission().then(r => showToast?.(r === "granted" ? "Notifications enabled" : "Notifications blocked"));
            }
          }} style={{
            width: 40, height: 22, borderRadius: 11, cursor: "pointer",
            background: Object.values(notifications).every(Boolean) ? C.accent : C.accent010,
            position: "relative", transition: "background 0.2s",
            boxShadow: Object.values(notifications).every(Boolean) ? `0 0 8px ${C.accent020}` : "none", flexShrink: 0, marginLeft: 12,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: Object.values(notifications).every(Boolean) ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </Card>

      <SectionDivider C={C} />

      {/* ─── DATA ─── */}
      <Label C={C}>DATA</Label>

      <Card C={C} style={{ padding: "2px 16px" }}>
        <div onClick={() => setShowResetModal(true)} style={{
          padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.danger} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.danger }}>Reset All Data</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>Permanently delete all progress</div>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      </Card>

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

      {/* ─── PHOTO CROP MODAL ─── */}
      {photoCrop && (
        <div onClick={() => setPhotoCrop(null)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, animation: "backdropIn .2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.cardGradient,
            border: `1.5px solid ${C.structBorderStrong}`,
            borderRadius: 16, padding: 24, maxWidth: 340, width: "100%",
            animation: "modalIn .25s ease",
            boxShadow: `0 20px 60px rgba(0,0,0,.5), ${C.neonShadow}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 16, textAlign: "center" }}>
              Adjust Photo
            </div>

            {/* Preview */}
            <div style={{
              width: 160, height: 160, borderRadius: 16, margin: "0 auto 20px",
              overflow: "hidden", border: `2px solid ${C.accent030}`,
              boxShadow: `0 0 20px ${C.accent015}`,
              position: "relative",
            }}>
              <img src={photoCrop.src} alt="Preview" style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: `scale(${photoCrop.scale}) translateY(${photoCrop.offsetY * 20}px)`,
                transition: "transform 0.1s ease",
              }} />
            </div>

            {/* Scale slider */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>ZOOM</span>
                <span style={{ fontSize: 11, color: C.text1, fontFamily: "var(--m)", fontWeight: 600 }}>{Math.round(photoCrop.scale * 100)}%</span>
              </div>
              <input type="range" min="100" max="250" value={Math.round(photoCrop.scale * 100)}
                onChange={e => setPhotoCrop(p => ({ ...p, scale: Number(e.target.value) / 100 }))}
                style={{ width: "100%", accentColor: C.accent }} />
            </div>

            {/* Position slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>POSITION</span>
                <span style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)" }}>↕ Vertical</span>
              </div>
              <input type="range" min="-100" max="100" value={Math.round(photoCrop.offsetY * 100)}
                onChange={e => setPhotoCrop(p => ({ ...p, offsetY: Number(e.target.value) / 100 }))}
                style={{ width: "100%", accentColor: C.accent }} />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <Button C={C} variant="ghost" onClick={() => setPhotoCrop(null)} style={{ flex: 1 }}>CANCEL</Button>
              <Button C={C} onClick={applyCrop} style={{ flex: 1 }}>SAVE</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
