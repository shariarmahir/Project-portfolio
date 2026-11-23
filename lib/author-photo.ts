import fs from "node:fs";
import path from "node:path";

/**
 * The author's portrait is picked up at build time: drop a photo at
 * public/images/author.jpg (or .png / .webp) and it replaces the monogram.
 */
export function authorPhoto(): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const rel = `/images/author.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}
