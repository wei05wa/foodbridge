"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   app/business/roadmap/page.tsx  →  /business/roadmap
   Personalized roadmap dashboard per user's selected services
───────────────────────────────────────────── */

interface BizProfile {
  id?: string;
  name: string;
  company?: string;
  needs: {
    ip_matching: boolean;
    product_dev: boolean;
    oem: boolean;
    export: boolean;
    legal: boolean;
    consulting: boolean;
  };
  target_market?: string;
}

type StepStatus = "active" | "pending" | "done" | "locked";

interface RoadmapStep {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  bgFrom: string;
  bgTo: string;
  status: StepStatus;
  eta: string;
  description: string;
  details: string[];
  ipCards?: IPCard[];
  locked: boolean;
}

interface IPCard {
  title: string; category: string; university: string;
  score: number; match: number;
}

/* ══════════════════════════════════════════
   SAMPLE IP matches (linked to researcher data)
══════════════════════════════════════════ */
const SAMPLE_IP: IPCard[] = [
  { title: "Curcumin Nano-Emulsion 40× Bioavailability", category: "Nutraceutical", university: "Chulalongkorn", score: 95, match: 98 },
  { title: "Mangosteen Xanthone Extract (3× Bioavailable)", category: "Botanical", university: "Mahidol", score: 89, match: 94 },
  { title: "Morinda Citrifolia Probiotic Complex", category: "Probiotic", university: "Mahidol", score: 87, match: 88 },
  { title: "Butterfly Pea Anthocyanin Extract", category: "Functional Food", university: "Mahidol", score: 84, match: 82 },
];

const CAT_COLOR: Record<string, { bg: string; color: string }> = {
  Nutraceutical: { bg: "#FEF3C7", color: "#92400E" },
  Botanical: { bg: "#D1FAE5", color: "#065F46" },
  Probiotic: { bg: "#EDE9FE", color: "#4C1D95" },
  "Functional Food": { bg: "#DBEAFE", color: "#1E40AF" },
};

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function RoadmapPage() {
  const [profile, setProfile] = useState<BizProfile | null>(null);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("biz_profile");
      if (raw) setProfile(JSON.parse(raw));
      else {
        // Demo fallback
        setProfile({
          name: "คุณนักธุรกิจ",
          company: "Your Company",
          needs: { ip_matching: true, product_dev: true, oem: true, export: true, legal: true, consulting: false },
          target_market: "ASEAN",
        });
      }
    } catch { /* ignore */ }
  }, []);

  if (!profile) {
    return (
      <>
        <style>{CSS}</style>
        <div className="rm-loading"><div className="rm-spinner"/><span>กำลังโหลด Roadmap...</span></div>
      </>
    );
  }

  const steps = buildSteps(profile, completedSteps);
  const doneCount = steps.filter(s => s.status === "done").length;
  const progress = Math.round((doneCount / steps.length) * 100);

  const markDone = (id: string) => {
    setCompletedSteps(prev => new Set([...prev, id]));
  };

  return (
    <>
      <style>{CSS}</style>
      <Nav profile={profile} />

      <main className="rm-main">
        {/* ── HEADER ── */}
        <div className="rm-header">
          <div className="rm-header__bg">
            <div className="rm-orb1"/><div className="rm-orb2"/>
            <div className="rm-grid"/>
          </div>
          <div className="rm-header__inner">
            <div className="rm-header__left">
              <div className="rm-header__badge">
                <span className="rm-badge-dot"/>Your Personal Roadmap
              </div>
              <h1 className="rm-header__h1">
                สวัสดีครับ<br/>
                <em className="rm-header__em">{profile.name.split(" ")[0]}</em> 👋
              </h1>
              <p className="rm-header__sub">
                {profile.company ? `${profile.company} · ` : ""}
                {steps.length} บริการที่คุณเลือก
                {profile.target_market ? ` · เป้าหมาย ${profile.target_market}` : ""}
              </p>
            </div>

            {/* Progress ring */}
            <div className="rm-progress">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#a78bfa" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Fraunces, serif">{progress}%</text>
                <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="10">complete</text>
              </svg>
              <div className="rm-progress__label">{doneCount}/{steps.length} ขั้นตอน</div>
            </div>
          </div>

          {/* Step mini-tracker */}
          <div className="rm-tracker">
            {steps.map((s, i) => (
              <div key={s.id} className="rm-tracker__item">
                <div className={`rm-tracker__dot rm-tracker__dot--${s.status}`} style={{ borderColor: s.status === "locked" ? undefined : s.color, background: s.status === "done" ? s.color : s.status === "active" ? s.color + "30" : undefined }}>
                  {s.status === "done" ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`rm-tracker__line ${s.status === "done" ? "rm-tracker__line--done" : ""}`}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── ROADMAP CARDS ── */}
        <div className="rm-cards-wrap">
          <div className="rm-cards">
            {steps.map((step) => (
              <RoadmapCard
                key={step.id}
                step={step}
                open={openCard === step.id}
                onToggle={() => setOpenCard(openCard === step.id ? null : step.id)}
                onMarkDone={() => markDone(step.id)}
              />
            ))}
          </div>

          {/* Concierge CTA */}
          <div className="rm-concierge">
            <div className="rm-concierge__icon">💬</div>
            <div>
              <div className="rm-concierge__title">ต้องการความช่วยเหลือ?</div>
              <div className="rm-concierge__sub">ทีม Business Concierge พร้อมดูแลทุกขั้นตอน</div>
            </div>
            <a href="mailto:hello@foodip.co" className="rm-concierge__btn">
              ติดต่อ Concierge →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

/* ══════════════════════════════════════════
   ROADMAP CARD
══════════════════════════════════════════ */
function RoadmapCard({ step, open, onToggle, onMarkDone }: {
  step: RoadmapStep; open: boolean;
  onToggle: () => void; onMarkDone: () => void;
}) {
  return (
    <div
      className={`rmc ${open ? "rmc--open" : ""} rmc--${step.status} ${step.locked ? "rmc--locked" : ""}`}
      style={{ "--rmc-color": step.color, "--rmc-accent": step.accent } as any}
    >
      {/* Card header — always visible */}
      <div className="rmc__head" onClick={!step.locked ? onToggle : undefined}>
        <div className="rmc__head-left">
          <div className="rmc__icon-wrap" style={{ background: step.bgFrom }}>
            <span className="rmc__icon">{step.icon}</span>
            {step.status === "done" && (
              <div className="rmc__done-ring">✓</div>
            )}
          </div>
          <div>
            <div className="rmc__step-label">
              {step.status === "active" && <span className="rmc__active-badge">● Active</span>}
              {step.status === "done" && <span className="rmc__done-badge">✓ เสร็จแล้ว</span>}
              {step.status === "pending" && <span className="rmc__pending-badge">⏳ รอดำเนินการ</span>}
              {step.status === "locked" && <span className="rmc__locked-badge">🔒 ยังไม่เปิดใช้</span>}
            </div>
            <div className="rmc__title">{step.title}</div>
            <div className="rmc__subtitle">{step.subtitle}</div>
          </div>
        </div>
        <div className="rmc__head-right">
          <div className="rmc__eta">{step.eta}</div>
          {!step.locked && (
            <div className="rmc__chevron">{open ? "▲" : "▼"}</div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {open && !step.locked && (
        <div className="rmc__body">
          <p className="rmc__desc">{step.description}</p>

          {/* Details checklist */}
          <div className="rmc__details">
            {step.details.map(d => (
              <div className="rmc__detail" key={d}>
                <span className="rmc__detail-dot" style={{ background: step.color }}/>
                {d}
              </div>
            ))}
          </div>

          {/* IP Cards (only for ip_matching step) */}
          {step.id === "ip_matching" && step.ipCards && (
            <div className="rmc__ip-section">
              <div className="rmc__ip-title">🔬 IP ที่แนะนำสำหรับคุณ</div>
              <div className="rmc__ip-grid">
                {step.ipCards.map((ip) => {
                  const cs = CAT_COLOR[ip.category] ?? { bg: "#EDE9FE", color: "#4C1D95" };
                  return (
                    <div className="rmc__ip-card" key={ip.title}>
                      <div className="rmc__ip-card-top">
                        <span className="rmc__ip-tag" style={{ background: cs.bg, color: cs.color }}>
                          {ip.category}
                        </span>
                        <div className="rmc__ip-match">
                          <span style={{ color: ip.match >= 90 ? "#059669" : "#d97706", fontWeight: 700 }}>{ip.match}%</span>
                          <span style={{ fontSize: ".65rem", color: "#9CA3AF" }}>match</span>
                        </div>
                      </div>
                      <div className="rmc__ip-name">{ip.title}</div>
                      <div className="rmc__ip-uni">{ip.university} University</div>
                      <div className="rmc__ip-bar-wrap">
                        <div className="rmc__ip-bar"><div className="rmc__ip-fill" style={{ width: `${ip.score}%`, background: step.color }}/></div>
                        <span className="rmc__ip-score">{ip.score}</span>
                      </div>
                      <a href="/researcher" className="rmc__ip-btn">ดูรายละเอียด →</a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="rmc__actions">
            {step.status !== "done" && (
              <button className="rmc__start-btn" style={{ background: `linear-gradient(135deg, ${step.bgFrom}, ${step.color})` }}
                onClick={onMarkDone}>
                {step.status === "active" ? "เสร็จแล้ว ✓" : "เริ่มขั้นตอนนี้ →"}
              </button>
            )}
            <a href="mailto:hello@foodip.co" className="rmc__contact-btn">
              ปรึกษา Concierge
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   BUILD STEPS from profile
══════════════════════════════════════════ */
function buildSteps(profile: BizProfile, completed: Set<string>): RoadmapStep[] {
  const n = profile.needs;
  const allSteps: Omit<RoadmapStep, "status" | "locked">[] = [
    {
      id: "ip_matching",
      icon: "🔬", title: "IP Matching",
      subtitle: "จับคู่งานวิจัยกับธุรกิจของคุณ",
      color: "#6D28D1", accent: "#a78bfa", bgFrom: "#1e0a3c", bgTo: "#4c1d95",
      eta: "3-7 วัน",
      description: "ทีมผู้เชี่ยวชาญจะคัดงานวิจัยที่ตรงกับ product category และตลาดเป้าหมายของคุณ พร้อม business potential analysis และ ROI forecast",
      details: [
        "วิเคราะห์ความต้องการและ product category",
        "ค้นหา IP จาก database 240+ งานวิจัย",
        "จัดทำ shortlist 3-5 IP ที่เหมาะสมที่สุด",
        "นัด meeting กับนักวิจัยที่สนใจ",
      ],
      ipCards: SAMPLE_IP,
    },
    {
      id: "product_dev",
      icon: "💡", title: "Product Development",
      subtitle: "ออกแบบและพัฒนาผลิตภัณฑ์จาก IP",
      color: "#7C3AED", accent: "#c4b5fd", bgFrom: "#2e1065", bgTo: "#6d28d1",
      eta: "30-90 วัน",
      description: "ทีม R&D ช่วยแปลงงานวิจัยเป็น product concept พร้อม prototype และ formulation ที่ผลิตได้จริงในระดับ commercial scale",
      details: [
        "Product concept และ formulation design",
        "Prototype development และ sensory test",
        "Stability testing และ shelf-life study",
        "Pilot batch production",
      ],
    },
    {
      id: "oem_finding",
      icon: "🏭", title: "OEM & Manufacturing",
      subtitle: "จับคู่โรงงานผลิตที่เหมาะสม",
      color: "#059669", accent: "#34d399", bgFrom: "#022c22", bgTo: "#065f46",
      eta: "7-14 วัน",
      description: "เชื่อมต่อกับเครือข่ายโรงงาน OEM ที่ผ่านการคัดเลือกและตรวจสอบมาตรฐาน GMP/HACCP แล้ว พร้อม MOQ ที่ยืดหยุ่นตามขนาดธุรกิจ",
      details: [
        "Matching กับโรงงาน OEM ที่ตรงกับ product type",
        "ตรวจสอบ GMP, HACCP, Halal certification",
        "เจรจา MOQ และราคาต้นทุน",
        "ดูแล production timeline",
      ],
    },
    {
      id: "legal",
      icon: "⚖️", title: "Legal & Compliance",
      subtitle: "IP, อย. และกฎหมายครบวงจร",
      color: "#1d4ed8", accent: "#93c5fd", bgFrom: "#1e1b4b", bgTo: "#1e40af",
      eta: "60-180 วัน",
      description: "ทีมกฎหมายผู้เชี่ยวชาญดูแลการยื่น Patent/Trade Secret, ขึ้นทะเบียน อย. ทั้งในไทยและต่างประเทศ และจัดทำ licensing agreement",
      details: [
        "IP audit และ patentability assessment",
        "ยื่นคำขอ patent / trade secret",
        "ขึ้นทะเบียน อย. ประเทศไทย",
        "Health claims compliance review",
        "Licensing agreement drafting",
      ],
    },
    {
      id: "export_planning",
      icon: "🌏", title: "Export Planning",
      subtitle: `วางแผนส่งออก${profile.target_market ? ` → ${profile.target_market}` : " ตลาดโลก"}`,
      color: "#d97706", accent: "#fcd34d", bgFrom: "#451a03", bgTo: "#92400e",
      eta: "14-30 วัน",
      description: "ทีม export specialist วิเคราะห์ตลาดเป้าหมาย หา distributor partner และวางแผน market entry strategy พร้อม pricing และ logistics",
      details: [
        `Market analysis ${profile.target_market ?? "ตลาดต่างประเทศ"}`,
        "หา distributor และ importer partner",
        "Regulatory compliance ประเทศปลายทาง",
        "Pricing strategy และ logistics planning",
        "Brand localization และ labeling",
      ],
    },
    {
      id: "consulting",
      icon: "💬", title: "Business Consulting",
      subtitle: "วิเคราะห์และให้คำแนะนำเชิงกลยุทธ์",
      color: "#6B7280", accent: "#D1D5DB", bgFrom: "#111827", bgTo: "#374151",
      eta: "On demand",
      description: "ที่ปรึกษาธุรกิจให้คำแนะนำด้าน strategy, financial model, fundraising และ go-to-market plan ที่เหมาะกับ stage และ industry ของคุณ",
      details: [
        "Business model และ revenue stream analysis",
        "Financial projection และ unit economics",
        "Competitive landscape mapping",
        "Go-to-market strategy",
        "Investor pitch deck support",
      ],
    },
  ];

  // Filter to only selected + assign status
  const active = allSteps.filter(s => {
    if (s.id === "ip_matching") return n.ip_matching;
    if (s.id === "product_dev") return n.product_dev;
    if (s.id === "oem_finding") return n.oem;
    if (s.id === "legal") return n.legal;
    if (s.id === "export_planning") return n.export;
    if (s.id === "consulting") return n.consulting;
    return false;
  });

  return active.map((s, i) => {
    let status: StepStatus = "pending";
    if (completed.has(s.id)) status = "done";
    else if (i === 0 || completed.has(active[i-1]?.id ?? "")) status = "active";
    return { ...s, status, locked: false };
  });
}

/* ── NAV ── */
function Nav({ profile }: { profile: BizProfile }) {
  return (
    <nav className="rm-nav">
      <a href="/" className="rm-nav__logo">
        <div className="rm-nav__icon"><LayersIcon /></div>
        FoodBridge<span style={{ color: "#8B5CF6" }}>IP</span>
      </a>
      <div className="rm-nav__center">
        <span className="rm-nav__crumb">/ Business Hub / Roadmap</span>
      </div>
      <div className="rm-nav__right">
        <div className="rm-nav__avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <span className="rm-nav__name">{profile.name}</span>
      </div>
    </nav>
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
body{font-family:'DM Sans',sans-serif;background:#0F0A1E;color:#111827;-webkit-font-smoothing:antialiased;}

.rm-loading{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:rgba(255,255,255,.5);font-size:.9rem;background:#0F0A1E;}
.rm-spinner{width:32px;height:32px;border-radius:50%;border:3px solid rgba(139,92,246,.3);border-top-color:#8B5CF6;animation:rmspin .7s linear infinite;}
@keyframes rmspin{to{transform:rotate(360deg)}}

/* NAV */
.rm-nav{position:sticky;top:0;z-index:200;background:rgba(15,10,30,.85);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.07);padding:0 5%;height:64px;display:flex;align-items:center;justify-content:space-between;}
.rm-nav__logo{font-family:'Fraunces',serif;font-weight:600;font-size:1.1rem;color:white;text-decoration:none;display:flex;align-items:center;gap:9px;}
.rm-nav__icon{width:30px;height:30px;background:linear-gradient(135deg,#6D28D1,#8B5CF6);border-radius:8px;display:flex;align-items:center;justify-content:center;}
.rm-nav__center{flex:1;text-align:center;}
.rm-nav__crumb{font-size:.8rem;color:rgba(255,255,255,.3);}
.rm-nav__right{display:flex;align-items:center;gap:10px;}
.rm-nav__avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6D28D1,#8B5CF6);display:flex;align-items:center;justify-content:center;color:white;font-size:.84rem;font-weight:700;}
.rm-nav__name{font-size:.84rem;color:rgba(255,255,255,.7);}

/* HEADER */
.rm-main{min-height:100vh;}
.rm-header{background:linear-gradient(160deg,#0F0A1E 0%,#1e0a3c 50%,#2d1b69 100%);padding:60px 5% 0;position:relative;overflow:hidden;}
.rm-header__bg{position:absolute;inset:0;pointer-events:none;}
.rm-orb1{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(109,40,209,.4) 0%,transparent 70%);top:-150px;right:-100px;animation:rmOrb1 8s ease-in-out infinite;}
.rm-orb2{position:absolute;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(5,150,105,.2) 0%,transparent 70%);bottom:0;left:-80px;animation:rmOrb2 10s ease-in-out infinite;}
.rm-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(109,40,209,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(109,40,209,.05) 1px,transparent 1px);background-size:48px 48px;}
@keyframes rmOrb1{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,15px)}}
@keyframes rmOrb2{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-10px)}}
.rm-header__inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:40px;padding-bottom:40px;}
.rm-header__badge{display:inline-flex;align-items:center;gap:8px;background:rgba(109,40,209,.25);border:1px solid rgba(139,92,246,.4);color:#c4b5fd;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:16px;}
.rm-badge-dot{width:6px;height:6px;border-radius:50%;background:#86efac;box-shadow:0 0 8px #86efac;animation:rmpulse 2s infinite;}
@keyframes rmpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
.rm-header__h1{font-family:'Fraunces',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:700;color:white;line-height:1.15;letter-spacing:-.02em;margin-bottom:10px;}
.rm-header__em{color:#a78bfa;font-style:italic;}
.rm-header__sub{font-size:.9rem;color:rgba(255,255,255,.5);}

/* Progress ring */
.rm-progress{display:flex;flex-direction:column;align-items:center;gap:8px;flex-shrink:0;}
.rm-progress__label{font-size:.8rem;color:rgba(255,255,255,.45);text-align:center;}

/* Tracker */
.rm-tracker{max-width:1100px;margin:0 auto;padding:0 0 28px;position:relative;z-index:1;display:flex;align-items:center;gap:0;}
.rm-tracker__item{display:flex;align-items:center;flex:1;}
.rm-tracker__dot{
  width:32px;height:32px;border-radius:50%;
  border:2px solid rgba(255,255,255,.15);
  background:rgba(255,255,255,.05);
  display:flex;align-items:center;justify-content:center;
  font-size:.75rem;font-weight:700;color:rgba(255,255,255,.5);
  flex-shrink:0;transition:all .3s;
}
.rm-tracker__dot--active{color:white;box-shadow:0 0 12px var(--rm-dot-color,#6D28D1);}
.rm-tracker__dot--done{color:white;border-width:0;}
.rm-tracker__line{flex:1;height:2px;background:rgba(255,255,255,.1);margin:0 4px;}
.rm-tracker__line--done{background:linear-gradient(90deg,#6D28D1,#8B5CF6);}

/* CARDS AREA */
.rm-cards-wrap{background:#F9FAFB;padding:40px 5% 60px;}
.rm-cards{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:16px;}

/* ROADMAP CARD */
.rmc{
  background:white;border-radius:16px;
  border:1.5px solid #E5E7EB;
  overflow:hidden;
  transition:box-shadow .25s,border-color .25s,transform .25s;
}
.rmc:hover:not(.rmc--locked){box-shadow:0 8px 32px rgba(0,0,0,.08);border-color:rgba(109,40,209,.2);}
.rmc--active{border-color:var(--rmc-color);box-shadow:0 4px 24px rgba(109,40,209,.12);}
.rmc--done{border-color:#059669;background:linear-gradient(135deg,#F0FDF4,white);}
.rmc--locked{opacity:.55;cursor:not-allowed;}
.rmc--open{box-shadow:0 12px 40px rgba(0,0,0,.12);}

.rmc__head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;cursor:pointer;gap:16px;}
.rmc--locked .rmc__head{cursor:not-allowed;}
.rmc__head-left{display:flex;align-items:center;gap:16px;}
.rmc__icon-wrap{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;}
.rmc__icon{font-size:1.6rem;}
.rmc__done-ring{position:absolute;inset:0;border-radius:14px;border:2.5px solid #059669;display:flex;align-items:center;justify-content:center;background:rgba(5,150,105,.15);color:#059669;font-size:1rem;font-weight:700;}
.rmc__step-label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
.rmc__active-badge{color:var(--rmc-color);}
.rmc__done-badge{color:#059669;}
.rmc__pending-badge{color:#9CA3AF;}
.rmc__locked-badge{color:#D1D5DB;}
.rmc__title{font-family:'Fraunces',serif;font-size:1.05rem;font-weight:600;color:#111827;margin-bottom:2px;}
.rmc__subtitle{font-size:.8rem;color:#9CA3AF;}
.rmc__head-right{display:flex;align-items:center;gap:12px;flex-shrink:0;}
.rmc__eta{font-size:.76rem;color:#9CA3AF;background:#F3F4F6;padding:4px 10px;border-radius:20px;}
.rmc__chevron{font-size:.8rem;color:#9CA3AF;transition:transform .2s;}
.rmc--open .rmc__chevron{transform:rotate(180deg);}

/* Card body */
.rmc__body{padding:0 24px 24px;border-top:1px solid #F3F4F6;}
.rmc__desc{font-size:.875rem;color:#4B5563;line-height:1.75;margin:16px 0;}
.rmc__details{display:flex;flex-direction:column;gap:8px;margin-bottom:20px;}
.rmc__detail{display:flex;align-items:flex-start;gap:10px;font-size:.84rem;color:#6B7280;}
.rmc__detail-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:5px;}

/* IP cards inside roadmap */
.rmc__ip-section{margin-bottom:20px;}
.rmc__ip-title{font-size:.84rem;font-weight:600;color:#111827;margin-bottom:12px;}
.rmc__ip-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.rmc__ip-card{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:14px;transition:border-color .2s,transform .2s;}
.rmc__ip-card:hover{border-color:#6D28D1;transform:translateY(-2px);}
.rmc__ip-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.rmc__ip-tag{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:20px;}
.rmc__ip-match{display:flex;flex-direction:column;align-items:flex-end;gap:1px;}
.rmc__ip-name{font-size:.82rem;font-weight:600;color:#111827;line-height:1.35;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.rmc__ip-uni{font-size:.72rem;color:#9CA3AF;margin-bottom:8px;}
.rmc__ip-bar-wrap{display:flex;align-items:center;gap:6px;margin-bottom:10px;}
.rmc__ip-bar{flex:1;height:4px;background:#E5E7EB;border-radius:2px;overflow:hidden;}
.rmc__ip-fill{height:100%;border-radius:2px;}
.rmc__ip-score{font-size:.72rem;font-weight:600;color:#6D28D1;}
.rmc__ip-btn{font-size:.74rem;font-weight:600;color:#6D28D1;text-decoration:none;background:#EDE9FE;padding:5px 10px;border-radius:7px;display:inline-block;transition:background .2s;}
.rmc__ip-btn:hover{background:#DDD6FE;}

/* Actions */
.rmc__actions{display:flex;gap:10px;flex-wrap:wrap;}
.rmc__start-btn{flex:1;color:white;font-size:.875rem;font-weight:600;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;transition:opacity .2s,transform .15s;}
.rmc__start-btn:hover{opacity:.88;transform:translateY(-1px);}
.rmc__contact-btn{padding:11px 18px;border-radius:10px;border:1.5px solid #E5E7EB;background:white;color:#4B5563;font-size:.875rem;font-weight:500;font-family:inherit;cursor:pointer;text-decoration:none;transition:border-color .2s,color .2s;display:inline-flex;align-items:center;}
.rmc__contact-btn:hover{border-color:#6D28D1;color:#6D28D1;}

/* Concierge CTA */
.rm-concierge{max-width:900px;margin:24px auto 0;background:linear-gradient(135deg,#1e0a3c,#4c1d95);border-radius:16px;padding:24px 28px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
.rm-concierge__icon{font-size:2rem;flex-shrink:0;}
.rm-concierge__title{font-family:'Fraunces',serif;font-size:1rem;font-weight:600;color:white;margin-bottom:4px;}
.rm-concierge__sub{font-size:.84rem;color:rgba(255,255,255,.6);}
.rm-concierge__btn{margin-left:auto;background:white;color:#4C1D95;font-size:.875rem;font-weight:600;padding:11px 22px;border-radius:10px;text-decoration:none;transition:transform .15s,box-shadow .2s;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap;}
.rm-concierge__btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.25);}

/* RESPONSIVE */
@media(max-width:700px){.rmc__ip-grid{grid-template-columns:1fr;}.rm-header__inner{flex-direction:column;text-align:center;}.rm-progress{display:none;}.rm-nav__right{display:none;}}
`;