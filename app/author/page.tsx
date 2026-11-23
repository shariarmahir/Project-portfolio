import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { AuthorPortrait } from "@/components/author/portrait";
import { CopyCitation } from "@/components/author/copy-citation";
import { DownloadButton } from "@/components/site/download-gate";
import { Bolt } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { AUTHOR, THESIS } from "@/lib/data";
import { resolveDownloads } from "@/lib/downloads";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Author",
  description: "Asif Rabbi, MSc researcher in Electrical & Electronic Engineering at the University of Asia Pacific.",
};

/** What each tool did in the thesis. Figures are from the thesis draft. */
const TOOLKIT = [
  {
    tool: "MATLAB Simulink",
    did: "Modelled the 18 kWp, 30 kWh station: MPPT, buck converter, bidirectional buck-boost converter and the 80% state-of-charge limit.",
    tone: "navy",
  },
  {
    tool: "ESP32",
    did: "Ran the bench prototype: sensor readings, charge control logic and the uplink to the cloud.",
    tone: "cobalt",
  },
  {
    tool: "ThingSpeak",
    did: "Live dashboard for PV power, battery state of charge and the fire alarm, with email and IFTTT alerts.",
    tone: "helios",
  },
  {
    tool: "PVsyst",
    did: "Yield and cash flow for the Farmgate site over 20 years: 23.9 MWh a year, PR about 84%, LCOE 0.17 USD/kWh.",
    tone: "white",
  },
  {
    tool: "Monte Carlo methods",
    did: "3,000 runs on NPV, IRR and ROI. Mean NPV came to USD 14,329 and mean IRR to 14.87%.",
    tone: "tint",
  },
  {
    tool: "OpenLCA",
    did: "Cradle-to-grave ReCiPe 2016 assessment, ten categories and 30,000 runs, landfill against formal recycling.",
    tone: "navy600",
  },
] as const;

const TONE = {
  navy: "bg-navy text-white/80 [&_h3]:!text-white",
  cobalt: "bg-cobalt text-white/85 [&_h3]:!text-white",
  helios: "bg-helios text-navy [&_h3]:!text-navy",
  white: "bg-white ring-1 ring-line",
  tint: "bg-tint",
  navy600: "bg-navy-600 text-white/80 [&_h3]:!text-white",
};

export default function AuthorPage() {
  const docs = resolveDownloads();

  return (
    <>
      <header className="container grid gap-10 pt-10 sm:pt-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <AuthorPortrait className="aspect-[4/5] w-full rounded-panel sm:aspect-[5/4] lg:aspect-[4/5]" priority />
        <div>
          <h1 className="h1">{AUTHOR.name}</h1>
          <p className="mt-4 text-xl font-semibold tracking-snug text-cobalt">{AUTHOR.role}</p>
          <p className="lead mt-6">{AUTHOR.bio}</p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line">
            {[
              ["University", THESIS.university],
              ["Student ID", THESIS.studentId],
              ["Supervisor", THESIS.supervisor],
              ["Thesis defense", THESIS.defense],
            ].map(([k, v]) => (
              <div key={k} className="bg-white px-5 py-4">
                <dt className="text-[13px] font-medium text-muted">{k}</dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="navy">
              <Link href="/downloads">
                Read the thesis <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/research">See the results</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* The thesis */}
      <section aria-labelledby="thesis" className="section container">
        <div className="relative overflow-hidden rounded-panel bg-navy p-7 sm:p-10 lg:p-14">
          <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -top-10 size-72 opacity-[0.12]">
            <path d="M118 0 40 110h46l-16 90 90-120h-48z" fill="#F59E0B" />
          </svg>
          <h2 id="thesis" className="relative max-w-[34ch] font-semibold leading-[1.15] !text-white [font-size:clamp(1.5rem,2.8vw,2.4rem)]">
            {THESIS.title}
          </h2>
          <p className="relative mt-4 text-[16px] text-white/75">
            MSc thesis · {THESIS.dept} · {THESIS.university}
          </p>
          <ul className="relative mt-8 flex flex-wrap gap-2">
            {THESIS.keywords.map((k) => (
              <li key={k} className="rounded-full bg-white/10 px-4 py-2 text-[14px] font-semibold text-white">
                {k}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Toolkit */}
      <section aria-labelledby="toolkit" className="container pb-[clamp(3.5rem,6vw,5.5rem)]">
        <h2 id="toolkit" className="h2">
          Tools and methods
        </h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {TOOLKIT.map((t) => (
            <li key={t.tool} className={cn("flex min-h-[210px] flex-col justify-between rounded-panel p-7", TONE[t.tone])}>
              <Bolt className={cn("h-7 w-[18px]", t.tone === "helios" && "fill-navy")} />
              <div className="mt-6">
                <h3 className="text-[1.4rem] tracking-display">{t.tool}</h3>
                <p className="mt-2 text-[15px] leading-relaxed">{t.did}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Documents */}
      <section aria-labelledby="docs" className="section bg-tint">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="docs" className="h2">
              Documents and publications
            </h2>
            <Link href="/downloads" className="inline-flex items-center gap-2 text-[15px] font-semibold text-navy underline-offset-4 hover:underline">
              Open the library <ArrowRight className="size-[18px]" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-2">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-5 rounded-2xl bg-white p-4 pr-5 ring-1 ring-line">
                <span className={cn("relative shrink-0 overflow-hidden rounded-[4px] ring-1 ring-black/5", d.ext === "PPTX" ? "h-[52px] w-[92px]" : "h-[74px] w-[52px]")}>
                  <Image src={d.cover} alt="" width={d.ext === "PPTX" ? 92 : 52} height={d.ext === "PPTX" ? 52 : 74} className="size-full object-cover object-top" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug tracking-snug text-ink">{d.title}</p>
                  <p className="num mt-1 text-[14px] text-muted">{d.href ? `${d.ext} · ${d.length} · ${d.size}` : "Coming soon"}</p>
                </div>
                <DownloadButton
                  doc={d}
                  aria-label={`Download ${d.title}`}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-white transition-colors hover:bg-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2"
                >
                  <Download className="size-[18px]" />
                </DownloadButton>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Record and citation */}
      <section className="section container grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <h2 id="record" className="h2">
            Academic record
          </h2>
          <dl className="mt-8">
            {[
              ["Programme", THESIS.degree],
              ["Department", THESIS.dept],
              ["University", THESIS.university],
              ["Student ID", THESIS.studentId],
              ["Supervisor", THESIS.supervisor],
              ["Thesis defense", THESIS.defense],
              ["Thesis submitted", THESIS.submitted],
            ].map(([k, v]) => (
              <div key={k} className="spec-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex items-center gap-4 rounded-panel bg-white p-5 ring-1 ring-line">
            <Image src="/images/uap-logo.png" alt="University of Asia Pacific logo" width={56} height={50} />
            <p className="text-[15px]">Department of Electrical &amp; Electronic Engineering, University of Asia Pacific, Dhaka.</p>
          </div>
        </div>
        <div className="min-w-0">
          <h2 id="cite" className="h2">
            Cite this work
          </h2>
          <div className="mt-8">
            <CopyCitation text={AUTHOR.bibtex} />
          </div>
        </div>
      </section>
    </>
  );
}
