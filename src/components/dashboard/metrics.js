/*
 * Pure derivation of physio dashboard metrics from stored session payloads.
 * No React here — just shapes the raw `sessions` rows into the numbers the
 * charts and detail panel render. Mirrors the clinical logic in report.js.
 */
import { STATE_METRICS, STATE_RATERS, INVOLVEMENT, unitLabel } from "../../constants";

export const STANDING_CEILING = 20; // minutes — the documented cap
export const INVOLVEMENT_GATE = 3;  // a 3 is the gate to ramp standing / reduce support

// Raw rating values are stored as strings ("7"), numbers, or "—"/"" when skipped.
function num(v) {
  if (v === "" || v == null || v === "—") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// DB rows -> physio sessions, oldest first (charts read left→right in time).
export function toPhysioSessions(rows) {
  return rows
    .filter((r) => r.domain === "physio" && r.payload)
    .map((r) => ({
      id: r.id,
      at: r.payload.at ?? (r.performedAt ? new Date(r.performedAt).getTime() : 0),
      payload: r.payload,
    }))
    .sort((a, b) => a.at - b.at);
}

// Per-session headline metrics.
export function sessionMetrics(s) {
  const p = s.payload || {};
  const results = p.results || [];
  const involvements = results.map((r) => r.involvement).filter((v) => typeof v === "number");
  const bestInvolvement = involvements.length ? Math.max(...involvements) : null;
  const green = results.filter((r) => r.tick === "green").length;
  const total = results.length;
  const standingTotal = results.reduce((t, r) => t + (r.standing ? r.standing.minutes || 0 : 0), 0);

  return {
    id: s.id,
    at: s.at,
    exerciseCount: total,
    bestInvolvement,
    green,
    yellow: total - green,
    greenPct: total ? Math.round((green / total) * 100) : null,
    standingTotal,
  };
}

// Before/after state as a tidy structure for the slope panel:
// [{ key, label, patient:{before,after}, facilitator:{before,after} }]
export function stateDeltas(payload) {
  const before = payload?.before;
  const after = payload?.after;
  if (!before && !after) return [];
  return STATE_METRICS.map((m) => {
    const row = { key: m.key, label: m.label };
    STATE_RATERS.forEach((r) => {
      row[r.key] = {
        before: num(before?.[m.key]?.[r.key]),
        after: num(after?.[m.key]?.[r.key]),
      };
    });
    return row;
  }).filter((row) => STATE_RATERS.some((r) => row[r.key].before != null || row[r.key].after != null));
}

// Per-exercise rows for the detail table — the "what was done and the scores".
export function exerciseRows(payload) {
  return (payload?.results || []).map((r) => ({
    title: r.title,
    unit: unitLabel(r.unit),
    actReps: r.actReps,
    estReps: r.estReps,
    actDiff: r.actDiff,
    estDiff: r.estDiff,
    tick: r.tick, // "green" | "yellow"
    involvement: typeof r.involvement === "number" ? r.involvement : null,
    standing: r.standing || null,
    namedExercise: r.namedExercise ?? null,
    understood: r.understood ?? null,
    dualTask: !!r.dualTask,
  }));
}

export const involvementColor = (score) =>
  score == null ? "#8A9389" : (INVOLVEMENT.find((i) => i.score === score)?.color || "#8A9389");
export const involvementLabel = (score) =>
  score == null ? "—" : (INVOLVEMENT.find((i) => i.score === score)?.label || String(score));

export const fmtDate = (at) =>
  new Date(at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
export const fmtDateLong = (at) =>
  new Date(at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
