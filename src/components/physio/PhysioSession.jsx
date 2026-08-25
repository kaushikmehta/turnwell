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
  const [results, setResults] = useState(resume?.results ?? []);
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
    const nextResults = [...results, entry];
    setResults(nextResults);
    if (loopIndex + 1 >= total) setPhase("closing");
    else setLoopIndex(loopIndex + 1);
  };

  const endEarly = () => setPhase("closing");

  const session = {
    at: Date.now(), items, firstSession: config.firstSession, readiness: config.readiness, priming,
    star, before, openingState, recall, after: closingData ? closingData.after : null,
    results, closing: closingData, stim,
  };

  const currentExerciseId = phase === "loop" && items[loopIndex] ? items[loopIndex].id : null;

  return (
    <div>
      <StimBanner stim={stim} setStim={setStim} phase={phase} exerciseId={currentExerciseId} />

      {phase === "priming" && (
        <Priming onNext={(p) => { setPriming(p); setPhase("opening"); }} />
      )}

      {phase === "opening" && (
        <Opening items={items} firstSession={config.firstSession} recallRef={config.recallRef}
          onNext={({ star: s, before: b, recall: r, state: st }) => { setStar(s); setBefore(b); setRecall(r); setOpeningState(st); setPhase("estimates"); }} />
      )}

      {phase === "estimates" && (
        <Estimates items={items} onNext={(est) => { setEstimates(est); setPhase("loop"); }} />
      )}

      {phase === "loop" && estimates && (
        <ExerciseLoop key={items[loopIndex].id} item={items[loopIndex]} index={loopIndex} total={total}
          estimate={estimates[items[loopIndex].id]} stimStamp={stimStampOf(stim)} onFinish={finishExercise} onEndEarly={endEarly} />
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
