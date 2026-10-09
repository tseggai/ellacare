import { ArrowRight, HelpCircle, Images, Inbox, Megaphone, MessageSquareQuote, Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getBanner } from "@/lib/content";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = { title: "Dashboard" };

const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Los_Angeles" });
const typeLabel: Record<string, string> = { tour: "Tour request", callback: "Callback", question: "Question" };

export default async function AdminDashboard() {
  const user = await requireAdmin();
  const supabase = getSupabaseAdmin();
  const banner = await getBanner();

  let newCount = 0, openCount = 0, testimonialCount = 0, photoCount = 0, faqCount = 0;
  let recent: { id: string; name: string; type: string; status: string; created_at: string }[] = [];
  if (supabase) {
    const [n, o, t, p, f, r] = await Promise.all([
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).neq("status", "closed"),
      supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("gallery_photos").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("faqs").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("inquiries").select("id, name, type, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);
    newCount = n.count ?? 0;
    openCount = o.count ?? 0;
    testimonialCount = t.count ?? 0;
    photoCount = p.count ?? 0;
    faqCount = f.count ?? 0;
    recent = r.data ?? [];
  }

  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "America/Los_Angeles" }).format(new Date()));
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const tiles = [
    { href: "/admin/inquiries", label: "New inquiries", value: newCount, sub: `${openCount} open in total`, icon: Inbox, hot: newCount > 0 },
    { href: "/admin/testimonials", label: "Published testimonials", value: testimonialCount, icon: MessageSquareQuote },
    { href: "/admin/gallery", label: "Photos in gallery", value: photoCount, icon: Images },
    { href: "/admin/faqs", label: "FAQs on the site", value: faqCount, icon: HelpCircle },
  ];

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Dashboard</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        {greeting}, {user.email.split("@")[0]}.
      </h1>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ href, label, value, sub, icon: Icon, hot }) => (
          <li key={href}>
            <Link href={href} className={`card group flex h-full flex-col p-6 transition-shadow hover:shadow-lg ${hot ? "ring-2 ring-brand" : ""}`}>
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${hot ? "bg-brand text-white" : "bg-sky-tint text-brand"}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-5 text-4xl font-semibold tracking-tight">{value}</span>
              <span className="mt-1 font-semibold">{label}</span>
              {sub && <span className="text-sm text-muted">{sub}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              See all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-sm text-muted">
                    {typeLabel[r.type] ?? r.type} · {fmt.format(new Date(r.created_at))}
                  </p>
                </div>
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold tracking-wider uppercase">{r.status}</span>
              </li>
            ))}
            {recent.length === 0 && <li className="py-3 text-muted">No inquiries yet.</li>}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold tracking-tight">Site</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3">
              <Megaphone className={`mt-0.5 h-5 w-5 ${banner.enabled ? "text-leaf" : "text-muted"}`} aria-hidden />
              <div>
                <p className="font-semibold">Announcement banner: {banner.enabled ? "on" : "off"}</p>
                {banner.enabled && <p className="text-sm text-muted">“{banner.text}”</p>}
              </div>
            </li>
            <li>
              <Link href="/admin/settings" className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                <Settings className="h-4 w-4" aria-hidden /> Edit phone numbers, address, hero text, banner
              </Link>
            </li>
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                Open the website <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
