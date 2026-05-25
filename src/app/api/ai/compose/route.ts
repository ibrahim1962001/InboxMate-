import { auth } from "@/auth";
import { draftEmail } from "@/lib/ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1),
  language: z.enum(["en", "ar"]),
  tone: z.string().optional(),
  subject: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const draft = await draftEmail(parsed.data);
    return NextResponse.json(draft);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI compose failed" }, { status: 500 });
  }
}
