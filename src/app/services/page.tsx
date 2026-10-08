import type { Metadata } from "next";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { basicServices, medicalServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Care & Services",
  description: "24/7 care, nurse on call, medication management, therapy visits, private and shared rooms, and more at EllaCare in Lynnwood, WA.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Care & services"
        title="Quality care, every hour of every day"
        intro="We continually measure our care against our own rigorous standards and industry benchmarks, so every resident is treated with skill and kindness."
        image="/images/rooms/room-4262.jpg"
      />

      <section className="container-page grid gap-8 py-16 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-line">
          <h2 className="font-display text-2xl font-semibold">Daily living</h2>
          <div className="mt-6">
            <CheckList items={basicServices} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 ring-1 ring-line">
          <h2 className="font-display text-2xl font-semibold">Medical support</h2>
          <div className="mt-6">
            <CheckList items={medicalServices} />
          </div>
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Resident rooms</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">
              We offer both private and shared rooms, assigned based on availability and medical needs. Each room has
              a private telephone, available for calls from 7 a.m. to 10 p.m.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Staying connected</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">
              Internet access and secure, private video calls let residents see and talk with family and friends
              whenever they like.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Communication needs</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">
              We assist residents who are hearing or vision impaired or who have limited English proficiency. Tell
              us your preferred form of communication and we will arrange an interpreter if needed.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="max-w-3xl">
          <h2 className="h2">How we keep improving</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We monitor and measure our services, examine how well our residents are cared for, and evaluate our
            performance regularly. Well-documented procedures let us act quickly whenever something can be done
            better.
          </p>
        </div>
      </section>

      <CtaBand title="Have questions about care needs?" body="Every resident is different. Call us or request a visit and we will talk through exactly what your loved one needs." />
    </>
  );
}
