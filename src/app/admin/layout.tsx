import { Inbox, LogOut, MessageSquareQuote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · EllaCare admin" },
  robots: { index: false, follow: false },
};

// Nothing here is cached: staff always see the latest inquiries.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) return <>{children}</>; // the login page

  const links = [
    { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <nav aria-label="Admin" className="flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-semibold ring-1 ring-line hover:ring-ink/30"
            >
              <Icon className="h-4 w-4 text-brand" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span className="hidden sm:inline">{user.email}</span>
          <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-ink hover:bg-ink/5">
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
