import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  return createClient(
    "https://hjvbdjupknqzynbtwcch.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdmJkanVwa25xenluYnR3Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTM1MzYsImV4cCI6MjA5MjcyOTUzNn0.PWyNN0slcvgSwOXHub17ZlmjG0VtCT6ccTaF0rTTI7Q"
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