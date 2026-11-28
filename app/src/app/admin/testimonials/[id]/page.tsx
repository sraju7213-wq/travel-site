export const instant = false;
import { notFound } from "next/navigation";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsCollectionDocumentEditor from "@/components/cms/CmsCollectionDocumentEditor";
import type { CmsStatus } from "@/types/cms";

export default async function EditTestimonial({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireCmsAdminPage(); const { data } = await supabase.from("cms_documents").select("*").eq("id", id).eq("type", "testimonial").maybeSingle(); if (!data) notFound(); return <CmsCollectionDocumentEditor kind="testimonial" document={{ id: data.id, slug: data.slug, title: data.title, status: data.status as CmsStatus, draft_data: data.draft_data, updated_at: data.updated_at, updated_by: data.updated_by }} />; }
