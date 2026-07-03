import React, { useState, useCallback } from "react";

/* ------------------------------------------------------------------ *
 * Turnwell — a facilitated speech-language practice tool
 * Caregiver drives · Therapist approves content · Adult practises
 * ------------------------------------------------------------------ */

/* ---- design tokens ---- */
const C = {
  paper: "#EEF1EA",
  surface: "#FBFCF9",
  ink: "#1F2A24",
  inkSoft: "#5C665E",
  line: "#DCE1D6",
  sage: "#3E6B5E",
  sageDeep: "#2E5245",
  sageTint: "#E4ECE4",
  clay: "#BC7A45",
  clayDeep: "#9C5F30",
  clayTint: "#F4E8D9",
  stone: "#8A9389",
};

const RATINGS = [
  { key: "independent", label: "On their own", note: "Full sentence, no cue", score: 0, color: C.sage,     tint: C.sageTint },
  { key: "cue1",        label: "After a starter", note: "Needed a sentence starter", score: 1, color: "#7A9A5B", tint: "#EAF0E0" },
  { key: "cue2",        label: "After a fill-in", note: "Needed a fill-in-the-blank", score: 2, color: C.clay,  tint: C.clayTint },
  { key: "cue3",        label: "After a sound cue", note: "Needed a first-sound cue", score: 3, color: C.clayDeep, tint: "#EFDcC8" },
  { key: "notyet",      label: "Not yet", note: "Single word or no response", score: 4, color: C.stone, tint: "#E7EAE6" },
];
const ratingByKey = (k) => RATINGS.find((r) => r.key === k);

/* ---- seed content bank ---- */
const seedLines = () => [
  ["Everyday requests", "You're thirsty. Ask for a drink of water.", "I would like a glass of water.",
    ["I would like…", "I would like a glass of ___.", "It starts with /w/ — water."], 1, false],
  ["Everyday requests", "The room is warm. Ask someone to open the window.", "Please open the window.",
    ["Please open…", "Please open the ___.", "It starts with /w/ — window."], 1, false],
  ["Everyday requests", "You can't reach something. Ask for help.", "Can you help me, please?",
    ["Can you…", "Can you ___ me, please?", "It starts with /h/ — help."], 2, false],
  ["Out and about", "You're at a café. Order a coffee with milk.", "I'll have a coffee with milk, please.",
    ["I'll have…", "I'll have a coffee with ___, please.", "It starts with /m/ — milk."], 2, false],
  ["Out and about", "You want to know the price of something.", "How much does this cost?",
    ["How much…", "How much does this ___?", "It starts with /c/ — cost."], 2, false],
  ["Out and about", "You're paying. Ask to pay by card.", "Can I pay by card?",
    ["Can I…", "Can I pay by ___?", "It starts with /c/ — card."], 1, false],
  ["On the phone", "Call a shop. Ask if they're open today.", "Are you open today?",
    ["Are you…", "Are you ___ today?", "It starts with /o/ — open."], 1, false],
  ["On the phone", "Leave a message. Ask them to call you back.", "Please call me back.",
    ["Please call…", "Please call me ___.", "It starts with /b/ — back."], 1, false],
  ["Talking about your day", "Tell me one thing you did this morning.", "This morning I made breakfast.",
    ["This morning I…", "This morning I ___.", "Think of one thing — what did you do first?"], 2, true],
  ["Talking about your day", "Tell me what you had for lunch.", "For lunch I had rice and chicken.",
    ["For lunch I…", "For lunch I had ___.", "Picture your plate — what was on it?"], 2, true],
  ["Talking about your day", "Tell me somewhere you'd like to go this week.", "I would like to go to the park.",
    ["I would like to go…", "I would like to go to the ___.", "Think of one place you enjoy."], 2, true],
  ["People & family", "Tell me about one person in your family.", "My brother lives in the city.",
    ["My brother…", "My ___ lives in the city.", "Think of one person — where do they live?"], 2, true],
  ["People & family", "Introduce yourself. Say your name.", "My name is …",
    ["My name…", "My name is ___.", "Just your first name."], 1, true],
  ["Describing a scene", "A man is waiting at the bus stop in the rain. Tell me what's happening.", "The man is waiting for the bus.",
    ["The man is…", "The man is waiting for the ___.", "It starts with /b/ — bus."], 2, false],
  ["Describing a scene", "Two people are cooking dinner in the kitchen. Tell me what they're doing.", "They are making dinner.",
    ["They are…", "They are making ___.", "It starts with /d/ — dinner."], 2, false],
].map((r, i) => ({
  id: "s" + i, type: "line", area: r[0], prompt: r[1], target: r[2], cues: r[3], level: r[4], personal: r[5], approved: true,
}));

/* Scenes: an elaborate setting held in mind, then connected asks, ending with recall.
   step = { ask, target, cues:[starter, blank, sound/clue], personal, recall } */
const seedScenes = () => ([
  {
    id: "sc0", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You've just finished dinner at a restaurant with a friend. The plates have been cleared and you're ready to leave. The waiter is walking past your table.",
    steps: [
      { ask: "Get the waiter's attention and ask for the bill.", target: "Excuse me, could we have the bill, please?",
        cues: ["Excuse me…", "Excuse me, could we have the ___, please?", "It starts with /b/ — bill."] },
      { ask: "The bill comes to £40. Say you'd like to pay by card.", target: "I'd like to pay by card, please.",
        cues: ["I'd like…", "I'd like to pay by ___, please.", "It starts with /c/ — card."] },
      { ask: "Ask your friend if they'd like to split it.", target: "Shall we split the bill?",
        cues: ["Shall we…", "Shall we split the ___?", "It starts with /b/ — bill."] },
      { ask: "Without looking back — where were you, who were you with, and how did you pay?",
        target: "I was at a restaurant with a friend, and I paid by card.", personal: true, recall: true,
        cues: ["I was at…", "I was at a restaurant with ___.", "Three things: the place, the person, the payment."] },
    ],
  },
  {
    id: "sc1", type: "scene", area: "On the phone", level: 3, approved: true,
    setting: "You have a dentist appointment booked for Tuesday at 3 o'clock, but something has come up. You call the surgery to move it. The receptionist answers.",
    steps: [
      { ask: "Say who you are and why you're calling.", target: "Hello, this is [your name]. I need to change my appointment.", personal: true,
        cues: ["Hello, this is…", "Hello, this is ___. I need to change my appointment.", "Your name first, then your reason."] },
      { ask: "Tell them when your appointment is.", target: "It's booked for Tuesday at three o'clock.",
        cues: ["It's booked for…", "It's booked for ___ at three o'clock.", "The day, then the time."] },
      { ask: "Ask if there's anything on Friday instead.", target: "Do you have anything on Friday instead?",
        cues: ["Do you have…", "Do you have anything on ___ instead?", "It starts with /f/ — Friday."] },
      { ask: "From memory — what day and time was your original appointment, and which day did you ask for instead?",
        target: "It was Tuesday at three, and I asked for Friday.", personal: true, recall: true,
        cues: ["It was…", "It was ___ at three, and I asked for Friday.", "Original day and time, then the new day."] },
    ],
  },
  {
    id: "sc2", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You've had a headache since this morning. You go into the pharmacy. There's a short queue, and then it's your turn at the counter.",
    steps: [
      { ask: "Greet the pharmacist and explain the problem.", target: "Hello, I've had a headache all day.",
        cues: ["Hello, I've…", "Hello, I've had a ___ all day.", "It starts with /h/ — headache."] },
      { ask: "Ask if they can recommend something for it.", target: "Can you recommend anything for it?",
        cues: ["Can you…", "Can you recommend anything for ___?", "Think of the word: recommend."] },
      { ask: "Ask how often you should take it.", target: "How often should I take it?",
        cues: ["How often…", "How often should I ___ it?", "It starts with /t/ — take."] },
      { ask: "From memory — what did you go in for, and what did you ask the pharmacist?",
        target: "I went in for a headache, and I asked what to take.", personal: true, recall: true,
        cues: ["I went in for…", "I went in for a ___.", "The problem, then your question."] },
    ],
  },
  {
    id: "sc3", type: "scene", area: "Out and about", level: 3, approved: true,
    setting: "You're at the supermarket. You've picked up bread, milk, and eggs. At the till, the card machine won't accept your card.",
    steps: [
      { ask: "Tell the cashier the card isn't working.", target: "I'm sorry, my card isn't working.",
        cues: ["I'm sorry, my…", "I'm sorry, my ___ isn't working.", "It starts with /c/ — card."] },
      { ask: "Ask if you can pay with your phone instead.", target: "Can I pay with my phone instead?",
        cues: ["Can I…", "Can I pay with my ___ instead?", "It starts with /p/ — phone."] },
      { ask: "From memory — what three things were you buying?", target: "I was buying bread, milk, and eggs.", personal: true, recall: true,
        cues: ["I was buying…", "I was buying bread, ___, and eggs.", "Three items — picture the basket."] },
    ],
  },
  {
    id: "sc4", type: "scene", area: "Talking about your day", level: 3, approved: true,
    setting: "A friend you haven't seen in a while asks how your weekend was. You did a few things — take a moment to think back over them.",
    steps: [
      { ask: "Tell them one thing you did on Saturday.", target: "On Saturday I went to the market.", personal: true,
        cues: ["On Saturday I…", "On Saturday I ___.", "One thing — morning or afternoon?"] },
      { ask: "Now tell them what you did on Sunday.", target: "On Sunday I visited my family.", personal: true,
        cues: ["On Sunday I…", "On Sunday I ___.", "A different day — what changed?"] },
      { ask: "Tell them which part you enjoyed most, and why.", target: "I enjoyed Sunday most, because I saw everyone.", personal: true,
        cues: ["I enjoyed … most, because…", "I enjoyed ___ most, because ___.", "Pick one part, then give a reason."] },
    ],
  },
]);

/* Decks: one image walked up 4 rungs (name → two words → fill the blank → describe).
   image_url is pre-filled with a LABELED PLACEHOLDER that loads reliably and tells you
   what to swap in. Replace each with a real license-free URL (Pixabay / Pexels / Unsplash)
   or a path to an image you drop in /public — then push. See README for the how-to. */
const DECK_RUNGS = { name: "Name what you see", two_words: "Two words together", fill: "Fill in the blank", describe: "Describe it — 2–3 sentences" };
const DECK_CHEER = ["You're doing brilliantly — keep going.", "That was a full sentence. Nice work.", "Great describing — you built that yourself.", "Take your time. You've got this."];
const ph = (bg, label) => `https://placehold.co/1000x700/${bg}/FFFFFF?text=${label}`;

const seedDecks = () => ([
  {
    id: "dk0", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "cars", image_url: ph("BC7A45", "Red+race+car"), fill_blank: "The red car is ___ the race.", model_example: "A red race car is speeding around the track. The driver is winning the race, and the crowd is cheering." },
      { theme: "cars", image_url: ph("BC7A45", "Classic+vintage+car"), fill_blank: "This old car is ___.", model_example: "This is an old classic car. It is shiny and blue, and it looks very expensive." },
      { theme: "cars", image_url: ph("BC7A45", "Man+refuelling+car"), fill_blank: "The man is ___ his car.", model_example: "A man is filling his car with petrol. He is standing at the pump, and he looks like he is in a hurry." },
      { theme: "cars", image_url: ph("BC7A45", "Cars+in+a+traffic+jam"), fill_blank: "The cars are ___ in traffic.", model_example: "The cars are stuck in a traffic jam. Nothing is moving, and the drivers look frustrated." },
      { theme: "cars", image_url: ph("BC7A45", "Mechanic+under+the+bonnet"), fill_blank: "The mechanic is ___ the car.", model_example: "A mechanic is fixing the car. He is under the bonnet, checking the engine with his tools." },
    ],
  },
  {
    id: "dk1", type: "deck", area: "Describing a scene", level: 2, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "sport", image_url: ph("3E6B5E", "Footballer+at+goal"), fill_blank: "The player is ___ the ball.", model_example: "A footballer is kicking the ball towards the goal. He is trying to score, and the goalkeeper is diving to save it." },
      { theme: "sport", image_url: ph("3E6B5E", "Tennis+player+serving"), fill_blank: "The woman is ___ the ball.", model_example: "A woman is serving the ball in a tennis match. She has thrown the ball up high and is about to hit it hard." },
      { theme: "sport", image_url: ph("3E6B5E", "Fans+celebrating"), fill_blank: "The fans are ___.", model_example: "The fans are celebrating in the stadium. They are cheering and waving their scarves because their team just scored." },
      { theme: "sport", image_url: ph("3E6B5E", "Runner+at+finish+line"), fill_blank: "The runner is ___ the race.", model_example: "A runner is crossing the finish line. She has won the race, and she looks exhausted but happy." },
      { theme: "sport", image_url: ph("3E6B5E", "Basketball+player+shooting"), fill_blank: "The player is ___ the ball into the basket.", model_example: "A basketball player is shooting the ball. He has jumped high into the air, aiming for the basket." },
    ],
  },
  {
    id: "dk2", type: "deck", area: "Describing a scene", level: 3, approved: true,
    rung_labels: DECK_RUNGS, encouragement_every: 4, encouragement: DECK_CHEER,
    cards: [
      { theme: "film", image_url: ph("2E5245", "Cinema+and+popcorn"), fill_blank: "The man is ___ a film.", model_example: "A man is sitting in the cinema, watching a film. He is holding a big box of popcorn, and the screen is bright in front of him." },
      { theme: "film", image_url: ph("2E5245", "Actor+on+red+carpet"), fill_blank: "The actor is ___ on the red carpet.", model_example: "An actor is posing on the red carpet. Cameras are flashing everywhere, and she is smiling for the photographers." },
      { theme: "film", image_url: ph("2E5245", "Director+behind+camera"), fill_blank: "The director is ___ the scene.", model_example: "The director is filming a scene. He is sitting behind the camera, telling the actors what to do." },
      { theme: "film", image_url: ph("2E5245", "Bright+cinema+screen"), fill_blank: "The cinema screen is ___.", model_example: "The cinema screen is huge and bright. The room is dark, and everyone is watching quietly." },
      { theme: "film", image_url: ph("2E5245", "Clapperboard+on+set"), fill_blank: "They are ___ a movie.", model_example: "They are making a movie on set. Someone is holding a clapperboard, ready to start the next take." },
    ],
  },
]);

const seed = () => [...seedLines(), ...seedScenes(), ...seedDecks()];

const AREAS = ["Everyday requests", "Out and about", "On the phone", "Talking about your day", "People & family", "Describing a scene"];
const isScene = (it) => it && (it.type === "scene" || !!it.steps);
const isDeck = (it) => it && (it.type === "deck" || !!it.cards);
const cueLabels = (personal) =>
  personal ? ["Sentence starter", "Fill in the blank", "One more clue"] : ["Sentence starter", "Fill in the blank", "First-sound cue"];

/* ---- tiny inline icons ---- */
const Ico = {
  hand: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  next: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  back: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  check: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  eye: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  plus: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
};

export default function App() {
  const [view, setView] = useState("home");
  const [bank, setBank] = useState(() => seed());   // content ships with the app; edits are in-memory only
  const [sessions, setSessions] = useState([]);      // this run only — nothing is persisted anywhere
  const [run, setRun] = useState(null); // active session state

  const saveBank = useCallback((next) => setBank(next), []);
  const saveSessions = useCallback((next) => setSessions(next), []);

  return (
    <Shell>
      {view === "home" && <Home bank={bank} sessions={sessions} go={setView} />}
      {view === "setup" && <Setup bank={bank} start={(items) => { setRun({ items, i: 0, results: [], notes: "" }); setView("run"); }} back={() => setView("home")} />}
      {view === "run" && run && (
        <Session run={run} setRun={setRun}
          finish={(finished) => { const rec = { at: Date.now(), ...finished }; saveSessions([rec, ...sessions]); setRun(rec); setView("summary"); }}
          quit={() => { setRun(null); setView("home"); }} />
      )}
      {view === "summary" && run && <Summary rec={run} home={() => { setRun(null); setView("home"); }} again={() => setView("setup")} />}
      {view === "library" && <Library bank={bank} save={saveBank} back={() => setView("home")} />}
      {view === "progress" && <Progress sessions={sessions} clear={() => saveSessions([])} back={() => setView("home")} />}
    </Shell>
  );
}

/* ================= Shell + brand ================= */
function Shell({ children, center }) {
  return (
    <div style={{ minHeight: "100%", background: C.paper, color: C.ink,
      fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      display: center ? "flex" : "block", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .tw-serif { font-family: 'Fraunces', Georgia, serif; }
        .tw-eyebrow { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600; }
        button { font-family: inherit; cursor: pointer; }
        .tw-focus:focus-visible { outline: 3px solid ${C.sage}; outline-offset: 2px; }
        .tw-lift { transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
        .tw-lift:hover { transform: translateY(-1px); }
        input, textarea, select { font-family: inherit; }
        @keyframes tw-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .tw-rise { animation: tw-rise .32s ease both; }
        @media (prefers-reduced-motion: reduce) { .tw-rise, .tw-lift { animation: none !important; transition: none !important; } }
        @media (max-width: 600px) { input, textarea, select { font-size: 16px; } }
      `}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 18px 40px" }}>{children}</div>
    </div>
  );
}
function Mark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <span style={{ width: 34, height: 34, borderRadius: 11, background: C.sage, display: "grid", placeItems: "center", boxShadow: `0 2px 0 ${C.sageDeep}` }}>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15c4 0 4-6 8-6s4 6 8 6"/><path d="M4 9c4 0 4 6 8 6"/></svg>
      </span>
      <span className="tw-serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.01em" }}>Turnwell</span>
    </div>
  );
}
function BackBtn({ onClick, label = "Home" }) {
  return (
    <button className="tw-focus" onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.inkSoft, fontSize: 14, fontWeight: 600, padding: "6px 2px" }}>
      {Ico.back} {label}
    </button>
  );
}

/* ================= Home ================= */
function Home({ bank, sessions, go }) {
  const approved = bank.filter((b) => b.approved).length;
  return (
    <div className="tw-rise">
      <Mark />
      <p className="tw-serif" style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.15, margin: "26px 0 8px", maxWidth: 560 }}>
        A calm space to practise speaking in full sentences.
      </p>
      <p style={{ color: C.inkSoft, fontSize: 16, maxWidth: 540, margin: 0 }}>
        A facilitator runs each session. One prompt at a time, with a gentle ladder of hints ready when they're needed.
      </p>

      <button className="tw-focus tw-lift" onClick={() => go("setup")}
        style={{ marginTop: 26, width: "100%", textAlign: "left", background: C.sage, color: "#fff", border: "none",
          borderRadius: 18, padding: "20px 22px", boxShadow: `0 3px 0 ${C.sageDeep}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          <span style={{ fontSize: 20, fontWeight: 700, display: "block" }}>Start a session</span>
          <span style={{ fontSize: 14, opacity: .85 }}>Pick a focus, then run it together</span>
        </span>
        <span style={{ background: "rgba(255,255,255,.16)", borderRadius: 12, padding: "10px 12px" }}>{Ico.next}</span>
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <TileBtn onClick={() => go("library")} title="Practice library"
          sub={`${bank.length} prompts · ${approved} approved`}
          foot="For the therapist — edit prompts, cues and levels" />
        <TileBtn onClick={() => go("progress")} title="This run"
          sub={sessions.length ? `${sessions.length} session${sessions.length > 1 ? "s" : ""}` : "No sessions yet"}
          foot="Sessions from this sitting — send each to the therapist to keep it" />
      </div>
    </div>
  );
}
function TileBtn({ onClick, title, sub, foot }) {
  return (
    <button className="tw-focus tw-lift" onClick={onClick}
      style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 15px" }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.sage, fontWeight: 600, margin: "3px 0 8px" }}>{sub}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.35 }}>{foot}</div>
    </button>
  );
}

/* ================= Setup ================= */
function Setup({ bank, start, back }) {
  const [picked, setPicked] = useState(new Set(AREAS));
  const [level, setLevel] = useState(0); // 0 = any
  const [ptype, setPtype] = useState("all"); // all | lines | scenes | decks
  const [onlyApproved, setOnlyApproved] = useState(true);

  const toggle = (a) => { const n = new Set(picked); n.has(a) ? n.delete(a) : n.add(a); setPicked(n); };
  const typeOf = (b) => (isDeck(b) ? "decks" : isScene(b) ? "scenes" : "lines");
  const pool = bank.filter((b) =>
    picked.has(b.area) &&
    (level === 0 || b.level === level) &&
    (!onlyApproved || b.approved) &&
    (ptype === "all" || typeOf(b) === ptype));

  const nDecks = pool.filter(isDeck).length;
  const nScenes = pool.filter(isScene).length;
  const nLines = pool.length - nScenes - nDecks;
  const begin = () => { const items = [...pool].sort(() => Math.random() - 0.5); start(items); };

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Set up the session</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>Choose what to work on today.</p>

      <SectionLabel>Practice type</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {[["all", "All"], ["lines", "Sentences"], ["scenes", "Scenes"], ["decks", "Picture decks"]].map(([v, l]) => (
          <button key={v} className="tw-focus" onClick={() => setPtype(v)}
            style={{ flex: "1 1 auto", border: `1.5px solid ${ptype === v ? C.sage : C.line}`, background: ptype === v ? C.sageTint : C.surface,
              color: ptype === v ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px 12px", fontSize: 13.5, fontWeight: 600 }}>
            {l}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 22px" }}>
        Scenes hold a setting in mind across linked answers. Picture decks walk one image up four rungs — from one word to a full description.
      </p>

      <SectionLabel>Focus areas</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 22 }}>
        {AREAS.map((a) => {
          const on = picked.has(a); const n = bank.filter((b) => b.area === a).length;
          return (
            <button key={a} className="tw-focus" onClick={() => toggle(a)}
              style={{ border: `1.5px solid ${on ? C.sage : C.line}`, background: on ? C.sageTint : C.surface,
                color: on ? C.sageDeep : C.inkSoft, borderRadius: 999, padding: "9px 15px", fontSize: 14, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 7 }}>
              {on && <span style={{ color: C.sage }}>{Ico.check}</span>}{a} <span style={{ opacity: .55, fontWeight: 500 }}>{n}</span>
            </button>
          );
        })}
      </div>

      <SectionLabel>Sentence length</SectionLabel>
      <div style={{ display: "flex", gap: 9, marginBottom: 22 }}>
        {[[0, "Any"], [1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
          <button key={v} className="tw-focus" onClick={() => setLevel(v)}
            style={{ flex: 1, border: `1.5px solid ${level === v ? C.sage : C.line}`, background: level === v ? C.sageTint : C.surface,
              color: level === v ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px 4px", fontSize: 14, fontWeight: 600 }}>
            {l}
          </button>
        ))}
      </div>

      <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", marginBottom: 22,
        background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 15px" }}>
        <input type="checkbox" checked={onlyApproved} onChange={(e) => setOnlyApproved(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.sage }} />
        <span style={{ fontSize: 14.5 }}>Only use content the therapist has approved</span>
      </label>

      <button className="tw-focus tw-lift" disabled={pool.length === 0} onClick={begin}
        style={{ width: "100%", background: pool.length ? C.sage : C.line, color: pool.length ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: pool.length ? `0 3px 0 ${C.sageDeep}` : "none" }}>
        {pool.length ? "Begin session" : "No items match — widen the selection"}
      </button>
      {pool.length > 0 && (
        <p style={{ textAlign: "center", fontSize: 12.5, color: C.stone, marginTop: 10 }}>
          {[nLines ? `${nLines} sentence${nLines > 1 ? "s" : ""}` : "", nScenes ? `${nScenes} scene${nScenes > 1 ? "s" : ""}` : "", nDecks ? `${nDecks} deck${nDecks > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
function SectionLabel({ children }) {
  return <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 11 }}>{children}</div>;
}

/* ================= Session dispatcher ================= */
function Session({ run, setRun, finish, quit }) {
  const item = run.items[run.i];
  const common = { run, setRun, finish, quit };
  return isDeck(item)
    ? <DeckStage key={item.id} {...common} />
    : <StdStage key={item.id} {...common} />;
}

/* ================= Sentence / scene runner ================= */
function StdStage({ run, setRun, finish, quit }) {
  const item = run.items[run.i];
  const scene = isScene(item);
  const [stepIdx, setStepIdx] = useState(0);
  const [settingOpen, setSettingOpen] = useState(true); // scene: reading-the-setting phase
  const [cue, setCue] = useState(0);
  const [peek, setPeek] = useState(false);
  const [showSetting, setShowSetting] = useState(false); // re-reveal during steps
  const total = run.items.length;

  const task = scene ? item.steps[stepIdx] : item;
  const taskPrompt = scene ? task.ask : item.prompt;
  const taskPersonal = scene ? !!task.personal : !!item.personal;
  const taskRecall = scene ? !!task.recall : false;
  const labels = cueLabels(taskPersonal);

  const resetTask = () => { setCue(0); setPeek(false); setShowSetting(false); };
  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const skip = () => {
    const lastItem = run.i + 1 >= total;
    if (lastItem) { finish({ items: run.items, results: run.results, notes: run.notes || "" }); return; }
    setRun({ ...run, i: run.i + 1 });
    setStepIdx(0); setSettingOpen(true);
    resetTask(); scrollTop();
  };

  const record = (ratingKey) => {
    const results = [...run.results,
      { itemId: item.id, kind: scene ? "scene" : "line", prompt: taskPrompt, rating: ratingKey, cueUsed: cue, step: scene ? stepIdx : 0 }];
    const lastStep = !scene || stepIdx + 1 >= item.steps.length;
    const lastItem = run.i + 1 >= total;
    if (lastStep && lastItem) { finish({ items: run.items, results, notes: run.notes }); return; }
    if (!lastStep) { setRun({ ...run, results }); setStepIdx(stepIdx + 1); }
    else { setRun({ ...run, i: run.i + 1, results }); setStepIdx(0); setSettingOpen(true); }
    resetTask(); scrollTop();
  };

  const cueTone = [C.sageTint, "#EAF0E0", C.clayTint][cue - 1] || C.sageTint;
  const cueText = [C.sageDeep, "#4d6b2f", C.clayDeep][cue - 1] || C.sageDeep;
  const readingSetting = scene && settingOpen;

  return (
    <div>
      {/* progress + exit */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {run.items.map((_, k) => (
            <span key={k} style={{ height: 6, width: k === run.i ? 26 : 6, borderRadius: 3,
              background: k < run.i ? C.sage : k === run.i ? C.sageDeep : C.line, transition: "all .25s ease" }} />
          ))}
        </div>
        <button className="tw-focus" onClick={() => finish({ items: run.items, results: run.results, notes: run.notes || "" })} style={{ background: "none", border: "none", color: C.stone, fontSize: 13.5, fontWeight: 600 }}>End</button>
      </div>

      {/* context row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <span className="tw-eyebrow" style={{ color: C.sage }}>{item.area}</span>
        <span style={{ color: C.line }}>·</span>
        {scene ? (
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>
            Scene {readingSetting ? "" : `· task ${stepIdx + 1} of ${item.steps.length}`}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>{run.i + 1} of {total}</span>
        )}
        {!readingSetting && taskRecall && <span style={{ fontSize: 11, color: C.clayDeep, background: C.clayTint, borderRadius: 999, padding: "3px 9px", fontWeight: 700 }}>from memory</span>}
        {!readingSetting && taskPersonal && !taskRecall && <span style={{ fontSize: 11, color: C.clayDeep, background: C.clayTint, borderRadius: 999, padding: "3px 9px", fontWeight: 600 }}>personal answer</span>}
      </div>

      {readingSetting ? (
        /* ---------- scene: read the setting together ---------- */
        <>
          <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 10 }}>The setting — read this together</div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "clamp(22px,5vw,40px)", minHeight: 180, display: "flex", alignItems: "center" }}>
            <p className="tw-serif" style={{ fontSize: "clamp(21px,4.6vw,32px)", lineHeight: 1.32, margin: 0, fontWeight: 400 }}>{item.setting}</p>
          </div>
          <div style={{ marginTop: 22, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
            <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "8px 0 14px", lineHeight: 1.45 }}>
              Read the setting together and picture it. When you begin, it tucks away — the tasks are answered from memory. You can bring it back if it's needed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="tw-focus tw-lift" onClick={() => setSettingOpen(false)}
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
                {Ico.next} Start the tasks · {item.steps.length}
              </button>
              <button className="tw-focus" onClick={skip}
                style={{ background: C.surface, color: C.stone, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>
                Skip
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ---------- line, or scene task ---------- */
        <>
          {scene && (
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {item.steps.map((_, k) => (
                <span key={k} style={{ height: 4, flex: 1, borderRadius: 2, background: k < stepIdx ? C.sage : k === stepIdx ? C.sageDeep : C.line }} />
              ))}
            </div>
          )}

          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "clamp(22px,5vw,40px)", minHeight: 176, display: "flex", alignItems: "center" }}>
            <p className="tw-serif" style={{ fontSize: "clamp(23px,5.2vw,36px)", lineHeight: 1.26, margin: 0, fontWeight: 500 }}>{taskPrompt}</p>
          </div>

          {cue > 0 && (
            <div className="tw-rise" key={cue} style={{ marginTop: 14, background: cueTone, borderRadius: 18, padding: "18px 20px", border: `1px solid ${cueText}22` }}>
              <div className="tw-eyebrow" style={{ color: cueText, marginBottom: 8, opacity: .85 }}>Hint {cue} · {labels[cue - 1]}</div>
              <p style={{ fontSize: "clamp(20px,4.4vw,28px)", lineHeight: 1.3, margin: 0, color: C.ink, fontWeight: 500 }}>{task.cues[cue - 1]}</p>
            </div>
          )}

          {showSetting && scene && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "13px 16px", background: "#fff", border: `1px dashed ${C.sage}` }}>
              <span style={{ fontSize: 12, color: C.sage, fontWeight: 700 }}>Setting: </span>
              <span style={{ fontSize: 14.5, color: C.ink }}>{item.setting}</span>
            </div>
          )}

          {peek && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "12px 15px", background: "#fff", border: `1px dashed ${C.stone}` }}>
              <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>Model answer (facilitator only): </span>
              <span style={{ fontSize: 15, color: C.ink }}>{task.target}</span>
            </div>
          )}

          {/* ---------- facilitator bar ---------- */}
          <div style={{ marginTop: 26, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map((r) => (
                  <span key={r} title={labels[r]} style={{ width: 9, height: 9, borderRadius: 3, background: cue > r ? C.clay : C.line }} />
                ))}
                <span style={{ fontSize: 11.5, color: C.stone, marginLeft: 4 }}>support ladder</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button className="tw-focus tw-lift" disabled={cue >= 3} onClick={() => setCue(cue + 1)}
                style={{ flex: "1 1 200px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: cue >= 3 ? C.line : C.clayTint, color: cue >= 3 ? C.stone : C.clayDeep,
                  border: `1.5px solid ${cue >= 3 ? C.line : C.clay}`, borderRadius: 13, padding: "13px 16px", fontSize: 15, fontWeight: 700 }}>
                {Ico.hand}{cue === 0 ? "Offer a hint" : cue >= 3 ? "All hints given" : `Offer next hint · ${labels[cue]}`}
              </button>
              {scene && (
                <button className="tw-focus" onClick={() => setShowSetting(!showSetting)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.sage,
                    border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                  {showSetting ? "Hide setting" : "Show setting"}
                </button>
              )}
              <button className="tw-focus" onClick={() => setPeek(!peek)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.inkSoft,
                  border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                {Ico.eye}{peek ? "Hide answer" : "Peek at answer"}
              </button>
              <button className="tw-focus" onClick={skip}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.stone,
                  border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                Skip
              </button>
            </div>

            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, fontWeight: 600 }}>
              {taskRecall ? "How much did they recall?" : "How did the response go?"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
              {RATINGS.map((r) => (
                <button key={r.key} className="tw-focus tw-lift" onClick={() => record(r.key)}
                  style={{ textAlign: "left", background: r.tint, border: `1.5px solid ${r.color}44`, borderRadius: 13, padding: "12px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }} />
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, paddingLeft: 18 }}>{r.note}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= Deck runner (image → 4-rung production ladder) ================= */
function DeckStage({ run, setRun, finish, quit }) {
  const item = run.items[run.i];
  const [cardIdx, setCardIdx] = useState(0);
  const [rungIdx, setRungIdx] = useState(0);       // 0 name · 1 two words · 2 fill · 3 describe
  const [peek, setPeek] = useState(false);          // reveal model answer (backstop)
  const [starter, setStarter] = useState(false);    // reveal a derived opening cue
  const [broken, setBroken] = useState(false);      // image failed to load
  const [cheer, setCheer] = useState(null);         // encouragement interstitial

  const card = item.cards[cardIdx];
  const labels = item.rung_labels || DECK_RUNGS;
  const every = item.encouragement_every || 0;
  const rungOrder = [labels.name, labels.two_words, card.fill_blank, labels.describe];
  const rungTag = ["Name it", "Two words", "Fill the blank", "Describe"][rungIdx];
  const firstDeckI = run.items.findIndex(isDeck);
  const isFirstDeckCard = run.i === firstDeckI && cardIdx === 0;
  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const starterText = (card.model_example || "").split(" ").slice(0, 4).join(" ");

  const rateCard = (ratingKey) => {
    const results = [...run.results, { itemId: item.id, kind: "deck", prompt: `${card.theme} — ${card.fill_blank}`, rating: ratingKey, cueUsed: 0, step: cardIdx }];
    const lastCard = cardIdx + 1 >= item.cards.length;
    const lastItem = run.i + 1 >= run.items.length;
    if (lastCard && lastItem) { finish({ items: run.items, results, notes: run.notes }); return; }
    const cheerDue = every > 0 && (cardIdx + 1) % every === 0 && !lastCard;
    if (cheerDue) { setRun({ ...run, results }); setCheer(item.encouragement?.[Math.floor(Math.random() * item.encouragement.length)] || "Keep going."); scrollTop(); return; }
    if (!lastCard) { setRun({ ...run, results }); nextCard(); }
    else { setRun({ ...run, results, i: run.i + 1 }); } // remount next item via key
  };
  const nextCard = () => { setCardIdx(cardIdx + 1); setRungIdx(0); setPeek(false); setStarter(false); setBroken(false); scrollTop(); };
  const skip = () => {
    const lastItem = run.i + 1 >= run.items.length;
    if (lastItem) { finish({ items: run.items, results: run.results, notes: run.notes || "" }); return; }
    setRun({ ...run, i: run.i + 1 }); // remount next item via key
  };

  if (cheer) {
    return (
      <div className="tw-rise" style={{ textAlign: "center", padding: "40px 12px" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
        <p className="tw-serif" style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.25, margin: "0 auto 26px", maxWidth: 460, fontWeight: 500 }}>{cheer}</p>
        <button className="tw-focus tw-lift" onClick={nextCard}
          style={{ background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px 30px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          Keep going
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {run.items.map((_, k) => (
            <span key={k} style={{ height: 6, width: k === run.i ? 26 : 6, borderRadius: 3,
              background: k < run.i ? C.sage : k === run.i ? C.sageDeep : C.line, transition: "all .25s ease" }} />
          ))}
        </div>
        <button className="tw-focus" onClick={() => finish({ items: run.items, results: run.results, notes: run.notes || "" })} style={{ background: "none", border: "none", color: C.stone, fontSize: 13.5, fontWeight: 600 }}>End</button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <span className="tw-eyebrow" style={{ color: C.clay }}>Picture deck</span>
        <span style={{ color: C.line }}>·</span>
        <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>Card {cardIdx + 1} of {item.cards.length}</span>
      </div>

      {/* image with graceful fallback */}
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.line}`, background: C.sageTint, aspectRatio: "10 / 7", marginBottom: 16 }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: C.inkSoft, fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{card.theme}</div>
        {!broken && <img src={card.image_url} alt="" onError={() => setBroken(true)}
          style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      </div>

      {/* rung ladder indicator */}
      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {[0, 1, 2, 3].map((r) => (
          <span key={r} style={{ height: 4, flex: 1, borderRadius: 2, background: r < rungIdx ? C.sage : r === rungIdx ? C.sageDeep : C.line }} />
        ))}
      </div>

      <div style={{ marginBottom: 6 }}><span className="tw-eyebrow" style={{ color: C.sage }}>Rung {rungIdx + 1} · {rungTag}</span></div>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: "clamp(20px,4.5vw,32px)", minHeight: 120, display: "flex", alignItems: "center" }}>
        <p className="tw-serif" style={{ fontSize: "clamp(22px,5vw,34px)", lineHeight: 1.25, margin: 0, fontWeight: 500 }}>{rungOrder[rungIdx]}</p>
      </div>

      {/* model example — first card of the session only, at the describe rung */}
      {isFirstDeckCard && rungIdx === 3 && (
        <div className="tw-rise" style={{ marginTop: 14, background: C.sageTint, borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.sage}33` }}>
          <div className="tw-eyebrow" style={{ color: C.sageDeep, marginBottom: 7 }}>An example to aim for</div>
          <p style={{ fontSize: "clamp(16px,3.6vw,19px)", lineHeight: 1.4, margin: 0, color: C.ink }}>{card.model_example}</p>
        </div>
      )}
      {starter && !(isFirstDeckCard && rungIdx === 3) && (
        <div className="tw-rise" style={{ marginTop: 12, background: C.clayTint, borderRadius: 14, padding: "13px 16px" }}>
          <span style={{ fontSize: 12, color: C.clayDeep, fontWeight: 700 }}>Starter: </span>
          <span style={{ fontSize: 16, color: C.ink }}>{starterText}…</span>
        </div>
      )}
      {peek && (
        <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "12px 15px", background: "#fff", border: `1px dashed ${C.stone}` }}>
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>Model answer (facilitator): </span>
          <span style={{ fontSize: 15, color: C.ink }}>{card.model_example}</span>
        </div>
      )}

      {/* facilitator bar */}
      <div style={{ marginTop: 24, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
        <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
        <div style={{ display: "flex", gap: 10, margin: "12px 0 16px", flexWrap: "wrap" }}>
          <button className="tw-focus tw-lift" disabled={rungIdx >= 3} onClick={() => { setRungIdx(rungIdx + 1); setStarter(false); }}
            style={{ flex: "1 1 180px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: rungIdx >= 3 ? C.line : C.sage, color: rungIdx >= 3 ? C.stone : "#fff",
              border: "none", borderRadius: 13, padding: "13px 16px", fontSize: 15, fontWeight: 700, boxShadow: rungIdx >= 3 ? "none" : `0 3px 0 ${C.sageDeep}` }}>
            {rungIdx >= 3 ? "Top of the ladder" : `Next rung · ${["Two words", "Fill the blank", "Describe"][rungIdx]}`}
          </button>
          {rungIdx === 3 && card.model_example && (
            <button className="tw-focus" onClick={() => setStarter(!starter)}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.clayDeep, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
              {Ico.hand}{starter ? "Hide starter" : "Offer a starter"}
            </button>
          )}
          <button className="tw-focus" onClick={() => setPeek(!peek)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
            {Ico.eye}{peek ? "Hide answer" : "Peek at answer"}
          </button>
          <button className="tw-focus" onClick={skip}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.stone, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
            Skip deck
          </button>
        </div>

        <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, fontWeight: 600 }}>How far did they get on this card?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
          {RATINGS.map((r) => (
            <button key={r.key} className="tw-focus tw-lift" onClick={() => rateCard(r.key)}
              style={{ textAlign: "left", background: r.tint, border: `1.5px solid ${r.color}44`, borderRadius: 13, padding: "12px 13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }} />
                <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.label}</span>
              </div>
              <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, paddingLeft: 18 }}>{r.note}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Summary — end-of-session progress report ================= */
function Summary({ rec, home, again }) {
  const [notes, setNotes] = useState(rec.notes || "");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const counts = {};
  rec.results.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const total = rec.results.length;
  const avg = total ? rec.results.reduce((s, r) => s + ratingByKey(r.rating).score, 0) / total : 0;
  const independent = counts.independent || 0;
  const nDecks = (rec.items || []).filter(isDeck).length;
  const nScenes = (rec.items || []).filter(isScene).length;
  const nLines = (rec.items || []).length - nScenes - nDecks;
  const madeOf = [nLines ? `${nLines} sentence${nLines > 1 ? "s" : ""}` : "", nScenes ? `${nScenes} scene${nScenes > 1 ? "s" : ""}` : "", nDecks ? `${nDecks} deck${nDecks > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ");

  // Compact, structured-first so the key numbers survive if WhatsApp truncates long text.
  const report = [
    "Turnwell — session summary",
    new Date(rec.at || Date.now()).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
    "",
    `${total} responses${madeOf ? " · " + madeOf : ""}`,
    `Full sentences unaided: ${independent}/${total}`,
    `Typical support: ${supportWord(avg)}`,
    "",
    "Breakdown:",
    ...RATINGS.map((r) => `• ${r.label}: ${counts[r.key] || 0}`),
    "",
    "Responses:",
    ...rec.results.map((r, i) => `${i + 1}. ${r.prompt} → ${ratingByKey(r.rating).label}`),
    "",
    `Notes: ${notes.trim() || "—"}`,
  ].join("\n");

  const digits = phone.replace(/\D/g, "");
  const canSend = digits.length >= 7;
  const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(report)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(report); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="tw-rise">
      <h2 className="tw-serif" style={{ fontSize: 30, margin: "6px 0 4px" }}>Session complete</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>{total} responses across {madeOf || "this session"}. Here's the report.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard big={`${independent}/${total}`} label="Full sentences on their own" color={C.sage} />
        <StatCard big={supportWord(avg)} label="Typical support needed" color={C.clay} />
      </div>

      <SectionLabel>Breakdown</SectionLabel>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "8px 16px", marginBottom: 24 }}>
        {RATINGS.map((r) => {
          const n = counts[r.key] || 0; const pct = total ? (n / total) * 100 : 0;
          return (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: r.key !== "notyet" ? `1px solid ${C.line}` : "none" }}>
              <span style={{ width: 118, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{r.label}</span>
              <span style={{ flex: 1, height: 8, background: C.paper, borderRadius: 4, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: r.color, borderRadius: 4 }} />
              </span>
              <span style={{ width: 22, textAlign: "right", fontSize: 13.5, fontWeight: 700, color: C.inkSoft }}>{n}</span>
            </div>
          );
        })}
      </div>

      {/* ---- send to therapist (nothing stored) ---- */}
      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.sage}`, borderRadius: 16, padding: "18px 18px 16px", marginBottom: 20 }}>
        <SectionLabel>Send to the therapist</SectionLabel>

        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: "4px 0 6px" }}>Therapist's WhatsApp number</div>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
          placeholder="e.g. 44 7911 123456" className="tw-focus"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 15, color: C.ink, marginBottom: 5 }} />
        <div style={{ fontSize: 12, color: C.stone, marginBottom: 14 }}>
          Full international format — country code first, no leading zero. Spaces and symbols are fine; they're stripped automatically{digits ? ` → ${digits}` : ""}.
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 6 }}>Additional notes</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          placeholder="Anything worth passing on — tricky words, what motivated them, moments that went well…" className="tw-focus"
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 14.5, color: C.ink, resize: "vertical", marginBottom: 14 }} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {canSend ? (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="tw-focus tw-lift"
              style={{ flex: "1 1 220px", textAlign: "center", textDecoration: "none", background: "#25D366", color: "#0b3d1f",
                border: "none", borderRadius: 13, padding: "14px 16px", fontSize: 15.5, fontWeight: 700, boxShadow: "0 3px 0 #1da851" }}>
              Open WhatsApp to send
            </a>
          ) : (
            <span style={{ flex: "1 1 220px", textAlign: "center", background: C.line, color: C.inkSoft, borderRadius: 13, padding: "14px 16px", fontSize: 15, fontWeight: 700 }}>
              Enter a number to send
            </span>
          )}
          <button className="tw-focus" onClick={copy}
            style={{ background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "14px 18px", fontSize: 14.5, fontWeight: 600 }}>
            {copied ? "Copied ✓" : "Copy report"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: C.stone, margin: "12px 0 0", lineHeight: 1.4 }}>
          WhatsApp opens with the report pre-filled — review it, then tap send. Nothing is saved here; the report only exists where you send it.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="tw-focus tw-lift" onClick={again}
          style={{ flex: 1, background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          Run another session
        </button>
        <button className="tw-focus" onClick={home}
          style={{ background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px 22px", fontSize: 15, fontWeight: 600 }}>
          Done
        </button>
      </div>
    </div>
  );
}
function StatCard({ big, label, color }) {
  return (
    <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 14px" }}>
      <div className="tw-serif" style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 7, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
function supportWord(avg) {
  if (avg <= 0.4) return "None";
  if (avg <= 1.2) return "Light";
  if (avg <= 2.2) return "Moderate";
  if (avg <= 3.2) return "Heavy";
  return "Building";
}

/* ================= This run (in-memory only) ================= */
function Progress({ sessions, clear, back }) {
  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>This run</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 22px", fontSize: 15 }}>Sessions from this sitting. Taller bars are more independent. Nothing is stored — send each one to the therapist to keep a record.</p>

      {sessions.length === 0 ? (
        <Empty title="No sessions yet" body="Run a session and it'll show here for this sitting. To keep it, send the report to the therapist at the end." />
      ) : (
        <>
          {/* trend */}
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 18px 14px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
              {[...sessions].slice(0, 12).reverse().map((s, i) => {
                const total = s.results.length || 1;
                const avg = s.results.reduce((a, r) => a + ratingByKey(r.rating).score, 0) / total;
                const h = 14 + (1 - avg / 4) * 100; // taller = more independent
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ width: "100%", maxWidth: 34, height: h, background: C.sage, borderRadius: "5px 5px 0 0", opacity: .55 + (h / 200) }} />
                    <span style={{ fontSize: 10, color: C.stone }}>{new Date(s.at).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11.5, color: C.stone, textAlign: "center", marginTop: 8 }}>more independent ↑</div>
          </div>

          {sessions.map((s, i) => {
            const total = s.results.length;
            const ind = s.results.filter((r) => r.rating === "independent").length;
            return (
              <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{new Date(s.at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                  <span style={{ fontSize: 13, color: C.sage, fontWeight: 700 }}>{ind}/{total} on their own</span>
                </div>
                {s.notes && <p style={{ fontSize: 13, color: C.inkSoft, margin: "8px 0 0", lineHeight: 1.4 }}>{s.notes}</p>}
              </div>
            );
          })}
          <button className="tw-focus" onClick={() => { if (confirm("Clear this run's sessions?")) clear(); }}
            style={{ marginTop: 14, background: "none", border: "none", color: C.stone, fontSize: 13, fontWeight: 600 }}>Clear this run</button>
        </>
      )}
    </div>
  );
}

/* ================= Library (therapist) ================= */
function Library({ bank, save, back }) {
  const [editing, setEditing] = useState(null); // {new:'line'|'scene'} | id

  const upsert = (item) => {
    if (item.id === "new") { save([...bank, { ...item, id: (isScene(item) ? "sc" : "s") + Date.now() }]); }
    else { save(bank.map((b) => (b.id === item.id ? item : b))); }
    setEditing(null);
  };
  const remove = (id) => { if (confirm("Remove this item?")) { save(bank.filter((b) => b.id !== id)); setEditing(null); } };
  const toggleApprove = (id) => save(bank.map((b) => (b.id === id ? { ...b, approved: !b.approved } : b)));

  if (editing) {
    if (editing.new === "line") return <LineEditor item={{ id: "new", type: "line", area: AREAS[0], prompt: "", target: "", cues: ["", "", ""], level: 1, personal: false, approved: true }} onSave={upsert} onCancel={() => setEditing(null)} onDelete={null} />;
    if (editing.new === "scene") return <SceneEditor item={{ id: "new", type: "scene", area: AREAS[1], level: 3, approved: true, setting: "", steps: [{ ask: "", target: "", cues: ["", "", ""], personal: false, recall: false }] }} onSave={upsert} onCancel={() => setEditing(null)} onDelete={null} />;
    const item = bank.find((b) => b.id === editing);
    const Ed = isScene(item) ? SceneEditor : LineEditor;
    return <Ed item={item} onSave={upsert} onCancel={() => setEditing(null)} onDelete={() => remove(item.id)} />;
  }

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 6px" }}>Practice library</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 16px", fontSize: 15 }}>Edit any item, its cues, and its level. Approve the ones ready to use.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button className="tw-focus tw-lift" onClick={() => setEditing({ new: "line" })}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.sage, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700, boxShadow: `0 2px 0 ${C.sageDeep}` }}>
          {Ico.plus} Add sentence
        </button>
        <button className="tw-focus tw-lift" onClick={() => setEditing({ new: "scene" })}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.clay, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700, boxShadow: `0 2px 0 ${C.clayDeep}` }}>
          {Ico.plus} Add scene
        </button>
      </div>

      {AREAS.map((area) => {
        const items = bank.filter((b) => b.area === area);
        if (!items.length) return null;
        return (
          <div key={area} style={{ marginBottom: 22 }}>
            <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 10 }}>{area}</div>
            {items.map((b) => {
              const sc = isScene(b), dk = isDeck(b), rich = sc || dk;
              return (
                <div key={b.id} style={{ background: C.surface, border: `1px solid ${rich ? C.clay + "55" : C.line}`, borderLeft: rich ? `3px solid ${C.clay}` : `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, display: "flex", gap: 11 }}>
                      {dk && <img src={b.cards[0]?.image_url} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                        style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: C.sageTint }} />}
                      <div style={{ flex: 1 }}>
                        {dk ? (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3, textTransform: "capitalize" }}>{[...new Set(b.cards.map((c) => c.theme))].join(", ")} deck</div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{b.cards.length} cards · four rungs each</div>
                          </>
                        ) : sc ? (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3, lineHeight: 1.35 }}>{b.setting}</div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{b.steps.length} tasks{b.steps.some((s) => s.recall) ? " · ends with recall" : ""}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{b.prompt}</div>
                            <div style={{ fontSize: 13, color: C.inkSoft }}>{b.target}</div>
                          </>
                        )}
                        <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                          {dk ? <Pill tone="clay">deck</Pill> : sc ? <Pill tone="clay">scene</Pill> : <Pill>sentence</Pill>}
                          <Pill>{["", "Short", "Medium", "Longer"][b.level]}</Pill>
                          {!rich && b.personal && <Pill tone="clay">personal</Pill>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
                      <button className="tw-focus" onClick={() => toggleApprove(b.id)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700,
                          border: `1.5px solid ${b.approved ? C.sage : C.line}`, background: b.approved ? C.sageTint : C.surface,
                          color: b.approved ? C.sageDeep : C.stone, borderRadius: 999, padding: "5px 11px" }}>
                        {b.approved && Ico.check}{b.approved ? "Approved" : "Approve"}
                      </button>
                      {dk
                        ? <span style={{ fontSize: 11, color: C.stone, fontWeight: 600, textAlign: "right", maxWidth: 92, lineHeight: 1.3 }}>edit in src/App.jsx</span>
                        : <button className="tw-focus" onClick={() => setEditing(b.id)}
                            style={{ fontSize: 13, fontWeight: 600, color: C.sage, background: "none", border: "none", padding: "2px 4px" }}>Edit</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
function Pill({ children, tone }) {
  const c = tone === "clay" ? { bg: C.clayTint, fg: C.clayDeep } : { bg: C.paper, fg: C.inkSoft };
  return <span style={{ fontSize: 11.5, fontWeight: 600, background: c.bg, color: c.fg, borderRadius: 999, padding: "3px 10px" }}>{children}</span>;
}

function LineEditor({ item, onSave, onCancel, onDelete }) {
  const [d, setD] = useState(item);
  const labels = cueLabels(d.personal);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setCue = (i, v) => { const c = [...d.cues]; c[i] = v; setD({ ...d, cues: c }); };
  const valid = d.prompt.trim() && d.target.trim();

  return (
    <div className="tw-rise">
      <BackBtn onClick={onCancel} label="Cancel" />
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "12px 0 18px" }}>{item.id === "new" ? "Add a sentence" : "Edit sentence"}</h2>

      <Field label="Focus area">
        <select value={d.area} onChange={(e) => set("area", e.target.value)} style={inputStyle}>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </Field>

      <Field label="What the facilitator asks (shown to the person)">
        <textarea value={d.prompt} onChange={(e) => set("prompt", e.target.value)} rows={2} style={inputStyle} placeholder="You're at a café. Order a coffee with milk." />
      </Field>

      <Field label="Model sentence">
        <input value={d.target} onChange={(e) => set("target", e.target.value)} style={inputStyle} placeholder="I'll have a coffee with milk, please." />
      </Field>

      <div style={{ background: C.clayTint + "88", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div className="tw-eyebrow" style={{ color: C.clayDeep, marginBottom: 4 }}>Cue ladder</div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px" }}>Offered one rung at a time, lightest support first.</p>
        {d.cues.map((cVal, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.clayDeep, marginBottom: 4 }}>{i + 1}. {labels[i]}</div>
            <input value={cVal} onChange={(e) => setCue(i, e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}
              placeholder={[`"I'll have…"`, `"I'll have a coffee with ___."`, d.personal ? "A content clue" : `"It starts with /m/ — milk."`][i]} />
          </div>
        ))}
      </div>

      <Field label="Sentence length">
        <div style={{ display: "flex", gap: 8 }}>
          {[[1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
            <button key={v} className="tw-focus" onClick={() => set("level", v)}
              style={{ flex: 1, border: `1.5px solid ${d.level === v ? C.sage : C.line}`, background: d.level === v ? C.sageTint : C.surface,
                color: d.level === v ? C.sageDeep : C.inkSoft, borderRadius: 11, padding: "10px", fontSize: 14, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </Field>

      <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", marginBottom: 24, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 15px" }}>
        <input type="checkbox" checked={d.personal} onChange={(e) => set("personal", e.target.checked)} style={{ width: 18, height: 18, accentColor: C.sage }} />
        <span style={{ fontSize: 14 }}>Personal answer — any true response counts (model sentence is just a frame)</span>
      </label>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="tw-focus tw-lift" disabled={!valid} onClick={() => onSave(d)}
          style={{ flex: 1, background: valid ? C.sage : C.line, color: valid ? "#fff" : C.stone, border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: valid ? `0 3px 0 ${C.sageDeep}` : "none" }}>
          Save sentence
        </button>
        {onDelete && <button className="tw-focus" onClick={onDelete} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>Remove</button>}
      </div>
    </div>
  );
}

/* ---- Scene editor ---- */
function SceneEditor({ item, onSave, onCancel, onDelete }) {
  const [d, setD] = useState(item);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setStep = (i, patch) => setD({ ...d, steps: d.steps.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const setStepCue = (i, ci, v) => setStep(i, { cues: d.steps[i].cues.map((c, k) => (k === ci ? v : c)) });
  const addStep = () => setD({ ...d, steps: [...d.steps, { ask: "", target: "", cues: ["", "", ""], personal: false, recall: false }] });
  const removeStep = (i) => setD({ ...d, steps: d.steps.filter((_, k) => k !== i) });
  const valid = d.setting.trim() && d.steps.length && d.steps.every((s) => s.ask.trim() && s.target.trim());

  return (
    <div className="tw-rise">
      <BackBtn onClick={onCancel} label="Cancel" />
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "12px 0 6px" }}>{item.id === "new" ? "Add a scene" : "Edit scene"}</h2>
      <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 18px", lineHeight: 1.45 }}>
        A setting held in mind, then linked tasks. End with a recall task to work on memory.
      </p>

      <Field label="Focus area">
        <select value={d.area} onChange={(e) => set("area", e.target.value)} style={inputStyle}>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </Field>

      <Field label="The setting (read together, then tucked away)">
        <textarea value={d.setting} onChange={(e) => set("setting", e.target.value)} rows={3} style={inputStyle}
          placeholder="You've just finished dinner at a restaurant with a friend. The waiter is walking past your table." />
      </Field>

      <div className="tw-eyebrow" style={{ color: C.stone, margin: "6px 0 10px" }}>Tasks · in order</div>
      {d.steps.map((s, i) => {
        const labels = cueLabels(s.personal);
        return (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderLeft: `3px solid ${s.recall ? C.clay : C.sage}`, borderRadius: 14, padding: "14px 15px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.recall ? C.clayDeep : C.sageDeep }}>Task {i + 1}{s.recall ? " · from memory" : ""}</span>
              {d.steps.length > 1 && <button className="tw-focus" onClick={() => removeStep(i)} style={{ background: "none", border: "none", color: C.stone, fontSize: 12.5, fontWeight: 600 }}>Remove</button>}
            </div>
            <textarea value={s.ask} onChange={(e) => setStep(i, { ask: e.target.value })} rows={2} style={{ ...inputStyle, marginBottom: 10 }} placeholder="Ask the waiter for the bill." />
            <input value={s.target} onChange={(e) => setStep(i, { target: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }} placeholder="Model answer — Excuse me, could we have the bill, please?" />
            <div style={{ display: "grid", gap: 7 }}>
              {s.cues.map((cVal, ci) => (
                <div key={ci}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: C.clayDeep, marginBottom: 3 }}>{ci + 1}. {labels[ci]}</div>
                  <input value={cVal} onChange={(e) => setStepCue(i, ci, e.target.value)} style={{ ...inputStyle }} placeholder={ci === 0 ? "Sentence starter…" : ci === 1 ? "Fill in the blank ___" : (s.personal ? "A content clue" : "First sound — /b/ …")} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
              <label className="tw-focus" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={!!s.personal} onChange={(e) => setStep(i, { personal: e.target.checked })} style={{ width: 17, height: 17, accentColor: C.sage }} /> Personal answer
              </label>
              <label className="tw-focus" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={!!s.recall} onChange={(e) => setStep(i, { recall: e.target.checked })} style={{ width: 17, height: 17, accentColor: C.clay }} /> From memory (recall)
              </label>
            </div>
          </div>
        );
      })}
      <button className="tw-focus" onClick={addStep}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.sageTint, color: C.sageDeep, border: `1.5px dashed ${C.sage}`, borderRadius: 12, padding: "11px 15px", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
        {Ico.plus} Add a task
      </button>

      <Field label="Difficulty">
        <div style={{ display: "flex", gap: 8 }}>
          {[[1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
            <button key={v} className="tw-focus" onClick={() => set("level", v)}
              style={{ flex: 1, border: `1.5px solid ${d.level === v ? C.sage : C.line}`, background: d.level === v ? C.sageTint : C.surface,
                color: d.level === v ? C.sageDeep : C.inkSoft, borderRadius: 11, padding: "10px", fontSize: 14, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </Field>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
        <button className="tw-focus tw-lift" disabled={!valid} onClick={() => onSave(d)}
          style={{ flex: 1, background: valid ? C.sage : C.line, color: valid ? "#fff" : C.stone, border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: valid ? `0 3px 0 ${C.sageDeep}` : "none" }}>
          Save scene
        </button>
        {onDelete && <button className="tw-focus" onClick={onDelete} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>Remove</button>}
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}
const inputStyle = { width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 14.5, color: C.ink, marginBottom: 0, resize: "vertical" };

function Empty({ title, body }) {
  return (
    <div style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 18, padding: "34px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 14, color: C.inkSoft, maxWidth: 380, margin: "0 auto", lineHeight: 1.45 }}>{body}</p>
    </div>
  );
}
