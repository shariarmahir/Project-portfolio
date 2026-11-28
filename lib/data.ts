/**
 * Content for SolarEV BD. Every figure traces to a document in /solar-ev-bangladesh-all-data
 * (thesis draft, defense deck, journal manuscript, commercial proposal) or to the owner's brief.
 */

export const SITE = {
  name: "SolarEV BD",
  author: "Asif Rabbi",
  // TODO: placeholder: replace with the real contact address before publishing.
  email: "asifrabbi13@gmail.com",
  drive: "https://drive.google.com/drive/folders/1zkY81ClSO98ouG_aBT9E88WeQ_Pza7WD?usp=sharing",
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
};

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
    q: "Which system is stand-alone and which is grid-connected?",
    a: "Case A is a stand-alone station with 30 kWh of storage: its energy costs USD 0.20 per kWh, with a simple payback of 6.0 years and a discounted payback of 12.0 years. Case B and the Case C plant are grid-connected, so the grid does most of the balancing, and their energy costs Tk 3.72 to 5.49 per kWh, below the grid tariff of Tk 11.36.",
  },
  {
    q: "Was anything built?",
    a: "Yes. A 30 W laboratory prototype with an ESP32, a MAX17043 fuel gauge, a DS18B20 sensor and a SIM800L uplink demonstrated the sensing, the 80% state-of-charge control, the cloud link and the alarms on real hardware. It does not validate the rated power stage. The 250.48 kWp plant of Case C was built and commissioned in Satkhira on 9 September 2026.",
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
  { k: "Modules", v: "45 × 400 W" },
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

export const PROTOTYPE = [
  { k: "Peak charging current", v: "26.45 A" },
  { k: "SOC rise at peak", v: "0.243 % per minute" },
  { k: "Charge cap", v: "80% SOC" },
  { k: "Power drop begins", v: "above 25 °C" },
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
  bio: "Asif Rabbi studies how solar charging can serve Bangladesh's battery three-wheeler fleet. His M.Sc. work at the University of Asia Pacific follows solar charging through three cases, from a 30 W prototype to a real 250 kWp plant supplying a 100-bike hub.",
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
