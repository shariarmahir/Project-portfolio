"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { BarList, Columns, Legend, LineChart, Reveal, useOnce, useReduced } from "@/components/charts/kit";
import { T } from "@/lib/thesis-data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EASE = [0.16, 1, 0.3, 1] as const;

function Panel({ title, children, note, delay = 0, className = "" }: { title: string; children: React.ReactNode; note?: string; delay?: number; className?: string }) {
  return (
    <Reveal delay={delay} className={`glass flex flex-col rounded-slab p-6 sm:p-8 ${className}`}>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      <div className="mt-6 flex flex-1 flex-col justify-center">{children}</div>
      {note && <p className="mt-4 text-[12.5px] text-muted">{note}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ Case A */

const MC_ROWS = [
  { key: "npv", label: "NPV", fmt: (v: number) => `USD ${Math.round(v).toLocaleString("en-US")}`, min: -2000, max: 15000 },
  { key: "irr", label: "IRR", fmt: (v: number) => `${v.toFixed(1)}%`, min: 8, max: 18 },
  { key: "roi", label: "ROI", fmt: (v: number) => `${Math.round(v)}%`, min: 120, max: 240 },
  { key: "lcoe", label: "LCOE", fmt: (v: number) => `USD ${v.toFixed(3)}`, min: 0.17, max: 0.23 },
  { key: "dpb", label: "Discounted payback", fmt: (v: number) => `${v.toFixed(1)} yr`, min: 6, max: 20 },
] as const;

/** 95% intervals from 3,000 Monte Carlo runs, drawn as range bars with the mean marked. */
export function MonteCarloRanges() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const on = inView || reduce;
  return (
    <div ref={ref} className="space-y-6" role="img" aria-label="Monte Carlo 95% intervals of NPV, IRR, ROI, LCOE and discounted payback for Case A">
      {MC_ROWS.map((r, i) => {
        const m = T.caseA.mc[r.key];
        const pos = (v: number) => `${((v - r.min) / (r.max - r.min)) * 100}%`;
        return (
          <div key={r.key}>
            <div className="flex items-baseline justify-between gap-4 text-[14px]">
              <span className="font-semibold text-ink">{r.label}</span>
              <span className="num text-body">
                {r.fmt(m.lo)} to {r.fmt(m.hi)} · mean <span className="font-semibold text-ink">{r.fmt(m.mean)}</span>
              </span>
            </div>
            <div className="relative mt-2 h-3 rounded-full bg-white/[0.06]">
              {r.key === "npv" && <span aria-hidden className="absolute inset-y-[-4px] w-px bg-white/40" style={{ left: pos(0) }} />}
              <motion.span
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-cobalt/70 to-helios/80"
                style={{ left: pos(m.lo) }}
                initial={{ width: 0 }}
                animate={{ width: on ? `calc(${pos(m.hi)} - ${pos(m.lo)})` : 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.1 * i }}
              />
              <motion.span
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-ink"
                style={{ left: pos(m.mean) }}
                initial={{ scale: 0 }}
                animate={{ scale: on ? 1 : 0 }}
                transition={{ delay: 0.6 + 0.1 * i }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CaseACharts() {
  const cum = T.caseA.recCf.reduce<number[]>((a, v) => [...a, (a.length ? a[a.length - 1] : 0) + v], []).map((v) => v / 1000);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="How the reported NPV was corrected (USD, 10%)" note="Each row adds one correction to the year-by-year model. The station stays profitable after all of them.">
        <BarList
          label="NPV after each correction to the Case A financial model"
          fmt={(v) => v.toLocaleString("en-US")}
          rows={T.caseA.bridge.map((b, i) => ({ k: b.step, v: b.npv, color: ["#64748B", "#60A5FA", "#A78BFA", "#F59E0B"][i] }))}
        />
      </Panel>
      <Panel title="Risk: 95% intervals from 3,000 Monte Carlo runs" note="Inputs varied: O&M cost, discount rate, degradation and tariff. NPV is positive in 97.2% of the runs." delay={0.06}>
        <MonteCarloRanges />
      </Panel>
      <Panel title="Cumulative cash flow of the rebuilt model (USD thousand)" note="Year. Battery replacement in year 10 shows as the dip." delay={0.04}>
        <LineChart
          x={Array.from({ length: 21 }, (_, t) => (t % 5 === 0 ? `${t}` : ""))}
          yMin={-30}
          yMax={60}
          yTicks={3}
          yFmt={(v) => `${Math.round(v)}`}
          refLine={{ y: 0, label: "break-even", color: "rgba(255,255,255,0.35)" }}
          label="Cumulative cash flow of the Case A station over 20 years"
          series={[{ key: "cum", label: "Cumulative cash flow", values: cum, color: "#F59E0B", area: true }]}
        />
      </Panel>
      <Panel title="Where the manufacturing carbon comes from" note="Share of the manufacturing GWP of 28,196 kgCO₂eq (Monte Carlo mean)." delay={0.08}>
        <BarList
          label="Share of manufacturing GWP by component"
          fmt={(v) => `${v}%`}
          max={100}
          rows={[
            { k: "PV modules", v: 57.9, color: "#60A5FA" },
            { k: "Battery packs (two, with the year-10 replacement)", v: 36.8, color: "#F59E0B" },
            { k: "Balance of system", v: 5.3, color: "#94A3B8" },
          ]}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ Case B */

export function CaseBCharts() {
  const m = T.caseB.months;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="Monthly energy to the 50 kW load (MWh)" note="PV covers between 26% and 37% of the load each month, and the grid supplies the rest.">
        <div className="mb-5">
          <Legend
            items={[
              { label: "From PV", color: "#F59E0B" },
              { label: "From the grid", color: "#60A5FA" },
            ]}
          />
        </div>
        <Columns
          cats={MONTHS}
          height={240}
          fmt={(v) => v.toFixed(0)}
          label="Monthly energy from PV and from the grid for Case B"
          groups={[
            { key: "pv", label: "PV", color: "#F59E0B", values: m.solar },
            { key: "grid", label: "Grid", color: "#4F86F7", values: m.grid },
          ]}
        />
      </Panel>
      <Panel title="Solar fraction and performance ratio by month (%)" delay={0.06} note="Performance ratio is highest in the cool months, when the cells run cooler.">
        <div className="mb-5">
          <Legend
            items={[
              { label: "Performance ratio", color: "#34D399" },
              { label: "Solar fraction", color: "#F59E0B" },
            ]}
          />
        </div>
        <LineChart
          x={MONTHS}
          xEvery={2}
          yMin={0}
          yMax={100}
          yTicks={4}
          yFmt={(v) => `${Math.round(v)}`}
          label="Monthly solar fraction and performance ratio of Case B"
          series={[
            { key: "pr", label: "PR", values: m.pr, color: "#34D399" },
            { key: "sf", label: "SF", values: m.sf, color: "#F59E0B", area: true },
          ]}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ Case C */

export function CaseCCharts() {
  const p = T.caseC.plant;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="Estimated monthly PV energy of the 250.48 kWp plant (MWh)" note="Typical-day screening model on the Case B resource. One year of measured data will replace this estimate.">
        <Columns
          cats={MONTHS}
          height={240}
          fmt={(v) => v.toFixed(0)}
          label="Monthly PV energy of the Case C plant"
          groups={[{ key: "pv", label: "PV", color: "#F59E0B", values: T.caseC.pvMonth.map((v) => v / 1000) }]}
        />
      </Panel>
      <Panel title="The plant on its own, as the owner sees it" delay={0.06} note="All PV energy credited at Tk 11.36/kWh, 10% discount rate, 20 years.">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-[14px]">
            <thead className="bg-white/[0.05] text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Indicator</th>
                <th className="px-4 py-3 text-right font-semibold">PV block</th>
                <th className="px-4 py-3 text-right font-semibold">With ESS</th>
              </tr>
            </thead>
            <tbody className="num">
              {[
                ["Investment", `Tk ${(p.pv.capex / 1e6).toFixed(3)} M`, `Tk ${(p.all.capex / 1e6).toFixed(3)} M`],
                ["NPV", `Tk ${(p.pv.npv / 1e6).toFixed(2)} M`, `Tk ${(p.all.npv / 1e6).toFixed(2)} M`],
                ["IRR", `${p.pv.irr.toFixed(1)}%`, `${p.all.irr.toFixed(1)}%`],
                ["Simple payback", `${p.pv.spb.toFixed(2)} yr`, `${p.all.spb.toFixed(2)} yr`],
                ["Discounted payback", `${p.pv.dpb.toFixed(2)} yr`, `${p.all.dpb.toFixed(2)} yr`],
                ["LCOE", `Tk ${p.pv.lcoe.toFixed(2)}`, `Tk ${p.all.lcoe.toFixed(2)}`],
              ].map(([k, a, b]) => (
                <tr key={k} className="border-t border-white/10">
                  <td className="px-4 py-2.5 text-body">{k}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">{a}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
