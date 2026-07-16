import React, { useState } from "react";
import { C, READING_RATINGS } from "../constants";
import { SectionLabel } from "./shared";
import { RSVPReader } from "./reading/RSVPReader";

const CUE_LABELS = ["Sentence starter", "Fill-in the blank", "Re-read the line"];

export function ReadingStage({ passage, index, total, onFinishPassage, onEndEarly }) {
  const [phase, setPhase] = useState("reading"); // reading | questions
  const [qIndex, setQIndex] = useState(0);
  const [cue, setCue] = useState(0);
  const [rereadOpen, setRereadOpen] = useState(false);
  const [results, setResults] = useState([]);

  const question = passage.questions[qIndex];
  const hasCues = question.cues && question.cues.length > 0;

  const askQuestions = () => setPhase("questions");

  const offerCue = () => {
    const next = cue + 1;
    setCue(next);
    if (next >= 3) setRereadOpen(true);
  };

  const record = (ratingKey) => {
    const entry = { passageId: passage.id, passageText: passage.text, level: passage.level, question: question.q, cueUsed: cue, rating: ratingKey };
    const next = [...results, entry];
    if (qIndex + 1 >= passage.questions.length) {
      onFinishPassage(next);
    } else {
      setResults(next);
      setQIndex(qIndex + 1);
      setCue(0);
      setRereadOpen(false);
    }
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

      <SectionLabel>
        Passage {index + 1} of {total}{passage.level ? ` · level ${passage.level}` : ""}
        {phase === "questions" ? ` · question ${qIndex + 1} of ${passage.questions.length}` : ""}
      </SectionLabel>

      {phase === "reading" ? (
        <>
          <RSVPReader text={passage.text} />
          <button className="tw-focus tw-lift" onClick={askQuestions}
            style={{ width: "100%", background: C.sage, color: "#fff", border: "none", borderRadius: 16,
              padding: "17px", fontSize: 17, fontWeight: 700, boxShadow: `0 3px 0 ${C.sageDeep}` }}>
            Ask the question{passage.questions.length > 1 ? "s" : ""}
          </button>
        </>
      ) : (
        <>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "clamp(22px,5vw,36px)", minHeight: 130, display: "flex", alignItems: "center" }}>
            <p className="tw-serif" style={{ fontSize: "clamp(22px,4.6vw,30px)", lineHeight: 1.3, margin: 0, fontWeight: 500 }}>{question.q}</p>
          </div>

          {cue > 0 && hasCues && (
            <div className="tw-rise" key={cue} style={{ marginTop: 14, background: C.clayTint, borderRadius: 18, padding: "18px 20px", border: `1px solid ${C.clayDeep}22` }}>
              <div className="tw-eyebrow" style={{ color: C.clayDeep, marginBottom: 8, opacity: .85 }}>
                Hint {cue} · {CUE_LABELS[cue - 1]}
              </div>
              <p style={{ fontSize: "clamp(17px,3.6vw,23px)", lineHeight: 1.35, margin: 0, color: C.ink, fontWeight: 500 }}>{question.cues[cue - 1]}</p>
            </div>
          )}

          {rereadOpen && (
            <div className="tw-rise" style={{ marginTop: 12, borderRadius: 14, padding: "13px 16px", background: "#fff", border: `1px dashed ${C.sage}` }}>
              <span style={{ fontSize: 12, color: C.sage, fontWeight: 700 }}>Passage: </span>
              <span style={{ fontSize: 14.5, color: C.ink }}>{passage.text}</span>
            </div>
          )}

          <div style={{ marginTop: 26, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {hasCues ? (
                <button className="tw-focus tw-lift" disabled={cue >= 3} onClick={offerCue}
                  style={{ flex: "1 1 200px", background: cue >= 3 ? C.line : C.clayTint, color: cue >= 3 ? C.stone : C.clayDeep,
                    border: `1.5px solid ${cue >= 3 ? C.line : C.clay}`, borderRadius: 13, padding: "13px 16px", fontSize: 15, fontWeight: 700 }}>
                  {cue === 0 ? "Offer a hint" : cue >= 3 ? "All cues given" : `Next hint · ${CUE_LABELS[cue]}`}
                </button>
              ) : (
                <button className="tw-focus" onClick={() => setRereadOpen(!rereadOpen)}
                  style={{ flex: "1 1 200px", background: C.surface, color: C.sage, border: `1.5px solid ${C.line}`,
                    borderRadius: 13, padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>
                  {rereadOpen ? "Hide passage" : "No scripted cue — show passage"}
                </button>
              )}
            </div>

            <div style={{ fontSize: 13, color: C.inkSoft, marginBottom: 10, fontWeight: 600 }}>How did the answer go?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
              {READING_RATINGS.map((r) => (
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
