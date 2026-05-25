import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AdminPayments } from "@/components/admin-payments";
import { prisma } from "@/lib/prisma";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const userCount = await prisma.user.count();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {t("users")}: {userCount}
      </p>
      <h2 className="mb-4 text-lg font-semibold">{t("payments")}</h2>
      <AdminPayments />
    </div>
  );
}
