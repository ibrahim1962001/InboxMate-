import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { SubscriptionForm } from "@/components/subscription-form";

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("subscription");

  return (
    <div className="px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">{t("title")}</h1>
      <SubscriptionForm />
    </div>
  );
}
