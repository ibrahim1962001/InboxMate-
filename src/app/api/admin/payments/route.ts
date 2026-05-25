import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payments = await prisma.paymentRequest.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ payments });
}
