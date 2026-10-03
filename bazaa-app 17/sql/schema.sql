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
drop policy if exists "public_read_products" on products;
create policy "public_read_products" on products for select using (is_active = true);

-- Hər kəs sifariş yarada bilər (checkout üçün), amma yalnız öz sifarişini oxumur — admin panel service_role ilə oxuyacaq
drop policy if exists "public_insert_orders" on orders;
create policy "public_insert_orders" on orders for insert with check (true);

-- site_settings hər kəsə açıq oxu üçün (hero video, mağaza adı və s göstərmək üçün)
drop policy if exists "public_read_settings" on site_settings;
create policy "public_read_settings" on site_settings for select using (true);

-- page_views hər kəs yaza bilər (trafik ölçmək üçün)
drop policy if exists "public_insert_pageviews" on page_views;
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

drop policy if exists "temp_admin_insert_products" on products;
create policy "temp_admin_insert_products" on products for insert with check (true);
drop policy if exists "temp_admin_update_products" on products;
create policy "temp_admin_update_products" on products for update using (true);
drop policy if exists "temp_admin_delete_products" on products;
create policy "temp_admin_delete_products" on products for delete using (true);
drop policy if exists "temp_admin_read_all_products" on products;
create policy "temp_admin_read_all_products" on products for select using (true);

drop policy if exists "temp_admin_read_orders" on orders;
create policy "temp_admin_read_orders" on orders for select using (true);
drop policy if exists "temp_admin_update_orders" on orders;
create policy "temp_admin_update_orders" on orders for update using (true);

drop policy if exists "temp_admin_update_settings" on site_settings;
create policy "temp_admin_update_settings" on site_settings for update using (true);

drop policy if exists "temp_admin_read_pageviews" on page_views;
create policy "temp_admin_read_pageviews" on page_views for select using (true);

-- ============================================
-- STORAGE (fayl yükləmə — video, şəkil) üçün bucket
-- ============================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public_upload_media" on storage.objects;
create policy "public_upload_media" on storage.objects for insert
  with check (bucket_id = 'media');

drop policy if exists "public_read_media" on storage.objects;
create policy "public_read_media" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "public_delete_media" on storage.objects;
create policy "public_delete_media" on storage.objects for delete
  using (bucket_id = 'media');

-- ============================================
-- KATEQORİYALAR — admin tərəfdən idarə olunan sistem
-- ============================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table products add column if not exists category_id uuid references categories(id) on delete set null;

alter table categories enable row level security;

drop policy if exists "public_read_categories" on categories;
create policy "public_read_categories" on categories for select using (true);
drop policy if exists "temp_admin_insert_categories" on categories;
create policy "temp_admin_insert_categories" on categories for insert with check (true);
drop policy if exists "temp_admin_update_categories" on categories;
create policy "temp_admin_update_categories" on categories for update using (true);
drop policy if exists "temp_admin_delete_categories" on categories;
create policy "temp_admin_delete_categories" on categories for delete using (true);

-- Başlanğıc nümunə kateqoriyalar (istəsən sil/dəyiş)
insert into categories (name, sort_order) values
  ('Ev', 1), ('Aksesuar', 2), ('Geyim', 3)
on conflict (name) do nothing;

-- ============================================
-- ƏLAVƏ MƏTN SAHƏLƏRİ (footer, section başlıqları — admin dəyişə bilsin)
-- ============================================
alter table site_settings add column if not exists footer_about text default 'Azərbaycanda etibarlı onlayn alış-veriş platforması.';
alter table site_settings add column if not exists featured_title text default 'Seçilmiş məhsullar';
alter table site_settings add column if not exists trust_title text default 'Niyə bizi seçməlisiniz';

-- ============================================
-- ƏLAVƏ: kateqoriya şəkli, banner, əlaqə/şərtlər mətnləri, rəylər
-- ============================================
alter table categories add column if not exists image_url text default '';

alter table site_settings add column if not exists banner_title text default '';
alter table site_settings add column if not exists banner_subtitle text default '';
alter table site_settings add column if not exists banner_image_url text default '';
alter table site_settings add column if not exists banner_button_text text default 'Kolleksiyaya bax';
alter table site_settings add column if not exists delivery_terms text default '';
alter table site_settings add column if not exists return_policy text default '';
alter table site_settings add column if not exists contact_info text default '';

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  location text default '',
  rating numeric(2,1) default 5,
  review_text text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table testimonials enable row level security;
drop policy if exists "public_read_testimonials" on testimonials;
create policy "public_read_testimonials" on testimonials for select using (true);
drop policy if exists "temp_admin_insert_testimonials" on testimonials;
create policy "temp_admin_insert_testimonials" on testimonials for insert with check (true);
drop policy if exists "temp_admin_update_testimonials" on testimonials;
create policy "temp_admin_update_testimonials" on testimonials for update using (true);
drop policy if exists "temp_admin_delete_testimonials" on testimonials;
create policy "temp_admin_delete_testimonials" on testimonials for delete using (true);

-- ============================================
-- MƏHSULA BİRDƏN ÇOX ŞƏKİL ƏLAVƏ ETMƏK ÜÇÜN
-- ============================================
alter table products add column if not exists images jsonb default '[]'::jsonb;

-- ============================================
-- DİZAYN RƏNGLƏRİ (admin paneldən dəyişdirilə bilən)
-- ============================================
alter table site_settings add column if not exists color_brand text default '#2954E8';
alter table site_settings add column if not exists color_bg text default '#FFFFFF';
alter table site_settings add column if not exists color_ink text default '#111318';

-- ============================================
-- SƏRBƏST BÖLMƏLƏR (admin öz section-larını əlavə edə bilsin)
-- ============================================
create table if not exists custom_sections (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  body text default '',
  image_url text default '',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table custom_sections enable row level security;
drop policy if exists "public_read_custom_sections" on custom_sections;
create policy "public_read_custom_sections" on custom_sections for select using (is_active = true);
drop policy if exists "temp_admin_read_all_custom_sections" on custom_sections;
create policy "temp_admin_read_all_custom_sections" on custom_sections for select using (true);
drop policy if exists "temp_admin_insert_custom_sections" on custom_sections;
create policy "temp_admin_insert_custom_sections" on custom_sections for insert with check (true);
drop policy if exists "temp_admin_update_custom_sections" on custom_sections;
create policy "temp_admin_update_custom_sections" on custom_sections for update using (true);
drop policy if exists "temp_admin_delete_custom_sections" on custom_sections;
create policy "temp_admin_delete_custom_sections" on custom_sections for delete using (true);

-- ============================================
-- Payriff-in öz order ID-sini (UUID) ayrıca saxlamaq üçün
-- ============================================
alter table orders add column if not exists payriff_order_id text;
