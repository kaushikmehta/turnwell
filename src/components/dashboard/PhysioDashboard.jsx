/*
 * Physio overview — trend charts + a summary card per session. Opening a card
 * is lifted to the Dashboard shell (which renders the full-page detail).
 */
import React, { useMemo, useState } from "react";
import { C } from "../../constants";
import { LineTrend, BarTrend } from "./charts";
import {
  toPhysioSessions, sessionMetrics, involvementColor, involvementLabel,
  fmtDateLong, STANDING_CEILING, INVOLVEMENT_GATE,
} from "./metrics";

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
      style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{fmtDateLong(m.at)}</span>
        <span style={{ color: C.stone, fontSize: 18, lineHeight: 1 }}>›</span>
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <CardStat label="Best involvement" value={involvementLabel(m.bestInvolvement)} accent={involvementColor(m.bestInvolvement)} />
        <CardStat label="Standing" value={`${m.standingTotal} min`} />
        <CardStat label="Predicted" value={m.greenPct != null ? `${m.green}/${m.exerciseCount}` : "—"} />
        <CardStat label="Exercises" value={m.exerciseCount} />
      </div>
    </button>
  );
}

export function PhysioOverview({ rows, onOpen }) {
  const [selId, setSelId] = useState(null);
  const sessions = useMemo(() => toPhysioSessions(rows), [rows]);
  const metrics = useMemo(() => sessions.map(sessionMetrics), [sessions]);

  if (!sessions.length) {
    return <p style={{ color: C.stone }}>No physio sessions yet. Run one and it'll appear here.</p>;
  }

  const effSel = selId && sessions.some((s) => s.id === selId) ? selId : sessions[sessions.length - 1].id;
  const involvementData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.bestInvolvement, color: involvementColor(m.bestInvolvement) }));
  const standingData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.standingTotal }));
  const greenData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.greenPct }));
  const standMax = Math.max(STANDING_CEILING, ...standingData.map((d) => d.y || 0));
  const cards = [...metrics].reverse();
  const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 26 }}>
        <LineTrend
          title="Involvement" hint="Best response each session · a repeating 3 is the gate to progress"
          data={involvementData} yMax={4} ticks={[0, 1, 2, 3, 4]}
          refLine={{ y: INVOLVEMENT_GATE, label: "gate (3)", color: C.clay }}
          selectedId={effSel} onSelect={setSelId} />
        <BarTrend
          title="Standing minutes" hint="Total per session vs the 20-min ceiling"
          data={standingData} yMax={standMax} ticks={[0, 10, 20]}
          color={C.sage} ceiling={{ y: STANDING_CEILING, label: "ceiling" }}
          selectedId={effSel} onSelect={setSelId} />
        <LineTrend
          title="Prediction accuracy" hint="% of exercises where he predicted the difficulty (metacognition)"
          data={greenData} yMax={100} yMin={0} ticks={[0, 50, 100]} suffix="%"
          lineColor={C.indigo}
          selectedId={effSel} onSelect={setSelId} />
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: C.ink }}>
        Sessions <span style={{ color: C.stone, fontWeight: 600 }}>· {cards.length}</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
        {cards.map((m) => <SessionCard key={m.id} m={m} session={byId[m.id]} onOpen={onOpen} />)}
      </div>
    </>
  );
}
