"use client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger, SheetContent } from "@/components/ui/dialog";
import { PHOTOS, VIDEOS } from "@/lib/media";

/** Edge tab on the right of every page that opens the image and video credits. */
export function CreditsTab() {
  const photos = Object.values(PHOTOS);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed right-0 top-[34%] z-[65] rounded-l-xl bg-helios py-3 pl-1.5 pr-[16px] text-[11px] sm:py-4 sm:pl-2 sm:pr-[18px] font-semibold text-navy shadow-[0_8px_24px_-10px_rgba(10,37,64,0.6)] transition-[padding,background-color] duration-300 [writing-mode:vertical-rl] hover:bg-white hover:pr-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt print:hidden sm:text-[13px]"
        >
          <span className="rotate-180">Credits</span>
        </button>
      </DialogTrigger>
      <SheetContent closeLabel="Close credits" className="max-w-xl">
        <div className="border-b border-line px-6 pb-6 pt-8 sm:px-10">
          <DialogTitle className="h3 pr-14">Credits</DialogTitle>
          <DialogDescription className="mt-3 text-[15px] text-body">
            Photos are from Wikimedia Commons, used under the licence shown, and from the author&apos;s own project. Video clips are from Mixkit.
          </DialogDescription>
        </div>
        <ul className="flex-1 overflow-y-auto px-6 py-2 sm:px-10">
          {photos.map((p) => (
            <li key={p.src} className="flex gap-4 border-b border-line py-4 last:border-0">
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-tint">
                <Image src={p.src} alt="" width={80} height={56} className="size-full object-cover" />
              </span>
              <div className="min-w-0 text-[14px] leading-snug">
                <p className="line-clamp-2 text-body">{p.alt}</p>
                <p className="mt-1.5 font-semibold text-ink">
                  {p.credit} <span className="font-medium text-muted">· {p.license}</span>
                </p>
                <a
                  href={p.source}
                  target={p.source.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-cobalt underline-offset-4 hover:underline"
                >
                  {p.source.startsWith("http") ? "Source" : "From the thesis"} <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </li>
          ))}
          {Object.entries(VIDEOS).map(([k, v]) => (
            <li key={k} className="flex gap-4 border-b border-line py-4 last:border-0">
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-tint">
                <Image src={v.poster} alt="" width={80} height={56} className="size-full object-cover" />
              </span>
              <div className="text-[14px] leading-snug">
                <p className="text-body">{k === "hero" ? "Aerial video of a solar array (home page)" : "Video of modules being installed (home page)"}</p>
                <p className="mt-1.5 font-semibold text-ink">
                  {v.credit} <span className="font-medium text-muted">· Mixkit Free License</span>
                </p>
                <a href={v.source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-cobalt underline-offset-4 hover:underline">
                  Source <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Dialog>
  );
}
