"use client";

import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Loader2, MessageCircleQuestion } from "lucide-react";
import { useActionState, useState } from "react";
import { site } from "@/lib/site";
import { submitInquiry, type InquiryState } from "./actions";

const initial: InquiryState = { status: "idle" };

const relationships = [
  "Looking for myself",
  "Adult child",
  "Spouse or partner",
  "Other family",
  "Case manager / social worker",
  "Healthcare professional",
];

const field =
  "block w-full rounded-2xl bg-paper px-4 py-3.5 text-lg ring-1 ring-line placeholder:text-muted/70 focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none aria-invalid:ring-2 aria-invalid:ring-red-500";

// Three short steps instead of one long form: what you need → details → how to reach you.
export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [type, setType] = useState<"tour" | "question">("tour");
  const [step, setStep] = useState(0);

  // When the server reports errors, jump to the step that holds the first one.
  const [handled, setHandled] = useState(state);
  if (handled !== state) {
    setHandled(state);
    if (state.fieldErrors) setStep(state.fieldErrors.preferred_date ? 1 : 2);
  }

  if (state.status === "success") {
    return (
      <div role="status" className="card p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf/10 text-leaf">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h2 className="h2 mt-6">Thank you!</h2>
        <p className="lead mx-auto mt-4 max-w-md">
          We received your {type === "tour" ? "tour request" : "message"} and will get back to you within one business
          day. Need us sooner? Call{" "}
          <a href={`tel:${site.phones.main.tel}`} className="font-semibold text-brand underline underline-offset-4">
            {site.phones.main.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const today = new Date().toISOString().slice(0, 10);
  const titles = ["How can we help?", type === "tour" ? "Tell us about your visit" : "What’s your question?", "How can we reach you?"];

  return (
    <form
      action={action}
      noValidate
      className="card p-6 sm:p-10"
      onKeyDown={(e) => {
        // Enter moves forward instead of submitting early.
        if (e.key === "Enter" && step < 2 && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
          setStep(step + 1);
        }
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">
          Step {step + 1} of 3
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-10 bg-brand" : "w-6 bg-line"}`} />
          ))}
        </div>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight" aria-live="polite">
        {titles[step]}
      </h2>

      {/* Step 1 */}
      <div hidden={step !== 0} className="mt-8 space-y-8">
        <fieldset>
          <legend className="sr-only">Request type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["tour", "Book a tour", "Visit the home and meet our team", CalendarCheck],
                ["question", "Ask a question", "We’ll reply within one business day", MessageCircleQuestion],
              ] as const
            ).map(([value, label, hint, Icon]) => (
              <label
                key={value}
                className="flex cursor-pointer gap-4 rounded-3xl bg-paper p-5 ring-1 ring-line transition-all hover:ring-ink/30 has-checked:bg-sky-tint has-checked:ring-2 has-checked:ring-brand has-focus-visible:ring-2 has-focus-visible:ring-brand"
              >
                <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only" />
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block text-lg font-semibold">{label}</span>
                  <span className="text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-lg font-semibold">
            You are… <span className="font-normal text-muted">(optional)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {relationships.map((r) => (
              <label
                key={r}
                className="cursor-pointer rounded-full bg-paper px-4 py-2.5 font-semibold ring-1 ring-line transition-all hover:ring-ink/30 has-checked:bg-ink has-checked:text-white has-checked:ring-ink has-focus-visible:ring-2 has-focus-visible:ring-brand"
              >
                <input type="radio" name="relationship" value={r} defaultChecked={v.relationship === r} className="sr-only" />
                {r}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Step 2 */}
      <div hidden={step !== 1} className="mt-8 space-y-6">
        {type === "tour" && (
          <>
            <div>
              <label htmlFor="preferred_date" className="mb-2 block text-lg font-semibold">
                Preferred visit date <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="preferred_date"
                name="preferred_date"
                type="date"
                min={today}
                defaultValue={v.preferred_date}
                aria-invalid={err.preferred_date ? true : undefined}
                className={`${field} sm:max-w-xs`}
              />
            </div>
            <div>
              <label htmlFor="care_needs" className="mb-2 block text-lg font-semibold">
                Care needs <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="care_needs"
                name="care_needs"
                rows={3}
                defaultValue={v.care_needs}
                placeholder="e.g. memory care, mobility help, diabetes management"
                className={field}
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="message" className="mb-2 block text-lg font-semibold">
            {type === "tour" ? "Anything else?" : "Your question"}{" "}
            {type === "tour" && <span className="font-normal text-muted">(optional)</span>}
          </label>
          <textarea id="message" name="message" rows={type === "tour" ? 3 : 6} defaultValue={v.message} className={field} />
        </div>
      </div>

      {/* Step 3 */}
      <div hidden={step !== 2} className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required defaultValue={v.name} error={err.name} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} error={err.phone} />
        <div className="sm:col-span-2">
          <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={v.email} error={err.email} />
        </div>
      </div>

      <div aria-hidden="true" className="hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && step === 2 && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-medium text-red-800">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn px-4 text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">
            Continue <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
            {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {pending ? "Sending…" : type === "tour" ? "Request my tour" : "Send question"}
          </button>
        )}
      </div>
      {step === 2 && (
        <p className="mt-4 text-sm text-muted">Your information is never shared without your permission.</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required,
  ...props
}: { label: string; name: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-lg font-semibold">
        {label} {required ? <span className="text-brand">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={field}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
