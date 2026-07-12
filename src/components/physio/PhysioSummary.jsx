import React, { useState } from "react";
import { C } from "../../constants";
import { buildPhysioReport } from "../../report";
import { SectionLabel } from "../shared";

export function PhysioSummary({ session, onDone }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const report = buildPhysioReport(session);

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

  const green = session.results.filter((r) => r.tick === "green").length;
  const total = session.results.length;

  return (
    <div className="tw-rise">
      <h2 className="tw-serif" style={{ fontSize: 30, margin: "6px 0 4px" }}>Session complete</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>{total} exercises · {green}/{total} predictions matched. Review, then copy.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 14px" }}>
          <div className="tw-serif" style={{ fontSize: 30, fontWeight: 600, color: C.clay, lineHeight: 1 }}>{green}/{total}</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 7, lineHeight: 1.3 }}>Green ticks (prediction matched)</div>
        </div>
      </div>

      <SectionLabel>By exercise</SectionLabel>
      <div style={{ marginBottom: 20 }}>
        {session.results.map((r, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "12px 15px", marginBottom: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.title}</div>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>
                  reps {r.actReps}({r.estReps}) · diff {r.actDiff}({r.estDiff}) · understood: {r.understood}{r.dualTask ? " · dual-task" : ""}
                </div>
              </div>
              <span style={{ fontSize: 20 }}>{r.tick === "green" ? "🟢" : "🟡"}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.clay}`, borderRadius: 16, padding: "18px 18px 16px", marginBottom: 20 }}>
        <SectionLabel>Full report</SectionLabel>
        <pre style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: C.ink, whiteSpace: "pre-wrap", lineHeight: 1.55, margin: "0 0 14px" }}>{report}</pre>

        <button className="tw-focus tw-lift" onClick={copy}
          style={{ width: "100%", background: C.clay, color: "#fff", border: "none", borderRadius: 13,
            padding: "14px", fontSize: 15.5, fontWeight: 700, boxShadow: `0 3px 0 ${C.clayDeep}` }}>
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
