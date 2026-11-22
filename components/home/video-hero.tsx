"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayToggle, useVideoControl } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { VIDEOS } from "@/lib/media";

const EASE = [0.16, 1, 0.3, 1] as const;

export function VideoHero() {
  const { ref, playing, toggle } = useVideoControl();
  const reduce = useReducedMotion();
  const rise = (d: number) => (reduce ? {} : { initial: { y: 24 }, animate: { y: 0 }, transition: { duration: 1, ease: EASE, delay: d } });

  return (
    <section className="relative px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden rounded-panel bg-navy sm:min-h-[640px]">
        <video
          ref={ref}
          className="absolute inset-0 -z-10 size-full object-cover"
          src={VIDEOS.hero.src}
          poster={VIDEOS.hero.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-navy/55" />

        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <motion.p {...rise(0)} className="text-[15px] font-semibold text-helios">
            Solar EV charging · Bangladesh
          </motion.p>
          <motion.h1 {...rise(0.05)} className="h1 mt-5 !text-white">
            Solar charging for Bangladesh&apos;s 3.5 million Easy Bikes
          </motion.h1>
          <motion.p {...rise(0.1)} className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            An MSc thesis that designs, builds, prices and life-cycle-tests an IoT solar charging station for the country&apos;s battery three-wheelers.
          </motion.p>
          <motion.div {...rise(0.15)} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
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

        <PlayToggle playing={playing} onClick={toggle} label="background video" className="absolute bottom-6 right-6" />
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
