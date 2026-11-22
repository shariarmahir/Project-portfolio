"use client";
import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * The page's one authored motion: a charging cable drawn by scroll,
 * running from the hero's bolt node down through the intro story.
 */
export function ScrollPath({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const full = useMotionValue(1);

  // viewBox is 1000 wide and stretched to the container. The cable stays in the centre gutter
  // between the two columns and only loops inside the empty top and bottom padding.
  const d =
    "M500 0 C 500 18, 640 20, 640 34 S 500 52, 500 60 C 518 200, 482 330, 500 470 C 518 610, 482 760, 500 930 C 500 958, 360 962, 360 978 S 500 1000, 500 1000";

  return (
    <div ref={ref} className="relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 hidden h-full w-full lg:block"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path d={d} fill="none" stroke="#D9E1EC" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={d}
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduce ? full : progress }}
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
