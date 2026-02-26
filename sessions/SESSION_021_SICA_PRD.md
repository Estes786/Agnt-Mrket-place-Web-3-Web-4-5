# 🌙 SESSION #021 — SOVEREIGN IFTAR & CATERING AGENT (SICA)
## Product Requirements Document (PRD) + Design + Architecture
### Version: 1.0 MASTER | Date: February 26, 2026 | Status: ✅ READY TO BUILD

---

## 🎯 OVERVIEW PRODUK

### Apa itu SICA?
**Sovereign Iftar & Catering Agent (SICA)** adalah platform SaaS berbasis AI Agent yang dirancang khusus untuk:
- **Bisnis katering Ramadan/Iftar** (musiman tapi high-revenue)
- **Restoran yang butuh manajemen order massal**
- **Wedding & event catering organizer**
- **Cloud kitchen yang butuh AI operations**

### Tagline
> *"AI Agent yang mengelola katering Anda dari order hingga delivery — otomatis, efisien, sovereign."*

### Target Market (Spesifik Indonesia)
1. **Bisnis Katering Ramadan**: Usaha rumahan hingga katering 500 porsi/hari
2. **Restoran dengan Paket Iftar**: Resto yang buka paket buka puasa (Rp 25K - Rp 200K/orang)
3. **Event Catering**: Wedding, corporate, birthday (50-5000 pax)
4. **Cloud Kitchen**: Dapur virtual dengan multiple brand
5. **Wedding Organizer Katering**: Sub-service dari WO yang butuh katering automation

---

## 💰 BUSINESS MODEL & MONETISASI

### Revenue Streams SICA

#### Tier 1: STARTER — Rp 299K/bulan (~$18)
```
Target: Katering rumahan, 50-100 porsi/hari
Features:
  ✅ AI Order Management (up to 100 orders/bulan)
  ✅ Menu Builder digital
  ✅ WhatsApp order integration (template)
  ✅ Basic invoice generator
  ✅ Stock alert sederhana
  
Limit: 100 orders, 1 user, 1 outlet
```

#### Tier 2: PROFESIONAL — Rp 799K/bulan (~$48)
```
Target: Katering menengah, 100-500 porsi/hari
Features:
  ✅ Semua Starter +
  ✅ AI Menu Recommendation (musim, cuaca, event)
  ✅ Multi-outlet management (up to 3)
  ✅ Customer database + repeat order
  ✅ Revenue analytics dashboard
  ✅ Driver/delivery tracking basic
  ✅ Integgrasi Gojek/Grab Food order import
  
Limit: 1000 orders/bulan, 3 user, 3 outlet
```

#### Tier 3: ENTERPRISE — Rp 2,499K/bulan (~$150)
```
Target: Katering besar, event organizer, hotel
Features:
  ✅ Semua Pro +
  ✅ AI Demand Forecasting (prediksi permintaan)
  ✅ Auto procurement (kirim PO ke supplier)
  ✅ Multi-kitchen coordination
  ✅ Staff management + shift planning AI
  ✅ Full API access
  ✅ Custom white-label
  ✅ Dedicated support WhatsApp
  
Limit: Unlimited, unlimited users, unlimited outlets
```

#### Revenue Projections (Conservative)
```
Month 1:  5 Starter + 2 Pro = (5×299K) + (2×799K) = Rp 3,093K (~$187)
Month 3:  15 Starter + 8 Pro + 2 Enterprise = Rp 16K+ (~$970)
Month 6:  40 Starter + 20 Pro + 5 Enterprise = Rp 41K+ (~$2,485)
Month 12: 100 Starter + 50 Pro + 15 Enterprise = Rp 107K+ (~$6,500)
```

### Upsell Opportunities
- **AI Menu Generation**: Rp 50K per menu set
- **Event Package Builder**: Rp 150K per event
- **Training & Onboarding**: Rp 500K/sesi
- **Custom Integration**: Rp 2-5 juta

---

## 🏗️ ARSITEKTUR TEKNIS SICA

### Stack Teknologi
```
Frontend:  React 19 + Tailwind CSS + Recharts
Backend:   Hono v4 + Cloudflare Workers
Database:  Supabase PostgreSQL
AI Engine: Groq llama-3.3-70b (ORDER ANALYSIS + MENU AI)
Queue:     Cloudflare Queue (order processing)
Storage:   Cloudflare R2 (menu images, invoices)
Auth:      Web3Auth (primary) + Email/Password (fallback)
Payments:  Midtrans (IDR) + Stripe (USD)
WhatsApp:  WhatsApp Business API (Fonnte/WAppin)
```

### Diagram Arsitektur
```
┌─────────────────────────────────────────────────────────────┐
│                    SICA PLATFORM                             │
│                                                             │
│  ┌─────────────┐     ┌──────────────┐    ┌───────────────┐ │
│  │  Web App    │────▶│  Hono API    │────▶│  Supabase DB  │ │
│  │  (React 19) │     │  (CF Workers) │    │  PostgreSQL   │ │
│  └─────────────┘     └──────────────┘    └───────────────┘ │
│         │                   │                      │         │
│         │            ┌──────▼──────┐               │         │
│         │            │  AI Engine  │               │         │
│         │            │  (Groq AI)  │               │         │
│         │            └─────────────┘               │         │
│         │                   │                      │         │
│  ┌──────▼──────┐    ┌───────▼──────┐    ┌─────────▼──────┐ │
│  │  WhatsApp   │    │  Payment     │    │  Analytics     │ │
│  │  Bot        │    │  (Midtrans)  │    │  Dashboard     │ │
│  └─────────────┘    └──────────────┘    └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA SICA

### Supabase Tables

```sql
-- SICA Core Tables

-- 1. Catering Business Profiles
CREATE TABLE sica_businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  business_type TEXT CHECK (business_type IN ('rumahan', 'restoran', 'catering_besar', 'cloud_kitchen', 'event')),
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro', 'enterprise')),
  -- Web3 integration
  wallet_address TEXT,
  hypha_balance NUMERIC DEFAULT 0,
  -- Metadata
  logo_url TEXT,
  tagline TEXT,
  capacity_daily INTEGER DEFAULT 0,
  specialties JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Menu Items
CREATE TABLE sica_menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('makanan_berat', 'makanan_ringan', 'minuman', 'dessert', 'paket', 'addon')),
  price NUMERIC NOT NULL,
  price_bulk NUMERIC, -- bulk/wholesale price
  unit TEXT DEFAULT 'porsi',
  min_order INTEGER DEFAULT 1,
  prep_time_minutes INTEGER DEFAULT 30,
  image_url TEXT,
  ingredients JSONB DEFAULT '[]',
  allergens JSONB DEFAULT '[]',
  nutrition_info JSONB,
  is_halal BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  is_ramadan_special BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE sica_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  order_type TEXT CHECK (order_type IN ('delivery', 'pickup', 'dine_in', 'event')),
  event_type TEXT, -- wedding, corporate, ramadan, etc
  event_date TIMESTAMPTZ,
  event_location TEXT,
  pax_count INTEGER DEFAULT 1,
  -- Order details
  items JSONB NOT NULL DEFAULT '[]', -- [{menu_item_id, name, qty, price}]
  special_requests TEXT,
  -- Financials
  subtotal NUMERIC NOT NULL DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  service_charge NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  payment_method TEXT,
  -- AI Analysis
  ai_notes TEXT,
  risk_flags JSONB DEFAULT '[]',
  -- Tracking
  confirmed_at TIMESTAMPTZ,
  prepared_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AI Menu Recommendations
CREATE TABLE sica_ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id),
  recommendation_type TEXT CHECK (recommendation_type IN ('menu_combo', 'pricing', 'restock', 'upsell', 'seasonal')),
  context JSONB,
  recommendation_text TEXT,
  ai_reasoning TEXT,
  confidence_score NUMERIC,
  is_applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Suppliers
CREATE TABLE sica_suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id),
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  items_supplied JSONB DEFAULT '[]',
  payment_terms TEXT,
  rating NUMERIC DEFAULT 4.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Inventory / Stock
CREATE TABLE sica_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id),
  item_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  current_stock NUMERIC DEFAULT 0,
  min_stock_alert NUMERIC DEFAULT 10,
  cost_per_unit NUMERIC,
  supplier_id UUID REFERENCES sica_suppliers(id),
  last_restock_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Revenue Analytics
CREATE TABLE sica_revenue_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES sica_businesses(id),
  order_id UUID REFERENCES sica_orders(id),
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('order_payment', 'deposit', 'refund', 'subscription')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sica_orders_business ON sica_orders(business_id);
CREATE INDEX idx_sica_orders_status ON sica_orders(status);
CREATE INDEX idx_sica_orders_date ON sica_orders(event_date);
CREATE INDEX idx_sica_menu_business ON sica_menu_items(business_id);
CREATE INDEX idx_sica_inventory_business ON sica_inventory(business_id);
CREATE INDEX idx_sica_revenue_business_date ON sica_revenue_logs(business_id, date);

-- Enable RLS
ALTER TABLE sica_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sica_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sica_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sica_inventory ENABLE ROW LEVEL SECURITY;
```

---

## 🔌 API ENDPOINTS SICA

### Backend Routes (Hono)

```
AUTH
POST /api/sica/auth/register      ← Daftar bisnis baru
POST /api/sica/auth/login         ← Login (email/wallet)
GET  /api/sica/auth/me            ← Get profile

MENU MANAGEMENT
GET    /api/sica/menu             ← List semua menu
POST   /api/sica/menu             ← Tambah menu baru
PUT    /api/sica/menu/:id         ← Update menu
DELETE /api/sica/menu/:id         ← Hapus menu
POST   /api/sica/menu/ai-suggest  ← AI suggest menu berdasarkan context

ORDER MANAGEMENT
GET    /api/sica/orders           ← List semua order (filter: status, date)
POST   /api/sica/orders           ← Buat order baru
GET    /api/sica/orders/:id       ← Detail order
PUT    /api/sica/orders/:id       ← Update order
PUT    /api/sica/orders/:id/status ← Update status order
POST   /api/sica/orders/ai-analyze ← AI analisis order masuk

AI ENGINE
POST   /api/sica/ai/menu-recommend    ← AI recommend menu
POST   /api/sica/ai/demand-forecast   ← Prediksi permintaan
POST   /api/sica/ai/order-optimize    ← Optimasi order massal
POST   /api/sica/ai/procurement       ← Buat daftar belanja
POST   /api/sica/ai/chat              ← Chat dengan AI assistant

INVENTORY
GET    /api/sica/inventory            ← Lihat stok
PUT    /api/sica/inventory/:id        ← Update stok
GET    /api/sica/inventory/alerts     ← Stok yang perlu restock

ANALYTICS
GET    /api/sica/analytics/revenue    ← Revenue stats
GET    /api/sica/analytics/orders     ← Order stats
GET    /api/sica/analytics/menu       ← Menu performance
GET    /api/sica/analytics/customers  ← Customer analytics

PAYMENTS
POST   /api/sica/payments/midtrans   ← Buat payment link (IDR)
POST   /api/sica/payments/verify     ← Verify payment
GET    /api/sica/payments/status/:id ← Payment status

WEB3 (PHASE 2)
POST   /api/sica/web3/pay-hypha     ← Bayar dengan $HYPHA token
GET    /api/sica/web3/nft-badge     ← Dapatkan NFT business badge
POST   /api/sica/web3/stake         ← Stake $HYPHA untuk premium features

WHATSAPP BOT
POST   /api/sica/whatsapp/webhook   ← WhatsApp incoming handler
POST   /api/sica/whatsapp/send      ← Kirim WA notification
```

---

## 🎨 FRONTEND COMPONENTS SICA

### Pages & Components

```
src/sica/
├── pages/
│   ├── Landing.tsx          ← Landing page marketing
│   ├── Dashboard.tsx        ← Main dashboard bisnis
│   ├── Orders.tsx           ← Manajemen order
│   ├── Menu.tsx             ← Manajemen menu
│   ├── Analytics.tsx        ← Analytics & reports
│   ├── Inventory.tsx        ← Manajemen stok
│   ├── AIAssistant.tsx      ← Chat dengan AI
│   └── Settings.tsx         ← Settings bisnis
│
├── components/
│   ├── OrderCard.tsx        ← Kartu order individual
│   ├── MenuBuilder.tsx      ← Builder untuk buat menu
│   ├── AIChat.tsx           ← Widget chat AI
│   ├── RevenueChart.tsx     ← Chart revenue (Recharts)
│   ├── OrderTimeline.tsx    ← Timeline status order
│   ├── InventoryAlert.tsx   ← Alert stok menipis
│   ├── DemandForecast.tsx   ← Forecast chart
│   └── WhatsAppWidget.tsx   ← WA integration widget
│
└── services/
    ├── sicaApi.ts           ← API client untuk SICA
    ├── whatsappService.ts   ← WhatsApp API integration
    └── paymentService.ts    ← Payment gateway
```

---

## 🤖 AI FEATURES DETAIL

### 1. AI Order Analysis
```
Input:  Text order dari WhatsApp/Manual
Output: Structured order JSON + validasi + saran upsell

Prompt template:
"Kamu adalah AI katering analyst untuk Indonesia. Analisis order berikut:
[ORDER_TEXT]

Berikan:
1. Items yang dipesan (dengan qty dan estimasi harga)
2. Total pax/porsi
3. Tanggal & waktu delivery
4. Special requests
5. Saran upsell (minuman, dessert, addon)
6. Potensial masalah (stok, waktu, kapasitas)
7. Estimasi food cost (jika ada data menu)
Output dalam JSON."
```

### 2. AI Menu Recommendation (Ramadan Special)
```
Context input:
- Tanggal (hari ke berapa Ramadan)
- Cuaca (panas/hujan)
- Day of week (weekday/weekend)
- Popular items minggu lalu
- Available inventory

Output: Menu recommendations + pricing suggestion
```

### 3. AI Demand Forecasting
```
Input: 
- Historical orders (30 hari terakhir)
- Upcoming events
- Ramadan calendar

Output:
- Prediksi order H+1 sampai H+7
- Rekomendasi stok yang perlu disiapkan
- Estimasi revenue
```

### 4. AI Procurement Generator
```
Input:
- Orders confirmed untuk besok
- Current inventory levels
- Supplier database

Output:
- Shopping list lengkap dengan qty
- Estimated cost
- Prioritas belanja (urgent vs bisa besok)
- Suggested suppliers per item
```

---

## 🌙 RAMADAN SPECIAL FEATURES

### Iftar Package Manager
```
Features:
- Template paket buka puasa (Rp 25K, 50K, 100K, 200K)
- Countdown timer ke waktu buka puasa (Jadwal sholat API)
- Bulk order handling (komunitas masjid, kantor)
- Charity order tracking (untuk donasi)
- "Jariyah Mode": order untuk masjid/panti asuhan
```

### Ramadan Calendar Integration
```
- Auto-detect Ramadan period
- Hari ke-N Ramadan indicator
- Prediction: hari-hari peak (weekend, malam Jumat, 10 malam terakhir)
- Auto-adjust menu recommendations per periode
```

---

## 🔗 WEB 2.5 BRIDGE INTEGRATION

### Koneksi ke GANI HYPHA Ecosystem

```
SICA sebagai "Agent" di GANI HYPHA Marketplace:

1. Register SICA sebagai Blueprint di Marketplace
   - Blueprint Name: "Sovereign Catering Agent"
   - Price: 2,500 $HYPHA
   - Monthly yield estimate: 450 $HYPHA

2. Payment Gateway Web3
   - User bisa bayar subscription SICA dengan $HYPHA/$PREMALTA
   - Discount 20% jika bayar dengan $HYPHA
   - Staking untuk unlock Enterprise features

3. SICA Revenue → HYPHA DAO Treasury
   - 5% dari setiap subscription ke HYPHA DAO treasury
   - Token holders vote untuk product roadmap SICA
   
4. NFT Business Badge
   - Setiap bisnis yang bergabung dapat Soulbound NFT
   - Badge tier: Bronze (Starter), Silver (Pro), Gold (Enterprise)
   - NFT proof of legitimate business
```

---

## 📱 WHATSAPP BOT FLOW

```
User kirim WA ke nomor SICA:
"Pesan nasi box 50 porsi untuk 3 Maret 2026, jam 12 siang, 
 mau ayam bakar + tumis kangkung + kerupuk. 
 Alamat: Jl. Sudirman 123, Jakarta"

→ AI parse order
→ Konfirmasi harga (auto-reply)
→ User reply "OKE" / "bayar"
→ Kirim payment link Midtrans
→ User bayar
→ Otomatis masuk ke dashboard katering
→ Kitchen dapat notifikasi
→ Status update otomatis
```

---

## 🚀 IMPLEMENTATION ROADMAP SICA

### Phase 0: MVP Core (Week 1-2, $0)
```
✅ SICA Landing Page (React)
✅ Register/Login bisnis (Supabase auth)
✅ Menu builder sederhana
✅ Order form manual
✅ Basic dashboard
✅ Deploy ke Cloudflare Pages
```

### Phase 1: AI Integration (Week 3-4, $0 - pakai Groq free)
```
✅ AI Order Analysis endpoint
✅ AI Menu Recommendation
✅ Basic WhatsApp template
✅ Midtrans payment integration
✅ First paying customer!
```

### Phase 2: Ramadan Launch (Month 2, timing is key!)
```
✅ Ramadan package templates
✅ AI Demand Forecasting
✅ WhatsApp Bot full integration
✅ Invoice PDF generator
✅ Marketing push (Ramadan season)
```

### Phase 3: Web3 Bridge (Month 3+)
```
✅ $HYPHA payment option
✅ NFT business badges
✅ SICA Blueprint on GANI HYPHA Marketplace
✅ DAO governance integration
✅ Token staking for premium features
```

---

## 📊 SUCCESS METRICS

```
Week 2:  SICA MVP live (1 catering bisnis registered, system functional)
Month 1: 5 paying customers (Rp 3K+/month = ~$190)
Month 2: 20 customers, Ramadan push (Rp 12K+/month = ~$730)
Month 3: 50 customers, Web3 integrated (Rp 30K+/month = ~$1,830)
Month 6: 150 customers (Rp 95K+/month = ~$5,800)
```

---

## 🔑 COMPETITIVE ANALYSIS

### Kompetitor di Indonesia
1. **Moka POS** — POS system general, bukan catering-specific
2. **Majoo** — inventory focused, no AI
3. **Bolu** — catering app, basic
4. **Manual (WA + Excel)** — TERBESAR kompetitor, 80% katering masih pakai ini!

### SICA Differentiators
```
✅ AI-powered order analysis (no competitor has this)
✅ Ramadan-specific features (unmet market need)
✅ WhatsApp Bot integration (sesuai habit Indonesia)
✅ Web3 native (future-proof)
✅ Harga terjangkau (vs Moka Rp 3-12 juta/tahun)
✅ Bahasa Indonesia penuh
```

---

## ⚡ QUICK START CODE

### Backend Route: POST /api/sica/orders/ai-analyze
```typescript
app.post('/api/sica/orders/ai-analyze', async (c) => {
  const groqKey = c.env.GROQ_API_KEY
  const { orderText, businessId } = await c.req.json()
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SICA_ORDER_ANALYSIS_PROMPT },
        { role: 'user', content: `Analisis order berikut:\n\n${orderText}` }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 0.2
    })
  })
  
  const data = await response.json() as any
  const parsedOrder = JSON.parse(data.choices[0].message.content)
  
  return c.json({ 
    success: true, 
    order: parsedOrder,
    confidence: parsedOrder.confidence || 0.85
  })
})
```

---

*SICA PRD v1.0 | February 26, 2026*
*Status: READY FOR IMPLEMENTATION*
*Next: Build SHGA → Then Web2.5 Bridge → Then implement*
