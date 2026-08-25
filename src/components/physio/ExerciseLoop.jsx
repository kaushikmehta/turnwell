import React, { useState } from "react";
import {
  C, DUAL_TASK_SUGGESTIONS, INVOLVEMENT, QUICK_STRETCH_NOTE, unitLabel,
  categoryOf, isInvolvementScored, EXERCISE_CATEGORIES,
  SUPPORT_LEVELS, PROBE_OUTCOMES,
  STANDING_DEVICES, KNEE_POSITIONS, LEG_LOADING, SKIN_CHECK, skinCheckAlerts, TOLERANCE_END_REASONS,
  SITTING_SURFACES, ROLL_PATTERNS, PNF_PATTERNS, PNF_PHASES,
} from "../../constants";
import { SectionLabel } from "../shared";
import { Metronome } from "./Metronome";

/* A compact segmented picker — one row of options, single select. */
function Seg({ options, value, onChange, warnKeys = [] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((o) => {
        const on = value === o.key;
        const warn = warnKeys.includes(o.key);
        const active = on ? (warn ? "#B15353" : C.clayDeep) : C.line;
        return (
          <button key={o.key} className="tw-focus" onClick={() => onChange(o.key)}
            style={{ border: `1.5px solid ${active}`,
              background: on ? (warn ? "#F6E7E7" : "#fff") : C.surface,
              color: on ? (warn ? "#8C3A3A" : C.clayDeep) : C.inkSoft,
              borderRadius: 11, padding: "9px 13px", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldBox({ title, children, accent = C.line, bg = C.surface }) {
  return (
    <div style={{ background: bg, border: `1px solid ${accent}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 9 }}>{title}</div>
      {children}
    </div>
  );
}

function SubLabel({ children }) {
  return <div style={{ fontSize: 12, color: C.inkSoft, margin: "0 0 6px" }}>{children}</div>;
}

/* Involvement picker. `compact` trims the per-row notes so two can sit side by
   side (used for per-side rolling). */
function InvolvementPicker({ value, onChange, compact }) {
  return (
    <div>
      {!compact && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 3 }}>Involvement — best moment of this exercise</div>
          <div style={{ fontSize: 12, color: C.stone, marginBottom: 9, lineHeight: 1.4 }}>Score the best response you saw, not the average.</div>
        </>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 5 : 7 }}>
        {INVOLVEMENT.map((lvl) => {
          const on = value === lvl.score;
          return (
            <button key={lvl.score} className="tw-focus" onClick={() => onChange(lvl.score)}
              style={{ textAlign: "left", display: "flex", gap: 10, alignItems: "center",
                background: on ? lvl.tint : C.surface, border: `1.5px solid ${on ? lvl.color : C.line}`,
                borderRadius: 11, padding: compact ? "8px 10px" : "11px 14px", width: "100%" }}>
              <span style={{ width: compact ? 22 : 26, height: compact ? 22 : 26, borderRadius: 7, flexShrink: 0, background: on ? lvl.color : C.paper,
                color: on ? "#fff" : C.stone, fontSize: 13, fontWeight: 800, lineHeight: compact ? "22px" : "26px", textAlign: "center" }}>
                {lvl.score}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: compact ? 13 : 14.5, fontWeight: 700, color: on ? lvl.color : C.ink }}>{lvl.label}</span>
                {!compact && <span style={{ display: "block", fontSize: 12, color: C.inkSoft, marginTop: 2, lineHeight: 1.35 }}>{lvl.note}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SupportPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 3 }}>Support level — where were your hands?</div>
      <div style={{ fontSize: 12, color: C.stone, marginBottom: 9, lineHeight: 1.4 }}>Lower on the body / hands off = less support. Aligned to SATCo placements.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SUPPORT_LEVELS.map((lvl) => {
          const on = value === lvl.level;
          return (
            <button key={lvl.level} className="tw-focus" onClick={() => onChange(lvl.level)}
              style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "center",
                background: on ? C.indigoTint : C.surface, border: `1.5px solid ${on ? C.indigo : C.line}`,
                borderRadius: 11, padding: "9px 13px", width: "100%" }}>
              <span style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: on ? C.indigo : C.paper,
                color: on ? "#fff" : C.stone, fontSize: 12.5, fontWeight: 800, lineHeight: "24px", textAlign: "center" }}>
                {lvl.level}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: on ? C.indigoDeep : C.ink }}>{lvl.label}</span>
                <span style={{ display: "block", fontSize: 11.5, color: C.inkSoft, marginTop: 1, lineHeight: 1.3 }}>{lvl.note}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AwarenessPicker({ label, value, onChange, response, onResponse, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[["yes", "Yes"], ["partly", "Partly"], ["no", "No"]].map(([v, l]) => (
          <button key={v} className="tw-focus" onClick={() => onChange(v)}
            style={{ flex: 1, border: `1.5px solid ${value === v ? C.clay : C.line}`,
              background: value === v ? C.clayTint : C.surface, color: value === v ? C.clayDeep : C.inkSoft,
              borderRadius: 12, padding: "12px 10px", fontSize: 14, fontWeight: 700 }}>
            {l}
          </button>
        ))}
      </div>
      <input value={response} onChange={(e) => onResponse(e.target.value)} placeholder={placeholder}
        className="tw-focus" style={{ marginTop: 8, width: "100%", background: "#fff", border: `1px solid ${C.line}`,
          borderRadius: 10, padding: "10px 12px", fontSize: 14, color: C.ink }} />
    </div>
  );
}

const numInput = { width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink };

export function ExerciseLoop({ item, index, total, items, done, existing, estimate, stimStamp, onFinish, onJump, onDone, onEndEarly }) {
  const category = categoryOf(item);
  const scored = isInvolvementScored(item);         // active_training
  const isProbe = category === "probe";
  const isSubstrate = category === "substrate";
  const standing = !!item.isStanding;
  const tracksSupport = !!item.tracks_support;
  const tracksRoll = !!item.tracksRoll;
  const tracksPnf = !!item.tracksPnf;

  const ex = existing || {};
  const [stage, setStage] = useState(existing ? "capture" : "work"); // work | capture
  const [stopped, setStopped] = useState(false);
  const [stretched, setStretched] = useState(ex.quickStretched ?? false);
  const [suggestion] = useState(() => DUAL_TASK_SUGGESTIONS[index % DUAL_TASK_SUGGESTIONS.length]);
  const [actReps, setActReps] = useState(ex.actReps != null ? String(ex.actReps) : "");
  const [actDiff, setActDiff] = useState(ex.actDiff != null ? String(ex.actDiff) : "");
  const [namedExercise, setNamedExercise] = useState(ex.namedExercise ?? null);
  const [namedResponse, setNamedResponse] = useState(ex.namedResponse ?? "");
  const [understood, setUnderstood] = useState(ex.understood ?? null);
  const [helpsResponse, setHelpsResponse] = useState(ex.helpsResponse ?? "");
  const [involvement, setInvolvement] = useState(ex.involvement ?? null);
  const [probeOutcome, setProbeOutcome] = useState(ex.probe?.outcome ?? null);
  // Standing dose.
  const [stDevice, setStDevice] = useState(ex.standing?.device ?? (item.inTram ? "tram" : ""));
  const [stMinutes, setStMinutes] = useState(ex.standing?.minutes != null ? String(ex.standing.minutes) : "");
  const [stKnee, setStKnee] = useState(ex.standing?.knee_position ?? null);
  const [stLoading, setStLoading] = useState(ex.standing?.leg_loading ?? null);
  const [stWeightPct, setStWeightPct] = useState(ex.standing?.weight_bearing_pct != null ? String(ex.standing.weight_bearing_pct) : "");
  const [stSkin, setStSkin] = useState(ex.standing?.saddle_skin_check ?? null);
  const [stEndReason, setStEndReason] = useState(ex.standing?.tolerance_end_reason ?? null);
  // Sitting detail.
  const [supportLevel, setSupportLevel] = useState(ex.sitting?.support_level ?? null);
  const [holdSeconds, setHoldSeconds] = useState(ex.sitting?.longest_hold_seconds != null ? String(ex.sitting.longest_hold_seconds) : "");
  const [surface, setSurface] = useState(ex.sitting?.surface ?? null);
  const [feetSupported, setFeetSupported] = useState(ex.sitting?.feet_supported ?? null);
  // Rolling — scored per side, both sides (handoff feedback).
  const [rollLeftPattern, setRollLeftPattern] = useState(ex.rolling?.left?.pattern ?? null);
  const [rollLeftInv, setRollLeftInv] = useState(ex.rolling?.left?.involvement ?? null);
  const [rollRightPattern, setRollRightPattern] = useState(ex.rolling?.right?.pattern ?? null);
  const [rollRightInv, setRollRightInv] = useState(ex.rolling?.right?.involvement ?? null);
  // PNF.
  const [pnfPattern, setPnfPattern] = useState(ex.pnf?.pattern ?? null);
  const [pnfPhase, setPnfPhase] = useState(ex.pnf?.phase ?? null);
  // Estimate (prefill from an existing entry if revisiting).
  const [est, setEst] = useState(() => ({
    estReps: String(ex.estReps ?? estimate.estReps),
    estDiff: String(ex.estDiff ?? estimate.estDiff),
  }));
  const [reviseOpen, setReviseOpen] = useState(false);

  const skinAlert = skinCheckAlerts(stSkin);
  const rollComplete = !tracksRoll || (rollLeftPattern && rollLeftInv != null && rollRightPattern && rollRightInv != null);
  // For rolling, involvement is derived from the two sides (best of the two).
  const rollInvolvement = (rollLeftInv != null && rollRightInv != null) ? Math.max(rollLeftInv, rollRightInv)
    : (rollLeftInv != null ? rollLeftInv : rollRightInv);

  const canSave =
    actReps !== "" && actDiff !== "" && est.estReps !== "" && est.estDiff !== ""
    && (!scored || tracksRoll || involvement != null)
    && (!isProbe || probeOutcome != null)
    && rollComplete
    && (!standing || (stDevice && stMinutes !== "" && stKnee && stLoading && stSkin && stEndReason))
    && (!tracksSupport || supportLevel != null)
    && (!tracksPnf || (pnfPattern != null && pnfPhase != null));

  const save = () => {
    const estReps = Number(est.estReps);
    const estDiff = Number(est.estDiff);
    const revised = estReps !== estimate.estReps || estDiff !== estimate.estDiff;
    const tick = Number(actDiff) === estDiff ? "green" : "yellow";
    const finalInvolvement = scored ? (tracksRoll ? rollInvolvement : involvement) : null;
    onFinish({
      id: item.id, title: item.title, unit: item.unit,
      category,
      estReps, estDiff,
      estRevised: revised,
      estOriginal: revised ? { estReps: estimate.estReps, estDiff: estimate.estDiff } : null,
      actReps: Number(actReps), actDiff: Number(actDiff),
      tick, namedExercise, namedResponse: namedResponse.trim(), understood, helpsResponse: helpsResponse.trim(),
      dualTask: !!item.dualTask,
      involvement: finalInvolvement,
      probe: isProbe ? { outcome: probeOutcome } : null,
      quickStretched: stretched,
      standing: standing ? {
        device: stDevice, minutes: Number(stMinutes),
        knee_position: stKnee, leg_loading: stLoading,
        weight_bearing_pct: stWeightPct === "" ? null : Number(stWeightPct),
        saddle_skin_check: stSkin, tolerance_end_reason: stEndReason,
      } : null,
      sitting: tracksSupport ? {
        support_level: supportLevel,
        longest_hold_seconds: holdSeconds === "" ? null : Number(holdSeconds),
        surface, feet_supported: feetSupported,
      } : null,
      rolling: tracksRoll ? {
        left: { pattern: rollLeftPattern, involvement: rollLeftInv },
        right: { pattern: rollRightPattern, involvement: rollRightInv },
      } : null,
      pnf: tracksPnf ? { pattern: pnfPattern, phase: pnfPhase } : null,
      ...(stimStamp || {}),
    });
  };

  const catMeta = EXERCISE_CATEGORIES[category];
  const prev = index > 0 ? items[index - 1] : null;
  const next = index < total - 1 ? items[index + 1] : null;
  const allDone = done && done.every(Boolean);

  return (
    <div className="tw-rise">
      {/* Clickable progress dots — jump back to any exercise to re-edit it. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: total }).map((_, k) => {
            const isDone = done && done[k];
            const cur = k === index;
            return (
              <button key={k} className="tw-focus" onClick={() => onJump?.(k)} title={items[k]?.title}
                style={{ height: 10, width: cur ? 28 : 10, borderRadius: 5, border: "none", padding: 0, cursor: "pointer",
                  background: cur ? C.sageDeep : isDone ? C.sage : C.line, transition: "all .25s ease" }} />
            );
          })}
        </div>
        <button className="tw-focus" onClick={onEndEarly} style={{ background: "none", border: "none", color: C.stone, fontSize: 13.5, fontWeight: 600 }}>
          End session early
        </button>
      </div>

      {/* Prev / next context — always know what came before and what's coming up. */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 16 }}>
        <button className="tw-focus" disabled={!prev} onClick={() => onJump?.(index - 1)}
          style={{ flex: 1, textAlign: "left", background: prev ? C.surface : "transparent", border: `1px solid ${prev ? C.line : "transparent"}`,
            borderRadius: 10, padding: prev ? "7px 11px" : 0, cursor: prev ? "pointer" : "default", minWidth: 0 }}>
          {prev && <>
            <span style={{ display: "block", fontSize: 10.5, color: C.stone, fontWeight: 700 }}>‹ Previous{done && done[index - 1] ? " ✓" : ""}</span>
            <span style={{ display: "block", fontSize: 12.5, color: C.inkSoft, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prev.title}</span>
          </>}
        </button>
        <button className="tw-focus" disabled={!next} onClick={() => onJump?.(index + 1)}
          style={{ flex: 1, textAlign: "right", background: next ? C.surface : "transparent", border: `1px solid ${next ? C.line : "transparent"}`,
            borderRadius: 10, padding: next ? "7px 11px" : 0, cursor: next ? "pointer" : "default", minWidth: 0 }}>
          {next && <>
            <span style={{ display: "block", fontSize: 10.5, color: C.stone, fontWeight: 700 }}>Next{done && done[index + 1] ? " ✓" : ""} ›</span>
            <span style={{ display: "block", fontSize: 12.5, color: C.inkSoft, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next.title}</span>
          </>}
        </button>
      </div>

      {stage === "work" ? (
        <>
          <SectionLabel>
            Exercise {index + 1} of {total} · {catMeta.label}{item.dualTask ? " · dual-task" : ""}{standing ? " · standing" : ""}
          </SectionLabel>
          <h2 className="tw-serif" style={{ fontSize: "clamp(24px,5vw,32px)", margin: "0 0 14px" }}>{item.title}</h2>

          <div style={{ background: C.indigoTint, border: `1px solid ${C.indigo}44`, borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.indigoDeep, marginBottom: 6 }}>Estimate check — before you start</div>
            <p style={{ fontSize: 13.5, color: C.ink, margin: "0 0 10px", lineHeight: 1.4 }}>Ask Akki if he wants to change his estimate for this one.</p>
            {!reviseOpen ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 14, color: C.ink }}>
                  He estimated <strong>{est.estReps}</strong> {unitLabel(item.unit)} · difficulty <strong>{est.estDiff}</strong>/10
                </span>
                <button className="tw-focus" onClick={() => setReviseOpen(true)}
                  style={{ flexShrink: 0, background: "#fff", border: `1.5px solid ${C.indigo}`, color: C.indigoDeep, borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 700 }}>
                  Change it
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Estimated {unitLabel(item.unit)}</div>
                  <input type="number" min={0} value={est.estReps} onChange={(e) => setEst({ ...est, estReps: e.target.value })} className="tw-focus" style={numInput} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Estimated difficulty (1–10)</div>
                  <input type="number" min={1} max={10} value={est.estDiff} onChange={(e) => setEst({ ...est, estDiff: e.target.value })} className="tw-focus" style={numInput} />
                </div>
              </div>
            )}
          </div>

          {item.mediaUrl ? <img src={item.mediaUrl} alt={item.title} style={{ width: "100%", borderRadius: 16, marginBottom: 14, display: "block" }} /> : null}

          <button className="tw-focus" onClick={() => setStretched(!stretched)}
            style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start",
              background: stretched ? C.sageTint : "#fff", border: `1.5px ${stretched ? "solid" : "dashed"} ${stretched ? C.sage : C.clay}`,
              borderRadius: 14, padding: "13px 15px", marginBottom: 12 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: `2px solid ${stretched ? C.sageDeep : C.clay}`, background: stretched ? C.sageDeep : "transparent",
              color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: "17px", textAlign: "center" }}>{stretched ? "✓" : ""}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: stretched ? C.sageDeep : C.clayDeep }}>
                Quick stretch first{item.quickStretch ? ` — ${item.quickStretch}` : ""}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{QUICK_STRETCH_NOTE}</span>
            </span>
          </button>

          {item.instructions && (
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Setup</div>
              <p style={{ fontSize: 15, color: C.ink, margin: 0, lineHeight: 1.45 }}>{item.instructions}</p>
            </div>
          )}

          {item.dualTask && (
            <div style={{ background: C.sage, borderRadius: 16, padding: "16px 18px", marginBottom: 12, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: "#fff", color: C.sageDeep, fontSize: 11, fontWeight: 800, letterSpacing: ".04em", borderRadius: 999, padding: "3px 9px", textTransform: "uppercase" }}>Dual-task</span>
                <span style={{ color: "#fff", opacity: .9, fontSize: 12.5, fontWeight: 600 }}>run this on top of the exercise</span>
              </div>
              <p style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.35 }}>{suggestion}</p>
              {standing && <p style={{ fontSize: 12, color: "#fff", opacity: .85, margin: "9px 0 0", lineHeight: 1.4 }}>He's standing — keep the load light and rhythmic. If involvement drops, drop the attention task first.</p>}
            </div>
          )}

          {item.cues && item.cues.length > 0 && (
            <div style={{ background: C.sageTint, border: `1px solid ${C.sage}33`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 8 }}>Say this</div>
              {item.cues.map((c, i) => <p key={i} style={{ fontSize: 15.5, color: C.ink, margin: i ? "6px 0 0" : 0, lineHeight: 1.4, fontWeight: 500 }}>{c}</p>)}
            </div>
          )}

          {item.watchFor && (
            <div style={{ background: C.clayTint, border: `1px solid ${C.clay}44`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 6 }}>Watch for</div>
              <p style={{ fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>{item.watchFor}</p>
            </div>
          )}

          <Metronome compact />

          <button className="tw-focus tw-lift" onClick={() => setStopped(!stopped)}
            style={{ width: "100%", background: stopped ? C.clayDeep : C.clay, color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 15.5, fontWeight: 700, marginBottom: 12, boxShadow: `0 3px 0 ${C.clayDeep}` }}>
            {stopped ? "Resume" : "STOP — ask him about this exercise"}
          </button>

          {stopped && (
            <div className="tw-rise" style={{ border: `2px solid ${C.clayDeep}`, borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ background: C.clayDeep, color: "#fff", padding: "14px 18px" }}>
                <p style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", opacity: .85, margin: "0 0 5px" }}>Stop — ask Akki, capture what he says</p>
                <p className="tw-serif" style={{ fontSize: 16, margin: 0, lineHeight: 1.3 }}>Pause the exercise and ask him these two.</p>
              </div>
              <div style={{ background: C.surface, padding: "16px 18px" }}>
                <AwarenessPicker label="1. Can you tell me what exercise we're working on?" value={namedExercise} onChange={setNamedExercise} response={namedResponse} onResponse={setNamedResponse} placeholder="What Akki said it was" />
                <AwarenessPicker label="2. What is this exercise helping you with — in everyday life?" value={understood} onChange={setUnderstood} response={helpsResponse} onResponse={setHelpsResponse} placeholder="What Akki said it helps with" />
              </div>
            </div>
          )}

          <button className="tw-focus tw-lift" onClick={() => setStage("capture")}
            style={{ width: "100%", background: C.sage, color: "#fff", border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
            Finish exercise
          </button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <SectionLabel>After — {item.title} · {catMeta.label}</SectionLabel>
            <button className="tw-focus" onClick={() => setStage("work")} style={{ background: "none", border: "none", color: C.stone, fontSize: 12.5, fontWeight: 600, marginBottom: 11 }}>‹ Instructions</button>
          </div>
          <h2 className="tw-serif" style={{ fontSize: 24, margin: "0 0 16px" }}>How did that go?</h2>

          <FieldBox title={`Dose${isSubstrate ? " — log completion, no involvement score for substrate" : ""}`}>
            <p style={{ fontSize: 14.5, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>
              {isSubstrate ? "Log how much was done and how hard it felt." : `Ask him to say again what this exercise does and how it helps — then ask how many ${unitLabel(item.unit)} he actually did and how hard it was.`}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <SubLabel>Actual {unitLabel(item.unit)}</SubLabel>
                <input type="number" min={0} value={actReps} onChange={(e) => setActReps(e.target.value)} className="tw-focus" style={numInput} />
              </div>
              <div style={{ flex: 1 }}>
                <SubLabel>Actual difficulty (1–10)</SubLabel>
                <input type="number" min={1} max={10} value={actDiff} onChange={(e) => setActDiff(e.target.value)} className="tw-focus" style={numInput} />
              </div>
            </div>
          </FieldBox>

          {tracksRoll && (
            <FieldBox title="Rolling — both sides, scored independently" accent={`${C.indigo}44`}>
              <p style={{ fontSize: 12, color: C.stone, margin: "0 0 12px", lineHeight: 1.4 }}>Roll to each side and score it separately — segmental should be the majority.</p>
              {[["left", "Roll to the LEFT", rollLeftPattern, setRollLeftPattern, rollLeftInv, setRollLeftInv],
                ["right", "Roll to the RIGHT", rollRightPattern, setRollRightPattern, rollRightInv, setRollRightInv]].map(([sideKey, label, pat, setPat, inv, setInv]) => (
                <div key={sideKey} style={{ borderTop: sideKey === "right" ? `1px solid ${C.line}` : "none", paddingTop: sideKey === "right" ? 14 : 0, marginTop: sideKey === "right" ? 14 : 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: C.indigoDeep, marginBottom: 8, letterSpacing: ".02em" }}>{label}</div>
                  <SubLabel>Pattern</SubLabel>
                  <Seg options={ROLL_PATTERNS} value={pat} onChange={setPat} />
                  <div style={{ height: 10 }} />
                  <SubLabel>Involvement — best on this side</SubLabel>
                  <InvolvementPicker value={inv} onChange={setInv} compact />
                </div>
              ))}
            </FieldBox>
          )}

          {tracksPnf && (
            <FieldBox title="PNF — pattern & phase" accent={`${C.indigo}44`}>
              <SubLabel>Pattern</SubLabel>
              <Seg options={PNF_PATTERNS} value={pnfPattern} onChange={setPnfPattern} />
              <div style={{ height: 10 }} />
              <SubLabel>Phase</SubLabel>
              <Seg options={PNF_PHASES} value={pnfPhase} onChange={setPnfPhase} />
            </FieldBox>
          )}

          {standing && (
            <FieldBox title="Standing dose" accent={`${C.clay}55`} bg={C.clayTint}>
              <SubLabel>Device</SubLabel>
              <Seg options={STANDING_DEVICES} value={stDevice} onChange={setStDevice} />
              <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
                <div style={{ flex: 1 }}>
                  <SubLabel>Minutes standing</SubLabel>
                  <input type="number" min={0} max={60} value={stMinutes} onChange={(e) => setStMinutes(e.target.value)} className="tw-focus" style={numInput} />
                </div>
                <div style={{ flex: 1 }}>
                  <SubLabel>Weight-bearing % <span style={{ color: C.stone }}>(if scale)</span></SubLabel>
                  <input type="number" min={0} max={100} value={stWeightPct} onChange={(e) => setStWeightPct(e.target.value)} className="tw-focus" style={numInput} />
                </div>
              </div>
              <SubLabel>Knee position <span style={{ color: C.stone }}>· suspended = weight in the saddle, not the legs</span></SubLabel>
              <Seg options={KNEE_POSITIONS} value={stKnee} onChange={setStKnee} warnKeys={["flexed_suspended"]} />
              <div style={{ height: 12 }} />
              <SubLabel>Leg loading</SubLabel>
              <Seg options={LEG_LOADING} value={stLoading} onChange={setStLoading} />
              <div style={{ height: 12 }} />
              <SubLabel>Saddle skin check</SubLabel>
              <Seg options={SKIN_CHECK} value={stSkin} onChange={setStSkin} warnKeys={["redness_non_blanching", "broken_skin"]} />
              <div style={{ height: 12 }} />
              <SubLabel>Reason standing ended</SubLabel>
              <Seg options={TOLERANCE_END_REASONS} value={stEndReason} onChange={setStEndReason} />
              {skinAlert && (
                <div className="tw-rise" style={{ marginTop: 12, background: "#F6E7E7", border: `1.5px solid #B15353`, borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: 12.5, color: "#8C3A3A", margin: 0, fontWeight: 700, lineHeight: 1.45 }}>⚠ Skin alert — contact the care team. Standing progression is blocked until this is cleared.</p>
                </div>
              )}
              <p style={{ fontSize: 11.5, color: C.clayDeep, margin: "12px 0 0", lineHeight: 1.4 }}>Minutes alone can rise while loading falls. Knee position and leg loading are what say whether the skeleton actually took the weight.</p>
            </FieldBox>
          )}

          {tracksSupport && (
            <FieldBox title="Sitting — support & hold" accent={`${C.indigo}44`} bg={C.indigoTint}>
              <SupportPicker value={supportLevel} onChange={setSupportLevel} />
              <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
                <div style={{ flex: 1 }}>
                  <SubLabel>Longest hold (seconds)</SubLabel>
                  <input type="number" min={0} value={holdSeconds} onChange={(e) => setHoldSeconds(e.target.value)} className="tw-focus" style={numInput} />
                </div>
              </div>
              <SubLabel>Surface</SubLabel>
              <Seg options={SITTING_SURFACES} value={surface} onChange={setSurface} />
              <div style={{ height: 12 }} />
              <SubLabel>Feet supported?</SubLabel>
              <Seg options={[{ key: "yes", label: "Yes" }, { key: "no", label: "No" }]}
                value={feetSupported == null ? null : (feetSupported ? "yes" : "no")} onChange={(k) => setFeetSupported(k === "yes")} />
            </FieldBox>
          )}

          {scored && !tracksRoll && (
            <FieldBox title="Involvement">
              <InvolvementPicker value={involvement} onChange={setInvolvement} />
            </FieldBox>
          )}

          {isProbe && (
            <FieldBox title="Probe — what was detected?" accent={`${C.clay}55`}>
              <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 9px", lineHeight: 1.4 }}>A probe records detection, not involvement. Expect nothing for now — that's information, not failure.</p>
              <Seg options={PROBE_OUTCOMES} value={probeOutcome} onChange={setProbeOutcome} />
            </FieldBox>
          )}

          {isSubstrate && (
            <div style={{ background: C.paper, border: `1px dashed ${C.line}`, borderRadius: 14, padding: "12px 15px", marginBottom: 14 }}>
              <p style={{ fontSize: 12.5, color: C.inkSoft, margin: 0, lineHeight: 1.45 }}>
                Substrate item — no involvement score. {item.promotes_to_training_when
                  ? <>Promotes to active training when: <em>{item.promotes_to_training_when}</em></>
                  : "Passive / load-based; logged for dose and completion only."}
              </p>
            </div>
          )}

          <div style={{ height: 8 }} />
          <button className="tw-focus tw-lift" disabled={!canSave} onClick={save}
            style={{ width: "100%", background: canSave ? C.clay : C.line, color: canSave ? "#fff" : C.inkSoft, border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700, boxShadow: canSave ? `0 3px 0 ${C.clayDeep}` : "none" }}>
            {canSave
              ? (existing ? "Save changes" : "Save · next")
              : tracksRoll ? "Score both sides to save" : scored ? "Score involvement to save" : isProbe ? "Record the probe outcome to save" : "Fill the required fields to save"}
          </button>

          {/* Finish the whole session — available once everything's captured. */}
          {allDone && (
            <button className="tw-focus" onClick={onDone}
              style={{ width: "100%", marginTop: 10, background: C.surface, color: C.sageDeep, border: `1.5px solid ${C.sage}`, borderRadius: 14, padding: "13px", fontSize: 14.5, fontWeight: 700 }}>
              All exercises done · go to closing
            </button>
          )}
        </>
      )}
    </div>
  );
}
