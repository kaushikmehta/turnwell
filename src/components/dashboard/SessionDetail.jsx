/*
 * Per-session physio detail — what was done and the scores for one session.
 * Renders the exercise-by-exercise performance plus session context (star,
 * recall, ankle/ROM, closing) and the before→after state slopes.
 */
import React from "react";
import { C, isDiscounted, discountReason } from "../../constants";
import { StateSlopes } from "./charts";
import { exerciseRows, stateDeltas, involvementColor, involvementLabel, fmtDateLong, INVOLVEMENT_GATE } from "./metrics";

const AWARE = { yes: "Yes", partly: "Partly", no: "No" };

function Stat({ label, value, accent }) {
  return (
    <div style={{ flex: "1 1 auto" }}>
      <div style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accent || C.ink }}>{value}</div>
    </div>
  );
}

function Chip({ color, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: C.ink }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />{children}
    </span>
  );
}

export function SessionDetail({ session }) {
  if (!session) return null;
  const p = session.payload || {};
  const rows = exerciseRows(p);
  const state = stateDeltas(p);
  const green = rows.filter((r) => r.tick === "green").length;
  const best = rows.reduce((m, r) => (r.involvement != null && (m == null || r.involvement > m) ? r.involvement : m), null);
  const standingTotal = rows.reduce((t, r) => t + (r.standing ? r.standing.minutes || 0 : 0), 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
        <h3 className="tw-serif" style={{ fontSize: 22, margin: 0 }}>{fmtDateLong(session.at)}</h3>
        {p.star?.title && <span style={{ fontSize: 12.5, color: C.clayDeep, fontWeight: 700 }}>★ Star: {p.star.title}</span>}
      </div>

      {isDiscounted(p.openingState) && (
        <div style={{ background: C.paper, border: `1.5px solid ${C.clay}`, borderRadius: 12, padding: "10px 13px", marginBottom: 12 }}>
          <span style={{ fontSize: 12.5, color: C.clayDeep, fontWeight: 700 }}>Discounted session · {discountReason(p.openingState)} — excluded from the progression gate.</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 14, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
        <Stat label="Exercises" value={rows.length} />
        <Stat label="Best involvement" value={involvementLabel(best)} accent={involvementColor(best)} />
        <Stat label="Prediction matched" value={`${green}/${rows.length}`} />
        <Stat label="Standing" value={`${standingTotal} min`} />
      </div>

      {best != null && best >= INVOLVEMENT_GATE && (
        <div style={{ background: C.sageTint, border: `1px solid ${C.sage}`, borderRadius: 12, padding: "10px 12px", marginBottom: 14, fontSize: 13, color: C.sageDeep }}>
          A {best} appeared this session. If it repeats across sessions, that's the gate to ramp standing time or reduce support.
        </div>
      )}

      {/* Per-exercise */}
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "11px 13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700 }}>{i + 1}. {r.title}</span>
              <Chip color={involvementColor(r.involvement)}>{involvementLabel(r.involvement)}</Chip>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 6, fontSize: 12.5, color: C.inkSoft }}>
              <span>{r.actReps} {r.unit} <span style={{ color: C.stone }}>(est {r.estReps})</span></span>
              <span>
                Difficulty {r.actDiff}/10 <span style={{ color: C.stone }}>(pred {r.estDiff})</span>
                <span style={{ marginLeft: 6, color: r.tick === "green" ? C.sage : C.clay, fontWeight: 700 }}>
                  {r.tick === "green" ? "✓ matched" : "✗ off"}
                </span>
              </span>
              {r.standing && <span>Standing {r.standing.minutes} min{r.standing.knee_position ? ` · ${r.standing.knee_position.replace(/_/g, " ")}` : r.standing.quality ? ` · ${r.standing.quality}` : ""}</span>}
              {r.sitting && r.sitting.support_level != null && <span>Support {r.sitting.support_level}/8</span>}
              {r.namedExercise != null && <span>Named: {AWARE[r.namedExercise] || r.namedExercise}</span>}
              {r.understood != null && <span>Purpose: {AWARE[r.understood] || r.understood}</span>}
              {r.dualTask && <span style={{ color: C.indigo, fontWeight: 700 }}>dual-task</span>}
            </div>
          </div>
        ))}
      </div>

      {/* State before→after */}
      <div style={{ marginTop: 14 }}>
        <StateSlopes rows={state} />
      </div>

      {/* Context */}
      <div style={{ marginTop: 14, fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>
        {p.recall && p.recall.total > 0 && (
          <p style={{ margin: "0 0 6px" }}>Recall of last session: {p.recall.recalled} of {p.recall.total}.</p>
        )}
        {p.priming?.ankle && (
          <p style={{ margin: "0 0 6px" }}>
            Ankle: {p.priming.ankle === "neutral" ? "reaches neutral" : p.priming.ankle === "tight" ? "tight, short of neutral" : "not close to neutral"}
            {p.priming.ankle === "lost" && <strong style={{ color: C.clayDeep }}> — flagged: contracture here blocks standing.</strong>}
          </p>
        )}
        {p.closing?.favouriteTitle && <p style={{ margin: "0 0 6px" }}>Favourite: {p.closing.favouriteTitle}{p.closing.favouriteWhy ? ` — ${p.closing.favouriteWhy}` : ""}</p>}
        {p.closing?.notes?.trim() && <p style={{ margin: "6px 0 0", color: C.ink }}>Notes: {p.closing.notes.trim()}</p>}
      </div>
    </div>
  );
}
