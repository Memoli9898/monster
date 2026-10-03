// ============================================
// SERVER FUNKSİYASI — Ödəniş linki yaratmaq (Payriff Gateway API v3)
// Vercel-də bu fayl avtomatik: /api/create-payment olaraq işləyir
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
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId və amount lazımdır' });
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ error: 'Sifariş tapılmadı' });
    }

    const { data: paySettings } = await supabase.from('payment_settings').select('*').single();
    if (!paySettings || !paySettings.api_key) {
      return res.status(400).json({ error: 'Payriff açarı admin paneldə hələ daxil edilməyib (Ödəniş/WhatsApp tabı)' });
    }
    const secretKey = paySettings.api_key;

    // Ödəniş bitəndən sonra müştəri bu səhifəyə qayıdacaq (bizim öz saytımız,
    // Payriff-ə server-to-server callback yox, brauzer redirect-i)
    const returnUrl = `${process.env.PUBLIC_BASE_URL}/order-complete.html?order=${order.order_number}`;

    const paymentResponse = await fetch('https://api.payriff.com/api/v3/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: secretKey,
      },
      body: JSON.stringify({
        amount: Number(amount),
        language: 'AZ',
        currency: 'AZN',
        description: `Sifariş #${order.order_number}`,
        callbackUrl: returnUrl,
        cardSave: false,
        operation: 'PURCHASE',
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok || paymentData.code !== '00000') {
      console.error('Payriff error:', paymentData);
      return res.status(502).json({ error: 'Payriff xəta qaytardı', details: paymentData });
    }

    // Payriff-in öz UUID-sini (orderId) saxlayırıq — bununla sonra GET /orders/:ORDER_ID
    // edib ödənişin HƏQİQƏTƏN uğurlu olduğunu server-tərəfdə yoxlayacağıq.
    await supabase
      .from('orders')
      .update({
        payriff_order_id: paymentData.payload.orderId,
        payriff_transaction_id: String(paymentData.payload.transactionId),
      })
      .eq('id', order.id);

    return res.status(200).json({ paymentUrl: paymentData.payload.paymentUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server xətası' });
  }
}
