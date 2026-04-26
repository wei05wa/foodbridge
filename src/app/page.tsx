"use client";

import Link from "next/link";
import styles from "./page.module.css";
import WaitlistSection from "./WaitlistSection";

/* ─────────────────────────────────────────────
   app/page.tsx  →  Route: /
   Landing page: Hero · Trust · Roadmap · Consultant · Footer
───────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <RoadmapSection />
      <ConsultantSection />
      <WaitlistSection /> 
      <Footer />
    </main>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background blobs + grid */}
      <div className={styles.heroBg} aria-hidden>
        <div className={`${styles.heroBlob} ${styles.heroBlob1}`} />
        <div className={`${styles.heroBlob} ${styles.heroBlob2}`} />
        <div className={styles.heroGrid} />
      </div>

      <div className={styles.heroInner}>
        {/* LEFT: copy */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            Thailand&apos;s #1 Food IP Platform
          </div>

          <h1 className={styles.heroH1}>
            Connecting Thai{" "}
            <em className={styles.heroEm}>Food Science</em> to Global Business
          </h1>

          <p className={styles.heroSub}>
            From Lab to Shelf — We bridge the gap with IP matching, OEM
            support, and Global Export services. Turn validated research into
            world-class consumer products.
          </p>

          <div className={styles.heroActions}>
            <Link href="/home" className="btn-primary">
              <SearchIcon size={16} />
              Explore IP Hub
            </Link>
            <a href="#roadmap" className="btn-secondary">
              <PlayIcon size={16} />
              View Roadmap
            </a>
          </div>

          <div className={styles.heroStats}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: stacked card visual */}
        <div className={styles.heroVisual}>
          <HeroCardStack />
        </div>
      </div>
    </section>
  );
}

function HeroCardStack() {
  return (
    <div className={styles.cardStack}>
      <div className={`${styles.cardBg} ${styles.cardBg1}`} />
      <div className={`${styles.cardBg} ${styles.cardBg2}`} />
      <div className={styles.cardMain}>
        <div className="tag t-p">
          <GridIcon size={11} />
          Functional Food
        </div>
        <div className={styles.cardTitle}>
          High-Antioxidant
          <br />
          Mangosteen Extract
        </div>
        <p className={styles.cardDesc}>
          Patented extraction yielding 3× bioavailable xanthones vs. standard
          processes. Ready for nutraceutical licensing.
        </p>
        <div className={styles.cardMetric}>
          <div className={styles.metricLabel}>Market Potential</div>
          <div className={styles.metricValue}>$4.2M TAM</div>
          <div className={styles.metricBar}>
            <div className={styles.metricFill} style={{ width: "78%" }} />
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.cardFooterLabel}>Chulalongkorn Univ.</span>
          <Link href="/home" className="btn-match">
            Match Now
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TRUST STRIP
══════════════════════════════════════════ */
function TrustStrip() {
  const partners = ["NFI Thailand", "Genfosis", "SPACE-F", "TCELS", "BIOTEC", "FDATH"];
  return (
    <div className={styles.trustStrip}>
      <div className={styles.trustInner}>
        <span className={styles.trustLabel}>Trusted by</span>
        <div className={styles.trustDivider} />
        <div className={styles.trustLogos}>
          {partners.map((p) => (
            <span key={p} className={styles.trustLogo}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROADMAP
══════════════════════════════════════════ */
const ROADMAP_STEPS = [
  {
    num: 1,
    title: "Match",
    sub: "Discover Validated IP assets aligned to your business category and investment capacity.",
    badge: "IP Discovery",
    icon: <SearchIcon size={22} />,
  },
  {
    num: 2,
    title: "OEM Integration",
    sub: "Connect with certified Thai manufacturers for production pathway design and capacity scaling.",
    badge: "Manufacturing",
    icon: <MonitorIcon size={22} />,
  },
  {
    num: 3,
    title: "Compliance & Legal",
    sub: "Navigate health claims, IP licensing, and regulatory approval for Thai FDA and target markets.",
    badge: "Regulatory",
    icon: <ShieldIcon size={22} />,
  },
  {
    num: 4,
    title: "Global Export",
    sub: "Market entry strategy, distribution partnerships, and end-to-end logistics for 32+ global markets.",
    badge: "Export Ready",
    icon: <GlobeIcon size={22} />,
  },
];

function RoadmapSection() {
  return (
    <section className={styles.roadmapSection} id="roadmap">
      <div className={styles.sectionInner}>
        <SectionHeader
          eyebrow="Success Roadmap"
          title="From Lab to Global Shelf"
          sub="A structured, end-to-end pathway designed to de-risk your investment and accelerate time-to-market across every key milestone."
        />
        <div className={styles.roadmapWrap}>
          {ROADMAP_STEPS.map((step) => (
            <div key={step.num} className={styles.roadmapStep}>
              <div className={styles.stepIconWrap}>
                <span className={styles.stepNum}>{step.num}</span>
                {step.icon}
              </div>
              <div>
                <div className={styles.stepTitle}>{step.title}</div>
                <p className={styles.stepSub}>{step.sub}</p>
                <div className={styles.stepBadge}>
                  <CheckIcon size={9} />
                  {step.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   CONSULTANT
══════════════════════════════════════════ */
const CONSULTANT_FEATURES = [
  { label: "Dedicated account manager", icon: <UsersIcon size={17} /> },
  { label: "Real-time deal tracking dashboard", icon: <ActivityIcon size={17} /> },
  { label: "NDA-protected IP negotiations", icon: <LockIcon size={17} /> },
  { label: "Global market entry strategy", icon: <GlobeIcon size={17} /> },
];

function ConsultantSection() {
  return (
    <section className={styles.consultantSection} id="consultant">
      <div className={styles.sectionInner}>
        <div className={styles.consultantCard}>
          <div className={styles.consultantCardBg} aria-hidden />
          <div className={styles.consultantCardGrid} aria-hidden />

          {/* Left copy */}
          <div className={styles.consultantLeft}>
            <div className={styles.consultantEyebrow}>
              <div className={styles.consultantEyebrowLine} />
              Expert Business Concierge
            </div>
            <h2 className={styles.consultantTitle}>
              Just bring your{" "}
              <em className={styles.consultantEm}>investment</em>
              <br />
              and passion — we grow together.
            </h2>
            <p className={styles.consultantDesc}>
              Our dedicated concierge team handles IP licensing, OEM
              negotiations, regulatory navigation, and export logistics. You
              focus on your vision; we handle the complexity.
            </p>
            <div className={styles.consultantActions}>
              <Link href="/home" className={styles.btnWhite}>
                Book a Consultation
                <ArrowRightIcon size={14} />
              </Link>
              <a href="#" className={styles.btnOutlineWhite}>
                <PlayIcon size={13} />
                Watch Demo
              </a>
            </div>
          </div>

          {/* Right feature pills */}
          <div className={styles.consultantFeatures}>
            {CONSULTANT_FEATURES.map((f) => (
              <div key={f.label} className={styles.consultantFeature}>
                <div className={styles.consultantFeatureIcon}>{f.icon}</div>
                <span className={styles.consultantFeatureText}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
const FOOTER_COLS = [
  {
    title: "Platform",
    links: ["IP Matching Hub", "OEM Network", "Export Services", "Regulatory Guide", "Market Analytics"],
  },
  {
    title: "Company",
    links: ["About Us", "Research Partners", "Industry Partners", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["IP Licensing Guide", "FDA Thailand", "Export Markets", "Case Studies", "Blog"],
  },
];

const ECOSYSTEM_PARTNERS = ["NFI Thailand", "Genfosis", "SPACE-F"];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          {/* Brand col */}
          <div>
            <div className={styles.footerBrandName}>FoodBridge IP</div>
            <p className={styles.footerTagline}>
              Thailand&apos;s premier platform connecting academic food science
              IP with global business partners and OEM manufacturers.
            </p>
            <div className={styles.footerPartners}>
              {ECOSYSTEM_PARTNERS.map((p) => (
                <div key={p} className={styles.partnerChip}>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className={styles.footerCol}>
              <div className={styles.footerColTitle}>{col.title}</div>
              <ul>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerCopy}>
            © 2025 FoodBridge IP Co., Ltd. All rights reserved.
          </div>
          <div className={styles.footerBottomLinks}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (l) => (
                <a key={l} href="#">
                  {l}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   SHARED SECTION HEADER
══════════════════════════════════════════ */
function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionEyebrow}>
        <div className={styles.eyebrowLine} />
        {eyebrow}
        <div className={styles.eyebrowLine} />
      </div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSub}>{sub}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const STATS = [
  { num: "240+", label: "Validated IP Assets" },
  { num: "48", label: "OEM Partners" },
  { num: "32", label: "Export Markets" },
];

/* ══════════════════════════════════════════
   ICON COMPONENTS (inline SVG, zero-dep)
══════════════════════════════════════════ */
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function GridIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  );
}
function MonitorIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
function ShieldIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function GlobeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function UsersIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ActivityIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function LockIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}