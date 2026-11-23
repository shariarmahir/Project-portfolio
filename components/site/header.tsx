"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { ReferencesDrawer } from "@/components/site/references-drawer";
import { Button } from "@/components/ui/button";
import { AUDIT_HREF as auditHref } from "@/lib/data";
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
    <header
      className={cn(
        "sticky top-0 transition-[background-color,box-shadow,border-color] duration-500",
        open ? "z-[75]" : "z-50",
        open
          ? "border-b border-line bg-white"
          : scrolled
            ? "border-b border-line/70 bg-white/85 shadow-header backdrop-blur-xl"
            : "border-b border-transparent bg-canvas"
      )}
    >
      <div className={cn("container flex items-center gap-4 transition-[height] duration-500", scrolled ? "h-16" : "h-20")}>
        <Link href="/" aria-label="SolarEV BD home" className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-4">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-white/80 p-1" onMouseLeave={() => setHover(null)}>
            {NAV.map((n) => {
              const on = lit === n.href;
              return (
                <li key={n.href} className="relative">
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 rounded-full", lit === active ? "bg-navy" : "bg-tint")}
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
                      on && lit === active ? "text-white" : "text-ink"
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
                  className="block rounded-full px-4 py-2 text-[14.5px] font-semibold text-ink transition-colors hover:text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                >
                  References
                </button>
              </ReferencesDrawer>
            </li>
          </ul>
        </nav>

        <Button asChild variant="primary" size="sm" className="ml-auto hidden h-11 sm:inline-flex lg:ml-0">
          <a href={auditHref}>
            Request a site audit <ArrowRight />
          </a>
        </Button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto grid size-11 place-items-center rounded-full border border-line bg-white text-navy transition-colors hover:bg-tint sm:ml-0 lg:hidden"
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
            className="fixed inset-x-0 bottom-0 overflow-y-auto border-t border-line bg-white lg:hidden"
            style={{ top: scrolled ? 64 : 80 }}
          >
            <nav aria-label="Mobile" className="container flex min-h-full flex-col pb-10 pt-4">
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
                        "flex items-center justify-between border-b border-line py-4 text-[1.6rem] font-semibold tracking-display",
                        path === l.href ? "text-cobalt" : "text-ink"
                      )}
                    >
                      {l.label}
                      <ArrowRight className="size-5 text-muted" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ReferencesDrawer>
                <button className="flex items-center justify-between border-b border-line py-4 text-left text-[1.6rem] font-semibold tracking-display text-ink">
                  References <ArrowUpRight className="size-5 text-muted" />
                </button>
              </ReferencesDrawer>
              <Button asChild variant="primary" size="lg" className="mt-8">
                <a href={auditHref}>
                  Request a site audit <ArrowRight />
                </a>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
