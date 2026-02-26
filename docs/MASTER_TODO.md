# ✅ TODO / TASK TRACKER
## GANI HYPHA — Development Task List
### Version: 3.1 | Last Updated: 2026-02-23

---

## 🔴 PRIORITY: CRITICAL (Do Now)

### Infrastructure
- [x] Setup project structure from agent-marketplace-2.zip
- [x] Install npm dependencies
- [x] Configure .dev.vars with all API credentials
- [x] Build project (npm run build)
- [x] Start dev server (PM2 + wrangler pages dev)
- [ ] **Deploy to Cloudflare Pages (production)**
- [ ] **Push to GitHub: Agnt-Mrket-place-Web-3-Web-4-5**
- [ ] Set CF Pages environment variables from .dev.vars

### Real API Integrations
- [x] Groq API key configured in aiService.ts
- [x] Supabase URL + anon key configured
- [x] Alchemy endpoint configured
- [x] Pinata JWT configured
- [x] Web3Auth Client ID configured
- [x] Privy App ID configured
- [ ] **Test Groq API live call (verify key works)**
- [ ] **Create Supabase tables (blueprints, deployments, transactions, user_profiles)**
- [ ] **Test Pinata upload with real file**
- [ ] **Test Alchemy RPC getLatestBlock**

---

## 🟡 PRIORITY: HIGH (This Week)

### Backend Hono API Routes
- [ ] Create `src/index.tsx` with Hono routes
  - [ ] `GET /api/blueprints` — Fetch from Supabase
  - [ ] `POST /api/deploy` — Log deployment to Supabase
  - [ ] `POST /api/ai/chat` — Proxy Groq (server-side, secure key)
  - [ ] `GET /api/blockchain/block` — Latest ETH block via Alchemy
  - [ ] `POST /api/ipfs/pin` — Pin via Pinata
  - [ ] `GET /api/dao/proposals` — Fetch proposals from Supabase
  - [ ] `POST /api/dao/vote` — Record vote in Supabase

### Supabase Schema
- [ ] Create tables in Supabase dashboard:
  - [ ] `blueprints` table
  - [ ] `deployments` table  
  - [ ] `transactions` table
  - [ ] `user_profiles` table
  - [ ] `dao_proposals` table
- [ ] Enable RLS on all user-specific tables
- [ ] Create RLS policies
- [ ] Seed blueprints data from constants.ts

### Web3 Real Connections
- [ ] Implement real MetaMask connection in Web3Identity
- [ ] Test Web3Auth MPC login (Google OAuth)
- [ ] Test Privy email login
- [ ] Get real ETH balance via Alchemy
- [ ] Fetch real gas prices via Infura Gas API

---

## 🟢 PRIORITY: MEDIUM (This Month)

### Smart Contracts (Sepolia Testnet)
- [ ] Write HYPHA ERC-20 contract (OpenZeppelin)
- [ ] Write staking contract (vHYPHA)
- [ ] Write DAO governance contract
- [ ] Deploy to Sepolia testnet
- [ ] Verify contracts on Etherscan
- [ ] Test all functions

### DeFi Integrations
- [ ] Real Uniswap V3 quote via The Graph
- [ ] Real Aave position query
- [ ] Real gas price from Infura API
- [ ] Chainlink ETH/USD price feed

### IPFS / Pinata
- [ ] Test pinJSONToIPFS with blueprint data
- [ ] Show real CID in Web3Identity panel
- [ ] Setup IPFS gateway access

---

## 🔵 PRIORITY: LOW (Next Month)

### Feature Additions
- [ ] LangChain workflow builder UI
- [ ] CrewAI agent task monitor
- [ ] LangSmith trace viewer
- [ ] Multi-chain bridge UI (LayerZero)
- [ ] NFT minting for blueprint creators

### Mobile App (Future)
- [ ] React Native port
- [ ] WalletConnect mobile SDK
- [ ] Push notifications for yield events

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for Supabase
- [ ] E2E tests with Playwright
- [ ] Smart contract audit

---

## 📋 DOCUMENTATION TASKS

- [x] Vision & Mission Document
- [x] Product Requirements Document (PRD)
- [x] Architecture Document
- [x] Design Document
- [x] Strategic Document
- [x] Roadmap Document
- [x] This TODO Document
- [ ] **API Reference Documentation**
- [ ] **User Guide / Tutorial**
- [ ] **Smart Contract Documentation**
- [ ] **Security Audit Report**

---

## 🔑 CREDENTIALS CHECKLIST

### Configured & Ready:
- [x] Groq API Key: `[GROQ_KEY_REDACTED]`
- [x] Supabase URL + Key
- [x] Alchemy API Key: `TOHei2xGaHxb...`
- [x] Infura API Key: `db90dda72...`
- [x] Web3Auth Client ID: `BOZCV1Icm...`
- [x] Privy App ID: `cmlw43rri018p...`
- [x] Ankr API Key: `a57665476c76...`
- [x] Chainstack API: `sVndpOs8.XcikAEUu...`
- [x] The Graph API Key: `server_4bd29f3eac7a...`
- [x] Pinata API Key + JWT
- [x] Etherscan API Key: `ZYIC21I2J7Q9A64Z...`
- [x] LangSmith PAT + Service Key
- [x] CrewAI PAT: `pat_BKrEAmVX...`
- [x] Cloudflare API Token: `fqHKTVctMcj2_b6Bb...`
- [x] GitHub PAT: `[GITHUB_PAT_REDACTED]`

### Need to Verify Live:
- [ ] Test Groq API call
- [ ] Test Supabase connection
- [ ] Test Alchemy RPC call
- [ ] Test Pinata upload

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deploy:
- [x] npm run build → success
- [x] dist/ folder generated
- [ ] All VITE_ env vars ready for CF Pages
- [ ] wrangler.jsonc correct project name

### Deploy Steps:
1. [ ] `npx wrangler whoami` (verify auth)
2. [ ] `npx wrangler pages project create gani-hypha-web3`
3. [ ] `npx wrangler pages deploy dist --project-name gani-hypha-web3`
4. [ ] Set all env vars in CF Pages dashboard
5. [ ] Test production URL

### Post-Deploy:
- [ ] Verify all pages load
- [ ] Test GANI assistant (Groq)
- [ ] Test wallet connect
- [ ] Share production URL

---

*Todo GANI HYPHA v3.1 — Gyss! 😌🙏🏻*
