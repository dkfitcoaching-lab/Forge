import { useState, useRef } from "react";
import { Card, Button, Label } from "./Primitives";
import storage from "../utils/storage";

// ══════════════════════════════════════════════════════════════
// FORGE PROGRESS PHOTOS
// Camera capture, timeline display, side-by-side comparison
// ══════════════════════════════════════════════════════════════

export default function ProgressPhotos({ C, onBack }) {
  const [photos, setPhotos] = useState(() => storage.get("photos", []));
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const fileRef = useRef();

  const addPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newPhoto = {
        id: Date.now(),
        data: ev.target.result,
        date: new Date().toISOString(),
        label: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        weight: "",
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      // Store photo references (base64 can be large, but works for MVP)
      try {
        storage.set("photos", updated);
      } catch {
        // Storage quota exceeded — keep in memory only
        console.warn("Storage quota exceeded for photos");
      }
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    storage.set("photos", updated);
    setSelected(selected.filter((s) => s !== id));
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const comparePhotos = selected.length === 2
    ? [photos.find((p) => p.id === selected[0]), photos.find((p) => p.id === selected[1])]
    : [];

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
        Progress Photos
      </div>
      <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)", marginBottom: 20 }}>
        Visual tracking — the most honest metric
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Button
          C={C}
          onClick={() => fileRef.current?.click()}
          style={{ flex: 1 }}
        >
          ADD PHOTO
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={addPhoto}
          style={{ display: "none" }}
        />
        {photos.length >= 2 && (
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              setSelected([]);
            }}
            style={{
              flex: 1,
              padding: 14,
              background: compareMode ? `${C.accent}15` : "transparent",
              border: `1px solid ${compareMode ? C.accent : C.structBorderHover}`,
              borderRadius: 12,
              color: compareMode ? C.accent : C.text3,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--m)",
              letterSpacing: ".1em",
              cursor: "pointer",
            }}
          >
            COMPARE
          </button>
        )}
      </div>

      {/* Compare View */}
      {compareMode && selected.length === 2 && comparePhotos.length === 2 && (
        <Card C={C} style={{ marginBottom: 16, padding: 12 }}>
          <Label C={C}>Side by Side</Label>
          <div style={{ display: "flex", gap: 4 }}>
            {comparePhotos.map((photo) => (
              <div key={photo.id} style={{ flex: 1 }}>
                <img
                  src={photo.data}
                  alt={photo.label}
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: 8,
                    border: `1px solid ${C.structBorderHover}`,
                  }}
                />
                <div style={{ fontSize: 9, color: C.text3, fontFamily: "var(--m)", textAlign: "center", marginTop: 4 }}>
                  {photo.label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {compareMode && selected.length < 2 && (
        <Card C={C} style={{ textAlign: "center", padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: C.text3, fontFamily: "var(--m)" }}>
            Select {2 - selected.length} photo{selected.length === 0 ? "s" : ""} to compare
          </div>
        </Card>
      )}

      {/* Photo Grid / Timeline */}
      {photos.length === 0 ? (
        <Card C={C} style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>&#128247;</div>
          <div style={{ fontSize: 14, color: C.text3, marginBottom: 4 }}>No photos yet</div>
          <div style={{ fontSize: 11, color: C.text4, fontFamily: "var(--m)" }}>
            Take your first progress photo to start tracking visually
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {[...photos].reverse().map((photo) => {
            const isSelected = selected.includes(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => compareMode ? toggleSelect(photo.id) : null}
                style={{
                  position: "relative",
                  cursor: compareMode ? "pointer" : "default",
                  borderRadius: 8,
                  overflow: "hidden",
                  border: isSelected ? `2px solid ${C.accent}` : `1px solid ${C.structBorder}`,
                  transition: "border 0.2s",
                }}
              >
                <img
                  src={photo.data}
                  alt={photo.label}
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px 6px 4px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  }}
                >
                  <div style={{ fontSize: 8, color: "#fff", fontFamily: "var(--m)" }}>
                    {photo.label}
                  </div>
                </div>
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: C.bg,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
                {!compareMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this photo?")) deletePhoto(photo.id);
                    }}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      background: "rgba(0,0,0,0.6)",
                      border: "none",
                      color: "#fff",
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
