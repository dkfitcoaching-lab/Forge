import { useState, useEffect, useCallback } from "react";
import { getThemeColors, ACCENTS, SURFACES } from "./data/themes";
import { makeStyles } from "./utils/css";
import { NavIcons, Toast, ForgeLogo } from "./components/Primitives";
import storage from "./utils/storage";

import WorkoutPlayer from "./components/WorkoutPlayer";
import CoachPanel from "./components/CoachPanel";
import ProgressPhotos from "./components/ProgressPhotos";
import TodayView from "./views/TodayView";
import DataView from "./views/DataView";
import GuideView from "./views/GuideView";
import ProgramView from "./views/ProgramView";
import VolumeLog from "./views/VolumeLog";
import CheckIn from "./views/CheckIn";
import SettingsView from "./views/SettingsView";
import LoginScreen from "./views/LoginScreen";
import OnboardingScreen from "./views/OnboardingScreen";

export default function App() {
  const [accentId, setAccentId] = useState(() => storage.get("accent", "platinum"));
  const [surfaceId, setSurfaceId] = useState(() => storage.get("surface", "void"));
  const C = getThemeColors(accentId, surfaceId);
  const css = makeStyles(C);

  const [screen, setScreen] = useState(() =>
    storage.get("lg", false) ? (storage.get("ob", false) ? "app" : "ob") : "lg"
  );

  const [tab, setTab] = useState("today");
  const [view, setView] = useState("main");
  const [workoutDay, setWorkoutDay] = useState(null);
  const [toast, setToast] = useState(null);
  const [splashDone, setSplashDone] = useState(() => !!sessionStorage.getItem("forge_splash"));

  // Toast system
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Splash screen
  useEffect(() => {
    if (!splashDone && screen === "lg") {
      const timer = setTimeout(() => {
        setSplashDone(true);
        sessionStorage.setItem("forge_splash", "1");
      }, 2400);
      return () => clearTimeout(timer);
    }
    if (!splashDone) setSplashDone(true);
  }, []);

  const changeAccent = (id) => { setAccentId(id); storage.set("accent", id); };
  const changeSurface = (id) => { setSurfaceId(id); storage.set("surface", id); };

  const startWorkout = (day) => { setWorkoutDay(day); setView("wp"); };
  const exitWorkout = () => { setWorkoutDay(null); setView("main"); setTab("today"); };
  const goMain = () => setView("main");

  const icons = NavIcons();

  // ─── SPLASH SCREEN ──────────────────────────────────────────
  if (!splashDone && screen === "lg") {
    return (
      <>
        <div style={{
          minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
        }}>
          {/* Atmospheric orbs */}
          <div style={{
            position: "absolute", top: "30%", left: "50%",
            width: 600, height: 600, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`,
            animation: "orbFloat 6s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "60%", left: "40%",
            width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 70%)`,
            animation: "orbFloat2 8s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          {/* Logo */}
          <div style={{ animation: "logoGlowRise 1.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <ForgeLogo C={C} size="lg" />
          </div>
          <div style={{
            height: 1, background: C.dividerGrad,
            animation: "lineGrow 0.8s ease 1s both", marginTop: 20,
          }} />
          <div style={{
            fontSize: 8, color: C.text4, fontFamily: "var(--m)",
            letterSpacing: ".3em", marginTop: 16,
            animation: "badgeFade 0.6s ease 1.4s both",
          }}>
            BUILT FOR PERFORMANCE
          </div>
        </div>
        <style>{css}</style>
      </>
    );
  }

  // ─── LOGIN ──────────────────────────────────────────────────
  if (screen === "lg") {
    return (
      <>
        <LoginScreen C={C} onLogin={() => setScreen("ob")} />
        <style>{css}</style>
      </>
    );
  }

  // ─── ONBOARDING ─────────────────────────────────────────────
  if (screen === "ob") {
    return (
      <>
        <OnboardingScreen C={C} onComplete={() => setScreen("app")} />
        <style>{css}</style>
      </>
    );
  }

  // ─── WORKOUT PLAYER (full screen takeover) ──────────────────
  if (view === "wp" && workoutDay) {
    return (
      <>
        <WorkoutPlayer day={workoutDay} onExit={exitWorkout} C={C} showToast={showToast} />
        <style>{css}</style>
      </>
    );
  }

  // ─── TAB CONTENT ────────────────────────────────────────────
  const content = () => {
    // Sub-views (overlays that go back to main)
    if (view === "gd") return <GuideView C={C} onBack={goMain} />;
    if (view === "vl") return <VolumeLog C={C} onBack={goMain} />;
    if (view === "ci") return <CheckIn C={C} onBack={goMain} />;
    if (view === "pp") return <ProgressPhotos C={C} onBack={goMain} />;
    if (view === "settings") return (
      <SettingsView
        C={C}
        accentId={accentId} surfaceId={surfaceId}
        changeAccent={changeAccent} changeSurface={changeSurface}
        showToast={showToast}
        onBack={goMain}
      />
    );

    switch (tab) {
      case "today": return <TodayView C={C} onWork={startWorkout} onNav={setView} showToast={showToast} />;
      case "program": return <ProgramView C={C} onWork={startWorkout} onNav={setView} />;
      case "coach": return <CoachPanel C={C} />;
      case "data": return <DataView C={C} onNav={setView} />;
      default: return <TodayView C={C} onWork={startWorkout} onNav={setView} showToast={showToast} />;
    }
  };

  // 4 tabs only
  const tabs = [
    { k: "today", l: "Today" },
    { k: "program", l: "Program" },
    { k: "coach", l: "Coach" },
    { k: "data", l: "Data" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1 }}>
      {/* ─── ATMOSPHERIC BACKGROUND ─── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "120%", height: "60%",
          background: C.atmosphereGrad,
        }} />
        <div style={{
          position: "absolute", top: "15%", left: "50%",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
          animation: "orbFloat 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "60%", left: "30%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
          animation: "orbFloat2 10s ease-in-out infinite",
        }} />
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* ─── HEADER ─── */}
        <div
          className="forge-header"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px 12px",
            borderBottom: `1px solid ${C.structBorder}`,
            position: "sticky", top: 0,
            background: C.headerBg,
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ForgeLogo C={C} size="sm" />
            <div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: C.text1,
                fontFamily: "var(--d)", letterSpacing: ".08em",
              }}>
                FORGE
              </div>
              <div style={{
                fontSize: 7, color: C.text4, fontFamily: "var(--m)",
                letterSpacing: ".2em",
              }}>
                PERFORMANCE SYSTEM
              </div>
            </div>
          </div>
          {/* Settings gear icon */}
          <button
            onClick={() => setView(view === "settings" ? "main" : "settings")}
            style={{
              background: view === "settings" ? C.accent008 : "transparent",
              border: view === "settings" ? `1px solid ${C.accent020}` : `1px solid transparent`,
              borderRadius: 10,
              color: view === "settings" ? C.accent : C.text4,
              cursor: "pointer",
              padding: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              width: 40, height: 40,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div
          className="forge-content"
          key={tab + view}
          style={{
            padding: "20px 16px 110px",
            animation: "fi .3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          {content()}
        </div>

        {/* ─── TOAST ─── */}
        {toast && <Toast message={toast} C={C} />}

        {/* ─── BOTTOM NAVIGATION — 4 TABS ─── */}
        <div
          className="forge-nav"
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 640,
            background: C.navBg,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderTop: `1px solid ${C.structBorder}`,
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
            zIndex: 30,
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.k && view === "main";
            return (
              <div
                key={t.k}
                onClick={() => { setTab(t.k); setView("main"); }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "6px 12px",
                  cursor: "pointer",
                  color: active ? C.accent : C.text4,
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "var(--m)",
                  letterSpacing: ".04em",
                  position: "relative",
                  userSelect: "none",
                  transition: "color 0.2s",
                  minWidth: 52,
                  minHeight: 44,
                  justifyContent: "center",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                    width: 28, height: 2, borderRadius: 1,
                    background: C.accent,
                    boxShadow: `0 0 12px ${C.glow}`,
                  }} />
                )}
                <div style={{
                  animation: active ? "iconGlow 4s ease-in-out infinite" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icons[t.k]}
                </div>
                <span style={{ marginTop: 1 }}>{t.l}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}
