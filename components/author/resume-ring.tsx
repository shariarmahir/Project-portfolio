"use client";
import { motion } from "framer-motion";
import { useOnce, useReduced } from "@/components/charts/kit";

/** Thin navy arc on a light track with the label inside, as in the resume reference. */
export function ResumeRing({ value, label, sub, size = 104 }: { value: number; label: string; sub: string; size?: number }) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const r = 42;
  const on = inView || reduce;
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label={`${label}: ${value}%, ${sub}`}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="#EEEFF2" strokeWidth="7" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#22222E"
            strokeWidth="7"
            strokeLinecap="butt"
            pathLength={1}
            strokeDasharray="1 1"
            initial={false}
            animate={{ strokeDashoffset: on ? 1 - value / 100 : 1 }}
            transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="num text-[15px] font-bold text-[#22222E]">{value % 1 ? value.toFixed(1) : value}%</span>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#22222E]">{label}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-[#6B6E7B]">{sub}</p>
    </div>
  );
}
