import Image from "next/image";
import { findPhoto } from "@/lib/photos";

/** Mostra public/fotos/<slot>.* quando existir; senão, o `fallback` desenhado. */
export default function Photo({
  slot, alt, sizes, fallback, priority = false,
}: { slot: string; alt: string; sizes: string; fallback: React.ReactNode; priority?: boolean }) {
  const src = findPhoto(slot);
  if (!src) return <>{fallback}</>;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />;
}
