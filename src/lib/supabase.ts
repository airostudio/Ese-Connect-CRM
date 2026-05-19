import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side only — uses service role key to bypass RLS
// Never import this in client components
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Untyped alias for cases where strict generics cause inference issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;
