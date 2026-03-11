-- ════════════════════════════════════════════════════════════════
-- MasaAz — Yeni Xüsusiyyətlər SQL Migration
-- Supabase SQL Editor-da run edin (SUPABASE_SQL_v2.sql-dən SONRA)
-- ════════════════════════════════════════════════════════════════

-- 1. Xüsusi gün sütunu (rezervasiyalar üçün)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS special_occasion text;

-- 2. No-show izləmə üçün status-a "gəlmədi" artıq kodda işlənir
--    (əlavə sütun lazım deyil — status = 'gəlmədi' olaraq saxlanır)

-- 3. İndeks (sürətli axtarış üçün)
CREATE INDEX IF NOT EXISTS idx_reservations_special ON reservations(special_occasion) WHERE special_occasion IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reservations_phone   ON reservations(phone);

-- Yoxlama: uğurlu olduqda "special_occasion column added" görünəcək
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservations' 
  AND column_name = 'special_occasion';
