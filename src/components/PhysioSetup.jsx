import React, { useState } from "react";
import { C, MINUTES_PER_EXERCISE, DAY_PLAN } from "../constants";
import { BackBtn, SectionLabel, Field, inputStyle } from "./shared";

let customIdSeq = 0;

export function PhysioSetup({ physioBank, start, back }) {
  const [selected, setSelected] = useState([]); // ordered array of exercise objects (seeded or custom)
  const [dualTask, setDualTask] = useState({}); // id -> bool
  const [firstSession, setFirstSession] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  const isSelected = (id) => selected.some((s) => s.id === id);

  const toggleSeeded = (ex) => {
    if (ex.dormant) return;
    if (isSelected(ex.id)) {
      setSelected(selected.filter((s) => s.id !== ex.id));
    } else if (selected.length < 4) {
      setSelected([...selected, ex]);
      setDualTask((d) => ({ ...d, [ex.id]: ex.defaultDualTask }));
    }
  };

  const activeBank = physioBank.filter((ex) => !ex.dormant && !ex.probeOnly);
  const probeBank = physioBank.filter((ex) => !ex.dormant && ex.probeOnly);
  const dormantBank = physioBank.filter((ex) => ex.dormant);

  const today = DAY_PLAN[new Date().getDay()];
  const isRestDay = today.ids.length === 0;

  const applyToday = () => {
    const picks = today.ids.map((id) => physioBank.find((ex) => ex.id === id)).filter(Boolean);
    setSelected(picks);
    setDualTask(Object.fromEntries(picks.map((ex) => [ex.id, ex.defaultDualTask])));
  };

  const addCustom = () => {
    if (!customTitle.trim() || selected.length >= 4) return;
    const id = "custom-" + Date.now() + "-" + customIdSeq++;
    const ex = {
      id, title: customTitle.trim(), kind: "custom",
      instructions: customInstructions.trim(), cues: [], watchFor: "", mediaUrl: "", defaultDualTask: false,
    };
    setSelected([...selected, ex]);
    setDualTask((d) => ({ ...d, [id]: false }));
    setCustomTitle(""); setCustomInstructions(""); setCustomOpen(false);
  };

  const toggleDualTask = (id) => setDualTask((d) => ({ ...d, [id]: !d[id] }));

  const moveSelected = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= selected.length) return;
    const next = [...selected];
    [next[index], next[to]] = [next[to], next[index]];
    setSelected(next);
  };

  const count = selected.length;
  const estMinutes = count * MINUTES_PER_EXERCISE;
  const overTarget = estMinutes > 40;
  const canBegin = count >= 2 && count <= 4;

  const begin = () => {
    const items = selected.map((ex) => ({ ...ex, dualTask: !!dualTask[ex.id] }));
    start({ items, firstSession });
  };

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Set up the session</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>
        Pick 2–4 exercises for today. You run this live, side by side with Akki.
      </p>

      {isRestDay ? (
        <div style={{ background: C.sageTint, border: `1px solid ${C.sage}44`, borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
          <div className="tw-serif" style={{ fontSize: 18, color: C.sageDeep, marginBottom: 6 }}>{today.label}</div>
          <p style={{ fontSize: 13.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>
            Recovery happens in the gaps — a rest day is not a lost day. Pick something manually below if you want to override.
          </p>
        </div>
      ) : (
        <button className="tw-focus tw-lift" onClick={applyToday}
          style={{ width: "100%", textAlign: "left", background: C.sage, color: "#fff", border: "none",
            borderRadius: 16, padding: "16px 18px", marginBottom: 20, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Today's session · {today.label}</div>
          <div style={{ fontSize: 12.5, opacity: .9, marginTop: 3 }}>Pre-selects the day's exercises — review and adjust below</div>
        </button>
      )}

      <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20 }}>
        <input type="checkbox" checked={firstSession} onChange={() => setFirstSession(!firstSession)}
          style={{ width: 18, height: 18, accentColor: C.clay }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>First session</span>
        <span style={{ fontSize: 12.5, color: C.stone }}>— skips "recall last time" at the opening</span>
      </label>

      <SectionLabel>Exercises</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {activeBank.map((ex) => {
          const on = isSelected(ex.id);
          const disabled = !on && count >= 4;
          return (
            <div key={ex.id} style={{ background: on ? C.clayTint : C.surface, border: `1.5px solid ${on ? C.clay : C.line}`,
              borderRadius: 14, padding: "13px 15px", opacity: disabled ? .5 : 1 }}>
              <label className="tw-focus" style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: disabled ? "default" : "pointer" }}>
                <input type="checkbox" checked={on} disabled={disabled} onChange={() => toggleSeeded(ex)}
                  style={{ width: 18, height: 18, accentColor: C.clay, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{ex.title}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>
                    {ex.instructions.length > 100 ? ex.instructions.slice(0, 100) + "…" : ex.instructions}
                  </div>
                </div>
              </label>
              {on && (
                <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingLeft: 30, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!dualTask[ex.id]} onChange={() => toggleDualTask(ex.id)}
                    style={{ width: 16, height: 16, accentColor: C.sage }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.sageDeep }}>Dual-task this one</span>
                </label>
              )}
            </div>
          );
        })}

        {selected.filter((s) => s.kind === "custom").map((ex) => (
          <div key={ex.id} style={{ background: C.clayTint, border: `1.5px solid ${C.clay}`, borderRadius: 14, padding: "13px 15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{ex.title} <span style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>· typed in</span></div>
                {ex.instructions && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3 }}>{ex.instructions}</div>}
              </div>
              <button className="tw-focus" onClick={() => setSelected(selected.filter((s) => s.id !== ex.id))}
                style={{ background: "none", border: "none", color: C.stone, fontSize: 12.5, fontWeight: 600 }}>Remove</button>
            </div>
            <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={!!dualTask[ex.id]} onChange={() => toggleDualTask(ex.id)}
                style={{ width: 16, height: 16, accentColor: C.sage }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.sageDeep }}>Dual-task this one</span>
            </label>
          </div>
        ))}
      </div>

      {probeBank.length > 0 && (
        <>
          <SectionLabel>Weekly probes — measurement, not training</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {probeBank.map((ex) => {
              const on = isSelected(ex.id);
              const disabled = !on && count >= 4;
              return (
                <div key={ex.id} style={{ background: on ? C.clayTint : C.surface, border: `1.5px solid ${on ? C.clay : C.line}`,
                  borderRadius: 14, padding: "13px 15px", opacity: disabled ? .5 : 1 }}>
                  <label className="tw-focus" style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: disabled ? "default" : "pointer" }}>
                    <input type="checkbox" checked={on} disabled={disabled} onChange={() => toggleSeeded(ex)}
                      style={{ width: 18, height: 18, accentColor: C.clay, marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{ex.title}</div>
                      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, lineHeight: 1.4 }}>
                        {ex.instructions.length > 100 ? ex.instructions.slice(0, 100) + "…" : ex.instructions}
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </>
      )}

      {dormantBank.length > 0 && (
        <>
          <SectionLabel>Not yet — unlocks later</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {dormantBank.map((ex) => (
              <div key={ex.id} style={{ background: C.paper, border: `1.5px dashed ${C.line}`, borderRadius: 14, padding: "13px 15px", opacity: .55 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <input type="checkbox" checked={false} disabled
                    style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.inkSoft }}>{ex.title}</div>
                    <div style={{ fontSize: 12.5, color: C.stone, marginTop: 3, lineHeight: 1.4 }}>{ex.instructions}</div>
                    <div style={{ fontSize: 11.5, color: C.clayDeep, fontWeight: 600, marginTop: 6 }}>Unlocks at {ex.unlocksAt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {count < 4 && (
        customOpen ? (
          <div style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 14, padding: "14px 15px", marginBottom: 20 }}>
            <Field label="Exercise name">
              <input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} style={inputStyle} placeholder="e.g. Standing side-taps" />
            </Field>
            <Field label="Instructions (optional)">
              <textarea value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)} rows={2} style={inputStyle} />
            </Field>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="tw-focus tw-lift" disabled={!customTitle.trim()} onClick={addCustom}
                style={{ flex: 1, background: customTitle.trim() ? C.clay : C.line, color: customTitle.trim() ? "#fff" : C.inkSoft,
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
            + Type in a new exercise
          </button>
        )
      )}

      {selected.length > 1 && (
        <>
          <SectionLabel>Session order</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
            {selected.map((ex, i) => (
              <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 10,
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "9px 10px 9px 15px" }}>
                <span style={{ fontSize: 12.5, color: C.stone, fontWeight: 700, width: 16 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>{ex.title}</span>
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        background: overTarget ? C.clayTint : C.sageTint, borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: overTarget ? C.clayDeep : C.sageDeep }}>
          Estimated length: ~{estMinutes} min
        </span>
        {overTarget && <span style={{ fontSize: 12, color: C.clayDeep, fontWeight: 600 }}>over the ~40 min target</span>}
      </div>

      <button className="tw-focus tw-lift" disabled={!canBegin} onClick={begin}
        style={{ width: "100%", background: canBegin ? C.clay : C.line, color: canBegin ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canBegin ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {canBegin ? `Begin session · ${count} exercises` : `Pick 2–4 exercises (${count} selected)`}
      </button>
    </div>
  );
}
