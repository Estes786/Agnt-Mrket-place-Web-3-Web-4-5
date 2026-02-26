# 📋 SESSION #010 — SUPABASE DATABASE SETUP
## GANI HYPHA — Real Database Integration
### Status: ⏳ PENDING | Prerequisite: SESSION_009 DONE

---

## 🎯 TUJUAN SESSION INI

Setup semua Supabase tables agar backend API routes berfungsi penuh.

---

## ⚡ SETUP CEPAT

```bash
cd /home/user && git clone https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5.git webapp
cd /home/user/webapp && npm install
# Copy .dev.vars dari sessions/CREDENTIALS.md
npm run build && pm2 start ecosystem.config.cjs
```

---

## 📋 TODO LIST SESSION #010

### STEP 1: Buat Supabase Tables (Via SQL Editor)

1. Login ke https://app.supabase.com/project/drhitwkbkdnnepnnqbmo
2. Go to SQL Editor
3. Run script ini:

```sql
-- ========================================================
-- GANI HYPHA — Supabase Database Migration v1.0
-- Run this in Supabase SQL Editor
-- ========================================================

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  hypha_balance NUMERIC DEFAULT 0,
  premalta_balance NUMERIC DEFAULT 0,
  total_yield_earned NUMERIC DEFAULT 0,
  pods_deployed INTEGER DEFAULT 0,
  governance_power NUMERIC DEFAULT 0,
  tier TEXT DEFAULT 'Explorer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blueprints (Agent Pods)
CREATE TABLE IF NOT EXISTS blueprints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_hypha NUMERIC NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Starter', 'Growth', 'Enterprise', 'Whale')),
  industry TEXT NOT NULL,
  agents JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  monthly_yield_estimate NUMERIC DEFAULT 0,
  deployment_time TEXT DEFAULT '< 5 minutes',
  active_deployments INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 4.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Deployments
CREATE TABLE IF NOT EXISTS deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  blueprint_id TEXT NOT NULL REFERENCES blueprints(id),
  wallet_address TEXT NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped', 'pending')),
  current_yield NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  last_yield_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}'
);

-- 4. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deploy', 'yield', 'stake', 'unstake', 'swap', 'sca_payment', 'grant')),
  amount NUMERIC NOT NULL,
  token TEXT DEFAULT 'HYPHA',
  tx_hash TEXT,
  status TEXT DEFAULT 'confirmed',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DAO Proposals
CREATE TABLE IF NOT EXISTS dao_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposer TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'executed', 'pending')),
  votes_for NUMERIC DEFAULT 0,
  votes_against NUMERIC DEFAULT 0,
  quorum_required NUMERIC DEFAULT 1000000,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  execution_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DAO Votes
CREATE TABLE IF NOT EXISTS dao_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES dao_proposals(id),
  voter_address TEXT NOT NULL,
  vote_type TEXT CHECK (vote_type IN ('for', 'against', 'abstain')),
  voting_power NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, voter_address)
);

-- 7. SCA Analyses (NEW — for Sovereign Contract Analyst)
CREATE TABLE IF NOT EXISTS sca_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  wallet_address TEXT,
  contract_name TEXT,
  contract_type TEXT,
  risk_score INTEGER,
  risk_level TEXT,
  analysis_json JSONB,
  tokens_used INTEGER,
  tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Revenue Events
CREATE TABLE IF NOT EXISTS revenue_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  amount_usd NUMERIC NOT NULL,
  amount_local NUMERIC,
  currency TEXT DEFAULT 'USD',
  client_ref TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deployments_wallet ON deployments(wallet_address);
CREATE INDEX IF NOT EXISTS idx_deployments_blueprint ON deployments(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_dao_votes_proposal ON dao_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_sca_email ON sca_analyses(user_email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);

-- 10. Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sca_analyses ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies (allow all for now — tighten later)
CREATE POLICY "Public read blueprints" ON blueprints FOR SELECT USING (true);
CREATE POLICY "Public read proposals" ON dao_proposals FOR SELECT USING (true);
CREATE POLICY "Service role full access user_profiles" ON user_profiles USING (true);
CREATE POLICY "Service role full access deployments" ON deployments USING (true);
CREATE POLICY "Service role full access transactions" ON transactions USING (true);
CREATE POLICY "Service role full access dao_votes" ON dao_votes USING (true);
CREATE POLICY "Service role full access sca_analyses" ON sca_analyses USING (true);

-- 12. Seed initial blueprint data
INSERT INTO blueprints (id, name, description, price_hypha, tier, industry, monthly_yield_estimate, agents, features) VALUES
('real-estate-legacy', 'Real Estate Legacy Pod', 'AI agents untuk properti dan real estate management', 2500, 'Enterprise', 'Real Estate', 850, 
  '[{"name":"Property Analyst","role":"Orchestrator"},{"name":"Lease Manager","role":"Worker"},{"name":"Maintenance Coordinator","role":"Worker"}]',
  '["Market trend analysis","Lease tracking","Maintenance automation","Financial reporting"]'),
('defi-sovereign', 'DeFi Sovereign Pod', 'Automated DeFi yield optimization dengan AI', 1500, 'Growth', 'DeFi/Finance', 450,
  '[{"name":"Yield Scout","role":"Orchestrator"},{"name":"Risk Guardian","role":"Monitor"},{"name":"Rebalancer","role":"Worker"}]',
  '["Yield farming automation","Risk assessment","Portfolio rebalancing","24/7 monitoring"]'),
('content-creator', 'Content Creator Pod', 'AI content generation dan distribution automation', 500, 'Starter', 'Content/Media', 150,
  '[{"name":"Content Director","role":"Orchestrator"},{"name":"Writer Agent","role":"Worker"},{"name":"Publisher Agent","role":"Worker"}]',
  '["Blog post generation","Social media automation","SEO optimization","Multi-platform publishing"]'),
('ecommerce-empire', 'E-Commerce Empire Pod', 'Full automation untuk toko online', 3500, 'Whale', 'E-Commerce', 1200,
  '[{"name":"Commerce Director","role":"Orchestrator"},{"name":"Inventory Manager","role":"Worker"},{"name":"Customer Service AI","role":"Worker"}]',
  '["Inventory management","Customer service 24/7","Price optimization","Order automation"]');

-- 13. Seed sample DAO proposal
INSERT INTO dao_proposals (title, description, proposer, votes_for, votes_against) VALUES
('Add $100 USDC to PREMALTA Liquidity Pool', 
 'Proposal untuk menggunakan treasury funds untuk menambah likuiditas $PREMALTA di Uniswap V3 Base.', 
 '0xC0125651a46BDEea72a73A1C1A75b82e0E2C94c7',
 250000, 50000);

SELECT 'Migration completed successfully!' as status;
```

### STEP 2: Verify Tables (Via SQL)
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### STEP 3: Test API Endpoints
```bash
# Test blueprints
curl http://localhost:3000/api/blueprints

# Test DAO proposals  
curl http://localhost:3000/api/dao/proposals

# Test supabase health
curl http://localhost:3000/api/supabase/health
```

### STEP 4: Fix Backend Routes (if needed)
- Check `src/index.tsx` blueprint routes
- Ensure Supabase service key is used for insert operations
- Handle null/undefined gracefully

### STEP 5: Add SCA Table Routes
- Add `GET /api/sca/history?wallet=0x...`  
- Add logic di `/api/sca/analyze` untuk save ke `sca_analyses` table

---

## 📊 SUCCESS CRITERIA

```
✅ All 9 tables created in Supabase
✅ GET /api/blueprints → returns 4+ blueprints
✅ GET /api/dao/proposals → returns 1+ proposals  
✅ GET /api/supabase/health → returns "ready"
✅ SCA analysis saved to sca_analyses table
```

---

## 🔗 HANDOFF KE SESSION_011

Setelah selesai, konfirmasi:
- Semua tables ada ✅
- Data seed masuk ✅
- API endpoints working ✅

---

*Session #010 | GANI HYPHA | Planned*
