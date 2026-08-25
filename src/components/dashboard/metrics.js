/*
 * Pure derivation of physio dashboard metrics from stored session payloads.
 * No React here — just shapes the raw `sessions` rows into the numbers the
 * charts and detail panel render. Mirrors the clinical logic in report.js.
 */
import {
  STATE_METRICS, STATE_RATERS, INVOLVEMENT, unitLabel,
  isDiscounted, discountReason, ROM_SEGMENTS, TIGHTNESS_OPTIONS, TARDIEU_MUSCLES, skinCheckAlerts,
} from "../../constants";

export const STANDING_CEILING = 20; // minutes — the documented cap
export const INVOLVEMENT_GATE = 3;  // a 3 is the gate to ramp standing / reduce support

// Raw rating values are stored as strings ("7"), numbers, or "—"/"" when skipped.
function num(v) {
  if (v === "" || v == null || v === "—") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// DB rows -> sessions for one domain, oldest first (charts read left→right).
// `domain` is attached so an opened session can be routed to the right detail.
export function toDomainSessions(rows, domain) {
  return rows
    .filter((r) => r.domain === domain && r.payload)
    .map((r) => ({
      id: r.id,
      at: r.payload.at ?? (r.performedAt ? new Date(r.performedAt).getTime() : 0),
      payload: r.payload,
      domain,
    }))
    .sort((a, b) => a.at - b.at);
}

// Physio training sessions only — assessment rows (payload.kind === 'assessment')
// live in the same table/domain but are surfaced separately, not as session cards.
export const toPhysioSessions = (rows) =>
  toDomainSessions(rows, "physio").filter((s) => (s.payload?.kind ?? "session") !== "assessment");

// The recorded clinical/periodic instruments, newest first.
export const toPhysioAssessments = (rows) =>
  toDomainSessions(rows, "physio")
    .filter((s) => s.payload?.kind === "assessment")
    .sort((a, b) => b.at - a.at);

// Per-session metrics for the cue-ladder domains (speech, reading). Both score
// 0 (independent) … 4 (not yet), so independence % and average support are
// comparable across them. `ratings` is RATINGS or READING_RATINGS.
export function languageMetrics(s, ratings) {
  const results = s.payload?.results || [];
  const total = results.length;
  const counts = Object.fromEntries(ratings.map((rt) => [rt.key, 0]));
  let scoreSum = 0, scored = 0;
  results.forEach((r) => {
    if (counts[r.rating] != null) counts[r.rating] += 1;
    const rt = ratings.find((x) => x.key === r.rating);
    if (rt) { scoreSum += rt.score; scored += 1; }
  });
  const independent = counts.independent || 0;
  return {
    id: s.id,
    at: s.at,
    total,
    independent,
    independencePct: total ? Math.round((independent / total) * 100) : null,
    avgSupport: scored ? scoreSum / scored : null,
    counts,
  };
}

const maxOrNull = (arr) => (arr.length ? Math.max(...arr) : null);

// Per-session headline metrics.
export function sessionMetrics(s) {
  const p = s.payload || {};
  const results = p.results || [];
  const involvements = results.map((r) => r.involvement).filter((v) => typeof v === "number");
  const bestInvolvement = maxOrNull(involvements);
  // Stim-on and stim-off involvement must never be merged (§4.5): the "3" gate
  // evaluates each series independently, and the gap between them is the real
  // recovery signal.
  const invOff = results.filter((r) => typeof r.involvement === "number" && r.stim_state !== "on").map((r) => r.involvement);
  const invOn = results.filter((r) => typeof r.involvement === "number" && r.stim_state === "on").map((r) => r.involvement);
  const green = results.filter((r) => r.tick === "green").length;
  const total = results.length;
  const standingTotal = results.reduce((t, r) => t + (r.standing ? r.standing.minutes || 0 : 0), 0);

  // Predominant knee position across standing items this session.
  const kneeCounts = {};
  results.forEach((r) => { if (r.standing?.knee_position) kneeCounts[r.standing.knee_position] = (kneeCounts[r.standing.knee_position] || 0) + 1; });
  const kneePredominant = Object.keys(kneeCounts).sort((a, b) => kneeCounts[b] - kneeCounts[a])[0] || null;
  const weightPct = maxOrNull(results.map((r) => r.standing?.weight_bearing_pct).filter((v) => typeof v === "number"));

  const fp = p.closing?.fadeProbe || null;
  const discounted = isDiscounted(p.openingState);

  return {
    id: s.id,
    at: s.at,
    exerciseCount: total,
    bestInvolvement,
    bestInvolvementOff: maxOrNull(invOff),
    bestInvolvementOn: maxOrNull(invOn),
    green,
    yellow: total - green,
    greenPct: total ? Math.round((green / total) * 100) : null,
    standingTotal,
    kneePredominant,
    weightPct,
    fadeFadedTo: fp && typeof fp.faded_to_support_level === "number" ? fp.faded_to_support_level : null,
    fadeHeld: fp && typeof fp.held_seconds === "number" ? fp.held_seconds : null,
    discounted,
    discountReason: discounted ? discountReason(p.openingState) : null,
    stimUsed: !!p.stim?.used,
  };
}

// Per-segment tightness for the priming heatmap. Returns a color+title cell or
// null (segment not logged that session).
export function tightnessCell(session, segKey) {
  const t = session.payload?.priming?.rom?.tightness?.[segKey];
  if (!t || !t.level) return null;
  const opt = TIGHTNESS_OPTIONS.find((o) => o.key === t.level);
  if (!opt) return null;
  return { color: opt.color, level: t.level, note: t.note || "", label: opt.label };
}

// Segments logged tighter_than_usual+ in >=3 of the last 5 sessions -> alert (§4.1).
export function tightnessAlerts(sessions) {
  const recent = sessions.slice(-5);
  const alerts = [];
  ROM_SEGMENTS.forEach((seg) => {
    const flagged = recent.filter((s) => {
      const c = tightnessCell(s, seg.key);
      return c && (c.level === "tighter_than_usual" || c.level === "catch_felt");
    }).length;
    if (flagged >= 3) alerts.push({ segment: seg.title, count: flagged });
  });
  return alerts;
}

// Latest Tardieu record per muscle+side, with the R2-R1 gap (§5.2).
export function tardieuLatest(assessments) {
  const byKey = {};
  assessments
    .filter((a) => a.payload.assessment_type === "tardieu")
    .sort((a, b) => a.at - b.at) // oldest first so later overwrite
    .forEach((a) => {
      (a.payload.tardieu_records || []).forEach((r) => {
        byKey[`${r.muscle_group}|${r.side}`] = { ...r, at: a.at };
      });
    });
  return Object.values(byKey).map((r) => ({
    ...r,
    muscleLabel: TARDIEU_MUSCLES.find((m) => m.key === r.muscle_group)?.label || r.muscle_group,
    gap: r.r2_minus_r1 != null ? r.r2_minus_r1 : (r.r2_degrees - r.r1_degrees),
  }));
}

// Standing-progression safety gate (§6): no ramp while a skin alert is open,
// or while flexed/suspended knees dominate the last 3 standing sessions. Returns
// a reason string to display, or null when it's safe to progress.
export function standingSafety(sessions) {
  const withStanding = sessions.filter((s) => (s.payload?.results || []).some((r) => r.standing));
  if (!withStanding.length) return null;
  const last = withStanding[withStanding.length - 1];
  const openSkinAlert = (last.payload.results || []).some((r) => r.standing && skinCheckAlerts(r.standing.saddle_skin_check));
  if (openSkinAlert) return "an unresolved saddle skin alert is open — clear it with the care team before adding standing minutes";
  const recent3 = withStanding.slice(-3);
  const suspended = recent3.filter((s) => {
    const m = sessionMetrics(s);
    return m.kneePredominant === "flexed_suspended";
  }).length;
  if (recent3.length >= 2 && suspended > recent3.length / 2) {
    return "knees were flexed/suspended in the majority of recent sessions — that's the harness bearing load, not the legs. Fix position before adding duration";
  }
  return null;
}

// SATCo levels over time as three series on the support-level axis (§5.1, §7).
export function satcoSeries(assessments) {
  return assessments
    .filter((a) => a.payload.assessment_type === "satco" && a.payload.satco)
    .sort((a, b) => a.at - b.at)
    .map((a) => ({ id: a.id, at: a.at, satco: a.payload.satco }));
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
    category: r.category || "active_training",
    involvement: typeof r.involvement === "number" ? r.involvement : null,
    probe: r.probe || null,
    standing: r.standing || null,
    sitting: r.sitting || null,
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
