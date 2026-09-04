import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// createClient appends /rest/v1 internally, so accept either the project URL
// or a mistakenly copied REST endpoint without generating a doubled path.
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "");
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  supabaseServiceRoleKey
    ? { auth: { autoRefreshToken: false, persistSession: false } }
    : undefined
);
