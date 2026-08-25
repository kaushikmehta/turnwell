/*
 * Human-readable summary of a recorded assessment payload. Shared by the
 * pre-submit review step (Assessment.jsx) and the dashboard detail view, so the
 * two never drift. Returns { title, lines: [{ label, value }] }.
 */
import {
  ASSESSMENT_TYPES, SATCO_CONTROLS, TARDIEU_MUSCLES, GONIOMETRY_MOTIONS,
  coughFlowBand, GAS_LEVELS, COGNITIVE_INSTRUMENTS,
} from "../../constants";

const muscleLabel = (k) => TARDIEU_MUSCLES.find((m) => m.key === k)?.label || k;
const motionLabel = (k) => GONIOMETRY_MOTIONS.find((m) => m.key === k)?.label || k;

export function summarizeAssessment(payload) {
  const type = payload.assessment_type;
  const meta = ASSESSMENT_TYPES.find((t) => t.key === type);
  const lines = [];

  if (type === "satco" && payload.satco) {
    SATCO_CONTROLS.forEach((c) => lines.push({ label: `${c.label} level`, value: `${payload.satco[`${c.key}_level`]}/8` }));
  } else if (type === "tardieu") {
    (payload.tardieu_records || []).forEach((r) => lines.push({
      label: `${muscleLabel(r.muscle_group)} · ${r.side}`,
      value: `R1 ${r.r1_degrees}° · R2 ${r.r2_degrees}° · Δ${r.r2_minus_r1 ?? (r.r2_degrees - r.r1_degrees)}° · Q${r.quality_grade}`,
    }));
  } else if (type === "goniometry" && payload.goniometry) {
    Object.entries(payload.goniometry).forEach(([k, v]) => {
      const parts = [];
      if (v.left != null) parts.push(`L ${v.left}°`);
      if (v.right != null) parts.push(`R ${v.right}°`);
      if (parts.length) lines.push({ label: motionLabel(k), value: parts.join(" · ") });
    });
  } else if (type === "peak_cough_flow" && payload.peak_cough_flow) {
    const v = payload.peak_cough_flow.best_of_three_l_min;
    lines.push({ label: "Best of three", value: `${v} L/min — ${coughFlowBand(v).label}` });
  } else if (type === "tis" && payload.tis) {
    ["static", "dynamic", "coordination"].forEach((k) => payload.tis[k] != null && lines.push({ label: k, value: String(payload.tis[k]) }));
    lines.push({ label: "Total", value: `${payload.tis.total}/23` });
  } else if (type === "scim3" && payload.scim3) {
    lines.push({ label: "Total", value: `${payload.scim3.total}/100` });
    if (payload.scim3.notes) lines.push({ label: "Notes", value: payload.scim3.notes });
  } else if (type === "gas") {
    (payload.gas || []).forEach((g) => lines.push({ label: g.goal, value: (GAS_LEVELS.find((l) => l.level === g.level)?.label) || String(g.level) }));
  } else if (type === "fss" && payload.fss) {
    lines.push({ label: "Mean", value: String(payload.fss.mean) });
  } else if (type === "cognitive_external" && payload.cognitive_external) {
    const c = payload.cognitive_external;
    lines.push({ label: "Instrument", value: (COGNITIVE_INSTRUMENTS.find((i) => i.key === c.instrument)?.label) || c.instrument });
    lines.push({ label: "Score", value: String(c.total_score) });
    if (c.date) lines.push({ label: "Date", value: c.date });
    if (c.administrator) lines.push({ label: "Administrator", value: c.administrator });
    if (c.notes) lines.push({ label: "Notes", value: c.notes });
  }

  return { title: meta?.label || type, lines };
}
