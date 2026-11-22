import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/site/page-intro";
import { Carousel } from "@/components/site/media";
import { BudgetTool, CompareModels, HubDossier, UtilizationTool } from "@/components/commercial/tools";
import { Button } from "@/components/ui/button";
import { AUDIT_HREF, MODEL_A, MODEL_B } from "@/lib/data";
import type { PhotoKey } from "@/lib/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Commercial",
  description: "Two deployment models for solar Easy Bike charging in Bangladesh: a 300 kWp depot hub and a 20 kW net-metered neighbourhood hub.",
};

function ModelPanel({
  m,
  dark,
  images,
  label,
}: {
  m: typeof MODEL_A | typeof MODEL_B;
  dark?: boolean;
  images: PhotoKey[];
  label: string;
}) {
  return (
    <section className={cn("rounded-t-slab", dark ? "bg-navy text-white/80" : "bg-tint")} aria-label={m.name}>
      <div className="container grid gap-12 py-24 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className={cn("text-[17px] font-semibold", dark ? "text-helios" : "text-cobalt")}>{label}</p>
          <h2 className={cn("h2 mt-3", dark && "!text-white")}>{m.name}</h2>
          <p className={cn("mt-3 text-xl font-semibold tracking-snug", dark ? "text-white" : "text-ink")}>{m.sub}</p>
          <p className="measure mt-6 text-lg">{m.bestFor}</p>
          <Carousel keys={images} label={`${m.name} images`} className="mt-10 aspect-[4/3] w-full" />
        </div>
        <div className={cn("grid gap-10 rounded-panel p-7 sm:p-10", dark ? "bg-navy-600" : "bg-white")}>
          {[
            ["System", m.system],
            ["Money", m.money],
          ].map(([title, rows]) => (
            <div key={title as string}>
              <h3 className={cn("text-xl tracking-display", dark && "!text-white")}>{title as string}</h3>
              <dl className="mt-3">
                {(rows as { k: string; v: string }[]).map((r) => (
                  <div key={r.k} className={cn("spec-row", dark && "border-white/15")}>
                    <dt className={dark ? "!text-white/70" : undefined}>{r.k}</dt>
                    <dd className={dark ? "!text-white" : undefined}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CommercialPage() {
  return (
    <>
      <PageIntro
        kicker="The commercial case"
        title="Two ways to put the research to work"
        lead="A depot-scale hub for 100 bikes, or a small net-metered hub that can be repeated across neighbourhoods. The figures come from the commercial proposal and the thesis, and they are pre-feasibility estimates."
      >
        <Button asChild variant="primary">
          <a href={AUDIT_HREF}>
            Request a site audit <ArrowRight />
          </a>
        </Button>
      </PageIntro>

      <div className="mt-20">
        <ModelPanel m={MODEL_B} dark images={["rooftop", "warehouse", "panelsBlue"]} label="Recommended" />
        <div className="-mt-10">
          <ModelPanel m={MODEL_A} images={["farmAerial", "fieldArray", "connector"]} label="Depot scale" />
        </div>
      </div>

      <section aria-labelledby="compare" className="container pt-28">
        <h2 id="compare" className="h2 max-w-[16ch]">
          Weigh them yourself
        </h2>
        <div className="mt-12 grid gap-6">
          <CompareModels />
          <div className="grid gap-6 lg:grid-cols-2">
            <UtilizationTool />
            <BudgetTool />
          </div>
        </div>
      </section>

      <section aria-labelledby="dossier" className="container pt-28">
        <h2 id="dossier" className="h2 max-w-[18ch]">
          Inside the 300 kWp hub
        </h2>
        <p className="measure mt-6 text-lg">
          The proposal splits 100 metered points into two zones behind a smart energy management system, with room for storage later.
        </p>
        <div className="mt-12">
          <HubDossier />
        </div>
        <p className="measure mt-10 text-[15px] text-muted">
          Before final design the proposal still needs: battery voltage and chemistry, charger ratings, simultaneous-charging load, grid and transformer capacity, a shading
          and structural survey, the applicable tariff, and utility rules for net metering.
        </p>
      </section>
    </>
  );
}
