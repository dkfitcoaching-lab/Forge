import { useState, useEffect, useCallback, useRef } from "react";
import { getThemeColors, ACCENTS, SURFACES } from "./data/themes";
import { makeStyles } from "./utils/css";
import { NavIcons, Toast, ForgeLogo, ForgeTitle } from "./components/Primitives";
import storage from "./utils/storage";
// Notifications engine available for mainframe integration
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
import CardioLog from "./views/CardioLog";
import CalendarView from "./views/CalendarView";

export default function App() {
  const [accentId, setAccentId] = useState(() => storage.get("accent", "forge"));
  const [surfaceId, setSurfaceId] = useState(() => {
    const s = storage.get("surface", "void");
    if (s === "slate") { storage.set("surface", "titanium"); return "titanium"; }
    return s;
  });
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
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  // Auto-scroll to top when view or tab changes
  useEffect(() => { scrollToTop(); }, [view, tab]);

  const startWorkout = (day) => { setWorkoutDay(day); setView("wp"); };
  const exitWorkout = () => { setWorkoutDay(null); setView("main"); setTab("today"); scrollToTop(); };
  const goMain = () => { setView("main"); scrollToTop(); };

  const icons = NavIcons();

  // ─── SPLASH SCREEN ──────────────────────────────────────────
  if (!splashDone && screen === "lg") {
    return (
      <>
        <div style={{
          minHeight: "100vh", background: C.bgGradient || C.bg, display: "flex", flexDirection: "column",
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
        <OnboardingScreen C={C} onComplete={() => { setScreen("app"); scrollToTop(); if (!storage.get("wt_done")) setShowWalkthrough(true); }} changeAccent={changeAccent} changeSurface={changeSurface} />
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
    if (view === "cardio") return <CardioLog C={C} onBack={goMain} />;
    if (view === "compare") return <CheckIn C={C} onBack={goMain} initialTab="photos" />;
    if (view === "calendar") return <CalendarView C={C} onBack={goMain} onWork={startWorkout} />;
    if (view === "pdf") return <ProgramPDF C={C} onClose={goMain} />;
    if (view === "data") return <DataView C={C} onNav={(v) => { setView(v); scrollToTop(); }} onBack={goMain} />;
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
      case "profile": return (
        <SettingsView
          C={C}
          accentId={accentId} surfaceId={surfaceId}
          changeAccent={changeAccent} changeSurface={changeSurface}
          showToast={showToast}
          onNav={(v) => { setView(v); scrollToTop(); }}
        />
      );
      default: return <TodayView C={C} onWork={startWorkout} onNav={setView} showToast={showToast} />;
    }
  };

  // 4 tabs — Coach is #2 (core differentiator), Profile replaces Data
  const tabs = [
    { k: "today", l: "Today" },
    { k: "coach", l: "Coach" },
    { k: "program", l: "Program" },
    { k: "profile", l: "Profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bgGradient || C.bg, fontFamily: "var(--b)", color: C.text1 }}>
      {/* ─── ATMOSPHERIC BACKGROUND ─── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Top accent wash — strong and visible */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "140%", height: "70%",
          background: C.atmosphereGrad,
        }} />
        {/* Bottom accent wash */}
        {C.atmosphereGrad2 && <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: C.atmosphereGrad2,
        }} />}
        {/* Floating orbs */}
        <div className="forge-orb" style={{
          position: "absolute", top: "10%", left: "50%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 55%)`,
          animation: "orbFloat 8s ease-in-out infinite",
        }} />
        <div className="forge-orb" style={{
          position: "absolute", top: "55%", left: "25%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.atmosphereOrb} 0%, transparent 55%)`,
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
          {/* Spacer — settings lives in Profile tab */}
          <div style={{ width: 40, height: 40 }} />
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
                className={active ? "forge-nav-active" : undefined}
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
                  transition: "color 0.2s, background 0.2s",
                  minWidth: 52,
                  minHeight: 44,
                  justifyContent: "center",
                }}
              >
                {active && (
                  <div style={{
                    position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                    width: 24, height: 2, borderRadius: 1,
                    background: C.accent,
                    boxShadow: `0 0 6px ${C.accent030}`,
                  }} />
                )}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  filter: active ? `drop-shadow(0 0 3px ${C.accent030})` : "none",
                  transition: "filter 0.2s",
                }}>
                  {icons[t.k]}
                </div>
                <span style={{
                  marginTop: 1,
                  textShadow: active ? `0 0 6px ${C.accent020}` : "none",
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
