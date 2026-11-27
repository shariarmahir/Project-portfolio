/**
 * Content for SolarEV BD. Every figure traces to a document in /solar-ev-bangladesh-all-data
 * (thesis draft, defense deck, journal manuscript, commercial proposal) or to the owner's brief.
 */

export const SITE = {
  name: "SolarEV BD",
  author: "Asif Rabbi",
  // TODO: placeholder: replace with the real contact address before publishing.
  email: "contact@solarev-bd.org",
  drive: "https://drive.google.com/drive/folders/12trJqD6Yn4uHmG247vBKim6J4P08WC6s",
};

export const AUDIT_HREF = `mailto:${SITE.email}?subject=${encodeURIComponent("Site feasibility audit request")}`;

export const NAV = [
  { href: "/research", label: "Research" },
  { href: "/commercial", label: "Commercial" },
  { href: "/downloads", label: "Downloads" },
  { href: "/author", label: "Author" },
] as const;

export const THESIS = {
  title:
    "Design, Techno-Economic Evaluation and Multi-Category Life Cycle Assessment of IoT-Enabled Solar Photovoltaic Battery Charging Stations in Bangladesh",
  shortTitle: "IoT-enabled solar PV battery charging stations for Bangladesh",
  degree: "M.Sc. in Electrical & Electronic Engineering",
  dept: "Department of Electrical & Electronic Engineering",
  university: "University of Asia Pacific, Dhaka",
  studentId: "2212003",
  supervisor: "Prof. Dr. Tapan Kumar Chakraborty",
  defense: "25 April 2026",
  submitted: "October 2026",
  abstract: [
    "Published work on solar charging infrastructure treats design, monitoring, financial appraisal and environmental accounting as separate exercises, and no study reports the full chain for a Bangladeshi installation. This thesis closes that gap for an Internet-of-Things-enabled solar photovoltaic battery charging station in Dhaka.",
    "A station of 18 kWp photovoltaic capacity and 30 kWh lithium-ion storage was designed in MATLAB Simulink around maximum power point tracking, a buck converter, a bidirectional buck-boost converter and a charge controller that limits state of charge to 80%, and connected to the ThingSpeak cloud platform. A laboratory prototype confirmed the control logic and the communication chain.",
    "Techno-economic performance was evaluated in PVsyst and tested through 3,000 Monte Carlo iterations. A cradle-to-grave assessment then covered ten ReCiPe 2016 Midpoint (H) categories across 30,000 iterations under landfill and formal recycling.",
  ],
  keywords: [
    "Internet of Things",
    "Battery energy storage",
    "Techno-economic analysis",
    "Monte Carlo simulation",
    "Life cycle assessment",
    "ReCiPe 2016",
    "End-of-life recycling",
    "Bangladesh",
  ],
};

/** Home: why it matters (owner-supplied headline figures). */
export const WHY = [
  {
    title: "The grid carries an unmetered fleet",
    body: "About 3.5 million Easy Bikes charge every night, drawing roughly 22.4 GWh a day. Much of it flows through unauthorised connections, an annual burden of around BDT 12,775 crore.",
  },
  {
    title: "Off-grid stations waste half their sun",
    body: "Bikes work by day and charge by night, so a standalone station spills 51.2% of what its panels produce. A net-metered connection sends that daytime surplus to the grid instead.",
  },
  {
    title: "Lead-acid recycling poisons neighbourhoods",
    body: "86% of lead lost to the environment comes from informal battery recycling. Lithium iron phosphate storage, recovered through formal channels, takes that hazard off the street.",
  },
];

/** The three systems the work covers (overlap panels). */
export const SYSTEMS = [
  {
    key: "station",
    title: "18 kWp IoT charging station",
    body: "Designed in MATLAB Simulink, built as a 30 W laboratory prototype and monitored live through ThingSpeak. This is the station the thesis measures, prices and follows from cradle to grave.",
    points: ["23.9 MWh a year at a performance ratio near 84%", "ESP32 telemetry: SOC, current, temperature, fire alarm", "Charging capped at 80% SOC to protect the pack"],
    images: ["circuit", "chip", "panelsBlue"],
    theme: "tint",
    href: "/research",
    cta: "Read the research",
  },
  {
    key: "netmetered",
    title: "20 kW net‑metered hub",
    body: "The same station tied to the grid under SREDA and BERC net-metering. It fits on a rooftop or a parking lot, needs no land purchase and can be repeated neighbourhood by neighbourhood.",
    points: ["CAPEX BDT 18–26 lakh ($15.6K–$23.6K)", "LCOE $0.0768/kWh, below the BERC tariff of BDT 7.70", "Payback in 5.5–6 years"],
    images: ["rooftop", "warehouse"],
    theme: "navy",
    href: "/commercial",
    cta: "Compare the models",
  },
  {
    key: "megahub",
    title: "250 kWp plant and a 100-bike hub",
    body: "A real plant commissioned in Satkhira in September 2026: 404 JINKO modules, five 50 kW inverters and a 100 kW energy storage system, supplying a hub of 100 metered charging points in two zones.",
    points: ["Plant contract BDT 1.26 crore, Tk 35.30 per watt", "Hub payback 2.7 years at 80% use (two-shift)", "Break-even at about 30% utilisation"],
    images: ["farmAerial", "fieldArray", "connector"],
    theme: "white",
    href: "/commercial",
    cta: "See the 250 kWp model",
  },
] as const;

export const HOW_IT_WORKS = [
  { title: "Generate", body: "400 W modules feed a buck-boost converter; perturb-and-observe MPPT holds the array at its maximum power point." },
  { title: "Store and watch", body: "A lithium pack charges to an 80% cap while an ESP32 streams SOC, current and temperature to ThingSpeak." },
  { title: "Charge the fleet", body: "Bikes draw from the pack and the panels, and a fire alarm with email alerts guards the station overnight." },
];


/** Findings written as sentences (home evidence band). */
export const FINDINGS = [
  "Across 3,000 Monte Carlo runs the station's IRR stays between 10.6% and 16.5%.",
  "The rebuilt NPV of $5,963 stays positive in 97.2% of the runs.",
  "A real 250 kWp plant cost Tk 35.30 per watt, 44% below planning prices, and its energy costs Tk 3.7–5.4 per kWh.",
  "Formal battery recovery cuts lifecycle emissions by 8,793 kgCO₂eq, or 26.8%.",
  "Each kWh delivered carries 0.0558 kgCO₂eq, 11.1 times less than the national grid.",
  "The station repays its lifecycle carbon in 1.5 to 2.1 years on delivered energy.",
  "Over its lifecycle it emits 7,764 kg CO₂eq, against 21,510 kg a year from coal for the same energy.",
];

export const FAQ = [
  {
    q: "Where do the numbers come from?",
    a: "Station performance comes from the simulation of the 18 kWp design (Case A), and its 20-year cash flow was rebuilt year by year and tested over 3,000 Monte Carlo iterations. The 98.4 kWp Satkhira figures (Case B) come from a PVsyst 7.4.8 simulation. Environmental results come from an OpenLCA model using ReCiPe 2016 Midpoint (H) over 30,000 iterations. The 250 kWp plant (Case C) is real: its configuration and price come from the signed EPC agreement and the completion certificate, while its yield and the 100-bike hub results come from an hourly screening model checked against PVsyst.",
  },
  {
    q: "Why Easy Bikes and not cars?",
    a: "Battery three-wheelers are Bangladesh's largest electric fleet by far, and most charge at night on informal connections. That is where solar charging relieves the grid the most.",
  },
  {
    q: "Is the station off-grid or grid-tied?",
    a: "The thesis evaluates the station as an off-grid baseline (LCOE $0.20/kWh, simple payback 6 years, discounted payback 12 years). The recommended deployment is the same station net-metered, which removes the daytime spillage and brings payback to 5.5–6 years.",
  },
  {
    q: "Was anything built?",
    a: "Yes. A 30 W laboratory prototype with an ESP32, a MAX17043 fuel gauge, ACS712 and DS18B20 sensors and a SIM800L uplink validated the control logic and telemetry during a 72-hour bench run. The 250.48 kWp plant of Case C was built and commissioned in Satkhira on 9 September 2026.",
  },
  {
    q: "Are the commercial returns guaranteed?",
    a: "No. With two-shift charging at 80% use the hub pays back in 2.7 years simple and 3.4 years discounted, and breaks even at about 30% use. These figures assume a flat fee of BDT 250 per charge, which must be confirmed under the national charging guideline: if only the BERC rate could be billed, the hub would not pay back at a 10% discount rate. A bankable study also needs a year of measured plant data and measured charger load.",
  },
  {
    q: "How do I cite this work?",
    a: "Use the BibTeX entry on the Author page, or download the thesis book from Downloads.",
  },
];

/* ------------------------------- Research data ------------------------------ */

export const STATION_SPECS = [
  { k: "Installed capacity", v: "18 kWp" },
  { k: "Modules", v: "45 × 400 W (5 strings × 9)" },
  { k: "Battery storage", v: "30 kWh lithium-ion" },
  { k: "Annual energy", v: "23.9 MWh" },
  { k: "Specific production", v: "1,330 kWh/kWp" },
  { k: "Performance ratio", v: "≈ 84%" },
  { k: "Largest loss", v: "Temperature, 39.1%" },
  { k: "Site", v: "Farmgate, Dhaka (23.758°N, 90.390°E)" },
];

export const ECONOMICS = [
  { k: "Energy selling price", v: "0.23 USD/kWh" },
  { k: "Annual revenue", v: "5,497 USD" },
  { k: "O&M cost", v: "1,570 USD/yr" },
  { k: "Net annual profit", v: "3,927 USD" },
  { k: "Total investment", v: "≈ 23,670 USD" },
  { k: "LCOE", v: "0.20 USD/kWh" },
  { k: "NPV", v: "5,963 USD" },
  { k: "IRR", v: "13.8%" },
  { k: "ROI", v: "185%" },
  { k: "Payback", v: "6.0 yr simple, 12.0 yr discounted" },
];

export const NET_METERED = [
  { k: "Energy selling price", v: "0.11 USD/kWh" },
  { k: "Total investment", v: "≈ 15,670 USD" },
  { k: "LCOE", v: "0.06 USD/kWh" },
  { k: "Payback", v: "≈ 6 years" },
];

export const MONTE_CARLO = {
  iterations: 3000,
  inputs: ["O&M cost", "discount rate", "degradation rate", "electricity tariff"],
  metrics: [
    { key: "npv", label: "NPV", mean: 5903.75, lo: -193.28, hi: 12983.08, fmt: "usd" },
    { key: "irr", label: "IRR", mean: 13.62, lo: 10.55, hi: 16.52, fmt: "pct" },
    { key: "roi", label: "ROI", mean: 180.99, lo: 133.86, hi: 229.08, fmt: "pct" },
    { key: "lcoe", label: "LCOE", mean: 0.2007, lo: 0.1836, hi: 0.2183, fmt: "usdkwh" },
    { key: "payback", label: "Discounted payback", mean: 12.18, lo: 7.76, hi: 18.15, fmt: "yrs" },
  ],
} as const;

export const LCA = {
  endOfLife: [
    { route: "Informal landfill", value: 32813 },
    { route: "Formal hydrometallurgical recovery", value: 24020 },
  ],
  manufacturing: [
    { k: "PV modules", v: 57.9 },
    { k: "Battery packs", v: 36.8 },
    { k: "Balance of system", v: 5.3 },
  ],
  manufacturingTotal: 28196,
  versusFossil: [
    { k: "Coal, one year", v: 21510 },
    { k: "Gas, one year", v: 11950 },
    { k: "This station, whole life", v: 7764.17 },
  ],
  pvImpacts: [
    { k: "Global warming potential", v: "7,634.67 kg CO₂ eq" },
    { k: "Terrestrial acidification", v: "15.6 kg SO₂ eq" },
    { k: "Land use", v: "51.8 m²" },
    { k: "Human carcinogenic toxicity", v: "2.26 kg 1,4-DCB" },
    { k: "Stratospheric ozone depletion", v: "0.0021 kg CFC11 eq" },
  ],
};

export const PROTOTYPE = [
  { k: "Peak charging current", v: "26.45 A" },
  { k: "SOC rise at peak", v: "0.243 % per minute" },
  { k: "Charge cap", v: "80% SOC" },
  { k: "Power drop begins", v: "above 25 °C" },
  { k: "Bench validation", v: "72 hours" },
];

export const BOM = [
  { k: "Solar module", v: "KS-M590300G30W" },
  { k: "Microcontroller", v: "ESP32" },
  { k: "Fuel gauge", v: "MAX17043" },
  { k: "Current sensor", v: "ACS712" },
  { k: "Temperature sensor", v: "DS18B20" },
  { k: "Cellular uplink", v: "SIM800L" },
  { k: "Local backup", v: "MicroSD adapter" },
  { k: "Cloud", v: "ThingSpeak (REST + MQTT)" },
];

export const METHOD = [
  { title: "Model", body: "MATLAB Simulink model of PV array, buck-boost converter, P&O MPPT, PI-driven PWM and a BESS with an 80% SOC cap, using NASA POWER and Meteonorm weather." },
  { title: "Monitor", body: "ThingSpeak channels linked to the Simulink model, then to an ESP32 prototype streaming SOC, current, temperature and a fire alarm." },
  { title: "Price", body: "PVsyst yield and cost model over 20 years, then 3,000 Monte Carlo iterations across O&M, discount, degradation and tariff." },
  { title: "Account", body: "OpenLCA cradle-to-grave model, ReCiPe 2016 Midpoint (H), ten categories, 30,000 iterations, landfill against formal recovery." },
];

/* ------------------------------ Commercial data ----------------------------- */

export const MODEL_A = {
  name: "250 kWp hub",
  sub: "A real plant, 100 Easy Bikes",
  bestFor: "Markets, warehouses and depots with a large roof, a grid connection and drivers who can charge between shifts.",
  system: [
    { k: "PV array", v: "250.48 kWp, built 9 Sep 2026" },
    { k: "Modules", v: "404 × JINKO 620 Wp" },
    { k: "Inverters", v: "5 × Solis 50 kW on-grid" },
    { k: "Storage", v: "100 kW hybrid ESS (215 kWh assumed)" },
    { k: "Substation", v: "250 kVA; load peak 211 kVA" },
    { k: "Charging points", v: "100, in two zones of 50" },
    { k: "Daily demand", v: "1,000 kWh (10 kWh per bike)" },
    { k: "Solar yield", v: "≈ 960 kWh/day (803–1,166 by month)" },
  ],
  money: [
    { k: "Plant (contract)", v: "BDT 1.2575 crore" },
    { k: "Total hub investment", v: "BDT 1.65 crore" },
    { k: "Revenue at 80% use", v: "BDT 73 lakh/yr" },
    { k: "Grid energy (two-shift)", v: "BDT 8.9 lakh/yr" },
    { k: "Net cash flow, year 1", v: "BDT 60.2 lakh" },
    { k: "Payback at 80% use", v: "2.7 yr simple, 3.4 yr discounted" },
    { k: "Break-even use", v: "≈ 30%" },
  ],
};

export const MODEL_B = {
  name: "20 kW net‑metered hub",
  sub: "One neighbourhood, no land purchase",
  bestFor: "Suburban hubs, parking lots and rooftops that can be approved and built quickly, then repeated.",
  system: [
    { k: "PV array", v: "18–20 kWp, grid-tied" },
    { k: "Modules", v: "45 × 400 W" },
    { k: "Storage", v: "30 kWh lithium" },
    { k: "Annual energy", v: "23.9 MWh" },
    { k: "Approval", v: "SREDA / BERC net-metering" },
  ],
  money: [
    { k: "CAPEX", v: "BDT 18–26 lakh" },
    { k: "CAPEX (USD)", v: "$15.6K–$23.6K" },
    { k: "LCOE", v: "$0.0768/kWh (≈ BDT 7.15)" },
    { k: "Net annual profit", v: "$3,927 (off-grid baseline)" },
    { k: "Payback", v: "5.5–6 years" },
  ],
};

export const COMPARE = [
  {
    key: "capex",
    label: "Capital cost",
    unit: "BDT lakh",
    a: [165.15, 165.15],
    b: [18, 26],
    aText: "BDT 165 lakh",
    bText: "BDT 18–26 lakh",
    note: "The capital for one 250 kWp hub, plant included, builds six to nine net-metered hubs.",
  },
  {
    key: "lcoe",
    label: "Energy cost",
    unit: "BDT per kWh",
    a: [3.72, 5.4],
    b: [7.15, 7.15],
    aText: "BDT 3.72–5.40",
    bText: "BDT 7.15",
    note: "At its real contract price the 250 kWp plant generates at Tk 3.72 per kWh for the PV and Tk 5.40 with its ESS, below both the small hub and the BERC tariff of Tk 11.36.",
  },
  {
    key: "payback",
    label: "Payback",
    unit: "years",
    a: [2.7, 3.4],
    b: [5.5, 6],
    aText: "2.7–3.4 years at 80% use",
    bText: "5.5–6 years",
    note: "Two-shift charging at 80% use: 2.7 years simple and 3.4 years discounted. The hub assumes a flat fee of BDT 250 per charge, which still needs regulatory confirmation.",
  },
  {
    key: "perkwp",
    label: "Cost per kWp",
    unit: "BDT lakh per kWp",
    a: [0.502, 0.659],
    b: [0.9, 1.3],
    aText: "0.50–0.66 lakh",
    bText: "0.90–1.30 lakh",
    note: "The plant cost Tk 50,204 per kWp under a real contract, and the whole hub with chargers Tk 65,933. The small hub wins on land, approvals and speed.",
  },
] as const;

export const TEN_YEAR = [60.18, 120.04, 179.58, 238.79, 297.65, 356.16, 414.31, 472.07, 529.45, 586.42].map((v, i) => ({ year: i + 1, cumulative: v }));

export const OPEX = [
  { k: "Grid electricity (two-shift, 78.7 MWh)", v: 8.94 },
  { k: "Staff and maintenance, charging side", v: 2.62 },
  { k: "Plant O&M (1% of equipment)", v: 1.25 },
];

export const EMS = [
  "Use solar first whenever it is available",
  "Fall back to grid power when solar runs short",
  "Cap how many chargers draw at once",
  "Set charging priority by operator rules",
  "Limit load during peak-demand hours",
  "Meter every charging point and the main incomer",
  "Log operating data and alarms",
  "Dispatch the 100 kW ESS after sunset",
];

export const BESS = [
  { phase: "In place", storage: "100 kW ESS", purpose: "Evening supply, peak cut and backup during outages" },
  { phase: "Pilot", storage: "20 swap packs", purpose: "Test driver acceptance and get a firm pack price" },
  { phase: "Grid", storage: "Net metering", purpose: "The grid as the store: NPV rises to BDT 4.33 crore" },
  { phase: "Later", storage: "More packs", purpose: "Only if packs reach about Tk 17,000 per kWh, near the ESS price" },
];

export const SCHEDULE = [
  { k: "Fee confirmation and ESS datasheet", d: "Month 1" },
  { k: "Measure bikes, chargers and driver schedules", d: "Months 1–2" },
  { k: "Hub design, protection and EMS rules", d: "Months 2–3" },
  { k: "Procurement and installation", d: "Months 4–5" },
  { k: "Commissioning and 20-bike pilot", d: "Month 6" },
  { k: "Ramp-up to 100 bikes with monitoring", d: "Months 7–12" },
];

/* ---------------------------------- Author ---------------------------------- */

export const AUTHOR = {
  name: "Asif Rabbi",
  role: "MSc researcher, Electrical & Electronic Engineering",
  bio: "Asif Rabbi studies how solar charging can serve Bangladesh's battery three-wheeler fleet. His MSc work at the University of Asia Pacific takes one station from Simulink model to working IoT prototype, through PVsyst economics and Monte Carlo risk, to a ten-category life cycle assessment.",
  tools: ["MATLAB Simulink", "PVsyst", "OpenLCA", "ThingSpeak", "ESP32", "Monte Carlo methods"],
  bibtex: `@mastersthesis{rabbi2026iot,
  title   = {Design, Techno-Economic Evaluation and Multi-Category Life Cycle Assessment of IoT-Enabled Solar Photovoltaic Battery Charging Stations in Bangladesh},
  author  = {Rabbi, Asif},
  school  = {University of Asia Pacific, Department of Electrical and Electronic Engineering},
  address = {Dhaka, Bangladesh},
  year    = {2026},
  type    = {M.Sc. Thesis}
}`,
};
