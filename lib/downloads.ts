import fs from "node:fs";
import path from "node:path";
import { SITE } from "@/lib/data";

/**
 * Downloads are detected at build time. Drop a file into /public/downloads using
 * one of the base names below (any listed extension) and rebuild: the card switches
 * from "Coming soon" to a live download and shows the file size.
 */
export type DownloadSlot = {
  id: string;
  title: string;
  desc: string;
  base: string;
  exts: string[];
  action: string;
  group: "thesis" | "commercial" | "publication";
  /** Page or slide count of the shipped file. */
  length: string;
};

export const SLOTS: DownloadSlot[] = [
  {
    id: "thesis-proposal",
    title: "Project proposal: thesis",
    desc: "The UAP MSc thesis proposal for the three cases, with supervisor and co-supervisor, reconciled preliminary results, the 100 vs 300 kWp hub sizing and the work plan.",
    base: "thesis-proposal",
    length: "10 pages",
    exts: ["pdf"],
    action: "Download thesis proposal",
    group: "thesis",
  },
  {
    id: "commercial-proposal",
    title: "Project proposal: commercial",
    desc: "The 300 kWp, 100-bike solar charging hub built in 100 kWp blocks: hourly energy balance, discounted ROI, the sizing decision and the swap-pack battery idea.",
    base: "commercial-proposal",
    length: "14 pages",
    exts: ["pdf"],
    action: "Download commercial proposal",
    group: "commercial",
  },
  {
    id: "thesis-draft",
    title: "Thesis draft",
    desc: "The updated MSc thesis draft in six chapters: the 18 kWp station and 30 W prototype (Case A), the 98.4 kWp Satkhira PVsyst system (Case B) and the proposed 300 kWp Easy Bike hub (Case C), with a 100 vs 300 kWp size comparison and a swap-pack solar buffer.",
    base: "thesis-draft",
    length: "117 pages",
    exts: ["pdf", "docx"],
    action: "Download thesis draft",
    group: "thesis",
  },
  {
    id: "thesis-book",
    title: "Thesis book",
    desc: "The complete bound thesis with all three cases, figures, tables, references and appendices.",
    base: "thesis-book",
    length: "120 pages",
    exts: ["pdf"],
    action: "Download thesis book",
    group: "thesis",
  },
  {
    id: "ieee-publication",
    title: "IEEE publication",
    desc: "Three-case IEEE paper: the IoT-enabled station, the grid-connected Satkhira system and the sizing of a 100-bike hub, with economic and environmental analysis.",
    base: "ieee-publication",
    length: "30 pages",
    exts: ["pdf"],
    action: "Download IEEE paper",
    group: "publication",
  },
  {
    id: "presentation-slides",
    title: "Presentation: IoT-enabled solar EV charging infrastructure",
    desc: "The thesis defence deck: Case A design, prototype, rebuilt economics and LCA, the Satkhira PVsyst case, the 100-bike hub sizing and the swap-pack idea.",
    base: "presentation-iot-charging-infrastructure",
    length: "26 slides",
    exts: ["pptx", "pdf"],
    action: "Download PPT",
    group: "publication",
  },
  {
    id: "presentation-blueprint",
    title: "Presentation: Bangladesh solar EV blueprint",
    desc: "The blueprint deck for a 300 kWp, 100-bike solar charging hub: hourly matching, discounted payback, 100 vs 300 kWp, swap packs and phasing.",
    base: "presentation-solar-ev-blueprint",
    length: "29 slides",
    exts: ["pptx", "pdf"],
    action: "Download PPT",
    group: "publication",
  },
];

export const VISIT_LINK = {
  title: "Research archive",
  desc: "Simulation files, datasets and working material in the shared research drive.",
  href: SITE.drive,
  action: "Visit link",
};

export type ResolvedDownload = DownloadSlot & { href: string | null; ext: string | null; size: string | null; cover: string };

export const GROUP_LABEL: Record<DownloadSlot["group"], string> = {
  thesis: "Thesis",
  commercial: "Commercial",
  publication: "Publication and slides",
};

function human(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function resolveDownloads(): ResolvedDownload[] {
  const dir = path.join(process.cwd(), "public", "downloads");
  return SLOTS.map((slot) => {
    for (const ext of slot.exts) {
      const file = path.join(dir, `${slot.base}.${ext}`);
      if (fs.existsSync(file)) {
        return {
          ...slot,
          href: `/downloads/${slot.base}.${ext}`,
          ext: ext.toUpperCase(),
          size: human(fs.statSync(file).size),
          cover: `/media/covers/${slot.base}.jpg`,
        };
      }
    }
    return { ...slot, href: null, ext: null, size: null, cover: `/media/covers/${slot.base}.jpg` };
  });
}
