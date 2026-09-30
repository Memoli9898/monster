// ============================================
// SERVER FUNKSİYASI — Ödəniş linki yaratmaq (Payriff/GoldenPay)
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

    // --- Sifarişi Supabase-dən yoxla ---
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ error: 'Sifariş tapılmadı' });
    }

    // ============================================
    // TODO: Bu hissəni Payriff/GoldenPay-in ÖZ API sənədləşməsinə görə dəyişməlisən.
    // Aşağıda TİPİK bir "create payment" sorğusu nümunəsi var — dəqiq sahə adları
    // (field names) və endpoint URL-i sənin aldığın rəsmi sənədləşmədə fərqli ola bilər.
    // ============================================
    const paymentProvider = process.env.PAYMENT_PROVIDER || 'payriff';
    const apiKey = process.env.PAYRIFF_API_KEY;
    const merchantId = process.env.PAYRIFF_MERCHANT_ID;

    const paymentResponse = await fetch('https://api.payriff.com/api/v3/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        merchant: merchantId,
        amount: amount,
        currency: 'AZN',
        description: `Sifariş #${order.order_number}`,
        callbackUrl: `${process.env.PUBLIC_BASE_URL}/api/payment-webhook`,
        metadata: { orderId: order.id, orderNumber: order.order_number },
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('Payment provider error:', paymentData);
      return res.status(502).json({ error: 'Ödəniş provayderi xəta qaytardı', details: paymentData });
    }

    // Payriff-in cavabında ödəniş linki adətən "paymentUrl" kimi gəlir — TODO: təsdiqlə
    return res.status(200).json({ paymentUrl: paymentData.paymentUrl || paymentData.payment_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server xətası' });
  }
}
