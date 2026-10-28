"use client";

import { useEffect, useRef } from "react";

type V = [number, number];
type Facet = { pts: V[]; tilt: number; phi: number; cx: number; cy: number };

const pol = (r: number, deg: number): V => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * r, Math.sin(a) * r];
};

/** Lapidação brilhante vista de cima: mesa + 8 estrelas + 8 losangos + 16 triângulos de cintura. */
function buildFacets(): Facet[] {
  const G = Array.from({ length: 16 }, (_, j) => pol(1, j * 22.5));
  const T = Array.from({ length: 8 }, (_, i) => pol(0.54, i * 45 + 22.5));
  const M = Array.from({ length: 8 }, (_, i) => pol(0.8, i * 45));
  const raw: { pts: V[]; tilt: number }[] = [{ pts: T, tilt: 0.02 }];
  for (let i = 0; i < 8; i++) {
    const n = (i + 1) % 8;
    raw.push({ pts: [T[i], T[n], M[n]], tilt: 0.34 });
    raw.push({ pts: [T[i], M[i], G[(2 * i + 1) % 16], M[n]], tilt: 0.6 });
    raw.push({ pts: [M[i], G[(2 * i + 15) % 16], G[(2 * i) % 16]], tilt: 0.92 });
    raw.push({ pts: [M[i], G[(2 * i) % 16], G[(2 * i + 1) % 16]], tilt: 0.92 });
  }
  return raw.map((f) => {
    const cx = f.pts.reduce((s, p) => s + p[0], 0) / f.pts.length;
    const cy = f.pts.reduce((s, p) => s + p[1], 0) / f.pts.length;
    return { ...f, cx, cy, phi: Math.atan2(cy, cx) };
  });
}

const FACETS = buildFacets();
// luzes: direção (x,y,z), cor RGB, dureza do brilho
const LIGHTS: { d: [number, number, number]; c: [number, number, number]; p: number }[] = [
  { d: [-0.55, -0.45, 0.7], c: [255, 238, 205], p: 7 }, // quente
  { d: [0.6, 0.35, 0.72], c: [150, 185, 255], p: 7 }, // fria
  { d: [0.05, 0.7, 0.7], c: [255, 255, 255], p: 14 }, // branca, dura
];

const norm = (v: number[]) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

export default function Gem({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const box = wrap.current!;
    const ctx = el.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lights = LIGHTS.map((l) => ({ ...l, d: norm(l.d) }));

    let size = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let tx = 0, ty = 0; // alvo da inclinação (-1..1)
    let cxs = 0, cys = 0; // inclinação suavizada
    let scrollK = 0;
    const t0 = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = box.clientWidth;
      el.width = Math.round(size * dpr);
      el.height = Math.round(size * dpr);
      el.style.height = size + "px";
      draw(reduce ? 0 : (performance.now() - t0) / 1000);
    }

    function draw(t: number) {
      const R = size * 0.4;
      const c = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // halo
      const halo = ctx.createRadialGradient(c, c, R * 0.2, c, c, R * 1.55);
      halo.addColorStop(0, "rgba(214,179,110,0.22)");
      halo.addColorStop(0.5, "rgba(120,140,220,0.07)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      const spin = t * 0.22 + scrollK * 2.2;
      const ax = cys * 0.55 + Math.sin(t * 0.5) * 0.06;
      const ay = cxs * 0.55 + Math.cos(t * 0.4) * 0.06;
      const glints: { x: number; y: number; k: number }[] = [];

      for (const f of FACETS) {
        const phi = f.phi + spin;
        const s = Math.sin(f.tilt);
        // normal da faceta, girando a pedra em torno do eixo vertical
        let n = [Math.cos(phi) * s, Math.sin(phi) * s, Math.cos(f.tilt)];
        // inclinação por ponteiro/rolagem (rotação em x e y)
        n = [n[0] + ay * n[2], n[1] - ax * n[2], n[2] - ay * n[0] + ax * n[1]];
        n = norm(n);
        const ndv = n[2];
        // reflexo do observador (0,0,1)
        const r = [2 * ndv * n[0], 2 * ndv * n[1], 2 * ndv * n[2] - 1];
        let R_ = 16, G_ = 18, B_ = 28;
        let peak = 0;
        for (const L of lights) {
          const d = Math.max(0, r[0] * L.d[0] + r[1] * L.d[1] + r[2] * L.d[2]);
          const k = Math.pow(d, L.p);
          peak = Math.max(peak, k);
          R_ += L.c[0] * k * 0.78;
          G_ += L.c[1] * k * 0.78;
          B_ += L.c[2] * k * 0.78;
        }
        // brilho de base por facetas (profundidade)
        const base = Math.max(0, n[0] * -0.35 + n[1] * -0.55 + n[2] * 0.2) + 0.04 * Math.sin(f.phi * 3 + spin);
        R_ += 150 * base; G_ += 158 * base; B_ += 178 * base;

        ctx.beginPath();
        f.pts.forEach((p, i) => {
          const x = c + p[0] * R, y = c + p[1] * R;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = `rgb(${Math.min(255, R_) | 0},${Math.min(255, G_) | 0},${Math.min(255, B_) | 0})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255,248,230,${0.1 + peak * 0.35})`;
        ctx.stroke();
        if (peak > 0.72) glints.push({ x: c + f.cx * R, y: c + f.cy * R, k: peak });
      }

      // contorno da pedra
      ctx.beginPath();
      for (let j = 0; j < 16; j++) {
        const p = pol(1, j * 22.5);
        const x = c + p[0] * R, y = c + p[1] * R;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(244,230,189,0.55)";
      ctx.stroke();

      // cintilações
      ctx.globalCompositeOperation = "lighter";
      for (const g of glints.slice(0, 5)) {
        const len = R * 0.13 * g.k;
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, len);
        grad.addColorStop(0, `rgba(255,250,235,${0.55 * g.k})`);
        grad.addColorStop(1, "rgba(255,250,235,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(g.x, g.y, len, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(255,248,225,${0.65 * g.k})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(g.x - len * 2.2, g.y); ctx.lineTo(g.x + len * 2.2, g.y);
        ctx.moveTo(g.x, g.y - len * 2.2); ctx.lineTo(g.x, g.y + len * 2.2);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function frame(now: number) {
      cxs += (tx - cxs) * 0.07;
      cys += (ty - cys) * 0.07;
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      tx = Math.max(-1.4, Math.min(1.4, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1.4, Math.min(1.4, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };
    const onScroll = () => { scrollK = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 3); };
    const onVis = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(box);
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVis);
      start();
    }
    return () => {
      stop(); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrap} className={className}>
      <canvas
        ref={canvas}
        role="img"
        aria-label="Pedra lapidada que reflete a luz conforme você move o cursor ou rola a página"
        className="block w-full touch-pan-y"
      />
    </div>
  );
}
