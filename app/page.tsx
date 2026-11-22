import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VideoHero } from "@/components/home/video-hero";
import { ScrollPath } from "@/components/home/scroll-path";
import { SystemsStack } from "@/components/home/systems";
import { KeyTiles } from "@/components/home/tiles";
import { Faq, FindingsBand, Ticker, VideoFeature } from "@/components/home/blocks";
import { FramedPhoto } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { FAQ, FINDINGS, HOW_IT_WORKS, TICKER, WHY } from "@/lib/data";

export default function Home() {
  return (
    <>
      <VideoHero />

      <ScrollPath>
        {/* Statement with offset images */}
        <section className="container grid gap-14 pb-28 pt-24 lg:grid-cols-2 lg:gap-24 lg:pt-32">
          <div className="lg:pt-10">
            <p className="statement">
              Bangladesh&apos;s Easy Bikes carry millions of people a day, and nearly all of them charge from the grid at night. This
              thesis designs, builds and tests a station that charges them from the sun instead.
            </p>
            <p className="measure mt-10 text-lg lg:ml-24">
              The work follows one 18 kWp station through every question an examiner or an investor would ask: does the control system
              hold up, what does a unit of energy cost, how risky are the returns, and what does the hardware cost the planet from
              mine to recycling plant.
            </p>
          </div>
          <div className="grid gap-5">
            <FramedPhoto k="dhakaStreet" className="aspect-[16/10] w-full lg:w-4/5" priority />
            <FramedPhoto k="dhakaAerial" className="aspect-[16/11] w-full lg:ml-auto lg:w-[92%]" />
          </div>
        </section>

        {/* Why it matters: bolt list with stacked photos */}
        <section aria-labelledby="why" className="container grid gap-14 pb-32 lg:grid-cols-2 lg:gap-24">
          <div className="grid content-start gap-5">
            <FramedPhoto k="dhakaRain" className="aspect-[5/4] w-full" />
            <FramedPhoto k="fieldArray" className="aspect-[16/10] w-full lg:ml-auto lg:w-4/5" />
          </div>
          <div>
            <h2 id="why" className="h2 max-w-[14ch]">
              Why Bangladesh needs it
            </h2>
            <ul className="mt-10">
              {WHY.map((w) => (
                <li key={w.title} className="border-t border-line py-9">
                  <h3 className="flex items-center gap-4 text-[clamp(1.35rem,2vw,1.75rem)] tracking-display">
                    <Bolt /> {w.title}
                  </h3>
                  <p className="measure mt-4 text-[17px]">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ScrollPath>

      {/* Key routes */}
      <section aria-label="Quick links" className="container pb-32">
        <KeyTiles />
      </section>

      {/* Three systems, stacked */}
      <section aria-labelledby="systems">
        <div className="container pb-14">
          <h2 id="systems" className="h2 max-w-[18ch]">
            One study, three ways to build it
          </h2>
        </div>
        <SystemsStack />
      </section>

      {/* How it works: video + steps */}
      <section aria-labelledby="how" className="container pt-32">
        <h2 id="how" className="h2 mx-auto max-w-[20ch] text-center">
          How the station works
        </h2>
        <div className="mt-14">
          <VideoFeature caption="Modules going up on a mounting frame: the first link in the chain." />
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-navy pt-6">
              <p className="num text-[15px] font-semibold text-cobalt">Step {i + 1}</p>
              <h3 className="mt-2 text-2xl tracking-display">{s.title}</h3>
              <p className="mt-3 text-[17px]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-32">
        <Ticker words={TICKER} />
      </div>

      {/* Findings */}
      <section aria-labelledby="findings" className="mt-32 bg-tint py-24">
        <div className="container mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="findings" className="h2 max-w-[16ch]">
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
      <section aria-labelledby="faq" className="container pt-32">
        <h2 id="faq" className="h2 max-w-[18ch]">
          Questions examiners ask
        </h2>
        <div className="mt-12">
          <Faq items={FAQ} />
        </div>
      </section>
    </>
  );
}
