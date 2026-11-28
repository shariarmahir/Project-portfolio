# Design

Visual system for SolarEV BD. Product truth lives in PRODUCT.md. Every number on the site comes from `lib/thesis-data.ts`, which is generated from the thesis model (`thesis3/export_site.py`), or from `lib/data.ts` where each figure appears in the thesis.

## Direction contract (November 2026 redesign, owner-pinned)

- **WORLD:** "Solar night" glassmorphism. A deep night sky behind frosted glass panels, with one sun-amber accent. The owner pinned the references: glass dashboard cards, a product-launch hero with a giant faded word behind the subject (bike-launch layout), and a resume-style author profile.
- **SKY:** `components/site/sky.tsx` moves the light with the scroll: dawn at the top, noon in the middle and dusk at the foot of every page. A sun disc with lens-flare ghosts crosses the sky, light motes rise, sunlight follows the pointer over glass (`sun-trail.tsx`) and a beam sweeps each section title once (`title-sweep.tsx`). There is only ever one sun on screen.
- **HERO:** A live three.js scene (`components/three/solar-scene.ts`, the "hub" view) fills the hero: roof plant, charging canopy, Easy Bikes, ESS, substation and flowing energy. Glass labels are pinned to the 3D objects. Left: the real h1, an amber line, a short body, two calls to action and three counted stats. No carousel, rails, captions or scroll cue. A transparent poster covers the load.
- **IMAGERY:** No photographs and no credits. Every image is a render of our own 3D world (`public/media/renders`); the inner pages show the same world live in a glass band.
- **MAP:** Leaflet with Esri dark canvas tiles (English labels); amber pins for the thesis sites, blue for the charging points mapped on OpenStreetMap (`lib/charging-points.ts`).
- **CARDS:** Cards side by side must end together: stretch lists (`auto-rows-fr`, `justify-between`) or pin a summary to the bottom (`mt-auto`). `qa/cardgap.py` checks it.
- **FOOTER:** Glass slab with a sunlit top edge, faint giant wordmark and the builder credit in a glowing pill with moving sunlight colour.
- **MOTION:** Reveal on scroll, count-up numbers, lines that draw themselves, bars that grow, stacked case cards. `MotionConfig reducedMotion="user"` plus `useReduced()` (false until mount) keep reduced-motion users safe and hydration stable.
- **UNITS:** Never uppercase text that contains units (kWp, kWh, kW).

## Colour

| Role | Token | Value |
| --- | --- | --- |
| Canvas | `canvas` | #050B16 |
| Surface | `surface` | #0B1526 |
| Tint | `tint` | #0E1A2E |
| Hairline | `line` | #22324B |
| Ink | `ink` | #F2F6FC |
| Body | `body` | #C5D0DF |
| Muted | `muted` | #8F9FB7 |
| Sun accent | `helios` / `helios-300` | #F59E0B / #FCD34D |
| Grid and data | `cobalt` | #4F86F7 |
| Solar and good results | `leaf` | #34D399 |

Glass: `.glass` (light frost), `.glass-strong` (dense panel), defined in `app/globals.css`. Amber buttons carry navy-900 text.

## Type

Montserrat (self-hosted variable font). Display 600 with tight tracking; kickers 13px uppercase with wide tracking in amber; reading text 16-18px.

## Logo

`components/site/marks.tsx` redraws the supplied animated logo (`public/logo/logo.gif`) as SVG: turning sun, flickering bolts, tilting panels. `tone="dark"` swaps the navy outline for a light one on dark backgrounds.
