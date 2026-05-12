"use client";
import { useState } from "react";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  year: number;
  authors: string[];
  journal: string;
  university: string;
  category: string;
  marketSize: string;
  valuation: string;
  fitScore: number;
  tags: string[];
  doi?: string;
}

const PAPERS: Paper[] = [
  // ── MAHIDOL ──
  {
    id: "m1", university: "Mahidol", category: "nutraceutical",
    title: "Mangosteen Xanthone Extract: Potent Anti-inflammatory Nutraceutical",
    abstract: "Bioactive xanthone compounds from Garcinia mangostana pericarp show DPPH IC50 = 12.3 μg/mL antioxidant activity and significant anti-inflammatory effects in LPS-induced macrophage models.",
    year: 2023, journal: "Food Chemistry",
    authors: ["Suwimol Charoenwong", "Piyawan Prasertsan", "Natthida Weerapreeyakul"],
    marketSize: "$8.5B", valuation: "฿15–40M", fitScore: 92,
    tags: ["Anti-inflammatory", "Antioxidant", "Cosmeceutical", "Supplement"],
  },
  {
    id: "m2", university: "Mahidol", category: "probiotic",
    title: "Thai Fermented Food Lactobacillus: Next-Gen Probiotic Strains",
    abstract: "12 Lactobacillus strains from traditional nham and som-fak show superior Caco-2 adhesion and inhibit Salmonella & E. coli — prime candidates for functional food development.",
    year: 2023, journal: "LWT – Food Science",
    authors: ["Chompoonik Panpipat", "Wijak Kongkachuichai"],
    marketSize: "$71B", valuation: "฿20–60M", fitScore: 88,
    tags: ["Probiotic", "Gut Health", "Fermented Food", "OEM-Ready"],
  },
  {
    id: "m3", university: "Mahidol", category: "extract",
    title: "Curcumin Nanoparticles: 38× Bioavailability Breakthrough",
    abstract: "PLGA nano-encapsulation increases curcumin water solubility 45-fold and oral bioavailability 38×. Cytotoxic against HeLa and MCF-7 cancer lines — validated for nutraceutical and pharma applications.",
    year: 2024, journal: "Int. J. Pharmaceutics",
    authors: ["Waree Tiyaboonchai", "Supason Wanichwecharungruang"],
    marketSize: "$120B", valuation: "฿50–150M", fitScore: 95,
    tags: ["Nano-encapsulation", "High Bioavailability", "Cancer Prevention", "Patent-pending"],
  },
  {
    id: "m4", university: "Mahidol", category: "functional",
    title: "Low-GI Resistant Starch from Thai Jasmine Rice (GI = 28)",
    abstract: "RS3 resistant starch from retrograded jasmine rice achieves GI of 28 vs 89 for native rice. Bread with 30% RS3 shows prebiotic potential — ready for diabetic-friendly product line.",
    year: 2023, journal: "Carbohydrate Polymers",
    authors: ["Rungnaphar Pongsawatmanit", "Onanong Naivikul"],
    marketSize: "$15B", valuation: "฿10–30M", fitScore: 85,
    tags: ["Diabetic-friendly", "Prebiotic", "Low GI", "Bakery"],
  },
  {
    id: "m5", university: "Mahidol", category: "probiotic",
    title: "Thai Agave Synbiotic: 68% Pathogen Reduction in Gut Model",
    abstract: "FOS from Agave sisalana paired with Bifidobacterium longum BB536 reduces pathogenic bacteria 68% and strengthens intestinal barrier — validated synbiotic combination.",
    year: 2023, journal: "Food Research International",
    authors: ["Apinya Sookwong", "Suganya Wisuthiphaet"],
    marketSize: "$71B", valuation: "฿25–70M", fitScore: 90,
    tags: ["Synbiotic", "Gut Microbiome", "Immunity", "Beverage"],
  },
  {
    id: "m6", university: "Mahidol", category: "nutraceutical",
    title: "Purple Corn Anthocyanins: −31% LDL Cholesterol in Animal Models",
    abstract: "Thai purple corn C3G and pelargonidin-3-glucoside reduce LDL 31%, total cholesterol 23%, and inflammatory markers IL-6 & TNF-α — validated cardiovascular nutraceutical.",
    year: 2022, journal: "Nutrients",
    authors: ["Niwat Chongviriyaphan", "Wanna Phiromchom"],
    marketSize: "$50B", valuation: "฿30–80M", fitScore: 87,
    tags: ["Heart Health", "Cardiovascular", "Natural Colorant", "Supplement"],
  },
  {
    id: "m7", university: "Mahidol", category: "functional",
    title: "Noni Fermented Beverage: −41% Fasting Blood Glucose in Diabetic Models",
    abstract: "L. acidophilus–fermented Noni juice with enhanced iridoid bioavailability reduces FBG 41%, HbA1c 27%, and liver enzymes (AST/ALT) — ready for antidiabetic beverage market.",
    year: 2024, journal: "Journal of Functional Foods",
    authors: ["Urai Suthisisang", "Panthip Ruangrungsi", "Porntip Siripong"],
    marketSize: "$200B", valuation: "฿40–100M", fitScore: 91,
    tags: ["Anti-diabetic", "Functional Beverage", "Clinical Validated", "RTD"],
  },
  {
    id: "m8", university: "Mahidol", category: "extract",
    title: "Butterfly Pea Flower: Natural Blue Colorant with ACE-Inhibitory Activity",
    abstract: "UAE extraction of Clitoria ternatea achieves TPC = 54.2 mg GAE/g and ACE-inhibitory IC50 = 0.48 mg/mL — antimicrobial, stable blue color at neutral pH. Dual-use: food colorant + functional ingredient.",
    year: 2023, journal: "Ultrasonics Sonochemistry",
    authors: ["Siwaporn Longsomboon", "Rungpetch Sakulnarmrat"],
    marketSize: "$3.5B", valuation: "฿15–45M", fitScore: 89,
    tags: ["Natural Colorant", "Blood Pressure", "Beverage", "Cosmetic"],
  },
  {
    id: "m9", university: "Mahidol", category: "nutraceutical",
    title: "Thai Long Pepper Piperine Complex: 6.8× Bioavailability for Joint Health",
    abstract: "Phospholipid-piperine complex from Piper retrofractum shows 6.8× oral bioavailability vs free piperine; suppresses COX-2 and NF-κB pathways in arthritis models.",
    year: 2022, journal: "Phytomedicine",
    authors: ["Benjamart Chaisupa", "Nontima Vardhanabhuti"],
    marketSize: "$18B", valuation: "฿20–55M", fitScore: 84,
    tags: ["Joint Health", "Anti-arthritic", "Enhanced Absorption", "OEM"],
  },
  {
    id: "m10", university: "Mahidol", category: "functional",
    title: "Squid By-product Omega-3: 94.2% Encapsulation Efficiency for UHT Milk",
    abstract: "Microencapsulated omega-3 from squid hepatopancreas waste achieves 94.2% efficiency, stable 12 months at 4°C, no off-flavor. Fortified UHT milk meets FDA DHA/EPA recommendation.",
    year: 2024, journal: "Food Hydrocolloids",
    authors: ["Thanaset Sunphorka", "Siriporn Prichapan"],
    marketSize: "$4.2B", valuation: "฿12–35M", fitScore: 82,
    tags: ["Omega-3", "Dairy", "Upcycled", "Encapsulation"],
  },
  {
    id: "m11", university: "Mahidol", category: "extract",
    title: "Thai Holy Basil (Ocimum tenuiflorum): Anti-diabetic & Cardioprotective Bioactives",
    abstract: "Eugenol, rosmarinic acid and ursolic acid from Thai basil show anti-diabetic, cardioprotective, and adaptogenic properties — well-validated for functional food incorporation.",
    year: 2022, journal: "Journal of Ethnopharmacology",
    authors: ["Jutamas Jittiwat", "Pharkphoom Panichayupakaranant"],
    marketSize: "$8.5B", valuation: "฿8–25M", fitScore: 80,
    tags: ["Adaptogen", "Anti-diabetic", "Herbal Extract", "Ingredient"],
  },
  {
    id: "m12", university: "Mahidol", category: "fermentation",
    title: "Sugarcane Bagasse Fermentation: Bioethanol + Ferulic Acid Byproducts",
    abstract: "Thai Trichoderma and Aspergillus strains produce 18.4 g bioethanol/100g biomass + ferulic acid (420 mg/kg) and vanillin (210 mg/kg) — valuable cosmetic and food additive byproducts.",
    year: 2023, journal: "Bioresource Technology",
    authors: ["Ratana Sapan", "Klanarong Sriroth"],
    marketSize: "$6B", valuation: "฿20–50M", fitScore: 78,
    tags: ["Circular Economy", "Natural Flavors", "Cosmetic Ingredient", "Upcycled"],
  },

  // ── CHULALONGKORN (CUIP) ──
  {
    id: "c1", university: "Chulalongkorn", category: "nutraceutical",
    title: "Riceberry Anthocyanin Complex: Neuroprotective & Anti-aging Ingredient",
    abstract: "High-anthocyanin Riceberry rice extract demonstrates strong neuroprotective activity, inhibits AChE (Alzheimer marker), and shows potent ORAC antioxidant capacity — premium ingredient for anti-aging market.",
    year: 2023, journal: "Food & Function",
    authors: ["Sirichai Adisakwattana", "Worawan Boonsupthip"],
    marketSize: "$62B", valuation: "฿35–90M", fitScore: 93,
    tags: ["Anti-aging", "Brain Health", "Premium Ingredient", "Neutraceutical"],
  },
  {
    id: "c2", university: "Chulalongkorn", category: "probiotic",
    title: "Postbiotic Technology: Heat-killed Probiotics with 2-Year Shelf Life",
    abstract: "Novel postbiotic platform using inactivated Lactobacillus strains maintains immunomodulatory activity without cold chain. Achieves 2-year shelf stability — breakthrough for ambient probiotic products.",
    year: 2024, journal: "Trends in Food Science",
    authors: ["Pattarin Longtap", "Nattacha Buchkert"],
    marketSize: "$71B", valuation: "฿60–180M", fitScore: 96,
    tags: ["Postbiotic", "Shelf-stable", "Immunity", "Disruptive Tech"],
  },
  {
    id: "c3", university: "Chulalongkorn", category: "extract",
    title: "Pandan Leaf Volatiles: Natural Flavor + Antidiabetic Dual Function",
    abstract: "GC-MS profiling of Pandanus amaryllifolius identifies 2-acetyl-1-pyrroline and flavonoid glycosides with α-glucosidase inhibitory activity (IC50 = 180 μg/mL) — natural flavor + functional claim potential.",
    year: 2023, journal: "Food Chemistry",
    authors: ["Natta Laohakunjit", "Sittiwat Lertsiri"],
    marketSize: "$4.8B", valuation: "฿10–28M", fitScore: 83,
    tags: ["Natural Flavor", "Anti-diabetic", "Thai Herb", "Dual Claim"],
  },
  {
    id: "c4", university: "Chulalongkorn", category: "functional",
    title: "Insect Protein Flour: 70% Protein, Full Amino Acid Profile, GRAS-ready",
    abstract: "Acheta domesticus (cricket) flour achieves 70% protein content with complete BCAA profile, superior iron and B12 bioavailability. Sensory-optimized for bread and pasta — GRAS status pathway mapped.",
    year: 2024, journal: "Food Quality and Preference",
    authors: ["Jiraporn Ungcharoenwiwat", "Pitiporn Ritthiruangdej"],
    marketSize: "$9.6B", valuation: "฿45–120M", fitScore: 88,
    tags: ["Alternative Protein", "Insect Protein", "Sustainability", "Sports Nutrition"],
  },
  {
    id: "c5", university: "Chulalongkorn", category: "nutraceutical",
    title: "Galangal Root Extract: Potent Anti-cancer + Anti-obesity Dual Activity",
    abstract: "Alpinia galanga rhizome acetoxychavicol acetate (ACA) shows apoptosis induction in colon cancer cells (IC50 = 3.2 μg/mL) and adipogenesis inhibition — validated for oncology supplement and weight management.",
    year: 2023, journal: "Journal of Ethnopharmacology",
    authors: ["Apichart Suksamrarn", "Chatchai Muanprasat"],
    marketSize: "$25B", valuation: "฿30–85M", fitScore: 86,
    tags: ["Anti-cancer", "Weight Management", "Thai Herb", "High-value Extract"],
  },
  {
    id: "c6", university: "Chulalongkorn", category: "fermentation",
    title: "Precision Fermentation: Animal-free Whey Protein via Engineered Yeast",
    abstract: "Engineered Pichia pastoris produces β-lactoglobulin identical to bovine whey — 98% purity, fully functional in gels and foams. Animal-free, allergen-reduced positioning for premium protein market.",
    year: 2024, journal: "Nature Food",
    authors: ["Wanchai Assavalapsakul", "Narin Lailerd"],
    marketSize: "$65B", valuation: "฿80–250M", fitScore: 97,
    tags: ["Precision Fermentation", "Alternative Dairy", "Deep Tech", "Export-ready"],
  },
  {
    id: "c7", university: "Chulalongkorn", category: "extract",
    title: "Moringa Leaf Nano-emulsion: Stable Iron Fortification for RTD Beverages",
    abstract: "Moringa oleifera nano-emulsion achieves 94% iron bioaccessibility — 3× conventional fortification. Stable in acidic beverages up to 6 months. Targets iron deficiency in SEA markets.",
    year: 2023, journal: "Food & Function",
    authors: ["Onanong Naivikul", "Vudhiporn Limpawattana"],
    marketSize: "$3.2B", valuation: "฿18–50M", fitScore: 85,
    tags: ["Iron Fortification", "Nano-emulsion", "RTD Beverage", "SEA Market"],
  },
  {
    id: "c8", university: "Chulalongkorn", category: "functional",
    title: "Mung Bean Peptides: ACE-inhibitory Antihypertensive Functional Ingredient",
    abstract: "Enzymatic hydrolysis of Vigna radiata produces peptides with ACE-inhibitory activity (IC50 = 0.21 mg/mL) — comparable to captopril. Water-soluble, heat-stable, suitable for beverage fortification.",
    year: 2022, journal: "Food Research International",
    authors: ["Ekachai Chukeatirote", "Saowakon Wongsagonsup"],
    marketSize: "$15B", valuation: "฿22–65M", fitScore: 87,
    tags: ["Blood Pressure", "Plant Peptide", "Functional Beverage", "Clinical Data"],
  },
  {
    id: "c9", university: "Chulalongkorn", category: "nutraceutical",
    title: "Turmeric-Black Pepper Bioavailability Stack: 20× Enhanced Curcumin Absorption",
    abstract: "Optimized curcumin:piperine ratio (20:1) with phospholipid carrier achieves 20× oral bioavailability vs standard curcumin. Validated anti-inflammatory and liver-protective effects.",
    year: 2023, journal: "Pharmaceutics",
    authors: ["Aroonsri Priprem", "Nattawut Leelapornpisid"],
    marketSize: "$120B", valuation: "฿25–70M", fitScore: 90,
    tags: ["Enhanced Bioavailability", "Anti-inflammatory", "Liver Health", "Supplement Stack"],
  },
  {
    id: "c10", university: "Chulalongkorn", category: "probiotic",
    title: "Kefir-Derived Exopolysaccharides: Prebiotic + Texture Agent Dual Function",
    abstract: "EPS from kefir grains demonstrate prebiotic score of 1.82 (vs inulin = 1.51) and superior water-holding capacity for fat-reduced dairy. Dual claim: gut health + clean-label texturizer.",
    year: 2024, journal: "LWT – Food Science",
    authors: ["Suwimon Keeratipibul", "Wunwisa Krasaekoopt"],
    marketSize: "$71B", valuation: "฿20–55M", fitScore: 86,
    tags: ["Prebiotic", "Dairy Innovation", "Clean Label", "Texturizer"],
  },
  {
    id: "c11", university: "Chulalongkorn", category: "extract",
    title: "Fingerroot (Krachai) Anti-viral Extract: Post-COVID Immunity Ingredient",
    abstract: "Boesenbergia rotunda panduratin A and cardamonin demonstrate antiviral activity against SARS-CoV-2 in vitro (IC50 = 8.5 μM) and strong NF-κB inhibition — timely for immunity supplement market.",
    year: 2023, journal: "Phytomedicine",
    authors: ["Nuntavan Bunyapraphatsara", "Jiradej Manosroi"],
    marketSize: "$28B", valuation: "฿30–90M", fitScore: 91,
    tags: ["Anti-viral", "Immunity", "Post-COVID", "Thai Herb Premium"],
  },
  {
    id: "c12", university: "Chulalongkorn", category: "fermentation",
    title: "Koji Fermentation of Thai Grains: Umami + GABA Biofortification",
    abstract: "Aspergillus oryzae koji on jasmine rice and sorghum boosts GABA content 8× and free amino acids 4× — natural umami enhancer with stress-relief functional claim. Supports MSG-reduction trend.",
    year: 2023, journal: "Food Microbiology",
    authors: ["Suttipun Keawsompong", "Dudsadee Uttamapinant"],
    marketSize: "$5.5B", valuation: "฿15–40M", fitScore: 83,
    tags: ["GABA", "Umami", "Fermentation", "Stress Relief"],
  },
  {
    id: "c13", university: "Chulalongkorn", category: "functional",
    title: "Plant-based Egg White Analog from Chickpea Aquafaba: Foam + Gel Function",
    abstract: "Optimized chickpea aquafaba protein concentrate achieves foaming capacity 320% (vs egg white 280%) and gelation at 72°C. Vegan, allergen-friendly — validated in meringue, mayonnaise, and ice cream.",
    year: 2024, journal: "Food Hydrocolloids",
    authors: ["Thepkunya Harnsilawat", "Pinthip Rumpagaporn"],
    marketSize: "$9.6B", valuation: "฿35–95M", fitScore: 89,
    tags: ["Vegan", "Egg Replacement", "Plant-based", "Export-ready"],
  },
  {
    id: "c14", university: "Chulalongkorn", category: "nutraceutical",
    title: "Tamarind Seed Proanthocyanidins: UV Protection + Collagen Synthesis",
    abstract: "Tamarind seed coat proanthocyanidins (OPC) show UV-B protection (SPF equivalent 12) and stimulate collagen type I synthesis 2.3× in human fibroblasts — nutraceutical + cosmeceutical dual positioning.",
    year: 2022, journal: "Journal of Functional Foods",
    authors: ["Suthiluk Patumraj", "Pharkphoom Panichayupakaranant"],
    marketSize: "$62B", valuation: "฿28–75M", fitScore: 88,
    tags: ["Skin Health", "Collagen", "UV Protection", "Beauty-from-within"],
  },
  {
    id: "c15", university: "Chulalongkorn", category: "extract",
    title: "Longan Seed Polyphenols: Anti-glycation Agent for Diabetic Complication Prevention",
    abstract: "Dimocarpus longan seed extract inhibits AGE formation 78% at 100 μg/mL and reduces oxidative stress in hyperglycemic cell models — novel anti-glycation ingredient for diabetic-focused supplements.",
    year: 2023, journal: "Food Chemistry",
    authors: ["Ratana Sapan", "Sirichai Adisakwattana"],
    marketSize: "$25B", valuation: "฿20–58M", fitScore: 85,
    tags: ["Anti-glycation", "Diabetes Complication", "Polyphenol", "Waste Upcycling"],
  },
];

const CATS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "nutraceutical", label: "Nutraceutical" },
  { id: "functional", label: "Functional Food" },
  { id: "probiotic", label: "Probiotic / Postbiotic" },
  { id: "extract", label: "Plant Extract" },
  { id: "fermentation", label: "Fermentation Tech" },
];

const CAT_META: Record<string, { color: string; bg: string; accent: string; emoji: string }> = {
  nutraceutical: { color: "#92400E", bg: "#FEF3C7", accent: "#F59E0B", emoji: "💊" },
  functional:    { color: "#1E3A5F", bg: "#DBEAFE", accent: "#3B82F6", emoji: "🥗" },
  probiotic:     { color: "#065F46", bg: "#D1FAE5", accent: "#10B981", emoji: "🦠" },
  extract:       { color: "#4C1D95", bg: "#EDE9FE", accent: "#8B5CF6", emoji: "🌿" },
  fermentation:  { color: "#7F1D1D", bg: "#FEE2E2", accent: "#EF4444", emoji: "🧪" },
};

const UNI_META: Record<string, { color: string; short: string }> = {
  "Mahidol":        { color: "#1A56A5", short: "MU" },
  "Chulalongkorn":  { color: "#8B0000", short: "CU" },
};

type RegStatus = "idle" | "loading" | "success" | "error";

export default function ResearcherPage() {
  const [search, setSearch]       = useState("");
  const [cat, setCat]             = useState("all");
  const [uni, setUni]             = useState("all");
  const [selected, setSelected]   = useState<Paper | null>(null);
  const [sortBy, setSortBy]       = useState<"fit" | "year" | "valuation">("fit");

  const filtered = PAPERS
    .filter(p => {
      const text = `${p.title} ${p.abstract} ${p.tags.join(" ")}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      const matchCat = cat === "all" || p.category === cat;
      const matchUni = uni === "all" || p.university === uni;
      return matchSearch && matchCat && matchUni;
    })
    .sort((a, b) => {
      if (sortBy === "fit") return b.fitScore - a.fitScore;
      if (sortBy === "year") return b.year - a.year;
      return 0;
    });

  return (
    <>
      <style>{CSS}</style>
      <div className="rp">

        {/* ── NAV ── */}
        <nav className="rp-nav">
          <a href="/" className="rp-nav__logo">
            <div className="rp-nav__logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            FoodBridge<span>IP</span>
          </a>
          <div className="rp-nav__right">
            <span className="rp-nav__bc">/ Research Hub</span>
            <a href="#register" className="rp-nav__cta">ลงทะเบียนนักวิจัย →</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <header className="rp-hero">
          <div className="rp-hero__grid-bg"/>
          <div className="rp-hero__glow"/>
          <div className="rp-hero__inner">
            <div className="rp-hero__pill">
              <span className="rp-hero__live-dot"/>
              Mahidol × Chulalongkorn × FoodBridge IP
            </div>
            <h1 className="rp-hero__h1">
              งานวิจัยอาหารไทย<br/>
              <span className="rp-hero__h1-em">พร้อมสร้างมูลค่าเชิงธุรกิจ</span>
            </h1>
            <p className="rp-hero__sub">
              {PAPERS.length} งานวิจัยคัดสรรจาก 2 มหาวิทยาลัยชั้นนำ พร้อม market sizing และ valuation estimate
              สำหรับนักธุรกิจที่ต้องการต่อยอดสู่ผลิตภัณฑ์จริง
            </p>
            <div className="rp-hero__stats">
              {[
                { n: `${PAPERS.length}`, l: "งานวิจัย" },
                { n: "2", l: "มหาวิทยาลัย" },
                { n: "฿8M–250M", l: "Valuation Range" },
                { n: "97%", l: "Top Fit Score" },
              ].map(s => (
                <div className="rp-hero__stat" key={s.l}>
                  <div className="rp-hero__stat-n">{s.n}</div>
                  <div className="rp-hero__stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── FILTER BAR ── */}
        <div className="rp-bar">
          <div className="rp-bar__inner">
            <div className="rp-bar__search-wrap">
              <svg className="rp-bar__search-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="rp-bar__search" placeholder="ค้นหา เช่น probiotic, curcumin, anti-aging..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="rp-bar__pills">
              {CATS.map(c => (
                <button key={c.id} className={`rp-pill ${cat === c.id ? "rp-pill--on" : ""}`} onClick={() => setCat(c.id)}>{c.label}</button>
              ))}
            </div>
            <div className="rp-bar__pills">
              {["all","Mahidol","Chulalongkorn"].map(u => (
                <button key={u} className={`rp-pill rp-pill--uni ${uni === u ? "rp-pill--on" : ""}`} onClick={() => setUni(u)}>
                  {u === "all" ? "ทุกมหาวิทยาลัย" : u}
                </button>
              ))}
            </div>
            <div className="rp-bar__sort">
              <span>เรียงโดย</span>
              {[["fit","Business Fit"],["year","ล่าสุด"]] .map(([v,l]) => (
                <button key={v} className={`rp-sort-btn ${sortBy === v ? "rp-sort-btn--on" : ""}`} onClick={() => setSortBy(v as any)}>{l}</button>
              ))}
            </div>
            <div className="rp-bar__count">พบ <strong>{filtered.length}</strong> งานวิจัย</div>
          </div>
        </div>

        {/* ── GRID ── */}
        <main className="rp-grid-wrap">
          <div className="rp-grid">
            {filtered.map(p => <PaperCard key={p.id} paper={p} onClick={() => setSelected(p)} />)}
          </div>
          {filtered.length === 0 && (
            <div className="rp-empty">
              <div style={{fontSize:"2.5rem"}}>🔍</div>
              <p>ไม่พบงานวิจัยที่ตรงกัน</p>
              <button onClick={() => { setSearch(""); setCat("all"); setUni("all"); }}>ล้างตัวกรอง</button>
            </div>
          )}
        </main>

        {/* ── REGISTER ── */}
        <RegisterSection />

      </div>

      {selected && <DetailDrawer paper={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ─── PAPER CARD ─── */
function PaperCard({ paper, onClick }: { paper: Paper; onClick: () => void }) {
  const cat = CAT_META[paper.category] ?? CAT_META.nutraceutical;
  const uni = UNI_META[paper.university];
  const score = paper.fitScore;

  return (
    <div className="rcard" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick()}>
      {/* Header stripe */}
      <div className="rcard__stripe" style={{ background: `linear-gradient(135deg, ${cat.accent}22, ${cat.accent}08)`, borderBottom: `2px solid ${cat.accent}33` }}>
        <div className="rcard__top-row">
          <span className="rcard__cat-tag" style={{ background: cat.bg, color: cat.color }}>
            {cat.emoji} {paper.category === "nutraceutical" ? "Nutraceutical" :
              paper.category === "functional" ? "Functional Food" :
              paper.category === "probiotic" ? "Probiotic" :
              paper.category === "extract" ? "Plant Extract" : "Fermentation"}
          </span>
          <div className="rcard__fit-badge" style={{ background: score >= 90 ? "#D1FAE5" : score >= 85 ? "#FEF3C7" : "#F3F4F6", color: score >= 90 ? "#065F46" : score >= 85 ? "#92400E" : "#374151" }}>
            ⚡ {score}% fit
          </div>
        </div>
        <div className="rcard__meta-row">
          <span className="rcard__uni" style={{ background: uni.color }}>{uni.short}</span>
          <span className="rcard__year">{paper.year}</span>
          <span className="rcard__journal">{paper.journal}</span>
        </div>
      </div>

      {/* Body */}
      <div className="rcard__body">
        <h3 className="rcard__title">{paper.title}</h3>
        <p className="rcard__abstract">{paper.abstract.slice(0, 130)}…</p>

        {/* Tags */}
        <div className="rcard__tags">
          {paper.tags.slice(0, 3).map(t => (
            <span key={t} className="rcard__tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer: valuation */}
      <div className="rcard__footer">
        <div className="rcard__val-block">
          <div className="rcard__val-label">Market Size</div>
          <div className="rcard__val-num">{paper.marketSize}</div>
        </div>
        <div className="rcard__val-divider"/>
        <div className="rcard__val-block">
          <div className="rcard__val-label">Est. Valuation</div>
          <div className="rcard__val-num" style={{ color: "#6D28D1" }}>{paper.valuation}</div>
        </div>
        <button className="rcard__btn">ดูรายละเอียด →</button>
      </div>
    </div>
  );
}

/* ─── DETAIL DRAWER ─── */
function DetailDrawer({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  const cat = CAT_META[paper.category] ?? CAT_META.nutraceutical;
  const uni = UNI_META[paper.university];
  return (
    <>
      <div className="rd-overlay" onClick={onClose} />
      <div className="rd-drawer">
        {/* Header */}
        <div className="rd-header" style={{ background: `linear-gradient(160deg, #0F0A1E, #1E0A3C)`, borderBottom: `3px solid ${cat.accent}` }}>
          <button className="rd-close" onClick={onClose}>✕</button>
          <div className="rd-header__top">
            <span className="rd-cat-tag" style={{ background: cat.bg, color: cat.color }}>{cat.emoji} {paper.category}</span>
            <span className="rd-uni-tag" style={{ background: uni.color }}>{paper.university}</span>
          </div>
          <h2 className="rd-title">{paper.title}</h2>
          <div className="rd-header__meta">
            <span>📅 {paper.year}</span>
            <span>📖 {paper.journal}</span>
            <span style={{ color: paper.fitScore >= 90 ? "#86efac" : "#fde68a" }}>⚡ {paper.fitScore}% Business Fit</span>
          </div>
        </div>

        <div className="rd-body">
          {/* Business Valuation Box */}
          <div className="rd-biz-box">
            <div className="rd-biz-title">📊 Business Intelligence</div>
            <div className="rd-biz-grid">
              <div className="rd-biz-item">
                <div className="rd-biz-label">Global Market Size</div>
                <div className="rd-biz-value">{paper.marketSize}</div>
              </div>
              <div className="rd-biz-item">
                <div className="rd-biz-label">Est. IP Valuation (TH)</div>
                <div className="rd-biz-value" style={{ color: "#7C3AED" }}>{paper.valuation}</div>
              </div>
              <div className="rd-biz-item">
                <div className="rd-biz-label">Business Fit Score</div>
                <div className="rd-biz-value">{paper.fitScore}/100</div>
              </div>
              <div className="rd-biz-item">
                <div className="rd-biz-label">Commercialize Path</div>
                <div className="rd-biz-value" style={{ fontSize: ".85rem" }}>OEM · White-label · License</div>
              </div>
            </div>
          </div>

          {/* Abstract */}
          <div className="rd-section">
            <div className="rd-sec-title">🔬 งานวิจัย</div>
            <p className="rd-text">{paper.abstract}</p>
          </div>

          {/* Authors */}
          <div className="rd-section">
            <div className="rd-sec-title">👨‍🔬 ทีมวิจัย</div>
            <p className="rd-text">{paper.authors.join(", ")}{paper.authors.length >= 3 ? " et al." : ""}</p>
          </div>

          {/* Tags */}
          <div className="rd-section">
            <div className="rd-sec-title">🏷️ Application Areas</div>
            <div className="rd-tags">
              {paper.tags.map(t => <span key={t} className="rd-tag">{t}</span>)}
            </div>
          </div>

          {/* CTA */}
          <div className="rd-potential">
            <div className="rd-potential-title">💡 โอกาสสำหรับนักธุรกิจ</div>
            <p className="rd-potential-text">
              งานวิจัยนี้มีศักยภาพต่อยอดสู่ผลิตภัณฑ์ในตลาด {paper.marketSize} ระดับโลก
              ทีม FoodBridge IP จะช่วยประเมิน IP valuation, จับคู่นักวิจัย, และดูแลกระบวนการ licensing ให้ครบจบ
            </p>
          </div>
        </div>

        <div className="rd-footer">
          <a href="#register" className="rd-btn-primary" onClick={onClose}>
            สนใจต่อยอดงานวิจัยนี้ →
          </a>
          <a href="mailto:contact@seabridge.space" className="rd-btn-outline">
            ติดต่อทีมงาน
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── REGISTER SECTION ─── */
type RegStatus = "idle" | "loading" | "success" | "error";
function RegisterSection() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    institution: "", position: "", department: "",
    research_title: "", research_abstract: "", research_category: "",
    has_ip: "" as "" | "yes" | "no",
    want_ip_help: false,
    want_commercialize: "" as "" | "yes" | "no" | "unsure",
    commercialize_note: "",
  });
  const [status, setStatus] = useState<RegStatus>("idle");
  const [err, setErr] = useState("");
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.email) { setErr("กรุณากรอกชื่อและอีเมล"); return; }
    setStatus("loading"); setErr("");
    try {
      const res = await fetch("/api/researcher-register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          has_ip: form.has_ip === "yes" ? true : form.has_ip === "no" ? false : null,
          want_ip_help: form.has_ip === "no" ? form.want_ip_help : false,
          want_commercialize: form.want_commercialize === "yes" ? true : form.want_commercialize === "no" ? false : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "เกิดข้อผิดพลาด"); setStatus("error"); return; }
      setStatus("success");
    } catch { setErr("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"); setStatus("error"); }
  };

  return (
    <section className="rreg" id="register">
      <div className="rreg__inner">
        <div className="rreg__copy">
          <div className="rreg__eyebrow"><span className="rreg__dot"/>สำหรับนักวิจัย</div>
          <h2 className="rreg__h2">อยากเผยแพร่งานวิจัย<br/>หรือ<em> ต่อยอดกับนักธุรกิจ?</em></h2>
          <p className="rreg__desc">ลงทะเบียนงานวิจัยของคุณกับ FoodBridge IP เราจะช่วยประเมินศักยภาพเชิงพาณิชย์ ดูแลเรื่อง IP และจับคู่กับผู้ประกอบการที่เหมาะสม</p>
          <div className="rreg__perks">
            {["ฟรีตลอด Early Access","ประเมิน business potential ให้","ดูแล IP filing ให้ถ้าต้องการ","จับคู่กับ SME ที่ตรงกับงานวิจัย"].map(t => (
              <div className="rreg__perk" key={t}><span className="rreg__perk-check">✓</span>{t}</div>
            ))}
          </div>
        </div>
        <div className="rreg__form-box">
          {status === "success" ? (
            <div className="rreg__success">
              <div className="rreg__success-icon">✓</div>
              <h3 className="rreg__success-title">ลงทะเบียนสำเร็จ! 🎉</h3>
              <p className="rreg__success-sub">ทีม FoodBridge IP จะติดต่อกลับภายใน 3 วันทำการ</p>
            </div>
          ) : (
            <>
              <div className="rreg__section-label">ข้อมูลส่วนตัว</div>
              <div className="rreg__grid-2">
                <div className="rreg__field"><label className="rreg__lbl">ชื่อ *</label><input className="rreg__input" placeholder="สมชาย" value={form.first_name} onChange={e => set("first_name", e.target.value)} /></div>
                <div className="rreg__field"><label className="rreg__lbl">นามสกุล *</label><input className="rreg__input" placeholder="ใจดี" value={form.last_name} onChange={e => set("last_name", e.target.value)} /></div>
                <div className="rreg__field rreg__field--full"><label className="rreg__lbl">อีเมล *</label><input className="rreg__input" type="email" placeholder="somchai@mahidol.ac.th" value={form.email} onChange={e => set("email", e.target.value)} /></div>
                <div className="rreg__field"><label className="rreg__lbl">มหาวิทยาลัย / สถาบัน</label><input className="rreg__input" placeholder="Mahidol University" value={form.institution} onChange={e => set("institution", e.target.value)} /></div>
                <div className="rreg__field"><label className="rreg__lbl">ตำแหน่ง</label>
                  <select className="rreg__select" value={form.position} onChange={e => set("position", e.target.value)}>
                    <option value="">เลือก...</option>
                    <option>Professor / Associate Professor</option>
                    <option>Research Scientist</option>
                    <option>PhD Student / Postdoc</option>
                    <option>Technology Transfer Officer</option>
                    <option>Institution Head / Dean</option>
                  </select>
                </div>
              </div>
              <div className="rreg__section-label" style={{marginTop:20}}>ข้อมูลงานวิจัย</div>
              <div className="rreg__grid-1">
                <div className="rreg__field"><label className="rreg__lbl">ชื่องานวิจัย</label><input className="rreg__input" placeholder="e.g. Bioactive compounds from Mangosteen pericarp..." value={form.research_title} onChange={e => set("research_title", e.target.value)} /></div>
                <div className="rreg__field"><label className="rreg__lbl">บทคัดย่อ</label><textarea className="rreg__textarea" rows={3} placeholder="อธิบายงานวิจัยของคุณสั้นๆ..." value={form.research_abstract} onChange={e => set("research_abstract", e.target.value)} /></div>
                <div className="rreg__field"><label className="rreg__lbl">หมวดหมู่</label>
                  <select className="rreg__select" value={form.research_category} onChange={e => set("research_category", e.target.value)}>
                    <option value="">เลือก...</option>
                    <option>Functional Food & Nutraceuticals</option>
                    <option>Food Biotech & Fermentation</option>
                    <option>Natural Extracts & Bioactives</option>
                    <option>Food Safety & Preservation</option>
                    <option>Novel Ingredients & Substitutes</option>
                    <option>Packaging Innovation</option>
                  </select>
                </div>
              </div>
              <div className="rreg__section-label" style={{marginTop:20}}>เรื่อง IP & การต่อยอด</div>
              <div className="rreg__field" style={{marginBottom:14}}>
                <label className="rreg__lbl">งานวิจัยนี้มี IP / Patent อยู่แล้วไหม?</label>
                <div className="rreg__radio-group">
                  {[{val:"yes",label:"✅ มีแล้ว"},{val:"no",label:"❌ ยังไม่มี"}].map(o => (
                    <button key={o.val} className={`rreg__radio-btn ${form.has_ip===o.val?"rreg__radio-btn--active":""}`} onClick={() => set("has_ip", o.val)}>{o.label}</button>
                  ))}
                </div>
              </div>
              {form.has_ip === "no" && (
                <div className="rreg__field rreg__field--highlight" style={{marginBottom:14}}>
                  <label className="rreg__lbl">อยากให้ FoodBridge IP ช่วยดูแลเรื่อง IP filing ไหม?</label>
                  <div className="rreg__radio-group">
                    <button className={`rreg__radio-btn ${form.want_ip_help?"rreg__radio-btn--active":""}`} onClick={() => set("want_ip_help", true)}>🙋 ใช่</button>
                    <button className={`rreg__radio-btn ${!form.want_ip_help&&form.has_ip==="no"?"rreg__radio-btn--active":""}`} onClick={() => set("want_ip_help", false)}>🚫 ไม่ต้องการตอนนี้</button>
                  </div>
                </div>
              )}
              <div className="rreg__field" style={{marginBottom:14}}>
                <label className="rreg__lbl">ต้องการต่อยอดกับนักธุรกิจ / SME ไหม?</label>
                <div className="rreg__radio-group">
                  {[{val:"yes",label:"🚀 ใช่ พร้อมเลย!"},{val:"unsure",label:"🤔 ยังไม่แน่ใจ"},{val:"no",label:"🚫 ยังไม่ต้องการ"}].map(o => (
                    <button key={o.val} className={`rreg__radio-btn ${form.want_commercialize===o.val?"rreg__radio-btn--active":""}`} onClick={() => set("want_commercialize", o.val)}>{o.label}</button>
                  ))}
                </div>
              </div>
              {(form.want_commercialize==="yes"||form.want_commercialize==="unsure") && (
                <div className="rreg__field rreg__field--highlight" style={{marginBottom:14}}>
                  <label className="rreg__lbl">ความต้องการเพิ่มเติม</label>
                  <textarea className="rreg__textarea" rows={2} placeholder="เช่น อยากหา partner ในญี่ปุ่น..." value={form.commercialize_note} onChange={e => set("commercialize_note", e.target.value)} />
                </div>
              )}
              {err && <div className="rreg__err">{err}</div>}
              <button className="rreg__submit" onClick={submit} disabled={status==="loading"}>
                {status==="loading" ? <span className="rreg__spin"/> : <>ลงทะเบียนนักวิจัย</>}
              </button>
              <p className="rreg__note">ฟรี ไม่มีค่าใช้จ่าย · ไม่มี spam</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body,input,select,textarea,button{font-family:'Plus Jakarta Sans',sans-serif;}
.rp{background:#F8F7FF;color:#111827;-webkit-font-smoothing:antialiased;}

/* NAV */
.rp-nav{
  position:sticky;top:0;z-index:200;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 5%;height:60px;
  background:rgba(255,255,255,0.88);
  backdrop-filter:blur(24px);
  border-bottom:1px solid #E5E7EB;
}
.rp-nav__logo{
  font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;
  color:#111827;text-decoration:none;
  display:flex;align-items:center;gap:9px;
}
.rp-nav__logo span{color:#6D28D1;}
.rp-nav__logo-mark{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,#4C1D95,#7C3AED);
  display:flex;align-items:center;justify-content:center;
}
.rp-nav__right{display:flex;align-items:center;gap:16px;}
.rp-nav__bc{font-size:.8rem;color:#9CA3AF;}
.rp-nav__cta{
  background:#4C1D95;color:white;
  font-size:.8rem;font-weight:600;
  padding:7px 16px;border-radius:8px;text-decoration:none;
  transition:background .2s;
}
.rp-nav__cta:hover{background:#3B0764;}

/* HERO */
.rp-hero{
  position:relative;overflow:hidden;
  background:#0C0520;
  padding:80px 5% 56px;
  text-align:center;
}
.rp-hero__grid-bg{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(139,92,246,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.08) 1px,transparent 1px);
  background-size:48px 48px;
}
.rp-hero__glow{
  position:absolute;top:-120px;left:50%;transform:translateX(-50%);
  width:700px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(109,40,209,.45),transparent 70%);
  filter:blur(2px);
}
.rp-hero__inner{position:relative;z-index:1;max-width:780px;margin:0 auto;}
.rp-hero__pill{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(109,40,209,.2);border:1px solid rgba(139,92,246,.35);
  color:#c4b5fd;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  padding:6px 16px;border-radius:20px;margin-bottom:22px;
}
.rp-hero__live-dot{
  width:6px;height:6px;border-radius:50%;
  background:#86efac;box-shadow:0 0 8px #86efac;
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
.rp-hero__h1{
  font-family:'Playfair Display',serif;
  font-size:clamp(2rem,4.5vw,3.4rem);font-weight:700;
  color:white;line-height:1.15;letter-spacing:-.02em;margin-bottom:16px;
}
.rp-hero__h1-em{color:#a78bfa;font-style:italic;display:block;}
.rp-hero__sub{font-size:.95rem;color:rgba(255,255,255,.55);line-height:1.8;max-width:580px;margin:0 auto 32px;}
.rp-hero__stats{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;}
.rp-hero__stat{
  background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
  border-radius:10px;padding:10px 18px;text-align:center;
}
.rp-hero__stat-n{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:#c4b5fd;}
.rp-hero__stat-l{font-size:.68rem;color:rgba(255,255,255,.4);margin-top:2px;}

/* FILTER BAR */
.rp-bar{
  background:white;border-bottom:1px solid #E5E7EB;
  padding:12px 5%;
  position:sticky;top:60px;z-index:100;
}
.rp-bar__inner{
  max-width:1280px;margin:0 auto;
  display:flex;align-items:center;gap:10px;flex-wrap:wrap;
}
.rp-bar__search-wrap{position:relative;flex:0 0 240px;}
.rp-bar__search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#9CA3AF;pointer-events:none;}
.rp-bar__search{
  width:100%;padding:8px 12px 8px 32px;
  border:1.5px solid #E5E7EB;border-radius:8px;
  font-size:.8rem;color:#111827;background:#F9FAFB;outline:none;
  transition:border-color .2s;
}
.rp-bar__search:focus{border-color:#6D28D1;background:white;}
.rp-bar__pills{display:flex;gap:5px;flex-wrap:wrap;}
.rp-pill{
  font-size:.72rem;font-weight:500;
  padding:5px 12px;border-radius:20px;
  border:1px solid #E5E7EB;background:white;color:#6B7280;
  cursor:pointer;font-family:inherit;transition:all .15s;
}
.rp-pill:hover{border-color:#6D28D1;color:#6D28D1;}
.rp-pill--on{background:#EDE9FE;border-color:#6D28D1;color:#4C1D95;font-weight:600;}
.rp-pill--uni{border-radius:6px;}
.rp-bar__sort{display:flex;align-items:center;gap:5px;font-size:.72rem;color:#9CA3AF;margin-left:auto;}
.rp-sort-btn{font-size:.72rem;padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:white;color:#6B7280;cursor:pointer;font-family:inherit;transition:all .15s;}
.rp-sort-btn--on{background:#F3F4F6;color:#111827;font-weight:600;border-color:#D1D5DB;}
.rp-bar__count{font-size:.78rem;color:#9CA3AF;white-space:nowrap;}
.rp-bar__count strong{color:#6D28D1;}

/* GRID */
.rp-grid-wrap{max-width:1280px;margin:0 auto;padding:28px 5% 80px;}
.rp-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
  gap:18px;
}

/* PAPER CARD */
.rcard{
  background:white;border-radius:14px;
  border:1px solid #E5E7EB;
  display:flex;flex-direction:column;
  cursor:pointer;outline:none;overflow:hidden;
  transition:transform .22s,box-shadow .22s,border-color .22s;
}
.rcard:hover{
  transform:translateY(-4px);
  box-shadow:0 16px 48px rgba(109,40,209,.12),0 2px 8px rgba(0,0,0,.04);
  border-color:rgba(109,40,209,.3);
}
.rcard__stripe{padding:12px 16px 10px;}
.rcard__top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.rcard__cat-tag{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 9px;border-radius:20px;}
.rcard__fit-badge{font-size:.7rem;font-weight:700;padding:3px 9px;border-radius:20px;}
.rcard__meta-row{display:flex;align-items:center;gap:8px;}
.rcard__uni{font-size:.6rem;font-weight:700;color:white;padding:2px 7px;border-radius:5px;letter-spacing:.05em;}
.rcard__year{font-size:.72rem;color:#9CA3AF;}
.rcard__journal{font-size:.7rem;color:#9CA3AF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px;}
.rcard__body{padding:14px 16px;flex:1;}
.rcard__title{
  font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;
  color:#111827;line-height:1.4;margin-bottom:8px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.rcard__abstract{
  font-size:.78rem;color:#6B7280;line-height:1.7;margin-bottom:10px;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}
.rcard__tags{display:flex;flex-wrap:wrap;gap:5px;}
.rcard__tag{font-size:.65rem;color:#4B5563;background:#F3F4F6;padding:3px 8px;border-radius:5px;}
.rcard__footer{
  padding:12px 16px;border-top:1px solid #F3F4F6;
  display:flex;align-items:center;gap:10px;
}
.rcard__val-block{flex:1;}
.rcard__val-label{font-size:.6rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
.rcard__val-num{font-size:.88rem;font-weight:700;color:#111827;}
.rcard__val-divider{width:1px;height:28px;background:#E5E7EB;}
.rcard__btn{
  background:#EDE9FE;color:#4C1D95;
  font-size:.72rem;font-weight:600;
  padding:7px 12px;border-radius:8px;border:none;
  cursor:pointer;font-family:inherit;white-space:nowrap;
  transition:background .2s;
}
.rcard__btn:hover{background:#DDD6FE;}

/* EMPTY */
.rp-empty{
  text-align:center;padding:80px 0;color:#9CA3AF;
  display:flex;flex-direction:column;align-items:center;gap:14px;
}
.rp-empty p{font-size:1rem;}
.rp-empty button{
  background:#EDE9FE;color:#6D28D1;border:none;
  padding:9px 20px;border-radius:9px;font-size:.875rem;font-weight:600;
  cursor:pointer;font-family:inherit;
}

/* DETAIL DRAWER */
.rd-overlay{position:fixed;inset:0;background:rgba(8,4,20,.6);backdrop-filter:blur(6px);z-index:400;cursor:pointer;}
.rd-drawer{
  position:fixed;top:0;right:0;bottom:0;
  width:min(700px,100vw);background:white;
  z-index:500;overflow-y:auto;
  display:flex;flex-direction:column;
  box-shadow:-24px 0 80px rgba(0,0,0,.2);
  animation:slideIn .28s ease;
}
@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
.rd-header{padding:44px 32px 28px;position:relative;flex-shrink:0;}
.rd-close{
  position:absolute;top:14px;right:14px;
  width:32px;height:32px;border-radius:8px;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
  color:white;font-size:.9rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s;
}
.rd-close:hover{background:rgba(255,255,255,.3);}
.rd-header__top{display:flex;gap:8px;margin-bottom:12px;}
.rd-cat-tag{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:4px 10px;border-radius:20px;}
.rd-uni-tag{font-size:.68rem;font-weight:700;color:white;padding:4px 10px;border-radius:20px;letter-spacing:.04em;}
.rd-title{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:white;line-height:1.3;margin-bottom:10px;}
.rd-header__meta{display:flex;gap:14px;font-size:.75rem;color:rgba(255,255,255,.5);flex-wrap:wrap;}
.rd-body{padding:24px 32px;flex:1;}
.rd-biz-box{
  background:linear-gradient(135deg,#F5F3FF,#EDE9FE);
  border:1px solid #C4B5FD;border-radius:12px;
  padding:18px;margin-bottom:22px;
}
.rd-biz-title{font-weight:700;font-size:.85rem;color:#4C1D95;margin-bottom:12px;}
.rd-biz-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.rd-biz-item{}
.rd-biz-label{font-size:.65rem;color:#7C3AED;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
.rd-biz-value{font-size:1rem;font-weight:700;color:#1F2937;}
.rd-section{margin-bottom:20px;}
.rd-sec-title{font-weight:700;font-size:.85rem;color:#111827;margin-bottom:8px;}
.rd-text{font-size:.85rem;color:#4B5563;line-height:1.8;}
.rd-tags{display:flex;flex-wrap:wrap;gap:6px;}
.rd-tag{font-size:.72rem;background:#F3F4F6;color:#374151;padding:4px 10px;border-radius:6px;}
.rd-potential{background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:18px;margin-top:4px;}
.rd-potential-title{font-weight:700;font-size:.85rem;color:#065F46;margin-bottom:8px;}
.rd-potential-text{font-size:.82rem;color:#374151;line-height:1.75;}
.rd-footer{
  display:flex;gap:10px;padding:20px 32px;
  background:#F9FAFB;border-top:1px solid #E5E7EB;flex-shrink:0;
}
.rd-btn-primary{
  flex:1;background:linear-gradient(135deg,#4C1D95,#7C3AED);color:white;
  font-size:.88rem;font-weight:600;padding:12px;border-radius:10px;
  text-align:center;text-decoration:none;transition:opacity .2s;
}
.rd-btn-primary:hover{opacity:.88;}
.rd-btn-outline{
  background:white;color:#4B5563;font-size:.82rem;font-weight:500;
  padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;
  text-decoration:none;white-space:nowrap;transition:border-color .2s,color .2s;
}
.rd-btn-outline:hover{border-color:#6D28D1;color:#6D28D1;}

/* REGISTER */
.rreg{padding:100px 5%;background:linear-gradient(160deg,#3B0764 0%,#4C1D95 45%,#6D28D1 100%);position:relative;overflow:hidden;}
.rreg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;}
.rreg__inner{position:relative;z-index:1;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:60px;align-items:start;}
.rreg__eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:16px;}
.rreg__dot{width:6px;height:6px;border-radius:50%;background:#86efac;box-shadow:0 0 8px #86efac;animation:pulse 2s infinite;}
.rreg__h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;color:white;line-height:1.2;margin-bottom:16px;}
.rreg__h2 em{font-style:italic;color:#c4b5fd;}
.rreg__desc{font-size:.9rem;color:rgba(255,255,255,.65);line-height:1.8;margin-bottom:24px;}
.rreg__perks{display:flex;flex-direction:column;gap:10px;}
.rreg__perk{display:flex;align-items:center;gap:10px;font-size:.85rem;color:rgba(255,255,255,.82);}
.rreg__perk-check{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:.7rem;color:white;flex-shrink:0;}
.rreg__form-box{background:white;border-radius:20px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.25);}
.rreg__section-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9CA3AF;margin-bottom:10px;}
.rreg__grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;}
.rreg__grid-1{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:4px;}
.rreg__field{display:flex;flex-direction:column;gap:5px;}
.rreg__field--full{grid-column:1/-1;}
.rreg__field--highlight{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:12px;}
.rreg__lbl{font-size:.75rem;font-weight:600;color:#4B5563;}
.rreg__input,.rreg__select,.rreg__textarea{padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:.85rem;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;transition:border-color .2s;}
.rreg__input:focus,.rreg__textarea:focus{border-color:#6D28D1;background:white;}
.rreg__textarea{resize:vertical;line-height:1.6;}
.rreg__radio-group{display:flex;flex-direction:column;gap:6px;margin-top:6px;}
.rreg__radio-btn{display:flex;align-items:center;padding:9px 14px;border-radius:10px;border:1.5px solid #E5E7EB;background:#F9FAFB;color:#4B5563;font-size:.82rem;font-weight:500;cursor:pointer;font-family:inherit;text-align:left;transition:all .15s;}
.rreg__radio-btn:hover{border-color:#6D28D1;color:#4C1D95;}
.rreg__radio-btn--active{background:#EDE9FE;border-color:#6D28D1;color:#4C1D95;font-weight:600;}
.rreg__err{font-size:.78rem;color:#dc2626;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:8px 12px;margin:10px 0;}
.rreg__submit{width:100%;margin-top:18px;background:linear-gradient(135deg,#4C1D95,#7C3AED);color:white;font-size:.9rem;font-weight:600;padding:13px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 18px rgba(109,40,209,.35);transition:opacity .2s;}
.rreg__submit:hover:not(:disabled){opacity:.9;}
.rreg__submit:disabled{opacity:.6;cursor:not-allowed;}
.rreg__spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:white;animation:spin .7s linear infinite;display:inline-block;}
@keyframes spin{to{transform:rotate(360deg)}}
.rreg__note{font-size:.72rem;color:#9CA3AF;text-align:center;margin-top:8px;}
.rreg__success{text-align:center;padding:32px 16px;}
.rreg__success-icon{width:60px;height:60px;border-radius:50%;background:#D1FAE5;color:#065F46;font-size:1.6rem;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
.rreg__success-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:8px;}
.rreg__success-sub{font-size:.88rem;color:#6B7280;line-height:1.6;}

@media(max-width:960px){.rreg__inner{grid-template-columns:1fr;gap:40px;}.rd-drawer{width:100vw;}}
@media(max-width:640px){.rp-bar__inner{flex-direction:column;align-items:flex-start;}.rp-bar__search-wrap{flex:none;width:100%;}.rreg__grid-2{grid-template-columns:1fr;}.rp-grid{grid-template-columns:1fr;}}
`;