import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { SignInButton } from "@/components/sign-in-button";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const tApp = await getTranslations("app");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{tApp("name")}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{tApp("tagline")}</p>
      <div className="mt-8">
        <SignInButton label={t("signIn")} locale={locale} />
      </div>
      <p className="mt-6 text-xs text-zinc-500">
        Connects to Gmail with secure Google OAuth
      </p>
    </div>
  );
}
