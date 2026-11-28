import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import PageShell from "@/components/PageShell";
import { hasCmsSections, renderCmsBuiltIn, getCmsBuiltIn } from "@/components/cms/CmsBuiltInPage";

export const metadata: Metadata = { title: "Terms and conditions", description: "Website terms and conditions." };

export default async function TermsPage() { const { isEnabled: preview } = await draftMode(); const page = await getCmsBuiltIn("terms", preview); if (!page || !hasCmsSections(page, preview)) notFound(); return <PageShell mainClassName="">{await renderCmsBuiltIn(page, preview)}</PageShell>; }
