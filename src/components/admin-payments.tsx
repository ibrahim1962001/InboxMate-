"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Payment = {
  id: string;
  plan: string;
  amount: number;
  proofNote: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
};

export function AdminPayments() {
  const t = useTranslations("admin");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/payments");
    const data = await res.json();
    setPayments(data.payments ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id: string, action: "approve" | "reject") => {
    await fetch(`/api/admin/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  };

  if (loading) return <p>...</p>;
  if (!payments.length) return <p className="text-zinc-500">{t("noPending")}</p>;

  return (
    <ul className="space-y-3">
      {payments.map((p) => (
        <li
          key={p.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div>
            <p className="font-medium">{p.user.email}</p>
            <p className="text-sm text-zinc-500">
              {p.plan} — ${p.amount}
            </p>
            {p.proofNote && (
              <p className="mt-1 text-sm text-zinc-600">{p.proofNote}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => review(p.id, "approve")}
              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white"
            >
              {t("approve")}
            </button>
            <button
              type="button"
              onClick={() => review(p.id, "reject")}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white"
            >
              {t("reject")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
