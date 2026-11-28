"use client";
import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CountUp, useReduced } from "@/components/charts/kit";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { T } from "@/lib/thesis-data";

const EASE = [0.16, 1, 0.3, 1] as const;

const LABELS = [
  { id: "roof", text: "250.48 kWp on the roof", sub: "404 × JINKO 620 Wp" },
  { id: "points", text: "100 charging points", sub: "1.5 kW each, 150 kW limit" },
  { id: "ess", text: "100 kW hybrid ESS", sub: "evening supply and backup" },
  { id: "substation", text: "250 kVA substation", sub: "net metering ready" },
];

const STATS = [
  { v: T.caseC.kwp, d: 2, s: " kWp", k: "real plant, Satkhira" },
  { v: T.caseC.pvYear / 365, d: 0, s: " kWh", k: "of sun on an average day" },
  { v: T.caseC.fin["P3-80"].sf, d: 0, p: `${T.caseC.fin["P1-80"].sf}% → `, s: "%", k: "solar share, night → solar-priority charging" },
];

export function Hero() {
  const reduce = useReduced();
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const item = (k: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay: 0.15 + k * 0.09 },
  });

  return (
    <section ref={ref} aria-labelledby="hero-h" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:block">
      {/* the live 3D world: full bleed on desktop, below the text on phones */}
      <SceneCanvas
        preset="hub"
        shift={0.21}
        fovScale={1.1}
        sunDisc={false}
        poster="/media/renders/hero-poster.webp"
        labels={LABELS}
        still="/media/renders/hub.webp"
        stillPosition="object-[70%_50%]"
        className="order-2 h-[58svh] w-full lg:absolute lg:inset-0 lg:h-auto"
      />
      {/* legibility veil and the fade into the page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(5,11,22,0.95)_0%,rgba(5,11,22,0.82)_32%,rgba(5,11,22,0.35)_48%,rgba(5,11,22,0)_62%)] lg:block" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />

      <motion.div style={{ y: textY, opacity: fade }} className="container relative z-10 order-1 flex min-h-0 items-center pb-6 pt-28 lg:min-h-[100svh] lg:pb-16 lg:pt-24">
        <div className="max-w-[620px]">
          <motion.h1 id="hero-h" {...item(0)} className="text-[clamp(2.4rem,4.6vw,4.25rem)] font-semibold leading-[1] tracking-[-0.04em]">
            Solar charging for the Easy Bikes of Bangladesh
          </motion.h1>
          <motion.p {...item(1)} className="mt-5 text-[clamp(1.05rem,1.5vw,1.3rem)] font-semibold text-helios-300">
            From a 30 W prototype to a real 250.48 kWp plant
          </motion.p>
          <motion.p {...item(2)} className="mt-4 max-w-[52ch] text-[16.5px] text-body">
            One MSc thesis, three cases kept apart: an IoT station, a PVsyst model and a plant commissioned in Satkhira on 9 September 2026 that can charge 100
            Easy Bikes a day, mostly from the sun.
          </motion.p>
          <motion.div {...item(3)} className="mt-8 flex flex-wrap gap-3">
            <Link href="#hub" className="group inline-flex h-14 items-center gap-3 rounded-full bg-helios pl-7 pr-2 text-[15.5px] font-semibold text-navy-900 transition-colors hover:bg-helios-300">
              Explore the hub
              <span className="grid size-10 place-items-center rounded-full bg-navy-900 text-helios transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link href="/research" className="glass inline-flex h-14 items-center rounded-full px-7 text-[15.5px] font-semibold text-ink transition-colors hover:bg-white/10">
              Read the research
            </Link>
          </motion.div>
          <motion.dl {...item(4)} className="mt-10 grid max-w-[600px] grid-cols-1 gap-2.5 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.k} className="glass rounded-2xl px-4 py-3.5">
                <dt className="sr-only">{s.k}</dt>
                <dd className="num text-[1.3rem] font-semibold text-ink">
                  <CountUp value={s.v} decimals={s.d} prefix={s.p ?? ""} suffix={s.s} />
                </dd>
                <dd className="mt-0.5 text-[12.5px] leading-snug text-muted">{s.k}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}
