export const instant = false;
import { requireCmsDeveloperPage } from "@/lib/supabaseServer";
import { isUserManagementConfigured, UserManagementUnavailable } from "@/lib/supabaseAdmin";
import { listCmsUsers } from "@/lib/cmsUsers";
import UsersManager from "@/components/cms/UsersManager";

export default async function UsersPage() {
  const { user } = await requireCmsDeveloperPage();

  if (!isUserManagementConfigured) {
    return (
      <div style={{ display: "grid", gap: 18 }}>
        <header><h1 className="cms-page-title">Users &amp; permissions</h1><p className="cms-page-subtitle">Add team members, change their role and remove access.</p></header>
        <div className="cms-notice cms-notice-warning">
          User management needs a server-side Supabase service-role or secret key. Add <code>SUPABASE_SERVICE_ROLE_KEY</code> (or <code>SUPABASE_SECRET_KEY</code>) to the server environment to enable adding, removing and updating users. No key is exposed to the browser.
        </div>
      </div>
    );
  }

  let users;
  try {
    users = await listCmsUsers();
  } catch (error) {
    if (error instanceof UserManagementUnavailable) {
      return <p className="cms-notice cms-notice-warning">User management is not configured on the server.</p>;
    }
    return <p className="cms-notice cms-notice-error">The user list could not be loaded. {error instanceof Error ? error.message : ""}</p>;
  }

  return <UsersManager initialUsers={users} currentUserId={user.id} />;
}
