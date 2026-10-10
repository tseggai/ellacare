import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getFaqs } from "@/lib/content";
import { FaqManager } from "./FaqManager";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const [faqs, { q }] = await Promise.all([getFaqs(true), searchParams]);
  const draft = q?.trim().slice(0, 300) || undefined;

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">FAQs</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Common questions</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Shown on the home page in the order below, and suggested to visitors as they type a question. Drag to reorder; tap one to edit.
      </p>
      <div className="mt-6">
        <FaqManager key={draft ?? "list"} faqs={faqs} draftQuestion={draft} />
      </div>
    </>
  );
}
