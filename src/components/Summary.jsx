import React, { useState } from "react";
import { C, RATINGS } from "../constants";
import { ratingByKey, supportWord, isDeck, isScene } from "../utils";
import { buildSpeechReport } from "../report";
import { SectionLabel } from "./shared";

function StatCard({ big, label, color }) {
  return (
    <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 14px" }}>
      <div className="tw-serif" style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 7, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

export function Summary({ rec, home, again }) {
  const [notes, setNotes] = useState(rec.notes || "");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const ratings = RATINGS;

  const counts = {};
  rec.results.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const total = rec.results.length;
  const avg = total ? rec.results.reduce((s, r) => s + ratingByKey(r.rating, ratings).score, 0) / total : 0;
  const independent = counts.independent || 0;

  const nDecks = (rec.items || []).filter(isDeck).length;
  const nScenes = (rec.items || []).filter(isScene).length;
  const nLines = (rec.items || []).length - nScenes - nDecks;
  const madeOf = [nLines ? `${nLines} sentence${nLines > 1 ? "s" : ""}` : "", nScenes ? `${nScenes} scene${nScenes > 1 ? "s" : ""}` : "", nDecks ? `${nDecks} deck${nDecks > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ");

  const report = buildSpeechReport({ ...rec, notes }, ratings);

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
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>{total} responses across {madeOf || "this session"}. Here's the report.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard big={`${independent}/${total}`} label="Full sentences on their own" color={C.sage} />
        <StatCard big={supportWord(avg)} label="Typical support needed" color={C.clay} />
      </div>

      <SectionLabel>Breakdown</SectionLabel>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "8px 16px", marginBottom: 24 }}>
        {ratings.map((r) => {
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

      <div style={{ display: "flex", gap: 10 }}>
        <button className="tw-focus tw-lift" onClick={again}
          style={{ flex: 1, background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          Run another session
        </button>
        <button className="tw-focus" onClick={home}
          style={{ background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px 22px", fontSize: 15, fontWeight: 600 }}>
          Done
        </button>
      </div>
    </div>
  );
}
