import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { TestimonialForm, type TestimonialRow } from "./TestimonialForm";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { data } = supabase
    ? await supabase.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as TestimonialRow[];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-muted">
            Published stories appear on the home page and the Family Stories page right away. The lowest order number is
            the featured story.
          </p>
        </div>
      </div>

      <details className="card mt-6 p-5 sm:p-6">
        <summary className="inline-flex cursor-pointer items-center gap-2 text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
            <Plus className="h-4 w-4" aria-hidden />
          </span>
          Add a testimonial
        </summary>
        <div className="mt-5">
          <TestimonialForm />
        </div>
      </details>

      <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4">
        {rows.map((r) => (
          <li key={r.id} className={`card p-5 sm:p-6 ${r.published ? "" : "opacity-70"}`}>
            <p className="mb-4 text-sm font-bold tracking-[0.12em] uppercase">
              <span className={r.published ? "text-leaf" : "text-muted"}>{r.published ? "Published" : "Hidden"}</span>
              <span className="text-muted"> · order {r.sort_order}</span>
            </p>
            <TestimonialForm row={r} />
          </li>
        ))}
        {rows.length === 0 && <li className="text-muted">No testimonials yet.</li>}
      </ul>
    </>
  );
}
