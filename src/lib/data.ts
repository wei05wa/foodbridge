export type IpCategory = "functional" | "botanical" | "nutra" | "ferment";
export type TagClass = "t-p" | "t-g" | "t-a" | "t-b" | "t-pk";

export interface UseCase {
  icon: "capsule" | "drink" | "skin" | "food";
  name: string;
  desc: string;
}

export interface IpCard {
  id: number;
  cat: IpCategory;
  tag: string;
  tagClass: TagClass;
  score: number;
  tam: string;
  ttm: string;
  roi: string;
  title: string;
  uni: string;
  desc: string;
  market: string;
  gap: number;
  properties: string[];
  usecases: UseCase[];
  growth: string[]; // "2024:$1.2M"
  partners: string[]; // hex colors
  partnerCount: number;
  highlight?: boolean;
}

export const IP_DATA: IpCard[] = [
  {
    id: 1,
    cat: "functional",
    tag: "Functional Food",
    tagClass: "t-p",
    score: 95,
    tam: "$9.4M",
    ttm: "9 เดือน",
    roi: "3.2×",
    title: "Turmeric Nano-Emulsion ความดูดซึมสูง 40×",
    uni: "CU Science Park / จุฬาลงกรณ์มหาวิทยาลัย",
    desc: "เทคโนโลยี nano-encapsulation ที่เพิ่มการดูดซึม curcumin ได้สูงถึง 40 เท่า เทียบกับผลิตภัณฑ์มาตรฐาน ผ่านการทดสอบทางคลินิกแล้ว สิทธิบัตรกำลังพิจารณา",
    market: "$9.4M",
    gap: 94,
    properties: ["ต้านการอักเสบสูง", "ดูดซึมดีกว่า 40×", "ละลายน้ำได้", "เสถียรในอุณหภูมิสูง", "ผ่านการทดลองทางคลินิก", "Halal Ready"],
    usecases: [
      { icon: "capsule", name: "Supplement Capsule", desc: "ผลิตภัณฑ์เสริมอาหารพรีเมียม anti-inflammatory" },
      { icon: "drink", name: "Functional Beverage", desc: "เครื่องดื่มสุขภาพสำหรับตลาด wellness" },
      { icon: "skin", name: "Cosmeceutical", desc: "สกินแคร์ anti-aging ระดับ luxury" },
      { icon: "food", name: "Functional Snack", desc: "ขนมสุขภาพ low-GI สำหรับ Gen Z" },
    ],
    growth: ["2024:$1.2M", "2025:$2.8M", "2026:$5.1M", "2027:$9.4M"],
    partners: ["#7C3AED", "#059669", "#D97706"],
    partnerCount: 3,
    highlight: true,
  },
  {
    id: 2,
    cat: "functional",
    tag: "Functional Food",
    tagClass: "t-p",
    score: 92,
    tam: "$3.8M",
    ttm: "18 เดือน",
    roi: "2.8×",
    title: "High-Antioxidant Berry Extract (ORAC 5×)",
    uni: "KMUTT — Food Innovation Lab",
    desc: "กระบวนการ cold-press ที่ได้รับสิทธิบัตร ให้ค่า ORAC สูงกว่ามาตรฐาน 5 เท่า เหมาะสำหรับ beverage, supplement และ cosmetic premium",
    market: "$3.8M",
    gap: 88,
    properties: ["ORAC สูง 5×", "Antioxidant สูงสุด", "ไม่ต้องแช่เย็น", "สีและกลิ่นคงทน", "Non-GMO", "Vegan Certified"],
    usecases: [
      { icon: "drink", name: "Premium Juice", desc: "น้ำผลไม้เพื่อสุขภาพระดับ luxury" },
      { icon: "capsule", name: "Beauty Supplement", desc: "ผลิตภัณฑ์เสริมอาหารเพื่อผิว" },
      { icon: "skin", name: "Serum / Cream", desc: "สกินแคร์ anti-aging premium" },
      { icon: "food", name: "Superfood Powder", desc: "ผงซุปเปอร์ฟู้ดสำหรับ smoothie bars" },
    ],
    growth: ["2024:$0.8M", "2025:$1.5M", "2026:$2.4M", "2027:$3.8M"],
    partners: ["#7C3AED", "#059669"],
    partnerCount: 2,
  },
  {
    id: 3,
    cat: "botanical",
    tag: "Botanical Extract",
    tagClass: "t-g",
    score: 87,
    tam: "$6.1M",
    ttm: "12 เดือน",
    roi: "3.5×",
    title: "Morinda Citrifolia Probiotic Complex (Noni)",
    uni: "Mahidol University — Nutraceutical Dept.",
    desc: "กระบวนการหมักนวัตกรรมที่ผลิต synbiotic จาก Noni เพิ่มความหลากหลายของ microbiome ในลำไส้ ผ่านการทดลองทางคลินิกแล้ว",
    market: "$6.1M",
    gap: 76,
    properties: ["Probiotic + Prebiotic", "Clinical Proven", "Gut Microbiome", "ปลอดกลูเตน", "Organic Certified", "อายุการเก็บ 24 เดือน"],
    usecases: [
      { icon: "drink", name: "Probiotic Drink", desc: "เครื่องดื่มดูแลระบบย่อยอาหาร" },
      { icon: "capsule", name: "Gut Health Capsule", desc: "ผลิตภัณฑ์ดูแลสุขภาพลำไส้" },
      { icon: "food", name: "Fermented Snack", desc: "ขนมหมักเพื่อสุขภาพ" },
      { icon: "skin", name: "Probiotic Skincare", desc: "สกินแคร์ microbiome-friendly" },
    ],
    growth: ["2024:$1.4M", "2025:$2.9M", "2026:$4.3M", "2027:$6.1M"],
    partners: ["#7C3AED"],
    partnerCount: 1,
  },
  {
    id: 4,
    cat: "nutra",
    tag: "Nutraceutical",
    tagClass: "t-a",
    score: 89,
    tam: "$5.7M",
    ttm: "14 เดือน",
    roi: "2.9×",
    title: "Mangosteen Xanthone Extract (3× Bioavailable)",
    uni: "Chulalongkorn University — Pharmacy Dept.",
    desc: "วิธีการสกัดที่ได้รับสิทธิบัตร ให้ xanthone ที่ดูดซึมได้ในร่างกายสูงกว่ากระบวนการมาตรฐาน 3 เท่า พร้อมสำหรับการ license ด้าน nutraceutical",
    market: "$5.7M",
    gap: 82,
    properties: ["Xanthone สูง 3×", "ต้านมะเร็ง (In Vitro)", "ต้านเชื้อแบคทีเรีย", "Anti-inflammatory", "Standardized Extract", "GMP Ready"],
    usecases: [
      { icon: "capsule", name: "Immunity Supplement", desc: "ผลิตภัณฑ์เสริมภูมิคุ้มกัน premium" },
      { icon: "drink", name: "Health Shots", desc: "เครื่องดื่มเข้มข้น 30ml shots" },
      { icon: "food", name: "Functional Gummy", desc: "กัมมี่เพื่อสุขภาพสำหรับเด็กและผู้ใหญ่" },
      { icon: "skin", name: "Anti-aging Serum", desc: "เซรั่มต้านอนุมูลอิสระระดับสูง" },
    ],
    growth: ["2024:$1.1M", "2025:$2.2M", "2026:$3.8M", "2027:$5.7M"],
    partners: ["#7C3AED", "#059669", "#D97706", "#DC2626"],
    partnerCount: 4,
  },
  {
    id: 5,
    cat: "ferment",
    tag: "Fermentation Tech",
    tagClass: "t-b",
    score: 81,
    tam: "$5.2M",
    ttm: "24 เดือน",
    roi: "2.4×",
    title: "Resistant Starch Jasmine Rice Flour (Low-GI)",
    uni: "Kasetsart University — Food Science",
    desc: "กระบวนการ enzymatic แปลง starch ในข้าวหอมมะลิให้เป็นแป้ง low-GI ที่มี prebiotic สูง เหมาะสำหรับผลิตภัณฑ์เบเกอรี่ diabetic-friendly",
    market: "$5.2M",
    gap: 71,
    properties: ["Low GI Index", "Prebiotic Rich", "ไม่มีกลูเตน", "เหมาะ Diabetic", "ใช้แทนแป้งสาลี", "Scalable Process"],
    usecases: [
      { icon: "food", name: "Diabetic Bread", desc: "ขนมปัง/เบเกอรี่สำหรับผู้ป่วยเบาหวาน" },
      { icon: "food", name: "Functional Pasta", desc: "เส้นก๋วยเตี๋ยว/pasta สุขภาพ" },
      { icon: "capsule", name: "Meal Replacement", desc: "อาหารทดแทนมื้อสำหรับผู้ควบคุมน้ำตาล" },
      { icon: "drink", name: "Prebiotic Powder", desc: "ผงชงดื่มสำหรับสุขภาพลำไส้" },
    ],
    growth: ["2024:$0.9M", "2025:$1.8M", "2026:$3.2M", "2027:$5.2M"],
    partners: ["#7C3AED", "#059669"],
    partnerCount: 2,
  },
  {
    id: 6,
    cat: "botanical",
    tag: "Botanical Extract",
    tagClass: "t-g",
    score: 84,
    tam: "$4.4M",
    ttm: "16 เดือน",
    roi: "3.1×",
    title: "Thai Moringa Peptide Complex (EAA Optimized)",
    uni: "CMU — Northern Thai Herb Research Center",
    desc: "สกัดจาก Moringa พันธุ์เหนือของไทย ได้ peptide ที่มี essential amino acid ครบถ้วน ดูดซึมเร็วกว่า whey protein 20% เหมาะสำหรับตลาด sport nutrition",
    market: "$4.4M",
    gap: 79,
    properties: ["EAA ครบ 9 ชนิด", "ดูดซึมเร็ว", "Plant-based Protein", "Vegan", "Non-allergenic", "Heat Stable"],
    usecases: [
      { icon: "capsule", name: "Sport Nutrition", desc: "ผลิตภัณฑ์โปรตีนสำหรับนักกีฬา" },
      { icon: "drink", name: "Protein Beverage", desc: "เครื่องดื่มโปรตีนพืชพรีเมียม" },
      { icon: "food", name: "Protein Bar", desc: "โปรตีนบาร์ plant-based" },
      { icon: "skin", name: "Hair Care", desc: "ผลิตภัณฑ์บำรุงผมด้วย peptide" },
    ],
    growth: ["2024:$0.7M", "2025:$1.6M", "2026:$2.9M", "2027:$4.4M"],
    partners: ["#7C3AED"],
    partnerCount: 1,
  },
  {
    id: 7,
    cat: "nutra",
    tag: "Nutraceutical",
    tagClass: "t-a",
    score: 91,
    tam: "$7.8M",
    ttm: "11 เดือน",
    roi: "3.8×",
    title: "Pandan Leaf Chlorophyll Nano-Liposome",
    uni: "KMUTT — Biotechnology Dept.",
    desc: "Nano-liposome จาก chlorophyll ใบเตยหอมไทย เพิ่ม bioavailability 8 เท่า มีคุณสมบัติ detox, anti-oxidant และ anti-inflammatory พร้อม IP Pending",
    market: "$7.8M",
    gap: 86,
    properties: ["Detox Certified", "Anti-inflammatory", "Bioavailability 8×", "Natural Color", "ไม่มีสารเคมี", "Cold-chain Free"],
    usecases: [
      { icon: "drink", name: "Detox Drink", desc: "เครื่องดื่ม detox premium สีเขียวธรรมชาติ" },
      { icon: "capsule", name: "Liver Support", desc: "ผลิตภัณฑ์บำรุงตับและขับพิษ" },
      { icon: "skin", name: "Green Cosmetic", desc: "เครื่องสำอางค์สีเขียวธรรมชาติ" },
      { icon: "food", name: "Functional Ice Cream", desc: "ไอศกรีมเพื่อสุขภาพสีเขียวธรรมชาติ" },
    ],
    growth: ["2024:$1.6M", "2025:$3.2M", "2026:$5.4M", "2027:$7.8M"],
    partners: ["#7C3AED", "#059669", "#D97706"],
    partnerCount: 3,
  },
  {
    id: 8,
    cat: "functional",
    tag: "Functional Food",
    tagClass: "t-p",
    score: 78,
    tam: "$3.2M",
    ttm: "20 เดือน",
    roi: "2.2×",
    title: "Tamarind Seed Hyaluronic Acid Alternative",
    uni: "Mahidol University — Chemistry Dept.",
    desc: "สกัด polysaccharide จากเมล็ดมะขามไทยที่มีคุณสมบัติคล้าย hyaluronic acid แต่ราคาต่ำกว่า 60% ทำให้แข่งขันได้ในตลาด cosmeceutical",
    market: "$3.2M",
    gap: 68,
    properties: ["HA-like Activity", "ราคาต่ำกว่า 60%", "Moisturizing", "Film Forming", "Plant-based", "Biodegradable"],
    usecases: [
      { icon: "skin", name: "Anti-aging Cream", desc: "ครีมต่อต้านริ้วรอย budget-friendly" },
      { icon: "skin", name: "Eye Serum", desc: "เซรั่มรอบดวงตา moisturizing" },
      { icon: "capsule", name: "Joint Supplement", desc: "ผลิตภัณฑ์บำรุงข้อต่อราคาประหยัด" },
      { icon: "drink", name: "Beauty Drink", desc: "เครื่องดื่มเพื่อผิวพรรณ" },
    ],
    growth: ["2024:$0.6M", "2025:$1.1M", "2026:$2.0M", "2027:$3.2M"],
    partners: [],
    partnerCount: 0,
  },
];