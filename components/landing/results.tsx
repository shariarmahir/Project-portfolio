"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { BarList, CountUp, Legend, LineChart, Reveal, Ring } from "@/components/charts/kit";
import { DriveButton, DriveGlyph } from "@/components/site/download-gate";
import { T } from "@/lib/thesis-data";

const YEARS = Array.from({ length: 21 }, (_, t) => (t % 5 === 0 ? `${t}` : ""));
const KWP = T.sweep.P1.map((s) => (s.kwp === 98.4 ? "98.4" : s.kwp === 250.48 ? "250" : `${s.kwp}`));

/* ------------------------------------------------------------------ money */

export function Money() {
  return (
    <section aria-labelledby="money-h" className="section container">
      <Reveal className="max-w-3xl">
        <h2 id="money-h" className="h2">
          The business case
        </h2>
        <p className="lead mt-5">
          The plant pays back in about three years, and the hub depends on one fee. At its contract price of Tk 12.575 million the plant replaces grid energy worth about Tk 3.98 million a year. The hub adds chargers, metering and controls for
          Tk 3.94 million, so the whole investment is Tk 16.515 million, and it earns from a flat fee per charge.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Cumulative cash flow of the plant (Tk million)</p>
          <div className="mt-3">
            <Legend
              items={[
                { label: `PV block, payback ${T.caseC.plant.pv.spb.toFixed(1)} yr`, color: "#F59E0B" },
                { label: `Whole contract with ESS, payback ${T.caseC.plant.all.spb.toFixed(1)} yr`, color: "#60A5FA" },
              ]}
            />
          </div>
          <div className="mt-5">
            <LineChart
              x={YEARS}
              yMin={-20}
              yMax={80}
              yTicks={5}
              yFmt={(v) => `${Math.round(v)}`}
              refLine={{ y: 0, label: "break-even", color: "rgba(255,255,255,0.35)" }}
              label="Cumulative cash flow of the Case C plant over 20 years for the PV block and the whole contract"
              series={[
                { key: "pv", label: "PV block", values: T.caseC.cumPv, color: "#F59E0B", area: true },
                { key: "all", label: "Whole contract", values: T.caseC.cumAll, color: "#60A5FA" },
              ]}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-muted">Year. All PV energy credited at Tk 11.36/kWh, 0.5%/yr degradation, inverter and ESS replacement in year 12.</p>
        </Reveal>

        <Reveal delay={0.08} className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Hub NPV at 10% by charging habit (BDT million)</p>
          <div className="mt-8">
            <BarList
              label="Hub NPV by scenario"
              fmt={(v) => `${v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}`}
              rows={[
                { k: "Night charging", v: T.caseC.fin["P1-80"].npv, color: "#64748B" },
                { k: "Two-shift charging", v: T.caseC.fin["P2-80"].npv, color: "#F59E0B" },
                { k: "EMS solar-priority", v: T.caseC.fin["P3-80"].npv, color: "#FCD34D" },
                { k: "Full net metering", v: T.caseC.netMeter.npv, color: "#34D399" },
                { k: "Fee limited to the BERC rate", v: T.caseC.feeRisk.npv, color: "#F87171", note: "Two-shift, if only Tk 113.60 could be billed for a 10 kWh charge" },
              ]}
            />
          </div>
          <p className="mt-6 text-[12.5px] text-muted">80% utilisation, BDT 250 per charge, 20 years. Break-even at about {Math.round(T.caseC.breakEvenU)}% use.</p>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">How big should the solar part of a hub be? NPV (BDT million) against PV size</p>
          <div className="mt-3">
            <Legend
              items={[
                { label: "Night", color: "#94A3B8" },
                { label: "Two-shift", color: "#F59E0B" },
                { label: "EMS solar-priority", color: "#FCD34D" },
                { label: "Two-shift with export credit", color: "#34D399", dash: true },
              ]}
            />
          </div>
          <div className="mt-5">
            <LineChart
              x={KWP}
              yMin={0}
              yMax={50}
              yTicks={5}
              yFmt={(v) => `${Math.round(v)}`}
              label="Hub NPV against PV size for three charging habits and with export credit"
              series={[
                { key: "p1", label: "Night", values: T.sweep.P1.map((s) => s.npv), color: "#94A3B8" },
                { key: "p2", label: "Two-shift", values: T.sweep.P2.map((s) => s.npv), color: "#F59E0B" },
                { key: "p3", label: "EMS", values: T.sweep.P3.map((s) => s.npv), color: "#FCD34D" },
                { key: "p2nm", label: "Two-shift, export credit", values: T.sweep["P2-nm"].map((s) => s.npv), color: "#34D399", dash: true },
              ]}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-muted">kWp. Without paid export, about 100–150 kWp gives the best return. With export credit, the full 250 kWp is best.</p>
        </Reveal>
        <Reveal delay={0.08} className="glass-strong flex flex-col rounded-slab border-red-300/25 p-6 sm:p-8">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold text-red-200">
            <AlertTriangle className="size-5" /> The one question that decides the business
          </p>
          <p className="mt-4 text-[15.5px] text-body">
            The national charging guideline says the tariff is set by BERC. The hub model charges BDT 250 per charge, Tk 25 per kWh for a 10 kWh charge, more than
            twice the BERC rate of Tk 11.36.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { v: <CountUp value={T.caseC.feeRisk.npv} decimals={2} suffix=" M" />, k: "NPV, BDT" },
              { v: <CountUp value={T.caseC.feeRisk.irr} decimals={1} suffix="%" />, k: "IRR" },
              { v: <CountUp value={T.caseC.feeRisk.spb} decimals={1} suffix=" yr" />, k: "payback" },
            ].map((m) => (
              <div key={m.k} className="rounded-2xl border border-red-300/20 bg-red-400/[0.07] p-3.5">
                <p className="text-[1.2rem] font-semibold text-ink">{m.v}</p>
                <p className="mt-0.5 text-[12px] text-muted">{m.k}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {[
              { k: "Hub fee, BDT 250 per 10 kWh charge", v: 25, c: "bg-helios" },
              { k: "BERC tariff", v: 11.36, c: "bg-red-300" },
            ].map((b) => (
              <div key={b.k}>
                <div className="flex justify-between text-[13px]">
                  <span className="text-body">{b.k}</span>
                  <span className="num font-semibold text-ink">Tk {b.v.toFixed(2)}/kWh</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.span
                    className={`block h-full rounded-full ${b.c}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(b.v / 25) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-auto pt-6 text-[14px] text-muted">If only the BERC rate could be billed, the central hub would not pay at a 10% discount rate. The fee must be confirmed before any investment.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ impact + reality lens */

export function Impact() {
  return (
    <section aria-labelledby="impact-h" className="section container">
      <Reveal className="max-w-3xl">
        <h2 id="impact-h" className="h2">
          What one plant changes
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {[
          { v: T.caseC.co2Year, d: 1, s: " t", k: "CO₂ avoided a year by one plant like Case C", sub: "more than the yearly charging emission of a grid-fed hub (181 t)" },
          { v: T.lens.scale1000.gwh, d: 0, s: " GWh", k: "a year from 1,000 such plants on market and factory roofs", sub: `about ${T.lens.scale1000.co2kt} thousand tonnes of CO₂ avoided a year` },
          { v: T.lens.scale1000.crore, d: 0, p: "Tk ", s: " crore", k: "investment for 1,000 plants at the Case C price", sub: "a thought experiment, not a forecast" },
        ].map((n, i) => (
          <Reveal key={n.k} delay={0.07 * i} className="glass rounded-slab p-7">
            <p className="text-[clamp(2rem,3.4vw,2.8rem)] font-semibold tracking-display text-helios-300">
              <CountUp value={n.v} decimals={n.d} prefix={n.p ?? ""} suffix={n.s} />
            </p>
            <p className="mt-3 text-[15px] font-semibold text-ink">{n.k}</p>
            <p className="mt-1 text-[13.5px] text-muted">{n.sub}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal className="glass flex flex-col rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Life cycle of the Case A station (kgCO₂eq, ReCiPe 2016)</p>
          <div className="mt-8">
            <BarList
              label="Manufacturing and lifecycle global warming potential under landfill and recycling"
              fmt={(v) => v.toLocaleString("en-US")}
              rows={[
                { k: "Manufacturing (30,000 Monte Carlo runs)", v: 28196, color: "#94A3B8" },
                { k: "Whole life, informal landfill", v: 32813, color: "#F87171" },
                { k: "Whole life, formal recycling", v: 24020, color: "#34D399", note: "−8,793 kgCO₂eq, a 26.8% cut" },
              ]}
            />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
            {[
              { v: "1.5–2.1 yr", k: "to repay its lifecycle carbon on delivered energy" },
              { v: "0.0558 kg", k: "CO₂eq per kWh delivered, about eleven times less than the grid" },
            ].map((t) => (
              <div key={t.v} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="num text-[1.3rem] font-semibold text-leaf">{t.v}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-muted">{t.k}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">The thesis in six numbers</p>
          <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3">
            <Ring value={T.caseC.fin["P2-80"].sf} label="Solar share" sub="two-shift charging, Case C" />
            <Ring value={97.2} label="NPV positive" sub="of 3,000 runs, Case A" color="#34D399" />
            <Ring value={26.8} label="GWP cut" sub="formal recycling, Case A" color="#60A5FA" />
            <Ring value={83.39} label="Performance ratio" sub="Case B, PVsyst" color="#FCD34D" />
            <Ring value={98.62} label="Self-consumption" sub="Case B" color="#A78BFA" />
            <Ring value={T.lens.gapPv} label="Below planning" sub="real PV price, Case C" color="#F59E0B" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function RealityLens() {
  return (
    <section aria-labelledby="lens-h" className="section container">
      <Reveal>
        <h2 id="lens-h" className="h2">
          The reality lens
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <Reveal>
          <p className="lead">
            A real quotation changed more than any refinement of the model. The PV in the Case C contract cost Tk 35,232 per installed kWp, 43.6% below the planning centre of Tk 62,500. The ESS cost about Tk 17,209 per kWh with
            its power conversion, 50.8% below the planning value. Re-priced, the Case B payback falls from 6.8 to 3.5 years.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { a: "Tk 62,500", b: "Tk 35,232", k: "PV per kWp, planning against contract" },
              { a: "Tk 35,000", b: "Tk 17,209", k: "storage per kWh, planning against contract" },
            ].map((x) => (
              <div key={x.k} className="glass rounded-panel p-5">
                <p className="text-[14px] text-muted line-through decoration-red-300/70">{x.a}</p>
                <p className="num mt-1 text-[1.6rem] font-semibold tracking-display text-ink">{x.b}</p>
                <p className="mt-2 text-[13px] leading-snug text-muted">{x.k}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08} className="glass rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Levelised cost of energy (Tk per kWh)</p>
          <div className="mt-10">
            <BarList
              label="Levelised cost of energy of each system against the grid tariff of Tk 11.36 per kWh"
              fmt={(v) => v.toFixed(2)}
              max={26}
              refLine={{ v: T.lens.tariff, label: "grid tariff Tk 11.36" }}
              rows={T.lens.lcoe.map((r, i) => ({ k: r.k, v: r.v, color: ["#A78BFA", "#64748B", "#60A5FA", "#34D399", "#F59E0B"][i] }))}
            />
          </div>
          <p className="mt-6 text-[13.5px] text-body">
            A stand-alone station pays for its independence with storage. The grid-connected systems all generate below the tariff, and scale and a local contract do
            the rest.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ documents */

export function DocsCta() {
  return (
    <section aria-labelledby="docs-h" className="container pb-[clamp(4rem,8vw,7rem)]">
      <Reveal className="glass-strong relative overflow-hidden rounded-slab p-8 sm:p-14">
        <div aria-hidden className="sun-rays absolute -right-40 -top-40 size-[520px] opacity-60" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <h2 id="docs-h" className="h2">
              Every document in one place
            </h2>
            <p className="lead mt-5">The thesis, the book, the IEEE paper, two proposals and two decks. Every file is checked against its format rules and rebuilt from one model. Downloads and the shared drive use the same access password.</p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link href="/downloads" className="inline-flex h-14 items-center gap-2.5 rounded-full bg-helios px-8 text-base font-semibold text-navy-900 transition-colors hover:bg-helios-300">
              Open the library <ArrowRight className="size-[18px]" />
            </Link>
            <DriveButton className="glass inline-flex h-14 items-center gap-3 rounded-full px-7 text-base font-semibold text-ink transition-colors hover:bg-white/10">
              <DriveGlyph className="w-5" /> Google Drive
            </DriveButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
