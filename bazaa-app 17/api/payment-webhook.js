// ============================================
// ⚠️ BU FAYL HAZIRDA İSTİFADƏ OLUNMUR (ehtiyat olaraq saxlanılır)
//
// Payriff-in sənədləşməsi göstərdi ki, onların modeli "push webhook" yox,
// "GET /api/v3/orders/:ORDER_ID" ilə status SORUŞMA (polling) modelidir.
// Əsas mexanizm indi api/verify-payment.js və public/order-complete.html-dədir —
// müştəri ödəniş edib geri qayıdanda, həmin səhifə Payriff-dən real statusu soruşur.
//
// Bu faylı yalnız onlar gələcəkdə əsl server-to-server webhook əlavə etsələr saxla.
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
    const body = req.body;
    // Payriff-in callback-də "status" sahəsini necə adlandırdığı dəqiqləşməlidir
    // (bəzən "status", bəzən "payload.status" ola bilər) — TODO: təsdiqlə
    const status = body.status || body.payload?.status;
    const transactionId = String(body.transactionId || body.payload?.transactionId || '');

    if (!transactionId) {
      return res.status(400).json({ error: 'transactionId tapılmadı', received: body });
    }

    const isSuccess = ['success', 'APPROVED', 'PAID', 'COMPLETED'].includes(status);
    if (!isSuccess) {
      return res.status(200).json({ received: true, action: 'ignored', status });
    }

    // --- 1. transactionId-yə görə bizim sifarişi tap (create-payment.js bunu yazmışdı) ---
    const { data: existing, error: findErr } = await supabase
      .from('orders')
      .select('*')
      .eq('payriff_transaction_id', transactionId)
      .single();

    if (findErr || !existing) {
      console.error('Order not found for transactionId:', transactionId);
      return res.status(404).json({ error: 'Sifariş tapılmadı', transactionId });
    }

    // Artıq "paid" edilibsə, təkrar emal etmə (Payriff callback-i bir neçə dəfə göndərə bilər)
    if (existing.status === 'paid') {
      return res.status(200).json({ received: true, action: 'already_processed' });
    }

    // --- 2. Sifarişi "paid" et ---
    const { data: order, error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateErr || !order) {
      console.error('Order update error:', updateErr);
      return res.status(500).json({ error: 'Sifariş yenilənmədi' });
    }

    // --- 3. Stoku azalt ---
    for (const item of order.items) {
      await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.qty }).catch(() => {});
    }

    // --- 4. WhatsApp bildirişi göndər (Green-API) ---
    const { data: waSettings } = await supabase.from('whatsapp_settings').select('*').single();

    if (waSettings?.instance_id && waSettings?.api_token && waSettings?.notify_phone && !order.whatsapp_notified) {
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
            chatId: `${waSettings.notify_phone.replace(/\D/g, '')}@c.us`,
            message,
          }),
        }
      ).catch((e) => console.error('GreenAPI error:', e));

      await supabase.from('orders').update({ whatsapp_notified: true }).eq('id', order.id);
    }

    return res.status(200).json({ received: true, action: 'processed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server xətası' });
  }
}
