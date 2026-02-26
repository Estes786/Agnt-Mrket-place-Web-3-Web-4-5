# 👑 MASTER SYSTEM PROMPT — GANI HYPHA MULTI-SESSION MANAGEMENT
## Version: 1.0 FINAL | Date: February 25, 2026
## ⚡ COPY-PASTE INI DI AWAL SETIAP SESSION BARU!

---

## 🔑 IDENTITAS PROYEK

```
PROJECT:      GANI HYPHA — Web3 → Web4 → Web5 Sovereign Ecosystem
GITHUB:       https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git
LIVE URL:     https://gani-hypha-web3.pages.dev
PAT         :      [LIHAT .dev.vars — TIDAK DI-COMMIT]
VERSION:      5.2.0
PHILOSOPHY:   "Akar Dalam, Cabang Tinggi" — Gyss! 🙏🏻
OWNER EMAIL:  elmatador0197@gmail.com
CF PROJECT:   gani-hypha-web3
CF TOKEN:     [LIHAT .dev.vars — TIDAK DI-COMMIT]
```

---

## 🤖 INSTRUKSI UNTUK AI DEVELOPER (BACA DULU SEBELUM KERJA!)

### KONTEKS PENTING:
GANI HYPHA adalah platform AI Agent Marketplace Web3/Web4/Web5 yang dibangun dengan:
- **Frontend**: React 19 + Tailwind CSS 4 + Recharts + Motion
- **Backend**: Hono v4 + Cloudflare Workers (40+ API routes)
- **Database**: Supabase PostgreSQL (drhitwkbkdnnepnnqbmo.supabase.co)
- **AI**: Groq llama-3.3-70b (PRIMARY) + LangChain + CrewAI
- **Deployment**: Cloudflare Pages (wrangler 4)
- **Token #1**: $PREMALTA — 0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7 (Base, DEPLOYED)
- **Token #2**: $HYPHA — ERC-20 Ethereum (PLANNED, belum deploy)

### ATURAN SESSION:
1. **SELALU baca `sessions/SESSION_XXX_*.md` dulu** sebelum coding
2. **JANGAN ulang pekerjaan** yang sudah selesai di session sebelumnya
3. **LANJUTKAN dari checkpoint** yang terakhir
4. **UPDATE session doc** setelah selesai kerja
5. **COMMIT KE GITHUB** di akhir setiap session

### CARA INSTALL & RUN:
```bash
cd /home/user
git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp
npm install
# Copy .dev.vars (lihat sessions/CREDENTIALS.md untuk isinya)
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/api/health  # Verify running
PUSH 
PAT
([LIHAT .dev.vars])
```

---

## 📊 STATUS PROJECT PER SESSION

| Session | Tanggal | Fokus | Status |
|---------|---------|-------|--------|
| SESSION_008 | 25 Feb 2026 | Foundation Setup + Multi-Session System | ✅ DONE |
| SESSION_009 | TBD | SCA MVP Build | 🎯 NEXT |
| SESSION_010 | TBD | Supabase Tables + Real API Integration | ⏳ PENDING |
| SESSION_011 | TBD | Real Wallet Connect (ethers.js) | ⏳ PENDING |
| SESSION_012 | TBD | SCA Landing Page + Payment | ⏳ PENDING |
| SESSION_013 | TBD | Groq Integration Testing + Streaming | ⏳ PENDING |
| SESSION_014 | TBD | $PREMALTA Price Feed (Uniswap/CoinGecko) | ⏳ PENDING |
| SESSION_015 | TBD | DAO Governance (Snapshot.org) | ⏳ PENDING |
| SESSION_016 | TBD | Grant Application Prep (Base Builder) | ⏳ PENDING |
| SESSION_017 | TBD | CI/CD GitHub Actions Setup | ⏳ PENDING |
| SESSION_018 | TBD | Performance Optimization + SEO | ⏳ PENDING |
| SESSION_019 | TBD | $HYPHA ERC-20 Testnet (Sepolia) | ⏳ PENDING |
| SESSION_020 | TBD | Mobile Optimization + PWA | ⏳ PENDING |

---

## 🚨 CURRENT CRITICAL GAPS (UPDATE SETIAP SESSION!)

### 🔴 P0 — CRITICAL (Belum selesai):
- [ ] Supabase tables belum dibuat (jalankan migrations/001_initial_schema.sql)
- [ ] Wallet connect masih FAKE (perlu ethers.js)
- [ ] SCA (Sovereign Contract Analyst) belum dibangun
- [ ] $PREMALTA masih 0 liquidity

### 🟡 P1 — HIGH (Butuh segera):
- [ ] Groq API belum live-tested
- [ ] Payment integration (Midtrans/Stripe) belum ada
- [ ] Real ETH/gas price feed belum connect

### 🟢 P2 — MEDIUM:
- [ ] GitHub Actions CI/CD
- [ ] Error handling yang proper
- [ ] Rate limiting Groq API

---

## 💰 FINANCIAL TRACKER

```
Revenue Goal:    $500 USDC (untuk PREMALTA liquidity)
Current Revenue: $0
SCA Clients:     0
PREMALTA Price:  Undefined (no liquidity)
HYPHA Status:    Simulated (no contract)
```

---

## 🔐 CREDENTIAL QUICK REFERENCE

> ⚠️ JANGAN share file ini secara public! Untuk full credentials lihat `sessions/CREDENTIALS.md`

| Service | Status |
|---------|--------|
| Groq API | ✅ Key ready ([GROQ_KEY_REDACTED]) |
| Supabase | ✅ URL + keys ready |
| Alchemy | ✅ Key ready (TOHei2x...) |
| Pinata | ✅ JWT ready |
| Etherscan | ✅ Key ready |
| ThirdWeb | ✅ Client ID ready |
| Web3Auth | ✅ Client ID ready |
| Privy | ✅ App ID + Secret ready |
| The Graph | ✅ API Key ready |
| Cloudflare | ✅ API Token ready |
| GITHUB     | ✅  PAT READY (lihat .dev.vars)

---

## 📋 PERINTAH PENTING (COPY-PASTE READY)

```bash
# INSTALL & BUILD
cd /home/user/webapp && npm install && npm run build

# START SERVER
pm2 start ecosystem.config.cjs

# TEST SERVER
curl http://localhost:3000/api/health

# DEPLOY KE CLOUDFLARE
CLOUDFLARE_API_TOKEN=[CF_TOKEN] npx wrangler pages deploy dist --project-name gani-hypha-web3

# GIT COMMIT & PUSH
cd /home/user/webapp && git add . && git commit -m "Session XXX: [description]" && git push origin main

# CHECK LOGS
pm2 logs agent-marketplace-2 --nostream

# TEST API ENDPOINTS
curl http://localhost:3000/api/health
curl http://localhost:3000/api/blueprints
curl -X POST http://localhost:3000/api/ai/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
curl http://localhost:3000/api/blockchain/block
```

---

## 🎯 FILOSOFI EKSEKUSI

```
"Setiap session = 1 fitur yang benar-benar selesai"
"JANGAN build setengah-setengah"  
"Revenue dulu, polish nanti"
"Akar Dalam, Cabang Tinggi"

Priority Order:
1. SCA Revenue (bring in $$$)
2. Real Web3 (wallet, price feeds)
3. Token Liquidity ($PREMALTA Uniswap)
4. Smart Contracts ($HYPHA)
5. Ecosystem (DAO, governance)
```

---

*System Prompt Generated: February 25, 2026 | GANI HYPHA v5.2.0*
*Update ini setiap ada progress signifikan*
