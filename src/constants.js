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
  { key: "tired",      label: "Tiredness",  hint: "1 fresh … 10 exhausted" },
  { key: "mood",       label: "Mood",       hint: "1 low … 10 great" },
  { key: "motivation", label: "Motivation", hint: "1 none … 10 fully keen" },
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
  { key: "normal",             label: "Normal",     note: "Moves freely through range — soft end-feel, no restriction.",           color: C.sage,     tint: C.sageTint },
  { key: "tighter_than_usual", label: "Tighter",    note: "Stiffer or shorter than usual — resistance before the end, but it gives.", color: C.clay,     tint: C.clayTint },
  { key: "catch_felt",         label: "Catch felt", note: "A distinct grab on the stretch — the muscle catches. A spasticity sign; flag it.", color: C.clayDeep, tint: "#EFDCC8" },
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

/* Fade probe — once per session, at closing (recorded at the sit-down after
   standing, §9.3). Structured on the same 0–8 support scale as everything else
   so it is the densest daily signal on the primary goal (§4.4). */
export const FADE_PROBE_NOTE =
  "Once per session, on one activity, reduce your facilitation and see what remains. Probing is not progressing — you probe daily to collect data, and only actually reduce support when involvement says he's ready.";

/* Kept for reading old sessions that stored the pre-§4.4 outcome key. */
export const FADE_OUTCOMES = [
  { key: "nothing",  label: "Nothing remained" },
  { key: "flicker",  label: "A flicker held" },
  { key: "brief",    label: "Held briefly" },
  { key: "held",     label: "Held it" },
];
export const FADE_PROBE_OUTCOMES = [
  { key: "held",             label: "Held it" },
  { key: "partial",          label: "Partial" },
  { key: "lost_immediately", label: "Lost immediately" },
];

/* ================================================================
   OPENING STATE (handoff §4.2) — the "since last session" fields. Near-daily,
   facilitator-run, so this replaces any separate daily-log surface — do not
   build a second state-tracking screen. Drives the discount gate (§6):
   post_ictal, fatigue_pre >= 7, or alertness <= 2 discount a session.
   ================================================================ */
export const INSTRUCTION_FOLLOWING = [
  { key: "none",        label: "None" },
  { key: "single_step", label: "Single-step" },
  { key: "two_step",    label: "Two-step" },
  { key: "multi_step",  label: "Multi-step" },
];
export const INITIATION = [
  { key: "absent",  label: "Absent" },
  { key: "delayed", label: "Delayed" },
  { key: "prompt",  label: "Prompt" },
];
/* 1–5 clinical mini-scales (distinct from the subjective before/after
   tired/mood/motivation ratings, which stay). */
export const SLEEP_QUALITY_SCALE = [1, 2, 3, 4, 5];
export const ALERTNESS_SCALE = [1, 2, 3, 4, 5]; // 1 drowsy … 5 fully alert

export const emptyOpeningState = () => ({
  sleep_hours: "", sleep_quality: null,
  fatigue_pre: null, alertness: null,
  instruction_following: null, initiation: null,
  pain: null, pain_location: "",
  seizure_since_last: false,
  seizure_detail: { datetime: "", duration_seconds: "", description: "", recovery_minutes: "" },
  post_ictal: false,
  medication_change: false, medication_note: "",
});
/* A session is discounted from the progression gate when any of these hold. */
export const isDiscounted = (st) =>
  !!st && (st.post_ictal === true || (typeof st.fatigue_pre === "number" && st.fatigue_pre >= 7) || (typeof st.alertness === "number" && st.alertness <= 2));
export const discountReason = (st) => {
  if (!st) return null;
  if (st.post_ictal) return "post-ictal";
  if (typeof st.fatigue_pre === "number" && st.fatigue_pre >= 7) return `high fatigue (${st.fatigue_pre}/10)`;
  if (typeof st.alertness === "number" && st.alertness <= 2) return `low alertness (${st.alertness}/5)`;
  return null;
};

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

/* ================================================================
   ASSESSMENTS (handoff §5) — clinical / periodic instruments are RECORDED,
   never administered. The app never presents test items (licensing + test
   validity). Each is stored in the sessions table as domain physio with
   payload.kind = 'assessment' and payload.assessment_type.
   ================================================================ */
export const ASSESSMENT_TYPES = [
  { key: "satco",              label: "SATCo",               cadence: "Fortnightly", blurb: "Segmental trunk control — 7 levels × static/active/reactive." },
  { key: "tardieu",           label: "Modified Tardieu",    cadence: "Monthly",     blurb: "Spasticity vs contracture — R1 catch angle vs R2 full range." },
  { key: "goniometry",        label: "Goniometry",          cadence: "Monthly",     blurb: "Joint range per motion, per side." },
  { key: "peak_cough_flow",   label: "Peak cough flow",     cadence: "Monthly",     blurb: "Best of three (L/min). Trunk weakness degrades cough." },
  { key: "tis",               label: "TIS",                 cadence: "Quarterly",   blurb: "Trunk Impairment Scale — static / dynamic / coordination." },
  { key: "scim3",             label: "SCIM III",            cadence: "Quarterly",   blurb: "Independence / care burden (0–100)." },
  { key: "gas",               label: "GAS",                 cadence: "Quarterly",   blurb: "Goal Attainment — −2…+2 per pre-written goal." },
  { key: "fss",               label: "FSS",                 cadence: "Quarterly",   blurb: "Fatigue Severity Scale — 9 items, 1–7, stored as mean." },
  { key: "cognitive_external",label: "External cognitive",  cadence: "As done",     blurb: "Record a MoCA / ACE-III score administered elsewhere." },
  { key: "performance_ratings",label: "Performance ratings", cadence: "Monthly",    blurb: "Therapist's 1–10 rating of Akki vs baseline — engagement, focus, memory, motivation, stamina." },
  { key: "paradigm_ratings",   label: "Paradigm ratings",   cadence: "Pre / post",  blurb: "Therapist's own experience of the program — ease of learning, remembering, and fit into the session." },
  { key: "exercise_baselines", label: "Exercise baselines", cadence: "Re-baseline", blurb: "Akki's baseline count & difficulty per exercise — the reference capacity gains are measured against." },
];

/* Who is filling in a rating scale, and when. Both spreadsheets are filled by a
   therapist (not by Akki), so every rating is attributed to a rater and a
   timepoint so baseline→monthly movement can be read per rater. */
export const RATING_RATERS = [
  { key: "akash",  label: "Akash" },
  { key: "charmi", label: "Charmie" },
];

/* Baselines can be taken by a wider set than the two therapists — including
   family, or anyone else (typed into "Other"). */
export const BASELINE_RATERS = [
  { key: "akash",  label: "Akash" },
  { key: "charmi", label: "Charmie" },
  { key: "family", label: "Family" },
  { key: "other",  label: "Other" },
];

/* Monthly timepoints for the performance scale (mirrors the sheet's baseline +
   month-end cadence). Baseline is recorded retrospectively. */
export const PERFORMANCE_TIMEPOINTS = [
  { key: "baseline", label: "Baseline" },
  { key: "2026-08",  label: "Aug 2026" },
  { key: "2026-09",  label: "Sep 2026" },
  { key: "2026-10",  label: "Oct 2026" },
  { key: "2026-11",  label: "Nov 2026" },
  { key: "2026-12",  label: "Dec 2026" },
];

/* Performance dimensions — therapist's estimate of Akki vs baseline, 1–10.
   "Increase in capacity" is captured as a qualitative note, not a number. */
export const PERFORMANCE_DIMENSIONS = [
  { key: "engagement", label: "Engagement in session" },
  { key: "awareness",  label: "Awareness about session goals & exercises" },
  { key: "focus",      label: "Focus and attention" },
  { key: "memory",     label: "Memory" },
  { key: "motivation", label: "Motivation", note: "Actual motivation to participate — not the verbal 9 he always gives." },
  { key: "stamina",    label: "Stamina" },
];

/* Paradigm scale — the therapist's own experience of running the program.
   Recorded PRE (early) and POST (after a stretch of use). */
export const PARADIGM_STAGES = [
  { key: "pre",  label: "PRE" },
  { key: "post", label: "POST" },
];
export const PARADIGM_DIMENSIONS = [
  { key: "ease_learning",       label: "Ease of learning" },
  { key: "ease_remembering",    label: "Ease of remembering steps" },
  { key: "ease_fitting",        label: "Ease of fitting the program into session flow" },
  { key: "overall_achievement", label: "Overall achievement", note: "Achieved, out of the full potential." },
];

/* SATCo (§5.1). Seven segmental levels × three control types; each present /
   absent / not-tested. Levels 1–7 are tested; 8 = full trunk control shown. */
export const SATCO_LEVELS = [
  { level: 1, label: "Head" },
  { level: 2, label: "Upper thoracic" },
  { level: 3, label: "Mid-thoracic" },
  { level: 4, label: "Lower thoracic" },
  { level: 5, label: "Upper lumbar" },
  { level: 6, label: "Lower lumbar" },
  { level: 7, label: "Full trunk (tested)" },
];
export const SATCO_CONTROLS = [
  { key: "static",   label: "Static",   help: "Neutral vertical head & trunk held 5 seconds." },
  { key: "active",   label: "Active",   help: "Neutral posture kept while turning head 45° and/or reaching both sides." },
  { key: "reactive", label: "Reactive", help: "Neutral posture kept or quickly regained after a brisk nudge." },
];
export const SATCO_CELLS = ["P", "A", "NT"];
/* Highest level with control present, counting contiguous P from level 1.
   All seven present → 8 (full trunk control demonstrated). 0 = none. */
export const satcoLevel = (grid, control) => {
  let n = 0;
  for (let l = 1; l <= 7; l++) {
    if (grid[l] && grid[l][control] === "P") n = l; else break;
  }
  return n === 7 ? 8 : n;
};

/* Modified Tardieu (§5.2) — replaces Ashworth; separates spasticity from
   contracture. R1 = catch angle at fast stretch, R2 = full range at slow
   stretch; R2−R1 is the clinically meaningful object. */
export const TARDIEU_MUSCLES = [
  { key: "plantarflexors_knee_ext",  label: "Plantarflexors (knee ext)" },
  { key: "plantarflexors_knee_flex", label: "Plantarflexors (knee flex)" },
  { key: "hamstrings",               label: "Hamstrings" },
  { key: "hip_flexors",              label: "Hip flexors" },
  { key: "hip_adductors",            label: "Hip adductors" },
  { key: "quadriceps",               label: "Quadriceps" },
  { key: "elbow_flexors",            label: "Elbow flexors" },
  { key: "wrist_flexors",            label: "Wrist flexors" },
];
export const TARDIEU_QUALITY = [
  { grade: 0, label: "No resistance" },
  { grade: 1, label: "Slight, no catch" },
  { grade: 2, label: "Clear catch then release" },
  { grade: 3, label: "Fatigable clonus (<10s)" },
  { grade: 4, label: "Infatigable clonus (>10s)" },
  { grade: 5, label: "Joint immovable" },
];

/* Goniometry (§5.3) — per joint motion, per side. Alert on loss ≥5–10°. */
export const GONIOMETRY_MOTIONS = [
  { key: "ankle_df_knee_flexed",   label: "Ankle dorsiflexion (knee flexed)" },
  { key: "ankle_df_knee_extended", label: "Ankle dorsiflexion (knee extended)" },
  { key: "hip_extension",          label: "Hip extension" },
  { key: "knee_extension",         label: "Knee extension / popliteal angle" },
  { key: "hip_abduction",          label: "Hip abduction" },
  { key: "shoulder_flexion",       label: "Shoulder flexion" },
  { key: "shoulder_er",            label: "Shoulder external rotation" },
];
export const BODY_SIDES = [{ key: "left", label: "Left" }, { key: "right", label: "Right" }];

/* Peak cough flow (§5.4) — bands to confirm with the treating team. */
export const COUGH_FLOW_BANDS = [
  { min: 270, label: "Adequate (>270)", alert: false },
  { min: 160, label: "Impaired (160–270)", alert: false },
  { min: 0,   label: "Ineffective (<160) — high risk", alert: true },
];
export const coughFlowBand = (v) => COUGH_FLOW_BANDS.find((b) => v >= b.min) || COUGH_FLOW_BANDS[COUGH_FLOW_BANDS.length - 1];

/* TIS subscales (§5.5). */
export const TIS_SUBSCALES = [
  { key: "static",       label: "Static sitting", max: 7 },
  { key: "dynamic",      label: "Dynamic sitting", max: 10 },
  { key: "coordination", label: "Coordination", max: 6 },
];
export const GAS_LEVELS = [
  { level: -2, label: "−2 much less than expected" },
  { level: -1, label: "−1 less than expected" },
  { level: 0,  label: "0 expected" },
  { level: 1,  label: "+1 better than expected" },
  { level: 2,  label: "+2 much better than expected" },
];
export const FSS_ITEMS = 9; // 1–7 each, stored as mean
export const COGNITIVE_INSTRUMENTS = [
  { key: "MoCA", label: "MoCA" },
  { key: "ACE-III", label: "ACE-III" },
  { key: "other", label: "Other" },
];

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
/* Revised day templates (handoff §9.6). Two emphases — trunk (Mon/Wed/Fri,
   full_body montage) and loading & probes (Tue/Thu, lower_body) — with ids in
   one-way position-flow order: sidelying → sitting → standing → wind-down.
   `montage` is the xStep emphasis for the day; `ids` stays flat for the recall
   reference and the setup pre-select. */
export const DAY_PLAN = {
  1: { label: "Monday · trunk",   montage: "full_body",  ids: ["segmental-rolling", "come-to-sit", "rhythmic-stabilisation", "pnf-chop-lift", "tram-weight-bearing", "bridging"] },
  2: { label: "Tuesday · loading & probes", montage: "lower_body", ids: ["segmental-rolling", "knee-extension-probe", "come-to-sit", "seated-perturbation", "tram-weight-bearing", "bridging"] },
  3: { label: "Wednesday · trunk", montage: "full_body", ids: ["segmental-rolling", "come-to-sit", "rhythmic-stabilisation", "forward-lean-table", "tram-weight-bearing", "bridging"] },
  4: { label: "Thursday · loading & probes", montage: "lower_body", ids: ["segmental-rolling", "knee-extension-probe", "come-to-sit", "side-sitting-prop", "tram-weight-bearing", "bridging"] },
  5: { label: "Friday · trunk",   montage: "full_body",  ids: ["segmental-rolling", "come-to-sit", "rhythmic-stabilisation", "pnf-chop-lift", "tram-sit-to-stand", "tram-weight-bearing", "bridging"] },
  6: { label: "Saturday · caregiver", ids: ["sitting-tolerance", "real-object-task", "cross-midline-reach"] },
  0: { label: "Sunday · rest day",     ids: [] },
};

/* Position-flow validation (handoff §9.1). Given the ordered selected items,
   return an array of human-readable problems (empty = valid):
     1. demand items (active_training / probe) run non-decreasing in position;
     2. the wind-down block carries substrate only. */
export function validatePositionFlow(items) {
  const problems = [];
  let maxSeen = -1;
  let maxTitle = "";
  items.forEach((ex) => {
    const cat = (ex.category) || "active_training";
    const ord = positionOrder(ex.position_block);
    if (ex.position_block === "wind_down" && cat !== "substrate") {
      problems.push(`"${ex.title}" is in the wind-down but isn't substrate — wind-down is fatigue-indifferent items only.`);
    }
    // Demand items must not step backwards in position.
    if (cat !== "substrate") {
      if (ord < maxSeen) {
        problems.push(`"${ex.title}" (${ex.position_block}) comes after ${maxTitle} — demand should run supine → sitting → standing.`);
      }
      if (ord >= maxSeen) { maxSeen = ord; maxTitle = `"${ex.title}"`; }
    }
  });
  return problems;
}

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
