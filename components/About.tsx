import Photo from "./Photo";
import JewelArt from "./JewelArt";
import Pending from "./Pending";

const pillars = [
  { t: "Na loja, em Timbó", d: "Atendimento presencial no Centro: ver, provar e escolher com calma." },
  { t: "Pelas redes e contato direto", d: "Instagram, WhatsApp e telefone para tirar dúvidas e combinar sem pressa." },
  { t: "Do seu jeito", d: "Conversa sobre o que você procura, para o presente ou para você." },
];

export default function About() {
  return (
    <section id="nobilite" className="on-light px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#161922] to-[#0a0b0f]" data-sheen>
            <Photo
              slot="atendimento"
              alt="Atendimento na loja da Nobilite Joias"
              sizes="(min-width:1024px) 40vw, 90vw"
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <div aria-hidden className="absolute h-2/3 w-2/3 rounded-full bg-gold/15 blur-3xl" />
                  <JewelArt kind="gem" id="about" className="relative h-4/5" />
                </div>
              }
            />
          </div>
        </div>
        <div className="lg:col-span-7 lg:pt-10">
          <p className="eyebrow" data-reveal>A Nobilite</p>
          <h2 className="font-display mt-5 text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.05]" data-reveal>
            Uma joia é sempre <em>a lembrança de alguém</em>.
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-[#3b3f4b]" data-reveal>
            <Pending>História da Nobilite: quem começou, desde quando, o que a loja valoriza. Texto a ser fornecido pelo cliente.</Pending>
          </p>
          <dl className="mt-14 grid gap-8 border-t border-black/15 pt-10 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <div key={p.t} data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                <dt className="font-display text-xl italic text-[#6b4f1c]">{p.t}</dt>
                <dd className="mt-2 text-[0.95rem] text-[#3b3f4b]">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
