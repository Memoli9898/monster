// ============================================
// SERVER FUNKSİYASI — Payriff-dən ödənişin HƏQİQİ statusunu soruşmaq
// Müştəri ödəniş etdikdən sonra order-complete.html səhifəsi bunu çağırır
// Vercel-də: /api/verify-payment
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
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber lazımdır' });
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ error: 'Sifariş tapılmadı' });
    }

    // Artıq "paid" edilibsə, Payriff-ə yenidən sorğu getmə
    if (order.status === 'paid') {
      return res.status(200).json({ status: 'paid', order });
    }

    if (!order.payriff_order_id) {
      return res.status(400).json({ error: 'Bu sifarişdə Payriff order ID yoxdur' });
    }

    const { data: paySettings } = await supabase.from('payment_settings').select('*').single();
    const secretKey = paySettings?.api_key;
    if (!secretKey) {
      return res.status(400).json({ error: 'Payriff açarı tapılmadı' });
    }

    // --- Payriff-dən real statusu soruş: GET /api/v3/orders/:ORDER_ID ---
    const statusResponse = await fetch(`https://api.payriff.com/api/v3/orders/${order.payriff_order_id}`, {
      method: 'GET',
      headers: { Authorization: secretKey },
    });
    const statusData = await statusResponse.json();

    if (!statusResponse.ok || statusData.code !== '00000') {
      console.error('Payriff status check error:', statusData);
      return res.status(502).json({ error: 'Payriff statusu yoxlanıla bilmədi', details: statusData });
    }

    const paymentStatus = statusData.payload?.paymentStatus;

    // Payriff "PAID" yox, "APPROVED" qaytarır — hər ikisini uğur kimi qəbul edirik
    if (paymentStatus !== 'PAID' && paymentStatus !== 'APPROVED') {
      // Hələ ödənilməyib (PENDING) və ya uğursuz olub (FAILED)
      return res.status(200).json({ status: paymentStatus || 'PENDING' });
    }

    // --- Ödəniş TƏSDİQLƏNDİ — sifarişi "paid" et ---
    const { data: updatedOrder } = await supabase
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', order.id)
      .select()
      .single();

    // Stoku azalt
    for (const item of updatedOrder.items) {
      try {
        await supabase.rpc('decrement_stock', { p_id: item.product_id, qty: item.qty });
      } catch (e) {
        console.error('Stock decrement error:', e);
      }
    }

    // WhatsApp bildirişi göndər
    const { data: waSettings } = await supabase.from('whatsapp_settings').select('*').single();
    if (waSettings?.instance_id && waSettings?.api_token && waSettings?.notify_phone && !updatedOrder.whatsapp_notified) {
      const message =
        `✅ Yeni ödənilmiş sifariş!\n\n` +
        `№: ${updatedOrder.order_number}\n` +
        `Müştəri: ${updatedOrder.customer_name}\n` +
        `Telefon: ${updatedOrder.customer_phone}\n` +
        `Ünvan: ${updatedOrder.customer_address}\n` +
        `Məbləğ: ${updatedOrder.total} ₼`;

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

    return res.status(200).json({ status: 'paid', order: updatedOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server xətası' });
  }
}
