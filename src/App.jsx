import React, { useState, useCallback } from "react";
import { seed, seedPhysioExercises, seedReadingPassages } from "./seed";
import { Shell } from "./components/Shell";
import { Home } from "./components/Home";
import { Setup } from "./components/Setup";
import { PhysioSetup } from "./components/PhysioSetup";
import { PhysioSession } from "./components/physio/PhysioSession";
import { ReadingSetup } from "./components/ReadingSetup";
import { ReadingSession } from "./components/ReadingSession";
import { Session } from "./components/Session";
import { Summary } from "./components/Summary";
import { Progress } from "./components/Progress";
import { Library } from "./components/Library";

export default function App() {
  const [view, setView] = useState("home");
  const [domain, setDomain] = useState("speech");
  const [bank, setBank] = useState(() => seed());
  const [physioBank] = useState(() => seedPhysioExercises());
  const [readingBank] = useState(() => seedReadingPassages());
  const [sessions, setSessions] = useState([]);
  const [run, setRun] = useState(null);
  const [physioConfig, setPhysioConfig] = useState(null);
  const [readingConfig, setReadingConfig] = useState(null);

  const saveBank = useCallback((next) => setBank(next), []);
  const saveSessions = useCallback((next) => setSessions(next), []);

  const startRun = (items) => {
    setRun({ items, i: 0, results: [], notes: "" });
    setView("run");
  };

  const finishRun = (finished) => {
    const rec = { at: Date.now(), ...finished };
    saveSessions([rec, ...sessions]);
    setRun(rec);
    setView("summary");
  };

  const beginPhysio = (config) => { setPhysioConfig(config); setView("physio"); };
  const beginReading = (passages) => { setReadingConfig(passages); setView("reading"); };

  return (
    <Shell>
      {view === "home" && (
        <Home bank={bank} physioBank={physioBank} readingBank={readingBank} sessions={sessions}
          domain={domain} setDomain={setDomain} go={setView} />
      )}
      {view === "setup" && domain === "speech" && (
        <Setup bank={bank} start={startRun} back={() => setView("home")} />
      )}
      {view === "setup" && domain === "physio" && (
        <PhysioSetup physioBank={physioBank} start={beginPhysio} back={() => setView("home")} />
      )}
      {view === "setup" && domain === "reading" && (
        <ReadingSetup passages={readingBank} start={beginReading} back={() => setView("home")} />
      )}
      {view === "physio" && physioConfig && (
        <PhysioSession config={physioConfig} home={() => { setPhysioConfig(null); setView("home"); }} />
      )}
      {view === "reading" && readingConfig && (
        <ReadingSession passages={readingConfig} home={() => { setReadingConfig(null); setView("home"); }} />
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
      {view === "progress" && (
        <Progress sessions={sessions} clear={() => saveSessions([])} back={() => setView("home")} />
      )}
    </Shell>
  );
}
