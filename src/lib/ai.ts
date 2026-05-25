import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function draftEmail(params: {
  prompt: string;
  language: "en" | "ar";
  tone?: string;
  subject?: string;
}): Promise<{ subject: string; body: string }> {
  const { prompt, language, tone = "professional", subject } = params;

  if (!openai) {
    const isAr = language === "ar";
    return {
      subject: subject || (isAr ? "موضوع الرسالة" : "Email subject"),
      body: isAr
        ? `<p>مرحباً،</p><p>${prompt}</p><p>مع أطيب التحيات</p>`
        : `<p>Hello,</p><p>${prompt}</p><p>Best regards</p>`,
    };
  }

  const system =
    language === "ar"
      ? `أنت مساعد كتابة بريد إلكتروني. اكتب رسالة ${tone} بالعربية. أرجع JSON: {"subject":"...","body":"..."} حيث body هو HTML بسيط.`
      : `You are an email writing assistant. Write a ${tone} email in English. Return JSON: {"subject":"...","body":"..."} where body is simple HTML.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: subject
          ? `Subject hint: ${subject}\n\nRequest: ${prompt}`
          : prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No AI response");
  }

  const parsed = JSON.parse(content) as { subject: string; body: string };
  return parsed;
}
