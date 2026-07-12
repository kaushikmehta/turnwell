import React, { useState } from "react";
import { C } from "../../constants";
import { SectionLabel } from "../shared";

export function Estimates({ items, onNext }) {
  const [values, setValues] = useState(() => Object.fromEntries(items.map((i) => [i.id, { estReps: "", estDiff: "" }])));

  const set = (id, field, v) => setValues({ ...values, [id]: { ...values[id], [field]: v } });
  const complete = items.every((i) => values[i.id].estReps !== "" && values[i.id].estDiff !== "");

  const submit = () => {
    const out = {};
    items.forEach((i) => { out[i.id] = { estReps: Number(values[i.id].estReps), estDiff: Number(values[i.id].estDiff) }; });
    onNext(out);
  };

  return (
    <div className="tw-rise">
      <SectionLabel>Estimates</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 8px" }}>His own estimates</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 14.5, lineHeight: 1.4 }}>
        Ask him, for each exercise: how many reps can he do, and how hard does he think it'll be (1–10)?
        Don't accept a hedge — draw out a real number. A "5" is a fine answer.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
        {items.map((it) => (
          <div key={it.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 10 }}>{it.title}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Estimated reps</div>
                <input type="number" min={0} value={values[it.id].estReps} onChange={(e) => set(it.id, "estReps", e.target.value)}
                  className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Estimated difficulty (1–10)</div>
                <input type="number" min={1} max={10} value={values[it.id].estDiff} onChange={(e) => set(it.id, "estDiff", e.target.value)}
                  className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="tw-focus tw-lift" disabled={!complete} onClick={submit}
        style={{ width: "100%", background: complete ? C.clay : C.line, color: complete ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: complete ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {complete ? "Start the first exercise" : "Fill in every estimate to continue"}
      </button>
    </div>
  );
}
