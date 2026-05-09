import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST() {
  await getSupabase().from("page_views").insert([{}]);
  return NextResponse.json({ ok: true });
}