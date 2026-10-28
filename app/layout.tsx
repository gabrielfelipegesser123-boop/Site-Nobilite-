import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site, addressLine } from "@/lib/site";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Nobilite Joias | Joalheria em Timbó, SC",
  description: site.description,
  alternates: { canonical: "/" },
  keywords: ["joalheria em Timbó", "joias Timbó SC", "Nobilite Joias", "joias Vale do Itajaí", "anéis, brincos, colares e pulseiras"],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: "Nobilite Joias | Joalheria em Timbó, SC",
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: "Nobilite Joias | Joalheria em Timbó, SC", description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Campos sem confirmação (horário, CEP, geo, faixa de preço, avaliações) ficam de fora de propósito.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: site.name,
  url: site.url,
  description: site.description,
  telephone: site.phone.tel,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: site.address.country,
  },
  areaServed: [{ "@type": "City", name: "Timbó" }],
  sameAs: [site.social.instagram, site.social.facebook],
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
