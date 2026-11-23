"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Sticky in-page navigation that follows the section being read. */
export function SectionNav({ items }: { items: readonly { id: string; label: string }[] }) {
  const [current, setCurrent] = React.useState<string | null>(null);

  React.useEffect(() => {
    const owner = new Map<Element, string>();
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) owner.set(el.closest("section") ?? el, it.id);
    });
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setCurrent(owner.get(seen[0].target) ?? null);
      },
      { rootMargin: "-140px 0px -55% 0px" }
    );
    owner.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-16 z-40 mt-10 border-b border-line bg-canvas/90 backdrop-blur-xl sm:mt-12">
      <ul className="container flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
        {items.map((it) => {
          const on = current === it.id;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "block rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
                  on ? "bg-navy text-white" : "text-body hover:bg-tint hover:text-navy"
                )}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
