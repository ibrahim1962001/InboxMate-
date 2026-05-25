"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function SubscriptionForm() {
  const t = useTranslations("subscription");
  const tc = useTranslations("common");
  const [plan, setPlan] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [proofNote, setProofNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amounts = { MONTHLY: 9.99, ANNUAL: 79.99 };

  const submit = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/subscription/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          amount: amounts[plan],
          proofNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error) ?? tc("error"));
      setStatus(t("pending"));
    } catch {
      setStatus(tc("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="grid gap-3">
        {(["MONTHLY", "ANNUAL"] as const).map((p) => (
          <label
            key={p}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
              plan === p
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <input
              type="radio"
              name="plan"
              checked={plan === p}
              onChange={() => setPlan(p)}
            />
            <span>{p === "MONTHLY" ? t("monthly") : t("annual")}</span>
          </label>
        ))}
      </div>

      <label className="block">
        <span className="text-sm text-zinc-500">{t("note")}</span>
        <textarea
          value={proofNote}
          onChange={(e) => setProofNote(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {t("submit")}
      </button>

      {status && <p className="text-sm text-zinc-600">{status}</p>}
    </div>
  );
}
