import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { companySchema } from "@/lib/validations";
import { toCamel } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [
    { data: company },
    { data: contacts },
    { data: deals },
    { data: activities },
    { data: notes },
  ] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).single(),
    supabase
      .from("contacts")
      .select("id, first_name, last_name, email, title")
      .eq("company_id", id),
    supabase
      .from("deals")
      .select("*")
      .eq("company_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("activities")
      .select("*")
      .eq("company_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("notes")
      .select("*")
      .eq("company_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    company: toCamel({
      ...(company as object),
      contacts: contacts ?? [],
      deals: deals ?? [],
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
    const parsed = companySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { data: company, error } = await db
      .from("companies")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ company });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
