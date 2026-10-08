import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24 text-center">
      <h1 className="h1">Page not found</h1>
      <p className="mt-4 text-lg text-muted">Sorry, we couldn’t find that page.</p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  );
}
