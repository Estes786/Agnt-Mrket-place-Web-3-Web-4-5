# 🎁 SESSION #022 — SOVEREIGN HAMPER & GIFT AGENT (SHGA)
## Product Requirements Document (PRD) + Design + Architecture
### Version: 1.0 MASTER | Date: February 26, 2026 | Status: ✅ READY TO BUILD

---

## 🎯 OVERVIEW PRODUK

### Apa itu SHGA?
**Sovereign Hamper & Gift Agent (SHGA)** adalah platform AI Agent untuk bisnis hamper dan gift di Indonesia, fokus pada:
- **Hamper Lebaran** (musiman, MASSIVE market — Rp 12+ triliun/tahun)
- **Hamper Corporate** (Christmas, company anniversary, client appreciation)
- **Wedding Gift Registry** (modern digital gift registry)
- **Birthday & Personal Gifting** (personalized AI-curated gifts)
- **UMKM Hamper Producer** (produsen hamper yang butuh platform)

### Tagline
> *"AI yang membantu bisnis hamper Anda naik kelas — dari order manual ke platform sovereign."*

### Market Size Indonesia
```
Hamper Lebaran Market: Rp 12+ TRILIUN/tahun
- 95% bisnis masih manual (WA + transfer bank)
- Peak season: 2 bulan sebelum Lebaran
- Corporate orders: 10,000 - 100,000 pcs/perusahaan

Wedding Gift Indonesia: Rp 3+ TRILIUN/tahun
- Milenial prefer digital gift
- Average per wedding: 200-500 guests

Birthday Gifts: Rp 2+ TRILIUN/tahun
```

### Target Market (Segmented)
1. **UMKM Hamper (Primary)**: Produsen hamper rumahan & menengah
2. **Toko Oleh-oleh & Gift Shop**: Yang butuh platform digital
3. **Corporate Gift Coordinator**: Admin/procurement perusahaan
4. **Wedding Organizer**: WO yang include hamper service
5. **Event Organizer**: Corporate events, reunion, etc.

---

## 💰 BUSINESS MODEL & MONETISASI

### Revenue Model SHGA

#### Model 1: SaaS Subscription (Bisnis Hamper)
```
TIER BASIC — Rp 199K/bulan (~$12)
  ✅ Catalog digital (up to 50 produk)
  ✅ Order management (up to 200 order/bulan)
  ✅ Basic invoice + surat jalan
  ✅ WhatsApp integration
  ✅ 1 Admin user

TIER ARTISAN — Rp 599K/bulan (~$36)
  ✅ Semua Basic +
  ✅ Unlimited catalog
  ✅ AI gift recommendation engine
  ✅ Custom packaging designer
  ✅ Corporate bulk order management
  ✅ Analytics dashboard
  ✅ 3 Admin users + delivery tracking

TIER SOVEREIGN — Rp 1,899K/bulan (~$115)
  ✅ Semua Artisan +
  ✅ White-label platform (custom domain)
  ✅ AI demand forecasting
  ✅ Supplier management AI
  ✅ Multi-warehouse inventory
  ✅ API access penuh
  ✅ Dedicated WhatsApp support
  ✅ Web3 payments ($HYPHA)
```

#### Model 2: Marketplace Commission (Phase 2)
```
SHGA Marketplace:
- Produsen hamper list produk
- Pembeli cari & beli langsung
- Komisi: 3-8% per transaksi
- Featured listing: Rp 500K/bulan
```

#### Model 3: AI Gift Consulting (B2B)
```
Corporate Gift Planning:
- Curated gift basket for 1000+ recipients
- AI persona matching (gift sesuai jabatan)
- Bulk discount negotiation dengan suppliers
- Price: Rp 50K/recipient (min 100 pcs)
```

### Revenue Projections
```
Month 1:  8 Basic + 3 Artisan = (8×199K) + (3×599K) = Rp 3,389K (~$205)
Month 3:  25 Basic + 10 Artisan + 2 Sovereign = Rp 11,773K (~$715)  
Month 6:  80 Basic + 30 Artisan + 8 Sovereign = Rp 34K+ (~$2,060)
Month 12: 200 Basic + 80 Artisan + 20 Sovereign = Rp 87K+ (~$5,300)

Peak Season (Ramadan/Lebaran - 2 bulan):
- 3x revenue normal
- Banyak UMKM mau langganan temporary
- Bundle "Hamper Lebaran Package" Rp 500K/musim
```

---

## 🏗️ ARSITEKTUR TEKNIS SHGA

### Stack Teknologi
```
Frontend:  React 19 + Tailwind CSS + Recharts + React-DnD (drag-drop hamper builder)
Backend:   Hono v4 + Cloudflare Workers
Database:  Supabase PostgreSQL + Cloudflare R2 (product images)
AI Engine: Groq llama-3.3-70b (GIFT RECOMMENDATION + PERSONALIZATION)
Search:    Supabase Full-text Search (product catalog)
Auth:      Supabase Auth (email) + Web3Auth (wallet optional)
Payments:  Midtrans (IDR) + Stripe (USD untuk corporate/expat)
Shipping:  JNE/JNT/SiCepat API integration
WhatsApp:  Fonnte/WAppin API
```

### System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                     SHGA PLATFORM v1.0                          │
│                                                                 │
│  ┌───────────────┐      ┌─────────────────┐   ┌─────────────┐  │
│  │  Hamper       │      │   Hono API       │   │  Supabase   │  │
│  │  Builder UI   │─────▶│   (CF Workers)   │──▶│  + R2       │  │
│  │  (React 19)   │      │                 │   │  Storage    │  │
│  └───────────────┘      └────────┬────────┘   └─────────────┘  │
│          │                       │                              │
│  ┌───────▼──────┐      ┌────────▼────────┐   ┌─────────────┐  │
│  │  Corporate   │      │   Groq AI        │   │  Midtrans   │  │
│  │  Order Portal│      │   Engine         │   │  Payment    │  │
│  └───────────────┘      └─────────────────┘   └─────────────┘  │
│          │                       │                              │
│  ┌───────▼──────┐      ┌────────▼────────┐   ┌─────────────┐  │
│  │  WhatsApp   │       │   JNE/JNT/       │   │  Analytics  │  │
│  │  Bot        │       │   SiCepat API    │   │  Dashboard  │  │
│  └─────────────┘       └─────────────────┘   └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA SHGA

```sql
-- SHGA Core Tables

-- 1. Gift Businesses (Producers/Sellers)
CREATE TABLE shga_businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  business_type TEXT CHECK (business_type IN ('umkm', 'toko_gift', 'corporate', 'wedding_org', 'event_org')),
  tier TEXT DEFAULT 'basic' CHECK (tier IN ('basic', 'artisan', 'sovereign')),
  -- Web3
  wallet_address TEXT,
  hypha_balance NUMERIC DEFAULT 0,
  -- Profile
  logo_url TEXT,
  banner_url TEXT,
  tagline TEXT,
  specialties JSONB DEFAULT '[]', -- ['hamper_lebaran', 'wedding', 'corporate']
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Catalog (Hamper Items & Gift Items)
CREATE TABLE shga_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES shga_businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'hamper_lebaran', 'hamper_natal', 'hamper_wedding', 
    'hamper_corporate', 'gift_personal', 'souvenir', 
    'parcel', 'subscription_box', 'custom'
  )),
  -- Pricing
  base_price NUMERIC NOT NULL,
  price_100pcs NUMERIC, -- bulk pricing
  price_500pcs NUMERIC,
  price_1000pcs NUMERIC,
  -- Customization
  can_be_customized BOOLEAN DEFAULT FALSE,
  customization_options JSONB DEFAULT '[]',
  -- Product details
  weight_grams INTEGER,
  dimensions JSONB, -- {length, width, height}
  contents JSONB DEFAULT '[]', -- [{item_name, qty, brand}]
  image_urls JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  -- Occasion targeting
  occasions JSONB DEFAULT '[]', -- ['lebaran', 'wedding', 'corporate']
  recipient_types JSONB DEFAULT '[]', -- ['bos', 'klien', 'rekan_kerja']
  -- Availability
  is_active BOOLEAN DEFAULT TRUE,
  min_order INTEGER DEFAULT 1,
  lead_time_days INTEGER DEFAULT 3, -- waktu produksi
  stock_available INTEGER DEFAULT 0,
  -- AI metadata
  ai_tags JSONB DEFAULT '[]',
  ai_persona_match JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gift Orders
CREATE TABLE shga_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES shga_businesses(id),
  order_number TEXT UNIQUE NOT NULL,
  -- Orderer info
  orderer_name TEXT NOT NULL,
  orderer_phone TEXT NOT NULL,
  orderer_email TEXT,
  orderer_company TEXT,
  -- Order type
  order_type TEXT CHECK (order_type IN ('individual', 'corporate', 'wedding', 'event')),
  occasion TEXT,
  -- Items
  items JSONB NOT NULL DEFAULT '[]',
  -- Recipient list (for bulk/corporate orders)
  recipient_count INTEGER DEFAULT 1,
  recipients JSONB DEFAULT '[]', -- [{name, address, phone, message}]
  -- Gift message & customization
  gift_message TEXT,
  custom_ribbon_text TEXT,
  packaging_preference TEXT,
  -- Financials  
  unit_price NUMERIC NOT NULL,
  quantity INTEGER DEFAULT 1,
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'packed', 
    'shipped', 'delivered', 'completed', 'cancelled'
  )),
  payment_status TEXT DEFAULT 'unpaid',
  -- Shipping
  shipping_provider TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  -- AI notes
  ai_recommendation_used BOOLEAN DEFAULT FALSE,
  ai_notes TEXT,
  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Gift Recommendations (AI-generated)
CREATE TABLE shga_gift_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  recipient_persona JSONB, -- {role, gender, age_range, relationship}
  occasion TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  recommended_products JSONB DEFAULT '[]',
  ai_reasoning TEXT,
  personalized_message TEXT,
  click_through_to_order BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Corporate Gift Programs
CREATE TABLE shga_corporate_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES shga_businesses(id),
  company_name TEXT NOT NULL,
  program_name TEXT, -- "Hamper Lebaran 2026 PT ABC"
  occasion TEXT,
  delivery_date DATE,
  total_recipients INTEGER NOT NULL,
  budget_per_recipient NUMERIC,
  total_budget NUMERIC,
  product_id UUID REFERENCES shga_products(id),
  customization_required BOOLEAN DEFAULT FALSE,
  customization_spec TEXT,
  status TEXT DEFAULT 'quote_requested',
  recipients_file_url TEXT, -- CSV upload
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Wedding Gift Registry
CREATE TABLE shga_gift_registries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES shga_businesses(id),
  couple_name TEXT NOT NULL,
  wedding_date DATE,
  registry_code TEXT UNIQUE NOT NULL,
  registry_url TEXT,
  products_wished JSONB DEFAULT '[]',
  total_contributions NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Inventory for Hamper Contents
CREATE TABLE shga_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES shga_businesses(id),
  item_name TEXT NOT NULL,
  category TEXT, -- 'food', 'beverage', 'packaging', 'ribbon'
  unit TEXT,
  current_stock NUMERIC DEFAULT 0,
  min_stock INTEGER DEFAULT 50,
  cost_per_unit NUMERIC,
  supplier_name TEXT,
  supplier_contact TEXT,
  last_restock_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shga_products_business ON shga_products(business_id);
CREATE INDEX idx_shga_products_category ON shga_products(category);
CREATE INDEX idx_shga_orders_business ON shga_orders(business_id);
CREATE INDEX idx_shga_orders_status ON shga_orders(status);
CREATE INDEX idx_shga_corporate_business ON shga_corporate_programs(business_id);

-- Enable RLS
ALTER TABLE shga_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shga_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shga_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shga_inventory ENABLE ROW LEVEL SECURITY;
```

---

## 🔌 API ENDPOINTS SHGA

```
AUTH
POST /api/shga/auth/register    ← Daftar bisnis
POST /api/shga/auth/login       ← Login
GET  /api/shga/auth/me          ← Profile

PRODUCTS
GET    /api/shga/products       ← List produk (filter: category, occasion)
POST   /api/shga/products       ← Tambah produk
PUT    /api/shga/products/:id   ← Update produk
DELETE /api/shga/products/:id   ← Hapus produk
GET    /api/shga/products/search ← Search produk

AI GIFT ENGINE
POST   /api/shga/ai/recommend      ← AI recommend hadiah berdasarkan persona
POST   /api/shga/ai/personalize    ← Personalisasi pesan/packaging
POST   /api/shga/ai/demand-predict ← Prediksi demand (peak Lebaran)
POST   /api/shga/ai/corporate-plan ← Buat corporate gift program
POST   /api/shga/ai/message-gen    ← Generate gift message AI

ORDERS
GET    /api/shga/orders           ← List orders
POST   /api/shga/orders           ← Buat order
GET    /api/shga/orders/:id       ← Detail order
PUT    /api/shga/orders/:id       ← Update order
PUT    /api/shga/orders/:id/status ← Update status
GET    /api/shga/orders/:id/track ← Track shipping

CORPORATE
POST   /api/shga/corporate/quote   ← Request corporate quote
GET    /api/shga/corporate/programs ← List programs
POST   /api/shga/corporate/recipients ← Upload recipients CSV
POST   /api/shga/corporate/dispatch  ← Dispatch all orders

REGISTRY (Wedding/Birthday)
POST   /api/shga/registry          ← Buat gift registry
GET    /api/shga/registry/:code    ← View registry (public)
POST   /api/shga/registry/:code/contribute ← Contribute ke registry

ANALYTICS
GET    /api/shga/analytics/revenue   ← Revenue analytics
GET    /api/shga/analytics/products  ← Product performance
GET    /api/shga/analytics/customers ← Customer insights
GET    /api/shga/analytics/seasonal  ← Seasonal forecast

PAYMENTS
POST   /api/shga/payments/midtrans   ← Buat payment link
POST   /api/shga/payments/verify     ← Verify payment
```

---

## 🎨 FRONTEND COMPONENTS SHGA

```
src/shga/
├── pages/
│   ├── Landing.tsx           ← Marketing page
│   ├── Dashboard.tsx         ← Business dashboard
│   ├── Catalog.tsx           ← Kelola katalog produk
│   ├── Orders.tsx            ← Manajemen order
│   ├── Corporate.tsx         ← Corporate order hub
│   ├── Registry.tsx          ← Wedding/Birthday registry
│   ├── Analytics.tsx         ← Reports
│   └── AIAdvisor.tsx         ← AI Gift Advisor chat
│
├── components/
│   ├── HamperBuilder.tsx     ← Drag-drop hamper composer
│   ├── GiftCard.tsx          ← Product card
│   ├── PersonaWizard.tsx     ← AI persona-based recommendation
│   ├── BulkOrderManager.tsx  ← Corporate bulk orders
│   ├── ShippingTracker.tsx   ← Tracking integration
│   ├── GiftMessageEditor.tsx ← AI-assisted message writer
│   ├── SeasonalCalendar.tsx  ← Lebaran/holiday countdown
│   ├── RecipientCSV.tsx      ← CSV upload untuk corporate
│   └── InventoryAlert.tsx    ← Stok alert
│
└── services/
    ├── shgaApi.ts            ← API client
    ├── shippingService.ts    ← JNE/JNT/SiCepat
    └── giftAiService.ts      ← AI gift recommendations
```

---

## 🤖 AI FEATURES DETAIL

### 1. AI Gift Persona Matcher
```
Input: Penerima (jabatan, gender, usia, hubungan) + Budget + Occasion
Output: Top 3 rekomendasi produk dengan alasan + personalized message

Contoh prompt:
"Carikan hadiah untuk:
- Jabatan: Direktur Senior (Bapak, 55 tahun)
- Occasion: Lebaran
- Budget: Rp 500K - Rp 1 juta
- Perusahaan: Manufacturing

Berikan 3 rekomendasi dengan:
1. Nama produk
2. Harga estimasi
3. Alasan cocok
4. Pesan kartu ucapan
5. Packaging suggestion"
```

### 2. AI Corporate Gift Planner
```
Input: 
- Jumlah penerima + jabatan distribution
- Total budget
- Occasion + tanggal
- Company culture

Output:
- Strategi gift per tier jabatan
- Product recommendations per tier
- Total cost calculation
- Timeline procurement
- Suggested message per tier
```

### 3. AI Demand Forecasting (Lebaran)
```
Input: Historical data order + Tanggal Lebaran

Output:
- Prediksi H-45 sampai H+3 dari Lebaran
- Peak day predictions
- Inventory preparation list
- Staffing recommendations
- Recommended discount timing
```

### 4. AI Gift Message Generator
```
Input: Recipient info + sender + occasion + tone preference

Output:
- 3 variasi pesan (formal/semi-formal/personal)
- Bahasa: Indonesia/English/Arabics (untuk Lebaran)
- Optional: Doa khusus Lebaran, anniversary, dll
```

---

## 🌙 LEBARAN SPECIAL FEATURES

### Lebaran Countdown Module
```
- Real-time countdown ke Hari Raya
- "H-X dari Lebaran" indicator
- Last order deadline calculator
  (berdasarkan lead_time + shipping time)
- Emergency express option (premium)
```

### Hamper Lebaran Templates
```
Paket Standar (Rp 150K - Rp 300K):
  - Sirup marjan, biskuit, kue lebaran, kurma
  
Paket Premium (Rp 300K - Rp 750K):
  - Semua standar + minyak goreng premium, teh/kopi premium
  
Paket Executive (Rp 750K - Rp 2 juta):
  - Gourmet food, wine-alternative (sparkling), premium packaging
  
Paket Custom (Rp 500K+):
  - AI-curated sesuai persona penerima
```

### Bulk Corporate Lebaran
```
Feature khusus:
1. Upload Excel file dengan 1000+ nama & alamat
2. Assign produk yang sama untuk semua
3. atau AI-assign berdasarkan jabatan
4. Satu klik → generate semua order
5. Satu payment → multi-delivery
6. Dashboard tracking semua pengiriman
```

---

## 🔗 WEB 2.5 BRIDGE INTEGRATION

### SHGA dalam Ekosistem GANI HYPHA

```
1. SHGA sebagai Blueprint di GANI HYPHA Marketplace
   - "Sovereign Gift Management Agent"
   - Price: 1,500 $HYPHA
   - Monthly yield estimate: 350 $HYPHA

2. NFT Gift Badge System
   - Pembeli dapat NFT "Verified Gift Sender"
   - Business dapat "Verified Hamper Maker" badge
   - Corporate dapat "Premium Corporate Partner" NFT

3. $HYPHA Payment Integration
   - 15% discount untuk pembelian dengan $HYPHA
   - Exclusive Lebaran hamper hanya tersedia via $HYPHA
   - Staking $HYPHA unlock "SOVEREIGN" tier fitur

4. DAO Integration
   - Vote untuk product roadmap SHGA
   - Treasury funding untuk UMKM hamper grant program
   - Community-curated "Best Hamper of the Year"

5. Cross-Agent Synergy dengan SICA
   - Hamper pesan katering SICA untuk event
   - Wedding hamper + wedding catering bundle
   - Discount khusus jika pakai SICA + SHGA
```

---

## 📱 WHATSAPP BOT FLOW SHGA

```
Corporate buyer WA:
"Halo, mau pesan hamper lebaran untuk 500 karyawan.
 Budget Rp 300K/orang. Mau dikirim 2 minggu sebelum lebaran.
 Boleh ada custom tulisan nama perusahaan di ribbon?"

→ AI parse: corporate order, qty 500, budget 300K, custom ribbon
→ Auto-reply dengan pilihan produk + harga
→ Tanya apakah punya file Excel nama karyawan
→ User upload Excel
→ AI konfirmasi total: 500 × Rp 300K = Rp 150 juta
→ Kirim payment link (Midtrans/transfer)
→ Bayar → masuk ke dashboard
→ Proses produksi dimulai
→ Status update tiap hari
→ Delivery notification per recipient
```

---

## 🚀 IMPLEMENTATION ROADMAP SHGA

### Phase 0: MVP (Week 1-2, $0)
```
✅ SHGA Landing page + business registration
✅ Product catalog management
✅ Simple order form + invoice
✅ Basic dashboard
✅ Deploy ke Cloudflare Pages (subdomain shga.gani-hypha-web3.pages.dev)
```

### Phase 1: AI + Payment (Week 3-4)
```
✅ AI Gift Recommendation API
✅ AI Gift Message Generator
✅ Midtrans payment integration
✅ WhatsApp notification
✅ First paying UMKM customer!
```

### Phase 2: Lebaran Season Push (Month 2 - timing critical!)
```
✅ Lebaran countdown + templates
✅ Bulk corporate order feature
✅ Hamper builder drag-drop UI
✅ JNE/JNT shipping integration
✅ Marketing campaign (Instagram, TikTok)
```

### Phase 3: Web3 (Month 3+)
```
✅ $HYPHA payment option
✅ NFT badges (Verified Hamper Maker)
✅ SHGA Blueprint on GANI HYPHA
✅ Cross-agent bundle SICA+SHGA
✅ DAO governance for roadmap
```

---

## 📊 SUCCESS METRICS

```
Week 2:  SHGA MVP live, 1 UMKM registered
Month 1: 10 paying businesses (~$205/month)
Month 2: 30 businesses (Lebaran push, ~$720/month)
Month 3: 80 businesses, 1 corporate client (~$2,000/month)  
Month 6: 250 businesses + marketplace launch (~$7,000+/month)

Combined SICA + SHGA revenue:
Month 6: ~$7,858/month
```

---

## 🔑 KEY DIFFERENTIATORS

```
vs WooCommerce/Tokopedia:
✅ AI-powered gift recommendations (personalized)
✅ Bulk corporate order dengan recipient management
✅ Bahasa Indonesia native + Lebaran season features
✅ WhatsApp-first workflow (sesuai Indonesia)
✅ Web3 native (future-proof)

vs Existing hamper apps:
✅ AI demand forecasting
✅ Multi-outlet management
✅ Cross-agent ecosystem (SICA+SHGA bundle)
✅ HYPHA tokenomics integration
```

---

## ⚡ QUICK START CODE

### Backend: AI Gift Recommendation
```typescript
// POST /api/shga/ai/recommend
app.post('/api/shga/ai/recommend', async (c) => {
  const groqKey = c.env.GROQ_API_KEY
  const { 
    recipientRole,
    recipientGender, 
    recipientAge,
    relationship,
    occasion,
    budgetMin,
    budgetMax,
    senderName,
    companyName
  } = await c.req.json()
  
  const prompt = `Kamu adalah AI Gift Advisor Indonesia yang ahli dalam:
- Budaya dan etika hadiah Indonesia
- Hamper Lebaran, hamper pernikahan, hamper corporate
- Preferensi berdasarkan jabatan dan usia

Rekomendasikan hadiah untuk:
- Penerima: ${recipientRole} (${recipientGender}, ${recipientAge} tahun)
- Hubungan: ${relationship}
- Occasion: ${occasion}
- Budget: Rp ${budgetMin.toLocaleString()} - Rp ${budgetMax.toLocaleString()}
- Pengirim: ${senderName || 'Anonim'}${companyName ? ` (${companyName})` : ''}

Berikan dalam JSON:
{
  "recommendations": [
    {
      "rank": 1,
      "product_name": "...",
      "estimated_price": 0,
      "contents": [],
      "why_suitable": "...",
      "packaging_suggestion": "...",
      "personalized_message": "..."
    }
  ],
  "cultural_tips": "...",
  "timing_suggestion": "..."
}`
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Berikan 3 rekomendasi terbaik.' }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.3
    })
  })
  
  const data = await response.json() as any
  const recommendations = JSON.parse(data.choices[0].message.content)
  
  return c.json({ success: true, ...recommendations })
})
```

---

*SHGA PRD v1.0 | February 26, 2026*
*Status: READY FOR IMPLEMENTATION*
*Next Action: Build Web2.5 Bridge Architecture Doc*
