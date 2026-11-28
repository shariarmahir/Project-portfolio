"use client";
import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";
import { useReduced } from "@/components/charts/kit";
import { DownloadButton, DriveButton, DriveGlyph } from "@/components/site/download-gate";
import type { ResolvedDownload } from "@/lib/downloads";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const STEP = 5000;

type Doc = ResolvedDownload & { groupLabel: string };

/** Pose of a cover by its distance from the front of the fan (0 = front). */
function pose(o: number, n: number) {
  const d = o > n / 2 ? o - n : o; // -3..3
  const a = Math.abs(d);
  return {
    x: d * 72,
    y: a * 10,
    rotate: d * 6.5,
    scale: 1 - a * 0.085,
    opacity: a > 3 ? 0 : 1 - a * 0.22,
    zIndex: 20 - a,
  };
}

/**
 * The downloads opener: every document fanned out as a stack of covers that turns, one at a time,
 * with the front document's details and its two actions (download, Google Drive) beside it.
 */
export function DocShowcase({ docs }: { docs: Doc[] }) {
  const list = docs.filter((d) => d.href);
  const n = list.length;
  const reduce = useReduced();
  const [i, setI] = React.useState(() => Math.max(0, list.findIndex((d) => d.id === "thesis-book")));
  const [hold, setHold] = React.useState(false);

  React.useEffect(() => {
    if (hold || reduce || n < 2) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), STEP);
    return () => clearTimeout(t);
  }, [i, hold, reduce, n]);

  if (!n) return null;
  const d = list[i];
  const wide = (x: Doc) => x.ext === "PPTX";

  return (
    <div
      className="glass-strong relative isolate grid overflow-hidden rounded-slab lg:grid-cols-[1fr_1.05fr]"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setI((v) => (v + 1) % n);
        if (e.key === "ArrowLeft") setI((v) => (v - 1 + n) % n);
      }}
    >
      <div aria-hidden className="sun-rays absolute -right-[10%] top-1/2 -z-10 size-[720px] -translate-y-1/2 opacity-60" />

      {/* details of the front document */}
      <div className="relative z-10 flex min-h-[420px] flex-col justify-center p-7 sm:p-10 lg:p-14" aria-live="polite">
        <h2 id="featured" className="sr-only">
          Featured documents
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={d.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="text-[14px] font-semibold text-helios-300">
              {d.groupLabel} · {i + 1} of {n}
            </p>
            <h3 className="mt-3 text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[1.08] tracking-[-0.03em]">{d.title}</h3>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed">{d.desc}</p>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
              {[
                ["Format", d.ext ?? "–"],
                ["Length", d.length],
                ["Size", d.size ?? "–"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="num mt-0.5 font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <DownloadButton doc={d} className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-helios px-8 text-base font-semibold text-navy-900 transition-colors hover:bg-helios-300">
            <Download className="size-[18px]" /> Download {d.ext}
          </DownloadButton>
          <DriveButton className="glass inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-semibold text-ink transition-colors hover:bg-white/10">
            <DriveGlyph className="w-5" /> Google Drive
          </DriveButton>
        </div>
        {/* time to the next turn */}
        <div aria-hidden className="mt-9 h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
          <motion.span
            key={`${i}-${hold}`}
            className="block h-full bg-helios"
            initial={{ width: hold || reduce ? "100%" : "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: hold || reduce ? 0 : STEP / 1000, ease: "linear" }}
          />
        </div>
      </div>

      {/* the fan of covers */}
      <div className="relative h-[340px] sm:h-[420px] lg:h-auto lg:min-h-[500px]" aria-hidden>
        <div className="absolute inset-0 grid place-items-center">
          {list.map((x, k) => {
            const p = pose((k - i + n) % n, n);
            return (
              <motion.div
                key={x.id}
                onClick={() => setI(k)}
                className={cn(
                  "absolute cursor-pointer overflow-hidden rounded-lg bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/20",
                  wide(x) ? "aspect-[16/9] w-[min(62vw,380px)] lg:w-[400px]" : "aspect-[1/1.414] h-[min(64vw,290px)] sm:h-[340px] lg:h-[400px]"
                )}
                initial={false}
                animate={{ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale, opacity: p.opacity }}
                style={{ zIndex: p.zIndex }}
                transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE }}
                whileHover={reduce ? undefined : { y: p.y - 8 }}
              >
                <Image src={x.cover} alt="" fill sizes="400px" className="object-cover object-top" priority />
                {k === i && <span className="shimmer pointer-events-none absolute inset-0" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
