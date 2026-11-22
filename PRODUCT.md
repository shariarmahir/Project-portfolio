# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: MSc thesis examiners, supervisors and academic reviewers at the University of Asia Pacific (Dept. of EEE) who need to understand, verify and download the research quickly.
Secondary: commercial readers (charging-hub operators, investors, SREDA/BERC contacts) evaluating whether the solar EV charging model is worth a site feasibility audit.

## Product Purpose
A thesis-and-project portfolio for Asif Rabbi's MSc research on IoT-enabled solar PV battery charging stations for Bangladesh's Easy Bike (battery three-wheeler) fleet. It presents the problem, the two commercial deployment models, the techno-economic and life-cycle evidence, and gives one-click access to the thesis documents. Success = an examiner finds the evidence and the documents without friction; a commercial reader understands the business case.

## Positioning
The only study that runs the full chain for a Bangladeshi solar charging station: MATLAB Simulink design, a hardware IoT prototype (ESP32 + ThingSpeak), PVsyst economics, 3,000-iteration Monte Carlo risk, and a 10-category ReCiPe 2016 cradle-to-grave LCA comparing landfill with formal battery recycling.

## Operating Context
Visitors arrive from a thesis submission, a defense, a supervisor's email or a shared link; often on a laptop during review, sometimes on a phone. Free deployment on Vercel.

## Capabilities and Constraints
- Download pages for exactly: thesis project proposal, commercial project proposal, thesis draft, thesis book, IEEE publication PDF, presentation slides, plus one external "Visit link".
- Downloads show "Coming soon" until the owner drops the file into `public/downloads/` with the expected filename; size is detected at build.
- References available from a button (30 journal references + guideline sources).
- Author page for Asif Rabbi only.
- No raw source files (PPTX/DOCX/PVsyst exports) are served.
- Imagery must be licensed for reuse (no Pinterest scraping); motion graphics may be code-generated.

## Brand Commitments
- Name: SolarEV BD.
- Signature colours bound by the owner: navy/cobalt (#0A2540 / #1D4ED8) and Helios yellow (#F59E0B) in a 60-30-10 split on a light neutral canvas (#F8FAFC / #FFFFFF). Light mode only.
- Layout and interaction reference chosen by the owner: gridserve.com/electric-vehicle-charging (structure and rhythm only; none of its brand, copy or assets).

## Evidence on Hand
Source documents in `solar-ev-bangladesh-all-data/` (kept out of the deployment):
- Asif Rabbi MSc thesis draft and defense deck: 18 kWp / 30 kWh station, 23.9 MWh/yr, PR ≈ 84%, LCOE 0.17 USD/kWh, NPV 14,024 USD, IRR 12.71–16.96% (95% CI), Monte Carlo means NPV $14,328.95 / IRR 14.87% / ROI 89%; LCA 32,813 → 24,020 kgCO₂eq with formal recovery (−8,793, −26.8%), carbon payback 1.5–2.0 yrs, 0.0558 kgCO₂eq/kWh (11.1× below grid). Supervisor: Prof. Dr Tapan Kumar Chakraborty. Student ID 2212003. Defense 25 April 2026.
- Commercial proposal: 300 kWp / 100-point Easy Bike hub, CAPEX BDT 2.27 Cr, net BDT 71.75 L/yr, simple payback 3.16 yrs, 10-yr ROI ≈ 216%.
- Owner-supplied headline figures (not in the source files): 3.5M Easy Bikes, $0.0768/kWh net-metered LCOE, 6,460 t CO₂eq per 20 kW station, 5.5–6.0 yr payback, 22.4 GWh/day, BDT 12,775 Cr, 51.2% spillage, 86% Pb loss.
- No testimonials, clients, press or deployed sites exist. Do not fabricate them.

## Product Principles
1. Evidence first: every number traceable to a document.
2. Examiners must reach any document within two clicks.
3. Commercial framing supports the research; it never overstates it (figures are pre-feasibility estimates).
4. Real Bangladeshi context over generic "green energy" stock imagery.

## Accessibility & Inclusion
WCAG 2.2 AA contrast and keyboard access; respect reduced motion.
