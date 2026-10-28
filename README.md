# Nobilite Joias

Site da Nobilite Joias, joalheria na Rua Blumenau, 54, Centro de Timbó (SC).

- **Vitrine** (`index.html`): coleções, catálogo com filtro, ficha de cada peça com pedido pelo WhatsApp, serviços, guia de quilates, endereço e redes sociais.
- **Galeria**: fotos reais da loja, gerenciadas no painel (envio de várias de uma vez, legenda, ordem, ocultar e excluir). A seção só aparece no site quando há fotos.
- **Área do lojista** (`admin.html`): login, cadastro de peças com foto, ocultar/mostrar, destaques, exclusão, fotos da loja, número do WhatsApp e faixa de aviso.

É um site estático (HTML, CSS e JavaScript, sem build). Os dados ficam no [Supabase](https://supabase.com) (plano gratuito atende).

## Modo demonstração

Sem nada configurado em `config.js`, o site já funciona com peças de exemplo, e o painel aceita a senha `nobilite`, mas o que for editado fica salvo só no navegador de quem editou. Serve para mostrar ao cliente antes de ligar o banco.

## Colocar no ar com o banco de dados

1. Crie um projeto no Supabase.
2. Em **SQL Editor**, cole e rode todo o arquivo [`supabase/schema.sql`](supabase/schema.sql). Ele cria as tabelas, as regras de acesso, o espaço das fotos e quatro peças de exemplo.
3. Em **Authentication → Users**, clique em **Add user** e crie o usuário da loja (e-mail e senha). Depois, em **Authentication → Sign In / Providers**, desligue **Allow new users to sign up**, para ninguém mais conseguir criar conta.
4. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public** e cole em `config.js`. A chave anon pode ficar pública: quem protege os dados são as regras do `schema.sql`.
5. Publique o site (veja abaixo).

## Publicar na Vercel

1. Entre em [vercel.com](https://vercel.com) com a conta do GitHub.
2. **Add New → Project**, escolha o repositório `Site-Nobilite-` e clique em **Import**.
3. Em **Framework Preset**, deixe **Other**. Não precisa de Build Command nem Output Directory.
4. Clique em **Deploy**. O site fica em `https://<nome-do-projeto>.vercel.app`, e cada push na `main` publica de novo sozinho.
5. Para usar um domínio próprio (ex.: `nobilitejoias.com.br`): **Settings → Domains** no projeto da Vercel.

O painel fica em `/admin` (o link "Área do lojista" está no rodapé). O `vercel.json` tira o `.html` dos endereços e pede aos buscadores para não indexar o painel.

## Estrutura

```
index.html            vitrine pública
admin.html            área do lojista
config.js             chaves do Supabase (vazio = modo demonstração)
assets/css/style.css  visual do site e do painel
assets/js/store.js    acesso aos dados (Supabase ou demonstração)
assets/js/site.js     vitrine, filtros, ficha da peça, WhatsApp
assets/js/ring.js     animação do anel no topo
assets/js/admin.js    painel do lojista
supabase/schema.sql   banco de dados, permissões e fotos
```

## Contato da loja

- WhatsApp: (47) 3382-9961
- Instagram: [@nobilite_joias](https://www.instagram.com/nobilite_joias/)
- Facebook: [Nobilite Joias](https://www.facebook.com/p/Nobilite-Joias-100063486401430/)
