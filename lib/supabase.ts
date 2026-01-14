import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase configuration missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const globalForSupabase = globalThis as typeof globalThis & {
  supabaseAdmin?: SupabaseClient;
};

export const supabaseAdmin =
  globalForSupabase.supabaseAdmin ??
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {},
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}

