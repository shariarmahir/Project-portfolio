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
};

export const SLOTS: DownloadSlot[] = [
  {
    id: "thesis-proposal",
    title: "Project proposal: thesis",
    desc: "The approved MSc thesis proposal: aims, method and expected outcomes.",
    base: "thesis-proposal",
    exts: ["pdf"],
    action: "Download thesis proposal",
    group: "thesis",
  },
  {
    id: "commercial-proposal",
    title: "Project proposal: commercial",
    desc: "The 300 kWp, 100-bike solar charging hub with system design, phasing and ROI projection.",
    base: "commercial-proposal",
    exts: ["pdf"],
    action: "Download commercial proposal",
    group: "commercial",
  },
  {
    id: "thesis-draft",
    title: "Thesis draft",
    desc: "The working draft of the MSc thesis, chapters one to seven.",
    base: "thesis-draft",
    exts: ["pdf", "docx"],
    action: "Download thesis draft",
    group: "thesis",
  },
  {
    id: "thesis-book",
    title: "Thesis book",
    desc: "The complete bound thesis with all figures, tables and references.",
    base: "thesis-book",
    exts: ["pdf"],
    action: "Download thesis book",
    group: "thesis",
  },
  {
    id: "ieee-publication",
    title: "IEEE publication",
    desc: "Design and performance assessment of a multi-functional IoT-enabled solar charging station with economic and environmental analysis.",
    base: "ieee-publication",
    exts: ["pdf"],
    action: "Download IEEE paper",
    group: "publication",
  },
  {
    id: "presentation-slides",
    title: "Presentation slides",
    desc: "The thesis defense deck: architecture, prototype, economics, sensitivity and LCA.",
    base: "presentation-slides",
    exts: ["pptx", "pdf"],
    action: "Download slides",
    group: "publication",
  },
];

export const VISIT_LINK = {
  title: "Research archive",
  desc: "Simulation files, datasets and working material in the shared research drive.",
  href: SITE.drive,
  action: "Visit link",
};

export type ResolvedDownload = DownloadSlot & { href: string | null; ext: string | null; size: string | null };

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
        return { ...slot, href: `/downloads/${slot.base}.${ext}`, ext: ext.toUpperCase(), size: human(fs.statSync(file).size) };
      }
    }
    return { ...slot, href: null, ext: null, size: null };
  });
}
