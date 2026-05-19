import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    // Public registration always creates agent-level accounts.
    // Role elevation requires an authenticated admin action.
    const { name, email, password } = parsed.data;

    const { data: existing } = await db.from("users").select("id").eq("email", email).single();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const { data: user, error } = await db
      .from("users")
      .insert({ name, email, password: hashed, role: "agent" })
      .select("id, name, email, role")
      .single();

    if (error) {
      console.error("Register error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
