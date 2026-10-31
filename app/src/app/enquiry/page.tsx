import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import EnquiryForm from "@/components/EnquiryForm";
import { getAllPackages, getPackageBySlug } from "@/data/catalogue";

export const metadata: Metadata = {
  title: "Enquire — India Nepal Travel Organisation",
  description:
    "Send an enquiry about a journey from the India Nepal Travel brochure catalogue, or ask us to plan a tailor-made trip across India and Nepal.",
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
  const preselected = rawSlug ? getPackageBySlug(rawSlug) : undefined;

  const packageOptions = getAllPackages().map((pkg) => ({
    slug: pkg.slug,
    title: pkg.title,
    code: pkg.brochure_code,
    duration: pkg.duration,
    category: pkg.category,
  }));

  const configured = Boolean(process.env.ENQUIRY_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);

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
