"use client";
import * as React from "react";
import Image from "next/image";
import { Download, Search } from "lucide-react";
import { DownloadButton, type GateDoc } from "@/components/site/download-gate";
import { cn } from "@/lib/utils";

export type LibraryDoc = GateDoc & { desc: string; group: string; groupLabel: string };

const btn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 text-[14px] font-semibold text-white transition-colors hover:bg-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2";

export function DownloadLibrary({ docs }: { docs: LibraryDoc[] }) {
  const groups = React.useMemo(() => {
    const seen = new Map<string, string>();
    docs.forEach((d) => seen.set(d.group, d.groupLabel));
    return [["all", "All documents"], ...Array.from(seen.entries())] as [string, string][];
  }, [docs]);
  const [group, setGroup] = React.useState("all");
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const list = docs.filter(
    (d) => (group === "all" || d.group === group) && (d.title.toLowerCase().includes(needle) || d.desc.toLowerCase().includes(needle))
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-tint p-1 [scrollbar-width:none]" role="group" aria-label="Filter documents">
          {groups.map(([id, label]) => {
            const count = id === "all" ? docs.length : docs.filter((d) => d.group === id).length;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setGroup(id)}
                aria-pressed={group === id}
                className={cn(
                  "shrink-0 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-colors",
                  group === id ? "bg-white text-navy shadow-[0_2px_8px_-4px_rgba(10,37,64,0.35)]" : "text-body hover:text-navy"
                )}
              >
                {label} <span className="num ml-1 text-muted">{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-line bg-white px-4 focus-within:border-cobalt lg:w-[340px]">
          <Search className="size-5 shrink-0 text-navy" aria-hidden />
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
        {list.map((d) => {
          const slide = d.ext === "PPTX";
          return (
            <li key={d.id} id={d.id} className="group flex scroll-mt-40 flex-col overflow-hidden rounded-panel bg-white ring-1 ring-line transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(10,37,64,0.45)] target:ring-2 target:ring-cobalt">
              <div className="relative grid aspect-[16/11] place-items-center overflow-hidden bg-tint">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[6px] bg-white shadow-[0_18px_36px_-18px_rgba(10,37,64,0.55)] ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1.5",
                    slide ? "aspect-[16/9] w-[82%]" : "aspect-[1/1.414] h-[84%]"
                  )}
                >
                  <Image src={d.cover} alt={`Cover of ${d.title}`} fill sizes="(min-width:1280px) 18vw, (min-width:1024px) 22vw, 60vw" className="object-cover object-top" />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-navy">{d.ext ?? "Soon"}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[1.25rem] leading-snug tracking-snug">{d.title}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed">{d.desc}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <p className="num text-[14px] font-medium text-muted">{d.href ? `${d.length} · ${d.size}` : "Not uploaded yet"}</p>
                  <DownloadButton doc={d} className={btn} aria-label={`Download ${d.title}`}>
                    <Download className="size-[17px]" /> Download
                  </DownloadButton>
                </div>
              </div>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="col-span-full rounded-panel bg-tint px-6 py-16 text-center text-body">
            Nothing matches “{q}”. Try “thesis”, “proposal”, “IEEE” or “slides”.
          </li>
        )}
      </ul>
    </div>
  );
}
