"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
import { DownloadButton, type GateDoc } from "@/components/site/download-gate";

/** Live document search: type to filter, download in place (password dialog) or open the library. */
export function DocumentFinder({ docs }: { docs: GateDoc[] }) {
  const [q, setQ] = React.useState("");
  const needle = q.trim().toLowerCase();
  const list = docs.filter((d) => d.title.toLowerCase().includes(needle) || (d.ext ?? "").toLowerCase().includes(needle));

  return (
    <div className="flex h-full flex-col rounded-panel bg-navy p-6 text-white/80 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2 className="h3 !text-white">Find a document</h2>
        <Link href="/downloads" className="inline-flex items-center gap-2 text-[15px] font-semibold text-helios underline-offset-4 hover:underline">
          Open the library <ArrowRight className="size-[18px]" />
        </Link>
      </div>

      <label className="mt-6 flex h-14 items-center gap-3 rounded-2xl bg-white px-5 ring-cobalt/30 focus-within:ring-4">
        <Search className="size-5 shrink-0 text-navy" aria-hidden />
        <span className="sr-only">Search documents</span>
        <input
          id="finder-search"
          name="finder-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the thesis, proposals, paper or slides"
          className="h-full w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted"
        />
      </label>

      <ul className="mt-3 max-h-[300px] flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]" aria-live="polite">
        {list.map((d) => (
          <li key={d.id} className="flex items-center gap-4 border-b border-white/10 py-3 last:border-0">
            <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-[4px] bg-white">
              <Image src={d.cover} alt="" width={36} height={48} className="size-full object-cover object-top" />
            </span>
            <Link href={`/downloads#${d.id}`} className="min-w-0 flex-1 rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios">
              <span className="block truncate text-[15px] font-semibold text-white">{d.title}</span>
              <span className="mt-0.5 block text-[13px] text-white/65">{d.href ? `${d.ext} · ${d.length} · ${d.size}` : "Coming soon"}</span>
            </Link>
            <DownloadButton
              doc={d}
              aria-label={`Download ${d.title}`}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-helios hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios"
            >
              <Download className="size-[18px]" />
            </DownloadButton>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-[15px]">Nothing matches “{q}”. Try “thesis”, “proposal” or “slides”.</li>}
      </ul>
    </div>
  );
}
