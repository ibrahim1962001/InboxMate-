import { auth } from "@/auth";
import { listInboxMessages } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await listInboxMessages(session.user.id);
  return NextResponse.json({ messages });
}
