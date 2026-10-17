"use client";

import { useState } from "react";
import { TOUR_LINK } from "@/lib/links";
import { Field, field } from "../ui";

// What happens when someone taps the banner.
export function BannerAction({ href }: { href: string }) {
  const [action, setAction] = useState<"tour" | "link" | "none">(href === TOUR_LINK ? "tour" : href ? "link" : "none");
  const options = [
    { value: "tour", label: "Open the “Book a tour” form" },
    { value: "link", label: "Go to a link" },
    { value: "none", label: "Nothing (text only)" },
  ] as const;
  return (
    <>
      <fieldset>
        <legend className="mb-1.5 block text-sm font-semibold">When someone taps the banner</legend>
        <div className="grid gap-2">
          {options.map((o) => (
            <label key={o.value} className="inline-flex min-h-10 items-center gap-2">
              <input type="radio" name="action" value={o.value} checked={action === o.value} onChange={() => setAction(o.value)} className="h-4 w-4 accent-brand" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      {action === "link" && (
        <Field label="Link">
          <input name="href" defaultValue={href === TOUR_LINK ? "" : href} className={field} placeholder="/contact" />
          <span className="mt-1.5 block text-sm text-muted">
            A page on this site (e.g. <code>/contact</code>), a full web address, a phone number, or an email address.
          </span>
        </Field>
      )}
    </>
  );
}
