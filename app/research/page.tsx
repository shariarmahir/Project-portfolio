import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro, SectionNav, SpecList } from "@/components/site/page-intro";
import { FramedRender } from "@/components/site/media";
import { Reveal } from "@/components/charts/kit";
import { CaseACharts, CaseBCharts, CaseCCharts } from "@/components/research/panels";
import { BOM, ECONOMICS, METHOD, PROTOTYPE, STATION_SPECS, THESIS } from "@/lib/data";
import { T } from "@/lib/thesis-data";

export const metadata: Metadata = {
  title: "Research",
  description:
    "The three cases of the thesis: an IoT-enabled 18 kWp station with a 30 W prototype, a 98.4 kWp PVsyst system in Satkhira and a real 250.48 kWp plant, with economics, Monte Carlo risk and a ReCiPe 2016 life cycle assessment.",
};

const SECTIONS = [
  { id: "method", label: "Method" },
  { id: "case-a", label: "Case A" },
  { id: "case-b", label: "Case B" },
  { id: "case-c", label: "Case C" },
  { id: "lens", label: "Reality lens" },
] as const;

function Head({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <Reveal>
      <h2 id={id} className="h2 scroll-mt-40">
        {title}
      </h2>
      <p className="lead mt-5">{lead}</p>
    </Reveal>
  );
}

const FIVE = [
  ["30 W prototype", "Built and measured in the laboratory", "Sensing, 80% SOC control, cloud data link and alarms work on real hardware", "Rated-power efficiency, heat, protection or economics"],
  ["Case A station", "Designed and simulated; economics and LCA calculated", "A full chain from design to disposal; NPV positive in 97% of Monte Carlo runs", "Real cost, real use or measured yield"],
  ["Case B system", "Simulated in PVsyst", "How a 100 kW unit meets a constant load, with every loss known", "Measured performance or a real price"],
  ["Case C plant", "Built; commissioned 9 Sep 2026", "What a commercial plant costs and how it is connected", "Measured yield (not yet recorded)"],
  ["100-bike hub", "Proposed; screening on the real plant", "How charging time, storage and export rules decide the value", "Driver behaviour, measured demand or the allowed fee"],
];

export default function ResearchPage() {
  return (
    <>
      <PageIntro
        title="Three cases, one chain of evidence"
        scene="plant"
        lead={`${THESIS.title}. M.Sc. thesis, ${THESIS.university}, supervised by ${THESIS.supervisor}.`}
      >
        <Link href="/downloads" className="inline-flex h-12 items-center gap-2.5 rounded-full bg-helios px-6 text-[15px] font-semibold text-navy-900 transition-colors hover:bg-helios-300">
          Download the thesis <ArrowRight className="size-[18px]" />
        </Link>
      </PageIntro>
      <SectionNav items={SECTIONS} />

      <section className="section container" aria-labelledby="method">
        <Head id="method" title="Model, monitor, price and account" lead="Each case uses the same four steps where its evidence allows. Case A uses all four; Cases B and C use the energy and money steps on real or simulated systems." />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {METHOD.map((m, i) => (
            <Reveal as="li" key={m.title} delay={0.06 * i} className="glass rounded-panel p-6">
              <span className="num grid size-10 place-items-center rounded-full bg-helios text-[15px] font-semibold text-navy-900">{i + 1}</span>
              <h3 className="mt-5 text-[1.35rem] tracking-display">{m.title}</h3>
              <p className="mt-2 text-[15px]">{m.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section container" aria-labelledby="case-a">
        <Head
          id="case-a"
          title="Case A: the 18 kWp IoT station"
          lead="The station was designed in MATLAB Simulink with MPPT, a buck converter, a bidirectional buck-boost converter and an 80% state-of-charge limit, and linked to ThingSpeak. A 30 W prototype demonstrated the sensing and the cloud link on real hardware."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal className="glass flex flex-col rounded-slab p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">The station</p>
            <div className="mt-4 flex-1">
              <SpecList rows={STATION_SPECS} fill />
            </div>
          </Reveal>
          <Reveal delay={0.06} className="glass flex flex-col rounded-slab p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">Rebuilt 20-year economics</p>
            <div className="mt-4 flex-1">
              <SpecList rows={ECONOMICS} fill />
            </div>
          </Reveal>
        </div>
        <Reveal className="glass mt-6 grid overflow-hidden rounded-slab lg:grid-cols-[1.1fr_1fr]">
          <FramedRender k="station" className="aspect-[16/10] w-full rounded-none lg:aspect-auto lg:h-full" />
          <div className="p-6 sm:p-8">
            <p className="text-[15px] font-semibold text-ink">The 30 W prototype</p>
            <div className="mt-3">
              <SpecList rows={[...PROTOTYPE, ...BOM.slice(1, 6)]} />
            </div>
          </div>
        </Reveal>
        <div className="mt-6">
          <CaseACharts />
        </div>
      </section>

      <section className="section container" aria-labelledby="case-b">
        <Head
          id="case-b"
          title="Case B: the 98.4 kWp Satkhira system"
          lead={`Modelled in PVsyst 7.4.8 at Satkhira with a 51 V, 1,976 Ah LFP bank. It produces ${T.caseB.eProd.toLocaleString("en-US")} kWh a year, ${Math.round(T.caseB.yf).toLocaleString("en-US")} kWh/kWp, at a performance ratio of ${T.caseB.pr}%. It uses ${T.caseB.scr}% of its own output but meets only ${T.caseB.sf}% of the 438 MWh load.`}
        />
        <div className="mt-10">
          <CaseBCharts />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["PV energy to the load", "133,954 kWh"],
            ["Grid energy to the load", "304,046 kWh"],
            ["Cost at planning prices", `Tk ${T.caseB.planCost} M, payback ${T.caseB.planSpb} yr`],
            ["Cost at Case C contract rates", `Tk ${T.caseB.realCost} M, payback ${T.caseB.realSpb} yr`],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={0.05 * i} className="glass rounded-panel p-5">
              <p className="num text-[1.15rem] font-semibold text-ink">{v}</p>
              <p className="mt-1 text-[13.5px] text-muted">{k}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="case-c">
        <Head
          id="case-c"
          title="Case C: the real 250.48 kWp plant"
          lead="404 JINKO 620 Wp modules on five Solis 50 kW on-grid inverters, with a 100 kW hybrid ESS, a 250 kVA substation and net metering under the SREDA guideline. The plant is read at its contract price of Tk 12,575,000, then used as the supply of a 100-bike hub."
        />
        <div className="mt-10">
          <CaseCCharts />
        </div>
        <Reveal className="glass mt-6 rounded-slab p-6 sm:p-8">
          <p className="text-[15px] font-semibold text-ink">Contract price and payment schedule</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <SpecList
              rows={[
                { k: "PV, 250,000 Wp at Tk 35.30/Wp", v: "Tk 8,825,000" },
                { k: "Hybrid ESS, 100 kW", v: "Tk 3,700,000" },
                { k: "Transport", v: "Tk 50,000" },
                { k: "Total contract", v: "Tk 12,575,000" },
                { k: "Per installed kWp", v: `Tk ${T.caseC.totalPerKwp.toLocaleString("en-US")}` },
              ]}
            />
            <ol className="grid gap-2 sm:grid-cols-5">
              {T.caseC.payments.map((p, i) => (
                <li key={p.stage} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="num text-[1.4rem] font-semibold text-helios-300">{Math.round(p.share * 100)}%</p>
                  <p className="mt-1 text-[13px] leading-snug text-body">{p.stage}</p>
                  <p className="num mt-2 text-[12.5px] text-muted">Tk {p.amount.toLocaleString("en-US")}</p>
                  <span className="sr-only">Stage {i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-slab border border-helios/30 bg-helios/[0.07] p-6 sm:p-8">
          <p className="max-w-[60ch] text-[16px] text-body">
            The hub results, the charging habits, the size question and the fee risk are on the commercial page.
          </p>
          <Link href="/commercial" className="inline-flex h-12 items-center gap-2 rounded-full bg-helios px-6 text-[15px] font-semibold text-navy-900 hover:bg-helios-300">
            See the 100-bike hub <ArrowRight className="size-[18px]" />
          </Link>
        </Reveal>
      </section>

      <section className="section container" aria-labelledby="lens">
        <Head
          id="lens"
          title="Five systems judged on real numbers"
          lead="The table does not rank the systems. It states how strong the evidence of each one is, what it really proves and what it cannot prove."
        />
        <Reveal className="glass mt-10 overflow-x-auto rounded-slab">
          <table className="w-full min-w-[760px] text-left text-[14.5px]">
            <thead className="bg-white/[0.05] text-muted">
              <tr>
                {["System", "Status", "What it really proves", "What it cannot prove"].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIVE.map(([a, b, c, d]) => (
                <tr key={a} className="border-t border-white/10 align-top">
                  <td className="px-5 py-4 font-semibold text-ink">{a}</td>
                  <td className="px-5 py-4 text-body">{b}</td>
                  <td className="px-5 py-4 text-body">{c}</td>
                  <td className="px-5 py-4 text-muted">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>
    </>
  );
}
