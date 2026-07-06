import React from "react";
import { C } from "../constants";

export function Shell({ children, center }) {
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
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "22px 18px 40px" }}>{children}</div>
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
