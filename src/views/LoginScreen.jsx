import { useState } from "react";
import { Button } from "../components/Primitives";
import storage from "../utils/storage";

export default function LoginScreen({ C, onLogin }) {
  const [step, setStep] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "var(--b)",
        color: C.text1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: C.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 32,
            fontWeight: 800,
            color: C.bg,
            fontFamily: "var(--d)",
            animation: "glow 3s ease infinite",
          }}
        >
          F
        </div>

        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            fontFamily: "var(--d)",
            letterSpacing: ".08em",
            marginBottom: 8,
            background: C.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          FORGE
        </div>

        <div
          style={{
            fontSize: 10,
            color: C.text4,
            fontFamily: "var(--m)",
            letterSpacing: ".3em",
            marginBottom: 48,
          }}
        >
          V5 CINEMA
        </div>

        <div
          style={{
            fontSize: 14,
            color: C.text3,
            lineHeight: 1.8,
            maxWidth: 280,
            margin: "0 auto 40px",
            fontFamily: "var(--m)",
          }}
        >
          The interface that shouldn&apos;t be possible. Your complete fitness command center.
        </div>

        <Button
          C={C}
          onClick={() => {
            storage.set("lg", true);
            onLogin();
          }}
          style={{ maxWidth: 280, margin: "0 auto" }}
        >
          ENTER FORGE
        </Button>

        <div
          style={{
            fontSize: 8,
            color: C.text5,
            fontFamily: "var(--m)",
            letterSpacing: ".16em",
            marginTop: 48,
          }}
        >
          BUILT FOR PERFORMANCE
        </div>
      </div>
    </div>
  );
}
