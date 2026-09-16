import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl" style={{ color: "var(--accent)" }}>
        Home not found
      </h1>
      <p className="mt-3" style={{ color: "var(--ink-muted)" }}>
        That link doesn&apos;t match a home file yet. Create one from the landing page.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to Home History
      </Link>
    </main>
  );
}
