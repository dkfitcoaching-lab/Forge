import { useState, useRef, useEffect } from "react";
import { Card, Button, SliderInput, Label, SectionDivider } from "../components/Primitives";
import { LineChart, MiniSparkline } from "../components/Charts";
import { getAllCheckIns } from "../utils/analytics";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// CHECK-IN — Body tracking hub: Log / Photos / History
// ══════════════════════════════════════════════════════════════

export default function CheckIn({ C, onBack, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "log");
  const [data, setData] = useState({ sl: 5, st: 5, en: 5, dg: 5, ad: 5, wt: "", nt: "", photo: null, photoDate: new Date().toISOString().split("T")[0], isCompetitor: false, bf: "", waist: "", chest: "", bicL: "", bicR: "", thL: "", thR: "" });
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const checkIns = getAllCheckIns();
  const formRef = useRef();
  const fileRef = useRef();

  // Photo gallery state
  const [photos, setPhotos] = useState(() => storage.get("photos", []));
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const galleryFileRef = useRef();

  useEffect(() => {
    if (formRef.current && activeTab === "log") {
      setTimeout(() => formRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, []);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update("photo", ev.target.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => update("photo", null);

  const handleSubmit = () => {
    const entry = { ...data };
    if (entry.photo) {
      const photoKey = "cip_" + Date.now();
      storage.set(photoKey, { photo: entry.photo, date: entry.photoDate });
      entry.hasPhoto = true;
      entry.photoKey = photoKey;
      // Also add to gallery automatically
      const galleryPhoto = {
        id: Date.now(),
        data: data.photo,
        date: new Date().toISOString(),
        label: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const updatedPhotos = [...photos, galleryPhoto];
      setPhotos(updatedPhotos);
      try { storage.set("photos", updatedPhotos); } catch { /* quota */ }
      delete entry.photo;
    }
    storage.set("ci_" + Date.now(), entry);
    setSubmitted(true);
  };

  // Gallery functions
  const addGalleryPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newPhoto = {
        id: Date.now(),
        data: ev.target.result,
        date: new Date().toISOString(),
        label: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      try { storage.set("photos", updated); } catch { /* Storage quota may be exceeded for large photos */ }
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    storage.set("photos", updated);
    setSelected(selected.filter((s) => s !== id));
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const comparePhotos = selected.length === 2
    ? [photos.find((p) => p.id === selected[0]), photos.find((p) => p.id === selected[1])]
    : [];

  if (submitted) {
    return (
      <div>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
          letterSpacing: ".06em", cursor: "pointer", padding: "0 0 16px", marginTop: -4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          BACK
        </button>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, background: C.secondary010,
            border: `1.5px solid ${C.secondary}`, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: `0 0 24px ${C.secondary020}`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>Check-In Saved</div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginBottom: 32 }}>
            {checkIns.length + 1} total check-ins logged.
          </div>
          <Button C={C} onClick={onBack} style={{ maxWidth: 240, margin: "0 auto" }}>BACK TO HOME</Button>
        </div>
      </div>
    );
  }

  const weightHistory = checkIns.filter(ci => ci.wt && Number(ci.wt) > 0).map(ci => ({ value: Number(ci.wt), label: ci.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) }));
  const sleepTrend = checkIns.slice(-10).map(ci => ci.sl || 0);
  const energyTrend = checkIns.slice(-10).map(ci => ci.en || 0);

  const tabs = [
    { k: "log", l: "LOG", icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    )},
    { k: "photos", l: "PHOTOS", count: photos.length, icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
      </svg>
    )},
    { k: "history", l: "HISTORY", count: checkIns.length, icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    )},
  ];

  return (
    <div>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
        letterSpacing: ".06em", cursor: "pointer", padding: "0 0 16px", marginTop: -4,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        BACK
      </button>

      <div style={{ fontSize: 24, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Daily Check-In</div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 16 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        {checkIns.length > 0 && ` · ${checkIns.length} logged`}
      </div>

      {/* ─── TAB BAR ─── */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20,
        background: C.structGlass, borderRadius: 12, padding: 4,
        border: `1px solid ${C.structBorder}`,
      }}>
        {tabs.map(t => {
          const active = activeTab === t.k;
          return (
            <button key={t.k} onClick={() => { setActiveTab(t.k); setCompareMode(false); setSelected([]); }} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10,
              background: active ? C.cardGradient : "transparent",
              color: active ? C.accent : C.text4,
              fontSize: 9, fontWeight: 700, fontFamily: "var(--m)",
              letterSpacing: ".1em", cursor: "pointer",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              boxShadow: active ? C.cardShadow : "none",
              border: active ? `1px solid ${C.accent020}` : `1px solid transparent`,
            }}>
              {t.icon}
              {t.l}
              {t.count > 0 && (
                <span style={{
                  fontSize: 8, background: active ? C.accent015 : C.structBorderHover,
                  color: active ? C.accent : C.text4,
                  padding: "1px 5px", borderRadius: 6, fontWeight: 600,
                }}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* LOG TAB                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === "log" && (
        <>
          {/* Photo Upload */}
          <Label C={C}>Progress Photo</Label>
          <Card C={C} style={{ padding: 16, marginBottom: 6 }}>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto}
              style={{ display: "none" }} />

            {data.photo ? (
              <div>
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                  <img src={data.photo} alt="Check-in" style={{ width: "100%", borderRadius: 10, display: "block" }} />
                  <button onClick={removePhoto} style={{
                    position: "absolute", top: 8, right: 8,
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(0,0,0,0.6)", border: "none",
                    color: "#fff", fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(8px)",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>DATE:</div>
                  <input type="date" value={data.photoDate}
                    onChange={e => update("photoDate", e.target.value)}
                    style={{
                      flex: 1, padding: "8px 12px", background: C.structGlass,
                      border: `1px solid ${C.structBorderHover}`, borderRadius: 8,
                      color: C.text1, fontSize: 12, fontFamily: "var(--m)", outline: "none",
                    }} />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => fileRef.current?.click()} style={{
                  flex: 1, padding: "18px 12px", background: C.structGlass,
                  border: `1.5px dashed ${C.structBorderHover}`, borderRadius: 10,
                  color: C.text3, fontSize: 10, fontFamily: "var(--m)", cursor: "pointer",
                  letterSpacing: ".08em", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8, minHeight: 80,
                  transition: "all 0.2s",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                  </svg>
                  TAKE PHOTO
                </button>
                <button onClick={() => { fileRef.current?.removeAttribute("capture"); fileRef.current?.click(); }} style={{
                  flex: 1, padding: "18px 12px", background: C.structGlass,
                  border: `1.5px dashed ${C.structBorderHover}`, borderRadius: 10,
                  color: C.text3, fontSize: 10, fontFamily: "var(--m)", cursor: "pointer",
                  letterSpacing: ".08em", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8, minHeight: 80,
                  transition: "all 0.2s",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  FROM GALLERY
                </button>
              </div>
            )}
          </Card>

          <div ref={formRef} />

          <SectionDivider C={C} />

          {/* Body Weight */}
          <Card C={C} style={{ padding: 16 }}>
            <Label C={C} style={{ marginBottom: 8 }}>BODY WEIGHT</Label>
            <input value={data.wt} onChange={e => { const v = e.target.value; if (v === '' || (Number(v) >= 0 && Number(v) <= 500)) update("wt", v); }} placeholder="Enter weight (lbs)" type="number" inputMode="decimal" min="50" max="500" step="0.1"
              style={{ width: "100%", padding: "14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 18, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
            {weightHistory.length >= 2 && <div style={{ marginTop: 12 }}><LineChart data={weightHistory.slice(-10)} C={C} height={60} /></div>}
          </Card>

          {/* Body Measurements */}
          <Card C={C} style={{ padding: 16 }}>
            <div onClick={() => setShowMeasurements(!showMeasurements)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>Body Measurements</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2, letterSpacing: ".04em" }}>
                  Body fat %, waist, chest, biceps, thighs
                </div>
              </div>
              <div style={{ color: C.text4, fontSize: 12, transform: showMeasurements ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>

            {showMeasurements && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.structBorder}`, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { k: "bf", l: "BODY FAT %", ph: "e.g. 12.5", u: "%" },
                  { k: "waist", l: "WAIST", ph: "inches", u: "in" },
                  { k: "chest", l: "CHEST", ph: "inches", u: "in" },
                ].map(({ k, l, ph, u }) => (
                  <div key={k}>
                    <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>{l}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input value={data[k]} onChange={e => update(k, e.target.value)} placeholder={ph} type="number" inputMode="decimal"
                        style={{ flex: 1, padding: "10px 12px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 14, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
                      <span style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", minWidth: 16 }}>{u}</span>
                    </div>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { k: "bicL", l: "BICEP (L)" },
                    { k: "bicR", l: "BICEP (R)" },
                    { k: "thL", l: "THIGH (L)" },
                    { k: "thR", l: "THIGH (R)" },
                  ].map(({ k, l }) => (
                    <div key={k}>
                      <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>{l}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input value={data[k]} onChange={e => update(k, e.target.value)} placeholder="in" type="number" inputMode="decimal"
                          style={{ flex: 1, padding: "10px 12px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 8, color: C.text1, fontSize: 14, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
                        <span style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)" }}>in</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Recovery & Wellness */}
          <Label C={C}>RECOVERY</Label>
          <Card C={C} style={{ padding: 16 }}>
            <SliderInput label="SLEEP QUALITY" value={data.sl} onChange={v => update("sl", v)} min={1} max={10} C={C}
              icon="🌙" lowLabel="Terrible" highLabel="Best ever" desc="How restful was last night's sleep?" />
            <SliderInput label="ENERGY LEVEL" value={data.en} onChange={v => update("en", v)} min={1} max={10} C={C}
              icon="⚡" lowLabel="Exhausted" highLabel="Unstoppable" desc="How energized do you feel right now?" />
            <SliderInput label="STRESS LEVEL" value={data.st} onChange={v => update("st", v)} min={1} max={10} C={C}
              icon="🧠" lowLabel="Calm" highLabel="Overwhelmed" desc="Lower is better — 1 means zen, 10 means maxed out" />
          </Card>

          <Label C={C}>NUTRITION & COMPLIANCE</Label>
          <Card C={C} style={{ padding: 16 }}>
            <SliderInput label="DIGESTION" value={data.dg} onChange={v => update("dg", v)} min={1} max={10} C={C}
              icon="🍽️" lowLabel="Poor" highLabel="Perfect" desc="Bloating, discomfort, regularity" />
            <SliderInput label="ADHERENCE" value={data.ad} onChange={v => update("ad", v)} min={1} max={10} C={C}
              icon="🎯" lowLabel="Off plan" highLabel="Nailed it" desc="How closely did you follow your nutrition & training plan?" />
          </Card>

          {/* Competitor Prep — hidden behind toggle */}
          <Card C={C} style={{ padding: 16 }}>
            <div onClick={() => update("isCompetitor", !data.isCompetitor)} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>Competitor Mode</div>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2, letterSpacing: ".04em" }}>
                  For athletes in contest prep — posing, conditioning, peak week
                </div>
              </div>
              <div style={{
                width: 40, height: 22, borderRadius: 11,
                background: data.isCompetitor ? C.accent : C.accent010,
                position: "relative", transition: "background 0.2s",
                boxShadow: data.isCompetitor ? `0 0 8px ${C.accent020}` : "none",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9, background: C.text1,
                  position: "absolute", top: 2, left: data.isCompetitor ? 20 : 2,
                  transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </div>
            </div>

            {data.isCompetitor && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.structBorder}` }}>
                <SliderInput label="CONDITIONING" value={data.cond || 5} onChange={v => update("cond", v)} min={1} max={10} C={C}
                  lowLabel="Soft" highLabel="Shredded" desc="Visible striations, vascularity, dryness" />
                <SliderInput label="POSING PRACTICE" value={data.posing || 5} onChange={v => update("posing", v)} min={1} max={10} C={C}
                  lowLabel="Skipped" highLabel="Full session" desc="Mandatories + transitions practiced today" />
                <SliderInput label="WATER LOAD" value={data.waterLoad || 5} onChange={v => update("waterLoad", v)} min={1} max={10} C={C}
                  lowLabel="Depleted" highLabel="Full load" desc="Hydration manipulation for peak week" />
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card C={C} style={{ padding: 16 }}>
            <Label C={C} style={{ marginBottom: 8 }}>NOTES</Label>
            <textarea value={data.nt} onChange={e => update("nt", e.target.value)} placeholder="How are you feeling today?" rows={3}
              style={{ width: "100%", padding: "10px 14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 13, fontFamily: "var(--b)", outline: "none", resize: "none" }} />
          </Card>

          <Button C={C} onClick={handleSubmit}>SUBMIT CHECK-IN</Button>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PHOTOS TAB                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === "photos" && (
        <>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 16 }}>
            Visual tracking — the most honest metric
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <Button C={C} onClick={() => galleryFileRef.current?.click()} style={{ flex: 1 }}>
              ADD PHOTO
            </Button>
            <input ref={galleryFileRef} type="file" accept="image/*" capture="environment" onChange={addGalleryPhoto} style={{ display: "none" }} />
            {photos.length >= 2 && (
              <button onClick={() => { setCompareMode(!compareMode); setSelected([]); }} style={{
                flex: 1, padding: 14,
                background: compareMode ? `${C.accent}15` : "transparent",
                border: `1px solid ${compareMode ? C.accent : C.structBorderHover}`,
                borderRadius: 12,
                color: compareMode ? C.accent : C.text3,
                fontSize: 12, fontWeight: 600, fontFamily: "var(--m)",
                letterSpacing: ".1em", cursor: "pointer",
              }}>
                COMPARE
              </button>
            )}
          </div>

          {/* Compare View */}
          {compareMode && selected.length === 2 && comparePhotos.length === 2 && (
            <Card C={C} style={{ marginBottom: 16, padding: 12 }}>
              <Label C={C}>Side by Side</Label>
              <div style={{ display: "flex", gap: 4 }}>
                {comparePhotos.map((photo) => (
                  <div key={photo.id} style={{ flex: 1 }}>
                    <img src={photo.data} alt={photo.label} style={{
                      width: "100%", aspectRatio: "3/4", objectFit: "cover",
                      borderRadius: 8, border: `1px solid ${C.structBorderHover}`,
                    }} />
                    <div style={{ fontSize: 9, color: C.text3, fontFamily: "var(--m)", textAlign: "center", marginTop: 4 }}>
                      {photo.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {compareMode && selected.length < 2 && (
            <Card C={C} style={{ textAlign: "center", padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)" }}>
                Select {2 - selected.length} photo{selected.length === 0 ? "s" : ""} to compare
              </div>
            </Card>
          )}

          {/* Photo Grid */}
          {photos.length === 0 ? (
            <Card C={C} style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, margin: "0 auto 14px",
                background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div style={{ fontSize: 14, color: C.text3, marginBottom: 4 }}>No photos yet</div>
              <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
                Take your first progress photo to start tracking visually
              </div>
            </Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
              {[...photos].reverse().map((photo) => {
                const isSelected = selected.includes(photo.id);
                return (
                  <div key={photo.id}
                    onClick={() => compareMode ? toggleSelect(photo.id) : null}
                    style={{
                      position: "relative",
                      cursor: compareMode ? "pointer" : "default",
                      borderRadius: 8, overflow: "hidden",
                      border: isSelected ? `2px solid ${C.accent}` : `1px solid ${C.structBorder}`,
                      transition: "border 0.2s",
                    }}>
                    <img src={photo.data} alt={photo.label} style={{
                      width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block",
                    }} />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "16px 6px 4px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    }}>
                      <div style={{ fontSize: 8, color: "#fff", fontFamily: "var(--m)" }}>{photo.label}</div>
                    </div>
                    {isSelected && (
                      <div style={{
                        position: "absolute", top: 4, right: 4,
                        width: 20, height: 20, borderRadius: 10,
                        background: C.accent,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: C.bg, fontWeight: 700,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                    {!compareMode && (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this photo?")) deletePhoto(photo.id);
                      }} style={{
                        position: "absolute", top: 4, right: 4,
                        width: 20, height: 20, borderRadius: 10,
                        background: "rgba(0,0,0,0.6)", border: "none",
                        color: "#fff", fontSize: 12, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HISTORY TAB                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <>
          {checkIns.length === 0 ? (
            <Card C={C} style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, margin: "0 auto 14px",
                background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div style={{ fontSize: 14, color: C.text3, marginBottom: 4 }}>No check-ins yet</div>
              <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
                Submit your first check-in to start tracking trends
              </div>
            </Card>
          ) : (
            <>
              {/* Trend overview */}
              {checkIns.length >= 3 && (
                <Card C={C} style={{ padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {[
                      { label: "SLEEP", data: sleepTrend, color: C.accent },
                      { label: "ENERGY", data: energyTrend, color: C.secondary },
                    ].map(({ label, data: d, color }) => (
                      <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 8, color, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 6 }}>{label} TREND</div>
                        <MiniSparkline data={d} C={C} width={80} height={24} />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Weight chart */}
              {weightHistory.length >= 2 && (
                <Card C={C} style={{ padding: 16, marginBottom: 12 }}>
                  <Label C={C} style={{ marginBottom: 8 }}>WEIGHT TREND</Label>
                  <LineChart data={weightHistory.slice(-14)} C={C} height={80} unit=" lbs" />
                </Card>
              )}

              {/* Entries */}
              <Label C={C}>All Entries ({checkIns.length})</Label>
              {[...checkIns].reverse().map((ci, i) => (
                <Card key={i} C={C} style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                  {ci.hasPhoto && (
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: C.secondary010, border: `1px solid ${C.secondary}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>{ci.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Sleep: {ci.sl} · Energy: {ci.en} · Stress: {ci.st}{ci.wt ? ` · ${ci.wt}lbs` : ""}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", textShadow: `0 0 10px ${C.secondary030}` }}>
                    {Math.round(((ci.sl + ci.en + (10 - ci.st) + ci.dg + ci.ad) / 50) * 100)}%
                  </div>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
