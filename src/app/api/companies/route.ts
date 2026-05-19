import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, db } from "@/lib/supabase";
import { companySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50"), 1), 200);

  let query = supabase
    .from("companies")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search) {
    query = query.or(`name.ilike.%${search}%,industry.ilike.%${search}%`);
  }

  const { data: companies, error, count } = await query;

  if (error) {
    console.error("Get companies error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ companies: companies ?? [], total: count ?? 0 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = companySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { data: company, error } = await db
      .from("companies")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      console.error("Create company error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
