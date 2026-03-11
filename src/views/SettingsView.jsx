import { useState, useRef } from "react";
import { Card, Label, Button, SectionDivider, Modal } from "../components/Primitives";
import { computeStats } from "../utils/analytics";
import { ACCENTS, SURFACES } from "../data/themes";
import storage from "../utils/storage";
import {
  getNotificationPermission, requestNotificationPermission,
  isGeolocationSupported, getLocationSettings, setLocationSettings,
  getGymLocation, saveCurrentAsGym, clearGymLocation,
} from "../utils/notifications";

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

export default function SettingsView({ C, accentId, surfaceId, changeAccent, changeSurface, showToast, onBack }) {
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
  const [locSettings, setLocSettings] = useState(getLocationSettings);
  const [gymLoc, setGymLoc] = useState(getGymLocation);
  const [notifPerm, setNotifPerm] = useState(getNotificationPermission);
  const [savingGym, setSavingGym] = useState(false);
  const [showCoachVoice, setShowCoachVoice] = useState(false);
  const [coachVoice, setCoachVoice] = useState(() => storage.get("coach_voice", "default"));
  const [ttsEnabled, setTtsEnabled] = useState(() => storage.get("tts_enabled", false));
  const photoInputRef = useRef();
  const stats = computeStats();
  const toggleNotif = (key) => { const next = { ...notifications, [key]: !notifications[key] }; setNotifications(next); storage.set("nf", next); };

  const saveProfile = (key, value) => {
    const next = { ...profile, [key]: value };
    setProfile(next);
    storage.set("profile", next);
    setEditingField(null);
    showToast?.("Updated");
  };

  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      saveProfile("photo", ev.target.result);
      showToast?.("Photo updated");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
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
    : [];

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
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div onClick={() => photoInputRef.current?.click()} style={{
          width: 56, height: 56, borderRadius: 16,
          background: profile.photo ? "none" : C.gradient,
          backgroundSize: "300% 100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 900, fontFamily: "var(--d)",
          color: C.btnText, animation: profile.photo ? "none" : "shimmerSlow 10s ease-in-out infinite",
          boxShadow: `0 4px 20px ${C.accent030}`,
          cursor: "pointer", position: "relative", overflow: "hidden",
        }}>
          {profile.photo ? (
            <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
          ) : (
            profile.name ? profile.name.charAt(0).toUpperCase() : "F"
          )}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 18,
            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 2,
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
          </div>
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
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text1, fontFamily: "var(--d)" }}>
                {profile.name || "Forge Athlete"}
              </div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", display: "flex", alignItems: "center", gap: 6 }}>
                {stats.cyclesCompleted > 0 ? `CYCLE ${stats.cyclesCompleted + 1}` : "PREMIUM MEMBER"}
                {!profile.name && (
                  <span style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)" }}>tap to edit</span>
                )}
              </div>
            </div>
          )}
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
              <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", marginTop: 1, letterSpacing: ".04em" }}>{surface.desc}</div>
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
                  onChange={e => saveProfile("gymName", e.target.value)}
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
                    <button key={k} onClick={() => saveProfile("gymType", k)} style={{
                      flex: 1, padding: "10px 6px", textAlign: "center",
                      background: profile.gymType === k ? C.accent008 : "transparent",
                      border: `1px solid ${profile.gymType === k ? C.accent030 : C.structBorderHover}`,
                      borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                    }}>
                      <div style={{ fontSize: 11, color: profile.gymType === k ? C.accent : C.text2, fontWeight: profile.gymType === k ? 600 : 400 }}>{l}</div>
                      <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{desc}</div>
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
              <button key={k} onClick={() => saveProfile("trainingTime", profile.trainingTime === k ? "" : k)} style={{
                flex: 1, padding: "8px 4px", textAlign: "center",
                background: profile.trainingTime === k ? C.accent008 : "transparent",
                border: `1px solid ${profile.trainingTime === k ? C.accent030 : C.structBorderHover}`,
                borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 10, color: profile.trainingTime === k ? C.accent : C.text2, fontWeight: profile.trainingTime === k ? 600 : 400 }}>{l}</div>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>{t}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ─── EMERGENCY CONTACT ─── */}
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
                  onChange={e => saveProfile("emergencyName", e.target.value)}
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
                  onChange={e => saveProfile("emergencyPhone", e.target.value)}
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

        {/* Voice Selection */}
        <div style={{ padding: "14px 0" }}>
          <div onClick={() => setShowCoachVoice(!showCoachVoice)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, color: C.text2 }}>Coach Voice</div>
              <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                {coachVoice === "default" ? "System default" : coachVoice}
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round" style={{ transform: showCoachVoice ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          {showCoachVoice && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {(() => {
                const voices = typeof speechSynthesis !== "undefined" ? speechSynthesis.getVoices().filter(v => v.lang.startsWith("en")).slice(0, 8) : [];
                const options = [{ id: "default", name: "System Default", detail: "Auto-selected" }, ...voices.map(v => ({ id: v.name, name: v.name, detail: v.lang }))];
                return options.map(v => (
                  <button key={v.id} onClick={() => {
                    setCoachVoice(v.id);
                    storage.set("coach_voice", v.id);
                    // Preview the voice
                    if (typeof speechSynthesis !== "undefined" && v.id !== "default") {
                      speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance("Forge Coach is ready.");
                      const found = speechSynthesis.getVoices().find(sv => sv.name === v.id);
                      if (found) u.voice = found;
                      speechSynthesis.speak(u);
                    }
                    setShowCoachVoice(false);
                  }} style={{
                    padding: "10px 12px", textAlign: "left",
                    background: coachVoice === v.id ? C.accent008 : "transparent",
                    border: `1px solid ${coachVoice === v.id ? C.accent030 : C.structBorder}`,
                    borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 11, color: coachVoice === v.id ? C.accent : C.text2, fontWeight: coachVoice === v.id ? 600 : 400 }}>{v.name}</div>
                    <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>{v.detail}</div>
                  </button>
                ));
              })()}
            </div>
          )}
        </div>
      </Card>

      <SectionDivider C={C} />

      {/* ─── LOCATION SERVICES ─── */}
      <Label C={C}>LOCATION SERVICES</Label>
      <Card C={C} style={{ padding: "2px 16px", marginBottom: 16 }}>
        {/* Master toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
          <div>
            <div style={{ fontSize: 13, color: C.text2 }}>Location Services</div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
              {!isGeolocationSupported() ? "Not supported on this device" : "Enable for gym arrival detection"}
            </div>
          </div>
          <div onClick={() => {
            if (!isGeolocationSupported()) return;
            const next = { ...locSettings, enabled: !locSettings.enabled };
            setLocSettings(next); setLocationSettings(next);
          }} style={{
            width: 40, height: 22, borderRadius: 11, cursor: isGeolocationSupported() ? "pointer" : "default",
            background: locSettings.enabled ? C.accent : C.accent010, opacity: isGeolocationSupported() ? 1 : 0.4,
            position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 12,
            boxShadow: locSettings.enabled ? `0 0 8px ${C.accent020}` : "none",
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: locSettings.enabled ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Gym Detection */}
        {locSettings.enabled && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
              <div>
                <div style={{ fontSize: 13, color: C.text2 }}>Gym Arrival Detection</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Notify when you arrive at your gym</div>
              </div>
              <div onClick={() => {
                const next = { ...locSettings, gymDetection: !locSettings.gymDetection };
                setLocSettings(next); setLocationSettings(next);
              }} style={{
                width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                background: locSettings.gymDetection ? C.secondary : C.accent010,
                position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 12,
                boxShadow: locSettings.gymDetection ? `0 0 8px ${C.secondary020}` : "none",
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: locSettings.gymDetection ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>

            {/* Home gym flag */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
              <div>
                <div style={{ fontSize: 13, color: C.text2 }}>I Train at Home</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Skip geo-fence — coach adapts to home training</div>
              </div>
              <div onClick={() => {
                const next = { ...locSettings, homeGym: !locSettings.homeGym };
                setLocSettings(next); setLocationSettings(next);
              }} style={{
                width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                background: locSettings.homeGym ? C.secondary : C.accent010,
                position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 12,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: locSettings.homeGym ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>

            {/* Auto-launch workout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.structBorder}` }}>
              <div>
                <div style={{ fontSize: 13, color: C.text2 }}>Auto-Launch Workout</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Open workout screen on gym arrival</div>
              </div>
              <div onClick={() => {
                const next = { ...locSettings, autoLaunchWorkout: !locSettings.autoLaunchWorkout };
                setLocSettings(next); setLocationSettings(next);
              }} style={{
                width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                background: locSettings.autoLaunchWorkout ? C.accent : C.accent010,
                position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 12,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: C.text1, position: "absolute", top: 2, left: locSettings.autoLaunchWorkout ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>

            {/* Save / Clear Gym Location */}
            <div style={{ padding: "14px 0" }}>
              {gymLoc ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <div style={{ fontSize: 12, color: C.text2, fontWeight: 600 }}>{gymLoc.name || "Saved Gym"}</div>
                      <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 1 }}>
                        {gymLoc.lat.toFixed(4)}, {gymLoc.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { clearGymLocation(); setGymLoc(null); showToast?.("Gym location cleared"); }} style={{
                    padding: "8px 14px", background: "transparent",
                    border: `1px solid ${C.structBorderHover}`, borderRadius: 8,
                    color: C.text4, fontSize: 9, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".06em",
                  }}>CLEAR GYM LOCATION</button>
                </div>
              ) : (
                <button onClick={async () => {
                  setSavingGym(true);
                  try {
                    const pos = await saveCurrentAsGym(profile.gymName || "My Gym");
                    setGymLoc({ lat: pos.lat, lng: pos.lng, name: profile.gymName || "My Gym" });
                    showToast?.("Gym location saved");
                  } catch {
                    showToast?.("Location access denied");
                  }
                  setSavingGym(false);
                }} disabled={savingGym} style={{
                  width: "100%", padding: "12px 16px",
                  background: C.structGlass, border: `1.5px solid ${C.secondary}`,
                  borderRadius: 10, color: C.secondary, fontSize: 11, fontWeight: 700,
                  fontFamily: "var(--m)", cursor: savingGym ? "default" : "pointer",
                  letterSpacing: ".08em", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 8, minHeight: 44,
                  opacity: savingGym ? 0.6 : 1, transition: "opacity 0.2s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {savingGym ? "LOCATING..." : "SAVE CURRENT LOCATION AS GYM"}
                </button>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Notification Permission */}
      {notifPerm !== "granted" && notifPerm !== "unsupported" && (
        <button onClick={async () => {
          const result = await requestNotificationPermission();
          setNotifPerm(result);
          showToast?.(result === "granted" ? "Notifications enabled" : "Notifications blocked");
        }} style={{
          width: "100%", padding: "14px 16px", marginBottom: 16,
          background: C.accent008, border: `1.5px solid ${C.accent030}`,
          borderRadius: 10, color: C.accent, fontSize: 11, fontWeight: 700,
          fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".08em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          ENABLE PUSH NOTIFICATIONS
        </button>
      )}

      <SectionDivider C={C} />

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
