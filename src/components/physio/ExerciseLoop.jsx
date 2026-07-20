import React, { useState } from "react";
import { C, DUAL_TASK_SUGGESTIONS, INVOLVEMENT, QUICK_STRETCH_NOTE, STANDING_QUALITY, unitLabel } from "../../constants";
import { SectionLabel } from "../shared";
import { Metronome } from "./Metronome";

/* The involvement picker. This is the measurement the whole plan gates on,
   so it's mandatory before the exercise can be saved — reps and difficulty
   describe effort, involvement describes whether the nervous system showed up. */
function InvolvementPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 3 }}>Involvement — best moment of this exercise</div>
      <div style={{ fontSize: 12, color: C.stone, marginBottom: 9, lineHeight: 1.4 }}>
        Score the best response you saw, not the average.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {INVOLVEMENT.map((lvl) => {
          const on = value === lvl.score;
          return (
            <button key={lvl.score} className="tw-focus" onClick={() => onChange(lvl.score)}
              style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "center",
                background: on ? lvl.tint : C.surface, border: `1.5px solid ${on ? lvl.color : C.line}`,
                borderRadius: 12, padding: "11px 14px", width: "100%" }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: on ? lvl.color : C.paper,
                color: on ? "#fff" : C.stone, fontSize: 13.5, fontWeight: 800, lineHeight: "26px", textAlign: "center" }}>
                {lvl.score}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: on ? lvl.color : C.ink }}>{lvl.label}</span>
                <span style={{ display: "block", fontSize: 12, color: C.inkSoft, marginTop: 2, lineHeight: 1.35 }}>{lvl.note}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExerciseLoop({ item, index, total, estimate, onFinish, onEndEarly }) {
  const [stage, setStage] = useState("work"); // work | capture
  const [stopped, setStopped] = useState(false);
  const [stretched, setStretched] = useState(false);
  const [suggestion] = useState(() => DUAL_TASK_SUGGESTIONS[index % DUAL_TASK_SUGGESTIONS.length]);
  const [actReps, setActReps] = useState("");
  const [actDiff, setActDiff] = useState("");
  const [understood, setUnderstood] = useState(null);
  const [involvement, setInvolvement] = useState(null);
  const [standingMin, setStandingMin] = useState("");
  const [standingQuality, setStandingQuality] = useState(null);

  const standing = !!item.isStanding;
  const canSave = actReps !== "" && actDiff !== "" && understood != null && involvement != null
    && (!standing || (standingMin !== "" && standingQuality != null));

  const save = () => {
    const est = estimate;
    const tick = Number(actDiff) === est.estDiff ? "green" : "yellow";
    onFinish({
      id: item.id, title: item.title, unit: item.unit,
      estReps: est.estReps, estDiff: est.estDiff,
      actReps: Number(actReps), actDiff: Number(actDiff),
      tick, understood, dualTask: !!item.dualTask,
      involvement,
      quickStretched: stretched,
      standing: standing ? { minutes: Number(standingMin), quality: standingQuality } : null,
    });
  };

  return (
    <div className="tw-rise">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: total }).map((_, k) => (
            <span key={k} style={{ height: 6, width: k === index ? 26 : 6, borderRadius: 3,
              background: k < index ? C.sage : k === index ? C.sageDeep : C.line, transition: "all .25s ease" }} />
          ))}
        </div>
        <button className="tw-focus" onClick={onEndEarly} style={{ background: "none", border: "none", color: C.stone, fontSize: 13.5, fontWeight: 600 }}>
          End session early
        </button>
      </div>

      {stage === "work" ? (
        <>
          <SectionLabel>Exercise {index + 1} of {total}{item.dualTask ? " · dual-task" : ""}{standing ? " · standing" : ""}</SectionLabel>
          <h2 className="tw-serif" style={{ fontSize: "clamp(24px,5vw,32px)", margin: "0 0 14px" }}>{item.title}</h2>

          {item.mediaUrl ? (
            <img src={item.mediaUrl} alt={item.title} style={{ width: "100%", borderRadius: 16, marginBottom: 14, display: "block" }} />
          ) : null}

          {/* Quick stretch — neural priming, done now because the effect decays in seconds. */}
          <button className="tw-focus" onClick={() => setStretched(!stretched)}
            style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start",
              background: stretched ? C.sageTint : "#fff", border: `1.5px ${stretched ? "solid" : "dashed"} ${stretched ? C.sage : C.clay}`,
              borderRadius: 14, padding: "13px 15px", marginBottom: 12 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: `2px solid ${stretched ? C.sageDeep : C.clay}`, background: stretched ? C.sageDeep : "transparent",
              color: "#fff", fontSize: 13, fontWeight: 800, lineHeight: "17px", textAlign: "center" }}>
              {stretched ? "✓" : ""}
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: stretched ? C.sageDeep : C.clayDeep }}>
                Quick stretch first{item.quickStretch ? ` — ${item.quickStretch}` : ""}
              </span>
              <span style={{ display: "block", fontSize: 11.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>
                {QUICK_STRETCH_NOTE}
              </span>
            </span>
          </button>

          <Metronome compact />

          {item.instructions && (
            <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Setup</div>
              <p style={{ fontSize: 15, color: C.ink, margin: 0, lineHeight: 1.45 }}>{item.instructions}</p>
            </div>
          )}

          {item.cues && item.cues.length > 0 && (
            <div style={{ background: C.sageTint, border: `1px solid ${C.sage}33`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.sageDeep, marginBottom: 8 }}>Say this</div>
              {item.cues.map((c, i) => (
                <p key={i} style={{ fontSize: 15.5, color: C.ink, margin: i ? "6px 0 0" : 0, lineHeight: 1.4, fontWeight: 500 }}>{c}</p>
              ))}
            </div>
          )}

          {item.watchFor && (
            <div style={{ background: C.clayTint, border: `1px solid ${C.clay}44`, borderRadius: 16, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 6 }}>Watch for</div>
              <p style={{ fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>{item.watchFor}</p>
            </div>
          )}

          {item.dualTask && (
            <div style={{ background: "#fff", border: `1px dashed ${C.sage}`, borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: C.sage, fontWeight: 700 }}>Dual-task: </span>
              <span style={{ fontSize: 14, color: C.ink }}>{suggestion}</span>
              {standing && (
                <p style={{ fontSize: 11.5, color: C.stone, margin: "7px 0 0", lineHeight: 1.4 }}>
                  He's standing — keep the load light and rhythmic. If involvement drops, drop the attention task first.
                </p>
              )}
            </div>
          )}

          <button className="tw-focus tw-lift" onClick={() => setStopped(!stopped)}
            style={{ width: "100%", background: stopped ? C.clayDeep : C.clay, color: "#fff", border: "none",
              borderRadius: 14, padding: "16px", fontSize: 15.5, fontWeight: 700, marginBottom: 12,
              boxShadow: `0 3px 0 ${C.clayDeep}` }}>
            {stopped ? "Resume" : "STOP — ask what this is helping with"}
          </button>

          {stopped && (
            <div className="tw-rise" style={{ background: C.clayDeep, color: "#fff", borderRadius: 16, padding: "20px 22px", marginBottom: 16, textAlign: "center" }}>
              <p className="tw-serif" style={{ fontSize: 20, margin: 0, lineHeight: 1.35 }}>What is this exercise helping you with, Akki?</p>
            </div>
          )}

          <button className="tw-focus tw-lift" onClick={() => setStage("capture")}
            style={{ width: "100%", background: C.sage, color: "#fff", border: "none", borderRadius: 16,
              padding: "17px", fontSize: 17, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
            Finish exercise
          </button>
        </>
      ) : (
        <>
          <SectionLabel>After — {item.title}</SectionLabel>
          <h2 className="tw-serif" style={{ fontSize: 24, margin: "0 0 16px" }}>How did that go?</h2>

          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
            <p style={{ fontSize: 14.5, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>
              Ask him to say again what this exercise does and how it helps — then ask how many {unitLabel(item.unit)} he actually did and how hard it was.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Actual {unitLabel(item.unit)}</div>
                <input type="number" min={0} value={actReps} onChange={(e) => setActReps(e.target.value)}
                  className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Actual difficulty (1–10)</div>
                <input type="number" min={1} max={10} value={actDiff} onChange={(e) => setActDiff(e.target.value)}
                  className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15 }} />
              </div>
            </div>
          </div>

          {standing && (
            <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 9 }}>Standing dose</div>
              <div style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Minutes standing (ceiling 20)</div>
                <input type="number" min={0} max={40} value={standingMin} onChange={(e) => setStandingMin(e.target.value)}
                  className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15 }} />
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {STANDING_QUALITY.map((q) => (
                  <button key={q.key} className="tw-focus" onClick={() => setStandingQuality(q.key)}
                    style={{ flex: 1, border: `1.5px solid ${standingQuality === q.key ? C.clayDeep : C.line}`,
                      background: standingQuality === q.key ? "#fff" : C.surface,
                      color: standingQuality === q.key ? C.clayDeep : C.inkSoft,
                      borderRadius: 11, padding: "10px 6px", fontSize: 12.5, fontWeight: 700, lineHeight: 1.25 }}>
                    {q.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: C.clayDeep, margin: "10px 0 0", lineHeight: 1.4 }}>
                Minutes standing isn't the goal — minutes standing <em>with involvement</em> is. Six good minutes beat fifteen passive ones.
              </p>
            </div>
          )}

          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
            <InvolvementPicker value={involvement} onChange={setInvolvement} />
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Did he correctly say what this exercise helps with?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["yes", "Yes"], ["partly", "Partly"], ["no", "No"]].map(([v, label]) => (
                <button key={v} className="tw-focus" onClick={() => setUnderstood(v)}
                  style={{ flex: 1, border: `1.5px solid ${understood === v ? C.clay : C.line}`,
                    background: understood === v ? C.clayTint : C.surface, color: understood === v ? C.clayDeep : C.inkSoft,
                    borderRadius: 12, padding: "12px 10px", fontSize: 14, fontWeight: 700 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className="tw-focus tw-lift" disabled={!canSave} onClick={save}
            style={{ width: "100%", background: canSave ? C.clay : C.line, color: canSave ? "#fff" : C.inkSoft,
              border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
              boxShadow: canSave ? `0 3px 0 ${C.clayDeep}` : "none" }}>
            {canSave ? (index + 1 >= total ? "Save · go to closing" : "Save · next exercise") : "Score involvement to save"}
          </button>
        </>
      )}
    </div>
  );
}
