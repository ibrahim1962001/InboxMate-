import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { Mail, Sparkles, Filter, Languages } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("landing");
  const tApp = await getTranslations("app");
  const tNav = await getTranslations("nav");

  const features = [
    { icon: Mail, label: t("features.gmail") },
    { icon: Sparkles, label: t("features.ai") },
    { icon: Filter, label: t("features.organize") },
    { icon: Languages, label: t("features.bilingual") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <p className="text-sm font-medium text-indigo-600">{tApp("name")}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {t("hero")}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <SignInButton label={t("cta")} locale={locale} />
        <Link
          href="/login"
          className="text-sm text-indigo-600 hover:underline"
        >
          {tNav("signIn")}
        </Link>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-start dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Icon className="h-8 w-8 shrink-0 text-indigo-500" />
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
