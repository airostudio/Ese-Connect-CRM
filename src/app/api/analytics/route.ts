import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type DealRow = { stage: string; value: number; probability: number; created_at: string };
type ContactRow = { status: string; lead_score: number; created_at: string };
type TaskRow = { status: string; priority: string };
type ActivityRow = { type: string; created_at: string };

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rawDealsRes, rawContactsRes, rawTasksRes, rawActivitiesRes] = await Promise.all([
    supabase.from("deals").select("stage, value, probability, created_at"),
    supabase.from("contacts").select("status, lead_score, created_at"),
    supabase.from("tasks").select("status, priority"),
    supabase
      .from("activities")
      .select("type, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const deals: DealRow[] = rawDealsRes.data ?? [];
  const contacts: ContactRow[] = rawContactsRes.data ?? [];
  const tasks: TaskRow[] = rawTasksRes.data ?? [];
  const activities: ActivityRow[] = rawActivitiesRes.data ?? [];

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
      const created = new Date(d.created_at);
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
    { range: "0-20", count: contacts.filter((c) => c.lead_score <= 20).length },
    { range: "21-40", count: contacts.filter((c) => c.lead_score > 20 && c.lead_score <= 40).length },
    { range: "41-60", count: contacts.filter((c) => c.lead_score > 40 && c.lead_score <= 60).length },
    { range: "61-80", count: contacts.filter((c) => c.lead_score > 60 && c.lead_score <= 80).length },
    { range: "81-100", count: contacts.filter((c) => c.lead_score > 80).length },
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
