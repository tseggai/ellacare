"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useActionState } from "react";
import { deleteTestimonial, saveTestimonial, type SaveState } from "./actions";

export type TestimonialRow = {
  id: string;
  author: string;
  relation: string | null;
  quote: string;
  highlight: string | null;
  sort_order: number;
  published: boolean;
};

const initial: SaveState = { status: "idle" };
const field =
  "block w-full rounded-2xl bg-paper px-4 py-3 ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none";

export function TestimonialForm({ row }: { row?: TestimonialRow }) {
  const [state, action, pending] = useActionState(saveTestimonial, initial);

  return (
    <form action={action} className="grid gap-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Name</span>
          <input name="author" required defaultValue={row?.author} className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Relation <span className="font-normal text-muted">(optional, e.g. Daughter of a resident)</span>
          </span>
          <input name="relation" defaultValue={row?.relation ?? ""} className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Quote</span>
        <textarea name="quote" required rows={5} defaultValue={row?.quote} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">
          Highlight <span className="font-normal text-muted">(optional one-liner shown large; defaults to the first sentence)</span>
        </span>
        <input name="highlight" maxLength={160} defaultValue={row?.highlight ?? ""} className={field} />
      </label>
      <div className="flex flex-wrap items-end gap-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Order <span className="font-normal text-muted">(lowest shows first)</span>
          </span>
          <input name="sort_order" type="number" min={0} defaultValue={row?.sort_order ?? 100} className={`${field} w-28`} />
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 font-semibold">
          <input type="checkbox" name="published" defaultChecked={row ? row.published : true} className="h-5 w-5 accent-brand" />
          Published
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary min-h-11 disabled:opacity-60">
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {row ? "Save changes" : "Add testimonial"}
        </button>
        {state.status !== "idle" && (
          <p role="status" className={state.status === "error" ? "font-medium text-red-700" : "font-medium text-leaf"}>
            {state.message}
          </p>
        )}
        {row && (
          <button
            type="submit"
            formAction={deleteTestimonial}
            formNoValidate
            onClick={(e) => {
              if (!confirm(`Delete the testimonial from ${row.author}? This can’t be undone.`)) e.preventDefault();
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
