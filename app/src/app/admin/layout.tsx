import type { Metadata } from "next";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import AdminShell from "@/components/cms/AdminShell";
import "./admin.css";

export const metadata: Metadata = { title: "Website CMS", robots: { index: false, follow: false } };

// Admin screens read session-scoped content and timestamps on every request.
export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireCmsAdminPage();

  return (
    <AdminShell role={role}>
      {children}
    </AdminShell>
  );
}
