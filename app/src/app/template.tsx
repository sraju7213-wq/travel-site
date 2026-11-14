import PageTransition from "@/components/ui/PageTransition";

/**
 * Root template — Next.js remounts this on every navigation, which gives
 * `PageTransition` a clean lifecycle to stage each page's entrance animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
