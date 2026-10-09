import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-28 text-center">
      <p className="font-serif text-8xl text-brand italic">404</p>
      <h1 className="h2 mt-4">This page has moved home.</h1>
      <p className="lead mt-4">Sorry, we couldn’t find that page.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/contact" className="btn-ghost">
          Contact us
        </Link>
      </div>
    </section>
  );
}
