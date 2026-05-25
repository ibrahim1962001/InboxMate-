import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ComposeForm } from "@/components/compose-form";

export default async function ComposePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compose");

  return (
    <div className="px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">{t("title")}</h1>
      <ComposeForm />
    </div>
  );
}
