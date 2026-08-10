/*
 * Physio dashboard — overview (trends + a summary card per session). Tapping a
 * card opens that session as a full-page detail view. Charts are overview:
 * tapping a point highlights its value. Fetches all persisted sessions and
 * derives client-side (one patient, small N).
 */
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { C } from "../../constants";
import { fetchSessions } from "../../api";
import { BackBtn, Empty } from "../shared";
import { LineTrend, BarTrend } from "./charts";
import { SessionDetail } from "./SessionDetail";
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

function SessionCard({ m, onOpen }) {
  return (
    <button className="tw-focus tw-lift" onClick={onOpen}
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

export function Dashboard({ back }) {
  const { getToken } = useAuth();
  const [rows, setRows] = useState(null); // null = loading
  const [error, setError] = useState(null);
  const [selId, setSelId] = useState(null); // chart highlight
  const [openId, setOpenId] = useState(null); // full-page session

  useEffect(() => {
    let cancelled = false;
    fetchSessions(getToken)
      .then((r) => { if (!cancelled) setRows(r); })
      .catch((e) => { if (!cancelled) setError(e.message || "Failed to load"); });
    return () => { cancelled = true; };
  }, [getToken]);

  const sessions = useMemo(() => (rows ? toPhysioSessions(rows) : []), [rows]);
  const metrics = useMemo(() => sessions.map(sessionMetrics), [sessions]);

  // Full-page session view.
  const openSession = sessions.find((s) => s.id === openId) || null;
  if (openSession) {
    return (
      <div className="tw-rise">
        <BackBtn onClick={() => setOpenId(null)} label="Dashboard" />
        <div style={{ marginTop: 12 }}>
          <SessionDetail session={openSession} />
        </div>
      </div>
    );
  }

  const effSel = selId && sessions.some((s) => s.id === selId)
    ? selId
    : sessions.length ? sessions[sessions.length - 1].id : null;

  const involvementData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.bestInvolvement, color: involvementColor(m.bestInvolvement) }));
  const standingData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.standingTotal }));
  const greenData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.greenPct }));
  const standMax = Math.max(STANDING_CEILING, ...standingData.map((d) => d.y || 0));
  const cards = [...metrics].reverse(); // newest first

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Physio dashboard</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>
        Akki's rehab over time. Open any session for the full breakdown of what was done and the scores.
      </p>

      {rows === null && !error && <p style={{ color: C.stone }}>Loading…</p>}
      {error && <p style={{ color: C.clayDeep }}>Couldn't load sessions: {error}</p>}

      {rows !== null && !error && sessions.length === 0 && (
        <Empty title="No physio sessions yet" body="Run a physio session and it'll appear here, building a picture over time." />
      )}

      {sessions.length > 0 && (
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
            {cards.map((m) => (
              <SessionCard key={m.id} m={m} onOpen={() => setOpenId(m.id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
