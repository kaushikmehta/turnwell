import React, { useState } from "react";
import { C, ROM_SEGMENTS, TIGHTNESS_OPTIONS } from "../../constants";
import { SectionLabel, BackBtn } from "../shared";
import { Metronome } from "./Metronome";

/* Block A — priming, now focused on full-body ROM (the live, hands-on tissue
   work). The warm-up/readiness prep moved to session setup. What stays here is
   what has to happen at the body, right before the working block: move every
   segment, and settle the two things that gate the standing goal — ankle
   dorsiflexion range, and overnight splint tolerance. */
export function Priming({ onNext, onBack }) {
  const [romDone, setRomDone] = useState({});
  const [tight, setTight] = useState("");
  // Per-segment tightness (handoff §4.1) — one tap per segment, feeding the
  // contracture early-warning heatmap. { [segKey]: { level, note } }.
  const [segTight, setSegTight] = useState({});
  const [noteOpen, setNoteOpen] = useState({});
  const [ankle, setAnkle] = useState(null);
  const [splintHours, setSplintHours] = useState("");
  const [skinClear, setSkinClear] = useState(null);

  const toggleSeg = (k) => setRomDone((d) => ({ ...d, [k]: !d[k] }));
  const setTightness = (k, level) => setSegTight((t) => ({ ...t, [k]: { ...(t[k] || {}), level } }));
  const setSegNote = (k, note) => setSegTight((t) => ({ ...t, [k]: { ...(t[k] || {}), note } }));
  const doneCount = ROM_SEGMENTS.filter((s) => romDone[s.key]).length;
  const canContinue = ankle != null;

  const submit = () => onNext({
    rom: { segments: romDone, tightness: segTight, tight: tight.trim() },
    ankle,
    splint: splintHours === "" ? null : { hours: Number(splintHours), skinClear },
  });

  return (
    <div className="tw-rise">
      {onBack && <BackBtn onClick={onBack} label="Opening" />}
      <SectionLabel>Block A · Priming</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 6px" }}>Full-body ROM</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.45 }}>
        Slow and sustained — this is tissue work, not a warm-up rush. Work each segment and tick it off; note anything tight.
      </p>

      <Metronome />

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 9 }}>
        <SectionLabel>Segments</SectionLabel>
        <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>{doneCount}/{ROM_SEGMENTS.length} worked</span>
      </div>

      {/* Tightness legend — what to tap under each segment. */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Tightness — what to tap for each segment</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {TIGHTNESS_OPTIONS.map((t) => (
            <div key={t.key} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
              <span style={{ flexShrink: 0, marginTop: 1, border: `1.5px solid ${t.color}`, background: t.tint,
                color: t.color, borderRadius: 999, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{t.label}</span>
              <span style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.4 }}>{t.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
        {ROM_SEGMENTS.map((s) => {
          const on = !!romDone[s.key];
          return (
            <React.Fragment key={s.key}>
              <button className="tw-focus" onClick={() => toggleSeg(s.key)}
                style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start",
                  background: on ? C.sageTint : C.surface, border: `1.5px solid ${on ? C.sage : s.priority ? C.clay : C.line}`,
                  borderRadius: 14, padding: "13px 15px", width: "100%" }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${on ? C.sageDeep : C.line}`, background: on ? C.sageDeep : "transparent",
                  color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: "17px", textAlign: "center" }}>
                  {on ? "✓" : ""}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: C.ink }}>
                    {s.title}
                    {s.priority && <span style={{ fontSize: 11, color: C.clayDeep, fontWeight: 700, marginLeft: 8 }}>· priority</span>}
                  </span>
                  <span style={{ display: "block", fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{s.note}</span>
                </span>
              </button>

              {/* Per-segment tightness — one tap, feeds the contracture heatmap. */}
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginLeft: 14, marginTop: -3 }}>
                {TIGHTNESS_OPTIONS.map((t) => {
                  const on = segTight[s.key]?.level === t.key;
                  return (
                    <button key={t.key} className="tw-focus" onClick={() => setTightness(s.key, t.key)}
                      style={{ border: `1.5px solid ${on ? t.color : C.line}`, background: on ? t.tint : C.surface,
                        color: on ? t.color : C.stone, borderRadius: 999, padding: "5px 11px", fontSize: 12, fontWeight: 700 }}>
                      {t.label}
                    </button>
                  );
                })}
                <button className="tw-focus" onClick={() => setNoteOpen((o) => ({ ...o, [s.key]: !o[s.key] }))}
                  style={{ border: "none", background: "none", color: C.stone, fontSize: 12, fontWeight: 600, padding: "5px 4px" }}>
                  {noteOpen[s.key] ? "− note" : "+ note"}
                </button>
              </div>
              {noteOpen[s.key] && (
                <input value={segTight[s.key]?.note || ""} onChange={(e) => setSegNote(s.key, e.target.value)}
                  placeholder={`Note on ${s.title.toLowerCase()}`} className="tw-focus tw-rise"
                  style={{ marginLeft: 14, width: "calc(100% - 14px)", background: "#fff", border: `1px solid ${C.line}`,
                    borderRadius: 10, padding: "8px 11px", fontSize: 13, color: C.ink }} />
              )}

              {/* Ankle dorsiflexion range — sits directly under the ankle ROM segment it measures. */}
              {s.key === "ankles" && (
                <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 14, padding: "14px 16px", marginLeft: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 5 }}>Ankle dorsiflexion — reaches neutral?</div>
                  <p style={{ fontSize: 13, color: C.ink, margin: "0 0 11px", lineHeight: 1.4 }}>
                    Does it reach neutral (90°)? If this is lost, standing is off the table — everything else is moot.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["neutral", "Reaches neutral"], ["tight", "Tight, short of it"], ["lost", "Not close"]].map(([v, label]) => (
                      <button key={v} className="tw-focus" onClick={() => setAnkle(v)}
                        style={{ flex: 1, border: `1.5px solid ${ankle === v ? C.clayDeep : C.line}`,
                          background: ankle === v ? "#fff" : C.surface, color: ankle === v ? C.clayDeep : C.inkSoft,
                          borderRadius: 12, padding: "11px 8px", fontSize: 13, fontWeight: 700, lineHeight: 1.25 }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {ankle === "lost" && (
                    <p className="tw-rise" style={{ fontSize: 12.5, color: C.clayDeep, margin: "11px 0 0", fontWeight: 600, lineHeight: 1.4 }}>
                      Flag this to the PT today. Contracture here ends the standing goal — it needs addressing before more loading work.
                    </p>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 7 }}>Anything tight or restricted today? (optional)</div>
        <textarea value={tight} onChange={(e) => setTight(e.target.value)} rows={2}
          placeholder="e.g. right shoulder short of full external rotation; hamstrings tight both sides"
          className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`,
            borderRadius: 10, padding: "10px 12px", fontSize: 14, color: C.ink, resize: "vertical", lineHeight: 1.4 }} />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 9 }}>Overnight splint (optional)</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Hours worn</div>
            <input type="number" min={0} max={14} value={splintHours} onChange={(e) => setSplintHours(e.target.value)}
              className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`,
                borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
          </div>
          <div style={{ flex: 1.4 }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Skin clear at removal?</div>
            <div style={{ display: "flex", gap: 7 }}>
              {[[true, "Yes"], [false, "No"]].map(([v, label]) => (
                <button key={label} className="tw-focus" onClick={() => setSkinClear(v)}
                  style={{ flex: 1, border: `1.5px solid ${skinClear === v ? (v ? C.sage : "#B15353") : C.line}`,
                    background: skinClear === v ? (v ? C.sageTint : "#F6E7E7") : "#fff",
                    color: skinClear === v ? (v ? C.sageDeep : "#8C3A3A") : C.inkSoft,
                    borderRadius: 10, padding: "10px 8px", fontSize: 13.5, fontWeight: 700 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {skinClear === false && (
          <p className="tw-rise" style={{ fontSize: 12.5, color: "#8C3A3A", margin: "11px 0 0", fontWeight: 600, lineHeight: 1.4 }}>
            Redness that hasn't faded within ~20 minutes means the splint needs refitting. Stop using it until it's checked.
          </p>
        )}
      </div>

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {canContinue ? "Primed · go to estimates" : "Answer the ankle check to continue"}
      </button>
    </div>
  );
}
