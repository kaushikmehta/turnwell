import React, { useState } from "react";
import { C } from "../constants";
import { BackBtn, SectionLabel, Field, inputStyle } from "./shared";

let customIdSeq = 0;

export function ReadingSetup({ passages, start, back }) {
  const sorted = [...passages].sort((a, b) => a.level - b.level);
  const levels = [...new Set(sorted.map((p) => p.level))].sort((a, b) => a - b);
  const minLevelAvail = levels[0];
  const maxLevelAvail = levels[levels.length - 1];

  const [selected, setSelected] = useState([]); // ordered array of passage objects
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customQ1, setCustomQ1] = useState("");
  const [customQ2, setCustomQ2] = useState("");

  const [randomCount, setRandomCount] = useState(3);
  const [randomMin, setRandomMin] = useState(minLevelAvail);
  const [randomMax, setRandomMax] = useState(maxLevelAvail);

  const isSelected = (id) => selected.some((s) => s.id === id);

  const toggle = (p) => {
    if (isSelected(p.id)) setSelected(selected.filter((s) => s.id !== p.id));
    else setSelected([...selected, p]);
  };

  const randomize = () => {
    const pool = sorted.filter((p) => p.level >= randomMin && p.level <= randomMax);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(randomCount, shuffled.length)).sort((a, b) => a.level - b.level);
    setSelected(picked);
  };

  const addCustom = () => {
    if (!customText.trim() || !customQ1.trim()) return;
    const id = "custom-" + Date.now() + "-" + customIdSeq++;
    const questions = [{ q: customQ1.trim(), target: "", cues: [] }];
    if (customQ2.trim()) questions.push({ q: customQ2.trim(), target: "", cues: [] });
    setSelected([...selected, { id, level: null, text: customText.trim(), questions, custom: true }]);
    setCustomText(""); setCustomQ1(""); setCustomQ2(""); setCustomOpen(false);
  };

  const moveSelected = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= selected.length) return;
    const next = [...selected];
    [next[index], next[to]] = [next[to], next[index]];
    setSelected(next);
  };

  const count = selected.length;
  const canBegin = count >= 1;

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Set up the session</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>
        Pick passages — ordered easiest to hardest. You read each one live with Akki, then ask the questions.
      </p>

      <SectionLabel>Pick randomly</SectionLabel>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 15px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 100px" }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>How many</div>
            <input type="number" min={1} max={sorted.length} value={randomCount}
              onChange={(e) => setRandomCount(Math.max(1, Number(e.target.value) || 1))}
              className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
          </div>
          <div style={{ flex: "1 1 100px" }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>From level</div>
            <select value={randomMin} onChange={(e) => setRandomMin(Number(e.target.value))}
              className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 100px" }}>
            <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 5 }}>To level</div>
            <select value={randomMax} onChange={(e) => setRandomMax(Number(e.target.value))}
              className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <button className="tw-focus tw-lift" disabled={randomMin > randomMax} onClick={randomize}
          style={{ width: "100%", background: randomMin <= randomMax ? C.sage : C.line, color: randomMin <= randomMax ? "#fff" : C.inkSoft,
            border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700 }}>
          Randomize · replaces the selection below
        </button>
      </div>

      <SectionLabel>Passages</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {sorted.map((p) => {
          const on = isSelected(p.id);
          return (
            <label key={p.id} className="tw-focus"
              style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                background: on ? C.sageTint : C.surface, border: `1.5px solid ${on ? C.sage : C.line}`,
                borderRadius: 14, padding: "13px 15px" }}>
              <input type="checkbox" checked={on} onChange={() => toggle(p)}
                style={{ width: 18, height: 18, accentColor: C.sage, marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.sageDeep, background: "#fff", borderRadius: 999, padding: "2px 9px" }}>Level {p.level}</span>
                  <span style={{ fontSize: 11.5, color: C.stone }}>{p.questions.length} question{p.questions.length > 1 ? "s" : ""}</span>
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>{p.text}</div>
              </div>
            </label>
          );
        })}

        {selected.filter((s) => s.custom).map((p) => (
          <div key={p.id} style={{ background: C.sageTint, border: `1.5px solid ${C.sage}`, borderRadius: 14, padding: "13px 15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11.5, color: C.stone, fontWeight: 700, marginBottom: 3 }}>TYPED IN</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 4 }}>{p.text}</div>
                {p.questions.map((q, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: C.inkSoft }}>{i + 1}. {q.q}</div>
                ))}
              </div>
              <button className="tw-focus" onClick={() => setSelected(selected.filter((s) => s.id !== p.id))}
                style={{ background: "none", border: "none", color: C.stone, fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {customOpen ? (
        <div style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 14, padding: "14px 15px", marginBottom: 20 }}>
          <Field label="Passage text (1–3 sentences)">
            <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} rows={2} style={inputStyle} placeholder="e.g. Asha watered the plants before breakfast." />
          </Field>
          <Field label="Question 1">
            <input value={customQ1} onChange={(e) => setCustomQ1(e.target.value)} style={inputStyle} placeholder="e.g. What did Asha do before breakfast?" />
          </Field>
          <Field label="Question 2 (optional)">
            <input value={customQ2} onChange={(e) => setCustomQ2(e.target.value)} style={inputStyle} />
          </Field>
          <p style={{ fontSize: 12, color: C.stone, margin: "-6px 0 12px" }}>No scripted cues for typed-in passages — improvise hints live.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tw-focus tw-lift" disabled={!customText.trim() || !customQ1.trim()} onClick={addCustom}
              style={{ flex: 1, background: customText.trim() && customQ1.trim() ? C.sage : C.line, color: customText.trim() && customQ1.trim() ? "#fff" : C.inkSoft,
                border: "none", borderRadius: 12, padding: "12px", fontSize: 14.5, fontWeight: 700 }}>
              Add to session
            </button>
            <button className="tw-focus" onClick={() => setCustomOpen(false)}
              style={{ background: "none", border: `1.5px solid ${C.line}`, color: C.stone, borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="tw-focus" onClick={() => setCustomOpen(true)}
          style={{ fontSize: 13.5, fontWeight: 600, color: C.sage, background: "none", border: "none", padding: "6px 2px", marginBottom: 20 }}>
          + Type in a new passage
        </button>
      )}

      {selected.length > 1 && (
        <>
          <SectionLabel>Session order</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
            {selected.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10,
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "9px 10px 9px 15px" }}>
                <span style={{ fontSize: 12.5, color: C.stone, fontWeight: 700, width: 16 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.text}</span>
                <button className="tw-focus" disabled={i === 0} onClick={() => moveSelected(i, -1)}
                  style={{ background: "none", border: `1.5px solid ${C.line}`, borderRadius: 9, width: 30, height: 30,
                    color: i === 0 ? C.line : C.inkSoft, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>↑</button>
                <button className="tw-focus" disabled={i === selected.length - 1} onClick={() => moveSelected(i, 1)}
                  style={{ background: "none", border: `1.5px solid ${C.line}`, borderRadius: 9, width: 30, height: 30,
                    color: i === selected.length - 1 ? C.line : C.inkSoft, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>↓</button>
              </div>
            ))}
          </div>
        </>
      )}

      <button className="tw-focus tw-lift" disabled={!canBegin} onClick={() => start(selected)}
        style={{ width: "100%", background: canBegin ? C.sage : C.line, color: canBegin ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canBegin ? `0 3px 0 ${C.sageDeep}` : "none" }}>
        {canBegin ? `Begin session · ${count} passage${count > 1 ? "s" : ""}` : "Pick at least one passage"}
      </button>
    </div>
  );
}
