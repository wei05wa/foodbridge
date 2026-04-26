"use client";
import React, { useState } from "react"; 

const SUPABASE_URL = 'https://hjvbdjupknqzynbtwcch.supabase.co';
const SUPABASE_KEY = 'sb_publishable_hcJeLdQ2nTRiwpQJAJOQaQ_GlncxhIN';

const TRACK_CONFIG = {
  researcher: {
    formTitle: 'List Your Food Science IP',
    formSub: 'Register your validated research for IP matching with global food industry partners and OEM manufacturers.',
    orgLabel: 'University / Research Institution',
    orgPlaceholder: 'Chulalongkorn University',
    emailPlaceholder: 'you@university.ac.th',
    roleOptions: [
      { value: 'professor', label: 'Professor / Associate Professor' },
      { value: 'researcher', label: 'Research Scientist' },
      { value: 'phd', label: 'PhD Student / Postdoc' },
      { value: 'tech-transfer', label: 'Technology Transfer Officer' },
      { value: 'institution-head', label: 'Institution Head / Dean' },
    ],
    showIpField: true,
    btnText: 'Join Researcher Waitlist',
    successSub: 'Our team will reach out soon to help list your IP and match with OEM and global partners.',
  },
  sme: {
    formTitle: 'Access Validated Thai Food IP',
    formSub: 'Join the waitlist to browse ready-to-license food science IP and connect with certified OEM manufacturers.',
    orgLabel: 'Company Name',
    orgPlaceholder: 'Your Company Ltd.',
    emailPlaceholder: 'you@company.com',
    roleOptions: [
      { value: 'founder', label: 'Founder / CEO' },
      { value: 'product-mgr', label: 'Product Manager' },
      { value: 'biz-dev', label: 'Business Development' },
      { value: 'procurement', label: 'Procurement / Sourcing' },
      { value: 'investor', label: 'Investor / VC' },
    ],
    showIpField: false,
    btnText: 'Join SME Waitlist',
    successSub: "We'll reach out with early access details and curated IP matches for your business.",
  },
};

export default function WaitlistSection() {
  const [track, setTrack] = useState<'researcher' | 'sme'>('researcher');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
  fname: '', lname: '', email: '', org: '', role: '', ipCategory: '',
});

  const cfg = TRACK_CONFIG[track];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          track,
          first_name: form.fname,
          last_name: form.lname,
          email: form.email,
          organization: form.org,
          role: form.role,
          ip_category: cfg.showIpField ? form.ipCategory || null : null,
        }),
      });
      if (res.ok || res.status === 201) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" style={{ padding: '80px 24px', background: '#f6fdf9' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Header */}
        <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1D9E75', marginBottom: 12 }}>
          Early Access Waitlist
        </p>
        <h2 style={{ textAlign: 'center', fontSize: 36, fontWeight: 700, marginBottom: 8, color: '#2C2C2A' }}>
          Join the Waitlist
        </h2>
        <p style={{ textAlign: 'center', color: '#5F5E5A', marginBottom: 36, lineHeight: 1.6 }}>
          Tell us who you are — we have a track built for you.
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4, marginBottom: 32 }}>
          {(['researcher', 'sme'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTrack(t); setSubmitted(false); }}
              style={{
                flex: 1, padding: '12px 16px', border: 'none', borderRadius: 9,
                cursor: 'pointer', fontWeight: 500, fontSize: 13, lineHeight: 1.4,
                background: track === t ? '#fff' : 'transparent',
                color: track === t ? (t === 'researcher' ? '#085041' : '#633806') : '#888780',
                boxShadow: track === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t === 'researcher' ? '🔬 Researcher / Institution' : '🏭 SME / Business Partner'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.1)', padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, marginBottom: 8, color: '#2C2C2A' }}>You're on the list!</h3>
              <p style={{ color: '#5F5E5A', lineHeight: 1.6 }}>{cfg.successSub}</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2C2C2A', marginBottom: 6 }}>{cfg.formTitle}</h3>
              <p style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 24, lineHeight: 1.5 }}>{cfg.formSub}</p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <Field label="First Name" name="fname" value={form.fname} onChange={handleChange} placeholder="Somchai" required />
                  <Field label="Last Name" name="lname" value={form.lname} onChange={handleChange} placeholder="Wongkham" required />
                </div>
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder={cfg.emailPlaceholder} required />
                <Field label={cfg.orgLabel} name="org" value={form.org} onChange={handleChange} placeholder={cfg.orgPlaceholder} required />
                <SelectField label="Your Role" name="role" value={form.role} onChange={handleChange} options={cfg.roleOptions} required />
                {cfg.showIpField && (
                  <SelectField label="Research / IP Category (optional)" name="ipCategory" value={form.ipCategory} onChange={handleChange} options={[
                    { value: 'functional-food', label: 'Functional Food & Nutraceuticals' },
                    { value: 'biotech', label: 'Food Biotech & Fermentation' },
                    { value: 'extracts', label: 'Natural Extracts & Bioactives' },
                    { value: 'safety', label: 'Food Safety & Preservation' },
                    { value: 'novel', label: 'Novel Ingredients & Substitutes' },
                    { value: 'packaging', label: 'Packaging Innovation' },
                    { value: 'other', label: 'Other' },
                  ]} />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px', marginTop: 8, border: 'none', borderRadius: 10,
                    background: track === 'researcher' ? '#1D9E75' : '#BA7517',
                    color: '#fff', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Submitting...' : cfg.btnText}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Helper components
function Field({ label, name, value, onChange, placeholder, type = 'text', required = false }: any) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 6 }}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }: any) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 6 }}>{label}</label>
      <select
        name={name} value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
      >
        <option value="">Select...</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}