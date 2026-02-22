# MasaAz — Deployment Bələdçisi

---

## 1️⃣ TƏK HTML FAYL (Ən sürətli — quraşdırma yoxdur)

**Fayl:** `masaaz-standalone.html`

Brauzerdə birbaşa aç, işləyir.
İnternet bağlantısı lazımdır (Google Fonts + React CDN üçün).

```
masaaz-standalone.html → sağ klik → "Chrome ilə aç"
```

---

## 2️⃣ VİTE / REACT — LOCAL İŞLƏTMƏK

**Tələblər:** Node.js 18+ quraşdırılmış olmalıdır
Node.js yükləmək: https://nodejs.org

**Addımlar:**

```bash
# 1. Qovluğa gir
cd masaaz-vite

# 2. Paketləri yüklə
npm install

# 3. Development serveri işlət
npm run dev
```

Brauzer avtomatik açılır: http://localhost:5173

**Production build (deploy üçün):**
```bash
npm run build
# dist/ qovluğu yaranır — bunu serverə yüklə
```

---

## 3️⃣ VERCEL — (Ən asan, pulsuz)

### A) GitHub vasitəsilə (tövsiyə edilir):

```bash
# 1. GitHub-da repo yarat: github.com/new
# 2. masaaz-vite qovluğunu yüklə:
cd masaaz-vite
git init
git add .
git commit -m "MasaAz ilk versiya"
git remote add origin https://github.com/SENIN_ADIN/masaaz.git
git push -u origin main

# 3. vercel.com → "Import Project" → GitHub repo seç
# 4. Deploy düyməsinə bas → 1 dəqiqədə link hazır olur!
```

### B) Vercel CLI ilə:

```bash
# Vercel CLI quraşdır
npm install -g vercel

# masaaz-vite qovluğuna gir
cd masaaz-vite

# Deploy et
vercel

# Sualları cavabla:
# ? Set up and deploy? → Y
# ? Which scope? → özünü seç
# ? Link to existing project? → N
# ? Project name? → masaaz
# ? In which directory? → ./
# Deploy olunur → link verir: https://masaaz.vercel.app
```

---

## 4️⃣ NETLIFY — (Alternativ, pulsuz)

### A) Drag & Drop (ən sadə):

```bash
# 1. Əvvəlcə build et:
cd masaaz-vite
npm run build

# 2. netlify.com → "Sites" → "Drop your site's output folder here"
# 3. dist/ qovluğunu sürüklə → anında link hazır!
```

### B) Netlify CLI ilə:

```bash
# CLI quraşdır
npm install -g netlify-cli

# Build et
cd masaaz-vite
npm run build

# Deploy et
netlify deploy --prod --dir=dist

# Link verir: https://masaaz.netlify.app
```

---

## 📁 Fayl strukturu

```
masaaz-vite/
├── index.html          ← Ana HTML
├── package.json        ← Dependencies
├── vite.config.js      ← Vite konfiqurasiya
├── vercel.json         ← Vercel konfiqurasiya
├── netlify.toml        ← Netlify konfiqurasiya
└── src/
    ├── main.jsx        ← Entry point
    └── App.jsx         ← Bütün UI kodu

masaaz-standalone.html  ← Tək fayl versiya
```

---

## 🔧 Sonrakı addımlar (Backend üçün)

Real istifadə üçün bunlar lazım olacaq:

- **Verilənlər bazası** — PostgreSQL (restoran, masa, rezervasiya məlumatları)
- **Backend API** — Spring Boot (Java) və ya Node.js/Express
- **Auth** — İstifadəçi girişi (JWT)
- **SMS/Email** — Twilio və ya SendGrid (təsdiq mesajları)
- **Ödəniş** — Stripe və ya yerli ödəniş sistemi

Backend hazır olsun istəsən — növbəti addım budur!
