/*
 * Session reports — plain text, WhatsApp-friendly (no markdown).
 * Copied to the clipboard rather than URL-encoded, so there's no length limit —
 * written to be read by a human (the coordinator, later you), not parsed by a script.
 */
import { ratingByKey, supportWord, isDeck, isScene } from "./utils";
import { READING_RATINGS, unitLabel } from "./constants";

const understandWord = { yes: "yes", partly: "partly", no: "no" };

export function buildReadingReport(session, patientName = "Akki") {
  const { passages, results, notes } = session;
  const dt = new Date(session.at || Date.now());
  const dateStr = dt.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const total = results.length;
  const counts = {};
  results.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const avg = total ? results.reduce((s, r) => s + ratingByKey(r.rating, READING_RATINGS).score, 0) / total : 0;
  const independent = counts.independent || 0;

  const lines = [];
  lines.push(`Turnwell — reading & comprehension session with ${patientName}`);
  lines.push(`${dateStr} at ${timeStr}`);
  lines.push("");
  lines.push(`${passages.length} passage${passages.length > 1 ? "s" : ""} read, ${total} question${total !== 1 ? "s" : ""} asked.`);
  lines.push(`Answered independently: ${independent}/${total}.`);
  lines.push(`Typical support needed: ${supportWord(avg)}.`);
  lines.push("");

  lines.push("Breakdown:");
  READING_RATINGS.forEach((r) => { lines.push(`  ${r.label}: ${counts[r.key] || 0}`); });
  lines.push("");

  lines.push(`Passages and questions:`);
  lines.push("");
  let qNum = 1;
  passages.forEach((p) => {
    lines.push(`Passage${p.level ? ` (level ${p.level})` : ""}: "${p.text}"`);
    results.filter((r) => r.passageId === p.id).forEach((r) => {
      const rating = ratingByKey(r.rating, READING_RATINGS);
      lines.push(`  ${qNum}. ${r.question}`);
      lines.push(`     ${rating.label}${r.cueUsed ? ` (${r.cueUsed} cue${r.cueUsed > 1 ? "s" : ""} used)` : ""}`);
      qNum += 1;
    });
    lines.push("");
  });

  lines.push(`Notes: ${notes && notes.trim() ? notes.trim() : "—"}`);

  return lines.join("\n");
}

export function buildSpeechReport(rec, ratings, patientName = "Akki") {
  const dt = new Date(rec.at || Date.now());
  const dateStr = dt.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const total = rec.results.length;
  const counts = {};
  rec.results.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const avg = total ? rec.results.reduce((s, r) => s + ratingByKey(r.rating, ratings).score, 0) / total : 0;
  const independent = counts.independent || 0;

  const nDecks = (rec.items || []).filter(isDeck).length;
  const nScenes = (rec.items || []).filter(isScene).length;
  const nLines = (rec.items || []).length - nScenes - nDecks;
  const madeOf = [nLines ? `${nLines} sentence${nLines > 1 ? "s" : ""}` : "", nScenes ? `${nScenes} scene${nScenes > 1 ? "s" : ""}` : "", nDecks ? `${nDecks} deck${nDecks > 1 ? "s" : ""}` : ""]
    .filter(Boolean).join(", ");

  const lines = [];
  lines.push(`Turnwell — speech session with ${patientName}`);
  lines.push(`${dateStr} at ${timeStr}`);
  lines.push("");
  lines.push(`${total} responses${madeOf ? ` across ${madeOf}` : ""}.`);
  lines.push(`Full sentences unaided: ${independent}/${total}.`);
  lines.push(`Typical support needed: ${supportWord(avg)}.`);
  lines.push("");

  lines.push("Breakdown:");
  ratings.forEach((r) => { lines.push(`  ${r.label}: ${counts[r.key] || 0}`); });
  lines.push("");

  lines.push(`Responses (${total}):`);
  lines.push("");
  rec.results.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.prompt}`);
    lines.push(`   ${ratingByKey(r.rating, ratings).label}`);
  });

  lines.push("");
  lines.push(`Notes: ${rec.notes && rec.notes.trim() ? rec.notes.trim() : "—"}`);

  return lines.join("\n");
}

const involveWord = {
  0: "0 passive", 1: "1 flicker", 2: "2 with help", 3: "3 carries on", 4: "4 on his own",
};
const fadeWord = {
  nothing: "nothing remained", flicker: "a flicker held", brief: "held briefly", held: "held it",
};
const ankleWord = {
  neutral: "reaches neutral", tight: "tight, short of neutral", lost: "not close to neutral",
};

export function buildPhysioReport(session, patientName = "Akki") {
  const { items, results, star, before, after, closing, priming } = session;
  const dt = new Date(session.at || Date.now());
  const dateStr = dt.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const lines = [];
  lines.push(`Turnwell — physio session with ${patientName}`);
  lines.push(`${dateStr} at ${timeStr}`);
  lines.push("");

  if (before || after) {
    if (before && after) {
      lines.push(`State: tiredness went from ${before.tired} to ${after.tired}, mood from ${before.mood} to ${after.mood} (before → after, out of 10).`);
    } else if (before) {
      lines.push(`Before the session: tiredness ${before.tired}/10, mood ${before.mood}/10.`);
    } else {
      lines.push(`After the session: tiredness ${after.tired}/10, mood ${after.mood}/10.`);
    }
    lines.push("");
  }

  if (priming) {
    lines.push(`Priming: ankle ${ankleWord[priming.ankle] || priming.ankle}.` +
      (priming.alertness ? ` Alertness ${priming.alertness}/10.` : "") +
      (priming.splint ? ` Splint worn ${priming.splint.hours}h, skin ${priming.splint.skinClear === false ? "NOT clear — needs refitting" : "clear"}.` : ""));
    if (priming.ankle === "lost") lines.push(`   ** Ankle range flagged — contracture here blocks standing. **`);
    lines.push("");
  }

  if (star) {
    lines.push(`Star exercise: ${star.title} — the one he was keenest to work on today.`);
    if (closing && closing.starRecalledTitle) {
      const matched = closing.starRecalledId === star.id;
      lines.push(matched
        ? `At closing he correctly recalled it: ${closing.starRecalledTitle} ✓`
        : `At closing he recalled ${closing.starRecalledTitle} instead — didn't match ✗`);
    }
    lines.push("");
  }

  lines.push(`Exercises (${results.length}):`);
  lines.push("");
  results.forEach((r, i) => {
    const tickWord = r.tick === "green" ? "matched — he predicted the difficulty correctly" : "didn't match — his prediction was off";
    const unit = unitLabel(r.unit);
    lines.push(`${i + 1}. ${r.title}`);
    lines.push(`   ${unit.charAt(0).toUpperCase() + unit.slice(1)}: ${r.actReps} actual (he estimated ${r.estReps})`);
    lines.push(`   Difficulty: ${r.actDiff}/10 actual, predicted ${r.estDiff}/10 — ${tickWord} (${r.tick})`);
    lines.push(`   INVOLVEMENT: ${involveWord[r.involvement] ?? r.involvement}`);
    if (r.standing) lines.push(`   Standing: ${r.standing.minutes} min — ${r.standing.quality === "held" ? "quality held" : r.standing.quality === "faded" ? "faded near the end" : "degraded, stopped early"}`);
    lines.push(`   Understood what it's for: ${understandWord[r.understood] || r.understood}`);
    lines.push(`   Dual-task: ${r.dualTask ? "yes" : "no"}${r.quickStretched ? " · quick-stretched first" : ""}`);
    lines.push("");
  });

  const green = results.filter((r) => r.tick === "green").length;
  const yellow = results.length - green;
  const understandCounts = { yes: 0, partly: 0, no: 0 };
  results.forEach((r) => { understandCounts[r.understood] = (understandCounts[r.understood] || 0) + 1; });

  lines.push(
    `Summary: ${results.length} exercises. Difficulty predictions matched on ${green} (green) and missed on ${yellow} (yellow) — ` +
    `this tracks his metacognition, not pass/fail. He explained what the exercise was for correctly on ${understandCounts.yes}, ` +
    `partly on ${understandCounts.partly}, and not at all on ${understandCounts.no}.`
  );

  const scored = results.filter((r) => typeof r.involvement === "number");
  if (scored.length) {
    const best = Math.max(...scored.map((r) => r.involvement));
    const bestEx = scored.filter((r) => r.involvement === best).map((r) => r.title).join(", ");
    lines.push("");
    lines.push(`Best involvement today: ${involveWord[best]} — on ${bestEx}.`);
    if (best >= 3) lines.push(`   A 3 appeared. If it repeats across sessions, that is the gate to ramp standing time or reduce support.`);
    else lines.push(`   No 3 yet. Hold current standing time and support level.`);
  }

  const standingTotal = results.reduce((t, r) => t + (r.standing ? r.standing.minutes : 0), 0);
  if (standingTotal > 0) {
    lines.push("");
    lines.push(`Standing total: ${standingTotal} min (ceiling 20).`);
  }

  if (closing && closing.fadeProbe) {
    lines.push("");
    lines.push(`Fade probe: ${fadeWord[closing.fadeProbe.outcome] || closing.fadeProbe.outcome}` +
      (closing.fadeProbe.detail ? ` — ${closing.fadeProbe.detail}` : "") + ".");
  }

  if (closing && closing.favouriteTitle) {
    lines.push("");
    lines.push(`Favourite exercise: ${closing.favouriteTitle}${closing.favouriteWhy ? ` — ${closing.favouriteWhy}` : ""}`);
  }

  lines.push("");
  lines.push(`Notes: ${closing && closing.notes && closing.notes.trim() ? closing.notes.trim() : "—"}`);

  return lines.join("\n");
}
