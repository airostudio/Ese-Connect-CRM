import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [usersRes, contactsRes, dealsRes, companiesRes] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
  ]);

  const users = usersRes.count ?? 0;

  return NextResponse.json({
    users,
    contacts: contactsRes.count ?? 0,
    deals: dealsRes.count ?? 0,
    companies: companiesRes.count ?? 0,
    seeded: users > 0,
  });
}
