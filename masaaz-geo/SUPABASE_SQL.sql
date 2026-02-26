-- 1. Mövcud reservations cədvəlinə booking_code əlavə et (əgər yoxdursa)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS booking_code text;

-- 2. Restaurants cədvəli
CREATE TABLE IF NOT EXISTS restaurants (
  id           serial primary key,
  name         text not null,
  cuisine      text,
  location     text,
  emoji        text default '🍽️',
  accent       text default '#3B82F6',
  tags         text[],
  rating       numeric(3,1) default 4.5,
  price_range  text default '₼₼',
  available    boolean default true,
  menu_items   jsonb default '[]',
  created_at   timestamptz default now()
);

-- 3. Tables cədvəli
CREATE TABLE IF NOT EXISTS tables (
  id              serial primary key,
  restaurant_id   integer references restaurants(id) on delete cascade,
  label           text not null,
  seats           integer default 4,
  zone            text,
  shape           text default 'rect',
  x               numeric default 20,
  y               numeric default 20,
  img_url         text,
  created_at      timestamptz default now()
);

-- 4. RLS policies
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public read tables"      ON tables      FOR SELECT USING (true);
CREATE POLICY "Public insert restaurants" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update restaurants" ON restaurants FOR UPDATE USING (true);
CREATE POLICY "Public delete restaurants" ON restaurants FOR DELETE USING (true);
CREATE POLICY "Public insert tables" ON tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tables" ON tables FOR UPDATE USING (true);
CREATE POLICY "Public delete tables" ON tables FOR DELETE USING (true);

-- 5. Storage bucket (şəkillər üçün)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('table-images', 'table-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public upload table-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id='table-images');
CREATE POLICY "Public read table-images"   ON storage.objects FOR SELECT USING (bucket_id='table-images');

-- 6. Reviews cədvəli (müştəri rəyləri)
CREATE TABLE IF NOT EXISTS reviews (
  id              serial primary key,
  booking_code    text,
  customer_name   text,
  restaurant_name text,
  stars           integer check (stars between 1 and 5),
  comment         text,
  created_at      timestamptz default now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reviews"   ON reviews FOR SELECT USING (true);

-- 7. Admin istifadəçilər cədvəli
CREATE TABLE IF NOT EXISTS admin_users (
  id              serial primary key,
  username        text not null unique,
  password_hash   text not null,
  display_name    text,
  restaurant_id   integer references restaurants(id) on delete set null,
  is_super        boolean default false,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read admin_users" ON admin_users FOR SELECT USING (true);

-- İlk super admin: username=admin, şifrə=Admin123
-- ŞİFRƏNİ DƏYIŞDIRMƏK ÜÇÜN: password_hash sütununu yeniləyin
INSERT INTO admin_users (username, password_hash, display_name, is_super, is_active)
VALUES ('admin', 'Admin123', 'Super Admin', true, true)
ON CONFLICT (username) DO NOTHING;

-- ══════════════════════════════════════════════════════
-- GEO sistemi üçün restaurants cədvəlinə sütunlar əlavə et
-- ══════════════════════════════════════════════════════
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS lat     numeric;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS lng     numeric;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS city    text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS country text default 'AZ';

-- Mövcud Bakı restoranları üçün nümunə koordinatlar
-- UPDATE restaurants SET lat=40.4093, lng=49.8671, city='Bakı', country='AZ' WHERE country IS NULL;

-- Moskva restoranı üçün nümunə:
-- UPDATE restaurants SET lat=55.7558, lng=37.6173, city='Moskva', country='RU' WHERE name='...';
