import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");
  const session = await auth();

  const subscription = session?.user?.id
    ? await prisma.userSubscription.findUnique({
        where: { userId: session.user.id },
      })
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <dl className="space-y-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div>
          <dt className="text-sm text-zinc-500">{t("account")}</dt>
          <dd className="font-medium">{session?.user?.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">{t("plan")}</dt>
          <dd className="font-medium">{subscription?.plan ?? "FREE"}</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500">{t("language")}</dt>
          <dd className="font-medium">{locale === "ar" ? "العربية" : "English"}</dd>
        </div>
      </dl>
    </div>
  );
}
