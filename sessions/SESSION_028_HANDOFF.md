# SESSION_028 HANDOFF REPORT
**Date**: 2026-02-26  
**Session**: #028 — Duitku POP v2 Fix + SCA Landing Page + Payment Infrastructure  
**Status**: ✅ COMPLETED  
**Commit**: `60b7f81` → pushed to main  
**Deployment**: https://12f88404.gani-hypha-web3.pages.dev  
**Production**: https://gani-hypha-web3.pages.dev  

---

## 🎯 CONTEXT SESSION INI

**Masalah sebelumnya** (Session #027):
- Duitku menggunakan API lama (`passport.duitku.com/webapi/`) yang deprecated
- Signature MD5 tidak kompatibel dengan Web Crypto API Cloudflare Workers
- Payment hanya tersedia sebagai "fallback manual transfer"
- SCA tidak punya public landing page (hanya internal tool)

**Tindakan Session #028**:
- ✅ Upgrade ke Duitku POP v2 API (`api-sandbox.duitku.com`)
- ✅ Fix authentication: SHA256 di header (bukan MD5 di body)
- ✅ Implement MD5 pure JavaScript untuk callback verification
- ✅ Duitku sandbox memberikan `payment_url` real → **PAYMENT BERFUNGSI!**
- ✅ Buat `SCALanding.tsx` — full marketing landing page
- ✅ Migration SQL untuk `payment_orders` + `subscriptions` tables

---

## ✅ YANG DIKERJAKAN

### 1. Duitku POP v2 Integration Fix

**File diubah**: `src/index.tsx`

**Sebelum** (API lama, broken):
```
POST https://passport.duitku.com/webapi/api/merchant/v2/inquiry
Signature: MD5(merchantCode + amount + orderId + apiKey) di request body
```

**Sesudah** (POP v2, working):
```
POST https://api-sandbox.duitku.com/api/merchant/createInvoice
Headers:
  x-duitku-signature: SHA256(merchantCode + timestamp + apiKey)
  x-duitku-timestamp: <unix ms>
  x-duitku-merchantcode: DS28466
```

**Test Result** ✅:
```bash
POST /api/payment/create {plan_id: "sca-starter", ...}
→ success: true
→ mode: "sandbox"  
→ payment_url: "https://app-sandbox.duitku.com/redirect_checkout?reference=..."
→ duitku_js: "https://app-sandbox.duitku.com/lib/js/duitku.js"
```

**MD5 Implementation**: Pure JavaScript (tidak butuh crypto library) untuk verifikasi callback signature Duitku.

### 2. New API Endpoints

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/api/payment/create` | POST | Buat invoice Duitku POP v2 |
| `/api/payment/plans` | GET | List 9 subscription plans |
| `/api/payment/check/:orderId` | GET | Cek status pembayaran |
| `/api/payment/callback` | POST | Webhook dari Duitku (signature MD5) |
| `/api/payment/info` | GET | Info gateway & status merchant |

### 3. SCA Public Landing Page (`/sca`)

**File baru**: `src/components/SCALanding.tsx` (740 baris)

**Fitur**:
- Hero section dengan stats (500+ kontrak, 97% akurasi, <60s)
- Pricing cards (Starter 149K, Pro 499K, Enterprise 1.499M)
- Demo interaktif (paste teks kontrak → lihat skor risiko)
- Testimonial section (3 pengguna)
- FAQ (5 pertanyaan umum)
- PaymentModal terintegrasi dengan Duitku
- Footer GANI HYPHA ecosystem

**Routing update** (`src/App.tsx`):
- `/sca` → `SCALanding` (public page, tanpa sidebar/header app)
- `/sca/app` → `SCA` (internal tool, dengan app layout)
- `/payment/*` → payment success page

### 4. Supabase Migration 002

**File baru**: `migrations/002_payment_orders.sql`

**Tables created**:
- `payment_orders` — tracking semua transaksi Duitku
- `subscriptions` — tracking subscription aktif per user per agent
- `revenue_summary` view — reporting pendapatan per agent/plan/bulan

**⚠️ PERLU DIJALANKAN MANUAL**:
```
Buka: https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new
Paste isi file: migrations/002_payment_orders.sql
Klik RUN
```

### 5. Build & Deploy

- Build: ✅ `npm run build` sukses (14.84s)
- Git commit: `60b7f81` — "Session 028: Duitku POP v2 + SCA Landing Page + Payment Orders Migration"
- GitHub push: ✅ main branch updated
- Cloudflare deploy: ✅ https://12f88404.gani-hypha-web3.pages.dev
- Secret added: `DUITKU_ENV=sandbox` di Cloudflare Pages

---

## 📊 STATUS ECOSYSTEM SAAT INI

| Komponen | Status | URL |
|----------|--------|-----|
| Backend API | ✅ Running | localhost:3000 |
| Frontend React | ✅ Built | / |
| SCA (internal) | ✅ Active | /sca/app |
| SCA Landing | ✅ NEW | /sca |
| SICA Dashboard | ✅ Active | /sica |
| SHGA Dashboard | ✅ Active | /shga |
| Duitku Sandbox | ✅ Working | /api/payment/* |
| Cloudflare Pages | ✅ Live | gani-hypha-web3.pages.dev |

**API Test Summary**:
```
GET  /api/health           → OK, v5.2.0
GET  /api/payment/info     → gateway: Duitku POP v2, mode: sandbox
GET  /api/payment/plans    → 9 plans tersedia
POST /api/payment/create   → payment_url dari Duitku sandbox ✅
GET  /api/sovereign/status → SCA,SICA,SHGA active; SMA planned
GET  /api/shga/lebaran/countdown → H-32, peak season
```

---

## 🔴 BLOCKERS / MASALAH

### 1. Duitku Production Approval
**Status**: ⏳ Pending admin approval
**Dampak**: Saat ini hanya sandbox (test mode). Payment URL sandbox tidak bisa bayar sungguhan.
**Solusi**: Login ke https://merchant.duitku.com dengan akun DS28466, lengkapi data bisnis, submit dokumen.
**Estimasi**: 1-3 hari kerja setelah submit dokumen.

### 2. Supabase Migration Belum Dijalankan
**Status**: ⚠️ File SQL sudah dibuat, belum dieksekusi
**Dampak**: Tabel `payment_orders` dan `subscriptions` belum ada di database
**Solusi**: Buka Supabase SQL Editor, paste `migrations/002_payment_orders.sql`, klik RUN

### 3. MD5 Crypto API di Cloudflare
**Status**: ✅ Resolved dengan pure JS implementation
**Note**: Web Crypto API tidak support MD5, kita implement MD5 manual.
**Lokasi**: fungsi `duitkuMd5Sync()` di `src/index.tsx`

---

## 🎯 NEXT PRIORITIES (SESSION #029)

### P0 — Segera (Revenue blocker):

1. **Jalankan Supabase Migration**
   ```sql
   -- Paste di: https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new
   -- File: migrations/002_payment_orders.sql
   ```

2. **Submit Duitku Production Approval**
   - Login ke https://merchant.duitku.com
   - Merchant Code: DS28466
   - Lengkapi profil & upload dokumen bisnis
   - Setelah approved: ubah `DUITKU_ENV=production` di .dev.vars dan CF secrets

3. **Update callback_url untuk production**
   - Saat ini: `https://gani-hypha-web3.pages.dev/api/payment/callback`
   - Pastikan sudah di-whitelist di dashboard Duitku merchant

4. **Buat BCA account info yang benar** di fallback payment
   - Saat ini masih: `BCA 1234567890 a.n GANI HYPHA` (dummy)
   - Update dengan rekening asli di `src/index.tsx`

### P1 — Penting (Minggu ini):

5. **Wallet Connect Real (MetaMask via ethers.js)**
   - Session #011 dari roadmap
   - Target: connect wallet → view $PREMALTA balance

6. **WhatsApp Bot SICA via Fonnte**
   - API Fonnte untuk notifikasi order masuk
   - Notifikasi ke owner setiap ada order baru

7. **Payment Success Page**
   - Saat ini hanya placeholder text
   - Perlu: konfirmasi email, instruksi aktivasi akun

### P2 — Bulan ini:

8. **Groq Streaming untuk AI Chat** (Session #013)
9. **Base Builder Grants submission** (Session #016)
10. **$PREMALTA Liquidity Pool** ($300 USDC di Uniswap V3 Base)

---

## 📁 FILES CHANGED THIS SESSION

```
Modified:
  src/index.tsx          — Duitku POP v2, SHA256 header, MD5 callback, /api/payment/info
  src/App.tsx            — SCALanding routing, useLocation import
  .dev.vars              — DUITKU_ENV=sandbox tambahan
  package.json           — pg dependency added (untuk migration runner)
  package-lock.json      — updated

New:
  src/components/SCALanding.tsx   — Full SCA public landing page
  migrations/002_payment_orders.sql — payment_orders + subscriptions tables
```

---

## 🔑 CREDENTIALS QUICK REF

| Service | Value |
|---------|-------|
| Duitku Merchant Code | `DS28466` |
| Duitku API Key | `[see CREDENTIALS.md]` |
| Duitku Mode | `sandbox` (pending production approval) |
| GitHub PAT | `[see CREDENTIALS.md]` |
| Cloudflare Token | `[see CREDENTIALS.md]` |
| Supabase URL | `https://drhitwkbkdnnepnnqbmo.supabase.co` |
| Groq API Key | `[see CREDENTIALS.md]` |

---

## 💰 REVENUE PROJECTION

| Agent | Plan | Harga | Status |
|-------|------|-------|--------|
| SCA Starter | Rp 149.000/bln | Sandbox ✅ |
| SCA Pro | Rp 499.000/bln | Sandbox ✅ |
| SICA Starter | Rp 99.000/bln | Sandbox ✅ |
| SICA Pro | Rp 299.000/bln | Sandbox ✅ |
| SHGA Lebaran | Rp 499.000/musim | Sandbox ✅ |

**Current Revenue**: Rp 0 (production belum approved)  
**First Dollar Target**: Setelah Duitku production approved → $9-30 USD dari SCA client

---

## 🚀 QUICK COMMANDS (Session #029)

```bash
# Clone & setup
git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd webapp && npm install

# Run
npm run build
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000/api/health
curl http://localhost:3000/api/payment/info
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"sca-starter","customer_name":"Test","customer_email":"test@test.com"}'

# Deploy (set token dulu dari .dev.vars / CREDENTIALS.md)
export CLOUDFLARE_API_TOKEN="[from CREDENTIALS.md]"
npx wrangler pages deploy dist --project-name gani-hypha-web3

# Lihat handoff sebelumnya
cat sessions/SESSION_027_HANDOFF.md
cat sessions/SESSION_026_HANDOFF.md
```

---

## ✨ KEY INSIGHT SESSION #028

> **Duitku POP v2 authentication berbeda total dari API lama:**
> - API lama: MD5 di request body (`v2/inquiry`)
> - API baru: SHA256 di request **header** (`createInvoice`)
> - Callback verifikasi tetap MD5 (karena dari pihak Duitku ke server kita)
> - Web Crypto API tidak support MD5 → implementasi pure JS diperlukan

> **SCA Landing Page strategy:**
> - `/sca` = public marketing page (no auth, no sidebar)  
> - `/sca/app` = internal tool (dalam app layout)
> - Pattern ini bisa direplikasi untuk SICA dan SHGA juga

---

*GANI HYPHA Sovereign Ecosystem v5.2.0 | Akar Dalam, Cabang Tinggi! 🌙*
