"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, PlugZap } from "lucide-react";
import type * as Leaflet from "leaflet";
import { MapShell, GLYPH, cardTooltip, markerIcon, type LayerToggle } from "@/components/map/map-shell";
import { Reveal, useReduced } from "@/components/charts/kit";
import { SitePlan } from "@/components/landing/site-plan";
import { OSM_POINTS, THESIS_POINTS, type Point } from "@/lib/charging-points";
import { cn } from "@/lib/utils";

const ALL: Point[] = [...THESIS_POINTS, ...OSM_POINTS];
const BD_BOUNDS: [[number, number], [number, number]] = [
  [20.6, 88.0],
  [26.7, 92.7],
];

/** Real map in the colourful reference style: thesis sites in yellow, OpenStreetMap charging points in black. */
function RealMap({ sel, onSel }: { sel: string; onSel: (id: string) => void }) {
  const markers = React.useRef<Record<string, Leaflet.Marker>>({});
  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const reduce = useReduced();
  const pick = React.useRef(onSel);
  pick.current = onSel;
  const [ready, setReady] = React.useState(false);
  const [layers, setLayers] = React.useState<LayerToggle[]>([
    { id: "osm", label: "Charging stations", on: true },
    { id: "labels", label: "Site cards", on: true },
  ]);
  const groups = React.useRef<Record<string, Leaflet.LayerGroup>>({});

  const build = React.useCallback((m: Leaflet.Map, L: typeof Leaflet) => {
    mapRef.current = m;
    const osm = L.layerGroup().addTo(m);
    const labels = L.layerGroup().addTo(m);
    groups.current = { osm, labels };
    for (const p of ALL) {
      const thesis = p.kind === "thesis";
      const mk = L.marker([p.lat, p.lon], {
        icon: markerIcon(L, thesis ? "yellow" : "black", thesis ? GLYPH.sun : GLYPH.plug),
        title: `${p.name}, ${p.place}`,
        riseOnHover: true,
        zIndexOffset: thesis ? 500 : 0,
      }).addTo(thesis ? m : osm);
      mk.on("click", () => pick.current(p.id));
      markers.current[p.id] = mk;
      if (thesis)
        L.tooltip({ permanent: true, direction: "right", offset: [16, 0], className: "map-tip" })
          .setLatLng([p.lat, p.lon])
          .setContent(cardTooltip(`${p.place} · ${p.name}`, GLYPH.sun))
          .addTo(labels);
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    const m = mapRef.current;
    const p = ALL.find((x) => x.id === sel);
    if (!m || !p) return;
    Object.entries(markers.current).forEach(([id, mk]) => mk.getElement()?.querySelector(".mk")?.classList.toggle("mk-on", id === sel));
    m.flyTo([p.lat, p.lon], p.kind === "thesis" ? 10 : 13, { duration: reduce ? 0 : 1.4 });
  }, [sel, reduce, ready]);

  const onLayer = (id: string, on: boolean) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, on } : l)));
    const g = groups.current[id];
    if (!g || !mapRef.current) return;
    if (on) g.addTo(mapRef.current);
    else g.remove();
  };

  return (
    <MapShell
      className="h-full min-h-[380px] lg:min-h-[520px]"
      label="Map of Bangladesh with the thesis sites and the charging points mapped on OpenStreetMap"
      home={BD_BOUNDS}
      maxZoom={17}
      layers={layers}
      onLayer={onLayer}
      onReady={build}
    />
  );
}

export function ChargeMap() {
  const [sel, setSel] = React.useState<string>("satkhira");
  const p = ALL.find((x) => x.id === sel) ?? ALL[0];
  return (
    <section aria-labelledby="map-h" className="section container">
      <Reveal className="max-w-3xl">
        <h2 id="map-h" className="h2">
          Charging point map
        </h2>
        <p className="lead mt-5">
          Yellow markers are the thesis sites. Black markers are every charging station mapped in Bangladesh on OpenStreetMap, most of them for battery rickshaws. Select a
          point to fly to it.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="glass flex flex-col rounded-slab p-3 sm:p-4">
          <div className="flex-1">
            <RealMap sel={sel} onSel={setSel} />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-2 pb-1 pt-4 text-[12.5px] text-muted">
            <span className="flex items-center gap-2">
              <span className="inline-block size-3.5 rounded-full border-2 border-white bg-[#F8D247]" />
              Thesis site ({THESIS_POINTS.length})
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block size-3.5 rounded-full border-2 border-white bg-[#111827]" />
              Mapped charging station ({OSM_POINTS.length})
            </span>
            <span className="sm:ml-auto">OpenStreetMap data, retrieved 28 Nov 2026</span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.06} className="glass-strong rounded-slab p-6 sm:p-7">
            <div role="group" aria-label="Charging points" className="flex flex-wrap gap-2">
              {ALL.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={sel === x.id}
                  onClick={() => setSel(x.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                    sel === x.id ? "bg-helios text-navy-900" : "bg-white/[0.06] text-body hover:bg-white/10 hover:text-ink"
                  )}
                >
                  {x.kind === "thesis" ? <MapPin className="size-3.5" /> : <PlugZap className="size-3.5" />}
                  {x.kind === "thesis" ? x.place : x.name}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-5 border-t border-white/10 pt-5"
              >
                <p className="text-[17px] font-semibold text-ink">{p.name}</p>
                <p className="mt-0.5 text-[13.5px] text-helios-300">
                  {p.place} · {p.lat.toFixed(3)}° N, {p.lon.toFixed(3)}° E
                </p>
                <p className="mt-2 text-[14px] text-body">{p.note}</p>
                <p className="mt-2 text-[12px] text-muted">
                  {p.kind === "thesis" ? "Thesis site. Satkhira is shown at the town; the plant location stays private." : `OpenStreetMap ${p.id}`}
                </p>
              </motion.div>
            </AnimatePresence>
          </Reveal>
          <Reveal delay={0.1} className="glass flex-1 rounded-slab p-6 sm:p-7">
            <p className="text-[15px] font-semibold text-ink">Hub site plan, Satkhira</p>
            <div className="mt-4">
              <SitePlan />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
