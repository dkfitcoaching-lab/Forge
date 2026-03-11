import { useState, useEffect, useCallback, useRef } from "react";
import { getThemeColors, ACCENTS, SURFACES } from "./data/themes";
import { makeStyles } from "./utils/css";
import { NavIcons, Toast, ForgeLogo, ForgeTitle } from "./components/Primitives";
import storage from "./utils/storage";
import { startGymWatch, stopGymWatch, getLocationSettings, getGymArrivalMessage, sendNotification } from "./utils/notifications";
import DAYS from "./data/workouts";

import WorkoutPlayer from "./components/WorkoutPlayer";
import CoachPanel, { CoachFAB } from "./components/CoachPanel";
import TodayView from "./views/TodayView";
import DataView from "./views/DataView";
import GuideView from "./views/GuideView";
import ProgramView from "./views/ProgramView";
import VolumeLog from "./views/VolumeLog";
import CheckIn from "./views/CheckIn";
import SettingsView from "./views/SettingsView";
import LoginScreen from "./views/LoginScreen";
import OnboardingScreen from "./views/OnboardingScreen";
import Walkthrough from "./components/Walkthrough";
import PosingView from "./views/PosingView";
import ProgramPDF from "./views/ProgramPDF";

export default function App() {
  const [accentId, setAccentId] = useState(() => storage.get("accent", "forge"));
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
  const [coachOpen, setCoachOpen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [splashDone, setSplashDone] = useState(() => !!sessionStorage.getItem("forge_splash"));
  const [splashFading, setSplashFading] = useState(false);

  // Toast system
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Gym arrival detection — auto-launch workout on arrival
  useEffect(() => {
    if (screen !== "app") return;
    const onGymArrival = () => {
      const msg = getGymArrivalMessage();
      sendNotification(msg.title, msg.body, { tag: "gym-arrival" });
      showToast("Welcome to the gym");
      // Auto-navigate to today's workout if enabled
      const locSettings = getLocationSettings();
      if (locSettings.autoLaunchWorkout) {
        const currentDay = storage.get("cd", 1);
        const dayData = DAYS[currentDay - 1];
        if (dayData && !dayData.rest) {
          setTab("today");
          setView("main");
        }
      }
    };
    startGymWatch(onGymArrival);
    return () => stopGymWatch();
  }, [screen]);

  // Splash screen — tighter timing + fade-out instead of hard unmount
  useEffect(() => {
    if (!splashDone && screen === "lg") {
      const fadeTimer = setTimeout(() => setSplashFading(true), 1800);
      const doneTimer = setTimeout(() => {
        setSplashDone(true);
        sessionStorage.setItem("forge_splash", "1");
      }, 2200);
      return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
    }
    if (!splashDone) setSplashDone(true);
  }, []);

  const changeAccent = (id) => { setAccentId(id); storage.set("accent", id); };
  const changeSurface = (id) => { setSurfaceId(id); storage.set("surface", id); };

  // Scroll to top on any navigation change
  const scrollRef = useRef(null);
  const scrollToTop = useCallback(() => {
    (scrollRef.current || window).scrollTo(0, 0);
  }, []);

  const startWorkout = (day) => { setWorkoutDay(day); setView("wp"); };
  const exitWorkout = () => { setWorkoutDay(null); setView("main"); setTab("today"); scrollToTop(); };
  const goMain = () => { setView("main"); scrollToTop(); };

  const icons = NavIcons();

  // ─── SPLASH SCREEN ──────────────────────────────────────────
  if (!splashDone && screen === "lg") {
    return (
      <>
        <div style={{
          minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
          ...(splashFading ? { animation: "splashFadeOut 0.4s ease forwards" } : {}),
        }}>
          {/* Atmospheric orbs */}
          <div className="forge-orb" style={{
            position: "absolute", top: "30%", left: "50%",
            width: 600, height: 600, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.accent008} 0%, transparent 70%)`,
            animation: "orbFloat 6s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div className="forge-orb" style={{
            position: "absolute", top: "60%", left: "40%",
            width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 70%)`,
            animation: "orbFloat2 8s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          {/* Logo */}
          <div style={{ animation: "logoGlowRise 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards", willChange: "transform, opacity, filter" }}>
            <ForgeLogo C={C} size="lg" />
          </div>
          <div style={{
            height: 1, background: C.dividerGrad,
            animation: "lineGrow 0.6s ease 0.8s both", marginTop: 20,
          }} />
          <div style={{
            fontSize: 8, color: C.text4, fontFamily: "var(--m)",
            letterSpacing: ".3em", marginTop: 16,
            animation: "badgeFade 0.5s ease 1.1s both",
          }}>
            fitnessforge.ai
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
        <OnboardingScreen C={C} onComplete={() => { setScreen("app"); if (!storage.get("wt_done")) setShowWalkthrough(true); }} changeAccent={changeAccent} changeSurface={changeSurface} />
        <style>{css}</style>
      </>
    );
  }

  // ─── WORKOUT PLAYER (full screen takeover) ──────────────────
  if (view === "wp" && workoutDay) {
    return (
      <>
        <WorkoutPlayer day={workoutDay} onExit={exitWorkout} C={C} showToast={showToast} coachOpen={coachOpen} />
        {!coachOpen && (
          <div style={{ animation: "coachFabIn 0.3s ease" }}>
            <CoachFAB C={C} onClick={() => setCoachOpen(true)} />
          </div>
        )}
        {coachOpen && <CoachPanel C={C} isOverlay onClose={() => setCoachOpen(false)} isWorkout />}
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
    if (view === "pp") return <CheckIn C={C} onBack={goMain} initialTab="photos" />;
    if (view === "posing") return <PosingView C={C} onBack={goMain} />;
    if (view === "pdf") return <ProgramPDF C={C} onClose={goMain} />;
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
      case "today": return <TodayView C={C} onWork={startWorkout} onNav={(v) => { setView(v); scrollToTop(); }} showToast={showToast} />;
      case "program": return <ProgramView C={C} onWork={startWorkout} onNav={(v) => { setView(v); scrollToTop(); }} />;
      case "coach": return <CoachPanel C={C} isOverlay={false} />;
      case "data": return <DataView C={C} onNav={(v) => { setView(v); scrollToTop(); }} />;
      default: return <TodayView C={C} onWork={startWorkout} onNav={setView} showToast={showToast} />;
    }
  };

  // 4 tabs — Coach is #2 (core differentiator)
  const tabs = [
    { k: "today", l: "Today" },
    { k: "coach", l: "Coach" },
    { k: "program", l: "Program" },
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
        <div className="forge-orb" style={{
          position: "absolute", top: "15%", left: "50%",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
          animation: "orbFloat 8s ease-in-out infinite",
        }} />
        <div className="forge-orb" style={{
          position: "absolute", top: "60%", left: "30%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 60%)`,
          animation: "orbFloat2 10s ease-in-out infinite",
        }} />
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* ─── HEADER ─── */}
        <div
          className="forge-header forge-header-blur"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 16px 14px",
            borderBottom: "none",
            position: "sticky", top: 0,
            background: C.headerBg,
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            zIndex: 10,
          }}
        >
          {/* Gradient glow border line at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
            background: C.dividerGrad,
            boxShadow: `0 1px 8px ${C.accent008}`,
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ForgeLogo C={C} size="md" />
            <div>
              <div>
                <ForgeTitle C={C} size={18} />
              </div>
              <div style={{
                fontSize: 8, color: C.text4, fontFamily: "var(--m)",
                letterSpacing: ".22em", marginTop: 1,
              }}>
                fitnessforge.ai
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
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
              <circle cx="8" cy="7" r="2" fill="currentColor" />
              <circle cx="16" cy="12" r="2" fill="currentColor" />
              <circle cx="11" cy="17" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div
          ref={scrollRef}
          className="forge-content"
          style={{
            padding: "20px 16px 110px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {content()}
        </div>

        {/* ─── COACH OVERLAY ─── */}
        {coachOpen && <CoachPanel C={C} isOverlay onClose={() => setCoachOpen(false)} />}

        {/* CoachFAB removed from main views — Coach tab is in the nav bar.
           FAB only appears during WorkoutPlayer where nav is hidden. */}

        {/* ─── TOAST ─── */}
        {toast && <Toast message={toast} C={C} />}

        {/* ─── BOTTOM NAVIGATION — 4 TABS ─── */}
        <div
          className="forge-nav forge-nav-blur"
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 640,
            background: C.navBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "none",
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
            zIndex: 30,
          }}
        >
          {/* Gradient glow border at top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: C.dividerGrad,
            boxShadow: `0 -1px 8px ${C.accent008}`,
          }} />
          {tabs.map((t) => {
            const active = tab === t.k && view === "main";
            return (
              <div
                key={t.k}
                onClick={() => { setTab(t.k); setView("main"); scrollToTop(); }}
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
                  <>
                    {/* Radial glow halo behind icon */}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -55%)",
                      width: 48, height: 48, borderRadius: "50%",
                      background: `radial-gradient(circle, ${C.accent010} 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }} />
                    {/* Top accent line */}
                    <div style={{
                      position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                      width: 32, height: 2, borderRadius: 1,
                      background: C.gradient, backgroundSize: "300% 100%",
                      boxShadow: `0 0 14px ${C.accent030}, 0 0 28px ${C.accent010}`,
                    }} />
                  </>
                )}
                <div style={{
                  animation: active ? "iconGlow 2.5s ease-in-out infinite" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icons[t.k]}
                </div>
                <span style={{
                  marginTop: 1,
                  textShadow: active ? `0 0 12px ${C.accent040}` : "none",
                }}>{t.l}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── WALKTHROUGH (first-use tour) ─── */}
      {showWalkthrough && <Walkthrough C={C} onComplete={() => setShowWalkthrough(false)} />}

      <style>{css}</style>
    </div>
  );
}
