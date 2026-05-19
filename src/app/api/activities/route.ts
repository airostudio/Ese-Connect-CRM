import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { activitySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const typeFilter = searchParams.get("type") || "";
  const contactId = searchParams.get("contactId") || "";
  const dealId = searchParams.get("dealId") || "";

  let query = supabase
    .from("activities")
    .select(
      "*, user:users!user_id(id, name), contact:contacts!contact_id(id, first_name, last_name), deal:deals!deal_id(id, title)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (typeFilter) query = query.eq("type", typeFilter);
  if (contactId) query = query.eq("contact_id", contactId);
  if (dealId) query = query.eq("deal_id", dealId);

  const { data: activities, error } = await query;

  if (error) {
    console.error("Get activities error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ activities: activities ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = activitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const activityType = parsed.data.type;
    const activityTitle = parsed.data.title;
    const activityDescription = parsed.data.description ?? null;
    const contactId = parsed.data.contactId ?? null;
    const dealId = parsed.data.dealId ?? null;
    const companyId = parsed.data.companyId ?? null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase as any;
    const { data: activity, error } = await client
      .from("activities")
      .insert({
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        user_id: session.user?.id ?? null,
        contact_id: contactId,
        deal_id: dealId,
        company_id: companyId,
      })
      .select()
      .single();

    if (error) {
      console.error("Create activity error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Update deal last_activity_at if related
    if (dealId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("deals")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("id", dealId);
    }

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
