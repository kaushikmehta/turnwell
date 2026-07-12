import React, { useState } from "react";
import { C, DUAL_TASK_SUGGESTIONS } from "../../constants";
import { SectionLabel } from "../shared";

export function ExerciseLoop({ item, index, total, estimate, onFinish, onEndEarly }) {
  const [stage, setStage] = useState("work"); // work | capture
  const [stopped, setStopped] = useState(false);
  const [suggestion] = useState(() => DUAL_TASK_SUGGESTIONS[index % DUAL_TASK_SUGGESTIONS.length]);
  const [actReps, setActReps] = useState("");
  const [actDiff, setActDiff] = useState("");
  const [understood, setUnderstood] = useState(null);

  const canSave = actReps !== "" && actDiff !== "" && understood != null;

  const save = () => {
    const est = estimate;
    const tick = Number(actDiff) === est.estDiff ? "green" : "yellow";
    onFinish({
      id: item.id, title: item.title,
      estReps: est.estReps, estDiff: est.estDiff,
      actReps: Number(actReps), actDiff: Number(actDiff),
      tick, understood, dualTask: !!item.dualTask,
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
          <SectionLabel>Exercise {index + 1} of {total}{item.dualTask ? " · dual-task" : ""}</SectionLabel>
          <h2 className="tw-serif" style={{ fontSize: "clamp(24px,5vw,32px)", margin: "0 0 14px" }}>{item.title}</h2>

          {item.mediaUrl ? (
            <img src={item.mediaUrl} alt={item.title} style={{ width: "100%", borderRadius: 16, marginBottom: 14, display: "block" }} />
          ) : null}

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
              Ask him to say again what this exercise does and how it helps — then ask how many reps he actually did and how hard it was.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>Actual reps</div>
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
            {index + 1 >= total ? "Save · go to closing" : "Save · next exercise"}
          </button>
        </>
      )}
    </div>
  );
}
