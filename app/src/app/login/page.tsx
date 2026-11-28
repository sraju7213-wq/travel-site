import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLogin from "@/components/cms/AdminLogin";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Website CMS sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;
  return (
    <div className="cms-ui cms-login-page" data-theme="light">
      <div className="cms-login-card">
        <span className="cms-brand-mark">IN</span>
        <h1 className="cms-page-title" style={{ marginTop: 18 }}>Sign in to the CMS</h1>
        <p className="cms-page-subtitle">Use your administrator email and password.</p>
        {reason === "unauthorized" && (
          <p role="alert" className="cms-notice cms-notice-warning" style={{ marginTop: 18 }}>Your account is not authorized for website management. Sign in with an administrator account.</p>
        )}
        <div style={{ marginTop: 24 }}>
          <Suspense fallback={<p className="cms-help">Loading sign-in…</p>}>
            <AdminLogin />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
