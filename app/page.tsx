import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VideoHero } from "@/components/home/video-hero";
import { ScrollPath } from "@/components/home/scroll-path";
import { SystemsStack } from "@/components/home/systems";
import { KeyTiles } from "@/components/home/tiles";
import { Faq, FindingsBand, VideoFeature } from "@/components/home/blocks";
import { FramedPhoto } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { resolveDownloads } from "@/lib/downloads";
import { FAQ, FINDINGS, HOW_IT_WORKS, WHY } from "@/lib/data";

export default function Home() {
  const docs = resolveDownloads().map(({ id, title, href, ext, size, length, cover }) => ({ id, title, href, ext, size, length, cover }));

  return (
    <>
      <VideoHero />

      <ScrollPath>
        {/* Statement with offset images */}
        <section className="section container grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="statement">
              Bangladesh&apos;s Easy Bikes carry millions of people a day, and nearly all of them charge from the grid at night. This
              thesis designs, builds and tests a station that charges them from the sun instead.
            </p>
            <p className="lead mt-8 lg:ml-20">
              The work follows one 18 kWp station through every question an examiner or an investor would ask: does the control system
              hold up, what does a unit of energy cost, how risky are the returns, and what does the hardware cost the planet from
              mine to recycling plant.
            </p>
          </div>
          <div className="grid gap-5">
            <FramedPhoto k="dhakaStreet" className="aspect-[16/10] w-full lg:w-4/5" priority />
            <FramedPhoto k="dhakaAerial" className="aspect-[16/10] w-full lg:ml-auto lg:w-[88%]" />
          </div>
        </section>

        {/* Why it matters */}
        <section aria-labelledby="why" className="container pb-[clamp(3.5rem,6vw,5.5rem)]">
          <h2 id="why" className="h2">
            Why Bangladesh needs it
          </h2>
          <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-2 lg:gap-20">
            <div className="grid content-start gap-5">
              <FramedPhoto k="dhakaRain" className="aspect-[5/4] w-full" />
              <FramedPhoto k="fieldArray" className="aspect-[16/9] w-full lg:ml-auto lg:w-3/4" />
            </div>
            <ul>
              {WHY.map((w) => (
                <li key={w.title} className="border-t border-line py-7 first:pt-0 first:border-0">
                  <h3 className="flex items-center gap-4 text-[clamp(1.3rem,1.9vw,1.6rem)] tracking-display">
                    <Bolt /> {w.title}
                  </h3>
                  <p className="measure mt-3 text-[17px]">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollPath>

      {/* Documents and key routes */}
      <section aria-label="Documents and quick links" className="container pb-[clamp(3.5rem,6vw,5.5rem)]">
        <KeyTiles docs={docs} />
      </section>

      {/* Three systems, stacked */}
      <section aria-labelledby="systems">
        <div className="container pb-8 lg:pb-10">
          <h2 id="systems" className="h2">
            One study, three ways to build it
          </h2>
        </div>
        <SystemsStack />
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="section container">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="how" className="h2">
            How the station works
          </h2>
          <p className="max-w-[44ch] text-[16px] text-muted">From sunlight on the array to a charged bike, monitored in real time.</p>
        </div>
        <div className="mt-8 lg:mt-10">
          <VideoFeature caption="Modules going up on a mounting frame: the first link in the chain." />
        </div>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title} className="flex gap-5 border-t-2 border-navy pt-6">
              <span className="num grid size-10 shrink-0 place-items-center rounded-full bg-navy text-[15px] font-semibold text-white">{i + 1}</span>
              <div>
                <h3 className="text-[1.4rem] tracking-display">{s.title}</h3>
                <p className="mt-2 text-[16px]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Findings */}
      <section aria-labelledby="findings" className="section bg-tint">
        <div className="container mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end lg:mb-10">
          <h2 id="findings" className="h2">
            What the results show
          </h2>
          <Button asChild variant="ghost">
            <Link href="/research">
              See the full evidence <ArrowRight />
            </Link>
          </Button>
        </div>
        <FindingsBand findings={FINDINGS} />
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="section container">
        <h2 id="faq" className="h2">
          Questions examiners ask
        </h2>
        <div className="mt-8 lg:mt-10">
          <Faq items={FAQ} />
        </div>
      </section>
    </>
  );
}
