-- ============================================================
-- GANI HYPHA — Supabase Schema v5.1
-- Run this in Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/drhitwkbkdnnepnnqbmo/sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USER PROFILES TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- links to auth.users
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'founder', 'pro', 'user', 'guest')),
  wallet_address TEXT,
  hypha_balance NUMERIC DEFAULT 2500,
  staked_amount NUMERIC DEFAULT 0,
  usd_balance NUMERIC DEFAULT 0,
  eth_balance NUMERIC DEFAULT 0,
  total_yield NUMERIC DEFAULT 0,
  reputation_score NUMERIC DEFAULT 75,
  governance_power INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('enterprise', 'pro', 'free', 'founder')),
  is_verified BOOLEAN DEFAULT false,
  is_whale BOOLEAN DEFAULT false,
  did_document TEXT,
  ens_name TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  monthly_revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── MICRO SERVICES (Revenue Engine) ─────────────────────────
CREATE TABLE IF NOT EXISTS micro_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT CHECK (service_type IN ('api', 'saas', 'ai_pod', 'defi', 'nft', 'dao', 'rpc', 'data')),
  price_usd NUMERIC DEFAULT 0,
  price_hypha NUMERIC DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('hourly', 'daily', 'monthly', 'yearly', 'usage')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'draft', 'archived')),
  endpoint_url TEXT,
  api_key TEXT DEFAULT gen_random_uuid()::TEXT,
  total_revenue NUMERIC DEFAULT 0,
  total_calls BIGINT DEFAULT 0,
  subscribers_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUBSCRIPTIONS (User pays for services) ──────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES user_profiles(id),
  service_id UUID REFERENCES micro_services(id),
  amount_usd NUMERIC NOT NULL,
  amount_hypha NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  next_billing TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  usage_count BIGINT DEFAULT 0,
  last_used TIMESTAMPTZ
);

-- ── TRANSACTIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  type TEXT CHECK (type IN ('subscription', 'yield', 'stake', 'unstake', 'swap', 'nft_mint', 'service_payment', 'referral', 'airdrop')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'HYPHA',
  usd_value NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  tx_hash TEXT,
  chain TEXT DEFAULT 'Cloudflare',
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DEPLOYED PODS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deployed_pods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES user_profiles(id),
  blueprint_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'syncing' CHECK (status IN ('syncing', 'active', 'sovereign', 'paused', 'error')),
  tier TEXT DEFAULT 'free',
  yield_rate NUMERIC DEFAULT 0,
  autonomous_income NUMERIC DEFAULT 0,
  node_health INTEGER DEFAULT 0,
  did_hash TEXT,
  blockchain_tx TEXT,
  logs JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- ── REVENUE STREAMS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_type TEXT CHECK (stream_type IN ('saas', 'api', 'defi', 'token', 'nft', 'ai_pod', 'dao', 'dwn', 'rpc', 'referral')),
  layer TEXT CHECK (layer IN ('web2', 'web3', 'web4', 'web5')),
  monthly_revenue NUMERIC DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  growth_rate NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  contributors INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── DAO PROPOSALS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dao_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposer_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'governance',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'passed', 'rejected', 'executed')),
  votes_for NUMERIC DEFAULT 0,
  votes_against NUMERIC DEFAULT 0,
  quorum NUMERIC DEFAULT 10,
  treasury_amount NUMERIC DEFAULT 0,
  ends_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BUILD IN PUBLIC LOG ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS build_public_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES user_profiles(id),
  title TEXT NOT NULL,
  content TEXT,
  log_type TEXT DEFAULT 'update' CHECK (log_type IN ('milestone', 'update', 'launch', 'revenue', 'community', 'technical')),
  metrics JSONB DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── PLATFORM ANALYTICS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  total_pods INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  mrr NUMERIC DEFAULT 0,
  arr NUMERIC DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RBAC) ────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployed_pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE dao_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_public_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_streams ENABLE ROW LEVEL SECURITY;

-- User profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE auth_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Public profiles readable" ON user_profiles FOR SELECT USING (is_verified = true);

-- Micro services: owners manage, public can read active
CREATE POLICY "Owners can manage services" ON micro_services FOR ALL USING (
  owner_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid())
);
CREATE POLICY "Public can read active services" ON micro_services FOR SELECT USING (status = 'active');

-- Subscriptions: users see own
CREATE POLICY "Users see own subscriptions" ON subscriptions FOR SELECT USING (
  subscriber_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid())
);

-- Transactions: users see own
CREATE POLICY "Users see own transactions" ON transactions FOR SELECT USING (
  user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid())
);

-- Deployed pods: owners manage
CREATE POLICY "Owners manage pods" ON deployed_pods FOR ALL USING (
  owner_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid())
);

-- DAO: public readable
CREATE POLICY "Public can read proposals" ON dao_proposals FOR SELECT USING (true);
CREATE POLICY "Verified users can create proposals" ON dao_proposals FOR INSERT WITH CHECK (
  proposer_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid() AND is_verified = true)
);

-- Build in public: public readable
CREATE POLICY "Public logs readable" ON build_public_logs FOR SELECT USING (is_public = true);
CREATE POLICY "Authors manage logs" ON build_public_logs FOR ALL USING (
  author_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid())
);

-- Platform analytics: admins only
CREATE POLICY "Admins read analytics" ON platform_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE auth_id = auth.uid() AND role IN ('admin', 'founder'))
);

-- ── SEED DATA ────────────────────────────────────────────────
-- Revenue streams seed data
INSERT INTO revenue_streams (stream_type, layer, monthly_revenue, growth_rate, status, contributors) VALUES
  ('saas', 'web2', 0, 0, 'building', 0),
  ('api', 'web2', 0, 0, 'building', 0),
  ('defi', 'web3', 0, 0, 'building', 0),
  ('token', 'web3', 0, 0, 'building', 0),
  ('nft', 'web3', 0, 0, 'planned', 0),
  ('ai_pod', 'web4', 0, 0, 'building', 0),
  ('dao', 'web4', 0, 0, 'planned', 0),
  ('dwn', 'web5', 0, 0, 'planned', 0),
  ('rpc', 'web5', 0, 0, 'planned', 0)
ON CONFLICT DO NOTHING;

-- Build in public initial log
INSERT INTO build_public_logs (title, content, log_type, metrics, likes, views) VALUES
  ('🚀 GANI HYPHA Platform Launched!', 
   'Kami meluncurkan GANI HYPHA — Web2+Web3+Web4+Web5 Autonomous Economy Engine. Platform ini dirancang untuk generate income secara mandiri tanpa modal awal. Akar Dalam, Cabang Tinggi! Gyss!',
   'launch',
   '{"version": "5.1.0", "components": 23, "api_endpoints": 30}',
   0, 0)
ON CONFLICT DO NOTHING;

