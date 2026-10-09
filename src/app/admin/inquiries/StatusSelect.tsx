"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { setInquiryStatus } from "./actions";
import { STATUSES, type Status } from "./status";

const tone: Record<Status, string> = {
  new: "bg-sky-tint text-brand ring-brand/30",
  contacted: "bg-amber-50 text-amber-800 ring-amber-300",
  toured: "bg-leaf/10 text-leaf ring-leaf/30",
  closed: "bg-paper text-muted ring-line",
};

export function StatusSelect({ id, status }: { id: string; status: Status }) {
  const [current, setCurrent] = useState(status);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Status</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Status;
          const prev = current;
          setCurrent(next);
          start(async () => {
            const res = await setInquiryStatus(id, next);
            if (!res.ok) {
              setCurrent(prev);
              setError(res.message);
            } else setError(null);
          });
        }}
        className={`min-h-10 cursor-pointer rounded-full px-3.5 text-sm font-semibold ring-1 capitalize focus:ring-2 focus:ring-brand focus:outline-none ${tone[current]}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-4 w-4 animate-spin text-muted" aria-hidden />}
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
