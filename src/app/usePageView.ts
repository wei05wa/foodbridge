"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SUPABASE_URL = 'https://hjvbdjupknqzynbtwcch.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hcJeLdQ2nTRiwpQJAJOQaQ_GlncxhIN';

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/dashboard')) return;

    // เช็คว่าเครื่องนี้เคยนับไปแล้วหรือยัง
    const key = `pv_visited`;
    const alreadyVisited = localStorage.getItem(key);
    if (alreadyVisited) return; // เคยนับแล้ว ไม่นับซ้ำ

    // ยังไม่เคย → นับ แล้วเก็บ flag ไว้
    localStorage.setItem(key, 'true');

    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
      }),
    });
  }, [pathname]);
}