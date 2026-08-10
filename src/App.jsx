import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { fetchSessions, saveSession } from "./api";
import { loadDraft, saveDraft, clearDraft } from "./draft";
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
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [view, setView] = useState("home");
  const [domain, setDomain] = useState("speech");
  const [bank, setBank] = useState(() => seed());
  const [physioBank] = useState(() => seedPhysioExercises());
  const [readingBank] = useState(() => seedReadingPassages());
  const [sessions, setSessions] = useState([]);
  const [run, setRun] = useState(null);
  const [physioConfig, setPhysioConfig] = useState(null);
  const [readingConfig, setReadingConfig] = useState(null);
  const [resume, setResume] = useState(null); // in-progress state handed to a resumed session
  const [draft, setDraft] = useState(() => loadDraft()); // the saved draft, for Home's Continue card

  const saveBank = useCallback((next) => setBank(next), []);
  const saveSessions = useCallback((next) => setSessions(next), []);

  // Autosave the speech run as a draft while it's live (physio/reading autosave
  // themselves — their state lives inside their own components).
  useEffect(() => {
    if (view === "run" && run) saveDraft("speech", run);
  }, [view, run]);

  // Drop the draft once a session is done or abandoned, and refresh Home's copy.
  const endDraft = useCallback(() => { clearDraft(); setDraft(null); }, []);

  // Guard against silently clobbering an in-progress session when starting new.
  const confirmDiscardDraft = () => {
    if (!loadDraft()) return true;
    if (confirm("You have an in-progress session. Discard it and start a new one?")) {
      endDraft();
      return true;
    }
    return false;
  };

  // Persist a completed session to the database. Used by all three domains.
  // Fire-and-forget: the UI has already advanced; a failed save is logged, not
  // surfaced mid-session (the local copy stays visible until reload).
  const persistSession = useCallback((sessionDomain, record) => {
    saveSession(getToken, sessionDomain, record).catch((err) => {
      console.error(`Failed to save ${sessionDomain} session:`, err);
    });
  }, [getToken]);

  // Load speech-session history from the database on sign-in. (Physio/reading
  // are persisted too, but their in-app history view is the future dashboard.)
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    fetchSessions(getToken)
      .then((rows) => {
        if (cancelled) return;
        const speech = rows.filter((r) => r.domain === "speech").map((r) => ({ ...r.payload, id: r.id }));
        setSessions(speech);
      })
      .catch((err) => console.error("Failed to load sessions:", err));
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, getToken]);

  const startRun = (items) => {
    if (!confirmDiscardDraft()) return;
    setResume(null);
    setRun({ items, i: 0, results: [], notes: "" });
    setView("run");
  };

  const finishRun = (finished) => {
    const rec = { at: Date.now(), ...finished };
    saveSessions([rec, ...sessions]);
    persistSession("speech", rec);
    endDraft();
    setRun(rec);
    setView("summary");
  };

  const beginPhysio = (config) => {
    if (!confirmDiscardDraft()) return;
    setResume(null);
    setPhysioConfig(config);
    setView("physio");
  };
  const beginReading = (passages) => {
    if (!confirmDiscardDraft()) return;
    setResume(null);
    setReadingConfig(passages);
    setView("reading");
  };

  // Resume the saved draft where it left off.
  const continueDraft = () => {
    const d = loadDraft();
    if (!d) { setDraft(null); return; }
    setResume(d.state);
    if (d.domain === "speech") {
      setRun(d.state);
      setView("run");
    } else if (d.domain === "physio") {
      setPhysioConfig(d.state.config);
      setView("physio");
    } else if (d.domain === "reading") {
      setReadingConfig(d.state.passages);
      setView("reading");
    }
  };

  return (
    <Shell>
      {view === "home" && (
        <Home bank={bank} physioBank={physioBank} readingBank={readingBank} sessions={sessions}
          domain={domain} setDomain={setDomain} go={setView}
          draft={draft} onContinue={continueDraft} onDiscardDraft={endDraft} />
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
        <PhysioSession config={physioConfig} resume={resume} persist={(rec) => persistSession("physio", rec)}
          home={() => { setPhysioConfig(null); setResume(null); setDraft(loadDraft()); setView("home"); }} />
      )}
      {view === "reading" && readingConfig && (
        <ReadingSession passages={readingConfig} resume={resume} persist={(rec) => persistSession("reading", rec)}
          home={() => { setReadingConfig(null); setResume(null); setDraft(loadDraft()); setView("home"); }} />
      )}
      {view === "run" && run && (
        <Session run={run} setRun={setRun} finish={finishRun}
          quit={() => { endDraft(); setRun(null); setView("home"); }} />
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
