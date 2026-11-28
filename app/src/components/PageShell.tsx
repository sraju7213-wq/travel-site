import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PromotionalAnnouncement from "@/components/cms/PromotionalAnnouncement";
import { CmsProvider } from "@/components/cms/CmsProvider";
import { getCmsTheme, getPublishedDestinations, getPublishedPackages, getSiteSettings } from "@/lib/cmsDocuments";

interface PageShellProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export default async function PageShell({ children, mainClassName }: PageShellProps) {
  const [settings, packages, destinations, theme] = await Promise.all([getSiteSettings(), getPublishedPackages(), getPublishedDestinations(), getCmsTheme()]);
  return (
    <CmsProvider value={{ settings, packages, destinations, theme }}>
      <div className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-brass selection:text-white">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-forest focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-white">Skip to content</a>
        <PromotionalAnnouncement />
        <SiteHeader />
        <main id="main" className={`flex-1 ${mainClassName ?? "pt-[76px] md:pt-[92px]"}`}>{children}</main>
        <SiteFooter />
      </div>
    </CmsProvider>
  );
}
