"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarList, Columns, CountUp, Reveal } from "@/components/charts/kit";
import { OPEX } from "@/lib/data";
import { T } from "@/lib/thesis-data";
import { cn } from "@/lib/utils";

type P = "P1" | "P2" | "P3";
type U = 60 | 80 | 100;
const HABITS: { key: P; label: string }[] = [
  { key: "P1", label: "Night" },
  { key: "P2", label: "Two-shift" },
  { key: "P3", label: "EMS solar-priority" },
];
const USE: U[] = [60, 80, 100];

function Seg<V extends string | number>({ value, options, onChange, label }: { value: V; options: { v: V; label: string }[]; onChange: (v: V) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="glass inline-flex flex-wrap gap-1 rounded-full p-1">
      {options.map((o) => (
        <button
          key={String(o.v)}
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn("relative rounded-full px-4 py-2 text-[14px] font-semibold transition-colors", value === o.v ? "text-navy-900" : "text-body hover:text-ink")}
        >
          {value === o.v && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-full bg-helios" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Pick a charging habit and a utilisation: every number comes from the thesis hub model. */
export function ScenarioExplorer() {
  const [p, setP] = React.useState<P>("P2");
  const [u, setU] = React.useState<U>(80);
  const f = T.caseC.fin[`${p}-${u}`];
  return (
    <section aria-labelledby="explorer-h" className="section container">
      <Reveal>
        <h2 id="explorer-h" className="h2">
          Scenario explorer
        </h2>
      </Reveal>
      <Reveal className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="lead">Choose how the bikes charge and how busy the hub is. Nine scenarios from the thesis hub model on the real plant and its 100 kW ESS, zero export, BDT 250 per charge, 10% discount rate.</p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <Seg label="Charging habit" value={p} onChange={setP} options={HABITS.map((h) => ({ v: h.key, label: h.label }))} />
          <Seg label="Utilisation" value={u} onChange={setU} options={USE.map((x) => ({ v: x, label: `${x}% use` }))} />
        </div>
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="glass-strong rounded-slab p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={`${p}${u}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 gap-3">
              {[
                { k: "Hub NPV", v: <CountUp value={f.npv} decimals={2} prefix="BDT " suffix=" M" /> },
                { k: "IRR", v: <CountUp value={f.irr} decimals={1} suffix="%" /> },
                { k: "Simple payback", v: <CountUp value={f.spb} decimals={2} suffix=" yr" /> },
                { k: "Discounted payback", v: <CountUp value={f.dpb} decimals={2} suffix=" yr" /> },
                { k: "Solar share", v: <CountUp value={f.sf} decimals={1} suffix="%" /> },
                { k: "Cost per charge", v: <CountUp value={f.costPerCharge} prefix="BDT " /> },
                { k: "Grid import a year", v: <CountUp value={f.imp} decimals={1} suffix=" MWh" /> },
                { k: "Solar energy to the bikes", v: <CountUp value={f.solar} decimals={1} suffix=" MWh" /> },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[1.3rem] font-semibold tracking-snug text-ink">{m.v}</p>
                  <p className="mt-1 text-[12.5px] text-muted">{m.k}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Reveal>
        <Reveal delay={0.06} className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Hub NPV by utilisation, {HABITS.find((h) => h.key === p)!.label.toLowerCase()} (BDT million)</p>
          <div className="mt-8">
            <Columns
              key={p}
              cats={USE.map((x) => `${x}% use`)}
              height={250}
              fmt={(v) => v.toFixed(1)}
              max={52}
              label={`Hub NPV at 60, 80 and 100% use for ${p}`}
              groups={[{ key: "npv", label: "NPV", color: "#F59E0B", values: USE.map((x) => T.caseC.fin[`${p}-${x}`].npv) }]}
            />
          </div>
          <p className="mt-5 text-[13px] text-muted">The hub breaks even at about {Math.round(T.caseC.breakEvenU)}% use with two-shift charging.</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Spare swap packs against the stationary ESS, at the night-charging habit (the hardest case for solar). */
export function StorageChoice() {
  const rows = T.swap.map((s) => ({
    k: s.kind === "none" ? "No storage" : s.kind === "swap" ? `${s.n} swap packs (${s.kwh} kWh)` : `Stationary ESS, ${s.kwh} kWh`,
    v: s.sf,
    color: s.kind === "swap" ? "#F59E0B" : s.kind === "ess" ? "#60A5FA" : "#64748B",
    note: s.kind === "none" ? undefined : `Investment BDT ${s.cap} M · NPV BDT ${s.npv} M`,
  }));
  return (
    <section aria-labelledby="storage-h" className="section container">
      <Reveal>
        <h2 id="storage-h" className="h2">
          Storage: swap packs or the ESS
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col">
          <p className="lead">
            Swap packs carry the sun into the night, but they only pay at the right price. Spare packs charged by day are carried away in the bikes. With 100 packs the solar share reaches 83% even for drivers who keep their night habit. At the
            assumed pack price of Tk 22,500 per kWh, the real ESS at about Tk 17,209 per kWh gives more than three times the NPV gain per taka.
          </p>
          <ul className="mt-8 grid flex-1 auto-rows-fr gap-3">
            {[
              ["In place", "100 kW ESS for evening supply, peak cut and backup during outages"],
              ["Pilot", "20 swap packs to test driver acceptance and get a firm pack price"],
              ["Grid", "Net metering as the store: hub NPV rises to BDT 43.33 M"],
              ["Later", "More packs only if they reach about Tk 17,000 per kWh, near the ESS price"],
            ].map(([a, b]) => (
              <li key={a} className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
                <span className="w-16 shrink-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-helios-300">{a}</span>
                <span className="text-[14.5px] text-body">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06} className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Solar share of the charging energy, night charging at 80% use (%)</p>
          <div className="mt-8">
            <BarList label="Solar share with swap packs and with stationary storage" fmt={(v) => `${v.toFixed(1)}%`} max={100} rows={rows} />
          </div>
          <p className="mt-5 text-[12.5px] text-muted">250.48 kWp plant, zero export. Packs: 6 kWh at Tk 135,000 each, plus Tk 15,000 of rack per pack. ESS rows use the real contract price per kWh.</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Yearly operating cost of the hub by item (BDT lakh). */
export function OpexBars() {
  return <BarList label="Yearly operating cost by item" fmt={(v) => v.toFixed(2)} rows={OPEX.map((o, i) => ({ k: o.k, v: o.v, color: ["#60A5FA", "#F59E0B", "#94A3B8"][i] }))} />;
}
