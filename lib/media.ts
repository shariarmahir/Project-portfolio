/**
 * Imagery. Every picture on the site is rendered from our own procedural 3D scene
 * (components/three/solar-scene.ts), so there are no third-party photos and no credits to carry.
 * The live hero and the inner-page bands draw the same scenes in real time.
 */
export const RENDERS = {
  hub: { src: "/media/renders/hub.webp", alt: "3D render of the 100-bike solar canopy in front of the factory roof plant at sunset" },
  plant: { src: "/media/renders/plant.webp", alt: "3D aerial render of the 250.48 kWp roof plant with the ESS container, the substation and the charging canopy" },
  rooftop: { src: "/media/renders/rooftop.webp", alt: "3D render of rows of tilted solar modules on a factory roof" },
  fleet: { src: "/media/renders/fleet.webp", alt: "3D render of Easy Bikes plugged into charging points under a solar canopy" },
  charger: { src: "/media/renders/charger.webp", alt: "3D render of an Easy Bike next to a metered charging point" },
  station: { src: "/media/renders/station.webp", alt: "3D render of the Case A station: a small solar canopy, a 30 kWh battery cabinet, an ESP32 mast and a live data panel" },
} as const;

export type RenderKey = keyof typeof RENDERS;
