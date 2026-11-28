export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import EnquiryInbox from "@/components/cms/EnquiryInbox";

export default async function EnquiriesPage() {
  const { supabase } = await requireCmsAdminPage();
  const { data, error } = await supabase
    .from("enquiries")
    .select("id, full_name, email, phone, preferred_contact, package_slug, package_title, enquiry_type, travel_date, travellers, message, status, notes, submission_id, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return <p className="cms-notice cms-notice-error">Enquiries could not be loaded. {error.message}</p>;
  }

  return <EnquiryInbox initialEnquiries={data ?? []} />;
}
