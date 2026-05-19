import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { dealSchema } from "@/lib/validations";
import { toCamel } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [dealRes, tasksRes, activitiesRes, notesRes] = await Promise.all([
    db.from("deals")
      .select("*, contact:contacts!contact_id(*), company:companies!company_id(*), owner:users!owner_id(id, name, email)")
      .eq("id", id)
      .single(),
    supabase.from("tasks").select("*").eq("deal_id", id).order("due_date", { ascending: true }),
    supabase.from("activities").select("*").eq("deal_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("notes").select("*").eq("deal_id", id).order("created_at", { ascending: false }),
  ]);

  const deal = dealRes.data;
  const tasks = tasksRes.data;
  const activities = activitiesRes.data;
  const notes = notesRes.data;

  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    deal: toCamel({
      ...deal,
      tasks: tasks ?? [],
      activities: activities ?? [],
      notes: notes ?? [],
    }),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = dealSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { closeDate, contactId, companyId, ownerId, ...rest } = parsed.data;

    const updateData: Record<string, unknown> = { ...rest };
    if (closeDate !== undefined) updateData.close_date = closeDate ?? null;
    if (contactId !== undefined) updateData.contact_id = contactId;
    if (companyId !== undefined) updateData.company_id = companyId;
    if (ownerId !== undefined) updateData.owner_id = ownerId;
    updateData.last_activity_at = new Date().toISOString();
    updateData.updated_at = new Date().toISOString();

    const { data: deal, error } = await db
      .from("deals")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deal });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
