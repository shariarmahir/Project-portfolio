"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReduced } from "@/components/charts/kit";
import { RENDERS, type RenderKey } from "@/lib/media";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** One of our 3D renders, opening into its frame as it enters and drifting slowly while it stays. */
export function FramedRender({
  k,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority,
}: {
  k: RenderKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const r = RENDERS[k];
  const reduce = useReduced();
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-panel bg-tint ring-1 ring-white/10", className)}
      initial={reduce ? false : { clipPath: "inset(6% 6% 6% 6% round 24px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <Image src={r.src} alt={r.alt} fill sizes={sizes} priority={priority} className={cn("object-cover", !reduce && "kb-drift")} />
    </motion.div>
  );
}
