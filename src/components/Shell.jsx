import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { C, TEST_PATIENT } from "../constants";

// Patient-context switcher shown at the top of every screen. Choosing "Test
// patient" routes all reads/writes to a separate patient so dry runs / demos
// flow to the Dashboard without touching the real person's data.
function PatientBar({ patient, setPatient, patients }) {
  const isTest = patient === TEST_PATIENT;
  const accent = isTest ? C.clay : C.sage;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14, paddingRight: 44 }}>
      <span className="tw-eyebrow" style={{ color: C.inkSoft }}>Working on</span>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: accent,
          position: "absolute", left: 12, pointerEvents: "none" }} />
        <select className="tw-focus" value={patient} onChange={(e) => setPatient(e.target.value)}
          aria-label="Active patient"
          style={{ appearance: "none", WebkitAppearance: "none",
            border: `1px solid ${isTest ? C.clay : C.line}`, background: isTest ? C.clayTint : C.surface,
            color: C.ink, borderRadius: 999, padding: "6px 30px 6px 26px",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
          {patients.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, pointerEvents: "none", color: C.inkSoft, fontSize: 10 }}>▼</span>
      </div>
    </div>
  );
}

function TestBanner() {
  return (
    <div style={{ background: C.clayTint, border: `1px solid ${C.clay}`, borderRadius: 12,
      padding: "9px 14px", margin: "0 0 18px", fontSize: 13, fontWeight: 600, color: C.clayDeep }}>
      Test patient · dry run — sessions are saved separately and never affect Akki's real data.
    </div>
  );
}

export function Shell({ children, center, patient, setPatient, patients }) {
  const showSwitcher = setPatient && patients?.length;
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
        {showSwitcher && <PatientBar patient={patient} setPatient={setPatient} patients={patients} />}
        {showSwitcher && patient === TEST_PATIENT && <TestBanner />}
        {children}
      </div>
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
