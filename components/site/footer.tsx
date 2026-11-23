import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { AUDIT_HREF as auditHref, SITE, THESIS } from "@/lib/data";

export function Footer() {
  return (
    <footer className="rounded-t-slab bg-navy text-white/80">
      <div className="container pb-8 pt-14 sm:pt-16">
        <div className="grid gap-10 border-b border-white/15 pb-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="h2 !text-white">Plan a solar charging site</h2>
            <p className="measure mt-4 text-lg text-white/75">
              Operators, investors and agencies can request a site feasibility audit: survey, load study, solar-yield model, single-line diagram and bill of quantities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo inverse />
          <p className="text-[14px] text-white/65">Commercial figures are pre-feasibility estimates, not guaranteed returns.</p>
        </div>

        <p className="flex flex-col justify-between gap-2 border-t border-white/15 pt-5 text-[13px] text-white/60 sm:flex-row">
          <span>© 2026 {SITE.author} · {THESIS.university}</span>
          <span>
            Built by <span className="font-semibold text-white">Mahir Shariar Mahin</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
