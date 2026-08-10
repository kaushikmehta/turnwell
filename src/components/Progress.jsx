import React from "react";
import { C, RATINGS } from "../constants";
import { ratingByKey } from "../utils";
import { BackBtn, Empty } from "./shared";

export function Progress({ sessions, remove, clear, back }) {
  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Speech history</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>
        Saved speech sessions. Taller bars are more independent.
      </p>

      {sessions.length === 0 ? (
        <Empty title="No sessions yet" body="Run a speech session and it'll be saved here automatically." />
      ) : (
        <>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 18px 14px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
              {[...sessions].slice(0, 12).reverse().map((s, i) => {
                const total = s.results.length || 1;
                const avg = s.results.reduce((a, r) => a + (ratingByKey(r.rating, RATINGS)?.score || 0), 0) / total;
                const h = 14 + (1 - avg / 4) * 100;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ width: "100%", maxWidth: 34, height: h, background: C.sage, borderRadius: "5px 5px 0 0", opacity: .55 + (h / 200) }} />
                    <span style={{ fontSize: 10, color: C.stone }}>{new Date(s.at).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11.5, color: C.stone, textAlign: "center", marginTop: 8 }}>more independent ↑</div>
          </div>

          {sessions.map((s, i) => {
            const total = s.results.length;
            const ind = s.results.filter((r) => r.rating === "independent").length;
            return (
              <div key={s.id || i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{new Date(s.at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                    <span style={{ fontSize: 12, color: C.sage, fontWeight: 600, marginLeft: 8 }}>speech</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: C.sage, fontWeight: 700 }}>
                      {ind}/{total} on their own
                    </span>
                    <button className="tw-focus" aria-label="Delete session"
                      onClick={() => { if (confirm("Delete this session? This can't be undone.")) remove(s); }}
                      style={{ background: "none", border: "none", color: C.stone, fontSize: 16, lineHeight: 1, padding: 4 }}>
                      ×
                    </button>
                  </div>
                </div>
                {s.notes && <p style={{ fontSize: 13, color: C.inkSoft, margin: "8px 0 0", lineHeight: 1.4 }}>{s.notes}</p>}
              </div>
            );
          })}
          <button className="tw-focus" onClick={() => { if (confirm(`Delete all ${sessions.length} saved speech sessions? This can't be undone.`)) clear(); }}
            style={{ marginTop: 14, background: "none", border: "none", color: C.stone, fontSize: 13, fontWeight: 600 }}>
            Delete all
          </button>
        </>
      )}
    </div>
  );
}
