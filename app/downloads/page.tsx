import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { DownloadLibrary } from "@/components/downloads/library";
import { DocShowcase } from "@/components/downloads/showcase";
import { Reveal } from "@/components/charts/kit";
import { GROUP_LABEL, resolveDownloads } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Thesis and commercial proposals, thesis draft, thesis book, IEEE publication, presentation decks and the shared research drive.",
};

function totalSize(sizes: (string | null)[]) {
  const mb = sizes.reduce((sum, s) => {
    if (!s) return sum;
    const [n, u] = s.split(" ");
    return sum + (u === "KB" ? Number(n) / 1024 : Number(n));
  }, 0);
  return `${mb.toFixed(1)} MB`;
}

export default function DownloadsPage() {
  const docs = resolveDownloads().map((d) => ({ ...d, groupLabel: GROUP_LABEL[d.group] }));
  const ready = docs.filter((d) => d.href);
  const pdfs = ready.filter((d) => d.ext === "PDF").length;

  return (
    <>
      <header className="relative isolate overflow-hidden pt-32 sm:pt-36">
        <div aria-hidden className="sun-rays absolute -right-[18vmax] -top-[34vmax] -z-10 size-[80vmax] opacity-50" />
        <div className="container">
          <h1 className="h1">Every document behind the work</h1>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <p className="lead sm:text-xl">The thesis, the book, both proposals, the IEEE paper and the two animated decks, in their final versions, plus the shared drive.</p>
            <dl className="glass grid grid-cols-3 divide-x divide-white/10 rounded-2xl">
              {[
                ["Documents", String(ready.length)],
                ["Formats", `${pdfs} PDF · ${ready.length - pdfs} PPTX`],
                ["Total size", totalSize(ready.map((d) => d.size))],
              ].map(([k, v]) => (
                <div key={k} className="px-3.5 py-3.5 sm:px-5 sm:py-4">
                  <dt className="text-[13px] font-medium text-muted">{k}</dt>
                  <dd className="num mt-1 text-[14px] font-semibold leading-snug text-ink sm:whitespace-nowrap sm:text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <section aria-labelledby="featured" className="container pt-10 sm:pt-12">
        <Reveal>
          <DocShowcase docs={docs} />
        </Reveal>
      </section>

      <section aria-labelledby="library" className="section container">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end lg:mb-10">
          <h2 id="library" className="h2">
            The full library
          </h2>
          <p className="flex items-center gap-2 text-[15px] text-muted">
            <LockKeyhole className="size-4 text-helios-300" aria-hidden /> Each download and the drive ask for the access password.
          </p>
        </div>
        <DownloadLibrary docs={docs} />
      </section>
    </>
  );
}
