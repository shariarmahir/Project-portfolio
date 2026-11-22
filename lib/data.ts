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
    kicker: "Thesis core",
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
    kicker: "Recommended deployment",
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
    kicker: "Commercial proposal",
    title: "300 kWp hub for 100 Easy Bikes",
    body: "A depot-scale plant: 484 Tier-1 modules, six 50 kW inverters and a smart energy management system that splits 100 metered charging points across two zones.",
    points: ["CAPEX BDT 2.27 crore", "BDT 71.75 lakh net operating profit a year", "Simple payback 3.16 years at full use"],
    images: ["farmAerial", "fieldArray", "connector"],
    theme: "white",
    href: "/commercial",
    cta: "See the 300 kWp model",
  },
] as const;

export const HOW_IT_WORKS = [
  { title: "Generate", body: "400 W modules feed a buck-boost converter; perturb-and-observe MPPT holds the array at its maximum power point." },
  { title: "Store and watch", body: "A lithium pack charges to an 80% cap while an ESP32 streams SOC, current and temperature to ThingSpeak." },
  { title: "Charge the fleet", body: "Bikes draw from the pack and the panels, and a fire alarm with email alerts guards the station overnight." },
];

export const TICKER = ["MATLAB Simulink", "PVsyst", "ThingSpeak", "ESP32", "MPPT", "Monte Carlo", "ReCiPe 2016", "OpenLCA", "SREDA", "BERC", "LiFePO4"];

/** Findings written as sentences (home evidence band). */
export const FINDINGS = [
  "Across 3,000 Monte Carlo runs the station's IRR stays between 12.71% and 16.96%.",
  "Even the 95% lower bound of NPV, $6,405, stays above zero.",
  "Formal battery recovery cuts lifecycle emissions by 8,793 kgCO₂eq, or 26.8%.",
  "Each kWh delivered carries 0.0558 kgCO₂eq, 11.1 times less than the national grid.",
  "The station repays its manufacturing carbon in 1.5 to 2 years.",
  "Over its lifecycle it emits 7,764 kg CO₂eq, against 21,510 kg a year from coal for the same energy.",
];

export const FAQ = [
  {
    q: "Where do the numbers come from?",
    a: "Station performance and economics come from PVsyst simulation of the 18 kWp design, tested over 3,000 Monte Carlo iterations. Environmental results come from an OpenLCA model using ReCiPe 2016 Midpoint (H) over 30,000 iterations. The 300 kWp figures come from the commercial proposal and are pre-feasibility estimates.",
  },
  {
    q: "Why Easy Bikes and not cars?",
    a: "Battery three-wheelers are Bangladesh's largest electric fleet by far, and most charge at night on informal connections. That is where solar charging relieves the grid the most.",
  },
  {
    q: "Is the station off-grid or grid-tied?",
    a: "The thesis evaluates the station as an off-grid baseline (LCOE $0.17/kWh, payback about 9 years). The recommended deployment is the same station net-metered, which removes the daytime spillage and brings payback to 5.5–6 years.",
  },
  {
    q: "Was anything built?",
    a: "Yes. A 30 W laboratory prototype with an ESP32, a MAX17043 fuel gauge, ACS712 and DS18B20 sensors and a SIM800L uplink validated the control logic and telemetry during a 72-hour bench run.",
  },
  {
    q: "Are the commercial returns guaranteed?",
    a: "No. The 300 kWp payback of 3.16 years assumes all 100 points are used every day. The proposal itself notes payback can stretch to 5–10 years at lower use. A bankable study needs a site survey and measured load.",
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
  { k: "Annual revenue", v: "5,975 USD" },
  { k: "O&M cost", v: "1,570 USD/yr" },
  { k: "Net annual profit", v: "4,405 USD" },
  { k: "Total investment", v: "≈ 23,670 USD" },
  { k: "LCOE", v: "0.17 USD/kWh" },
  { k: "NPV", v: "14,024.42 USD" },
  { k: "IRR", v: "14.87%" },
  { k: "ROI", v: "88.66%" },
  { k: "Payback", v: "9 years" },
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
    { key: "npv", label: "NPV", mean: 14328.95, lo: 6405.4, hi: 23798.38, fmt: "usd" },
    { key: "irr", label: "IRR", mean: 14.87, lo: 12.71, hi: 16.96, fmt: "pct" },
    { key: "roi", label: "ROI", mean: 89.0, lo: 69.82, hi: 109.77, fmt: "pct" },
    { key: "lcoe", label: "LCOE", mean: 0.1704, lo: 0.1487, hi: 0.1925, fmt: "usdkwh" },
    { key: "payback", label: "Payback", mean: 8.87, lo: 8, hi: 10, fmt: "yrs" },
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
  name: "300 kWp hub",
  sub: "100 Easy Bikes, one depot",
  bestFor: "Bus terminals, transit depots and dense urban operators with land and a transformer to spare.",
  system: [
    { k: "PV array", v: "300.08 kWp" },
    { k: "Modules", v: "484 × 620 Wp Tier-1" },
    { k: "Inverters", v: "6 × 50 kW (or 3 × 100 kW)" },
    { k: "Transformer", v: "400–500 kVA, preliminary" },
    { k: "Charging points", v: "100, in two zones of 50" },
    { k: "Daily demand", v: "1,000 kWh (10 kWh per bike)" },
    { k: "Solar yield", v: "1,100–1,500 kWh/day, indicative" },
    { k: "Delivery", v: "30–60 days after site readiness" },
  ],
  money: [
    { k: "CAPEX", v: "BDT 2.27 crore" },
    { k: "Gross revenue", v: "BDT 91.25 lakh/yr" },
    { k: "Operating cost", v: "BDT 19.50 lakh/yr" },
    { k: "Net operating profit", v: "BDT 71.75 lakh/yr" },
    { k: "Simple payback", v: "3.16 years" },
    { k: "10-year ROI", v: "≈ 216%" },
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
    { k: "Net annual profit", v: "$4,405" },
    { k: "Payback", v: "5.5–6 years" },
  ],
};

export const COMPARE = [
  {
    key: "capex",
    label: "Capital cost",
    unit: "BDT lakh",
    a: [227, 227],
    b: [18, 26],
    aText: "BDT 227 lakh",
    bText: "BDT 18–26 lakh",
    note: "The capital for one 300 kWp hub builds nine to twelve net-metered hubs.",
  },
  {
    key: "lcoe",
    label: "Energy cost",
    unit: "BDT per kWh",
    a: [7.7, 7.7],
    b: [7.15, 7.15],
    aText: "Grid backup at BDT 7.70",
    bText: "BDT 7.15",
    note: "The net-metered hub generates below the BERC tariff; the mega-hub buys its backup energy at it.",
  },
  {
    key: "payback",
    label: "Payback",
    unit: "years",
    a: [3.16, 3.16],
    b: [5.5, 6],
    aText: "3.16 years at full use",
    bText: "5.5–6 years",
    note: "The 3.16-year figure assumes every one of 100 points is used daily. At lower use the proposal expects 5–10 years.",
  },
  {
    key: "perkwp",
    label: "Cost per kWp",
    unit: "BDT lakh per kWp",
    a: [0.757, 0.757],
    b: [0.9, 1.3],
    aText: "0.76 lakh",
    bText: "0.90–1.30 lakh",
    note: "Scale makes the mega-hub cheaper per kWp; the distributed hub wins on land, approvals and speed.",
  },
] as const;

export const TEN_YEAR = Array.from({ length: 10 }, (_, i) => ({ year: i + 1, cumulative: +(71.75 * (i + 1)).toFixed(2) }));

export const OPEX = [
  { k: "Grid electricity and backup", v: 15.0 },
  { k: "Staff and management", v: 2.5 },
  { k: "Maintenance", v: 1.0 },
  { k: "Miscellaneous", v: 1.0 },
];

export const EMS = [
  "Use solar first whenever it is available",
  "Fall back to grid power when solar runs short",
  "Cap how many chargers draw at once",
  "Set charging priority by operator rules",
  "Limit load during peak-demand hours",
  "Meter every charging point and the main incomer",
  "Log operating data and alarms",
  "Leave room for battery storage later",
];

export const BESS = [
  { phase: "Phase 1", storage: "No battery", purpose: "Solar and grid charging, 100 points, EMS" },
  { phase: "Phase 2", storage: "200 kWh", purpose: "Peak shaving and some evening support" },
  { phase: "Phase 3", storage: "500 kWh", purpose: "More energy shifting and demand control" },
  { phase: "Later", storage: "Up to 1 MWh", purpose: "After load and financial review" },
];

export const SCHEDULE = [
  { k: "Site survey and preliminary engineering", d: "7–10 days" },
  { k: "Detailed design and approvals", d: "≈ 7 days" },
  { k: "Material procurement", d: "15–30 days" },
  { k: "Mounting structures", d: "15–20 days" },
  { k: "Solar modules", d: "10–15 days" },
  { k: "Electrical installation", d: "10–15 days" },
  { k: "Charging infrastructure", d: "10–15 days" },
  { k: "Testing and commissioning", d: "3–5 days" },
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
