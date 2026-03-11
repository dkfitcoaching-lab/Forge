import { useState, useEffect } from "react";
import { Card, Label, SectionDivider, Button } from "../components/Primitives";
import { useStaggeredReveal } from "../utils/hooks";
import DIVISIONS, { PRO_WISDOM } from "../data/posing";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// POSING PRACTICE — Elite NPC/IFBB Division-Specific Coaching
// Full step-by-step instructions, common mistakes, pro tips
// ══════════════════════════════════════════════════════════════

export default function PosingView({ C, onBack }) {
  const visible = useStaggeredReveal(16, 40);
  const [divisionId, setDivisionId] = useState(() => storage.get("posing_div", null));
  const [sessionLog, setSessionLog] = useState(() => storage.get("posing_log", []));
  const [activePose, setActivePose] = useState(null);
  const [confidence, setConfidence] = useState({});
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedPose, setExpandedPose] = useState(null);
  const [activeTab, setActiveTab] = useState("steps"); // steps | mistakes | tips
  const [wisdomIdx, setWisdomIdx] = useState(() => Math.floor(Math.random() * PRO_WISDOM.length));

  const division = DIVISIONS.find(d => d.id === divisionId);

  // Hold timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const selectDivision = (id) => {
    setDivisionId(id);
    storage.set("posing_div", id);
    setConfidence({});
    setActivePose(null);
    setSessionStarted(false);
    setExpandedPose(null);
  };

  const startSession = () => {
    setSessionStarted(true);
    setConfidence({});
    setActivePose(null);
    setExpandedPose(null);
  };

  const ratePose = (poseId, rating) => {
    setConfidence(prev => ({ ...prev, [poseId]: rating }));
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const finishSession = () => {
    const entry = {
      ts: Date.now(),
      division: divisionId,
      ratings: { ...confidence },
      poseCount: Object.keys(confidence).length,
      avgConfidence: Object.values(confidence).length > 0
        ? Math.round(Object.values(confidence).reduce((a, b) => a + b, 0) / Object.values(confidence).length * 10) / 10
        : 0,
    };
    const updated = [entry, ...sessionLog].slice(0, 50);
    setSessionLog(updated);
    storage.set("posing_log", updated);
    setSessionStarted(false);
    setActivePose(null);
    setTimer(0);
    setTimerRunning(false);
    if (navigator.vibrate) navigator.vibrate([20, 60, 20]);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const totalPoses = division?.poses.length || 0;
  const completedPoses = Object.keys(confidence).length;

  // Stats from history
  const divHistory = sessionLog.filter(s => s.division === divisionId);
  const totalSessions = divHistory.length;
  const lastSession = divHistory[0];

  // ─── Small Pill Tab Component ──────────────────────────────
  const PillTabs = ({ tabs, active, onChange }) => (
    <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
      {tabs.map(t => {
        const isActive = active === t.k;
        return (
          <button key={t.k} onClick={() => onChange(t.k)} style={{
            flex: 1, padding: "7px 6px", borderRadius: 8,
            background: isActive ? C.accent010 : "transparent",
            border: `1.5px solid ${isActive ? C.accent025 : C.structBorderHover}`,
            color: isActive ? C.accent : C.text4,
            fontSize: 8, fontFamily: "var(--m)", fontWeight: 700,
            letterSpacing: ".1em", cursor: "pointer", transition: "all 0.2s",
          }}>
            {t.l}
          </button>
        );
      })}
    </div>
  );

  // ─── DIVISION SELECTOR ──────────────────────────────────────
  if (!divisionId) {
    return (
      <div>
        {onBack && (
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
            letterSpacing: ".06em", cursor: "pointer", padding: "0 0 16px", marginTop: -4,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            BACK
          </button>
        )}

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: C.structGlass, border: `1.5px solid ${C.accent030}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 24px ${C.accent015}, 0 0 48px ${C.accent005}`,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <path d="M12 8v4" />
              <path d="M9 12l-2 8h2l3-4 3 4h2l-2-8" />
              <path d="M8 14h8" />
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--d)", color: C.text1, letterSpacing: ".08em", marginBottom: 6 }}>
            POSING PRACTICE
          </div>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".04em", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
            Elite coaching for every NPC/IFBB division — step-by-step instructions from pro sources
          </div>
        </div>

        {/* Pro Wisdom Quote */}
        <Card C={C} style={{ marginBottom: 16, padding: "14px 16px", borderColor: C.accent015 }}>
          <div style={{ fontSize: 11, color: C.text2, fontStyle: "italic", lineHeight: 1.7, fontFamily: "var(--m)" }}>
            "{PRO_WISDOM[wisdomIdx].quote}"
          </div>
          <div style={{ fontSize: 9, color: C.accent, fontFamily: "var(--m)", marginTop: 8, letterSpacing: ".06em", fontWeight: 600 }}>
            — {PRO_WISDOM[wisdomIdx].source.toUpperCase()}
          </div>
        </Card>

        <Label C={C}>SELECT YOUR DIVISION</Label>
        {DIVISIONS.map((div) => (
          <Card key={div.id} C={C} onClick={() => selectDivision(div.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: "var(--m)", flexShrink: 0,
            }}>
              {div.poses.length}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{div.name}</div>
              <div style={{ fontSize: 10, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                {div.poses.length} mandatory poses · {div.org}
              </div>
              <div style={{ fontSize: 9, color: C.text3, marginTop: 2, lineHeight: 1.4 }}>{div.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.text4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </Card>
        ))}
      </div>
    );
  }

  // ─── ACTIVE SESSION ─────────────────────────────────────────
  if (sessionStarted) {
    return (
      <div>
        {/* Session Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <button onClick={() => { setSessionStarted(false); setActivePose(null); setTimer(0); setTimerRunning(false); }} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
            letterSpacing: ".06em", cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            EXIT
          </button>
          <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em" }}>
            {completedPoses}/{totalPoses} POSES
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, borderRadius: 2, background: C.structGlass,
          marginBottom: 24, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: C.gradient, backgroundSize: "300% 100%",
            width: `${(completedPoses / totalPoses) * 100}%`,
            transition: "width 0.4s ease",
            boxShadow: `0 0 8px ${C.accent030}`,
          }} />
        </div>

        {/* Active Pose Detail */}
        {activePose !== null && (() => {
          const pose = division.poses[activePose];
          return (
            <Card C={C} accentGlow style={{ marginBottom: 20, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  fontSize: 8, color: C.accent, fontFamily: "var(--m)",
                  letterSpacing: ".14em", fontWeight: 700,
                }}>
                  POSE {activePose + 1} OF {totalPoses}
                </div>
                {/* Hold timer */}
                <button
                  onClick={() => { if (timerRunning) { setTimerRunning(false); } else { setTimer(0); setTimerRunning(true); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: timerRunning ? C.accent010 : C.structGlass,
                    border: `1px solid ${timerRunning ? C.accent030 : C.structBorderHover}`,
                    borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                    color: timerRunning ? C.accent : C.text3,
                    fontSize: 13, fontFamily: "var(--m)", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {timerRunning ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="4" x2="7" y2="20" /><line x1="17" y1="4" x2="17" y2="20" /></svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21" /></svg>
                  )}
                  {formatTime(timer)}
                </button>
              </div>

              <div style={{
                fontSize: 22, fontWeight: 700, fontFamily: "var(--d)",
                color: C.text1, marginBottom: 6,
              }}>
                {pose.name}
              </div>

              {/* Muscle targets */}
              {pose.muscles && (
                <div style={{ fontSize: 9, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".04em", marginBottom: 16, lineHeight: 1.6 }}>
                  {pose.muscles}
                </div>
              )}

              {/* Tabbed content: Steps / Mistakes / Tips */}
              <PillTabs
                tabs={[
                  { k: "steps", l: "STEP-BY-STEP" },
                  { k: "mistakes", l: "AVOID" },
                  { k: "tips", l: "PRO TIPS" },
                ]}
                active={activeTab}
                onChange={setActiveTab}
              />

              <div style={{
                padding: "12px 14px", borderRadius: 10,
                background: C.structGlass, border: `1px solid ${C.structBorder}`,
                marginBottom: 18, maxHeight: 260, overflowY: "auto",
              }}>
                {activeTab === "steps" && pose.steps && (
                  <div>
                    {pose.steps.map((step, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: i < pose.steps.length - 1 ? 10 : 0,
                        alignItems: "flex-start",
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          background: C.accent008, border: `1px solid ${C.accent020}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, fontWeight: 700, color: C.accent, fontFamily: "var(--m)",
                          marginTop: 1,
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.6, fontFamily: "var(--m)" }}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "steps" && !pose.steps && (
                  <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.8, fontFamily: "var(--m)" }}>{pose.cues}</div>
                )}

                {activeTab === "mistakes" && pose.mistakes && (
                  <div>
                    {pose.mistakes.map((m, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: i < pose.mistakes.length - 1 ? 10 : 0,
                        alignItems: "flex-start",
                      }}>
                        <div style={{ color: "#ef5350", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✕</div>
                        <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.6, fontFamily: "var(--m)" }}>{m}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "mistakes" && !pose.mistakes && (
                  <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>No specific mistakes documented for this pose.</div>
                )}

                {activeTab === "tips" && pose.proTips && (
                  <div>
                    {pose.proTips.map((tip, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: i < pose.proTips.length - 1 ? 10 : 0,
                        alignItems: "flex-start",
                      }}>
                        <div style={{ color: C.accent, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</div>
                        <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.6, fontFamily: "var(--m)", fontStyle: "italic" }}>{tip}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "tips" && !pose.proTips && (
                  <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>No additional pro tips for this pose.</div>
                )}
              </div>

              {/* Confidence Rating */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".1em", marginBottom: 10 }}>CONFIDENCE LEVEL</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(level => {
                    const rated = confidence[pose.id] >= level;
                    const labels = ["Weak", "Shaky", "Decent", "Strong", "Nailed"];
                    return (
                      <button key={level} onClick={() => { ratePose(pose.id, level); setTimerRunning(false); }}
                        style={{
                          flex: 1, padding: "10px 4px", borderRadius: 8,
                          background: rated ? C.accent010 : C.structGlass,
                          border: `1.5px solid ${rated ? C.accent030 : C.structBorderHover}`,
                          cursor: "pointer", transition: "all 0.2s",
                          boxShadow: rated ? `0 0 10px ${C.accent010}` : "none",
                        }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: rated ? C.accent : C.text4, fontFamily: "var(--m)" }}>{level}</div>
                        <div style={{ fontSize: 6, color: rated ? C.accent : C.text5, fontFamily: "var(--m)", letterSpacing: ".06em", marginTop: 2 }}>{labels[level - 1]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })()}

        {/* Pose List */}
        <Label C={C}>MANDATORY POSES — {division.name.toUpperCase()}</Label>
        {division.poses.map((pose, i) => {
          const isActive = activePose === i;
          const rated = confidence[pose.id];
          return (
            <Card key={pose.id} C={C}
              onClick={() => { setActivePose(i); setTimer(0); setTimerRunning(false); setActiveTab("steps"); }}
              style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                borderColor: isActive ? C.accent030 : undefined,
                boxShadow: isActive ? `0 0 16px ${C.accent010}, ${C.cardShadow}` : undefined,
              }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: rated ? C.accent010 : C.structGlass,
                border: `1.5px solid ${rated ? C.accent030 : C.structBorderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.2s",
              }}>
                {rated ? (
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{rated}</div>
                ) : (
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text4, fontFamily: "var(--m)" }}>{i + 1}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: rated ? C.text1 : C.text2 }}>{pose.name}</div>
                {rated && (
                  <div style={{ fontSize: 9, color: C.accent, fontFamily: "var(--m)", marginTop: 2, letterSpacing: ".06em" }}>
                    {["", "WEAK", "SHAKY", "DECENT", "STRONG", "NAILED"][rated]}
                  </div>
                )}
              </div>
              {isActive && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: C.accent, boxShadow: `0 0 8px ${C.accent040}` }} />
              )}
            </Card>
          );
        })}

        {/* Finish Session */}
        {completedPoses > 0 && (
          <div style={{ marginTop: 16 }}>
            <Button C={C} onClick={finishSession}>
              FINISH SESSION — {completedPoses}/{totalPoses} RATED
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ─── DIVISION HOME ──────────────────────────────────────────
  return (
    <div>
      {onBack && (
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: C.accent, fontSize: 11, fontFamily: "var(--m)", fontWeight: 600,
          letterSpacing: ".06em", cursor: "pointer", padding: "0 0 16px", marginTop: -4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          BACK
        </button>
      )}

      {/* Division Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--d)", color: C.text1, letterSpacing: ".06em" }}>
              {division.name}
            </div>
            <div style={{ fontSize: 9, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 2 }}>
              {division.poses.length} MANDATORY POSES · {division.org}
            </div>
          </div>
          <button onClick={() => { setDivisionId(null); setConfidence({}); setActivePose(null); setExpandedPose(null); }} style={{
            background: C.structGlass, border: `1px solid ${C.structBorderHover}`,
            borderRadius: 8, color: C.text4, fontSize: 8, fontFamily: "var(--m)",
            padding: "6px 12px", cursor: "pointer", letterSpacing: ".08em", fontWeight: 600,
          }}>
            CHANGE
          </button>
        </div>
        <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.6 }}>{division.desc}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[
          { v: totalSessions, l: "SESSIONS" },
          { v: lastSession ? lastSession.avgConfidence : "—", l: "LAST AVG" },
          { v: totalPoses, l: "POSES" },
        ].map(({ v, l }) => (
          <div key={l} style={{
            padding: "14px 8px", textAlign: "center",
            background: C.cardGradient, borderRadius: 10,
            border: `1.5px solid ${C.structBorderHover}`, boxShadow: C.cardShadow,
          }}>
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--m)", color: C.accent, textShadow: `0 0 16px ${C.accent020}` }}>{v}</div>
            <div style={{ fontSize: 7, color: C.text4, letterSpacing: ".12em", fontFamily: "var(--m)", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Start Practice */}
      <Button C={C} onClick={startSession} style={{ marginBottom: 24 }}>
        START POSING SESSION
      </Button>

      {/* Pro Wisdom */}
      <Card C={C} onClick={() => setWisdomIdx((wisdomIdx + 1) % PRO_WISDOM.length)} style={{ cursor: "pointer", padding: "14px 16px", marginBottom: 8, borderColor: C.accent010 }}>
        <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 6, fontWeight: 700 }}>PRO WISDOM</div>
        <div style={{ fontSize: 11, color: C.text2, fontStyle: "italic", lineHeight: 1.7, fontFamily: "var(--m)" }}>
          "{PRO_WISDOM[wisdomIdx].quote}"
        </div>
        <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 8, letterSpacing: ".04em" }}>
          — {PRO_WISDOM[wisdomIdx].source} <span style={{ opacity: 0.4, marginLeft: 4 }}>tap for more</span>
        </div>
      </Card>

      <SectionDivider C={C} />

      {/* Pose Reference — expandable with full details */}
      <Label C={C}>POSE REFERENCE</Label>
      {division.poses.map((pose, i) => {
        const bestRating = divHistory.reduce((best, session) => {
          const r = session.ratings[pose.id];
          return r > best ? r : best;
        }, 0);
        const isExpanded = expandedPose === pose.id;

        return (
          <Card key={pose.id} C={C} style={{ padding: 0, overflow: "hidden" }}>
            {/* Pose Header — always visible */}
            <div
              onClick={() => setExpandedPose(isExpanded ? null : pose.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: bestRating > 0 ? C.accent010 : C.structGlass,
                border: `1px solid ${bestRating > 0 ? C.accent030 : C.structBorderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: bestRating > 0 ? C.accent : C.text4,
                fontFamily: "var(--m)", flexShrink: 0,
              }}>
                {bestRating > 0 ? bestRating : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{pose.name}</div>
                {pose.muscles && (
                  <div style={{ fontSize: 8, color: C.text4, fontFamily: "var(--m)", marginTop: 3, lineHeight: 1.4, letterSpacing: ".02em" }}>
                    {pose.muscles}
                  </div>
                )}
                {bestRating > 0 && (
                  <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", marginTop: 3, letterSpacing: ".08em" }}>
                    BEST: {["", "WEAK", "SHAKY", "DECENT", "STRONG", "NAILED"][bestRating]}
                  </div>
                )}
              </div>
              <div style={{
                color: C.text4, fontSize: 12,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s", flexShrink: 0,
              }}>▾</div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div style={{
                padding: "0 16px 16px",
                borderTop: `1px solid ${C.structBorder}`,
                animation: "fadeIn 0.2s ease",
              }}>
                {/* Quick cue */}
                <div style={{
                  padding: "10px 12px", borderRadius: 8, marginTop: 12, marginBottom: 14,
                  background: C.accent005, border: `1px solid ${C.accent015}`,
                }}>
                  <div style={{ fontSize: 10, color: C.text2, lineHeight: 1.6, fontFamily: "var(--m)" }}>{pose.cues}</div>
                </div>

                {/* Step-by-step */}
                {pose.steps && (
                  <>
                    <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em", marginBottom: 8, fontWeight: 700 }}>STEP-BY-STEP</div>
                    {pose.steps.map((step, si) => (
                      <div key={si} style={{
                        display: "flex", gap: 10, marginBottom: 8,
                        alignItems: "flex-start",
                      }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          background: C.accent008, border: `1px solid ${C.accent015}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 7, fontWeight: 700, color: C.accent, fontFamily: "var(--m)",
                          marginTop: 2,
                        }}>
                          {si + 1}
                        </div>
                        <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.6, fontFamily: "var(--m)" }}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Common Mistakes */}
                {pose.mistakes && pose.mistakes.length > 0 && (
                  <>
                    <div style={{ fontSize: 8, color: "#ef5350", fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 14, marginBottom: 8, fontWeight: 700 }}>COMMON MISTAKES</div>
                    {pose.mistakes.map((m, mi) => (
                      <div key={mi} style={{
                        display: "flex", gap: 8, marginBottom: 6,
                        alignItems: "flex-start",
                      }}>
                        <div style={{ color: "#ef5350", fontSize: 9, flexShrink: 0, marginTop: 2 }}>✕</div>
                        <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.5, fontFamily: "var(--m)" }}>{m}</div>
                      </div>
                    ))}
                  </>
                )}

                {/* Pro Tips */}
                {pose.proTips && pose.proTips.length > 0 && (
                  <>
                    <div style={{ fontSize: 8, color: C.accent, fontFamily: "var(--m)", letterSpacing: ".12em", marginTop: 14, marginBottom: 8, fontWeight: 700 }}>PRO TIPS</div>
                    {pose.proTips.map((tip, ti) => (
                      <div key={ti} style={{
                        display: "flex", gap: 8, marginBottom: 6,
                        alignItems: "flex-start",
                      }}>
                        <div style={{ color: C.accent, fontSize: 8, flexShrink: 0, marginTop: 3 }}>◆</div>
                        <div style={{ fontSize: 10, color: C.text3, lineHeight: 1.5, fontFamily: "var(--m)", fontStyle: "italic" }}>{tip}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Session History */}
      {divHistory.length > 0 && (
        <>
          <SectionDivider C={C} />
          <div onClick={() => setShowHistory(!showHistory)} style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Label C={C} style={{ marginBottom: 0 }}>SESSION HISTORY</Label>
            <div style={{ color: C.text4, fontSize: 14, transform: showHistory ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</div>
          </div>
          {showHistory && divHistory.slice(0, 10).map((session) => (
            <Card key={session.ts} C={C} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>
                    {new Date(session.ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div style={{ fontSize: 9, color: C.text4, fontFamily: "var(--m)", marginTop: 2 }}>
                    {session.poseCount}/{totalPoses} poses rated
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: "var(--m)" }}>{session.avgConfidence}</div>
                  <div style={{ fontSize: 7, color: C.text4, fontFamily: "var(--m)", letterSpacing: ".08em" }}>AVG CONF</div>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
