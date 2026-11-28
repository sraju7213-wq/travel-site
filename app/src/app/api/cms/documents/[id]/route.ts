import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { publicPathForDocument, recordAudit, restrictClientData, revalidateCms, sanitizeDocumentData, slugify, syncMediaReferences, validSlug } from "@/lib/cmsServer";
import type { CmsDocumentType } from "@/types/cms";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, role } = await requireCmsAdmin();
    const { id } = await context.params;
    const { data, error } = await supabase.from("cms_documents").select("*").eq("id", id).maybeSingle();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!data) return Response.json({ error: "Content not found." }, { status: 404 });
    if (data.type === "theme" && role !== "developer") return Response.json({ error: "This content is available to developers only." }, { status: 403 });
    return Response.json({ document: data });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user, role } = await requireCmsAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const { data: current, error: readError } = await supabase.from("cms_documents").select("*").eq("id", id).maybeSingle();
    if (readError) return Response.json({ error: readError.message }, { status: 500 });
    if (!current) return Response.json({ error: "Content not found." }, { status: 404 });
    if (current.type === "theme" && role !== "developer") return Response.json({ error: "Theme settings are available to developers only." }, { status: 403 });

    const title = typeof body.title === "string" ? body.title.trim() : current.title;
    if (!title || title.length > 300) return Response.json({ error: "A title between 1 and 300 characters is required." }, { status: 400 });
    const slug = role === "developer" && typeof body.slug === "string" ? slugify(body.slug) : current.slug;
    if (!validSlug(slug)) return Response.json({ error: "A valid unique slug is required." }, { status: 400 });

    const savedDraft = (current.draft_data ?? {}) as Record<string, unknown>;
    const incoming = body.data === undefined ? savedDraft : sanitizeDocumentData(body.data);
    const data = restrictClientData(current.type, incoming, savedDraft, role === "developer");
    data.title = title;
    data.slug = slug;
    if (current.type === "package") data.name = title;

    const { data: updated, error } = await supabase
      .from("cms_documents")
      .update({
        title,
        slug,
        draft_data: data,
        sort_order: typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder) ? body.sortOrder : current.sort_order,
        updated_by: user.id,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    await syncMediaReferences(supabase, id, data, current.published_data);
    await recordAudit(supabase, user.id, "save_draft", current.type, id, {
      title,
      slug,
      previousSlug: current.slug,
    });
    revalidateCms(current.type as CmsDocumentType, publicPathForDocument(current.type as CmsDocumentType, slug, data));
    return Response.json({ document: updated });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user, role } = await requireCmsAdmin();
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { confirm?: boolean };
    if (body.confirm !== true) return Response.json({ error: "Explicit deletion confirmation is required." }, { status: 400 });

    const { data: current, error: readError } = await supabase.from("cms_documents").select("*").eq("id", id).maybeSingle();
    if (readError) return Response.json({ error: readError.message }, { status: 500 });
    if (!current) return Response.json({ error: "Content not found." }, { status: 404 });
    if (current.type === "theme" && role !== "developer") return Response.json({ error: "Theme settings are available to developers only." }, { status: 403 });

    const { error } = await supabase.from("cms_documents").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });

    await recordAudit(supabase, user.id, "delete", current.type, id, {
      title: current.title,
      slug: current.slug,
      snapshot: current,
    });
    revalidateCms(current.type as CmsDocumentType, publicPathForDocument(current.type as CmsDocumentType, current.slug, current.draft_data));
    return Response.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
