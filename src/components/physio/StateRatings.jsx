import React from "react";
import { C, STATE_METRICS, STATE_RATERS } from "../../constants";

/* Tiredness / Mood / Motivation, each rated 1–10 by both Akki (self) and the
   facilitator (observed). Used identically at the opening (before) and the
   closing (after) so the two timepoints line up for comparison. */
export function StateRatings({ value, onChange }) {
  const set = (metric, rater, v) => onChange({ ...value, [metric]: { ...value[metric], [rater]: v } });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
        <div style={{ flex: 1.2 }} />
        {STATE_RATERS.map((r) => (
          <div key={r.key} style={{ flex: 1, fontSize: 11.5, color: C.stone, fontWeight: 700, textAlign: "center" }}>{r.label}</div>
        ))}
      </div>
      {STATE_METRICS.map((m) => (
        <div key={m.key} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: 13.5, color: C.inkSoft }}>{m.label}</div>
            {m.hint && <div style={{ fontSize: 11, color: C.stone, marginTop: 1, lineHeight: 1.3 }}>{m.hint}</div>}
          </div>
          {STATE_RATERS.map((r) => (
            <input key={r.key} type="number" min={1} max={10} value={value[m.key][r.key]}
              onChange={(e) => set(m.key, r.key, e.target.value)}
              aria-label={`${m.label} — ${r.label}`}
              className="tw-focus" style={{ flex: 1, width: "100%", minWidth: 0, background: "#fff",
                border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink, textAlign: "center" }} />
          ))}
        </div>
      ))}
    </div>
  );
}
