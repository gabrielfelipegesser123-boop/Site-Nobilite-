import Gem from "./Gem";
import { IconArrow, IconWhatsApp } from "./Icons";
import { waLink } from "@/lib/site";

export default function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_35%,rgba(214,179,110,0.10),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(110,130,220,0.08),transparent_70%)]" />
      <div className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-2 px-5 pb-10 pt-24 md:px-10 lg:grid-cols-12 lg:gap-0 lg:pt-20">
        <div className="relative z-10 lg:col-span-7 lg:pr-6">
          <p className="eyebrow" data-reveal>Joalheria · Centro de Timbó, SC</p>
          <h1 className="font-display mt-6 text-[clamp(2.5rem,5.6vw,5.2rem)] font-normal leading-[0.98] tracking-[-0.01em]" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            Joias que guardam o <em className="metal metal-anim pr-2">brilho</em> dos seus melhores momentos.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted" data-reveal style={{ "--d": "260ms" } as React.CSSProperties}>
            Atendimento próximo, conversa direta e a joia certa para cada história. Venha conhecer a loja no Centro de Timbó ou fale com a gente.
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal style={{ "--d": "380ms" } as React.CSSProperties}>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <IconWhatsApp className="h-5 w-5" /> Falar pelo WhatsApp
            </a>
            <a href="#pecas" className="btn btn-ghost">Ver as peças <IconArrow className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <Gem className="mx-auto w-[min(88vw,520px)] lg:-mr-24 lg:w-[min(46vw,700px)]" />
        </div>
      </div>
      <div aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted md:flex">
        Role
        <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
