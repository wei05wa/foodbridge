"use client";
import { useEffect, useState } from "react";

const SUPABASE_URL = 'https://hjvbdjupknqzynbtwcch.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hcJeLdQ2nTRiwpQJAJOQaQ_GlncxhIN';

async function fetchSupabase(table: string, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  return res.json();
}

export default function DashboardPage() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSupabase('waitlist', 'select=*&order=created_at.desc'),
      fetchSupabase('page_views', 'select=*&order=created_at.desc'),
    ]).then(([w, p]) => {
      setWaitlist(w);
      setPageViews(p);
      setWaitlist(Array.isArray(w) ? w : []);   // ← เพิ่ม
      setPageViews(Array.isArray(p) ? p : []);  // ← เพิ่ม
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  const researchers = waitlist.filter(w => w.track === 'researcher');
  const smes = waitlist.filter(w => w.track === 'sme');
  const todayViews = pageViews.filter(p =>
    new Date(p.created_at).toDateString() === new Date().toDateString()
  );

  // Page views รายวัน 7 วันล่าสุด
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' });
    const count = pageViews.filter(p =>
      new Date(p.created_at).toDateString() === d.toDateString()
    ).length;
    return { label, count };
  });

  const maxViews = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>FoodBridge IP</div>
          <h1 style={styles.title}>Investor Dashboard</h1>
          <p style={styles.sub}>Live traction data · Updated in real-time</p>
        </div>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot} />
          LIVE
        </div>
      </div>

      {/* Stat Cards */}
      <div style={styles.grid4}>
        <StatCard label="Total Waitlist" value={waitlist.length} color="#1D9E75" icon="👥" />
        <StatCard label="Researchers" value={researchers.length} color="#085041" icon="🔬" />
        <StatCard label="SME Partners" value={smes.length} color="#BA7517" icon="🏭" />
        <StatCard label="Views Today" value={todayViews.length} color="#178ABF" icon="👁" />
      </div>

      {/* Chart + Breakdown */}
      <div style={styles.grid2}>
        {/* Bar Chart */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Page Views — 7 Days</div>
          <div style={styles.barChart}>
            {last7Days.map((d, i) => (
              <div key={i} style={styles.barCol}>
                <div style={styles.barCount}>{d.count}</div>
                <div style={styles.barWrap}>
                  <div style={{
                    ...styles.bar,
                    height: `${(d.count / maxViews) * 100}%`,
                    background: d.count === Math.max(...last7Days.map(x => x.count))
                      ? '#1D9E75' : '#9FE1CB',
                  }} />
                </div>
                <div style={styles.barLabel}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist Breakdown */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Waitlist Breakdown</div>
          <div style={styles.donutWrap}>
            <svg viewBox="0 0 120 120" width="140" height="140">
              <DonutSlice total={waitlist.length} value={researchers.length} color="#1D9E75" offset={0} />
              <DonutSlice total={waitlist.length} value={smes.length} color="#BA7517" offset={researchers.length} />
              <text x="60" y="55" textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#2C2C2A' }}>
                {waitlist.length}
              </text>
              <text x="60" y="70" textAnchor="middle" style={{ fontSize: 9, fill: '#888780' }}>
                Total
              </text>
            </svg>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#1D9E75' }} />
                <span>Researchers ({researchers.length})</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: '#BA7517' }} />
                <span>SME ({smes.length})</span>
              </div>
            </div>
          </div>

          {/* IP Categories */}
          {researchers.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={styles.cardSubTitle}>Top IP Categories</div>
              {Object.entries(
                researchers.reduce((acc: any, r) => {
                  if (r.ip_category) acc[r.ip_category] = (acc[r.ip_category] || 0) + 1;
                  return acc;
                }, {})
              ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 4).map(([cat, count]: any) => (
                <div key={cat} style={styles.categoryRow}>
                  <span style={styles.categoryLabel}>{cat}</span>
                  <div style={styles.categoryBarWrap}>
                    <div style={{ ...styles.categoryBar, width: `${(count / researchers.length) * 100}%` }} />
                  </div>
                  <span style={styles.categoryCount}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Signups */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Recent Signups</div>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Track', 'Organization', 'Role', 'Signed Up'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waitlist.slice(0, 10).map((w, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.trEven : {}}>
                <td style={styles.td}>{w.first_name} {w.last_name}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.trackBadge,
                    background: w.track === 'researcher' ? '#E1F5EE' : '#FAEEDA',
                    color: w.track === 'researcher' ? '#085041' : '#633806',
                  }}>
                    {w.track === 'researcher' ? '🔬 Researcher' : '🏭 SME'}
                  </span>
                </td>
                <td style={styles.td}>{w.organization}</td>
                <td style={styles.td}>{w.role}</td>
                <td style={styles.td}>{new Date(w.created_at).toLocaleDateString('th-TH')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        FoodBridge IP · Confidential · For investor use only
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: any) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#888780', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function DonutSlice({ total, value, color, offset }: any) {
  if (total === 0) return null;
  const r = 45; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;
  const pct = value / total;
  const offsetPct = offset / total;
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
      strokeWidth="18"
      strokeDasharray={`${pct * circ} ${circ}`}
      strokeDashoffset={-offsetPct * circ}
      transform="rotate(-90 60 60)"
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F6FDF9', padding: '40px 32px', fontFamily: 'DM Sans, sans-serif', color: '#2C2C2A' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 18, color: '#888780' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 4 },
  title: { fontSize: 32, fontWeight: 700, margin: 0 },
  sub: { fontSize: 13, color: '#888780', marginTop: 4 },
  liveBadge: { display: 'flex', alignItems: 'center', gap: 6, background: '#E1F5EE', color: '#085041', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', animation: 'pulse 1.5s infinite' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  card: { background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: 14, fontWeight: 600, color: '#2C2C2A', marginBottom: 20 },
  cardSubTitle: { fontSize: 12, fontWeight: 600, color: '#888780', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' },
  barChart: { display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 20 },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' },
  barCount: { fontSize: 11, color: '#888780', height: 16 },
  barWrap: { flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' },
  bar: { width: '100%', borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.3s' },
  barLabel: { fontSize: 10, color: '#888780', textAlign: 'center' },
  donutWrap: { display: 'flex', alignItems: 'center', gap: 24 },
  legend: { display: 'flex', flexDirection: 'column', gap: 10 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5F5E5A' },
  legendDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  categoryRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  categoryLabel: { fontSize: 11, color: '#5F5E5A', width: 140, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  categoryBarWrap: { flex: 1, height: 6, background: '#E1F5EE', borderRadius: 3, overflow: 'hidden' },
  categoryBar: { height: '100%', background: '#1D9E75', borderRadius: 3 },
  categoryCount: { fontSize: 11, fontWeight: 600, color: '#1D9E75', width: 16, textAlign: 'right' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(0,0,0,0.08)' },
  td: { padding: '10px 12px', color: '#2C2C2A', borderBottom: '1px solid rgba(0,0,0,0.04)' },
  trEven: { background: '#F6FDF9' },
  trackBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  footer: { textAlign: 'center', fontSize: 11, color: '#B4B2A9', marginTop: 32 },
};