"use client";
import * as React from "react";

/** Moves a soft patch of sunlight across whichever glass panel the pointer is over (see .glass in globals.css). */
export function SunTrail() {
  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let last: HTMLElement | null = null;
    let raf = 0;
    let ev: PointerEvent | null = null;
    const paint = () => {
      raf = 0;
      if (!ev) return;
      const el = (ev.target as Element | null)?.closest?.(".glass, .glass-strong") as HTMLElement | null;
      if (last && last !== el) {
        last.style.removeProperty("--mx");
        last.style.removeProperty("--my");
      }
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${ev.clientX - r.left}px`);
        el.style.setProperty("--my", `${ev.clientY - r.top}px`);
      }
      last = el;
    };
    const on = (e: PointerEvent) => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", on, { passive: true });
    return () => {
      document.removeEventListener("pointermove", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
