/*
 * Physio overview — trend charts + a summary card per session, in the handoff
 * §7 priority order: primary-goal (fade probe + SATCo) first, then involvement
 * (stim-split, discount-dimmed), standing, tightness heatmap, Tardieu, and
 * prediction accuracy. Opening a card is lifted to the Dashboard shell.
 */
import React, { useMemo, useState } from "react";
import { C, ROM_SEGMENTS, KNEE_POSITIONS, ASSESSMENT_TYPES } from "../../constants";
import { LineTrend, BarTrend, MultiLineTrend, Heatmap } from "./charts";
import {
  toPhysioSessions, toPhysioAssessments, sessionMetrics, involvementColor, involvementLabel,
  fmtDateLong, fmtDate, STANDING_CEILING, INVOLVEMENT_GATE,
  tightnessCell, tightnessAlerts, tardieuLatest, satcoSeries, standingSafety,
} from "./metrics";

const KNEE_COLOR = { extended: C.sage, intermittent_buckling: C.clay, flexed_suspended: "#B15353" };

function CardStat({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: C.stone, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: accent || C.ink }}>{value}</div>
    </div>
  );
}

function SessionCard({ m, session, onOpen }) {
  return (
    <button className="tw-focus tw-lift" onClick={() => onOpen(session)}
      style={{ textAlign: "left", background: C.surface, border: `1px solid ${m.discounted ? C.clay : C.line}`, borderRadius: 14, padding: "13px 15px", cursor: "pointer", opacity: m.discounted ? 0.75 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{fmtDateLong(m.at)}</span>
        {m.discounted
          ? <span style={{ fontSize: 10.5, color: C.clayDeep, fontWeight: 700 }}>discounted · {m.discountReason}</span>
          : <span style={{ color: C.stone, fontSize: 18, lineHeight: 1 }}>›</span>}
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <CardStat label="Best involvement" value={involvementLabel(m.bestInvolvement)} accent={involvementColor(m.bestInvolvement)} />
        <CardStat label="Standing" value={`${m.standingTotal} min`} />
        <CardStat label="Fade → " value={m.fadeFadedTo != null ? `${m.fadeFadedTo}/8` : "—"} />
        {m.stimUsed && <CardStat label="xStep" value="on" accent={C.indigo} />}
      </div>
    </button>
  );
}

export function PhysioOverview({ rows, onOpen }) {
  const [selId, setSelId] = useState(null);
  const sessions = useMemo(() => toPhysioSessions(rows), [rows]);
  const assessments = useMemo(() => toPhysioAssessments(rows), [rows]);
  const metrics = useMemo(() => sessions.map(sessionMetrics), [sessions]);

  if (!sessions.length && !assessments.length) {
    return <p style={{ color: C.stone }}>No physio sessions yet. Run one and it'll appear here.</p>;
  }

  const effSel = selId && sessions.some((s) => s.id === selId) ? selId : (sessions.length ? sessions[sessions.length - 1].id : null);
  const dimIds = new Set(metrics.filter((m) => m.discounted).map((m) => m.id));
  const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));
  const cards = [...metrics].reverse();

  // ---- 1. Primary goal — fade probe faded-to + SATCo overlay on the 0–8 axis
  const satco = satcoSeries(assessments);
  const fadeSlots = metrics.filter((m) => m.fadeFadedTo != null).map((m) => ({ id: m.id, at: m.at }));
  const satcoSlots = satco.map((a) => ({ id: a.id, at: a.at }));
  const primarySlots = [...fadeSlots, ...satcoSlots].sort((a, b) => a.at - b.at);
  const primarySeries = [
    { key: "fade", label: "Fade — faded to", color: C.indigo, values: Object.fromEntries(metrics.filter((m) => m.fadeFadedTo != null).map((m) => [m.id, m.fadeFadedTo])) },
    { key: "satco_static", label: "SATCo static", color: C.sage, stepped: true, values: Object.fromEntries(satco.map((a) => [a.id, a.satco.static_level])) },
    { key: "satco_active", label: "SATCo active", color: C.clay, stepped: true, values: Object.fromEntries(satco.map((a) => [a.id, a.satco.active_level])) },
    { key: "satco_reactive", label: "SATCo reactive", color: C.stone, stepped: true, values: Object.fromEntries(satco.map((a) => [a.id, a.satco.reactive_level])) },
  ].filter((s) => Object.keys(s.values).length > 0);

  // ---- 2. Involvement, stim-split, discount-dimmed
  const invSlots = metrics.map((m) => ({ id: m.id, at: m.at }));
  const invSeries = [
    { key: "off", label: "Stim off", color: C.sageDeep, values: Object.fromEntries(metrics.filter((m) => m.bestInvolvementOff != null).map((m) => [m.id, m.bestInvolvementOff])) },
    { key: "on", label: "Stim on", color: C.indigo, dashed: true, values: Object.fromEntries(metrics.filter((m) => m.bestInvolvementOn != null).map((m) => [m.id, m.bestInvolvementOn])) },
  ].filter((s) => Object.keys(s.values).length > 0);

  // ---- 3. Standing minutes, coloured by predominant knee position
  const standingData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.standingTotal, knee: m.kneePredominant }));
  const standMax = Math.max(STANDING_CEILING, ...standingData.map((d) => d.y || 0));

  // ---- 5. Tardieu latest per muscle
  const tardieu = tardieuLatest(assessments);
  const tAlerts = tightnessAlerts(sessions);

  // ---- 6. Prediction accuracy
  const greenData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.greenPct }));

  const safety = standingSafety(sessions);

  return (
    <>
      {/* Assessments — recorded instruments, up top and openable */}
      {assessments.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: C.ink }}>
            Assessments <span style={{ color: C.stone, fontWeight: 600 }}>· {assessments.length}</span>
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
            {assessments.map((a) => {
              const meta = ASSESSMENT_TYPES.find((t) => t.key === a.payload.assessment_type);
              return (
                <button key={a.id} className="tw-focus tw-lift" onClick={() => onOpen(a)}
                  style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{meta?.label || a.payload.assessment_type}</span>
                    <span style={{ color: C.stone, fontSize: 16, lineHeight: 1 }}>›</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.stone, marginTop: 2 }}>{fmtDate(a.at)}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tardieu R1/R2 — from assessments, shown even without training sessions */}
      {tardieu.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 16px", marginBottom: 24 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>Tardieu — R1 / R2 (latest)</div>
          <div style={{ fontSize: 11.5, color: C.stone, marginBottom: 10 }}>The R2−R1 gap is the clinically meaningful object · falling R2 = contracture forming</div>
          {tardieu.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < tardieu.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.ink }}>{r.muscleLabel} · {r.side}</span>
              <span style={{ fontSize: 12.5, color: C.inkSoft }}>
                R1 {r.r1_degrees}° · R2 {r.r2_degrees}° · <strong style={{ color: C.sageDeep }}>Δ{r.gap}°</strong> · Q{r.quality_grade}
              </span>
            </div>
          ))}
        </div>
      )}

      {sessions.length === 0 ? (
        <p style={{ color: C.stone, marginBottom: 8 }}>No training sessions yet — run one and the trend charts will appear here.</p>
      ) : (
      <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginBottom: 26 }}>
        {primarySlots.length > 0 && (
          <MultiLineTrend
            title="Primary goal — sitting & trunk control"
            hint="Fade probe faded-to support level + SATCo levels, same 0–8 axis · discounted dimmed"
            slots={primarySlots} series={primarySeries} yMax={8} ticks={[0, 2, 4, 6, 8]}
            dimIds={dimIds} selectedId={effSel} onSelect={setSelId} />
        )}
        {invSeries.length > 0 && (
          <MultiLineTrend
            title="Involvement over time" hint="Best per session · stim-off vs stim-on kept separate · a repeating 3 is the gate"
            slots={invSlots} series={invSeries} yMax={4} ticks={[0, 1, 2, 3, 4]}
            refLine={{ y: INVOLVEMENT_GATE, label: "gate (3)", color: C.clay }}
            dimIds={dimIds} selectedId={effSel} onSelect={setSelId} />
        )}
        <BarTrend
          title="Standing minutes" hint="Coloured by knee position · minutes alone can rise while loading falls"
          data={standingData} yMax={standMax} ticks={[0, 10, 20]}
          color={C.sage} colorFor={(d) => KNEE_COLOR[d.knee] || C.stone}
          ceiling={{ y: STANDING_CEILING, label: "ceiling" }}
          selectedId={effSel} onSelect={setSelId} />
        <LineTrend
          title="Prediction accuracy" hint="% of exercises where he predicted the difficulty (metacognition)"
          data={greenData} yMax={100} yMin={0} ticks={[0, 50, 100]} suffix="%"
          lineColor={C.indigo}
          selectedId={effSel} onSelect={setSelId} />
      </div>

      {safety && (
        <div style={{ background: "#F6E7E7", border: `1.5px solid #B15353`, borderRadius: 12, padding: "11px 14px", margin: "-14px 0 16px" }}>
          <span style={{ fontSize: 12.5, color: "#8C3A3A", fontWeight: 700 }}>Standing progression on hold — {safety}.</span>
        </div>
      )}

      {/* Knee-position legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "-14px 0 22px", fontSize: 11.5, color: C.inkSoft }}>
        {KNEE_POSITIONS.map((k) => (
          <span key={k.key} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: KNEE_COLOR[k.key] || C.stone }} />{k.label}
          </span>
        ))}
      </div>

      {/* Tightness heatmap + alerts */}
      <div style={{ marginBottom: 22 }}>
        <Heatmap
          title="Priming tightness" hint="Segment × session · green normal, amber tighter, deep catch"
          rows={ROM_SEGMENTS.map((s) => ({ key: s.key, label: s.title }))}
          cols={sessions.map((s) => ({ id: s.id, at: s.at }))}
          cell={(segKey, col) => { const c = tightnessCell(byId[col.id], segKey); return c ? { color: c.color, title: `${c.label}${c.note ? ` — ${c.note}` : ""}` } : null; }}
          selectedId={effSel} onSelect={setSelId} />
        {tAlerts.length > 0 && (
          <div style={{ background: "#F6E7E7", border: `1.5px solid #B15353`, borderRadius: 12, padding: "11px 14px", marginTop: 10 }}>
            <span style={{ fontSize: 12.5, color: "#8C3A3A", fontWeight: 700 }}>
              Contracture watch: {tAlerts.map((a) => `${a.segment} (${a.count}/5)`).join(", ")} — tighter than usual in ≥3 of the last 5 sessions.
            </span>
          </div>
        )}
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: C.ink }}>
        Sessions <span style={{ color: C.stone, fontWeight: 600 }}>· {cards.length}</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
        {cards.map((m) => <SessionCard key={m.id} m={m} session={byId[m.id]} onOpen={onOpen} />)}
      </div>
      </>
      )}
    </>
  );
}
