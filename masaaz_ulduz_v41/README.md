# 🍽️ MasaAz — Rezervasiya Platforması

## Fayl Strukturu

```
masaaz/
├── index.html              ← Müştəri rezervasiya UI (Vite entry)
├── admin.html              ← Restoran sahibi paneli (abunəlik + rezerv idarəetmə)
├── owner.html              ← MasaAz sahibi paneli (bütün restoranlar + abunəlik idarəetmə)
├── vite.config.js          ← Vite konfiqurasiyası (admin/owner.html dist-ə kopyalanır)
├── netlify.toml            ← Netlify deploy konfiqurasiyası
├── vercel.json             ← Vercel deploy konfiqurasiyası
├── package.json
│
├── src/
│   ├── main.jsx            ← React entry point
│   └── App.jsx             ← Müştəri rezervasiya axını
│
├── supabase/
│   └── functions/
│       ├── create-checkout/index.ts   ← Stripe ödəniş sessiyası yaradır
│       └── stripe-webhook/index.ts    ← Stripe ödəniş uğurlu → abunəlik aktiv edir
│
├── SUPABASE_SQL_v2.sql     ← Əsas DB şeması (1-ci run et)
└── SUBSCRIPTION_SQL.sql    ← Abunəlik cədvəlləri (2-ci run et)
```

## Quraşdırma Sırası

### 1. Supabase SQL
```
Supabase → SQL Editor:
1. SUPABASE_SQL_v2.sql  → Run
2. SUBSCRIPTION_SQL.sql → Run
```

### 2. Deploy (Vercel/Netlify)
```bash
npm install
npm run build
# dist/ qovluğunu deploy et
```

### 3. Stripe Quraşdırma
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set APP_URL=https://your-domain.vercel.app

# Deploy edge functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook

# Stripe Dashboard → Webhooks → Add endpoint:
# URL: https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
# Events: checkout.session.completed, payment_intent.payment_failed
# → Webhook secret al → 
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
supabase functions deploy stripe-webhook
```

## Giriş

| Panel | URL | Kim üçün |
|---|---|---|
| Müştəri rezervasiya | / | Müştərilər |
| Restoran admin | /admin.html | Restoran sahibləri (aylıq ödəniş edir) |
| Platform owner | /owner.html | Sən — MasaAz sahibi |

**Default giriş:**
- Username: `admin`
- Şifrə: `Admin123`

## Abunəlik Axını

```
Restoran sahibi admin.html-ə giriş edir
→ Abunəlik yoxdur → Panel bağlanır, ödəniş ekranı görünür
→ $29/ay Stripe ilə ödəyir
→ Pul SƏNİN Stripe hesabına düşür
→ Webhook → subscriptions.status = "active"
→ Panel açılır ✅
```
