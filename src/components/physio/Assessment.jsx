import React, { useState } from "react";
import {
  C, ASSESSMENT_TYPES, SATCO_LEVELS, SATCO_CONTROLS, SATCO_CELLS, satcoLevel,
  TARDIEU_MUSCLES, TARDIEU_QUALITY, GONIOMETRY_MOTIONS, BODY_SIDES,
  coughFlowBand, TIS_SUBSCALES, GAS_LEVELS, FSS_ITEMS, COGNITIVE_INSTRUMENTS,
  RATING_RATERS, BASELINE_RATERS, PERFORMANCE_TIMEPOINTS, PERFORMANCE_DIMENSIONS,
  PARADIGM_STAGES, PARADIGM_DIMENSIONS, unitLabel,
} from "../../constants";
import { BackBtn, SectionLabel } from "../shared";
import { summarizeAssessment } from "./assessmentSummary";
import { ASSESSMENT_FACILITATION } from "./facilitation";

/* Assessment recording (handoff §5). The app records scores administered by
   the clinician — it never presents test items. One picker, then a per-type
   recording form; saved as a physio session with payload.kind = 'assessment'. */

const inp = { width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", fontSize: 15, color: C.ink };
const numSm = { width: 78, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 10px", fontSize: 15, color: C.ink };

function SaveBar({ label, disabled, onClick }) {
  return (
    <button className="tw-focus tw-lift" disabled={disabled} onClick={onClick}
      style={{ width: "100%", background: disabled ? C.line : C.clay, color: disabled ? C.inkSoft : "#fff",
        border: "none", borderRadius: 16, padding: "16px", fontSize: 16.5, fontWeight: 700, marginTop: 8,
        boxShadow: disabled ? "none" : `0 3px 0 ${C.clayDeep}` }}>
      {label}
    </button>
  );
}

function Card({ children }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>{children}</div>;
}

/* Collapsible "how to run this" — the setup half of the facilitation aid. */
function HowToRun({ facil }) {
  const [open, setOpen] = useState(false);
  if (!facil || !facil.setup) return null;
  return (
    <div style={{ background: C.sageTint, border: `1px solid ${C.sage}44`, borderRadius: 16, marginBottom: 14, overflow: "hidden" }}>
      <button type="button" className="tw-focus" onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "13px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, cursor: "pointer" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.sageDeep }}>How to run this — setup</span>
        <span style={{ fontSize: 12, color: C.sageDeep, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 15px" }}>
          {facil.aim && <p style={{ fontSize: 12.5, color: C.ink, margin: "0 0 12px", lineHeight: 1.5 }}>{facil.aim}</p>}
          <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {facil.setup.map((s, i) => <li key={i} style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5 }}>{s}</li>)}
          </ol>
          <p style={{ fontSize: 11, color: C.stone, margin: "12px 0 0", lineHeight: 1.4, fontStyle: "italic" }}>
            Clinical draft — review against your own protocol before relying on it.
          </p>
        </div>
      )}
    </div>
  );
}

/* Inline "how to capture" hint — the reading half, sits under a field label. */
function InfoHint({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <div style={{ margin: "3px 0 9px" }}>
      <button type="button" className="tw-focus" onClick={() => setOpen((o) => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0,
          color: open ? C.clayDeep : C.stone, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
        <span style={{ width: 15, height: 15, borderRadius: 8, border: "1.5px solid currentColor", fontSize: 10,
          lineHeight: "12px", textAlign: "center", fontStyle: "italic", fontWeight: 800 }}>i</span>
        {open ? "Hide" : "How to capture this reading"}
      </button>
      {open && (
        <p style={{ fontSize: 12.5, color: C.ink, margin: "7px 0 0", lineHeight: 1.5,
          background: C.clayTint, border: `1px solid ${C.clay}44`, borderRadius: 10, padding: "10px 12px" }}>{text}</p>
      )}
    </div>
  );
}

/* ---- SATCo ---- */
function SATCoForm({ onSave, facil }) {
  const [grid, setGrid] = useState(() => Object.fromEntries(SATCO_LEVELS.map((l) => [l.level, { static: "NT", active: "NT", reactive: "NT" }])));
  const cycle = (level, control) => {
    const cur = grid[level][control];
    const next = SATCO_CELLS[(SATCO_CELLS.indexOf(cur) + 1) % SATCO_CELLS.length];
    setGrid((g) => ({ ...g, [level]: { ...g[level], [control]: next } }));
  };
  const levels = {
    static_level: satcoLevel(grid, "static"),
    active_level: satcoLevel(grid, "active"),
    reactive_level: satcoLevel(grid, "reactive"),
  };
  const cellColor = (v) => v === "P" ? { bg: C.sage, fg: "#fff" } : v === "A" ? { bg: "#F6E7E7", fg: "#8C3A3A" } : { bg: C.surface, fg: C.stone };
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>
          Tap each cell to cycle <strong>NT → P → A</strong>. Static = held 5s neutral · Active = maintained through head-turn/reach · Reactive = regained after a nudge.
        </p>
        <InfoHint text={facil?.capture?.grid} />
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 6, alignItems: "center" }}>
          <div />
          {SATCO_CONTROLS.map((c) => <div key={c.key} style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textAlign: "center" }}>{c.label}</div>)}
          {SATCO_LEVELS.map((l) => (
            <React.Fragment key={l.level}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{l.level}. {l.label}</div>
              {SATCO_CONTROLS.map((c) => {
                const v = grid[l.level][c.key];
                const col = cellColor(v);
                return (
                  <button key={c.key} className="tw-focus" onClick={() => cycle(l.level, c.key)}
                    style={{ background: col.bg, color: col.fg, border: `1.5px solid ${v === "NT" ? C.line : "transparent"}`,
                      borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 800 }}>
                    {v}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Derived control levels</div>
        <div style={{ display: "flex", gap: 18 }}>
          {SATCO_CONTROLS.map((c) => (
            <div key={c.key}>
              <div style={{ fontSize: 11, color: C.stone, fontWeight: 600 }}>{c.label}</div>
              <div className="tw-serif" style={{ fontSize: 26, fontWeight: 700, color: C.sageDeep }}>{levels[`${c.key}_level`]}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: C.stone, margin: "8px 0 0", lineHeight: 1.4 }}>Highest level with control present (8 = full trunk control). Reactive is expected to lag.</p>
      </Card>
      <SaveBar label="Save SATCo" onClick={() => onSave({ satco: { grid, ...levels } })} />
    </>
  );
}

/* ---- Modified Tardieu ---- */
function TardieuForm({ onSave, facil }) {
  const [rows, setRows] = useState([]);
  const [muscle, setMuscle] = useState(TARDIEU_MUSCLES[0].key);
  const [side, setSide] = useState("left");
  const [r1, setR1] = useState("");
  const [r2, setR2] = useState("");
  const [quality, setQuality] = useState(null);
  const canAdd = r1 !== "" && r2 !== "" && quality != null;
  const add = () => {
    setRows((rs) => [...rs, {
      muscle_group: muscle, side, r1_degrees: Number(r1), r2_degrees: Number(r2),
      quality_grade: quality, r2_minus_r1: Number(r2) - Number(r1),
    }]);
    setR1(""); setR2(""); setQuality(null);
  };
  return (
    <>
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Add a muscle group</div>
        <select value={muscle} onChange={(e) => setMuscle(e.target.value)} className="tw-focus" style={{ ...inp, marginBottom: 8 }}>
          {TARDIEU_MUSCLES.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
        <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
          {BODY_SIDES.map((s) => (
            <button key={s.key} className="tw-focus" onClick={() => setSide(s.key)}
              style={{ flex: 1, border: `1.5px solid ${side === s.key ? C.clayDeep : C.line}`, background: side === s.key ? C.clayTint : C.surface,
                color: side === s.key ? C.clayDeep : C.inkSoft, borderRadius: 10, padding: "9px", fontSize: 13.5, fontWeight: 700 }}>{s.label}</button>
          ))}
        </div>
        <InfoHint text={facil?.capture?.r1r2} />
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div><div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 4 }}>R1 (catch, fast)</div><input type="number" value={r1} onChange={(e) => setR1(e.target.value)} className="tw-focus" style={numSm} /></div>
          <div><div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 4 }}>R2 (range, slow)</div><input type="number" value={r2} onChange={(e) => setR2(e.target.value)} className="tw-focus" style={numSm} /></div>
          {r1 !== "" && r2 !== "" && <div><div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 4 }}>R2−R1</div><div style={{ fontSize: 20, fontWeight: 700, color: C.sageDeep, paddingTop: 6 }}>{Number(r2) - Number(r1)}°</div></div>}
        </div>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 6 }}>Quality grade</div>
        <InfoHint text={facil?.capture?.quality} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {TARDIEU_QUALITY.map((q) => (
            <button key={q.grade} className="tw-focus" onClick={() => setQuality(q.grade)} title={q.label}
              style={{ border: `1.5px solid ${quality === q.grade ? C.clayDeep : C.line}`, background: quality === q.grade ? C.clayTint : C.surface,
                color: quality === q.grade ? C.clayDeep : C.inkSoft, borderRadius: 9, padding: "8px 11px", fontSize: 12.5, fontWeight: 700 }}>
              {q.grade}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: C.stone, margin: "0 0 12px", lineHeight: 1.4 }}>{quality != null ? TARDIEU_QUALITY.find((q) => q.grade === quality).label : "0 none · 1 slight · 2 clear catch · 3 fatigable clonus · 4 infatigable · 5 immovable"}</p>
        <button className="tw-focus" disabled={!canAdd} onClick={add}
          style={{ width: "100%", border: `1.5px solid ${canAdd ? C.sage : C.line}`, background: canAdd ? C.sageTint : C.surface,
            color: canAdd ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px", fontSize: 14, fontWeight: 700 }}>+ Add record</button>
      </Card>
      {rows.length > 0 && (
        <Card>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>{rows.length} record{rows.length > 1 ? "s" : ""}</div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < rows.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.ink }}>{TARDIEU_MUSCLES.find((m) => m.key === r.muscle_group)?.label} · {r.side}</span>
              <span style={{ fontSize: 12.5, color: C.inkSoft }}>R1 {r.r1_degrees}° · R2 {r.r2_degrees}° · Δ{r.r2_minus_r1}° · Q{r.quality_grade}</span>
            </div>
          ))}
        </Card>
      )}
      <SaveBar label="Save Tardieu" disabled={rows.length === 0} onClick={() => onSave({ tardieu_records: rows })} />
    </>
  );
}

/* ---- Goniometry ---- */
function GoniometryForm({ onSave, facil }) {
  const [vals, setVals] = useState({});
  const set = (motion, sideKey, v) => setVals((s) => ({ ...s, [motion]: { ...(s[motion] || {}), [sideKey]: v } }));
  const any = Object.values(vals).some((m) => m && (m.left !== "" && m.left != null || m.right !== "" && m.right != null));
  const compact = () => Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, {
    left: v.left === "" || v.left == null ? null : Number(v.left),
    right: v.right === "" || v.right == null ? null : Number(v.right),
  }]));
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>Range in degrees, per side. Leave blank if not measured. A loss ≥5–10° between visits should be flagged.</p>
        <InfoHint text={facil?.capture?.reading} />
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "8px 8px", alignItems: "center" }}>
          <div />
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textAlign: "center" }}>Left</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, textAlign: "center" }}>Right</div>
          {GONIOMETRY_MOTIONS.map((m) => (
            <React.Fragment key={m.key}>
              <div style={{ fontSize: 12.5, color: C.ink }}>{m.label}</div>
              {BODY_SIDES.map((s) => (
                <input key={s.key} type="number" value={vals[m.key]?.[s.key] ?? ""} onChange={(e) => set(m.key, s.key, e.target.value)}
                  className="tw-focus" style={{ ...inp, textAlign: "center", padding: "8px 6px" }} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <SaveBar label="Save goniometry" disabled={!any} onClick={() => onSave({ goniometry: compact() })} />
    </>
  );
}

/* ---- Peak cough flow ---- */
function CoughFlowForm({ onSave, facil }) {
  const [v, setV] = useState("");
  const band = v !== "" ? coughFlowBand(Number(v)) : null;
  return (
    <>
      <Card>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Best of three (L/min)</div>
        <InfoHint text={facil?.capture?.effort} />
        <input type="number" value={v} onChange={(e) => setV(e.target.value)} className="tw-focus" style={inp} />
        {band && (
          <div style={{ marginTop: 12, background: band.alert ? "#F6E7E7" : C.sageTint, border: `1.5px solid ${band.alert ? "#B15353" : C.sage}`, borderRadius: 12, padding: "11px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: band.alert ? "#8C3A3A" : C.sageDeep }}>{band.label}</span>
            {band.alert && <p style={{ fontSize: 12, color: "#8C3A3A", margin: "5px 0 0", lineHeight: 1.4 }}>Below 160 — ineffective cough, high chest-infection risk. Flag to the team.</p>}
          </div>
        )}
      </Card>
      <SaveBar label="Save cough flow" disabled={v === ""} onClick={() => onSave({ peak_cough_flow: { best_of_three_l_min: Number(v) } })} />
    </>
  );
}

/* ---- TIS ---- */
function TISForm({ onSave, facil }) {
  const [s, setS] = useState({});
  const total = TIS_SUBSCALES.reduce((t, sub) => t + (typeof s[sub.key] === "number" ? s[sub.key] : 0), 0);
  const complete = TIS_SUBSCALES.every((sub) => typeof s[sub.key] === "number");
  return (
    <>
      <Card>
        <InfoHint text={facil?.capture?.scoring} />
        {TIS_SUBSCALES.map((sub) => (
          <div key={sub.key} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{sub.label} <span style={{ color: C.stone, fontWeight: 500 }}>(0–{sub.max})</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {Array.from({ length: sub.max + 1 }).map((_, n) => (
                <button key={n} className="tw-focus" onClick={() => setS((v) => ({ ...v, [sub.key]: n }))}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${s[sub.key] === n ? C.clayDeep : C.line}`,
                    background: s[sub.key] === n ? C.clay : C.surface, color: s[sub.key] === n ? "#fff" : C.inkSoft, fontSize: 13, fontWeight: 700 }}>{n}</button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ fontSize: 13, fontWeight: 700, color: C.sageDeep }}>Total: {total}/23</div>
        <p style={{ fontSize: 11.5, color: C.stone, margin: "6px 0 0", lineHeight: 1.4 }}>Expected to read low until the daily fade-probe shows support level ≥7 with multi-second holds — this is the graduation measure.</p>
      </Card>
      <SaveBar label="Save TIS" disabled={!complete} onClick={() => onSave({ tis: { ...s, total } })} />
    </>
  );
}

/* ---- SCIM III ---- */
function SCIMForm({ onSave, facil }) {
  const [total, setTotal] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <>
      <Card>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 8 }}>SCIM III total (0–100)</div>
        <InfoHint text={facil?.capture?.scoring} />
        <input type="number" min={0} max={100} value={total} onChange={(e) => setTotal(e.target.value)} className="tw-focus" style={inp} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, margin: "14px 0 6px" }}>Notes (optional)</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="tw-focus" style={{ ...inp, resize: "vertical" }} />
        <p style={{ fontSize: 11.5, color: C.stone, margin: "8px 0 0", lineHeight: 1.4 }}>Attribute Catz/Itzkovich. Care burden / independence.</p>
      </Card>
      <SaveBar label="Save SCIM III" disabled={total === ""} onClick={() => onSave({ scim3: { total: Number(total), notes: notes.trim() } })} />
    </>
  );
}

/* ---- GAS ---- */
function GASForm({ onSave, facil }) {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const add = () => { if (!name.trim()) return; setGoals((g) => [...g, { goal: name.trim(), level }]); setName(""); setLevel(0); };
  return (
    <>
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.inkSoft, marginBottom: 8 }}>Add a goal (written in advance by the physio)</div>
        <InfoHint text={facil?.capture?.scoring} />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal" className="tw-focus" style={{ ...inp, marginBottom: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {GAS_LEVELS.map((l) => (
            <button key={l.level} className="tw-focus" onClick={() => setLevel(l.level)}
              style={{ textAlign: "left", border: `1.5px solid ${level === l.level ? C.clayDeep : C.line}`, background: level === l.level ? C.clayTint : C.surface,
                color: level === l.level ? C.clayDeep : C.inkSoft, borderRadius: 10, padding: "9px 12px", fontSize: 13, fontWeight: 700 }}>{l.label}</button>
          ))}
        </div>
        <button className="tw-focus" disabled={!name.trim()} onClick={add}
          style={{ width: "100%", border: `1.5px solid ${name.trim() ? C.sage : C.line}`, background: name.trim() ? C.sageTint : C.surface,
            color: name.trim() ? C.sageDeep : C.inkSoft, borderRadius: 12, padding: "11px", fontSize: 14, fontWeight: 700 }}>+ Add goal</button>
      </Card>
      {goals.length > 0 && (
        <Card>
          {goals.map((g, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < goals.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.ink }}>{g.goal}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: g.level >= 0 ? C.sageDeep : C.clayDeep }}>{g.level > 0 ? `+${g.level}` : g.level}</span>
            </div>
          ))}
        </Card>
      )}
      <SaveBar label="Save GAS" disabled={goals.length === 0} onClick={() => onSave({ gas: goals })} />
    </>
  );
}

/* ---- FSS ---- */
function FSSForm({ onSave, facil }) {
  const [items, setItems] = useState(Array(FSS_ITEMS).fill(null));
  const complete = items.every((v) => typeof v === "number");
  const mean = complete ? Math.round((items.reduce((a, b) => a + b, 0) / FSS_ITEMS) * 10) / 10 : null;
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.45 }}>Nine items, 1 (strongly disagree) – 7 (strongly agree). Stored as the mean. Complements the daily fatigue rating.</p>
        <InfoHint text={facil?.capture?.rating} />
        {items.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 20, fontSize: 12, color: C.stone, fontWeight: 700 }}>{i + 1}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button key={n} className="tw-focus" onClick={() => setItems((a) => a.map((x, j) => j === i ? n : x))}
                  style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${v === n ? C.clayDeep : C.line}`,
                    background: v === n ? C.clay : C.surface, color: v === n ? "#fff" : C.inkSoft, fontSize: 12.5, fontWeight: 700 }}>{n}</button>
              ))}
            </div>
          </div>
        ))}
        {mean != null && <div style={{ fontSize: 13, fontWeight: 700, color: C.sageDeep, marginTop: 6 }}>Mean: {mean}</div>}
      </Card>
      <SaveBar label="Save FSS" disabled={!complete} onClick={() => onSave({ fss: { items, mean } })} />
    </>
  );
}

/* ---- External cognitive score ---- */
function CognitiveForm({ onSave }) {
  const [instrument, setInstrument] = useState("MoCA");
  const [date, setDate] = useState("");
  const [administrator, setAdministrator] = useState("");
  const [total, setTotal] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 12px", lineHeight: 1.45 }}>Record a score administered by the cognitive therapist. The app never delivers the items — that would invalidate their administration.</p>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 6 }}>Instrument</div>
        <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
          {COGNITIVE_INSTRUMENTS.map((o) => (
            <button key={o.key} className="tw-focus" onClick={() => setInstrument(o.key)}
              style={{ flex: 1, border: `1.5px solid ${instrument === o.key ? C.clayDeep : C.line}`, background: instrument === o.key ? C.clayTint : C.surface,
                color: instrument === o.key ? C.clayDeep : C.inkSoft, borderRadius: 10, padding: "9px", fontSize: 13, fontWeight: 700 }}>{o.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Date</div><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="tw-focus" style={inp} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Total score</div><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="tw-focus" style={inp} /></div>
        </div>
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Administrator</div>
        <input value={administrator} onChange={(e) => setAdministrator(e.target.value)} className="tw-focus" style={{ ...inp, marginBottom: 12 }} />
        <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Notes (optional)</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="tw-focus" style={{ ...inp, resize: "vertical" }} />
      </Card>
      <SaveBar label="Save score" disabled={total === ""} onClick={() => onSave({ cognitive_external: { instrument, date, administrator: administrator.trim(), total_score: Number(total), notes: notes.trim() } })} />
    </>
  );
}

/* ---- shared rating widgets (rating scales) ---- */

/* A single-select pill row — used for rater / timepoint / stage. */
function PillRow({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <button key={o.key} className="tw-focus" onClick={() => onChange(o.key)}
            style={{ border: `1.5px solid ${on ? C.clayDeep : C.line}`, background: on ? C.clayTint : C.surface,
              color: on ? C.clayDeep : C.inkSoft, borderRadius: 10, padding: "9px 13px", fontSize: 13.5, fontWeight: 700 }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* 1–10 scale, best performance = 10. */
function Scale10({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        const on = value === n;
        return (
          <button key={n} className="tw-focus" onClick={() => onChange(n)}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${on ? C.clayDeep : C.line}`,
              background: on ? C.clay : C.surface, color: on ? "#fff" : C.inkSoft, fontSize: 13, fontWeight: 700 }}>{n}</button>
        );
      })}
    </div>
  );
}

/* A block: dimension label (+ optional note) over a 1–10 scale. */
function ScaleRow({ dim, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: dim.note ? 2 : 8 }}>{dim.label}</div>
      {dim.note && <div style={{ fontSize: 11.5, color: C.stone, marginBottom: 8, lineHeight: 1.4 }}>{dim.note}</div>}
      <Scale10 value={value} onChange={onChange} />
    </div>
  );
}

/* ---- Performance ratings (therapist rates Akki vs baseline) ---- */
function PerformanceRatingsForm({ onSave, facil }) {
  const [rater, setRater] = useState(null);
  const [timepoint, setTimepoint] = useState(null);
  const [scores, setScores] = useState({});
  const [capacityNote, setCapacityNote] = useState("");
  const setScore = (k, v) => setScores((s) => ({ ...s, [k]: v }));
  const allScored = PERFORMANCE_DIMENSIONS.every((d) => typeof scores[d.key] === "number");
  const canSave = rater && timepoint && allScored;
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 14px", lineHeight: 1.5 }}>
          Your estimate of Akki's performance vs. baseline. Score the best you saw at this timepoint, 1 (low) – 10 (best).
        </p>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Rater</div>
        <PillRow options={RATING_RATERS} value={rater} onChange={setRater} />
        <div style={{ height: 14 }} />
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Timepoint</div>
        <PillRow options={PERFORMANCE_TIMEPOINTS} value={timepoint} onChange={setTimepoint} />
      </Card>
      <Card>
        <InfoHint text={facil?.capture?.scoring} />
        {PERFORMANCE_DIMENSIONS.map((d) => (
          <ScaleRow key={d.key} dim={d} value={scores[d.key]} onChange={(v) => setScore(d.key, v)} />
        ))}
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: 2 }}>Increase in capacity</div>
        <div style={{ fontSize: 11.5, color: C.stone, marginBottom: 8, lineHeight: 1.4 }}>Qualitative — e.g. counts increasing, complexity coped with, assistance / cueing reduced.</div>
        <InfoHint text={facil?.capture?.capacity} />
        <textarea value={capacityNote} onChange={(e) => setCapacityNote(e.target.value)} rows={3} className="tw-focus" style={{ ...inp, resize: "vertical" }} />
      </Card>
      <SaveBar label="Save performance ratings" disabled={!canSave}
        onClick={() => onSave({ performance: { rater, timepoint, scores, capacity_note: capacityNote.trim() } })} />
    </>
  );
}

/* ---- Paradigm ratings (therapist rates their own experience) ---- */
function ParadigmRatingsForm({ onSave, facil }) {
  const [rater, setRater] = useState(null);
  const [stage, setStage] = useState(null);
  const [scores, setScores] = useState({});
  const [attentionNote, setAttentionNote] = useState("");
  const setScore = (k, v) => setScores((s) => ({ ...s, [k]: v }));
  const allScored = PARADIGM_DIMENSIONS.every((d) => typeof scores[d.key] === "number");
  const canSave = rater && stage && allScored;
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 14px", lineHeight: 1.5 }}>
          Your own experience of running the program, 1 (hard) – 10 (easy / best).
        </p>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Rater</div>
        <PillRow options={RATING_RATERS} value={rater} onChange={setRater} />
        <div style={{ height: 14 }} />
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Stage</div>
        <PillRow options={PARADIGM_STAGES} value={stage} onChange={setStage} />
      </Card>
      <Card>
        <InfoHint text={facil?.capture?.scoring} />
        {PARADIGM_DIMENSIONS.map((d) => (
          <ScaleRow key={d.key} dim={d} value={scores[d.key]} onChange={(v) => setScore(d.key, v)} />
        ))}
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: 2 }}>Other things that need attention</div>
        <div style={{ fontSize: 11.5, color: C.stone, marginBottom: 8, lineHeight: 1.4 }}>Optional — anything to flag for next month.</div>
        <textarea value={attentionNote} onChange={(e) => setAttentionNote(e.target.value)} rows={3} className="tw-focus" style={{ ...inp, resize: "vertical" }} />
      </Card>
      <SaveBar label="Save paradigm ratings" disabled={!canSave}
        onClick={() => onSave({ paradigm: { rater, stage, scores, attention_note: attentionNote.trim() } })} />
    </>
  );
}

/* ---- Exercise baselines (Akki's baseline count & difficulty per exercise) ---- */
function ExerciseBaselinesForm({ onSave, physioBank = [], facil }) {
  const bank = physioBank.filter((ex) => !ex.dormant);
  const [vals, setVals] = useState({});
  const [rater, setRater] = useState(null);
  const [otherRater, setOtherRater] = useState("");
  const set = (id, field, v) => setVals((s) => ({ ...s, [id]: { ...(s[id] || {}), [field]: v } }));
  const filled = bank.filter((ex) => vals[ex.id] && vals[ex.id].reps !== "" && vals[ex.id].reps != null);
  const raterOk = rater && (rater !== "other" || otherRater.trim() !== "");
  const raterName = rater === "other" ? otherRater.trim() : (BASELINE_RATERS.find((r) => r.key === rater)?.label || "");
  const canSave = filled.length > 0 && raterOk;
  return (
    <>
      <Card>
        <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 14px", lineHeight: 1.5 }}>
          A dated baseline snapshot — Akki's starting count (and how hard it felt) for each exercise. Fill in what you measured today; leave the rest blank. Re-baseline any time to track movement.
        </p>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 6 }}>Measured by</div>
        <PillRow options={BASELINE_RATERS} value={rater} onChange={setRater} />
        {rater === "other" && (
          <input value={otherRater} onChange={(e) => setOtherRater(e.target.value)} placeholder="Who took the baseline?"
            className="tw-focus" style={{ ...inp, marginTop: 9 }} />
        )}
        <InfoHint text={facil?.capture?.reading} />
      </Card>
      {bank.map((ex) => {
        const v = vals[ex.id] || {};
        return (
          <div key={ex.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: ex.instructions ? 3 : 10 }}>{ex.title}</div>
            {ex.instructions && (
              <p style={{ fontSize: 12, color: C.inkSoft, margin: "0 0 10px", lineHeight: 1.4 }}>{ex.instructions}</p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Baseline {unitLabel(ex.unit)}</div>
                <input type="number" min={0} value={v.reps ?? ""} onChange={(e) => set(ex.id, "reps", e.target.value)} className="tw-focus" style={inp} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Difficulty (1–10)</div>
                <input type="number" min={1} max={10} value={v.diff ?? ""} onChange={(e) => set(ex.id, "diff", e.target.value)} className="tw-focus" style={inp} />
              </div>
            </div>
          </div>
        );
      })}
      <SaveBar
        label={filled.length === 0 ? "Fill at least one exercise" : !raterOk ? "Pick who measured it" : `Save baselines · ${filled.length} exercise${filled.length > 1 ? "s" : ""}`}
        disabled={!canSave}
        onClick={() => onSave({
          rater, rater_name: raterName,
          baselines: filled.map((ex) => ({
            id: ex.id, title: ex.title, unit: ex.unit,
            reps: Number(vals[ex.id].reps),
            diff: vals[ex.id].diff === "" || vals[ex.id].diff == null ? null : Number(vals[ex.id].diff),
          })),
        })} />
    </>
  );
}

const FORMS = {
  satco: SATCoForm, tardieu: TardieuForm, goniometry: GoniometryForm, peak_cough_flow: CoughFlowForm,
  tis: TISForm, scim3: SCIMForm, gas: GASForm, fss: FSSForm, cognitive_external: CognitiveForm,
  performance_ratings: PerformanceRatingsForm, paradigm_ratings: ParadigmRatingsForm,
  exercise_baselines: ExerciseBaselinesForm,
};

export function Assessment({ persist, home, physioBank = [] }) {
  const [type, setType] = useState(null);
  const [pending, setPending] = useState(null); // collected data awaiting review
  const [saved, setSaved] = useState(false);

  // Form calls this — hold the data for review rather than persisting straight away.
  const review = (data) => setPending(data);

  const confirmSave = () => {
    persist?.({ at: Date.now(), kind: "assessment", assessment_type: type, ...pending });
    setPending(null);
    setSaved(true);
  };

  if (saved) {
    const meta = ASSESSMENT_TYPES.find((t) => t.key === type);
    return (
      <div className="tw-rise">
        <h2 className="tw-serif" style={{ fontSize: 28, margin: "10px 0 6px" }}>{meta?.label} recorded</h2>
        <p style={{ color: C.inkSoft, fontSize: 15, margin: "0 0 22px" }}>Saved to the dashboard. Assessments are recorded, not administered — the score came from the clinician.</p>
        <button className="tw-focus tw-lift" onClick={home}
          style={{ width: "100%", background: C.clay, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.clayDeep}` }}>Done</button>
      </div>
    );
  }

  if (pending) {
    const summary = summarizeAssessment({ assessment_type: type, ...pending });
    return (
      <div className="tw-rise">
        <BackBtn onClick={() => setPending(null)} label="Back to edit" />
        <h2 className="tw-serif" style={{ fontSize: 26, margin: "10px 0 2px" }}>Review · {summary.title}</h2>
        <p style={{ color: C.inkSoft, fontSize: 13.5, margin: "0 0 18px" }}>Check this before saving. Nothing is stored until you submit.</p>
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "8px 18px", marginBottom: 16 }}>
          {summary.lines.length === 0 && <p style={{ fontSize: 13.5, color: C.stone, padding: "10px 0" }}>No fields captured.</p>}
          {summary.lines.map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: i < summary.lines.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ fontSize: 13, color: C.inkSoft, textTransform: "capitalize" }}>{l.label}</span>
              <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 600, textAlign: "right" }}>{l.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="tw-focus" onClick={() => setPending(null)}
            style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.line}`, color: C.inkSoft, borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 700 }}>
            Edit
          </button>
          <button className="tw-focus tw-lift" onClick={confirmSave}
            style={{ flex: 2, background: C.clay, color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 700, boxShadow: `0 3px 0 ${C.clayDeep}` }}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  if (type) {
    const meta = ASSESSMENT_TYPES.find((t) => t.key === type);
    const Form = FORMS[type];
    return (
      <div className="tw-rise">
        <BackBtn onClick={() => setType(null)} label="Assessments" />
        <h2 className="tw-serif" style={{ fontSize: 26, margin: "10px 0 2px" }}>{meta.label}</h2>
        <p style={{ color: C.inkSoft, fontSize: 13.5, margin: "0 0 18px" }}>{meta.cadence} · {meta.blurb}</p>
        <HowToRun facil={ASSESSMENT_FACILITATION[type]} />
        <Form onSave={review} physioBank={physioBank} facil={ASSESSMENT_FACILITATION[type]} />
      </div>
    );
  }

  return (
    <div className="tw-rise">
      <BackBtn onClick={home} />
      <h2 className="tw-serif" style={{ fontSize: 28, margin: "12px 0 4px" }}>Record an assessment</h2>
      <p style={{ color: C.inkSoft, fontSize: 15, margin: "0 0 20px", lineHeight: 1.45 }}>
        Enter a score administered by the clinician. The app never presents test items.
      </p>
      <SectionLabel>Instruments</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
        {ASSESSMENT_TYPES.map((t) => (
          <button key={t.key} className="tw-focus tw-lift" onClick={() => setType(t.key)}
            style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 15.5, fontWeight: 700, color: C.ink }}>{t.label}</span>
              <span style={{ fontSize: 11, color: C.clayDeep, fontWeight: 700 }}>{t.cadence}</span>
            </div>
            <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 4, lineHeight: 1.4 }}>{t.blurb}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
