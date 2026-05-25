import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./locale-switcher";
import { SignOutButton } from "./sign-out-button";
import { Mail, PenLine, Settings, CreditCard, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const session = await auth();
  const t = await getTranslations("nav");

  const links: {
    href: "/inbox" | "/compose" | "/settings" | "/subscription" | "/admin";
    label: string;
    icon: typeof Mail;
  }[] = [
    { href: "/inbox", label: t("inbox"), icon: Mail },
    { href: "/compose", label: t("compose"), icon: PenLine },
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/subscription", label: t("subscription"), icon: CreditCard },
  ];

  if (session?.user?.role === "ADMIN") {
    links.push({
      href: "/admin",
      label: t("admin"),
      icon: Shield,
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-semibold text-indigo-600 dark:text-indigo-400">
          MailGenie
        </Link>

        {session?.user && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {session?.user ? (
            <SignOutButton label={t("signOut")} />
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
