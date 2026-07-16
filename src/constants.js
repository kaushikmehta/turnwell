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
export const DECK_CHEER = ["You're doing brilliantly — keep going.", "That was a full sentence. Nice work.", "Great describing — you built that yourself.", "Take your time. You've got this."];

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
