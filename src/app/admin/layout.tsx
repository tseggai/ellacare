import type { Metadata } from "next";
import { getAdminUser } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminSidebar } from "./AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · EllaCare admin" },
  robots: { index: false, follow: false },
};

// Nothing here is cached: staff always see the latest data.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) return <div className="min-h-screen bg-paper">{children}</div>; // the login page

  const supabase = getSupabaseAdmin();
  const { count } = supabase
    ? await supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new")
    : { count: 0 };

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminSidebar email={user.email} newCount={count ?? 0} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
