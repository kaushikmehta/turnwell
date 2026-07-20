import React, { useEffect, useRef, useState } from "react";
import { Priming } from "./Priming";
import { Opening } from "./Opening";
import { Estimates } from "./Estimates";
import { ExerciseLoop } from "./ExerciseLoop";
import { Closing } from "./Closing";
import { PhysioSummary } from "./PhysioSummary";

export function PhysioSession({ config, home }) {
  const [phase, setPhase] = useState("priming"); // priming | opening | estimates | loop | closing | summary
  const [priming, setPriming] = useState(null);
  const [star, setStar] = useState(null);
  const [before, setBefore] = useState(null);
  const [estimates, setEstimates] = useState(null);
  const [loopIndex, setLoopIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [closingData, setClosingData] = useState(null);
  const wakeLockRef = useRef(null);

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
    at: Date.now(), items, firstSession: config.firstSession, priming,
    star, before, after: closingData ? closingData.after : null,
    results, closing: closingData,
  };

  return (
    <div>
      {phase === "priming" && (
        <Priming onNext={(p) => { setPriming(p); setPhase("opening"); }} />
      )}

      {phase === "opening" && (
        <Opening items={items} firstSession={config.firstSession}
          onNext={({ star: s, before: b }) => { setStar(s); setBefore(b); setPhase("estimates"); }} />
      )}

      {phase === "estimates" && (
        <Estimates items={items} onNext={(est) => { setEstimates(est); setPhase("loop"); }} />
      )}

      {phase === "loop" && estimates && (
        <ExerciseLoop key={items[loopIndex].id} item={items[loopIndex]} index={loopIndex} total={total}
          estimate={estimates[items[loopIndex].id]} onFinish={finishExercise} onEndEarly={endEarly} />
      )}

      {phase === "closing" && (
        <Closing items={items} star={star} onNext={(c) => { setClosingData(c); setPhase("summary"); }} />
      )}

      {phase === "summary" && closingData && (
        <PhysioSummary session={{ ...session, closing: closingData, after: closingData.after }} onDone={home} />
      )}
    </div>
  );
}
