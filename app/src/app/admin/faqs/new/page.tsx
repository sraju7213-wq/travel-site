export const instant = false;
import CreateCmsDocument from "@/components/cms/CreateCmsDocument";

export default function NewFaq() { return <div><h1 className="mb-5 font-serif text-3xl">Add FAQ</h1><CreateCmsDocument type="faq" titleLabel="Question" redirectTo="/admin/faqs/{id}" defaultData={{ question: "", answer: "", category: "", visible: true }} /></div>; }
