import React, { useState } from "react";
import { C, FADE_PROBE_NOTE, FADE_PROBE_OUTCOMES, SUPPORT_LEVELS, supportLabel, emptyStateRatings, compactStateRatings, unitLabel, INVOLVEMENT } from "../../constants";
import { SectionLabel, inputStyle, BackBtn } from "../shared";
import { StateRatings } from "./StateRatings";

const invLabel = (score) => (score == null ? null : INVOLVEMENT.find((l) => l.score === score)?.label || `Inv ${score}`);
const invColor = (score) => (score == null ? C.stone : INVOLVEMENT.find((l) => l.score === score)?.color || C.stone);

/* Compact 0–8 support-level row for the fade probe — same scale as the sitting
   capture, so the fade probe lands on the primary-goal axis. */
function SupportRow({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {SUPPORT_LEVELS.map((lvl) => {
        const on = value === lvl.level;
        return (
          <button key={lvl.level} className="tw-focus" onClick={() => onChange(lvl.level)} title={lvl.label}
            style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${on ? C.indigo : C.line}`,
              background: on ? C.indigo : C.surface, color: on ? "#fff" : C.inkSoft, fontSize: 13.5, fontWeight: 700 }}>
            {lvl.level}
          </button>
        );
      })}
    </div>
  );
}

export function Closing({ items, star, results = [], onNext, onBack }) {
  // What was actually logged this session, keyed by exercise id — shown against
  // each exercise in the star-match, the same way the opening shows last session.
  const resultById = Object.fromEntries(results.map((r) => [r.id, r]));
  const [starRecalledId, setStarRecalledId] = useState(null);
  const [favouriteId, setFavouriteId] = useState(null);
  const [favouriteWhy, setFavouriteWhy] = useState("");
  const [after, setAfter] = useState(emptyStateRatings);
  const [fatiguePost, setFatiguePost] = useState(null);
  const [notes, setNotes] = useState("");
  // Structured fade probe (handoff §4.4) — on the 0–8 support scale.
  const [fadeStart, setFadeStart] = useState(null);
  const [fadeTo, setFadeTo] = useState(null);
  const [fadeHeld, setFadeHeld] = useState("");
  const [fadeOutcome, setFadeOutcome] = useState(null);
  const [fadeWhat, setFadeWhat] = useState("");

  const canContinue = !!starRecalledId;
  const hasFade = fadeOutcome != null || fadeStart != null || fadeTo != null;

  const submit = () => {
    const recalled = items.find((i) => i.id === starRecalledId);
    const fav = items.find((i) => i.id === favouriteId);
    const a = compactStateRatings(after);
    onNext({
      starRecalledId: recalled.id, starRecalledTitle: recalled.title,
      favouriteId: fav ? fav.id : null, favouriteTitle: fav ? fav.title : null, favouriteWhy: favouriteWhy.trim(),
      after: a, fatigue_post: fatiguePost, notes: notes.trim(),
      fadeProbe: hasFade ? {
        start_support_level: fadeStart,
        faded_to_support_level: fadeTo,
        held_seconds: fadeHeld === "" ? null : Number(fadeHeld),
        outcome: fadeOutcome,
        notes: fadeWhat.trim(),
      } : null,
    });
  };

  return (
    <div className="tw-rise">
      {onBack && <BackBtn onClick={onBack} label="Exercises" />}
      <SectionLabel>Closing</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 18px" }}>Wrapping up</h2>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 5 }}>1. Summarise</div>
        <p style={{ fontSize: 15, color: C.ink, margin: 0, lineHeight: 1.4 }}>
          Summarise the session in point form and why each exercise was done. Over time, see if he can do this himself.
        </p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>2. Star-match</div>
        <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>What was done today, and what he says the star exercise was.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it) => {
            const picked = starRecalledId === it.id;
            const matched = picked && star && it.id === star.id;
            const missed = picked && star && it.id !== star.id;
            const borderColor = matched ? C.sage : missed ? "#B15353" : C.line;
            const d = resultById[it.id];
            const inv = d ? invLabel(d.involvement) : null;
            return (
              <button key={it.id} className="tw-focus" onClick={() => setStarRecalledId(it.id)}
                style={{ textAlign: "left", border: `1.5px solid ${borderColor}`,
                  background: C.surface, color: C.ink,
                  borderRadius: 12, padding: "11px 14px" }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>
                    {it.id === (star && star.id) ? "★ " : ""}{it.title}
                  </span>
                  {matched ? <span style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, flexShrink: 0 }}>✓ matches</span>
                    : missed ? <span style={{ fontSize: 12, fontWeight: 700, color: "#8C3A3A", flexShrink: 0 }}>✗ doesn't match</span> : null}
                </span>
                <span style={{ display: "block", fontSize: 11.5, color: C.inkSoft, fontWeight: 600, marginTop: 3 }}>
                  {d ? (
                    <>
                      {d.actReps != null ? `${d.actReps} ${unitLabel(d.unit)}` : "—"}
                      {d.actDiff != null ? ` · diff ${d.actDiff}/10` : ""}
                      {inv ? <span style={{ color: invColor(d.involvement) }}>{` · ${inv}`}</span> : ""}
                    </>
                  ) : <span style={{ color: C.stone }}>Not logged this session</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>3. Favourite exercise</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
          {items.map((it) => (
            <button key={it.id} className="tw-focus" onClick={() => setFavouriteId(it.id)}
              style={{ border: `1.5px solid ${favouriteId === it.id ? C.sage : C.line}`,
                background: favouriteId === it.id ? C.sageTint : "#fff", color: favouriteId === it.id ? C.sageDeep : C.inkSoft,
                borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600 }}>
              {it.title}
            </button>
          ))}
        </div>
        <input value={favouriteWhy} onChange={(e) => setFavouriteWhy(e.target.value)} style={inputStyle} placeholder="Why? (optional)" />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 10 }}>4. After-session state (optional)</div>
        <StateRatings value={after} onChange={setAfter} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, margin: "14px 0 6px" }}>Fatigue (post) <span style={{ color: C.stone, fontWeight: 500 }}>· pairs with the opening fatigue</span></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {Array.from({ length: 11 }).map((_, n) => (
            <button key={n} className="tw-focus" onClick={() => setFatiguePost(n)}
              style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${fatiguePost === n ? C.clay : C.line}`,
                background: fatiguePost === n ? C.clay : C.surface, color: fatiguePost === n ? "#fff" : C.inkSoft, fontSize: 13, fontWeight: 700 }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.sageTint, border: `1px solid ${C.sage}44`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 5 }}>5. Fade probe <span style={{ color: C.stone, fontWeight: 500 }}>· the densest daily signal on the primary goal</span></div>
        <p style={{ fontSize: 13, color: C.ink, margin: "0 0 12px", lineHeight: 1.42 }}>{FADE_PROBE_NOTE}</p>

        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Started at support level</div>
        <SupportRow value={fadeStart} onChange={setFadeStart} />
        <div style={{ height: 12 }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Faded to support level</div>
        <SupportRow value={fadeTo} onChange={setFadeTo} />
        {fadeStart != null && fadeTo != null && (
          <p style={{ fontSize: 12, color: C.sageDeep, margin: "8px 0 0", fontWeight: 600 }}>
            {supportLabel(fadeStart)} → {supportLabel(fadeTo)}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Held (seconds)</div>
            <input type="number" min={0} value={fadeHeld} onChange={(e) => setFadeHeld(e.target.value)} className="tw-focus"
              style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Outcome</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
          {FADE_PROBE_OUTCOMES.map((o) => (
            <button key={o.key} className="tw-focus" onClick={() => setFadeOutcome(o.key)}
              style={{ border: `1.5px solid ${fadeOutcome === o.key ? C.sageDeep : C.line}`,
                background: fadeOutcome === o.key ? "#fff" : C.surface, color: fadeOutcome === o.key ? C.sageDeep : C.inkSoft,
                borderRadius: 999, padding: "9px 14px", fontSize: 13, fontWeight: 700 }}>
              {o.label}
            </button>
          ))}
        </div>
        <input value={fadeWhat} onChange={(e) => setFadeWhat(e.target.value)} style={inputStyle} placeholder="Which activity, and what remained? (optional)" />
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>6. Notes</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={inputStyle} placeholder="Anything worth remembering…" />
      </div>

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {canContinue ? "Finish · see summary" : "Pick the recalled star exercise to continue"}
      </button>
    </div>
  );
}
