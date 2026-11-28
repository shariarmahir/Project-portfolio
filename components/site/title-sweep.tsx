"use client";
import * as React from "react";
import { usePathname } from "next/navigation";

/** A beam of sunlight crosses each section title once, as it scrolls into view (see .sweep in globals.css). */
export function TitleSweep() {
  const path = usePathname();
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("h2.h2"));
    els.forEach((el) => el.classList.add("sweep"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("sweep-on");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
