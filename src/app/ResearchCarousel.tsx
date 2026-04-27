"use client";
import { useState, useRef } from "react";

const cards = [
  {
    id: 1,
    category: "NUTRACEUTICAL",
    categoryIcon: "⚗️",
    bgColor: "#F0EEFF",
    accentColor: "#7C6FCD",
    iconBg: "#E4DFFF",
    title: "สารสกัดมังคุด (Xanthone)",
    desc: "จุฬาฯ และ ม.มหิดล วิจัย hydroxy-xanthones จากเปลือกมังคุดจริง — Quality Plus ร่วม ม.เกษตรฯ แปรรูปเชิงพาณิชย์ส่งออกญี่ปุ่น–บราซิลแล้ว",
    metricLabel: "มูลค่าเพิ่มจากการสกัด",
    metricValue: "~15× vs วัตถุดิบ",
    barPercent: 75,
    source: "PubMed Central · Quality Plus / ม.เกษตรศาสตร์",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#E4DFFF" />
        <ellipse cx="28" cy="34" rx="10" ry="6" fill="#9B8FE0" opacity="0.3" />
        <rect x="24" y="14" width="8" height="18" rx="4" fill="#7C6FCD" />
        <circle cx="28" cy="34" r="7" fill="#7C6FCD" />
        <circle cx="28" cy="34" r="4" fill="#E4DFFF" />
        <circle cx="28" cy="34" r="2" fill="#7C6FCD" />
      </svg>
    ),
  },
  {
    id: 2,
    category: "FUNCTIONAL FOOD",
    categoryIcon: "🌿",
    bgColor: "#EDFAF3",
    accentColor: "#1D9E75",
    iconBg: "#C6EFE0",
    title: "โปรไบโอติกจากข้าวหมาก",
    desc: "ม.เกษตรศาสตร์คัดแยก strain จากข้าวหมากที่ทนความร้อน 60°C ได้ — ต่อยอดเป็น yogurt drink, granola bar หรือ supplement กล่อง",
    metricLabel: "ตลาด plant-based food ไทย (2024)",
    metricValue: "~USD 1.5B · +20%/yr",
    barPercent: 60,
    source: "Krungthai Compass · USDA FAS Bangkok",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#C6EFE0" />
        <rect x="18" y="20" width="20" height="22" rx="4" fill="#1D9E75" />
        <rect x="22" y="16" width="12" height="8" rx="3" fill="#0F6E56" />
        <rect x="25" y="13" width="6" height="5" rx="2" fill="#1D9E75" />
        <rect x="21" y="26" width="4" height="3" rx="1" fill="#C6EFE0" />
        <rect x="27" y="26" width="4" height="3" rx="1" fill="#C6EFE0" />
        <rect x="21" y="32" width="4" height="3" rx="1" fill="#C6EFE0" />
        <rect x="27" y="32" width="4" height="3" rx="1" fill="#C6EFE0" />
      </svg>
    ),
  },
  {
    id: 3,
    category: "NOVEL PROTEIN",
    categoryIcon: "🧬",
    bgColor: "#FEF3E8",
    accentColor: "#D07B1F",
    iconBg: "#FCDCB0",
    title: "โปรตีนจิ้งหรีดและแมลง",
    desc: "FAO ยืนยันไทยมีฟาร์มจิ้งหรีด >20,000 แห่งใน 53 จังหวัด — จุฬาฯ พัฒนา cultured protein prototype แล้ว และ SPACE-F / Thai Union หนุน",
    metricLabel: "ฟาร์มจิ้งหรีดในไทย (FAO)",
    metricValue: ">20,000 ฟาร์ม · 53 จังหวัด",
    barPercent: 82,
    source: "FAO · SPACE-F / Thai Union / ม.มหิดล",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#FCDCB0" />
        <ellipse cx="28" cy="30" rx="8" ry="10" fill="#D07B1F" />
        <circle cx="28" cy="21" r="6" fill="#BA6A10" />
        <line x1="22" y1="26" x2="14" y2="22" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="30" x2="13" y2="30" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="34" x2="14" y2="38" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="26" x2="42" y2="22" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="30" x2="43" y2="30" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <line x1="34" y1="34" x2="42" y2="38" stroke="#D07B1F" strokeWidth="2" strokeLinecap="round" />
        <circle cx="25" cy="20" r="1.5" fill="#FCDCB0" />
        <circle cx="31" cy="20" r="1.5" fill="#FCDCB0" />
      </svg>
    ),
  },
  {
    id: 4,
    category: "THAI HERITAGE FOOD",
    categoryIcon: "🍮",
    bgColor: "#FFF0F5",
    accentColor: "#C2456B",
    iconBg: "#FCCFDE",
    title: "ขนมไทย — IP สู่ตลาดโลก",
    desc: "ขนมครก อันดับ 1 TasteAtlas 2026 — Eve Global Trade เปิดตัว frozen Thai desserts ในสหรัฐฯ ต.ค. 2024 แล้ว ตลาด frozen Thai tea ice cream bars โต 10.4% CAGR",
    metricLabel: "ตลาด frozen Thai dessert (global, 2024)",
    metricValue: "USD 305M · +10.4% CAGR",
    barPercent: 50,
    source: "TasteAtlas 2026 · Fortune Business Insights · DataIntelo",
    icon: (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="28" fill="#FCCFDE" />
        <ellipse cx="28" cy="36" rx="12" ry="5" fill="#C2456B" opacity="0.25" />
        <path d="M16 30 Q16 20 28 20 Q40 20 40 30 L38 38 Q28 42 18 38 Z" fill="#C2456B" />
        <path d="M20 26 Q20 22 28 22 Q36 22 36 26" stroke="#E87DA0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="31" r="3" fill="#FCCFDE" opacity="0.8" />
        <circle cx="32" cy="31" r="3" fill="#FCCFDE" opacity="0.8" />
        <circle cx="28" cy="35" r="2.5" fill="#FCCFDE" opacity="0.8" />
      </svg>
    ),
  },
];

export default function ResearchCarousel() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  const prev = () => setCurrent((c) => (c - 1 + cards.length) % cards.length);
  const next = () => setCurrent((c) => (c + 1) % cards.length);

  const onMouseDown = (e: React.MouseEvent) => {
    dragStart.current = e.clientX;
    setDragging(true);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    setDragging(false);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
  };

  const visibleIndices = [
    (current - 1 + cards.length) % cards.length,
    current,
    (current + 1) % cards.length,
  ];

  return (
    <section style={{
      background: "#FAFAF8",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "60px 24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 560 }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#1D9E75", marginBottom: 12,
        }}>
          Food IP · งานวิจัยที่มีหลักฐาน
        </p>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 36, fontWeight: 400,
          color: "#1C1C1A", margin: "0 0 8px",
          lineHeight: 1.2,
        }}>
          งานวิจัยที่เพิ่ม<em style={{ color: "#1D9E75", fontStyle: "italic" }}>มูลค่า</em>ธุรกิจจริง
        </h1>
        <p style={{ fontSize: 14, color: "#888780", lineHeight: 1.6, margin: 0 }}>
          ตัวอย่าง IP จากห้องแล็บไทยไปสร้างผลิตภัณฑ์ Food & Wellness ที่ตลาดโลกต้องการ
        </p>
      </div>

      {/* Carousel */}
      <div
        style={{ width: "100%", maxWidth: 860, position: "relative", cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          perspective: "1200px",
        }}>
          {visibleIndices.map((cardIdx, pos) => {
            const card = cards[cardIdx];
            const isCenter = pos === 1;
            return (
              <div
                key={cardIdx}
                onClick={() => { if (!isCenter) { pos === 0 ? prev() : next(); } }}
                style={{
                  width: isCenter ? 300 : 240,
                  minHeight: isCenter ? 420 : 360,
                  background: card.bgColor,
                  borderRadius: 24,
                  padding: isCenter ? "28px 24px 24px" : "22px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  cursor: isCenter ? "grab" : "pointer",
                  opacity: isCenter ? 1 : 0.55,
                  transform: isCenter
                    ? "scale(1) translateY(0)"
                    : pos === 0
                    ? "scale(0.88) translateX(12px)"
                    : "scale(0.88) translateX(-12px)",
                  transition: "all 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isCenter
                    ? "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)"
                    : "0 4px 16px rgba(0,0,0,0.05)",
                  flexShrink: 0,
                  userSelect: "none",
                  border: isCenter ? `1px solid ${card.accentColor}22` : "1px solid transparent",
                }}
              >
                {/* Icon area */}
                <div style={{
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: 16,
                  height: isCenter ? 110 : 90,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{ transform: isCenter ? "scale(1)" : "scale(0.85)", transition: "transform 0.38s" }}>
                    {card.icon}
                  </div>
                </div>

                {/* Badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(255,255,255,0.7)",
                  border: `1px solid ${card.accentColor}33`,
                  borderRadius: 20,
                  padding: "4px 10px",
                  width: "fit-content",
                }}>
                  <span style={{ fontSize: 10 }}>{card.categoryIcon}</span>
                  <span style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.09em",
                    color: card.accentColor,
                    textTransform: "uppercase",
                  }}>
                    {card.category}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: isCenter ? 20 : 17,
                  fontWeight: 400,
                  color: "#1C1C1A",
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {card.title}
                </h2>

                {/* Description */}
                {isCenter && (
                  <p style={{
                    fontSize: 13,
                    color: "#5F5E5A",
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}>
                    {card.desc}
                  </p>
                )}

                {/* Metric */}
                <div style={{ marginTop: "auto" }}>
                  <p style={{
                    fontSize: 10,
                    color: "#888780",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    margin: "0 0 4px",
                  }}>
                    {card.metricLabel}
                  </p>
                  <p style={{
                    fontSize: isCenter ? 18 : 15,
                    fontWeight: 600,
                    color: card.accentColor,
                    margin: "0 0 8px",
                  }}>
                    {card.metricValue}
                  </p>
                  {/* Progress bar */}
                  <div style={{
                    height: 4,
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: isCenter ? `${card.barPercent}%` : "40%",
                      background: card.accentColor,
                      borderRadius: 4,
                      transition: "width 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s",
                    }} />
                  </div>
                </div>

                {/* Source */}
                {isCenter && (
                  <p style={{
                    fontSize: 10,
                    color: "#B4B2A9",
                    margin: 0,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    paddingTop: 10,
                    lineHeight: 1.5,
                  }}>
                    {card.source}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrow buttons */}
        <button
          onClick={prev}
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#5F5E5A",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          ←
        </button>
        <button
          onClick={next}
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#5F5E5A",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 32, alignItems: "center" }}>
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 7,
              height: 7,
              borderRadius: 4,
              background: i === current ? cards[current].accentColor : "#D3D1C7",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <p style={{
        fontSize: 11,
        color: "#B4B2A9",
        marginTop: 40,
        textAlign: "center",
      }}>
        FoodBridge IP · ข้อมูลอ้างอิงจากแหล่งจริง · For case study
      </p>
    </section>
  );
}