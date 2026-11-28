"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { ReferencesDrawer } from "@/components/site/references-drawer";
import { DriveButton, DriveGlyph } from "@/components/site/download-gate";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/research", label: "Research" },
  { href: "/commercial", label: "Commercial" },
  { href: "/downloads", label: "Downloads" },
  { href: "/author", label: "Author" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const path = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hover, setHover] = React.useState<string | null>(null);

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  React.useEffect(() => setOpen(false), [path]);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const active = NAV.find((n) => path.startsWith(n.href))?.href ?? null;
  const lit = hover ?? active;

  return (
    <header className={cn("fixed inset-x-0 top-0 px-3 pt-3 transition-[padding] duration-500 sm:px-5", open ? "z-[75]" : "z-50", scrolled && "pt-2")}>
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center gap-4 rounded-full px-3 pl-4 transition-[height,background-color,box-shadow,border-color] duration-500 sm:pl-5",
          scrolled || open ? "glass-strong h-16" : "h-[72px] border border-transparent"
        )}
      >
        <Link href="/" aria-label="SolarEV BD home" className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="mx-auto hidden lg:block">
          <ul className="glass flex items-center gap-1 rounded-full p-1" onMouseLeave={() => setHover(null)}>
            {NAV.map((n) => {
              const on = lit === n.href;
              return (
                <li key={n.href} className="relative">
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 rounded-full", lit === active ? "bg-helios" : "bg-white/10")}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Link
                    href={n.href}
                    onMouseEnter={() => setHover(n.href)}
                    onFocus={() => setHover(n.href)}
                    onBlur={() => setHover(null)}
                    aria-current={active === n.href ? "page" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-[14.5px] font-semibold transition-colors duration-200 focus-visible:outline-none",
                      on && lit === active ? "text-navy-900" : "text-ink"
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
            <li className="relative">
              <ReferencesDrawer>
                <button
                  onMouseEnter={() => setHover(null)}
                  className="block rounded-full px-4 py-2 text-[14.5px] font-semibold text-ink transition-colors hover:text-helios-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300"
                >
                  References
                </button>
              </ReferencesDrawer>
            </li>
          </ul>
        </nav>

        <DriveButton
          aria-label="Open the research drive (password)"
          className="glass ml-auto hidden h-11 items-center gap-2.5 rounded-full px-4 text-[14px] font-semibold text-ink transition-colors hover:bg-white/10 sm:inline-flex lg:ml-0"
        >
          <DriveGlyph className="w-[18px]" /> Drive
        </DriveButton>
        <Link
          href="/downloads"
          className="hidden h-11 items-center gap-2 rounded-full bg-helios px-5 text-[14px] font-semibold text-navy-900 transition-colors hover:bg-helios-300 md:inline-flex"
        >
          Documents <ArrowRight className="size-4" />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="glass ml-auto grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-white/10 sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-strong fixed inset-x-3 bottom-3 top-[84px] overflow-y-auto rounded-panel lg:hidden"
          >
            <nav aria-label="Mobile" className="flex min-h-full flex-col px-6 pb-8 pt-3">
              <ul>
                {[{ href: "/", label: "Home" }, ...NAV].map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.04 * i }}
                  >
                    <Link
                      href={l.href}
                      aria-current={path === l.href ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between border-b border-white/10 py-4 text-[1.6rem] font-semibold tracking-display",
                        path === l.href ? "text-helios-300" : "text-ink"
                      )}
                    >
                      {l.label}
                      <ArrowRight className="size-5 text-muted" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ReferencesDrawer>
                <button className="flex items-center justify-between border-b border-white/10 py-4 text-left text-[1.6rem] font-semibold tracking-display text-ink">
                  References <ArrowUpRight className="size-5 text-muted" />
                </button>
              </ReferencesDrawer>
              <DriveButton className="glass mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full text-base font-semibold text-ink">
                <DriveGlyph className="w-5" /> Open the research drive
              </DriveButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
