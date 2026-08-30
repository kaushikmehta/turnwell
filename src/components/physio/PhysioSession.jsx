import React, { useEffect, useRef, useState } from "react";
import { saveDraft, clearDraft } from "../../draft";
import { emptyStim, stimStampOf } from "../../constants";
import { Priming } from "./Priming";
import { Opening } from "./Opening";
import { Estimates } from "./Estimates";
import { ExerciseLoop } from "./ExerciseLoop";
import { Closing } from "./Closing";
import { PhysioSummary } from "./PhysioSummary";
import { StimBanner } from "./StimBanner";

export function PhysioSession({ config, home, persist, resume }) {
  // `resume` (when present) restores an in-progress session at its last phase
  // boundary — completed exercises are kept; a half-entered current screen is not.
  const [phase, setPhase] = useState(resume?.phase ?? "priming"); // priming | opening | estimates | loop | closing | summary
  const [priming, setPriming] = useState(resume?.priming ?? null);
  const [star, setStar] = useState(resume?.star ?? null);
  const [before, setBefore] = useState(resume?.before ?? null);
  const [openingState, setOpeningState] = useState(resume?.openingState ?? null);
  const [recall, setRecall] = useState(resume?.recall ?? null);
  const [estimates, setEstimates] = useState(resume?.estimates ?? null);
  const [loopIndex, setLoopIndex] = useState(resume?.loopIndex ?? 0);
  // Results are aligned to the items array by index (a null = not yet done), so
  // the facilitator can jump back to a previous exercise and re-edit it.
  const [results, setResults] = useState(() => {
    const base = Array((config.items || []).length).fill(null);
    (resume?.results || []).forEach((r) => {
      if (!r) return;
      const idx = (config.items || []).findIndex((it) => it.id === r.id);
      if (idx >= 0) base[idx] = r;
    });
    return base;
  });
  const [closingData, setClosingData] = useState(resume?.closingData ?? null);
  const [stim, setStim] = useState(resume?.stim ?? emptyStim());
  const wakeLockRef = useRef(null);

  // Autosave the in-progress session as a draft on every phase-boundary change,
  // so a reload can resume it. Skipped once complete (summary) — the finished
  // session is in the database and the draft is cleared at that point.
  useEffect(() => {
    if (phase === "summary") return;
    saveDraft("physio", { config, phase, priming, star, before, openingState, recall, estimates, loopIndex, results, closingData, stim });
  }, [config, phase, priming, star, before, openingState, recall, estimates, loopIndex, results, closingData, stim]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if ("wakeLock" in navigator) {
          const lock = await navigator.wakeLock.request("screen");
          if (!cancelled) wakeLockRef.current = lock; else lock.release().catch(() => {});
        }
      } catch { /* wake lock unsupported or blocked — fail gracefully */ }
    })();
    return () => {
      cancelled = true;
      if (wakeLockRef.current) wakeLockRef.current.release().catch(() => {});
    };
  }, []);

  const items = config.items;
  const total = items.length;

  const finishExercise = (entry) => {
    const nextResults = [...results];
    nextResults[loopIndex] = entry;
    setResults(nextResults);
    // Advance to the first still-incomplete exercise; if none remain, close.
    const nextIncomplete = nextResults.findIndex((r) => r == null);
    if (nextIncomplete === -1) setPhase("closing");
    else setLoopIndex(nextIncomplete);
  };

  const jumpTo = (i) => { if (i >= 0 && i < total) setLoopIndex(i); };
  const doneFlags = results.map((r) => r != null);
  // Allow finishing the session once at least one exercise is done.
  const endEarly = () => setPhase("closing");
  const goToClosing = () => setPhase("closing");

  const session = {
    at: Date.now(), items, firstSession: config.firstSession, readiness: config.readiness, priming,
    star, before, openingState, recall, after: closingData ? closingData.after : null,
    results: results.filter(Boolean), closing: closingData, stim,
  };

  const currentExerciseId = phase === "loop" && items[loopIndex] ? items[loopIndex].id : null;

  return (
    <div>
      <StimBanner stim={stim} setStim={setStim} phase={phase} exerciseId={currentExerciseId} />

      {phase === "priming" && (
        <Priming onNext={(p) => { setPriming(p); setPhase("opening"); }} />
      )}

      {phase === "opening" && (
        <Opening items={items} firstSession={config.firstSession} recallRef={config.recallRef} lastSession={config.lastSession}
          onNext={({ star: s, before: b, recall: r, state: st }) => { setStar(s); setBefore(b); setRecall(r); setOpeningState(st); setPhase("estimates"); }} />
      )}

      {phase === "estimates" && (
        <Estimates items={items} onNext={(est) => { setEstimates(est); setPhase("loop"); }} />
      )}

      {phase === "loop" && estimates && (
        <ExerciseLoop key={items[loopIndex].id} item={items[loopIndex]} index={loopIndex} total={total}
          items={items} done={doneFlags} existing={results[loopIndex]}
          estimate={estimates[items[loopIndex].id]} stimStamp={stimStampOf(stim)}
          onFinish={finishExercise} onJump={jumpTo} onDone={goToClosing} onEndEarly={endEarly} />
      )}

      {phase === "closing" && (
        <Closing items={items} star={star} onNext={(c) => {
          setClosingData(c);
          setPhase("summary");
          clearDraft();
          persist?.({ ...session, closing: c, after: c.after });
        }} />
      )}

      {phase === "summary" && closingData && (
        <PhysioSummary session={{ ...session, closing: closingData, after: closingData.after }} onDone={home} />
      )}
    </div>
  );
}
