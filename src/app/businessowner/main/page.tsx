"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────
   app/business/page.tsx  →  /business
   Services showcase + Business profile form
───────────────────────────────────────────── */

type Status = "idle" | "loading" | "success" | "error";

interface FormData {
  first_name: string; last_name: string; email: string;
  company_name: string; company_type: string; industry: string;
  website: string; phone: string;
  need_ip_matching: boolean; need_product_dev: boolean;
  need_oem: boolean; need_export: boolean;
  need_legal: boolean; need_consulting: boolean;
  product_category: string; target_market: string;
  budget_range: string; timeline: string;
  has_existing_oem: boolean | null;
  additional_notes: string;
}

const INIT: FormData = {
  first_name:"", last_name:"", email:"",
  company_name:"", company_type:"", industry:"",
  website:"", phone:"",
  need_ip_matching:false, need_product_dev:false,
  need_oem:false, need_export:false,
  need_legal:false, need_consulting:false,
  product_category:"", target_market:"",
  budget_range:"", timeline:"",
  has_existing_oem:null,
  additional_notes:"",
};

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function BusinessPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INIT);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");
  const [profileId, setProfileId] = useState("");

  const set = (k: keyof FormData, v: any) =>
    setForm(f => ({ ...f, [k]: v }));
  const toggle = (k: keyof FormData) =>
    setForm(f => ({ ...f, [k]: !f[k] }));

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      setErr("กรุณากรอกชื่อและอีเมล"); return;
    }
    const anyNeed = form.need_ip_matching || form.need_product_dev ||
      form.need_oem || form.need_export || form.need_legal || form.need_consulting;
    if (!anyNeed) { setErr("กรุณาเลือกบริการที่สนใจอย่างน้อย 1 อย่าง"); return; }

    setStatus("loading"); setErr("");
    try {
      const res = await fetch("/api/business-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "เกิดข้อผิดพลาด"); setStatus("error"); return; }
      setStatus("success");
      setProfileId(data.id);
    } catch {
      setErr("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"); setStatus("error");
    }
  };

  const goRoadmap = () => {
    // store needs in sessionStorage for roadmap page
    sessionStorage.setItem("biz_profile", JSON.stringify({
      id: profileId,
      name: `${form.first_name} ${form.last_name}`,
      company: form.company_name,
      needs: {
        ip_matching: form.need_ip_matching,
        product_dev: form.need_product_dev,
        oem: form.need_oem,
        export: form.need_export,
        legal: form.need_legal,
        consulting: form.need_consulting,
      },
      target_market: form.target_market,
    }));
    router.push("/businessowner/roadmap");
  };

  return (
    <>
      <style>{CSS}</style>
      <Nav />
      <main>
        <BizHero />
        <ServicesSection />
        <HowWeWork />
        <ProfileForm
          form={form} set={set} toggle={toggle}
          status={status} err={err}
          onSubmit={submit} onRoadmap={goRoadmap}
        />
      </main>
      <Footer />
    </>
  );
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="bnav">
      <a href="/" className="bnav__logo">
        <div className="bnav__icon">
          <LayersIcon />
        </div>
        FoodBridge<span style={{ color: "#8B5CF6" }}>IP</span>
      </a>
      <div className="bnav__right">
        <span className="bnav__crumb">/ Business Hub</span>
        <a href="#profile" className="bnav__cta">เริ่มต้นเลย</a>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function BizHero() {
  return (
    <section className="bhero">
      <div className="bhero__bg">
        <div className="bhero__orb1" /><div className="bhero__orb2" />
        <div className="bhero__grid" />
      </div>
      <div className="bhero__inner">
        <div className="bhero__badge"><span className="bhero__dot" />For Business Owners</div>
        <h1 className="bhero__h1">
          จาก Idea สู่<br/>
          <em className="bhero__em">ผลิตภัณฑ์ที่ขายได้จริง</em><br/>
          ทั่วโลก
        </h1>
        <p className="bhero__sub">
          FoodBridge IP ดูแลทุกขั้นตอนให้คุณ ตั้งแต่หา IP งานวิจัย
          จับคู่โรงงาน OEM ดูแลกฎหมาย ไปจนถึงวางแผนส่งออก
        </p>
        <div className="bhero__actions">
          <a href="#services" className="bhero__btn-outline">ดูบริการทั้งหมด ↓</a>
          <a href="#profile" className="bhero__btn-primary">
            <span className="bhero__shine" />
            เริ่มต้นเดี๋ยวนี้ →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   SERVICES SECTION
══════════════════════════════════════════ */
const SERVICES = [
  {
    id: "ip",
    emoji: "🔬",
    title: "IP Matching",
    subtitle: "จับคู่งานวิจัย → ผลิตภัณฑ์",
    color: "#6D28D1",
    bgFrom: "#1e0a3c",
    bgTo: "#4c1d95",
    accent: "#a78bfa",
    features: [
      "ค้นหา IP จาก 240+ งานวิจัยไทย",
      "วิเคราะห์ market potential ให้",
      "จัดการ licensing agreement",
      "Business score + ROI forecast",
    ],
    tag: "Most Popular",
  },
  {
    id: "oem",
    emoji: "🏭",
    title: "OEM Network",
    subtitle: "เชื่อมโรงงาน → ผลิตได้เลย",
    color: "#059669",
    bgFrom: "#022c22",
    bgTo: "#065f46",
    accent: "#34d399",
    features: [
      "เครือข่ายโรงงาน OEM ที่ผ่านการคัดแล้ว",
      "ออกแบบ production pathway",
      "MOQ เริ่มต้นเล็กได้ ขยายทีหลัง",
      "QC และ GMP compliance",
    ],
    tag: null,
  },
  {
    id: "legal",
    emoji: "⚖️",
    title: "Legal & Compliance",
    subtitle: "IP, อย. และกฎหมาย — จัดให้ครบ",
    color: "#1d4ed8",
    bgFrom: "#1e1b4b",
    bgTo: "#1e40af",
    accent: "#93c5fd",
    features: [
      "ยื่นขอ Patent / Trade Secret",
      "ขึ้นทะเบียน อย. ไทยและต่างประเทศ",
      "Health claims compliance",
      "Licensing agreement drafting",
    ],
    tag: null,
  },
  {
    id: "export",
    emoji: "🌏",
    title: "Global Export",
    subtitle: "วางแผนส่งออก → ตลาดโลก",
    color: "#d97706",
    bgFrom: "#451a03",
    bgTo: "#92400e",
    accent: "#fcd34d",
    features: [
      "Market entry strategy ASEAN / EU / JP",
      "หา distributor และ partner",
      "Logistics และ customs",
      "Brand positioning ตลาดต่างประเทศ",
    ],
    tag: "Growing Fast",
  },
];

function ServicesSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bsvc" id="services">
      <div className="bsvc__inner">
        <div className="b-shead">
          <div className="b-eyebrow"><div className="b-eline"/>บริการของเรา<div className="b-eline"/></div>
          <h2 className="b-stitle">ครบทุก Service<br/>ในที่เดียว</h2>
          <p className="b-ssub">ไม่ต้องวิ่งหาเองหลายที่ FoodBridge IP จัดการให้ครบวงจร</p>
        </div>

        <div className="bsvc__grid">
          {SERVICES.map(svc => (
            <div
              key={svc.id}
              className={`bsvc__card ${active === svc.id ? "bsvc__card--open" : ""}`}
              style={{ "--svc-color": svc.color, "--svc-accent": svc.accent } as any}
              onClick={() => setActive(active === svc.id ? null : svc.id)}
            >
              <div className="bsvc__card-bg" style={{
                background: `linear-gradient(145deg, ${svc.bgFrom}, ${svc.bgTo})`
              }} />
              {svc.tag && <div className="bsvc__tag">{svc.tag}</div>}
              <div className="bsvc__emoji">{svc.emoji}</div>
              <div className="bsvc__card-title">{svc.title}</div>
              <div className="bsvc__card-sub">{svc.subtitle}</div>

              {/* Expandable features */}
              <div className="bsvc__features">
                {svc.features.map(f => (
                  <div className="bsvc__feature" key={f}>
                    <span className="bsvc__check">✓</span>{f}
                  </div>
                ))}
                <a href="#profile" className="bsvc__learn-btn">
                  เริ่มใช้บริการนี้ →
                </a>
              </div>

              <div className="bsvc__toggle-hint">
                {active === svc.id ? "▲ ย่อลง" : "▼ ดูรายละเอียด"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   HOW WE WORK — horizontal timeline
══════════════════════════════════════════ */
const STEPS = [
  { n: "01", icon: "📝", title: "กรอกโปรไฟล์", body: "บอกเราว่าธุรกิจคุณเป็นแบบไหน ต้องการอะไร ใช้เวลาไม่เกิน 5 นาที" },
  { n: "02", icon: "🎯", title: "รับ Roadmap", body: "ระบบสร้าง roadmap เฉพาะสำหรับธุรกิจของคุณพร้อม IP ที่แนะนำ" },
  { n: "03", icon: "🤝", title: "Match & Connect", body: "ทีม concierge จับคู่คุณกับนักวิจัย โรงงาน OEM และ expert ที่ใช่" },
  { n: "04", icon: "🚀", title: "Launch!", body: "ผลิตภัณฑ์ออกสู่ตลาดพร้อม IP ที่ถูกกฎหมายและแผนส่งออกที่ชัดเจน" },
];

function HowWeWork() {
  return (
    <section className="bhow">
      <div className="bhow__inner">
        <div className="b-shead b-shead--light">
          <div className="b-eyebrow b-eyebrow--light"><div className="b-eline b-eline--light"/>กระบวนการทำงาน<div className="b-eline b-eline--light"/></div>
          <h2 className="b-stitle b-stitle--light">เริ่มต้นง่าย ได้ผลเร็ว</h2>
          <p className="b-ssub b-ssub--light">4 ขั้นตอน จากศูนย์ถึงผลิตภัณฑ์ที่ขายได้</p>
        </div>
        <div className="bhow__steps">
          {STEPS.map((s, i) => (
            <div className="bhow__step" key={s.n}>
              {i < STEPS.length - 1 && <div className="bhow__arrow">→</div>}
              <div className="bhow__icon">{s.icon}</div>
              <div className="bhow__num">{s.n}</div>
              <div className="bhow__title">{s.title}</div>
              <p className="bhow__body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PROFILE FORM
══════════════════════════════════════════ */
function ProfileForm({ form, set, toggle, status, err, onSubmit, onRoadmap }: {
  form: FormData;
  set: (k: keyof FormData, v: any) => void;
  toggle: (k: keyof FormData) => void;
  status: Status; err: string;
  onSubmit: () => void;
  onRoadmap: () => void;
}) {
  const SERVICES_CHECK = [
    { key: "need_ip_matching", label: "🔬 IP Matching", desc: "หางานวิจัยมาต่อยอด" },
    { key: "need_product_dev", label: "💡 Product Development", desc: "พัฒนาผลิตภัณฑ์ใหม่" },
    { key: "need_oem",         label: "🏭 OEM / Manufacturing", desc: "หาโรงงานผลิต" },
    { key: "need_export",      label: "🌏 Export Planning", desc: "วางแผนส่งออก" },
    { key: "need_legal",       label: "⚖️ Legal & Compliance", desc: "IP, อย., กฎหมาย" },
    { key: "need_consulting",  label: "💬 Business Consulting", desc: "ปรึกษาและวิเคราะห์" },
  ] as const;

  if (status === "success") {
    return (
      <section className="bform" id="profile">
        <div className="bform__inner">
          <div className="bform__success">
            <div className="bform__success-ring">
              <div className="bform__success-icon">🎉</div>
            </div>
            <h2 className="bform__success-title">โปรไฟล์ถูกบันทึกแล้ว!</h2>
            <p className="bform__success-sub">
              ทีม FoodBridge IP ได้รับข้อมูลของคุณแล้ว<br/>
              ตอนนี้ดู Roadmap ที่สร้างเฉพาะสำหรับธุรกิจคุณได้เลย
            </p>
            <button className="bform__roadmap-btn" onClick={onRoadmap}>
              <span className="bform__roadmap-btn-shine" />
              ดู Your Roadmap →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bform" id="profile">
      <div className="bform__inner">
        <div className="bform__left">
          <div className="bform__eyebrow"><span className="bform__dot" />เริ่มต้นกับเรา</div>
          <h2 className="bform__h2">
            บอกเราเกี่ยวกับ<br/>
            <em className="bform__em">ธุรกิจของคุณ</em>
          </h2>
          <p className="bform__desc">
            กรอกข้อมูลเพียงครั้งเดียว เราจะสร้าง roadmap
            และจับคู่ service ที่ตรงกับความต้องการของคุณโดยเฉพาะ
          </p>
          <div className="bform__promises">
            {["ทีม concierge ติดต่อกลับใน 24 ชั่วโมง",
              "ไม่มีค่าใช้จ่ายสำหรับการปรึกษาครั้งแรก",
              "ข้อมูลของคุณถูกเก็บไว้อย่างปลอดภัย 100%",
            ].map(t => (
              <div className="bform__promise" key={t}>
                <span className="bform__promise-check">✓</span>{t}
              </div>
            ))}
          </div>
        </div>

        <div className="bform__box">
          {/* ─ Section 1: Personal info ─ */}
          <div className="bform__sec-label">ข้อมูลส่วนตัวและบริษัท</div>
          <div className="bform__g2">
            <Field label="ชื่อ *">
              <input className="bi" placeholder="สมชาย" value={form.first_name} onChange={e => set("first_name", e.target.value)} />
            </Field>
            <Field label="นามสกุล *">
              <input className="bi" placeholder="รักไทย" value={form.last_name} onChange={e => set("last_name", e.target.value)} />
            </Field>
            <Field label="อีเมล *" full>
              <input className="bi" type="email" placeholder="you@company.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </Field>
            <Field label="ชื่อบริษัท / แบรนด์">
              <input className="bi" placeholder="FoodTech Co., Ltd." value={form.company_name} onChange={e => set("company_name", e.target.value)} />
            </Field>
            <Field label="ประเภทธุรกิจ">
              <select className="bs" value={form.company_type} onChange={e => set("company_type", e.target.value)}>
                <option value="">เลือก...</option>
                <option>Startup (อายุน้อยกว่า 3 ปี)</option>
                <option>SME ที่มีอยู่แล้ว</option>
                <option>Corporation / Enterprise</option>
                <option>Individual / Freelancer</option>
                <option>Investor</option>
              </select>
            </Field>
            <Field label="อุตสาหกรรม" full>
              <select className="bs" value={form.industry} onChange={e => set("industry", e.target.value)}>
                <option value="">เลือก...</option>
                <option>Food & Beverage</option>
                <option>Health & Wellness</option>
                <option>Nutraceutical / Supplement</option>
                <option>Cosmetic & Personal Care</option>
                <option>Agricultural Tech</option>
                <option>Retail / Distribution</option>
              </select>
            </Field>
          </div>

          {/* ─ Section 2: Services needed ─ */}
          <div className="bform__sec-label" style={{ marginTop: 22 }}>
            ต้องการบริการอะไรบ้าง? * (เลือกได้หลายอย่าง)
          </div>
          <div className="bform__svc-grid">
            {SERVICES_CHECK.map(s => (
              <button
                key={s.key}
                className={`bform__svc-btn ${form[s.key] ? "bform__svc-btn--on" : ""}`}
                onClick={() => toggle(s.key as keyof FormData)}
                type="button"
              >
                <span className="bform__svc-label">{s.label}</span>
                <span className="bform__svc-desc">{s.desc}</span>
                {form[s.key] && <span className="bform__svc-check">✓</span>}
              </button>
            ))}
          </div>

          {/* ─ Section 3: Details ─ */}
          <div className="bform__sec-label" style={{ marginTop: 22 }}>รายละเอียดเพิ่มเติม</div>
          <div className="bform__g2">
            <Field label="ประเภทผลิตภัณฑ์ที่สนใจ">
              <select className="bs" value={form.product_category} onChange={e => set("product_category", e.target.value)}>
                <option value="">เลือก...</option>
                <option>Functional Beverage / Drink</option>
                <option>Supplement / Capsule</option>
                <option>Cosmeceutical / Skincare</option>
                <option>Functional Snack / Food</option>
                <option>Ingredient / Raw Material</option>
                <option>ยังไม่แน่ใจ</option>
              </select>
            </Field>
            <Field label="ตลาดเป้าหมาย">
              <select className="bs" value={form.target_market} onChange={e => set("target_market", e.target.value)}>
                <option value="">เลือก...</option>
                <option>ไทย</option>
                <option>ASEAN (เวียดนาม, อินโด, ฯลฯ)</option>
                <option>ญี่ปุ่น / เกาหลี</option>
                <option>EU / UK</option>
                <option>USA / Canada</option>
                <option>ตะวันออกกลาง</option>
                <option>หลายตลาด</option>
              </select>
            </Field>
            <Field label="งบประมาณโดยประมาณ">
              <select className="bs" value={form.budget_range} onChange={e => set("budget_range", e.target.value)}>
                <option value="">เลือก...</option>
                <option>น้อยกว่า 500K บาท</option>
                <option>500K – 2M บาท</option>
                <option>2M – 10M บาท</option>
                <option>มากกว่า 10M บาท</option>
              </select>
            </Field>
            <Field label="ระยะเวลาที่ต้องการ">
              <select className="bs" value={form.timeline} onChange={e => set("timeline", e.target.value)}>
                <option value="">เลือก...</option>
                <option>เร็วที่สุด (ใน 3 เดือน)</option>
                <option>6 เดือน</option>
                <option>1 ปี</option>
                <option>ยืดหยุ่นได้</option>
              </select>
            </Field>
          </div>

          {/* OEM question */}
          {form.need_oem && (
            <div className="bform__highlight-field">
              <div className="bform__sec-label" style={{ marginBottom: 10 }}>
                คุณมีโรงงาน OEM อยู่แล้วไหม?
              </div>
              <div className="bform__radio-row">
                {[
                  { val: true, label: "✅ มีอยู่แล้ว แต่ต้องการตัวเลือกเพิ่ม" },
                  { val: false, label: "🔍 ยังไม่มี ต้องการหาใหม่" },
                ].map(o => (
                  <button
                    key={String(o.val)}
                    className={`bform__radio ${form.has_existing_oem === o.val ? "bform__radio--on" : ""}`}
                    onClick={() => set("has_existing_oem", o.val)}
                  >{o.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Additional notes */}
          <Field label="บอกเราเพิ่มเติม — ความต้องการพิเศษ / คำถาม" full>
            <textarea className="bta" rows={3}
              placeholder="เช่น อยากหา IP เกี่ยวกับ probiotic สำหรับตลาดญี่ปุ่น หรือมีงบ 5M อยากได้ผลิตภัณฑ์พร้อมขายใน 6 เดือน..."
              value={form.additional_notes}
              onChange={e => set("additional_notes", e.target.value)}
            />
          </Field>

          {err && <div className="berr">{err}</div>}

          <button className="bform__submit" onClick={onSubmit} disabled={status === "loading"}>
            {status === "loading"
              ? <span className="bspin" />
              : <>บันทึกโปรไฟล์และดู Roadmap →</>
            }
          </button>
          <p className="bform__note">ฟรี ไม่มีค่าใช้จ่าย · ติดต่อกลับใน 24 ชั่วโมง</p>
        </div>
      </div>
    </section>
  );
}

/* ── tiny Field wrapper ── */
function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={`bfield ${full ? "bfield--full" : ""}`}>
      <label className="blbl">{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bfooter">
      <div className="bfooter__inner">
        <span className="bfooter__logo">FoodBridge<span style={{color:"#8B5CF6"}}>IP</span></span>
        <span className="bfooter__copy">© 2025 FoodBridge IP Co., Ltd.</span>
        <div className="bfooter__links">
          <a href="/">หน้าแรก</a>
          <a href="/researcher">นักวิจัย</a>
        </div>
      </div>
    </footer>
  );
}

function LayersIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
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
.bnav{position:sticky;top:0;z-index:200;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(229,231,235,0.7);padding:0 5%;height:64px;display:flex;align-items:center;justify-content:space-between;}
.bnav__logo{font-family:'Fraunces',serif;font-weight:600;font-size:1.15rem;color:#111827;text-decoration:none;display:flex;align-items:center;gap:9px;}
.bnav__icon{width:32px;height:32px;background:linear-gradient(135deg,#6D28D1,#8B5CF6);border-radius:9px;display:flex;align-items:center;justify-content:center;}
.bnav__right{display:flex;align-items:center;gap:18px;}
.bnav__crumb{font-size:.84rem;color:#9CA3AF;}
.bnav__cta{background:#6D28D1;color:#fff;font-size:.875rem;font-weight:600;padding:8px 20px;border-radius:9px;text-decoration:none;transition:background .2s,transform .15s;box-shadow:0 2px 12px rgba(109,40,209,.3);}
.bnav__cta:hover{background:#4C1D95;transform:translateY(-1px);}

/* HERO */
.bhero{min-height:88vh;background:#0F0A1E;display:flex;align-items:center;padding:100px 5% 60px;position:relative;overflow:hidden;}
.bhero__bg{position:absolute;inset:0;pointer-events:none;}
.bhero__orb1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(109,40,209,.5) 0%,transparent 70%);top:-200px;right:-150px;animation:bOrb1 8s ease-in-out infinite;}
.bhero__orb2{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(5,150,105,.25) 0%,transparent 70%);bottom:-100px;left:-100px;animation:bOrb2 10s ease-in-out infinite;}
.bhero__grid{position:absolute;inset:0;background-image:linear-gradient(rgba(109,40,209,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(109,40,209,.05) 1px,transparent 1px);background-size:64px 64px;}
@keyframes bOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,25px)}}
@keyframes bOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-18px)}}
.bhero__inner{max-width:720px;margin:0 auto;position:relative;z-index:1;text-align:center;}
.bhero__badge{display:inline-flex;align-items:center;gap:8px;background:rgba(109,40,209,.25);border:1px solid rgba(139,92,246,.4);color:#c4b5fd;font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:7px 16px;border-radius:20px;margin-bottom:20px;}
.bhero__dot{width:6px;height:6px;border-radius:50%;background:#86efac;box-shadow:0 0 8px #86efac;animation:bpulse 2s infinite;}
@keyframes bpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
.bhero__h1{font-family:'Fraunces',serif;font-size:clamp(2.2rem,4.5vw,3.6rem);font-weight:700;color:white;line-height:1.12;letter-spacing:-.025em;margin-bottom:20px;}
.bhero__em{color:#a78bfa;font-style:italic;}
.bhero__sub{font-size:1.05rem;color:rgba(255,255,255,.6);line-height:1.75;max-width:560px;margin:0 auto 36px;}
.bhero__actions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;}
.bhero__btn-primary{position:relative;overflow:hidden;display:inline-flex;align-items:center;background:linear-gradient(135deg,#6D28D1,#8B5CF6);color:white;font-size:.95rem;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;box-shadow:0 4px 24px rgba(109,40,209,.5);transition:transform .2s,box-shadow .2s;}
.bhero__btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(109,40,209,.65);}
.bhero__shine{position:absolute;top:-50%;left:-75%;width:50%;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:skewX(-20deg);animation:bshine 3s ease-in-out infinite;}
@keyframes bshine{0%,100%{left:-75%}50%{left:150%}}
.bhero__btn-outline{display:inline-flex;align-items:center;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.8);font-size:.9rem;font-weight:500;padding:14px 24px;border-radius:12px;text-decoration:none;backdrop-filter:blur(8px);transition:background .2s;}
.bhero__btn-outline:hover{background:rgba(255,255,255,.12);}

/* SECTION SHARED */
.b-shead{text-align:center;margin-bottom:56px;}
.b-eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#6D28D1;margin-bottom:14px;}
.b-eline{width:22px;height:1.5px;background:#6D28D1;}
.b-eyebrow--light{color:rgba(255,255,255,.6);}
.b-eline--light{background:rgba(255,255,255,.3);}
.b-stitle{font-family:'Fraunces',serif;font-size:clamp(1.8rem,2.8vw,2.5rem);font-weight:700;color:#111827;letter-spacing:-.02em;line-height:1.2;margin-bottom:14px;}
.b-stitle--light{color:white;}
.b-ssub{font-size:1rem;color:#9CA3AF;max-width:480px;margin:0 auto;}
.b-ssub--light{color:rgba(255,255,255,.5);}

/* SERVICES GRID */
.bsvc{padding:100px 5%;background:#F9FAFB;}
.bsvc__inner{max-width:1200px;margin:0 auto;}
.bsvc__grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
.bsvc__card{
  position:relative;border-radius:20px;padding:28px 22px;
  cursor:pointer;overflow:hidden;
  border:1px solid rgba(255,255,255,.08);
  transition:transform .3s,box-shadow .3s;
  min-height:220px;
}
.bsvc__card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.25);}
.bsvc__card--open{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.2);}
.bsvc__card-bg{position:absolute;inset:0;z-index:0;}
.bsvc__card-bg::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 10%,rgba(255,255,255,.08) 0%,transparent 60%),linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:auto,32px 32px,32px 32px;}
.bsvc__tag{position:absolute;top:14px;right:14px;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.9);padding:3px 9px;border-radius:20px;z-index:1;}
.bsvc__emoji{font-size:2rem;margin-bottom:12px;position:relative;z-index:1;}
.bsvc__card-title{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:600;color:white;margin-bottom:6px;position:relative;z-index:1;}
.bsvc__card-sub{font-size:.8rem;color:rgba(255,255,255,.6);margin-bottom:14px;position:relative;z-index:1;}
.bsvc__toggle-hint{font-size:.72rem;color:rgba(255,255,255,.4);position:relative;z-index:1;margin-top:auto;}
.bsvc__features{
  max-height:0;overflow:hidden;
  transition:max-height .4s ease;
  position:relative;z-index:1;
}
.bsvc__card--open .bsvc__features{max-height:280px;}
.bsvc__feature{display:flex;align-items:flex-start;gap:8px;font-size:.8rem;color:rgba(255,255,255,.8);margin-bottom:8px;}
.bsvc__check{color:var(--svc-accent);font-weight:700;flex-shrink:0;}
.bsvc__learn-btn{
  display:inline-flex;align-items:center;gap:6px;
  margin-top:12px;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);
  color:white;font-size:.8rem;font-weight:600;
  padding:8px 14px;border-radius:9px;text-decoration:none;
  transition:background .2s;
}
.bsvc__learn-btn:hover{background:rgba(255,255,255,.25);}

/* HOW WE WORK */
.bhow{padding:100px 5%;background:linear-gradient(135deg,#1e0a3c,#2d1b69);}
.bhow__inner{max-width:1200px;margin:0 auto;}
.bhow__steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative;}
.bhow__step{padding:28px 24px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);position:relative;transition:background .25s;}
.bhow__step:first-child{border-radius:16px 0 0 16px;}
.bhow__step:last-child{border-radius:0 16px 16px 0;}
.bhow__step:hover{background:rgba(255,255,255,.08);}
.bhow__arrow{position:absolute;top:36px;right:-14px;width:28px;height:28px;background:#2d1b69;border:1px solid rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#a78bfa;font-size:13px;z-index:1;}
.bhow__icon{font-size:1.8rem;margin-bottom:12px;}
.bhow__num{font-family:'Fraunces',serif;font-size:.7rem;font-weight:600;color:#a78bfa;letter-spacing:.1em;margin-bottom:8px;}
.bhow__title{font-family:'Fraunces',serif;font-size:1rem;font-weight:600;color:white;margin-bottom:8px;}
.bhow__body{font-size:.82rem;color:rgba(255,255,255,.55);line-height:1.7;}

/* PROFILE FORM */
.bform{padding:100px 5%;background:linear-gradient(160deg,#4C1D95 0%,#6D28D1 50%,#7C3AED 100%);position:relative;overflow:hidden;}
.bform::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:48px 48px;}
.bform__inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;display:grid;grid-template-columns:1fr 1.2fr;gap:60px;align-items:start;}
.bform__eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:16px;}
.bform__dot{width:6px;height:6px;border-radius:50%;background:#86efac;box-shadow:0 0 8px #86efac;animation:bpulse 2s infinite;}
.bform__h2{font-family:'Fraunces',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;color:white;line-height:1.2;letter-spacing:-.02em;margin-bottom:16px;}
.bform__em{font-style:italic;color:#c4b5fd;}
.bform__desc{font-size:.95rem;color:rgba(255,255,255,.7);line-height:1.75;margin-bottom:24px;}
.bform__promises{display:flex;flex-direction:column;gap:10px;}
.bform__promise{display:flex;align-items:center;gap:10px;font-size:.875rem;color:rgba(255,255,255,.85);}
.bform__promise-check{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:white;flex-shrink:0;}

/* Form box */
.bform__box{background:white;border-radius:20px;padding:32px;box-shadow:0 20px 60px rgba(0,0,0,.2);}
.bform__sec-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9CA3AF;margin-bottom:12px;}
.bform__g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;}
.bfield{display:flex;flex-direction:column;gap:5px;}
.bfield--full{grid-column:1/-1;}
.blbl{font-size:.78rem;font-weight:600;color:#4B5563;}
.bi{padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;transition:border-color .2s,background .2s;width:100%;}
.bi:focus{border-color:#6D28D1;background:white;}
.bs{padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;cursor:pointer;width:100%;}
.bta{padding:9px 12px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:.875rem;font-family:inherit;color:#111827;background:#F9FAFB;outline:none;resize:vertical;line-height:1.6;width:100%;transition:border-color .2s,background .2s;}
.bta:focus{border-color:#6D28D1;background:white;}

/* Service checkboxes */
.bform__svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px;}
.bform__svc-btn{
  display:flex;flex-direction:column;align-items:flex-start;
  padding:12px 14px;border-radius:11px;
  border:1.5px solid #E5E7EB;background:#F9FAFB;
  cursor:pointer;font-family:inherit;text-align:left;
  transition:all .15s;position:relative;
}
.bform__svc-btn:hover{border-color:#6D28D1;background:#F5F3FF;}
.bform__svc-btn--on{background:#EDE9FE;border-color:#6D28D1;}
.bform__svc-label{font-size:.84rem;font-weight:600;color:#111827;margin-bottom:2px;}
.bform__svc-btn--on .bform__svc-label{color:#4C1D95;}
.bform__svc-desc{font-size:.72rem;color:#9CA3AF;}
.bform__svc-check{position:absolute;top:10px;right:10px;width:18px;height:18px;border-radius:50%;background:#6D28D1;color:white;font-size:.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;}

/* OEM highlight */
.bform__highlight-field{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px;margin-bottom:0;}
.bform__radio-row{display:flex;flex-direction:column;gap:7px;margin-top:8px;}
.bform__radio{display:flex;align-items:center;padding:10px 14px;border-radius:10px;border:1.5px solid #E5E7EB;background:#F9FAFB;color:#4B5563;font-size:.84rem;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;}
.bform__radio:hover{border-color:#059669;color:#065F46;}
.bform__radio--on{background:#D1FAE5;border-color:#059669;color:#065F46;font-weight:600;}

.berr{font-size:.8rem;color:#dc2626;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:8px 12px;margin-top:16px;}
.bform__submit{
  width:100%;margin-top:20px;
  background:linear-gradient(135deg,#6D28D1,#8B5CF6);
  color:white;font-size:.95rem;font-weight:600;padding:15px;border-radius:11px;border:none;
  cursor:pointer;font-family:inherit;
  display:flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 20px rgba(109,40,209,.35);
  transition:opacity .2s,transform .15s;position:relative;overflow:hidden;
}
.bform__submit:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
.bform__submit:disabled{opacity:.6;cursor:not-allowed;}
.bspin{width:18px;height:18px;border-radius:50%;border:2.5px solid rgba(255,255,255,.3);border-top-color:white;animation:bsp .7s linear infinite;display:inline-block;}
@keyframes bsp{to{transform:rotate(360deg)}}
.bform__note{font-size:.75rem;color:#9CA3AF;text-align:center;margin-top:8px;}

/* Success state */
.bform__success{background:white;border-radius:20px;padding:60px 40px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);}
.bform__success-ring{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#EDE9FE,#DDD6FE);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
.bform__success-icon{font-size:2.5rem;}
.bform__success-title{font-family:'Fraunces',serif;font-size:1.6rem;font-weight:600;color:#111827;margin-bottom:12px;}
.bform__success-sub{font-size:.95rem;color:#6B7280;line-height:1.7;margin-bottom:32px;}
.bform__roadmap-btn{
  position:relative;overflow:hidden;
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#6D28D1,#8B5CF6);
  color:white;font-size:1rem;font-weight:600;
  padding:16px 36px;border-radius:12px;border:none;cursor:pointer;
  font-family:inherit;
  box-shadow:0 6px 24px rgba(109,40,209,.4);
  transition:transform .2s,box-shadow .2s;
}
.bform__roadmap-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(109,40,209,.5);}
.bform__roadmap-btn-shine{position:absolute;top:-50%;left:-75%;width:50%;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-20deg);animation:bshine 2.5s ease-in-out infinite;}

/* FOOTER */
.bfooter{background:#060310;padding:28px 5%;border-top:1px solid rgba(255,255,255,.06);}
.bfooter__inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.bfooter__logo{font-family:'Fraunces',serif;font-weight:600;font-size:1rem;color:white;}
.bfooter__copy{font-size:.78rem;color:rgba(255,255,255,.25);}
.bfooter__links{display:flex;gap:20px;}
.bfooter__links a{font-size:.78rem;color:rgba(255,255,255,.4);text-decoration:none;transition:color .2s;}
.bfooter__links a:hover{color:white;}

/* RESPONSIVE */
@media(max-width:1024px){.bsvc__grid{grid-template-columns:1fr 1fr;}}
@media(max-width:900px){.bform__inner,.bhow__steps{grid-template-columns:1fr;}.bhow__step:first-child{border-radius:16px 16px 0 0;}.bhow__step:last-child{border-radius:0 0 16px 16px;}.bhow__arrow{display:none;}}
@media(max-width:640px){.bsvc__grid,.bform__g2,.bform__svc-grid{grid-template-columns:1fr;}}
`;