import { site } from "@/lib/site";
import Photo from "./Photo";
import JewelArt, { type ArtKind } from "./JewelArt";
import { IconInstagram, IconArrow } from "./Icons";

const arts: ArtKind[] = ["ring", "gem", "earrings", "bracelet", "necklace", "gem"];

export default function Instagram() {
  return (
    <section id="instagram" className="border-y border-white/10 bg-ink-2 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow" data-reveal>Instagram</p>
            <h2 className="font-display mt-5 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02]" data-reveal>
              Novidades <em className="metal">em primeira mão</em>.
            </h2>
            <p className="mt-5 max-w-lg text-muted" data-reveal>Acompanhe as peças, os bastidores e os reels da Nobilite no perfil {site.social.instagramHandle}.</p>
          </div>
          <div className="flex flex-wrap gap-3" data-reveal>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><IconInstagram className="h-5 w-5" /> Seguir no Instagram</a>
            <a href={site.social.instagramReels} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ver os reels <IconArrow className="h-4 w-4" /></a>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-6">
          {arts.map((a, i) => (
            <li key={i} data-reveal style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Ver publicação ${i + 1} no Instagram da Nobilite`}
                data-sheen className="relative block aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-3 to-ink">
                <Photo
                  slot={`insta-${i + 1}`}
                  alt={`Publicação ${i + 1} do Instagram da Nobilite Joias`}
                  sizes="(min-width:1024px) 15vw, (min-width:768px) 30vw, 46vw"
                  fallback={<div className="absolute inset-0 grid place-items-center p-5"><JewelArt kind={a} id={`ig${i}`} className="h-full opacity-80" /></div>}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
