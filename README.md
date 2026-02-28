# 🧬 GANI HYPHA v5.3 — AI Agent Marketplace Web3/Web4/Web5

> *"Akar Dalam, Cabang Tinggi"* — Deep Roots, High Branches. Gyss! 🙏🏻

## 🌐 URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://gani-hypha-web3.pages.dev |
| **Latest Deploy** | https://92d907d4.gani-hypha-web3.pages.dev |
| **GitHub** | https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5 |

## ✅ Features Selesai (Session #041)

### Bug Fixes — MSHH ERROR (Session #041)
- **[CRITICAL] React Hooks Violation Fixed**: `useState`/`useEffect` sebelumnya dipanggil SETELAH `if (isPublicPage) return` → crash React → CSS dump ke layar
- **[CRITICAL] ErrorBoundary Added**: `AppErrorBoundary` class component di semua level — mencegah blank screen & CSS dump
- **[CRITICAL] Groq Timeout 15s**: `groqFetch()` helper dengan `AbortController` — mencegah freeze tak terbatas
- **[MAJOR] Native Loading Screen**: `#app-loading` HTML screen sebelum React mount — eliminasi blank screen awal
- **[MAJOR] PublicPages Component**: Component terpisah untuk public routes — hooks aman, tidak ada violation

### Performance Fixes (Session #040)
- Main bundle: **794KB → 20KB** (gzip ~6KB) 
- 15+ manual chunks via Vite rollupOptions
- SPA navigation via `history.pushState` + `PopStateEvent`
- Google Fonts non-blocking (`rel=preload` + `onload`)
- Cloudflare cache headers (`public/_headers`)

### Backend Fixes (Session #040-041)
- `bde-empire` plan: Rp 999.000 ✅
- `shga-starter` plan: Rp 199.000 ✅
- `/api/ping` ultra-fast endpoint
- `/api/health` v5.3.0 dengan Supabase + Groq status
- Groq proxy route via `/api/ai/gani` (no key di frontend)

## 🗺️ Route Map

### Public Landing Pages (no auth required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/bde-landing` | BDELanding | Barber Dynasty Empire |
| `/sca-landing` | SCALanding | Sovereign Contract Advisor |
| `/sica-landing` | SICALanding | Smart Invoice & Catering AI |
| `/shga-landing` | SHGALanding | Sovereign Hamper & Gift AI |
| `/sma-landing` | SMALanding | Sovereign Multi-Industry Agent |
| `/legacy-landing` | SovereignLegacyLanding | Family Legacy Vault |
| `/sovereign-barber` | SovereignBarber | Sovereign Barber App |
| `/sovereign-legacy` | SovereignLegacy | Sovereign Legacy App |
| `/store` | SovereignStore | Sovereign Agent Store |
| `/holyybd` | HOLYYBDLanding | HOLYYBD Documentation |
| `/i` | SCALanding | Short URL untuk SCA |

### App Routes (main dashboard)
| Route | Component |
|-------|-----------|
| `/` | Marketplace |
| `/dashboard` | Command Center |
| `/architect` | Architect Mode |
| `/tokenomics` | Tokenomics |
| `/premalta` | $PREMALTA Dashboard |
| `/store` | Sovereign Store |
| ... | 20+ more routes |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ping` | GET | Ultra-fast health check |
| `/api/health` | GET | Full system status |
| `/api/ai/gani` | POST | Groq AI chat (GANI) |
| `/api/ai/chat` | POST | AI chat with context |
| `/api/payment/create` | POST | Buat transaksi Duitku |
| `/api/payment/callback` | POST | Payment webhook |
| `/api/blockchain/block` | GET | Latest ETH block |
| `/api/blockchain/gas` | GET | Gas price |

## 💳 Payment Plans

### BDE (Barber Dynasty Empire)
- `bde-trial`: Rp 0 (gratis)
- `bde-starter`: Rp 149.000
- `bde-pro`: Rp 349.000
- `bde-enterprise` / `bde-empire`: Rp 999.000

### SCA (Sovereign Contract Advisor)
- `sca-trial`: Rp 0
- `sca-starter`: Rp 149.000
- `sca-pro`: Rp 499.000
- `sca-enterprise`: Rp 1.499.000

### SICA (Smart Invoice & Catering AI)
- `sica-trial`: Rp 0
- `sica-starter`: Rp 99.000
- `sica-pro`: Rp 299.000
- `sica-enterprise`: Rp 999.000

### SHGA (Sovereign Hamper & Gift AI)
- `shga-trial`: Rp 0
- `shga-starter`: Rp 199.000 ✅ NEW
- `shga-pro`: Rp 499.000
- `shga-enterprise`: Rp 1.499.000

### SMA (Sovereign Multi-Industry)
- `sma-trial`: Rp 0
- `sma-starter`: Rp 299.000
- `sma-pro`: Rp 799.000
- `sma-enterprise`: Rp 1.999.000

### SB (Sovereign Barber)
- `sb-trial`: Rp 0
- `sb-starter`: Rp 299.000
- `sb-pro`: Rp 799.000
- `sb-empire`: Rp 1.999.000

### SL (Sovereign Legacy)
- `sl-trial`: Rp 0
- `sl-starter`: Rp 299.000
- `sl-pro`: Rp 799.000
- `sl-forever`: Rp 1.999.000

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + TailwindCSS (PostCSS) |
| **Backend** | Hono v4 + Cloudflare Workers |
| **AI/LLM** | Groq llama-3.3-70b-versatile (15s timeout) |
| **Database** | Supabase PostgreSQL (16 tables, RLS) |
| **Payments** | Duitku POP v2 (QRIS, GoPay, OVO) |
| **Blockchain** | Alchemy (ETH/Base/Polygon/Arb) |
| **Storage** | Pinata/IPFS |
| **Deploy** | Cloudflare Pages (247 PoPs global) |
| **Build** | Vite 6 + manual chunking |

## 🐛 Root Cause Analysis — MSHH ERROR

### Symptom
- CSS raw code muncul di layar (CSS dump)
- Blank screen / freeze saat navigasi
- App crash tanpa pesan error

### Root Causes Found & Fixed

| # | Root Cause | Severity | Fix |
|---|-----------|----------|-----|
| 1 | React Hooks Violation (useState after conditional return) | 🔴 CRITICAL | Pindahkan semua hooks ke atas, buat PublicPages component |
| 2 | Tidak ada ErrorBoundary | 🔴 CRITICAL | AppErrorBoundary di semua level |
| 3 | Groq fetch tanpa timeout (9 calls) | 🟠 HIGH | groqFetch() + AbortController 15s |
| 4 | Blank screen saat pertama load | 🟡 MEDIUM | Native #app-loading HTML screen |
| 5 | window.location.href (full reload) | 🟡 MEDIUM | history.pushState + PopStateEvent |
| 6 | index.html duplikat tags (sebelumnya) | 🟡 MEDIUM | Fixed - 1 clean HTML file |
| 7 | Main bundle 794KB | 🟡 MEDIUM | Lazy loading + 15+ manual chunks → 20KB |

## 📊 Performance Results

| Metric | Before | After |
|--------|--------|-------|
| Main bundle | 794 KB | 20.19 KB (-97%) |
| TTFB | - | **0.1s** |
| Groq timeout | ∞ | 15s max |
| Error recovery | None | ErrorBoundary at every level |
| Loading screen | Blank | Native animated loader |

## 🚀 Deployment

```bash
# Deploy to Cloudflare Pages
export CLOUDFLARE_API_TOKEN="..."
npm run build
npx wrangler pages deploy dist --project-name gani-hypha-web3

# Set secrets
echo "YOUR_KEY" | npx wrangler pages secret put GROQ_API_KEY --project-name gani-hypha-web3
```

## 📅 Session History

| Session | Summary |
|---------|---------|
| #036 | Fix Groq 401, Tailwind CDN → PostCSS, bundle optimization |
| #039 | Add Sovereign Barber, Sovereign Legacy, routing fixes |
| #040 | Ultra deep fix: index.html duplicates, lazy loading, chunk splitting |
| #040b | Non-blocking fonts, Cloudflare cache headers |
| **#041** | **MSHH ERROR FIX: Hooks violation, ErrorBoundary, Groq timeout, native loader** |

---
*Last updated: Session #041 — 2026-02-28*  
*Status: ✅ DEPLOYED & OPERATIONAL*
