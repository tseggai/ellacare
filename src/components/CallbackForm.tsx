"use client";

import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";

const initial: InquiryState = { status: "idle" };

// Two-field "call me back" form: the fastest way for a family to reach us.
export function CallbackForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 py-2">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-leaf" aria-hidden />
        <div>
          <p className="text-lg font-semibold">Thanks, we’ll call you soon.</p>
          <p className="text-muted">Usually the same day.</p>
        </div>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};
  const field =
    "block w-full rounded-2xl bg-paper px-4 py-3.5 text-[1.0625rem] ring-1 ring-line placeholder:text-muted/70 focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none aria-invalid:ring-red-500";

  return (
    <form action={action} noValidate>
      <input type="hidden" name="type" value="callback" />
      <div aria-hidden="true" className="hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
        <label className="sr-only" htmlFor="cb-name">
          Your name
        </label>
        <input
          id="cb-name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          defaultValue={v.name}
          aria-invalid={err.name ? true : undefined}
          className={field}
        />
        <label className="sr-only" htmlFor="cb-phone">
          Phone number
        </label>
        <input
          id="cb-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Phone number"
          defaultValue={v.phone}
          aria-invalid={err.phone ? true : undefined}
          className={field}
        />
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60 sm:col-span-2 xl:col-span-1">
          {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Phone className="h-4 w-4" aria-hidden />}
          {pending ? "Sending…" : "Call me back"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-2 text-[0.95rem] font-medium text-red-700">
          {err.name ?? err.phone ?? state.message}
        </p>
      )}
    </form>
  );
}
