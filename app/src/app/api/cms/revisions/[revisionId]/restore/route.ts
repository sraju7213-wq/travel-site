import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { recordAudit, revalidateCms, sanitizeDocumentData, syncMediaReferences } from "@/lib/cmsServer";
import type { CmsDocumentType } from "@/types/cms";

export async function POST(_request: Request, context: { params: Promise<{ revisionId: string }> }) {
  try {
    const { supabase, user } = await requireCmsAdmin();
    const { revisionId } = await context.params;
    const { data: revision, error: revisionError } = await supabase
      .from("cms_document_revisions")
      .select("*")
      .eq("id", revisionId)
      .maybeSingle();
    if (revisionError) return Response.json({ error: revisionError.message }, { status: 500 });
    if (!revision) return Response.json({ error: "Revision not found." }, { status: 404 });

    const { data: current, error: currentError } = await supabase
      .from("cms_documents")
      .select("*")
      .eq("id", revision.document_id)
      .maybeSingle();
    if (currentError) return Response.json({ error: currentError.message }, { status: 500 });
    if (!current) return Response.json({ error: "Content not found." }, { status: 404 });

    const draftData = sanitizeDocumentData(revision.draft_data);
    const { data: updated, error } = await supabase
      .from("cms_documents")
      .update({
        title: revision.title,
        slug: revision.slug,
        draft_data: draftData,
        updated_by: user.id,
      })
      .eq("id", revision.document_id)
      .select("*")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 400 });

    await syncMediaReferences(supabase, revision.document_id, draftData, current.published_data);
    await recordAudit(supabase, user.id, "restore_revision", current.type, revision.document_id, {
      revisionId,
      revisionCreatedAt: revision.created_at,
    });
    revalidateCms(current.type as CmsDocumentType, `/pages/${revision.slug}`);
    return Response.json({ document: updated, message: "Previous version restored as a draft. Review and publish when ready." });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
