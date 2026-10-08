import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title={
          <>
            Your privacy <span className="accent text-brand">matters.</span>
          </>
        }
        actions={false}
      />
      <section className="container-page pb-24">
        <div className="card max-w-3xl space-y-5 p-8 text-lg leading-relaxed text-muted sm:p-12">
          <p className="text-xl text-ink">
            At {site.name}, we respect your privacy. Your information will never be shared without your permission.
          </p>
          <p>
            When you send us a message or request a tour or callback through this website, we store the details you
            provide (such as your name, contact information and message) only so that we can respond to you. We do not
            sell or share this information.
          </p>
          <p>
            For how we protect residents’ medical information, see our{" "}
            <Link href="/safety" className="font-semibold text-brand underline underline-offset-4">
              safety & policies
            </Link>{" "}
            page. To ask about or remove information you have sent us, call {site.phones.main.display}.
          </p>
        </div>
      </section>
    </>
  );
}
