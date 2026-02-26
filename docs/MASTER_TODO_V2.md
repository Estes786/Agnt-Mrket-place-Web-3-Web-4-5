# ✅ MASTER TODO — UPDATED & PRIORITIZED
## GANI HYPHA — Task Tracker v2.0 (Real Execution Plan)
### Date: February 25, 2026 | Deep-Dive Version

---

## 🔴 P0: CRITICAL — DO TODAY (Week 1)

### 🔧 Platform Stabilization
- [ ] `npm install` — Install semua dependencies
- [ ] `npm run build` — Build project, fix TypeScript errors
- [ ] Verify `.dev.vars` file exists dengan real API keys
- [ ] Get Groq API key FREE dari: https://console.groq.com
- [ ] Get Alchemy API key FREE dari: https://alchemy.com
- [ ] Test build output di dist/ directory
- [ ] Deploy ke CF Pages: `npm run deploy`
- [ ] Verify deployed: `curl https://gani-hypha-web3.pages.dev/api/health`

### 🗄️ Database Setup (Supabase)
- [ ] Login ke https://app.supabase.com
- [ ] Go to: SQL Editor → New Query
- [ ] Paste content dari `migrations/001_initial_schema.sql`
- [ ] Execute migration
- [ ] Create tables: blueprints, deployments, transactions, user_profiles, dao_proposals
- [ ] Enable Row Level Security (RLS) on semua tables
- [ ] Seed initial blueprint data
- [ ] Test: `GET /api/blueprints` returns data

### 🔐 Security Fix
- [ ] Move hardcoded Supabase keys dari `src/index.tsx` ke CF Pages env vars
- [ ] `npx wrangler pages secret put SUPABASE_URL`
- [ ] `npx wrangler pages secret put SUPABASE_ANON_KEY`
- [ ] `npx wrangler pages secret put SUPABASE_SERVICE_KEY`
- [ ] `npx wrangler pages secret put GROQ_API_KEY`
- [ ] `npx wrangler pages secret put ALCHEMY_ENDPOINT`

### 🌐 Real Wallet Connection
- [ ] `npm install ethers` (v6)
- [ ] Update `App.tsx` `handleConnectWallet()`:
  ```typescript
  const provider = new BrowserProvider(window.ethereum)
  const accounts = await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  const balance = await provider.getBalance(address)
  ```
- [ ] Test MetaMask connection in browser
- [ ] Display real ETH balance

---

## 🟡 P1: HIGH — WEEK 2-3 (First Revenue)

### 💼 Sovereign Contract Analyst (SCA) — REVENUE ENGINE
- [ ] Create `src/components/SCA/` directory
- [ ] Build `SCALanding.tsx` — Hero + features + pricing
- [ ] Build `SCAUpload.tsx` — PDF/DOCX drag-drop file uploader
- [ ] Build `SCAResults.tsx` — Analysis output with risk scoring
- [ ] Build `SCADashboard.tsx` — Client analysis history
- [ ] Add backend route: `POST /api/sca/analyze`
  - Accept file content (text)
  - Send to Groq with legal analysis prompt
  - Return structured JSON: { risks, clauses, score, recommendations }
- [ ] Add route: `POST /api/sca/report` — Generate PDF report
- [ ] Test with sample contract (download sample real estate contract)

### 💳 Payment Integration
- [ ] Create Stripe account (free)
- [ ] Add backend route: `POST /api/payments/checkout`
- [ ] Create SCA pricing tiers in Stripe:
  - Basic: $99/month (5 analyses)
  - Pro: $299/month (20 analyses)
- [ ] Build simple checkout flow
- [ ] OR: Use Midtrans for IDR (Rp 500K = ~$30 Basic tier)

### 📣 First Marketing Push
- [ ] Write Twitter thread: "Introducing SCA — AI Contract Analyst for Real Estate"
- [ ] Create 5-min demo video (screen record)
- [ ] Post to LinkedIn targeting real estate professionals in Indonesia
- [ ] Reach out to 10 real estate agents personally
- [ ] Target: 3 beta users at $0 → convert to paid

---

## 🟡 P1: HIGH — MONTH 1 (Platform Polish)

### 🤖 Real Groq AI Integration
- [ ] Test GANI Assistant with real Groq API key
- [ ] Test Blueprint Generator via Architect Mode
- [ ] Implement real Groq streaming (for better UX)
- [ ] Add rate limiting (prevent API abuse)
- [ ] Error handling when Groq is unavailable

### 📊 Real Data Integration
- [ ] Fetch real ETH gas price from Infura/Alchemy
- [ ] Fetch real ETH/USD price from CoinGecko API (free, no key needed)
- [ ] Fetch $PREMALTA price from Uniswap subgraph (after liquidity added)
- [ ] Show real blockchain stats in Dashboard

### 🔗 Alchemy RPC Tests
- [ ] Test: `GET /api/blockchain/block` → real block number
- [ ] Test: `GET /api/blockchain/balance/0x...` → real ETH balance
- [ ] Display: "Block #21234567 | Gas: 25 gwei" in Header

---

## 🟢 P2: MEDIUM — MONTH 2

### 💧 $PREMALTA Liquidity
- [ ] Accumulate $300+ USDC (from SCA revenue or grant)
- [ ] Open Uniswap V3: https://app.uniswap.org/#/add/v3
- [ ] Switch to Base network in wallet
- [ ] Create PREMALTA/USDC pool at $0.001 initial price
- [ ] Deposit: 300,000 PREMALTA + $300 USDC
- [ ] Lock LP tokens: https://uncx.network (builds trust)
- [ ] Update PremaltaDashboard with real Uniswap price via The Graph

### 🏛️ DAO Governance (Gasless via Snapshot)
- [ ] Create Snapshot.org space for HYPHA DAO (free, off-chain)
- [ ] Configure: voting token = $PREMALTA holders
- [ ] Create first proposal: "Add $100 USDC to PREMALTA liquidity"
- [ ] Announce: "DAO governance is LIVE — vote with your PREMALTA"

### 🌐 Grant Applications
- [ ] Apply: Base Builder Grants (https://base.org/grants)
  - Mention: $PREMALTA deployed on Base ✅
  - Mention: GANI HYPHA dApp on Cloudflare Pages ✅
  - Mention: Real users (show SCA clients) ✅
- [ ] Apply: Arbitrum Trailblazer AI Grant
  - Build minimal Arbitrum integration first
  - Position: "AI Agent Marketplace on Arbitrum"
- [ ] Apply: Gitcoin Grants Round (check dates)
- [ ] Apply: Superteam Earn Bounties (Indonesian Web3 community)

---

## 🔵 P3: LOW — MONTH 3+

### ⛓️ Smart Contract Development ($HYPHA)
- [ ] Setup Hardhat development environment
- [ ] Write HYPHA ERC-20 contract (OpenZeppelin template)
- [ ] Write vHYPHA staking contract
- [ ] Write governance contract (compatible with Snapshot)
- [ ] Deploy to Sepolia testnet (FREE)
- [ ] Test all functions
- [ ] Security review (at minimum: 2 people)
- [ ] Deploy to Ethereum mainnet (requires ~0.5-1 ETH)
- [ ] Verify on Etherscan

### 🔄 DeFi Real Integration
- [ ] Integrate Chainlink ETH/USD price feed
- [ ] Show real Uniswap HYPHA/USDC price
- [ ] Real Aave yield rates via The Graph
- [ ] Real gas price oracle

### 🌿 LangChain Workflows (AI Upgrade)
- [ ] Wire LangChain for multi-step Blueprint generation
- [ ] Memory persistence for GANI Assistant conversations
- [ ] Tool use: Assistant can query blockchain data
- [ ] CrewAI: Multi-agent contract analysis crew

---

## 🔵 P4: FUTURE (Month 4+)

### 📱 Mobile App
- [ ] React Native setup
- [ ] Core screens: Marketplace, Dashboard, Portfolio
- [ ] WalletConnect v2 integration
- [ ] Push notifications (yield alerts, governance)

### 🌏 Expansion
- [ ] Multi-language: Bahasa Indonesia + English
- [ ] Southeast Asia community building
- [ ] Partnership with Indonesian crypto exchanges

---

## 📈 SUCCESS MILESTONES

### Week 1 Milestone ✓
```
□ Platform is live at gani-hypha-web3.pages.dev
□ API health check returns 200 OK
□ Supabase tables created
□ Real wallet connect works
```

### Month 1 Milestone ✓
```
□ First paying SCA client ($100 revenue)
□ Groq AI chat is functional
□ $PREMALTA has liquidity pool
□ 50 PREMALTA holders
```

### Month 2 Milestone ✓
```
□ 5 SCA paying clients ($500/month MRR)
□ Base Builder Grant applied
□ $HYPHA testnet deployed
□ 200+ GitHub stars
□ 100 Twitter/X followers
```

### Month 3 Milestone ✓
```
□ $5,000 total revenue generated
□ $HYPHA mainnet ready
□ DAO governance live (Snapshot)
□ 500+ active users
□ 1 Web3 grant received
```

---

## ⚡ DAILY EXECUTION CHECKLIST

### Every Morning:
```
□ Check: Any failed API calls in CF logs?
□ Check: Any new SCA inquiries?
□ Check: $PREMALTA on-chain activity?
□ Build: Work on P0/P1 task from list
□ Tweet: 1 update about GANI HYPHA progress
```

### Every Week:
```
□ Deploy: Latest code to CF Pages
□ Commit: All changes to GitHub  
□ Review: Revenue tracking (SCA clients)
□ Plan: Next week's priorities
□ Document: Update this TODO with progress
```

---

*Last Updated: February 25, 2026 | Next Review: March 4, 2026*
