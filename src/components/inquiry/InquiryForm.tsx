"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageCircleQuestion,
  Phone,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";
import { useActionState, useState } from "react";
import { submitInquiry, type InquiryState } from "@/app/contact/actions";
import { site } from "@/lib/site";

export type InquiryType = "tour" | "question" | "callback";

const initial: InquiryState = { status: "idle" };

const options: { value: InquiryType; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "tour", label: "Book a tour", hint: "Visit the home and meet our team", icon: CalendarCheck },
  { value: "callback", label: "Request a callback", hint: "Leave your number and we’ll call you", icon: PhoneCall },
  { value: "question", label: "Ask a question", hint: "We reply within one business day", icon: MessageCircleQuestion },
];

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

type Step = "choose" | "details" | "contact";

// One form for every kind of inquiry, in short steps: what you need → details →
// how to reach you. A callback skips the details step. Used inline on /contact
// and inside the site-wide overlay.
export function InquiryForm({
  initialType = "tour",
  bare = false,
  onDone,
}: {
  initialType?: InquiryType;
  bare?: boolean;
  onDone?: () => void;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [type, setType] = useState<InquiryType>(initialType);
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = type === "callback" ? ["choose", "contact"] : ["choose", "details", "contact"];
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = step === "contact";

  // When the server reports errors, jump to the step that holds the first one.
  const [handled, setHandled] = useState(state);
  if (handled !== state) {
    setHandled(state);
    if (state.fieldErrors) setStepIndex(steps.indexOf(state.fieldErrors.preferred_date ? "details" : "contact"));
  }

  if (state.status === "success") {
    return (
      <div role="status" className={`text-center ${bare ? "py-6" : "card p-8 sm:p-12"}`}>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf/10 text-leaf">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h2 className="h2 mt-6">Thank you!</h2>
        <p className="lead mx-auto mt-4 max-w-md">
          {type === "callback"
            ? "We’ll call you soon, usually the same day."
            : `We received your ${type === "tour" ? "tour request" : "question"} and will get back to you within one business day.`}{" "}
          Need us sooner? Call{" "}
          <a href={`tel:${site.phones.main.tel}`} className="font-semibold text-brand underline underline-offset-4">
            {site.phones.main.display}
          </a>
          .
        </p>
        {onDone && (
          <button type="button" onClick={onDone} className="btn-primary mt-8">
            Done
          </button>
        )}
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const today = new Date().toISOString().slice(0, 10);
  const titles: Record<Step, string> = {
    choose: "How can we help?",
    details: type === "tour" ? "Tell us about your visit" : "What’s your question?",
    contact: type === "callback" ? "Where should we call you?" : "How can we reach you?",
  };

  return (
    <form
      action={action}
      noValidate
      className={bare ? "" : "card p-6 sm:p-10"}
      onKeyDown={(e) => {
        // Enter moves forward instead of submitting early.
        if (e.key === "Enter" && !isLast && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
          setStepIndex(stepIndex + 1);
        }
      }}
    >
      <div className={`flex items-center justify-between gap-4 ${bare ? "pr-12" : ""}`}>
        <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {steps.map((s, i) => (
            <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${i <= stepIndex ? "w-10 bg-brand" : "w-6 bg-line"}`} />
          ))}
        </div>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight" aria-live="polite">
        {titles[step]}
      </h2>

      {/* Choose */}
      <div hidden={step !== "choose"} className="mt-8 space-y-8">
        <fieldset>
          <legend className="sr-only">What would you like to do?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {options.map(({ value, label, hint, icon: Icon }) => (
              <label
                key={value}
                className="flex cursor-pointer flex-col gap-3 rounded-3xl bg-paper p-5 ring-1 ring-line transition-all hover:ring-ink/30 has-checked:bg-sky-tint has-checked:ring-2 has-checked:ring-brand has-focus-visible:ring-2 has-focus-visible:ring-brand"
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={type === value}
                  onChange={() => {
                    setType(value);
                    setStepIndex(0);
                  }}
                  className="sr-only"
                />
                <Icon className="h-6 w-6 text-brand" aria-hidden />
                <span>
                  <span className="block text-lg leading-tight font-semibold">{label}</span>
                  <span className="mt-1 block text-[0.95rem] text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 text-muted">
            Prefer to talk right now?
            <a href={`tel:${site.phones.main.tel}`} className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
              <Phone className="h-4 w-4" aria-hidden /> Call {site.phones.main.display}
            </a>
          </p>
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

      {/* Details */}
      <div hidden={step !== "details"} className="mt-8 space-y-6">
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
        {type !== "callback" && (
          <div>
            <label htmlFor="message" className="mb-2 block text-lg font-semibold">
              {type === "tour" ? "Anything else?" : "Your question"}{" "}
              {type === "tour" && <span className="font-normal text-muted">(optional)</span>}
            </label>
            <textarea id="message" name="message" rows={type === "tour" ? 3 : 6} defaultValue={v.message} className={field} />
          </div>
        )}
      </div>

      {/* Contact */}
      <div hidden={step !== "contact"} className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required defaultValue={v.name} error={err.name} />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required={type === "callback"}
          defaultValue={v.phone}
          error={err.phone}
        />
        <div className="sm:col-span-2">
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required={type !== "callback"}
            defaultValue={v.email}
            error={err.email}
          />
        </div>
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && isLast && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-medium text-red-800">
          {state.message}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        {stepIndex > 0 ? (
          <button type="button" onClick={() => setStepIndex(stepIndex - 1)} className="btn px-4 text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>
        ) : (
          <span />
        )}
        {/* Distinct keys: otherwise React reuses the node and the click that
            switched it to type="submit" also submits the form. */}
        {!isLast ? (
          <button key="next" type="button" onClick={() => setStepIndex(stepIndex + 1)} className="btn-primary">
            Continue <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button key="submit" type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
            {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {pending
              ? "Sending…"
              : { tour: "Request my tour", question: "Send question", callback: "Request callback" }[type]}
          </button>
        )}
      </div>
      {isLast && <p className="mt-4 text-sm text-muted">Your information is never shared without your permission.</p>}
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
