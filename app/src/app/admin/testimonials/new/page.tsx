export const instant = false;
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default function NewTestimonial() { return <div><h1 className="mb-5 font-serif text-3xl">Add a real client review</h1><CreateCmsDocument type="testimonial" titleLabel="Client name" redirectTo="/admin/testimonials/{id}" defaultData={{ name: "", quote: "", role: "", location: "", image: "", imageAlt: "", rating: null, visible: true }} /></div>; }
