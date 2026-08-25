import React from "react";
import { C, INSTRUCTION_FOLLOWING, INITIATION, ALERTNESS_SCALE, SLEEP_QUALITY_SCALE, isDiscounted, discountReason } from "../../constants";

/* Opening state (handoff §4.2) — the "since last session" clinical fields,
   captured in the opening so there is no separate daily-log surface. Feeds the
   discount gate: post-ictal, fatigue_pre >= 7, or alertness <= 2 mark the
   session so a bad-sleep week or a post-seizure period doesn't read as decline. */

function Scale({ label, hint, from, to, value, onChange, color = C.clay }) {
  const nums = [];
  for (let i = from; i <= to; i++) nums.push(i);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: hint ? 2 : 6 }}>{label}</div>
      {hint && <div style={{ fontSize: 11.5, color: C.stone, marginBottom: 6 }}>{hint}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {nums.map((n) => {
          const on = value === n;
          return (
            <button key={n} className="tw-focus" onClick={() => onChange(n)}
              style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${on ? color : C.line}`,
                background: on ? color : C.surface, color: on ? "#fff" : C.inkSoft, fontSize: 14, fontWeight: 700 }}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Seg({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((o) => {
          const on = value === o.key;
          return (
            <button key={o.key} className="tw-focus" onClick={() => onChange(o.key)}
              style={{ border: `1.5px solid ${on ? C.clayDeep : C.line}`, background: on ? C.clayTint : C.surface,
                color: on ? C.clayDeep : C.inkSoft, borderRadius: 999, padding: "8px 13px", fontSize: 12.5, fontWeight: 700 }}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange, danger }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{label}</span>
      <div style={{ display: "flex", gap: 7 }}>
        {[[true, "Yes"], [false, "No"]].map(([v, l]) => {
          const on = value === v;
          const acc = danger && v ? "#B15353" : C.sage;
          return (
            <button key={l} className="tw-focus" onClick={() => onChange(v)}
              style={{ minWidth: 58, border: `1.5px solid ${on ? acc : C.line}`,
                background: on ? (danger && v ? "#F6E7E7" : C.sageTint) : C.surface,
                color: on ? (danger && v ? "#8C3A3A" : C.sageDeep) : C.inkSoft,
                borderRadius: 10, padding: "8px 10px", fontSize: 13.5, fontWeight: 700 }}>
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputSm = { width: "100%", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 11px", fontSize: 14, color: C.ink };

export function OpeningState({ value, onChange }) {
  const st = value;
  const set = (patch) => onChange({ ...st, ...patch });
  const setSeizure = (patch) => onChange({ ...st, seizure_detail: { ...st.seizure_detail, ...patch } });
  const discounted = isDiscounted(st);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.sage, marginBottom: 3 }}>State &amp; since last session</div>
      <p style={{ fontSize: 12.5, color: C.inkSoft, margin: "0 0 14px", lineHeight: 1.45 }}>
        This is the daily log — captured here, not on a separate screen. Fatigue, alertness and seizure status decide whether today counts toward the progression gate.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 6 }}>Sleep (hours)</div>
          <input type="number" min={0} max={16} step="0.5" value={st.sleep_hours}
            onChange={(e) => set({ sleep_hours: e.target.value })} className="tw-focus" style={inputSm} />
        </div>
      </div>

      <div style={{ height: 8 }} />
      <Scale label="Sleep quality" from={1} to={5} value={st.sleep_quality} onChange={(n) => set({ sleep_quality: n })} color={C.indigo} />
      <Scale label="Fatigue (pre)" hint="0 none … 10 worst · 7+ discounts the session" from={0} to={10} value={st.fatigue_pre} onChange={(n) => set({ fatigue_pre: n })} />
      <Scale label="Alertness" hint="1 drowsy … 5 fully alert · ≤2 discounts the session" from={1} to={5} value={st.alertness} onChange={(n) => set({ alertness: n })} color={C.indigo} />

      <Seg label="Instruction following" options={INSTRUCTION_FOLLOWING} value={st.instruction_following} onChange={(k) => set({ instruction_following: k })} />
      <Seg label="Initiation" options={INITIATION} value={st.initiation} onChange={(k) => set({ initiation: k })} />

      <Scale label="Pain" from={0} to={10} value={st.pain} onChange={(n) => set({ pain: n })} />
      {typeof st.pain === "number" && st.pain > 0 && (
        <input value={st.pain_location} onChange={(e) => set({ pain_location: e.target.value })}
          placeholder="Pain location" className="tw-focus tw-rise" style={{ ...inputSm, marginBottom: 14 }} />
      )}

      <div style={{ borderTop: `1px solid ${C.line}`, margin: "4px 0 14px" }} />

      <Toggle label="Seizure since last session?" value={st.seizure_since_last}
        onChange={(v) => set({ seizure_since_last: v, post_ictal: v ? true : st.post_ictal })} danger />
      {st.seizure_since_last && (
        <div className="tw-rise" style={{ background: "#F9EFEF", border: `1px solid #E0BEBE`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>When</div>
              <input type="datetime-local" value={st.seizure_detail.datetime} onChange={(e) => setSeizure({ datetime: e.target.value })} className="tw-focus" style={inputSm} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Duration (s)</div>
              <input type="number" min={0} value={st.seizure_detail.duration_seconds} onChange={(e) => setSeizure({ duration_seconds: e.target.value })} className="tw-focus" style={inputSm} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 5 }}>Recovery (min)</div>
              <input type="number" min={0} value={st.seizure_detail.recovery_minutes} onChange={(e) => setSeizure({ recovery_minutes: e.target.value })} className="tw-focus" style={inputSm} />
            </div>
          </div>
          <textarea value={st.seizure_detail.description} onChange={(e) => setSeizure({ description: e.target.value })} rows={2}
            placeholder="Description" className="tw-focus" style={{ ...inputSm, resize: "vertical" }} />
        </div>
      )}
      <Toggle label="Post-ictal today?" value={st.post_ictal} onChange={(v) => set({ post_ictal: v })} danger />

      <div style={{ borderTop: `1px solid ${C.line}`, margin: "4px 0 14px" }} />

      <Toggle label="Medication change?" value={st.medication_change} onChange={(v) => set({ medication_change: v })} />
      {st.medication_change && (
        <input value={st.medication_note} onChange={(e) => set({ medication_note: e.target.value })}
          placeholder="What changed?" className="tw-focus tw-rise" style={{ ...inputSm, marginBottom: 6 }} />
      )}

      {discounted && (
        <div className="tw-rise" style={{ background: C.paper, border: `1.5px solid ${C.clay}`, borderRadius: 12, padding: "11px 14px", marginTop: 4 }}>
          <p style={{ fontSize: 12.5, color: C.clayDeep, margin: 0, fontWeight: 600, lineHeight: 1.45 }}>
            This session will be discounted ({discountReason(st)}) — it won't count toward the "3" gate, and a poor result won't break a streak. It'll show dimmed on the charts.
          </p>
        </div>
      )}
    </div>
  );
}
