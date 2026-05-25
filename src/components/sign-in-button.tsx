"use client";

import { signIn } from "next-auth/react";

export function SignInButton({
  label,
  locale,
}: {
  label: string;
  locale: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: `/${locale}/inbox` })}
      className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500"
    >
      {label}
    </button>
  );
}
