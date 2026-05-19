import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { taskSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";
  const limit = parseInt(searchParams.get("limit") || "50");

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  let query = supabase
    .from("tasks")
    .select(
      "*, assignee:users!assignee_id(id, name), contact:contacts!contact_id(id, first_name, last_name), deal:deals!deal_id(id, title)"
    )
    .order("due_date", { ascending: true })
    .limit(limit);

  if (filter === "today") {
    query = query
      .lte("due_date", todayEnd.toISOString())
      .neq("status", "completed");
  } else if (filter === "overdue") {
    query = query
      .lt("due_date", now.toISOString())
      .neq("status", "completed");
  } else if (filter === "upcoming") {
    query = query
      .gt("due_date", todayEnd.toISOString())
      .neq("status", "completed");
  } else if (filter === "completed") {
    query = query.eq("status", "completed");
  }

  const { data: tasks, error } = await query;

  if (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ tasks: tasks ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { dueDate, assigneeId, contactId, dealId, ...rest } = parsed.data;

    const { data: task, error } = await db
      .from("tasks")
      .insert({
        ...rest,
        due_date: dueDate ?? null,
        assignee_id: assigneeId || session.user?.id || null,
        contact_id: contactId ?? null,
        deal_id: dealId ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create task error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const body = await req.json();
  const { data: task, error } = await db
    .from("tasks")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ task });
}
