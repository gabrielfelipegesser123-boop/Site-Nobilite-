import { site, addressLine, mapsUrl } from "@/lib/site";
import Photo from "./Photo";
import JewelArt from "./JewelArt";
import Pending from "./Pending";
import { IconPin, IconPhone, IconArrow } from "./Icons";

export default function Store() {
  return (
    <section id="loja" className="px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow" data-reveal>A loja</p>
        <h2 className="font-display mt-5 max-w-3xl text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02]" data-reveal>
          No coração de Timbó, <em className="metal">de portas abertas</em> para você.
        </h2>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div data-reveal data-sheen className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-ink-3 to-ink-2 lg:col-span-7 lg:min-h-[460px]">
            <Photo
              slot="loja-fachada"
              alt="Fachada da loja Nobilite Joias, Rua Blumenau, Timbó"
              sizes="(min-width:1024px) 58vw, 92vw"
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <div aria-hidden className="absolute h-1/2 w-1/2 rounded-full bg-gold/10 blur-3xl" />
                  <p className="relative px-8 text-center font-display text-3xl italic text-white/25">Foto da fachada</p>
                </div>
              }
            />
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] border border-white/10 bg-ink-2 p-8 md:p-10 lg:col-span-5" data-reveal style={{ "--d": "120ms" } as React.CSSProperties}>
            <div className="space-y-8">
              <div className="flex gap-4">
                <IconPin className="mt-1 h-6 w-6 shrink-0 text-gold" />
                <div>
                  <h3 className="eyebrow">Endereço</h3>
                  <address className="mt-2 text-lg not-italic">{addressLine}</address>
                </div>
              </div>
              <div className="flex gap-4">
                <IconPhone className="mt-1 h-6 w-6 shrink-0 text-gold" />
                <div>
                  <h3 className="eyebrow">Telefone</h3>
                  <a href={`tel:${site.phone.tel}`} className="mt-2 block text-lg underline-offset-4 hover:underline">{site.phone.display}</a>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6">
                <h3 className="eyebrow">Horário</h3>
                <p className="mt-2 text-muted"><Pending>horário de funcionamento a confirmar</Pending></p>
              </div>
            </div>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold self-start">
              Abrir no Google Maps <IconArrow className="h-4 w-4" />
            </a>
          </div>

          <div data-reveal data-sheen className="relative hidden aspect-[16/6] overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-2 lg:col-span-12 lg:block">
            <Photo
              slot="loja-interior"
              alt="Interior da loja Nobilite Joias"
              sizes="92vw"
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <JewelArt kind="necklace" id="store" className="h-full opacity-40" />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
