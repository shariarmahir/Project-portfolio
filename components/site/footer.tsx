import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { DriveButton, DriveGlyph } from "@/components/site/download-gate";
import { SITE, THESIS } from "@/lib/data";

const NAME = "Mahir Shariar Mahin";

const LINKS = [
  ["/", "Home"],
  ["/research", "Research"],
  ["/commercial", "Commercial"],
  ["/downloads", "Downloads"],
  ["/author", "Author"],
] as const;

export function Footer() {
  return (
    <footer id="site-footer" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="glass-strong footer-slab relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-slab">
        {/* sunlit top edge, rays in the corner and the giant wordmark */}
        <span aria-hidden className="footer-edge absolute inset-x-0 top-0 h-px" />
        <div aria-hidden className="sun-rays absolute -right-[16vmax] -top-[22vmax] -z-10 size-[52vmax] opacity-40" />
        <p aria-hidden className="footer-word pointer-events-none absolute inset-x-0 -bottom-[0.18em] -z-10 select-none text-center">
          SolarEV BD
        </p>

        <div className="container pb-8 pt-14 sm:pt-16">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="h2">Read the full work</h2>
              <p className="measure mt-4 text-lg">
                The thesis, the book, the IEEE paper, both proposals and both decks are in the document library. Everything is also in one shared drive.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/downloads"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-helios pl-8 pr-2 text-base font-semibold text-navy-900 shadow-[0_18px_40px_-18px_rgba(245,158,11,0.8)] transition-colors hover:bg-helios-300"
                >
                  Open the documents
                  <span className="grid size-10 place-items-center rounded-full bg-navy-900 text-helios transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-[18px]" />
                  </span>
                </Link>
                <DriveButton className="glass inline-flex h-14 items-center gap-3 rounded-full px-7 text-base font-semibold text-ink transition-colors hover:bg-white/10">
                  <DriveGlyph className="w-5" /> Research drive
                </DriveButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-[15px] lg:justify-self-end">
              <div>
                <p className="font-semibold text-ink">Explore</p>
                <ul className="mt-4 space-y-3">
                  {LINKS.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="footer-link group inline-flex items-center gap-1.5 transition-colors hover:text-ink">
                        {label}
                        <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink">Contact</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex gap-2.5">
                    <Mail className="mt-[3px] size-4 shrink-0 text-helios-300" />
                    <a href={`mailto:${SITE.email}`} className="footer-link break-all transition-colors hover:text-ink">
                      {SITE.email}
                    </a>
                  </li>
                  <li className="flex gap-2.5">
                    <Building2 className="mt-[3px] size-4 shrink-0 text-helios-300" />
                    {THESIS.dept}
                  </li>
                  <li className="flex gap-2.5">
                    <MapPin className="mt-[3px] size-4 shrink-0 text-helios-300" />
                    {THESIS.university}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
            <Logo />
            <p className="text-[14px] text-muted">Commercial figures are screening estimates from the thesis model, not guaranteed returns.</p>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <p className="text-[13px] text-muted">
              © 2026 {SITE.author} · {THESIS.university}
            </p>
            <p className="text-[13px] text-muted">
              Designed and built by{" "}
              <span className="sr-only">{NAME}</span>
              <span aria-hidden className="whitespace-nowrap text-[16px] font-extrabold text-helios">
                {NAME.split("").map((ch, i) => (
                  <span key={i} className="builder-ch" style={{ animationDelay: `${i * 0.08}s` }}>
                    {ch === " " ? "\u00a0" : ch}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
