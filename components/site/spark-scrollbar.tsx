"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Narrow page scrollbar with current flowing through the thumb and a spark at its leading edge.
 * Mouse and trackpad devices only: touch devices keep their native overlay bar.
 * Wheel, keyboard and touch scrolling stay native; the bar can also be dragged or clicked.
 */
export function SparkScrollbar() {
  const [enabled, setEnabled] = React.useState(false);
  const [geo, setGeo] = React.useState({ top: 0, h: 0, show: false });
  const [active, setActive] = React.useState(false);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const idle = React.useRef<number>();
  const last = React.useRef(0);
  const drag = React.useRef<{ y: number; scroll: number } | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("spark-scroll");
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const sh = root.scrollHeight;
      if (sh <= vh + 1) return setGeo((g) => ({ ...g, show: false }));
      const h = Math.max(48, (vh * vh) / sh);
      const y = window.scrollY;
      setGeo({ top: (y / (sh - vh)) * (vh - h), h, show: true });
      if (y !== last.current) {
        setDir(y > last.current ? 1 : -1);
        last.current = y;
        setActive(true);
        window.clearTimeout(idle.current);
        idle.current = window.setTimeout(() => setActive(false), 900);
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    return () => {
      root.classList.remove("spark-scroll");
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(idle.current);
    };
  }, [enabled]);

  if (!enabled || !geo.show) return null;

  const ratio = () => {
    const vh = window.innerHeight;
    return (document.documentElement.scrollHeight - vh) / (vh - geo.h);
  };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 right-0 z-[70] w-3.5">
      <div
        className={cn(
          "group pointer-events-auto absolute right-[3px] cursor-grab touch-none rounded-full transition-[width,opacity] duration-300 active:cursor-grabbing",
          "w-[4px] hover:w-[7px]",
          active || drag.current ? "opacity-100" : "opacity-70 hover:opacity-100"
        )}
        style={{ top: geo.top, height: geo.h }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, scroll: window.scrollY };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          window.scrollTo({ top: drag.current.scroll + (e.clientY - drag.current.y) * ratio(), behavior: "instant" as ScrollBehavior });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <span className="spark-thumb absolute inset-0 rounded-full" />
        <span
          className={cn(
            "spark-dot pointer-events-none absolute left-1/2 size-3.5 -translate-x-1/2 rounded-full transition-opacity duration-300",
            dir === 1 ? "-bottom-[7px]" : "-top-[7px]",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        />
      </div>
    </div>
  );
}
