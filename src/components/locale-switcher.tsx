"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: "en" | "ar") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex rounded-lg border border-zinc-200 p-0.5 text-xs dark:border-zinc-700">
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded-md px-2 py-1 ${locale === "en" ? "bg-indigo-600 text-white" : "text-zinc-600"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("ar")}
        className={`rounded-md px-2 py-1 ${locale === "ar" ? "bg-indigo-600 text-white" : "text-zinc-600"}`}
      >
        ع
      </button>
    </div>
  );
}
