/*
 * Dashboard shell — fetches all persisted sessions once, offers a domain
 * switcher (Physio / Speech / Reading), and renders the matching overview.
 * Opening a session card lifts here and swaps to a full-page detail routed by
 * the session's domain.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { C, RATINGS, READING_RATINGS } from "../../constants";
import { fetchSessions } from "../../api";
import { BackBtn, Empty } from "../shared";
import { PhysioOverview } from "./PhysioDashboard";
import { LanguageOverview, LanguageDetail } from "./LanguageDashboard";
import { SessionDetail } from "./SessionDetail";
import { AssessmentDetail } from "./AssessmentDetail";

const DOMAINS = [
  { key: "physio", label: "Physio", color: C.clay },
  { key: "speech", label: "Speech", color: C.sage },
  { key: "reading", label: "Reading", color: C.indigo },
];

function DomainTabs({ domain, setDomain, counts }) {
  return (
    <div style={{ display: "flex", gap: 8, margin: "0 0 20px", flexWrap: "wrap" }}>
      {DOMAINS.map((d) => {
        const active = d.key === domain;
        return (
          <button key={d.key} className="tw-focus" onClick={() => setDomain(d.key)}
            style={{
              border: `1px solid ${active ? d.color : C.line}`, background: active ? d.color : C.surface,
              color: active ? "#fff" : C.inkSoft, borderRadius: 999, padding: "7px 14px",
              fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}>
            {d.label} <span style={{ opacity: active ? 0.8 : 0.6 }}>· {counts[d.key] || 0}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Dashboard({ back, onRecordAssessment }) {
  const { getToken } = useAuth();
  const [rows, setRows] = useState(null); // null = loading
  const [error, setError] = useState(null);
  const [domain, setDomain] = useState("physio");
  const [openSession, setOpenSession] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSessions(getToken)
      .then((r) => { if (!cancelled) setRows(r); })
      .catch((e) => { if (!cancelled) setError(e.message || "Failed to load"); });
    return () => { cancelled = true; };
  }, [getToken]);

  const counts = useMemo(() => {
    const c = {};
    (rows || []).forEach((r) => { c[r.domain] = (c[r.domain] || 0) + 1; });
    return c;
  }, [rows]);

  // Full-page detail, routed by the opened session's domain.
  if (openSession) {
    return (
      <div className="tw-rise">
        <BackBtn onClick={() => setOpenSession(null)} label="Dashboard" />
        <div style={{ marginTop: 12 }}>
          {openSession.domain === "physio"
            ? (openSession.payload?.kind === "assessment"
                ? <AssessmentDetail session={openSession} />
                : <SessionDetail session={openSession} />)
            : <LanguageDetail session={openSession} domain={openSession.domain}
                ratings={openSession.domain === "reading" ? READING_RATINGS : RATINGS} />}
        </div>
      </div>
    );
  }

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Dashboard</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 18px", fontSize: 15 }}>
        Akki's progress over time. Open any session for the full breakdown.
      </p>

      {rows === null && !error && <p style={{ color: C.stone }}>Loading…</p>}
      {error && <p style={{ color: C.clayDeep }}>Couldn't load sessions: {error}</p>}

      {rows !== null && !error && (
        <>
          <DomainTabs domain={domain} setDomain={setDomain} counts={counts} />
          {domain === "physio" && onRecordAssessment && (
            <button className="tw-focus tw-lift" onClick={onRecordAssessment}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.clay, color: "#fff", border: "none",
                borderRadius: 12, padding: "10px 16px", fontSize: 14, fontWeight: 700, marginBottom: 18, boxShadow: `0 3px 0 ${C.clayDeep}` }}>
              ＋ Record an assessment
            </button>
          )}
          {rows.length === 0 ? (
            <Empty title="No sessions yet" body="Run a session in any domain and it'll appear here, building a picture over time." />
          ) : domain === "physio" ? (
            <PhysioOverview key="physio" rows={rows} onOpen={setOpenSession} />
          ) : (
            <LanguageOverview key={domain} rows={rows} domain={domain}
              ratings={domain === "reading" ? READING_RATINGS : RATINGS} onOpen={setOpenSession} />
          )}
        </>
      )}
    </div>
  );
}
