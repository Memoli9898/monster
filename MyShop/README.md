# BAZAA — Onlayn Mağaza (Supabase + Vercel)

Bu layihə 3 hissədən ibarətdir:
- `public/` — sayt (storefront) və admin panel (statik HTML)
- `api/` — server funksiyaları (Vercel Serverless Functions): ödəniş yaratma, ödəniş webhook-u, admin gizli tənzimləmələr
- `sql/` — Supabase verilənlər bazası quruluşu

## ⚠️ Bu layihə "istifadəyə tam hazır" deyil — tamamlamalı olduğun hissələr var

1. **Payriff/GoldenPay API sənədləşməsi əlində olmalıdır** — `api/create-payment.js` və `api/payment-webhook.js` faylları TİPİK nümunədir, sənin təchizatçının (Payriff/GoldenPay) real endpoint/field adlarına görə **düzəliş tələb edir** (kodda `TODO` yazılan yerlərə bax).
2. **Admin panelin parol qorunması sadədir** — həqiqi istifadəçi autentifikasiyası (Supabase Auth) deyil. Admin panel linkini/parolunu heç kimlə paylaşma. Real, çox istifadəçili layihə üçün Supabase Auth əlavə etməlisən.
3. **RLS (Row Level Security) siyasətləri müvəqqətidir** — `sql/schema.sql`-də "temp_admin_*" adlı policy-lər var, bunlar hər kəsə (anon key olan hər kəsə) yazma icazəsi verir. Bu, sürətli başlanğıc üçündür, amma açıq mənbə/kodunu görən kimsə nəzəri olaraq bazana yaza bilər. Prod üçün Supabase Auth ilə məhdudlaşdır.

## Qurulum addımları

### 1. Supabase layihəsi yarat
1. [supabase.com](https://supabase.com) — pulsuz hesab aç, yeni layihə yarat
2. **SQL Editor** → `sql/schema.sql` faylının məzmununu yapışdır, çalışdır (Run)
3. Sonra `sql/functions.sql`-ı da eyni şəkildə çalışdır
4. **Settings → API** bölməsindən `Project URL` və `anon public` açarını kopyala

### 2. Config faylını doldur
`config/supabase.config.js` faylını aç, `url` və `anonKey` sahələrini yuxarıda aldığın məlumatlarla doldur.

### 3. Payriff/GoldenPay-dən açarları al
Onlardan Merchant ID, API Key, webhook sənədləşməsini al. `api/create-payment.js` və `api/payment-webhook.js`-i onların sənədləşməsinə görə düzəlt (TODO-lara bax).

### 4. Green-API-dən WhatsApp açarlarını al
green-api.com-da qeydiyyatdan keç, İnstance ID və API Token al, öz WhatsApp-ını QR ilə bağla.

### 5. GitHub-a yüklə
```bash
git init
git add .
git commit -m "İlk versiya"
git remote add origin https://github.com/İSTİFADƏÇİ-ADIN/bazaa-app.git
git push -u origin main
```
`.env` faylı `.gitignore`-də olduğu üçün GitHub-a yüklənməyəcək — bu, düzgündür (gizli açarları GitHub-a qoyma).

### 6. Vercel-də deploy et
1. [vercel.com](https://vercel.com)-a GitHub hesabınla daxil ol
2. "New Project" → bu repo-nu seç → Import
3. **Environment Variables** bölməsində, `.env.example`-dəki bütün dəyişənləri (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYRIFF_API_KEY`, `ADMIN_PASSWORD` və s.) real dəyərlərinlə əlavə et
4. Deploy et

### 7. Admin panelə ilk giriş
`https://sənin-saytın.vercel.app/admin.html` — burada `ADMIN_PASSWORD` ilə (Vercel-də təyin etdiyin) daxil ol, "Ödəniş/WhatsApp" tabında Payriff və Green-API məlumatlarını (Merchant ID, API key və s.) elə admin paneldən daxil edib "Yadda saxla" et — bunlar Supabase-in `payment_settings`/`whatsapp_settings` cədvəllərinə yazılacaq.

### 8. Test et
- Sandbox/test açarları ilə əvvəlcə sına (real pul riski olmadan)
- Sonra kiçik, real bir test sifarişi ver

## Struktur

```
bazaa-app/
├── config/
│   └── supabase.config.js       (client-safe, brauzerdə görünür)
├── api/
│   ├── create-payment.js        (ödəniş linki yaradır)
│   ├── payment-webhook.js       (Payriff-dən "ödənildi" bildirişi qəbul edir, WhatsApp göndərir)
│   └── admin-settings.js        (gizli tənzimləmələri oxuyur/yazır)
├── public/
│   ├── index.html               (mağaza)
│   └── admin.html                (admin panel)
├── sql/
│   ├── schema.sql
│   └── functions.sql
├── .env.example                  (server gizli açarları — doldurub .env et, GİT-ə YÜKLƏMƏ)
├── .gitignore
└── package.json
```

## Nə əskikdir (özün tamamlamalısan və ya mənə tapşırmalısan)

- `product.html` (tək məhsul səhifəsi) — hazırda `index.html`-dən link gedir, amma səhifə hələ yazılmayıb
- Checkout axını (səbət, sifariş forması) — `index.html`-ə əlavə edilməlidir
- Trafik statistikasının admin paneldə qrafik (bar chart) forması — hazırda yalnız ümumi say göstərilir
