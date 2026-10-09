"use client";

import { ExternalLink, HelpCircle, Images, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { signOut } from "./actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/gallery", label: "Photo gallery", icon: Images },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminSidebar({ email, newCount }: { email: string; newCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer after navigating on phones.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-2xl px-3.5 font-semibold transition-colors ${
              active ? "bg-brand text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            {href === "/admin/inquiries" && newCount > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${active ? "bg-white/20" : "bg-sky-tint text-brand"}`}>
                {newCount}
              </span>
            )}
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex min-h-11 items-center gap-3 rounded-2xl px-3.5 font-semibold text-ink/80 hover:bg-ink/5 hover:text-ink"
      >
        <ExternalLink className="h-5 w-5 shrink-0" aria-hidden /> View website
      </a>
      <div className="mt-auto border-t border-line pt-4">
        <p className="truncate px-3.5 text-sm text-muted">{email}</p>
        <form action={signOut}>
          <button type="submit" className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 font-semibold text-ink/80 hover:bg-ink/5">
            <LogOut className="h-5 w-5 shrink-0" aria-hidden /> Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:h-screen lg:flex-col lg:gap-8 lg:border-r lg:border-line lg:bg-white lg:p-5 lg:sticky lg:top-0">
        <Link href="/admin" className="px-2">
          <Logo className="w-28" />
        </Link>
        {nav}
      </aside>

      {/* Phone top bar + drawer */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Logo className="w-24" />
        </Link>
        <span className="text-sm font-semibold text-muted">Admin</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-3 top-[4.5rem] bottom-3 z-40 flex flex-col overflow-y-auto rounded-4xl bg-white p-4 shadow-2xl ring-1 ring-line lg:hidden">
          {nav}
        </div>
      )}
    </>
  );
}
