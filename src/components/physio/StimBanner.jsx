import React, { useState } from "react";
import {
  C, STIM_MONTAGES, montageLabel, STIM_CURRENT_MIN, STIM_CURRENT_MAX,
  STIM_CHANGE_REASONS, SKIN_CHECK, skinCheckAlerts,
} from "../../constants";

/* xStep running banner (handoff §4.5) — a persistent surface pinned to the top
   of the whole session, in every phase. Montage is set once at setup; current
   is expected to move throughout, so both are edited here but the banner is the
   ONLY place stimulation is ever changed. Every adjustment writes an event; the
   live montage/current/state are also stamped onto each exercise on completion.

   `phase` and `exerciseId` are threaded in so each event records what was
   running when it changed. */

const clampCurrent = (n) => Math.max(STIM_CURRENT_MIN, Math.min(STIM_CURRENT_MAX, n));

function MontagePicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {STIM_MONTAGES.map((m) => {
        const on = value === m.key;
        return (
          <button key={m.key} className="tw-focus" onClick={() => onChange(m.key)}
            style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 12,
              background: on ? C.indigoTint : C.surface, border: `1.5px solid ${on ? C.indigo : C.line}`,
              borderRadius: 12, padding: "11px 14px", width: "100%" }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: on ? C.indigoDeep : C.ink }}>{m.label}</span>
              <span style={{ display: "block", fontSize: 12, color: C.inkSoft, marginTop: 2 }}>Red {m.red} · Blue {m.blue}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SkinPicker({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: C.inkSoft, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {SKIN_CHECK.map((s) => {
          const on = value === s.key;
          const warn = s.alert;
          return (
            <button key={s.key} className="tw-focus" onClick={() => onChange(s.key)}
              style={{ border: `1.5px solid ${on ? (warn ? "#B15353" : C.clayDeep) : C.line}`,
                background: on ? (warn ? "#F6E7E7" : "#fff") : C.surface,
                color: on ? (warn ? "#8C3A3A" : C.clayDeep) : C.inkSoft,
                borderRadius: 10, padding: "8px 12px", fontSize: 12.5, fontWeight: 700 }}>
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stepper({ value, onChange }) {
  const btn = { width: 42, height: 42, borderRadius: 11, border: `1.5px solid ${C.indigo}`, background: "#fff",
    color: C.indigoDeep, fontSize: 18, fontWeight: 800, lineHeight: 1 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button className="tw-focus" style={btn} onClick={() => onChange(clampCurrent(value - 5))}>−5</button>
      <button className="tw-focus" style={btn} onClick={() => onChange(clampCurrent(value - 1))}>−</button>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div className="tw-serif" style={{ fontSize: 34, fontWeight: 700, color: C.indigoDeep, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: C.stone, marginTop: 2 }}>current</div>
      </div>
      <button className="tw-focus" style={btn} onClick={() => onChange(clampCurrent(value + 1))}>+</button>
      <button className="tw-focus" style={btn} onClick={() => onChange(clampCurrent(value + 5))}>+5</button>
    </div>
  );
}

export function StimBanner({ stim, setStim, phase, exerciseId }) {
  const [sheet, setSheet] = useState(null); // null | 'setup' | 'adjust'
  // Draft values edited inside a sheet before committing.
  const [dMontage, setDMontage] = useState(stim.montage || "full_body");
  const [dCurrent, setDCurrent] = useState(stim.current);
  const [dRationale, setDRationale] = useState(stim.montage_rationale || "");
  const [dSkinPre, setDSkinPre] = useState(stim.skin_check_electrode_sites_pre);
  const [dReason, setDReason] = useState(null);

  const openSetup = () => {
    setDMontage(stim.montage || "full_body");
    setDCurrent(stim.current);
    setDRationale(stim.montage_rationale || "");
    setDSkinPre(stim.skin_check_electrode_sites_pre);
    setSheet("setup");
  };
  const openAdjust = () => {
    setDMontage(stim.montage);
    setDCurrent(stim.current);
    setDReason(null);
    setSheet("adjust");
  };
  const close = () => setSheet(null);

  const pushEvent = (next, extra = {}) => ({
    at: Date.now(), phase, exercise_id: exerciseId || null,
    montage: next.montage, current: next.current, state: next.state, ...extra,
  });

  // Start xStep — first event, montage locked in as montage_initial.
  const start = () => {
    const next = {
      ...stim, used: true, montage_initial: dMontage, montage: dMontage,
      montage_rationale: dRationale.trim(), current: dCurrent, state: "on",
      started_at_phase: phase, skin_check_electrode_sites_pre: dSkinPre,
    };
    next.events = [...stim.events, pushEvent(next, { reason: "start" })];
    setStim(next);
    close();
  };

  // Commit an adjustment (montage / current / reason). State unchanged here.
  const commitAdjust = () => {
    const next = { ...stim, montage: dMontage, current: dCurrent };
    next.events = [...stim.events, pushEvent(next, dReason ? { reason: dReason } : {})];
    setStim(next);
    close();
  };

  // On/off toggle — its own event, so the current curve shows the gap.
  const toggle = () => {
    const nextState = stim.state === "on" ? "off" : "on";
    const next = { ...stim, state: nextState, stopped_at_phase: nextState === "off" ? phase : stim.stopped_at_phase };
    next.events = [...stim.events, pushEvent(next, { reason: nextState === "off" ? "paused" : "resumed" })];
    setStim(next);
  };

  const setPostSkin = (key) => setStim({ ...stim, skin_check_electrode_sites_post: key });

  const on = stim.used && stim.state === "on";
  const preAlert = skinCheckAlerts(stim.skin_check_electrode_sites_pre);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, marginBottom: 14 }}>
      {!stim.used ? (
        <button className="tw-focus" onClick={openSetup}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: C.surface, border: `1.5px dashed ${C.indigo}`, borderRadius: 12, padding: "10px 14px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.indigoDeep }}>⚡ Start xStep</span>
          <span style={{ fontSize: 12, color: C.stone }}>transcutaneous spinal stim — tap to set up</span>
        </button>
      ) : (
        <button className="tw-focus" onClick={openAdjust}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
            background: on ? C.indigoDeep : C.stone, border: "none", borderRadius: 12, padding: "10px 14px", color: "#fff" }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: ".01em" }}>
            ⚡ xStep · {montageLabel(stim.montage)} · {stim.current} · {on ? "ON" : "OFF"}
          </span>
          <span style={{ fontSize: 12, opacity: .85 }}>tap to adjust</span>
        </button>
      )}

      {preAlert && (
        <div style={{ marginTop: 6, background: "#F6E7E7", border: `1.5px solid #B15353`, borderRadius: 10, padding: "8px 12px" }}>
          <span style={{ fontSize: 12, color: "#8C3A3A", fontWeight: 700 }}>⚠ Electrode-site skin flagged before start — check before continuing.</span>
        </div>
      )}

      {sheet && (
        <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(31,42,36,.45)", zIndex: 40,
          display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} className="tw-rise"
            style={{ width: "100%", maxWidth: 520, background: C.paper, borderRadius: "20px 20px 0 0",
              padding: "20px 20px 28px", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 className="tw-serif" style={{ fontSize: 22, margin: 0 }}>{sheet === "setup" ? "Set up xStep" : "Adjust xStep"}</h3>
              <button className="tw-focus" onClick={close} style={{ background: "none", border: "none", color: C.stone, fontSize: 22, lineHeight: 1 }}>×</button>
            </div>

            {sheet === "setup" ? (
              <>
                <p style={{ fontSize: 13, color: C.inkSoft, margin: "0 0 14px", lineHeight: 1.45 }}>
                  It amplifies descending drive, it doesn't contract muscle — deliver it <em>during</em> movement training, over the probe and sitting blocks. Montage is a deliberate, recorded choice tied to today's emphasis.
                </p>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Montage</div>
                <MontagePicker value={dMontage} onChange={setDMontage} />
                <textarea value={dRationale} onChange={(e) => setDRationale(e.target.value)} rows={2}
                  placeholder="Why this montage today? (optional)" className="tw-focus"
                  style={{ width: "100%", marginTop: 10, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 13.5, color: C.ink, resize: "vertical" }} />
                <div style={{ height: 16 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Starting current</div>
                <Stepper value={dCurrent} onChange={setDCurrent} />
                <div style={{ height: 16 }} />
                <SkinPicker label="Electrode-site skin check — before start" value={dSkinPre} onChange={setDSkinPre} />
                <button className="tw-focus tw-lift" onClick={start}
                  style={{ width: "100%", background: C.indigoDeep, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, marginTop: 6 }}>
                  Start · turn on
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Current</div>
                <Stepper value={dCurrent} onChange={setDCurrent} />
                <div style={{ height: 14 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Reason for change (optional)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {STIM_CHANGE_REASONS.map((r) => {
                    const sel = dReason === r.key;
                    return (
                      <button key={r.key} className="tw-focus" onClick={() => setDReason(sel ? null : r.key)}
                        style={{ border: `1.5px solid ${sel ? C.clayDeep : C.line}`, background: sel ? C.clayTint : C.surface,
                          color: sel ? C.clayDeep : C.inkSoft, borderRadius: 999, padding: "8px 13px", fontSize: 12.5, fontWeight: 700 }}>
                        {r.label}
                      </button>
                    );
                  })}
                </div>
                <div style={{ height: 16 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Montage <span style={{ color: C.stone, fontWeight: 500 }}>· rarely changes mid-session</span></div>
                <MontagePicker value={dMontage} onChange={setDMontage} />
                <div style={{ height: 16 }} />
                <button className="tw-focus tw-lift" onClick={commitAdjust}
                  style={{ width: "100%", background: C.indigoDeep, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 15.5, fontWeight: 700 }}>
                  Save change
                </button>
                <button className="tw-focus" onClick={() => { toggle(); }}
                  style={{ width: "100%", background: on ? "#F6E7E7" : C.sageTint, color: on ? "#8C3A3A" : C.sageDeep,
                    border: `1.5px solid ${on ? "#B15353" : C.sage}`, borderRadius: 14, padding: "13px", fontSize: 14.5, fontWeight: 700, marginTop: 10 }}>
                  {on ? "Turn OFF" : "Turn ON"}
                </button>
                <div style={{ height: 18 }} />
                <SkinPicker label="Electrode-site skin check — after (log at end)" value={stim.skin_check_electrode_sites_post} onChange={setPostSkin} />
                <p style={{ fontSize: 11.5, color: C.stone, margin: 0, lineHeight: 1.4 }}>
                  {stim.events.length} change{stim.events.length === 1 ? "" : "s"} logged this session.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
