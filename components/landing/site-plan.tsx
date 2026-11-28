"use client";
import { motion } from "framer-motion";
import { useOnce, useReduced } from "@/components/charts/kit";

/** Single-line plan of the hub: plant, inverters, bus, ESS, substation and the two charging zones. */
export function SitePlan() {
  const [ref, inView] = useOnce<HTMLDivElement>();
  const reduce = useReduced();
  const on = inView || reduce;
  const node = "fill-[#0D1729] stroke-white/20";
  return (
    <div ref={ref}>
      <svg viewBox="0 0 560 360" role="img" aria-label="Site plan of the hub: the 250.48 kWp roof plant feeds five 50 kW inverters onto a 440 V bus, with the 100 kW ESS, the 250 kVA substation to the grid and two charging zones of 50 points each" className="h-auto w-full">
        {/* flows */}
        {[
          "M120 70 V122",
          "M120 170 V206 H280",
          "M410 206 H280",
          "M280 206 V250",
          "M150 286 H280",
          "M410 286 H280",
          "M280 206 V160 H440 V110",
        ].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
            {on && <path d={d} fill="none" stroke={i === 6 ? "#60A5FA" : "#FCD34D"} strokeWidth="3" strokeLinecap="round" className="flow" style={{ animationDelay: `${i * 0.2}s` }} />}
          </g>
        ))}
        {/* roof plant */}
        <g>
          <rect x="30" y="14" width="180" height="56" rx="12" className={node} />
          {Array.from({ length: 8 }, (_, i) => (
            <motion.rect
              key={i}
              x={42 + i * 20.5}
              y="24"
              width="16"
              height="36"
              rx="3"
              fill="#4F86F7"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: on ? [0.45, 1, 0.45] : 0.2 }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
          <text x="220" y="36" className="fill-ink text-[13px] font-semibold">Roof plant</text>
          <text x="220" y="54" className="fill-muted text-[11.5px]">250.48 kWp · 404 modules</text>
        </g>
        <rect x="70" y="122" width="100" height="48" rx="10" className={node} />
        <text x="120" y="142" textAnchor="middle" className="fill-ink text-[12px] font-semibold">Inverters</text>
        <text x="120" y="159" textAnchor="middle" className="fill-muted text-[11px]">5 × 50 kW</text>
        {/* bus */}
        <rect x="200" y="196" width="160" height="20" rx="10" className="fill-[#2A2210] stroke-helios/70" />
        <text x="280" y="210" textAnchor="middle" className="fill-helios-300 text-[11px] font-semibold">440 V bus · EMS</text>
        {/* ESS */}
        <rect x="410" y="182" width="120" height="48" rx="10" className={node} />
        <text x="470" y="202" textAnchor="middle" className="fill-ink text-[12px] font-semibold">ESS</text>
        <text x="470" y="219" textAnchor="middle" className="fill-muted text-[11px]">100 kW hybrid</text>
        {/* substation */}
        <rect x="390" y="62" width="120" height="48" rx="10" className={node} />
        <text x="450" y="82" textAnchor="middle" className="fill-ink text-[12px] font-semibold">Substation</text>
        <text x="450" y="99" textAnchor="middle" className="fill-muted text-[11px]">250 kVA · grid</text>
        {/* zones */}
        {[
          { x: 20, label: "Zone A · 50 points" },
          { x: 410, label: "Zone B · 50 points" },
        ].map((z) => (
          <g key={z.label}>
            <rect x={z.x} y="250" width="130" height="92" rx="12" className={node} />
            <text x={z.x + 65} y="268" textAnchor="middle" className="fill-ink text-[11.5px] font-semibold">
              {z.label}
            </text>
            {Array.from({ length: 50 }, (_, k) => (
              <motion.circle
                key={k}
                cx={z.x + 14 + (k % 10) * 11.4}
                cy={282 + Math.floor(k / 10) * 11.5}
                r="3.4"
                initial={{ fill: "rgba(255,255,255,0.12)" }}
                animate={{ fill: on ? (k < 40 ? (k % 4 === 3 ? "#60A5FA" : "#FCD34D") : "rgba(255,255,255,0.15)") : "rgba(255,255,255,0.12)" }}
                transition={{ duration: 0.4, delay: reduce ? 0 : 0.5 + k * 0.02 }}
              />
            ))}
          </g>
        ))}
        <rect x="230" y="250" width="100" height="42" rx="10" className={node} />
        <text x="280" y="268" textAnchor="middle" className="fill-ink text-[11.5px] font-semibold">Fleet limit</text>
        <text x="280" y="284" textAnchor="middle" className="fill-muted text-[11px]">150 kW</text>
      </svg>
      <p className="mt-3 text-[12.5px] text-muted">Amber: solar energy. Blue: grid import or export. Points light up at 80% use (40 of 50 per zone).</p>
    </div>
  );
}

