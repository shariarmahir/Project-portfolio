import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AuthorPortrait } from "@/components/author/portrait";
import { ReferencesDrawer } from "@/components/site/references-drawer";
import { DocumentFinder } from "@/components/home/document-finder";
import type { GateDoc } from "@/components/site/download-gate";
import { AUTHOR, THESIS } from "@/lib/data";
import { PHOTOS } from "@/lib/media";
import { REFERENCES } from "@/lib/references";

const tileTitle = "text-[clamp(1.35rem,1.9vw,1.7rem)] font-semibold leading-[1.12] tracking-display";

/** Short titles of the first few cited works, for the references tile. */
const SAMPLE_REFS = REFERENCES.slice(0, 3).map((r) => {
  const m = r.text.match(/“([^”]+)”/);
  return { n: r.n, title: (m ? m[1] : r.text).replace(/,$/, "") };
});

export function KeyTiles({ docs }: { docs: GateDoc[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        <DocumentFinder docs={docs} />
      </div>

      <Link href="/commercial" className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-panel bg-navy p-7 sm:p-8">
        <Image
          src={PHOTOS.rooftop.src}
          alt={PHOTOS.rooftop.alt}
          fill
          sizes="(min-width:1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/0" />
        <span className={`relative ${tileTitle} text-white`}>The commercial case</span>
        <span className="relative mt-3 max-w-[30ch] text-[15px] text-white/80">A 300 kWp depot hub or a 20 kW net-metered neighbourhood hub.</span>
        <span className="relative mt-5 inline-flex items-center gap-2 font-semibold text-helios">
          Compare the models <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      <Link href="/research" className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-panel bg-navy p-7 sm:p-8">
        <Image
          src={PHOTOS.panelsSky.src}
          alt={PHOTOS.panelsSky.alt}
          fill
          sizes="(min-width:1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10" />
        <span className={`relative ${tileTitle} text-white`}>Results and evidence</span>
        <span className="relative mt-3 max-w-[32ch] text-[15px] text-white/80">Simulink model, bench prototype, PVsyst economics, Monte Carlo risk and the LCA.</span>
        <ArrowRight className="relative mt-5 size-6 text-helios transition-transform group-hover:translate-x-1.5" />
      </Link>

      <Link href="/author" className="group flex min-h-[300px] flex-col justify-between overflow-hidden rounded-panel bg-cobalt p-7 text-white sm:p-8">
        <div className="flex items-center gap-4">
          <AuthorPortrait className="size-16 shrink-0 rounded-full ring-2 ring-white/30" sizes="64px" />
          <div>
            <p className="text-lg font-semibold tracking-snug">{AUTHOR.name}</p>
            <p className="text-[14px] text-white/80">MSc EEE, {THESIS.university.split(",")[0]}</p>
          </div>
        </div>
        <div>
          <span className={`block ${tileTitle} text-white`}>About the author</span>
          <span className="mt-3 block max-w-[32ch] text-[15px] text-white/85">Academic record, tools and methods, and how to cite the thesis.</span>
          <ArrowRight className="mt-5 size-6 text-white transition-transform group-hover:translate-x-1.5" />
        </div>
      </Link>

      <ReferencesDrawer>
        <button className="group flex min-h-[300px] flex-col justify-between rounded-panel bg-white p-7 text-left ring-1 ring-line transition-shadow hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt sm:p-8">
          <span className={`${tileTitle} text-ink`}>All {REFERENCES.length} references</span>
          <ol className="mt-5 space-y-3">
            {SAMPLE_REFS.map((r) => (
              <li key={r.n} className="grid grid-cols-[1.75rem_1fr] text-[14px] leading-snug">
                <span className="num font-semibold text-cobalt">{r.n}</span>
                <span className="line-clamp-2 text-body">{r.title}</span>
              </li>
            ))}
          </ol>
          <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-navy">
            Search the full list <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </button>
      </ReferencesDrawer>
    </div>
  );
}
