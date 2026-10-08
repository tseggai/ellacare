"use client";

import { useActionState, useState } from "react";
import { site } from "@/lib/site";
import { submitInquiry, type InquiryState } from "./actions";

const initial: InquiryState = { status: "idle" };

export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [type, setType] = useState<"tour" | "question">("tour");

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 ring-1 ring-line">
        <h2 className="h2 text-brand">Thank you!</h2>
        <p className="mt-4 text-lg text-muted">
          We received your message and will get back to you within one business day. If it is urgent, please
          call us at{" "}
          <a href={`tel:${site.phones.main.tel}`} className="font-semibold text-ink underline">
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

  return (
    <form action={action} className="space-y-6 rounded-2xl bg-white p-6 ring-1 ring-line sm:p-8" noValidate>
      <fieldset>
        <legend className="mb-3 text-lg font-semibold">How can we help?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["tour", "Schedule a tour"],
              ["question", "Ask a question"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="btn cursor-pointer border-2 px-3 border-line has-checked:border-brand has-checked:bg-brand-soft has-checked:text-brand"
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={err.name} autoComplete="name" defaultValue={v.name} />
        <Field label="Email" name="email" type="email" required error={err.email} autoComplete="email" defaultValue={v.email} />
        <Field label="Phone" name="phone" type="tel" error={err.phone} autoComplete="tel" defaultValue={v.phone} />
        <div>
          <label htmlFor="relationship" className="mb-1.5 block font-medium">
            You are…
          </label>
          <select id="relationship" name="relationship" defaultValue={v.relationship ?? ""} className={inputClass}>
            <option value="">Select one</option>
            <option>Looking for myself</option>
            <option>Adult child</option>
            <option>Spouse or partner</option>
            <option>Other family member</option>
            <option>Case manager or social worker</option>
            <option>Healthcare professional</option>
          </select>
        </div>
        {type === "tour" && (
          <Field
            label="Preferred visit date"
            name="preferred_date"
            type="date"
            min={today}
            error={err.preferred_date}
            defaultValue={v.preferred_date}
          />
        )}
      </div>

      {type === "tour" && (
        <div>
          <label htmlFor="care_needs" className="mb-1.5 block font-medium">
            Care needs <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="care_needs"
            name="care_needs"
            rows={3}
            placeholder="e.g. memory care, mobility assistance, diabetes management"
            defaultValue={v.care_needs}
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="mb-1.5 block font-medium">
          Message {type === "tour" && <span className="font-normal text-muted">(optional)</span>}
        </label>
        <textarea id="message" name="message" rows={4} defaultValue={v.message} className={inputClass} />
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 font-medium text-red-800">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Sending…" : type === "tour" ? "Request a tour" : "Send message"}
      </button>
      <p className="text-sm text-muted">
        We respect your privacy. Your information is never shared without your permission.
      </p>
    </form>
  );
}

const inputClass =
  "block w-full rounded-xl border-2 border-line bg-cream px-4 py-3 text-lg focus:border-brand focus:outline-none aria-invalid:border-red-600";

function Field({
  label,
  name,
  error,
  required,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-medium">
        {label} {required && <span className="text-warm">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
