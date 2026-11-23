/**
 * Licensed media. Photos are real, topic-relevant images from Wikimedia Commons, each used under the
 * licence named in `license` (attribution shown in the footer), plus the author's own project photos.
 * Video: Mixkit Free License.
 */

export type Photo = { src: string; alt: string; credit: string; source: string; license: string };

export const PHOTOS = {
  dhakaStreet: {
    src: "/media/easybikes-comilla-street.jpg",
    alt: "Battery-run three-wheelers, known as easy bikes, crowding a street in Comilla, Bangladesh",
    credit: "M. Tawsif Salam",
    source: "https://commons.wikimedia.org/wiki/File:Electric_trikes_overwhelm_Comilla_streets.jpg",
    license: "CC BY-SA 3.0",
  },
  dhakaAerial: {
    src: "/media/rooftop-solar-bashundhara-dhaka.jpg",
    alt: "Rooftop solar arrays among apartment buildings in Bashundhara, Dhaka",
    credit: "A S M Jobaer",
    source: "https://commons.wikimedia.org/wiki/File:Rooftop_solar_photovoltaic_array_and_apartment_buildings_in_Bashundhara_Residential_Area,_Dhaka.jpg",
    license: "CC BY-SA 4.0",
  },
  dhakaRain: {
    src: "/media/easybike-driver-dhaka.jpg",
    alt: "A woman driving a battery-run easy bike on a road in Dhaka",
    credit: "Ifteebd10",
    source: "https://commons.wikimedia.org/wiki/File:Female_rickshaw_driver_in_Dhaka.jpg",
    license: "CC BY-SA 4.0",
  },
  fieldArray: {
    src: "/media/rooftop-solar-industrial-bd.jpg",
    alt: "Rows of rooftop solar panels on a factory roof in Bangladesh",
    credit: "HokuroN",
    source: "https://commons.wikimedia.org/wiki/File:Hatil_rooftop_solar_panels.jpg",
    license: "CC BY-SA 4.0",
  },
  panelsSky: {
    src: "/media/solar-charging-station-ess.jpg",
    alt: "A solar charging station with battery storage, with electric two-wheelers parked under the panels",
    credit: "Krishna Subrahmanyam",
    source: "https://commons.wikimedia.org/wiki/File:MyAVERA_Solar_Charging_Station_with_ESS_02.jpg",
    license: "CC BY-SA 4.0",
  },
  panelsBlue: {
    src: "/media/solar-roof-building.jpg",
    alt: "A solar array mounted on the roof of a single-storey building",
    credit: "Helena Wright",
    source: "https://commons.wikimedia.org/wiki/File:Solar_building_(36816349445).jpg",
    license: "CC BY 2.0",
  },
  farmAerial: {
    src: "/media/solar-ev-charging-canopy.jpg",
    alt: "A solar canopy over electric vehicle chargers with battery storage cabinets",
    credit: "Raysonho @ Open Grid Scheduler",
    source: "https://commons.wikimedia.org/wiki/File:SolarPoweredEVCharging.jpg",
    license: "CC0",
  },
  connector: {
    src: "/media/solar-ev-charger-standalone.jpg",
    alt: "A standalone solar-powered electric vehicle charger in a parking lot",
    credit: "Michael Rivera",
    source: "https://commons.wikimedia.org/wiki/File:Solar_powered_charging_station,_Oak_St_parking_lot,_VSU.jpg",
    license: "CC BY-SA 4.0",
  },
  circuit: {
    src: "/media/prototype-hardware.jpg",
    alt: "The thesis laboratory prototype: solar module, battery, charge controller, sensors and ESP32 control unit",
    credit: "Asif Rabbi",
    source: "/downloads/thesis-draft.pdf",
    license: "Author's own",
  },
  chip: {
    src: "/media/thingspeak-dashboard.jpg",
    alt: "ThingSpeak dashboard of the station showing PV power, battery state of charge and a fire alarm indicator",
    credit: "Asif Rabbi",
    source: "/downloads/thesis-draft.pdf",
    license: "Author's own",
  },
  installHands: {
    src: "/media/easybikes-parked-khulna.jpg",
    alt: "A row of easy bikes parked along a road in Khulna, Bangladesh",
    credit: "TanvirSdq",
    source: "https://commons.wikimedia.org/wiki/File:Easy-bike_auto-rickshaws_parked_along_KUET%E2%80%93Fulbarigate_Road_Khulna.jpg",
    license: "CC BY-SA 4.0",
  },
  rooftop: {
    src: "/media/easybikes-market-khulna.jpg",
    alt: "Easy bikes and tomtoms waiting for passengers at a market junction in Khulna",
    credit: "TanvirSdq",
    source: "https://commons.wikimedia.org/wiki/File:Electric_easy_bikes_and_tomtoms_at_market_junction_Khulna.jpg",
    license: "CC BY-SA 4.0",
  },
  warehouse: {
    src: "/media/easybike-old-dhaka.jpg",
    alt: "A battery-run auto-rickshaw on a street in Old Dhaka",
    credit: "Wasiul Bahar",
    source: "https://commons.wikimedia.org/wiki/File:Auto_rickshaw_at_puran_dhaka.jpg",
    license: "CC BY-SA 4.0",
  },
  traffic: {
    src: "/media/e-rickshaws-traffic.jpg",
    alt: "Electric rickshaws carrying passengers in city traffic",
    credit: "N. Vivekananthamoorthy",
    source: "https://commons.wikimedia.org/wiki/File:E-Rickshaw-Aligarh-Uttar-Pradesh-India.jpg",
    license: "CC BY 4.0",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const VIDEOS = {
  hero: { src: "/media/hero-solar-aerial.mp4", poster: "/media/hero-solar-aerial-poster.jpg", credit: "Mixkit", source: "https://mixkit.co/free-stock-video/solar-panel/" },
  install: { src: "/media/solar-install.mp4", poster: "/media/solar-install-poster.jpg", credit: "Mixkit", source: "https://mixkit.co/free-stock-video/solar-panel/" },
};
