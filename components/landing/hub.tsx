"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BatteryCharging, Clock3, Cpu, Gauge, PlugZap, Sun } from "lucide-react";
import { CountUp, Legend, LineChart, Reveal } from "@/components/charts/kit";
import { FleetMap } from "@/components/map/fleet-map";
import { T } from "@/lib/thesis-data";
import { cn } from "@/lib/utils";

type P = "P1" | "P2" | "P3";
const PROFILES: { key: P; label: string; when: string; note: string }[] = [
  { key: "P1", label: "Night charging", when: "22:00–06:00", note: "The habit today: bikes charge after work, so the energy must come from storage or the grid." },
  { key: "P2", label: "Two-shift charging", when: "half in 09:00–16:00", note: "Half of the fleet charges between shifts in daylight. No new equipment is needed." },
  { key: "P3", label: "EMS solar-priority", when: "up to 70% in 08:00–17:00", note: "The energy management system follows the sun and caps the fleet at 150 kW." },
];
const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}`);

function ProfileTabs({ value, onChange }: { value: P; onChange: (p: P) => void }) {
  return (
    <div role="tablist" aria-label="Charging habit" className="glass inline-flex flex-wrap gap-1 rounded-full p-1">
      {PROFILES.map((p) => (
        <button
          key={p.key}
          role="tab"
          aria-selected={value === p.key}
          onClick={() => onChange(p.key)}
          className={cn(
            "relative rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
            value === p.key ? "text-navy-900" : "text-body hover:text-ink"
          )}
        >
          {value === p.key && <motion.span layoutId="profile-pill" className="absolute inset-0 rounded-full bg-helios" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span className="relative">{p.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ the solar day */

function SolarDayChart({ p }: { p: P }) {
  return (
    <LineChart
      key={p}
      x={HOURS}
      xEvery={3}
      yMax={160}
      yFmt={(v) => `${Math.round(v)}`}
      label={`Average-day PV output of the 250.48 kWp plant against the hub load for ${p}`}
      series={[
        { key: "pv", label: "PV output", values: T.caseC.hourly.pv, color: "#F59E0B", area: true },
        { key: "load", label: "Charging load", values: T.caseC.hourly[p], color: "#60A5FA", width: 3 },
      ]}
      height={300}
    />
  );
}

export function HubSection() {
  const [p, setP] = React.useState<P>("P2");
  const f = T.caseC.fin[`${p}-80`];
  const prof = PROFILES.find((x) => x.key === p)!;
  return (
    <section id="hub" aria-labelledby="hub-h" className="section container scroll-mt-24">
      <Reveal>
        <h2 id="hub-h" className="h2">
          The 100-bike solar hub
        </h2>
      </Reveal>
      <Reveal className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="lead">
            The plant has enough sun, but the bikes charge at the wrong time. On an average day the plant gives 960 kWh and 80 bikes need 800 kWh. If they keep
            charging at night, most of it must come from the grid. Pick a charging habit and watch the solar share change.
          </p>
        </div>
        <ProfileTabs value={p} onChange={setP} />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Reveal className="glass rounded-slab p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[15px] font-semibold text-ink">An average day at the hub (kW)</p>
            <Legend
              items={[
                { label: "PV output, 250.48 kWp", color: "#F59E0B" },
                { label: `Charging load, ${prof.label.toLowerCase()}`, color: "#60A5FA" },
              ]}
            />
          </div>
          <div className="mt-6">
            <SolarDayChart p={p} />
          </div>
          <p className="mt-2 text-[12.5px] text-muted">Hour of the day. Typical-day screening model of the thesis, 80% utilisation, ESS not shown.</p>
        </Reveal>

        <Reveal delay={0.08} className="glass-strong flex flex-col rounded-slab p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={p} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
              <p className="flex items-center gap-2 text-[14px] font-semibold text-helios-300">
                <Clock3 className="size-4" /> {prof.label}, {prof.when}
              </p>
              <p className="mt-2 text-[15px] text-body">{prof.note}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: "Solar share", v: <CountUp value={f.sf} suffix="%" /> },
                  { k: "Hub NPV at 10%", v: <CountUp value={f.npv} decimals={2} prefix="BDT " suffix=" M" /> },
                  { k: "IRR", v: <CountUp value={f.irr} decimals={1} suffix="%" /> },
                  { k: "Simple payback", v: <CountUp value={f.spb} decimals={1} suffix=" yr" /> },
                ].map((m) => (
                  <div key={m.k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[1.35rem] font-semibold tracking-snug text-ink">{m.v}</p>
                    <p className="mt-1 text-[12.5px] text-muted">{m.k}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="mt-auto pt-6 text-[13px] text-muted">
            With full net metering the charging time stops mattering: NPV BDT {T.caseC.netMeter.npv} M. Figures assume a flat fee of BDT 250 per charge.
          </p>
        </Reveal>
      </div>

      <Reveal className="glass mt-6 rounded-slab p-3 sm:p-4">
        <div className="h-[clamp(480px,66vh,660px)]">
          <FleetMap p={p} label="Map of Satkhira town with one Easy Bike's two-shift day: from the bus terminal to the charging hub, then to the medical college" />
        </div>
        <p className="px-2 pb-1 pt-3 text-[12px] text-muted">
          One bike&apos;s day on real Satkhira roads (OpenStreetMap, OSRM). The hub is shown at the town; the plant location stays private.
        </p>
      </Reveal>

      <Reveal delay={0.06} className="glass mt-6 grid gap-8 rounded-slab p-6 sm:p-8 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <p className="text-[15px] font-semibold text-ink">How the hub is built</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              { i: PlugZap, t: "100 metered points", d: "Two zones of 50, 1.5 kW each, 150 kW fleet limit" },
              { i: Sun, t: "Solar first", d: "The EMS uses PV whenever it is available and falls back to the grid" },
              { i: BatteryCharging, t: "100 kW ESS", d: "About 193.5 kWh usable: evening support, peak cut and backup" },
              { i: Gauge, t: "250 kVA substation", d: "Load peak 210.5 kVA and export peak 213.8 kVA, both inside the rating" },
              { i: Cpu, t: "IoT monitoring", d: "The Case A platform can track every pack, its charge and temperature" },
              { i: Clock3, t: "Demand", d: "1,000 kWh a day at full use, 10 kWh per bike" },
            ].map(({ i: Icon, t, d }) => (
              <li key={t} className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-helios/15 text-helios-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{t}</p>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <EnergySplit p={p} />
      </Reveal>
    </section>
  );
}

/** Where one day's charging energy comes from at 80% use, for the chosen habit. */
function EnergySplit({ p }: { p: P }) {
  const sf = T.caseC.fin[`${p}-80`].sf;
  const demand = 800;
  const pvDay = Math.round(T.caseC.pvYear / 365);
  const solar = Math.round((demand * sf) / 100);
  const parts = [
    { k: "Sun to bikes", v: solar, c: "bg-helios" },
    { k: "Grid to bikes", v: demand - solar, c: "bg-cobalt" },
  ];
  return (
    <div className="flex flex-col justify-center border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[14px] font-semibold text-ink">One day of charging: 800 kWh</p>
        <p className="num text-[13px] text-muted">plant gives {pvDay} kWh</p>
      </div>
      <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white/[0.06]">
        {parts.map((x) => (
          <motion.span
            key={x.k}
            className={cn("h-full first:rounded-l-full last:rounded-r-full", x.c)}
            initial={false}
            animate={{ width: `${(x.v / demand) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {parts.map((x) => (
          <div key={x.k} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <dt className="flex items-center gap-2 text-[12.5px] text-muted">
              <span className={cn("size-2.5 rounded-full", x.c)} /> {x.k}
            </dt>
            <dd className="num mt-1 text-[1.2rem] font-semibold text-ink">
              <CountUp key={`${p}${x.k}`} value={x.v} suffix=" kWh" />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
