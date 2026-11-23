import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, LockKeyhole } from "lucide-react";
import { DownloadLibrary } from "@/components/downloads/library";
import { DownloadButton } from "@/components/site/download-gate";
import { GROUP_LABEL, resolveDownloads, VISIT_LINK } from "@/lib/downloads";
import { THESIS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Thesis and commercial proposals, thesis draft, thesis book, IEEE publication and presentation slides.",
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
  const book = docs.find((d) => d.id === "thesis-book")!;
  const pdfs = ready.filter((d) => d.ext === "PDF").length;

  return (
    <>
      <header className="container pt-10 sm:pt-14">
        <h1 className="h1">Every document behind the work</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <p className="lead sm:text-xl">The thesis, both proposals, the IEEE paper and the two presentation decks, in their final versions.</p>
          <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl bg-white ring-1 ring-line">
            {[
              ["Documents", String(ready.length)],
              ["Formats", `${pdfs} PDF · ${ready.length - pdfs} PPTX`],
              ["Total size", totalSize(ready.map((d) => d.size))],
            ].map(([k, v]) => (
              <div key={k} className="px-5 py-4">
                <dt className="text-[13px] font-medium text-muted">{k}</dt>
                <dd className="num mt-1 whitespace-nowrap text-[15px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Featured: the thesis book */}
      <section aria-labelledby="featured" className="container pt-10 sm:pt-12">
        <div className="relative grid overflow-hidden rounded-panel bg-navy text-white/80 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <h2 id="featured" className="h2 !text-white">
              The thesis book
            </h2>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed">{THESIS.title}.</p>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
              {[
                ["Format", book.ext ?? "PDF"],
                ["Length", book.length],
                ["Size", book.size ?? "–"],
                ["Supervisor", THESIS.supervisor],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[13px] text-white/60">{k}</dt>
                  <dd className="num mt-0.5 font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <DownloadButton
                doc={book}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-helios px-8 text-base font-semibold text-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Download className="size-[18px]" /> Download the thesis book
              </DownloadButton>
              <Link
                href="/research"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/60 px-8 text-base font-semibold text-white transition-colors hover:bg-white hover:text-navy"
              >
                Read the summary <ArrowRight className="size-[18px]" />
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(circle_at_70%_40%,#1D4ED8_0%,transparent_60%)] opacity-60" />
            <div className="absolute left-[18%] top-1/2 aspect-[1/1.414] h-[78%] -translate-y-1/2 -rotate-[5deg] overflow-hidden rounded-md shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
              <Image src="/media/covers/thesis-draft.jpg" alt="" fill sizes="300px" className="object-cover object-top" />
            </div>
            <div className="absolute left-[34%] top-1/2 aspect-[1/1.414] h-[84%] -translate-y-1/2 rotate-[3deg] overflow-hidden rounded-md shadow-[0_40px_80px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              <Image src={book.cover} alt="Cover of the thesis book" fill sizes="340px" className="object-cover object-top" priority />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="library" className="section container">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end lg:mb-10">
          <h2 id="library" className="h2">
            The full library
          </h2>
          <p className="flex items-center gap-2 text-[15px] text-muted">
            <LockKeyhole className="size-4 text-cobalt" aria-hidden /> Each download asks for the access password.
          </p>
        </div>
        <DownloadLibrary docs={docs} />

        <div className="mt-10 grid gap-6 rounded-panel bg-cobalt p-7 text-white/85 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="h3 !text-white">{VISIT_LINK.title}</h2>
            <p className="mt-2 max-w-[60ch] text-[16px]">{VISIT_LINK.desc}</p>
          </div>
          <a
            href={VISIT_LINK.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-semibold text-navy transition-colors hover:bg-helios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {VISIT_LINK.action} <ArrowUpRight className="size-[18px]" />
          </a>
        </div>
      </section>
    </>
  );
}
