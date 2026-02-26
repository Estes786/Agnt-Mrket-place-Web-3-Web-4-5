# 📋 SESSION #012 — SCA PAYMENT INTEGRATION
## GANI HYPHA — Monetize SCA dengan Midtrans/Stripe
### Status: ⏳ PENDING | Prerequisite: SESSION_009 + 011 DONE

---

## 🎯 TUJUAN SESSION INI

Integrate payment gateway agar SCA bisa menghasilkan revenue nyata.

**Target:** 5 paying clients = $150-$500/bulan

---

## ⚡ SETUP CEPAT

```bash
cd /home/user && git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp && npm install
# Copy .dev.vars dari sessions/CREDENTIALS.md
npm run build && pm2 start ecosystem.config.cjs
```

---

## 📋 TODO LIST SESSION #012

### OPSI A: Midtrans (Recommended untuk Indonesia)

**Kenapa Midtrans:**
- Support semua metode bayar Indonesia (QRIS, GoPay, OVO, BCA Virtual Account)
- Lebih mudah untuk target pasar Indonesia
- Free tier tersedia
- Sudah ada developer mode

**Steps:**
1. Daftar di https://midtrans.com
2. Aktivasi akun sandbox (untuk testing)
3. Dapatkan `Server Key` dan `Client Key`
4. Add ke .dev.vars:
   ```
   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx (sandbox)
   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx (sandbox)
   MIDTRANS_ENV=sandbox
   ```

**Backend Route:**
```typescript
// src/index.tsx — ADD:

app.post('/api/payments/create', async (c) => {
  const { tier, email, walletAddress } = await c.req.json()
  
  const prices = {
    basic: { amount: 149000, name: 'SCA Basic - 3 analisis/bulan' },
    profesional: { amount: 499000, name: 'SCA Profesional - 15 analisis/bulan' },
    biro: { amount: 1499000, name: 'SCA Biro - 50 analisis/bulan' }
  }
  
  const price = prices[tier as keyof typeof prices]
  if (!price) return c.json({ error: 'Invalid tier' }, 400)
  
  const orderId = `SCA-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  // Midtrans Snap API
  const serverKey = c.env.MIDTRANS_SERVER_KEY
  const auth = btoa(`${serverKey}:`)
  
  const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: price.amount
      },
      item_details: [{
        id: tier,
        price: price.amount,
        quantity: 1,
        name: price.name
      }],
      customer_details: {
        email: email || 'customer@example.com'
      }
    })
  })
  
  const data = await response.json() as any
  
  return c.json({
    order_id: orderId,
    token: data.token,
    redirect_url: data.redirect_url
  })
})
```

### OPSI B: Manual Payment (Fallback — Bisa mulai hari ini!)

Kalau belum setup Midtrans, gunakan manual payment dulu:

```
SCA Pricing (Manual):
- Basic: Transfer Rp 149.000 ke [your account]
- Pro: Transfer Rp 499.000 ke [your account]
- Konfirmasi via WhatsApp: [your number]

Cara kerja:
1. User transfer
2. Kamu aktifkan manual di Supabase
3. User dapat full access
```

**Add ke Supabase sca_users table:**
```sql
CREATE TABLE IF NOT EXISTS sca_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  analyses_remaining INTEGER NOT NULL,
  analyses_total INTEGER NOT NULL,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT FALSE,
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### STEP 3: Usage Tracking

Setiap kali `/api/sca/analyze` dipanggil:
```typescript
// Check quota
const subscription = await getSubscription(email)
if (!subscription || subscription.analyses_remaining <= 0) {
  return c.json({ 
    error: 'Kuota habis', 
    message: 'Upgrade ke Pro untuk lebih banyak analisis',
    upgrade_url: '/sca/upgrade'
  }, 402)
}

// Decrement quota
await decrementQuota(subscription.id)
```

### STEP 4: SCA Pricing Page

Update `src/components/SCA.tsx` dengan pricing section:
- 3 tier cards (Basic/Pro/Biro)
- Comparison table  
- CTA buttons
- Success state setelah payment

---

## 💡 TIPS REVENUE CEPAT

**Sebelum payment integration ready:**
1. Post di Twitter: "Testing AI contract analyzer - free for first 10 users"
2. Onboard 10 beta users GRATIS
3. Minta feedback + testimonial
4. Setelah ada testimonial → launch dengan bayar

**Target Week 2:**
- 3 beta users → feedback
- 2 paying Basic @ Rp 149K = Rp 298K (~$18)
- 1 paying Pro @ Rp 499K = Rp 499K (~$30)
- Total: ~$48 (pertama kali!) ✅

---

## 📊 SUCCESS CRITERIA

```
✅ Payment flow works (at least manual/transfer)
✅ Subscription tracked di Supabase
✅ Quota enforcement works (block after 3 free analyses)
✅ User sees upgrade prompt when quota habis
✅ First real payment received 🎉
```

---

*Session #012 | GANI HYPHA | Planned*
*Priority: P1 — REVENUE CRITICAL*
