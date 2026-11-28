/**
 * Charging points on the map.
 *
 * THESIS: the two sites of the three cases. Satkhira is shown at the town of Satkhira Sadar only;
 * the exact plant location is kept private under the owner's confidentiality clause.
 *
 * OSM: every charging station mapped in Bangladesh on OpenStreetMap (amenity=charging_station),
 * retrieved 28 November 2026 through the Overpass API. Data © OpenStreetMap contributors, ODbL.
 */
export type Point = {
  id: string;
  lat: number;
  lon: number;
  name: string;
  place: string;
  note: string;
  kind: "thesis" | "osm";
};

export const THESIS_POINTS: Point[] = [
  {
    id: "satkhira",
    lat: 22.7185,
    lon: 89.0705,
    name: "Case C plant and 100-bike hub",
    place: "Satkhira Sadar",
    note: "250.48 kWp, 100 kW ESS, 250 kVA substation, commissioned 9 Sep 2026. Case B models the same Satkhira resource (98.4 kWp in PVsyst).",
    kind: "thesis",
  },
  {
    id: "farmgate",
    lat: 23.758,
    lon: 90.39,
    name: "Case A IoT station",
    place: "Farmgate, Dhaka",
    note: "18 kWp, 30 kWh station design with a 30 W prototype and live ThingSpeak data.",
    kind: "thesis",
  },
];

export const OSM_POINTS: Point[] = [
  { id: "node/14352120682", lat: 23.75558, lon: 90.40054, name: "ChargePoint", place: "Tejgaon, Dhaka", note: "Mapped as an e-rickshaw and battery rickshaw charging point, paid.", kind: "osm" },
  { id: "node/4388864058", lat: 23.76369, lon: 90.42826, name: "National Ideal School and College", place: "Rampura, Dhaka", note: "Charging point mapped at the school.", kind: "osm" },
  { id: "node/4583633894", lat: 23.80309, lon: 90.3575, name: "Quantum Foundation", place: "Mirpur, Dhaka", note: "Charging point operated by the foundation.", kind: "osm" },
  { id: "node/5175880646", lat: 24.03516, lon: 90.83224, name: "Belabo CNG Stand", place: "Belabo, Narsingdi", note: "Charging point at a three-wheeler stand.", kind: "osm" },
  { id: "way/1330826427", lat: 23.1534, lon: 91.32411, name: "Ekhon Charge", place: "Comilla", note: "Paid charging station.", kind: "osm" },
  { id: "node/2303633832", lat: 24.93024, lon: 89.94832, name: "Charging point", place: "Jamalpur", note: "Unnamed charging point.", kind: "osm" },
  { id: "node/3808086236", lat: 23.04034, lon: 89.63145, name: "Mike Service", place: "Kalia, Narail", note: "Charging point at a service shop.", kind: "osm" },
];
