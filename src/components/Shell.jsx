import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { C, TEST_PATIENT } from "../constants";

// Patient-context switcher shown at the top of every screen. Choosing "Test
// patient" routes all reads/writes to a separate patient so dry runs / demos
// flow to the Dashboard without touching the real person's data.
function PatientBar({ patient, setPatient, patients }) {
  const isTest = patient === TEST_PATIENT;
  const accent = isTest ? "#fff" : C.sage;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, paddingRight: 44 }}>
      <span className="tw-eyebrow" style={{ color: isTest ? "rgba(255,255,255,.85)" : C.inkSoft }}>Working on</span>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: accent,
          position: "absolute", left: 12, pointerEvents: "none" }} />
        <select className="tw-focus" value={patient} onChange={(e) => setPatient(e.target.value)}
          aria-label="Active patient"
          style={{ appearance: "none", WebkitAppearance: "none",
            border: `1px solid ${isTest ? "rgba(255,255,255,.5)" : C.line}`,
            background: isTest ? "rgba(255,255,255,.16)" : C.surface,
            color: isTest ? "#fff" : C.ink, borderRadius: 999, padding: "6px 30px 6px 26px",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
          {patients.map((p) => <option key={p} value={p} style={{ color: C.ink }}>{p}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, pointerEvents: "none",
          color: isTest ? "rgba(255,255,255,.85)" : C.inkSoft, fontSize: 10 }}>▼</span>
      </div>
    </div>
  );
}

// Sticky top zone: the switcher stays pinned while scrolling. In test mode the
// whole strip turns solid clay with a "TEST MODE" flag so the dry-run context is
// impossible to lose track of, no matter how far down the page you are.
function StickyBar({ patient, setPatient, patients }) {
  const isTest = patient === TEST_PATIENT;
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 15,
      margin: "-22px -18px 18px", padding: "12px 18px",
      background: isTest ? C.clay : C.paper,
      borderBottom: isTest ? `1px solid ${C.clayDeep}` : `1px solid transparent`,
      boxShadow: isTest ? "0 6px 16px -10px rgba(0,0,0,.4)" : "none" }}>
      <PatientBar patient={patient} setPatient={setPatient} patients={patients} />
      {isTest && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9,
          color: "#fff", fontSize: 12.5, fontWeight: 600 }}>
          <span style={{ background: "#fff", color: C.clayDeep, borderRadius: 6,
            padding: "2px 7px", fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}>TEST MODE</span>
          <span style={{ opacity: .92 }}>Dry run — saved separately, never affects Akki's real data.</span>
        </div>
      )}
    </div>
  );
}

export function Shell({ children, center, patient, setPatient, patients }) {
  const showSwitcher = setPatient && patients?.length;
  const isTest = showSwitcher && patient === TEST_PATIENT;
  return (
    <div style={{ minHeight: "100%", background: C.paper, color: C.ink,
      fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      display: center ? "flex" : "block", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .tw-serif { font-family: 'Fraunces', Georgia, serif; }
        .tw-eyebrow { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600; }
        button { font-family: inherit; cursor: pointer; }
        .tw-focus:focus-visible { outline: 3px solid ${C.sage}; outline-offset: 2px; }
        .tw-lift { transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
        .tw-lift:hover { transform: translateY(-1px); }
        input, textarea, select { font-family: inherit; }
        @keyframes tw-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .tw-rise { animation: tw-rise .32s ease both; }
        @media (prefers-reduced-motion: reduce) { .tw-rise, .tw-lift { animation: none !important; transition: none !important; } }
        @media (max-width: 600px) { input, textarea, select { font-size: 16px; } }
      `}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 18px 40px", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, right: 18, zIndex: 20 }}>
          <UserButton afterSignOutUrl="/" />
        </div>
        {showSwitcher && <StickyBar patient={patient} setPatient={setPatient} patients={patients} />}
        {children}
      </div>
      {isTest && (
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: "none",
          border: `4px solid ${C.clay}`, borderRadius: 2 }} />
      )}
    </div>
  );
}

export function Mark() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <span style={{ width: 34, height: 34, borderRadius: 11, background: C.sage, display: "grid", placeItems: "center", boxShadow: `0 2px 0 ${C.sageDeep}` }}>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15c4 0 4-6 8-6s4 6 8 6"/><path d="M4 9c4 0 4 6 8 6"/></svg>
      </span>
      <span className="tw-serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.01em" }}>Turnwell</span>
    </div>
  );
}
