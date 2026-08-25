import React, { useState } from "react";
import { C, RECALL_RATINGS, emptyStateRatings, compactStateRatings, emptyOpeningState } from "../../constants";
import { SectionLabel } from "../shared";
import { StateRatings } from "./StateRatings";
import { OpeningState } from "./OpeningState";

/* The recall step. The reference list was confirmed at setup — here it's only
   asked and scored, live, on the cue ladder. The middle rung (a category cue)
   keeps a post-weekend Monday fair rather than reading as decline. */
function Recall({ refDay, entries, setScore }) {
  const gapLabel = refDay && refDay.daysAgo != null
    ? `${refDay.dayLabel ? refDay.dayLabel.split(" · ")[0] : "Last session"} · ${refDay.daysAgo === 1 ? "yesterday" : `${refDay.daysAgo} days ago`}`
    : null;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage }}>1. Recall the last session</div>
        {gapLabel && <div style={{ fontSize: 11.5, color: C.stone, fontWeight: 600 }}>{gapLabel}</div>}
      </div>
      <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.45 }}>
        Ask Akki to recall what you worked on last time — 1, 2, 3… Score how much help each one took.
        {refDay && refDay.daysAgo >= 2 ? " It's a longer gap, so a category cue is expected — that's not a miss." : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {entries.map((e) => (
          <div key={e.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", background: "#fff" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{e.title}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {RECALL_RATINGS.map((lvl) => {
                const on = e.score === lvl.key;
                return (
                  <button key={lvl.key} className="tw-focus" onClick={() => setScore(e.id, lvl.key)}
                    style={{ flex: 1, border: `1.5px solid ${on ? lvl.color : C.line}`,
                      background: on ? lvl.tint : C.surface, color: on ? lvl.color : C.inkSoft,
                      borderRadius: 10, padding: "8px 4px", fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Opening({ items, firstSession, recallRef, onNext }) {
  const [starId, setStarId] = useState(null);
  const [before, setBefore] = useState(emptyStateRatings);
  const [state, setState] = useState(emptyOpeningState);

  const hasRecall = !firstSession && recallRef && recallRef.reference && recallRef.reference.length > 0;
  const [recallEntries, setRecallEntries] = useState(() =>
    hasRecall ? recallRef.reference.map((r) => ({ id: r.id, title: r.title, score: null })) : []
  );
  const setScore = (id, key) => setRecallEntries((es) => es.map((e) => (e.id === id ? { ...e, score: key } : e)));

  const recallReady = !hasRecall || recallEntries.every((e) => e.score != null);
  const canContinue = !!starId && recallReady;

  const submit = () => {
    const star = items.find((i) => i.id === starId);
    const b = compactStateRatings(before);
    let recall = null;
    if (hasRecall) {
      const recalled = recallEntries.filter((e) => e.score === "own" || e.score === "cue").length;
      recall = {
        dayLabel: recallRef.dayLabel, daysAgo: recallRef.daysAgo,
        entries: recallEntries.map((e) => ({ id: e.id, title: e.title, score: e.score })),
        recalled, total: recallEntries.length,
      };
    }
    onNext({ star: { id: star.id, title: star.title }, before: b, recall, state });
  };

  return (
    <div className="tw-rise">
      <SectionLabel>Opening</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 18px" }}>Before you start</h2>

      {hasRecall && (
        <Recall refDay={recallRef} entries={recallEntries} setScore={setScore} />
      )}

      <OpeningState value={state} onChange={setState} />

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 5 }}>2. Orient</div>
        <p style={{ fontSize: 15.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>
          Orient him to today's plan and how each exercise helps him function — plain words, tie it to standing.
        </p>
      </div>

      <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 8 }}>3. Star exercise</div>
        <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>Ask which one he's keenest to work on, and why.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it) => (
            <button key={it.id} className="tw-focus" onClick={() => setStarId(it.id)}
              style={{ textAlign: "left", border: `1.5px solid ${starId === it.id ? C.clay : C.line}`,
                background: starId === it.id ? "#fff" : C.surface, color: C.ink,
                borderRadius: 12, padding: "11px 14px", fontSize: 14.5, fontWeight: 600 }}>
              {starId === it.id ? "★ " : ""}{it.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 10 }}>4. Before-session state (optional)</div>
        <StateRatings value={before} onChange={setBefore} />
      </div>

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {!starId ? "Pick a star exercise to continue" : !recallReady ? "Score each recall item to continue" : "Continue to estimates"}
      </button>
    </div>
  );
}
