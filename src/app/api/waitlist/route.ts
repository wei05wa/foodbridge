import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, organization, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from("waitlist")
      .insert([{ name, email, organization, role }]);

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