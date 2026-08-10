/*
 * In-progress session persistence (one active draft at a time).
 *
 * Completed sessions go to the database (see src/api.js). A *draft* is the
 * live, unfinished session — autosaved to localStorage so a reload/crash mid-
 * session doesn't lose it. On completion or quit the draft is cleared; Home
 * offers "Continue" whenever one exists.
 *
 * Storage is local to this device/browser (no cross-device resume) — the right
 * trade for a single facilitator working on one tablet, and it keeps the hot
 * path (every answer/tick) off the network.
 */
const KEY = "turnwell:draft";

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Persist the current state for `domain`. Preserves the original startedAt
// across autosaves of the same session.
export function saveDraft(domain, state) {
  try {
    const prev = loadDraft();
    const startedAt = prev && prev.domain === domain ? prev.startedAt : Date.now();
    localStorage.setItem(KEY, JSON.stringify({ domain, startedAt, updatedAt: Date.now(), state }));
  } catch {
    /* storage full or unavailable — resume simply won't be offered */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

const DOMAIN_LABEL = { speech: "Speech", physio: "Physio / OT", reading: "Reading" };

// A short human summary of a draft for the Home "Continue" card.
export function draftSummary(draft) {
  if (!draft) return null;
  const { domain, state, startedAt } = draft;
  const n = state?.results?.length ?? 0;
  let detail;
  if (domain === "speech") detail = `${n} answered`;
  else if (domain === "physio") {
    const total = state?.config?.items?.length;
    detail = total ? `${n}/${total} exercises done` : `${n} exercises done`;
  } else if (domain === "reading") detail = `${n} questions logged`;
  else detail = "in progress";

  const time = startedAt ? new Date(startedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
  return { label: DOMAIN_LABEL[domain] || domain, detail, time };
}
