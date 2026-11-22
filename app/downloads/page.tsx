import type { Metadata } from "next";
import { ArrowUpRight, Download } from "lucide-react";
import { PageIntro } from "@/components/site/page-intro";
import { resolveDownloads, VISIT_LINK } from "@/lib/downloads";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Thesis and commercial proposals, thesis draft, thesis book, IEEE publication and presentation slides.",
};

const GROUPS = [
  { id: "thesis", title: "Thesis" },
  { id: "commercial", title: "Commercial" },
  { id: "publication", title: "Publication and slides" },
] as const;

export default function DownloadsPage() {
  const docs = resolveDownloads();
  const ready = docs.filter((d) => d.href).length;

  return (
    <>
      <PageIntro
        kicker="Downloads"
        title="Every document behind the work"
        lead={
          ready === docs.length
            ? "All documents are ready to download."
            : `${ready} of ${docs.length} documents are available now. The rest are being finalised and will appear here as soon as they are uploaded.`
        }
        photo="installHands"
      />

      <div className="container space-y-20 pt-24">
        {GROUPS.map((g) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="h3">
              {g.title}
            </h2>
            <ul className="mt-6 border-t border-line">
              {docs
                .filter((d) => d.group === g.id)
                .map((d) => (
                  <li key={d.id} id={d.id} className="scroll-mt-28 border-b border-line">
                    <div className="grid gap-5 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
                      <div>
                        <h3 className="text-[clamp(1.35rem,2.2vw,1.9rem)] tracking-display">{d.title}</h3>
                        <p className="measure mt-2 text-[16px]">{d.desc}</p>
                        <p className="mt-2 text-[14px] font-semibold text-muted">
                          {d.href ? `${d.ext} · ${d.size}` : "Not uploaded yet"}
                        </p>
                      </div>
                      {d.href ? (
                        <a
                          href={d.href}
                          download
                          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-navy px-6 text-[15px] font-semibold text-white transition-colors hover:bg-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2"
                        >
                          <Download className="size-[18px]" /> {d.action}
                        </a>
                      ) : (
                        <span
                          aria-disabled="true"
                          className={cn("inline-flex h-12 cursor-not-allowed items-center justify-center rounded-full border-[1.5px] border-dashed border-line px-6 text-[15px] font-semibold text-muted")}
                        >
                          Coming soon
                        </span>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="g-link" className="rounded-panel bg-navy p-8 text-white/80 sm:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 id="g-link" className="h3 !text-white">
                {VISIT_LINK.title}
              </h2>
              <p className="measure mt-3 text-[16px]">{VISIT_LINK.desc}</p>
            </div>
            <a
              href={VISIT_LINK.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-helios px-6 text-[15px] font-semibold text-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {VISIT_LINK.action} <ArrowUpRight className="size-[18px]" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
