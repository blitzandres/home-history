import Link from "next/link";
import { AddressForm } from "@/components/AddressForm";

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
      <header className="mb-12 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight sm:text-2xl">
          Home History
        </Link>
        <span
          className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
          style={{
            color: "var(--ink-muted)",
            border: "1px solid var(--line)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          MVP
        </span>
      </header>

      <section className="mb-10">
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          A time capsule for a physical home
        </p>
        <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
          Leave stories for the people who will live here next.
        </h1>
        <p
          className="mt-6 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--ink-muted)" }}
        >
          Past and present residents add photos and notes. Future people open the
          same home file with a simple shareable link — no accounts, no verification
          for this MVP.
        </p>
      </section>

      <section className="card mb-12 p-5 sm:p-7">
        <h2 className="font-display mb-4 text-2xl" style={{ color: "var(--accent-strong)" }}>
          Open or create a home
        </h2>
        <AddressForm />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "One address, one file",
            body: "Enter the street address. We turn it into a lasting link like /h/142-maple-street.",
          },
          {
            title: "Timeline of memories",
            body: "Photos and short stories stack chronologically so the house grows a history.",
          },
          {
            title: "Built to reopen",
            body: "Everything persists locally — close the tab, restart the server, the home is still there.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--line)", background: "rgba(0,0,0,0.15)" }}
          >
            <h3 className="font-display text-lg" style={{ color: "var(--ink)" }}>
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <footer
        className="mt-auto pt-14 text-center text-sm"
        style={{ color: "var(--ink-faint)" }}
      >
        Home History · warm memories for cold walls
      </footer>
    </main>
  );
}
