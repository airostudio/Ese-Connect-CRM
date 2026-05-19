import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const type = searchParams.get("type") || "";
  const contactId = searchParams.get("contactId") || "";
  const dealId = searchParams.get("dealId") || "";

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (contactId) where.contactId = contactId;
  if (dealId) where.dealId = dealId;

  const activities = await prisma.activity.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } },
      deal: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ activities });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = activitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const activity = await prisma.activity.create({
      data: {
        ...parsed.data,
        userId: session.user?.id,
      },
    });

    // Update deal lastActivityAt if related
    if (parsed.data.dealId) {
      await prisma.deal.update({
        where: { id: parsed.data.dealId },
        data: { lastActivityAt: new Date() },
      });
    }

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
