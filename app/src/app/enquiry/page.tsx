import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import EnquiryForm from "@/components/EnquiryForm";
import { getPublishedPackages, getPackageBySlugCms } from "@/lib/cmsDocuments";
import { getPackageCardImageForPackage } from "@/data/catalogue";
import { isEnquiryBackendConfigured } from "@/lib/enquiryConfig";
import { BRAND } from "@/data/brandConfig";

export const metadata: Metadata = {
  title: `Enquire — ${BRAND.name}`,
  description:
    `Send an enquiry about a journey from the ${BRAND.operatorName} brochure catalogue, or ask us to plan a tailor-made trip across India and Nepal.`,
};

export const instant = false;

interface EnquiryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EnquiryPage({ searchParams }: EnquiryPageProps) {
  const query = await searchParams;
  const rawSlug = typeof query.package === "string" ? query.package : null;

  // Resolve the requested journey server-side. An unknown slug is treated as a
  // tailor-made enquiry rather than a broken preselect.
  const publishedPackages = await getPublishedPackages();
  const preselected = rawSlug ? await getPackageBySlugCms(rawSlug) : undefined;

  const packageOptions = publishedPackages.map((pkg) => ({
    slug: pkg.slug,
    title: pkg.title,
    code: pkg.brochure_code,
    duration: pkg.duration,
    category: pkg.category,
    image: getPackageCardImageForPackage(pkg),
  }));

  const configured = isEnquiryBackendConfigured();

  return (
    <PageShell>
      <Container>
        <EnquiryForm
          packages={packageOptions}
          initialPackageSlug={preselected?.slug ?? null}
          configured={configured}
        />
      </Container>
    </PageShell>
  );
}
