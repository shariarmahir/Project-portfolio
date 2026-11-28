"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/charts/kit";
import { cn } from "@/lib/utils";

export function Faq({ items, title = "Questions examiners ask" }: { items: readonly { q: string; a: string }[]; title?: string }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section aria-labelledby="faq-h" className="section container">
      <Reveal>
        <h2 id="faq-h" className="h2">
          {title}
        </h2>
      </Reveal>
      <div className="mt-8 lg:mt-10">
        <Reveal delay={0.06} className="glass rounded-slab px-2 sm:px-4">
          <ul>
            {items.map((f, i) => {
              const on = open === i;
              return (
                <li key={f.q} className="border-b border-white/10 last:border-0">
                  <h3 className="text-[1.05rem] tracking-snug">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="flex w-full items-center justify-between gap-6 px-4 py-5 text-left font-semibold text-ink"
                    >
                      {f.q}
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full border border-white/15 transition-transform duration-300", on && "rotate-45 border-helios bg-helios text-navy-900")}>
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="measure px-4 pb-6 text-[15.5px] text-body">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
