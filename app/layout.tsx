import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import "./globals.css";

// Self-hosted (SIL OFL, see app/fonts/OFL-LICENSE.txt) so the build never depends on
// reaching Google Fonts — a failed fetch there breaks Vercel builds.
const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: { default: "SolarEV BD | Solar charging for Bangladesh's Easy Bikes", template: "%s | SolarEV BD" },
  description:
    "Asif Rabbi's MSc thesis on IoT-enabled solar PV battery charging stations for Bangladesh: design, prototype, PVsyst economics, Monte Carlo risk and a ReCiPe 2016 life cycle assessment.",
  openGraph: {
    title: "SolarEV BD: solar charging for Bangladesh's Easy Bikes",
    description: "An MSc thesis that designs, builds, prices and life-cycle-tests an IoT solar charging station.",
    images: ["/media/hero-solar-aerial-poster.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#F8FAFC", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
