/** Licensed media. Photos: Unsplash License. Video: Mixkit Free License. */

export type Photo = { src: string; alt: string; credit: string; source: string };

export const PHOTOS = {
  dhakaAerial: {
    src: "/media/dhaka-aerial.jpg",
    alt: "Dhaka from above, a canal running between dense neighbourhoods",
    credit: "MSI Sakib",
    source: "https://unsplash.com/photos/sJ4VPkOJKHk",
  },
  dhakaStreet: {
    src: "/media/dhaka-street-rickshaw.jpg",
    alt: "A busy street in Dhaka with pedestrians, old buildings and a rickshaw",
    credit: "Md. Ashraful Kabir",
    source: "https://unsplash.com/photos/9M1w0mP8CM8",
  },
  dhakaRain: {
    src: "/media/dhaka-rickshaw-rain.jpg",
    alt: "A rickshaw driver waiting in the rain in Dhaka",
    credit: "Shuvro Mojumder",
    source: "https://unsplash.com/photos/Yw6vRuw_FaM",
  },
  fieldArray: {
    src: "/media/solar-array-field.jpg",
    alt: "A ground-mounted solar array under a bright cloudy sky",
    credit: "American Public Power Association",
    source: "https://unsplash.com/photos/513dBrMJ_5w",
  },
  panelsSky: {
    src: "/media/solar-panels-sky.jpg",
    alt: "Rows of solar panels under a pale blue sky",
    credit: "Sasun Bughdaryan",
    source: "https://unsplash.com/photos/SFNUwmLEOis",
  },
  panelsBlue: {
    src: "/media/solar-array-blue.jpg",
    alt: "A tilted solar panel row against a clear blue sky",
    credit: "Chelsea",
    source: "https://unsplash.com/photos/WvusC5M-TM8",
  },
  farmAerial: {
    src: "/media/solar-farm-aerial.jpg",
    alt: "Aerial view of a solar farm laid across green fields",
    credit: "Andreas Gücklhorn",
    source: "https://unsplash.com/photos/Ilpf2eUPpUE",
  },
  connector: {
    src: "/media/ev-connector.jpg",
    alt: "A charging connector plugged into an electric vehicle",
    credit: "CHUTTERSNAP",
    source: "https://unsplash.com/photos/xJLsHl0hIik",
  },
  circuit: {
    src: "/media/circuit-board.jpg",
    alt: "Close-up of a blue circuit board with microcontrollers",
    credit: "Umberto",
    source: "https://unsplash.com/photos/jXd2FSvcRr8",
  },
  chip: {
    src: "/media/microchip-assembly.jpg",
    alt: "Tweezers placing a chip on a small green circuit board",
    credit: "Vishnu Mohanan",
    source: "https://unsplash.com/photos/zs4gtT8thO0",
  },
  installHands: {
    src: "/media/solar-install-hands.jpg",
    alt: "Gloved hands fitting a solar module",
    credit: "Ricardo Gomez Angel",
    source: "https://unsplash.com/photos/MagdWoazARo",
  },
  rooftop: {
    src: "/media/rooftop-solar-aerial.jpg",
    alt: "Aerial view of a rooftop covered in solar panels",
    credit: "Bernd Dittrich",
    source: "https://unsplash.com/photos/iDSXatl7yNo",
  },
  warehouse: {
    src: "/media/warehouse-solar-aerial.jpg",
    alt: "Aerial view of warehouses with solar panels across their roofs",
    credit: "Bernd Dittrich",
    source: "https://unsplash.com/photos/EEf7WskuysE",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const VIDEOS = {
  hero: { src: "/media/hero-solar-aerial.mp4", poster: "/media/hero-solar-aerial-poster.jpg", credit: "Mixkit", source: "https://mixkit.co/free-stock-video/solar-panel/" },
  install: { src: "/media/solar-install.mp4", poster: "/media/solar-install-poster.jpg", credit: "Mixkit", source: "https://mixkit.co/free-stock-video/solar-panel/" },
};
