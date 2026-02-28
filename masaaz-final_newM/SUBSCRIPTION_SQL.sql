-- ════════════════════════════════════════════════════════════════
-- MasaAz — Abunəlik Sistemi (Subscription)
-- Supabase SQL Editor-da run edin
-- ════════════════════════════════════════════════════════════════

-- ── 1. Subscriptions cədvəli ─────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     serial primary key,
  restaurant_id          integer references restaurants(id) on delete cascade,
  status                 text default 'trial',
  plan                   text default 'monthly',
  amount                 numeric(8,2) default 29,
  currency               text default 'USD',
  trial_ends_at          timestamptz default (now() + interval '14 days'),
  started_at             timestamptz,
  expires_at             timestamptz,
  stripe_customer_id     text,
  stripe_subscription_id text,
  stripe_session_id      text,
  notes                  text,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now(),
  UNIQUE (restaurant_id)
);

-- ── 2. Ödəniş tarixi ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_history (
  id                serial primary key,
  restaurant_id     integer references restaurants(id) on delete cascade,
  subscription_id   integer references subscriptions(id),
  amount            numeric(8,2),
  currency          text default 'USD',
  stripe_payment_id text,
  stripe_session_id text,
  status            text default 'pending',
  paid_at           timestamptz,
  period_start      timestamptz,
  period_end        timestamptz,
  created_at        timestamptz default now()
);

-- ── 3. Trigger: yeni restoran → avtomatik trial ───────────────
CREATE OR REPLACE FUNCTION create_trial_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (restaurant_id, status, trial_ends_at)
  VALUES (NEW.id, 'trial', now() + interval '14 days')
  ON CONFLICT (restaurant_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_restaurant_created ON restaurants;
CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON restaurants
  FOR EACH ROW EXECUTE FUNCTION create_trial_subscription();

-- ── 4. Mövcud restoranlar üçün trial yarat ────────────────────
INSERT INTO subscriptions (restaurant_id, status, trial_ends_at)
SELECT id, 'trial', now() + interval '14 days'
FROM restaurants
WHERE id NOT IN (SELECT restaurant_id FROM subscriptions WHERE restaurant_id IS NOT NULL)
ON CONFLICT (restaurant_id) DO NOTHING;

-- ── 5. RLS ───────────────────────────────────────────────────
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history  ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
           WHERE schemaname='public' AND tablename IN ('subscriptions','payment_history')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

CREATE POLICY "read subscriptions"  ON subscriptions   FOR SELECT USING (true);
CREATE POLICY "write subscriptions" ON subscriptions   FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "read payments"       ON payment_history FOR SELECT USING (true);
CREATE POLICY "write payments"      ON payment_history FOR ALL    USING (true) WITH CHECK (true);

-- ── 6. İndekslər ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sub_rest   ON subscriptions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_sub_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_pay_rest   ON payment_history(restaurant_id);
