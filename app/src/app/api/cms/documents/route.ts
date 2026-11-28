import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { recordAudit, restrictClientData, revalidateCms, sanitizeDocumentData, slugify, syncMediaReferences, validDocumentType, validSlug } from "@/lib/cmsServer";

export async function GET(request: Request) {
  try {
    const { supabase, role } = await requireCmsAdmin();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    if (type === "theme" && role !== "developer") return Response.json({ error: "This content is available to developers only." }, { status: 403 });
    const status = searchParams.get("status");
    const queryText = searchParams.get("q")?.slice(0, 200);
    let query = supabase
      .from("cms_documents")
      .select("*")
      .order("updated_at", { ascending: false });

    if (validDocumentType(type)) query = query.eq("type", type);
    if (status && ["draft", "published", "unpublished", "archived"].includes(status)) query = query.eq("status", status);
    if (queryText) query = query.ilike("title", `%${queryText.replace(/[%_]/g, "")}%`);

    const { data, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ documents: data ?? [] });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user, role } = await requireCmsAdmin();
    const body = (await request.json()) as Record<string, unknown>;
    if (!validDocumentType(body.type)) return Response.json({ error: "Invalid content type." }, { status: 400 });
    if (body.type === "theme" && role !== "developer") return Response.json({ error: "Theme settings are available to developers only." }, { status: 403 });
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title || title.length > 300) return Response.json({ error: "A title between 1 and 300 characters is required." }, { status: 400 });
    const slug = typeof body.slug === "string" && body.slug ? slugify(body.slug) : slugify(title);
    if (!validSlug(slug)) return Response.json({ error: "A valid unique slug is required." }, { status: 400 });
    const data = restrictClientData(body.type, sanitizeDocumentData(body.data ?? {}), null, role === "developer");

    const { data: created, error } = await supabase
      .from("cms_documents")
      .insert({
        type: body.type,
        slug,
        title,
        status: "draft",
        draft_data: data,
        created_by: user.id,
        updated_by: user.id,
      })
      .select("*")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    await syncMediaReferences(supabase, created.id, data, null);
    await recordAudit(supabase, user.id, "create", body.type, created.id, { title, slug });
    revalidateCms(body.type, `/pages/${slug}`);
    return Response.json({ document: created }, { status: 201 });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
