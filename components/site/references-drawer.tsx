"use client";
import * as React from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger, SheetContent } from "@/components/ui/dialog";
import { ACADEMIC_REFERENCE_COUNT, REFERENCES } from "@/lib/references";
import { cn } from "@/lib/utils";

const CATS = ["All", ...Array.from(new Set(REFERENCES.map((r) => r.cat)))];

export function ReferencesDrawer({ children }: { children: React.ReactNode }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const needle = q.trim().toLowerCase();
  const list = REFERENCES.filter((r) => (cat === "All" || r.cat === cat) && r.text.toLowerCase().includes(needle));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <SheetContent>
        <div className="border-b border-line px-6 pb-6 pt-8 sm:px-10">
          <DialogTitle className="h3 pr-14">References</DialogTitle>
          <DialogDescription className="mt-3 text-[15px] text-body">
            {ACADEMIC_REFERENCE_COUNT} sources cited in the IEEE paper, plus the guidelines and data behind the study.
          </DialogDescription>
          <label className="mt-6 flex h-14 items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-5 focus-within:border-helios-300">
            <span className="sr-only">Search references</span>
            <input
              id="reference-search"
              name="reference-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by author, title or journal"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
            />
            <Search className="size-5 text-muted" aria-hidden />
          </label>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                  cat === c ? "bg-helios text-navy-900" : "bg-white/[0.06] text-body hover:text-ink"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <ol className="flex-1 overflow-y-auto px-6 py-4 sm:px-10">
          {list.map((r) => (
            <li key={r.n} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-5 text-[15px] leading-relaxed last:border-0">
              <span className="num font-semibold text-helios-300">{r.n}</span>
              <div>
                <p className="text-body">{r.text}</p>
                {r.href && (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-ink underline-offset-4 hover:text-helios-300 hover:underline"
                  >
                    Open source <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                )}
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="py-16 text-center text-body">
              Nothing matches “{q}”. Try an author surname or a journal name.
            </li>
          )}
        </ol>
      </SheetContent>
    </Dialog>
  );
}
