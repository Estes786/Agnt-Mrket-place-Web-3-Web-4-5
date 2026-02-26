# 🗺️ SESSION #024 — INTEGRATED TODO & IMPLEMENTATION ROADMAP
## MVP → Web2.5 → Web3 Foundation: Complete Execution Plan
### Version: 1.0 MASTER | Date: February 26, 2026 | Status: ✅ READY TO EXECUTE

---

## 🎯 MASTER PRIORITY FRAMEWORK

```
P0 = DO TODAY / THIS WEEK (Critical for revenue)
P1 = DO THIS MONTH (Important for growth)
P2 = DO NEXT MONTH (Nice to have, strategic)
P3 = FUTURE (Token, DAO, Web3 advanced)
```

---

## 🔴 P0: CRITICAL — WEEK 1 (Days 1-7)

### DAY 1-2: Fix GANI HYPHA Core

#### Task 1.1: Groq API Live Test
```bash
# Test Groq from terminal
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer [GROQ_API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Halo, ini test. Balas dalam Bahasa Indonesia."}],
    "max_tokens": 100
  }'

Expected: {"choices":[{"message":{"content":"Halo! Ya, ini test berhasil..."}}]}
```
**Owner**: Dev | **Time**: 30 menit | **Blocker for**: SESSION_009 SCA

#### Task 1.2: Supabase Tables Setup
```sql
-- Go to: https://app.supabase.com/project/drhitwkbkdnnepnnqbmo/sql/new
-- Run: /home/user/webapp/migrations/001_initial_schema.sql
-- Then run SICA tables (SESSION_021_SICA_PRD.md)
-- Then run SHGA tables (SESSION_022_SHGA_PRD.md)
-- Then run shared tables (SESSION_023_WEB25_BRIDGE.md)
```
**Owner**: Dev | **Time**: 1-2 jam | **Blocker for**: All API routes

#### Task 1.3: SCA Backend Route
```typescript
// In src/index.tsx, add POST /api/sca/analyze
// Full code in SESSION_009_SCA_MVP.md
```
**Owner**: Dev | **Time**: 2 jam | **Revenue potential**: $100-500/month

#### Task 1.4: SCA Frontend Enhancement
```
// Update src/components/SCA.tsx
// Add: file upload UI, analysis display, risk score badge
// Connect to /api/sca/analyze
```
**Owner**: Dev | **Time**: 3 jam

#### Task 1.5: Wallet Connect (Real)
```typescript
// Install ethers.js v6
cd /home/user/webapp && npm install ethers@6

// Update Web3Identity.tsx
// Replace fake wallet dengan BrowserProvider flow
// Full code in SESSION_011_WALLET_CONNECT.md
```
**Owner**: Dev | **Time**: 2 jam

#### Task 1.6: Build & Deploy
```bash
npm run build
pm2 restart agent-marketplace-2
curl http://localhost:3000/api/health
curl http://localhost:3000/api/blueprints
curl -X POST http://localhost:3000/api/sca/analyze -H "Content-Type: application/json" -d '{"contractText": "test"}'
```
**Owner**: Dev | **Time**: 30 menit

---

### DAY 3-4: SICA MVP

#### Task 2.1: SICA Backend Routes
```typescript
// Add to src/index.tsx or new file src/routes/sica.ts
// Routes needed (from SESSION_021):
// POST /api/sica/orders/ai-analyze
// POST /api/sica/menu
// GET  /api/sica/orders
// Full code template in SESSION_021_SICA_PRD.md
```
**Time**: 3-4 jam

#### Task 2.2: SICA Database (Supabase)
```sql
-- Run SICA SQL dari SESSION_021_SICA_PRD.md
-- Tables: sica_businesses, sica_menu_items, sica_orders, etc.
```
**Time**: 1 jam

#### Task 2.3: SICA Frontend Page
```typescript
// Create src/components/SICADashboard.tsx (atau rename Marketplace page)
// Minimal MVP:
// - Register bisnis form
// - Add menu form
// - Create order form
// - Order list
// - AI analyze button (call /api/sica/orders/ai-analyze)
```
**Time**: 4-5 jam

#### Task 2.4: SICA Live Test
```bash
# Test SICA dengan order text:
curl -X POST http://localhost:3000/api/sica/orders/ai-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "orderText": "Pesan nasi box 100 porsi, ayam bakar + tumis sayur + es teh, 
                  tanggal 3 Maret jam 12, alamat Jl Sudirman 123 Jakarta",
    "businessId": "test-123"
  }'
```
**Time**: 30 menit

---

### DAY 5-6: SHGA MVP

#### Task 3.1: SHGA Backend Routes
```typescript
// Add routes:
// POST /api/shga/products
// GET  /api/shga/products
// POST /api/shga/orders
// POST /api/shga/ai/recommend
// Full code in SESSION_022_SHGA_PRD.md
```
**Time**: 3 jam

#### Task 3.2: SHGA Database
```sql
-- Run SHGA SQL dari SESSION_022_SHGA_PRD.md
```
**Time**: 1 jam

#### Task 3.3: SHGA Frontend
```typescript
// Create SHGADashboard.tsx
// - Product catalog view
// - Order management
// - AI Gift Advisor form
// - Lebaran countdown widget
```
**Time**: 4 jam

---

### DAY 7: Testing & Push

#### Task 4.1: Full Integration Test
```bash
# Test semua endpoints
curl http://localhost:3000/api/health              # ✅
curl http://localhost:3000/api/blueprints          # ✅ (with Supabase data)
curl http://localhost:3000/api/sca/analyze         # ✅ (Groq working)
curl http://localhost:3000/api/sica/orders         # ✅
curl http://localhost:3000/api/shga/products       # ✅
curl http://localhost:3000/api/shga/ai/recommend   # ✅
```

#### Task 4.2: GitHub Push
```bash
cd /home/user/webapp
git add .
git commit -m "Session #021-024: SICA + SHGA + Web2.5 Bridge + SCA MVP"
git push origin main
```

---

## 🟡 P1: HIGH — MONTH 1 (Days 8-30)

### Week 2: Revenue Engine

#### Task 5.1: Midtrans Integration
```typescript
// Install midtrans-node
npm install midtrans-client

// Create payment routes:
// POST /api/payments/sica/create  ← Create SICA subscription payment
// POST /api/payments/shga/create  ← Create SHGA subscription payment
// POST /api/payments/sca/analyze  ← Pay-per-analysis SCA
// POST /api/payments/webhook      ← Midtrans payment confirmation

// Keys needed (.dev.vars):
// MIDTRANS_SERVER_KEY=
// MIDTRANS_CLIENT_KEY=
// MIDTRANS_IS_PRODUCTION=false (test mode dulu)
```
**Time**: 4 jam | **Revenue**: Direct monetization

#### Task 5.2: SCA Landing Page
```typescript
// Enhanced SCA.tsx atau new page /sca
// Include:
// - Hero: "Analisis Kontrak dengan AI — Rp 149K/analisis"
// - Upload area (drag-drop)
// - Pricing table
// - Sample analysis result
// - CTA: "Coba Gratis Sekarang"
// - Testimonial placeholder
```
**Time**: 4 jam | **Revenue**: SCA first paying client

#### Task 5.3: Email Notification System
```typescript
// Use Resend.com (free 3K emails/month)
// Add RESEND_API_KEY to .dev.vars
// Send welcome email when new business registers
// Send order confirmation emails
// Send analysis complete email (SCA)
```
**Time**: 2 jam

#### Task 5.4: SICA Landing Page (Marketing)
```typescript
// New page: /sica dengan marketing copy
// Target: katering rumahan Indonesia
// Include:
// - "Kelola katering Anda dengan AI"
// - Feature highlights
// - Pricing table (IDR)
// - Demo GIF/screenshot
// - "Daftar Sekarang" CTA
```
**Time**: 3 jam

#### Task 5.5: SHGA Landing Page (Marketing)
```typescript
// New page: /shga dengan marketing copy
// Target: UMKM hamper, "Lebaran siap!"
// Include:
// - "Platform hamper dengan AI"
// - Lebaran countdown timer
// - Pricing table
// - "Mulai Gratis" CTA
```
**Time**: 3 jam

---

### Week 3: WhatsApp Integration

#### Task 6.1: WhatsApp Bot Setup (SICA)
```
// Platform options untuk Indonesia:
// 1. Fonnte (fonnte.com) — Rp 50K/bulan, unlimited pesan
// 2. WAppin (wappin.io) — berbayar
// 3. WhatsApp Business API (official, butuh approval)

// Start dengan Fonnte (paling mudah)
// Setup:
// 1. Daftar di fonnte.com
// 2. Scan QR code dengan WA business number
// 3. Get API Key
// 4. Add to .dev.vars: FONNTE_API_KEY=xxx FONNTE_WA_NUMBER=xxx

// Backend route:
// POST /api/sica/whatsapp/webhook  ← Receive WA messages
// POST /api/sica/whatsapp/send     ← Send WA replies
```
**Time**: 4 jam

#### Task 6.2: Order Auto-Reply Bot
```typescript
// When user sends order text to WA:
// 1. Parse with Groq AI (/api/sica/orders/ai-analyze)
// 2. Auto-reply with:
//    "✅ Order diterima!
//     🍱 100 porsi nasi box ayam bakar
//     📅 3 Maret, jam 12 siang
//     💰 Total: Rp 2,500,000
//     Konfirmasi? Reply: KONFIRMASI [nama dan alamat Anda]"
// 3. If KONFIRMASI → create order → send payment link
```
**Time**: 6 jam

---

### Week 4: Analytics & Polish

#### Task 7.1: Revenue Dashboard Update
```typescript
// Update RevenueHub.tsx dengan REAL data dari Supabase
// Replace hardcoded values dengan:
// - GET /api/sica/analytics/revenue (real SICA revenue)
// - GET /api/shga/analytics/revenue (real SHGA revenue)  
// - GET /api/sca/revenue (real SCA revenue)
// - Total combined dashboard
```
**Time**: 3 jam

#### Task 7.2: Error Handling & Loading States
```typescript
// Semua component perlu:
// - Loading skeleton (bukan blank/freeze)
// - Error boundary
// - Retry button untuk failed API calls
// - Toast notifications untuk actions
```
**Time**: 4 jam

#### Task 7.3: Mobile Responsiveness
```typescript
// Check semua halaman di mobile (375px width)
// Fix layout issues
// Ensure buttons tidak overlap
// WhatsApp floating button di mobile
```
**Time**: 3 jam

---

## 🟢 P2: MEDIUM — MONTH 2 (Days 31-60)

### Web 2.5 Bridge Implementation

#### Task 8.1: Web3Auth Integration
```typescript
// Install Web3Auth
npm install @web3auth/web3auth-wagmi-connector @web3auth/no-modal

// Add to .dev.vars:
// WEB3AUTH_CLIENT_ID=BOZCV1IcmP48NVzBWqRX-HIt3JSjI8dekj-6Ygj9zercthRb0wX_fTESDc2Knbf1z-I_5PlIXPHrqAM58KD7q0M
// VITE_WEB3AUTH_CLIENT_ID=...

// Allow login with: Google, Twitter, Email (no seed phrase!)
// User gets wallet automatically
```
**Time**: 8 jam

#### Task 8.2: HYPHA Rewards System
```sql
-- Create hypha_rewards table
-- Track rewards dari SICA, SHGA, SCA actions
-- "Earn 100 HYPHA for every month of SICA subscription!"
```
**Time**: 4 jam

#### Task 8.3: $PREMALTA Price Feed
```typescript
// The Graph query untuk PREMALTA price
// Update Dashboard dengan real PREMALTA price
// Contract: 0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7
// Network: Base (8453)
```
**Time**: 4 jam (full code in SESSION_014)

#### Task 8.4: PREMALTA Liquidity Pool
```
// Prerequisites: $300 USDC
// Platform: app.uniswap.org/#/add/v3
// Network: Base
// Pair: PREMALTA/USDC
// Initial price: $0.001 per PREMALTA
// Deposit: 300,000 PREMALTA + $300 USDC

// JANGAN skip ini — $PREMALTA tanpa liquidity = useless
```
**Blocked by**: $300 USDC availability

#### Task 8.5: NFT Badges (Visual)
```typescript
// Add badge display di user profile
// Badges: 
//   - "SICA Pioneer" (first 100 SICA users)
//   - "SHGA Artisan" (SHGA pro tier)
//   - "SCA Analyst" (analyzed 10+ contracts)
//   - "Web2.5 Pioneer" (connected wallet)
// Visual only for now, on-chain in Month 3
```
**Time**: 4 jam

---

### Marketing & Outreach

#### Task 9.1: Social Media Setup
```
Twitter/X: @GaniHypha (atau @SovereignHypha)
Content plan:
- Daily: "Build in public" updates (progress screenshots)
- Weekly: "AI tip untuk UMKM Indonesia"
- Weekly: "Web3 explained simply" threads
Target: 100 followers bulan pertama

LinkedIn:
- Target: Indonesian real estate agents (for SCA)
- Corporate procurement teams (for SHGA)
- Restaurant & catering owners (for SICA)
Post: 3x/week

WhatsApp Group:
- Target katering & hamper WhatsApp groups
- Share about SICA + SHGA launch
```

#### Task 9.2: Grant Applications
```
BASE BUILDER GRANTS (Deadline: check base.org/grants)
Application includes:
- $PREMALTA already deployed on Base
- Building real utility dApps
- Indonesian market (underserved)
- Working product demos

GITCOIN GRANTS:
- Apply di grants.gitcoin.co
- Title: "Sovereign AI Agent Marketplace - Indonesia"

SUPERTEAM EARN:
- Check earn.superteam.fun for bounties
```
**Time**: Full day untuk tiap application

---

## 🔵 P3: STRATEGIC — MONTH 3+ (Days 61-90+)

### Web3 Layer

#### Task 10.1: $HYPHA ERC-20 Deployment
```
// Full guide in SESSION_019_HYPHA_CONTRACT.md
// Steps:
// 1. Setup Hardhat
// 2. Write ERC-20 contract
// 3. Test on Sepolia testnet
// 4. Security review (self-audit)
// 5. Deploy to Ethereum mainnet
// Cost: ~0.2-0.5 ETH gas

// WAIT until platform has revenue first!
```
**Blocked by**: Revenue > $2K/month

#### Task 10.2: DAO Governance (Snapshot)
```
// Full guide in SESSION_015_DAO_GOVERNANCE.md
// Setup Snapshot space: gani-hypha.eth
// First proposal: GHP-001 (PREMALTA liquidity)
// Voting token: $PREMALTA holders
```
**Time**: 2 jam (after PREMALTA has holders)

#### Task 10.3: SICA + SHGA as Marketplace Blueprints
```typescript
// Register SICA as Blueprint in GANI HYPHA Marketplace
// Blueprint data:
{
  "name": "Sovereign Catering Agent (SICA)",
  "description": "AI-powered catering management for Indonesian UMKM",
  "price_hypha": 2500,
  "tier": "Enterprise",
  "industry": "Food & Catering",
  "monthly_yield_estimate": 450
}

// Same untuk SHGA
```
**Time**: 2 jam

#### Task 10.4: GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
# Full config in SESSION_017_CICD.md
# Trigger: push to main
# Steps: build → test → deploy CF Pages
```
**Time**: 3 jam

---

## 📊 REVENUE MILESTONE TRACKER

```
WEEK 1 TARGET: Platform live + SCA working
  Revenue: $0 → $0 (foundation week)
  
WEEK 2 TARGET: First SCA paying client
  Revenue: $0 → $30-100 (1-3 SCA analyses)
  
WEEK 3 TARGET: First SICA/SHGA subscriber
  Revenue: $30 → $150-300 (mix SCA + SICA/SHGA)
  
MONTH 1 TARGET: 5+ active subscribers
  Revenue target: $500 USDC
  Breakdown:
  - SCA: 3 clients × $30/mo = $90
  - SICA: 3 businesses × $18/mo = $54
  - SHGA: 3 businesses × $12/mo = $36
  - Corporate orders: $100-300
  
MONTH 2 TARGET: $1,500/month
  + Lebaran season boost (SHGA)
  + More SCA clients
  + First Base grant application
  
MONTH 3 TARGET: $3,000/month
  + $PREMALTA liquidity (from Month 1-2 revenue)
  + 20+ subscribers combined
  + First grant received (hopefully)
```

---

## 📋 DAILY EXECUTION CHECKLIST

### Every Morning (15 menit):
```
[ ] Check pm2 logs (server masih running?)
[ ] Check Supabase for new signups/orders
[ ] Reply to any WhatsApp business inquiries
[ ] Check Groq API quota usage
[ ] 1 social media post (progress update)
```

### Every Evening (30 menit):
```
[ ] Commit code ke GitHub
[ ] Update session doc
[ ] Check revenue metrics
[ ] Plan tomorrow's tasks
[ ] Monitor $PREMALTA contract activity (BaseScan)
```

### Every Friday:
```
[ ] Deploy ke CF Pages (production)
[ ] Weekly revenue review
[ ] Update README.md
[ ] Post weekly update di Twitter/LinkedIn
[ ] Grant application check
```

---

## 🔗 DEPENDENCY MAP

```
GROQ_API_KEY ──────────────────► SCA MVP ──► SCA Revenue
                                 SICA AI ──► SICA MVP  
                                 SHGA AI ──► SHGA MVP

SUPABASE_TABLES ──────────────► All API routes work
                                 User profiles work
                                 Revenue tracking works

MIDTRANS ─────────────────────► SCA paid tier
                                 SICA subscription
                                 SHGA subscription

$300 USDC ────────────────────► PREMALTA liquidity
                                 DAO proposal live
                                 $PREMALTA tradeable

SCA Revenue ($100+) ──────────► SICA/SHGA marketing budget
                                 Midtrans subscription
                                 Partial PREMALTA liquidity

$500 USDC TOTAL ──────────────► PREMALTA Uniswap pool live
                                 Platform self-sustaining
                                 Apply for Base grants
```

---

## 🚨 RISK REGISTER

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Groq API quota exceeded | HIGH | MEDIUM | Monitor usage, implement rate limiting |
| Supabase free tier limit | MEDIUM | LOW | Monitor DB size, upgrade if needed |
| Midtrans approval delay | HIGH | MEDIUM | Apply early, use Stripe as backup |
| CF Pages deployment fails | HIGH | LOW | Test locally first, maintain backup |
| No SCA clients in Month 1 | HIGH | MEDIUM | Outreach directly, offer free trial |
| Lebaran timing missed | MEDIUM | LOW | SHGA must be ready H-45 Lebaran |
| $PREMALTA price dump | LOW | HIGH | Focus on utility, not speculation |
| GitHub auth fails | MEDIUM | MEDIUM | Setup GitHub env vars properly |

---

*Integrated TODO & Implementation Roadmap v1.0*
*February 26, 2026 | GANI HYPHA Sovereign Ecosystem*
*"Satu langkah nyata lebih baik dari seribu rencana" — Gyss! 🙏🏻*
