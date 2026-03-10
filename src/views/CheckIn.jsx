import { useState } from "react";
import { Card, Button, SliderInput, Label } from "../components/Primitives";
import { LineChart, MiniSparkline } from "../components/Charts";
import { getAllCheckIns } from "../utils/analytics";
import storage from "../utils/storage";

export default function CheckIn({ C, onBack }) {
  const [data, setData] = useState({ sl: 5, st: 5, en: 5, dg: 5, ad: 5, wt: "", nt: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const checkIns = getAllCheckIns();

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
          <div style={{ width: 56, height: 56, borderRadius: 16, background: C.accent010, border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>Check-In Saved</div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)", marginBottom: 32 }}>{checkIns.length + 1} total check-ins.</div>
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
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontSize: 11, fontFamily: "var(--m)", cursor: "pointer", letterSpacing: ".1em", marginBottom: 16, padding: 0, minHeight: 44 }}>← BACK</button>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>Daily Check-In</div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 20 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        {checkIns.length > 0 && ` · ${checkIns.length} logged`}
      </div>

      {checkIns.length >= 3 && (
        <Card C={C} style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[{ label: "SLEEP", data: sleepTrend }, { label: "ENERGY", data: energyTrend }].map(({ label, data: d }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 4 }}>{label} TREND</div>
                <MiniSparkline data={d} C={C} width={80} height={24} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card C={C}>
        <Label C={C} style={{ marginBottom: 8 }}>BODY WEIGHT</Label>
        <input value={data.wt} onChange={e => update("wt", e.target.value)} placeholder="Enter weight (lbs)" type="number" inputMode="decimal"
          style={{ width: "100%", padding: "14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 18, fontWeight: 600, fontFamily: "var(--m)", textAlign: "center", outline: "none" }} />
        {weightHistory.length >= 2 && <div style={{ marginTop: 12 }}><LineChart data={weightHistory.slice(-10)} C={C} height={60} /></div>}
      </Card>

      <Card C={C}>
        <SliderInput label="SLEEP QUALITY" value={data.sl} onChange={v => update("sl", v)} min={1} max={10} C={C} />
        <SliderInput label="STRESS LEVEL" value={data.st} onChange={v => update("st", v)} min={1} max={10} C={C} />
        <SliderInput label="ENERGY LEVEL" value={data.en} onChange={v => update("en", v)} min={1} max={10} C={C} />
        <SliderInput label="DIGESTION" value={data.dg} onChange={v => update("dg", v)} min={1} max={10} C={C} />
        <SliderInput label="ADHERENCE" value={data.ad} onChange={v => update("ad", v)} min={1} max={10} C={C} />
      </Card>

      <Card C={C}>
        <Label C={C} style={{ marginBottom: 8 }}>NOTES</Label>
        <textarea value={data.nt} onChange={e => update("nt", e.target.value)} placeholder="How are you feeling today?" rows={3}
          style={{ width: "100%", padding: "10px 14px", background: C.structGlass, border: `1.5px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text1, fontSize: 13, fontFamily: "var(--b)", outline: "none", resize: "none" }} />
      </Card>

      <Button C={C} onClick={() => { storage.set("ci_" + Date.now(), data); setSubmitted(true); }}>SUBMIT CHECK-IN</Button>

      {checkIns.length > 0 && (
        <>
          <button onClick={() => setShowHistory(!showHistory)} style={{ width: "100%", padding: 12, background: "none", border: `1px solid ${C.structBorderHover}`, borderRadius: 10, color: C.text3, fontSize: 10, fontFamily: "var(--m)", letterSpacing: ".1em", cursor: "pointer", marginTop: 12, minHeight: 44 }}>
            {showHistory ? "HIDE" : "SHOW"} HISTORY ({checkIns.length})
          </button>
          {showHistory && <div style={{ marginTop: 8 }}>
            {[...checkIns].reverse().slice(0, 10).map((ci, i) => (
              <Card key={i} C={C} style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>{ci.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>Sleep: {ci.sl} · Energy: {ci.en} · Stress: {ci.st}{ci.wt ? ` · ${ci.wt}lbs` : ""}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.secondary, fontFamily: "var(--m)", textShadow: `0 0 10px ${C.secondary030}` }}>{Math.round(((ci.sl + ci.en + (6 - ci.st) + ci.dg + ci.ad) / 25) * 100)}%</div>
              </Card>
            ))}
          </div>}
        </>
      )}
    </div>
  );
}
