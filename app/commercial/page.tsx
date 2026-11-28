import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarClock, FileWarning, Gauge, Landmark, LineChart as Chart, ShieldAlert } from "lucide-react";
import { PageIntro, SectionNav, SpecList } from "@/components/site/page-intro";
import { CountUp, Reveal } from "@/components/charts/kit";
import { OpexBars, ScenarioExplorer, StorageChoice } from "@/components/commercial/hub-tools";
import { HubSection } from "@/components/landing/hub";
import { DocsCta, Money } from "@/components/landing/results";
import { DriveButton, DriveGlyph } from "@/components/site/download-gate";
import { EMS, MODEL_A, SCHEDULE } from "@/lib/data";
import { T } from "@/lib/thesis-data";

export const metadata: Metadata = {
  title: "Commercial",
  description:
    "A 100-bike solar charging hub on a real 250.48 kWp plant in Satkhira: contract price, energy, returns, charging habits, storage, the fee question, risks and a 12-month roadmap.",
};

const SECTIONS = [
  { id: "explorer-h", label: "Scenarios" },
  { id: "hub-h", label: "The hub" },
  { id: "money-h", label: "Returns" },
  { id: "storage-h", label: "Storage" },
  { id: "ops-h", label: "Operations" },
  { id: "risk-h", label: "Risks" },
  { id: "plan-h", label: "Roadmap" },
] as const;

const RISKS = [
  { i: Landmark, t: "The charging fee", d: "BDT 250 per charge must be allowed under the national guideline. At the BERC rate alone, the central hub has an NPV of about −BDT 2.74 M." },
  { i: Gauge, t: "Real demand", d: "100 bikes at 10 kWh a day is a planning figure. Measured charger load and driver schedules are needed before the design is fixed." },
  { i: FileWarning, t: "ESS energy", d: "The contract states 100 kW but not the energy. The analysis assumes 215 kWh; the datasheet must confirm it." },
  { i: Chart, t: "No measured yield yet", d: "The plant yield is calculated from the Case B resource. One year of monitored generation will replace it." },
  { i: ShieldAlert, t: "Safety and approvals", d: "Fire-safe racks for LFP packs, protection, earthing and the net metering approval are part of the hub works." },
  { i: BadgeCheck, t: "Screening, not bankable", d: "Taxes, financing cost, land cost and owner-side works are not included in the model." },
];

export default function CommercialPage() {
  const c = T.caseC.fin["P2-80"];
  return (
    <>
      <PageIntro
        title="The 100-bike hub on a real plant"
        scene="fleet"
        lead="The plant is built and priced. The hub adds 100 metered charging points, an energy management system and the existing 100 kW ESS. These are the thesis screening results for an investor or an operator."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/downloads" className="inline-flex h-12 items-center gap-2.5 rounded-full bg-helios px-6 text-[15px] font-semibold text-navy-900 transition-colors hover:bg-helios-300">
            Commercial proposal <ArrowRight className="size-[18px]" />
          </Link>
          <DriveButton className="glass inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-[15px] font-semibold text-ink hover:bg-white/10">
            <DriveGlyph className="w-[18px]" /> Drive
          </DriveButton>
        </div>
      </PageIntro>

      <section aria-label="Headline figures" className="container pt-10">
        <div className="glass grid overflow-hidden rounded-slab sm:grid-cols-2 lg:grid-cols-5">
          {[
            { v: 16.515, d: 2, p: "BDT ", s: " M", k: "Total investment", sub: "plant Tk 12.575 M + hub Tk 3.94 M" },
            { v: c.npv, d: 2, p: "BDT ", s: " M", k: "NPV at 10%", sub: "two-shift charging, 80% use" },
            { v: c.irr, d: 1, s: "%", k: "Internal rate of return", sub: "20 years" },
            { v: c.spb, d: 1, s: " yr", k: "Simple payback", sub: `${c.dpb.toFixed(1)} yr discounted` },
            { v: T.caseC.breakEvenU, d: 0, s: "%", k: "Break-even use", sub: "of the 100 points" },
          ].map((n) => (
            <div key={n.k} className="border-white/10 p-6 [&:not(:last-child)]:border-b lg:border-b-0 lg:[&:not(:last-child)]:border-r">
              <p className="text-[clamp(1.5rem,2.3vw,2rem)] font-semibold tracking-display text-ink">
                <CountUp value={n.v} decimals={n.d} prefix={n.p ?? ""} suffix={n.s} />
              </p>
              <p className="mt-2 text-[14px] font-semibold text-body">{n.k}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">{n.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionNav items={SECTIONS} />
      <ScenarioExplorer />
      <HubSection />
      <Money />
      <StorageChoice />

      <section aria-labelledby="ops-h" className="section container">
        <Reveal className="max-w-3xl">
          <h2 id="ops-h" className="h2 scroll-mt-40">
            Operations and running cost
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Reveal className="glass rounded-slab p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">System</p>
            <div className="mt-4">
              <SpecList rows={MODEL_A.system} />
            </div>
          </Reveal>
          <Reveal delay={0.06} className="glass rounded-slab p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">Yearly operating cost, two-shift (BDT lakh)</p>
            <div className="mt-6">
              <OpexBars />
            </div>
            <div className="mt-6">
              <SpecList rows={MODEL_A.money.slice(0, 5)} />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="glass flex flex-col rounded-slab p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">Energy management rules</p>
            <ol className="mt-5 flex flex-1 flex-col justify-between gap-3">
              {EMS.map((e, i) => (
                <li key={e} className="flex gap-3 text-[14.5px] text-body">
                  <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-helios/15 text-[12.5px] font-semibold text-helios-300">{i + 1}</span>
                  {e}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="risk-h" className="section container">
        <Reveal className="max-w-3xl">
          <h2 id="risk-h" className="h2 scroll-mt-40">
            Six risks to settle first
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {RISKS.map(({ i: Icon, t, d }, k) => (
            <Reveal as="li" key={t} delay={0.05 * k} className="glass rounded-panel p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-red-400/10 text-red-200">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[1.15rem] tracking-snug">{t}</h3>
              <p className="mt-2 text-[14.5px] text-body">{d}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="plan-h" className="section container">
        <Reveal className="max-w-3xl">
          <h2 id="plan-h" className="h2 scroll-mt-40">
            A twelve-month roadmap
          </h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-4 lg:grid-cols-6">
          <span aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-helios via-helios/40 to-transparent lg:block" />
          {SCHEDULE.map((s, i) => (
            <Reveal as="li" key={s.k} delay={0.07 * i} className="relative">
              <span className="relative z-10 flex items-center gap-2">
                <span className="grid size-11 place-items-center rounded-full bg-helios text-navy-900">
                  <CalendarClock className="size-5" />
                </span>
              </span>
              <div className="glass mt-4 rounded-panel p-5">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-helios-300">{s.d}</p>
                <p className="mt-2 text-[15px] font-semibold text-ink">{s.k}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <DocsCta />
    </>
  );
}
