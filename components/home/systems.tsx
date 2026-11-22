import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Bolt } from "@/components/site/marks";
import { Carousel } from "@/components/site/media";
import { Button } from "@/components/ui/button";
import { SYSTEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

const THEME = {
  tint: { panel: "bg-tint", kicker: "text-cobalt", title: "text-ink", body: "text-body", point: "text-ink", btn: "navy" as const },
  navy: { panel: "bg-navy", kicker: "text-helios", title: "!text-white", body: "text-white/80", point: "text-white", btn: "primary" as const },
  white: { panel: "bg-white", kicker: "text-cobalt", title: "text-ink", body: "text-body", point: "text-ink", btn: "navy" as const },
};

/** Stacked overlap panels: each system slides over the last. */
export function SystemsStack() {
  return (
    <div>
      {SYSTEMS.map((s, i) => {
        const t = THEME[s.theme];
        return (
          <section
            key={s.key}
            aria-labelledby={`sys-${s.key}`}
            className={cn("rounded-t-slab md:sticky md:top-20", t.panel, i > 0 && "-mt-10")}
            style={{ zIndex: i + 1 }}
          >
            <div className="container grid items-center gap-12 py-20 md:min-h-[calc(100vh-5rem)] lg:grid-cols-[1fr_1.35fr] lg:py-24">
              <div>
                <p className={cn("text-[17px] font-semibold", t.kicker)}>{s.kicker}</p>
                <h3 id={`sys-${s.key}`} className={cn("h2 mt-3", t.title)}>
                  {s.title}
                </h3>
                <p className={cn("measure mt-7 text-lg", t.body)}>{s.body}</p>
                <ul className="mt-9 space-y-5">
                  {s.points.map((p) => (
                    <li key={p} className={cn("flex items-start gap-4 text-lg font-semibold tracking-snug", t.point)}>
                      <Bolt className="mt-0.5 h-6 w-4" />
                      <span className="num">{p}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={t.btn} className="mt-10">
                  <Link href={s.href}>
                    {s.cta} <ArrowRight />
                  </Link>
                </Button>
              </div>
              <Carousel keys={s.images} label={`${s.title} images`} className="aspect-[4/3] w-full lg:aspect-[7/5]" />
            </div>
          </section>
        );
      })}
    </div>
  );
}
