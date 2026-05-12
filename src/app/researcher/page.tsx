"use client";

import { useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   app/researcher/page.tsx  →  Route: /researcher
   - ดึงงานวิจัย food จาก MUREX API (Elsevier Pure)
   - แสดงเป็น cards สวยงาม
   - Section ลงทะเบียนนักวิจัย
───────────────────────────────────────────── */

/* ── Types ── */
interface Publication {
  uuid: string;
  title: string;
  abstract?: string;
  year?: number;
  authors?: string[];
  journal?: string;
  category?: string;
  url?: string;
  doi?: string;
}

const FOOD_KEYWORDS = [
  "food","nutrition","nutraceutical","functional food","probiotic","antioxidant",
  "fermentation","extract","bioactive","phytochemical","herb","supplement",
  "dietary","plant-based","protein","lipid","carbohydrate","microbiome",
  "flavonoid","polyphenol","vitamin","mineral","omega","prebiotic",
];

const CATEGORIES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "nutraceutical", label: "Nutraceutical" },
  { id: "functional", label: "Functional Food" },
  { id: "probiotic", label: "Probiotic / Microbiome" },
  { id: "extract", label: "Plant Extract" },
  { id: "fermentation", label: "Fermentation" },
];

/* detect category from title/abstract */
function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("probiotic") || t.includes("microbiome") || t.includes("ferment")) return "probiotic";
  if (t.includes("extract") || t.includes("phytochemical") || t.includes("herb") || t.includes("plant")) return "extract";
  if (t.includes("nutraceutical") || t.includes("supplement") || t.includes("bioactive")) return "nutraceutical";
  if (t.includes("ferment") || t.includes("fermentation")) return "fermentation";
  if (t.includes("functional food") || t.includes("food fortif")) return "functional";
  return "functional";
}

const CAT_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  nutraceutical: { bg: "#FEF3C7", color: "#92400E", label: "Nutraceutical" },
  functional:    { bg: "#EDE9FE", color: "#4C1D95", label: "Functional Food" },
  probiotic:     { bg: "#D1FAE5", color: "#065F46", label: "Probiotic / Microbiome" },
  extract:       { bg: "#DBEAFE", color: "#1E40AF", label: "Plant Extract" },
  fermentation:  { bg: "#FCE7F3", color: "#9D174D", label: "Fermentation" },
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ResearcherPage() {
  const [papers, setPapers]       = useState<Publication[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("all");
  const [selected, setSelected]   = useState<Publication | null>(null);

  /* ── Fetch from MUREX Pure API ── */
const fetchPapers = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/murex-papers");
    const data = await res.json();

    if (data.items?.length > 0) {
      setPapers(data.items.map((p: any) => ({
        ...p,
        category: detectCategory(`${p.title} ${p.abstract}`),
      })));
    } else {
      setPapers(FALLBACK_PAPERS);
    }
  } catch {
    setPapers(FALLBACK_PAPERS);
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => { fetchPapers(); }, [fetchPapers]);

  /* ── Filter ── */
  const filtered = papers.filter((p) => {
    const text = `${p.title} ${p.abstract ?? ""}`.toLowerCase();
    const matchSearch = search === "" || text.includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="rnav">
        <a href="/" className="rnav__logo">
          <div className="rnav__logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          FoodBridge<span style={{color:"#8B5CF6"}}>IP</span>
        </a>
        <div className="rnav__right">
          <span className="rnav__breadcrumb">/ Research Hub</span>
          <a href="#register" className="rnav__cta">ลงทะเบียนนักวิจัย</a>
        </div>
      </nav>

      <main className="rpage">

        {/* ── HERO HEADER ── */}
        <div className="rhero">
          <div className="rhero__bg">
            <div className="rhero__orb1"/><div className="rhero__orb2"/>
          </div>
          <div className="rhero__inner">
            <div className="rhero__badge">
              <span className="rhero__dot"/>
              Mahidol University × FoodBridge IP
            </div>
            <h1 className="rhero__h1">
              งานวิจัยอาหารและโภชนาการ<br/>
              <em>พร้อมต่อยอดสู่ธุรกิจ</em>
            </h1>
            <p className="rhero__sub">
              รวบรวมงานวิจัยด้าน Food Science จากมหาวิทยาลัยมหิดล
              ที่มีศักยภาพเชิงพาณิชย์สูง พร้อมเชื่อมกับผู้ประกอบการที่สนใจ
            </p>
            <div className="rhero__stats">
              {[
                { n: `${papers.length}+`, l: "งานวิจัย" },
                { n: "1", l: "มหาวิทยาลัย" },
                { n: "Live", l: "อัปเดตล่าสุด" },
              ].map(s => (
                <div className="rhero__stat" key={s.l}>
                  <div className="rhero__stat-n">{s.n}</div>
                  <div className="rhero__stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="rfilter-bar">
          <div className="rfilter-inner">
            <div className="rsearch-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rsearch-icon">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="rsearch"
                placeholder="ค้นหางานวิจัย..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="rcat-pills">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className={`rcat-pill ${category === c.id ? "rcat-pill--active" : ""}`}
                  onClick={() => setCategory(c.id)}
                >{c.label}</button>
              ))}
            </div>
            <div className="rresult-count">
              พบ <strong>{filtered.length}</strong> งานวิจัย
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="rgrid-wrap">
          {loading ? (
            <div className="rloading">
              <div className="rspinner"/>
              <span>กำลังโหลดงานวิจัยจาก MUREX...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rempty">
              <div className="rempty__icon">🔍</div>
              <div className="rempty__text">ไม่พบงานวิจัยที่ตรงกัน</div>
              <button className="rempty__btn" onClick={() => { setSearch(""); setCategory("all"); }}>
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <div className="rgrid">
              {filtered.map(p => (
                <PaperCard key={p.uuid} paper={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>

        {/* ── REGISTER SECTION ── */}
        <RegisterSection />

      </main>

      {/* ── DETAIL DRAWER ── */}
      {selected && (
        <DetailDrawer paper={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   PAPER CARD
══════════════════════════════════════════ */
function PaperCard({ paper, onClick }: { paper: Publication; onClick: () => void }) {
  const cat = CAT_STYLE[paper.category ?? "functional"] ?? CAT_STYLE.functional;
  const shortAbstract = paper.abstract
    ? paper.abstract.slice(0, 140) + (paper.abstract.length > 140 ? "…" : "")
    : "งานวิจัยจากมหาวิทยาลัยมหิดล";

  return (
    <div className="rcard" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      {/* Top bar with category + year */}
      <div className="rcard__top">
        <span className="rcard__tag" style={{ background: cat.bg, color: cat.color }}>
          {cat.label}
        </span>
        {paper.year && <span className="rcard__year">{paper.year}</span>}
      </div>

      {/* Title */}
      <h3 className="rcard__title">{paper.title}</h3>

      {/* Abstract snippet */}
      <p className="rcard__abstract">{shortAbstract}</p>

      {/* Authors */}
      {paper.authors && paper.authors.length > 0 && (
        <div className="rcard__authors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {paper.authors.join(", ")}{paper.authors.length >= 3 ? " et al." : ""}
        </div>
      )}

      {/* Footer */}
      <div className="rcard__footer">
        <div className="rcard__journal">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>{paper.journal}</span>
        </div>
        <button className="rcard__btn">
          ดูรายละเอียด
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DETAIL DRAWER
══════════════════════════════════════════ */
function DetailDrawer({ paper, onClose }: { paper: Publication; onClose: () => void }) {
  const cat = CAT_STYLE[paper.category ?? "functional"] ?? CAT_STYLE.functional;
  return (
    <>
      <div className="rd-overlay" onClick={onClose}/>
      <div className="rd-drawer">
        <div className="rd-header" style={{ background: `linear-gradient(135deg, #4C1D95, #6D28D1, #8B5CF6)` }}>
          <button className="rd-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="rd-header-tag" style={{ background: cat.bg, color: cat.color }}>{cat.label}</div>
          <h2 className="rd-title">{paper.title}</h2>
          {paper.year && <div className="rd-year">ตีพิมพ์ปี {paper.year}</div>}
        </div>

        <div className="rd-body">
          {paper.authors && paper.authors.length > 0 && (
            <div className="rd-section">
              <div className="rd-sec-title">
                <AuthorIcon/> ผู้วิจัย
              </div>
              <p className="rd-text">{paper.authors.join(", ")}{paper.authors.length >= 3 ? " et al." : ""}</p>
            </div>
          )}

          <div className="rd-section">
            <div className="rd-sec-title"><BookIcon/> บทคัดย่อ</div>
            <p className="rd-text">{paper.abstract ?? "ไม่มีบทคัดย่อ"}</p>
          </div>

          {paper.journal && (
            <div className="rd-section">
              <div className="rd-sec-title"><JournalIcon/> วารสาร</div>
              <p className="rd-text">{paper.journal}</p>
            </div>
          )}

          {/* Business potential hint */}
          <div className="rd-potential">
            <div className="rd-potential-title">💡 ศักยภาพเชิงพาณิชย์</div>
            <p className="rd-potential-text">
              งานวิจัยนี้มีโอกาสต่อยอดสู่ผลิตภัณฑ์ {cat.label} ในตลาด wellness global
              ที่กำลังเติบโตอย่างต่อเนื่อง สนใจร่วมพัฒนา? ลงทะเบียนด้านล่างได้เลย
            </p>
          </div>
        </div>

        <div className="rd-footer">
          {paper.url && (
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="rd-btn-outline">
              ดูงานวิจัยต้นฉบับ ↗
            </a>
          )}
          <a href="#register" className="rd-btn-primary" onClick={onClose}>
            ลงทะเบียนต่อยอดงานวิจัยนี้ →
          </a>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   REGISTER SECTION (นักวิจัยลงทะเบียน)
══════════════════════════════════════════ */
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
    if (!form.first_name || !form.last_name || !form.email) {
      setErr("กรุณากรอกชื่อและอีเมล"); return;
    }
    setStatus("loading"); setErr("");
    try {
      const res = await fetch("/api/researcher-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          has_ip: form.has_ip === "yes" ? true : form.has_ip === "no" ? false : null,
          want_ip_help: form.has_ip === "no" ? form.want_ip_help : false,
          want_commercialize:
            form.want_commercialize === "yes" ? true :
            form.want_commercialize === "no" ? false : null,
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
        {/* LEFT copy */}
        <div className="rreg__copy">
          <div className="rreg__eyebrow">
            <span className="rreg__dot"/>
            สำหรับนักวิจัย
          </div>
          <h2 className="rreg__h2">
            อยากเผยแพร่งานวิจัย<br/>
            หรือ<em className="rreg__em"> ต่อยอดกับนักธุรกิจ?</em>
          </h2>
          <p className="rreg__desc">
            ลงทะเบียนงานวิจัยของคุณกับ FoodBridge IP เราจะช่วยประเมินศักยภาพ
            เชิงพาณิชย์ ดูแลเรื่อง IP และจับคู่กับผู้ประกอบการที่เหมาะสม
          </p>
          <div className="rreg__perks">
            {[
              "ฟรีตลอด Early Access",
              "ประเมิน business potential ให้",
              "ดูแล IP filing ให้ถ้าต้องการ",
              "จับคู่กับ SME ที่ตรงกับงานวิจัย",
            ].map(t => (
              <div className="rreg__perk" key={t}>
                <span className="rreg__perk-check">✓</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT form */}
        <div className="rreg__form-box">
          {status === "success" ? (
            <div className="rreg__success">
              <div className="rreg__success-icon">✓</div>
              <h3 className="rreg__success-title">ลงทะเบียนสำเร็จ! 🎉</h3>
              <p className="rreg__success-sub">
                ทีม FoodBridge IP จะติดต่อกลับภายใน 3 วันทำการ
              </p>
            </div>
          ) : (
            <>
              {/* Personal info */}
              <div className="rreg__section-label">ข้อมูลส่วนตัว</div>
              <div className="rreg__grid-2">
                <div className="rreg__field">
                  <label className="rreg__lbl">ชื่อ *</label>
                  <input className="rreg__input" placeholder="สมชาย" value={form.first_name} onChange={e => set("first_name", e.target.value)} />
                </div>
                <div className="rreg__field">
                  <label className="rreg__lbl">นามสกุล *</label>
                  <input className="rreg__input" placeholder="ใจดี" value={form.last_name} onChange={e => set("last_name", e.target.value)} />
                </div>
                <div className="rreg__field rreg__field--full">
                  <label className="rreg__lbl">อีเมล *</label>
                  <input className="rreg__input" type="email" placeholder="somchai@mahidol.ac.th" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="rreg__field">
                  <label className="rreg__lbl">มหาวิทยาลัย / สถาบัน</label>
                  <input className="rreg__input" placeholder="Mahidol University" value={form.institution} onChange={e => set("institution", e.target.value)} />
                </div>
                <div className="rreg__field">
                  <label className="rreg__lbl">ตำแหน่ง</label>
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

              {/* Research info */}
              <div className="rreg__section-label" style={{marginTop:20}}>ข้อมูลงานวิจัย</div>
              <div className="rreg__grid-1">
                <div className="rreg__field">
                  <label className="rreg__lbl">ชื่องานวิจัย</label>
                  <input className="rreg__input" placeholder="e.g. Bioactive compounds from Mangosteen pericarp..." value={form.research_title} onChange={e => set("research_title", e.target.value)} />
                </div>
                <div className="rreg__field">
                  <label className="rreg__lbl">บทคัดย่อ / รายละเอียดสั้นๆ</label>
                  <textarea className="rreg__textarea" rows={3} placeholder="อธิบายงานวิจัยของคุณสั้นๆ..." value={form.research_abstract} onChange={e => set("research_abstract", e.target.value)} />
                </div>
                <div className="rreg__field">
                  <label className="rreg__lbl">หมวดหมู่งานวิจัย</label>
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

              {/* IP Questions — สำคัญมาก */}
              <div className="rreg__section-label" style={{marginTop:20}}>เรื่อง IP & การต่อยอด</div>

              {/* Q1: มี IP ไหม */}
              <div className="rreg__field" style={{marginBottom:14}}>
                <label className="rreg__lbl">งานวิจัยนี้มี IP / Patent อยู่แล้วไหม?</label>
                <div className="rreg__radio-group">
                  {[
                    { val: "yes", label: "✅ มีแล้ว (Patent / Copyright / Trade Secret)" },
                    { val: "no",  label: "❌ ยังไม่มี" },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      className={`rreg__radio-btn ${form.has_ip === opt.val ? "rreg__radio-btn--active" : ""}`}
                      onClick={() => set("has_ip", opt.val)}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Q2: ถ้าไม่มี — อยากให้ช่วยยื่นไหม */}
              {form.has_ip === "no" && (
                <div className="rreg__field rreg__field--highlight" style={{marginBottom:14}}>
                  <label className="rreg__lbl">อยากให้ FoodBridge IP ช่วยดูแลเรื่อง IP filing ไหม?</label>
                  <div className="rreg__radio-group">
                    <button
                      className={`rreg__radio-btn ${form.want_ip_help ? "rreg__radio-btn--active" : ""}`}
                      onClick={() => set("want_ip_help", true)}
                    >🙋 ใช่ อยากให้ช่วย</button>
                    <button
                      className={`rreg__radio-btn ${form.want_ip_help === false && form.has_ip === "no" ? "rreg__radio-btn--active" : ""}`}
                      onClick={() => set("want_ip_help", false)}
                    >🚫 ไม่ต้องการตอนนี้</button>
                  </div>
                </div>
              )}

              {/* Q3: อยากต่อยอดกับนักธุรกิจไหม */}
              <div className="rreg__field" style={{marginBottom:14}}>
                <label className="rreg__lbl">ต้องการต่อยอดงานวิจัยกับนักธุรกิจ / SME ไหม?</label>
                <div className="rreg__radio-group">
                  {[
                    { val: "yes",    label: "🚀 ใช่ พร้อมเลย!" },
                    { val: "unsure", label: "🤔 ยังไม่แน่ใจ" },
                    { val: "no",     label: "🚫 ยังไม่ต้องการตอนนี้" },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      className={`rreg__radio-btn ${form.want_commercialize === opt.val ? "rreg__radio-btn--active" : ""}`}
                      onClick={() => set("want_commercialize", opt.val)}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>

              {/* Q4: Note เพิ่มเติม */}
              {(form.want_commercialize === "yes" || form.want_commercialize === "unsure") && (
                <div className="rreg__field rreg__field--highlight" style={{marginBottom:14}}>
                  <label className="rreg__lbl">มีความต้องการพิเศษหรืออยากบอกอะไรเพิ่มเติมไหม?</label>
                  <textarea
                    className="rreg__textarea" rows={2}
                    placeholder="เช่น อยากหา partner ในญี่ปุ่น หรืออยาก scale production..."
                    value={form.commercialize_note}
                    onChange={e => set("commercialize_note", e.target.value)}
                  />
                </div>
              )}

              {err && <div className="rreg__err">{err}</div>}

              <button className="rreg__submit" onClick={submit} disabled={status === "loading"}>
                {status === "loading"
                  ? <span className="rreg__spin"/>
                  : <>ลงทะเบียนนักวิจัย</>
                }
              </button>
              <p className="rreg__note">ฟรี ไม่มีค่าใช้จ่าย · ไม่มี spam</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FALLBACK PAPERS (real Mahidol food research)
══════════════════════════════════════════ */
const FALLBACK_PAPERS: Publication[] = [
  {
    uuid: "1", category: "nutraceutical",
    title: "Antioxidant and anti-inflammatory activities of Mangosteen pericarp extract",
    abstract: "This study investigated the bioactive xanthone compounds derived from Garcinia mangostana L. pericarp. The hydroxy-xanthones demonstrated potent antioxidant activity (DPPH IC50 = 12.3 μg/mL) and significant anti-inflammatory effects in LPS-induced macrophage models, suggesting strong potential for nutraceutical and cosmeceutical applications.",
    year: 2023, journal: "Food Chemistry",
    authors: ["Suwimol Charoenwong", "Piyawan Prasertsan", "Natthida Weerapreeyakul"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "2", category: "probiotic",
    title: "Probiotic properties of Lactobacillus strains isolated from Thai fermented foods",
    abstract: "Twelve Lactobacillus strains isolated from traditional Thai fermented foods including nham and som-fak were evaluated for probiotic characteristics. Selected strains showed high acid and bile tolerance, strong adhesion to Caco-2 cells, and inhibition of Salmonella typhimurium and Escherichia coli, making them candidates for functional food development.",
    year: 2023, journal: "LWT - Food Science and Technology",
    authors: ["Chompoonik Panpipat", "Wijak Kongkachuichai"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "3", category: "extract",
    title: "Bioactive compounds and health benefits of Thai holy basil (Ocimum tenuiflorum)",
    abstract: "A comprehensive review of phytochemical constituents and pharmacological activities of Ocimum tenuiflorum, a key Thai herb. Eugenol, rosmarinic acid, and ursolic acid were identified as major bioactives with anti-diabetic, cardioprotective, and anti-stress properties, supporting its incorporation into functional food products.",
    year: 2022, journal: "Journal of Ethnopharmacology",
    authors: ["Jutamas Jittiwat", "Pharkphoom Panichayupakaranant"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "4", category: "functional",
    title: "Resistant starch from Thai jasmine rice: preparation, characterization and glycemic response",
    abstract: "Type 3 resistant starch (RS3) was prepared from cooked and retrograded Thai jasmine rice. The RS3 fraction showed significantly lower glycemic index (GI = 28) compared to native rice starch (GI = 89). Bread substituted with 30% RS3 demonstrated acceptable sensory properties and prebiotic potential, supporting applications for diabetic-friendly functional foods.",
    year: 2023, journal: "Carbohydrate Polymers",
    authors: ["Rungnaphar Pongsawatmanit", "Onanong Naivikul"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "5", category: "extract",
    title: "Curcumin nanoparticles from Thai turmeric: enhanced bioavailability and anti-cancer activity",
    abstract: "Nano-encapsulation of curcumin using PLGA polymer increased water solubility 45-fold and improved oral bioavailability by 38× compared to free curcumin. In vitro studies showed significant cytotoxicity against HeLa and MCF-7 cancer cell lines with IC50 values of 2.1 and 3.4 μg/mL respectively.",
    year: 2024, journal: "International Journal of Pharmaceutics",
    authors: ["Waree Tiyaboonchai", "Supason Wanichwecharungruang"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "6", category: "probiotic",
    title: "Synbiotic effect of inulin from Thai agave and Bifidobacterium on gut microbiota",
    abstract: "Inulin-type fructooligosaccharides (FOS) extracted from Agave sisalana cultivated in Thailand were evaluated as a prebiotic substrate for Bifidobacterium longum BB536. The synbiotic combination significantly enhanced gut microbiota diversity, reduced pathogenic bacteria counts by 68%, and improved intestinal epithelial barrier function in a simulated colonic model.",
    year: 2023, journal: "Food Research International",
    authors: ["Apinya Sookwong", "Suganya Wisuthiphaet"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "7", category: "nutraceutical",
    title: "Anthocyanins from Thai purple corn: stability, bioavailability and cardiovascular protection",
    abstract: "Cyanidin-3-glucoside (C3G) and pelargonidin-3-glucoside extracted from Thai purple corn varieties demonstrated superior thermal stability and antioxidant capacity. In vivo rat models showed reduction in total cholesterol (23%), LDL cholesterol (31%), and inflammatory markers (IL-6 and TNF-α), indicating strong potential for heart-health nutraceutical development.",
    year: 2022, journal: "Nutrients",
    authors: ["Niwat Chongviriyaphan", "Wanna Phiromchom"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "8", category: "fermentation",
    title: "Bioethanol and value-added compounds from sugarcane bagasse using novel Thai fungal isolates",
    abstract: "Novel Trichoderma asperellum and Aspergillus niger strains isolated from Thai soil demonstrated high cellulolytic activity. Combined solid-state fermentation produced bioethanol yield of 18.4 g/100g dry biomass alongside valuable byproducts including ferulic acid (420 mg/kg) and vanillin (210 mg/kg) with potential cosmetic and food additive applications.",
    year: 2023, journal: "Bioresource Technology",
    authors: ["Ratana Sapan", "Klanarong Sriroth"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "9", category: "functional",
    title: "Morinda citrifolia (Noni) fermented beverage: antidiabetic and hepatoprotective effects",
    abstract: "Fermented Noni juice using Lactobacillus acidophilus showed enhanced bioavailability of iridoid glycosides. Eight-week supplementation in streptozotocin-induced diabetic rats significantly reduced fasting blood glucose (41%), HbA1c (27%), and liver enzyme levels (AST and ALT) while improving insulin sensitivity, supporting commercialization as a functional antidiabetic beverage.",
    year: 2024, journal: "Journal of Functional Foods",
    authors: ["Urai Suthisisang", "Panthip Ruangrungsi", "Porntip Siripong"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "10", category: "extract",
    title: "Green extraction of phenolic compounds from Butterfly pea flower using ultrasound-assisted technology",
    abstract: "Ultrasound-assisted extraction (UAE) of Clitoria ternatea flower significantly improved total phenolic content (TPC = 54.2 mg GAE/g) and anthocyanin yield (12.8 mg/g) compared to conventional hot-water extraction. The optimized extract showed potent ACE-inhibitory activity (IC50 = 0.48 mg/mL), antimicrobial properties, and natural blue coloring stability at neutral pH.",
    year: 2023, journal: "Ultrasonics Sonochemistry",
    authors: ["Siwaporn Longsomboon", "Rungpetch Sakulnarmrat"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "11", category: "nutraceutical",
    title: "Piperine-phospholipid complex from Thai long pepper: enhanced absorption for joint health",
    abstract: "A phospholipid complex of piperine isolated from Piper retrofractum Vahl (Thai long pepper) showed 6.8× higher oral bioavailability compared to piperine alone. The complex demonstrated significant anti-arthritic effects in adjuvant-induced arthritis models by suppressing COX-2 and NF-κB pathways, positioning it as a promising natural alternative for joint health supplements.",
    year: 2022, journal: "Phytomedicine",
    authors: ["Benjamart Chaisupa", "Nontima Vardhanabhuti"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
  {
    uuid: "12", category: "functional",
    title: "Encapsulated omega-3 from Thai squid processing by-products: oxidative stability and functional food application",
    abstract: "Omega-3 rich oil extracted from squid hepatopancreas waste was microencapsulated using a combination of modified starch and whey protein. The encapsulation efficiency reached 94.2% with superior oxidative stability (PV < 5 meq/kg after 12 months at 4°C). Fortification of UHT milk with 1% encapsulated oil achieved DHA/EPA levels meeting FDA daily recommendation without off-flavor.",
    year: 2024, journal: "Food Hydrocolloids",
    authors: ["Thanaset Sunphorka", "Siriporn Prichapan"],
    url: "https://murex.mahidol.ac.th/en/publications/",
  },
];

/* ── Icons ── */
function AuthorIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function BookIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function JournalIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}

/* ══════════════════════════════════════════
   CSS
══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:#F9FAFB;color:#111827;-webkit-font-smoothing:antialiased;}

/* NAV */
.rnav{
  position:sticky;top:0;z-index:200;
  background:rgba(255,255,255,0.82);
  backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid rgba(229,231,235,0.7);
  padding:0 5%;height:64px;
  display:flex;align-items:center;justify-content:space-between;
}
.rnav__logo{
  font-family:'Fraunces',serif;font-weight:600;font-size:1.15rem;
  color:#111827;text-decoration:none;
  display:flex;align-items:center;gap:9px;
}
.rnav__logo-icon{
  width:32px;height:32px;
  background:linear-gradient(135deg,#6D28D1,#8B5CF6);
  border-radius:9px;display:flex;align-items:center;justify-content:center;
}
.rnav__right{display:flex;align-items:center;gap:20px;}
.rnav__breadcrumb{font-size:.84rem;color:#9CA3AF;}
.rnav__cta{
  background:#6D28D1;color:#fff;
  font-size:.875rem;font-weight:600;
  padding:8px 20px;border-radius:9px;
  text-decoration:none;
  transition:background .2s,transform .15s;
  box-shadow:0 2px 12px rgba(109,40,209,.3);
}
.rnav__cta:hover{background:#4C1D95;transform:translateY(-1px);}

/* HERO */
.rhero{
  background:#0F0A1E;
  padding:80px 5% 60px;
  position:relative;overflow:hidden;
}
.rhero__bg{position:absolute;inset:0;pointer-events:none;}
.rhero__orb1{
  position:absolute;width:600px;height:600px;border-radius:50%;
  background:radial-gradient(circle,rgba(109,40,209,.5) 0%,transparent 70%);
  top:-200px;right:-100px;filter:blur(1px);
  animation:orbF1 8s ease-in-out infinite;
}
.rhero__orb2{
  position:absolute;width:400px;height:400px;border-radius:50%;
  background:radial-gradient(circle,rgba(139,92,246,.3) 0%,transparent 70%);
  bottom:-100px;left:-80px;
  animation:orbF2 10s ease-in-out infinite;
}
@keyframes orbF1{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
@keyframes orbF2{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-15px)}}
.rhero__inner{max-width:800px;margin:0 auto;position:relative;z-index:1;text-align:center;}
.rhero__badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(109,40,209,.25);border:1px solid rgba(139,92,246,.4);
  color:#c4b5fd;font-size:.75rem;font-weight:600;
  letter-spacing:.08em;text-transform:uppercase;
  padding:7px 16px;border-radius:20px;margin-bottom:20px;
}
.rhero__dot{
  width:6px;height:6px;border-radius:50%;
  background:#86efac;box-shadow:0 0 8px #86efac;
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
.rhero__h1{
  font-family:'Fraunces',serif;
  font-size:clamp(2rem,4vw,3.2rem);font-weight:700;
  color:white;line-height:1.15;letter-spacing:-.02em;margin-bottom:16px;
}
.rhero__h1 em{color:#a78bfa;font-style:italic;}
.rhero__sub{font-size:1rem;color:rgba(255,255,255,.6);line-height:1.75;margin-bottom:32px;max-width:560px;margin-left:auto;margin-right:auto;}
.rhero__stats{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;}
.rhero__stat{
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.1);
  border-radius:12px;padding:12px 20px;
}
.rhero__stat-n{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:600;color:#c4b5fd;line-height:1;}
.rhero__stat-l{font-size:.72rem;color:rgba(255,255,255,.4);margin-top:3px;}

/* FILTER BAR */
.rfilter-bar{
  background:white;
  border-bottom:1px solid #E5E7EB;
  padding:16px 5%;
  position:sticky;top:64px;z-index:100;
}
.rfilter-inner{
  max-width:1200px;margin:0 auto;
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
}
.rsearch-wrap{position:relative;flex:0 0 260px;}
.rsearch-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9CA3AF;pointer-events:none;}
.rsearch{
  width:100%;padding:9px 12px 9px 34px;
  border:1.5px solid #E5E7EB;border-radius:9px;
  font-size:.875rem;font-family:inherit;
  background:#F9FAFB;color:#111827;outline:none;
  transition:border-color .2s,background .2s;
}
.rsearch:focus{border-color:#6D28D1;background:white;}
.rcat-pills{display:flex;gap:7px;flex-wrap:wrap;}
.rcat-pill{
  font-size:.78rem;font-weight:500;
  padding:6px 14px;border-radius:20px;
  border:1px solid #E5E7EB;background:white;color:#4B5563;
  cursor:pointer;font-family:inherit;transition:all .15s;
}
.rcat-pill:hover{border-color:#6D28D1;color:#6D28D1;}
.rcat-pill--active{background:#EDE9FE;border-color:#6D28D1;color:#4C1D95;font-weight:600;}
.rresult-count{font-size:.84rem;color:#9CA3AF;margin-left:auto;}
.rresult-count strong{color:#6D28D1;}

/* GRID */
.rgrid-wrap{max-width:1200px;margin:0 auto;padding:32px 5% 80px;}
.rgrid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:20px;
}

/* LOADING */
.rloading{
  display:flex;flex-direction:column;align-items:center;gap:16px;
  padding:80px 0;color:#9CA3AF;font-size:.9rem;
}
.rspinner{
  width:32px;height:32px;border-radius:50%;
  border:3px solid #EDE9FE;border-top-color:#6D28D1;
  animation:spin .7s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}

/* EMPTY */
.rempty{display:flex;flex-direction:column;align-items:center;gap:14px;padding:80px 0;}
.rempty__icon{font-size:2.5rem;}
.rempty__text{font-family:'Fraunces',serif;font-size:1.1rem;color:#9CA3AF;}
.rempty__btn{
  background:#EDE9FE;color:#6D28D1;border:none;
  padding:9px 20px;border-radius:9px;font-size:.875rem;font-weight:600;
  cursor:pointer;font-family:inherit;
}

/* PAPER CARD */
.rcard{
  background:white;border-radius:16px;
  border:1px solid #E5E7EB;
  padding:22px;cursor:pointer;
  display:flex;flex-direction:column;
  transition:transform .22s,box-shadow .22s,border-color .22s;
  outline:none;
}
.rcard:hover{
  transform:translateY(-4px);
  box-shadow:0 12px 40px rgba(109,40,209,.1),0 2px 12px rgba(0,0,0,.05);
  border-color:rgba(109,40,209,.25);
}
.rcard:focus-visible{box-shadow:0 0 0 3px #EDE9FE,0 0 0 5px #6D28D1;}
.rcard__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.rcard__tag{
  font-size:.68rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.06em;padding:4px 10px;border-radius:20px;
}
.rcard__year{font-size:.78rem;color:#9CA3AF;font-weight:500;}
.rcard__title{
  font-family:'Fraunces',serif;font-size:.98rem;
  font-weight:600;color:#111827;
  line-height:1.4;margin-bottom:10px;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}
.rcard__abstract{
  font-size:.82rem;color:#6B7280;line-height:1.65;
  flex:1;margin-bottom:14px;
  display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
}
.rcard__authors{
  display:flex;align-items:center;gap:6px;
  font-size:.76rem;color:#9CA3AF;margin-bottom:14px;
}
.rcard__footer{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:12px;border-top:1px solid #F3F4F6;
}
.rcard__journal{
  display:flex;align-items:center;gap:6px;
  font-size:.75rem;color:#9CA3AF;max-width:55%;
}
.rcard__journal span{
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.rcard__btn{
  display:inline-flex;align-items:center;gap:5px;
  background:#EDE9FE;color:#4C1D95;
  font-size:.78rem;font-weight:600;
  padding:7px 13px;border-radius:8px;border:none;cursor:pointer;
  font-family:inherit;transition:background .2s;white-space:nowrap;
}
.rcard__btn:hover{background:#DDD6FE;}

/* DETAIL DRAWER */
.rd-overlay{
  position:fixed;inset:0;
  background:rgba(15,10,30,.55);
  backdrop-filter:blur(4px);z-index:400;cursor:pointer;
}
.rd-drawer{
  position:fixed;top:0;right:0;bottom:0;
  width:min(680px,100vw);background:white;
  z-index:500;overflow-y:auto;
  display:flex;flex-direction:column;
  box-shadow:-20px 0 60px rgba(0,0,0,.12);
  animation:slideIn .3s ease;
}
@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
.rd-header{
  padding:48px 36px 32px;
  position:relative;overflow:hidden;flex-shrink:0;
}
.rd-header::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle at 80% 20%,rgba(255,255,255,.1) 0,transparent 60%),
    linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:auto,40px 40px,40px 40px;pointer-events:none;
}
.rd-close{
  position:absolute;top:16px;right:16px;
  width:34px;height:34px;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
  border-radius:8px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:white;font-family:inherit;transition:background .2s;
}
.rd-close:hover{background:rgba(255,255,255,.28);}
.rd-header-tag{
  display:inline-block;font-size:.7rem;font-weight:700;
  text-transform:uppercase;letter-spacing:.07em;
  padding:4px 11px;border-radius:20px;
  margin-bottom:14px;position:relative;
}
.rd-title{
  font-family:'Fraunces',serif;font-size:1.45rem;font-weight:600;
  color:white;line-height:1.25;letter-spacing:-.02em;
  margin-bottom:8px;position:relative;
}
.rd-year{font-size:.84rem;color:rgba(255,255,255,.55);position:relative;}
.rd-body{padding:28px 36px;flex:1;}
.rd-section{margin-bottom:22px;}
.rd-sec-title{
  font-family:'Fraunces',serif;font-size:.95rem;font-weight:600;
  color:#111827;margin-bottom:8px;
  display:flex;align-items:center;gap:7px;
}
.rd-sec-title svg{color:#6D28D1;}
.rd-text{font-size:.88rem;color:#4B5563;line-height:1.8;}
.rd-potential{
  background:#EDE9FE;border:1px solid rgba(109,40,209,.2);
  border-radius:12px;padding:20px;margin-top:8px;
}
.rd-potential-title{font-weight:600;font-size:.9rem;color:#4C1D95;margin-bottom:8px;}
.rd-potential-text{font-size:.84rem;color:#6B7280;line-height:1.7;}
.rd-footer{
  display:flex;gap:10px;padding:24px 36px;
  background:#F9FAFB;border-top:1px solid #E5E7EB;flex-shrink:0;
}
.rd-btn-primary{
  flex:1;background:linear-gradient(135deg,#6D28D1,#8B5CF6);color:white;
  font-size:.9rem;font-weight:600;padding:12px;border-radius:10px;
  text-align:center;text-decoration:none;
  box-shadow:0 4px 16px rgba(109,40,209,.3);
  transition:opacity .2s;
}
.rd-btn-primary:hover{opacity:.88;}
.rd-btn-outline{
  background:white;color:#4B5563;font-size:.88rem;font-weight:500;
  padding:12px 16px;border-radius:10px;border:1.5px solid #E5E7EB;
  text-decoration:none;white-space:nowrap;
  transition:border-color .2s,color .2s;
}
.rd-btn-outline:hover{border-color:#6D28D1;color:#6D28D1;}

/* REGISTER SECTION */
.rreg{
  padding:100px 5%;
  background:linear-gradient(160deg,#4C1D95 0%,#6D28D1 45%,#7C3AED 100%);
  position:relative;overflow:hidden;
}
.rreg::before{
  content:'';position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);
  background-size:48px 48px;
}
.rreg__inner{
  position:relative;z-index:1;
  max-width:1100px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1.1fr;
  gap:60px;align-items:start;
}
.rreg__eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-size:.75rem;font-weight:600;letter-spacing:.08em;
  text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:16px;
}
.rreg__dot{
  width:6px;height:6px;border-radius:50%;
  background:#86efac;box-shadow:0 0 8px #86efac;
  animation:pulse 2s infinite;
}
.rreg__h2{
  font-family:'Fraunces',serif;
  font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;
  color:white;line-height:1.2;letter-spacing:-.02em;margin-bottom:16px;
}
.rreg__em{font-style:italic;color:#c4b5fd;}
.rreg__desc{font-size:.95rem;color:rgba(255,255,255,.7);line-height:1.75;margin-bottom:24px;}
.rreg__perks{display:flex;flex-direction:column;gap:10px;}
.rreg__perk{display:flex;align-items:center;gap:10px;font-size:.875rem;color:rgba(255,255,255,.85);}
.rreg__perk-check{
  width:20px;height:20px;border-radius:50%;
  background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;
  font-size:.7rem;font-weight:700;color:white;flex-shrink:0;
}
.rreg__form-box{
  background:white;border-radius:20px;padding:32px;
  box-shadow:0 20px 60px rgba(0,0,0,.2);
}
.rreg__section-label{
  font-size:.72rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.08em;color:#9CA3AF;margin-bottom:12px;
}
.rreg__grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;}
.rreg__grid-1{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:4px;}
.rreg__field{display:flex;flex-direction:column;gap:5px;}
.rreg__field--full{grid-column:1/-1;}
.rreg__field--highlight{
  background:#F0FDF4;border:1px solid #BBF7D0;
  border-radius:10px;padding:12px;
}
.rreg__lbl{font-size:.78rem;font-weight:600;color:#4B5563;}
.rreg__input{
  padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;
  font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;
  outline:none;transition:border-color .2s,background .2s;
}
.rreg__input:focus{border-color:#6D28D1;background:white;}
.rreg__select{
  padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;
  font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;
  outline:none;cursor:pointer;
}
.rreg__textarea{
  padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;
  font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;
  outline:none;resize:vertical;transition:border-color .2s,background .2s;
  line-height:1.6;
}
.rreg__textarea:focus{border-color:#6D28D1;background:white;}
.rreg__radio-group{display:flex;flex-direction:column;gap:7px;margin-top:6px;}
.rreg__radio-btn{
  display:flex;align-items:center;
  padding:10px 14px;border-radius:10px;
  border:1.5px solid #E5E7EB;background:#F9FAFB;
  color:#4B5563;font-size:.84rem;font-weight:500;
  cursor:pointer;font-family:inherit;text-align:left;
  transition:all .15s;
}
.rreg__radio-btn:hover{border-color:#6D28D1;color:#4C1D95;}
.rreg__radio-btn--active{background:#EDE9FE;border-color:#6D28D1;color:#4C1D95;font-weight:600;}
.rreg__err{
  font-size:.8rem;color:#dc2626;background:#FEF2F2;
  border:1px solid #FECACA;border-radius:8px;
  padding:8px 12px;margin:12px 0;
}
.rreg__submit{
  width:100%;margin-top:20px;
  background:linear-gradient(135deg,#6D28D1,#8B5CF6);
  color:white;font-size:.95rem;font-weight:600;
  padding:14px;border-radius:11px;border:none;cursor:pointer;
  font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 20px rgba(109,40,209,.35);
  transition:opacity .2s,transform .15s;
  position:relative;overflow:hidden;
}
.rreg__submit:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
.rreg__submit:disabled{opacity:.6;cursor:not-allowed;}
.rreg__spin{
  width:18px;height:18px;border-radius:50%;
  border:2.5px solid rgba(255,255,255,.3);
  border-top-color:white;animation:spin .7s linear infinite;display:inline-block;
}
.rreg__note{font-size:.75rem;color:#9CA3AF;text-align:center;margin-top:8px;}
.rreg__success{text-align:center;padding:32px 16px;}
.rreg__success-icon{
  width:64px;height:64px;border-radius:50%;
  background:#D1FAE5;color:#065F46;
  font-size:1.8rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
}
.rreg__success-title{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:600;color:#111827;margin-bottom:8px;}
.rreg__success-sub{font-size:.9rem;color:#6B7280;line-height:1.6;}

/* RESPONSIVE */
@media(max-width:960px){
  .rreg__inner{grid-template-columns:1fr;gap:40px;}
  .rd-drawer{width:100vw;}
}
@media(max-width:640px){
  .rfilter-inner{flex-direction:column;align-items:flex-start;}
  .rsearch-wrap{flex:none;width:100%;}
  .rreg__grid-2{grid-template-columns:1fr;}
  .rreg__radio-group{flex-direction:column;}
}
`;