import fs from "node:fs";
import path from "node:path";

const EXT = ["jpg", "jpeg", "webp", "png", "avif"];

/**
 * Procura public/fotos/<slot>.<ext>. Basta soltar o arquivo com o nome certo
 * (ver public/fotos/LEIA-ME.md); nenhuma edição de código é necessária.
 */
export function findPhoto(slot: string): string | null {
  for (const ext of EXT) {
    if (fs.existsSync(path.join(process.cwd(), "public", "fotos", `${slot}.${ext}`))) {
      return `/fotos/${slot}.${ext}`;
    }
  }
  return null;
}
