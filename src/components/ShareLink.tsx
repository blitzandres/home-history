"use client";

import { useState } from "react";

export function ShareLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/h/${slug}`;

  async function copy() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "var(--line)", background: "rgba(0,0,0,0.18)" }}
    >
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--ink-faint)" }}>
          Shareable link
        </p>
        <p className="truncate font-mono text-sm" style={{ color: "var(--accent)" }}>
          {path}
        </p>
      </div>
      <button type="button" className="btn btn-ghost text-sm" onClick={copy}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
