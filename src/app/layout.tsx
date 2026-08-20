import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Curtain from "@/components/ui/Curtain";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "The Crossing — A Journey in Eight Scenes",
  description:
    "An interactive cinematic experience about space, distance and the way home. Scroll to push through the hatch.",
  keywords: ["space", "astronomy", "universe", "cinematic", "interactive film"],
  openGraph: {
    title: "The Crossing — A Journey in Eight Scenes",
    description:
      "An interactive cinematic experience about space, distance and the way home.",
    type: "website",
    images: [{ url: "/media/hatch-4k.jpg", width: 3840, height: 2160 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Only script can lift the curtain, so without script there is none. */}
        <noscript>
          <style>{`.curtain{display:none}`}</style>
        </noscript>
        <Curtain />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
