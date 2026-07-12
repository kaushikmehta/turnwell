import React, { useState } from "react";
import { C } from "../../constants";
import { SectionLabel } from "../shared";

function RatingInput({ label, value, onChange }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <input type="number" min={1} max={10} value={value} onChange={(e) => onChange(e.target.value)}
        className="tw-focus" style={{ width: "100%", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
    </div>
  );
}

export function Opening({ items, firstSession, onNext }) {
  const [starId, setStarId] = useState(null);
  const [before, setBefore] = useState({ tired: "", mood: "", satisfaction: "" });

  const canContinue = !!starId;

  const submit = () => {
    const star = items.find((i) => i.id === starId);
    const b = before.tired || before.mood || before.satisfaction
      ? { tired: before.tired || "—", mood: before.mood || "—", satisfaction: before.satisfaction || "—" }
      : null;
    onNext({ star: { id: star.id, title: star.title }, before: b });
  };

  return (
    <div className="tw-rise">
      <SectionLabel>Opening</SectionLabel>
      <h2 className="tw-serif" style={{ fontSize: 26, margin: "0 0 18px" }}>Before you start</h2>

      {!firstSession && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 5 }}>1. Recall</div>
          <p style={{ fontSize: 15.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>Ask Akki to recall what we did last time — 1, 2, 3…</p>
        </div>
      )}

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 5 }}>2. Orient</div>
        <p style={{ fontSize: 15.5, color: C.ink, margin: 0, lineHeight: 1.45 }}>
          Orient him to today's plan and how each exercise helps him function — plain words, tie it to standing.
        </p>
      </div>

      <div style={{ background: C.clayTint, border: `1px solid ${C.clay}55`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.clayDeep, marginBottom: 8 }}>3. Star exercise</div>
        <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>Ask which one he's keenest to work on, and why.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it) => (
            <button key={it.id} className="tw-focus" onClick={() => setStarId(it.id)}
              style={{ textAlign: "left", border: `1.5px solid ${starId === it.id ? C.clay : C.line}`,
                background: starId === it.id ? "#fff" : C.surface, color: C.ink,
                borderRadius: 12, padding: "11px 14px", fontSize: 14.5, fontWeight: 600 }}>
              {starId === it.id ? "★ " : ""}{it.title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>4. Before-session state (optional)</div>
        <div style={{ display: "flex", gap: 10 }}>
          <RatingInput label="Tiredness" value={before.tired} onChange={(v) => setBefore({ ...before, tired: v })} />
          <RatingInput label="Mood" value={before.mood} onChange={(v) => setBefore({ ...before, mood: v })} />
          <RatingInput label="Satisfaction" value={before.satisfaction} onChange={(v) => setBefore({ ...before, satisfaction: v })} />
        </div>
      </div>

      <button className="tw-focus tw-lift" disabled={!canContinue} onClick={submit}
        style={{ width: "100%", background: canContinue ? C.clay : C.line, color: canContinue ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: canContinue ? `0 3px 0 ${C.clayDeep}` : "none" }}>
        {canContinue ? "Continue to estimates" : "Pick a star exercise to continue"}
      </button>
    </div>
  );
}
