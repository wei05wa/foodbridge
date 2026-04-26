import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "./PageViewTracker";

export const metadata: Metadata = {
  title: "FoodBridge IP — Connecting Thai Food Science to Global Business",
  description:
    "From Lab to Shelf — IP matching, OEM support, and Global Export services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <PageViewTracker />
        <Nav />
        {children}
      </body>
    </html>
  );
}

/* ── Glassmorphism Nav (server component, no interactivity needed) ── */
function Nav() {
  return (
    <nav style={navStyle}>
      <a href="/" style={logoStyle}>
        <div style={logoIconStyle}>
          <LayersIcon />
        </div>
        FoodBridge{" "}
        <span style={{ color: "var(--p)" }}>IP</span>
      </a>

      <div style={navLinksStyle}>
        <a href="/home" style={navLinkStyle}>
          Matching Hub
        </a>
        <a href="#" style={navLinkStyle}>
          OEM Network
        </a>
        <a href="#" style={navLinkStyle}>
          Concierge
        </a>
        <a href="#" style={navCtaStyle}>
          Get Started
        </a>
      </div>
    </nav>
  );
}

/* ── Inline styles (avoids extra CSS file for a simple nav) ── */
const navStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 200,
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  borderBottom: "1px solid rgba(229,231,235,0.65)",
  padding: "0 5%",
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 600,
  fontSize: "1.2rem",
  color: "var(--g9)",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const logoIconStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  background: "linear-gradient(135deg, var(--p), var(--p-l))",
  borderRadius: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const navLinksStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 32,
};

const navLinkStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--g6)",
  textDecoration: "none",
};

const navCtaStyle: React.CSSProperties = {
  background: "var(--p)",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: 8,
  fontSize: "0.875rem",
  fontWeight: 600,
  textDecoration: "none",
};

/* ── SVG Icon ── */
function LayersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
} 