import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { type Fetch } from "@supabase/auth-js";
import { Agent } from "https";
import fetch, { type RequestInit } from "node-fetch";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase configuration missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const httpsAgent = new Agent({ rejectUnauthorized: false });

type Fetch = typeof fetch;

const fetchWithAgent: Fetch = (url, options) =>
  fetch(url, { ...options, agent: httpsAgent });

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
    global: {
      fetch: fetchWithAgent as typeof fetch,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}

