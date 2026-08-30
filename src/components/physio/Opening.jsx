import React, { useMemo, useState } from "react";
import { C, RECALL_RATINGS, emptyStateRatings, compactStateRatings, emptyOpeningState,
  previousTrainingDay, unitLabel, INVOLVEMENT } from "../../constants";
import { SectionLabel, BackBtn } from "../shared";
import { StateRatings } from "./StateRatings";
import { OpeningState } from "./OpeningState";
import { lastSessionExercises } from "./LastSessionRecap";

const invLabel = (score) => (score == null ? null : INVOLVEMENT.find((l) => l.score === score)?.label || `Inv ${score}`);
const invColor = (score) => (score == null ? C.stone : INVOLVEMENT.find((l) => l.score === score)?.color || C.stone);

/* The "since last session" step — now the first screen of the session, before
   priming. It captures state (via OpeningState / StateRatings) and manages the
   recall of last session's exercises in one place: the actual reps / difficulty
   / involvement worked last time, an editable list (add / remove), and a live
   recall score per exercise on the cue ladder. */
function Recall({ entries, gapLabel, longerGap, onScore, onRemove, addable, adding, setAdding, onAdd }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage }}>2. Recall since last session</div>
        {gapLabel && <div style={{ fontSize: 11.5, color: C.stone, fontWeight: 600 }}>{gapLabel}</div>}
      </div>
      <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.45 }}>
        This is what Akki actually did last time. Adjust the list, then ask him to recall each one — 1, 2, 3… — and score how much help it took.
        {longerGap ? " It's a longer gap, so a category cue is expected — that's not a miss." : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {entries.map((e) => {
          const d = e.detail;
          const inv = d ? invLabel(d.involvement) : null;
          return (
            <div key={e.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "10px 12px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: C.ink }}>{e.title}</span>
                  {d ? (
                    <span style={{ display: "block", fontSize: 11.5, color: C.inkSoft, fontWeight: 600, marginTop: 2 }}>
                      {d.actReps != null ? `${d.actReps} ${unitLabel(d.unit)}` : "—"}
                      {d.actDiff != null ? ` · diff ${d.actDiff}/10` : ""}
                      {inv ? <span style={{ color: invColor(d.involvement) }}>{` · ${inv}`}</span> : ""}
                    </span>
                  ) : (
                    <span style={{ display: "block", fontSize: 11, color: C.stone, marginTop: 2 }}>Not in last session's log — added for recall</span>
                  )}
                </span>
                <button className="tw-focus" onClick={() => onRemove(e.id)}
                  style={{ background: "none", border: "none", color: C.stone, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>Remove</button>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {RECALL_RATINGS.map((lvl) => {
                  const on = e.score === lvl.key;
                  return (
                    <button key={lvl.key} className="tw-focus" onClick={() => onScore(e.id, lvl.key)}
                      style={{ flex: 1, border: `1.5px solid ${on ? lvl.color : C.line}`,
                        background: on ? lvl.tint : C.surface, color: on ? lvl.color : C.inkSoft,
                        borderRadius: 10, padding: "8px 4px", fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p style={{ fontSize: 12.5, color: C.stone, margin: 0, lineHeight: 1.4 }}>
            Nothing set — add what was worked on last time, or leave empty to skip recall.
          </p>
        )}
      </div>

      {addable.length > 0 && (
        <select value={adding} onChange={(e) => onAdd(e.target.value)} className="tw-focus"
          style={{ width: "100%", marginTop: 10, background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: C.inkSoft }}>
          <option value="">+ Add an exercise worked on last time…</option>
          {addable.map((ex) => <option key={ex.id} value={ex.id}>{ex.title}</option>)}
        </select>
      )}
    </div>
  );
}

export function Opening({ items, firstSession, lastSession, physioBank = [], onNext, onBack }) {
  const [starId, setStarId] = useState(null);
  const [before, setBefore] = useState(emptyStateRatings);
  const [state, setState] = useState(emptyOpeningState);

  const prevDay = useMemo(() => previousTrainingDay(new Date().getDay()), []);
  const lastDone = useMemo(() => lastSessionExercises(lastSession), [lastSession]);

  // The recall list — seeded from what was actually done last session, or the
  // weekly day-plan when there's no history yet. Editable live at the opening.
  const [recallEntries, setRecallEntries] = useState(() => {
    if (firstSession) return [];
    if (lastDone.length) return lastDone.map((e) => ({ id: e.id, title: e.title, detail: e, score: null }));
    if (prevDay) return prevDay.ids.map((id) => physioBank.find((ex) => ex.id === id)).filter(Boolean)
      .map((ex) => ({ id: ex.id, title: ex.title, detail: null, score: null }));
    return [];
  });
  const [adding, setAdding] = useState("");

  const setScore = (id, key) => setRecallEntries((es) => es.map((e) => (e.id === id ? { ...e, score: key } : e)));
  const removeEntry = (id) => setRecallEntries((es) => es.filter((e) => e.id !== id));
  const addable = physioBank.filter((ex) => !ex.dormant && !recallEntries.some((e) => e.id === ex.id));
  const addEntry = (id) => {
    const ex = physioBank.find((x) => x.id === id);
    if (ex && !recallEntries.some((e) => e.id === id)) {
      const detail = lastDone.find((d) => d.id === id) || null;
      setRecallEntries((es) => [...es, { id: ex.id, title: ex.title, detail, score: null }]);
    }
    setAdding("");
  };

  const hasRecall = !firstSession && recallEntries.length > 0;
  const recallReady = !hasRecall || recallEntries.every((e) => e.score != null);
  const canContinue = !!starId && recallReady;

  const gapLabel = !firstSession && prevDay
    ? `${prevDay.label.split(" · ")[0]} · ${prevDay.daysAgo === 1 ? "yesterday" : `${prevDay.daysAgo} days ago`}`
    : null;

  const submit = () => {
    const star = items.find((i) => i.id === starId);
    const b = compactStateRatings(before);
    let recall = null;
    if (hasRecall) {
      const recalled = recallEntries.filter((e) => e.score === "own" || e.score === "cue").length;
      recall = {
        dayLabel: prevDay ? prevDay.label : null, daysAgo: prevDay ? prevDay.daysAgo : null,
        entries: recallEntries.map((e) => ({ id: e.id, title: e.title, score: e.score })),
        recalled, total: recallEntries.length,
      };
    }
    onNext({ star: { id: star.id, title: star.title }, before: b, recall, state });
  };

  return (
    <div className="tw-rise">
      {onBack && <BackBtn onClick={onBack} label="Set-up" />}
      <SectionLabel>Opening</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 18px" }}>Before you start</h2>

      {/* 1. State & since last session — the clinical daily log plus the
          before-session tiredness / mood / motivation ratings. */}
      <OpeningState value={state} onChange={setState} />

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 3 }}>Before-session state <span style={{ color: C.stone, fontWeight: 600 }}>(optional)</span></div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.45 }}>
          How he's arriving today — rated by him and by you, so the two views can be compared with the after-session state.
        </p>
        <StateRatings value={before} onChange={setBefore} />
      </div>

      {/* 2. Recall since last session */}
      {!firstSession && (
        <Recall entries={recallEntries} gapLabel={gapLabel} longerGap={prevDay && prevDay.daysAgo >= 2}
          onScore={setScore} onRemove={removeEntry}
          addable={addable} adding={adding} setAdding={setAdding} onAdd={addEntry} />
      )}

      {/* 3. Today's plan — orient him to what's on, then the star exercise. */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 5 }}>3. Today's plan — orient</div>
        <p style={{ fontSize: 14.5, color: C.ink, margin: "0 0 12px", lineHeight: 1.45 }}>
          Walk him through today's exercises in plain words and how each one helps him function — tie it back to standing. Here's what's on for today:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: "flex", gap: 11, alignItems: "flex-start",
              border: `1px solid ${C.line}`, borderRadius: 11, padding: "10px 12px", background: "#fff" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1, background: C.sageTint,
                color: C.sageDeep, fontSize: 12, fontWeight: 800, lineHeight: "22px", textAlign: "center" }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: C.ink }}>{it.title}</span>
                {it.instructions && (
                  <span style={{ display: "block", fontSize: 12, color: C.inkSoft, marginTop: 2, lineHeight: 1.4 }}>
                    {it.instructions.length > 110 ? it.instructions.slice(0, 110) + "…" : it.instructions}
                  </span>
                )}
                {it.dualTask && <span style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: C.sageDeep, background: C.sageTint, borderRadius: 999, padding: "2px 8px" }}>Dual-task</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 8 }}>Star exercise</div>
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

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {!starId ? "Pick a star exercise to continue" : !recallReady ? "Score each recall item to continue" : "Continue to priming"}
      </button>
    </div>
  );
}
