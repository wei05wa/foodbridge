"use client";

import { useEffect, useRef } from "react";

export default function CityScene() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const g = cv.getContext("2d")!;
    const PR = window.devicePixelRatio || 1;
    const W = cv.parentElement!.offsetWidth;
    const H = 520;
    cv.width = W * PR;
    cv.height = H * PR;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    g.scale(PR, PR);

    let T = 0;
    let raf: number;

    const VX = W * 0.5, VY = H * 0.35, TX = 38, TY = 19;
    function ix(c: number, r: number) { return VX + (c - r) * TX; }
    function iy(c: number, r: number) { return VY + (c + r) * TY; }
    function dk(h: string, a = 0.18) {
      const R = parseInt(h.slice(1,3),16), G = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
      return `rgb(${Math.max(0,R-a*255)},${Math.max(0,G-a*255)},${Math.max(0,B-a*255)})`;
    }
    function lt(h: string, a = 0.15) {
      const R = parseInt(h.slice(1,3),16), G = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
      return `rgb(${Math.min(255,R+a*255)},${Math.min(255,G+a*255)},${Math.min(255,B+a*255)})`;
    }

    function drawBg() {
      // ใส่ transparent แทน dark background
      g.clearRect(0, 0, W, H);

      // mesh orbs สีอ่อน
      ([ [W*.08,H*.15,180,"rgba(139,92,246,.07)"], 
         [W*.85,H*.12,150,"rgba(99,102,241,.06)"],
         [W*.5,H*.65,220,"rgba(167,139,250,.05)"], 
         [W*.9,H*.7,110,"rgba(196,181,253,.06)"],
         [W*.25,H*.55,100,"rgba(124,58,237,.05)"] 
      ] as any[]).forEach(([x,y,r,c]: any) => {
        const gr = g.createRadialGradient(x,y,0,x,y,r);
        gr.addColorStop(0,c); gr.addColorStop(1,"transparent");
        g.fillStyle = gr; g.fillRect(0,0,W,H);
      });
    }

    function drawGround() {
      g.beginPath();
      g.moveTo(0, iy(0,9)); g.lineTo(W, iy(9,0)); g.lineTo(W,H); g.lineTo(0,H); g.closePath();
      const gg = g.createLinearGradient(0,iy(0,9),0,H);
      gg.addColorStop(0,"rgba(237,233,254,.4)");
      gg.addColorStop(1,"rgba(221,214,254,.6)");
      g.fillStyle = gg; g.fill();
    }

    function drawTile(c: number, r: number, road: boolean) {
      const x=ix(c,r), y=iy(c,r);
      g.beginPath(); g.moveTo(x,y-TY); g.lineTo(x+TX,y); g.lineTo(x,y+TY); g.lineTo(x-TX,y); g.closePath();
      if (road) {
         g.fillStyle = "rgba(139,92,246,.07)"; g.fill();
         g.strokeStyle = "rgba(167,139,250,.15)"; g.lineWidth = .5; g.stroke();
         g.strokeStyle = "rgba(139,92,246,.2)"; g.lineWidth = .9; g.setLineDash([3,6]);
        g.beginPath();
        if (c===4) { g.moveTo(x,y-TY+5); g.lineTo(x,y+TY-5); }
        else { g.moveTo(x-TX+5,y); g.lineTo(x+TX-5,y); }
        g.stroke(); g.setLineDash([]);
      } else {
        g.fillStyle = "rgba(139,92,246,.025)"; g.fill();
        g.strokeStyle = "rgba(139,92,246,.06)"; g.lineWidth = .5; g.stroke();
      }
    } // เพิ่มวงเล็บปีกกาปิดตรงนี้ที่หายไป

    function drawBuilding(c: number, r: number, floors: number, tw: number, topC: string, glowC: string|null) {
      const x=ix(c,r), y=iy(c,r);
      const bh=floors*13, bx=TX*tw, by=TY*tw;
      const sC=dk(topC,.22), fC=dk(topC,.1);
      if (glowC) {
        const gr = g.createRadialGradient(x,y+by,0,x,y+by,bx*1.5);
        gr.addColorStop(0, glowC+"33"); gr.addColorStop(1,"transparent");
        g.fillStyle = gr; g.fillRect(x-bx*2,y-20,bx*4,40);
      }
      g.beginPath(); g.moveTo(x,y+by*1.5); g.lineTo(x+bx,y+by*.8); g.lineTo(x+bx,y+by*.8+6); g.lineTo(x,y+by*1.5+6); g.closePath();
      g.fillStyle = "rgba(0,0,0,.2)"; g.fill();
      g.beginPath(); g.moveTo(x-bx,y+by); g.lineTo(x,y+by*1.5); g.lineTo(x,y-bh+by*1.5); g.lineTo(x-bx,y-bh+by); g.closePath();
      g.fillStyle = sC; g.fill(); g.strokeStyle = "rgba(255,255,255,.04)"; g.lineWidth = .5; g.stroke();
      g.beginPath(); g.moveTo(x,y+by*1.5); g.lineTo(x+bx,y+by); g.lineTo(x+bx,y-bh+by); g.lineTo(x,y-bh+by*1.5); g.closePath();
      g.fillStyle = fC; g.fill(); g.strokeStyle = "rgba(255,255,255,.04)"; g.lineWidth = .5; g.stroke();
      g.beginPath(); g.moveTo(x,y-bh+by*1.5); g.lineTo(x+bx,y-bh+by); g.lineTo(x,y-bh+by*.5); g.lineTo(x-bx,y-bh+by); g.closePath();
      g.fillStyle = lt(topC,.04); g.fill(); g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = .5; g.stroke();
      g.beginPath(); g.arc(x,y-bh+by*.9,3,0,Math.PI*2);
      g.fillStyle = `rgba(255,255,255,${Math.sin(T*.06+c+r)*.3+.5})`; g.fill();
      for(let f=0;f<Math.min(floors-1,7);f++) {
        for(let w=0;w<2;w++) {
          const wy = y-bh+by*1.5+10+f*13;
          const wa = Math.sin(T*.03+c*1.2+r+f*.7+w)*.2+.65;
          g.fillStyle = `rgba(253,224,71,${wa*.52})`; g.fillRect(x+3+w*15,wy,8,9);
          g.fillStyle = `rgba(196,181,253,${wa*.38})`; g.fillRect(x-bx+4+w*15,wy,8,9);
        }
      }
    }

    function person(x: number, y: number, col: string, ph: number, sc=1) {
      const b = Math.sin(T*.055+ph)*2.5;
      g.save(); g.translate(x,y+b); g.scale(sc,sc);
      const gr = g.createRadialGradient(0,-10,0,0,-10,20);
      gr.addColorStop(0,col+"44"); gr.addColorStop(1,"transparent");
      g.fillStyle = gr; g.fillRect(-20,-30,40,30);
      g.fillStyle = col;
      g.beginPath(); g.arc(0,-22,6,0,Math.PI*2); g.fill();
      g.beginPath(); g.moveTo(-6,-16); g.quadraticCurveTo(0,-4,6,-16); g.lineTo(7,-2); g.lineTo(-7,-2); g.closePath(); g.fill();
      g.fillRect(-5,-2,4,8); g.fillRect(1,-2,4,8);
      g.strokeStyle = col; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-6,-12); g.lineTo(-14,-4); g.stroke();
      g.beginPath(); g.moveTo(6,-12); g.lineTo(14,-4); g.stroke();
      g.restore();
    }

    function floatCoin(x: number, y: number, ph: number, col="#fbbf24") {
      const ofs = (T*.5+ph*20)%70; const a = 1-ofs/70;
      if(a<.05) return;
      g.save(); g.globalAlpha = a; g.translate(x,y-ofs);
      g.fillStyle = col; g.beginPath(); g.ellipse(0,0,9,6,0,0,Math.PI*2); g.fill();
      g.fillStyle = "rgba(255,255,255,.45)"; g.font = "bold 7px sans-serif"; g.textAlign = "center";
      g.fillText("$",0,2.5); g.restore();
    }

    function floatChart(x: number, y: number, ph: number, col: string) {
      const ofs = (T*.4+ph*15)%60; const a = 1-ofs/60;
      if(a<.05) return;
      g.save(); g.globalAlpha = a*.9; g.translate(x,y-ofs);
      const bars = [.35,.55,.45,.78,.62,.9]; const bh = 18;
      bars.forEach((h,i) => { g.fillStyle = lt(col,.1); g.fillRect(i*5-15,-(h*bh),4,h*bh); });
      g.strokeStyle = "#4ade80"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(3,-bh*.95); g.lineTo(3,-bh*1.25);
      g.moveTo(0,-bh*1.1); g.lineTo(3,-bh*1.25); g.lineTo(6,-bh*1.1); g.stroke();
      g.restore();
    }

    function floatFlask(x: number, y: number, ph: number) {
      const bob = Math.sin(T*.05+ph)*4;
      g.save(); g.translate(x,y+bob);
      g.strokeStyle = "rgba(196,181,253,.75)"; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(-5,-15); g.lineTo(-5,-7); g.lineTo(-11,4); g.lineTo(11,4); g.lineTo(5,-7); g.lineTo(5,-15); g.closePath(); g.stroke();
      g.fillStyle = "rgba(139,92,246,.4)";
      g.beginPath(); g.moveTo(-11,1); g.lineTo(11,1); g.lineTo(11,4); g.lineTo(-11,4); g.closePath(); g.fill();
      g.restore();
    }

    function floatBox(x: number, y: number, ph: number, col: string) {
      const bob = Math.sin(T*.045+ph)*3.5;
      g.save(); g.translate(x,y+bob); g.globalAlpha = .85;
      const s = 10;
      g.fillStyle = col;
      g.beginPath(); g.moveTo(0,-s); g.lineTo(s,-s*.5); g.lineTo(s,s*.5); g.lineTo(0,s); g.lineTo(-s,s*.5); g.lineTo(-s,-s*.5); g.closePath(); g.fill();
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = .5; g.stroke();
      g.restore();
    }

    function drawTruck(c: number, r: number, col: string) {
      const x=ix(c,r), y=iy(c,r);
      const sc=.78, tw=24*sc, th=13*sc, td=7*sc;
      g.save(); g.translate(x,y);
      g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(1,th*.85,tw,3,0,0,Math.PI*2); g.fill();
      g.beginPath(); g.moveTo(-tw,0); g.lineTo(0,-td); g.lineTo(tw,-td); g.lineTo(tw*.55,0); g.closePath();
      g.fillStyle = lt(col,.12); g.fill(); g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = .4; g.stroke();
      g.beginPath(); g.moveTo(-tw,0); g.lineTo(-tw,th); g.lineTo(tw*.55,th); g.lineTo(tw*.55,0); g.closePath(); g.fillStyle = col; g.fill();
      g.beginPath(); g.moveTo(tw*.55,0); g.lineTo(tw,-td); g.lineTo(tw,th-td); g.lineTo(tw*.55,th); g.closePath(); g.fillStyle = dk(col,.14); g.fill();
      g.fillStyle = "rgba(219,234,254,.92)"; g.beginPath(); (g as any).roundRect(tw*.28,-td-th*.68,tw*.74,th*.7,2); g.fill();
      [-tw*.5, tw*.32].forEach(wx => {
        g.beginPath(); g.ellipse(wx,th,6*sc,3*sc,0,0,Math.PI*2); g.fillStyle = "#1e1b4b"; g.fill();
        g.beginPath(); g.ellipse(wx,th,3*sc,1.5*sc,0,0,Math.PI*2); g.fillStyle = "rgba(196,181,253,.45)"; g.fill();
      });
      g.restore();
    }

    function drawPlane(px: number, py: number, col: string, sc: number) {
      g.save(); g.translate(px,py); g.scale(sc,sc);
      const tr = g.createLinearGradient(-60,0,0,0);
      tr.addColorStop(0,"transparent"); tr.addColorStop(1,col+"55");
      g.fillStyle = tr; g.fillRect(-60,-2,60,4);
      g.fillStyle = col; g.beginPath(); g.ellipse(0,0,26,5.5,0,0,Math.PI*2); g.fill();
      g.beginPath(); g.moveTo(26,0); g.lineTo(36,-2.5); g.lineTo(36,2.5); g.closePath(); g.fillStyle = lt(col,.2); g.fill();
      g.beginPath(); g.moveTo(2,-5.5); g.lineTo(-14,-24); g.lineTo(-22,-5.5); g.closePath(); g.fillStyle = col; g.fill();
      g.beginPath(); g.moveTo(2,5.5); g.lineTo(-14,24); g.lineTo(-22,5.5); g.closePath(); g.fillStyle = col; g.fill();
      g.beginPath(); g.moveTo(-20,-5.5); g.lineTo(-30,-18); g.lineTo(-26,-5.5); g.closePath(); g.fillStyle = dk(col,.1); g.fill();
      g.beginPath(); g.moveTo(-20,5.5); g.lineTo(-30,18); g.lineTo(-26,5.5); g.closePath(); g.fillStyle = dk(col,.1); g.fill();
      g.fillStyle = "rgba(219,234,254,.8)";
      [10,2,-6].forEach(wx => { g.beginPath(); g.ellipse(wx,0,3,2,0,0,Math.PI*2); g.fill(); });
      g.fillStyle = "rgba(239,68,68,.8)"; g.fillRect(4,-5.5,3.5,2);
      g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(4,-3.5,3.5,2);
      g.fillStyle = "rgba(37,99,235,.8)"; g.fillRect(4,-1.5,3.5,2);
      g.fillStyle = dk(col,.08);
      g.beginPath(); g.ellipse(-8,-14,4,2.5,0,0,Math.PI*2); g.fill();
      g.beginPath(); g.ellipse(-8,14,4,2.5,0,0,Math.PI*2); g.fill();
      g.restore();
    }

    function drawGlobe(px: number, py: number, sc: number) {
      const p = Math.sin(T*.04)*.1+.9;
      g.save(); g.translate(px,py);
      const gr = g.createRadialGradient(0,0,0,0,0,20*sc*p);
      gr.addColorStop(0,"rgba(52,211,153,.5)"); gr.addColorStop(1,"transparent");
      g.fillStyle = gr; g.fillRect(-30*sc,-30*sc,60*sc,60*sc);
      g.beginPath(); g.arc(0,0,10*sc,0,Math.PI*2); g.fillStyle = "rgba(52,211,153,.25)"; g.fill();
      g.beginPath(); g.arc(0,0,7*sc,0,Math.PI*2); g.fillStyle = "rgba(52,211,153,.6)"; g.fill();
      g.beginPath(); g.arc(0,0,3.5*sc,0,Math.PI*2); g.fillStyle = "#6ee7b7"; g.fill();
      g.strokeStyle = "rgba(52,211,153,.4)"; g.lineWidth = .6;
      g.beginPath(); g.ellipse(0,0,7*sc,2.5*sc,0,0,Math.PI*2); g.stroke();
      g.beginPath(); g.ellipse(0,0,2.5*sc,7*sc,0,0,Math.PI*2); g.stroke();
      g.restore();
    }

    const GS = 9;
    const RH = new Set<string>(), RV = new Set<string>();
    for(let i=0;i<GS;i++) { RH.add(`4,${i}`); RV.add(`${i},4`); }

    const BLDS = [
      // Research purple TL
      {c:1,r:1,f:8,tw:.82,t:"#7c3aed",gl:"#a78bfa"},{c:2,r:1,f:4,tw:.66,t:"#8b5cf6",gl:null},
      {c:1,r:2,f:6,tw:.72,t:"#a78bfa",gl:null},{c:2,r:2,f:3,tw:.58,t:"#8b5cf6",gl:null},
      {c:0,r:2,f:5,tw:.6,t:"#7c3aed",gl:null},{c:1,r:3,f:2,tw:.5,t:"#a78bfa",gl:null},
      // OEM blue TR
      {c:6,r:1,f:8,tw:.82,t:"#3b82f6",gl:"#60a5fa"},{c:7,r:1,f:5,tw:.66,t:"#2563eb",gl:null},
      {c:6,r:2,f:6,tw:.72,t:"#3b82f6",gl:null},{c:7,r:2,f:3,tw:.58,t:"#60a5fa",gl:null},
      {c:8,r:2,f:4,tw:.6,t:"#2563eb",gl:null},{c:6,r:3,f:2,tw:.5,t:"#3b82f6",gl:null},
      // SME pink BL
      {c:1,r:6,f:7,tw:.82,t:"#db2777",gl:"#f472b6"},{c:2,r:6,f:4,tw:.66,t:"#ec4899",gl:null},
      {c:1,r:7,f:5,tw:.72,t:"#f472b6",gl:null},{c:2,r:7,f:3,tw:.58,t:"#ec4899",gl:null},
      {c:0,r:7,f:3,tw:.55,t:"#db2777",gl:null},{c:1,r:8,f:2,tw:.5,t:"#f472b6",gl:null},
      // Airport teal BR
      {c:6,r:6,f:5,tw:.82,t:"#059669",gl:"#34d399"},{c:7,r:6,f:3,tw:.66,t:"#10b981",gl:null},
      {c:6,r:7,f:4,tw:.72,t:"#34d399",gl:null},{c:7,r:7,f:2,tw:.58,t:"#10b981",gl:null},
      {c:8,r:7,f:3,tw:.55,t:"#059669",gl:null},
      // Mid filler
      {c:3,r:3,f:3,tw:.6,t:"#6d28d9",gl:null},{c:5,r:3,f:2,tw:.55,t:"#1d4ed8",gl:null},
      {c:3,r:5,f:2,tw:.55,t:"#be185d",gl:null},{c:5,r:5,f:3,tw:.6,t:"#047857",gl:null},
    ];

    const TRUCK_ROUTES = [
      {cells:[[1.5,4],[2.5,4],[3.5,4],[4,4]],col:"#a78bfa",p:0},
      {cells:[[6.5,4],[5.5,4],[4.5,4],[4,4]],col:"#60a5fa",p:.33},
      {cells:[[4,6.5],[4,5.5],[4,4.5],[4,4]],col:"#f472b6",p:.66},
      {cells:[[4,4],[4.8,4],[5.8,4],[6.5,4]],col:"#34d399",p:.15},
    ];

    const FORMATION = [
      {row:0,offset:0,   col:"#e0f2fe",sc:.9},
      {row:0,offset:.22, col:"#c7d2fe",sc:.85},
      {row:1,offset:.11, col:"#fce7f3",sc:.88},
      {row:1,offset:.38, col:"#ddd6fe",sc:.82},
      {row:2,offset:.55, col:"#d1fae5",sc:.86},
    ];
    const FORM_Y = [H*.11, H*.18, H*.25];

    function frame() {
      T++;
      drawBg();
      drawGround();

      for(let s=0;s<=GS*2-2;s++) {
        for(let c=0;c<GS;c++) {
          const r=s-c; if(r<0||r>=GS) continue;
          const k=`${c},${r}`;
          drawTile(c,r, RH.has(k)||RV.has(k));
        }
      }

      [...BLDS].sort((a,b)=>(a.c+a.r)-(b.c+b.r))
        .forEach(b=>drawBuilding(b.c,b.r,b.f,b.tw,b.t,b.gl));

      // Research TL
      [{c:1.25,r:1.7,ph:0},{c:1.7,r:2.3,ph:1.3}].forEach(p=>{
        const x=ix(p.c,p.r),y=iy(p.c,p.r)-4;
        person(x-9,y,"#c4b5fd",p.ph,.9); person(x+7,y,"#a78bfa",p.ph+.7,.82);
        floatFlask(x,y-44,p.ph); floatChart(x+22,y-36,p.ph+1,"#8b5cf6");
        floatCoin(x-18,y-50,p.ph+.6); floatCoin(x+10,y-56,p.ph+1.3);
      });
      // OEM TR
      [{c:6.25,r:1.7,ph:2},{c:6.7,r:2.3,ph:3.1}].forEach(p=>{
        const x=ix(p.c,p.r),y=iy(p.c,p.r)-4;
        person(x-9,y,"#93c5fd",p.ph,.9); person(x+7,y,"#60a5fa",p.ph+.8,.82);
        floatBox(x,y-42,p.ph,"#3b82f6"); floatChart(x+20,y-34,p.ph+2,"#2563eb");
        floatCoin(x-16,y-48,p.ph+.9); floatCoin(x+12,y-54,p.ph+1.8);
      });
      // SME BL
      [{c:1.25,r:6.2,ph:1},{c:1.7,r:7,ph:2.4}].forEach(p=>{
        const x=ix(p.c,p.r),y=iy(p.c,p.r)-4;
        person(x-9,y,"#f9a8d4",p.ph,.9); person(x+7,y,"#ec4899",p.ph+.9,.82);
        floatBox(x,y-42,p.ph,"#db2777"); floatChart(x+20,y-34,p.ph+2.8,"#be185d");
        floatCoin(x-16,y-48,p.ph+.5); floatCoin(x+12,y-54,p.ph+1.4); floatCoin(x-4,y-60,p.ph+2.1);
      });
      // Airport BR
      [{c:6.3,r:6.3,ph:3},{c:7,r:6.9,ph:.7}].forEach(p=>{
        const x=ix(p.c,p.r),y=iy(p.c,p.r)-4;
        person(x-7,y,"#6ee7b7",p.ph,.88); person(x+8,y,"#34d399",p.ph+1,.8);
        floatBox(x,y-40,p.ph,"#059669");
        floatCoin(x-14,y-46,p.ph+.4); floatCoin(x+10,y-50,p.ph+1.2);
      });

      // trucks
      TRUCK_ROUTES.forEach(tr=>{
        tr.p = (tr.p+.0025)%1;
        const rt=tr.cells, pos=tr.p*(rt.length-1);
        const seg=Math.min(Math.floor(pos),rt.length-2), frac=pos-seg;
        drawTruck(rt[seg][0]+(rt[seg+1][0]-rt[seg][0])*frac, rt[seg][1]+(rt[seg+1][1]-rt[seg][1])*frac, tr.col);
      });

      // center node
      const cx=ix(4,4), cy=iy(4,4);
      const cp=Math.sin(T*.06)*.15+.85;
      const cg2=g.createRadialGradient(cx,cy,0,cx,cy,26);
      cg2.addColorStop(0,"rgba(196,181,253,.32)"); cg2.addColorStop(1,"transparent");
      g.fillStyle=cg2; g.fillRect(cx-26,cy-26,52,52);
      g.beginPath(); g.arc(cx,cy,8,0,Math.PI*2); g.fillStyle=`rgba(196,181,253,${cp*.85})`; g.fill();
      g.beginPath(); g.arc(cx,cy,4,0,Math.PI*2); g.fillStyle="#a78bfa"; g.fill();

      // globes
      //[[W*.9,H*.09,1.1],[W*.08,H*.08,.9],[W*.5,H*.04,.85]].forEach(([x,y,s])=>drawGlobe(x,y,s));

      // formation planes
      FORMATION.forEach(pl=>{
        const speed=(pl.sc*.8+.5)*.8;
        const rawX=((T*speed*0.5)+(pl.offset*W*1.6))%(W*1.6)-W*.3;
        const y=FORM_Y[pl.row]+Math.sin(T*.03+pl.offset*10)*3;
        g.save(); g.globalAlpha=.35;
        g.strokeStyle=pl.col; g.lineWidth=.8; g.setLineDash([5,10]);
        g.beginPath(); g.moveTo(rawX-80,y); g.lineTo(rawX-10,y); g.stroke();
        g.setLineDash([]); g.restore();
        drawPlane(rawX,y,pl.col,pl.sc);
      });

      raf = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={cvRef}
      style={{ display:"block", width:"100%", height:"520px", borderRadius:16,background: "transparent" }}
    />
  );
}