"use client";

import { useEffect } from "react";

/** Revelação ao rolar + brilho que segue o ponteiro/dedo nos elementos [data-sheen]. */
export default function Interactions() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((i) => io.observe(i));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-sheen]");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (e.pointerType === "touch") t.classList.add("is-lit");
    };
    const end = (e: PointerEvent) => {
      (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-sheen]")?.classList.remove("is-lit");
    };
    if (!reduce) {
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerdown", move, { passive: true });
      document.addEventListener("pointerup", end);
      document.addEventListener("pointercancel", end);
    }
    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerup", end);
      document.removeEventListener("pointercancel", end);
    };
  }, []);
  return null;
}
