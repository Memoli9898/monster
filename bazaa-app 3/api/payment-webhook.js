// ============================================
// SERVER FUNKSİYASI — Payriff/GoldenPay-dən gələn "ödəniş uğurlu oldu" bildirişi
// Bura Payriff/GoldenPay-in özü sorğu göndərir (sən çağırmırsan)
// Vercel-də: /api/payment-webhook
// ============================================
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnız POST' });
  }

  try {
    // ============================================
    // TODO: Payriff-in webhook payload formatını öz sənədləşməsindən yoxla.
    // Bəzi provayderlər imza (signature) yoxlanışı tələb edir — TƏHLÜKƏSİZLİK ÜÇÜN VACİB,
    // əks halda kimsə saxta "ödənildi" sorğusu göndərə bilər.
    // ============================================
    const { status, metadata, transactionId } = req.body;

    if (status !== 'success' && status !== 'APPROVED') {
      // Ödəniş uğursuzdursa, heç nə etmirik (sifariş "pending" qalır)
      return res.status(200).json({ received: true, action: 'ignored' });
    }

    const orderId = metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId tapılmadı' });
    }

    // --- 1. Sifarişi "paid" et ---
    const { data: order, error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid', payriff_transaction_id: transactionId, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (updateErr || !order) {
      console.error('Order update error:', updateErr);
      return res.status(500).json({ error: 'Sifariş yenilənmədi' });
    }

    // --- 2. Stoku azalt ---
    for (const item of order.items) {
      await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.qty }).catch(() => {});
      // QEYD: "decrement_stock" adlı bir Postgres funksiyası yaratmalısan (aşağıda sql/functions.sql-a bax)
    }

    // --- 3. WhatsApp bildirişi göndər (Green-API) ---
    const { data: waSettings } = await supabase.from('whatsapp_settings').select('*').single();

    if (waSettings?.instance_id && waSettings?.api_token && !order.whatsapp_notified) {
      const message =
        `✅ Yeni ödənilmiş sifariş!\n\n` +
        `№: ${order.order_number}\n` +
        `Müştəri: ${order.customer_name}\n` +
        `Telefon: ${order.customer_phone}\n` +
        `Ünvan: ${order.customer_address}\n` +
        `Məbləğ: ${order.total} ₼\n` +
        `Ödəniş: Kart (${transactionId})`;

      await fetch(
        `https://api.green-api.com/waInstance${waSettings.instance_id}/sendMessage/${waSettings.api_token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: `${waSettings.notify_phone}@c.us`,
            message,
          }),
        }
      ).catch((e) => console.error('GreenAPI error:', e));

      await supabase.from('orders').update({ whatsapp_notified: true }).eq('id', orderId);
    }

    return res.status(200).json({ received: true, action: 'processed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server xətası' });
  }
}
