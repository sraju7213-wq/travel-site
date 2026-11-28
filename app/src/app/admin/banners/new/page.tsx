export const instant = false;
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default function NewBanner() { return <div><h1 className="mb-5 font-serif text-3xl">Add promotional banner</h1><CreateCmsDocument type="banner" titleLabel="Banner title" redirectTo="/admin/banners/{id}" defaultData={{ description: "", image: "", ctaLabel: "", ctaHref: "", visible: true }} /></div>; }
