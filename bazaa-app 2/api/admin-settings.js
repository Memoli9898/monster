// ============================================
// SERVER FUNKSİYASI — payment_settings və whatsapp_settings üçün
// (bunlar gizli olduğu üçün admin panel bunlara birbaşa yox, bu funksiya üzərindən çatır)
// Vercel-də: /api/admin-settings
// ============================================
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function checkAdmin(req) {
  const pass = req.headers['x-admin-password'];
  return pass && pass === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (!checkAdmin(req)) {
    return res.status(401).json({ error: 'Yanlış admin parolu' });
  }

  if (req.method === 'GET') {
    const { data: payment } = await supabase.from('payment_settings').select('*').single();
    const { data: whatsapp } = await supabase.from('whatsapp_settings').select('*').single();
    return res.status(200).json({ payment, whatsapp });
  }

  if (req.method === 'POST') {
    const { payment, whatsapp } = req.body;
    if (payment) {
      await supabase.from('payment_settings').update(payment).eq('id', 1);
    }
    if (whatsapp) {
      await supabase.from('whatsapp_settings').update(whatsapp).eq('id', 1);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Metod dəstəklənmir' });
}
