import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro, SpecList } from "@/components/site/page-intro";
import { FramedPhoto } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { LcaCharts, MonteCarlo } from "@/components/research/charts";
import { Button } from "@/components/ui/button";
import { BOM, ECONOMICS, LCA, METHOD, NET_METERED, PROTOTYPE, STATION_SPECS, THESIS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
  description: "Method, results and evidence from the MSc thesis on IoT solar charging stations in Bangladesh.",
};

export default function ResearchPage() {
  return (
    <>
      <PageIntro
        kicker="The thesis"
        title="One station, followed from model to recycling plant"
        lead={THESIS.title}
        photo="panelsSky"
      >
        <Button asChild variant="navy">
          <Link href="/downloads">
            Download the thesis <ArrowRight />
          </Link>
        </Button>
      </PageIntro>

      {/* Abstract */}
      <section aria-labelledby="abstract" className="container grid gap-12 py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <div>
          <h2 id="abstract" className="h2">
            Abstract
          </h2>
          <dl className="mt-10 space-y-5 text-[15px]">
            {[
              ["Degree", THESIS.degree],
              ["Institution", THESIS.university],
              ["Supervisor", THESIS.supervisor],
              ["Defense", THESIS.defense],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          {THESIS.abstract.map((p, i) => (
            <p key={i} className={i === 0 ? "statement" : "measure mt-6 text-lg"}>
              {p}
            </p>
          ))}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-navy">
            {THESIS.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Method */}
      <section aria-labelledby="method" className="bg-navy py-28 text-white/80">
        <div className="container">
          <h2 id="method" className="h2 max-w-[16ch] !text-white">
            Four instruments, one chain
          </h2>
          <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {METHOD.map((m, i) => (
              <li key={m.title} className="border-t-2 border-helios pt-6">
                <p className="num text-[15px] font-semibold text-helios">Stage {i + 1}</p>
                <h3 className="mt-2 text-2xl tracking-display !text-white">{m.title}</h3>
                <p className="mt-3 text-[16px]">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Station + economics */}
      <section aria-labelledby="station" className="container grid gap-14 py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="station" className="h2 max-w-[14ch]">
            The 18 kWp station
          </h2>
          <p className="measure mt-6 text-lg">Simulated in PVsyst for a site at Farmgate, Dhaka, near the University of Asia Pacific campus, over a 20-year life.</p>
          <div className="mt-10">
            <SpecList rows={STATION_SPECS} />
          </div>
        </div>
        <div>
          <h3 className="h3">Economics, off-grid baseline</h3>
          <div className="mt-8">
            <SpecList rows={ECONOMICS} />
          </div>
          <div className="mt-10 rounded-panel bg-tint p-7">
            <h4 className="flex items-center gap-3 text-xl tracking-display">
              <Bolt /> Net-metered scenario
            </h4>
            <div className="mt-4">
              <SpecList rows={NET_METERED} />
            </div>
          </div>
        </div>
      </section>

      {/* Monte Carlo */}
      <section aria-labelledby="risk" className="bg-tint py-28">
        <div className="container">
          <h2 id="risk" className="h2 max-w-[18ch]">
            How risky are the returns?
          </h2>
          <p className="measure mt-6 text-lg">
            Every input that could move the result was varied at once, three thousand times. Even the worst 2.5% of NPV outcomes stay positive.
          </p>
          <div className="mt-12">
            <MonteCarlo />
          </div>
        </div>
      </section>

      {/* LCA */}
      <section aria-labelledby="lca" className="container py-28">
        <h2 id="lca" className="h2 max-w-[20ch]">
          What it costs the planet, mine to recycling plant
        </h2>
        <p className="measure mt-6 text-lg">
          Cradle-to-grave, ReCiPe 2016 Midpoint (H), ten impact categories and two end-of-life routes, propagated over
          30,000 iterations. Carbon payback falls between 1.5 and 2.0 years, and each delivered kWh carries 0.0558 kgCO₂eq, 11.1 times below the national grid factor.
        </p>
        <div className="mt-12">
          <LcaCharts />
        </div>
        <div className="mt-6 rounded-panel bg-white p-6 ring-1 ring-line sm:p-10">
          <h3 className="text-2xl tracking-display">PV module impact profile</h3>
          <div className="mt-6">
            <SpecList rows={LCA.pvImpacts} />
          </div>
        </div>
      </section>

      {/* Prototype */}
      <section aria-labelledby="prototype" className="container grid gap-14 pb-8 lg:grid-cols-2 lg:gap-20">
        <div className="grid content-start gap-5">
          <FramedPhoto k="circuit" className="aspect-[4/3] w-full" />
          <FramedPhoto k="chip" className="aspect-[16/10] w-full lg:ml-auto lg:w-3/4" />
        </div>
        <div>
          <h2 id="prototype" className="h2 max-w-[14ch]">
            The prototype on the bench
          </h2>
          <p className="measure mt-6 text-lg">
            A 30 W build validated the control logic, sensor calibration and cellular uplink. Readings streamed to ThingSpeak, with email and IFTTT alerts and CSV export.
          </p>
          <h3 className="mt-12 text-xl tracking-display">Measured behaviour</h3>
          <div className="mt-3">
            <SpecList rows={PROTOTYPE} />
          </div>
          <h3 className="mt-12 text-xl tracking-display">Bill of materials</h3>
          <div className="mt-3">
            <SpecList rows={BOM} />
          </div>
        </div>
      </section>
    </>
  );
}
