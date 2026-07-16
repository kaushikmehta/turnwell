import React, { useEffect, useRef, useState } from "react";
import { C, RSVP_CHUNK_MODES, RSVP_DEFAULT_WPM, RSVP_MIN_WPM, RSVP_MAX_WPM, RSVP_STEP_WPM } from "../../constants";

function tokenize(text, mode) {
  if (mode === "sentence") {
    const sentences = (text.match(/[^.!?]+[.!?]*/g) || [text]).map((s) => s.trim()).filter(Boolean);
    return sentences.length ? sentences : [text];
  }
  const words = text.split(/\s+/).filter(Boolean);
  if (mode === "word") return words;
  const chunks = [];
  for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(i, i + 3).join(" "));
  return chunks;
}

/* Distraction-free word-at-a-time reader — accessibility-oriented: adjustable
   pace and chunk size (1 word / 2–3 words / full sentence), plus a manual
   step mode and a full-text fallback for anyone the pacing doesn't suit. */
export function RSVPReader({ text }) {
  const [mode, setMode] = useState("word");
  const [wpm, setWpm] = useState(RSVP_DEFAULT_WPM);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const timerRef = useRef(null);

  const chunks = tokenize(text, mode);
  const atEnd = index >= chunks.length - 1;

  useEffect(() => { setIndex(0); setPlaying(false); }, [mode, text]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!playing) return;
    if (atEnd) { setPlaying(false); return; }
    const wordsInChunk = chunks[index].split(/\s+/).length;
    const delay = (wordsInChunk / wpm) * 60000;
    timerRef.current = setTimeout(() => setIndex((i) => Math.min(i + 1, chunks.length - 1)), delay);
    return () => clearTimeout(timerRef.current);
  }, [playing, index, wpm, mode]);

  const step = (dir) => {
    setPlaying(false);
    setIndex((i) => Math.max(0, Math.min(chunks.length - 1, i + dir)));
  };
  const restart = () => { setIndex(0); setPlaying(true); };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
        {RSVP_CHUNK_MODES.map((m) => (
          <button key={m.key} className="tw-focus" onClick={() => setMode(m.key)}
            style={{ border: `1.5px solid ${mode === m.key ? C.sage : C.line}`,
              background: mode === m.key ? C.sageTint : C.surface, color: mode === m.key ? C.sageDeep : C.inkSoft,
              borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>
            {m.label}
          </button>
        ))}
        <button className="tw-focus" onClick={() => setShowFull(!showFull)}
          style={{ marginLeft: "auto", border: `1.5px solid ${showFull ? C.clay : C.line}`,
            background: showFull ? C.clayTint : C.surface, color: showFull ? C.clayDeep : C.inkSoft,
            borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>
          {showFull ? "Hide full text" : "Show full text"}
        </button>
      </div>

      {showFull ? (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: "clamp(20px,5vw,32px)", minHeight: 140 }}>
          <p className="tw-serif" style={{ fontSize: "clamp(19px,4vw,26px)", lineHeight: 1.45, margin: 0 }}>{text}</p>
        </div>
      ) : (
        <>
          <div style={{ background: C.ink, borderRadius: 18, padding: "clamp(28px,7vw,48px) 20px", minHeight: 140,
            display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <p key={index} className="tw-rise tw-serif" style={{ fontSize: "clamp(26px,7vw,42px)", color: "#fff", margin: 0, lineHeight: 1.3, wordBreak: "break-word" }}>
              {chunks[index]}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "10px 0" }}>
            {chunks.map((_, k) => (
              <span key={k} style={{ height: 5, flex: 1, borderRadius: 3, background: k <= index ? C.sage : C.line }} />
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button className="tw-focus" onClick={() => step(-1)} disabled={index === 0}
              style={{ width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.surface,
                color: index === 0 ? C.line : C.inkSoft, fontSize: 18, fontWeight: 700 }}>‹</button>
            <button className="tw-focus tw-lift" onClick={() => (atEnd ? restart() : setPlaying(!playing))}
              style={{ flex: 1, background: C.sage, color: "#fff", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
              {atEnd ? "Restart" : playing ? "Pause" : "Play"}
            </button>
            <button className="tw-focus" onClick={() => step(1)} disabled={atEnd}
              style={{ width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.surface,
                color: atEnd ? C.line : C.inkSoft, fontSize: 18, fontWeight: 700 }}>›</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600, whiteSpace: "nowrap" }}>Pace: {wpm} wpm</span>
            <button className="tw-focus" onClick={() => setWpm((w) => Math.max(RSVP_MIN_WPM, w - RSVP_STEP_WPM))}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${C.line}`, background: C.surface, color: C.inkSoft, fontSize: 16, fontWeight: 700 }}>−</button>
            <input type="range" min={RSVP_MIN_WPM} max={RSVP_MAX_WPM} step={RSVP_STEP_WPM} value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))} style={{ flex: 1, accentColor: C.sage }} />
            <button className="tw-focus" onClick={() => setWpm((w) => Math.min(RSVP_MAX_WPM, w + RSVP_STEP_WPM))}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${C.line}`, background: C.surface, color: C.inkSoft, fontSize: 16, fontWeight: 700 }}>+</button>
          </div>
        </>
      )}
    </div>
  );
}
