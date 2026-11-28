"use client";
import * as React from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reduced-motion preference that is `false` on the server and on the first client render,
 * so server HTML and hydration always match; the real preference applies right after mount.
 */
export function useReduced() {
  const pref = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}

export function useOnce<T extends Element>(margin = "-12% 0px") {
  const ref = React.useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });
  return [ref, inView] as const;
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [ref, inView] = useOnce<HTMLSpanElement>("0px");
  const reduce = useReduced();
  const fmt = React.useCallback(
    (v: number) => prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix,
    [prefix, suffix, decimals]
  );
  const [text, setText] = React.useState(() => fmt(value));
  React.useEffect(() => {
    if (!inView || reduce) {
      setText(fmt(value));
      return;
    }
    setText(fmt(0));
    const c = animate(0, value, { duration, ease: EASE, onUpdate: (v) => setText(fmt(v)) });
    return () => c.stop();
  }, [inView, reduce, value, duration, fmt]);
  return (
    <span ref={ref} className={cn("num", className)}>
      {text}
    </span>
  );
}

export type Series = { key: string; label: string; values: readonly number[]; color: string; area?: boolean; dash?: boolean; width?: number };

/**
 * Line / area chart in SVG. Lines draw themselves in when the chart scrolls into view.
 * `x` holds the category labels; every series must have one value per label.
 */
export function LineChart({
  x,
  series,
  yMax,
  yMin = 0,
  yTicks = 4,
  yFmt = (v: number) => String(v),
  height = 300,
  label,
  refLine,
  xEvery = 1,
  className,
}: {
  x: readonly (string | number)[];
  series: Series[];
  yMax?: number;
  yMin?: number;
  yTicks?: number;
  yFmt?: (v: number) => string;
  height?: number;
  label: string;
  refLine?: { y: number; label: string; color?: string };
  xEvery?: number;
  className?: string;
}) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const W = 640;
  const H = height;
  const P = { l: 46, r: 14, t: 14, b: 30 };
  const max = yMax ?? Math.max(...series.flatMap((s) => s.values)) * 1.08;
  const min = yMin;
  const xs = (i: number) => P.l + (i * (W - P.l - P.r)) / Math.max(1, x.length - 1);
  const ys = (v: number) => P.t + (1 - (v - min) / (max - min)) * (H - P.t - P.b);
  const path = (vals: readonly number[]) => vals.map((v, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join("");
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + ((max - min) * i) / yTicks);
  const show = inView || reduce;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full overflow-visible">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={ys(t)} y2={ys(t)} stroke="rgba(255,255,255,0.08)" />
            <text x={P.l - 8} y={ys(t) + 4} textAnchor="end" className="fill-muted text-[11px] num">
              {yFmt(t)}
            </text>
          </g>
        ))}
        {x.map((l, i) =>
          i % xEvery === 0 ? (
            <text key={i} x={xs(i)} y={H - 8} textAnchor="middle" className="fill-muted text-[11px]">
              {l}
            </text>
          ) : null
        )}
        {refLine && (
          <g>
            <line x1={P.l} x2={W - P.r} y1={ys(refLine.y)} y2={ys(refLine.y)} stroke={refLine.color ?? "#F59E0B"} strokeDasharray="5 6" strokeWidth="1.5" />
            <text x={W - P.r} y={ys(refLine.y) - 7} textAnchor="end" className="text-[11px] font-semibold" fill={refLine.color ?? "#FCD34D"}>
              {refLine.label}
            </text>
          </g>
        )}
        {series.map((s, si) => (
          <g key={s.key}>
            {s.area && (
              <motion.path
                d={`${path(s.values)}L${xs(s.values.length - 1)},${ys(min)}L${xs(0)},${ys(min)}Z`}
                fill={s.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: show ? 0.18 : 0 }}
                transition={{ duration: 1.2, delay: 0.3 + si * 0.15 }}
              />
            )}
            {s.dash ? (
              <motion.path
                d={path(s.values)}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 7"
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={{ opacity: show ? 1 : 0 }}
                transition={{ duration: 1.2, delay: 0.4 + si * 0.15 }}
              />
            ) : (
              <motion.path
                d={path(s.values)}
                pathLength={1}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 1"
                initial={{ strokeDashoffset: reduce ? 0 : 1 }}
                animate={{ strokeDashoffset: show ? 0 : 1 }}
                transition={{ duration: 1.6, ease: EASE, delay: si * 0.15 }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Horizontal bars that grow in. */
export function BarList({
  rows,
  max,
  fmt,
  label,
  refLine,
  className,
}: {
  rows: readonly { k: string; v: number; color?: string; note?: string }[];
  max?: number;
  fmt: (v: number) => string;
  label: string;
  refLine?: { v: number; label: string };
  className?: string;
}) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const m = max ?? Math.max(...rows.map((r) => Math.abs(r.v))) * 1.05;
  return (
    <div ref={ref} role="img" aria-label={label} className={cn("relative space-y-4", className)}>
      {refLine && (
        <div className="pointer-events-none absolute inset-y-0 z-10 border-l-[1.5px] border-dashed border-helios-300/80" style={{ left: `calc(${(refLine.v / m) * 100}% )` }}>
          <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap text-[11.5px] font-semibold text-helios-300">{refLine.label}</span>
        </div>
      )}
      {rows.map((r, i) => (
        <div key={r.k}>
          <div className="flex items-baseline justify-between gap-4 text-[14px]">
            <span className="text-body">{r.k}</span>
            <span className="num font-semibold text-ink">{fmt(r.v)}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: r.color ?? "#F59E0B" }}
              initial={{ width: reduce ? `${(Math.abs(r.v) / m) * 100}%` : 0 }}
              animate={{ width: inView || reduce ? `${(Math.abs(r.v) / m) * 100}%` : 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.08 * i }}
            />
          </div>
          {r.note && <p className="mt-1 text-[12.5px] text-muted">{r.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Vertical grouped columns (one group per category). */
export function Columns({
  cats,
  groups,
  max,
  fmt,
  label,
  height = 260,
}: {
  cats: readonly string[];
  groups: { key: string; label: string; color: string; values: readonly number[] }[];
  max?: number;
  fmt: (v: number) => string;
  label: string;
  height?: number;
}) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const m = max ?? Math.max(...groups.flatMap((g) => g.values)) * 1.1;
  const dense = cats.length * groups.length > 8;
  return (
    <div ref={ref} role="img" aria-label={label} className="min-w-0">
      <div className={cn("flex items-end", dense ? "gap-1 sm:gap-2" : "gap-3 sm:gap-6")} style={{ height }}>
        {cats.map((c, ci) => (
          <div key={c} className={cn("flex h-full min-w-0 flex-1 items-end justify-center", dense ? "gap-0.5 sm:gap-1" : "gap-1.5")}>
            {groups.map((g, gi) => {
              const v = g.values[ci];
              return (
                <div key={g.key} className="flex h-full min-w-0 w-full max-w-[44px] flex-col justify-end">
                  <span className={cn("num mb-1 text-center text-[11.5px] font-semibold text-ink", dense && "hidden md:block")}>{fmt(v)}</span>
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{ background: g.color }}
                    initial={{ height: reduce ? `${(v / m) * 100}%` : 0 }}
                    animate={{ height: inView || reduce ? `${(v / m) * 100}%` : 0 }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.1 * ci + 0.05 * gi }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={cn("mt-3 flex", dense ? "gap-1 sm:gap-2" : "gap-3 sm:gap-6")}>
        {cats.map((c) => (
          <span key={c} className={cn("min-w-0 flex-1 text-center leading-tight text-muted", dense ? "text-[10.5px] sm:text-[12px]" : "text-[12.5px]")}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Donut of shares (sums to 100). */
export function Donut({ parts, label, center }: { parts: readonly { k: string; v: number; color: string }[]; label: string; center?: React.ReactNode }) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[260px]">
      <svg viewBox="0 0 180 180" role="img" aria-label={label} className="size-full -rotate-90">
        <circle cx="90" cy="90" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
        {parts.map((p, i) => {
          const len = (p.v / 100) * C;
          const off = acc;
          acc += len;
          return (
            <motion.circle
              key={p.k}
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke={p.color}
              strokeWidth="20"
              strokeDashoffset={-off}
              initial={{ strokeDasharray: reduce ? `${len} ${C}` : `0 ${C}` }}
              animate={{ strokeDasharray: inView || reduce ? `${Math.max(len - 1.5, 0)} ${C}` : `0 ${C}` }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 * i }}
            />
          );
        })}
      </svg>
      {center && <div className="absolute inset-0 grid place-items-center text-center">{center}</div>}
    </div>
  );
}

/** Single progress ring with a value in the middle. */
export function Ring({ value, label, sub, color = "#F59E0B", size = 132 }: { value: number; label: string; sub?: string; color?: string; size?: number }) {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? C * (1 - value / 100) : C }}
            animate={{ strokeDashoffset: inView || reduce ? C * (1 - Math.min(value, 100) / 100) : C }}
            transition={{ duration: 1.5, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <CountUp value={value} decimals={value % 1 ? 1 : 0} suffix="%" className="text-[1.35rem] font-semibold text-ink" />
        </div>
      </div>
      <p className="mt-3 text-[14px] font-semibold text-ink">{label}</p>
      {sub && <p className="mt-0.5 max-w-[16ch] text-[12.5px] leading-snug text-muted">{sub}</p>}
    </div>
  );
}

/** Legend row for charts. */
export function Legend({ items }: { items: { label: string; color: string; dash?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-body">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="h-[3px] w-5 rounded-full" style={{ background: i.dash ? `repeating-linear-gradient(90deg, ${i.color} 0 5px, transparent 5px 8px)` : i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** Reveal-on-scroll wrapper used by every section. */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; y?: number; as?: "div" | "li" }) {
  const reduce = useReduced();
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}
