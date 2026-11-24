import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cinzel, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/data/brandConfig";
import { THEME_SCRIPT } from "@/lib/theme";

// Variable faces cover every weight the design uses in a single file each.
// Static weights previously generated ~21 WOFF2 files (all preloaded) on every
// page; the variable files are one request per family (two for the serif, since
// italic is used) and they remove the FOUT cascade between weight variants.
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Mono is only used on a handful of labels — let CSS request it when needed
  // instead of spending a preload slot on every route.
  preload: false,
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${BRAND.name}`,
    default: `${BRAND.name} — ${BRAND.tagline}`,
  },
  description:
    "Specialist travel across India and Nepal: tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats.",
  openGraph: {
    siteName: BRAND.name,
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0C1617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} ${cinzel.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint so the saved/system theme is applied without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#0C1617] text-[#F5F2EB] selection:bg-brass selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
