-- ============================================================
-- Soft Rituals STORE — owner-panel setup
-- Run AFTER store_schema.sql + store_seed.sql.
-- Adds: categories table (so Samira can add sections) and a
-- public image bucket (so she can upload photos from her phone).
-- Safe to run more than once.
-- ============================================================

-- 1) CATEGORIES — the "sections" of the shop. Public read.
create table if not exists public.store_categories (
  slug       text primary key,
  name       text not null,
  blurb      text not null default '',
  sort       integer not null default 100,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.store_categories enable row level security;

drop policy if exists "store categories are public" on public.store_categories;
create policy "store categories are public"
  on public.store_categories for select
  using (true);

insert into public.store_categories (slug, name, blurb, sort) values
  ('candles',         'Candles',         'Sculpted by hand, poured one at a time.', 10),
  ('dessert-candles', 'Dessert Candles', 'They look delicious. They are wax.',      20),
  ('gift-boxes',      'Gift Boxes',      'Wrapped, tagged and ready to give.',      30),
  ('soaps',           'Soaps',           'Gentle on skin, made in small batches.',  40)
on conflict (slug) do nothing;

-- 2) IMAGE BUCKET — public so the shop can show photos; uploads
--    happen server-side with the service-role key (owner panel).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow anyone to READ images in this bucket (it is a public shop).
drop policy if exists "product images are public" on storage.objects;
create policy "product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');
