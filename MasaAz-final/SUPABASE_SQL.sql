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
