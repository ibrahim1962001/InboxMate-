"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";

type Message = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
};

export function InboxList() {
  const t = useTranslations("inbox");
  const tc = useTranslations("common");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gmail/messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="text-zinc-500">{tc("loading")}</p>;
  }

  if (!messages.length) {
    return <p className="text-zinc-500">{t("empty")}</p>;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={load}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
      >
        <RefreshCw className="h-4 w-4" />
        {t("refresh")}
      </button>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {messages.map((msg) => (
          <li key={msg.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <div className="flex justify-between gap-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {msg.subject}
              </p>
              <span className="shrink-0 text-xs text-zinc-400">{msg.date}</span>
            </div>
            <p className="text-sm text-zinc-500">{msg.from}</p>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {msg.snippet}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
