import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        tint: { DEFAULT: "#E7EDF5", 2: "#D5E0EE" },
        line: "#D9E1EC",
        ink: "#0F172A",
        body: "#334155",
        muted: "#5B6B80",
        navy: { DEFAULT: "#0A2540", 600: "#123459", 900: "#06182B" },
        cobalt: { DEFAULT: "#1D4ED8", 50: "#EEF3FF", 100: "#DCE6FE", 300: "#93AEF7", 700: "#1A40B0" },
        helios: { DEFAULT: "#F59E0B", 100: "#FEEFC7", 600: "#D97706" },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
        code: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      borderRadius: { panel: "24px", slab: "40px" },
      boxShadow: {
        float: "0 6px 18px -8px rgba(10,37,64,0.28)",
        header: "0 10px 30px -24px rgba(10,37,64,0.45)",
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
