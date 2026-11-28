"use client";
import * as React from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, LocateFixed, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type L = typeof Leaflet;
export type LayerToggle = { id: string; label: string; on: boolean };

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const TILES = {
  map: { url: `${ESRI}/World_Street_Map/MapServer/tile/{z}/{y}/{x}`, attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors" },
  satellite: { url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics" },
} as const;

/** Small HTML marker icons shared by the maps (styles in globals.css, section "Map"). */
export const GLYPH = {
  bike: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 15.5a2.5 2.5 0 1 0 0 .01zM19 15.5a2.5 2.5 0 1 0 0 .01zM7.2 7h7.3l2.6 4.3h2.1c.9 0 1.6.7 1.6 1.6V15h-1.1a3.2 3.2 0 0 0-6.2 0H8.4a3.2 3.2 0 0 0-6.2 0H1.6v-2.2c0-.9.6-1.6 1.4-1.7L5 6.3c.3-.5 1-.9 1.6-.9z"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
};
export function markerIcon(L: L, kind: "black" | "blue" | "yellow" | "dot" | "dot-blue", glyph = GLYPH.bike) {
  const size = kind === "dot" || kind === "dot-blue" ? 14 : kind === "blue" ? 46 : 34;
  const html = kind === "dot" || kind === "dot-blue" ? `<span class="mk mk-${kind}"></span>` : `<span class="mk mk-${kind}"><i>${glyph}</i></span>`;
  return L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}
/** White address card next to a point, as in the tracking reference. */
export function cardTooltip(text: string, glyph = GLYPH.pin) {
  return `<span class="map-card"><b>${glyph}</b><span>${text}</span></span>`;
}

/**
 * Leaflet map with the reference chrome: Map / Satellite switch and a Layers menu at the top right,
 * locate and zoom at the bottom right. `onReady` builds the content and may return a cleanup.
 */
export function MapShell({
  className,
  label,
  home,
  maxZoom = 18,
  padTopLeft = [24, 24],
  layers,
  onLayer,
  onReady,
  children,
}: {
  className?: string;
  label: string;
  home: [[number, number], [number, number]];
  maxZoom?: number;
  /** Extra room at the top left when a panel covers that corner. */
  padTopLeft?: [number, number];
  layers?: LayerToggle[];
  onLayer?: (id: string, on: boolean) => void;
  onReady: (map: Leaflet.Map, L: L) => void | (() => void);
  children?: React.ReactNode;
}) {
  const el = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<Leaflet.Map | null>(null);
  const tiles = React.useRef<Leaflet.TileLayer | null>(null);
  const lib = React.useRef<L | null>(null);
  const ready = React.useRef(onReady);
  ready.current = onReady;
  const [mode, setMode] = React.useState<"map" | "satellite">("map");
  const [menu, setMenu] = React.useState(false);

  React.useEffect(() => {
    let dead = false;
    let cleanup: void | (() => void);
    import("leaflet").then((Lmod) => {
      if (dead || !el.current || map.current) return;
      const L = (Lmod as unknown as { default?: L }).default ?? (Lmod as unknown as L);
      lib.current = L;
      const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: false, zoomSnap: 0.25, maxZoom });
      m.attributionControl.setPrefix(false);
      m.fitBounds(home, { paddingTopLeft: padTopLeft, paddingBottomRight: [60, 24] });
      tiles.current = L.tileLayer(TILES.map.url, { maxZoom, attribution: TILES.map.attribution }).addTo(m);
      map.current = m;
      cleanup = ready.current(m, L);
    });
    return () => {
      dead = true;
      if (typeof cleanup === "function") cleanup();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const swap = (m: "map" | "satellite") => {
    setMode(m);
    const L = lib.current;
    if (!L || !map.current) return;
    tiles.current?.remove();
    tiles.current = L.tileLayer(TILES[m].url, { maxZoom, attribution: TILES[m].attribution }).addTo(map.current);
    tiles.current.bringToBack();
  };

  return (
    <div className={cn("map-shell relative isolate overflow-hidden rounded-[22px] bg-[#e8eef3]", className)}>
      <div ref={el} role="region" aria-label={label} className="absolute inset-0 z-0" />
      {children}
      {/* top right: map type and layers */}
      <div className="absolute right-3 top-3 z-[500] flex items-start gap-2">
        <div className="flex rounded-xl bg-white p-1 shadow-[0_4px_14px_rgba(15,23,42,0.18)]" role="group" aria-label="Map type">
          {(["map", "satellite"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => swap(m)}
              className={cn("rounded-lg px-3.5 py-1.5 text-[13px] font-semibold capitalize transition-colors", mode === m ? "bg-[#F8D247] text-[#111827]" : "text-[#374151] hover:bg-slate-100")}
            >
              {m}
            </button>
          ))}
        </div>
        {layers && (
          <div className="relative">
            <button
              type="button"
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
              className="inline-flex h-[38px] items-center gap-2 rounded-xl bg-white px-3.5 text-[13px] font-semibold text-[#374151] shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:bg-slate-50"
            >
              <Layers className="size-4" /> Layers
            </button>
            {menu && (
              <div className="absolute right-0 top-11 w-48 rounded-xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.22)]">
                {layers.map((l) => (
                  <label key={l.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-[#1f2937] hover:bg-slate-50">
                    <input type="checkbox" checked={l.on} onChange={(e) => onLayer?.(l.id, e.target.checked)} className="size-4 accent-[#2F80ED]" />
                    {l.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* bottom right: locate and zoom */}
      <div className="absolute bottom-4 right-3 z-[500] flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label="Back to the whole view"
          onClick={() => map.current?.flyToBounds(home, { paddingTopLeft: padTopLeft, paddingBottomRight: [60, 24], duration: 1 })}
          className="grid size-9 place-items-center rounded-full bg-white text-[#374151] shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:bg-slate-50"
        >
          <LocateFixed className="size-4" />
        </button>
        <div className="flex flex-col overflow-hidden rounded-full bg-white shadow-[0_4px_14px_rgba(15,23,42,0.18)]">
          <button type="button" aria-label="Zoom in" onClick={() => map.current?.zoomIn()} className="grid size-9 place-items-center text-[#374151] hover:bg-slate-50">
            <Plus className="size-4" />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => map.current?.zoomOut()} className="grid size-9 place-items-center text-[#374151] hover:bg-slate-50">
            <Minus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
