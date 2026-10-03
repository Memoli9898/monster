// ============================================
// SUPABASE CONFIG — CLIENT-SAFE (bu fayl brauzerdə görünür, OK)
// Supabase Dashboard -> Settings -> API-dən götür
// ============================================
window.SUPABASE_CONFIG = {
  url: 'https://xpuqpzvigfxaobiprpsx.supabase.co',
  anonKey: 'sb_publishable_-nS3WSqqrpeL2TOyHAbLYg_wuFpRUWc',
};

// QEYD: "anon" açar public görünə bilər, bu normaldır — RLS (Row Level Security)
// bu açarın nəyə çata biləcəyini məhdudlaşdırır (bax: sql/schema.sql).
// "service_role" açarı İSƏ HEÇ VAXT bura və ya heç bir client faylına yazılmamalıdır.
