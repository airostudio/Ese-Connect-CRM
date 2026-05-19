import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { noteSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { contactId, dealId, companyId, ...rest } = parsed.data;

    const { data: note, error } = await db
      .from("notes")
      .insert({
        ...rest,
        user_id: session.user?.id ?? null,
        contact_id: contactId ?? null,
        deal_id: dealId ?? null,
        company_id: companyId ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create note error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
