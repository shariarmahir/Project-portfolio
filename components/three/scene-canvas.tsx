"use client";
import * as React from "react";
import Image from "next/image";
import type { Anchor, Preset, SceneHandle } from "@/components/three/solar-scene";
import { useReduced } from "@/components/charts/kit";
import { cn } from "@/lib/utils";

type Label = { id: string; text: string; sub?: string };

/**
 * Live three.js scene. The canvas is created inside the effect so every mount gets a fresh WebGL
 * context; rendering pauses when the scene is off screen or the tab is hidden. If WebGL is missing,
 * the pre-rendered still of the same scene is shown instead.
 */
export function SceneCanvas({
  preset,
  shift = 0,
  fovScale = 1,
  sunDisc = true,
  poster,
  labels = [],
  still,
  className,
  stillPosition = "object-center",
}: {
  preset: Preset;
  shift?: number;
  fovScale?: number;
  sunDisc?: boolean;
  /** Transparent frame of this exact view, shown until the live scene is ready. */
  poster?: string;
  labels?: Label[];
  still: string;
  className?: string;
  stillPosition?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const tags = React.useRef<Record<string, HTMLDivElement | null>>({});
  const reduce = useReduced();
  const [state, setState] = React.useState<"wait" | "live" | "fail">("wait");
  const hasLabels = labels.length > 0;

  React.useEffect(() => {
    const host = box.current;
    if (!host) return;
    let handle: SceneHandle | null = null;
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 size-full";
    host.prepend(canvas);

    const onFrame = (a: Anchor[]) => {
      for (const p of a) {
        const el = tags.current[p.id];
        if (!el) continue;
        el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
        el.dataset.flip = p.x > host.clientWidth - 300 ? "1" : "0";
        el.style.opacity = p.on ? "1" : "0";
      }
    };

    import("@/components/three/solar-scene")
      .then(({ createSolarScene }) => {
        if (cancelled) return;
        try {
          handle = createSolarScene(canvas, { preset, shift, fovScale, sunDisc, motion: !reduce, onFrame: hasLabels ? onFrame : undefined });
          setState("live");
        } catch {
          setState("fail");
        }
      })
      .catch(() => setState("fail"));

    const ro = new ResizeObserver(() => handle?.resize());
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => handle?.setActive(e.isIntersecting && !document.hidden), { rootMargin: "100px" });
    io.observe(host);
    const onVis = () => handle?.setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = host.getBoundingClientRect();
        handle?.setProgress(-r.top / Math.max(1, r.height));
      });
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      handle?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reduce) host.addEventListener("pointermove", onMove);
    return () => {
      cancelled = true;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      handle?.dispose();
      canvas.remove();
    };
  }, [preset, shift, fovScale, sunDisc, reduce, hasLabels]);

  return (
    <div ref={box} className={cn("relative overflow-hidden", className)}>
      {state === "fail" && <Image src={still} alt="" fill sizes="100vw" className={cn("object-cover", stillPosition)} />}
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-[1] transition-opacity duration-1000", state === "live" ? "opacity-0" : "opacity-100")}>
        {poster ? (
          <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(40%_50%_at_65%_55%,rgba(79,134,247,0.14),transparent)]" />
        )}
      </div>
      {labels.map((l) => (
        <div
          key={l.id}
          ref={(el) => {
            tags.current[l.id] = el;
          }}
          className="group pointer-events-none absolute left-0 top-0 z-[2] hidden opacity-0 transition-opacity duration-500 lg:block"
        >
          <span className="absolute -left-[5px] -top-[5px] size-2.5 rounded-full bg-helios shadow-[0_0_0_4px_rgba(245,158,11,0.25),0_0_18px_4px_rgba(245,158,11,0.55)]" />
          <span className="absolute left-0 top-0 h-px w-9 origin-left -rotate-[28deg] bg-gradient-to-r from-helios to-white/40 group-data-[flip=1]:rotate-[208deg]" />
          <span className="glass-strong absolute left-8 -top-[46px] block whitespace-nowrap rounded-xl px-3 py-1.5 group-data-[flip=1]:left-auto group-data-[flip=1]:right-8">
            <span className="block text-[13px] font-semibold text-ink">{l.text}</span>
            {l.sub && <span className="block text-[11.5px] text-muted">{l.sub}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
