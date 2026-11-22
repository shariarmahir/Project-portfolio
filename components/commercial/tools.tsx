"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bolt } from "@/components/site/marks";
import { BESS, COMPARE, EMS, OPEX, SCHEDULE, TEN_YEAR } from "@/lib/data";
import { cn, fmtNumber } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CompareModels() {
  const [key, setKey] = React.useState<(typeof COMPARE)[number]["key"]>("capex");
  const c = COMPARE.find((x) => x.key === key)!;
  const max = Math.max(c.a[1], c.b[1]) * 1.05;
  const rows = [
    { label: "300 kWp hub", r: c.a, text: c.aText, cls: "bg-navy" },
    { label: "20 kW net-metered hub", r: c.b, text: c.bText, cls: "bg-helios" },
  ];
  return (
    <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <h3 className="text-2xl tracking-display">Head to head</h3>
        <div role="tablist" aria-label="Measure" className="flex flex-wrap gap-1 rounded-full bg-tint p-1">
          {COMPARE.map((x) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={key === x.key}
              onClick={() => setKey(x.key)}
              className={cn("rounded-full px-4 py-2 text-[14px] font-semibold transition-colors", key === x.key ? "bg-white text-navy shadow-float" : "text-body hover:text-ink")}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 space-y-8">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="font-semibold text-ink">{row.label}</span>
              <span className="num font-semibold text-ink">{row.text}</span>
            </div>
            <div className="relative h-4 rounded-full bg-tint">
              <motion.div className={cn("absolute inset-y-0 left-0 rounded-full", row.cls)} animate={{ width: `${(row.r[0] / max) * 100}%` }} transition={{ duration: 0.7, ease: EASE }} />
              <motion.div
                className={cn("absolute inset-y-0 rounded-r-full opacity-40", row.cls)}
                animate={{ left: `${(row.r[0] / max) * 100}%`, width: `${((row.r[1] - row.r[0]) / max) * 100}%` }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex items-start gap-3 border-t border-line pt-6 text-[16px]">
        <Bolt className="mt-0.5 h-5 w-3.5" />
        <span>
          {c.note} <span className="text-muted">({c.unit})</span>
        </span>
      </p>
    </div>
  );
}

function Readout({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
      {items.map((x) => (
        <div key={x.k}>
          <dt className="text-[13px] text-muted">{x.k}</dt>
          <dd className="num mt-1 text-xl font-semibold tracking-snug text-ink sm:text-2xl">{x.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function UtilizationTool() {
  const [u, setU] = React.useState(100);
  const revenue = (100 * (u / 100) * 250 * 365) / 1e5;
  const profit = revenue - 19.5;
  const payback = profit > 0 ? 227 / profit : Infinity;
  return (
    <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
      <h3 className="text-2xl tracking-display">If fewer bikes turn up</h3>
      <p className="mt-2 text-[15px]">300 kWp hub, BDT 250 a charge, operating cost held at BDT 19.5 lakh a year as in the proposal.</p>
      <div className="mt-8 flex items-baseline justify-between">
        <span className="font-semibold text-ink">Points used each day</span>
        <span className="num text-2xl font-semibold text-cobalt">{u}%</span>
      </div>
      <Slider label="Points used each day" value={[u]} min={40} max={100} step={1} onValueChange={(v) => setU(v[0])} />
      <Readout
        items={[
          { k: "Revenue", v: `${fmtNumber(revenue, 1)} L` },
          { k: "Net profit", v: `${fmtNumber(profit, 1)} L` },
          { k: "Payback", v: Number.isFinite(payback) ? `${fmtNumber(payback, 1)} yrs` : "never" },
        ]}
      />
    </div>
  );
}

export function BudgetTool() {
  const [b, setB] = React.useState(5);
  const a = Math.floor(b / 2.27);
  const n = Math.floor((b * 100) / 22);
  return (
    <div className="rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
      <h3 className="text-2xl tracking-display">What a budget builds</h3>
      <p className="mt-2 text-[15px]">BDT 2.27 crore per 300 kWp hub against a BDT 22 lakh midpoint per net-metered hub.</p>
      <div className="mt-8 flex items-baseline justify-between">
        <span className="font-semibold text-ink">Budget</span>
        <span className="num text-2xl font-semibold text-cobalt">BDT {b.toFixed(1)} crore</span>
      </div>
      <Slider label="Budget in crore" value={[b]} min={0.5} max={20} step={0.5} onValueChange={(v) => setB(v[0])} />
      <Readout
        items={[
          { k: "300 kWp hubs", v: String(a) },
          { k: "Net-metered hubs", v: String(n) },
          { k: "Extra kWp (net-metered)", v: fmtNumber(n * 20 - a * 300.08, 0) },
        ]}
      />
    </div>
  );
}

function TenYear() {
  const reduce = useReducedMotion();
  const max = 760;
  return (
    <div>
      <p className="text-[15px]">Cumulative net operating profit, BDT lakh, constant assumptions. The line marks the BDT 227 lakh investment.</p>
      <div className="relative mt-10 flex h-72 items-end gap-2 sm:gap-4">
        <div className="absolute inset-x-0 border-t-2 border-dashed border-helios" style={{ bottom: `${(227 / max) * 100}%` }}>
          <span className="absolute -top-7 right-0 text-[13px] font-semibold text-helios-600">Investment recovered</span>
        </div>
        {TEN_YEAR.map((d, i) => (
          <div key={d.year} className="flex h-full flex-1 flex-col items-center justify-end">
            <motion.div
              className={cn("w-full rounded-t-xl", d.cumulative >= 227 ? "bg-navy" : "bg-cobalt-300")}
              initial={reduce ? false : { height: 0 }}
              whileInView={{ height: `${(d.cumulative / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
              title={`Year ${d.year}: ${d.cumulative} lakh`}
            />
            <span className="num mt-2 text-[12px] font-semibold text-muted">Y{d.year}</span>
          </div>
        ))}
      </div>
      <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
        {[
          ["Five-year surplus", "BDT 1.32 crore"],
          ["Ten-year surplus", "BDT 4.91 crore"],
          ["Ten-year simple ROI", "≈ 216%"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[13px] text-muted">{k}</dt>
            <dd className="num mt-1 text-2xl font-semibold tracking-snug text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function HubDossier() {
  const total = OPEX.reduce((s, o) => s + o.v, 0);
  return (
    <Tabs defaultValue="roi">
      <TabsList aria-label="300 kWp hub details">
        <TabsTrigger value="roi">Ten-year return</TabsTrigger>
        <TabsTrigger value="opex">Running cost</TabsTrigger>
        <TabsTrigger value="ems">Energy management</TabsTrigger>
        <TabsTrigger value="bess">Storage phases</TabsTrigger>
        <TabsTrigger value="schedule">Build schedule</TabsTrigger>
      </TabsList>
      <div className="mt-8 rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
        <TabsContent value="roi" className="mt-0">
          <TenYear />
        </TabsContent>
        <TabsContent value="opex" className="mt-0">
          <p className="text-[15px]">Annual operating cost of BDT {total.toFixed(2)} lakh against BDT 91.25 lakh gross revenue (100 bikes × BDT 250 × 365 days).</p>
          <ul className="mt-8 space-y-6">
            {OPEX.map((o, i) => (
              <li key={o.k}>
                <div className="mb-2 flex justify-between gap-4">
                  <span className="font-semibold text-ink">{o.k}</span>
                  <span className="num font-semibold text-ink">BDT {o.v.toFixed(2)} L</span>
                </div>
                <div className="h-3 rounded-full bg-tint">
                  <div className={cn("h-full rounded-full", i === 0 ? "bg-navy" : "bg-cobalt-300")} style={{ width: `${(o.v / total) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="ems" className="mt-0">
          <p className="measure text-[15px]">
            300 kWp array → DC isolators and combiners → six 50 kW inverters → main AC bus and grid → LT panel with EMS → Zone A (50 points) and Zone B (50 points).
          </p>
          <ol className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {EMS.map((e, i) => (
              <li key={e} className="flex items-baseline gap-4 border-b border-line py-4">
                <span className="num w-6 shrink-0 font-semibold text-cobalt">{i + 1}</span>
                <span className="text-ink">{e}</span>
              </li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="bess" className="mt-0">
          <ol className="grid gap-8 md:grid-cols-4">
            {BESS.map((p) => (
              <li key={p.phase} className="border-t-2 border-navy pt-5">
                <p className="text-[14px] font-semibold text-cobalt">{p.phase}</p>
                <p className="mt-1 text-2xl font-semibold tracking-display text-ink">{p.storage}</p>
                <p className="mt-2 text-[15px]">{p.purpose}</p>
              </li>
            ))}
          </ol>
        </TabsContent>
        <TabsContent value="schedule" className="mt-0">
          <p className="text-[15px]">Overall delivery: about 30–60 days after the site is ready, with overlapping work packages.</p>
          <ol className="mt-6">
            {SCHEDULE.map((s) => (
              <li key={s.k} className="spec-row">
                <span className="text-ink">{s.k}</span>
                <span className="num font-semibold text-ink">{s.d}</span>
              </li>
            ))}
          </ol>
        </TabsContent>
      </div>
    </Tabs>
  );
}
