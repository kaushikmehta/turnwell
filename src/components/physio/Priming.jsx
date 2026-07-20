import React, { useState } from "react";
import { C, PRIMING_STEPS } from "../../constants";
import { SectionLabel } from "../shared";
import { Metronome } from "./Metronome";

/* Block A — priming.
   Purpose: start the working block already warm, already loaded, already awake.
   PT-led for now; hands over to the attendants once they're trained.

   The ankle question is the one that matters most. If dorsiflexion is lost,
   standing becomes mechanically impossible regardless of neural progress —
   so it gets asked out loud, every session, and lands in the report. */
export function Priming({ onNext }) {
  const [done, setDone] = useState({});
  const [ankle, setAnkle] = useState(null);
  const [alertness, setAlertness] = useState("");
  const [splintHours, setSplintHours] = useState("");
  const [skinClear, setSkinClear] = useState(null);

  const toggle = (k) => setDone((d) => ({ ...d, [k]: !d[k] }));
  const allDone = PRIMING_STEPS.every((s) => done[s.key]);
  const canContinue = allDone && ankle != null;

  const submit = () => onNext({
    steps: done,
    ankle,
    alertness: alertness === "" ? null : Number(alertness),
    splint: splintHours === "" ? null : { hours: Number(splintHours), skinClear },
  });

  return (
    <div className="tw-rise">
      <SectionLabel>Block A · Priming</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 6px" }}>Prime before you begin</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.45 }}>
        Twenty minutes here buys a better forty-five minutes after it.
      </p>

      <Metronome />

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
        {PRIMING_STEPS.map((s) => {
          const on = !!done[s.key];
          return (
            <button key={s.key} className="tw-focus" onClick={() => toggle(s.key)}
              style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start",
                background: on ? C.sageTint : C.surface, border: `1.5px solid ${on ? C.sage : C.line}`,
                borderRadius: 14, padding: "13px 15px", width: "100%" }}>
              <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                border: `2px solid ${on ? C.sageDeep : C.line}`, background: on ? C.sageDeep : "transparent",
                color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: "17px", textAlign: "center" }}>
                {on ? "✓" : ""}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: C.ink }}>{s.title}</span>
                <span style={{ display: "block", fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{s.note}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 5 }}>Ankle dorsiflexion</div>
        <p style={{ fontSize: 13.5, color: C.ink, margin: "0 0 11px", lineHeight: 1.4 }}>
          Does the ankle reach neutral (90°)? If this is lost, standing is off the table — everything else is moot.
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

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
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

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 5 }}>Alertness right now (1–10, optional)</div>
        <input type="number" min={1} max={10} value={alertness} onChange={(e) => setAlertness(e.target.value)}
          className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`,
            borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
      </div>

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {canContinue ? "Primed · go to opening" : "Work through priming to continue"}
      </button>
    </div>
  );
}
