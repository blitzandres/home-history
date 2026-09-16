import Link from "next/link";
import { notFound } from "next/navigation";
import { AddEntryForm } from "@/components/AddEntryForm";
import { ShareLink } from "@/components/ShareLink";
import { Timeline } from "@/components/Timeline";
import { getHomeWithEntries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomeTimelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const home = getHomeWithEntries(slug);
  if (!home) notFound();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm"
          style={{ color: "var(--ink-muted)" }}
        >
          ← Home History
        </Link>
        <span className="font-display text-lg" style={{ color: "var(--accent)" }}>
          Home file
        </span>
      </header>

      <section className="mb-8">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--ink-faint)" }}
        >
          This house&apos;s time capsule
        </p>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          {home.address}
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
          {home.entries.length === 0
            ? "No entries yet — be the first."
            : `${home.entries.length} ${home.entries.length === 1 ? "entry" : "entries"} on the timeline`}
        </p>
      </section>

      <div className="mb-8 space-y-4">
        <ShareLink slug={home.slug} />
        <AddEntryForm slug={home.slug} />
      </div>

      <section>
        <h2
          className="mb-5 font-display text-2xl"
          style={{ color: "var(--accent-strong)" }}
        >
          Timeline
        </h2>
        <Timeline entries={home.entries} />
      </section>
    </main>
  );
}
