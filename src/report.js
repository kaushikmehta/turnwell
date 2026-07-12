/*
 * Physio/OT live session report — plain text, WhatsApp-friendly (no markdown).
 * Copied to the clipboard rather than URL-encoded, so there's no length limit —
 * written to be read by a human (the coordinator, later you), not parsed by a script.
 */
const understandWord = { yes: "yes", partly: "partly", no: "no" };

export function buildPhysioReport(session, patientName = "Akki") {
  const { items, results, star, before, after, closing } = session;
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
    lines.push(`${i + 1}. ${r.title}`);
    lines.push(`   Reps: ${r.actReps} actual (he estimated ${r.estReps})`);
    lines.push(`   Difficulty: ${r.actDiff}/10 actual, predicted ${r.estDiff}/10 — ${tickWord} (${r.tick})`);
    lines.push(`   Understood what it's for: ${understandWord[r.understood] || r.understood}`);
    lines.push(`   Dual-task: ${r.dualTask ? "yes" : "no"}`);
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

  if (closing && closing.favouriteTitle) {
    lines.push("");
    lines.push(`Favourite exercise: ${closing.favouriteTitle}${closing.favouriteWhy ? ` — ${closing.favouriteWhy}` : ""}`);
  }

  lines.push("");
  lines.push(`Notes: ${closing && closing.notes && closing.notes.trim() ? closing.notes.trim() : "—"}`);

  return lines.join("\n");
}
