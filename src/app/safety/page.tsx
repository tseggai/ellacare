import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Safety & Policies",
  description: "Security, resident rights, HIPAA privacy, safety drills and smoke-free policy at EllaCare.",
};

const policies = [
  {
    title: "Security",
    body: "Your safety is our primary concern. We use robust, industry-standard security procedures and technology to protect residents’ well-being. No safeguard is perfect, so if anything ever seems unsafe, or you see something we could do better, please tell us. We have well-documented corrective procedures and can make changes immediately.",
  },
  {
    title: "Patient privacy",
    body: "EllaCare is committed to protecting your medical information in line with the Health Insurance Portability and Accountability Act (HIPAA), which governs the security and confidentiality of patient health information.",
  },
  {
    title: "Resident rights",
    body: "Residents have the right to raise concerns or complaints about their care, knowing the quality of their care will never be compromised as a result, and to expect a reasonable and timely response. Please bring concerns directly to our staff or managers so we can respond quickly.",
  },
  {
    title: "Safety drills",
    body: "We hold regular fire and emergency drills to test safety equipment and as part of ongoing safety education for all staff. If an alarm sounds during your visit, please stay calm and follow staff instructions. We will take care of you.",
  },
  {
    title: "Smoke-free home",
    body: "Because we care about everyone’s health, EllaCare is a smoke-free home. Smoking in and around the house is prohibited; a designated outdoor smoking area is available.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety & policies"
        title="Safe, respected and well cared for"
        intro="Clear policies and well-practiced procedures give residents and families peace of mind."
      />
      <section className="container-page py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {policies.map((p) => (
            <li key={p.title} className="rounded-2xl bg-white p-8 ring-1 ring-line">
              <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand title="Questions about safety?" body="We welcome your questions and concerns. Call us any time." />
    </>
  );
}
