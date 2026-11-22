"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PHOTOS } from "@/lib/media";

const DOCS = [
  { id: "thesis-book", label: "Thesis book" },
  { id: "thesis-draft", label: "Thesis draft" },
  { id: "thesis-proposal", label: "Project proposal: thesis" },
  { id: "commercial-proposal", label: "Project proposal: commercial" },
  { id: "ieee-publication", label: "IEEE publication" },
  { id: "presentation-slides", label: "Presentation slides" },
];

export function DocumentFinder() {
  const router = useRouter();
  const [doc, setDoc] = React.useState(DOCS[0].id);
  return (
    <div className="relative overflow-hidden rounded-panel bg-tint p-7 sm:p-9">
      <div className="pointer-events-none absolute -right-6 -top-6 hidden h-40 w-56 overflow-hidden rounded-panel sm:block">
        <Image src={PHOTOS.chip.src} alt="" fill sizes="224px" className="object-cover" />
      </div>
      <h2 className="h3 max-w-[14ch]">Find a document</h2>
      <p className="mt-3 max-w-sm text-[15px]">Every thesis document, one step away.</p>
      <form
        className="mt-7 flex h-16 items-center gap-2 rounded-2xl border border-line bg-white pl-5 pr-2 focus-within:border-cobalt"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/downloads#${doc}`);
        }}
      >
        <label htmlFor="doc-finder" className="sr-only">
          Choose a document
        </label>
        <select
          id="doc-finder"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          className="h-full min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-base font-semibold text-ink outline-none"
        >
          {DOCS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none mr-2 size-5 shrink-0 text-navy" aria-hidden />
        <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white transition-colors hover:bg-cobalt">
          Go <ArrowRight className="size-[18px]" />
        </button>
      </form>
    </div>
  );
}
