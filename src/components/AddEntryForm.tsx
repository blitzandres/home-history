"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function AddEntryForm({ slug }: { slug: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [story, setStory] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function onFilesChange() {
    const files = fileRef.current?.files;
    if (!files) {
      setFileNames([]);
      return;
    }
    setFileNames(Array.from(files).map((f) => f.name));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.set("story", story);
      if (yearStart) form.set("yearStart", yearStart);
      if (yearEnd) form.set("yearEnd", yearEnd);
      const files = fileRef.current?.files;
      if (files) {
        for (const f of Array.from(files)) {
          form.append("photos", f);
        }
      }

      const res = await fetch(`/api/homes/${slug}/entries`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save.");
        return;
      }
      setStory("");
      setYearStart("");
      setYearEnd("");
      setFileNames([]);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn-primary w-full sm:w-auto"
        onClick={() => setOpen(true)}
      >
        Add a memory
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl" style={{ color: "var(--accent-strong)" }}>
            Leave something behind
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            A year, a short story, and photos — future residents will find them here.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost px-3 py-2 text-sm"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="yearStart">
            Year (optional)
          </label>
          <input
            id="yearStart"
            className="field"
            inputMode="numeric"
            placeholder="2019"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="yearEnd">
            End year (optional range)
          </label>
          <input
            id="yearEnd"
            className="field"
            inputMode="numeric"
            placeholder="2023"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="story">
          Story / note
        </label>
        <textarea
          id="story"
          className="field min-h-[8rem] resize-y"
          placeholder="We planted the cherry tree by the fence the spring we moved in…"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="photos">
          Photos
        </label>
        <input
          ref={fileRef}
          id="photos"
          type="file"
          accept="image/*"
          multiple
          className="field file:mr-3 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1 file:text-sm file:font-semibold file:text-[#1a120c]"
          onChange={onFilesChange}
        />
        {fileNames.length > 0 && (
          <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            {fileNames.length} selected: {fileNames.join(", ")}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save to this home"}
      </button>
    </form>
  );
}
