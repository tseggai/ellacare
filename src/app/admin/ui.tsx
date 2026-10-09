"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export const field =
  "block w-full rounded-2xl bg-paper px-4 py-3 ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none";

export type ActionState = { status: "idle" | "saved" | "error"; message?: string };
export const idleState: ActionState = { status: "idle" };

// Wraps a server action with an inline "Saved." / error message.
export function SaveForm({
  action,
  children,
  submitLabel = "Save changes",
  className = "",
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, idleState);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary min-h-11 disabled:opacity-60">
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? "Saving…" : submitLabel}
        </button>
        {state.status !== "idle" && (
          <p role="status" className={state.status === "error" ? "font-medium text-red-700" : "font-medium text-leaf"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">
        {label} {hint && <span className="font-normal text-muted">({hint})</span>}
      </span>
      {children}
    </label>
  );
}
