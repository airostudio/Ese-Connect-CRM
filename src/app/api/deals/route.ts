import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dealSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const stage = searchParams.get("stage") || "";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "100"), 1), 500);
  const sort = searchParams.get("sort") || "createdAt";

  const where: Record<string, unknown> = {};
  if (search) where.title = { contains: search };
  if (stage) where.stage = stage;

  const orderBy: Record<string, string> = {};
  if (sort === "value") orderBy.value = "desc";
  else orderBy.createdAt = "desc";

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
      },
      orderBy,
      take: limit,
    }),
    prisma.deal.count({ where }),
  ]);

  return NextResponse.json({ deals, total });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = dealSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { closeDate, ...rest } = parsed.data;
    const deal = await prisma.deal.create({
      data: {
        ...rest,
        closeDate: closeDate ? new Date(closeDate) : undefined,
        ownerId: session.user?.id,
      },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("Create deal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
