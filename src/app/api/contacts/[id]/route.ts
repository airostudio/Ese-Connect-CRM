import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { contactSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [
    { data: contact },
    { data: deals },
    { data: tasks },
    { data: activities },
    { data: notes },
    { data: companyRel },
  ] = await Promise.all([
    supabase
      .from("contacts")
      .select("*, owner:users!owner_id(id, name, email)")
      .eq("id", id)
      .single(),
    supabase
      .from("deals")
      .select("*, owner:users!owner_id(name)")
      .eq("contact_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("tasks")
      .select("*")
      .eq("contact_id", id)
      .order("due_date", { ascending: true }),
    supabase
      .from("activities")
      .select("*")
      .eq("contact_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("notes")
      .select("*")
      .eq("contact_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("*").eq("id", id).maybeSingle(),
  ]);

  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch company if contact has company_id
  let contactCompany = null;
  if (contact.company_id) {
    const { data } = await supabase.from("companies").select("*").eq("id", contact.company_id).single();
    contactCompany = data;
  }

  return NextResponse.json({
    contact: {
      ...contact,
      companyRel: contactCompany,
      deals: deals ?? [],
      tasks: tasks ?? [],
      activities: activities ?? [],
      notes: notes ?? [],
    },
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = contactSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { tags, firstName, lastName, leadScore, companyId, ownerId, ...rest } = parsed.data;

    const updateData: Record<string, unknown> = { ...rest };
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (leadScore !== undefined) updateData.lead_score = leadScore;
    if (companyId !== undefined) updateData.company_id = companyId;
    if (ownerId !== undefined) updateData.owner_id = ownerId;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    updateData.updated_at = new Date().toISOString();

    const { data: contact, error } = await supabase
      .from("contacts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update contact error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
