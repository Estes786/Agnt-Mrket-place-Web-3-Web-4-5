# 🏗️ ARCHITECTURE DOCUMENT
## GANI HYPHA — Full-Stack Web3/Web4/Web5 Architecture
### Version: 3.1 | Date: 2026-02-23

---

## 1. SYSTEM OVERVIEW — INVERSE PYRAMID ARCHITECTURE

```
╔══════════════════════════════════════════════════════════════════╗
║           GANI HYPHA — INVERSE PYRAMID ARCHITECTURE             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ▲ TOP: WEB5 LAYER (Future)                                     ║
║  ║  DWN (Decentralized Web Nodes)                               ║
║  ║  Sovereign AI Mesh Network                                   ║
║  ║  Cross-Chain Autonomous Agents                               ║
║  ║                                                              ║
║  ▼ MIDDLE: WEB4 LAYER (Current Development)                     ║
║  ║  ┌─────────────────────────────────────────────────────┐    ║
║  ║  │  FRONTEND (React 19 + TailwindCSS + Vite)           │    ║
║  ║  │  Marketplace | Dashboard | Architect | DeFi | DAO   │    ║
║  ║  └─────────────────────────────────────────────────────┘    ║
║  ║  ┌─────────────────────────────────────────────────────┐    ║
║  ║  │  AI ORCHESTRATION LAYER                             │    ║
║  ║  │  Groq (LLM) → LangChain → CrewAI → LangSmith       │    ║
║  ║  └─────────────────────────────────────────────────────┘    ║
║  ║  ┌─────────────────────────────────────────────────────┐    ║
║  ║  │  BACKEND (Hono + Cloudflare Workers Edge)            │    ║
║  ║  │  API Routes | Middleware | Auth | KV Cache          │    ║
║  ║  └─────────────────────────────────────────────────────┘    ║
║  ║                                                              ║
║  ▼ BOTTOM: WEB3 FOUNDATION LAYER                                ║
║     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       ║
║     │ Supabase │ │ Alchemy  │ │  Pinata  │ │The Graph │       ║
║     │ (DB+RLS) │ │  (RPC)   │ │ (IPFS)   │ │(Indexing)│       ║
║     └──────────┘ └──────────┘ └──────────┘ └──────────┘       ║
║     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       ║
║     │Web3Auth  │ │  Privy   │ │  Infura  │ │  Ankr    │       ║
║     │(MPC Auth)│ │ (Email)  │ │ (Backup) │ │(Fallback)│       ║
║     └──────────┘ └──────────┘ └──────────┘ └──────────┘       ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 2. FRONTEND ARCHITECTURE

### 2.1 Tech Stack
```
React 19.0.0
├── react-router-dom 7.1.3 (SPA routing)
├── recharts 2.15.0 (data visualization)
├── motion 12.0.0 (animations)
└── TailwindCSS 4.2.0 (styling)

Build: Vite 6.4.1
└── @vitejs/plugin-react 5.0.0
```

### 2.2 Component Architecture

```
src/
├── App.tsx                    # Root: State management + routing
├── main.tsx                   # Entry: BrowserRouter + React 19
├── renderer.tsx               # CF Pages adapter
├── types.ts                   # TypeScript interfaces (full Web3 types)
├── constants.ts               # Blueprints, Tokenomics, DeFi protocols
│
├── components/
│   ├── Header.tsx             # Wallet connection, HYPHA balance
│   ├── Sidebar.tsx            # Navigation (desktop)
│   ├── BottomNav.tsx          # Navigation (mobile)
│   ├── Marketplace.tsx        # Blueprint discovery + deployment
│   ├── Dashboard.tsx          # Pod monitoring + metrics
│   ├── ArchitectMode.tsx      # AI blueprint builder
│   ├── Tokenomics.tsx         # HYPHA token analytics
│   ├── DAppsHub.tsx           # DeFi protocols + swap
│   ├── DAOGovernance.tsx      # vHYPHA voting + proposals
│   ├── Web3Identity.tsx       # DID + wallets + credentials
│   ├── Web3Panel.tsx          # Stack overview
│   ├── MediaLab.tsx           # Content creation tools
│   ├── Roadmap.tsx            # Web3→Web5 roadmap
│   └── GaniAssistant.tsx      # AI chat widget
│
└── services/
    └── aiService.ts           # All API integrations
        ├── AIService (Groq)
        ├── SupabaseService
        ├── AlchemyService
        ├── PinataService
        ├── TheGraphService
        └── EtherscanService
```

### 2.3 State Management
- **React useState** untuk semua UI state
- **userStats** sebagai central state untuk:
  - HYPHA/USD/ETH balances
  - Wallet connection state
  - Staked amount + governance power
  - Transaction history
  - Liquidity positions
  - Yield strategies
- **deployedEcosystems** untuk pod management
- **blueprints** untuk marketplace data

---

## 3. BACKEND ARCHITECTURE

### 3.1 Cloudflare Workers (Edge)
```
Cloudflare Pages Build
├── dist/index.html              # React SPA entry
├── dist/assets/                 # Bundled JS/CSS
└── dist/_worker.js              # Hono API routes (if added)

Edge Network:
- 200+ PoPs globally
- <50ms latency worldwide
- Auto-scaling
- Free tier: 100K requests/day
```

### 3.2 Hono Framework (API Routes)
```typescript
// src/index.tsx (Cloudflare Workers Hono)
const app = new Hono()

// CORS middleware
app.use('/api/*', cors())

// API Routes
app.get('/api/blueprints', ...)        // Get all blueprints
app.post('/api/deploy', ...)           // Deploy pod
app.get('/api/metrics/:podId', ...)    // Get pod metrics
app.post('/api/ai/chat', ...)          // Proxy Groq API (secure)
app.post('/api/blockchain/tx', ...)    // Submit transaction
```

---

## 4. AI/LLM LAYER

### 4.1 Groq Integration
```
Model: llama-3.3-70b-versatile
Context Window: 128,000 tokens
Speed: ~847ms average (ultra-fast)
API: https://api.groq.com/openai/v1/chat/completions
Key: [VITE_GROQ_API_KEY — stored in CF Pages env vars]

Fallback Models:
- llama-3.1-8b-instant (faster, smaller)
- mixtral-8x7b-32768 (alternative)
- gemma2-9b-it (efficient)

Use Cases:
- GANI Assistant chat (3 contexts: onboarding/dashboard/architect)
- Talk-to-Pod (per blueprint context)
- Architect Mode (blueprint generation)
- Market Trends (JSON output)
```

### 4.2 LangChain Orchestration
```
Personal Access Token: [VITE_LANGSMITH_PAT — stored in CF Pages env vars]
Service Key: [VITE_LANGSMITH_SERVICE_KEY — stored in CF Pages env vars]

Workflow Types:
- Memory management (ConversationBufferMemory)
- Tool use (blockchain queries, web search)
- Agent orchestration (ReAct pattern)

LangSmith Monitoring:
- Trace all LLM calls
- Performance analytics
- Error tracking
```

### 4.3 CrewAI Multi-Agent
```
Platform API Key: [VITE_CREWAI_PAT — stored in CF Pages env vars]

Agent Roles:
- The Orchestrator (master coordinator)
- The Analyst (data analysis)
- The DeFi Wizard (DeFi strategies)
- The DAO Governor (governance)
- The Tokenomist (token economics)
- The Innovator (strategy generation)
- The Archivist (data storage/IPFS)
- The Gatekeeper (security/compliance)

Crew Workflows:
- Yield optimization crew
- Governance proposal crew
- Market analysis crew
```

---

## 5. WEB3 INFRASTRUCTURE

### 5.1 Blockchain RPC Providers

```
Primary: Alchemy
- ETH Mainnet: https://eth-mainnet.g.alchemy.com/v2/[ALCHEMY_API_KEY]
- App ID: 3ivgnraypsnorsdc
- Features: Enhanced APIs, Webhooks, NFT API, Trace API

Backup: Infura
- API Key: [INFURA_API_KEY]
- Gas API: https://gas.api.infura.io/v3/[INFURA_API_KEY]

Fallback: Ankr
- API Key: [ANKR_API_KEY]
- Multi-chain support (ETH, BSC, Polygon, Arbitrum, Avalanche)

Premium: Chainstack
- API: [CHAINSTACK_API]
```

### 5.2 Supported Chains
```
Ethereum Mainnet  (Chain ID: 1)     — Primary
Polygon PoS       (Chain ID: 137)   — Low fees
Arbitrum One      (Chain ID: 42161) — L2
Optimism          (Chain ID: 10)    — L2
Base              (Chain ID: 8453)  — Coinbase L2
Solana            (Devnet/Mainnet)  — High TPS
```

### 5.3 Identity & Auth

```
Web3Auth MPC (Social Login):
- Client ID: [WEB3AUTH_CLIENT_ID]
- Network: sapphire_devnet
- Providers: Google, Apple, GitHub, Discord, Twitter
- JWKS: https://api-auth.web3auth.io/.well-known/jwks.json

Privy (Email/Phone):
- App ID: [PRIVY_APP_ID]
- JWKS: https://auth.privy.io/api/v1/apps/[PRIVY_APP_ID]/jwks.json
- Features: Email, Phone, Passkeys, Social

W3C DID Protocol:
- DID:EThr (Ethereum-based)
- DID:Web (Domain-based)
- Verifiable Credentials (VC)
- Decentralized Web Nodes (DWN) — Web5
```

### 5.4 Storage & Indexing

```
IPFS / Pinata:
- API Key: [PINATA_API_KEY]
- JWT: [JWT_TOKEN_REDACTED]
- Regions: FRA1 (Frankfurt), NYC1 (New York)
- Gateway: https://gateway.pinata.cloud/ipfs/{CID}

The Graph (Subgraphs):
- API Key: [THE_GRAPH_API_KEY]
- Uniswap V3 Subgraph (Arbitrum)
- Aave V3 Subgraph
- Custom HYPHA subgraph (planned)

Etherscan:
- API Key: [ETHERSCAN_API_KEY]
- Transaction status
- Contract verification
```

---

## 6. DATABASE ARCHITECTURE (Supabase)

### 6.1 Connection
```
URL: https://[SUPABASE_URL]
Anon Key: [JWT_TOKEN_REDACTED]
Region: Auto (multi-region)

Features Used:
- PostgreSQL (primary database)
- Row Level Security (RLS) — user data isolation
- Real-time subscriptions
- REST API
- Edge Functions (planned)
```

### 6.2 Database Schema
```sql
-- Core Tables

CREATE TABLE blueprints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  description TEXT,
  tier TEXT CHECK (tier IN ('Free', 'Pro', 'Enterprise')),
  price TEXT,
  infrastructure TEXT,
  deployment_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  cognitive_specs JSONB,
  web3_integration JSONB,
  web4_features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deployments (
  id TEXT PRIMARY KEY,
  blueprint_id TEXT REFERENCES blueprints(id),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  status TEXT CHECK (status IN ('Active', 'Hibernating', 'Syncing', 'Sovereign')),
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  metrics JSONB,
  did_hash TEXT,
  blockchain_tx_hash TEXT
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT,
  amount NUMERIC,
  currency TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  tx_hash TEXT,
  chain TEXT,
  status TEXT
);

CREATE TABLE dao_proposals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  proposer TEXT,
  status TEXT,
  votes_for NUMERIC DEFAULT 0,
  votes_against NUMERIC DEFAULT 0,
  quorum NUMERIC,
  deadline TIMESTAMPTZ,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  hypha_balance NUMERIC DEFAULT 2500,
  staked_amount NUMERIC DEFAULT 0,
  governance_power NUMERIC DEFAULT 0,
  reputation_score NUMERIC DEFAULT 0,
  did_document TEXT,
  wallet_address TEXT,
  web3_auth_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own deployments" ON deployments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own transactions" ON transactions  
  FOR ALL USING (auth.uid() = user_id);
```

---

## 7. DEPLOYMENT ARCHITECTURE

### 7.1 Cloudflare Pages
```
Project Name: agent-marketplace-2
Production URL: https://agent-marketplace-2.pages.dev
Branch: main (production)

Build Config:
- Command: npm run build
- Output: dist/
- Node version: 18+

Environment Variables (CF Pages):
- VITE_GROQ_API_KEY
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_ALCHEMY_API_KEY
- VITE_PINATA_JWT
- VITE_WEB3AUTH_CLIENT_ID
- VITE_PRIVY_APP_ID
- VITE_THE_GRAPH_API_KEY
- (semua dari .dev.vars)
```

### 7.2 CI/CD Pipeline (GitHub)
```
Repository: https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5
Branch Strategy:
- main → Production
- develop → Staging
- feature/* → Preview deployments

Workflow:
1. git push → GitHub Actions
2. npm run build
3. wrangler pages deploy dist
4. CF Pages auto-preview per branch
```

---

## 8. SECURITY ARCHITECTURE

```
Layer 1: Cloudflare DDoS Protection
Layer 2: HTTPS-only (SSL/TLS)
Layer 3: Environment Variables (secrets never in code)
Layer 4: Supabase RLS (row-level data isolation)
Layer 5: JWT validation (Web3Auth, Privy)
Layer 6: Smart contract audits (before mainnet)
Layer 7: ZK Proofs (for privacy-sensitive operations)
```

---

*Architecture GANI HYPHA v3.1 — Gyss! 😌🙏🏻*
