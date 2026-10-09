"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useActionState } from "react";
import type { Faq } from "@/lib/content";
import { Field, field, idleState } from "../ui";
import { deleteFaq, saveFaq } from "./actions";

export function FaqForm({ row }: { row?: Faq }) {
  const [state, action, pending] = useActionState(saveFaq, idleState);
  return (
    <form action={action} className="grid gap-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <Field label="Question">
        <input name="question" required maxLength={300} defaultValue={row?.question} className={field} />
      </Field>
      <Field label="Answer">
        <textarea name="answer" required rows={4} maxLength={3000} defaultValue={row?.answer} className={field} />
      </Field>
      <div className="flex flex-wrap items-end gap-5">
        <Field label="Order" hint="lowest first">
          <input name="sort_order" type="number" min={0} defaultValue={row?.sort_order ?? 100} className={`${field} w-28`} />
        </Field>
        <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
          <input type="checkbox" name="published" defaultChecked={row ? row.published : true} className="h-5 w-5 accent-brand" />
          Published
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary min-h-11 disabled:opacity-60">
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {row ? "Save changes" : "Add question"}
        </button>
        {state.status !== "idle" && (
          <p role="status" className={state.status === "error" ? "font-medium text-red-700" : "font-medium text-leaf"}>
            {state.message}
          </p>
        )}
        {row && (
          <button
            type="submit"
            formAction={deleteFaq}
            formNoValidate
            onClick={(e) => {
              if (!confirm("Delete this question? This can’t be undone.")) e.preventDefault();
            }}
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden /> Delete
          </button>
        )}
      </div>
    </form>
  );
}
