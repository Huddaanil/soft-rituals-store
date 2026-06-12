-- ============================================================
-- Soft Rituals STORE — database structure
-- Separate tables from the team app (businesses/members/records
-- are untouched). Safe to run as-is.
--
-- How to run: Supabase dashboard -> SQL Editor -> New query
--             -> paste this whole file -> Run.
-- Then paste supabase/store_seed.sql the same way.
-- ============================================================

-- 1) PRODUCTS — the public catalog. Anyone may read; only the
--    dashboard (service role) writes.
create table if not exists public.store_products (
  slug            text primary key,
  name            text not null,
  category        text not null,
  price           integer not null,           -- MZN
  image           text not null,
  alt             text not null default '',
  short           text not null default '',
  story           jsonb not null default '[]',
  notes           jsonb not null default '[]',
  featured        boolean not null default false,
  seo_title       text not null default '',
  seo_description text not null default '',
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.store_products enable row level security;

drop policy if exists "store products are public" on public.store_products;
create policy "store products are public"
  on public.store_products for select
  using (true);

-- 2) ORDERS — anyone may place one; nobody may read them back
--    through the public key (Samira reads them in the dashboard).
create table if not exists public.store_orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  customer_name  text not null,
  phone          text not null,
  email          text,
  delivery_area  text,
  note           text,
  items          jsonb not null,              -- [{slug, name, price, qty}]
  total_mzn      integer not null,
  payment_method text not null default 'pay_on_delivery',
  status         text not null default 'new',
  created_at     timestamptz not null default now()
);

alter table public.store_orders enable row level security;

drop policy if exists "anyone can place an order" on public.store_orders;
create policy "anyone can place an order"
  on public.store_orders for insert
  with check (true);
-- (no select policy on purpose: orders are write-only from the website)
