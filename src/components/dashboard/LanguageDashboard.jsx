/*
 * Shared overview + detail for the cue-ladder domains (speech & reading).
 * Both score 0 (independent) … 4 (not yet), so independence % over time is the
 * headline trend. Reading groups its responses by passage; speech is a flat list.
 */
import React, { useMemo, useState } from "react";
import { C } from "../../constants";
import { ratingByKey, supportWord } from "../../utils";
import { LineTrend } from "./charts";
import { toDomainSessions, languageMetrics, fmtDateLong } from "./metrics";

const THEME = { speech: C.sage, reading: C.indigo };
const UNIT = { speech: "responses", reading: "questions" };

function CardStat({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: C.stone, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: accent || C.ink }}>{value}</div>
    </div>
  );
}

function SessionCard({ m, session, ratings, domain, onOpen }) {
  const support = m.avgSupport != null ? supportWord(m.avgSupport) : "—";
  return (
    <button className="tw-focus tw-lift" onClick={() => onOpen(session)}
      style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{fmtDateLong(m.at)}</span>
        <span style={{ color: C.stone, fontSize: 18, lineHeight: 1 }}>›</span>
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <CardStat label="On their own" value={`${m.independent}/${m.total}`} accent={THEME[domain]} />
        <CardStat label="Independence" value={m.independencePct != null ? `${m.independencePct}%` : "—"} />
        <CardStat label="Typical support" value={support} />
        <CardStat label={UNIT[domain]} value={m.total} />
      </div>
    </button>
  );
}

export function LanguageOverview({ rows, domain, ratings, onOpen }) {
  const [selId, setSelId] = useState(null);
  const sessions = useMemo(() => toDomainSessions(rows, domain), [rows, domain]);
  const metrics = useMemo(() => sessions.map((s) => languageMetrics(s, ratings)), [sessions, ratings]);

  if (!sessions.length) {
    return <p style={{ color: C.stone }}>No {domain} sessions yet. Run one and it'll appear here.</p>;
  }

  const effSel = selId && sessions.some((s) => s.id === selId) ? selId : sessions[sessions.length - 1].id;
  const indepData = metrics.map((m) => ({ id: m.id, at: m.at, y: m.independencePct }));
  const cards = [...metrics].reverse();
  const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginBottom: 26 }}>
        <LineTrend
          title="Independence" hint="% answered on their own (no cue) each session"
          data={indepData} yMax={100} yMin={0} ticks={[0, 50, 100]} suffix="%"
          lineColor={THEME[domain]}
          selectedId={effSel} onSelect={setSelId} />
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: C.ink }}>
        Sessions <span style={{ color: C.stone, fontWeight: 600 }}>· {cards.length}</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
        {cards.map((m) => <SessionCard key={m.id} m={m} session={byId[m.id]} ratings={ratings} domain={domain} onOpen={onOpen} />)}
      </div>
    </>
  );
}

function RatingChip({ ratingKey, ratings }) {
  const rt = ratingByKey(ratingKey, ratings);
  if (!rt) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: C.ink }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: rt.color }} />{rt.label}
    </span>
  );
}

export function LanguageDetail({ session, ratings, domain }) {
  const p = session.payload || {};
  const results = p.results || [];
  const total = results.length;
  const independent = results.filter((r) => r.rating === "independent").length;
  const scored = results.map((r) => ratingByKey(r.rating, ratings)).filter(Boolean);
  const avg = scored.length ? scored.reduce((a, rt) => a + rt.score, 0) / scored.length : null;

  // Group reading by passage; speech stays flat.
  const groups = domain === "reading"
    ? Object.values(results.reduce((acc, r) => {
        const key = r.passageId || r.passageText || "—";
        (acc[key] ??= { text: r.passageText, level: r.level, items: [] }).items.push(r);
        return acc;
      }, {}))
    : [{ text: null, items: results }];

  return (
    <div>
      <h3 className="tw-serif" style={{ fontSize: 22, margin: "0 0 8px" }}>{fmtDateLong(session.at)}</h3>

      <div style={{ display: "flex", gap: 14, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
        <div><div style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>On their own</div><div style={{ fontSize: 18, fontWeight: 700, color: THEME[domain] }}>{independent}/{total}</div></div>
        <div><div style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>Independence</div><div style={{ fontSize: 18, fontWeight: 700 }}>{total ? Math.round((independent / total) * 100) : 0}%</div></div>
        <div><div style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>Typical support</div><div style={{ fontSize: 18, fontWeight: 700 }}>{avg != null ? supportWord(avg) : "—"}</div></div>
      </div>

      {/* Breakdown */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginBottom: 16 }}>
        {ratings.map((rt) => {
          const n = results.filter((r) => r.rating === rt.key).length;
          return (
            <span key={rt.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: n ? C.ink : C.stone }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: rt.color, opacity: n ? 1 : 0.35 }} />
              {rt.label}: <strong>{n}</strong>
            </span>
          );
        })}
      </div>

      {/* Responses */}
      <div style={{ display: "grid", gap: 10 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px" }}>
            {g.text && (
              <p className="tw-serif" style={{ fontSize: 15, margin: "0 0 8px", color: C.ink, lineHeight: 1.4 }}>
                {g.level ? <span style={{ fontSize: 11, color: C.stone, fontWeight: 700 }}>LVL {g.level} · </span> : null}"{g.text}"
              </p>
            )}
            <div style={{ display: "grid", gap: 6 }}>
              {g.items.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 13.5, color: C.inkSoft }}>{r.question || r.prompt}</span>
                  <span style={{ flexShrink: 0 }}><RatingChip ratingKey={r.rating} ratings={ratings} /></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {p.notes?.trim() && <p style={{ margin: "14px 0 0", fontSize: 13, color: C.ink }}>Notes: {p.notes.trim()}</p>}
    </div>
  );
}
