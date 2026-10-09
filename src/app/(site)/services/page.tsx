import { Ear, HeartPulse, House, MessagesSquare, Phone, Video } from "lucide-react";
import type { Metadata } from "next";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { basicServices, medicalServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Care & Services",
  description: "24/7 care, nurse on call, medication management, therapy visits, private and shared rooms, and more at EllaCare in Lynnwood, WA.",
};

const extras = [
  {
    id: "rooms",
    icon: House,
    title: "Resident rooms",
    body: "Private and shared rooms, assigned based on availability and medical needs. We work closely with each resident to meet their room needs.",
  },
  {
    id: "phone",
    icon: Phone,
    title: "Private phone in every room",
    body: "Residents can make and receive calls from 7 a.m. to 10 p.m.",
  },
  {
    id: "connected",
    icon: Video,
    title: "Video calls with family",
    body: "Internet access and secure, private video calling so residents can see and talk with loved ones comfortably.",
  },
  {
    id: "communication",
    icon: Ear,
    title: "Hearing, vision & language support",
    body: "We assist residents who are hearing or vision impaired or who have limited English proficiency, and arrange interpreters when needed.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Care & services"
        title={
          <>
            Quality care, <span className="accent grad-text">every hour</span> of every day.
          </>
        }
        intro="We measure our care against our own rigorous standards and industry benchmarks, so every resident is treated with skill and kindness."
        image="/images/rooms/room-4262.jpg"
        imageAlt="A furnished resident bedroom"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-4 lg:grid-cols-2">
          <div className="reveal rounded-4xl bg-paper p-8 ring-1 ring-line sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand ring-1 ring-line">
              <House className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">Daily living</h2>
            <p className="mt-2 text-lg text-muted">Included for every resident.</p>
            <div className="mt-8">
              <CheckList items={basicServices} />
            </div>
          </div>
          <div id="medical" className="reveal scroll-mt-28 rounded-4xl bg-night p-8 text-white sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sky">
              <HeartPulse className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">Medical support</h2>
            <p className="mt-2 text-lg text-white/70">Professional care, on call around the clock.</p>
            <div className="mt-8">
              <CheckList items={medicalServices} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <p className="eyebrow">Comfort & connection</p>
        <h2 className="h2 mt-3 max-w-2xl">
          The little things <span className="accent grad-text">that matter most.</span>
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {extras.map(({ id, icon: Icon, title, body }) => (
            <li key={id} id={id} className="reveal card flex scroll-mt-28 gap-5 p-7">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-tint text-brand">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="reveal mt-4 flex flex-col gap-5 rounded-4xl bg-aqua-tint p-8 ring-1 ring-aqua/40 sm:flex-row sm:items-center sm:p-10">
          <MessagesSquare className="h-10 w-10 shrink-0 text-brand" aria-hidden />
          <div>
            <h3 className="text-xl font-semibold tracking-tight">How we keep improving</h3>
            <p className="mt-1 text-lg leading-relaxed text-ink/75">
              We monitor and measure our services, review how well residents are cared for, and evaluate our
              performance regularly, with documented procedures to act quickly whenever something can be done better.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Questions about <span className="accent grad-text">care needs?</span>
          </>
        }
        body="Every resident is different. Call us or book a visit and we’ll talk through exactly what your loved one needs."
      />
    </>
  );
}
