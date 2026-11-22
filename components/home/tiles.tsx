import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReferencesDrawer } from "@/components/site/references-drawer";
import { DocumentFinder } from "@/components/home/document-finder";
import { PHOTOS } from "@/lib/media";
import { REFERENCES } from "@/lib/references";
import { cn } from "@/lib/utils";

function Tile({
  href,
  title,
  tone,
  children,
}: {
  href: string;
  title: string;
  tone: "navy" | "cobalt" | "tint";
  children?: React.ReactNode;
}) {
  const tones = {
    navy: "bg-navy text-white",
    cobalt: "bg-cobalt text-white",
    tint: "bg-tint text-ink",
  };
  return (
    <Link
      href={href}
      className={cn("group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-panel p-7 sm:p-8", tones[tone])}
    >
      <span className={cn("relative z-10 max-w-[12ch] text-[clamp(1.5rem,2.2vw,1.9rem)] font-semibold leading-[1.1] tracking-display", tone !== "tint" && "text-white")}>
        {title}
      </span>
      <ArrowRight className="relative z-10 size-7 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.75} />
      {children}
    </Link>
  );
}

export function KeyTiles() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DocumentFinder />
      </div>
      <Link href="/commercial" className="group relative min-h-[260px] overflow-hidden rounded-panel">
        <Image src={PHOTOS.warehouse.src} alt={PHOTOS.warehouse.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/35 to-navy/80" />
        <span className="absolute left-7 top-7 max-w-[13ch] text-[clamp(1.5rem,2.2vw,1.9rem)] font-semibold leading-[1.1] tracking-display text-white">
          The commercial case
        </span>
        <span className="absolute bottom-7 left-7 inline-flex items-center gap-2 font-semibold text-white">
          Compare the models <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
      <Tile href="/research" title="Results and evidence" tone="navy" />
      <Tile href="/author" title="About the author" tone="cobalt" />
      <ReferencesDrawer>
        <button className="group flex min-h-[230px] flex-col justify-between rounded-panel bg-tint p-7 text-left text-ink sm:p-8">
          <span className="max-w-[12ch] text-[clamp(1.5rem,2.2vw,1.9rem)] font-semibold leading-[1.1] tracking-display">All {REFERENCES.length} references</span>
          <ArrowRight className="size-7 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={1.75} />
        </button>
      </ReferencesDrawer>
    </div>
  );
}
