import React, { useState, useCallback } from "react";
import { PHYSIO_RATINGS } from "./constants";
import { seed, seedExercises } from "./seed";
import { Shell } from "./components/Shell";
import { Home } from "./components/Home";
import { Setup } from "./components/Setup";
import { PhysioSetup } from "./components/PhysioSetup";
import { Session } from "./components/Session";
import { Summary } from "./components/Summary";
import { Progress } from "./components/Progress";
import { Library } from "./components/Library";
import { PhysioLibrary } from "./components/PhysioLibrary";

export default function App() {
  const [view, setView] = useState("home");
  const [domain, setDomain] = useState("speech");
  const [bank, setBank] = useState(() => seed());
  const [physioBank, setPhysioBank] = useState(() => seedExercises());
  const [sessions, setSessions] = useState([]);
  const [run, setRun] = useState(null);

  const saveBank = useCallback((next) => setBank(next), []);
  const savePhysioBank = useCallback((next) => setPhysioBank(next), []);
  const saveSessions = useCallback((next) => setSessions(next), []);

  const startRun = (items, ratings) => {
    setRun({ items, i: 0, results: [], notes: "", ratings: ratings || null });
    setView("run");
  };

  const finishRun = (finished) => {
    const rec = { at: Date.now(), ratings: run.ratings, ...finished };
    saveSessions([rec, ...sessions]);
    setRun(rec);
    setView("summary");
  };

  return (
    <Shell>
      {view === "home" && (
        <Home bank={bank} physioBank={physioBank} sessions={sessions}
          domain={domain} setDomain={setDomain} go={setView} />
      )}
      {view === "setup" && domain === "speech" && (
        <Setup bank={bank} start={(items) => startRun(items, null)} back={() => setView("home")} />
      )}
      {view === "setup" && domain === "physio" && (
        <PhysioSetup physioBank={physioBank} start={(items) => startRun(items, PHYSIO_RATINGS)} back={() => setView("home")} />
      )}
      {view === "run" && run && (
        <Session run={run} setRun={setRun} finish={finishRun} quit={() => { setRun(null); setView("home"); }} />
      )}
      {view === "summary" && run && (
        <Summary rec={run} home={() => { setRun(null); setView("home"); }} again={() => setView("setup")} />
      )}
      {view === "library" && domain === "speech" && (
        <Library bank={bank} save={saveBank} back={() => setView("home")} />
      )}
      {view === "library" && domain === "physio" && (
        <PhysioLibrary physioBank={physioBank} save={savePhysioBank} back={() => setView("home")} />
      )}
      {view === "progress" && (
        <Progress sessions={sessions} clear={() => saveSessions([])} back={() => setView("home")} />
      )}
    </Shell>
  );
}
