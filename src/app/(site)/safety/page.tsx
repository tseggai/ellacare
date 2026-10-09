import { Ban, BellRing, FileLock2, Scale, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Safety & Policies",
  description: "Security, resident rights, HIPAA privacy, safety drills and smoke-free policy at EllaCare.",
};

const policies = [
  {
    icon: ShieldCheck,
    title: "Security",
    body: "Your safety is our primary concern. We use robust, industry-standard security procedures and technology to protect residents’ well-being. No safeguard is perfect, so if anything ever seems unsafe, or you see something we could do better, please tell us. We have documented corrective procedures and can make changes immediately.",
  },
  {
    icon: FileLock2,
    title: "Patient privacy",
    body: "EllaCare is committed to protecting your medical information in line with HIPAA, which governs the security and confidentiality of patient health information.",
  },
  {
    icon: Scale,
    title: "Resident rights",
    body: "Residents may raise concerns or complaints about their care, knowing the quality of their care will never be compromised as a result, and can expect a reasonable and timely response.",
  },
  {
    icon: BellRing,
    title: "Safety drills",
    body: "We hold regular fire and emergency drills to test equipment and keep staff trained. If an alarm sounds during your visit, stay calm and follow staff instructions. We will take care of you.",
  },
  {
    icon: Ban,
    title: "Smoke-free home",
    body: "Smoking is prohibited in and around the house. A designated outdoor smoking area is available.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety & policies"
        title={
          <>
            Safe, respected and <span className="accent grad-text">well cared for.</span>
          </>
        }
        intro="Clear policies and well-practiced procedures give residents and families peace of mind."
      />
      <section className="container-page pb-8">
        <ul className="grid gap-4 md:grid-cols-2">
          {policies.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={`reveal rounded-4xl p-8 sm:p-10 ${i === 0 ? "bg-night text-white md:col-span-2" : "card"}`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${
                  i === 0 ? "bg-white/10 text-sky" : "bg-sky-tint text-brand"
                }`}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h2>
              <p className={`mt-3 max-w-3xl text-lg leading-relaxed ${i === 0 ? "text-white/75" : "text-muted"}`}>{body}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand
        title={
          <>
            Questions about <span className="accent grad-text">safety?</span>
          </>
        }
        body="We welcome your questions and concerns. Call us any time."
      />
    </>
  );
}
