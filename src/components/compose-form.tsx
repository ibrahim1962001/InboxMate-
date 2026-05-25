"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Send } from "lucide-react";

export function ComposeForm() {
  const t = useTranslations("compose");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [prompt, setPrompt] = useState("");
  const [body, setBody] = useState("");
  const [tone, setTone] = useState("professional");
  const [emailLang, setEmailLang] = useState<"en" | "ar">(
    locale === "ar" ? "ar" : "en"
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/ai/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          language: emailLang,
          tone,
          subject: subject || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? tc("error"));
      setSubject(data.subject);
      setBody(data.body);
      setStatus("Draft ready — edit before sending.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : tc("error"));
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? tc("error"));
      setStatus("Email sent successfully.");
      setPrompt("");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : tc("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-zinc-500">{t("to")}</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="block">
          <span className="text-sm text-zinc-500">{t("subject")}</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-zinc-500">{t("prompt")}</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <div className="flex flex-wrap gap-4">
        <label className="block">
          <span className="text-sm text-zinc-500">{t("tone")}</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="professional">{t("tones.professional")}</option>
            <option value="friendly">{t("tones.friendly")}</option>
            <option value="formal">{t("tones.formal")}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-zinc-500">{t("language")}</span>
          <select
            value={emailLang}
            onChange={(e) => setEmailLang(e.target.value as "en" | "ar")}
            className="mt-1 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        disabled={loading || !prompt}
        onClick={generate}
        className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-500 disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        {t("generate")}
      </button>

      <label className="block">
        <span className="text-sm text-zinc-500">{t("body")}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <button
        type="button"
        disabled={loading || !to || !subject || !body}
        onClick={send}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {t("send")}
      </button>

      {status && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{status}</p>
      )}
    </div>
  );
}
