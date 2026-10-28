import { site, addressLine, mapsUrl } from "@/lib/site";
import { IconInstagram, IconFacebook } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-14 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="font-display text-4xl italic"><span className="metal">Nobilite</span> <span className="text-muted">Joias</span></p>
          <address className="mt-4 text-sm not-italic text-muted">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">{addressLine}</a><br />
            <a href={`tel:${site.phone.tel}`} className="hover:text-gold-light">{site.phone.display}</a>
          </address>
        </div>
        <div className="flex items-center gap-3">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Nobilite Joias" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold hover:text-gold-light"><IconInstagram /></a>
          <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Nobilite Joias" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold hover:text-gold-light"><IconFacebook /></a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-muted">© Nobilite Joias · Timbó, Santa Catarina</p>
    </footer>
  );
}
