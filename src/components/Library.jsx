import React, { useState } from "react";
import { C, AREAS } from "../constants";
import { isScene, isDeck, cueLabels } from "../utils";
import { BackBtn, SectionLabel, Pill, Field, inputStyle, Ico } from "./shared";

function LineEditor({ item, onSave, onCancel, onDelete }) {
  const [d, setD] = useState(item);
  const labels = cueLabels(d.personal);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setCue = (i, v) => { const c = [...d.cues]; c[i] = v; setD({ ...d, cues: c }); };
  const valid = d.prompt.trim() && d.target.trim();

  return (
    <div className="tw-rise">
      <BackBtn onClick={onCancel} label="Cancel" />
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "12px 0 18px" }}>{item.id === "new" ? "Add a sentence" : "Edit sentence"}</h2>

      <Field label="Focus area">
        <select value={d.area} onChange={(e) => set("area", e.target.value)} style={inputStyle}>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </Field>

      <Field label="What the facilitator asks (shown to the person)">
        <textarea value={d.prompt} onChange={(e) => set("prompt", e.target.value)} rows={2} style={inputStyle} placeholder="You're at a café. Order a coffee with milk." />
      </Field>

      <Field label="Model sentence">
        <input value={d.target} onChange={(e) => set("target", e.target.value)} style={inputStyle} placeholder="I'll have a coffee with milk, please." />
      </Field>

      <div style={{ background: C.clayTint + "88", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div className="tw-eyebrow" style={{ color: C.clayDeep, marginBottom: 4 }}>Cue ladder</div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px" }}>Offered one rung at a time, lightest support first.</p>
        {d.cues.map((cVal, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.clayDeep, marginBottom: 4 }}>{i + 1}. {labels[i]}</div>
            <input value={cVal} onChange={(e) => setCue(i, e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}
              placeholder={[`"I'll have…"`, `"I'll have a coffee with ___."`, d.personal ? "A content clue" : `"It starts with /m/ — milk."`][i]} />
          </div>
        ))}
      </div>

      <Field label="Sentence length">
        <div style={{ display: "flex", gap: 8 }}>
          {[[1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
            <button key={v} className="tw-focus" onClick={() => set("level", v)}
              style={{ flex: 1, border: `1.5px solid ${d.level === v ? C.sage : C.line}`, background: d.level === v ? C.sageTint : C.surface,
                color: d.level === v ? C.sageDeep : C.inkSoft, borderRadius: 11, padding: "10px", fontSize: 14, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </Field>

      <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", marginBottom: 24, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 15px" }}>
        <input type="checkbox" checked={d.personal} onChange={(e) => set("personal", e.target.checked)} style={{ width: 18, height: 18, accentColor: C.sage }} />
        <span style={{ fontSize: 14 }}>Personal answer — any true response counts (model sentence is just a frame)</span>
      </label>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="tw-focus tw-lift" disabled={!valid} onClick={() => onSave(d)}
          style={{ flex: 1, background: valid ? C.sage : C.line, color: valid ? "#fff" : C.stone, border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: valid ? `0 3px 0 ${C.sageDeep}` : "none" }}>
          Save sentence
        </button>
        {onDelete && <button className="tw-focus" onClick={onDelete} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>Remove</button>}
      </div>
    </div>
  );
}

function SceneEditor({ item, onSave, onCancel, onDelete }) {
  const [d, setD] = useState(item);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setStep = (i, patch) => setD({ ...d, steps: d.steps.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const setStepCue = (i, ci, v) => setStep(i, { cues: d.steps[i].cues.map((c, k) => (k === ci ? v : c)) });
  const addStep = () => setD({ ...d, steps: [...d.steps, { ask: "", target: "", cues: ["", "", ""], personal: false, recall: false }] });
  const removeStep = (i) => setD({ ...d, steps: d.steps.filter((_, k) => k !== i) });
  const valid = d.setting.trim() && d.steps.length && d.steps.every((s) => s.ask.trim() && s.target.trim());

  return (
    <div className="tw-rise">
      <BackBtn onClick={onCancel} label="Cancel" />
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "12px 0 6px" }}>{item.id === "new" ? "Add a scene" : "Edit scene"}</h2>
      <p style={{ fontSize: 13.5, color: C.inkSoft, margin: "0 0 18px", lineHeight: 1.45 }}>
        A setting held in mind, then linked tasks. End with a recall task to work on memory.
      </p>

      <Field label="Focus area">
        <select value={d.area} onChange={(e) => set("area", e.target.value)} style={inputStyle}>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </Field>

      <Field label="The setting (read together, then tucked away)">
        <textarea value={d.setting} onChange={(e) => set("setting", e.target.value)} rows={3} style={inputStyle}
          placeholder="You've just finished dinner at a restaurant with a friend. The waiter is walking past your table." />
      </Field>

      <div className="tw-eyebrow" style={{ color: C.stone, margin: "6px 0 10px" }}>Tasks · in order</div>
      {d.steps.map((s, i) => {
        const labels = cueLabels(s.personal);
        return (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderLeft: `3px solid ${s.recall ? C.clay : C.sage}`, borderRadius: 14, padding: "14px 15px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.recall ? C.clayDeep : C.sageDeep }}>Task {i + 1}{s.recall ? " · from memory" : ""}</span>
              {d.steps.length > 1 && <button className="tw-focus" onClick={() => removeStep(i)} style={{ background: "none", border: "none", color: C.stone, fontSize: 12.5, fontWeight: 600 }}>Remove</button>}
            </div>
            <textarea value={s.ask} onChange={(e) => setStep(i, { ask: e.target.value })} rows={2} style={{ ...inputStyle, marginBottom: 10 }} placeholder="Ask the waiter for the bill." />
            <input value={s.target} onChange={(e) => setStep(i, { target: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }} placeholder="Model answer — Excuse me, could we have the bill, please?" />
            <div style={{ display: "grid", gap: 7 }}>
              {s.cues.map((cVal, ci) => (
                <div key={ci}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: C.clayDeep, marginBottom: 3 }}>{ci + 1}. {labels[ci]}</div>
                  <input value={cVal} onChange={(e) => setStepCue(i, ci, e.target.value)} style={{ ...inputStyle }}
                    placeholder={ci === 0 ? "Sentence starter…" : ci === 1 ? "Fill in the blank ___" : (s.personal ? "A content clue" : "First sound — /b/ …")} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
              <label className="tw-focus" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={!!s.personal} onChange={(e) => setStep(i, { personal: e.target.checked })} style={{ width: 17, height: 17, accentColor: C.sage }} /> Personal answer
              </label>
              <label className="tw-focus" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input type="checkbox" checked={!!s.recall} onChange={(e) => setStep(i, { recall: e.target.checked })} style={{ width: 17, height: 17, accentColor: C.clay }} /> From memory (recall)
              </label>
            </div>
          </div>
        );
      })}
      <button className="tw-focus" onClick={addStep}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.sageTint, color: C.sageDeep, border: `1.5px dashed ${C.sage}`, borderRadius: 12, padding: "11px 15px", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
        {Ico.plus} Add a task
      </button>

      <Field label="Difficulty">
        <div style={{ display: "flex", gap: 8 }}>
          {[[1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
            <button key={v} className="tw-focus" onClick={() => set("level", v)}
              style={{ flex: 1, border: `1.5px solid ${d.level === v ? C.sage : C.line}`, background: d.level === v ? C.sageTint : C.surface,
                color: d.level === v ? C.sageDeep : C.inkSoft, borderRadius: 11, padding: "10px", fontSize: 14, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </Field>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
        <button className="tw-focus tw-lift" disabled={!valid} onClick={() => onSave(d)}
          style={{ flex: 1, background: valid ? C.sage : C.line, color: valid ? "#fff" : C.stone, border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: valid ? `0 3px 0 ${C.sageDeep}` : "none" }}>
          Save scene
        </button>
        {onDelete && <button className="tw-focus" onClick={onDelete} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>Remove</button>}
      </div>
    </div>
  );
}

export function Library({ bank, save, back }) {
  const [editing, setEditing] = useState(null);

  const upsert = (item) => {
    if (item.id === "new") { save([...bank, { ...item, id: (isScene(item) ? "sc" : "s") + Date.now() }]); }
    else { save(bank.map((b) => (b.id === item.id ? item : b))); }
    setEditing(null);
  };
  const remove = (id) => { if (confirm("Remove this item?")) { save(bank.filter((b) => b.id !== id)); setEditing(null); } };
  const toggleApprove = (id) => save(bank.map((b) => (b.id === id ? { ...b, approved: !b.approved } : b)));

  if (editing) {
    if (editing.new === "line") return <LineEditor item={{ id: "new", type: "line", area: AREAS[0], prompt: "", target: "", cues: ["", "", ""], level: 1, personal: false, approved: true }} onSave={upsert} onCancel={() => setEditing(null)} onDelete={null} />;
    if (editing.new === "scene") return <SceneEditor item={{ id: "new", type: "scene", area: AREAS[1], level: 3, approved: true, setting: "", steps: [{ ask: "", target: "", cues: ["", "", ""], personal: false, recall: false }] }} onSave={upsert} onCancel={() => setEditing(null)} onDelete={null} />;
    const item = bank.find((b) => b.id === editing);
    const Ed = isScene(item) ? SceneEditor : LineEditor;
    return <Ed item={item} onSave={upsert} onCancel={() => setEditing(null)} onDelete={() => remove(item.id)} />;
  }

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 6px" }}>Practice library</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 16px", fontSize: 15 }}>Edit any item, its cues, and its level. Approve the ones ready to use.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button className="tw-focus tw-lift" onClick={() => setEditing({ new: "line" })}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.sage, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700, boxShadow: `0 2px 0 ${C.sageDeep}` }}>
          {Ico.plus} Add sentence
        </button>
        <button className="tw-focus tw-lift" onClick={() => setEditing({ new: "scene" })}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.clay, color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700, boxShadow: `0 2px 0 ${C.clayDeep}` }}>
          {Ico.plus} Add scene
        </button>
      </div>

      {AREAS.map((area) => {
        const items = bank.filter((b) => b.area === area);
        if (!items.length) return null;
        return (
          <div key={area} style={{ marginBottom: 22 }}>
            <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 10 }}>{area}</div>
            {items.map((b) => {
              const sc = isScene(b), dk = isDeck(b), rich = sc || dk;
              return (
                <div key={b.id} style={{ background: C.surface, border: `1px solid ${rich ? C.clay + "55" : C.line}`, borderLeft: rich ? `3px solid ${C.clay}` : `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, display: "flex", gap: 11 }}>
                      {dk && <img src={b.cards[0]?.image_url} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                        style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: C.sageTint }} />}
                      <div style={{ flex: 1 }}>
                        {dk ? (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3, textTransform: "capitalize" }}>{[...new Set(b.cards.map((c) => c.theme))].join(", ")} deck</div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{b.cards.length} cards · four rungs each</div>
                          </>
                        ) : sc ? (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3, lineHeight: 1.35 }}>{b.setting}</div>
                            <div style={{ fontSize: 12.5, color: C.inkSoft }}>{b.steps.length} tasks{b.steps.some((s) => s.recall) ? " · ends with recall" : ""}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{b.prompt}</div>
                            <div style={{ fontSize: 13, color: C.inkSoft }}>{b.target}</div>
                          </>
                        )}
                        <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                          {dk ? <Pill tone="clay">deck</Pill> : sc ? <Pill tone="clay">scene</Pill> : <Pill>sentence</Pill>}
                          <Pill>{["", "Short", "Medium", "Longer"][b.level]}</Pill>
                          {!rich && b.personal && <Pill tone="clay">personal</Pill>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
                      <button className="tw-focus" onClick={() => toggleApprove(b.id)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700,
                          border: `1.5px solid ${b.approved ? C.sage : C.line}`, background: b.approved ? C.sageTint : C.surface,
                          color: b.approved ? C.sageDeep : C.stone, borderRadius: 999, padding: "5px 11px" }}>
                        {b.approved && Ico.check}{b.approved ? "Approved" : "Approve"}
                      </button>
                      {dk
                        ? <span style={{ fontSize: 11, color: C.stone, fontWeight: 600, textAlign: "right", maxWidth: 92, lineHeight: 1.3 }}>edit in seed.js</span>
                        : <button className="tw-focus" onClick={() => setEditing(b.id)}
                            style={{ fontSize: 13, fontWeight: 600, color: C.sage, background: "none", border: "none", padding: "2px 4px" }}>Edit</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
