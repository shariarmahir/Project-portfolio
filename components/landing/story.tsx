"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CountUp, Donut, Reveal, useReduced } from "@/components/charts/kit";
import { T } from "@/lib/thesis-data";

/* ------------------------------------------------------------------ key numbers */

const NUMBERS = [
  { v: T.caseC.kwp, d: 2, s: " kWp", k: "Real plant, commissioned 9 Sep 2026", sub: "404 × JINKO 620 Wp" },
  { v: T.caseC.pvYear / 1000, d: 0, s: " MWh", k: "PV energy a year", sub: "960 kWh on an average day" },
  { v: T.caseC.co2Year, d: 0, s: " t", k: "CO₂ avoided a year", sub: "at 0.619 kg per grid kWh" },
  { v: 100, d: 0, s: "", k: "Easy Bike charging points", sub: "two zones of 50, 1.5 kW each" },
  { v: 35.3, d: 2, p: "Tk ", s: "/W", k: "Real PV contract price", sub: "44% below planning prices" },
  { v: T.caseC.fin["P2-80"].sf, d: 0, s: "%", k: "Solar share with daytime charging", sub: "23% if bikes charge at night" },
];

export function KeyNumbers() {
  return (
    <section id="numbers" aria-label="Key numbers" className="container scroll-mt-28 pb-6 pt-10">
      <div className="glass grid overflow-hidden rounded-slab sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {NUMBERS.map((n, i) => (
          <Reveal key={n.k} delay={0.05 * i} className="border-white/10 p-6 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:[&:not(:last-child)]:border-r">
            <p className="whitespace-nowrap text-[clamp(1.55rem,1.95vw,2.1rem)] font-semibold tracking-display text-ink">
              <CountUp value={n.v} decimals={n.d} prefix={n.p ?? ""} suffix={n.s} />
            </p>
            <p className="mt-2 text-[14px] font-semibold text-body">{n.k}</p>
            <p className="mt-0.5 text-[12.5px] text-muted">{n.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ the problem */

const MIX = [
  { k: "Natural gas", v: 44, color: "#4F86F7" },
  { k: "Heavy fuel oil", v: 24, color: "#A78BFA" },
  { k: "Coal, imports and other sources", v: 27.87, color: "#64748B" },
  { k: "Renewable energy", v: 4.13, color: "#FCD34D" },
];

export function Problem() {
  return (
    <section aria-labelledby="problem" className="section container">
      <Reveal>
        <h2 id="problem" className="h2">
          Why Bangladesh needs solar charging
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <p className="lead">
              In 2024 natural gas made 44% of the country&apos;s electricity and heavy fuel oil another 24%, while renewable energy reached only 4.13%. Each grid kWh
              carries about 0.619 kg of CO₂. Easy Bikes add a large evening and night load, often through uncontrolled or unauthorised connections.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { v: "6.2 kg", k: "CO₂ from one 10 kWh charge on the grid" },
              { v: "181 t", k: "CO₂ a year from a grid-fed hub serving 80 bikes a day" },
              { v: "21.8%", k: "national emission cut promised by 2030, net zero by 2050" },
            ].map((f, i) => (
              <Reveal key={f.k} delay={0.08 * i} className="glass rounded-panel p-5">
                <p className="num text-[1.6rem] font-semibold tracking-display text-helios-300">{f.v}</p>
                <p className="mt-2 text-[14px] leading-snug text-body">{f.k}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.1} className="glass rounded-slab p-6 sm:p-10">
          <p className="text-[15px] font-semibold text-ink">Electricity generation in Bangladesh, 2024</p>
          <div className="mt-6 grid items-center gap-8 sm:grid-cols-[1fr_1fr]">
            <Donut
              parts={MIX}
              label="Generation mix 2024: gas 44%, heavy fuel oil 24%, coal, imports and other 27.9%, renewable 4.13%"
              center={
                <div>
                  <p className="num text-[2rem] font-semibold text-ink">4.13%</p>
                  <p className="text-[12px] text-muted">renewable</p>
                </div>
              }
            />
            <ul className="space-y-3">
              {MIX.map((m) => (
                <li key={m.k} className="flex items-start gap-3 text-[14px]">
                  <span className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: m.color }} />
                  <span className="flex-1 text-body">{m.k}</span>
                  <span className="num font-semibold text-ink">{m.v}%</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-[12.5px] text-muted">Gas, oil and renewable shares as reported in the thesis. The remainder is shown together.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ three cases */

const CASES = [
  {
    id: "A",
    title: "18 kWp IoT charging station",
    status: "Designed, simulated and demonstrated with a 30 W prototype",
    img: "/media/renders/station.webp",
    alt: "3D render of the Case A station with its 30 kWh cabinet, ESP32 mast and live data panel",
    facts: [
      ["Energy", "23.9 MWh/yr at PR ≈ 84%"],
      ["NPV at 10%", "USD 5,963 (97% of runs positive)"],
      ["IRR / LCOE", "13.8% / USD 0.20 per kWh"],
      ["Lifecycle GWP", "32,813 → 24,020 kgCO₂eq with recycling"],
    ],
    href: "/research#case-a",
  },
  {
    id: "B",
    title: "98.4 kWp grid-connected system",
    status: "Simulated in PVsyst 7.4.8 for a constant 50 kW load in Satkhira",
    img: "/media/renders/rooftop.webp",
    alt: "3D render of rows of tilted solar modules on a factory roof",
    facts: [
      ["Energy", "135,831 kWh/yr, 1,380 kWh/kWp"],
      ["Performance ratio", "83.39%"],
      ["Solar fraction", "30.58% of a 438 MWh load"],
      ["Payback", "3.5 yr at real prices (6.8 yr planning)"],
    ],
    href: "/research#case-b",
  },
  {
    id: "C",
    title: "250.48 kWp plant and a 100-bike hub",
    status: "Built and commissioned in Satkhira on 9 September 2026",
    img: "/media/renders/plant.webp",
    alt: "3D aerial render of the roof plant, the ESS, the substation and the 100-bike canopy",
    facts: [
      ["Contract", "Tk 1.2575 crore, Tk 50,204 per kWp"],
      ["Energy", "≈ 350 MWh/yr, 216.9 t CO₂ avoided"],
      ["Plant payback", "2.3 yr PV, 3.3 yr with ESS"],
      ["Hub NPV (two-shift)", "BDT 31.17 M, IRR 35.5%"],
    ],
    href: "/commercial",
  },
];

function CaseCard({ c, i, total }: { c: (typeof CASES)[number]; i: number; total: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0.6, 1], [1, reduce ? 1 : 1 - (total - i) * 0.02]);
  return (
    <div ref={ref} className="sticky" style={{ top: `${96 + i * 22}px` }}>
      <motion.article style={{ scale }} className="glass-strong grid origin-top overflow-hidden rounded-slab lg:grid-cols-[1fr_1.1fr]">
        <div className="relative min-h-[240px] lg:min-h-[420px]">
          <Image src={c.img} alt={c.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="kb-drift object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-canvas/40" />
          <span className="glass absolute left-5 top-5 grid size-16 place-items-center rounded-2xl text-[1.9rem] font-bold text-ink">{c.id}</span>
        </div>
        <div className="flex flex-col p-7 sm:p-10">
          <h3 className="h3">{c.title}</h3>
          <p className="mt-3 text-[15px] text-muted">{c.status}</p>
          <dl className="mt-6">
            {c.facts.map(([k, v]) => (
              <div key={k} className="spec-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <Link href={c.href} className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold text-helios-300 hover:text-helios">
            Read Case {c.id} <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.article>
    </div>
  );
}

export function Cases() {
  return (
    <section aria-labelledby="cases" className="section container">
      <Reveal className="max-w-3xl">
        <h2 id="cases" className="h2">
          Three cases, kept separate
        </h2>
        <p className="lead mt-5">
          The supervisor asked for three cases with their own evidence. Case A follows one station from design to disposal, Case B models a grid-connected system,
          and Case C reads a real plant at its contract price and asks what it can do for 100 Easy Bikes.
        </p>
      </Reveal>
      <div className="mt-12 space-y-8">
        {CASES.map((c, i) => (
          <CaseCard key={c.id} c={c} i={i} total={CASES.length} />
        ))}
      </div>
    </section>
  );
}
