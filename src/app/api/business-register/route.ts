import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name, last_name, email,
      company_name, company_type, industry, website, phone,
      need_ip_matching, need_product_dev, need_oem,
      need_export, need_legal, need_consulting,
      product_category, target_market, budget_range,
      timeline, has_existing_oem, additional_notes,
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: "กรุณากรอกชื่อและอีเมล" }, { status: 400 });
    }

    const { data, error } = await getSupabase()
      .from("business_profiles")
      .insert([{
        first_name, last_name, email,
        company_name, company_type, industry, website, phone,
        need_ip_matching, need_product_dev, need_oem,
        need_export, need_legal, need_consulting,
        product_category, target_market, budget_range,
        timeline, has_existing_oem, additional_notes,
      }])
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "อีเมลนี้ลงทะเบียนแล้ว" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}