"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayToggle, useVideoControl } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { THESIS } from "@/lib/data";
import { VIDEOS } from "@/lib/media";

const EASE = [0.16, 1, 0.3, 1] as const;

const FACTS = [
  ["MSc thesis", THESIS.university],
  ["Supervisor", THESIS.supervisor],
  ["Defended", THESIS.defense],
] as const;

export function VideoHero() {
  const { ref, playing, toggle } = useVideoControl();
  const reduce = useReducedMotion();
  const rise = (d: number) =>
    reduce ? {} : { initial: { y: 28 }, animate: { y: 0 }, transition: { duration: 1.1, ease: EASE, delay: d } };

  return (
    <section className="relative px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative isolate flex min-h-[calc(100svh-6.5rem)] overflow-hidden rounded-panel bg-navy sm:min-h-[640px] lg:max-h-[880px]">
        <motion.video
          ref={ref}
          className="absolute inset-0 -z-20 size-full object-cover"
          src={VIDEOS.hero.src}
          poster={VIDEOS.hero.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        />
        {/* Legibility: deep navy from the bottom-left corner, clear sky top-right. */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,24,43,0.95)_0%,rgba(6,24,43,0.55)_45%,rgba(6,24,43,0.15)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(6,24,43,0.55),transparent_65%)]" />

        <div className="flex w-full flex-col justify-end px-6 pb-10 pt-28 sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">
          <motion.h1 {...rise(0)} className="max-w-[24ch] font-semibold !text-white [font-size:clamp(2.5rem,5.3vw,4.6rem)] [line-height:1.03]">
            Solar charging for Bangladesh&apos;s 3.5 million Easy Bikes
          </motion.h1>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <motion.p {...rise(0.08)} className="max-w-[52ch] text-lg leading-relaxed text-white/85 sm:text-xl">
                An MSc thesis that designs, builds, prices and life-cycle-tests an IoT solar charging station for the country&apos;s battery three-wheelers.
              </motion.p>
              <motion.div {...rise(0.16)} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="primary" size="lg">
                  <Link href="/research">
                    Read the research <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="ghost-light" size="lg">
                  <Link href="/downloads">Download the thesis</Link>
                </Button>
              </motion.div>
            </div>

            <motion.dl {...rise(0.24)} className="border-t border-white/20 text-white">
              {FACTS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/20 py-3.5">
                  <dt className="shrink-0 text-[14px] font-medium text-white/65">{k}</dt>
                  <dd className="text-right text-[15px] font-semibold tracking-snug">{v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>

        <PlayToggle playing={playing} onClick={toggle} label="background video" className="absolute right-5 top-5 sm:right-6 sm:top-6" />
      </div>

      {/* Bolt node: the start of the scroll path */}
      <div className="relative z-10 mx-auto -mt-8 grid size-16 place-items-center rounded-full bg-canvas">
        <span className="grid size-12 place-items-center rounded-full bg-navy">
          <Bolt className="h-5 w-3.5" />
        </span>
      </div>
    </section>
  );
}
