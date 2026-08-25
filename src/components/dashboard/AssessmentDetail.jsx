/*
 * Full-page detail for a recorded assessment — the same readable summary used
 * in the pre-submit review, plus the recorded date.
 */
import React from "react";
import { C } from "../../constants";
import { summarizeAssessment } from "../physio/assessmentSummary";
import { fmtDateLong } from "./metrics";

export function AssessmentDetail({ session }) {
  if (!session) return null;
  const p = session.payload || {};
  const summary = summarizeAssessment(p);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <h3 className="tw-serif" style={{ fontSize: 22, margin: 0 }}>{summary.title}</h3>
        <span style={{ fontSize: 12.5, color: C.stone, fontWeight: 600 }}>{fmtDateLong(session.at)} · recorded</span>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "8px 18px" }}>
        {summary.lines.length === 0 && <p style={{ fontSize: 13.5, color: C.stone, padding: "10px 0" }}>No fields captured.</p>}
        {summary.lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: i < summary.lines.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <span style={{ fontSize: 13, color: C.inkSoft, textTransform: "capitalize" }}>{l.label}</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 600, textAlign: "right" }}>{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
