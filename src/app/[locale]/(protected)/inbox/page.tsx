import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { InboxList } from "@/components/inbox-list";

export default async function InboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("inbox");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <InboxList />
    </div>
  );
}
