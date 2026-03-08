import { useState } from "react";
import { Card, Label } from "../components/Primitives";
import DAYS from "../data/workouts";

export default function DataView({ C, onNav }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", marginBottom: 4 }}>
        Data
      </div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 24 }}>
        Track your progress and performance
      </div>

      {/* Stats Overview */}
      <Label C={C}>Overview</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { v: "14", l: "DAY CYCLE" },
          { v: "6", l: "TRAIN DAYS" },
          { v: "2", l: "REST DAYS" },
        ].map(({ v, l }) => (
          <Card key={l} C={C} style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>
              {v}
            </div>
            <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 4 }}>
              {l}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <Label C={C}>Tools</Label>
      {[
        { l: "Program Guide", d: "Full breakdown of the Forge system", v: "gd", icon: "📖" },
        { l: "Volume Log", d: "Track training volume over time", v: "vl", icon: "📊" },
        { l: "Daily Check-In", d: "Log sleep, stress, energy, and weight", v: "ci", icon: "📋" },
      ].map(({ l, d, v, icon }) => (
        <Card
          key={v}
          C={C}
          onClick={() => onNav(v)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: 16 }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${C.accent}10`,
              border: `1px solid ${C.border2}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{l}</div>
            <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>{d}</div>
          </div>
          <div style={{ marginLeft: "auto", color: C.text4, fontSize: 16 }}>›</div>
        </Card>
      ))}

      {/* Cycle Calendar */}
      <Label C={C} style={{ marginTop: 8 }}>14-Day Cycle</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {DAYS.map((day) => (
          <Card
            key={day.d}
            C={C}
            style={{
              textAlign: "center",
              padding: "10px 4px",
              borderLeft: day.rest ? `2px solid ${C.text4}` : `2px solid ${C.accent}`,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>
              {day.d}
            </div>
            <div style={{ fontSize: 6, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em", marginTop: 2 }}>
              {day.rest ? "REST" : day.t.split(" ")[0]}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
