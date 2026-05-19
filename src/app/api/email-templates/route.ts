import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: templates, error } = await supabase
    .from("email_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get email templates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ templates: templates ?? [] });
}
