import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { defaultBusiness, getBanner, getHome, getSetting } from "@/lib/content";
import { Field, SaveForm, field } from "../ui";
import { saveBanner, saveBusiness, saveHome } from "./actions";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const [business, home, banner] = await Promise.all([getSetting("business", defaultBusiness), getHome(), getBanner()]);

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Site settings</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Business details & key content</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Changes go live on the website as soon as you save. Phone numbers and the address appear in the header,
        footer, contact page and the inquiry overlay.
      </p>

      <section className="card mt-8 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Announcement banner</h2>
        <p className="mt-1 text-sm text-muted">A strip across the top of every page, e.g. “Now accepting new residents” or holiday hours.</p>
        <SaveForm action={saveBanner} className="mt-5 grid gap-4">
          <label className="inline-flex min-h-11 items-center gap-3 font-semibold">
            <input type="checkbox" name="enabled" defaultChecked={banner.enabled} className="h-5 w-5 accent-brand" />
            Show the banner
          </label>
          <Field label="Text">
            <input name="text" maxLength={160} defaultValue={banner.text} className={field} placeholder="Now accepting new residents. Book a tour this week." />
          </Field>
          <Field label="Link" hint="optional, e.g. /contact">
            <input name="href" defaultValue={banner.href} className={field} placeholder="/contact" />
          </Field>
        </SaveForm>
      </section>

      <section className="card mt-6 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Phone numbers & address</h2>
        <SaveForm action={saveBusiness} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Main phone">
            <input name="main" required defaultValue={business.phones.main} className={field} />
          </Field>
          <Field label="Cell phone">
            <input name="cell" required defaultValue={business.phones.cell} className={field} />
          </Field>
          <Field label="Emergency phone">
            <input name="emergency" required defaultValue={business.phones.emergency} className={field} />
          </Field>
          <Field label="Fax" hint="optional">
            <input name="fax" defaultValue={business.phones.fax} className={field} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Street address">
              <input name="street" required defaultValue={business.address.street} className={field} />
            </Field>
          </div>
          <Field label="City">
            <input name="city" required defaultValue={business.address.city} className={field} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State">
              <input name="region" required maxLength={2} defaultValue={business.address.region} className={field} />
            </Field>
            <Field label="ZIP">
              <input name="postalCode" required defaultValue={business.address.postalCode} className={field} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="DSHS license number" hint="optional; shown in the footer when set">
              <input name="licenseNumber" defaultValue={business.licenseNumber} className={field} />
            </Field>
          </div>
        </SaveForm>
      </section>

      <section className="card mt-6 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Home page headline</h2>
        <p className="mt-1 text-sm text-muted">
          Wrap words in underscores to show them in the italic blue accent, e.g. <code className="rounded bg-paper px-1">_round-the-clock_</code>.
        </p>
        <SaveForm action={saveHome} className="mt-5 grid gap-4">
          <Field label="Headline">
            <input name="heroTitle" required maxLength={120} defaultValue={home.heroTitle} className={field} />
          </Field>
          <Field label="Intro paragraph">
            <textarea name="heroIntro" required rows={3} maxLength={400} defaultValue={home.heroIntro} className={field} />
          </Field>
        </SaveForm>
      </section>
    </>
  );
}
