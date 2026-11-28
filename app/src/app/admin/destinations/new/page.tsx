export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default async function NewDestinationPage() {
  const { role } = await requireCmsAdminPage();
  return <div><h1 className="mb-5 font-serif text-3xl">Add Destination</h1><CreateCmsDocument type="destination" titleLabel="Destination name" redirectTo="/admin/destinations/{id}" defaultData={{ name: "", tagline: "", shortDescription: "", description: "", region: "", country: "", parentSlug: null, heroImage: "", image: "", imageAlt: "", focalPoint: { x: 0.5, y: 0.5 }, gallery: [], highlights: [], relatedPackages: [], location: {}, featured: false, seo: {} }} developer={role === "developer"} /></div>;
}
