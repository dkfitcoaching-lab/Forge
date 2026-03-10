import { Component } from "react";

// ══════════════════════════════════════════════════════════════
// FORGE ERROR BOUNDARY — Catches render crashes gracefully
// Shows recovery UI instead of blank white screen
// ══════════════════════════════════════════════════════════════

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Forge] Render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#010102",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          textAlign: "center",
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14,
            border: "1.5px solid rgba(180,195,210,0.2)",
            background: "linear-gradient(145deg, rgba(180,195,210,0.06), rgba(180,195,210,0.02))",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 24, fontFamily: "serif", fontWeight: 800, color: "rgba(180,195,210,0.6)" }}>Fe</span>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: "#E8EAED",
            fontFamily: "'Cinzel', serif", letterSpacing: ".08em",
            marginBottom: 8,
          }}>
            SOMETHING WENT WRONG
          </div>
          <div style={{
            fontSize: 12, color: "rgba(180,195,210,0.5)",
            fontFamily: "'IBM Plex Mono', monospace",
            lineHeight: 1.8, marginBottom: 32, maxWidth: 300,
          }}>
            Forge encountered an unexpected error. Your data is safe — it's stored locally on your device.
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, rgba(94,234,212,0.15), rgba(94,234,212,0.05))",
              border: "1.5px solid rgba(94,234,212,0.3)",
              borderRadius: 8,
              color: "#5EEAD4",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: ".14em",
              cursor: "pointer",
            }}
          >
            RELOAD FORGE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
