import React, { useState } from "react";
import { C, PHASE_ORDER, PHASE_LABELS } from "../constants";
import { BackBtn, SectionLabel, Pill, Field, inputStyle, Ico } from "./shared";

function ExerciseEditor({ item, onSave, onCancel, onDelete }) {
  const [d, setD] = useState(item);
  const set = (k, v) => setD({ ...d, [k]: v });
  const setCue = (i, v) => { const c = [...d.cues]; c[i] = v; setD({ ...d, cues: c }); };
  const valid = d.prompt.trim() && d.instruction.trim();

  const cuePlaceholders = [
    "Verbal: 'I'm going to…' (model the movement)",
    "Guide: Hold lightly and guide the first rep.",
    "Full: Passively complete the movement for them.",
  ];

  return (
    <div className="tw-rise">
      <BackBtn onClick={onCancel} label="Cancel" />
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "12px 0 18px" }}>{item.id === "new" ? "Add an exercise" : "Edit exercise"}</h2>

      <Field label="Phase">
        <div style={{ display: "flex", gap: 8 }}>
          {PHASE_ORDER.map((phase) => (
            <button key={phase} className="tw-focus" onClick={() => set("phase", phase)}
              style={{ flex: 1, border: `1.5px solid ${d.phase === phase ? C.clay : C.line}`, background: d.phase === phase ? C.clayTint : C.surface,
                color: d.phase === phase ? C.clayDeep : C.inkSoft, borderRadius: 11, padding: "10px 6px", fontSize: 12.5, fontWeight: 600 }}>
              {PHASE_LABELS[phase].split(" / ")[0]}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Body area">
        <input value={d.area} onChange={(e) => set("area", e.target.value)} style={inputStyle} placeholder="Left arm, Ankles, Trunk…" />
      </Field>

      <Field label="Exercise name (shown large during session)">
        <input value={d.prompt} onChange={(e) => set("prompt", e.target.value)} style={inputStyle} placeholder="Ankle circles" />
      </Field>

      <Field label="Instructions for the facilitator">
        <textarea value={d.instruction} onChange={(e) => set("instruction", e.target.value)} rows={3} style={inputStyle}
          placeholder="Support Akki's foot and gently rotate the ankle 5 times in each direction. Both feet." />
      </Field>

      <Field label="What good looks like (target)">
        <input value={d.target} onChange={(e) => set("target", e.target.value)} style={inputStyle} placeholder="10 rotations each ankle, passive." />
      </Field>

      <div style={{ background: C.clayTint + "88", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div className="tw-eyebrow" style={{ color: C.clayDeep, marginBottom: 4 }}>Assist ladder</div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px" }}>Offered one level at a time, lightest first.</p>
        {d.cues.map((cVal, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.clayDeep, marginBottom: 4 }}>
              {["1. Verbal cue", "2. Guided assist", "3. Full assist"][i]}
            </div>
            <input value={cVal} onChange={(e) => setCue(i, e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}
              placeholder={cuePlaceholders[i]} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="tw-focus tw-lift" disabled={!valid} onClick={() => onSave(d)}
          style={{ flex: 1, background: valid ? C.clay : C.line, color: valid ? "#fff" : C.stone, border: "none", borderRadius: 14, padding: "15px", fontSize: 15.5, fontWeight: 700, boxShadow: valid ? `0 3px 0 ${C.clayDeep}` : "none" }}>
          Save exercise
        </button>
        {onDelete && <button className="tw-focus" onClick={onDelete} style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 14, padding: "15px 18px", fontSize: 14, fontWeight: 600 }}>Remove</button>}
      </div>
    </div>
  );
}

export function PhysioLibrary({ physioBank, save, back }) {
  const [editing, setEditing] = useState(null);

  const upsert = (item) => {
    if (item.id === "new") { save([...physioBank, { ...item, id: "e" + Date.now() }]); }
    else { save(physioBank.map((e) => (e.id === item.id ? item : e))); }
    setEditing(null);
  };
  const remove = (id) => { if (confirm("Remove this exercise?")) { save(physioBank.filter((e) => e.id !== id)); setEditing(null); } };
  const toggleApprove = (id) => save(physioBank.map((e) => (e.id === id ? { ...e, approved: !e.approved } : e)));

  if (editing) {
    if (editing.new) return <ExerciseEditor
      item={{ id: "new", type: "exercise", phase: "warmup", area: "", prompt: "", instruction: "", target: "", cues: ["", "", ""], level: 1, approved: true }}
      onSave={upsert} onCancel={() => setEditing(null)} onDelete={null} />;
    const item = physioBank.find((e) => e.id === editing);
    return <ExerciseEditor item={item} onSave={upsert} onCancel={() => setEditing(null)} onDelete={() => remove(item.id)} />;
  }

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 6px" }}>Exercise library</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 16px", fontSize: 15 }}>Edit exercises, their assist cues, and approval status.</p>

      <button className="tw-focus tw-lift" onClick={() => setEditing({ new: true })}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.clay, color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontSize: 14.5, fontWeight: 700, boxShadow: `0 2px 0 ${C.clayDeep}`, marginBottom: 24 }}>
        {Ico.plus} Add exercise
      </button>

      {PHASE_ORDER.map((phase) => {
        const exercises = physioBank.filter((e) => e.phase === phase);
        if (!exercises.length) return null;
        return (
          <div key={phase} style={{ marginBottom: 22 }}>
            <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 10 }}>{PHASE_LABELS[phase]}</div>
            {exercises.map((e) => (
              <div key={e.id} style={{ background: C.surface, border: `1px solid ${C.clay}44`, borderLeft: `3px solid ${C.clay}`, borderRadius: 14, padding: "13px 15px", marginBottom: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{e.prompt}</div>
                    <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.4 }}>{e.instruction}</div>
                    <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
                      <Pill tone="clay">{e.area}</Pill>
                      <Pill>{PHASE_LABELS[e.phase].split(" / ")[0]}</Pill>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
                    <button className="tw-focus" onClick={() => toggleApprove(e.id)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700,
                        border: `1.5px solid ${e.approved ? C.clay : C.line}`, background: e.approved ? C.clayTint : C.surface,
                        color: e.approved ? C.clayDeep : C.stone, borderRadius: 999, padding: "5px 11px" }}>
                      {e.approved ? "Approved" : "Approve"}
                    </button>
                    <button className="tw-focus" onClick={() => setEditing(e.id)}
                      style={{ fontSize: 13, fontWeight: 600, color: C.clay, background: "none", border: "none", padding: "2px 4px" }}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
