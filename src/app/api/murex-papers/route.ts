import { NextResponse } from "next/server";

const FOOD_KEYWORDS = [
  "food","nutrition","nutraceutical","functional food","probiotic",
  "antioxidant","fermentation","extract","bioactive","herb","supplement",
  "dietary","flavonoid","polyphenol","omega","prebiotic","phytochemical",
];

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("probiotic") || t.includes("microbiome") || t.includes("ferment")) return "probiotic";
  if (t.includes("extract") || t.includes("phytochemical") || t.includes("herb") || t.includes("plant")) return "extract";
  if (t.includes("nutraceutical") || t.includes("supplement") || t.includes("bioactive")) return "nutraceutical";
  if (t.includes("fermentation")) return "fermentation";
  return "functional";
}

function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string {
  if (!invertedIndex) return "";
  const words: [number, string][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) words.push([pos, word]);
  }
  return words.sort((a, b) => a[0] - b[0]).map(w => w[1]).join(" ");
}

export async function GET() {
  try {
    // Mahidol University OpenAlex institution ID = I86987016
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("filter", "authorships.institution.id:I86987016,title.search:food|nutrition|nutraceutical|probiotic|bioactive|herb|fermentation");
    url.searchParams.set("per_page", "50");
    url.searchParams.set("sort", "publication_year:desc");
    url.searchParams.set("select", "id,title,abstract_inverted_index,publication_year,authorships,primary_location,doi");
    url.searchParams.set("mailto", "foodbridge@seabridge.space");

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenAlex ${res.status}: ${txt.slice(0, 200)}`);
    }

    const data = await res.json();

    const items = (data.results ?? []).slice(0, 40).map((w: any) => {
      const abstract = reconstructAbstract(w.abstract_inverted_index);
      const title = w.title ?? "Untitled";
      return {
        uuid: w.id?.replace("https://openalex.org/", "") ?? crypto.randomUUID(),
        title,
        abstract,
        year: w.publication_year ?? null,
        authors: (w.authorships ?? []).slice(0, 3)
          .map((a: any) => a.author?.display_name ?? "").filter(Boolean),
        journal: w.primary_location?.source?.display_name ?? "Mahidol University",
        doi: w.doi?.replace("https://doi.org/", "") ?? null,
        url: w.doi ?? w.id,
        category: detectCategory(`${title} ${abstract}`),
      };
    });

    return NextResponse.json({ source: "openalex", count: items.length, items });
  } catch (err: any) {
    return NextResponse.json({ source: "error", error: err.message, items: [] }, { status: 500 });
  }
}