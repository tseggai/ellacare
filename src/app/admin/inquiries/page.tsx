import { CalendarDays, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { saveInquiryNotes } from "./actions";
import { STATUSES, type Status } from "./status";
import { StatusSelect } from "./StatusSelect";

export const metadata: Metadata = { title: "Inquiries" };

type Inquiry = {
  id: string;
  created_at: string;
  type: "tour" | "question" | "callback";
  name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  preferred_date: string | null;
  care_needs: string | null;
  message: string | null;
  status: Status;
  notes: string | null;
};

const typeLabel = { tour: "Tour request", callback: "Callback", question: "Question" };
const fmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Los_Angeles",
});

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = STATUSES.includes(status as Status) ? (status as Status) : status === "all" ? "all" : "open";

  const supabase = getSupabaseAdmin();
  let rows: Inquiry[] = [];
  let counts: Record<string, number> = {};
  if (supabase) {
    let q = supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "open") q = q.neq("status", "closed");
    else if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    rows = (data ?? []) as Inquiry[];
    const { data: all } = await supabase.from("inquiries").select("status");
    counts = (all ?? []).reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  }
  const open = STATUSES.filter((s) => s !== "closed").reduce((n, s) => n + (counts[s] ?? 0), 0);
  const tabs = [
    { key: "open", label: `Open (${open})` },
    ...STATUSES.map((s) => ({ key: s, label: `${s[0].toUpperCase()}${s.slice(1)} (${counts[s] ?? 0})` })),
    { key: "all", label: "All" },
  ];

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Inquiries</h1>
      <nav aria-label="Filter" className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "open" ? "/admin/inquiries" : `/admin/inquiries?status=${t.key}`}
            aria-current={filter === t.key ? "page" : undefined}
            className="min-h-10 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-line hover:ring-ink/30 aria-[current=page]:bg-ink aria-[current=page]:text-white aria-[current=page]:ring-ink"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {!supabase && <p className="mt-8 text-muted">Database isn’t configured (SUPABASE_URL / SUPABASE_SECRET_KEY).</p>}
      {supabase && rows.length === 0 && <p className="mt-8 text-muted">Nothing here yet.</p>}

      <ul className="mt-6 grid gap-4">
        {rows.map((r) => (
          <li key={r.id} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">{typeLabel[r.type]}</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{r.name}</h2>
                <p className="text-sm text-muted">
                  {fmt.format(new Date(r.created_at))}
                  {r.relationship && ` · ${r.relationship}`}
                </p>
              </div>
              <StatusSelect id={r.id} status={r.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.975rem]">
              {r.phone && (
                <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brand">
                  <Phone className="h-4 w-4 text-brand" aria-hidden /> {r.phone}
                </a>
              )}
              {r.email && (
                <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brand">
                  <Mail className="h-4 w-4 text-brand" aria-hidden /> {r.email}
                </a>
              )}
              {r.preferred_date && (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <CalendarDays className="h-4 w-4 text-brand" aria-hidden /> Prefers {r.preferred_date}
                </span>
              )}
            </div>

            {(r.care_needs || r.message) && (
              <dl className="mt-4 grid gap-3 rounded-2xl bg-paper p-4 text-[0.975rem]">
                {r.care_needs && (
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">Care needs</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap">{r.care_needs}</dd>
                  </div>
                )}
                {r.message && (
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">Message</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap">{r.message}</dd>
                  </div>
                )}
              </dl>
            )}

            <form action={saveInquiryNotes} className="mt-4">
              <input type="hidden" name="id" value={r.id} />
              <label htmlFor={`notes-${r.id}`} className="mb-1.5 block text-xs font-bold tracking-wider text-muted uppercase">
                Staff notes
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <textarea
                  id={`notes-${r.id}`}
                  name="notes"
                  rows={2}
                  defaultValue={r.notes ?? ""}
                  placeholder="e.g. Called back 10/9, tour booked for Saturday"
                  className="block w-full rounded-2xl bg-paper px-4 py-3 ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none"
                />
                <button type="submit" className="btn-ghost min-h-11 shrink-0 px-5">
                  Save notes
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
