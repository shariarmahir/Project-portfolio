"use client";
import * as React from "react";
import Link from "next/link";
import type * as Leaflet from "leaflet";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { MapShell, GLYPH, cardTooltip, markerIcon, type LayerToggle } from "@/components/map/map-shell";
import { useReduced } from "@/components/charts/kit";
import { ROUTE_DONE, ROUTE_NEXT, type LatLng } from "@/lib/satkhira-route";
import { T } from "@/lib/thesis-data";
import { cn } from "@/lib/utils";

type P = "P1" | "P2" | "P3";

/* Real places in Satkhira town (OpenStreetMap). The hub is shown at the town only. */
const HUB: LatLng = [22.7185, 89.0705];
const START: LatLng = [22.7234, 89.06650];
const END: LatLng = [22.69019, 89.0469];
const OTHERS: { at: LatLng; name: string }[] = [
  { at: [22.70952, 89.087], name: "Satkhira Government College" },
  { at: [22.69241, 89.05373], name: "Satkhira–Kaliganj Highway" },
  { at: ROUTE_NEXT[Math.floor(ROUTE_NEXT.length * 0.45)], name: "On duty" },
];
const BOUNDS: [[number, number], [number, number]] = [
  [22.6865, 89.0425],
  [22.7265, 89.0905],
];

const DAY: Record<P, { charge: string; when: string; note: string }> = {
  P1: { charge: "Night charge at the hub", when: "22:00 to 06:00, from the ESS and the grid", note: "Most of the energy comes from the grid" },
  P2: { charge: "On charge at the hub", when: "09:00 to 16:00, between the two shifts", note: "Most of the energy comes from the sun" },
  P3: { charge: "Solar-priority charge at the hub", when: "08:00 to 17:00, the EMS follows the sun", note: "Nearly all of the energy comes from the sun" },
};

export function FleetMap({ p, label }: { p: P; label: string }) {
  const reduce = useReduced();
  const [tab, setTab] = React.useState<"info" | "track" | "docs">("track");
  const [open, setOpen] = React.useState(true);
  // on phones the panel would cover the map, so it starts folded
  React.useEffect(() => {
    if (window.innerWidth < 640) setOpen(false);
  }, []);
  const [layers, setLayers] = React.useState<LayerToggle[]>([
    { id: "bikes", label: "Other bikes", on: true },
    { id: "route", label: "Route", on: true },
    { id: "labels", label: "Address cards", on: true },
  ]);
  const groups = React.useRef<Record<string, Leaflet.LayerGroup>>({});
  const mapRef = React.useRef<Leaflet.Map | null>(null);

  const sf = T.caseC.fin[`${p}-80`].sf;
  const solar = Math.round((80 * sf) / 100);
  const day = DAY[p];

  const onLayer = (id: string, on: boolean) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, on } : l)));
    const g = groups.current[id];
    const m = mapRef.current;
    if (!g || !m) return;
    if (on) g.addTo(m);
    else g.remove();
  };

  const build = React.useCallback(
    (m: Leaflet.Map, L: typeof Leaflet) => {
      mapRef.current = m;
      const route = L.layerGroup().addTo(m);
      const bikes = L.layerGroup().addTo(m);
      const labels = L.layerGroup().addTo(m);
      groups.current = { route, bikes, labels };

      // completed leg (solid blue, drawn in) and next leg (dashed, marching)
      const done = L.polyline(ROUTE_DONE, { color: "#2F80ED", weight: 5, opacity: 0.95, lineCap: "round", className: reduce ? "" : "route-draw" }).addTo(route);
      // after the draw-in, drop the dash pattern so the line stays whole at any zoom
      const undash = window.setTimeout(() => done.getElement()?.classList.remove("route-draw"), 2800);
      L.polyline(ROUTE_NEXT, { color: "#111827", weight: 3, dashArray: "6 9", opacity: 0.85, className: reduce ? "" : "route-ants" }).addTo(route);
      L.marker(START, { icon: markerIcon(L, "dot-blue"), keyboard: false }).addTo(route);
      L.marker(END, { icon: markerIcon(L, "dot"), keyboard: false }).addTo(route);

      L.marker(HUB, { icon: markerIcon(L, "yellow", GLYPH.sun), title: "Charging hub, Satkhira Sadar", riseOnHover: true }).addTo(m);
      for (const o of OTHERS) L.marker(o.at, { icon: markerIcon(L, "black"), title: o.name, riseOnHover: true }).addTo(bikes);

      const card = (at: LatLng, text: string, dir: "right" | "left" | "top" | "bottom", glyph?: string) =>
        L.tooltip({ permanent: true, direction: dir, offset: dir === "left" ? [-14, 0] : dir === "right" ? [14, 0] : [0, -14], className: "map-tip", interactive: false })
          .setLatLng(at)
          .setContent(cardTooltip(text, glyph))
          .addTo(labels);
      card(START, "Bus Terminal, Jessore–Satkhira Highway", "top");
      card(END, "Satkhira Medical College, Kaliganj Highway", "bottom");
      card(HUB, "Charging hub · Satkhira Sadar", "right", GLYPH.sun);

      // the tracked bike rides the completed leg into the hub, again and again
      const rider = L.marker(ROUTE_DONE[0], { icon: markerIcon(L, "blue"), title: "Bike EB-042", zIndexOffset: 1000 }).addTo(m);
      const seg: number[] = [0];
      for (let i = 1; i < ROUTE_DONE.length; i++) seg.push(seg[i - 1] + m.distance(ROUTE_DONE[i - 1], ROUTE_DONE[i]));
      const total = seg[seg.length - 1];
      const at = (d: number): LatLng => {
        let i = 1;
        while (i < seg.length - 1 && seg[i] < d) i++;
        const t = (d - seg[i - 1]) / Math.max(1e-6, seg[i] - seg[i - 1]);
        const [a, b] = [ROUTE_DONE[i - 1], ROUTE_DONE[i]];
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      };
      if (reduce) {
        rider.setLatLng(at(total * 0.72));
        return () => window.clearTimeout(undash);
      }
      let raf = 0;
      let start = 0;
      const lap = 16000;
      const tick = (now: number) => {
        if (!start) start = now;
        const u = ((now - start) % lap) / lap;
        rider.setLatLng(at(total * Math.min(1, u * 1.08)));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(undash);
      };
    },
    [reduce]
  );

  return (
    <MapShell className="h-full" label={label} home={BOUNDS} padTopLeft={[320, 70]} layers={layers} onLayer={onLayer} onReady={build}>
      {/* tracking panel, top left */}
      {open ? (
        <div className="absolute left-3 top-3 z-[500] w-[min(290px,calc(100%-24px))] rounded-2xl bg-white p-4 text-[#111827] shadow-[0_10px_30px_rgba(15,23,42,0.22)] max-sm:top-[58px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold">Bike: EB-042</p>
            <button type="button" aria-label="Close the panel" onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-full text-[#9CA3AF] hover:bg-slate-100 hover:text-[#111827]">
              <X className="size-4" />
            </button>
          </div>
          <div role="tablist" aria-label="Bike details" className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 p-1">
            {(
              [
                ["info", "Charge info"],
                ["track", "Tracking"],
                ["docs", "Docs"],
              ] as const
            ).map(([k, t]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={cn("rounded-lg py-1.5 text-[12.5px] font-semibold transition-colors", tab === k ? "bg-[#F8D247] text-[#111827]" : "text-[#4B5563] hover:bg-slate-50")}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "track" && (
            <ol className="mt-4">
              {[
                { t: "Morning shift", a: "Bus Terminal, Jessore–Satkhira Highway", w: "06:00 to 09:00, about 3.6 km to the hub", dot: "bg-[#2F80ED]", line: "bg-[#2F80ED]" },
                { t: day.charge, a: "Charging hub, Satkhira Sadar", w: day.when, dot: "bg-[#2F80ED]", line: "border-l-2 border-dashed border-[#111827] bg-transparent" },
                { t: "Evening shift", a: "Satkhira Medical College, Kaliganj Highway", w: "about 4.6 km from the hub", dot: "bg-[#111827]", line: "" },
              ].map((s, i) => (
                <li key={s.t} className="relative flex gap-3 pb-4 last:pb-0">
                  <span className="relative flex w-3 shrink-0 flex-col items-center">
                    <span className={cn("mt-1 size-3 rounded-full ring-4 ring-white", s.dot)} />
                    {s.line && <span className={cn("mt-1 w-0.5 flex-1", s.line)} />}
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold">{s.t}</span>
                    <span className="block text-[12.5px] text-[#374151]">{s.a}</span>
                    <span className="block text-[12px] text-[#9CA3AF]">
                      {s.w}
                      {i === 1 ? `. ${day.note}.` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}

          {tab === "info" && (
            <div className="mt-4 space-y-3">
              <p className="text-[12.5px] text-[#4B5563]">100 points at 80% use, 10 kWh per bike, 1.5 kW per point.</p>
              {[
                { k: "Charged by the sun", v: solar, c: "bg-[#F8B400]" },
                { k: "Charged by the grid", v: 80 - solar, c: "bg-[#2F80ED]" },
                { k: "Points free", v: 20, c: "bg-slate-300" },
              ].map((r) => (
                <div key={r.k}>
                  <div className="flex justify-between text-[12.5px]">
                    <span className="text-[#374151]">{r.k}</span>
                    <span className="num font-semibold">{r.v} bikes</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <span className={cn("block h-full rounded-full transition-[width] duration-700", r.c)} style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-[12px] text-[#9CA3AF]">Solar share {sf}% for this charging habit.</p>
            </div>
          )}

          {tab === "docs" && (
            <ul className="mt-4 space-y-1">
              {[
                ["/research#case-c", "Case C in the research summary"],
                ["/commercial", "Hub business case"],
                ["/downloads", "Thesis and commercial proposal"],
              ].map(([href, t]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center justify-between rounded-lg px-2 py-2 text-[13px] font-medium text-[#1f2937] hover:bg-slate-50">
                    {t} <ArrowRight className="size-4 text-[#9CA3AF]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute left-3 top-3 z-[500] inline-flex h-[38px] items-center gap-2 rounded-xl bg-white px-3.5 text-[13px] font-semibold text-[#111827] shadow-[0_4px_14px_rgba(15,23,42,0.18)]"
        >
          Bike: EB-042 <ChevronDown className="size-4" />
        </button>
      )}
    </MapShell>
  );
}
