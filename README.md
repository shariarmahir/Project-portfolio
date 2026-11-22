# SolarEV BD: thesis and project portfolio

Next.js 14 (App Router) · Tailwind CSS · Radix UI · Framer Motion · Montserrat.
The layout language follows the GRIDSERVE EV-charging site (structure only), in the SolarEV BD navy, cobalt and Helios-yellow palette. See `DESIGN.md` and `PRODUCT.md`.

## Run

```bash
npm install
npm run dev                # http://localhost:3000
npm run build && npm start # production
```

Deploy on Vercel with default settings. Optionally set `NEXT_PUBLIC_SITE_URL` to your domain for social previews.

## Pages

| Route | Content |
| --- | --- |
| `/` | Video hero, scroll-path story, quick links, the three systems, how it works, findings, FAQ |
| `/research` | Abstract, method, station specs, economics, Monte Carlo, LCA, prototype |
| `/commercial` | 20 kW net-metered and 300 kWp models, comparison and sliders, 300 kWp details |
| `/downloads` | The six documents plus the research archive link |
| `/author` | Asif Rabbi, academic record, citation |

References open from the header (**References**) and from the Home quick links.

## Adding the documents

Put each file in `public/downloads/` using exactly these names, then rebuild. Each card switches from "Coming soon" to a live download and shows the file size automatically.

| Card | File name |
| --- | --- |
| Project proposal: thesis | `thesis-proposal.pdf` |
| Project proposal: commercial | `commercial-proposal.pdf` |
| Thesis draft | `thesis-draft.pdf` or `thesis-draft.docx` |
| Thesis book | `thesis-book.pdf` |
| IEEE publication | `ieee-publication.pdf` |
| Presentation slides | `presentation-slides.pptx` or `presentation-slides.pdf` |

The "Visit link" card points to the Google Drive folder set in `lib/data.ts` (`SITE.drive`).

## Editing content

- All text and figures: `lib/data.ts`
- References: `lib/references.ts`
- Photos and video: `lib/media.ts` (files in `public/media/`)
- Download slots: `lib/downloads.ts`

## Before publishing

- Replace the placeholder contact email `SITE.email` in `lib/data.ts`.
- Photos are from Unsplash (Unsplash License) and video from Mixkit (Mixkit Free License); credits are listed in the footer.
