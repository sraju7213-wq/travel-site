import { draftMode } from "next/headers";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Cinzel, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/data/brandConfig";
import { getCmsSiteUrl, getCmsSettingsForMetadata, getCmsTheme, getCmsThemeForViewport } from "@/lib/cmsDocuments";
import { DEFAULT_CMS_THEME } from "@/lib/cmsDefaults";

const cormorant = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: "variable", style: ["normal", "italic"], display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"], weight: "variable", display: "swap" });
const cinzel = Cinzel({ variable: "--font-accent", subsets: ["latin"], weight: "variable", display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });
// Admin-only typeface, scoped through .cms-ui so public typography is unchanged.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false });

export const instant = false;


export async function generateMetadata(): Promise<Metadata> {
  "use cache";
  const settings = await getCmsSettingsForMetadata();
  const siteUrl = getCmsSiteUrl(settings);
  const name = settings.branding.name || BRAND.name;
  const description = settings.seo?.metaDescription || settings.footer.description || "Specialist travel across India and Nepal: tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats.";
  const socialImage = settings.seo?.socialImage || settings.branding.socialImage || undefined;
  return {
    metadataBase: siteUrl,
    title: { template: `%s | ${name}`, default: settings.seo?.title || `${name} — ${settings.branding.tagline ?? BRAND.tagline}` },
    description,
    openGraph: { siteName: settings.seo?.siteName || name, locale: settings.seo?.locale || "en_IN", type: "website", images: socialImage ? [socialImage] : undefined },
    icons: settings.branding.favicon ? { icon: settings.branding.favicon } : undefined,
    robots: { index: settings.seo?.noIndex !== true, follow: settings.seo?.noFollow !== true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const theme = await getCmsThemeForViewport();
  return { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: theme.colors.background };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: preview } = await draftMode();
  let theme = DEFAULT_CMS_THEME;
  try {
    theme = preview ? await getCmsTheme(true) : await getCmsThemeForViewport();
  } catch {
    // A stale preview cookie (for example after signing out) can leave draft
    // mode enabled without an administrator session. Fall back to the
    // published theme rather than failing the whole page.
    if (preview) {
      try { theme = await getCmsThemeForViewport(); } catch { theme = DEFAULT_CMS_THEME; }
    }
  }
  const colors = { ...DEFAULT_CMS_THEME.colors, ...theme.colors };
  const fontStacks: Record<string, string> = {
    sans: "var(--font-sans)",
    serif: "var(--font-serif)",
    display: "var(--font-accent)",
    inter: "var(--font-inter)",
    mono: "var(--font-mono)",
    system: "system-ui, sans-serif",
  };
  const fontFamily = (font: string | undefined, fallback: string) => (font ? fontStacks[font] ?? fallback : fallback);
  const style = {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--color-wild-orange": colors.accent,
    "--color-wild-orange-hover": colors.buttonHover,
    "--color-brass": colors.accent,
    "--color-brass-soft": colors.accent,
    "--color-forest": colors.primary,
    "--color-forest-soft": colors.secondary,
    "--color-wild-dark": colors.cardBackground,
    "--color-wild-darker": colors.background,
    "--color-wild-black": colors.background,
    "--cms-primary": colors.primary,
    "--cms-secondary": colors.secondary,
    "--cms-accent": colors.accent,
    "--cms-button-background": colors.buttonBackground,
    "--cms-button-text": colors.buttonText,
    "--cms-button-hover": colors.buttonHover,
    "--cms-card-background": colors.cardBackground,
    "--cms-header-background": colors.headerBackground,
    "--cms-footer-background": colors.footerBackground,
    "--cms-container-width": theme.containerWidth ?? DEFAULT_CMS_THEME.containerWidth,
    "--font-display": fontFamily(theme.typography.headingFont, "var(--font-serif)"),
    "--cms-body-font": fontFamily(theme.typography.bodyFont, "var(--font-sans)"),
    "--font-heading-size": theme.typography.headingSize ?? "3rem",
    "--cms-body-size": theme.typography.bodySize ?? "1rem",
    "--radius-card": theme.borderRadius?.card ?? "0.75rem",
    "--radius-button": theme.buttons?.style === "pill" ? "9999px" : theme.buttons?.style === "rounded" ? (theme.borderRadius?.button ?? "0.375rem") : (theme.borderRadius?.button ?? "0px"),
    "--radius-image": theme.borderRadius?.image ?? "0.5rem",
    "--cms-button-border-width": theme.buttons?.borderWidth ?? "1px",
  } as React.CSSProperties;
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable} ${cinzel.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`} style={style}>
      <body className="min-h-full flex flex-col selection:bg-brass selection:text-white" style={{ backgroundColor: colors.background, color: colors.foreground, fontSize: theme.typography.bodySize ?? undefined, fontFamily: fontFamily(theme.typography.bodyFont, "var(--font-sans)") }}>{children}</body>
    </html>
  );
}
