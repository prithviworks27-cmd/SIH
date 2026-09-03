import { supabase } from "../config/supabase.js";

// Requests can arrive from either the legacy JWT flow (req.user.id === users.id)
// or a Supabase-session flow (req.user.id === users.auth_user_id) — same
// dual-path lookup authController.getCurrentUser relies on. Every controller
// scoping data to "the current user" needs this, so it's shared rather than
// copy-pasted per controller (it started duplicated in assessmentController.js
// during Step 2; factored out here for the full migration's larger controller count).
export async function resolveUserId(req) {
  if (!req.supabaseUser) return req.user.id;

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", req.user.id)
    .single();

  if (error || !data) return null;
  return data.id;
}
