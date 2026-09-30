-- ============================================
-- BAZAA MAĞAZA — Supabase SQL Schema
-- Bunu Supabase Dashboard -> SQL Editor-də çalışdır
-- ============================================

-- 1. MƏHSULLAR
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  image_url text default '',
  video_url text default '',              -- video/animasiya linki (opsional)
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2) default 0,       -- 0 = endirim yoxdur
  category text default 'Digər',
  stock integer default 0,
  rating numeric(2,1) default 4.8,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SİFARİŞLƏR (ayrı cədvəl)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,                     -- [{product_id, name, qty, unit_price}]
  total numeric(10,2) not null,
  payment_method text not null,             -- 'card' | 'cash'
  status text not null default 'pending',   -- pending | paid | shipped | delivered | cancelled
  payriff_transaction_id text,              -- Payriff/GoldenPay-dən gələn əməliyyat ID-si
  whatsapp_notified boolean default false,  -- WhatsApp bildirişi göndərilibmi
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. SAYT TƏNZİMLƏMƏLƏRİ (ümumi, client-safe)
create table if not exists site_settings (
  id int primary key default 1,
  store_name text default 'BAZAA',
  hero_video_url text default '',           -- əsas menyuda video/animasiya
  hero_title text default '',
  hero_subtitle text default '',
  constraint single_row check (id = 1)
);

-- 4. ÖDƏNİŞ TƏNZİMLƏMƏLƏRİ (yalnız server oxuyur — RLS ilə qorunur)
create table if not exists payment_settings (
  id int primary key default 1,
  provider text default 'payriff',          -- 'payriff' | 'goldenpay'
  merchant_id text default '',
  api_key text default '',                  -- GİZLİ — yalnız server-side function oxumalıdır
  bank_name text default '',
  iban text default '',
  account_name text default '',
  pay_note text default '',
  constraint single_row_pay check (id = 1)
);

-- 5. WHATSAPP (GREEN-API) TƏNZİMLƏMƏLƏRİ (gizli, server-side)
create table if not exists whatsapp_settings (
  id int primary key default 1,
  instance_id text default '',              -- GİZLİ
  api_token text default '',                -- GİZLİ
  notify_phone text default '',             -- sənin WhatsApp nömrən (bildiriş buraya gedir)
  constraint single_row_wa check (id = 1)
);

-- 6. TRAFİK STATİSTİKASI (sadə page-view sayğacı)
create table if not exists page_views (
  id bigserial primary key,
  path text not null,
  viewed_at timestamptz default now()
);

-- Başlanğıc sətirlər
insert into site_settings (id, store_name) values (1, 'BAZAA') on conflict (id) do nothing;
insert into payment_settings (id, provider) values (1, 'payriff') on conflict (id) do nothing;
insert into whatsapp_settings (id) values (1) on conflict (id) do nothing;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table products enable row level security;
alter table orders enable row level security;
alter table site_settings enable row level security;
alter table payment_settings enable row level security;
alter table whatsapp_settings enable row level security;
alter table page_views enable row level security;

-- Hər kəs aktiv məhsulları oxuya bilər (mağaza üçün)
create policy "public_read_products" on products for select using (is_active = true);

-- Hər kəs sifariş yarada bilər (checkout üçün), amma yalnız öz sifarişini oxumur — admin panel service_role ilə oxuyacaq
create policy "public_insert_orders" on orders for insert with check (true);

-- site_settings hər kəsə açıq oxu üçün (hero video, mağaza adı və s göstərmək üçün)
create policy "public_read_settings" on site_settings for select using (true);

-- page_views hər kəs yaza bilər (trafik ölçmək üçün)
create policy "public_insert_pageviews" on page_views for insert with check (true);

-- payment_settings və whatsapp_settings: HEÇ BİR public policy YOXDUR —
-- yalnız service_role key (server-side function) bunlara çata bilər. Bu, açarların qorunması üçündür.

-- ============================================
-- ⚠️ MÜVƏQQƏTİ ADMIN POLİTİKALARI — TƏHLÜKƏSİZLİK XƏBƏRDARLIĞI ⚠️
-- ============================================
-- Aşağıdakı policy-lər admin panelin (parol-qorunmalı, amma Supabase Auth OLMAYAN)
-- birbaşa anon key ilə məhsul/sifariş idarə etməsinə icazə verir.
-- Bu, YALNIZ tez başlanğıc üçündür — admin panelin linkini/parolunu heç kimlə paylaşma.
--
-- REAL, TƏHLÜKƏSİZ LAYİHƏ ÜÇÜN TÖVSİYƏ:
-- Supabase Auth ilə özünə admin istifadəçi yarat, bu policy-ləri
-- "using (auth.uid() = 'sənin-admin-user-id-n')" şəklində məhdudlaşdır.
-- ============================================

create policy "temp_admin_insert_products" on products for insert with check (true);
create policy "temp_admin_update_products" on products for update using (true);
create policy "temp_admin_delete_products" on products for delete using (true);
create policy "temp_admin_read_all_products" on products for select using (true);

create policy "temp_admin_read_orders" on orders for select using (true);
create policy "temp_admin_update_orders" on orders for update using (true);

create policy "temp_admin_update_settings" on site_settings for update using (true);

create policy "temp_admin_read_pageviews" on page_views for select using (true);
