import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Cpu, Download, Leaf, MapPin, Sun } from "lucide-react";
import { AuthorPortrait } from "@/components/author/portrait";
import { CopyCitation } from "@/components/author/copy-citation";
import { ResumeRing } from "@/components/author/resume-ring";
import { DownloadButton, DriveButton } from "@/components/site/download-gate";
import { Reveal } from "@/components/charts/kit";
import { AUTHOR, SITE, THESIS } from "@/lib/data";
import { resolveDownloads } from "@/lib/downloads";
import { T } from "@/lib/thesis-data";

export const metadata: Metadata = {
  title: "Author",
  description: "Asif Rabbi, M.Sc. researcher in Electrical and Electronic Engineering at the University of Asia Pacific: three cases of solar charging for Bangladesh's Easy Bikes.",
};

/* Colours sampled from the resume reference the author supplied. */
const NAVY = "#22222E";

const WORK = [
  {
    tag: "Case A",
    title: "IoT-enabled 18 kWp charging station",
    where: "Farmgate, Dhaka · MATLAB Simulink, ESP32, ThingSpeak",
    body: "Designed the station with MPPT, a buck converter, a bidirectional buck-boost converter and an 80% state-of-charge limit, and proved the sensing and cloud chain on a 30 W prototype.",
    wins: [
      "NPV of USD 5,963 at 10%, IRR 13.8%, LCOE USD 0.20 per kWh in the rebuilt 20-year model",
      "NPV positive in 97.2% of 3,000 Monte Carlo runs",
      "Formal recycling cuts lifecycle GWP by 26.8% (32,813 to 24,020 kgCO₂eq); carbon payback 1.5–2.1 years",
    ],
  },
  {
    tag: "Case B",
    title: "98.4 kWp grid-connected PV-battery system",
    where: "Satkhira · PVsyst 7.4.8",
    body: "Modelled a system that serves a constant 50 kW load and re-priced it at real contract rates.",
    wins: [
      "135,831 kWh a year, 1,380 kWh per kWp, performance ratio 83.39%",
      "98.62% of the output used on site; solar covers 30.58% of a 438 MWh load",
      "Payback 3.5 years at real prices against 6.8 years at planning prices",
    ],
  },
  {
    tag: "Case C",
    title: "Real 250.48 kWp plant and a 100-bike hub",
    where: "Satkhira Sadar · commissioned 9 September 2026",
    body: "Documented the plant from its contract and completion records and built an hourly screening model for a 100-bike Easy Bike hub on it.",
    wins: [
      "Contract of Tk 1.2575 crore (Tk 35.30 per watt of PV); about 350 MWh a year; plant payback 2.3–3.3 years",
      "Hub NPV BDT 31.17 M and IRR 35.5% with two-shift charging; solar share rises from 23% to 73–93%",
      "Showed the fee decides the business: billed at the BERC rate only, the hub NPV falls to BDT −2.74 M",
    ],
  },
];

const PSW = [
  { h: "Problem", t: "Easy Bikes charge at night from a grid that is 68% gas and oil and only 4.13% renewable, often through informal connections." },
  { h: "Solution", t: "Solar charging studied as one chain: a monitored station, a grid-connected model and a real plant, each with its economics and risks." },
  { h: "Why it is needed", t: "One plant like Case C avoids about 217 t of CO₂ a year, and daytime charging lifts the solar share to 73–93% with no new equipment." },
];

const SKILLS = [
  ["MATLAB Simulink", "MPPT, converters and the 80% SOC limit"],
  ["ESP32 and ThingSpeak", "Sensing, cloud dashboard and alerts"],
  ["PVsyst 7.4.8", "Yield and loss modelling"],
  ["Monte Carlo analysis", "3,000 runs on NPV, IRR and payback"],
  ["OpenLCA, ReCiPe 2016", "Ten impact categories, 30,000 runs"],
  ["Techno-economic modelling", "Hourly plant and hub cash flow"],
];

function SideHead({ children }: { children: React.ReactNode }) {
  return <h2 className="border-b border-[#22222E]/35 pb-3 text-[1.45rem] font-bold tracking-[0.06em] !text-[#22222E]">{children}</h2>;
}
function MainHead({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="border-b border-[#22222E]/20 pb-3 text-[1.45rem] font-bold tracking-[0.06em] !text-[#22222E]">
      {children}
    </h2>
  );
}

export default function AuthorPage() {
  const docs = resolveDownloads();
  const pick = (id: string) => docs.find((d) => d.id === id)!;
  const pubs = [pick("thesis-book"), pick("ieee-publication"), pick("thesis-draft")];
  const [first, ...rest] = AUTHOR.name.split(" ");

  return (
    <div className="container pb-[clamp(3rem,6vw,5rem)] pt-32 sm:pt-36">
      <Reveal>
        <article className="mx-auto grid max-w-[1180px] bg-white text-[#5B5E6B] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] lg:grid-cols-[28px_minmax(300px,37%)_minmax(0,1fr)] lg:grid-rows-[28px_auto_auto_auto_44px]">
          {/* navy band across the whole sheet (desktop); the photo and the name sit on it */}
          <div aria-hidden className="hidden bg-[#22222E] lg:col-span-3 lg:col-start-1 lg:row-start-3 lg:block" />

          {/* yellow column, top: location */}
          <div className="bg-[#F6CE48] px-8 py-7 text-[#22222E] lg:col-start-2 lg:row-start-2 lg:px-10">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block text-[12.5px] font-semibold uppercase tracking-[0.12em]">Location</span>
                <span className="block text-[13.5px] text-[#22222E]/75">Dhaka, Bangladesh</span>
              </span>
            </p>
          </div>

          {/* contact row */}
          <div className="grid grid-cols-1 gap-5 px-8 py-7 sm:grid-cols-3 lg:col-start-3 lg:row-start-2 lg:items-center lg:px-12">
            {[
              ["Email", <a key="e" href={`mailto:${SITE.email}`} className="break-all hover:text-[#22222E] hover:underline">{SITE.email}</a>],
              ["Institution", THESIS.university],
              ["Research drive", <DriveButton key="d" className="text-left hover:text-[#22222E] hover:underline">Open with password</DriveButton>],
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[#22222E]">{k}</p>
                <div className="mt-0.5 text-[13.5px] leading-snug">{v}</div>
              </div>
            ))}
          </div>

          {/* photo inside the yellow column, at band height */}
          <div className="order-first lg:order-none lg:col-start-2 lg:row-start-3">
            <AuthorPortrait className="aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[360px]" priority />
          </div>

          {/* name block on the navy band */}
          <header className="bg-[#22222E] px-8 py-10 lg:col-start-3 lg:row-start-3 lg:bg-transparent lg:px-12 lg:py-12">
            <h1 className="text-[clamp(2.8rem,5.4vw,4.6rem)] uppercase leading-[0.98] tracking-[0.01em] !text-white">
              <span className="block font-light">{first}</span>
              <span className="block font-bold">{rest.join(" ")}</span>
            </h1>
            <span aria-hidden className="mt-4 block h-[3px] w-[min(100%,290px)] bg-[#F6CE48]" />
            <p className="mt-4 text-[clamp(0.9rem,1.2vw,1.05rem)] font-semibold uppercase tracking-[0.2em] text-white/90">M.Sc. researcher · EEE</p>
            <p className="mt-5 max-w-[62ch] text-[14.5px] leading-relaxed text-white/75">{AUTHOR.bio}</p>
          </header>

          {/* yellow column, below the band: skills, education, interests */}
          <aside className="space-y-10 bg-[#F6CE48] px-8 py-10 text-[#22222E] lg:col-start-2 lg:row-start-4 lg:px-10">
            <section>
              <SideHead>Skills</SideHead>
              <ul className="mt-5 space-y-4">
                {SKILLS.map(([t, d]) => (
                  <li key={t}>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">{t}</p>
                    <p className="text-[13.5px] text-[#22222E]/70">{d}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <SideHead>Education</SideHead>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">Master of Science in EEE</p>
                  <p className="text-[13.5px] text-[#22222E]/70">{THESIS.university}</p>
                  <p className="text-[13.5px] text-[#22222E]/70">Student ID {THESIS.studentId} · 2026</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">Thesis supervisor</p>
                  <p className="text-[13.5px] text-[#22222E]/70">{THESIS.supervisor}</p>
                  <p className="text-[13.5px] text-[#22222E]/70">Department of EEE</p>
                </div>
              </div>
            </section>
            <section>
              <SideHead>Why this work</SideHead>
              <div className="mt-5 space-y-5">
                {PSW.map(({ h, t }) => (
                  <div key={h}>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">{h}</p>
                    <p className="text-[13.5px] leading-snug text-[#22222E]/70">{t}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <SideHead>Interests</SideHead>
              <ul className="mt-6 grid grid-cols-4 gap-2 text-center text-[11.5px] font-medium">
                {[
                  [Sun, "Solar PV"],
                  [Cpu, "IoT"],
                  [BatteryCharging, "Storage"],
                  [Leaf, "Life cycle"],
                ].map(([Icon, l]) => {
                  const I = Icon as typeof Sun;
                  return (
                    <li key={l as string} className="flex flex-col items-center gap-2">
                      <span className="grid size-11 place-items-center rounded-full border-[1.5px] border-[#22222E]">
                        <I className="size-5" />
                      </span>
                      {l as string}
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>

          {/* white main column */}
          <div className="min-w-0 space-y-12 px-8 py-10 lg:col-start-3 lg:row-start-4 lg:px-12">
            <section aria-labelledby="exp-h">
              <MainHead id="exp-h">Experience</MainHead>
              <ol className="mt-6 space-y-8">
                {WORK.map((w, i) => (
                  <li key={w.tag}>
                    <Reveal delay={0.05 * i}>
                      <h3 className="text-[1.05rem] font-semibold tracking-normal !text-[#22222E]">{w.title}</h3>
                      <p className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
                        <span className="rounded-[3px] px-2.5 py-0.5 text-[11.5px] font-semibold text-white" style={{ background: "#29273D" }}>
                          {w.tag}
                        </span>
                        <span className="text-[#6B6E7B]">{w.where}</span>
                      </p>
                      <p className="mt-2.5 text-[14px] leading-relaxed">{w.body}</p>
                      <ul className="mt-3 space-y-1.5">
                        {w.wins.map((x) => (
                          <li key={x} className="flex gap-2.5 text-[14px] leading-snug text-[#3C3F4C]">
                            <span aria-hidden className="mt-[7px] size-1.5 shrink-0 bg-[#F6CE48] ring-1 ring-[#22222E]/30" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="impact-h">
              <MainHead id="impact-h">Impact</MainHead>
              <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
                <ResumeRing value={T.caseC.fin["P2-80"].sf} label="Solar share" sub="two-shift charging, Case C" />
                <ResumeRing value={97.2} label="NPV positive" sub="3,000 runs, Case A" />
                <ResumeRing value={26.8} label="GWP cut" sub="formal recycling, Case A" />
                <ResumeRing value={T.lens.gapPv} label="Below planning" sub="real PV price, Case C" />
              </div>
            </section>

            <section aria-labelledby="pubs-h">
              <MainHead id="pubs-h">Publications</MainHead>
              <ul className="mt-5 divide-y divide-[#22222E]/10">
                {pubs.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5">
                    <div>
                      <p className="text-[15px] font-semibold text-[#22222E]">{d.title}</p>
                      <p className="num text-[12.5px] text-[#6B6E7B]">
                        {d.ext} · {d.length} {d.size ? `· ${d.size}` : ""}
                      </p>
                    </div>
                    <DownloadButton
                      doc={d}
                      className="inline-flex h-9 items-center gap-2 rounded-[3px] bg-[#22222E] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#F6CE48] hover:text-[#22222E]"
                      aria-label={`Download ${d.title}`}
                    >
                      <Download className="size-4" /> Get
                    </DownloadButton>
                  </li>
                ))}
              </ul>
              <Link href="/downloads" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#22222E] hover:underline">
                All documents <ArrowRight className="size-4" />
              </Link>
            </section>

          </div>
        </article>
      </Reveal>
      <section aria-labelledby="cite-h" className="mx-auto mt-10 max-w-[1180px]">
        <h2 id="cite-h" className="text-[1.45rem] font-bold tracking-[0.04em]">
          Cite this work
        </h2>
        <div className="mt-5">
          <CopyCitation text={AUTHOR.bibtex} />
        </div>
      </section>
    </div>
  );
}
