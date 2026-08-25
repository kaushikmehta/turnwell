/* ---- design tokens ---- */
export const C = {
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
  indigo: "#4F6D8C",
  indigoDeep: "#37506A",
  indigoTint: "#E4EAEF",
};

export const RATINGS = [
  { key: "independent", slug: "independent",   label: "On their own",      note: "Full sentence, no cue",          score: 0, color: C.sage,     tint: C.sageTint },
  { key: "cue1",        slug: "starter-cue",   label: "After a starter",   note: "Needed a sentence starter",      score: 1, color: "#7A9A5B", tint: "#EAF0E0" },
  { key: "cue2",        slug: "fill-in-cue",   label: "After a fill-in",   note: "Needed a fill-in-the-blank",     score: 2, color: C.clay,    tint: C.clayTint },
  { key: "cue3",        slug: "sound-cue",     label: "After a sound cue", note: "Needed a first-sound cue",       score: 3, color: C.clayDeep, tint: "#EFDcC8" },
  { key: "notyet",      slug: "not-yet",       label: "Not yet",           note: "Single word or no response",     score: 4, color: C.stone,   tint: "#E7EAE6" },
];

/* ---- physio/OT live session runner ---- */
export const DUAL_TASK_SUGGESTIONS = [
  "Count alternately with him",
  "Have him say a word every 5th rep",
  "Have him name a fruit / weekday every 5th rep",
  "Deliberately miscount and see if he catches you",
];

export const MINUTES_PER_EXERCISE = 8; // rough estimate for the Setup screen's running time total

export const AREAS = [
  "Everyday requests",
  "Out and about",
  "On the phone",
  "Talking about your day",
  "People & family",
  "Describing a scene",
  "Health & wellbeing",
];

export const DECK_RUNGS = { name: "Name what you see", two_words: "Two words together", fill: "Fill in the blank", describe: "Describe it — 2–3 sentences" };

/* ---- reading & comprehension ----
   Same 5-tier structure/scoring as RATINGS, so support levels stay comparable
   app-wide — only the cue-3 wording changes (a re-read stands in for a sound cue). */
export const READING_RATINGS = [
  { key: "independent", label: "On their own",   note: "Answered without any help",     score: 0, color: C.sage,     tint: C.sageTint },
  { key: "cue1",        label: "After a starter", note: "Needed a sentence starter",    score: 1, color: "#7A9A5B", tint: "#EAF0E0" },
  { key: "cue2",        label: "After a fill-in", note: "Needed a fill-in-the-blank",   score: 2, color: C.clay,    tint: C.clayTint },
  { key: "cue3",        label: "After a re-read", note: "Needed to re-read the line",   score: 3, color: C.clayDeep, tint: "#EFDcC8" },
  { key: "notyet",      label: "Not yet",         note: "No answer, or incorrect",       score: 4, color: C.stone,   tint: "#E7EAE6" },
];

export const RSVP_CHUNK_MODES = [
  { key: "word", label: "1 word" },
  { key: "phrase", label: "2–3 words" },
  { key: "sentence", label: "Full sentence" },
];

export const RSVP_DEFAULT_WPM = 200;
export const RSVP_MIN_WPM = 80;
export const RSVP_MAX_WPM = 400;
export const RSVP_STEP_WPM = 20;

/* Before/after session state — captured pre (opening) and post (closing) so
   the two can be compared, and rated by both the patient (self) and the
   facilitator (observed) since the two views often diverge. */
export const STATE_METRICS = [
  { key: "tired",      label: "Tiredness" },
  { key: "mood",       label: "Mood" },
  { key: "motivation", label: "Motivation" },
];
export const STATE_RATERS = [
  { key: "patient",     label: "Akki" },
  { key: "facilitator", label: "You" },
];
export const emptyStateRatings = () =>
  Object.fromEntries(STATE_METRICS.map((m) => [m.key, { patient: "", facilitator: "" }]));
export const hasAnyStateRating = (s) =>
  !!s && STATE_METRICS.some((m) => STATE_RATERS.some((r) => s[m.key] && s[m.key][r.key] !== ""));
/* Blanks become "—" so a half-filled set still reads cleanly in the report;
   an entirely empty set collapses to null (the state was skipped). */
export const compactStateRatings = (s) => {
  if (!hasAnyStateRating(s)) return null;
  return Object.fromEntries(STATE_METRICS.map((m) => [m.key,
    Object.fromEntries(STATE_RATERS.map((r) => [r.key, s[m.key] && s[m.key][r.key] !== "" ? s[m.key][r.key] : "—"]))]));
};

/* ================================================================
   MOTOR / NEURO LAYER
   Added to carry the ACoA initiation-and-persistence approach:
   involvement scoring, priming, quick-stretch, rhythm, standing dose.
   ================================================================ */

/* The involvement scale. The core measure — everything gates on it.
   Score the BEST response of the exercise, not the average. */
export const INVOLVEMENT = [
  { score: 0, label: "Passive",        note: "You moved a passive limb. No contribution.",              color: C.stone,    tint: "#E7EAE6" },
  { score: 1, label: "Flicker",        note: "Muscle activity under your hand, no movement produced.",  color: C.clayDeep, tint: "#EFDCC8" },
  { score: 2, label: "With help",      note: "Contributes while facilitated — dies when you stop.",     color: C.clay,     tint: C.clayTint },
  { score: 3, label: "Carries on",     note: "Continues briefly after you reduce, or starts before your cue.", color: "#7A9A5B", tint: "#EAF0E0" },
  { score: 4, label: "On his own",     note: "Initiates and sustains without facilitation.",            color: C.sage,     tint: C.sageTint },
];

/* Gate rule shown in the app so nobody progresses on a single good day. */
export const GATE_RULE = "Progress standing time or reduce support only after a 3 appears and repeats across sessions. One good moment is noise.";

/* ================================================================
   TWO-AXIS PRINCIPLE (handoff §3) — sitting only
   Involvement (above) measures neural contribution; support level
   measures where the facilitator's hands were. They move independently
   and both must be recorded for sitting, so progress on either axis is
   visible. Aligned to SATCo support placements so the daily metric and
   the fortnightly clinical assessment share one axis.
   ================================================================ */
export const SUPPORT_LEVELS = [
  { level: 0, label: "Fully reclined",     note: "No active demand." },
  { level: 1, label: "Full back support",  note: "Upright with full back support." },
  { level: 2, label: "Shoulder girdle",    note: "Hands at the shoulder girdle." },
  { level: 3, label: "Axillae",            note: "Hands at the axillae." },
  { level: 4, label: "Inferior scapula",   note: "Hands at the inferior scapula." },
  { level: 5, label: "Lower ribs",         note: "Hands at the lower ribs." },
  { level: 6, label: "Upper lumbar",       note: "Hands below the ribs (upper lumbar)." },
  { level: 7, label: "Pelvis",             note: "Hands at the pelvis." },
  { level: 8, label: "No support",         note: "Hands hovering / off." },
];
export const supportLabel = (n) => (SUPPORT_LEVELS[n] ? SUPPORT_LEVELS[n].label : "—");

/* ================================================================
   EXERCISE CATEGORIES (handoff §3A) — drives scheduling, scoring, charting
     active_training — he can contribute now; involvement ≥2 achievable.
                       Fatigue-sensitive (schedule early). Involvement-scored.
     substrate       — passive/load-based (ROM, positioning, bone loading,
                       stretch under body weight). Fatigue-indifferent. NOT
                       involvement-scored — log dose/range/completion only.
     probe           — hunting for trace activity below visible movement.
                       Most fatigue-sensitive. Detection outcome, not involvement.
   ================================================================ */
export const EXERCISE_CATEGORIES = {
  active_training: { key: "active_training", label: "Active training", fatigueSensitive: true,  involvementScored: true },
  substrate:       { key: "substrate",       label: "Substrate",       fatigueSensitive: false, involvementScored: false },
  probe:           { key: "probe",           label: "Probe",           fatigueSensitive: true,  involvementScored: false },
};
/* Default so pre-category rows and typed-in exercises still behave: an
   exercise with no category is treated as active_training (the old default —
   everything was involvement-scored). */
export const categoryOf = (ex) => (ex && ex.category) || "active_training";
export const isInvolvementScored = (ex) => EXERCISE_CATEGORIES[categoryOf(ex)].involvementScored;

/* Position blocks (handoff §9) — the one-way postural sequence. Demand items
   run non-decreasing supine → sitting → standing; the wind-down may return to
   supine but carries substrate only. */
export const POSITION_BLOCKS = [
  { key: "supine",    label: "Supine",    order: 0 },
  { key: "sidelying", label: "Sidelying", order: 1 },
  { key: "sitting",   label: "Sitting",   order: 2 },
  { key: "standing",  label: "Standing",  order: 3 },
  { key: "wind_down", label: "Wind-down", order: 4 },
];
export const positionOrder = (key) => {
  const b = POSITION_BLOCKS.find((p) => p.key === key);
  return b ? b.order : 99;
};

/* Detection outcome for probe exercises (handoff §3A) — a probe records
   whether trace activity was found, not an involvement score. */
export const PROBE_OUTCOMES = [
  { key: "nothing",   label: "Nothing detected" },
  { key: "flicker",   label: "Flicker under the hand" },
  { key: "movement",  label: "Visible movement" },
];

/* Segment tightness — one tap per priming segment (handoff §4.1). Feeds the
   contracture early-warning heatmap. */
export const TIGHTNESS_OPTIONS = [
  { key: "normal",             label: "Normal",       color: C.sage,     tint: C.sageTint },
  { key: "tighter_than_usual", label: "Tighter",      color: C.clay,     tint: C.clayTint },
  { key: "catch_felt",         label: "Catch felt",   color: C.clayDeep, tint: "#EFDCC8" },
];

/* Warm-up & readiness — the prep tasks. Set up on the session-setup screen
   rather than run live: get him loaded through the feet, wake the motor
   system, and confirm he's actually alert before anything starts. */
export const READINESS_STEPS = [
  { key: "loaded", title: "Sitting, feet loaded", note: "Feet flat and firmly on the floor, not dangling. Pressure through the soles is the trigger." },
  { key: "arm",    title: "Right-arm resisted",   note: "3–4 min diagonal push/pull to a rhythm. Wakes the whole motor system (irradiation)." },
  { key: "alert",  title: "Arousal check",        note: "Is he actually alert? A session on a drowsy brain teaches nothing." },
];

/* Block A — priming, run live right before the opening. Full-body ROM broken
   into segments so each can be worked and logged; ankle dorsiflexion to
   neutral is the priority, since losing it ends the standing goal. Slow and
   sustained throughout — this is tissue work, not a warm-up rush. */
export const ROM_SEGMENTS = [
  { key: "ankles",    title: "Ankles",         note: "Dorsiflexion to neutral — the priority. Slow, sustained hold.", priority: true },
  { key: "knees",     title: "Knees",          note: "Full flexion and extension." },
  { key: "hips",      title: "Hips",           note: "Flexion, abduction, and gentle rotation." },
  { key: "trunk",     title: "Trunk",          note: "Side flexion and rotation, both directions." },
  { key: "shoulders", title: "Shoulders",      note: "Flexion and external rotation — the right especially." },
  { key: "hands",     title: "Wrists & hands", note: "Open the hand, extend the wrist and fingers." },
  { key: "neck",      title: "Neck",           note: "Gentle rotation and side flexion." },
];

/* Quick stretch — the neural one. Distinct from the ROM above.
   Effect decays in seconds, so it happens at the point of use. */
export const QUICK_STRETCH_NOTE =
  "Brisk 5–10 second stretch into the muscle you're about to ask for. This is neural priming, not tissue work — it raises motor-neuron excitability so a weak signal can reach threshold, and the effect fades within about a minute. It has to happen now, not at the start of the session.";

/* Rhythm — Rule 2. Substitutes for the missing internal timekeeper. */
export const METRONOME_DEFAULT_BPM = 20;
export const METRONOME_MIN_BPM = 10;
export const METRONOME_MAX_BPM = 120;
export const METRONOME_STEP_BPM = 2;

/* Fade probe — once per session, at closing. */
export const FADE_PROBE_NOTE =
  "Once per session, on one activity, reduce your facilitation and see what remains. Probing is not progressing — you probe daily to collect data, and only actually reduce support when involvement says he's ready.";

export const FADE_OUTCOMES = [
  { key: "nothing",  label: "Nothing remained" },
  { key: "flicker",  label: "A flicker held" },
  { key: "brief",    label: "Held briefly" },
  { key: "held",     label: "Held it" },
];

/* ================================================================
   STANDING DOSE (handoff §4.3) — replaces the vague quality rating.
   (The old STANDING_QUALITY scale was removed; old sessions that stored
   standing.quality still render — report.js / SessionDetail handle both.)
   A TRAM stand can become suspension (load in the walking saddle, knees
   flexed) while minutes still trend up, so record what actually loaded.
   ================================================================ */
export const STANDING_DEVICES = [
  { key: "tram",           label: "TRAM" },
  { key: "standing_frame", label: "Standing frame" },
  { key: "other",          label: "Other" },
];
export const KNEE_POSITIONS = [
  { key: "extended",             label: "Extended",     note: "Knees loaded through extension." },
  { key: "intermittent_buckling",label: "Intermittent", note: "Buckling now and then." },
  { key: "flexed_suspended",     label: "Suspended",    note: "Flexed — weight in the saddle, not the legs.", warn: true },
];
export const LEG_LOADING = [
  { key: "none_visible", label: "None visible" },
  { key: "partial",      label: "Partial" },
  { key: "substantial",  label: "Substantial" },
];
/* Skin check under the saddle / at electrode sites. non_blanching and broken
   raise an alert and block standing progression until cleared (§4.3, §6). */
export const SKIN_CHECK = [
  { key: "clear",                label: "Clear",              alert: false },
  { key: "redness_blanching",    label: "Redness (blanches)", alert: false },
  { key: "redness_non_blanching",label: "Redness (stays)",    alert: true },
  { key: "broken_skin",          label: "Broken skin",        alert: true },
];
export const skinCheckAlerts = (key) => {
  const s = SKIN_CHECK.find((x) => x.key === key);
  return !!(s && s.alert);
};
export const TOLERANCE_END_REASONS = [
  { key: "planned_end", label: "Planned end" },
  { key: "fatigue",     label: "Fatigue" },
  { key: "dizziness",   label: "Dizziness" },
  { key: "pain",        label: "Pain" },
  { key: "distress",    label: "Distress" },
  { key: "skin",        label: "Skin" },
  { key: "other",       label: "Other" },
];

/* Sitting-specific detail (handoff §4.3). */
export const SITTING_SURFACES = [
  { key: "firm_plinth", label: "Firm plinth" },
  { key: "compliant",   label: "Compliant" },
  { key: "edge_of_bed", label: "Edge of bed" },
  { key: "wheelchair",  label: "Wheelchair" },
];

/* Rolling patterns (handoff §4.3). Segmental trains trunk dissociation; log
   rolling is the compensatory pattern — schedule segmental as the majority. */
export const ROLL_PATTERNS = [
  { key: "log",                    label: "Log roll" },
  { key: "segmental_shoulder_led", label: "Segmental · shoulder-led" },
  { key: "segmental_pelvis_led",   label: "Segmental · pelvis-led" },
];
export const ROLL_DIRECTIONS = [
  { key: "left",  label: "Left" },
  { key: "right", label: "Right" },
];

/* PNF trunk patterns (handoff §4.3) — new exercise type. */
export const PNF_PATTERNS = [
  { key: "chop",                       label: "Chop" },
  { key: "reverse_chop",               label: "Reverse chop" },
  { key: "lift",                       label: "Lift" },
  { key: "reverse_lift",               label: "Reverse lift" },
  { key: "rhythmic_stabilisation",     label: "Rhythmic stabilisation" },
  { key: "rhythmic_initiation",        label: "Rhythmic initiation" },
  { key: "pelvic_anterior_elevation",  label: "Pelvic anterior elevation" },
  { key: "pelvic_posterior_depression",label: "Pelvic posterior depression" },
];
export const PNF_PHASES = [
  { key: "passive",         label: "Passive" },
  { key: "active_assisted", label: "Active-assisted" },
  { key: "active",          label: "Active" },
  { key: "resisted",        label: "Resisted" },
];

/* ================================================================
   xStep — transcutaneous spinal stimulation (handoff §4.5)
   Montage is set once at setup; current changes frequently. Montage is
   stamped per exercise so the app can eventually compare which montage
   produces better involvement for which exercise.
   ================================================================ */
export const STIM_MONTAGES = [
  { key: "upper_body", label: "Upper body", red: "C4–C5",   blue: "C7–T1" },
  { key: "full_body",  label: "Full body",  red: "C7–T1",   blue: "T11–T12" },
  { key: "lower_body", label: "Lower body", red: "T11–T12", blue: "L1–L2" },
];
export const montageLabel = (key) => {
  const m = STIM_MONTAGES.find((x) => x.key === key);
  return m ? m.label : "—";
};
export const STIM_CURRENT_MIN = 0;
export const STIM_CURRENT_MAX = 120;
export const STIM_CURRENT_STEP = 1;
/* Optional annotation on a current change — distinguishes titration-chasing
   ("no response") from planned progression. */
export const STIM_CHANGE_REASONS = [
  { key: "no_response", label: "No response" },
  { key: "discomfort",  label: "Discomfort" },
  { key: "protocol",    label: "Protocol" },
];

/* The session-level xStep record. `used` stays false until the facilitator
   starts it from the banner. `montage`/`current`/`state` are the live banner
   values; `events` is the change log that produces the current curve. Each
   exercise result also carries a stamp (stim_state/current/montage) copied on
   completion — stamp for attribution, event log for the curve (§4.5). */
export const emptyStim = () => ({
  used: false,
  device: "xstep",
  montage_initial: null,
  montage_rationale: "",
  started_at_phase: null,
  stopped_at_phase: null,
  tolerance_notes: "",
  skin_check_electrode_sites_pre: null,
  skin_check_electrode_sites_post: null,
  montage: null,
  current: 20,
  state: "off",
  events: [],
});
/* The per-exercise stamp — copied onto a result on completion, no facilitator
   input. Off (and null current/montage) whenever stim isn't running. */
export const stimStampOf = (stim) => ({
  stim_state: stim && stim.used && stim.state === "on" ? "on" : "off",
  stim_current: stim && stim.used ? stim.current : null,
  stim_montage: stim && stim.used ? stim.montage : null,
});

/* What "count" means for a given exercise. Reps is meaningless for TRAM
   standing (minutes) or a perturbation drill (catches) — read the label
   off the exercise instead of hardcoding "reps" everywhere. */
export const UNIT_LABELS = {
  reps: "reps",
  minutes: "minutes",
  shifts: "shifts",
  reaches: "reaches",
  catches: "catches",
  attempts: "attempts",
  task: "times",
};
export const unitLabel = (unit) => UNIT_LABELS[unit] || "reps";

/* Session recall — the cognitive opening on any non-first session.
   Sessions aren't stored, so the facilitator confirms what was worked on
   last time (pre-filled from the schedule), then scores each item on this
   short cue ladder. The middle rung — a category prompt — is what keeps a
   post-weekend Monday score fair rather than reading as decline. */
export const RECALL_RATINGS = [
  { score: 0, key: "own",  label: "On his own",   note: "Named it unprompted",           color: C.sage,  tint: C.sageTint },
  { score: 1, key: "cue",  label: "After a cue",  note: "Came after a category prompt",   color: C.clay,  tint: C.clayTint },
  { score: 2, key: "miss", label: "Not recalled", note: "Didn't come, even with a cue",   color: C.stone, tint: "#E7EAE6" },
];

/* ================================================================
   TODAY'S SESSION — weekday presets
   Three fixed slots (trunk / loading / extensor probe) plus one
   rotating weekly-emphasis slot. Encoding the week here is what stops
   an attendant drifting toward the easy and familiar and away from
   loading once the novelty wears off.
   ================================================================ */
export const DAY_PLAN = {
  1: { label: "Monday · loading",      ids: ["seated-perturbation", "tram-weight-bearing", "extensor-probe", "tram-arm-drive"] },
  2: { label: "Tuesday · trunk",       ids: ["seated-perturbation", "tram-weight-bearing", "extensor-probe", "seated-reach-limits"] },
  3: { label: "Wednesday · probe day", ids: ["seated-perturbation", "tram-weight-bearing", "extensor-probe", "knee-extension-probe"] },
  4: { label: "Thursday · reach",      ids: ["seated-weight-shift-beat", "tram-weight-bearing", "extensor-probe", "cross-midline-reach"] },
  5: { label: "Friday · sit-to-stand", ids: ["seated-perturbation", "tram-weight-bearing", "tram-sit-to-stand", "extensor-probe"] },
  6: { label: "Saturday · caregiver",  ids: ["sitting-tolerance", "real-object-task", "cross-midline-reach"] },
  0: { label: "Sunday · rest day",     ids: [] },
};

/* The recall reference. With no session storage, we approximate "last
   session" from the schedule: the most recent weekday (Mon–Fri) with a plan,
   walking back from today. Weekends are skipped as a reference so Monday
   points back at Friday — matching how the sessions actually run, and making
   the ~3-day gap explicit rather than hidden. Returns null on the very first
   run of the week with nothing before it. The facilitator always confirms or
   edits the pre-filled list before scoring — this is only a starting point. */
export function previousTrainingDay(todayIndex) {
  for (let back = 1; back <= 7; back++) {
    const d = (todayIndex - back + 7) % 7;
    if (d === 0 || d === 6) continue; // weekend — not a recall reference
    const plan = DAY_PLAN[d];
    if (plan && plan.ids.length > 0) return { label: plan.label, ids: plan.ids, daysAgo: back };
  }
  return null;
}
