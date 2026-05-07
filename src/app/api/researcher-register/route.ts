import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name, last_name, email, institution, position, department,
      research_title, research_abstract, research_category,
      has_ip, want_ip_help, want_commercialize, commercialize_note, source_url,
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: "กรุณากรอกชื่อและอีเมล" }, { status: 400 });
    }

    const { error } = await supabase
      .from("researcher_registrations")
      .insert([{
        first_name, last_name, email, institution, position, department,
        research_title, research_abstract, research_category,
        has_ip, want_ip_help, want_commercialize, commercialize_note, source_url,
      }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "อีเมลนี้ลงทะเบียนแล้ว" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}