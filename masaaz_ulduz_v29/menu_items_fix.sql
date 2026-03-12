-- ════════════════════════════════════════════════════════════════
-- MasaAz — Menu Items + Cuisine Düzəlişləri
-- Supabase SQL Editor-da run edin
-- ════════════════════════════════════════════════════════════════

-- 1. menu_items cədvəli yarat (əgər yoxdursa)
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
  img_url       text,
  created_at    timestamptz default now()
);

-- 2. RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname='public' AND tablename='menu_items'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON menu_items', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "read menu_items"  ON menu_items FOR SELECT USING (true);
CREATE POLICY "write menu_items" ON menu_items FOR ALL    USING (true) WITH CHECK (true);

-- 3. İndeks
CREATE INDEX IF NOT EXISTS idx_menu_items_rest ON menu_items(restaurant_id);

-- 4. restaurants cədvəlinə çatışmayan sütunları əlavə et
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS cover_url   text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS phone       text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS hours       text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS slug        text unique;

-- 5. "Azerbaycabn" typo-sunu düzəlt
UPDATE restaurants SET cuisine = 'Azərbaycan'
WHERE cuisine ILIKE 'azerbaycabn' OR cuisine ILIKE 'azerbaycan';

-- 6. Abunəlik default məbləğini $59-a yüksəlt
UPDATE subscriptions SET amount = 59 WHERE amount = 29;
ALTER TABLE subscriptions ALTER COLUMN amount SET DEFAULT 59;

-- Yoxlama
SELECT 'menu_items table: OK' as status;
SELECT 'cover_url column: OK' as status FROM information_schema.columns
  WHERE table_name='restaurants' AND column_name='cover_url';
