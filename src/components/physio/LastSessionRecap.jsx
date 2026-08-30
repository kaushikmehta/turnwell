import React from "react";
import { C, unitLabel, INVOLVEMENT } from "../../constants";

/* Read-only recap of the previous session's exercises — what was done, the reps
   actually logged, the difficulty, and the involvement scored. Shown at setup
   (as a reference) and live at the opening (as a reminder of where to pick up).
   `session` is a finished physio training payload: { at, results: [...] }. */

const invLabel = (score) => (score == null ? null : INVOLVEMENT.find((l) => l.score === score)?.label || `Inv ${score}`);
const invColor = (score) => (score == null ? C.stone : INVOLVEMENT.find((l) => l.score === score)?.color || C.stone);

export function lastSessionExercises(session) {
  if (!session) return [];
  return (session.results || []).filter(Boolean).map((r) => ({
    id: r.id, title: r.title, unit: r.unit,
    actReps: r.actReps, actDiff: r.actDiff, involvement: r.involvement ?? null,
  }));
}

export function LastSessionRecap({ session, title = "Last session", subtitle, compact }) {
  const rows = lastSessionExercises(session);
  if (rows.length === 0) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: subtitle ? 4 : 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sage }}>{title}</div>
        <div style={{ fontSize: 11.5, color: C.stone, fontWeight: 600 }}>{rows.length} exercise{rows.length > 1 ? "s" : ""}</div>
      </div>
      {subtitle && <p style={{ fontSize: 12, color: C.inkSoft, margin: "0 0 11px", lineHeight: 1.45 }}>{subtitle}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 6 : 8 }}>
        {rows.map((r, i) => {
          const inv = invLabel(r.involvement);
          return (
            <div key={r.id ?? i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
              border: `1px solid ${C.line}`, borderRadius: 11, padding: "9px 12px", background: "#fff" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
              <span style={{ fontSize: 12, color: C.inkSoft, fontWeight: 600, flexShrink: 0, textAlign: "right" }}>
                {r.actReps != null ? `${r.actReps} ${unitLabel(r.unit)}` : "—"}
                {r.actDiff != null ? ` · diff ${r.actDiff}/10` : ""}
                {inv ? <span style={{ color: invColor(r.involvement) }}>{` · ${inv}`}</span> : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
