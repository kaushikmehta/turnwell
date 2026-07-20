import React, { useEffect, useRef, useState } from "react";
import { C, METRONOME_DEFAULT_BPM, METRONOME_MIN_BPM, METRONOME_MAX_BPM } from "../../constants";

/* Rhythmic auditory cueing.
   Rhythm entrains the motor system through fast auditory–reticulospinal
   connections, supplying the timing signal the SMA normally generates
   internally. It addresses initiation and persistence at the same time:
   the beat keeps arriving, so the drive keeps arriving.

   Scheduled with Web Audio lookahead rather than setInterval, because
   setInterval drifts badly on phones and a drifting beat is worse than none. */
export function Metronome({ compact = false }) {
  const [running, setRunning] = useState(false);
  const [bpm, setBpm] = useState(METRONOME_DEFAULT_BPM);
  const [beat, setBeat] = useState(0);

  const ctxRef = useRef(null);
  const nextNoteRef = useRef(0);
  const timerRef = useRef(null);
  const bpmRef = useRef(bpm);
  const countRef = useRef(0);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const click = (time, accent) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = accent ? 880 : 620;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.32, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  };

  const scheduler = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    while (nextNoteRef.current < ctx.currentTime + 0.15) {
      const n = countRef.current % 4;
      click(nextNoteRef.current, n === 0);
      const at = nextNoteRef.current;
      const delay = Math.max(0, (at - ctx.currentTime) * 1000);
      setTimeout(() => setBeat(n), delay);
      nextNoteRef.current += 60 / bpmRef.current;
      countRef.current += 1;
    }
  };

  const start = async () => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctxRef.current = new AC();
      }
      if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
      countRef.current = 0;
      nextNoteRef.current = ctxRef.current.currentTime + 0.08;
      timerRef.current = setInterval(scheduler, 25);
      setRunning(true);
    } catch { /* audio blocked — the facilitator can count aloud instead */ }
  };

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setBeat(0);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{
      background: running ? C.sageTint : C.surface,
      border: `1px solid ${running ? C.sage : C.line}`,
      borderRadius: 14, padding: compact ? "10px 13px" : "13px 15px", marginBottom: 12,
      transition: "background .2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <button className="tw-focus tw-lift" onClick={running ? stop : start}
          style={{ background: running ? C.sageDeep : C.sage, color: "#fff", border: "none",
            borderRadius: 11, padding: "10px 15px", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          {running ? "Stop" : "Beat"}
        </button>

        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} style={{
              width: k === 0 ? 11 : 8, height: k === 0 ? 11 : 8, borderRadius: 999,
              background: running && beat === k ? (k === 0 ? C.sageDeep : C.sage) : C.line,
              transition: "background .06s linear",
            }} />
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input type="range" min={METRONOME_MIN_BPM} max={METRONOME_MAX_BPM} step={5}
            value={bpm} onChange={(e) => setBpm(Number(e.target.value))}
            className="tw-focus"
            style={{ width: "100%", accentColor: C.sage, display: "block" }} />
        </div>

        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.sageDeep, width: 52, textAlign: "right", flexShrink: 0 }}>
          {bpm} bpm
        </span>
      </div>

      {!compact && (
        <p style={{ fontSize: 11.5, color: C.inkSoft, margin: "9px 0 0", lineHeight: 1.4 }}>
          Count with the beat. The rhythm is the drive — it keeps arriving, so he doesn't have to generate it.
        </p>
      )}
    </div>
  );
}
