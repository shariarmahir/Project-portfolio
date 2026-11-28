"use client";
import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useReduced } from "@/components/charts/kit";

/**
 * The page sky. As the reader scrolls, the light moves from dawn (top) through noon to dusk
 * (bottom): the sun glow travels across the sky and the colour temperature changes.
 */
const STOPS = [
  { p: 0, a: [16, 22, 52], b: [5, 11, 22], sx: 82, sy: 14, glow: [245, 158, 11, 0.3] },
  { p: 0.45, a: [9, 36, 78], b: [4, 12, 26], sx: 50, sy: 2, glow: [252, 211, 77, 0.22] },
  { p: 1, a: [44, 20, 48], b: [6, 8, 18], sx: 16, sy: 22, glow: [249, 115, 22, 0.3] },
];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

export function SkyBackdrop() {
  const reduce = useReducedMotion();
  const still = useReduced();
  React.useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = reduce ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      const i = p < STOPS[1].p ? 0 : 1;
      const s0 = STOPS[i];
      const s1 = STOPS[i + 1];
      const t = (p - s0.p) / (s1.p - s0.p);
      const a = mix(s0.a, s1.a, t).map(Math.round);
      const b = mix(s0.b, s1.b, t).map(Math.round);
      const g = mix(s0.glow, s1.glow, t);
      root.style.setProperty("--sky-a", `rgb(${a.join(",")})`);
      root.style.setProperty("--sky-b", `rgb(${b.join(",")})`);
      root.style.setProperty("--sun-x", `${(s0.sx + (s1.sx - s0.sx) * t).toFixed(1)}%`);
      root.style.setProperty("--sun-y", `${(s0.sy + (s1.sy - s0.sy) * t).toFixed(1)}%`);
      root.style.setProperty("--sun-glow", `rgba(${Math.round(g[0])},${Math.round(g[1])},${Math.round(g[2])},${g[3].toFixed(3)})`);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);
  return (
    <div aria-hidden className="sky">
      {!still && (
        <>
          <span className="sky-sun" />
          {FLARES.map((f) => (
            <span key={f.k} className="sky-flare" style={{ ["--k" as string]: f.k, width: f.s, height: f.s }} />
          ))}
          {MOTES.map((m, i) => (
            <span key={i} className="sky-mote" style={{ left: m.x, top: m.y, ["--t" as string]: m.t, ["--d" as string]: m.d, ["--dx" as string]: m.dx, ["--o" as string]: m.o }} />
          ))}
        </>
      )}
    </div>
  );
}

const FLARES = [
  { k: 0.35, s: "3.2vmax" },
  { k: 0.62, s: "1.4vmax" },
  { k: 0.9, s: "5vmax" },
];
// fixed positions (no Math.random) so server and client render the same markup
const MOTES = Array.from({ length: 22 }, (_, i) => ({
  x: `${(i * 37) % 100}%`,
  y: `${60 + ((i * 23) % 40)}%`,
  t: `${14 + (i % 5) * 3}s`,
  d: `${-(i * 1.7) % 16}s`,
  dx: `${((i % 7) - 3) * 14}px`,
  o: `${0.35 + (i % 4) * 0.12}`,
}));
