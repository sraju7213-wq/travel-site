import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

interface PageShellProps {
  children: React.ReactNode;
  /**
   * Overrides the space reserved for the fixed header. Pages with a full-bleed hero pass
   * an empty string so the hero can run under the transparent header.
   */
  mainClassName?: string;
}

export default function PageShell({ children, mainClassName }: PageShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-ivory text-charcoal">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-forest focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className={`flex-1 ${mainClassName ?? "pt-[76px] md:pt-[92px]"}`}>
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
