import React, { useState } from "react";
import { C, PHASE_ORDER, PHASE_LABELS } from "../constants";
import { BackBtn, SectionLabel, Ico } from "./shared";

export function PhysioSetup({ physioBank, start, back }) {
  const approved = physioBank.filter((e) => e.approved);
  const [selected, setSelected] = useState(new Set(approved.map((e) => e.id)));

  const toggle = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const togglePhase = (phase) => {
    const ids = approved.filter((e) => e.phase === phase).map((e) => e.id);
    const allOn = ids.every((id) => selected.has(id));
    const n = new Set(selected);
    ids.forEach((id) => (allOn ? n.delete(id) : n.add(id)));
    setSelected(n);
  };

  const count = PHASE_ORDER.reduce(
    (sum, phase) => sum + approved.filter((e) => e.phase === phase && selected.has(e.id)).length, 0
  );

  const begin = () => {
    const items = PHASE_ORDER.flatMap((phase) =>
      approved.filter((e) => e.phase === phase && selected.has(e.id))
    );
    start(items);
  };

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Set up the session</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>
        Select exercises for today. They run in order: warm-up → active → cool-down.
      </p>

      {PHASE_ORDER.map((phase) => {
        const exercises = approved.filter((e) => e.phase === phase);
        if (!exercises.length) return null;
        const allOn = exercises.every((e) => selected.has(e.id));
        return (
          <div key={phase} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <SectionLabel>{PHASE_LABELS[phase]}</SectionLabel>
              <button className="tw-focus" onClick={() => togglePhase(phase)}
                style={{ fontSize: 12.5, fontWeight: 700, color: C.sage, background: "none", border: "none", padding: "2px 4px" }}>
                {allOn ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {exercises.map((e) => (
                <label key={e.id} className="tw-focus"
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                    background: selected.has(e.id) ? C.sageTint : C.surface,
                    border: `1.5px solid ${selected.has(e.id) ? C.sage : C.line}`,
                    borderRadius: 14, padding: "13px 15px" }}>
                  <input type="checkbox" checked={selected.has(e.id)} onChange={() => toggle(e.id)}
                    style={{ width: 18, height: 18, accentColor: C.sage, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{e.prompt}</div>
                    <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>
                      {e.instruction.length > 90 ? e.instruction.slice(0, 90) + "…" : e.instruction}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <button className="tw-focus tw-lift" disabled={count === 0} onClick={begin}
        style={{ width: "100%", background: count ? C.clay : C.line, color: count ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: count ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {count ? `Begin session · ${count} exercise${count > 1 ? "s" : ""}` : "Select at least one exercise"}
      </button>
    </div>
  );
}
