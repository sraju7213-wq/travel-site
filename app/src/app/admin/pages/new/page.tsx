export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default async function NewPage() { const { role } = await requireCmsAdminPage(); return <div><h1 className="mb-5 font-serif text-3xl">Create website page</h1><CreateCmsDocument type="page" titleLabel="Page title" redirectTo="/admin/pages/{id}" defaultData={{ sections: [], seo: {}, template: "default", parentSlug: "", publicPath: "" }} developer={role === "developer"} /></div>; }
