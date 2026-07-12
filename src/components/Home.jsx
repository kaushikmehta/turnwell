import React from "react";
import { C } from "../constants";
import { Mark } from "./Shell";

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

export function Home({ bank, physioBank, sessions, domain, setDomain, go }) {
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
    </div>
  );
}
