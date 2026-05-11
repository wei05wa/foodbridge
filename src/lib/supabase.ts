import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  return createClient(
    "https://hjvbdjupknqzynbtwcch.supabase.co",
    "sb_publishable_hcJeLdQ2nTRiwpQJAJOQaQ_GlncxhIN"
  );
}





/*import { createClient } from "@supabase/supabase-js";

// getSupabase() is called at runtime (inside request handlers),
// never at module evaluation time — so build never crashes.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createClient(url, key);
}*/