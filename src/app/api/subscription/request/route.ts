import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  plan: z.enum(["MONTHLY", "ANNUAL"]),
  proofNote: z.string().optional(),
  amount: z.number().positive(),
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

  const payment = await prisma.paymentRequest.create({
    data: {
      userId: session.user.id,
      plan: parsed.data.plan,
      amount: parsed.data.amount,
      proofNote: parsed.data.proofNote,
      status: "PENDING",
    },
  });

  return NextResponse.json({ payment });
}
