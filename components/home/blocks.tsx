"use client";
import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Bolt } from "@/components/site/marks";
import { PlayToggle, useVideoControl } from "@/components/site/media";
import { VIDEOS } from "@/lib/media";
import { cn } from "@/lib/utils";

export function Ticker({ words }: { words: readonly string[] }) {
  const reduce = useReducedMotion();
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {words.map((w) => (
        <li key={w} className="flex items-center whitespace-nowrap">
          <span className="px-7 text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-display text-navy">{w}</span>
          <Bolt className="h-7 w-5" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-line py-6">
      <p className="sr-only">Tools and standards used: {words.join(", ")}.</p>
      <div className={cn("flex w-max", !reduce && "animate-marquee hover:[animation-play-state:paused]")}>
        {row}
        {row}
      </div>
    </div>
  );
}

export function FindingsBand({ findings }: { findings: readonly string[] }) {
  const reduce = useReducedMotion();
  const cards = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-5 pr-5" aria-hidden={hidden}>
      {findings.map((f) => (
        <li key={f} className="flex w-[min(80vw,420px)] shrink-0 flex-col justify-between rounded-panel bg-white p-7">
          <Bolt />
          <p className="mt-6 text-[21px] font-semibold leading-snug tracking-snug text-ink">{f}</p>
        </li>
      ))}
    </ul>
  );
  if (reduce)
    return <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">{cards(false)}</div>;
  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee [animation-duration:70s] hover:[animation-play-state:paused]">
        {cards(false)}
        {cards(true)}
      </div>
    </div>
  );
}

export function VideoFeature({ caption }: { caption: string }) {
  const { ref, playing, toggle } = useVideoControl();
  return (
    <figure className="relative overflow-hidden rounded-panel bg-navy">
      <video ref={ref} src={VIDEOS.install.src} poster={VIDEOS.install.poster} muted loop playsInline preload="metadata" className="aspect-[16/9] w-full object-cover" aria-label={caption} />
      <span className="absolute left-5 top-5 rounded-lg bg-white px-3 py-1 text-[13px] font-semibold text-navy">Video</span>
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-navy/80 to-transparent p-6 pt-24 text-white">
        <span className="max-w-lg text-lg font-semibold tracking-snug">{caption}</span>
        <PlayToggle playing={playing} onClick={toggle} label="installation video" />
      </figcaption>
    </figure>
  );
}

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <details key={it.q} className="group rounded-panel bg-tint px-6 transition-colors open:bg-white open:ring-1 open:ring-line sm:px-10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-[clamp(1.15rem,1.8vw,1.5rem)] font-semibold tracking-snug text-ink [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown className="size-7 shrink-0 text-navy transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
          </summary>
          <p className="measure pb-8 text-[17px]">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
