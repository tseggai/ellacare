import { CalendarDays, ChevronDown, Mail, MessageSquarePlus, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { saveInquiryNotes } from "./actions";
import { STATUSES, type Status } from "./status";
import { FilterSelect } from "./FilterSelect";
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
const typeTone = {
  tour: "bg-sky-tint text-brand",
  callback: "bg-amber-50 text-amber-800",
  question: "bg-violet-50 text-violet-800",
};
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });
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
      <div className="mt-5">
        <FilterSelect tabs={tabs} current={filter} />
      </div>
      <nav aria-label="Filter" className="mt-5 hidden flex-wrap gap-2 sm:flex">
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

      <ul className="mt-5 grid gap-3">
        {rows.map((r) => (
          <li key={r.id} className="card relative">
            {/* Status lives outside the summary so changing it doesn't toggle the card. */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <StatusSelect id={r.id} status={r.status} />
            </div>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-start gap-3 p-4 pr-36 sm:p-5 sm:pr-40 [&::-webkit-details-marker]:hidden">
                <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                <div className="min-w-0">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase ${typeTone[r.type]}`}>
                    {typeLabel[r.type]}
                  </span>
                  <h2 className="mt-1.5 truncate text-lg font-semibold tracking-tight">{r.name}</h2>
                  <p className="truncate text-sm text-muted">
                    {shortDate.format(new Date(r.created_at))}
                    {r.relationship && ` · ${r.relationship}`}
                    {r.phone && ` · ${r.phone}`}
                  </p>
                </div>
              </summary>

              <div className="border-t border-line px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
                <p className="text-sm text-muted">Received {fmt.format(new Date(r.created_at))}</p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.975rem]">
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
                        <dt className="text-xs font-bold tracking-wider text-muted uppercase">{r.type === "question" ? "Question" : "Message"}</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap">{r.message}</dd>
                        {r.type === "question" && (
                          <Link
                            href={`/admin/faqs?q=${encodeURIComponent(r.message)}`}
                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                          >
                            <MessageSquarePlus className="h-4 w-4" aria-hidden /> Add to FAQs with an answer
                          </Link>
                        )}
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
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
