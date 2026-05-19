import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DealRow = { stage: string; value: number; probability: number; createdAt: Date };
type ContactRow = { status: string; leadScore: number; createdAt: Date };
type TaskRow = { status: string; priority: string };
type ActivityRow = { type: string; createdAt: Date };

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rawDeals, rawContacts, rawTasks, rawActivities] = await Promise.all([
    prisma.deal.findMany({ select: { stage: true, value: true, probability: true, createdAt: true } }),
    prisma.contact.findMany({ select: { status: true, leadScore: true, createdAt: true } }),
    prisma.task.findMany({ select: { status: true, priority: true } }),
    prisma.activity.findMany({ select: { type: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  const deals: DealRow[] = rawDeals;
  const contacts: ContactRow[] = rawContacts;
  const tasks: TaskRow[] = rawTasks;
  const activities: ActivityRow[] = rawActivities;

  // Pipeline stats
  const pipelineStages = ["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"];
  const pipelineData = pipelineStages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + d.value, 0),
    };
  });

  // Revenue by month (last 6 months)
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const monthDeals = deals.filter((d) => {
      const created = new Date(d.createdAt);
      return created.getMonth() === date.getMonth() && created.getFullYear() === year;
    });
    monthlyRevenue.push({
      month,
      revenue: monthDeals.filter((d) => d.stage === "closed won").reduce((s, d) => s + d.value, 0),
      pipeline: monthDeals
        .filter((d) => !["closed won", "closed lost"].includes(d.stage))
        .reduce((s, d) => s + d.value, 0),
    });
  }

  // Activity breakdown
  const activityTypes = ["call", "email", "meeting", "note", "task"];
  const activityBreakdown = activityTypes.map((type) => ({
    type,
    count: activities.filter((a) => a.type === type).length,
  }));

  // Lead score distribution
  const scoreRanges = [
    { range: "0-20", count: contacts.filter((c) => c.leadScore <= 20).length },
    { range: "21-40", count: contacts.filter((c) => c.leadScore > 20 && c.leadScore <= 40).length },
    { range: "41-60", count: contacts.filter((c) => c.leadScore > 40 && c.leadScore <= 60).length },
    { range: "61-80", count: contacts.filter((c) => c.leadScore > 60 && c.leadScore <= 80).length },
    { range: "81-100", count: contacts.filter((c) => c.leadScore > 80).length },
  ];

  // Win rate
  const closedDeals = deals.filter((d) => ["closed won", "closed lost"].includes(d.stage));
  const wonDeals = deals.filter((d) => d.stage === "closed won");
  const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0;

  return NextResponse.json({
    pipelineData,
    monthlyRevenue,
    activityBreakdown,
    scoreRanges,
    winRate,
    totalRevenue: wonDeals.reduce((s, d) => s + d.value, 0),
    forecastedRevenue: deals
      .filter((d) => !["closed won", "closed lost"].includes(d.stage))
      .reduce((s, d) => s + (d.value * d.probability) / 100, 0),
    taskCompletion: {
      completed: tasks.filter((t) => t.status === "completed").length,
      pending: tasks.filter((t) => t.status !== "completed").length,
    },
  });
}
