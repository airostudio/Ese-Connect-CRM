import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { dealSchema } from "@/lib/validations";
import { toCamel } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const stage = searchParams.get("stage") || "";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "100"), 1), 500);
  const sort = searchParams.get("sort") || "createdAt";

  let query = supabase
    .from("deals")
    .select(
      "*, contact:contacts!contact_id(id, first_name, last_name), company:companies!company_id(id, name), owner:users!owner_id(id, name)",
      { count: "exact" }
    )
    .limit(limit);

  if (sort === "value") {
    query = query.order("value", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (stage) {
    query = query.eq("stage", stage);
  }

  const { data: deals, error, count } = await query;

  if (error) {
    console.error("Get deals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ deals: toCamel(deals ?? []), total: count ?? 0 });
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
    const { closeDate, contactId, companyId, ownerId, ...rest } = parsed.data;

    const { data: deal, error } = await db
      .from("deals")
      .insert({
        ...rest,
        close_date: closeDate ?? null,
        contact_id: contactId ?? null,
        company_id: companyId ?? null,
        owner_id: ownerId ?? session.user?.id ?? null,
      })
      .select("*, contact:contacts!contact_id(id, first_name, last_name), company:companies!company_id(id, name)")
      .single();

    if (error) {
      console.error("Create deal error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("Create deal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
