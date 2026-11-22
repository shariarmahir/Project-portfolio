import { cn } from "@/lib/utils";

/** Filled lightning bolt: the charging mark used for lists and nodes. */
export function Bolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 24" aria-hidden className={cn("h-6 w-4 shrink-0 fill-helios", className)}>
      <path d="M10.2 0 0 13.6h6.3L4.6 24 16 9.4H9.4z" />
    </svg>
  );
}

/** Wordmark: a ring split by a bolt, then the name. */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 36 36" aria-hidden className="size-9">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke={inverse ? "#FFFFFF" : "#0A2540"} strokeWidth="2.5" />
        <path d="M20.4 6.5 11 19.6h6l-2 9.9 10-13.6h-6.2z" fill="#F59E0B" />
      </svg>
      <span className={cn("text-[19px] font-bold tracking-display", inverse ? "text-white" : "text-navy")}>
        SolarEV <span className={inverse ? "text-helios" : "text-cobalt"}>BD</span>
      </span>
    </span>
  );
}
