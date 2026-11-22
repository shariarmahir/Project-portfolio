"use client";
import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { PHOTOS, type PhotoKey } from "@/lib/media";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Photo that settles into its frame: visible from the start, the inset opens as it enters. */
export function FramedPhoto({
  k,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
}: {
  k: PhotoKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const p = PHOTOS[k];
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-panel bg-tint", className)}
      initial={reduce ? false : { clipPath: "inset(6% 6% 6% 6% round 24px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </motion.div>
  );
}

/** Background video with a visible pause control (WCAG 2.2.2). */
export function useVideoControl() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = React.useState(false);
  React.useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [reduce]);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => undefined);
    else {
      v.pause();
      setPlaying(false);
    }
  };
  return { ref, playing, toggle };
}

export function PlayToggle({ playing, onClick, label, className }: { playing: boolean; onClick: () => void; label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playing ? `Pause ${label}` : `Play ${label}`}
      className={cn(
        "grid size-12 place-items-center rounded-full bg-white text-navy shadow-float transition-colors hover:bg-helios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
        className
      )}
    >
      {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
    </button>
  );
}

/** Image carousel with round white arrows and dot pagination. */
export function Carousel({ keys, label, className }: { keys: readonly PhotoKey[]; label: string; className?: string }) {
  const [i, setI] = React.useState(0);
  const n = keys.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <div className={cn("relative overflow-hidden rounded-panel bg-tint", className)} role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        className="flex h-full transition-transform duration-500"
        style={{ transform: `translateX(-${i * 100}%)`, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        {keys.map((k, idx) => (
          <div key={k} className="relative h-full w-full shrink-0" aria-hidden={idx !== i} role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${n}`}>
            <Image src={PHOTOS[k].src} alt={PHOTOS[k].alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous image" className="absolute bottom-5 left-5 grid size-11 place-items-center rounded-full bg-white text-navy shadow-float transition-colors hover:bg-navy hover:text-white">
            <ArrowLeft className="size-5" />
          </button>
          <button onClick={() => go(1)} aria-label="Next image" className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-white text-navy shadow-float transition-colors hover:bg-navy hover:text-white">
            <ArrowRight className="size-5" />
          </button>
          <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 gap-2.5">
            {keys.map((k, idx) => (
              <button
                key={k}
                onClick={() => setI(idx)}
                aria-label={`Show image ${idx + 1}`}
                aria-current={idx === i}
                className={cn("size-2.5 rounded-full border-2 border-white transition-colors", idx === i ? "bg-white" : "bg-transparent")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
