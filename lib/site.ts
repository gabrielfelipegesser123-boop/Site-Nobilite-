/**
 * Fonte única de verdade dos dados da Nobilite Joias.
 * Para trocar o WhatsApp, edite SOMENTE `whatsapp.number` (e `confirmed` quando validado).
 */
export const site = {
  name: "Nobilite Joias",
  // Defina NEXT_PUBLIC_SITE_URL no deploy (ex.: https://www.dominio.com.br)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt_BR",
  description:
    "Nobilite Joias, joalheria no Centro de Timbó, Santa Catarina. Conheça as peças, visite a loja na Rua Blumenau ou fale diretamente com a equipe.",

  phone: {
    display: "(47) 3382-9961",
    tel: "+554733829961",
  },

  /**
   * [A CONFIRMAR] (47) 3382-9961 é formato de telefone fixo. Enquanto `confirmed`
   * for false, o site também oferece "Ligar" ao lado do botão de WhatsApp.
   * Formato do número: DDI+DDD+número, só dígitos (ex.: 5547999999999).
   */
  whatsapp: {
    number: "554733829961",
    confirmed: false,
    defaultMessage:
      "Olá! Vim pelo site da Nobilite Joias e gostaria de saber mais sobre as peças.",
  },

  address: {
    street: "Rua Blumenau, 54",
    district: "Centro",
    city: "Timbó",
    state: "SC",
    country: "BR",
    // CEP não informado: não incluir até confirmar.
  },

  social: {
    instagram: "https://www.instagram.com/nobilite_joias/",
    instagramReels: "https://www.instagram.com/nobilite_joias/reels/",
    instagramHandle: "@nobilite_joias",
    facebook: "https://www.facebook.com/p/Nobilite-Joias-100063486401430/",
  },
} as const;

export const addressLine = `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.address.street}, ${site.address.city} - ${site.address.state}`,
)}`;

export function waLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/** Categorias [PROVISÓRIAS: a confirmar com a Nobilite]. */
export const categories = [
  { slug: "aneis", name: "Anéis", art: "ring", line: "Para o dia a dia e para as datas que ficam." },
  { slug: "brincos", name: "Brincos", art: "earrings", line: "Do discreto ao que chama o olhar." },
  { slug: "colares", name: "Colares e pingentes", art: "necklace", line: "Para usar perto, para guardar por perto." },
  { slug: "pulseiras", name: "Pulseiras", art: "bracelet", line: "O detalhe que fecha o look." },
] as const;
