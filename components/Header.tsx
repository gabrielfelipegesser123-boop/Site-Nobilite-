"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";
import { IconWhatsApp } from "./Icons";

const links = [
  { href: "#pecas", label: "Peças" },
  { href: "#nobilite", label: "A Nobilite" },
  { href: "#loja", label: "A loja" },
  { href: "#instagram", label: "Instagram" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? "bg-ink/85 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#topo" className="font-display text-2xl italic tracking-wide md:text-[1.7rem]" aria-label="Nobilite Joias, início">
          <span className="metal">Nobilite</span>
        </a>
        <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm tracking-wide text-muted transition-colors hover:text-gold-light">{l.label}</a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 !px-5 !text-[0.8rem]">
            <IconWhatsApp className="h-4 w-4" /> WhatsApp
          </a>
        </nav>
        <button
          type="button"
          className="relative grid h-11 w-11 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`absolute h-px w-6 bg-pearl transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-pearl transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>
      <div id="menu-mobile" hidden={!open} className="border-t border-white/10 bg-ink/95 px-5 pb-8 pt-4 md:hidden">
        <nav aria-label="Principal (celular)" className="flex flex-col">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-display border-b border-white/10 py-4 text-2xl italic">{l.label}</a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-6"><IconWhatsApp className="h-5 w-5" /> Falar no WhatsApp</a>
        </nav>
      </div>
    </header>
  );
}
