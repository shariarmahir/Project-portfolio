"use client";
import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Download, Search } from "lucide-react";
import { DownloadButton, DriveButton, DriveGlyph, type GateDoc } from "@/components/site/download-gate";
import { useReduced } from "@/components/charts/kit";
import { cn } from "@/lib/utils";

export type LibraryDoc = GateDoc & { desc: string; group: string; groupLabel: string };

const btn =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-helios px-5 text-[14px] font-semibold text-navy-900 transition-colors hover:bg-helios-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

/** Card that tilts toward the pointer. */
function Tilt({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReduced();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

export function DownloadLibrary({ docs }: { docs: LibraryDoc[] }) {
  const groups = React.useMemo(() => {
    const seen = new Map<string, string>();
    docs.forEach((d) => seen.set(d.group, d.groupLabel));
    return [["all", "All documents"], ...Array.from(seen.entries())] as [string, string][];
  }, [docs]);
  const [group, setGroup] = React.useState("all");
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const list = docs.filter((d) => (group === "all" || d.group === group) && (d.title.toLowerCase().includes(needle) || d.desc.toLowerCase().includes(needle)));

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="glass flex gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none]" role="group" aria-label="Filter documents">
          {groups.map(([id, label]) => {
            const count = id === "all" ? docs.length : docs.filter((d) => d.group === id).length;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setGroup(id)}
                aria-pressed={group === id}
                className={cn("relative shrink-0 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-colors", group === id ? "text-navy-900" : "text-body hover:text-ink")}
              >
                {group === id && <motion.span layoutId="lib-pill" className="absolute inset-0 rounded-full bg-helios" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">
                  {label} <span className={cn("num ml-1", group === id ? "text-navy-900/70" : "text-muted")}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
        <label className="glass flex h-12 items-center gap-3 rounded-full px-5 focus-within:border-helios-300 lg:w-[360px]">
          <Search className="size-5 shrink-0 text-muted" aria-hidden />
          <span className="sr-only">Search documents</span>
          <input
            id="library-search"
            name="library-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or topic"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
          />
        </label>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {list.map((d, i) => {
            const slide = d.ext === "PPTX";
            return (
              <motion.li
                key={d.id}
                id={d.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
                className="scroll-mt-40"
              >
                <Tilt className="glass group flex h-full flex-col overflow-hidden rounded-panel transition-colors hover:border-white/25">
                  <div className="relative grid aspect-[16/11] place-items-center overflow-hidden bg-gradient-to-br from-white/[0.06] to-transparent">
                    <div aria-hidden className="sun-rays absolute -right-20 -top-20 size-64 opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[6px] bg-white shadow-float ring-1 ring-white/20 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.03]",
                        slide ? "aspect-[16/9] w-[82%]" : "aspect-[1/1.414] h-[84%]"
                      )}
                    >
                      <Image src={d.cover} alt={`Cover of ${d.title}`} fill sizes="(min-width:1280px) 18vw, (min-width:1024px) 22vw, 60vw" className="object-cover object-top" />
                    </div>
                    <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold text-ink">{d.ext ?? "Soon"}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-helios-300">{d.groupLabel}</p>
                    <h3 className="mt-2 text-[1.2rem] leading-snug tracking-snug">{d.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed">{d.desc}</p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      <p className="num text-[13.5px] font-medium text-muted">{d.href ? `${d.length} · ${d.size}` : "Not uploaded yet"}</p>
                      <DownloadButton doc={d} className={btn} aria-label={`Download ${d.title}`}>
                        <Download className="size-[17px]" /> Get
                      </DownloadButton>
                    </div>
                  </div>
                </Tilt>
              </motion.li>
            );
          })}
          {(group === "all" && !needle) && (
            <motion.li key="drive" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Tilt className="group flex h-full flex-col overflow-hidden rounded-panel border border-white/15 bg-gradient-to-br from-[#1a2b4a] via-[#122039] to-[#0b1526] p-6">
                <span className="grid size-16 place-items-center rounded-2xl bg-white shadow-float transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <DriveGlyph className="w-9" />
                </span>
                <h3 className="mt-6 text-[1.2rem] leading-snug tracking-snug">Everything in Google Drive</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed">All documents, source files and data in one shared folder. It uses the same access password.</p>
                <DriveButton className={cn(btn, "mt-auto w-max")} aria-label="Open the research drive (password)">
                  Open drive <ArrowUpRight className="size-[17px]" />
                </DriveButton>
              </Tilt>
            </motion.li>
          )}
        </AnimatePresence>
        {list.length === 0 && (
          <li className="glass col-span-full rounded-panel px-6 py-16 text-center text-body">
            Nothing matches “{q}”. Try “thesis”, “proposal”, “IEEE” or “slides”.
          </li>
        )}
      </ul>
    </div>
  );
}
