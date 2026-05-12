import { NextResponse } from "next/server";

const FOOD_KEYWORDS = [
  "food","nutrition","nutraceutical","functional food","probiotic",
  "antioxidant","fermentation","extract","bioactive","herb",
];

export async function GET() {
  try {
    // ลอง MUREX Pure API ก่อน
    const res = await fetch(
      `https://murex.mahidol.ac.th/api/publications?` +
      `searchString=${encodeURIComponent("food nutrition nutraceutical herb bioactive")}` +
      `&size=50&offset=0`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // cache 1 ชั่วโมง
      }
    );

    if (!res.ok) throw new Error(`MUREX API: ${res.status}`);

    const data = await res.json();
    const items = (data.items ?? data.results ?? data.publications ?? [])
      .filter((item: any) => {
        const text = `${item.title?.value ?? item.title ?? ""} ${item.abstract?.text ?? ""}`.toLowerCase();
        return FOOD_KEYWORDS.some(kw => text.includes(kw));
      })
      .slice(0, 40)
      .map((item: any) => ({
        uuid: item.uuid ?? crypto.randomUUID(),
        title: item.title?.value ?? item.title ?? "Untitled",
        abstract: item.abstract?.text ?? item.abstract?.value ?? "",
        year: item.publicationStatuses?.[0]?.publicationDate?.year ?? item.year ?? null,
        authors: (item.contributors ?? [])
          .slice(0, 3)
          .map((c: any) => c.name?.lastName
            ? `${c.name.firstName ?? ""} ${c.name.lastName}`.trim()
            : c.displayName ?? "")
          .filter(Boolean),
        journal: item.journalAssociation?.title?.value ?? "Mahidol University",
        doi: item.electronicVersions?.[0]?.doi ?? null,
        url: item.electronicVersions?.[0]?.doi
          ? `https://doi.org/${item.electronicVersions[0].doi}`
          : `https://murex.mahidol.ac.th/en/publications/${item.uuid}`,
      }));

    return NextResponse.json({ source: "murex", items });
  } catch (err) {
    // ถ้า API ล้มเหลว → scrape HTML แทน
    try {
      const res = await fetch("https://murex.mahidol.ac.th/en/publications/?type=%2Fdk%2Fatira%2Fpure%2Fresearchoutput%2Fresearchoutputtypes%2Fcontributiontojournal%2Farticle&nofollow=true", {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const html = await res.text();

      // parse publication entries จาก HTML
      const entries: any[] = [];
      const regex = /<h3[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while ((match = regex.exec(html)) !== null && entries.length < 30) {
        entries.push({
          uuid: crypto.randomUUID(),
          title: match[2].replace(/<[^>]+>/g, "").trim(),
          url: match[1].startsWith("http") ? match[1] : `https://murex.mahidol.ac.th${match[1]}`,
          journal: "Mahidol University",
          abstract: "",
          authors: [],
          year: new Date().getFullYear(),
        });
      }

      return NextResponse.json({ source: "scrape", items: entries });
    } catch {
      return NextResponse.json({ source: "error", items: [] }, { status: 500 });
    }
  }
}