import React, { useState } from "react";
import { C, RATINGS, DECK_RUNGS } from "../constants";
import { isDeck } from "../utils";
import { Ico } from "./shared";

export function DeckStage({ run, setRun, finish, quit }) {
  const item = run.items[run.i];
  const [cardIdx, setCardIdx] = useState(0);
  const [rungIdx, setRungIdx] = useState(0);
  const [peek, setPeek] = useState(false);
  const [starter, setStarter] = useState(false);
  const [broken, setBroken] = useState(false);
  const [cheer, setCheer] = useState(null);

  const card = item.cards[cardIdx];
  const labels = item.rung_labels || DECK_RUNGS;
  const every = item.encouragement_every || 0;
  const rungOrder = [labels.name, labels.two_words, card.fill_blank, labels.describe];
  const rungTag = ["Name it", "Two words", "Fill the blank", "Describe"][rungIdx];
  const firstDeckI = run.items.findIndex(isDeck);
  const isFirstDeckCard = run.i === firstDeckI && cardIdx === 0;
  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const starterText = (card.model_example || "").split(" ").slice(0, 4).join(" ");

  const rateCard = (ratingKey) => {
    const results = [...run.results, { itemId: item.id, kind: "deck", prompt: `${card.theme} — ${card.fill_blank}`, rating: ratingKey, cueUsed: 0, step: cardIdx }];
    const lastCard = cardIdx + 1 >= item.cards.length;
    const lastItem = run.i + 1 >= run.items.length;
    if (lastCard && lastItem) { finish({ items: run.items, results, notes: run.notes }); return; }
    const cheerDue = every > 0 && (cardIdx + 1) % every === 0 && !lastCard;
    if (cheerDue) { setRun({ ...run, results }); setCheer(item.encouragement?.[Math.floor(Math.random() * item.encouragement.length)] || "Keep going."); scrollTop(); return; }
    if (!lastCard) { setRun({ ...run, results }); nextCard(); }
    else { setRun({ ...run, results, i: run.i + 1 }); }
  };
  const nextCard = () => { setCardIdx(cardIdx + 1); setRungIdx(0); setPeek(false); setStarter(false); setBroken(false); scrollTop(); };
  const skip = () => {
    const lastItem = run.i + 1 >= run.items.length;
    if (lastItem) { finish({ items: run.items, results: run.results, notes: run.notes || "" }); return; }
    setRun({ ...run, i: run.i + 1 });
  };

  if (cheer) {
    return (
      <div className="tw-rise" style={{ textAlign: "center", padding: "40px 12px" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
        <p className="tw-serif" style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.25, margin: "0 auto 26px", maxWidth: 460, fontWeight: 500 }}>{cheer}</p>
        <button className="tw-focus tw-lift" onClick={nextCard}
          style={{ background: C.sage, color: "#fff", border: "none", borderRadius: 14, padding: "15px 30px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
          Keep going
        </button>
      </div>
    );
  }

  return (
    <div>
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

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <span className="tw-eyebrow" style={{ color: C.clay }}>Picture deck</span>
        <span style={{ color: C.line }}>·</span>
        <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>Card {cardIdx + 1} of {item.cards.length}</span>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.line}`, background: C.sageTint, aspectRatio: "10 / 7", marginBottom: 16 }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: C.inkSoft, fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{card.theme}</div>
        {!broken && <img src={card.image_url} alt="" onError={() => setBroken(true)}
          style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
        {[0, 1, 2, 3].map((r) => (
          <span key={r} style={{ height: 4, flex: 1, borderRadius: 2, background: r < rungIdx ? C.sage : r === rungIdx ? C.sageDeep : C.line }} />
        ))}
      </div>

      <div style={{ marginBottom: 6 }}><span className="tw-eyebrow" style={{ color: C.sage }}>Rung {rungIdx + 1} · {rungTag}</span></div>
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: "clamp(20px,4.5vw,32px)", minHeight: 120, display: "flex", alignItems: "center" }}>
        <p className="tw-serif" style={{ fontSize: "clamp(22px,5vw,34px)", lineHeight: 1.25, margin: 0, fontWeight: 500 }}>{rungOrder[rungIdx]}</p>
      </div>

      {isFirstDeckCard && rungIdx === 3 && (
        <div className="tw-rise" style={{ marginTop: 14, background: C.sageTint, borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.sage}33` }}>
          <div className="tw-eyebrow" style={{ color: C.sageDeep, marginBottom: 7 }}>An example to aim for</div>
          <p style={{ fontSize: "clamp(16px,3.6vw,19px)", lineHeight: 1.4, margin: 0, color: C.ink }}>{card.model_example}</p>
        </div>
      )}
      {starter && !(isFirstDeckCard && rungIdx === 3) && (
        <div className="tw-rise" style={{ marginTop: 12, background: C.clayTint, borderRadius: 14, padding: "13px 16px" }}>
          <span style={{ fontSize: 12, color: C.clayDeep, fontWeight: 700 }}>Starter: </span>
          <span style={{ fontSize: 16, color: C.ink }}>{starterText}…</span>
        </div>
      )}
      {peek && (
        <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "12px 15px", background: "#fff", border: `1px dashed ${C.stone}` }}>
          <span style={{ fontSize: 12, color: C.stone, fontWeight: 600 }}>Model answer (facilitator): </span>
          <span style={{ fontSize: 15, color: C.ink }}>{card.model_example}</span>
        </div>
      )}

      <div style={{ marginTop: 24, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
        <span className="tw-eyebrow" style={{ color: C.stone }}>For the facilitator</span>
        <div style={{ display: "flex", gap: 10, margin: "12px 0 16px", flexWrap: "wrap" }}>
          <button className="tw-focus tw-lift" disabled={rungIdx >= 3} onClick={() => { setRungIdx(rungIdx + 1); setStarter(false); }}
            style={{ flex: "1 1 180px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: rungIdx >= 3 ? C.line : C.sage, color: rungIdx >= 3 ? C.stone : "#fff",
              border: "none", borderRadius: 13, padding: "13px 16px", fontSize: 15, fontWeight: 700, boxShadow: rungIdx >= 3 ? "none" : `0 3px 0 ${C.sageDeep}` }}>
            {rungIdx >= 3 ? "Top of the ladder" : `Next rung · ${["Two words", "Fill the blank", "Describe"][rungIdx]}`}
          </button>
          {rungIdx === 3 && card.model_example && (
            <button className="tw-focus" onClick={() => setStarter(!starter)}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.clayDeep, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
              {Ico.hand}{starter ? "Hide starter" : "Offer a starter"}
            </button>
          )}
          <button className="tw-focus" onClick={() => setPeek(!peek)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.inkSoft, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
            {Ico.eye}{peek ? "Hide answer" : "Peek at answer"}
          </button>
          <button className="tw-focus" onClick={skip}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.surface, color: C.stone, border: `1.5px solid ${C.line}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
            Skip deck
          </button>
        </div>

        <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, fontWeight: 600 }}>How far did they get on this card?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
          {RATINGS.map((r) => (
            <button key={r.key} className="tw-focus tw-lift" onClick={() => rateCard(r.key)}
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
    </div>
  );
}
