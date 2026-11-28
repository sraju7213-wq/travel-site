import { randomUUID } from "crypto";
import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { publicPathForDocument, recordAudit, revalidateCms, slugify, syncMediaReferences, validSlug } from "@/lib/cmsServer";
import type { CmsDocumentType, CmsStatus } from "@/types/cms";

const PUBLISHED_PATH_TYPES = new Set<CmsDocumentType>(["package", "destination", "page", "homepage"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user, role } = await requireCmsAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as { action?: string; createRedirect?: boolean };
    const action = body.action ?? "";
    const { data: current, error: readError } = await supabase.from("cms_documents").select("*").eq("id", id).maybeSingle();
    if (readError) return Response.json({ error: readError.message }, { status: 500 });
    if (!current) return Response.json({ error: "Content not found." }, { status: 404 });
    if (current.type === "theme" && role !== "developer") return Response.json({ error: "Theme settings are available to developers only." }, { status: 403 });
    const type = current.type as CmsDocumentType;

    if (action === "duplicate") {
      const copySlug = slugify(`${current.slug}-copy-${randomUUID().slice(0, 8)}`);
      const draftData = { ...(current.draft_data ?? {}), title: `${current.title} (Copy)`, slug: copySlug };
      const { data: copy, error } = await supabase
        .from("cms_documents")
        .insert({
          type,
          slug: copySlug,
          title: `${current.title} (Copy)`,
          status: "draft",
          draft_data: draftData,
          published_data: null,
          published_slug: null,
          sort_order: current.sort_order,
          created_by: user.id,
          updated_by: user.id,
        })
        .select("*")
        .single();
      if (error) return Response.json({ error: error.message }, { status: 400 });
      await syncMediaReferences(supabase, copy.id, draftData, null);
      await recordAudit(supabase, user.id, "duplicate", type, copy.id, { sourceId: id, sourceSlug: current.slug });
      revalidateCms(type, `/pages/${copySlug}`);
      return Response.json({ document: copy }, { status: 201 });
    }

    if (action === "publish") {
      const newSlug = current.slug;
      const draftData = { ...(current.draft_data ?? {}), slug: newSlug };
      const publishedData = current.published_data ?? {};
      const previousSlug = current.published_slug ?? current.slug;
      const oldPath = current.status === "published"
        ? publicPathForDocument(type, previousSlug, publishedData, publishedData)
        : null;
      const newPath = publicPathForDocument(type, newSlug, draftData, publishedData);

      let shouldCreateRedirect = false;
      if (
        PUBLISHED_PATH_TYPES.has(type) &&
        current.status === "published" &&
        oldPath &&
        newPath &&
        oldPath !== newPath
      ) {
        if (body.createRedirect === undefined) {
          return Response.json({
            error: "This published URL is changing. Choose whether to create a redirect from the previous URL.",
            code: "redirect_required",
            oldPath,
            newPath,
          }, { status: 409 });
        }
        shouldCreateRedirect = body.createRedirect === true;
      }

      if (!validSlug(newSlug)) return Response.json({ error: "Invalid slug." }, { status: 400 });
      const { data: updated, error } = await supabase
        .from("cms_documents")
        .update({
          status: "published" satisfies CmsStatus,
          draft_data: draftData,
          published_data: draftData,
          published_slug: newSlug,
          published_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("id", id)
        .select("*")
        .single();
      if (error) return Response.json({ error: error.message }, { status: 400 });

      if (shouldCreateRedirect && oldPath && newPath) {
        const { error: redirectError } = await supabase.from("cms_redirects").upsert({
          source_path: oldPath,
          destination_path: newPath,
          status_code: 301,
          is_active: true,
          created_by: user.id,
        }, { onConflict: "source_path" });
        if (redirectError) throw new Error(`Published content but redirect creation failed: ${redirectError.message}`);
      }

      await syncMediaReferences(supabase, id, draftData, draftData);
      await recordAudit(supabase, user.id, "publish", type, id, { oldPath, newPath, createdRedirect: shouldCreateRedirect });
      revalidateCms(type, oldPath, newPath);
      return Response.json({ document: updated });
    }

    let status: CmsStatus;
    let auditAction: string;
    switch (action) {
      case "unpublish": status = "unpublished"; auditAction = "unpublish"; break;
      case "archive": status = "archived"; auditAction = "archive"; break;
      case "restore_archive":
      case "restore": status = current.status === "archived" ? "unpublished" : "draft"; auditAction = "restore"; break;
      case "save_draft": status = "draft"; auditAction = "save_draft"; break;
      default: return Response.json({ error: "Unknown content action." }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("cms_documents")
      .update({ status, updated_by: user.id })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 400 });

    await syncMediaReferences(supabase, id, updated.draft_data, updated.published_data);
    await recordAudit(supabase, user.id, auditAction, type, id, { previousStatus: current.status, status });
    revalidateCms(type, publicPathForDocument(type, current.published_slug ?? current.slug, current.draft_data, current.published_data ?? {}));
    return Response.json({ document: updated });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
