import { categories, waLink } from "@/lib/site";
import JewelArt from "./JewelArt";
import Photo from "./Photo";
import Pending from "./Pending";
import { IconArrow } from "./Icons";

export default function Pieces() {
  return (
    <section id="pecas" className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow" data-reveal>As peças</p>
            <h2 className="font-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02]" data-reveal>
              Para cada ocasião,<br /><em className="metal">uma joia</em>.
            </h2>
          </div>
          <p className="text-muted md:col-span-4 md:col-start-9" data-reveal>
            Escolha uma categoria e pergunte direto pelo WhatsApp: a equipe mostra o que há disponível.{" "}
            <Pending>categorias ilustrativas, a confirmar com a Nobilite</Pending>
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <li key={c.slug} data-reveal style={{ "--d": `${i * 110}ms`, marginTop: undefined } as React.CSSProperties} className={i % 2 ? "lg:mt-16" : ""}>
              <a
                href={waLink(`Olá! Gostaria de ver ${c.name.toLowerCase()} da Nobilite Joias.`)}
                target="_blank" rel="noopener noreferrer"
                className="group block"
                aria-label={`${c.name}: perguntar pelo WhatsApp`}
              >
                <div data-sheen className="relative aspect-[4/5] rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-ink-3 to-ink-2 transition-transform duration-500 group-hover:-translate-y-1.5">
                  <Photo
                    slot={`pecas-${c.slug}`}
                    alt={`${c.name} da Nobilite Joias`}
                    sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw"
                    fallback={
                      <div className="absolute inset-0 grid place-items-center p-8">
                        <div aria-hidden className="absolute inset-x-8 bottom-6 h-24 rounded-full bg-gold/10 blur-3xl" />
                        <JewelArt kind={c.art} id={c.slug} className="relative h-full w-full max-w-[220px] transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    }
                  />
                  <span className="absolute left-5 top-4 z-[2] font-display text-sm italic text-gold">0{i + 1}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted">{c.line}</p>
                  </div>
                  <IconArrow className="mt-2 h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
