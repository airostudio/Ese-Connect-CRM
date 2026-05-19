import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { contactSchema } from "@/lib/validations";
import { toCamel } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50"), 1), 200);
  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("contacts")
    .select("*, owner:users!owner_id(id, name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
    );
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data: contacts, error, count } = await query;

  if (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ contacts: toCamel(contacts ?? []), total: count ?? 0, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { tags, firstName, lastName, leadScore, companyId, ownerId, ...rest } = parsed.data;
    const { data: contact, error } = await db
      .from("contacts")
      .insert({
        ...rest,
        first_name: firstName,
        last_name: lastName,
        lead_score: leadScore,
        company_id: companyId ?? null,
        owner_id: ownerId ?? session.user?.id ?? null,
        tags: JSON.stringify(tags || []),
      })
      .select()
      .single();

    if (error) {
      console.error("Create contact error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Create contact error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
