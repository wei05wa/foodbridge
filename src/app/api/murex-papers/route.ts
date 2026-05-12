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

export async function GET() {
  try {
    const res = await fetch(
      `https://api.openalex.org/works?` +
      `filter=authorships.institutions.display_name:Mahidol University,` +
      `concepts.display_name:food` +
      `&per_page=50` +
      `&sort=publication_year:desc` +
      `&select=id,title,abstract_inverted_index,publication_year,authorships,primary_location,doi,concepts` +
      `&mailto=foodbridge@seabridge.space`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`OpenAlex: ${res.status}`);

    const data = await res.json();

    const items = (data.results ?? [])
      .filter((w: any) => {
        const text = `${w.title ?? ""} ${reconstructAbstract(w.abstract_inverted_index)}`.toLowerCase();
        return FOOD_KEYWORDS.some(kw => text.includes(kw));
      })
      .slice(0, 40)
      .map((w: any) => {
        const abstract = reconstructAbstract(w.abstract_inverted_index);
        const title = w.title ?? "Untitled";
        return {
          uuid: w.id?.replace("https://openalex.org/", "") ?? crypto.randomUUID(),
          title,
          abstract,
          year: w.publication_year ?? null,
          authors: (w.authorships ?? [])
            .slice(0, 3)
            .map((a: any) => a.author?.display_name ?? "")
            .filter(Boolean),
          journal: w.primary_location?.source?.display_name ?? "Mahidol University",
          doi: w.doi?.replace("https://doi.org/", "") ?? null,
          url: w.doi ?? `https://openalex.org/${w.id}`,
          category: detectCategory(`${title} ${abstract}`),
        };
      });

    return NextResponse.json({ source: "openalex", count: items.length, items });
  } catch (err: any) {
    return NextResponse.json({ source: "error", error: err.message, items: [] }, { status: 500 });
  }
}

/* OpenAlex เก็บ abstract แบบ inverted index → ต้อง reconstruct */
function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string {
  if (!invertedIndex) return "";
  const words: [number, string][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words.push([pos, word]);
    }
  }
  return words.sort((a, b) => a[0] - b[0]).map(w => w[1]).join(" ");
}