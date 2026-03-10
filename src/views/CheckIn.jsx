import { useState, useRef, useEffect } from "react";
import { Card, Button, SliderInput, Label, SectionDivider } from "../components/Primitives";
import { LineChart, MiniSparkline } from "../components/Charts";
import { getAllCheckIns } from "../utils/analytics";
import storage from "../utils/storage";

export default function CheckIn({ C, onBack }) {
  const [data, setData] = useState({ sl: 5, st: 5, en: 5, dg: 5, ad: 5, wt: "", nt: "", photo: null, photoDate: new Date().toISOString().split("T")[0], isCompetitor: false });
  const [submitted, setSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const checkIns = getAllCheckIns();
  const formRef = useRef();
  const fileRef = useRef();

  // Auto-scroll to form on mount
  useEffect(() => {
    if (formRef.current) {
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
      // Store photo separately to avoid bloating check-in data
      const photoKey = "cip_" + Date.now();
      storage.set(photoKey, { photo: entry.photo, date: entry.photoDate });
      entry.hasPhoto = true;
      entry.photoKey = photoKey;
      delete entry.photo;
    }
    storage.set("ci_" + Date.now(), entry);
    setSubmitted(true);
  };

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
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 20 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        {checkIns.length > 0 && ` · ${checkIns.length} logged`}
      </div>

      {/* ─── TREND SPARKLINES ─── */}
      {checkIns.length >= 3 && (
        <Card C={C} style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              { label: "SLEEP", data: sleepTrend, color: C.accent },
              { label: "ENERGY", data: energyTrend, color: C.secondary },
            ].map(({ label, data: d, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 7, color, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 6 }}>{label} TREND</div>
                <MiniSparkline data={d} C={C} width={80} height={24} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── PHOTO UPLOAD ─── */}
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
            {/* Date picker for photo */}
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

      {/* ─── BODY WEIGHT ─── */}
      <Card C={C} style={{ padding: 16 }}>
        <Label C={C} style={{ marginBottom: 8 }}>BODY WEIGHT</Label>
        <input value={data.wt} onChange={e => update("wt", e.target.value)} placeholder="Enter weight (lbs)" type="number" inputMode="decimal"
          style={{ width: "100%", padding: "14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 18, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
        {weightHistory.length >= 2 && <div style={{ marginTop: 12 }}><LineChart data={weightHistory.slice(-10)} C={C} height={60} /></div>}
      </Card>

      {/* ─── SLIDERS ─── */}
      <Card C={C} style={{ padding: 16 }}>
        <SliderInput label="SLEEP QUALITY" value={data.sl} onChange={v => update("sl", v)} min={1} max={10} C={C} />
        <SliderInput label="STRESS LEVEL" value={data.st} onChange={v => update("st", v)} min={1} max={10} C={C} />
        <SliderInput label="ENERGY LEVEL" value={data.en} onChange={v => update("en", v)} min={1} max={10} C={C} />
        <SliderInput label="DIGESTION" value={data.dg} onChange={v => update("dg", v)} min={1} max={10} C={C} />
        <SliderInput label="ADHERENCE" value={data.ad} onChange={v => update("ad", v)} min={1} max={10} C={C} />
      </Card>

      {/* ─── COMPETITOR PREP ─── */}
      <Card C={C} style={{ padding: 16 }}>
        <div onClick={() => update("isCompetitor", !data.isCompetitor)} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>Competitor Mode</div>
            <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2, letterSpacing: ".04em" }}>
              Track posing, conditioning, peak week metrics
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
            <SliderInput label="CONDITIONING" value={data.cond || 5} onChange={v => update("cond", v)} min={1} max={10} C={C} />
            <SliderInput label="POSING PRACTICE" value={data.posing || 5} onChange={v => update("posing", v)} min={1} max={10} C={C} />
            <SliderInput label="WATER LOAD" value={data.waterLoad || 5} onChange={v => update("waterLoad", v)} min={1} max={10} C={C} />
          </div>
        )}
      </Card>

      {/* ─── NOTES ─── */}
      <Card C={C} style={{ padding: 16 }}>
        <Label C={C} style={{ marginBottom: 8 }}>NOTES</Label>
        <textarea value={data.nt} onChange={e => update("nt", e.target.value)} placeholder="How are you feeling today?" rows={3}
          style={{ width: "100%", padding: "10px 14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 13, fontFamily: "var(--b)", outline: "none", resize: "none" }} />
      </Card>

      <Button C={C} onClick={handleSubmit}>SUBMIT CHECK-IN</Button>

      {/* ─── HISTORY ─── */}
      {checkIns.length > 0 && (
        <>
          <button onClick={() => setShowHistory(!showHistory)} style={{
            width: "100%", padding: 12, background: "none",
            border: `1px solid ${C.structBorderHover}`, borderRadius: 10,
            color: C.text3, fontSize: 10, fontFamily: "var(--m)", letterSpacing: ".1em",
            cursor: "pointer", marginTop: 12, minHeight: 44,
          }}>
            {showHistory ? "HIDE" : "SHOW"} HISTORY ({checkIns.length})
          </button>
          {showHistory && <div style={{ marginTop: 8 }}>
            {[...checkIns].reverse().slice(0, 10).map((ci, i) => (
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
          </div>}
        </>
      )}
    </div>
  );
}
