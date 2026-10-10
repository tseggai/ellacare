"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Compact filter for phones; the pill links are shown on larger screens.
export function FilterSelect({ tabs, current }: { tabs: { key: string; label: string }[]; current: string }) {
  const router = useRouter();
  return (
    <div className="relative sm:hidden">
      <select
        aria-label="Filter inquiries"
        value={current}
        onChange={(e) => router.push(e.target.value === "open" ? "/admin/inquiries" : `/admin/inquiries?status=${e.target.value}`)}
        className="min-h-11 w-full appearance-none rounded-full bg-white pr-10 pl-4 font-semibold ring-1 ring-line focus:ring-2 focus:ring-brand focus:outline-none"
      >
        {tabs.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}
