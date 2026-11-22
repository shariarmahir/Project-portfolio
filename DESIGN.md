# Design

Visual system for SolarEV BD. Product truth lives in PRODUCT.md.

## Direction contract

- **THESIS:** A charging network's public website, not a research poster. The study is presented with the same calm, confident pattern language a real EV-charging operator uses (GRIDSERVE electric highway as the owner-pinned reference). Refuses the startup-landing default of eyebrow pills, glowing stat cards and gradient emphasis.
- **OWN-WORLD:** Cool neutral canvas, navy and cobalt colour fields that own whole panels, Helios yellow only on bolt marks and the primary action. One family: Montserrat 600 set tight for display, 400/500 for reading. 24px radii on media and panels, full pills for buttons, white circular carousel arrows.
- **STORY:** An examiner learns in one viewport what the thesis is (solar charging for Easy Bikes), follows the drawn path through why it matters, the three systems studied and the evidence, and reaches any document in two clicks. A commercial reader can switch to the Commercial view at any time.
- **FIRST VIEWPORT:** Inset rounded video card (aerial PV array) nearly full width. Centred sentence-case kicker, two-line H1, one sentence, two buttons: primary Helios "Read the research", secondary white "Download the thesis". A bolt node on the card's bottom edge starts the scroll path.
- **FORM:** Pinned by the owner (gridserve reference), so no roll was run. Staging: scroll-path narrative on Home, stacked overlap panels for the three systems.

## Colour (60-30-10)

| Role | Token | Value |
| --- | --- | --- |
| Canvas (60%) | `canvas` | #F8FAFC |
| Surface | `surface` | #FFFFFF |
| Tint panel | `tint` | #E7EDF5 |
| Hairline | `line` | #D9E1EC |
| Ink | `ink` | #0F172A |
| Body text | `body` | #334155 |
| Navy field (30%) | `navy` | #0A2540 |
| Cobalt (30%) | `cobalt` | #1D4ED8 |
| Helios (10%) | `helios` | #F59E0B |
| Helios hover | `helios-600` | #D97706 |

Rules: Helios is never used as text on light surfaces (it fails contrast). On light grounds it appears as bolt marks and button fills with navy text. On navy it may be text. Kickers on light grounds are cobalt.

## Type

- Montserrat via `next/font`. Display weight 600, tracking -0.04em, line-height 1.05. H1 clamp(2.6rem, 6vw, 5rem); H2 clamp(2.2rem, 4.6vw, 4rem); H3 clamp(1.5rem, 2.4vw, 2.25rem).
- Statement paragraphs: 600, 1.6–1.9rem, tracking -0.02em.
- Body: 400, 1.0625–1.125rem, line-height 1.6, max 68ch, colour `body`.
- Numbers use `font-variant-numeric: tabular-nums`. No monospace anywhere except the BibTeX code block.
- Kickers: sentence case, 600, cobalt (light ground) or helios (navy ground). Used only where a section has a category name, never on every section.

## Shape & depth

- Radii: media and panels 24px; overlap panels 40px top corners; buttons full pill; inputs 16px.
- Shadows only on floating controls (carousel arrows, header on scroll): `0 6px 18px -8px rgba(10,37,64,.25)`. Panels are flat colour fields.

## Components

- Buttons: pill, 48px tall, 600. Primary = Helios fill + navy text; Secondary = navy fill + white; Ghost = 1.5px navy outline. Arrow icon trails.
- Header: canvas background, hairline bottom border, segmented control "Research / Commercial" in a tinted pill, text links, primary action at right.
- Bolt list: Helios bolt glyph, 600 title, body paragraph, hairline dividers between items.
- Overlap panels: full-bleed, sticky stacking, alternating tint / navy / white, kicker + H3 + bolt list + image carousel.
- Tiles: 24px-radius colour blocks (navy, cobalt, tint, photo) with title top-left and arrow bottom-left.
- Accordion: tint bars, 24px radius, chevron right.
- Ticker: single line of 600 words separated by bolt marks, slow marquee, paused on reduced motion.

## Motion

One authored moment: the scroll path, a 1.5px line drawn by scroll progress (pathLength) from the hero bolt node through the intro block. Everything else is quiet: content is visible by default, images settle with a short opacity and translate, carousels slide 400ms ease-out. Respect `prefers-reduced-motion` (no path draw, no marquee, videos paused on their poster).

## Imagery

Licensed only: Unsplash (photos, Unsplash License) and Mixkit (video, Mixkit Free License). Bangladeshi scenes are used where verified (Dhaka aerial and street photos). Credits listed in `lib/media.ts` and the footer credits link.
