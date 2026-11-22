"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LCA, MONTE_CARLO } from "@/lib/data";
import { cn } from "@/lib/utils";

type Metric = (typeof MONTE_CARLO.metrics)[number];
const EASE = [0.16, 1, 0.3, 1] as const;

function fmt(m: Metric, v: number) {
  if (m.fmt === "usd") return `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (m.fmt === "pct") return `${v.toFixed(2)}%`;
  if (m.fmt === "usdkwh") return `$${v.toFixed(4)}/kWh`;
  return `${v.toFixed(2)} yrs`;
}

/** Normal approximation drawn from the reported mean and 95% interval. */
export function MonteCarlo() {
  const [key, setKey] = React.useState<Metric["key"]>("npv");
  const m = MONTE_CARLO.metrics.find((x) => x.key === key)!;
  const reduce = useReducedMotion();
  const W = 760, H = 300, px = 24, top = 44, bottom = 40;
  const sd = (m.hi - m.lo) / 3.92;
  const x0 = m.mean - 3.3 * sd, x1 = m.mean + 3.3 * sd;
  const sx = (x: number) => px + ((x - x0) / (x1 - x0)) * (W - 2 * px);
  const f = (x: number) => Math.exp(-0.5 * ((x - m.mean) / sd) ** 2);
  const sy = (y: number) => H - bottom - y * (H - top - bottom);
  const xs = Array.from({ length: 141 }, (_, i) => x0 + ((x1 - x0) * i) / 140);
  const curve = xs.map((x, i) => `${i ? "L" : "M"}${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`).join(" ");
  const band = xs.filter((x) => x >= m.lo && x <= m.hi);
  const area = `M${sx(m.lo)} ${sy(0)} ` + band.map((x) => `L${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`).join(" ") + ` L${sx(m.hi)} ${sy(0)}Z`;

  return (
    <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <h3 className="text-2xl tracking-display">{m.label} across {MONTE_CARLO.iterations.toLocaleString()} runs</h3>
          <p className="mt-2 text-[15px]">
            Mean <strong className="num text-ink">{fmt(m, m.mean)}</strong>; 95% of outcomes fall between{" "}
            <strong className="num text-ink">{fmt(m, m.lo)}</strong> and <strong className="num text-ink">{fmt(m, m.hi)}</strong>.
          </p>
        </div>
        <div role="tablist" aria-label="Indicator" className="flex flex-wrap gap-1 rounded-full bg-tint p-1">
          {MONTE_CARLO.metrics.map((x) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={key === x.key}
              onClick={() => setKey(x.key)}
              className={cn(
                "rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                key === x.key ? "bg-white text-navy shadow-float" : "text-body hover:text-ink"
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-8 h-auto w-full" role="img" aria-label={`${m.label}: mean ${fmt(m, m.mean)}, 95% interval ${fmt(m, m.lo)} to ${fmt(m, m.hi)}`}>
        <line x1={px} x2={W - px} y1={sy(0)} y2={sy(0)} stroke="#D9E1EC" strokeWidth="1.5" />
        <motion.path key={m.key + "band"} d={area} fill="#DCE6FE" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
        <motion.path
          key={m.key}
          d={curve}
          fill="none"
          stroke="#0A2540"
          strokeWidth="2.5"
          {...({ initial: reduce ? false : { pathLength: 0 }, animate: { pathLength: 1 } } as object)}
          transition={{ duration: 1, ease: EASE }}
        />
        <line x1={sx(m.mean)} x2={sx(m.mean)} y1={sy(0)} y2={sy(1)} stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx={sx(m.mean)} cy={sy(1)} r="6" fill="#F59E0B" stroke="#fff" strokeWidth="2.5" />
        <text x={sx(m.mean)} y={sy(1) - 16} textAnchor="middle" className="fill-ink text-[11px] font-semibold">mean {fmt(m, m.mean)}</text>
        <text x={sx(m.lo)} y={H - 12} textAnchor="middle" className="fill-[#5B6B80] text-[10.5px] font-semibold">{fmt(m, m.lo)}</text>
        <text x={sx(m.hi)} y={H - 12} textAnchor="middle" className="fill-[#5B6B80] text-[10.5px] font-semibold">{fmt(m, m.hi)}</text>
      </svg>
      <p className="mt-4 text-[14px] text-muted">
        Inputs varied: {MONTE_CARLO.inputs.join(", ")}. The curve is a normal approximation drawn from the reported mean and 95% interval; the shaded band is that interval.
      </p>
    </div>
  );
}

function Bars({ rows, max, unit, highlight }: { rows: readonly { k: string; v: number }[]; max: number; unit: string; highlight: number }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-6">
      {rows.map((r, i) => (
        <li key={r.k}>
          <div className="mb-2 flex items-baseline justify-between gap-4 text-[15px]">
            <span className="font-semibold text-ink">{r.k}</span>
            <span className="num font-semibold text-ink">
              {r.v.toLocaleString("en-US", { maximumFractionDigits: 2 })} {unit}
            </span>
          </div>
          <div className="h-3 rounded-full bg-tint">
            <motion.div
              className={cn("h-full rounded-full", i === highlight ? "bg-helios" : "bg-navy")}
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${(r.v / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.08 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LcaCharts() {
  const eol = LCA.endOfLife.map((e) => ({ k: e.route, v: e.value }));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
        <h3 className="text-2xl tracking-display">Landfill or recycling</h3>
        <p className="mt-2 text-[15px]">Lifecycle global warming potential of the campus configuration, kgCO₂eq.</p>
        <div className="mt-8">
          <Bars rows={eol} max={LCA.endOfLife[0].value} unit="kg" highlight={1} />
        </div>
        <p className="mt-8 border-t border-line pt-6 text-[15px]">
          Recovering cobalt, nickel, lithium carbonate and aluminium saves <strong className="text-ink">8,793 kgCO₂eq (−26.8%)</strong> per station. The 95% interval for the recycling route is 18,527 to 29,490 kg.
        </p>
      </div>
      <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
        <h3 className="text-2xl tracking-display">Against fossil generation</h3>
        <p className="mt-2 text-[15px]">For the same 23.9 MWh a year, kg CO₂ eq.</p>
        <div className="mt-8">
          <Bars rows={LCA.versusFossil} max={LCA.versusFossil[0].v} unit="kg" highlight={2} />
        </div>
        <p className="mt-8 border-t border-line pt-6 text-[15px]">
          The whole-life figure covers manufacturing; coal and gas figures are for a single year of operation.
        </p>
      </div>
      <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10 lg:col-span-2">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h3 className="text-2xl tracking-display">Where the manufacturing burden sits</h3>
            <p className="mt-2 text-[15px]">
              Manufacturing global warming potential reaches <strong className="num text-ink">28,196 kgCO₂eq</strong>. Toxicity and resource scarcity are driven by cobalt and nickel extraction.
            </p>
          </div>
          <div>
            <div className="flex h-12 overflow-hidden rounded-full" role="img" aria-label="Modules 57.9%, battery packs 36.8%, balance of system 5.3%">
              {LCA.manufacturing.map((s, i) => (
                <div key={s.k} style={{ width: `${s.v}%` }} className={cn(i === 0 ? "bg-navy" : i === 1 ? "bg-helios" : "bg-cobalt-300")} />
              ))}
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-4 text-[14px]">
              {LCA.manufacturing.map((s, i) => (
                <li key={s.k}>
                  <span className={cn("mb-2 block h-1.5 w-8 rounded-full", i === 0 ? "bg-navy" : i === 1 ? "bg-helios" : "bg-cobalt-300")} />
                  <span className="num block text-xl font-semibold text-ink">{s.v}%</span>
                  {s.k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
