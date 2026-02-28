# 💳 MasaAz — Stripe Ödəniş Sistemi Quraşdırma

## Addım 1: Stripe hesabı aç

1. [stripe.com](https://stripe.com) → Sign Up
2. Business məlumatlarını doldurun
3. Dashboard → **API Keys** bölməsini tapın
4. `pk_live_...` (Publishable) və `sk_live_...` (Secret) açarları kopyalayın

---

## Addım 2: Supabase Edge Functions Deploy

```bash
# Supabase CLI qur
npm install -g supabase

# Login
supabase login

# Projekti link et
supabase link --project-ref jhyaiuvubbrtngvyoyhi

# Secrets əlavə et
supabase secrets set STRIPE_SECRET_KEY=sk_live_BURAYA_YAZIN
supabase secrets set APP_URL=https://masaaz.vercel.app

# Webhook secret-i sonra əlavə edəcəyik (aşağıya bax)

# Edge Functions deploy et
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

---

## Addım 3: Stripe Webhook quraşdır

1. Stripe Dashboard → **Developers → Webhooks**
2. **Add endpoint** düyməsinə basın
3. Endpoint URL:
   ```
   https://jhyaiuvubbrtngvyoyhi.supabase.co/functions/v1/stripe-webhook
   ```
4. Events seçin:
   - `checkout.session.completed` ✅
   - `payment_intent.payment_failed` ✅
5. Webhook yaradıldıqdan sonra **Signing secret** (`whsec_...`) kopyalayın
6. Secret-i əlavə edin:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_BURAYA_YAZIN
   ```
7. Edge Function-u yenidən deploy edin:
   ```bash
   supabase functions deploy stripe-webhook
   ```

---

## Addım 4: SQL-i Supabase-da run et

Supabase → SQL Editor → `SUBSCRIPTION_SQL.sql` faylının məzmununu yapışdırın → **Run**

---

## Addım 5: Test edin

1. owner.html-ə daxil olun
2. Sol sidebar-da "💳 Abunəlik" tabına keçin  
3. "İndi ödəniş et" düyməsinə basın
4. Stripe test kartı: `4242 4242 4242 4242` (istənilən exp/CVV)
5. Ödənişdən sonra avtomatik geri qayıdacaqsınız
6. Abunəlik "Aktiv ✅" görünəcək

### Test kartları:
| Kart nömrəsi | Nəticə |
|---|---|
| 4242 4242 4242 4242 | Uğurlu ödəniş |
| 4000 0000 0000 0002 | Rədd edildi |
| 4000 0025 0000 3155 | 3D Secure |

---

## Axın diaqramı

```
Owner Panel → "Ödəniş et"
    ↓
Supabase Edge Function (create-checkout)
    → Stripe API: Checkout Session yarat
    ↓
Stripe Checkout Səhifəsi (kart məlumatları)
    ↓ ödəniş uğurlu
Stripe Webhook → Supabase Edge Function (stripe-webhook)
    → subscriptions.status = "active"
    → expires_at = now + 1 ay
    ↓
owner.html?paid=success
    → DB-dən abunəlik yenilənir
    → "Aktiv ✅" göstərilir
```

---

## Admin Panel (Əl ilə idarə)

admin.html → **💳 Abunəliklər** tabı:
- Bütün restoranların statusunu görün
- "✅ 1 ay aktiv et" — ödənişsiz manual aktiv et
- "+7 gün trial" — trial uzat
- "Ləğv et" — abunəliyi bitir

---

## Qiymət dəyişdirmək

`supabase/functions/create-checkout/index.ts` faylında:
```typescript
const PLAN_PRICE_USD = 2900; // $29.00 (sentlə)
```
Dəyişdirin, yenidən deploy edin.

