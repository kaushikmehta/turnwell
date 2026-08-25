import React from "react";
import { C } from "../constants";
import { draftSummary } from "../draft";
import { Mark } from "./Shell";

function ResumeCard({ draft, onContinue, onDiscard }) {
  const s = draftSummary(draft);
  if (!s) return null;
  return (
    <div style={{ background: C.ink, color: "#fff", borderRadius: 18, padding: "18px 18px 16px", margin: "0 0 22px" }}>
      <div style={{ fontSize: 12.5, letterSpacing: .3, opacity: .7, fontWeight: 700, textTransform: "uppercase" }}>
        In-progress session
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, margin: "6px 0 2px" }}>{s.label}</div>
      <div style={{ fontSize: 13.5, opacity: .8 }}>
        {s.detail}{s.time ? ` · started ${s.time}` : ""}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
        <button className="tw-focus tw-lift" onClick={onContinue}
          style={{ background: "#fff", color: C.ink, border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 14, fontWeight: 700 }}>
          Continue
        </button>
        <button className="tw-focus" onClick={() => { if (confirm("Discard the in-progress session? This can't be undone.")) onDiscard(); }}
          style={{ background: "none", border: "none", color: "#fff", opacity: .7, fontSize: 13, fontWeight: 600 }}>
          Discard
        </button>
      </div>
    </div>
  );
}

function TileBtn({ onClick, title, sub, foot }) {
  return (
    <button className="tw-focus tw-lift" onClick={onClick}
      style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 16px 15px" }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.sage, fontWeight: 600, margin: "3px 0 8px" }}>{sub}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.35 }}>{foot}</div>
    </button>
  );
}

export function Home({ bank, physioBank, readingBank, sessions, domain, setDomain, go, draft, onContinue, onDiscardDraft }) {
  const approvedSpeech = bank.filter((b) => b.approved).length;

  return (
    <div className="tw-rise">
      <Mark />
      <p className="tw-serif" style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.15, margin: "26px 0 8px", maxWidth: 560 }}>
        Akki's practice space.
      </p>
      <p style={{ color: C.inkSoft, fontSize: 16, maxWidth: 540, margin: "0 0 26px" }}>
        Choose what to work on today.
      </p>

      {draft && <ResumeCard draft={draft} onContinue={onContinue} onDiscard={onDiscardDraft} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <button className="tw-focus tw-lift" onClick={() => { setDomain("speech"); go("setup"); }}
          style={{ textAlign: "left", background: C.sage, color: "#fff", border: "none",
            borderRadius: 18, padding: "20px 18px", boxShadow: `0 3px 0 ${C.sageDeep}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
          <span>
            <span style={{ fontSize: 20, fontWeight: 700, display: "block" }}>Speech</span>
            <span style={{ fontSize: 13, opacity: .85, display: "block", marginTop: 4 }}>Sentences, scenes, decks</span>
          </span>
          <span style={{ fontSize: 12.5, opacity: .7, marginTop: 12 }}>{approvedSpeech} ready</span>
        </button>

        <button className="tw-focus tw-lift" onClick={() => { setDomain("physio"); go("setup"); }}
          style={{ textAlign: "left", background: C.clay, color: "#fff", border: "none",
            borderRadius: 18, padding: "20px 18px", boxShadow: `0 3px 0 ${C.clayDeep}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
          <span>
            <span style={{ fontSize: 20, fontWeight: 700, display: "block" }}>Physio / OT</span>
            <span style={{ fontSize: 13, opacity: .85, display: "block", marginTop: 4 }}>Live session, facilitator-run</span>
          </span>
          <span style={{ fontSize: 12.5, opacity: .7, marginTop: 12 }}>{physioBank.length} drills seeded</span>
        </button>

        <button className="tw-focus tw-lift" onClick={() => { setDomain("reading"); go("setup"); }}
          style={{ textAlign: "left", background: C.indigo, color: "#fff", border: "none",
            borderRadius: 18, padding: "20px 18px", boxShadow: `0 3px 0 ${C.indigoDeep}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
          <span>
            <span style={{ fontSize: 20, fontWeight: 700, display: "block" }}>Reading</span>
            <span style={{ fontSize: 13, opacity: .85, display: "block", marginTop: 4 }}>Passages + comprehension</span>
          </span>
          <span style={{ fontSize: 12.5, opacity: .7, marginTop: 12 }}>{readingBank.length} passages seeded</span>
        </button>
      </div>

      {domain === "speech" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <TileBtn
            onClick={() => go("library")}
            title="Practice library"
            sub={`${bank.length} prompts · ${approvedSpeech} approved`}
            foot="Edit content, cues, and levels" />
          <TileBtn
            onClick={() => go("progress")}
            title="This run"
            sub={sessions.length ? `${sessions.length} session${sessions.length > 1 ? "s" : ""}` : "No sessions yet"}
            foot="Sessions from this sitting — send each to the therapist to keep it" />
        </div>
      )}

      {domain === "physio" && (
        <div style={{ marginTop: 12 }}>
          <TileBtn
            onClick={() => go("assessment")}
            title="Record an assessment"
            sub="Clinical & periodic instruments"
            foot="SATCo, Tardieu, goniometry, cough flow, TIS, GAS… — recorded, never administered" />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <TileBtn
          onClick={() => go("dashboard")}
          title="Dashboard"
          sub="Insights over time"
          foot="Trends & per-session detail across physio, speech, and reading" />
      </div>
    </div>
  );
}
