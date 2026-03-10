-- ════════════════════════════════════════════════════════════════
-- MasaAz  —  SUPABASE SQL v2  (təmiz versiya)
-- ════════════════════════════════════════════════════════════════

-- ── 0. Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. Cədvəl yenilikləri ─────────────────────────────────────
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS booking_code text;

ALTER TABLE restaurants  ADD COLUMN IF NOT EXISTS slug        text unique;
ALTER TABLE restaurants  ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE restaurants  ADD COLUMN IF NOT EXISTS cover_url   text;
ALTER TABLE restaurants  ADD COLUMN IF NOT EXISTS phone       text;
ALTER TABLE restaurants  ADD COLUMN IF NOT EXISTS hours       text;

-- Mövcud restoranlar üçün slug yarat
UPDATE restaurants
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

-- ── 2. Yeni cədvəllər ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id            serial primary key,
  restaurant_id integer references restaurants(id) on delete cascade,
  cat           text    default 'Ümumi',
  name          text    not null,
  description   text,
  price         numeric(8,2) not null,
  emoji         text    default '🍽️',
  available     boolean default true,
  sort_order    integer default 0,
  created_at    timestamptz default now()
);

CREATE TABLE IF NOT EXISTS wa_templates (
  id         serial primary key,
  key        text unique not null,
  title      text not null,
  body       text not null,
  active     boolean default true,
  updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS onboarding_requests (
  id            serial primary key,
  business_name text not null,
  contact_name  text not null,
  phone         text not null,
  email         text,
  cuisine       text,
  location      text,
  table_count   integer,
  message       text,
  status        text default 'pending',
  created_at    timestamptz default now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id              serial primary key,
  booking_code    text,
  customer_name   text,
  restaurant_name text,
  stars           integer check (stars between 1 and 5),
  comment         text,
  created_at      timestamptz default now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            serial primary key,
  username      text not null unique,
  password_hash text not null,
  display_name  text,
  restaurant_id integer references restaurants(id) on delete set null,
  is_super      boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ── 3. WA şablonları ──────────────────────────────────────────
INSERT INTO wa_templates (key, title, body) VALUES
('new_booking', 'Yeni Rezervasiya (Müştəriyə)',
E'Salam {{name}}! 🎉\n\n*Rezervasiyanız qəbul edildi!*\n\n🏛️ {{restaurant}}\n📅 {{date}} · ⏰ {{time}}\n🪑 Masa: {{table}} · 👥 {{guests}} nəfər\n🔖 Kod: #{{code}}\n\nEkran görüntüsü çəkin — restoranda QR oxudulacaq. 🍽️'),
('confirm', 'Təsdiq Bildirişi',
E'Salam {{name}}! ✅\n\n*Rezervasiyanız təsdiqləndi!*\n\n🏛️ {{restaurant}}\n📅 {{date}} · ⏰ {{time}}\n🪑 Masa: {{table}} · 👥 {{guests}} nəfər\n\nSizi gözləyirik! 🍽️'),
('cancel', 'Ləğv Bildirişi',
E'Salam {{name}},\n\n❌ *Rezervasiyanız ləğv edildi.*\n\n{{restaurant}} · {{date}} {{time}}\n\nMəlumat üçün bizimlə əlaqə saxlayın.'),
('arrived', 'Gəldi Bildirişi',
E'Salam {{name}}! 👋\n\n✅ Gəlişiniz qeyd edildi. Xoş gəlmisiniz!\n🍽️ {{restaurant}} — Masa {{table}}'),
('reminder', 'Vaxt Xatırlatması',
E'Salam {{name}}! ⏰\n\n📍 *{{restaurant}}* restoranında\nbu gün saat *{{time}}*-a rezervasiyanız var.\n\n🪑 Masa: {{table}} · 👥 {{guests}} nəfər\n\nGözlənilirsiniz! 🙂')
ON CONFLICT (key) DO NOTHING;

-- ── 4. Admin yarat (SHA-256 şifrə) ───────────────────────────
INSERT INTO admin_users (username, password_hash, display_name, is_super, is_active)
VALUES ('admin', encode(digest('Admin123','sha256'),'hex'), 'Super Admin', true, true)
ON CONFLICT (username) DO NOTHING;

-- Köhnə plain-text şifrəni hash-ə köçür
UPDATE admin_users
SET password_hash = encode(digest(password_hash,'sha256'),'hex')
WHERE length(password_hash) < 60;

-- ── 5. RLS — ƏVVƏLCƏ HAMISI SİLİNİR ─────────────────────────
ALTER TABLE restaurants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables              ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_templates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
           WHERE schemaname = 'public'
             AND tablename IN ('restaurants','tables','menu_items',
                               'wa_templates','reviews',
                               'onboarding_requests','admin_users')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Restaurants
CREATE POLICY "read restaurants"   ON restaurants FOR SELECT USING (true);
CREATE POLICY "write restaurants"  ON restaurants FOR ALL    USING (true) WITH CHECK (true);

-- Tables
CREATE POLICY "read tables"        ON tables      FOR SELECT USING (true);
CREATE POLICY "write tables"       ON tables      FOR ALL    USING (true) WITH CHECK (true);

-- Menu items
CREATE POLICY "read menu_items"    ON menu_items  FOR SELECT USING (true);
CREATE POLICY "write menu_items"   ON menu_items  FOR ALL    USING (true) WITH CHECK (true);

-- WA templates
CREATE POLICY "read wa_templates"  ON wa_templates FOR SELECT USING (true);
CREATE POLICY "write wa_templates" ON wa_templates FOR ALL    USING (true) WITH CHECK (true);

-- Reviews
CREATE POLICY "read reviews"       ON reviews     FOR SELECT USING (true);
CREATE POLICY "write reviews"      ON reviews     FOR INSERT WITH CHECK (true);

-- Onboarding
CREATE POLICY "read onboarding"    ON onboarding_requests FOR SELECT USING (true);
CREATE POLICY "write onboarding"   ON onboarding_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "update onboarding"  ON onboarding_requests FOR UPDATE USING (true);

-- Admin users
CREATE POLICY "read admin_users"   ON admin_users FOR SELECT USING (true);
CREATE POLICY "write admin_users"  ON admin_users FOR ALL    USING (true) WITH CHECK (true);

-- ── 6. Storage bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('table-images', 'table-images', true)
ON CONFLICT DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public upload table-images" ON storage.objects;
  DROP POLICY IF EXISTS "Public read table-images"   ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public upload table-images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id='table-images');
CREATE POLICY "Public read table-images"
  ON storage.objects FOR SELECT USING (bucket_id='table-images');

-- ── 7. Menu JSONB → ayrı cədvəl ─────────────────────────────
INSERT INTO menu_items (restaurant_id, cat, name, description, price, emoji)
SELECT r.id,
       COALESCE(item->>'cat',  'Ümumi'),
       item->>'name',
       item->>'desc',
       (item->>'price')::numeric,
       COALESCE(item->>'emoji','🍽️')
FROM   restaurants r,
       jsonb_array_elements(COALESCE(r.menu_items,'[]'::jsonb)) AS item
WHERE  r.menu_items IS NOT NULL
  AND  r.menu_items != '[]'::jsonb
  AND  item->>'name' IS NOT NULL
ON CONFLICT DO NOTHING;

-- ── 8. İndekslər ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reservations_date   ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_bcode  ON reservations(booking_code);
CREATE INDEX IF NOT EXISTS idx_menu_items_rest     ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug    ON restaurants(slug);
