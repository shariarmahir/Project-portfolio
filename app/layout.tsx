import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SparkScrollbar } from "@/components/site/spark-scrollbar";
import { SkyBackdrop } from "@/components/site/sky";
import { MotionProvider } from "@/components/site/motion";
import { SunTrail } from "@/components/site/sun-trail";
import { TitleSweep } from "@/components/site/title-sweep";
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
    "Asif Rabbi's MSc thesis on solar charging for Bangladesh's Easy Bikes: an IoT-enabled 18 kWp station, a 98.4 kWp Satkhira system and a real 250.48 kWp plant supplying a 100-bike hub, with economics and life cycle assessment.",
  openGraph: {
    title: "SolarEV BD: solar charging for Bangladesh's Easy Bikes",
    description: "Three cases, from a 30 W prototype to a real 250 kWp plant and a 100-bike charging hub.",
    images: ["/media/renders/og.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#050B16", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-helios focus:px-5 focus:py-3 focus:text-navy-900"
        >
          Skip to content
        </a>
        <SkyBackdrop />
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SparkScrollbar />
          <SunTrail />
          <TitleSweep />
        </MotionProvider>
      </body>
    </html>
  );
}
