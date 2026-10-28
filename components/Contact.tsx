import { site, waLink } from "@/lib/site";
import { IconWhatsApp, IconPhone, IconInstagram } from "./Icons";

export default function Contact() {
  return (
    <section id="contato" className="relative isolate overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(214,179,110,0.16),transparent_70%)]" />
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow" data-reveal>Fale com a gente</p>
        <h2 className="font-display mt-5 text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]" data-reveal>
          Conte o que você <em className="metal metal-anim">procura</em>.
        </h2>
        <p className="mt-8 max-w-xl text-lg text-muted" data-reveal>Mande uma mensagem e a equipe responde com as opções, tira dúvidas e combina a retirada na loja.</p>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><IconWhatsApp className="h-5 w-5" /> Chamar no WhatsApp</a>
          {!site.whatsapp.confirmed && (
            <a href={`tel:${site.phone.tel}`} className="btn btn-ghost"><IconPhone className="h-5 w-5" /> Ligar {site.phone.display}</a>
          )}
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><IconInstagram className="h-5 w-5" /> Instagram</a>
        </div>
      </div>
    </section>
  );
}
