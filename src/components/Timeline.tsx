import type { Entry } from "@/lib/types";

function formatYears(entry: Entry): string {
  if (entry.year_start == null && entry.year_end == null) return "Undated";
  if (entry.year_start != null && entry.year_end != null) {
    if (entry.year_start === entry.year_end) return String(entry.year_start);
    return `${entry.year_start}–${entry.year_end}`;
  }
  return String(entry.year_start ?? entry.year_end);
}

export function Timeline({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl" style={{ color: "var(--accent)" }}>
          This home is waiting for its first story.
        </p>
        <p className="mt-3 text-sm" style={{ color: "var(--ink-muted)" }}>
          Add a photo or a note — you&apos;re starting the time capsule.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-6 pl-8 sm:pl-10">
      <div className="timeline-line" aria-hidden />
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            className="absolute -left-8 top-3 flex h-4 w-4 items-center justify-center rounded-full sm:-left-10"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 0 4px rgba(212,165,116,0.2)",
            }}
            aria-hidden
          />
          <article className="card overflow-hidden">
            <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: "var(--line)" }}>
              <p
                className="font-display text-lg tracking-wide"
                style={{ color: "var(--accent-strong)" }}
              >
                {formatYears(entry)}
              </p>
            </div>
            {entry.images.length > 0 && (
              <div
                className={
                  entry.images.length === 1
                    ? "grid grid-cols-1"
                    : "grid grid-cols-1 gap-px bg-[var(--line)] sm:grid-cols-2"
                }
              >
                {entry.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.path}
                    alt={img.original_name || "Home memory"}
                    className="max-h-80 w-full object-cover"
                  />
                ))}
              </div>
            )}
            {entry.story ? (
              <div className="px-5 py-5 sm:px-6">
                <p className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--ink)" }}>
                  {entry.story}
                </p>
              </div>
            ) : null}
          </article>
        </li>
      ))}
    </ol>
  );
}
