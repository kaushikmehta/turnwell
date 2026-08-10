import React, { useEffect, useState } from "react";
import { saveDraft, clearDraft } from "../draft";
import { ReadingStage } from "./ReadingStage";
import { ReadingSummary } from "./ReadingSummary";

export function ReadingSession({ passages, home, persist, resume }) {
  const [loopIndex, setLoopIndex] = useState(resume?.loopIndex ?? 0);
  const [results, setResults] = useState(resume?.results ?? []);
  const [phase, setPhase] = useState(resume?.phase ?? "loop"); // loop | summary

  const total = passages.length;

  // Autosave the in-progress session as a draft (resumes at the current passage
  // boundary). Skipped at summary — it's persisted and the draft is cleared.
  useEffect(() => {
    if (phase === "summary") return;
    saveDraft("reading", { passages, loopIndex, results, phase });
  }, [passages, loopIndex, results, phase]);

  // Finalize: persist once, clear the draft, and advance to the summary.
  const goSummary = (finalResults) => {
    clearDraft();
    persist?.({ at: Date.now(), passages, results: finalResults });
    setPhase("summary");
  };

  const finishPassage = (passageResults) => {
    const next = [...results, ...passageResults];
    setResults(next);
    if (loopIndex + 1 >= total) goSummary(next);
    else setLoopIndex(loopIndex + 1);
  };

  const endEarly = () => goSummary(results);

  return (
    <div>
      {phase === "loop" && (
        <ReadingStage key={passages[loopIndex].id} passage={passages[loopIndex]} index={loopIndex} total={total}
          onFinishPassage={finishPassage} onEndEarly={endEarly} />
      )}
      {phase === "summary" && (
        <ReadingSummary session={{ at: Date.now(), passages, results }} onDone={home} />
      )}
    </div>
  );
}
