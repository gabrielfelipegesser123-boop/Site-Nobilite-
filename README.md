# Nobilite Joias

Site vitrine da Nobilite Joias, joalheria na Rua Blumenau, 54, Centro de Timbó (SC). Next.js 16 + Tailwind 4, sem checkout: o pedido continua pelo WhatsApp e na loja.

## Rodar

```
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Onde editar

- `lib/site.ts`: telefone, WhatsApp (`whatsapp.number` e `confirmed`), endereço, redes e categorias. Trocar o número em um só lugar.
- `public/fotos/`: solte as fotos com os nomes de `public/fotos/LEIA-ME.md` e o site as usa sozinho.
- Textos provisórios aparecem entre colchetes (componente `Pending`) até o cliente confirmar.

## Deploy (Vercel)

Framework: Next.js (padrão). Defina `NEXT_PUBLIC_SITE_URL` com o domínio final para o Open Graph e o sitemap.

O site estático anterior (HTML + painel Supabase) está no histórico, commit `8bcf6a5`.
