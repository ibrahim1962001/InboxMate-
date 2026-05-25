import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect({ href: "/login", locale });
  }

  if (session!.user.role !== "ADMIN") {
    redirect({ href: "/inbox", locale });
  }

  return <>{children}</>;
}
