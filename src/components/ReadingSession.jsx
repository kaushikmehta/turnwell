import React, { useState } from "react";
import { ReadingStage } from "./ReadingStage";
import { ReadingSummary } from "./ReadingSummary";

export function ReadingSession({ passages, home }) {
  const [loopIndex, setLoopIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("loop"); // loop | summary

  const total = passages.length;

  const finishPassage = (passageResults) => {
    const next = [...results, ...passageResults];
    setResults(next);
    if (loopIndex + 1 >= total) setPhase("summary");
    else setLoopIndex(loopIndex + 1);
  };

  const endEarly = () => setPhase("summary");

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
