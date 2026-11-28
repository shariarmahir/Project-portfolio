import { cn } from "@/lib/utils";

/** Filled lightning bolt: the charging mark used for lists and nodes. */
export function Bolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 24" aria-hidden className={cn("h-6 w-4 shrink-0 fill-helios", className)}>
      <path d="M10.2 0 0 13.6h6.3L4.6 24 16 9.4H9.4z" />
    </svg>
  );
}

/**
 * The SolarEV BD mark, redrawn as SVG from the supplied animated logo (public/logo/logo.gif):
 * a turning sun, two flickering bolts and three tilting panels on stands. `tone="dark"` gives
 * the light-outline version for dark backgrounds; `tone="light"` keeps the navy outline.
 */
export function LogoMark({ className, tone = "dark", animated = true }: { className?: string; tone?: "dark" | "light"; animated?: boolean }) {
  const ink = tone === "dark" ? "#E8EEFF" : "#0B2A6B";
  const a = animated ? "" : " [&_*]:!animate-none";
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("shrink-0 overflow-visible", a, className)}>
      <defs>
        <linearGradient id="lm-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4B5FD" />
          <stop offset="0.62" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      {/* sun */}
      <g className="logo-sun">
        <path
          d="M32 4.6l2.6 3.2 4-1.1.9 4 4 .9-1.1 4 3.2 2.6-3.2 2.6 1.1 4-4 .9-.9 4-4-1.1L32 32.6l-2.6-3.2-4 1.1-.9-4-4-.9 1.1-4-3.2-2.6 3.2-2.6-1.1-4 4-.9.9-4 4 1.1z"
          fill="#F59E0B"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="18.6" r="4.6" fill="#FCD34D" />
      </g>
      {/* bolts */}
      <path className="logo-bolt" d="M11.6 13.5 8 20.2h3.6l-1.6 5.4 4.6-7.1h-3.5l1.6-5z" fill="#FCD34D" />
      <path className="logo-bolt" d="M52.4 13.5 48.8 20.2h3.6l-1.6 5.4 4.6-7.1h-3.5l1.6-5z" fill="#FCD34D" />
      {/* stands and feet */}
      {[16, 32, 48].map((x) => (
        <g key={x}>
          <path d={`M${x} 44v8`} stroke="#93C5FD" strokeWidth="2.6" />
          <rect x={x - 3.6} y="51.4" width="7.2" height="4.2" rx="1.4" fill="#DBEAFE" stroke={ink} strokeWidth="1.8" />
        </g>
      ))}
      {/* panels */}
      {[16, 32, 48].map((x) => (
        <g key={`p${x}`} className="logo-panel">
          <rect x={x - 3.6} y="27" width="7.2" height="22" rx="3.6" transform={`rotate(42 ${x} 40)`} fill="url(#lm-panel)" stroke={ink} strokeWidth="2.2" />
        </g>
      ))}
      <path d="M6 58.2h52" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Mark plus wordmark. */
export function Logo({ inverse = true, className }: { inverse?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-10" tone={inverse ? "dark" : "light"} />
      <span className={cn("text-[19px] font-bold tracking-display", inverse ? "text-white" : "text-navy")}>
        SolarEV <span className="text-helios">BD</span>
      </span>
    </span>
  );
}
