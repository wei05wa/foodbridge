"use client";

import { useState, useMemo, useCallback } from "react";
import { IP_DATA, IpCard, IpCategory } from "@/lib/data";
import styles from "./page.module.css";

/* ─────────────────────────────────────────────
   app/home/page.tsx  →  Route: /home
   Research IP Hub: Sidebar · Grid · Detail Drawer · Watchlist Bar
───────────────────────────────────────────── */

type SortKey = "score" | "tam" | "ttm" | "newest";

const CAT_FILTERS: { label: string; value: IpCategory | "all"; count: number }[] = [
  { label: "ทั้งหมด", value: "all", count: IP_DATA.length },
  { label: "Functional Food", value: "functional", count: IP_DATA.filter((d) => d.cat === "functional").length },
  { label: "Botanical", value: "botanical", count: IP_DATA.filter((d) => d.cat === "botanical").length },
  { label: "Nutraceutical", value: "nutra", count: IP_DATA.filter((d) => d.cat === "nutra").length },
  { label: "Fermentation", value: "ferment", count: IP_DATA.filter((d) => d.cat === "ferment").length },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<IpCategory | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  /* ── Derived filtered + sorted list ── */
  const filtered = useMemo(() => {
    let items = IP_DATA;
    if (activeCat !== "all") items = items.filter((d) => d.cat === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.tag.toLowerCase().includes(q) ||
          d.uni.toLowerCase().includes(q)
      );
    }
    return [...items].sort((a, b) => {
      if (sortKey === "score") return b.score - a.score;
      if (sortKey === "tam") return parseFloat(b.tam.replace(/[$M]/g, "")) - parseFloat(a.tam.replace(/[$M]/g, ""));
      if (sortKey === "ttm") return parseInt(a.ttm) - parseInt(b.ttm);
      return b.id - a.id;
    });
  }, [query, activeCat, sortKey]);

  const selectedCard = useMemo(
    () => (selectedId ? IP_DATA.find((d) => d.id === selectedId) ?? null : null),
    [selectedId]
  );

  const toggleWatchlist = useCallback(
    (id: number) => {
      setWatchlist((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    },
    []
  );

  const closeModal = useCallback(() => setSelectedId(null), []);

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="ค้นหาวิจัย..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <FilterGroup title="หมวดหมู่">
          {CAT_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.chip} ${activeCat === f.value ? styles.chipActive : ""}`}
              onClick={() => setActiveCat(f.value)}
            >
              {f.label}
              <span className={styles.chipCount}>{f.count}</span>
            </button>
          ))}
        </FilterGroup>

        <FilterGroup title="เรียงตาม">
          <select
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="score">Business Score (สูงสุด)</option>
            <option value="tam">Market TAM (ใหญ่สุด)</option>
            <option value="ttm">Time to Market (เร็วสุด)</option>
            <option value="newest">ใหม่ล่าสุด</option>
          </select>
        </FilterGroup>

        <FilterGroup title="ระยะเวลา to Market">
          {["ทั้งหมด", "< 12 เดือน", "12–24 เดือน", "> 24 เดือน"].map((l) => (
            <button key={l} className={`${styles.chip} ${l === "ทั้งหมด" ? styles.chipActive : ""}`}>
              {l}
            </button>
          ))}
        </FilterGroup>

        <FilterGroup title="ตลาดเป้าหมาย">
          {["ทั้งหมด", "ASEAN", "EU / UK", "USA", "ญี่ปุ่น", "ตะวันออกกลาง"].map((l) => (
            <button key={l} className={`${styles.chip} ${l === "ทั้งหมด" ? styles.chipActive : ""}`}>
              {l}
            </button>
          ))}
        </FilterGroup>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <div>
            <h1 className={styles.mainTitle}>Research IP Hub</h1>
            <div className={styles.resultCount}>
              <strong>{filtered.length}</strong> งานวิจัยพร้อมลงทุน
            </div>
          </div>
          <button className={styles.watchlistBtn}>
            <HeartIcon size={15} />
            Watchlist{" "}
            <span className={styles.wlBadge}>{watchlist.size}</span>
          </button>
        </div>

        {/* IP GRID */}
        <div className={styles.ipGrid}>
          {filtered.map((card) => (
            <IpCardItem
              key={card.id}
              data={card}
              saved={watchlist.has(card.id)}
              onSave={() => toggleWatchlist(card.id)}
              onClick={() => setSelectedId(card.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <div className={styles.emptyText}>ไม่พบงานวิจัยที่ตรงกัน</div>
              <button className={styles.emptyReset} onClick={() => { setQuery(""); setActiveCat("all"); }}>
                รีเซ็ตตัวกรอง
              </button>
            </div>
          )}
        </div>
      </main>

      {/* DETAIL DRAWER (slide-in panel) */}
      {selectedCard && (
        <DetailDrawer
          card={selectedCard}
          saved={watchlist.has(selectedCard.id)}
          onSave={() => toggleWatchlist(selectedCard.id)}
          onClose={closeModal}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          onInvite={() => { alert(`📩 ส่งคำเชิญไปที่ ${inviteEmail} แล้ว!`); setInviteEmail(""); }}
        />
      )}

      {/* WATCHLIST BAR */}
      <WatchlistBar
        ids={[...watchlist]}
        onRemove={toggleWatchlist}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   IP CARD ITEM
══════════════════════════════════════════ */
function IpCardItem({
  data,
  saved,
  onSave,
  onClick,
}: {
  data: IpCard;
  saved: boolean;
  onSave: () => void;
  onClick: () => void;
}) {
  const iconStyle = CAT_ICON_STYLES[data.cat];

  return (
    <div className={styles.ipc} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}>
      {data.highlight && <div className={styles.hotBadge}>🔥 Hot Deal</div>}

      <div className={styles.ipcTop}>
        <div className={styles.ipcIcon} style={{ background: iconStyle.bg, color: iconStyle.color }}>
          {CAT_ICONS[data.cat]}
        </div>
        <div className={styles.ipcScoreWrap}>
          <div className={styles.ipcScore}>{data.score}</div>
          <div className={styles.ipcScoreLbl}>Biz Score</div>
        </div>
      </div>

      <div className={`tag ${data.tagClass}`}>{data.tag}</div>
      <h3 className={styles.ipcTitle}>{data.title}</h3>
      <p className={styles.ipcDesc}>{data.desc}</p>

      <div className={styles.ipcMetrics}>
        <MetricBox value={data.tam} label="Market TAM" />
        <MetricBox value={data.ttm} label="Time to Market" />
      </div>

      <div className={styles.barWrap}>
        <div className={styles.barLbl}>
          <span>Market Gap Score</span>
          <span>{data.gap}%</span>
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} style={{ width: `${data.gap}%` }} />
        </div>
      </div>

      <div className={styles.ipcFooter}>
        <div className={styles.ipcUni}>
          by <strong>{data.uni.split(" — ")[0]}</strong>
        </div>
        <div className={styles.ipcActions}>
          <button
            className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ""}`}
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            aria-label={saved ? "ลบออกจาก Watchlist" : "เพิ่มใน Watchlist"}
          >
            <HeartIcon size={14} filled={saved} />
          </button>
          <button className="btn-match" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            Match Now <ArrowRightIcon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DETAIL DRAWER
══════════════════════════════════════════ */
function DetailDrawer({
  card,
  saved,
  onSave,
  onClose,
  inviteEmail,
  setInviteEmail,
  onInvite,
}: {
  card: IpCard;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  inviteEmail: string;
  setInviteEmail: (v: string) => void;
  onInvite: () => void;
}) {
  const growthVals = card.growth.map((g) => parseFloat(g.split(":$")[1].replace("M", "")));
  const maxVal = Math.max(...growthVals);
  const avatarLetters = ["A", "B", "C", "D", "E"];

  return (
    <>
      {/* Backdrop */}
      <div className={styles.overlay} onClick={onClose} aria-hidden />

      {/* Drawer panel */}
      <div className={styles.drawer} role="dialog" aria-modal aria-label={card.title}>
        {/* Hero header */}
        <div className={styles.drawerHero}>
          <button className={styles.drawerClose} onClick={onClose} aria-label="ปิด">
            <XIcon />
          </button>
          <div className={`tag ${card.tagClass}`} style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)" }}>
            {card.tag}
          </div>
          <h2 className={styles.drawerTitle}>{card.title}</h2>
          <div className={styles.drawerUni}>{card.uni}</div>
        </div>

        {/* Stats bar */}
        <div className={styles.drawerStats}>
          {[
            { val: String(card.score), lbl: "Biz Score" },
            { val: card.tam, lbl: "Market TAM" },
            { val: card.roi, lbl: "ROI Potential" },
            { val: card.ttm, lbl: "Time to Market" },
          ].map((s) => (
            <div key={s.lbl} className={styles.mstat}>
              <div className={styles.mstatNum}>{s.val}</div>
              <div className={styles.mstatLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          {/* Overview */}
          <DrawerSection icon={<FileIcon />} title="ภาพรวมงานวิจัย">
            <p className={styles.prose}>{card.desc}</p>
          </DrawerSection>

          {/* Growth chart */}
          <DrawerSection icon={<ActivityIcon />} title="โอกาสการเติบโตทางธุรกิจ">
            <div className={styles.growthBars}>
              {card.growth.map((g, i) => {
                const [yr, val] = g.split(":");
                const pct = Math.round((growthVals[i] / maxVal) * 100);
                return (
                  <div key={yr} className={styles.gBarWrap}>
                    <div className={styles.gBarVal}>{val}</div>
                    <div className={styles.gBar} style={{ height: `${Math.max(pct * 0.7, 10)}px` }} />
                    <div className={styles.gBarLbl}>{yr}</div>
                  </div>
                );
              })}
            </div>
            <p className={styles.chartNote}>Market TAM projection (USD) — ที่มา: Euromonitor / Mordor Intelligence 2024</p>
          </DrawerSection>

          {/* Properties */}
          <DrawerSection icon={<ShieldIcon />} title="สรรพคุณและคุณสมบัติเด่น">
            <div className={styles.propsGrid}>
              {card.properties.map((p) => (
                <div key={p} className={styles.propItem}>
                  <div className={styles.propDot} />
                  <span className={styles.propText}>{p}</span>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* Use cases */}
          <DrawerSection icon={<LayersIcon />} title="Use Cases — สามารถนำไปทำอะไรได้บ้าง">
            <div className={styles.usecaseGrid}>
              {card.usecases.map((uc) => (
                <div key={uc.name} className={styles.usecaseCard}>
                  <div className={styles.usecaseIcon}>{UC_ICONS[uc.icon]}</div>
                  <div className={styles.usecaseName}>{uc.name}</div>
                  <div className={styles.usecaseDesc}>{uc.desc}</div>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* Partner invite */}
          <DrawerSection icon={<UsersIcon />} title="หาเพื่อนร่วมลงทุน">
            <div className={styles.partnerInvite}>
              <p className={styles.partnerIntro}>
                สนใจแต่ยังขาดเงินทุนหรือ expertise? ชวนเพื่อนหรือหุ้นส่วนมาร่วมกัน!
                แพลตฟอร์มจะช่วย match คุณกับนักลงทุนที่สนใจ IP เดียวกัน
              </p>
              {card.partnerCount > 0 && (
                <div className={styles.partnerAvatarRow}>
                  <div className={styles.avatarStack}>
                    {card.partners.map((color, i) => (
                      <div key={i} className={styles.avatar} style={{ background: color, marginLeft: i === 0 ? 0 : -8 }}>
                        {avatarLetters[i]}
                      </div>
                    ))}
                    {card.partnerCount > card.partners.length && (
                      <div className={styles.avatarMore} style={{ marginLeft: -8 }}>
                        +{card.partnerCount - card.partners.length}
                      </div>
                    )}
                  </div>
                  <span className={styles.avatarNote}>
                    {card.partnerCount} คนกำลังสนใจ — กำลังมองหาหุ้นส่วนเพิ่ม
                  </span>
                </div>
              )}
              <div className={styles.partnerForm}>
                <input
                  type="email"
                  className={styles.partnerInput}
                  placeholder="อีเมลเพื่อนที่อยากชวน..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onInvite()}
                />
                <button className={styles.partnerSendBtn} onClick={onInvite}>
                  ส่งคำเชิญ
                </button>
              </div>
            </div>
          </DrawerSection>
        </div>

        {/* CTA footer */}
        <div className={styles.drawerCta}>
          <button
            className={styles.btnMatchBig}
            onClick={() => alert("🎉 ส่งคำขอ Match แล้ว! ทีม Concierge จะติดต่อกลับใน 24 ชั่วโมง")}
          >
            <HeartIcon size={18} />
            Match Now — ติดต่อนักวิจัย
          </button>
          <button
            className={`${styles.btnSaveBig} ${saved ? styles.btnSaveBigActive : ""}`}
            onClick={onSave}
          >
            <BookmarkIcon size={16} filled={saved} />
            {saved ? "บันทึกแล้ว" : "บันทึก"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   WATCHLIST BAR
══════════════════════════════════════════ */
function WatchlistBar({ ids, onRemove }: { ids: number[]; onRemove: (id: number) => void }) {
  if (ids.length === 0) return null;
  return (
    <div className={styles.wlBar}>
      <span className={styles.wlBarTitle}>Watchlist</span>
      <div className={styles.wlBarList}>
        {ids.map((id) => {
          const card = IP_DATA.find((d) => d.id === id)!;
          const short = card.title.length > 26 ? card.title.slice(0, 24) + "…" : card.title;
          return (
            <div key={id} className={styles.wlBarItem}>
              {short}
              <button className={styles.wlBarRemove} onClick={() => onRemove(id)} aria-label="ลบ">×</button>
            </div>
          );
        })}
      </div>
      <button className={styles.wlConsultBtn}>ปรึกษา Concierge →</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════ */
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterTitle}>{title}</div>
      <div className={styles.filterChips}>{children}</div>
    </div>
  );
}

function DrawerSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.drawerSection}>
      <div className={styles.drawerSectionTitle}>
        {icon}
        {title}
      </div>
      {children}
      <div className={styles.secDivider} />
    </div>
  );
}

function MetricBox({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.ipcM}>
      <div className={styles.ipcMNum}>{value}</div>
      <div className={styles.ipcMLbl}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STYLE MAPS
══════════════════════════════════════════ */
const CAT_ICON_STYLES: Record<string, { bg: string; color: string }> = {
  functional: { bg: "#EDE9FE", color: "#6D28D1" },
  botanical: { bg: "#D1FAE5", color: "#065F46" },
  nutra: { bg: "#FEF3C7", color: "#92400E" },
  ferment: { bg: "#DBEAFE", color: "#1E40AF" },
};

/* ══════════════════════════════════════════
   ICON COMPONENTS
══════════════════════════════════════════ */
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function HeartIcon({ size = 15, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function ArrowRightIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function BookmarkIcon({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  functional: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  ),
  botanical: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M5 7c0 0 3-3 7-3s7 3 7 3-3 3-7 3-7-3-7-3" /><path d="M5 17c0 0 3-3 7-3s7 3 7 3-3 3-7 3-7-3-7-3" />
    </svg>
  ),
  nutra: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  ferment: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" /><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" /><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" /><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" /><path d="M3 9.5C3 8.67 3.67 8 4.5 8H10c.83 0 1.5.67 1.5 1.5S10.83 11 10 11H4.5C3.67 11 3 10.33 3 9.5z" />
    </svg>
  ),
};

const UC_ICONS: Record<string, React.ReactNode> = {
  capsule: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="8" /><line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  drink: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2h8l1 7H7L8 2z" /><path d="M7 9c0 5 1 9 5 11s5-6 5-11" />
    </svg>
  ),
  skin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
};
