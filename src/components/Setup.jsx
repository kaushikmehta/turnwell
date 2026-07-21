import React, { useState } from "react";
import { C, AREAS } from "../constants";
import { isDeck, isScene, shuffle } from "../utils";
import { BackBtn, SectionLabel, Ico } from "./shared";

export function Setup({ bank, start, back }) {
  const [picked, setPicked] = useState(new Set(AREAS));
  const [level, setLevel] = useState(0);
  const [ptype, setPtype] = useState("all");
  const [onlyApproved, setOnlyApproved] = useState(true);

  const allDecks = bank.filter(isDeck);
  const deckLabel = (d) => [...new Set(d.cards.map((c) => c.theme))].join(", ");
  const [deckIds, setDeckIds] = useState(() => new Set(allDecks.map((d) => d.id)));
  const toggleDeck = (id) => { const n = new Set(deckIds); n.has(id) ? n.delete(id) : n.add(id); setDeckIds(n); };

  const toggle = (a) => { const n = new Set(picked); n.has(a) ? n.delete(a) : n.add(a); setPicked(n); };
  const typeOf = (b) => (isDeck(b) ? "decks" : isScene(b) ? "scenes" : "lines");
  const pool = bank.filter((b) =>
    picked.has(b.area) &&
    (level === 0 || b.level === level) &&
    (!onlyApproved || b.approved) &&
    (ptype === "all" || typeOf(b) === ptype) &&
    (!isDeck(b) || deckIds.has(b.id)));

  const nDecks = pool.filter(isDeck).length;
  const nScenes = pool.filter(isScene).length;
  const nLines = pool.length - nScenes - nDecks;
  const begin = () => { const items = shuffle(pool); start(items); };

  return (
    <div className="tw-rise">
      <BackBtn onClick={back} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Set up the session</h2>
      <p style={{ color: C.inkSoft, margin: "0 0 20px", fontSize: 15 }}>Choose what to work on today.</p>

      <SectionLabel>Practice type</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {[["all", "All"], ["lines", "Sentences"], ["scenes", "Scenes"], ["decks", "Picture decks"]].map(([v, l]) => (
          <button key={v} className="tw-focus" onClick={() => setPtype(v)}
            style={{ flex: "1 1 auto", border: `1.5px solid ${ptype === v ? C.sage : C.line}`, background: ptype === v ? C.sageTint : C.surface,
              color: ptype === v ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px 12px", fontSize: 13.5, fontWeight: 600 }}>
            {l}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: C.stone, margin: "0 0 22px" }}>
        Scenes hold a setting in mind across linked answers. Picture decks walk one image up four rungs — from one word to a full description.
      </p>

      <SectionLabel>Focus areas</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 22 }}>
        {AREAS.map((a) => {
          const on = picked.has(a);
          const n = bank.filter((b) => b.area === a).length;
          return (
            <button key={a} className="tw-focus" onClick={() => toggle(a)}
              style={{ border: `1.5px solid ${on ? C.sage : C.line}`, background: on ? C.sageTint : C.surface,
                color: on ? C.sageDeep : C.inkSoft, borderRadius: 999, padding: "9px 15px", fontSize: 14, fontWeight: 600,
                display: "inline-flex", alignItems: "center", gap: 7 }}>
              {on && <span style={{ color: C.sage }}>{Ico.check}</span>}{a} <span style={{ opacity: .55, fontWeight: 500 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {(ptype === "all" || ptype === "decks") && allDecks.length > 0 && (
        <>
          <SectionLabel>Picture deck themes</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 22 }}>
            {allDecks.map((d) => {
              const on = deckIds.has(d.id);
              return (
                <button key={d.id} className="tw-focus" onClick={() => toggleDeck(d.id)}
                  style={{ border: `1.5px solid ${on ? C.clay : C.line}`, background: on ? C.clayTint : C.surface,
                    color: on ? C.clayDeep : C.inkSoft, borderRadius: 999, padding: "9px 15px", fontSize: 14, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", gap: 7, textTransform: "capitalize" }}>
                  {on && <span style={{ color: C.clay }}>{Ico.check}</span>}{deckLabel(d)} <span style={{ opacity: .55, fontWeight: 500 }}>{d.cards.length}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <SectionLabel>Sentence length</SectionLabel>
      <div style={{ display: "flex", gap: 9, marginBottom: 22 }}>
        {[[0, "Any"], [1, "Short"], [2, "Medium"], [3, "Longer"]].map(([v, l]) => (
          <button key={v} className="tw-focus" onClick={() => setLevel(v)}
            style={{ flex: 1, border: `1.5px solid ${level === v ? C.sage : C.line}`, background: level === v ? C.sageTint : C.surface,
              color: level === v ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px 4px", fontSize: 14, fontWeight: 600 }}>
            {l}
          </button>
        ))}
      </div>

      <label className="tw-focus" style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", marginBottom: 22,
        background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 15px" }}>
        <input type="checkbox" checked={onlyApproved} onChange={(e) => setOnlyApproved(e.target.checked)} style={{ width: 18, height: 18, accentColor: C.sage }} />
        <span style={{ fontSize: 14.5 }}>Only use content the therapist has approved</span>
      </label>

      <button className="tw-focus tw-lift" disabled={pool.length === 0} onClick={begin}
        style={{ width: "100%", background: pool.length ? C.sage : C.line, color: pool.length ? "#fff" : C.inkSoft,
          border: "none", borderRadius: 16, padding: "17px", fontSize: 17, fontWeight: 700,
          boxShadow: pool.length ? `0 3px 0 ${C.sageDeep}` : "none" }}>
        {pool.length ? "Begin session" : "No items match — widen the selection"}
      </button>
      {pool.length > 0 && (
        <p style={{ textAlign: "center", fontSize: 12.5, color: C.stone, marginTop: 10 }}>
          {[nLines ? `${nLines} sentence${nLines > 1 ? "s" : ""}` : "", nScenes ? `${nScenes} scene${nScenes > 1 ? "s" : ""}` : "", nDecks ? `${nDecks} deck${nDecks > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}
