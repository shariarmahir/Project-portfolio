import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { AUDIT_HREF as auditHref, SITE, THESIS } from "@/lib/data";
import { PHOTOS, VIDEOS } from "@/lib/media";

export function Footer() {
  return (
    <footer className="mt-32 rounded-t-slab bg-navy text-white/80">
      <div className="container pb-10 pt-20">
        <div className="grid gap-12 border-b border-white/15 pb-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="h2 max-w-2xl !text-white">Partner on Bangladesh&apos;s solar charging transition</h2>
            <p className="measure mt-6 text-lg text-white/75">
              Operators, investors and agencies can request a site feasibility audit: survey, load study, solar-yield model, single-line diagram and bill of quantities.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="primary" size="lg">
                <a href={auditHref}>
                  Request a site audit <ArrowRight />
                </a>
              </Button>
              <Button asChild variant="ghost-light" size="lg">
                <Link href="/downloads">Get the documents</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[15px] lg:justify-self-end">
            <div>
              <p className="font-semibold text-white">Explore</p>
              <ul className="mt-4 space-y-3">
                {[
                  ["/", "Home"],
                  ["/research", "Research"],
                  ["/commercial", "Commercial"],
                  ["/downloads", "Downloads"],
                  ["/author", "Author"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-helios">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Contact</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={`mailto:${SITE.email}`} className="break-all hover:text-helios">{SITE.email}</a>
                </li>
                <li>{THESIS.dept}</li>
                <li>{THESIS.university}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[auto_1fr] md:items-start">
          <Logo inverse />
          <dl className="grid gap-6 text-[14px] sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-white">Privacy</dt>
              <dd className="mt-1">No cookies, analytics or personal data collection.</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Open data</dt>
              <dd className="mt-1">Figures may be reused with attribution under CC BY 4.0.</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">IEEE copyright</dt>
              <dd className="mt-1">Published papers remain the copyright of their publishers.</dd>
            </div>
          </dl>
        </div>

        <details className="group border-t border-white/15 pt-6 text-[13px] text-white/60">
          <summary className="cursor-pointer list-none font-semibold text-white/80 hover:text-helios">Image and video credits</summary>
          <p className="mt-3 leading-relaxed">
            Photos from Unsplash (Unsplash License):{" "}
            {Object.values(PHOTOS).map((p, i, a) => (
              <span key={p.src}>
                <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{p.credit}</a>
                {i < a.length - 1 ? ", " : ". "}
              </span>
            ))}
            Video from Mixkit (Mixkit Free License): {Object.keys(VIDEOS).length} clips.
          </p>
        </details>

        <p className="mt-8 flex flex-col justify-between gap-2 text-[13px] text-white/60 sm:flex-row">
          <span>© 2026 {SITE.author} · {THESIS.university}</span>
          <span>Commercial figures are pre-feasibility estimates, not guaranteed returns.</span>
        </p>
      </div>
    </footer>
  );
}
