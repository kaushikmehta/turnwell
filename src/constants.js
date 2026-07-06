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
};

export const RATINGS = [
  { key: "independent", label: "On their own",      note: "Full sentence, no cue",          score: 0, color: C.sage,     tint: C.sageTint },
  { key: "cue1",        label: "After a starter",   note: "Needed a sentence starter",      score: 1, color: "#7A9A5B", tint: "#EAF0E0" },
  { key: "cue2",        label: "After a fill-in",   note: "Needed a fill-in-the-blank",     score: 2, color: C.clay,    tint: C.clayTint },
  { key: "cue3",        label: "After a sound cue", note: "Needed a first-sound cue",       score: 3, color: C.clayDeep, tint: "#EFDcC8" },
  { key: "notyet",      label: "Not yet",           note: "Single word or no response",     score: 4, color: C.stone,   tint: "#E7EAE6" },
];

export const PHYSIO_RATINGS = [
  { key: "independent", label: "Active",              note: "Moved with no assist",           score: 0, color: C.sage,     tint: C.sageTint },
  { key: "cue1",        label: "With verbal cue",    note: "Needed verbal prompt",           score: 1, color: "#7A9A5B", tint: "#EAF0E0" },
  { key: "cue2",        label: "Active-assisted",    note: "Facilitator guided movement",    score: 2, color: C.clay,    tint: C.clayTint },
  { key: "cue3",        label: "Passive",            note: "Facilitator did the movement",   score: 3, color: C.clayDeep, tint: "#EFDcC8" },
  { key: "notyet",      label: "Not today",          note: "Declined or contraindicated",    score: 4, color: C.stone,   tint: "#E7EAE6" },
];

export const AREAS = [
  "Everyday requests",
  "Out and about",
  "On the phone",
  "Talking about your day",
  "People & family",
  "Describing a scene",
  "Health & wellbeing",
];

export const PHASE_ORDER = ["warmup", "active", "cooldown"];
export const PHASE_LABELS = {
  warmup: "Warm-up / Stretches",
  active: "Active / Assisted",
  cooldown: "Cool-down",
};

export const DECK_RUNGS = { name: "Name what you see", two_words: "Two words together", fill: "Fill in the blank", describe: "Describe it — 2–3 sentences" };
export const DECK_CHEER = ["You're doing brilliantly — keep going.", "That was a full sentence. Nice work.", "Great describing — you built that yourself.", "Take your time. You've got this."];
