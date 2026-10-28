-- Nobilite Joias: banco de dados do site (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists public.produtos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  categoria   text not null default 'aneis'
              check (categoria in ('aliancas','aneis','colares','brincos','pulseiras')),
  metal       text,
  detalhes    text,
  peso        text,
  preco       text,           -- vazio = "sob consulta"
  descricao   text,
  destaque    boolean not null default false,
  ativo       boolean not null default true,
  foto_url    text,
  criado_em   timestamptz not null default now()
);

create table if not exists public.configuracoes (
  id        int primary key default 1 check (id = 1),
  whatsapp  text not null default '554733829961',
  telefone  text not null default '(47) 3382-9961',
  aviso     text default 'Alianças sob medida com gravação inclusa. Fale com a gente pelo WhatsApp.'
);
insert into public.configuracoes (id) values (1) on conflict (id) do nothing;

alter table public.produtos enable row level security;
alter table public.configuracoes enable row level security;

-- Visitantes veem só peças ativas; o lojista (usuário logado) vê e edita tudo.
drop policy if exists "vitrine publica" on public.produtos;
create policy "vitrine publica" on public.produtos for select using (ativo or auth.role() = 'authenticated');
drop policy if exists "lojista edita" on public.produtos;
create policy "lojista edita" on public.produtos for all to authenticated using (true) with check (true);

drop policy if exists "config publica" on public.configuracoes;
create policy "config publica" on public.configuracoes for select using (true);
drop policy if exists "lojista edita config" on public.configuracoes;
create policy "lojista edita config" on public.configuracoes for update to authenticated using (true) with check (true);

-- Fotos das peças
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
drop policy if exists "fotos publicas" on storage.objects;
create policy "fotos publicas" on storage.objects for select using (bucket_id = 'fotos');
drop policy if exists "lojista envia fotos" on storage.objects;
create policy "lojista envia fotos" on storage.objects for insert to authenticated with check (bucket_id = 'fotos');
drop policy if exists "lojista apaga fotos" on storage.objects;
create policy "lojista apaga fotos" on storage.objects for delete to authenticated using (bucket_id = 'fotos');

-- Galeria de fotos da loja (seção "Galeria" do site)
create table if not exists public.galeria (
  id         uuid primary key default gen_random_uuid(),
  foto_url   text not null,
  legenda    text default '',
  ordem      int  not null default 0,
  ativo      boolean not null default true,
  criado_em  timestamptz not null default now()
);
alter table public.galeria enable row level security;
drop policy if exists "galeria publica" on public.galeria;
create policy "galeria publica" on public.galeria for select using (ativo or auth.role() = 'authenticated');
drop policy if exists "lojista edita galeria" on public.galeria;
create policy "lojista edita galeria" on public.galeria for all to authenticated using (true) with check (true);

-- Peças de exemplo (apague ou edite pelo painel depois)
insert into public.produtos (nome, categoria, metal, detalhes, peso, descricao, destaque)
select * from (values
  ('Aliança Clássica Timbó','aliancas','Ouro 18k (750)','Par · 4 mm · anatômica','8,0 g o par','Perfil anatômico, acabamento polido e gravação interna inclusa.',true),
  ('Solitário Aurora','aneis','Ouro 18k (750)','Zircônia 5 mm · 6 garras','2,4 g','O anel de noivado clássico, com garras altas que deixam a luz entrar pela pedra.',true),
  ('Colar Ponto de Luz','colares','Ouro 18k (750)','Corrente 45 cm · zircônia 4 mm','1,9 g','Uma pedra só, presa na corrente veneziana. Discreto para usar todo dia.',false),
  ('Brinco Gota de Pérola','brincos','Prata 925','Pérola shell 8 mm','3,1 g o par','Pérola em gota sobre base de prata com banho de ródio.',true)
) as v(nome, categoria, metal, detalhes, peso, descricao, destaque)
where not exists (select 1 from public.produtos);
