import React from "react";
import { C } from "../constants";

/* ---- tiny inline icons ---- */
export const Ico = {
  hand: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  next: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  back: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  check: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  eye: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  plus: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
};

export function BackBtn({ onClick, label = "Home" }) {
  return (
    <button className="tw-focus" onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: C.inkSoft, fontSize: 14, fontWeight: 600, padding: "6px 2px" }}>
      {Ico.back} {label}
    </button>
  );
}

export function SectionLabel({ children }) {
  return <div className="tw-eyebrow" style={{ color: C.stone, marginBottom: 11 }}>{children}</div>;
}

export function Pill({ children, tone }) {
  const c = tone === "clay" ? { bg: C.clayTint, fg: C.clayDeep } : { bg: C.paper, fg: C.inkSoft };
  return <span style={{ fontSize: 11.5, fontWeight: 600, background: c.bg, color: c.fg, borderRadius: 999, padding: "3px 10px" }}>{children}</span>;
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

export const inputStyle = {
  width: "100%", background: C.surface, border: `1px solid ${C.line}`,
  borderRadius: 12, padding: "12px 14px", fontSize: 14.5, color: C.ink, marginBottom: 0, resize: "vertical",
};

export function Empty({ title, body }) {
  return (
    <div style={{ background: C.surface, border: `1px dashed ${C.line}`, borderRadius: 18, padding: "34px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 14, color: C.inkSoft, maxWidth: 380, margin: "0 auto", lineHeight: 1.45 }}>{body}</p>
    </div>
  );
}
