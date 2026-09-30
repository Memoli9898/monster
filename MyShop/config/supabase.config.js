// ============================================
// SUPABASE CONFIG — CLIENT-SAFE (bu fayl brauzerdə görünür, OK)
// Supabase Dashboard -> Settings -> API-dən götür
// ============================================
window.SUPABASE_CONFIG = {
  url: 'https://SENIN-PROJECT-ID.supabase.co',   // <- BURAYA öz Supabase Project URL-ini yaz
  anonKey: 'SENIN-ANON-PUBLIC-KEY',                // <- BURAYA öz "anon public" açarını yaz (service_role YOX!)
};

// QEYD: "anon" açar public görünə bilər, bu normaldır — RLS (Row Level Security)
// bu açarın nəyə çata biləcəyini məhdudlaşdırır (bax: sql/schema.sql).
// "service_role" açarı İSƏ HEÇ VAXT bura və ya heç bir client faylına yazılmamalıdır.
