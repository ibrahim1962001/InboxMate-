import { prisma } from "@/lib/prisma";

export type GmailMessageSummary = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  labelIds: string[];
};

async function getAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  return account?.access_token ?? null;
}

export async function listInboxMessages(
  userId: string,
  maxResults = 20
): Promise<GmailMessageSummary[]> {
  const token = await getAccessToken(userId);
  if (!token) return [];

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!listRes.ok) {
    console.error("Gmail list error", await listRes.text());
    return [];
  }

  const listData = (await listRes.json()) as {
    messages?: { id: string; threadId: string }[];
  };

  if (!listData.messages?.length) return [];

  const summaries = await Promise.all(
    listData.messages.map(async (msg) => {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!detailRes.ok) return null;

      const detail = (await detailRes.json()) as {
        id: string;
        threadId: string;
        snippet: string;
        labelIds?: string[];
        payload?: { headers?: { name: string; value: string }[] };
      };

      const headers = detail.payload?.headers ?? [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
          ?.value ?? "";

      return {
        id: detail.id,
        threadId: detail.threadId,
        subject: getHeader("Subject") || "(No subject)",
        from: getHeader("From"),
        snippet: detail.snippet,
        date: getHeader("Date"),
        labelIds: detail.labelIds ?? [],
      };
    })
  );

  return summaries.filter((m): m is GmailMessageSummary => m !== null);
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  const token = await getAccessToken(userId);
  if (!token) return { ok: false, error: "No Gmail access token" };

  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${body}`
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!res.ok) {
    return { ok: false, error: await res.text() };
  }

  return { ok: true };
}
