"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/marks";
import { ReferencesDrawer } from "@/components/site/references-drawer";
import { Button } from "@/components/ui/button";
import { AUDIT_HREF as auditHref } from "@/lib/data";
import { cn } from "@/lib/utils";

const VIEWS = [
  { href: "/research", label: "Research" },
  { href: "/commercial", label: "Commercial" },
];
const LINKS = [
  { href: "/downloads", label: "Downloads" },
  { href: "/author", label: "Author" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  React.useEffect(() => setOpen(false), [path]);

  const linkCls = (href: string) =>
    cn("text-[15px] font-semibold transition-colors", path === href ? "text-cobalt" : "text-ink hover:text-cobalt");

  return (
    <header className={cn("sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur-sm transition-shadow", scrolled && "shadow-header")}>
      <div className="container flex h-20 items-center gap-6">
        <Link href="/" aria-label="SolarEV BD home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="View" className="hidden rounded-[14px] border border-line bg-white p-1 md:flex">
          {VIEWS.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              aria-current={path === v.href ? "page" : undefined}
              className={cn(
                "rounded-[10px] px-4 py-2 text-[15px] font-semibold transition-colors",
                path === v.href ? "bg-tint text-navy" : "text-ink hover:text-cobalt"
              )}
            >
              {v.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)} aria-current={path === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <ReferencesDrawer>
            <button className="text-[15px] font-semibold text-ink transition-colors hover:text-cobalt">References</button>
          </ReferencesDrawer>
        </nav>

        <Button asChild variant="primary" size="sm" className="ml-auto hidden sm:inline-flex lg:ml-4">
          <a href={auditHref}>
            Request a site audit <ArrowRight />
          </a>
        </Button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto grid size-11 place-items-center rounded-full text-navy hover:bg-tint sm:ml-0 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-canvas lg:hidden"
          >
            <nav aria-label="Mobile" className="container flex flex-col py-4">
              {[{ href: "/", label: "Home" }, ...VIEWS, ...LINKS].map((l) => (
                <Link key={l.href} href={l.href} className="border-b border-line py-4 text-xl font-semibold tracking-snug text-ink">
                  {l.label}
                </Link>
              ))}
              <ReferencesDrawer>
                <button className="border-b border-line py-4 text-left text-xl font-semibold tracking-snug text-ink">References</button>
              </ReferencesDrawer>
              <Button asChild variant="primary" className="mt-6 sm:hidden">
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
