import { BRAND } from "@/data/brandConfig";
import type { CmsSettings, CmsTheme } from "@/types/cms";

export const DEFAULT_CMS_SETTINGS: CmsSettings = {
  branding: {
    name: BRAND.name,
    operatorName: BRAND.operatorName,
    tagline: BRAND.tagline,
    headerLogo: "/logo.png",
    footerLogo: "/logo.png",
    headerLogoAlt: BRAND.name,
    footerLogoAlt: BRAND.name,
    socialImage: "",
  },
  contact: {
    phoneMobile: BRAND.bookingOffice.phoneMobile,
    phoneLandline: BRAND.bookingOffice.phoneLandline,
    email: BRAND.bookingOffice.email,
    alternateEmail: BRAND.bookingOffice.altEmail,
    address: BRAND.bookingOffice.address,
    bookingDeskName: BRAND.bookingOffice.name,
    whatsapp: "",
    hours: "",
    mapUrl: "",
  },
  social: [],
  navigation: { headerLinks: [], groups: [], footerColumns: [], drawerUtilityLinks: [] },
  footer: {
    description: `${BRAND.name} presents expeditions in association with ${BRAND.operatorName}.`,
    copyright: `© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.`,
    credit: "",
    creditHref: "",
    showSocial: true,
    visible: true,
  },
  announcement: { visible: false, text: "", href: "", ctaLabel: "" },
  trustBadges: [],
  seo: { siteName: BRAND.name, siteUrl: "", locale: "en_IN", title: "", metaDescription: "" },
  siteUrl: "",
};

export const DEFAULT_CMS_THEME: CmsTheme = {
  preset: "established",
  colors: {
    primary: "#16271A",
    secondary: "#1F3A2E",
    accent: "#D49368",
    background: "#0C1617",
    foreground: "#F5F2EB",
    cardBackground: "#132325",
    cardBorder: "rgba(255,255,255,0.10)",
    buttonBackground: "#D49368",
    buttonText: "#0C1617",
    buttonHover: "#BD7950",
    headerBackground: "#0C1617",
    footerBackground: "#0C1617",
  },
  typography: { headingFont: "serif", bodyFont: "sans", headingSize: "3rem", bodySize: "1rem" },
  buttons: { style: "square", borderWidth: "1px" },
  borderRadius: { card: "0.75rem", button: "0px", image: "0.5rem" },
  cardStyle: "bordered",
  containerWidth: "1240px",
  headerAppearance: { sticky: true, transparent: true },
  footerAppearance: {},
};

export const THEME_PRESETS: Array<{ id: string; name: string; description: string; values: Partial<CmsTheme> }> = [
  { id: "established", name: "Established Heritage", description: "Deep forest, warm accent and editorial typography.", values: DEFAULT_CMS_THEME },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Light surfaces, restrained accents and compact cards.",
    values: { preset: "modern", colors: { ...DEFAULT_CMS_THEME.colors, primary: "#16271A", accent: "#B18A51", background: "#F6F2E9", foreground: "#252824", cardBackground: "#FFFFFF", headerBackground: "#FFFFFF", footerBackground: "#252824", buttonBackground: "#16271A", buttonText: "#FFFFFF" }, borderRadius: { card: "0.5rem", button: "0.375rem", image: "0.5rem" } },
  },
  {
    id: "luxury",
    name: "Luxury Editorial",
    description: "Dark cinematic sections with fine lines and large serif headings.",
    values: { preset: "luxury", colors: { ...DEFAULT_CMS_THEME.colors, primary: "#11191F", accent: "#E5B99B", background: "#080D11", foreground: "#F3EEE5", cardBackground: "#11191F", headerBackground: "#080D11", footerBackground: "#080D11", buttonBackground: "#E5B99B", buttonText: "#080D11" }, borderRadius: { card: "0", button: "0", image: "0" } },
  },
];
