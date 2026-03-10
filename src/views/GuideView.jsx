import { useState } from "react";
import { Card, Label } from "../components/Primitives";
import GUIDE_DATA from "../data/guide";

export default function GuideView({ C, onBack }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [openItem, setOpenItem] = useState(null);

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none",
          color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
          letterSpacing: ".06em", cursor: "pointer",
          padding: "0 0 16px", marginTop: -4,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        BACK
      </button>

      <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>
        Program Guide
      </div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 20 }}>
        Everything you need to know about the Forge system
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto" }}>
        {GUIDE_DATA.map((cat, i) => (
          <button
            key={i}
            onClick={() => {
              setCategoryIndex(i);
              setOpenItem(null);
            }}
            style={{
              padding: "6px 14px",
              background: i === categoryIndex ? `${C.accent}15` : "transparent",
              border: `1px solid ${i === categoryIndex ? C.accent : C.structBorderHover}`,
              borderRadius: 20,
              color: i === categoryIndex ? C.accent : C.text4,
              fontSize: 9,
              fontWeight: 700,
              fontFamily: "var(--m)",
              letterSpacing: ".1em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Items */}
      {GUIDE_DATA[categoryIndex].items.map((item, i) => (
        <Card
          key={i}
          C={C}
          onClick={() => setOpenItem(openItem === i ? null : i)}
          style={{ cursor: "pointer" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>
              {item.title}
            </div>
            <div
              style={{
                color: C.text4,
                fontSize: 14,
                transform: openItem === i ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            >
              ▾
            </div>
          </div>
          {openItem === i && (
            <div
              style={{
                fontSize: 12,
                color: C.text3,
                lineHeight: 1.8,
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${C.structBorder}`,
                fontFamily: "var(--m)",
              }}
            >
              {item.desc}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
