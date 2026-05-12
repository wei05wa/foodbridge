import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://murex.mahidol.ac.th/en/publications/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    // ส่ง HTML 3000 ตัวอักษรแรกกลับมาดู structure
    return NextResponse.json({ 
      status: res.status, 
      preview: html.slice(0, 3000) 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}