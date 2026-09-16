"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AddressForm({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/homes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push(`/h/${data.home.slug}`);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3">
      <label className="label" htmlFor="address">
        Street address
      </label>
      <div
        className={
          variant === "hero"
            ? "flex flex-col gap-3 sm:flex-row"
            : "flex flex-col gap-3"
        }
      >
        <input
          id="address"
          name="address"
          className="field"
          placeholder="e.g. 142 Maple Street, Portland"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          autoComplete="street-address"
          required
          minLength={3}
        />
        <button
          type="submit"
          className="btn btn-primary shrink-0 sm:min-w-[10rem]"
          disabled={loading}
        >
          {loading ? "Opening…" : "Open this home"}
        </button>
      </div>
      {error ? (
        <p className="text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      ) : (
        <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
          No account needed. Same address → same shareable link.
        </p>
      )}
    </form>
  );
}
