import React, { useState } from "react";
import { C } from "../../constants";
import { SectionLabel, inputStyle } from "../shared";

function RatingInput({ label, value, onChange }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginBottom: 5 }}>{label}</div>
      <input type="number" min={1} max={10} value={value} onChange={(e) => onChange(e.target.value)}
        className="tw-focus" style={{ width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink }} />
    </div>
  );
}

export function Closing({ items, star, onNext }) {
  const [starRecalledId, setStarRecalledId] = useState(null);
  const [favouriteId, setFavouriteId] = useState(null);
  const [favouriteWhy, setFavouriteWhy] = useState("");
  const [after, setAfter] = useState({ tired: "", mood: "", satisfaction: "" });
  const [notes, setNotes] = useState("");

  const canContinue = !!starRecalledId;

  const submit = () => {
    const recalled = items.find((i) => i.id === starRecalledId);
    const fav = items.find((i) => i.id === favouriteId);
    const a = after.tired || after.mood || after.satisfaction
      ? { tired: after.tired || "—", mood: after.mood || "—", satisfaction: after.satisfaction || "—" }
      : null;
    onNext({
      starRecalledId: recalled.id, starRecalledTitle: recalled.title,
      favouriteId: fav ? fav.id : null, favouriteTitle: fav ? fav.title : null, favouriteWhy: favouriteWhy.trim(),
      after: a, notes: notes.trim(),
    });
  };

  return (
    <div className="tw-rise">
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
        <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.4 }}>Ask what today's star exercise was.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {items.map((it) => {
            const picked = starRecalledId === it.id;
            const matched = picked && star && it.id === star.id;
            const missed = picked && star && it.id !== star.id;
            const borderColor = matched ? C.sage : missed ? "#B15353" : C.line;
            return (
              <button key={it.id} className="tw-focus" onClick={() => setStarRecalledId(it.id)}
                style={{ textAlign: "left", border: `1.5px solid ${borderColor}`,
                  background: C.surface, color: C.ink,
                  borderRadius: 12, padding: "11px 14px", fontSize: 14.5, fontWeight: 600 }}>
                {it.title}{matched ? "  ✓ matches" : missed ? "  ✗ doesn't match" : ""}
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
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>4. After-session state (optional)</div>
        <div style={{ display: "flex", gap: 10 }}>
          <RatingInput label="Tiredness" value={after.tired} onChange={(v) => setAfter({ ...after, tired: v })} />
          <RatingInput label="Mood" value={after.mood} onChange={(v) => setAfter({ ...after, mood: v })} />
          <RatingInput label="Satisfaction" value={after.satisfaction} onChange={(v) => setAfter({ ...after, satisfaction: v })} />
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 8 }}>5. Notes</div>
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
