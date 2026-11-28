"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Sticky in-page navigation. The current item is the last section whose top has passed under the header. */
export function SectionNav({ items }: { items: readonly { id: string; label: string }[] }) {
  const [current, setCurrent] = React.useState<string | null>(null);

  React.useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = 170;
      let on: string | null = null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        const box = (el?.closest("section") ?? el)?.getBoundingClientRect();
        if (box && box.top <= line) on = it.id;
      }
      setCurrent(on);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-[84px] z-40 mt-10 px-3 sm:mt-12 sm:px-5">
      <ul className="glass-strong mx-auto flex w-max max-w-full gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]">
        {items.map((it) => {
          const on = current === it.id;
          return (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "block rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300",
                  on ? "bg-helios text-navy-900" : "text-body hover:bg-white/10 hover:text-ink"
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
