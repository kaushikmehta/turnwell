import React, { useState } from "react";
import { C, RATINGS } from "../constants";
import { isScene, isExercise, cueLabels } from "../utils";
import { Ico, BackBtn } from "./shared";

export function StdStage({ run, setRun, finish, quit, ratings = RATINGS }) {
  const item = run.items[run.i];
  const scene = isScene(item);
  const exercise = isExercise(item);
  const [stepIdx, setStepIdx] = useState(0);
  const [settingOpen, setSettingOpen] = useState(true);
  const [cue, setCue] = useState(0);
  const [peek, setPeek] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const total = run.items.length;

  const task = scene ? item.steps[stepIdx] : item;
  const taskPrompt = scene ? task.ask : item.prompt;
  const taskPersonal = scene ? !!task.personal : !!item.personal;
  const taskRecall = scene ? !!task.recall : false;
  const labels = exercise
    ? ["Verbal cue", "Guided assist", "Full assist"]
    : cueLabels(taskPersonal);

  const resetTask = () => { setCue(0); setPeek(false); setShowSetting(false); };
  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const skip = () => {
    const lastItem = run.i + 1 >= total;
    if (lastItem) { finish({ items: run.items, results: run.results, notes: run.notes || "" }); return; }
    setRun({ ...run, i: run.i + 1 });
    setStepIdx(0); setSettingOpen(true);
    resetTask(); scrollTop();
  };

  const record = (ratingKey) => {
    const kind = scene ? "scene" : exercise ? "exercise" : "line";
    const results = [...run.results,
      { itemId: item.id, kind, prompt: taskPrompt, rating: ratingKey, cueUsed: cue, step: scene ? stepIdx : 0 }];
    const lastStep = !scene || stepIdx + 1 >= item.steps.length;
    const lastItem = run.i + 1 >= total;
    if (lastStep && lastItem) { finish({ items: run.items, results, notes: run.notes }); return; }
    if (!lastStep) { setRun({ ...run, results }); setStepIdx(stepIdx + 1); }
    else { setRun({ ...run, i: run.i + 1, results }); setStepIdx(0); setSettingOpen(true); }
    resetTask(); scrollTop();
  };

  const cueTone = [C.sageTint, "#EAF0E0", C.clayTint][cue - 1] || C.sageTint;
  const cueText = [C.sageDeep, "#4d6b2f", C.clayDeep][cue - 1] || C.sageDeep;
  const readingSetting = scene && settingOpen;

  return (
    <div>
      {/* progress + exit */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {run.items.map((_, k) => (
            <span key={k} style={{ height: 6, width: k === run.i ? 26 : 6, borderRadius: 3,
              background: k < run.i ? C.sage : k === run.i ? C.sageDeep : C.line, transition: "all .25s ease" }} />
          ))}
        </div>
        <button className="tw-focus" onClick={() => finish({ items: run.items, results: run.results, notes: run.notes || "" })}
          style={{ background: "none", border: "none", color: C.stone, fontSize: 13.5, fontWeight: 600 }}>End</button>
      </div>

      {/* context row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {exercise
          ? <span className="tw-eyebrow" style={{ color: C.clay }}>{item.area}</span>
          : <span className="tw-eyebrow" style={{ color: C.sage }}>{item.area}</span>}
        <span style={{ color: C.line }}>·</span>
        {scene ? (
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>
            Scene{readingSetting ? "" : ` · task ${stepIdx + 1} of ${item.steps.length}`}
          </span>
        ) : exercise ? (
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>{run.i + 1} of {total}</span>
        ) : (
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>{run.i + 1} of {total}</span>
        )}
        {!readingSetting && taskRecall && <span style={{ fontSize: 11, color: C.clayDeep, background: C.clayTint, borderRadius: 999, padding: "3px 9px", fontWeight: 700 }}>from memory</span>}
        {!readingSetting && taskPersonal && !taskRecall && <span style={{ fontSize: 11, color: C.clayDeep, background: C.clayTint, borderRadius: 999, padding: "3px 9px", fontWeight: 600 }}>personal answer</span>}
      </div>

      {readingSetting ? (
        <>
          <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 10 }}>The setting — read this together</div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "clamp(22px,5vw,40px)", minHeight: 180, display: "flex", alignItems: "center" }}>
            <p className="tw-serif" style={{ fontSize: "clamp(21px,4.6vw,32px)", lineHeight: 1.32, margin: 0, fontWeight: 400 }}>{item.setting}</p>
          </div>
          <div style={{ marginTop: 22, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
            <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "8px 0 14px", lineHeight: 1.45 }}>
              Read the setting together and picture it. When you begin, it tucks away — the tasks are answered from memory. You can bring it back if it's needed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="tw-focus tw-lift" onClick={() => setSettingOpen(false)}
                style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
                {Ico.next} Start the tasks · {item.steps.length}
              </button>
              <button className="tw-focus" onClick={skip}
                style={{ background: C.surface, color: C.stone, border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>
                Skip
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {scene && (
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {item.steps.map((_, k) => (
                <span key={k} style={{ height: 4, flex: 1, borderRadius: 2, background: k < stepIdx ? C.sage : k === stepIdx ? C.sageDeep : C.line }} />
              ))}
            </div>
          )}

          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "clamp(22px,5vw,40px)", minHeight: 176, display: "flex", alignItems: "center" }}>
            <p className="tw-serif" style={{ fontSize: "clamp(23px,5.2vw,36px)", lineHeight: 1.26, margin: 0, fontWeight: 500 }}>{taskPrompt}</p>
          </div>

          {exercise && item.instruction && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "13px 16px", background: C.sageTint, border: `1px solid ${C.sage}33` }}>
              <span style={{ fontSize: 12, color: C.sageDeep, fontWeight: 700 }}>Instructions: </span>
              <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.45 }}>{item.instruction}</span>
            </div>
          )}

          {cue > 0 && (
            <div className="tw-rise" key={cue} style={{ marginTop: 14, background: cueTone, borderRadius: 18, padding: "18px 20px", border: `1px solid ${cueText}22` }}>
              <div className="tw-eyebrow" style={{ color: cueText, marginBottom: 8, opacity: .85 }}>
                {exercise ? `Level ${cue} assist` : `Hint ${cue}`} · {labels[cue - 1]}
              </div>
              <p style={{ fontSize: "clamp(18px,4vw,26px)", lineHeight: 1.3, margin: 0, color: C.ink, fontWeight: 500 }}>{task.cues[cue - 1]}</p>
            </div>
          )}

          {showSetting && scene && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "13px 16px", background: "#fff", border: `1px dashed ${C.sage}` }}>
              <span style={{ fontSize: 12, color: C.sage, fontWeight: 700 }}>Setting: </span>
              <span style={{ fontSize: 14.5, color: C.ink }}>{item.setting}</span>
            </div>
          )}

          {peek && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "12px 15px", background: "#fff", border: `1px dashed ${C.stone}` }}>
              <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>
                {exercise ? "Target (facilitator only): " : "Model answer (facilitator only): "}
              </span>
              <span style={{ fontSize: 15, color: C.ink }}>{task.target}</span>
            </div>
          )}

          {/* facilitator bar */}
          <div style={{ marginTop: 26, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map((r) => (
                  <span key={r} title={labels[r]} style={{ width: 9, height: 9, borderRadius: 3, background: cue > r ? C.clay : C.line }} />
                ))}
                <span style={{ fontSize: 11.5, color: C.stone, marginLeft: 4 }}>
                  {exercise ? "assist ladder" : "support ladder"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button className="tw-focus tw-lift" disabled={cue >= 3} onClick={() => setCue(cue + 1)}
                style={{ flex: "1 1 200px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: cue >= 3 ? C.line : C.clayTint, color: cue >= 3 ? C.stone : C.clayDeep,
                  border: `1.5px solid ${cue >= 3 ? C.line : C.clay}`, borderRadius: 13, padding: "13px 16px", fontSize: 15, fontWeight: 700 }}>
                {Ico.hand}
                {cue === 0
                  ? (exercise ? "Offer a cue" : "Offer a hint")
                  : cue >= 3
                  ? "All cues given"
                  : `${exercise ? "Next assist" : "Next hint"} · ${labels[cue]}`}
              </button>
              {scene && (
                <button className="tw-focus" onClick={() => setShowSetting(!showSetting)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.sage,
                    border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                  {showSetting ? "Hide setting" : "Show setting"}
                </button>
              )}
              <button className="tw-focus" onClick={() => setPeek(!peek)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.inkSoft,
                  border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                {Ico.eye}{peek ? "Hide" : (exercise ? "Peek at target" : "Peek at answer")}
              </button>
              <button className="tw-focus" onClick={skip}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.stone,
                  border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                Skip
              </button>
            </div>

            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, fontWeight: 600 }}>
              {exercise ? "How much assist did they need?" : taskRecall ? "How much did they recall?" : "How did the response go?"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
              {ratings.map((r) => (
                <button key={r.key} className="tw-focus tw-lift" onClick={() => record(r.key)}
                  style={{ textAlign: "left", background: r.tint, border: `1.5px solid ${r.color}44`, borderRadius: 13, padding: "12px 13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: r.color }} />
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>{r.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, paddingLeft: 18 }}>{r.note}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
