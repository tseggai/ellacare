import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getFaqs } from "@/lib/content";
import { FaqForm } from "./FaqForm";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqsAdminPage() {
  await requireAdmin();
  const faqs = await getFaqs(true);

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">FAQs</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Common questions</h1>
      <p className="mt-2 max-w-2xl text-muted">Shown on the home page in the order below. Unpublished questions are kept but hidden.</p>

      <details className="card mt-8 p-5 sm:p-6">
        <summary className="inline-flex cursor-pointer items-center gap-2 text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
            <Plus className="h-4 w-4" aria-hidden />
          </span>
          Add a question
        </summary>
        <div className="mt-5">
          <FaqForm />
        </div>
      </details>

      <ul className="mt-6 grid gap-4">
        {faqs.map((f) => (
          <li key={f.id} className={`card p-5 sm:p-6 ${f.published ? "" : "opacity-70"}`}>
            <p className="mb-4 text-sm font-bold tracking-[0.12em] uppercase">
              <span className={f.published ? "text-leaf" : "text-muted"}>{f.published ? "Published" : "Hidden"}</span>
              <span className="text-muted"> · order {f.sort_order}</span>
            </p>
            <FaqForm row={f} />
          </li>
        ))}
      </ul>
    </>
  );
}
