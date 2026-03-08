import { useState } from "react";
import { getThemeColors } from "./data/themes";
import { makeStyles } from "./utils/css";
import { NavIcons } from "./components/Primitives";
import storage from "./utils/storage";

import WorkoutPlayer from "./components/WorkoutPlayer";
import CoachPanel from "./components/CoachPanel";
import TodayView from "./views/TodayView";
import DataView from "./views/DataView";
import GuideView from "./views/GuideView";
import VolumeLog from "./views/VolumeLog";
import CheckIn from "./views/CheckIn";
import ProfileView from "./views/ProfileView";
import LoginScreen from "./views/LoginScreen";
import OnboardingScreen from "./views/OnboardingScreen";

export default function App() {
  const [themeId, setThemeId] = useState(() => storage.get("th", "forge"));
  const C = getThemeColors(themeId);
  const css = makeStyles(C);

  const [screen, setScreen] = useState(() =>
    storage.get("lg", false) ? (storage.get("ob", false) ? "app" : "ob") : "lg"
  );

  const [tab, setTab] = useState("today");
  const [view, setView] = useState("main");
  const [workoutDay, setWorkoutDay] = useState(null);
  const [coachOpen, setCoachOpen] = useState(false);

  const startWorkout = (day) => {
    setWorkoutDay(day);
    setView("wp");
  };
  const exitWorkout = () => {
    setWorkoutDay(null);
    setView("main");
    setTab("today");
  };
  const goMain = () => setView("main");

  const icons = NavIcons();

  // Login Screen
  if (screen === "lg") {
    return (
      <>
        <LoginScreen C={C} onLogin={() => setScreen("ob")} />
        <style>{css}</style>
      </>
    );
  }

  // Onboarding Screen
  if (screen === "ob") {
    return (
      <>
        <OnboardingScreen C={C} onComplete={() => setScreen("app")} />
        <style>{css}</style>
      </>
    );
  }

  // Workout Player (full screen)
  if (view === "wp" && workoutDay) {
    return (
      <>
        <WorkoutPlayer day={workoutDay} onExit={exitWorkout} C={C} />
        <style>{css}</style>
      </>
    );
  }

  const content = () => {
    if (view === "gd") return <GuideView C={C} onBack={goMain} />;
    if (view === "vl") return <VolumeLog C={C} onBack={goMain} />;
    if (view === "ci") return <CheckIn C={C} onBack={goMain} />;

    if (tab === "today") return <TodayView C={C} onWork={startWorkout} onNav={setView} />;
    if (tab === "data") return <DataView C={C} onNav={setView} />;
    if (tab === "profile") return <ProfileView C={C} themeId={themeId} setThemeId={setThemeId} />;

    return <TodayView C={C} onWork={startWorkout} onNav={setView} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--b)", color: C.text1 }}>
      {/* Background Glow */}
      <div
        style={{
          position: "fixed",
          top: -150,
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}04 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 640, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
        {/* App Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px 8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: C.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: C.bg,
                fontFamily: "var(--d)",
              }}
            >
              F
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text1, fontFamily: "var(--d)", letterSpacing: ".06em" }}>
                FORGE
              </div>
              <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".2em" }}>
                V5 CINEMA
              </div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: C.text5, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
            fitnessforge.ai
          </div>
        </div>

        {/* Main Content */}
        <div
          key={tab + view}
          style={{
            padding: "18px 16px 100px",
            animation: "fi .3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          {content()}
        </div>

        {/* Coach FAB */}
        {!coachOpen && (
          <div
            onClick={() => setCoachOpen(true)}
            style={{
              position: "fixed",
              bottom: 78,
              right: 18,
              width: 48,
              height: 48,
              borderRadius: 14,
              background: C.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: `0 4px 20px ${C.accent}30`,
              zIndex: 40,
              fontSize: 18,
              animation: "glow 3s ease infinite",
            }}
          >
            ⚡
          </div>
        )}

        {/* Coach Panel */}
        {coachOpen && <CoachPanel C={C} onClose={() => setCoachOpen(false)} />}

        {/* Bottom Navigation */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 640,
            background: `${C.bg}f0`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: `1px solid ${C.border1}`,
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
            zIndex: 30,
          }}
        >
          {[
            { k: "today", l: "Today" },
            { k: "data", l: "Data" },
            { k: "profile", l: "Profile" },
          ].map((t) => {
            const active = tab === t.k && view === "main";
            return (
              <div
                key={t.k}
                onClick={() => {
                  setTab(t.k);
                  setView("main");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "6px 20px",
                  cursor: "pointer",
                  color: active ? C.accent : C.text4,
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: "var(--m)",
                  letterSpacing: ".08em",
                  position: "relative",
                  transition: "color 0.2s",
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 16,
                      height: 3,
                      borderRadius: 2,
                      background: C.accent,
                    }}
                  />
                )}
                {icons[t.k]}
                <span style={{ marginTop: 2 }}>{t.l}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}
