/*
 * Lightweight, dependency-free SVG charts for the physio dashboard.
 * Responsive via ResizeObserver (crisp text, no viewBox scaling distortion).
 * Primary interaction is tap-to-select (this runs on a tablet) — the selected
 * mark is highlighted and directly labelled; selection drives the detail panel.
 */
import React, { useEffect, useRef, useState } from "react";
import { C } from "../../constants";
import { fmtDate } from "./metrics";

const H = 172;
const M = { t: 22, r: 14, b: 26, l: 28 };

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(e.contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

function ChartFrame({ title, hint, children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 14px 8px" }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{title}</div>
      {hint && <div style={{ fontSize: 11.5, color: C.stone, marginTop: 2 }}>{hint}</div>}
      {children}
    </div>
  );
}

// Shared plot geometry + axes. `data` items need { id, at }.
function usePlot(w, data, yMax, yMin = 0) {
  const plotW = Math.max(0, w - M.l - M.r);
  const plotH = H - M.t - M.b;
  const n = data.length;
  const xAt = (i) => M.l + (n <= 1 ? plotW / 2 : (plotW * i) / (n - 1));
  const bandAt = (i) => M.l + (plotW * (i + 0.5)) / Math.max(1, n); // for bars
  const yAt = (v) => M.t + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  return { plotW, plotH, xAt, bandAt, yAt };
}

function Gridlines({ w, ticks, yAt, suffix = "" }) {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.l} x2={w - M.r} y1={yAt(t)} y2={yAt(t)} stroke={C.line} strokeWidth={1} />
          <text x={M.l - 6} y={yAt(t) + 3} textAnchor="end" fontSize={10} fill={C.stone}>{t}{suffix}</text>
        </g>
      ))}
    </g>
  );
}

function XLabels({ data, xFn, selectedId }) {
  // Show every label when few, else thin to ~6.
  const step = data.length > 8 ? Math.ceil(data.length / 6) : 1;
  return (
    <g>
      {data.map((d, i) => {
        if (i % step !== 0 && d.id !== selectedId && i !== data.length - 1) return null;
        return (
          <text key={d.id} x={xFn(i)} y={H - 8} textAnchor="middle" fontSize={10}
            fill={d.id === selectedId ? C.ink : C.stone} fontWeight={d.id === selectedId ? 700 : 400}>
            {fmtDate(d.at)}
          </text>
        );
      })}
    </g>
  );
}

function RefLine({ w, y, yAt, label, color = C.stone }) {
  return (
    <g>
      <line x1={M.l} x2={w - M.r} y1={yAt(y)} y2={yAt(y)} stroke={color} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.8} />
      <text x={w - M.r} y={yAt(y) - 4} textAnchor="end" fontSize={10} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

// ---- Line trend (involvement, metacognition) ----
// data: [{ id, at, y, color? }]. y may be null (gap). refLine optional.
export function LineTrend({ title, hint, data, yMax, yMin = 0, ticks, suffix = "", lineColor = C.inkSoft, refLine, selectedId, onSelect }) {
  const [ref, w] = useWidth();
  const { xAt, yAt } = usePlot(w, data, yMax, yMin);
  const pts = data.map((d, i) => ({ ...d, i, x: xAt(i), yPix: d.y == null ? null : yAt(d.y) }));
  const path = pts.filter((p) => p.yPix != null)
    .map((p, k) => `${k === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.yPix.toFixed(1)}`).join(" ");

  return (
    <ChartFrame title={title} hint={hint}>
      <div ref={ref} style={{ width: "100%" }}>
        {w > 0 && (
          <svg width={w} height={H} role="img" aria-label={title}>
            <Gridlines w={w} ticks={ticks} yAt={yAt} suffix={suffix} />
            {refLine && <RefLine w={w} y={refLine.y} yAt={yAt} label={refLine.label} color={refLine.color} />}
            <path d={path} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={0.55} />
            {pts.map((p) => p.yPix == null ? null : (
              <g key={p.id} onClick={() => onSelect?.(p.id)} style={{ cursor: "pointer" }}>
                <circle cx={p.x} cy={p.yPix} r={16} fill="transparent" />
                <circle cx={p.x} cy={p.yPix} r={p.id === selectedId ? 7 : 5}
                  fill={p.color || lineColor} stroke={C.surface} strokeWidth={2} />
                {p.id === selectedId && (
                  <text x={p.x} y={p.yPix - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
                    {p.y}{suffix}
                  </text>
                )}
              </g>
            ))}
            <XLabels data={data} xFn={xAt} selectedId={selectedId} />
          </svg>
        )}
      </div>
    </ChartFrame>
  );
}

// ---- Multi-series line trend ----
// slots: ordered [{ id, at }] shared x-axis. series: [{ key, label, color,
// dashed?, stepped?, values: { [slotId]: y|null } }]. dimIds: Set of slot ids
// rendered faint (discounted sessions). Missing/null values are gaps.
export function MultiLineTrend({ title, hint, slots, series, yMax, yMin = 0, ticks, suffix = "", refLine, selectedId, onSelect, dimIds }) {
  const [ref, w] = useWidth();
  const { xAt, yAt } = usePlot(w, slots, yMax, yMin);
  const dim = dimIds || new Set();

  const pathFor = (s) => {
    let d = "";
    let started = false;
    slots.forEach((slot, i) => {
      const v = s.values[slot.id];
      if (v == null) { started = false; return; }
      const x = xAt(i), y = yAt(v);
      if (!started) { d += `M${x.toFixed(1)},${y.toFixed(1)}`; started = true; }
      else if (s.stepped) { d += ` H${x.toFixed(1)} V${y.toFixed(1)}`; }
      else { d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
    });
    return d;
  };

  return (
    <ChartFrame title={title} hint={hint}>
      <div ref={ref} style={{ width: "100%" }}>
        {w > 0 && (
          <svg width={w} height={H} role="img" aria-label={title}>
            <Gridlines w={w} ticks={ticks} yAt={yAt} suffix={suffix} />
            {refLine && <RefLine w={w} y={refLine.y} yAt={yAt} label={refLine.label} color={refLine.color} />}
            {series.map((s) => (
              <path key={s.key} d={pathFor(s)} fill="none" stroke={s.color} strokeWidth={2}
                strokeDasharray={s.dashed ? "5 4" : undefined} strokeLinejoin="round" strokeLinecap="round" opacity={0.65} />
            ))}
            {series.map((s) => slots.map((slot, i) => {
              const v = s.values[slot.id];
              if (v == null) return null;
              const faint = dim.has(slot.id);
              const sel = slot.id === selectedId;
              return (
                <g key={s.key + slot.id} onClick={() => onSelect?.(slot.id)} style={{ cursor: onSelect ? "pointer" : "default" }}>
                  <circle cx={xAt(i)} cy={yAt(v)} r={sel ? 6 : 4} fill={s.color} stroke={C.surface} strokeWidth={1.5} opacity={faint ? 0.3 : 1} />
                </g>
              );
            }))}
            <XLabels data={slots} xFn={xAt} selectedId={selectedId} />
          </svg>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", margin: "6px 0 2px" }}>
        {series.map((s) => (
          <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.inkSoft }}>
            <span style={{ width: 14, height: 0, borderTop: `2px ${s.dashed ? "dashed" : "solid"} ${s.color}` }} />{s.label}
          </span>
        ))}
      </div>
    </ChartFrame>
  );
}

// ---- Heatmap (segment × session) ----
// rows: [{ key, label }]. cols: [{ id, at }]. cell(rowKey, col) -> { color, title } | null.
export function Heatmap({ title, hint, rows, cols, cell, onSelect, selectedId }) {
  if (!cols.length) {
    return <ChartFrame title={title} hint={hint}><div style={{ height: 50, display: "grid", placeItems: "center", color: C.stone, fontSize: 12 }}>No data yet</div></ChartFrame>;
  }
  const shown = cols.length > 14 ? cols.slice(cols.length - 14) : cols;
  return (
    <ChartFrame title={title} hint={hint}>
      <div style={{ overflowX: "auto", marginTop: 6 }}>
        <div style={{ display: "grid", gridTemplateColumns: `78px repeat(${shown.length}, 1fr)`, gap: 3, minWidth: shown.length * 22 + 78 }}>
          <div />
          {shown.map((c) => (
            <div key={c.id} style={{ fontSize: 8.5, color: c.id === selectedId ? C.ink : C.stone, textAlign: "center", transform: "rotate(-45deg)", transformOrigin: "center", height: 26, overflow: "visible", whiteSpace: "nowrap" }}>
              {fmtDate(c.at)}
            </div>
          ))}
          {rows.map((r) => (
            <React.Fragment key={r.key}>
              <div style={{ fontSize: 11, color: C.ink, fontWeight: 600, display: "flex", alignItems: "center" }}>{r.label}</div>
              {shown.map((c) => {
                const cc = cell(r.key, c);
                return (
                  <div key={c.id} title={cc?.title || ""} onClick={() => onSelect?.(c.id)}
                    style={{ height: 20, borderRadius: 4, background: cc?.color || C.paper, cursor: onSelect ? "pointer" : "default",
                      border: c.id === selectedId ? `1.5px solid ${C.ink}` : "none" }} />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

// ---- Bar trend (standing minutes) ----
export function BarTrend({ title, hint, data, yMax, ticks, suffix = "", color = C.sage, ceiling, selectedId, onSelect, colorFor }) {
  const [ref, w] = useWidth();
  const { plotW, bandAt, yAt } = usePlot(w, data, yMax, 0);
  const bw = Math.min(30, (plotW / Math.max(1, data.length)) * 0.55);

  return (
    <ChartFrame title={title} hint={hint}>
      <div ref={ref} style={{ width: "100%" }}>
        {w > 0 && (
          <svg width={w} height={H} role="img" aria-label={title}>
            <Gridlines w={w} ticks={ticks} yAt={yAt} suffix={suffix} />
            {ceiling && <RefLine w={w} y={ceiling.y} yAt={yAt} label={ceiling.label} color={C.clay} />}
            {data.map((d, i) => {
              const x = bandAt(i) - bw / 2;
              const y = yAt(d.y);
              const h = Math.max(0, yAt(0) - y);
              const sel = d.id === selectedId;
              return (
                <g key={d.id} onClick={() => onSelect?.(d.id)} style={{ cursor: "pointer" }}>
                  <rect x={bandAt(i) - Math.max(bw, 22) / 2} y={M.t} width={Math.max(bw, 22)} height={H - M.t - M.b} fill="transparent" />
                  <rect x={x} y={y} width={bw} height={h} rx={4} fill={(colorFor && colorFor(d)) || color} opacity={sel ? 1 : 0.45} />
                  {sel && <text x={bandAt(i)} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>{d.y}{suffix}</text>}
                </g>
              );
            })}
            <XLabels data={data} xFn={bandAt} selectedId={selectedId} />
          </svg>
        )}
      </div>
    </ChartFrame>
  );
}

// ---- State slopes (before→after) for one session, 3 metrics × 2 raters ----
// rows from stateDeltas(); raters sage=Akki, clay=You (validated pair, direct-labelled).
const RATER_COLOR = { patient: C.sage, facilitator: C.clay };
const RATER_LABEL = { patient: "Akki", facilitator: "You" };

export function StateSlopes({ rows }) {
  if (!rows.length) {
    return (
      <ChartFrame title="State — before → after" hint="Not captured this session">
        <div style={{ height: 60, display: "grid", placeItems: "center", color: C.stone, fontSize: 12 }}>No state ratings</div>
      </ChartFrame>
    );
  }
  const h = 96, pad = 16;
  const yAt = (v) => pad + (1 - v / 10) * (h - pad * 2); // 0..10, higher = up
  return (
    <ChartFrame title="State — before → after" hint="Out of 10 · higher is more of that trait">
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        {rows.map((row) => (
          <div key={row.key} style={{ flex: 1, minWidth: 0 }}>
            <svg width="100%" height={h} viewBox={`0 0 120 ${h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${row.label} before to after`}>
              <line x1={30} x2={30} y1={pad} y2={h - pad} stroke={C.line} />
              <line x1={90} x2={90} y1={pad} y2={h - pad} stroke={C.line} />
              <text x={30} y={h - 4} textAnchor="middle" fontSize={9} fill={C.stone}>before</text>
              <text x={90} y={h - 4} textAnchor="middle" fontSize={9} fill={C.stone}>after</text>
              {["patient", "facilitator"].map((rk) => {
                const b = row[rk].before, a = row[rk].after;
                const col = RATER_COLOR[rk];
                return (
                  <g key={rk}>
                    {b != null && a != null && <line x1={30} y1={yAt(b)} x2={90} y2={yAt(a)} stroke={col} strokeWidth={2} />}
                    {b != null && <circle cx={30} cy={yAt(b)} r={4} fill={col} stroke={C.surface} strokeWidth={1.5} />}
                    {a != null && <circle cx={90} cy={yAt(a)} r={4} fill={col} stroke={C.surface} strokeWidth={1.5} />}
                    {a != null && <text x={96} y={yAt(a) + 3} fontSize={10} fontWeight={700} fill={col}>{a}</text>}
                    {b != null && <text x={24} y={yAt(b) + 3} textAnchor="end" fontSize={10} fill={C.stone}>{b}</text>}
                  </g>
                );
              })}
            </svg>
            <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.ink }}>{row.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", margin: "8px 0 4px" }}>
        {["patient", "facilitator"].map((rk) => (
          <span key={rk} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.inkSoft }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: RATER_COLOR[rk] }} />{RATER_LABEL[rk]}
          </span>
        ))}
      </div>
    </ChartFrame>
  );
}
