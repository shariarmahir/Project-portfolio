import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * "Solar night" glass theme: a deep night sky, frosted glass panels and one sun-amber accent.
 * Token names are kept from the earlier light theme so every component reads the new palette.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        canvas: "#050B16",
        surface: "#0B1526",
        tint: { DEFAULT: "#0E1A2E", 2: "#14233B" },
        line: "#22324B",
        ink: "#F2F6FC",
        body: "#C5D0DF",
        muted: "#8F9FB7",
        navy: { DEFAULT: "#0A2540", 600: "#123459", 900: "#04101F" },
        cobalt: { DEFAULT: "#4F86F7", 50: "#EEF3FF", 100: "#DCE6FE", 300: "#93AEF7", 700: "#1D4ED8" },
        helios: { DEFAULT: "#F59E0B", 100: "#FEEFC7", 300: "#FCD34D", 600: "#D97706" },
        leaf: { DEFAULT: "#34D399", 600: "#059669" },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
        code: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      borderRadius: { panel: "24px", slab: "36px" },
      boxShadow: {
        float: "0 18px 40px -20px rgba(0,0,0,0.65)",
        header: "0 10px 30px -18px rgba(0,0,0,0.7)",
        glass: "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 24px 60px -30px rgba(0,0,0,0.8)",
      },
      letterSpacing: { display: "-0.04em", snug: "-0.02em" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 48s linear infinite" },
    },
  },
  plugins: [animate],
};
export default config;
