import React, { useState } from "react";
import { C, READING_RATINGS } from "../constants";
import { ratingByKey, supportWord } from "../utils";
import { buildReadingReport } from "../report";
import { SectionLabel } from "./shared";

export function ReadingSummary({ session, onDone }) {
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const { results } = session;
  const total = results.length;
  const counts = {};
  results.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const avg = total ? results.reduce((s, r) => s + ratingByKey(r.rating, READING_RATINGS).score, 0) / total : 0;
  const independent = counts.independent || 0;

  const report = buildReadingReport({ ...session, notes });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <div className="tw-rise">
      <h2 className="tw-serif" style={{ fontSize: 30, margin: "6px 0 4px" }}>Session complete</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>
        {session.passages.length} passage{session.passages.length > 1 ? "s" : ""}, {total} question{total !== 1 ? "s" : ""}. Here's the report.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 14px" }}>
          <div className="tw-serif" style={{ fontSize: 30, fontWeight: 600, color: C.sage, lineHeight: 1 }}>{independent}/{total}</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 7, lineHeight: 1.3 }}>Answered independently</div>
        </div>
        <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 14px" }}>
          <div className="tw-serif" style={{ fontSize: 30, fontWeight: 600, color: C.clay, lineHeight: 1 }}>{supportWord(avg)}</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 7, lineHeight: 1.3 }}>Typical support needed</div>
        </div>
      </div>

      <SectionLabel>Breakdown</SectionLabel>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "8px 16px", marginBottom: 24 }}>
        {READING_RATINGS.map((r) => {
          const n = counts[r.key] || 0;
          const pct = total ? (n / total) * 100 : 0;
          return (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: r.key !== "notyet" ? `1px solid ${C.line}` : "none" }}>
              <span style={{ width: 118, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{r.label}</span>
              <span style={{ flex: 1, height: 8, background: C.paper, borderRadius: 4, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: r.color, borderRadius: 4 }} />
              </span>
              <span style={{ width: 22, textAlign: "right", fontSize: 13.5, fontWeight: 700, color: C.inkSoft }}>{n}</span>
            </div>
          );
        })}
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.sage}`, borderRadius: 16, padding: "18px 18px 16px", marginBottom: 20 }}>
        <SectionLabel>Notes</SectionLabel>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          placeholder="Anything worth remembering…" className="tw-focus"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 14.5, color: C.ink, resize: "vertical", marginBottom: 16 }} />

        <SectionLabel>Full report</SectionLabel>
        <pre style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: C.ink, whiteSpace: "pre-wrap", lineHeight: 1.55, margin: "0 0 14px" }}>{report}</pre>

        <button className="tw-focus tw-lift" onClick={copy}
          style={{ width: "100%", background: C.sage, color: "#fff", border: "none", borderRadius: 13,
            padding: "14px", fontSize: 15.5, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>

        {copyFailed && (
          <div className="tw-rise" style={{ marginTop: 12 }}>
            <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 6px" }}>Couldn't access the clipboard — select the text below and copy manually.</p>
            <textarea readOnly value={report} onFocus={(e) => e.target.select()}
              style={{ width: "100%", height: 140, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 12, color: C.ink, fontFamily: "monospace" }} />
          </div>
        )}
      </div>

      <button className="tw-focus tw-lift" onClick={onDone}
        style={{ width: "100%", background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 600 }}>
        Done
      </button>
    </div>
  );
}
