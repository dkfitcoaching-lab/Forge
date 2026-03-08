import { useState } from "react";
import { Card, Button, Label, RatingInput } from "../components/Primitives";
import storage from "../utils/storage";

export default function CheckIn({ C, onBack }) {
  const [data, setData] = useState({ sl: 0, st: 0, en: 0, dg: 0, ad: 0, wt: "", nt: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  if (submitted) {
    return (
      <div>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            fontSize: 12,
            fontFamily: "var(--m)",
            cursor: "pointer",
            letterSpacing: ".1em",
            marginBottom: 16,
            padding: 0,
          }}
        >
          ← BACK
        </button>
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 8 }}>
            Check-In Saved
          </div>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)" }}>
            Your data has been logged. Consistency is key.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: C.accent,
          fontSize: 12,
          fontFamily: "var(--m)",
          cursor: "pointer",
          letterSpacing: ".1em",
          marginBottom: 16,
          padding: 0,
        }}
      >
        ← BACK
      </button>

      <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>
        Daily Check-In
      </div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 20 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </div>

      <Card C={C}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 8 }}>
          Weight
        </div>
        <input
          value={data.wt}
          onChange={(e) => update("wt", e.target.value)}
          placeholder="lbs"
          type="number"
          style={{
            width: "100%",
            padding: "12px 14px",
            background: `${C.accent}06`,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            color: C.text1,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "var(--m)",
            textAlign: "center",
            outline: "none",
          }}
        />
      </Card>

      <Card C={C}>
        <RatingInput label="SLEEP" value={data.sl} onChange={(v) => update("sl", v)} C={C} />
        <RatingInput label="STRESS" value={data.st} onChange={(v) => update("st", v)} C={C} />
        <RatingInput label="ENERGY" value={data.en} onChange={(v) => update("en", v)} C={C} />
        <RatingInput label="DIGESTION" value={data.dg} onChange={(v) => update("dg", v)} C={C} />
        <RatingInput label="ADHERENCE" value={data.ad} onChange={(v) => update("ad", v)} C={C} />
      </Card>

      <Card C={C}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 8 }}>
          Notes
        </div>
        <textarea
          value={data.nt}
          onChange={(e) => update("nt", e.target.value)}
          placeholder="How are you feeling today?"
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: `${C.accent}06`,
            border: `1px solid ${C.border2}`,
            borderRadius: 10,
            color: C.text1,
            fontSize: 13,
            fontFamily: "var(--b)",
            outline: "none",
            resize: "none",
          }}
        />
      </Card>

      <Button
        C={C}
        onClick={() => {
          storage.set("ci_" + Date.now(), data);
          setSubmitted(true);
        }}
      >
        SUBMIT
      </Button>
    </div>
  );
}
