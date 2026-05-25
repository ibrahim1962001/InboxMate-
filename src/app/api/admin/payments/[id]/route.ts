import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  adminNote: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payment = await prisma.paymentRequest.findUnique({ where: { id } });
  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.action === "reject") {
    await prisma.paymentRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        adminNote: parsed.data.adminNote,
      },
    });
    return NextResponse.json({ success: true });
  }

  const endsAt = new Date();
  if (payment.plan === "MONTHLY") {
    endsAt.setMonth(endsAt.getMonth() + 1);
  } else {
    endsAt.setFullYear(endsAt.getFullYear() + 1);
  }

  await prisma.$transaction([
    prisma.paymentRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        adminNote: parsed.data.adminNote,
      },
    }),
    prisma.userSubscription.upsert({
      where: { userId: payment.userId },
      create: {
        userId: payment.userId,
        plan: payment.plan,
        status: "ACTIVE",
        startsAt: new Date(),
        endsAt,
      },
      update: {
        plan: payment.plan,
        status: "ACTIVE",
        startsAt: new Date(),
        endsAt,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
